import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Zap, 
  MessageSquare, 
  FileText, 
  Calculator, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';
import Logo from './common/Logo';
import Button from './common/Button';

interface LandingPageProps {
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSignIn }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#about" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">About</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onSignIn}
              className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <Button 
              onClick={onSignIn}
              className="!rounded-full !px-6 !py-2.5 shadow-xl shadow-indigo-100"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Next-Gen Business Intelligence
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 mb-8"
          >
            The Neural Core of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">SA Enterprise.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            SMEPal is the high-fidelity AI assistant designed specifically for South African businesses. 
            Automate compliance, master your finances, and scale with intelligence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              onClick={onSignIn}
              className="!px-10 !py-5 !text-lg !rounded-2xl shadow-2xl shadow-indigo-200 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <button className="px-10 py-5 text-lg font-bold text-slate-600 hover:text-indigo-600 transition-all flex items-center gap-2">
              Watch Demo
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-slate-600 border-b-[5px] border-b-transparent ml-1"></div>
              </div>
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-24 pt-12 border-t border-slate-100"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Trusted by 500+ SA Enterprises</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-2xl font-black tracking-tighter text-slate-800">CIPC Connect</div>
              <div className="text-2xl font-black tracking-tighter text-slate-800">SARS Ready</div>
              <div className="text-2xl font-black tracking-tighter text-slate-800">Standard Bank</div>
              <div className="text-2xl font-black tracking-tighter text-slate-800">FNB Business</div>
              <div className="text-2xl font-black tracking-tighter text-slate-800">Capitec</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">Everything you need to scale.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              We've built the most comprehensive toolset for the modern South African entrepreneur.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                title: "AI Compliance Engine",
                desc: "Automated roadmaps for CIPC, SARS, and B-BBEE requirements.",
                icon: <Shield className="h-6 w-6 text-indigo-600" />,
                color: "bg-indigo-50"
              },
              {
                title: "Neural Invoice Studio",
                desc: "Generate professional, branded invoices in seconds using generative AI.",
                icon: <FileText className="h-6 w-6 text-emerald-600" />,
                color: "bg-emerald-50"
              },
              {
                title: "Strategy Voice Assistant",
                desc: "Real-time voice consultation for your toughest business questions.",
                icon: <MessageSquare className="h-6 w-6 text-amber-600" />,
                color: "bg-amber-50"
              },
              {
                title: "Tax Master",
                desc: "Instant VAT and Income Tax calculations tailored to SA law.",
                icon: <Calculator className="h-6 w-6 text-rose-600" />,
                color: "bg-rose-50"
              },
              {
                title: "Client CRM",
                desc: "Manage relationships and track interactions with high precision.",
                icon: <Users className="h-6 w-6 text-blue-600" />,
                color: "bg-blue-50"
              },
              {
                title: "Global Node Security",
                desc: "Enterprise-grade data sovereignty and local POPIA compliance.",
                icon: <Lock className="h-6 w-6 text-slate-600" />,
                color: "bg-slate-100"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 bg-indigo-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            <div>
              <div className="text-6xl font-black mb-4 tracking-tighter">R2.5B+</div>
              <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Invoices Processed</p>
            </div>
            <div>
              <div className="text-6xl font-black mb-4 tracking-tighter">15k+</div>
              <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">SA Businesses</p>
            </div>
            <div>
              <div className="text-6xl font-black mb-4 tracking-tighter">99.9%</div>
              <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs">Compliance Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">Simple, transparent pricing.</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Choose the plan that fits your business stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                desc: "For solo entrepreneurs starting out.",
                features: ["Basic Invoicing", "Tax Calculator", "AI Advisor (Limited)", "1 User"],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Professional",
                price: "R299",
                period: "/mo",
                desc: "For growing teams and established SMEs.",
                features: ["Neural Invoicing", "Full Compliance Engine", "Unlimited AI Advisor", "Up to 5 Users", "Priority Support"],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                desc: "For large-scale operations and groups.",
                features: ["Custom Integrations", "Dedicated Account Manager", "White-label Options", "Unlimited Users", "SLA Guarantees"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`p-12 rounded-[3rem] border ${
                  plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-100 relative' : 'border-slate-100'
                } bg-white flex flex-col`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-800 mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm font-medium">{plan.desc}</p>
                </div>
                <div className="mb-10 flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 font-bold">{plan.period}</span>}
                </div>
                <div className="space-y-4 mb-12 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={onSignIn}
                  variant={plan.popular ? 'primary' : 'secondary'}
                  className={`w-full !py-4 !rounded-2xl text-sm font-black uppercase tracking-widest ${
                    !plan.popular ? 'border-slate-200' : ''
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-indigo-600 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8">
                Ready to transform your <br /> business operations?
              </h2>
              <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto font-medium">
                Join thousands of South African entrepreneurs who are scaling faster with SMEPal.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button 
                  onClick={onSignIn}
                  className="!bg-white !text-indigo-600 !px-12 !py-6 !text-lg !rounded-2xl shadow-2xl shadow-indigo-900/20 hover:!bg-indigo-50"
                >
                  Get Started Now
                </Button>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <img 
                        key={i}
                        src={`https://picsum.photos/seed/user${i}/100/100`} 
                        className="w-10 h-10 rounded-full border-2 border-indigo-600"
                        alt="User"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Trusted by 15k+ users</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-1">
              <div className="mb-8">
                <Logo />
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Empowering South African SMEs with enterprise-grade AI intelligence and compliance automation.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Roadmap</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">POPIA Compliance</a></li>
                <li><a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              © 2026 Neural Core SA Enterprise. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Globe className="h-4 w-4 text-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">South Africa (EN)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
