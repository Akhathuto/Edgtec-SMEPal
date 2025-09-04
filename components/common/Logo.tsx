import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center gap-2">
            <svg 
                width="36" 
                height="36" 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-hidden="true"
            >
                <path
                    className="logo-swoosh"
                    d="M40 24c0 8.837-7.163 16-16 16S8 32.837 8 24 15.163 8 24 8"
                    stroke="#4f46e5"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                 <path
                    className="logo-dot"
                    d="M24 24m-6 0a6 6 0 1 1 12 0a6 6 0 1 1-12 0"
                    fill="#4338ca"
                />
            </svg>
             <h1 className="text-2xl font-bold text-indigo-600">SME<span className="font-light text-slate-700">Pal</span></h1>
        </div>
    );
};

export default Logo;
