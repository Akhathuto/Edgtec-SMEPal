
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  delay?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title, delay = "0s" }) => {
  return (
    <div 
      className={`bg-white card-elevation rounded-2xl overflow-hidden animate-soft-reveal ${className}`}
      style={{ animationDelay: delay }}
    >
      {title && (
        <div className="px-8 py-5 border-b border-slate-50 bg-white/50">
          <h3 className="text-[13px] font-extrabold text-slate-800 uppercase tracking-wider">{title}</h3>
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default Card;
