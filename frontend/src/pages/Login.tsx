import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { supabase } from '../lib/supabase';
import { ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

const FEATURES = [
  { icon: 'ph:clock-bold', label: 'Real-time ETS' },
  { icon: 'ph:users-bold', label: 'Live queue tracking' },
  { icon: 'ph:brain-bold', label: 'AI symptom triage' },
];

const FAQS = [
  {
    q: 'Is the free plan really free?',
    a: 'Yes. Your first token is completely free. No card, no commitment. Just pick a hospital and book.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'A quick email sign-up lets you track your token live, get ETS updates, and manage multiple bookings in one place.',
  },
  {
    q: 'Can I use it from my clinic?',
    a: 'Absolutely. QueueCure for Clinics gives reception teams a full dashboard — call next patient, track flow, manage walk-ins.',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const from = (location.state as any)?.from?.pathname || '/patient/find';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authService.login({
        role: 'patient',
        email,
        name: tab === 'signup' ? name : '',
      });

      if (res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password) return { bars: 0, label: '' };
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const score = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    return { bars: score, label: labels[score - 1] || 'Weak' };
  };

  return (
    <div className="min-h-screen bg-[#1c1815] text-white font-sans antialiased">
      {/* ─── GLOBAL FONTS ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..600&family=Inter:wght@400;500;600&display=swap');
        html { scroll-behavior: smooth; }
        .font-serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .display { letter-spacing: -0.02em; line-height: 0.95; }
        .grain::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 256px 256px;
        }
        .ulink {
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          transition: background-size 0.25s ease;
        }
        .ulink:hover { background-size: 100% 1px; }
        .cta:hover { transform: translateY(-1px); box-shadow: 0 12px 30px -8px rgba(123,45,59,0.45); }
        .cta:active { transform: translateY(0); }
        .oauth:hover { border-color: #b9ab95 !important; box-shadow: 0 2px 14px rgba(28,24,21,0.06); transform: translateY(-1px); }
        .field { background: #ffffff; border: 1px solid #d8cdbb; transition: border-color 0.18s, box-shadow 0.18s, background 0.18s; }
        .field:focus-within { border-color: #7b2d3b; box-shadow: 0 0 0 3px rgba(123,45,59,0.12); background: #fffdfa; }
        .field input { background: transparent; outline: none; }
        .field input::placeholder { color: #a89a85; }
        details summary::-webkit-details-marker { display: none; }
        details summary { list-style: none; }
        details[open] .chev { transform: rotate(180deg); }
      `}</style>

      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 backdrop-blur-[10px] bg-[#faf6ef]/80 border-b border-[#e7dcc9]">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-[9px] bg-[#7b2d3b] flex items-center justify-center">
              <span className="font-serif text-[17px] text-[#faf6ef] font-bold">Q</span>
            </div>
            <span className="font-serif text-[19px] tracking-tight text-[#1c1815] font-semibold">QueueCure</span>
          </Link>

          <div className="hidden md:flex items-center gap-9">
            {['Find Hospital', 'Dashboard', 'For Clinics'].map((link) => (
              <a key={link} href="#" className="text-[14px] text-[#2a241f]/75 no-underline ulink">{link}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-[13px] text-[#2a241f]/65">Already with us?</span>
            <Link to="/login" className="text-[14px] font-medium text-[#7b2d3b] no-underline ulink">Log in</Link>
          </div>
        </div>
      </nav>

      {/* ─── SPLIT MAIN ─── */}
      <main className="grid lg:grid-cols-[1.04fr_1fr] min-h-[calc(100vh-4rem)]">
        {/* LEFT — Brand Panel */}
        <section className="relative grain overflow-hidden bg-[#7b2d3b] text-[#faf6ef] order-2 lg:order-1">
          {/* Decorative arcs */}
          <svg className="absolute -right-24 -top-24 w-[460px] h-[460px] opacity-[0.16] pointer-events-none" viewBox="0 0 460 460" fill="none">
            <circle cx="230" cy="230" r="180" stroke="#faf6ef" strokeWidth="0.6" />
            <circle cx="230" cy="230" r="120" stroke="#faf6ef" strokeWidth="0.6" />
            <circle cx="230" cy="230" r="60" stroke="#faf6ef" strokeWidth="0.6" />
          </svg>
          {/* Radial bloom */}
          <div className="absolute -left-32 bottom-[-20%] w-[420px] h-[420px] rounded-full bg-[#5e202b]/60 blur-[2px] opacity-50 pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-between px-8 sm:px-12 lg:px-14 xl:px-20 py-12 lg:py-16">
            {/* Top eyebrow */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-px bg-[#faf6ef]/45" />
                <span className="text-[12px] uppercase tracking-[0.28em] text-[#faf6ef]/70 font-medium">
                  Issue 01 . QueueCure
                </span>
              </div>

              <h1 className="font-serif font-light display text-[clamp(2.7rem,6vw,5.25rem)] max-w-[11ch] text-[#faf6ef]">
                Skip the{' '}
                <span className="italic font-normal text-[#a9485a]">3-hour</span>{' '}
                waiting room.
              </h1>

              <div className="w-16 h-px bg-[#faf6ef]/35 my-8" />

              <p className="max-w-[38ch] text-[15.5px] leading-relaxed text-[#faf6ef]/78">
                Book your token before you leave home. Know exactly when to arrive with live queue tracking and AI-powered triage.
              </p>
            </div>

            {/* Bottom: testimonial + features */}
            <div className="mt-12">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#faf6ef]/32 to-transparent mb-8" />

              <figure className="max-w-[40ch]">
                <blockquote className="font-serif italic text-[18px] sm:text-[20px] leading-snug text-[#faf6ef]/95">
                  "QueueCure completely changed how we manage OPD flow. Patients are calmer, staff are happier."
                </blockquote>
                <figcaption className="flex items-center gap-3 mt-4">
                  <div className="w-9 h-9 rounded-full ring-1 ring-[#faf6ef]/25 bg-[#faf6ef]/12 flex items-center justify-center font-serif font-bold text-sm text-[#faf6ef]/90">
                    DS
                  </div>
                  <div>
                    <p className="text-[#faf6ef]/95 font-medium text-sm">Dr. Sanjay Verma</p>
                    <p className="text-[#faf6ef]/72 text-[12.5px]">Chief of Cardiology, City Hospital</p>
                  </div>
                </figcaption>
              </figure>

              <div className="flex flex-wrap gap-x-7 gap-y-2 mt-9 text-[12.5px] text-[#faf6ef]/62">
                {FEATURES.map((f) => (
                  <span key={f.label} className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT — Sign-up Form */}
        <section className="relative bg-[#1c1815] text-[#faf6ef] order-1 lg:order-2 lg:before:absolute lg:before:inset-y-0 lg:before:left-0 lg:before:w-px lg:before:bg-gradient-to-b lg:before:from-transparent lg:before:via-[#a9485a]/40 lg:before:to-transparent">
          <div className="mx-auto w-full max-w-[480px] px-7 sm:px-10 py-12 sm:py-14 lg:py-16">
            {/* Form head */}
            <div className="mb-9">
              <p className="text-[12px] uppercase tracking-[0.26em] text-[#faf6ef]/45 font-medium">Create your account</p>
              <h2 className="font-serif display text-[clamp(1.9rem,3vw,2.5rem)] leading-[1.05] tracking-tight text-[#faf6ef] mt-2">
                Start booking,<br />
                <span className="italic text-[#a9485a]">free.</span>
              </h2>
              <p className="mt-3 text-[14.5px] text-[#faf6ef]/55">
                First token is on the house. No card, no waiting room anxiety.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl bg-[#7b2d3b]/20 border border-[#7b2d3b]/30 px-4 py-3 text-[13px] text-[#a9485a]">
                {error}
              </div>
            )}

            <form onSubmit={handleAuth}>
              {/* OAuth buttons */}
              <div className="grid grid-cols-1 gap-3 mb-7">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: { redirectTo: `${window.location.origin}/queue` },
                      });
                      if (error) setError(error.message);
                    } catch (e: any) {
                      setError(e.message || 'Error occurred');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="oauth w-full h-12 rounded-xl bg-[#faf6ef] text-[#1c1815] font-medium text-[15px] flex items-center justify-center gap-3 border border-[#d8cdbb] transition-all no-underline"
                  style={{ border: '1px solid #d8cdbb' }}
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="oauth w-full h-12 rounded-xl bg-transparent text-[#faf6ef] font-medium text-[15px] flex items-center justify-center gap-3 transition-all"
                  style={{ border: '1px solid rgba(250,246,239,0.15)' }}
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-7">
                <div className="flex-1 h-px bg-[#faf6ef]/12" />
                <span className="text-[12px] uppercase tracking-[0.22em] text-[#faf6ef]/35">or with email</span>
                <div className="flex-1 h-px bg-[#faf6ef]/12" />
              </div>

              {/* Tab toggle */}
              <div className="flex items-center gap-2 mb-6 bg-white/5 rounded-xl p-1 border border-white/10">
                {(['login', 'signup'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex-1 rounded-[10px] py-2.5 text-[13px] font-medium transition-all ${
                      tab === t ? 'bg-[#7b2d3b] text-[#faf6ef]' : 'text-[#faf6ef]/50 hover:text-[#faf6ef]'
                    }`}
                  >
                    {t === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {tab === 'signup' && (
                  <div>
                    <label className="text-[12.5px] font-medium text-[#faf6ef]/60 block mb-1.5">Full name</label>
                    <div className="field h-12 rounded-xl flex items-center gap-2.5 px-3.5">
                      <svg className="w-[18px] h-[18px] shrink-0" style={{ color: '#9a8c77' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Your name"
                        className="w-full h-full text-[15px] text-[#1c1815]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[12.5px] font-medium text-[#faf6ef]/60 block mb-1.5">Work email</label>
                  <div className="field h-12 rounded-xl flex items-center gap-2.5 px-3.5">
                    <svg className="w-[18px] h-[18px] shrink-0" style={{ color: '#9a8c77' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@studio.com"
                      className="w-full h-full text-[15px] text-[#1c1815]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[12.5px] font-medium text-[#faf6ef]/60 block mb-1.5">Password</label>
                  <div className="field h-12 rounded-xl flex items-center gap-2.5 px-3.5">
                    <svg className="w-[18px] h-[18px] shrink-0" style={{ color: '#9a8c77' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full h-full text-[15px] tracking-[0.16em] text-[#1c1815]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0 hover:text-[#7b2d3b] transition-colors"
                      style={{ color: '#9a8c77' }}
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>

                  {/* Strength meter */}
                  {tab === 'signup' && password && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 grid grid-cols-4 gap-1.5">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="meter-seg h-1 rounded-full transition-colors duration-300"
                            style={{
                              background: i < passwordStrength().bars ? '#a9485a' : 'rgba(250,246,239,0.15)',
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[11.5px] text-[#faf6ef]/45">{passwordStrength().label}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cta w-full h-12 rounded-xl bg-[#7b2d3b] text-[#faf6ef] font-medium text-[15px] flex items-center justify-center gap-2 mt-6 transition-all disabled:opacity-60 group"
              >
                {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create account'}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            <p className="mt-5 text-[12.5px] text-[#faf6ef]/45 leading-relaxed">
              By continuing you agree to our{' '}
              <a href="#" className="text-[#faf6ef]/80 ulink no-underline">Terms</a> and{' '}
              <a href="#" className="text-[#faf6ef]/80 ulink no-underline">Privacy Policy</a>.
              We will never post on your behalf.
            </p>

            <div className="mt-7 pt-6 border-t border-[#faf6ef]/10 flex items-center justify-between text-[13.5px]">
              <div>
                <span className="text-[#faf6ef]/55">Already designing with us?</span>{' '}
                <Link to="/login" className="text-[#a9485a] font-medium ulink no-underline ml-1">Log in</Link>
              </div>
              <a href="#" className="text-[#faf6ef]/55 hover:text-[#faf6ef] flex items-center gap-1.5 ulink no-underline">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 21h16M4 21V3m16 18V3M4 21l8-8m8 8l-8-8" />
                </svg>
                Enterprise
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ─── TRUST STRIP ─── */}
      <section className="bg-[#faf6ef] border-t border-[#e7dcc9]">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8 py-10 flex flex-col lg:flex-row lg:items-center gap-7 lg:gap-12">
          <p className="font-serif italic text-[17px] text-[#2a241f]/80 shrink-0">
            Trusted in the clinics shipping fastest
          </p>

          <div className="flex-1 flex flex-wrap items-center gap-x-9 gap-y-4 opacity-70">
            {[
              { icon: '◆', name: 'Northbeam' },
              { icon: '⬡', name: 'Lumen Labs' },
              { icon: '●', name: 'Orbital' },
              { icon: '▲', name: 'Fieldnote' },
              { icon: '＊', name: 'Mercer & Co' },
            ].map((brand) => (
              <div key={brand.name} className="flex items-center gap-2 font-serif text-[16px] tracking-tight text-[#1c1815]">
                <span className="font-bold text-[#7b2d3b]">{brand.icon}</span>
                {brand.name}
              </div>
            ))}
          </div>

          <div className="flex items-center shrink-0">
            <div className="flex -space-x-2.5">
              {['JK', 'AL', 'TS'].map((initials, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full ring-2 ring-[#faf6ef] flex items-center justify-center font-serif text-[12px] font-bold"
                  style={{
                    background: i === 0 ? 'rgba(123,45,59,0.9)' : i === 1 ? '#2a241f' : '#a9485a',
                    color: '#faf6ef',
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="ml-3 text-[13px] text-[#2a241f]/70 leading-tight">
              12,400 patients<br />shipped this week
            </p>
          </div>
        </div>
      </section>

      {/* ─── FAQ / FOOTER ─── */}
      <footer className="bg-[#1c1815] text-[#faf6ef]">
        <div className="mx-auto max-w-[1240px] px-6 sm:px-8 py-12">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-[9px] bg-[#7b2d3b] flex items-center justify-center">
                  <span className="font-serif text-[17px] text-[#faf6ef] font-bold">Q</span>
                </div>
                <span className="font-serif text-[19px] tracking-tight text-[#faf6ef] font-semibold">QueueCure</span>
              </div>
              <p className="max-w-[34ch] text-[13.5px] text-[#faf6ef]/50 leading-relaxed">
                The AI hospital queue platform. From booking to treatment, on a live-tracked timeline.
              </p>
              <div className="flex gap-4 mt-6 text-[#faf6ef]/55">
                <a href="#" className="hover:text-[#faf6ef] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="#" className="hover:text-[#faf6ef] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="#" className="hover:text-[#faf6ef] transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* FAQ accordion */}
            <div className="divide-y divide-[#faf6ef]/10 border-y border-[#faf6ef]/10">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  className="group"
                >
                  <summary className="flex items-center justify-between py-4 cursor-pointer text-[15px] font-medium text-[#faf6ef]">
                    {faq.q}
                    <svg
                      className="chev w-4 h-4 text-[#faf6ef]/40 transition-transform duration-250 shrink-0 ml-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="text-[13.5px] text-[#faf6ef]/55 max-w-[58ch] pb-4 leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Legal bar */}
          <div className="mt-10 pt-6 border-t border-[#faf6ef]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-[#faf6ef]/45">
            <p>(c) 2026 QueueCure Technologies Pvt Ltd.</p>
            <div className="flex gap-6">
              <a href="#" className="ulink no-underline text-inherit">Terms</a>
              <a href="#" className="ulink no-underline text-inherit">Privacy</a>
              <a href="#" className="ulink no-underline text-inherit">Status</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
