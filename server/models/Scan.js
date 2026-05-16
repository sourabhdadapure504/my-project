const mongoose = require('mongoose');

const vulnerabilitySchema = new mongoose.Schema({
  type: String,
  severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'] },
  title: String,
  description: String,
  recommendation: String,
  status: { type: String, enum: ['vulnerable', 'warning', 'safe'] }
});

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true
  },
  domain: String,
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending'
  },
  securityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B', 'C', 'D', 'F'],
    default: 'F'
  },
  vulnerabilities: [vulnerabilitySchema],
  summary: {
    critical: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
    info: { type: Number, default: 0 }
  },
  checks: {
    ssl: { status: String, details: String },
    headers: { status: String, details: String },
    ports: { status: String, details: String },
    sqli: { status: String, details: String },
    xss: { status: String, details: String },
    csrf: { status: String, details: String }
  },
  recommendations: [String],
  duration: Number, // scan duration in ms
  scanDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Scan', scanSchema);
