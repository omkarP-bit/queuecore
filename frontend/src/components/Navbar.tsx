import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-lg border-b border-white/5">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-white">QueueCure</span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-sm">
          <div className="relative group">
            <button className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors">
              For Patients <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <Link to="/patient/find" className="text-text-secondary hover:text-white transition-colors">Find Hospitals</Link>
          <Link to="/receptionist" className="text-text-secondary hover:text-white transition-colors">Dashboard</Link>
          <Link to="/login" className="text-text-secondary hover:text-white transition-colors">Login</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/patient/find" className="btn-primary hidden md:inline-flex items-center justify-center text-sm">
            Get Started
          </Link>
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-text-primary hover:bg-white/5 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="absolute inset-x-4 top-full mt-2 rounded-[28px] bg-surface/95 backdrop-blur-xl border border-white/10 px-5 py-4 shadow-modal lg:hidden">
          <Link to="/patient/find" onClick={() => setIsOpen(false)} className="block text-[15px] text-text-secondary hover:text-text-primary py-3 border-b border-white/5">Find Hospitals</Link>
          <Link to="/receptionist" onClick={() => setIsOpen(false)} className="block text-[15px] text-text-secondary hover:text-text-primary py-3 border-b border-white/5">Dashboard</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} className="block text-[15px] text-text-secondary hover:text-text-primary py-3">Login</Link>
        </div>
      )}
    </header>
  );
}
