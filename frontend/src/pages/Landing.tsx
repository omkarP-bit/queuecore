import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import PartnerTicker from '../components/PartnerTicker';
import TestimonialsMarquee from '../components/TestimonialsMarquee';
import { RollingCounter } from '../components/RollingCounter';

const stats = {
  clinics: 247,
  paperReplaced: 76,
  avgBooking: 2.3,
  rating: 4.8,
};

const features = [
  {
    index: '01',
    title: 'Real-time ETS',
    desc: 'Know exactly when your turn arrives, down to the minute. No more guessing or waiting.',
  },
  {
    index: '02',
    title: 'Live Queue Map',
    desc: 'Track 200+ clinics across Pune and Mumbai with live queue depth and wait times.',
  },
  {
    index: '03',
    title: 'AI Symptom Triage',
    desc: 'Classifies your symptoms and assigns priority instantly so urgent cases get seen first.',
  },
];

const comparisons = [
  { label: 'Walk-in waits', before: '2-4 hours', after: '<15 min avg' },
  { label: 'Paper forms', before: '15 min fill', after: '30 sec digital' },
  { label: 'Reception calls', before: '30+ daily', after: 'Zero inbound' },
  { label: 'No-show rate', before: '22%', after: '<3%' },
  { label: 'Clinic capacity', before: '40/day', after: '70+/day' },
];

