import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, ShoppingCart, BarChart3, Shield, Zap, Bell,
  CheckCircle, Menu, X, ArrowRight, Star, TrendingUp,
  Users, Clock, ChevronDown, ChevronUp, Mail, Phone,
  MapPin
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import ThemeToggle from '../components/shared/ThemeToggle';

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Smart<span className="text-primary-600">Inventory</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Pricing
            </a>
            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-primary-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="btn btn-primary text-sm"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-primary-600 py-2">Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-primary-600 py-2">How It Works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-primary-600 py-2">Pricing</a>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-primary-600 py-2">About</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-primary-600 py-2">Contact</Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Link to="/login" className="btn btn-secondary text-center text-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary text-center text-sm">Get Started Free</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-primary-50 via-white to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>Real-time Inventory Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Manage Your
              <span className="text-primary-600 block">Inventory Smarter</span>
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A complete inventory and order management solution for modern businesses.
              Track stock in real-time, process orders automatically, and gain business
              insights with powerful analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/register"
                className="btn btn-primary flex items-center justify-center gap-2 text-base px-6 py-3"
              >
                <span>Start For Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary flex items-center justify-center gap-2 text-base px-6 py-3"
              >
                <span>View Demo</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>99.9% uptime</span>
              </div>
            </div>
          </div>

          {/* Right - Dashboard Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Mock Dashboard */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <span className="text-xs text-gray-400">Dashboard Preview</span>
              </div>

              {/* Mock Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Total Products', value: '1,248', color: 'bg-blue-50 text-blue-600', icon: '📦' },
                  { label: 'Total Orders', value: '856', color: 'bg-green-50 text-green-600', icon: '🛒' },
                  { label: 'Revenue', value: '৳4.2M', color: 'bg-purple-50 text-purple-600', icon: '💰' },
                  { label: 'Low Stock', value: '23', color: 'bg-orange-50 text-orange-600', icon: '⚠️' },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.color} rounded-lg p-3`}>
                    <div className="text-lg mb-1">{stat.icon}</div>
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-xs opacity-70">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Mock Chart */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="text-xs text-gray-500 mb-2">Monthly Revenue</div>
                <div className="flex items-end gap-1 h-16">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary-400 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Mock Orders */}
              <div className="space-y-2">
                {[
                  { id: 'ORD-001', status: 'delivered', amount: '৳12,500' },
                  { id: 'ORD-002', status: 'pending', amount: '৳8,200' },
                  { id: 'ORD-003', status: 'processing', amount: '৳5,800' },
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <span className="text-xs font-medium text-gray-700">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs font-bold text-gray-900">{order.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-bounce">
              Live Updates ✓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Statistics Section ─────────────────────────────────────────────────────
function StatisticsSection() {
  const stats = [
    { value: '500+', label: 'Businesses Trust Us', icon: Users },
    { value: '1M+', label: 'Products Managed', icon: Package },
    { value: '99.9%', label: 'System Uptime', icon: TrendingUp },
    { value: '24/7', label: 'Support Available', icon: Clock },
  ];

  return (
    <section className="bg-primary-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ───────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      title: 'Smart Inventory Tracking',
      description: 'Track your entire product catalog in real-time. Get instant alerts when stock runs low and never oversell again.',
      points: ['Real-time stock updates', 'Low stock alerts', 'Category management', 'SKU tracking'],
    },
    {
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-600',
      title: 'Order Management',
      description: 'Process orders efficiently with our shopping cart system. Automatic stock deduction and restoration on cancellation.',
      points: ['Cart-based ordering', 'Auto stock deduction', 'Order status tracking', 'Cancel & restore stock'],
    },
    {
      icon: BarChart3,
      color: 'bg-purple-100 text-purple-600',
      title: 'Business Analytics',
      description: 'Make data-driven decisions with powerful analytics. Interactive charts showing sales trends and top products.',
      points: ['Revenue tracking', 'Top products chart', 'Category distribution', 'Monthly summaries'],
    },
    {
      icon: Shield,
      color: 'bg-orange-100 text-orange-600',
      title: 'Role-Based Access',
      description: 'Secure your business data with role-based permissions. Admins have full control while users have limited access.',
      points: ['Admin & user roles', 'JWT authentication', 'Secure passwords', 'Protected routes'],
    },
    {
      icon: Bell,
      color: 'bg-red-100 text-red-600',
      title: 'Smart Alerts',
      description: 'Stay informed with real-time notifications. Get alerted about low stock, new orders, and important updates.',
      points: ['Low stock warnings', 'Order notifications', 'Status updates', 'Dashboard alerts'],
    },
    {
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      title: 'Fast & Reliable',
      description: 'Built with modern technology for speed and reliability. 99.9% uptime with optimized performance.',
      points: ['Lightning fast UI', 'API caching', '99.9% uptime', 'Mobile responsive'],
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="text-primary-600"> Manage Inventory</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A complete suite of tools designed to streamline your inventory management
            and boost business efficiency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ───────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Sign up for free in seconds. No credit card required. Choose your role as Admin or User.',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      step: '02',
      title: 'Add Your Products',
      description: 'Import or manually add your products with details like price, stock, SKU, and category.',
      icon: Package,
      color: 'bg-green-500',
    },
    {
      step: '03',
      title: 'Process Orders',
      description: 'Create orders easily with our cart system. Stock updates automatically on every transaction.',
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
    {
      step: '04',
      title: 'Track & Analyze',
      description: 'Monitor your business with real-time analytics, revenue charts, and inventory insights.',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Simple Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get Started in
            <span className="text-primary-600"> 4 Easy Steps</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Setting up your inventory system takes just a few minutes.
            Start managing your business smarter today.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative text-center">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gray-200 z-0"></div>
                )}

                <div className="relative z-10">
                  {/* Step Number */}
                  <div className="relative inline-block mb-4">
                    <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                      <Icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {step.step}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/register"
            className="btn btn-primary inline-flex items-center gap-2 text-base px-8 py-3"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ────────────────────────────────────────────────────────
function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for small businesses getting started.',
      color: 'border-gray-200',
      badge: null,
      features: [
        'Up to 100 products',
        'Up to 50 orders/month',
        'Basic analytics',
        'Email support',
        '1 user account',
        'Mobile responsive',
      ],
      cta: 'Get Started Free',
      ctaStyle: 'btn-secondary',
      href: '/register',
    },
    {
      name: 'Professional',
      price: '৳2,999',
      period: 'per month',
      description: 'For growing businesses that need more power.',
      color: 'border-primary-500',
      badge: 'Most Popular',
      features: [
        'Unlimited products',
        'Unlimited orders',
        'Advanced analytics',
        'Priority support',
        'Up to 10 users',
        'Export reports',
        'Low stock alerts',
        'API access',
      ],
      cta: 'Start Free Trial',
      ctaStyle: 'btn-primary',
      href: '/register',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations with custom needs.',
      color: 'border-gray-200',
      badge: null,
      features: [
        'Everything in Pro',
        'Unlimited users',
        'Custom integrations',
        'Dedicated support',
        'Custom reports',
        'SLA guarantee',
        'On-premise option',
        'Training included',
      ],
      cta: 'Contact Sales',
      ctaStyle: 'btn-secondary',
      href: '/register',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            <span>Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Choose the Right
            <span className="text-primary-600"> Plan for You</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free and scale as your business grows. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border-2 ${plan.color} p-8 hover:shadow-xl transition-shadow`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm mb-1">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.href}
                className={`btn ${plan.ctaStyle} text-center text-sm py-3`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is SmartInventory really free to start?',
      answer: 'Yes! Our Starter plan is completely free forever. You can manage up to 100 products and 50 orders per month without any cost. No credit card required to sign up.',
    },
    {
      question: 'How does real-time stock tracking work?',
      answer: 'When you create an order, our system automatically deducts the ordered quantities from your product stock. When an order is cancelled, stock is instantly restored. You get alerts when products fall below your defined threshold.',
    },
    {
      question: 'Can multiple team members use the system?',
      answer: 'Absolutely! You can create multiple user accounts with different roles. Admins have full access to manage products, orders, and users. Regular users can create orders and view products.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we take security seriously. All passwords are hashed with bcrypt, authentication uses JWT tokens, and all API routes are protected. Your data is stored securely in MongoDB Atlas with encryption.',
    },
    {
      question: 'Can I export my inventory data?',
      answer: 'Export functionality is available in our Professional and Enterprise plans. You can export product lists, order history, and analytics reports to Excel or PDF format.',
    },
    {
      question: 'What happens if I exceed the free plan limits?',
      answer: 'If you reach the limits of the free plan, you can easily upgrade to our Professional plan to unlock unlimited products and orders. Your data is always safe and never deleted.',
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Currently, SmartInventory is a fully responsive web application that works seamlessly on mobile browsers. A dedicated mobile app is on our roadmap for future development.',
    },
    {
      question: 'How do I get support if I have issues?',
      answer: 'We offer email support for all plans. Professional users get priority support with faster response times. Enterprise customers get a dedicated support manager.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Bell className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked
            <span className="text-primary-600"> Questions</span>
          </h2>
          <p className="text-lg text-gray-600">
            Can't find the answer you're looking for? Feel free to contact us.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-primary-300 transition-colors"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Inventory Management?
        </h2>
        <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
          Join hundreds of businesses already using SmartInventory.
          Start your free account today — no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <span>Start For Free Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-colors border border-white/30"
          >
            <span>Login to Dashboard</span>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-8 text-primary-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm">No credit card needed</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm">Free forever plan</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm">Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm">24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Smart<span className="text-primary-400">Inventory</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              A complete inventory and order management solution for modern businesses.
              Track, manage, and grow smarter.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: FaGithub, href: 'https://github.com/Avijitsaha94', label: 'GitHub' },
                { icon: FaLinkedin, href: 'https://linkedin.com/in/avijitsh94', label: 'LinkedIn' },
               
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How It Works', href: '#how-it-works' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'FAQ', href: '#faq' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <span>support@smartinventory.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <span>+880 1712-345678</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 flex-shrink-0" />
                <span>Narayanganj, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} SmartInventory. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ───────────────────────────────────────────────────────
function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatisticsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default LandingPage;