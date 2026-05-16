import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield, Search, AlertTriangle, TrendingUp, Clock, ExternalLink,
  Activity, ChevronRight, Zap, Target
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } })
};

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

const gradeColor = (grade) => {
  const map = { 'A+': '#10b981', A: '#22c55e', B: '#06b6d4', C: '#eab308', D: '#f97316', F: '#ef4444' };
  return map[grade] || '#94a3b8';
};

function StatCard({ icon: Icon, label, value, sub, color = 'cyber', index }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={index}
      className="card-hover p-5 rounded-xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          color === 'cyber' ? 'bg-cyber-600/20 text-cyber-400' :
          color === 'red' ? 'bg-red-500/20 text-red-400' :
          color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-400">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-1 font-mono">{sub}</div>}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-700 border border-white/10 rounded-lg p-3 text-xs font-mono">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? Math.round(p.value) : p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/scans/stats')
      .then(r => setStats(r.data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats ? [
    { name: 'Critical', value: stats.vulnerabilityTotals.critical || 0, color: '#ef4444' },
    { name: 'High', value: stats.vulnerabilityTotals.high || 0, color: '#f97316' },
    { name: 'Medium', value: stats.vulnerabilityTotals.medium || 0, color: '#eab308' },
    { name: 'Low', value: stats.vulnerabilityTotals.low || 0, color: '#3b82f6' },
  ].filter(d => d.value > 0) : [];

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const trendData = stats?.monthlyScans?.map(m => ({
    month: monthNames[m._id.month - 1],
    scans: m.count,
    score: Math.round(m.avgScore || 0)
  })) || [];

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-mono text-sm">Loading dashboard...</p>
        </div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h2 className="text-xl font-bold text-white">
              Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {stats?.totalScans ? `${stats.totalScans} scans completed. Keep securing.` : 'Ready for your first scan.'}
            </p>
          </div>
          <Link to="/scanner" className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5">
            <Zap className="w-4 h-4" />
            New Scan
          </Link>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Search} label="Total Scans" value={stats?.totalScans ?? 0} sub="all time" index={0} />
          <StatCard icon={Shield} label="Avg Score" value={stats?.totalScans ? `${stats.avgScore}/100` : '—'}
            sub="security score" color={stats?.avgScore >= 70 ? 'cyber' : 'orange'} index={1} />
          <StatCard icon={AlertTriangle} label="Critical Issues"
            value={stats?.vulnerabilityTotals?.critical ?? 0} color="red" sub="need attention" index={2} />
          <StatCard icon={TrendingUp} label="High Risks"
            value={stats?.vulnerabilityTotals?.high ?? 0} color="orange" sub="require fixing" index={3} />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="card p-5 rounded-xl lg:col-span-2"
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-400" />
              Scan Activity & Score Trend
            </h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="scans" name="Scans" stroke="#14b8a6" fill="url(#scanGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="score" name="Score" stroke="#06b6d4" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-600 text-sm font-mono">
                No scan data yet. Run your first scan →
              </div>
            )}
          </motion.div>

          {/* Pie chart */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}
            className="card p-5 rounded-xl"
          >
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyber-400" />
              Vulnerability Breakdown
            </h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60}
                      dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-slate-400">{d.name}</span>
                      </div>
                      <span className="font-mono text-slate-300">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-600 text-sm font-mono text-center">
                Run scans to see<br />vulnerability data
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Scans */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}
          className="card rounded-xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyber-400" />
              Recent Scans
            </h3>
            <Link to="/history" className="text-xs text-cyber-400 hover:text-cyber-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {stats?.recentScans?.length > 0 ? (
            <div className="divide-y divide-white/5">
              {stats.recentScans.map(scan => (
                <Link key={scan._id} to={`/scan/${scan._id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-dark-600 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{scan.domain || scan.url}</p>
                      <p className="text-xs text-slate-500 font-mono">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-bold" style={{ color: gradeColor(scan.grade) }}>{scan.grade}</div>
                      <div className="text-xs text-slate-500 font-mono">{scan.securityScore}/100</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyber-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <Search className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm mb-4">No scans yet</p>
              <Link to="/scanner" className="btn-primary text-sm py-2 px-5 inline-flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Run First Scan
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
