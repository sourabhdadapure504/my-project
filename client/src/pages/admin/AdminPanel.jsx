import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Shield, Search, BarChart2, AlertTriangle,
  Trash2, UserCheck, UserX, ChevronRight, Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-700 border border-white/10 rounded-lg p-3 text-xs font-mono">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

function StatCard({ icon: Icon, label, value, color = 'cyber' }) {
  const colors = {
    cyber: 'bg-cyber-600/20 text-cyber-400',
    red: 'bg-red-500/20 text-red-400',
    orange: 'bg-orange-500/20 text-orange-400',
    blue: 'bg-blue-500/20 text-blue-400',
  };
  return (
    <div className="card-hover p-5 rounded-xl">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-slate-400 mt-1">{label}</div>
    </div>
  );
}

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/users?limit=20'),
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data.stats);
      setRecentScans(statsRes.data.stats.recentScans || []);
      setUsers(usersRes.data.users);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleToggleActive = async (user) => {
    try {
      const { data } = await api.patch(`/admin/users/${user._id}`, { isActive: !user.isActive });
      setUsers(prev => prev.map(u => u._id === user._id ? data.user : u));
      toast.success(`User ${data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Delete this user and all their scans?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
  };

  const vulnData = stats ? [
    { name: 'Critical', value: stats.vulnerabilities?.critical || 0, color: '#ef4444' },
    { name: 'High', value: stats.vulnerabilities?.high || 0, color: '#f97316' },
    { name: 'Medium', value: stats.vulnerabilities?.medium || 0, color: '#eab308' },
    { name: 'Low', value: stats.vulnerabilities?.low || 0, color: '#3b82f6' },
  ] : [];

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" /> Admin Panel
          </h2>
          <p className="text-slate-500 text-sm mt-1">Platform management and analytics</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/5">
          {['overview', 'users', 'scans'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t ? 'border-cyber-500 text-cyber-400' : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} />
              <StatCard icon={Search} label="Total Scans" value={stats?.totalScans || 0} color="blue" />
              <StatCard icon={Shield} label="Avg Score" value={`${stats?.avgScore || 0}/100`} color="orange" />
              <StatCard icon={AlertTriangle} label="Critical Vulns" value={stats?.vulnerabilities?.critical || 0} color="red" />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card p-5 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-4">Vulnerability Distribution</h3>
                {vulnData.some(d => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={vulnData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {vulnData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-600 text-sm font-mono">No vulnerability data yet</div>
                )}
              </div>

              {/* Recent Scans */}
              <div className="card rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyber-400" /> Recent Scans (All Users)
                  </h3>
                </div>
                <div className="divide-y divide-white/3 max-h-56 overflow-y-auto">
                  {recentScans.map(scan => (
                    <div key={scan._id} className="px-5 py-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs text-white truncate">{scan.domain || scan.url}</p>
                        <p className="text-xs text-slate-600 font-mono">{scan.user?.email}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-xs font-bold text-cyber-400">{scan.grade}</p>
                        <p className="text-xs text-slate-600">{scan.securityScore}/100</p>
                      </div>
                    </div>
                  ))}
                  {recentScans.length === 0 && (
                    <div className="text-center py-8 text-slate-600 text-sm font-mono">No scans yet</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs font-mono text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">User</div>
              <div className="col-span-2 hidden md:block">Role</div>
              <div className="col-span-2 hidden md:block">Scans</div>
              <div className="col-span-2 hidden sm:block">Joined</div>
              <div className="col-span-4 md:col-span-2">Actions</div>
            </div>
            <div className="divide-y divide-white/3">
              {users.map((user, i) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-white/3 transition-colors"
                >
                  <div className="col-span-4">
                    <p className="text-sm text-white font-medium truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${
                      user.role === 'admin'
                        ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                        : 'bg-slate-500/10 border-slate-500/20 text-slate-400'
                    }`}>{user.role}</span>
                  </div>
                  <div className="col-span-2 hidden md:block text-sm text-slate-400 font-mono">{user.scanCount || 0}</div>
                  <div className="col-span-2 hidden sm:block text-xs text-slate-500 font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-8 md:col-span-2 flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(user)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                      className={`w-7 h-7 rounded-md border flex items-center justify-center transition-colors ${
                        user.isActive
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:bg-slate-500/20'
                      }`}
                    >
                      {user.isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 text-slate-600 text-sm font-mono">No users found</div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'scans' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs font-mono text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Target</div>
              <div className="col-span-3 hidden md:block">User</div>
              <div className="col-span-2">Score</div>
              <div className="col-span-4 md:col-span-2">Date</div>
            </div>
            <div className="divide-y divide-white/3">
              {recentScans.map((scan, i) => (
                <motion.div
                  key={scan._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-white/3 transition-colors"
                >
                  <div className="col-span-5 min-w-0">
                    <p className="text-sm text-white truncate">{scan.domain || scan.url}</p>
                    <p className="text-xs text-slate-600 font-mono truncate">{scan.url}</p>
                  </div>
                  <div className="col-span-3 hidden md:block">
                    <p className="text-xs text-slate-400 truncate">{scan.user?.name}</p>
                    <p className="text-xs text-slate-600 truncate">{scan.user?.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-cyber-400">{scan.grade}</p>
                    <p className="text-xs text-slate-500 font-mono">{scan.securityScore}/100</p>
                  </div>
                  <div className="col-span-5 md:col-span-2 text-xs text-slate-500 font-mono">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
              {recentScans.length === 0 && (
                <div className="text-center py-12 text-slate-600 text-sm font-mono">No scans found</div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
