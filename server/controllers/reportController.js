const Scan = require('../models/Scan');

exports.getScanReport = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user.id })
      .populate('user', 'name email');

    if (!scan) return res.status(404).json({ error: 'Scan not found' });

    res.json({ success: true, scan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
