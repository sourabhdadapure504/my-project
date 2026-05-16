import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, Search, Shield, ExternalLink, Trash2, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const gradeColor = (g) => {
  const m = { 'A+': 'text-emerald-400', A: 'text-green-400', B: 'text-cyan-400', C: 'text-yellow-400', D: 'text-orange-400', F: 'text-red-400' };
  return m[g] || 'text-slate-400';
};

const scoreBar = (score) => {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-yellow-500' : score >= 40 ? 'bg-orange-500' : 'bg-red-500';
  return (
    <div className="w-16 h-1.5 bg-dark-600 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
    </div>
  );
};

export default function HistoryPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchScans = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/scans?page=${p}&limit=10`);
      setScans(data.scans);
      setPagination(data.pagination);
    } catch (e) {
      toast.error('Failed to load scans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchScans(page); }, [page]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/scans/${id}`);
      setScans(prev => prev.filter(s => s._id !== id));
      toast.success('Scan deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = scans.filter(s =>
    !search || (s.domain || s.url)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-cyber-400" /> Scan History
            </h2>
            <p className="text-slate-500 text-sm mt-1">{pagination.total || 0} total scans</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by domain..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 w-56"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="card rounded-xl overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <History className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {search ? 'No scans match your search.' : 'No scans yet. Run your first scan!'}
              </p>
              {!search && (
                <Link to="/scanner" className="btn-primary text-sm py-2 px-5 inline-flex items-center gap-2 mt-4">
                  Start Scanning
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs font-mono text-slate-500 uppercase tracking-wider">
                <div className="col-span-5">Target</div>
                <div className="col-span-2 hidden md:block">Score</div>
                <div className="col-span-2 hidden md:block">Grade</div>
                <div className="col-span-2 hidden sm:block">Date</div>
                <div className="col-span-3 md:col-span-1">Actions</div>
              </div>

              <div className="divide-y divide-white/3">
                {filtered.map((scan, i) => (
                  <motion.div
                    key={scan._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-white/3 transition-colors group"
                  >
                    {/* Target */}
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{scan.domain || scan.url}</p>
                        <p className="text-xs text-slate-600 font-mono truncate">{scan.url}</p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="col-span-2 hidden md:flex flex-col gap-1">
                      <span className="text-sm font-mono text-slate-300">{scan.securityScore}/100</span>
                      {scoreBar(scan.securityScore)}
                    </div>

                    {/* Grade */}
                    <div className="col-span-2 hidden md:block">
                      <span className={`font-display font-bold text-lg ${gradeColor(scan.grade)}`}>
                        {scan.grade}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 hidden sm:block">
                      <p className="text-xs text-slate-400">{new Date(scan.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-600 font-mono">{new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-7 md:col-span-1 flex items-center gap-2 justify-end">
                      <Link to={`/scan/${scan._id}`}
                        className="w-7 h-7 rounded-md bg-cyber-600/20 border border-cyber-500/30 flex items-center justify-center text-cyber-400 hover:bg-cyber-600/30 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleDelete(scan._id)}
                        disabled={deleting === scan._id}
                        className="w-7 h-7 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        {deleting === scan._id
                          ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="w-3 h-3" />
                        }
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                  <p className="text-xs text-slate-500 font-mono">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 1}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= pagination.pages}
                      className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
