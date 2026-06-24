import { useState } from 'react';
import Logo from './Logo';
import { ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="animate-fade-down relative z-20 w-full">
      <div className="flex flex-row items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
        <div className="flex items-center gap-2">
          <Logo className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900" />
          <span className="font-semibold text-gray-900 text-lg sm:text-xl tracking-tight">QueueCure</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="flex items-center gap-1 text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
            Features <ChevronDown className="w-3.5 h-3.5" />
          </a>
          <a href="#" className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors">For Hospitals</a>
          <a href="#" className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors">Find Doctors</a>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="bg-gray-900 text-white text-[13px] font-medium px-4 sm:px-5 py-2 rounded-full hover:bg-gray-800 transition-colors hidden md:block">
            Book Token
          </button>
          
          <button 
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-gray-900 hover:bg-gray-900/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute left-4 right-4 top-full mt-2 rounded-2xl bg-white/80 backdrop-blur-xl ring-1 ring-gray-200 px-5 py-3 animate-fade-up flex flex-col shadow-lg md:hidden">
          <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-200 py-3 last:border-b-0 font-medium block">Features</a>
          <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-200 py-3 last:border-b-0 font-medium block">For Hospitals</a>
          <a href="#" className="text-[15px] text-gray-700 hover:text-gray-900 border-b border-gray-200 py-3 last:border-b-0 font-medium block">Find Doctors</a>
        </div>
      )}
    </nav>
  );
}
