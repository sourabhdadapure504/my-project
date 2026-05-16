import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, CheckCircle, XCircle, Info,
  ArrowLeft, Download, Lock, Globe, Eye, Terminal,
  Zap, ChevronDown, ChevronUp, Lightbulb, Clock
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { generatePDF } from '../../utils/pdfGenerator';

const severityConfig = {
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500' },
  low: { label: 'Low', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500' },
  info: { label: 'Info', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: 'bg-slate-500' },
};

const checkIcon = (status) => {
  if (status === 'safe') return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  return <XCircle className="w-4 h-4 text-red-400" />;
};

const gradeColor = (g) => {
  const m = { 'A+': '#10b981', A: '#22c55e', B: '#06b6d4', C: '#eab308', D: '#f97316', F: '#ef4444' };
  return m[g] || '#94a3b8';
};

function VulnCard({ vuln }) {
  const [open, setOpen] = useState(false);
  const cfg = severityConfig[vuln.severity] || severityConfig.info;
  return (
    <motion.div
      layout
      className={`border rounded-xl overflow-hidden ${cfg.border} ${cfg.bg}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <div>
            <p className="text-sm font-medium text-white">{vuln.title}</p>
            <p className="text-xs text-slate-500">{vuln.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-mono px-2 py-0.5 rounded border ${cfg.color} ${cfg.border} ${cfg.bg}`}>
            {cfg.label}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3"
        >
          <div>
            <p className="text-xs text-slate-500 uppercase font-mono mb-1">Description</p>
            <p className="text-sm text-slate-300">{vuln.description}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-mono mb-1">Recommendation</p>
            <p className="text-sm text-emerald-400">{vuln.recommendation}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ScanResult() {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get(`/scans/${id}`)
      .then(r => setScan(r.data.scan))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!scan) return (
    <DashboardLayout>
      <div className="text-center py-20">
        <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <p className="text-slate-400">Scan not found.</p>
        <Link to="/history" className="text-cyber-400 hover:underline text-sm mt-2 inline-block">← Back to history</Link>
      </div>
    </DashboardLayout>
  );

  const gaugeData = [{ value: scan.securityScore, fill: gradeColor(scan.grade) }];
  const filteredVulns = filter === 'all' ? scan.vulnerabilities : scan.vulnerabilities.filter(v => v.severity === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Back + actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Link to="/history" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to History
          </Link>
          <button
            onClick={() => generatePDF(scan)}
            className="btn-ghost flex items-center gap-2 text-sm py-2 px-4"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* Score hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card neon-border p-6 rounded-2xl"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Radial gauge */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="100%"
                  data={gaugeData} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#1e293b' }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-black" style={{ color: gradeColor(scan.grade) }}>
                  {scan.grade}
                </span>
                <span className="text-sm font-mono text-slate-400">{scan.securityScore}/100</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-white mb-1">{scan.domain || scan.url}</h2>
              <p className="text-slate-500 text-sm font-mono mb-4">{scan.url}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {Object.entries(scan.summary || {}).map(([sev, count]) => {
                  if (!count) return null;
                  const cfg = severityConfig[sev];
                  return (
                    <div key={sev} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${cfg.bg} ${cfg.border}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      <span className={cfg.color}>{count} {cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meta */}
            <div className="text-center flex-shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono justify-center mb-1">
                <Clock className="w-3 h-3" />
                {new Date(scan.createdAt).toLocaleString()}
              </div>
              <div className="text-xs text-slate-600 font-mono">
                Duration: {((scan.duration || 2000) / 1000).toFixed(1)}s
              </div>
            </div>
          </div>
        </motion.div>

        {/* Check Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {Object.entries(scan.checks || {}).map(([key, val]) => (
            <div key={key} className="card p-4 rounded-xl flex items-start gap-3">
              {checkIcon(val.status)}
              <div>
                <p className="text-xs font-semibold text-white uppercase font-mono">{key}</p>
                <p className="text-xs text-slate-500 mt-0.5">{val.details}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Vulnerabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-wrap gap-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-cyber-400" />
              Vulnerabilities ({filteredVulns.length})
            </h3>
            <div className="flex gap-1.5 flex-wrap">
              {['all', 'critical', 'high', 'medium', 'low', 'info'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors capitalize font-mono ${
                    filter === f ? 'bg-cyber-600/30 text-cyber-400 border border-cyber-500/30' : 'text-slate-500 hover:text-slate-300 border border-transparent'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 space-y-3">
            {filteredVulns.length > 0
              ? filteredVulns.map((v, i) => <VulnCard key={i} vuln={v} />)
              : <p className="text-slate-500 text-sm text-center py-8 font-mono">No {filter} vulnerabilities found.</p>
            }
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card rounded-xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              AI Security Recommendations
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {(scan.recommendations || []).map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-start gap-3 p-3 bg-cyber-900/20 border border-cyber-700/20 rounded-lg"
              >
                <div className="w-6 h-6 rounded-full bg-cyber-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-cyber-400 font-bold font-mono">{i + 1}</span>
                </div>
                <p className="text-sm text-slate-300">{rec}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
