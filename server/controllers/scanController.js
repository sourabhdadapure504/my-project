const Scan = require('../models/Scan');
const User = require('../models/User');
const { simulateScan } = require('../utils/scanEngine');

exports.createScan = async (req, res) => {
  try {
    let { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Normalize URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Create scan record
    const scan = await Scan.create({
      user: req.user.id,
      url,
      status: 'running'
    });

    // Run scan engine
    const results = await simulateScan(url);

    // Simulate scan time delay
    await new Promise(r => setTimeout(r, 2000));

    // Update scan with results
    scan.status = 'completed';
    scan.domain = results.domain;
    scan.securityScore = results.securityScore;
    scan.grade = results.grade;
    scan.vulnerabilities = results.vulnerabilities;
    scan.summary = results.summary;
    scan.checks = results.checks;
    scan.recommendations = results.recommendations;
    scan.duration = results.duration;
    await scan.save();

    // Update user scan count
    await User.findByIdAndUpdate(req.user.id, { $inc: { scanCount: 1 } });

    res.status(201).json({ success: true, scan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const scans = await Scan.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-vulnerabilities -checks -recommendations');

    const total = await Scan.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      scans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getScan = async (req, res) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, user: req.user.id });

    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    res.json({ success: true, scan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    res.json({ success: true, message: 'Scan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalScans = await Scan.countDocuments({ user: userId });
    const recentScans = await Scan.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('url domain securityScore grade status createdAt summary');

    const allScans = await Scan.find({ user: userId }).select('summary securityScore');

    const vulnerabilityTotals = allScans.reduce((acc, scan) => {
      if (scan.summary) {
        acc.critical += scan.summary.critical || 0;
        acc.high += scan.summary.high || 0;
        acc.medium += scan.summary.medium || 0;
        acc.low += scan.summary.low || 0;
      }
      return acc;
    }, { critical: 0, high: 0, medium: 0, low: 0 });

    const avgScore = allScans.length
      ? Math.round(allScans.reduce((s, sc) => s + sc.securityScore, 0) / allScans.length)
      : 0;

    // Monthly scan trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyScans = await Scan.aggregate([
      { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId.toString()), createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 }, avgScore: { $avg: '$securityScore' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalScans,
        avgScore,
        vulnerabilityTotals,
        recentScans,
        monthlyScans
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
