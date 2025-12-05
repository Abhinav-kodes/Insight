import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  BookOpen,
  Brain,
  Menu,
  X,
  Github,
  Twitter,
  Linkedin,
  Mail
} from "lucide-react";

const SOURCE_LOGOS = [
  { name: "HackerNews", url: "https://upload.wikimedia.org/wikipedia/commons/b/b4/Hacker_News_logo.jpg" },
  { name: "TechCrunch", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TechCrunch_logo.svg/1200px-TechCrunch_logo.svg.png" },
  { name: "ArXiv", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/ArXiv_logo_2022.svg/1200px-ArXiv_logo_2022.svg.png" },
  { name: "MIT", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png" },
];

const FEATURES = [
  {
    icon: <Brain className="w-6 h-6 text-indigo-600" />,
    title: "AI Summaries",
    desc: "Get the gist of complex papers and articles in seconds with our advanced AI models."
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    title: "Personalized Feed",
    desc: "Our algorithms learn what you love and curate a feed that's 100% relevant to you."
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-500" />,
    title: "Global Sources",
    desc: "We aggregate content from top research journals, tech blogs, and news outlets worldwide."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-emerald-500" />,
    title: "Smart Digest",
    desc: "Receive daily or weekly highlights so you never miss a breakthrough."
  },
];

const FAQS = [
  { q: "What is INSIGHTS?", a: "INSIGHTS is your intelligent knowledge companion. We curate, summarize, and rank the best content from the tech and research world." },
  { q: "Is it free?", a: "Yes! The core features of INSIGHTS are free for everyone. We also offer a Pro plan for power users." },
  { q: "How does the AI work?", a: "We use state-of-the-art LLMs to analyze content, extract key insights, and generate concise summaries." },
];

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Welcome aboard! We've sent a confirmation to ${email}.`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                INSIGHTS
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Features</a>
              <a href="#sources" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Sources</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">FAQ</a>
              <button
                onClick={() => navigate("/login")}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Log in
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition shadow-lg shadow-indigo-200"
              >
                Get Started
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-slate-600">Features</a>
                <a href="#sources" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-slate-600">Sources</a>
                <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-slate-600">FAQ</a>
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <button onClick={() => navigate("/login")} className="w-full text-center text-sm font-medium text-slate-600">Log in</button>
                  <button onClick={() => navigate("/login")} className="w-full bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Get Started</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            v1.0 is now live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
            Knowledge, <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
              Distilled & Delivered.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
            Stay ahead of the curve with AI-curated insights from the world's best sources.
            No noise, just signal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-semibold transition flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
            >
              Start Reading Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-full font-semibold transition"
            >
              How it Works
            </button>
          </div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section id="sources" className="py-12 border-y border-slate-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">Trusted sources we curate from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {SOURCE_LOGOS.map((logo) => (
              <img key={logo.name} src={logo.url} alt={logo.name} className="h-8 md:h-10 object-contain" />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose INSIGHTS?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">We built a platform that respects your time and amplifies your learning.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to upgrade your information diet?</h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">Join thousands of professionals who start their day with INSIGHTS.</p>

          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-sm"
            />
            <button type="submit" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition shadow-lg shadow-indigo-900/20">
              Get Early Access
            </button>
          </form>
          <p className="text-slate-400 text-sm mt-4">No spam, ever. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <details key={idx} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
              <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                <span className="font-semibold text-slate-900">{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-1 rounded">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">INSIGHTS</span>
          </div>

          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Insights AI Inc. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 transition"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-slate-600 transition"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
