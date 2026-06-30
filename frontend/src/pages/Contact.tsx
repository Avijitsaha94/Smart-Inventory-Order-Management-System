import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Mail, Phone, MapPin, Send,
  CheckCircle, Clock, MessageSquare,
    ArrowRight,
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
            <Link to="/about" className="text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-primary-600 transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium text-primary-600">Contact</Link>
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

// ── Main Contact Page ─────────────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.subject.trim() || formData.subject.length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    if (!formData.message.trim() || formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email Address',
      value: 'avijitsaha94@gmail.com',
      href: 'mailto:avijitsaha94@gmail.com',
      color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    },
    {
      icon: Phone,
      label: 'Phone Number',
      value: '+880 1712-345678',
      href: 'tel:+8801712345678',
      color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Narayanganj, Dhaka, Bangladesh',
      href: 'https://maps.google.com',
      color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: 'Mon - Fri: 9AM - 6PM (BST)',
      href: null,
      color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    },
  ];

  const subjects = [
    'General Inquiry',
    'Technical Support',
    'Bug Report',
    'Feature Request',
    'Business Partnership',
    'Other',
  ];

  const inputClass = `w-full px-4 py-3 rounded-xl border transition-colors
    bg-white dark:bg-slate-700
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary-50 to-blue-50
                           dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2
                          bg-primary-100 dark:bg-primary-900/40
                          text-primary-700 dark:text-primary-400
                          px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageSquare className="w-4 h-4" />
            <span>Get In Touch</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Contact <span className="text-primary-600">Us</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have a question, feedback, or want to collaborate?
            We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Left: Contact Info ── */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Let's Talk
                </h2>
                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                  Whether you're looking for technical support, want to report a bug,
                  or just want to say hi — we're here for you.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-4
                                    bg-gray-50 dark:bg-slate-800
                                    rounded-xl border border-gray-100 dark:border-slate-700
                                    hover:border-primary-300 dark:hover:border-primary-600
                                    transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${info.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-0.5">{info.label}</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{info.value}</p>
                      </div>
                    </div>
                  );

                  return info.href ? (
                    <a key={info.label} href={info.href} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  );
                })}
              </div>

              {/* Social Links */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                  Connect on Social Media
                </p>
                <div className="flex gap-3">
                  {[
                    { icon: FaGithub, href: 'https://github.com/Avijitsaha94', label: 'GitHub', bg: 'bg-gray-900 dark:bg-slate-700 hover:bg-gray-800' },
                    { icon: FaLinkedin, href: 'https://linkedin.com/in/avijitsh94', label: 'LinkedIn', bg: 'bg-blue-600 hover:bg-blue-700' },
                   
                  ].map(({ icon: Icon, href, label, bg }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 ${bg} text-white rounded-xl
                                  flex items-center justify-center transition-colors`}
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-primary-50 dark:bg-primary-900/20
                              border border-primary-200 dark:border-primary-800
                              rounded-2xl p-5">
                <h3 className="font-semibold text-primary-900 dark:text-primary-300 mb-3">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'View Documentation', to: '/about' },
                    { label: 'Create Free Account', to: '/register' },
                    { label: 'Login to Dashboard', to: '/login' },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400
                                 hover:text-primary-900 dark:hover:text-primary-300 transition-colors"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Contact Form ── */}
            <div className="lg:col-span-2">
              {submitted ? (
                // Success State
                <div className="h-full flex items-center justify-center">
                  <div className="text-center py-16 px-8">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40
                                    rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      Message Sent! 🎉
                    </h3>
                    <p className="text-gray-600 dark:text-slate-400 mb-2">
                      Thank you for reaching out, <strong className="text-gray-900 dark:text-white">{formData.name}</strong>!
                    </p>
                    <p className="text-gray-600 dark:text-slate-400 mb-8">
                      We've received your message and will get back to you at{' '}
                      <strong className="text-primary-600">{formData.email}</strong>{' '}
                      within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', subject: '', message: '' });
                        }}
                        className="btn btn-secondary dark:bg-slate-700 dark:text-white"
                      >
                        Send Another Message
                      </button>
                      <Link to="/" className="btn btn-primary flex items-center justify-center gap-2">
                        <span>Back to Home</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                // Form
                <div className="bg-gray-50 dark:bg-slate-800
                                rounded-2xl p-8
                                border border-gray-100 dark:border-slate-700">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Send a Message
                    </h2>
                    <p className="text-gray-500 dark:text-slate-400 text-sm">
                      Fill out the form below and we'll get back to you soon.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Email Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className={`${inputClass} ${errors.name ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={`${inputClass} ${errors.email ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`${inputClass} ${errors.subject ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                      >
                        <option value="">Select a subject...</option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-500">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here... (minimum 20 characters)"
                        rows={6}
                        className={`${inputClass} resize-none ${errors.message ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 dark:border-slate-600'}`}
                      />
                      <div className="flex items-center justify-between mt-1">
                        {errors.message ? (
                          <p className="text-xs text-red-500">{errors.message}</p>
                        ) : (
                          <span />
                        )}
                        <p className={`text-xs ml-auto ${
                          formData.message.length < 20
                            ? 'text-gray-400 dark:text-slate-500'
                            : 'text-green-500'
                        }`}>
                          {formData.message.length} / 500
                        </p>
                      </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="flex items-start gap-2 p-4
                                    bg-blue-50 dark:bg-blue-900/20
                                    border border-blue-100 dark:border-blue-800
                                    rounded-xl text-sm text-blue-700 dark:text-blue-400">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p>
                        Your information is safe with us. We never share your data with third parties.
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn btn-primary flex items-center justify-center gap-2
                                 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Our Location
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              Based in Narayanganj, Bangladesh — available globally.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58416.79827218413!2d90.46346!3d23.6238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b0e01f6b3bb1%3A0x92df928b5bbf66c9!2sNarayanganj%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1699999999999!5m2!1sen!2sbd"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            />
          </div>
        </div>
      </section>

      {/* ── FAQ Strip ── */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Common Questions
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              Quick answers before you reach out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                q: 'How quickly will you respond?',
                a: 'We typically respond to all inquiries within 24 business hours.',
              },
              {
                q: 'Do you offer technical support?',
                a: 'Yes! We provide technical support for all users. Premium users get priority support.',
              },
              {
                q: 'Can I request a new feature?',
                a: 'Absolutely! Select "Feature Request" in the subject and describe your idea.',
              },
              {
                q: 'Is there a live chat option?',
                a: 'Live chat is on our roadmap. For now, email and the contact form are the best ways to reach us.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-5 bg-gray-50 dark:bg-slate-800
                           rounded-2xl border border-gray-100 dark:border-slate-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;