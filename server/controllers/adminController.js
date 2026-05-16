const User = require('../models/User');
const Scan = require('../models/Scan');
const mongoose = require('mongoose');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScans = await Scan.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const recentScans = await Scan.find().sort({ createdAt: -1 }).limit(10)
      .populate('user', 'name email').select('url domain securityScore grade status createdAt');

    const vulnAgg = await Scan.aggregate([
      { $group: {
        _id: null,
        critical: { $sum: '$summary.critical' },
        high: { $sum: '$summary.high' },
        medium: { $sum: '$summary.medium' },
        low: { $sum: '$summary.low' }
      }}
    ]);

    const avgScore = await Scan.aggregate([
      { $group: { _id: null, avg: { $avg: '$securityScore' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalScans,
        activeUsers,
        avgScore: avgScore[0] ? Math.round(avgScore[0].avg) : 0,
        vulnerabilities: vulnAgg[0] || { critical: 0, high: 0, medium: 0, low: 0 },
        recentScans
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({ success: true, users, pagination: { page, limit, total } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    await Scan.deleteMany({ user: req.params.id });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllScans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const scans = await Scan.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .select('-vulnerabilities -recommendations');

    const total = await Scan.countDocuments();
    res.json({ success: true, scans, pagination: { page, limit, total } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
