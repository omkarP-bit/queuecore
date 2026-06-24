import { useRef, useEffect, useState } from 'react';
import { PanelLeft, ChevronLeft, ChevronRight, Monitor, RotateCw, Share, Plus, Copy, Grid, Compass, Layers, ListTodo } from 'lucide-react';
import Logo from './Logo';

export default function DashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !innerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const innerWidth = 896; // Fixed design width
      const newScale = containerWidth / innerWidth;
      setScale(newScale);
      setHeight(innerRef.current.offsetHeight * newScale);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="animate-hero-rise [animation-delay:620ms] relative z-0 w-[92%] sm:w-[84%] lg:w-[72%] max-w-4xl mx-auto shrink-0 -mb-10 sm:-mb-20 lg:-mb-32"
      ref={containerRef}
      style={{ height: height > 0 ? height : 'auto' }}
    >
      <div 
        ref={innerRef}
        style={{
          width: '896px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="rounded-t-2xl overflow-hidden bg-[#1a1a1c] shadow-[0_-20px_80px_rgba(0,0,0,0.35)] ring-1 ring-white/10 text-left flex flex-col absolute top-0 left-0"
      >
        {/* Title bar */}
        <div className="bg-[#242427] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-4 flex items-center gap-2">
              <PanelLeft className="w-3.5 h-3.5 text-white/40" />
              <ChevronLeft className="w-3.5 h-3.5 text-white/40" />
              <ChevronRight className="w-3.5 h-3.5 text-white/25" />
            </div>
          </div>
          <div className="bg-[#1a1a1c] rounded-md px-6 py-1 text-[10px] text-white/60 flex items-center gap-1.5 min-w-[200px] justify-center">
            <Monitor className="w-3 h-3" />
            queuecure.ai
          </div>
          <div className="flex items-center gap-2">
            <RotateCw className="w-3.5 h-3.5 text-white/40" />
            <Share className="w-3.5 h-3.5 text-white/40" />
            <Plus className="w-3.5 h-3.5 text-white/40" />
            <Copy className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex flex-1 min-h-[480px]">
          {/* Sidebar */}
          <div className="w-[22%] border-r border-white/5 bg-[#1e1e21] px-3 py-3.5 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Logo className="w-4 h-4 text-white/70" />
              <Grid className="w-3.5 h-3.5 text-white/30" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-4 h-4 rounded bg-[#e8553f] text-[9px] font-bold text-white">C</div>
              <span className="text-[10px] text-white/80">City Hospital</span>
            </div>

            <nav className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-2 text-[10px] text-white/60 hover:text-white/80 transition-colors">
                <Compass className="w-3.5 h-3.5" /> Live Queues
              </a>
              <a href="#" className="flex items-center gap-2 text-[10px] text-white/60 hover:text-white/80 transition-colors">
                <Layers className="w-3.5 h-3.5" /> Doctor Roster
              </a>
              <a href="#" className="flex items-center gap-2 text-[10px] text-white/60 hover:text-white/80 transition-colors">
                <ListTodo className="w-3.5 h-3.5" /> Appointments
              </a>
            </nav>

            <div className="mt-auto">
              <div className="text-[9px] uppercase tracking-wider text-white/40 mb-2">Active Doctors</div>
              <div className="flex flex-col gap-2">
                {['Dr. Sharma', 'Dr. Gupta', 'Dr. Patel'].map((doctor, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] text-white/60">
                    <span className="truncate pr-2">{doctor}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28c840]/70 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 bg-[#1a1a1c]">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#e8553f] text-white font-bold text-lg">C</div>
                <div>
                  <h2 className="text-sm font-medium text-white m-0">City Hospital</h2>
                  <p className="text-[10px] text-white/45 m-0">OPD Overview</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors ring-1 ring-white/5">
                <Plus className="w-3 h-3 text-[#28c840]" /> New Token
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 divide-x divide-white/5 rounded-xl bg-white/[0.03] ring-1 ring-white/5 mb-8">
              <div className="p-4 flex flex-col">
                <span className="text-[8px] tracking-wider text-white/35 mb-1">ACTIVE TOKENS</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-medium text-white">62</span>
                  <span className="text-[10px] text-white/40">In waiting room</span>
                </div>
              </div>
              <div className="p-4 flex flex-col">
                <span className="text-[8px] tracking-wider text-white/35 mb-1">DOCTORS</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-medium text-white">12</span>
                  <span className="text-[10px] text-white/40">On duty</span>
                </div>
              </div>
              <div className="p-4 flex flex-col">
                <span className="text-[8px] tracking-wider text-white/35 mb-1">AVG WAIT</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-medium text-white">14m</span>
                  <span className="text-[10px] text-white/40">Per patient</span>
                </div>
              </div>
              <div className="p-4 flex flex-col">
                <span className="text-[8px] tracking-wider text-white/35 mb-1">CAPACITY</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-medium text-white">85%</span>
                  <span className="text-[10px] text-white/40">OPD full</span>
                </div>
              </div>
            </div>

            {/* Subject cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['Cardiology', 'Orthopedics', 'Pediatrics'].map((subject) => (
                <div key={subject} className="p-4 rounded-lg bg-white/[0.03] ring-1 ring-white/5">
                  <div className="text-xs font-medium text-white/80 mb-2">{subject}</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#aa3bff] w-1/3 h-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {/* Drafting inbox */}
            <div>
              <div className="text-[11px] font-medium text-white/60 mb-3">Active Tokens</div>
              <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5">
                {[
                  { q: 'Token #42 - Walk-in', vol: 'Dr. Sharma', diff: 'Normal', status: 'Serving', statusColor: 'text-[#febc2e]/80' },
                  { q: 'Token #43 - Online', vol: 'Dr. Sharma', diff: 'Normal', status: 'Next', statusColor: 'text-[#28c840]/70' },
                  { q: 'Token #01 - Emergency', vol: 'Dr. Gupta', diff: 'Urgent', status: 'Triage', statusColor: 'text-[#ff5f57]/80' },
                  { q: 'Token #44 - Walk-in', vol: 'Dr. Sharma', diff: 'Normal', status: 'Waiting', statusColor: 'text-white/40' },
                  { q: 'Token #12 - Online', vol: 'Dr. Patel', diff: 'Normal', status: 'Waiting', statusColor: 'text-white/40' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center px-4 py-3 border-b border-white/5 last:border-0">
                    <div className="flex-1 text-[11px] text-white/80 truncate pr-4">{row.q}</div>
                    <div className="w-20 text-[10px] text-white/40">{row.vol}</div>
                    <div className="w-16 text-[10px] text-white/40">{row.diff}</div>
                    <div className={`w-16 text-[10px] ${row.statusColor}`}>{row.status}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
