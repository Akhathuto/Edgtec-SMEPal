import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import Logo from './common/Logo';

interface LoginPageProps {
  onLogin: (credentials: { email: string; name?: string; company?: string }) => void;
}

const FEATURES = [
  {
    title: "AI Compliance Engine",
    desc: "Stay ahead of CIPC and SARS requirements with automated roadmap generation.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318 2.074a1.5 1.5 0 001.364 0l5.318-2.074a12.02 12.02 0 005.618-14.377z" />
  },
  {
    title: "Neural Invoice Studio",
    desc: "Design professional, branded invoices in seconds using our generative AI.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  },
  {
    title: "Strategy Voice Assistant",
    desc: "Low-latency voice consultation for your toughest business questions.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  }
];

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    onLogin({ 
      email, 
      name: isLogin ? undefined : fullName, 
      company: isLogin ? undefined : companyName 
    });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white animate-fade-in selection:bg-indigo-100 selection:text-indigo-900">
      {/* Branding Section (Left/Top) */}
      <div className="lg:w-[45%] bg-indigo-600 p-8 sm:p-16 flex flex-col justify-between relative overflow-hidden text-white border-r border-indigo-500">
        {/* Dynamic Background Mesh */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="40" fill="url(#grad1)" className="animate-pulse" />
            <circle cx="80" cy="80" r="30" fill="url(#grad1)" className="animate-pulse" style={{ animationDelay: '1s' }} />
          </svg>
        </div>
        
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 inline-block p-4 rounded-[2rem] mb-12 shadow-2xl">
            <Logo />
          </div>
          
          <div className="space-y-6">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.85]">
              Neural Core <br /> 
              <span className="text-indigo-200">SA Enterprise.</span>
            </h1>
            <p className="text-xl text-indigo-100/70 font-medium max-w-md leading-relaxed italic">
              "The high-fidelity assistant for Small & Medium Enterprises in South Africa."
            </p>
          </div>

          {/* Feature Pulse Carousel */}
          <div className="mt-16 h-24 relative overflow-hidden">
            {FEATURES.map((f, i) => (
              <div 
                key={i}
                className={`absolute inset-0 flex items-start gap-4 transition-all duration-700 transform ${
                  i === activeFeature ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
                }`}
              >
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">{f.icon}</svg>
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest text-white">{f.title}</h4>
                  <p className="text-xs text-indigo-100/60 mt-1 max-w-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-8 mt-12">
          <div className="flex gap-10">
            <div>
              <p className="text-3xl font-black">2.5M+</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Active Telemetry</p>
            </div>
            <div>
              <p className="text-3xl font-black">100%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Local Sovereignty</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-300">Global Node Active</span>
          </div>
        </div>
      </div>

      {/* Form Section (Right/Bottom) */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16 bg-slate-50/50">
        <div className="w-full max-w-md space-y-10 animate-soft-reveal">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-4 border border-indigo-100">
              {isLogin ? 'Authorization Required' : 'Identity Initialization'}
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
              {isLogin ? 'Access Workspace' : 'Build Your Identity'}
            </h2>
            <p className="text-sm font-medium text-slate-400">
              {isLogin 
                ? 'Enter your encrypted credentials to continue.' 
                : 'Complete the form below to initialize your enterprise hub.'}
            </p>
          </div>

          <Card className="!rounded-[3rem] !p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border-0 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-1.5 w-24 bg-indigo-600"></div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-6 animate-fade-in">
                  <Input 
                    label="Full Name" 
                    id="fullName" 
                    required 
                    placeholder="Jane Naledi Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <Input 
                    label="Legal Entity Name" 
                    id="companyName" 
                    required 
                    placeholder="Innovate (Pty) Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              )}
              
              <Input 
                label="Corporate Email" 
                id="email" 
                type="email" 
                required 
                placeholder="name@business.co.za"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <div className="space-y-1 relative group/pass">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Secret Token</label>
                  {isLogin && <button type="button" className="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-600 transition-colors">Recover Account</button>}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    placeholder="••••••••"
                    className="form-input pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" isLoading={isLoading} className="w-full !py-5 !rounded-2xl shadow-2xl shadow-indigo-100 text-base font-black uppercase tracking-widest mt-4">
                {isLogin ? 'Authenticate Access' : 'Initialize Profile'}
              </Button>
            </form>
          </Card>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin 
                ? <><span className="opacity-50">New to SMEPal?</span> Create enterprise profile →</>
                : <><span className="opacity-50">Already registered?</span> Sign in to workspace →</>}
            </button>
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-col items-center gap-6">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Enterprise Security Standards</p>
             <div className="flex gap-10 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex flex-col items-center gap-1">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span className="text-[8px] font-black uppercase">FIPS-2</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                  <span className="text-[8px] font-black uppercase">PCI-DSS</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  <span className="text-[8px] font-black uppercase">POPIA</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;