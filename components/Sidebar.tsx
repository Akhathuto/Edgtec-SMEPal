import React, { useState } from 'react';
import { Tool } from '../types';
import Logo from './common/Logo';

interface SidebarProps {
  activeTool: Tool;
  onSelectTool: (tool: Tool) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: React.ReactElement<any>; label: Tool; isActive: boolean; onClick: () => void; isHidden?: boolean }> = ({ icon, label, isActive, onClick, isHidden }) => {
  if (isHidden) return null;
  return (
    <li className="px-3">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={`group flex items-center px-4 py-2.5 my-0.5 rounded-lg transition-all duration-200 relative ${
          isActive 
            ? 'bg-indigo-50 text-indigo-700 font-bold' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
        }`}
      >
        <span className={`mr-3 ${isActive ? 'text-indigo-600' : 'text-slate-400 transition-colors group-hover:text-slate-500'}`}>
          {React.cloneElement(icon, { className: 'h-4 w-4', strokeWidth: isActive ? 2.5 : 2 })}
        </span>
        <span className="text-[13px] tracking-tight">{label}</span>
        {isActive && (
          <div className="absolute right-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-l-full"></div>
        )}
      </a>
    </li>
  );
};

const icons: Record<Tool, React.ReactElement> = {
  [Tool.DASHBOARD]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  [Tool.ADVISOR]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  [Tool.INVOICE]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  [Tool.TAX]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 17h.01M12 17h.01M15 17h.01M9 14h.01M12 14h.01M15 14h.01M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>,
  [Tool.PAYROLL]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  [Tool.CONTRACT]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>,
  [Tool.CLIENTS]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  [Tool.COMPANY_REGISTRATION]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  [Tool.COMPLIANCE]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318 2.074a1.5 1.5 0 001.364 0l5.318-2.074a12.02 12.02 0 005.618-14.377z" /></svg>,
  [Tool.DIRECTOR_VERIFICATION]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 9l2 2 4-4" /></svg>,
  [Tool.EXPENSES]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  [Tool.MARKETING]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  [Tool.USER_PROFILE]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  [Tool.SETTINGS]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  [Tool.ABOUT]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  [Tool.CONTACT]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  [Tool.HELP]: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const navOrder: Tool[] = [
  Tool.DASHBOARD,
  Tool.ADVISOR,
  Tool.INVOICE,
  Tool.TAX,
  Tool.EXPENSES,
  Tool.MARKETING,
  Tool.PAYROLL,
  Tool.CONTRACT,
  Tool.CLIENTS,
  Tool.COMPANY_REGISTRATION,
  Tool.COMPLIANCE,
  Tool.DIRECTOR_VERIFICATION,
];

const secondaryNavOrder: Tool[] = [
  Tool.USER_PROFILE,
  Tool.SETTINGS,
  Tool.ABOUT,
  Tool.CONTACT,
  Tool.HELP,
]

const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool, isOpen, setIsOpen }) => {
  const [search, setSearch] = useState('');

  const sidebarClasses = `
    fixed lg:relative inset-y-0 left-0
    transform ${isOpen ? 'translateX(0)' : '-translate-x-full'} lg:translate-x-0
    transition-transform duration-500 cubic-bezier(0.2, 0, 0, 1)
    w-64 bg-white border-r border-slate-100 z-30 flex flex-col shadow-xl lg:shadow-none
  `;

  const filterTools = (tool: Tool) => tool.toLowerCase().includes(search.toLowerCase());

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-6 h-20">
          <Logo />
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 mb-6">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search features..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 pl-9 text-[12px] font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        
        <nav className="flex-1 px-1 py-2 overflow-y-auto scrollbar-hide">
          <ul className="space-y-0.5">
            {navOrder.map((tool) => (
              <NavItem 
                key={tool} 
                icon={icons[tool]}
                label={tool} 
                isActive={activeTool === tool} 
                onClick={() => { onSelectTool(tool); setSearch(''); }} 
                isHidden={!filterTools(tool)}
              />
            ))}
          </ul>
          
          <div className="mt-10 pt-6 border-t border-slate-50">
            <h6 className="px-7 text-[10px] font-extrabold text-slate-300 uppercase tracking-[0.2em] mb-4">Operations</h6>
            <ul className="space-y-0.5">
              {secondaryNavOrder.map((tool) => (
                <NavItem 
                  key={tool} 
                  icon={icons[tool]}
                  label={tool} 
                  isActive={activeTool === tool} 
                  onClick={() => { onSelectTool(tool); setSearch(''); }} 
                  isHidden={!filterTools(tool)}
                />
              ))}
            </ul>
          </div>
        </nav>
        
        <div className="p-4 mt-auto">
           <div className="bg-indigo-600 p-5 rounded-xl relative overflow-hidden shadow-lg shadow-indigo-100">
             <div className="relative z-10">
               <p className="text-[10px] font-extrabold text-indigo-100 uppercase tracking-widest mb-1">Upgrade</p>
               <h4 className="text-white font-bold text-sm mb-4 leading-tight">Professional Tier</h4>
               <button className="w-full bg-white text-indigo-600 py-2 rounded-lg text-[11px] font-extrabold hover:bg-slate-50 transition-colors shadow-sm">Go Unlimited</button>
             </div>
           </div>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-indigo-600/10 backdrop-blur-sm z-20 lg:hidden animate-fade-in"></div>}
    </>
  );
};

export default Sidebar;