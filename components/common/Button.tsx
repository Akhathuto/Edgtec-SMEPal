
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading = false, className, ...props }) => {
  const baseClasses = "relative inline-flex items-center justify-center px-5 py-2.5 text-[13px] font-bold rounded-lg transition-all duration-300 active:scale-[0.98] focus:outline-none disabled:opacity-50 disabled:pointer-events-none overflow-hidden";
  
  const variantClasses = {
    primary: "text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm border border-indigo-700/20",
    secondary: "text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    danger: "text-white bg-rose-600 hover:bg-rose-700 shadow-sm",
    ghost: "text-slate-500 bg-transparent hover:bg-slate-100 hover:text-slate-900"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="opacity-80">Syncing...</span>
        </div>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
