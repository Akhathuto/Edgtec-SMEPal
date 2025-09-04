import React from 'react';
import { Tool } from '../types';
import Logo from './common/Logo';
import Button from './common/Button';

interface SidebarProps {
  activeTool: Tool;
  onSelectTool: (tool: Tool) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: JSX.Element; label: Tool; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 my-1 rounded-lg text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200 group relative ${isActive ? 'bg-indigo-50 font-semibold text-indigo-700' : ''}`}
    >
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-indigo-600 transition-transform duration-300 scale-y-0 group-hover:scale-y-100 ${isActive ? 'scale-y-100' : ''}`}></div>
      <span className={`mr-4 transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`}>{icon}</span>
      <span>{label}</span>
    </a>
  </li>
);

const icons: Record<Tool, JSX.Element> = {
  [Tool.INVOICE]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  [Tool.TAX]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 17h.01M12 17h.01M15 17h.01M9 14h.01M12 14h.01M15 14h.01M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg>,
  [Tool.PAYROLL]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  [Tool.CONTRACT]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>,
  [Tool.CLIENTS]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  [Tool.COMPANY_REGISTRATION]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  [Tool.COMPLIANCE]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318 2.074a1.5 1.5 0 001.364 0l5.318-2.074a12.02 12.02 0 005.618-14.377z" /></svg>,
  [Tool.DIRECTOR_VERIFICATION]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 9l2 2 4-4" /></svg>,
  [Tool.USER_PROFILE]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  [Tool.ABOUT]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  [Tool.CONTACT]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  [Tool.HELP]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const navOrder: Tool[] = [
  Tool.INVOICE,
  Tool.TAX,
  Tool.PAYROLL,
  Tool.CONTRACT,
  Tool.CLIENTS,
  Tool.COMPANY_REGISTRATION,
  Tool.COMPLIANCE,
  Tool.DIRECTOR_VERIFICATION,
];

const secondaryNavOrder: Tool[] = [
  Tool.USER_PROFILE,
  Tool.ABOUT,
  Tool.CONTACT,
  Tool.HELP,
]


const Sidebar: React.FC<SidebarProps> = ({ activeTool, onSelectTool, isOpen, setIsOpen }) => {
  const sidebarClasses = `
    absolute lg:relative inset-y-0 left-0
    transform ${isOpen ? 'translateX(0)' : '-translate-x-full'} lg:translate-x-0
    transition-transform duration-300 ease-in-out
    w-64 bg-white border-r border-slate-200 z-30 flex flex-col
  `;

  return (
    <>
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 h-16">
          <Logo />
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul>
            {navOrder.map((tool) => (
              <NavItem 
                key={tool} 
                icon={icons[tool]}
                label={tool} 
                isActive={activeTool === tool} 
                onClick={() => onSelectTool(tool)} 
              />
            ))}
          </ul>
           <div className="mt-4 pt-4 border-t border-slate-200">
             <h6 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Support</h6>
              <ul>
                {secondaryNavOrder.map((tool) => (
                  <NavItem 
                    key={tool} 
                    icon={icons[tool]}
                    label={tool} 
                    isActive={activeTool === tool} 
                    onClick={() => onSelectTool(tool)} 
                  />
                ))}
              </ul>
           </div>
        </nav>
        <div className="p-4 border-t border-slate-200">
           <div className="bg-slate-800 p-5 rounded-lg text-center text-white relative overflow-hidden">
             <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500 rounded-full opacity-20"></div>
             <div className="absolute -bottom-8 -left-2 w-24 h-24 bg-indigo-500 rounded-full opacity-10"></div>
             <h4 className="font-semibold text-base z-10 relative">Unlock Premium Features</h4>
             <p className="text-sm opacity-70 mt-1 mb-4 z-10 relative">Upgrade to Pro for unlimited usage and advanced tools.</p>
             <Button className="w-full z-10 relative">Upgrade Now</Button>
           </div>
        </div>
      </aside>
       {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
    </>
  );
};

export default Sidebar;