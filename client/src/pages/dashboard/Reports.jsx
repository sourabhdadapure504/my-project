import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Shield, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { generatePDF } from '../../utils/pdfGenerator';
import toast from 'react-hot-toast';

const gradeColor = (g) => {
  const m = { 'A+': 'text-emerald-400', A: 'text-green-400', B: 'text-cyan-400', C: 'text-yellow-400', D: 'text-orange-400', F: 'text-red-400' };
  return m[g] || 'text-slate-400';
};

export default function Reports() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/scans?limit=50')
      .then(r => setScans(r.data.scans))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (scanId) => {
    try {
      const { data } = await api.get(`/reports/${scanId}`);
      generatePDF(data.scan);
      toast.success('Report downloaded!');
    } catch {
      toast.error('Failed to generate report');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyber-400" /> Security Reports
          </h2>
          <p className="text-slate-500 text-sm mt-1">Download detailed PDF reports for your scans</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : scans.length === 0 ? (
          <div className="card p-12 rounded-xl text-center">
            <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No scans to report. Run a scan first.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {scans.map((scan, i) => (
              <motion.div
                key={scan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-hover p-5 rounded-xl"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-dark-600 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{scan.domain || scan.url}</p>
                      <p className="text-xs text-slate-500 font-mono">{new Date(scan.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`font-display font-bold text-xl flex-shrink-0 ${gradeColor(scan.grade)}`}>
                    {scan.grade}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${scan.securityScore}%`,
                        background: scan.securityScore >= 70 ? '#14b8a6' : scan.securityScore >= 50 ? '#eab308' : '#ef4444'
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-400 flex-shrink-0">{scan.securityScore}/100</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs font-mono">
                    {scan.summary?.critical > 0 && (
                      <span className="text-red-400">{scan.summary.critical} critical</span>
                    )}
                    {scan.summary?.high > 0 && (
                      <span className="text-orange-400">{scan.summary.high} high</span>
                    )}
                    {!scan.summary?.critical && !scan.summary?.high && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> No critical issues
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDownload(scan._id)}
                    className="flex items-center gap-1.5 text-xs text-cyber-400 hover:text-cyber-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
