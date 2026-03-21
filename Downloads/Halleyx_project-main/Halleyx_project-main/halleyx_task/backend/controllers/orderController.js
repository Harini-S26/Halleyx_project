const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
  try {
    const { dateFilter } = req.query;
    let query = { userId: req.user._id };
    const now = new Date();
    if (dateFilter === 'today') {
      query.createdAt = { $gte: new Date(now.setHours(0,0,0,0)) };
    } else if (dateFilter === '7days') {
      query.createdAt = { $gte: new Date(Date.now() - 7*24*60*60*1000) };
    } else if (dateFilter === '30days') {
      query.createdAt = { $gte: new Date(Date.now() - 30*24*60*60*1000) };
    } else if (dateFilter === '90days') {
      query.createdAt = { $gte: new Date(Date.now() - 90*24*60*60*1000) };
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user._id };
    data.totalAmount = data.quantity * data.unitPrice;
    if (data.orderDate) data.orderDate = new Date(data.orderDate);
    else data.orderDate = new Date();
    const order = await Order.create(data);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
