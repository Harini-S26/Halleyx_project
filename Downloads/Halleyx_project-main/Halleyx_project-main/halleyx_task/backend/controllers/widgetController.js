const Order = require('../models/Order');

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = Date.now();
    const last7 = new Date(now - 7*24*60*60*1000);
    const prev7 = new Date(now - 14*24*60*60*1000);

    const [allOrders, recent7, prev7orders] = await Promise.all([
      Order.find({ userId }),
      Order.find({ userId, createdAt: { $gte: last7 } }),
      Order.find({ userId, createdAt: { $gte: prev7, $lt: last7 } })
    ]);

    const totalRevenue = allOrders.reduce((s, o) => s + o.totalAmount, 0);
    const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
    const completedOrders = allOrders.filter(o => o.status === 'Completed').length;

    const productCounts = {};
    allOrders.forEach(o => { productCounts[o.product] = (productCounts[o.product] || 0) + 1; });
    const topProduct = Object.entries(productCounts).sort((a,b)=>b[1]-a[1])[0];

    const orderGrowth = prev7orders.length > 0
      ? Math.round(((recent7.length - prev7orders.length) / prev7orders.length) * 100)
      : recent7.length > 0 ? 100 : 0;

    const insights = [
      { icon: 'trending', text: `Orders ${orderGrowth >= 0 ? 'increased' : 'decreased'} by ${Math.abs(orderGrowth)}% in the last 7 days`, type: orderGrowth >= 0 ? 'positive' : 'negative' },
      topProduct ? { icon: 'star', text: `Most ordered product: ${topProduct[0]}`, type: 'info' } : null,
      { icon: 'clock', text: `${pendingOrders} pending orders require attention`, type: pendingOrders > 5 ? 'warning' : 'info' },
      { icon: 'check', text: `${completedOrders} orders completed successfully`, type: 'positive' },
      { icon: 'dollar', text: `Total revenue: $${totalRevenue.toLocaleString()}`, type: 'info' }
    ].filter(Boolean);

    res.json({ insights, stats: { total: allOrders.length, revenue: totalRevenue, pending: pendingOrders, completed: completedOrders } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    const recs = [];
    if (orders.length > 5) recs.push({ type: 'bar', title: 'Revenue by Product', reason: 'You have enough product data to visualize revenue distribution' });
    if (orders.length > 3) recs.push({ type: 'line', title: 'Orders Over Time', reason: 'Track your order volume trends' });
    if (orders.length > 0) recs.push({ type: 'pie', title: 'Order Status Distribution', reason: 'See breakdown of pending vs completed orders' });
    recs.push({ type: 'kpi', title: 'Total Revenue KPI', reason: 'Quick overview of total revenue' });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper: get field value from order for a given axis label
function getFieldValue(order, field) {
  const map = {
    'Product': order.product,
    'Quantity': order.quantity,
    'Unit price': order.unitPrice,
    'Unit Price': order.unitPrice,
    'Total amount': order.totalAmount,
    'Total Amount': order.totalAmount,
    'Status': order.status,
    'Created by': order.createdBy,
    'Created By': order.createdBy,
    'Duration': order.orderDate
      ? new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  };
  return map[field] !== undefined ? map[field] : null;
}

exports.getChartData = async (req, res) => {
  try {
    const { type, dateFilter, xAxis, yAxis, chartData: pieField } = req.query;
    const userId = req.user._id;
    let query = { userId };
    const now = Date.now();
    if (dateFilter === 'today') query.createdAt = { $gte: new Date(new Date().setHours(0,0,0,0)) };
    else if (dateFilter === '7days') query.createdAt = { $gte: new Date(now - 7*24*60*60*1000) };
    else if (dateFilter === '30days') query.createdAt = { $gte: new Date(now - 30*24*60*60*1000) };
    else if (dateFilter === '90days') query.createdAt = { $gte: new Date(now - 90*24*60*60*1000) };

    const orders = await Order.find(query);

    // No orders — always return empty
    if (!orders.length) return res.json([]);

    // Revenue by product (special widget type)
    if (type === 'revenue-by-product') {
      const data = {};
      orders.forEach(o => { data[o.product] = (data[o.product] || 0) + o.totalAmount; });
      return res.json(Object.entries(data).map(([name, value]) => ({ name: name.replace(' Mbps','').replace(' Plan',''), value })));
    }

    // Dynamic axis-based chart (bar, line, area, scatter)
    if (xAxis && yAxis) {
      const xField = xAxis;
      const yField = yAxis;
      const grouped = {};
      orders.forEach(o => {
        const xVal = getFieldValue(o, xField);
        const yVal = getFieldValue(o, yField);
        const xKey = xVal !== null ? String(xVal) : 'Unknown';
        const numY = typeof yVal === 'number' ? yVal : 1;
        if (!grouped[xKey]) grouped[xKey] = { name: xKey, value: 0, count: 0 };
        grouped[xKey].value += numY;
        grouped[xKey].count += 1;
      });
      return res.json(Object.values(grouped).map(g => ({ name: g.name, value: Number(g.value.toFixed(2)) })));
    }

    // Pie chart — dynamic field grouping
    if (type === 'pie') {
      const field = pieField || 'Status';
      const grouped = {};
      orders.forEach(o => {
        const val = String(getFieldValue(o, field) ?? 'Other');
        grouped[val] = (grouped[val] || 0) + 1;
      });
      return res.json(Object.entries(grouped).map(([name, value]) => ({ name, value })));
    }

    // Legacy fallbacks
    if (type === 'orders-over-time') {
      const data = {};
      orders.forEach(o => {
        const d = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        data[d] = (data[d] || 0) + 1;
      });
      return res.json(Object.entries(data).map(([name, value]) => ({ name, value })));
    }
    if (type === 'status-distribution') {
      const data = { Pending: 0, 'In Progress': 0, Completed: 0 };
      orders.forEach(o => { if (data[o.status] !== undefined) data[o.status]++; });
      return res.json(Object.entries(data).map(([name, value]) => ({ name, value })));
    }
    if (type === 'revenue-over-time') {
      const data = {};
      orders.forEach(o => {
        const d = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        data[d] = (data[d] || 0) + o.totalAmount;
      });
      return res.json(Object.entries(data).map(([name, value]) => ({ name, value })));
    }

    res.json([]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
