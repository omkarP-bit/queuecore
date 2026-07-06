import { useCallback, useLayoutEffect, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Activity, Search } from 'lucide-react';

interface StaggeredNavProps {
  menuButtonColor?: string;
}

export default function StaggeredNav({
  menuButtonColor = '#ffffff',
}: StaggeredNavProps) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);

  const items = [
    { label: 'Find Hospital', href: '/patient/find' },
    { label: 'How It Works', href: '/patient/find' },
    { label: 'Dashboard', href: '/receptionist' },
    { label: 'Sign In', href: '/login' },
  ];

  const socialItems = [
    { label: 'Instagram', href: '#' },
    { label: 'Twitter', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      if (!panel || !preContainer) return;

      const preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      preLayerElsRef.current = preLayers;

      gsap.set([panel, ...preLayers], { xPercent: 100 });
      gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor]);

  const animateOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const panel = panelRef.current;
    const preContainer = preLayersRef.current;
    if (!panel || !preContainer) return;

    const preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
    const itemEls = Array.from(panel.querySelectorAll('.sm-item')) as HTMLElement[];
    const socialEls = Array.from(panel.querySelectorAll('.sm-social')) as HTMLElement[];

    if (itemEls.length) gsap.set(itemEls, { yPercent: 120, rotateX: 15, opacity: 0 });
    if (socialEls.length) gsap.set(socialEls, { y: 20, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => { busyRef.current = false; },
    });

    preLayers.forEach((el, i) => {
      tl.to(el, { xPercent: 0, duration: 0.45, ease: 'power4.out' }, i * 0.08);
    });

    tl.to(panel, { xPercent: 0, duration: 0.6, ease: 'power4.out' }, preLayers.length * 0.08 + 0.05);

    if (itemEls.length) {
      tl.to(itemEls, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power4.out',
        stagger: { each: 0.08, from: 'start' },
      }, '-=0.3');
    }

    if (socialEls.length) {
      tl.to(socialEls, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        stagger: { each: 0.06 },
      }, '-=0.3');
    }
  }, []);

  const animateClose = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const panel = panelRef.current;
    const preContainer = preLayersRef.current;
    if (!panel || !preContainer) return;

    const preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
    const all = [...preLayers.reverse(), panel];

    gsap.to(all, {
      xPercent: 100,
      duration: 0.3,
      ease: 'power3.in',
      stagger: { each: 0.04, from: 'start' },
      onComplete: () => { busyRef.current = false; },
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);
    if (target) animateOpen();
    else animateClose();
  }, [animateOpen, animateClose]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleMenu();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, toggleMenu]);

  return (
    <>
      {/* Layer backgrounds */}
      <div
        ref={preLayersRef}
        className="fixed top-0 bottom-0 right-0 z-40 w-full sm:w-[480px] pointer-events-none"
      >
        <div className="sm-prelayer absolute inset-0" style={{ background: '#090B10' }} />
        <div className="sm-prelayer absolute inset-0" style={{ background: '#1A6BFF' }} />
      </div>

      {/* Menu Panel */}
      <aside
        ref={panelRef}
        className="fixed top-0 bottom-0 right-0 z-50 flex flex-col w-full sm:w-[480px] bg-[#0D1117] overflow-y-auto pointer-events-auto"
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3" onClick={toggleMenu}>
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-white">QueueCure</span>
          </Link>
          <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-text-secondary">
            <Search className="w-4 h-4" />
          </div>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-8 sm:px-16 gap-3">
          {items.map((item, i) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={toggleMenu}
              className="sm-item group flex items-center gap-4 sm:gap-6 no-underline py-3"
            >
              <span className="text-xs sm:text-sm font-mono font-medium text-text-muted/50 min-w-[2ch] text-right">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <span className="text-3xl sm:text-5xl font-display font-bold text-white uppercase tracking-tighter transition-colors group-hover:text-primary">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="px-8 sm:px-16 pb-10 pt-8 border-t border-white/5">
          <p className="text-xs uppercase tracking-widest text-text-muted/60 mb-4 font-medium">Connect</p>
          <div className="flex gap-6 sm:gap-8">
            {socialItems.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="sm-social text-sm font-medium text-text-secondary hover:text-white transition-colors no-underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        ref={toggleBtnRef}
        onClick={toggleMenu}
        className="relative z-[60] w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors md:hidden"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <div className="relative w-5 h-5">
          <span
            className={`absolute top-1/2 left-0 w-full h-0.5 rounded-full -translate-y-1/2 transition-all duration-300 ${open ? 'rotate-45 bg-white' : 'bg-white'}`}
            style={{ transform: open ? 'rotate(45deg)' : undefined, top: open ? '50%' : '35%' }}
          />
          <span
            className={`absolute top-1/2 left-0 w-full h-0.5 rounded-full -translate-y-1/2 transition-all duration-300 ${open ? 'opacity-0' : 'bg-white'}`}
            style={{ top: '50%' }}
          />
          <span
            className={`absolute top-1/2 left-0 w-full h-0.5 rounded-full -translate-y-1/2 transition-all duration-300 ${open ? '-rotate-45 bg-white' : 'bg-white'}`}
            style={{ transform: open ? 'rotate(-45deg)' : undefined, top: open ? '50%' : '65%' }}
          />
        </div>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
