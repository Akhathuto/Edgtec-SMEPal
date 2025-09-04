import React from 'react';
import type { Tool } from '../types';

interface HeaderProps {
  activeTool: Tool;
  onMenuClick: () => void;
}

const MenuIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ activeTool, onMenuClick }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-slate-100 h-16">
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-800">
        <MenuIcon />
      </button>
      <h1 className="text-xl font-semibold text-slate-800 lg:hidden">{activeTool}</h1>
      <div className="flex-1 flex justify-end items-center space-x-4">
        <button className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-colors">
          Go Pro
        </button>
        <img
          className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2 ring-slate-200"
          src="https://picsum.photos/100"
          alt="User avatar"
        />
      </div>
    </header>
  );
};

export default Header;