const testimonials = [
  {
    name: 'Sunita R.',
    location: 'Pune',
    text: 'I used to spend 3 hours at the clinic. Now I walk in 5 minutes before my turn. Absolutely game-changing.',
    rating: 5,
    role: 'Patient',
  },
  {
    name: 'Dr. Priya Sharma',
    location: 'City Hospital, Mumbai',
    text: 'QueueCure reduced our OPD crowding by 60%. Patients are calmer, staff are less stressed.',
    rating: 5,
    role: 'Cardiologist',
  },
  {
    name: 'Rajesh K.',
    location: 'Bangalore',
    text: 'The ETS is scarily accurate. I booked a token, reached exactly at the time, and was called in 2 minutes.',
    rating: 5,
    role: 'Patient',
  },
  {
    name: 'Amit Mehta',
    location: 'Fortis, Delhi',
    text: 'As a hospital admin, the real-time dashboard alone saved us hours of manual coordination daily.',
    rating: 5,
    role: 'Hospital Admin',
  },
  {
    name: 'Kavita D.',
    location: 'Mumbai',
    text: 'AI triage flagged my symptoms as urgent and got me seen in 15 minutes. It could have been serious.',
    rating: 5,
    role: 'Patient',
  },
  {
    name: 'Dr. Sanjay V.',
    location: 'Apollo, Bangalore',
    text: 'My reception team handles 40% more patients with the automated token and call system.',
    rating: 5,
    role: 'General Physician',
  },
  {
    name: 'Sunita R.',
    location: 'Pune',
    text: 'I used to spend 3 hours at the clinic. Now I walk in 5 minutes before my turn. Absolutely game-changing.',
    rating: 5,
    role: 'Patient',
  },
  {
    name: 'Dr. Priya Sharma',
    location: 'City Hospital, Mumbai',
    text: 'QueueCure reduced our OPD crowding by 60%. Patients are calmer, staff are less stressed.',
    rating: 5,
    role: 'Cardiologist',
  },
  {
    name: 'Rajesh K.',
    location: 'Bangalore',
    text: 'The ETS is scarily accurate. I booked a token, reached exactly at the time, and was called in 2 minutes.',
    rating: 5,
    role: 'Patient',
  },
  {
    name: 'Amit Mehta',
    location: 'Fortis, Delhi',
    text: 'As a hospital admin, the real-time dashboard alone saved us hours of manual coordination daily.',
    rating: 5,
    role: 'Hospital Admin',
  },
  {
    name: 'Kavita D.',
    location: 'Mumbai',
    text: 'AI triage flagged my symptoms as urgent and got me seen in 15 minutes. It could have been serious.',
    rating: 5,
    role: 'Patient',
  },
  {
    name: 'Dr. Sanjay V.',
    location: 'Apollo, Bangalore',
    text: 'My reception team handles 40% more patients with the automated token and call system.',
    rating: 5,
    role: 'General Physician',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#1A6BFF">
          <path d="M10 1l2.39 4.84L17.8 6.5l-4 3.91 1 5.09L10 13.5 5.2 15.5l1-5.09-4-3.91 5.41-.66L10 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsMarquee() {
  return (
    <div className="relative w-full overflow-hidden py-8">
      {/* Alpha masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 sm:w-32 bg-gradient-to-r from-bg via-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 sm:w-32 bg-gradient-to-l from-bg via-bg to-transparent" />

      {/* Marquee track row 1 */}
      <div
        className="flex gap-4 sm:gap-6 mb-4 sm:mb-6"
        style={{
          animation: 'marquee-scroll 45s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {testimonials.slice(0, 12).map((t, i) => (
          <div
            key={i}
            className="w-64 sm:w-80 shrink-0 rounded-2xl border border-white/10 bg-surface/90 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <StarRating count={t.rating} />
              <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">{t.location}</span>
            </div>
            <p className="text-sm sm:text-base text-text-primary leading-relaxed mb-3 sm:mb-4">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xs">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Marquee track row 2 (opposite direction for visual interest) */}
      <div
        className="flex gap-4 sm:gap-6"
        style={{
          animation: 'marquee-scroll-reverse 50s linear infinite',
          width: 'max-content',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {testimonials.slice(6, 18).map((t, i) => (
          <div
            key={i}
            className="w-64 sm:w-80 shrink-0 rounded-2xl border border-white/10 bg-surface/90 p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <StarRating count={t.rating} />
              <span className="text-[10px] sm:text-[11px] font-mono text-text-muted">{t.location}</span>
            </div>
            <p className="text-sm sm:text-base text-text-primary leading-relaxed mb-3 sm:mb-4">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-display font-bold text-xs">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs text-text-muted">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="marquee-scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
