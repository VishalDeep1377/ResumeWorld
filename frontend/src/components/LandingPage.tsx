// frontend/src/components/LandingPage.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Jobs Matched', value: '12k+' },
  { label: 'Active Companies', value: '2.5k+' },
  { label: 'Avg. Success Rate', value: '95%' },
];

const features = [
  {
    title: 'AI-Powered Matching',
    desc: 'We parse your resume and align it with market demand using a fast, transparent scoring model.',
    icon: '🎯',
  },
  {
    title: '1-Click Applications',
    desc: 'Apply to curated roles instantly and track outcomes with real-time status updates.',
    icon: '⚡',
  },
  {
    title: 'Smart Insights',
    desc: 'Identify skill gaps, salary bands, and growth paths tailored to your profile.',
    icon: '📈',
  },
];

const testimonials = [
  { name: 'Sarah J.', role: 'SWE, Google', quote: 'Landed my role in under a month. Matching felt accurate and actionable.' },
  { name: 'Michael C.', role: 'PM, Microsoft', quote: 'Best insights on what to learn next. The analytics saved me time.' },
  { name: 'Emily R.', role: 'DS, Netflix', quote: 'The UI is clean and the recommendations are on point.' },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_0%,rgba(16,185,129,0.12),transparent)] pointer-events-none" />
        <div className="container mx-auto px-6 pt-28 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <motion.h1
                className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Find your next role with
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                  AI guidance and real insights
                </span>
              </motion.h1>
              <motion.p
                className="mt-5 text-lg text-slate-300 max-w-2xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Upload your resume, get instant analysis, and apply faster. We surface high-signal roles matched to your skills.
              </motion.p>

              <motion.div
                className="mt-8 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div
                className="mt-10 grid grid-cols-3 gap-6 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {stats.map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-sm text-slate-300">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 p-6 backdrop-blur-sm">
                <div className="text-sm text-slate-300 mb-4">Preview</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-slate-200">Resume parsed</div>
                    <div className="text-emerald-400 font-medium">12 skills detected</div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-slate-200">Top match</div>
                    <div className="text-blue-400 font-medium">Senior Frontend • 92%</div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-slate-200">Salary band</div>
                    <div className="text-emerald-400 font-medium">$120k–$160k</div>
                  </div>
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 -z-10 blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Built for your job hunt</h2>
          <p className="text-slate-300 text-center mt-3 max-w-2xl mx-auto">
            Clear UX, practical insights, and fast applications—no fluff.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="font-semibold text-lg">{f.title}</div>
                <p className="text-slate-300 mt-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center">What candidates say</h3>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="text-slate-300 italic">“{t.quote}”</div>
                <div className="mt-4 text-sm text-slate-400">{t.name} — {t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 p-10 text-center">
            <h4 className="text-2xl md:text-3xl font-bold">Ready to accelerate your search?</h4>
            <p className="text-slate-300 mt-2">Join thousands of professionals getting matched daily.</p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link to="/signup" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors font-semibold">
                Get Started Free
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors font-semibold">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;