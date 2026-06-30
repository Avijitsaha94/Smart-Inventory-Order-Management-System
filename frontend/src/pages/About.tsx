import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, BarChart3, Shield,
  Zap, CheckCircle, ArrowRight, Code2,
  Database, Globe, 
  Mail, Star, Target, Heart,
} from 'lucide-react';
import ThemeToggle from '../components/shared/ThemeToggle';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50
                    bg-white dark:bg-slate-900
                    border-b border-gray-100 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Smart<span className="text-primary-600">Inventory</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-medium text-primary-600">About</Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary-600 transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-primary-600 transition-colors">
              Log in
            </Link>
            <Link to="/register" className="btn btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">
              Smart<span className="text-primary-400">Inventory</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} SmartInventory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Main About Page ──────────────────────────────────────────────────────────
function About() {
  const techStack = [
    {
      category: 'Frontend',
      icon: Globe,
      color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
      items: ['React 18', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Tailwind CSS', 'Recharts', 'React Router v6', 'Vite'],
    },
    {
      category: 'Backend',
      icon: Code2,
      color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
      items: ['Node.js', 'Express.js', 'REST API', 'JWT Auth', 'bcryptjs', 'express-validator', 'Mongoose', 'CORS'],
    },
    {
      category: 'Database',
      icon: Database,
      color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
      items: ['MongoDB', 'MongoDB Atlas', 'Mongoose ODM', 'Aggregation Pipeline', 'Indexing', 'Schema Validation'],
    },
  ];

  const features = [
    { icon: Package, label: 'Product Management', desc: 'Full CRUD with search, filter, and pagination' },
    { icon: ShoppingCart, label: 'Order Management', desc: 'Cart system with real-time stock validation' },
    { icon: BarChart3, label: 'Analytics Dashboard', desc: 'Interactive charts with business insights' },
    { icon: Shield, label: 'Role-Based Auth', desc: 'JWT authentication with Admin/User roles' },
    { icon: Zap, label: 'Real-time Updates', desc: 'Instant stock changes and order tracking' },
    { icon: Globe, label: 'Fully Responsive', desc: 'Optimized for mobile, tablet, and desktop' },
  ];

  const timeline = [
    { phase: 'Phase 1', title: 'Planning & Architecture', desc: 'System design, database schema, API planning, and tech stack selection.', color: 'bg-blue-500' },
    { phase: 'Phase 2', title: 'Backend Development', desc: 'Built REST API with Node.js, Express, MongoDB, JWT auth, and input validation.', color: 'bg-green-500' },
    { phase: 'Phase 3', title: 'Frontend Development', desc: 'Built React UI with TypeScript, Redux Toolkit, RTK Query, and Tailwind CSS.', color: 'bg-purple-500' },
    { phase: 'Phase 4', title: 'Testing & Deployment', desc: 'Bug fixes, responsive testing, and deployed to Vercel + Render.', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-primary-50 to-blue-50
                           dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/40
                          text-primary-700 dark:text-primary-400
                          px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>Built with Passion</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-primary-600">SmartInventory</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
            A complete full-stack inventory and order management system built to solve
            real-world business challenges. Designed with modern technologies,
            best practices, and a focus on developer experience.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40
                                rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <span className="text-primary-600 dark:text-primary-400 font-semibold">
                  Our Mission
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Simplifying Inventory Management for Everyone
              </h2>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
                SmartInventory was built to address a common pain point in retail businesses —
                manual, error-prone inventory tracking. Many small to medium businesses still
                rely on spreadsheets or paper records, leading to overselling, stock discrepancies,
                and lost revenue.
              </p>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
                Our goal was to create a modern, automated solution that tracks inventory in
                real-time, processes orders automatically, and provides actionable business insights
                through an intuitive dashboard.
              </p>
              <div className="space-y-3">
                {[
                  'Prevent overselling with real-time stock validation',
                  'Automate inventory updates on every transaction',
                  'Gain business insights with analytics dashboard',
                  'Manage teams with role-based access control',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-slate-300 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '20+', label: 'API Endpoints', color: 'from-blue-500 to-blue-600' },
                { value: '10K+', label: 'Lines of Code', color: 'from-green-500 to-green-600' },
                { value: '100%', label: 'TypeScript', color: 'from-purple-500 to-purple-600' },
                { value: '99.9%', label: 'Uptime', color: 'from-orange-500 to-orange-600' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white text-center`}
                >
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What's Inside
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive set of features built for real-world inventory management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6
                             border border-gray-100 dark:border-slate-700
                             hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40
                                  rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.label}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tech Stack
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built with modern, production-ready technologies chosen for performance and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {techStack.map((stack) => {
              const Icon = stack.icon;
              return (
                <div
                  key={stack.category}
                  className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6
                             border border-gray-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stack.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {stack.category}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stack.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-white dark:bg-slate-700
                                   text-gray-700 dark:text-slate-300
                                   border border-gray-200 dark:border-slate-600
                                   rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Development Timeline ── */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Development Journey
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              From concept to production in structured phases.
            </p>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5
                            bg-gray-200 dark:bg-slate-700 hidden sm:block" />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6">
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 ${item.color} rounded-2xl
                                    flex items-center justify-center shadow-lg z-10 relative`}>
                      <span className="text-white font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-slate-900
                                  rounded-2xl p-5
                                  border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${item.color}`}>
                        {item.phase}
                      </span>
                      <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Developer Section ── */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
            Meet the Developer
          </h2>

          <div className="bg-gray-50 dark:bg-slate-800
                          rounded-2xl p-8
                          border border-gray-100 dark:border-slate-700">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700
                            rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl font-bold text-white">A</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Avijit Saha
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
              Full Stack Developer
            </p>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4 max-w-lg mx-auto">
              MERN Stack developer passionate about building scalable web applications.
              Experienced in React, TypeScript, Node.js, and MongoDB.
              Based in Narayanganj, Bangladesh.
            </p>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {['React', 'TypeScript', 'Node.js', 'MongoDB', 'Redux', 'Express.js'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/40
                             text-primary-700 dark:text-primary-400
                             rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-3">
              <a
                href="https://github.com/Avijitsaha94"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2
                           bg-gray-900 dark:bg-slate-700 text-white
                           rounded-xl hover:bg-gray-800 dark:hover:bg-slate-600
                           transition-colors text-sm font-medium"
              >
                <FaGithub className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/avijitsh94"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2
                           bg-blue-600 text-white
                           rounded-xl hover:bg-blue-700
                           transition-colors text-sm font-medium"
              >
                <FaLinkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <Link
                to="/contact"
                className="flex items-center gap-2 px-4 py-2
                           bg-primary-600 text-white
                           rounded-xl hover:bg-primary-700
                           transition-colors text-sm font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>Contact</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Try SmartInventory?
          </h2>
          <p className="text-primary-200 mb-8 text-lg">
            Start managing your inventory smarter today. Free forever plan available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2
                         bg-white text-primary-700 font-semibold
                         px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2
                         bg-white/10 text-white font-semibold
                         px-8 py-3 rounded-xl hover:bg-white/20 transition-colors
                         border border-white/30"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;