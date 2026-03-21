const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', (req, res) => {
  const templates = [
    {
      id: 'sales',
      name: 'Sales Dashboard',
      description: 'Track revenue, orders and sales performance',
      icon: 'chart-bar',
      widgets: [
        { i: 'w1', x: 0, y: 0, w: 3, h: 2, type: 'kpi', config: { title: 'Total Revenue', metric: 'revenue', aggregation: 'sum', format: 'currency' }},
        { i: 'w2', x: 3, y: 0, w: 3, h: 2, type: 'kpi', config: { title: 'Total Orders', metric: 'orders', aggregation: 'count', format: 'number' }},
        { i: 'w3', x: 6, y: 0, w: 3, h: 2, type: 'kpi', config: { title: 'Completed', metric: 'completed', aggregation: 'count', format: 'number' }},
        { i: 'w4', x: 9, y: 0, w: 3, h: 2, type: 'kpi', config: { title: 'Pending', metric: 'pending', aggregation: 'count', format: 'number' }},
        { i: 'w5', x: 0, y: 2, w: 6, h: 4, type: 'bar', config: { title: 'Revenue by Product', dataSource: 'revenue-by-product' }},
        { i: 'w6', x: 6, y: 2, w: 6, h: 4, type: 'line', config: { title: 'Orders Over Time', dataSource: 'orders-over-time' }}
      ]
    },
    {
      id: 'orders',
      name: 'Order Performance',
      description: 'Monitor order status, volume and trends',
      icon: 'shopping-bag',
      widgets: [
        { i: 'w1', x: 0, y: 0, w: 4, h: 2, type: 'kpi', config: { title: 'Total Orders', metric: 'orders', aggregation: 'count', format: 'number' }},
        { i: 'w2', x: 4, y: 0, w: 4, h: 2, type: 'kpi', config: { title: 'Pending Orders', metric: 'pending', aggregation: 'count', format: 'number' }},
        { i: 'w3', x: 8, y: 0, w: 4, h: 2, type: 'kpi', config: { title: 'Completed Orders', metric: 'completed', aggregation: 'count', format: 'number' }},
        { i: 'w4', x: 0, y: 2, w: 5, h: 4, type: 'pie', config: { title: 'Status Distribution', dataSource: 'status-distribution' }},
        { i: 'w5', x: 5, y: 2, w: 7, h: 4, type: 'area', config: { title: 'Revenue Over Time', dataSource: 'revenue-over-time' }}
      ]
    },
    {
      id: 'product',
      name: 'Product Analytics',
      description: 'Analyze product performance and sales mix',
      icon: 'cube',
      widgets: [
        { i: 'w1', x: 0, y: 0, w: 6, h: 4, type: 'bar', config: { title: 'Revenue by Product', dataSource: 'revenue-by-product' }},
        { i: 'w2', x: 6, y: 0, w: 6, h: 4, type: 'pie', config: { title: 'Orders by Product', dataSource: 'revenue-by-product' }},
        { i: 'w3', x: 0, y: 4, w: 12, h: 4, type: 'line', config: { title: 'Revenue Trend', dataSource: 'revenue-over-time' }}
      ]
    }
  ];
  res.json(templates);
});
module.exports = router;
