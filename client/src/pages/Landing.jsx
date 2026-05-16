import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Shield, Zap, Lock, Eye, Terminal, ChevronRight, ArrowRight,
  Globe, AlertTriangle, CheckCircle, BarChart2, Code2, Cpu
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const features = [
  { icon: Shield, title: 'SSL/TLS Analysis', desc: 'Verify certificate validity, cipher strength, and protocol versions in real-time.' },
  { icon: Lock, title: 'Header Security', desc: 'Audit CSP, HSTS, X-Frame-Options and 10+ critical security response headers.' },
  { icon: Terminal, title: 'Injection Testing', desc: 'Detect SQL injection and XSS vulnerability vectors before attackers do.' },
  { icon: Eye, title: 'Port Scanning', desc: 'Identify exposed services and open ports that could be exploited.' },
  { icon: Zap, title: 'CSRF Detection', desc: 'Find missing CSRF protections that leave users vulnerable to forged requests.' },
  { icon: Cpu, title: 'AI Recommendations', desc: 'Get intelligent, prioritized remediation steps powered by security expertise.' },
];

const stats = [
  { value: '50K+', label: 'Scans Completed' },
  { value: '99.7%', label: 'Accuracy Rate' },
  { value: '200+', label: 'Vulnerability Checks' },
  { value: '<3s', label: 'Avg Scan Time' },
];

function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyber-600/20 border border-cyber-500/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyber-400" />
          </div>
          <span className="font-display text-sm font-bold tracking-widest">
            SECURE<span className="text-cyber-400">SCAN</span> AI
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Security'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-sm text-slate-400 hover:text-cyber-400 transition-colors font-medium">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors font-medium hidden sm:block">
            Sign In
          </Link>
          <Link to="/signup" className="btn-primary text-sm py-2 px-4">
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyber-500/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-500/30 bg-cyber-500/10 text-cyber-400 text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 bg-cyber-400 rounded-full animate-pulse" />
            AI-POWERED SECURITY ANALYSIS
            <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="font-display text-5xl md:text-7xl font-black leading-tight mb-6"
        >
          <span className="text-white">SCAN. DETECT.</span>
          <br />
          <span className="text-gradient">SECURE.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Enterprise-grade web application security testing in seconds.
          Identify vulnerabilities, misconfigurations, and attack vectors before adversaries do.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/signup" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-3.5">
            Start Free Scan
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-ghost flex items-center gap-2 justify-center text-base px-8 py-3.5">
            View Dashboard
          </Link>
        </motion.div>

        {/* Floating scan preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="relative card p-6 neon-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-slate-500">securescan-terminal</span>
            </div>
            <div className="space-y-2 text-left font-mono text-sm">
              <p className="text-slate-500">$ securescan --target https://example.com</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-cyber-400"
              >
                ✓ Initializing security scan engine...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="text-slate-300"
              >
                ✓ SSL/TLS: TLS 1.3 <span className="text-emerald-400">[SECURE]</span>
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
                className="text-slate-300"
              >
                ✗ CSP Header: Missing <span className="text-red-400">[CRITICAL]</span>
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.4 }}
                className="text-slate-300"
              >
                ⚠ CSRF Protection: Incomplete <span className="text-yellow-400">[HIGH]</span>
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.8 }}
                className="text-cyber-400 font-bold"
              >
                → Security Score: 72/100 — Grade B
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-black text-gradient mb-1">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="text-cyber-400 font-mono text-sm mb-3">// CAPABILITIES</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
          Comprehensive Security Analysis
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Every scan runs 200+ security checks across the OWASP Top 10 and beyond.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5}
            whileHover={{ y: -4 }}
            className="card-hover p-6 rounded-xl group"
          >
            <div className="w-10 h-10 rounded-lg bg-cyber-600/20 border border-cyber-500/30 flex items-center justify-center mb-4 group-hover:bg-cyber-600/30 transition-colors">
              <Icon className="w-5 h-5 text-cyber-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { n: '01', title: 'Enter URL', desc: 'Paste any website URL into our scanner — no installation needed.' },
    { n: '02', title: 'AI Scans', desc: 'Our engine runs 200+ security checks in parallel across all vectors.' },
    { n: '03', title: 'Get Results', desc: 'Receive a detailed vulnerability report with severity ratings.' },
    { n: '04', title: 'Fix & Rescan', desc: 'Follow AI-generated recommendations, then verify with a rescan.' },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-dark-800/30">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-cyber-400 font-mono text-sm mb-3">// WORKFLOW</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">How It Works</h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map(({ n, title, desc }, i) => (
            <motion.div
              key={n}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.2}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-gradient-to-r from-cyber-600/40 to-transparent" />
              )}
              <div className="font-display text-4xl font-black text-cyber-500/20 mb-3">{n}</div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="card neon-border p-12 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-900/30 to-transparent" />
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-cyber-600/20 border border-cyber-500/40 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-cyber-400" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Ready to Secure Your App?
            </h2>
            <p className="text-slate-400 mb-8">
              Join thousands of developers and security engineers using SecureScan AI.
            </p>
            <Link to="/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base">
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-slate-600 text-sm font-mono">
          © 2024 SecureScan AI. Built for security professionals.
        </p>
      </footer>
    </div>
  );
}
