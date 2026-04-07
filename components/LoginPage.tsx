import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import Logo from './common/Logo';
import { loginWithGoogle, loginWithGithub, loginWithMicrosoft, loginWithEmail, registerWithEmail } from '../firebase';

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

interface LoginPageProps {
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGithub();
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to sign in with GitHub.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithMicrosoft();
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Failed to sign in with Microsoft.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
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
            {onBack && (
              <button 
                onClick={onBack}
                className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors group"
              >
                <svg className="h-3 w-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
            )}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-widest uppercase mb-4 border border-indigo-100">
              Authorization Required
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
              Access Workspace
            </h2>
            <p className="text-sm font-medium text-slate-400">
              Sign in with your preferred provider to access your enterprise hub.
            </p>
          </div>

          <Card className="!rounded-[3rem] !p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border-0 bg-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-1.5 w-24 bg-indigo-600"></div>
            
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium animate-shake">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleGoogleLogin} 
                isLoading={isLoading} 
                className="w-full !py-5 !rounded-2xl shadow-2xl shadow-indigo-100 text-base font-black uppercase tracking-widest flex items-center justify-center gap-3"
              >
                {!isLoading && (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                Google
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleGithubLogin} 
                  isLoading={isLoading} 
                  variant="secondary"
                  className="!py-4 !rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-slate-200"
                >
                  {!isLoading && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  )}
                  GitHub
                </Button>

                <Button 
                  onClick={handleMicrosoftLogin} 
                  isLoading={isLoading} 
                  variant="secondary"
                  className="!py-4 !rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-slate-200"
                >
                  {!isLoading && (
                    <svg className="h-4 w-4" viewBox="0 0 23 23">
                      <path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/>
                    </svg>
                  )}
                  Microsoft
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                  <span className="bg-white px-4 text-slate-300">Or</span>
                </div>
              </div>

              {!showEmailForm ? (
                <Button 
                  onClick={() => setShowEmailForm(true)}
                  variant="secondary"
                  className="w-full !py-4 !rounded-2xl text-xs font-black uppercase tracking-widest border-slate-100 hover:bg-slate-50"
                >
                  Sign in with Email
                </Button>
              ) : (
                <form onSubmit={handleEmailAuth} className="space-y-4 animate-soft-reveal">
                  {isRegistering && (
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 ml-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    type="submit"
                    isLoading={isLoading}
                    className="w-full !py-4 !rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100"
                  >
                    {isRegistering ? 'Create Account' : 'Sign In'}
                  </Button>
                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      {isRegistering ? 'Already have an account? Sign In' : 'New here? Create an account'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Card>

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
