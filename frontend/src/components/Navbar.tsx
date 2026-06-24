import { useState } from 'react';
import { ChevronDown, Menu, X, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-lg border-b border-white/5">
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-[-0.02em] text-text-primary font-display">QueueCure</span>
          </a>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="flex items-center gap-1 text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-300">
            Features <ChevronDown className="w-3.5 h-3.5" />
          </a>
          <a href="#" className="text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-300">For Hospitals</a>
          <a href="#" onClick={(e) => {e.preventDefault(); navigate('/patient/find');}} className="text-[13px] text-text-secondary hover:text-text-primary transition-colors duration-300">Find Doctors</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="btn-primary text-[13px] hidden md:flex items-center justify-center"
          >
            Book Token
          </button>
          
          <button 
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-text-primary hover:bg-white/5 transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
      
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-surface/95 backdrop-blur-xl border border-white/10 px-5 py-3 flex flex-col shadow-modal md:hidden">
          <a href="#" className="text-[15px] text-text-secondary hover:text-text-primary border-b border-white/5 py-3 last:border-b-0 font-medium block transition-colors">Features</a>
          <a href="#" className="text-[15px] text-text-secondary hover:text-text-primary border-b border-white/5 py-3 last:border-b-0 font-medium block transition-colors">For Hospitals</a>
          <a href="#" onClick={(e) => {e.preventDefault(); navigate('/patient/find');}} className="text-[15px] text-text-secondary hover:text-text-primary border-b border-white/5 py-3 last:border-b-0 font-medium block transition-colors">Find Doctors</a>
        </div>
      )}
    </header>
  );
}