export default function Landing() {
  const [hoveredComparison, setHoveredComparison] = useState<number | null>(null);

  return (
    <div className="font-sans text-text-primary bg-bg min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            {/* Left label */}
            <div className="hidden sm:block col-span-2 border-r border-white/5 py-12 sm:py-20 lg:py-28 px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted sticky top-32">
                Manifesto
              </p>
            </div>

            {/* Content */}
            <div className="col-span-12 sm:col-span-10 px-6 py-12 sm:py-20 lg:py-28">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-primary font-semibold mb-8 sm:mb-12">
                <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                Live in Bangalore & Delhi
              </div>

              <h1 className="text-6xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-display font-black leading-[0.82] tracking-[-0.05em] text-white mb-8">
                Skip the<br />
                <span className="text-primary">waiting</span> room.
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mb-10 sm:mb-14">
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-md">
                  Book your token before you leave home. Know exactly when to arrive with live queue tracking and AI-powered triage.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <Link
                  to="/patient/find"
                  className="inline-flex items-center gap-3 bg-primary text-white font-semibold text-sm sm:text-base uppercase tracking-wider px-8 sm:px-10 py-4 sm:py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(26,107,255,0.4)]"
                  style={{ borderRadius: 0 }}
                >
                  Book a token <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/patient/find"
                  className="inline-flex items-center text-sm sm:text-base text-text-secondary hover:text-white font-medium underline underline-offset-4 transition-colors"
                >
                  How it works
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 mt-14 sm:mt-20">
                <div className="bg-bg p-5 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-2 sm:mb-3 font-bold">Clinics</p>
                  <div className="flex items-baseline">
                    <RollingCounter value={stats.clinics} fontSize={32} fontWeight={700} textColor="#fff" gap={2} borderRadius={0} horizontalPadding={0} />
                    <span className="text-2xl sm:text-3xl font-bold text-text-muted ml-1">+</span>
                  </div>
                </div>
                <div className="bg-bg p-5 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-2 sm:mb-3 font-bold">Paper Saved</p>
                  <div className="flex items-baseline">
                    <RollingCounter value={stats.paperReplaced} fontSize={32} fontWeight={700} textColor="#fff" gap={2} borderRadius={0} horizontalPadding={0} />
                    <span className="text-2xl sm:text-3xl font-bold text-text-muted ml-1">%</span>
                  </div>
                </div>
                <div className="bg-bg p-5 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-2 sm:mb-3 font-bold">Avg Booking</p>
                  <div className="flex items-baseline">
                    <RollingCounter value={stats.avgBooking} fontSize={32} fontWeight={700} textColor="#fff" gap={2} borderRadius={0} horizontalPadding={0} places={[10, 1, '.', 0.1]} />
                    <span className="text-2xl sm:text-3xl font-bold text-text-muted ml-1">m</span>
                  </div>
                </div>
                <div className="bg-bg p-5 sm:p-7">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-2 sm:mb-3 font-bold">Rating</p>
                  <div className="flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-bold text-primary mr-1">★</span>
                    <RollingCounter value={stats.rating} fontSize={32} fontWeight={700} textColor="#fff" gap={2} borderRadius={0} horizontalPadding={0} places={[1, '.', 0.1]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PARTNER TICKER ─── */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-2 border-r border-white/5 py-10 px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted sticky top-32">
                Partners
              </p>
            </div>
            <div className="col-span-12 sm:col-span-10 px-6 py-6">
              <PartnerTicker />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SYSTEM GRID ─── */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-2 border-r border-white/5 py-12 sm:py-20 px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted sticky top-32">
                System
              </p>
            </div>
            <div className="col-span-12 sm:col-span-10 px-6 py-12 sm:py-20">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[0.9] tracking-[-0.04em] text-white mb-10 sm:mb-16">
                No waiting.<br />
                <span className="text-text-muted">Just</span> knowing.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5 border-t border-white/5">
                {features.map((f) => (
                  <div
                    key={f.index}
                    className="p-6 sm:p-8 lg:p-10 transition-colors duration-300 hover:bg-white/[0.03]"
                  >
                    <p className="text-xs sm:text-sm font-mono font-semibold text-text-muted mb-3 sm:mb-4">{f.index}</p>
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON LIST ─── */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-2 border-r border-white/5 py-12 sm:py-20 px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted sticky top-32">
                Why Different
              </p>
            </div>
            <div className="col-span-12 sm:col-span-10 px-6 py-12 sm:py-20">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[0.9] tracking-[-0.04em] text-white mb-10 sm:mb-16">
                QueueCure vs<br />
                <span className="text-text-muted">the old way</span>
              </h2>

              <div className="divide-y divide-white/5">
                {comparisons.map((c, i) => (
                  <div
                    key={c.label}
                    className="flex items-center sm:items-baseline gap-4 sm:gap-6 lg:gap-10 py-4 sm:py-5 lg:py-6 px-2 sm:px-4 transition-colors duration-300 cursor-default"
                    style={{
                      background: hoveredComparison === i ? 'rgba(26,107,255,0.04)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredComparison(i)}
                    onMouseLeave={() => setHoveredComparison(null)}
                  >
                    <p className="text-xs font-mono font-semibold text-text-muted min-w-[2ch]">{c.label}</p>
                    <div className="flex-1 flex items-center gap-3 sm:gap-6">
                      <span className="text-sm text-text-muted line-through w-20 sm:w-24 shrink-0">{c.before}</span>
                      <ArrowRight
                        className="w-4 h-4 shrink-0 transition-colors duration-300"
                        style={{
                          color: hoveredComparison === i ? '#1A6BFF' : 'rgba(255,255,255,0.15)',
                        }}
                      />
                      <span
                        className="text-base sm:text-lg lg:text-xl font-bold transition-colors duration-300"
                        style={{
                          color: hoveredComparison === i ? '#1A6BFF' : '#ffffff',
                        }}
                      >
                        {c.after}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-2 border-r border-white/5 py-12 sm:py-20 px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted sticky top-32">
                Voices
              </p>
            </div>
            <div className="col-span-12 sm:col-span-10 px-6 py-12 sm:py-20">
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold leading-[0.9] tracking-[-0.04em] text-white mb-10 sm:mb-16">
                Trusted by<br />
                <span className="text-primary">thousands</span>
              </h2>
              <TestimonialsMarquee />
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-4 sm:gap-8">
            <div className="hidden sm:block col-span-2 border-r border-white/5 py-12 sm:py-20 px-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted sticky top-32">
                Access
              </p>
            </div>
            <div className="col-span-12 sm:col-span-10 px-6 py-12 sm:py-20">
              <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display font-black leading-[0.85] tracking-[-0.05em] text-white mb-6">
                Start exploring.
              </h2>
              <p className="text-base sm:text-lg text-text-secondary max-w-lg mb-8 sm:mb-10 leading-relaxed">
                Join 14,000+ patients who've already skipped the waiting room. First token is free.
              </p>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <Link
                  to="/patient/find"
                  className="inline-flex items-center gap-3 bg-primary text-white font-semibold text-sm sm:text-base uppercase tracking-wider px-8 sm:px-10 py-4 sm:py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(26,107,255,0.4)]"
                  style={{ borderRadius: 0 }}
                >
                  Book your first token <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm sm:text-base text-text-secondary hover:text-white font-medium underline underline-offset-4 transition-colors"
                >
                  For clinics → Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-2xl font-display font-bold tracking-tight text-white mb-3">QueueCure</p>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              Patient-first hospital queue platform for Indian OPDs.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Product</p>
            <div className="flex flex-col gap-2">
              <Link to="/patient/find" className="text-sm text-text-secondary hover:text-white transition-colors">Find Hospital</Link>
              <Link to="/patient/find" className="text-sm text-text-secondary hover:text-white transition-colors">How It Works</Link>
              <Link to="/login" className="text-sm text-text-secondary hover:text-white transition-colors">Sign In</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Company</p>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">About</span>
              <span className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">Privacy</span>
              <span className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">Terms</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-text-muted mb-4">Connect</p>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">Twitter</span>
              <span className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">LinkedIn</span>
              <span className="text-sm text-text-secondary cursor-pointer hover:text-white transition-colors">Instagram</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-text-muted">
          © 2024 QueueCure Technologies Pvt Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
