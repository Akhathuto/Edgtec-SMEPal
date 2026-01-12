import React, { useState, useRef, useEffect } from 'react';
import type { Tool } from '../types';

interface HeaderProps {
  activeTool: Tool;
  onMenuClick: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTool, onMenuClick, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Jane Doe');
  const [userRole, setUserRole] = useState('Administrator');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load identity from session
    const sessionStr = localStorage.getItem('smepal_session');
    if (sessionStr) {
        const session = JSON.parse(sessionStr);
        if (session.name) setUserName(session.name);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex-shrink-0 flex items-center justify-between px-8 bg-white border-b border-slate-100 h-16 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick} 
          className="lg:hidden text-slate-500 hover:text-indigo-600 p-2 hover:bg-slate-50 rounded-lg transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Workspace</span>
            <h2 className="text-[14px] font-bold text-slate-900 tracking-tight">{activeTool}</h2>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50/50 rounded-full border border-emerald-100/50">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Operational</span>
        </div>
        
        <div className="h-4 w-px bg-slate-100 hidden sm:block"></div>

        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="hidden sm:block text-right">
              <p className="text-[12px] font-extrabold text-slate-900 leading-none mb-0.5 group-hover:text-indigo-600 transition-colors">{userName}</p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{userRole}</p>
            </div>
            <div className="relative hover:ring-4 hover:ring-indigo-50 transition-all rounded-lg overflow-hidden border border-slate-100">
              <img
                className="h-8 w-8 object-cover"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=4f46e5&color=fff&bold=true`}
                alt="User avatar"
              />
            </div>
          </div>

          {/* User Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-scale-in origin-top-right">
              <button 
                onClick={() => onLogout?.()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Terminate Session
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;