const mongoose = require('mongoose');
const widgetSchema = new mongoose.Schema({
  i: String, x: Number, y: Number, w: Number, h: Number,
  type: String, config: mongoose.Schema.Types.Mixed
}, { _id: false });
const dashboardLayoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  layouts: { lg: [widgetSchema], md: [widgetSchema], sm: [widgetSchema] },
  widgets: [{ type: mongoose.Schema.Types.Mixed }],
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('DashboardLayout', dashboardLayoutSchema);
