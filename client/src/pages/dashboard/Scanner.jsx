import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Search, Globe, Zap, Lock, Eye, Terminal,
  AlertTriangle, CheckCircle, Loader, ArrowRight
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const checks = [
  { id: 'ssl', icon: Lock, label: 'SSL/TLS Analysis', desc: 'Checking certificate validity & cipher strength' },
  { id: 'headers', icon: Shield, label: 'Security Headers', desc: 'Auditing CSP, HSTS, X-Frame-Options...' },
  { id: 'sqli', icon: Terminal, label: 'SQL Injection', desc: 'Testing input vectors for injection flaws' },
  { id: 'xss', icon: Eye, label: 'XSS Detection', desc: 'Scanning for cross-site scripting vulnerabilities' },
  { id: 'csrf', icon: AlertTriangle, label: 'CSRF Analysis', desc: 'Verifying cross-site request forgery protections' },
  { id: 'ports', icon: Globe, label: 'Port Scan', desc: 'Identifying exposed services and open ports' },
];

export default function Scanner() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [activeChecks, setActiveChecks] = useState([]);
  const [completedChecks, setCompletedChecks] = useState([]);
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setScanning(true);
    setActiveChecks([]);
    setCompletedChecks([]);

    // Simulate progressive checks
    const simulateProgress = async () => {
      for (let i = 0; i < checks.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        setActiveChecks(prev => [...prev, checks[i].id]);
        await new Promise(r => setTimeout(r, 300));
        setCompletedChecks(prev => [...prev, checks[i].id]);
      }
    };

    try {
      const [, result] = await Promise.all([
        simulateProgress(),
        api.post('/scans', { url: url.trim() })
      ]);

      toast.success('Scan complete!');
      navigate(`/scan/${result.data.scan._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Scan failed. Is the backend running?');
      setScanning(false);
      setActiveChecks([]);
      setCompletedChecks([]);
    }
  };

  const popularTargets = [
    'https://example.com',
    'https://github.com',
    'https://httpbin.org',
  ];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-4"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyber-600/20 border border-cyber-500/30 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-cyber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Security Scanner</h2>
          <p className="text-slate-400">Enter a URL to run a comprehensive security analysis</p>
        </motion.div>

        {/* Scanner Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card neon-border p-6 rounded-2xl"
        >
          <form onSubmit={handleScan}>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  className="input-field pl-10 h-12"
                  placeholder="https://example.com"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  disabled={scanning}
                />
              </div>
              <button
                type="submit"
                disabled={scanning || !url.trim()}
                className="btn-primary flex items-center gap-2 px-6 h-12 whitespace-nowrap"
              >
                {scanning ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Scan Now
                  </>
                )}
              </button>
            </div>

            {/* Quick fill */}
            {!scanning && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs text-slate-600">Try:</span>
                {popularTargets.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setUrl(t)}
                    className="text-xs text-slate-500 hover:text-cyber-400 font-mono transition-colors"
                  >
                    {t.replace('https://', '')}
                  </button>
                ))}
              </div>
            )}
          </form>
        </motion.div>

        {/* Scanning Progress */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-cyber-600/20 border border-cyber-500/40 flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-cyber-400 border-t-transparent rounded-full animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Scanning in progress...</p>
                  <p className="text-xs text-slate-500 font-mono">{url}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-dark-600 rounded-full mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-600 to-cyan-500 rounded-full"
                  animate={{ width: `${(completedChecks.length / checks.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="grid gap-3">
                {checks.map(({ id, icon: Icon, label, desc }) => {
                  const isActive = activeChecks.includes(id);
                  const isDone = completedChecks.includes(id);
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: isActive || isDone ? 1 : 0.35 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-dark-700/40"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDone ? 'bg-emerald-500/20' : isActive ? 'bg-cyber-600/20' : 'bg-dark-600'
                      }`}>
                        {isDone
                          ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                          : isActive
                          ? <Loader className="w-4 h-4 text-cyber-400 animate-spin" />
                          : <Icon className="w-4 h-4 text-slate-600" />
                        }
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDone ? 'text-white' : isActive ? 'text-cyber-400' : 'text-slate-600'}`}>
                          {label}
                        </p>
                        {isActive && !isDone && (
                          <p className="text-xs text-slate-500">{desc}</p>
                        )}
                        {isDone && <p className="text-xs text-emerald-500">Complete</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature grid when not scanning */}
        {!scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {checks.map(({ id, icon: Icon, label, desc }) => (
              <div key={id} className="card p-4 rounded-xl">
                <Icon className="w-5 h-5 text-cyber-400 mb-3" />
                <p className="text-sm font-medium text-white mb-1">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
