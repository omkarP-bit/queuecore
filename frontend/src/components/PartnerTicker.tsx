import { useRef } from 'react';

const partners = [
  { name: 'Apollo Clinic', initials: 'AC', color: '#1A6BFF' },
  { name: 'City Hospital', initials: 'CH', color: '#00C48C' },
  { name: 'Fortis', initials: 'FH', color: '#FF6B35' },
  { name: 'Manipal', initials: 'MH', color: '#E53E3E' },
  { name: 'Max Healthcare', initials: 'MH', color: '#1A6BFF' },
  { name: 'Medanta', initials: 'MD', color: '#00C48C' },
  { name: 'Narayana Health', initials: 'NH', color: '#FF6B35' },
  { name: 'AIIMS', initials: 'AI', color: '#E53E3E' },
  { name: 'KIMS', initials: 'KI', color: '#1A6BFF' },
  { name: 'Care Hospital', initials: 'CH', color: '#00C48C' },
  { name: 'Apollo Clinic', initials: 'AC', color: '#1A6BFF' },
  { name: 'City Hospital', initials: 'CH', color: '#00C48C' },
  { name: 'Fortis', initials: 'FH', color: '#FF6B35' },
  { name: 'Manipal', initials: 'MH', color: '#E53E3E' },
  { name: 'Max Healthcare', initials: 'MH', color: '#1A6BFF' },
  { name: 'Medanta', initials: 'MD', color: '#00C48C' },
  { name: 'Narayana Health', initials: 'NH', color: '#FF6B35' },
  { name: 'AIIMS', initials: 'AI', color: '#E53E3E' },
  { name: 'KIMS', initials: 'KI', color: '#1A6BFF' },
  { name: 'Care Hospital', initials: 'CH', color: '#00C48C' },
];

export default function PartnerTicker() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full overflow-hidden py-10">
      {/* Edge masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-bg to-transparent" />

      {/* Scrolling track */}
      <div
        ref={containerRef}
        className="flex gap-8 sm:gap-12 items-center [--ticker-duration:40s]"
        style={{
          animation: `ticker-scroll var(--ticker-duration) linear infinite`,
          width: 'max-content',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
      >
        {partners.map((partner, i) => (
          <div
            key={i}
            className="flex items-center gap-3 sm:gap-4 shrink-0"
          >
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-mono font-bold text-xs sm:text-sm"
              style={{ background: partner.color }}
            >
              {partner.initials}
            </div>
            <span className="text-sm sm:text-base text-text-secondary font-medium whitespace-nowrap">
              {partner.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="ticker-scroll"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
