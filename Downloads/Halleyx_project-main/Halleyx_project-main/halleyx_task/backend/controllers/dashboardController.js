const DashboardLayout = require('../models/DashboardLayout');

exports.getLayout = async (req, res) => {
  try {
    const layout = await DashboardLayout.findOne({ userId: req.user._id });
    res.json(layout || { layouts: { lg: [], md: [], sm: [] }, widgets: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveLayout = async (req, res) => {
  try {
    const { layouts, widgets } = req.body;
    const layout = await DashboardLayout.findOneAndUpdate(
      { userId: req.user._id },
      { layouts, widgets, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(layout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
