import React from 'react';
import type { Tool } from '../types';
// FIX: Import the Button component.
import Button from './common/Button';

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
    <header className="flex-shrink-0 flex items-center justify-between p-4 bg-white border-b border-slate-200 h-16">
      <button onClick={onMenuClick} className="lg:hidden text-slate-500 hover:text-slate-800">
        <MenuIcon />
      </button>
      <div className="flex-1 flex justify-end items-center space-x-4">
        {/* Placeholder for potential future search bar or actions */}
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="primary">
          Go Pro
        </Button>
        <img
          className="h-9 w-9 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-200"
          src="https://picsum.photos/100"
          alt="User avatar"
        />
      </div>
    </header>
  );
};

export default Header;