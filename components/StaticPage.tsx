import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Globe, 
  Shield, 
  Lock, 
  FileText, 
  Users, 
  Briefcase, 
  BookOpen, 
  Mail, 
  MapPin, 
  Phone,
  CheckCircle2,
  Zap,
  Cpu,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  ExternalLink,
  Target,
  Rocket
} from 'lucide-react';
import Logo from './common/Logo';
import Button from './common/Button';

export type StaticPageSlug = 
  | 'features' | 'pricing' | 'roadmap' | 'api'
  | 'about' | 'careers' | 'blog' | 'contact'
  | 'privacy' | 'terms' | 'popia' | 'cookie';

interface StaticPageProps {
  slug: StaticPageSlug;
  onBack: () => void;
  onNavigate: (slug: StaticPageSlug) => void;
}

const STATIC_CONTENT: Record<StaticPageSlug, { title: string; subtitle: string; icon: React.ReactNode; content: React.ReactNode }> = {
  features: {
    title: 'Product Features',
    subtitle: 'The Neural Core of SA Enterprise Intelligence.',
    icon: <Zap className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">AI Compliance Engine</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Navigating the regulatory landscape in South Africa can be a full-time job. Our AI Compliance Engine automates the heavy lifting, ensuring you never miss a CIPC filing or SARS deadline.
            </p>
            <ul className="space-y-3">
              {['Automated CIPC Annual Returns', 'SARS eFiling Integration', 'B-BBEE Scorecard Tracking', 'POPIA Audit Trails'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-indigo-50 rounded-[2rem] p-8 aspect-square flex items-center justify-center relative overflow-hidden">
            <Shield className="h-32 w-32 text-indigo-200 absolute -bottom-8 -right-8 rotate-12" />
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase">Compliance Status</p>
                  <p className="text-lg font-black text-slate-900">98.4% Secure</p>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-emerald-500"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
          <div className="md:order-2">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Neural Invoice Studio</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Invoicing is more than just a request for payment. It's a touchpoint with your brand. Our Neural Studio uses generative AI to create professional, high-conversion invoices that reflect your business's excellence.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xl font-black text-indigo-600 mb-1">2s</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Generation Time</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xl font-black text-indigo-600 mb-1">100%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">VAT Compliant</p>
              </div>
            </div>
          </div>
          <div className="md:order-1 bg-emerald-50 rounded-[2rem] p-8 aspect-square flex items-center justify-center relative overflow-hidden">
            <FileText className="h-32 w-32 text-emerald-200 absolute -top-8 -left-8 -rotate-12" />
            <div className="relative z-10 bg-white p-4 rounded-xl shadow-2xl border border-emerald-100 w-full max-w-[280px]">
              <div className="h-4 w-24 bg-slate-100 rounded mb-4"></div>
              <div className="space-y-2 mb-6">
                <div className="h-2 w-full bg-slate-50 rounded"></div>
                <div className="h-2 w-full bg-slate-50 rounded"></div>
                <div className="h-2 w-2/3 bg-slate-50 rounded"></div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="h-4 w-16 bg-indigo-100 rounded"></div>
                <div className="h-6 w-20 bg-indigo-600 rounded"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  },
  pricing: {
    title: 'Pricing Plans',
    subtitle: 'Scalable intelligence for every stage of growth.',
    icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Starter",
              price: "Free",
              desc: "Perfect for side hustles.",
              features: ['5 Invoices / mo', 'Basic Tax Calc', 'POPIA Basics', 'Community Support']
            },
            {
              name: "Professional",
              price: "R299",
              period: "/mo",
              desc: "For growing SA teams.",
              features: ['Unlimited Invoices', 'Full Compliance Engine', 'Voice AI Assistant', 'Priority Support', 'Custom Branding'],
              popular: true
            },
            {
              name: "Enterprise",
              price: "Custom",
              desc: "For large-scale groups.",
              features: ['SLA Guarantees', 'Dedicated Manager', 'API Access', 'On-premise Options', 'White-labeling']
            }
          ].map((plan, i) => (
            <div key={i} className={`p-8 rounded-3xl border ${plan.popular ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-slate-100'} bg-white flex flex-col`}>
              <h3 className="text-lg font-black text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-xs text-slate-400 font-bold mb-6">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-400 font-bold">{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full !py-3 !text-xs">
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </Button>
            </div>
          ))}
        </div>
        <div className="bg-slate-50 rounded-3xl p-8 text-center">
          <h3 className="font-black text-slate-900 mb-2">Need a custom solution?</h3>
          <p className="text-sm text-slate-500 mb-6">We offer tailored packages for franchises and business associations.</p>
          <button className="text-indigo-600 font-black text-sm hover:underline">Talk to our partnership team →</button>
        </div>
      </div>
    )
  },
  roadmap: {
    title: 'Product Roadmap',
    subtitle: 'Building the future of African enterprise.',
    icon: <Rocket className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="space-y-12">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100"></div>
          <div className="space-y-12">
            {[
              {
                quarter: 'Q2 2026',
                title: 'Multi-Currency & Cross-Border',
                status: 'In Progress',
                desc: 'Expanding our engine to support SADC region currencies and automated cross-border tax compliance.',
                icon: <Globe className="h-5 w-5" />
              },
              {
                quarter: 'Q3 2026',
                title: 'Deep Payroll Integration',
                status: 'Planned',
                desc: 'Direct sync with SARS eFiling for automated PAYE, UIF, and SDL submissions.',
                icon: <Users className="h-5 w-5" />
              },
              {
                quarter: 'Q4 2026',
                title: 'Market Intelligence Node',
                status: 'Research',
                desc: 'AI-driven predictive analytics for local consumer trends and competitor benchmarking.',
                icon: <Cpu className="h-5 w-5" />
              }
            ].map((item, i) => (
              <div key={i} className="relative pl-12">
                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center z-10 ${i === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                  {item.icon}
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{item.quarter}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${item.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  api: {
    title: 'Developer API',
    subtitle: 'Integrate the Neural Core into your own stack.',
    icon: <Cpu className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="space-y-8">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-indigo-300 font-mono text-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cpu className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <pre className="overflow-x-auto">
{`// Initialize Neural Core SDK
const smepal = new SMEPalClient({
  apiKey: process.env.SMEPAL_KEY,
  region: 'za-south-1'
});

// Get real-time compliance audit
const audit = await smepal.compliance.audit({
  businessId: 'SA_99283',
  depth: 'full'
});

console.log(\`Score: \${audit.score}%\`);`}
            </pre>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-2">RESTful Architecture</h3>
            <p className="text-xs text-slate-500">Standard JSON responses with predictable error handling and rate limiting.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-2">Webhooks</h3>
            <p className="text-xs text-slate-500">Real-time notifications for compliance changes, invoice payments, and more.</p>
          </div>
        </div>
      </div>
    )
  },
  about: {
    title: 'About Neural Core',
    subtitle: 'Empowering the backbone of South Africa.',
    icon: <Users className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="space-y-12">
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Neural Core SA was born out of a simple observation: South African SMEs are the engine of our economy, yet they are often the most underserved by modern technology.
          </p>
          <p className="text-slate-500 leading-relaxed">
            We are a team of South African engineers, designers, and business strategists who believe that AI shouldn't just be a tool for global giants. It should be the competitive advantage that helps a local shop in Soweto or a tech startup in Cape Town scale to new heights.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-slate-100">
          {[
            { label: 'Founded', val: '2024' },
            { label: 'Team Size', val: '45+' },
            { label: 'HQ', val: 'Sandton' },
            { label: 'Users', val: '15k+' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-black text-indigo-600 mb-1">{stat.val}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="relative rounded-[2rem] overflow-hidden aspect-video">
          <img src="https://picsum.photos/seed/office/1200/675" alt="Our Office" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
            <p className="text-white font-bold italic">"Intelligence is the ultimate equalizer." — Our Founding Vision</p>
          </div>
        </div>
      </div>
    )
  },
  careers: {
    title: 'Join the Core',
    subtitle: 'Build the intelligence that builds a nation.',
    icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Globe className="h-6 w-6" />, title: 'Remote First', desc: 'Work from anywhere in SA.' },
            { icon: <Zap className="h-6 w-6" />, title: 'High Impact', desc: 'Directly help 15k+ SMEs.' },
            { icon: <Users className="h-6 w-6" />, title: 'Equity', desc: 'Own a piece of the future.' }
          ].map((benefit, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-2xl text-center">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-600">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{benefit.title}</h3>
              <p className="text-xs text-slate-500">{benefit.desc}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-black text-slate-900 mb-6">Open Positions</h3>
          {[
            { title: 'Senior AI Engineer', dept: 'Engineering', loc: 'Remote / JHB' },
            { title: 'Product Designer', dept: 'Design', loc: 'Cape Town' },
            { title: 'Growth Lead', dept: 'Marketing', loc: 'Remote' }
          ].map((job, i) => (
            <div key={i} className="group p-6 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                <p className="text-xs text-slate-400 font-medium">{job.dept} • {job.loc}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    )
  },
  blog: {
    title: 'Neural Insights',
    subtitle: 'Stories of scale, intelligence, and growth.',
    icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: 'The Future of POPIA Compliance',
              excerpt: 'How AI is making data privacy a competitive advantage for SA SMEs.',
              date: 'April 5, 2026',
              author: 'Sarah M.',
              img: 'blog1'
            },
            {
              title: 'Scaling Beyond the Rand',
              excerpt: 'Strategies for SA businesses trading in global markets.',
              date: 'March 28, 2026',
              author: 'David K.',
              img: 'blog2'
            },
            {
              title: 'Generative AI in Invoicing',
              excerpt: 'Why professional design leads to 30% faster payments.',
              date: 'March 15, 2026',
              author: 'Elena R.',
              img: 'blog3'
            },
            {
              title: 'Navigating SARS eFiling',
              excerpt: 'A guide to automated tax submissions for small teams.',
              date: 'March 2, 2026',
              author: 'Thabo N.',
              img: 'blog4'
            }
          ].map((post, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-video bg-slate-100 rounded-3xl mb-6 overflow-hidden relative">
                <img src={`https://picsum.photos/seed/${post.img}/800/450`} alt="Blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[8px] font-black uppercase tracking-widest text-indigo-600">
                  {post.date}
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{post.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                  {post.author[0]}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">By {post.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  contact: {
    title: 'Connect with Us',
    subtitle: 'We are here to help your business thrive.',
    icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Get in touch</h3>
            <p className="text-slate-500 leading-relaxed">
              Whether you have a question about features, pricing, or just want to chat about the future of SA business, our team is ready.
            </p>
          </div>
          <div className="space-y-6">
            {[
              { icon: <Mail className="h-5 w-5" />, label: 'Email', val: 'hello@neuralcore.co.za' },
              { icon: <Phone className="h-5 w-5" />, label: 'Phone', val: '+27 (0) 11 555 0123' },
              { icon: <MapPin className="h-5 w-5" />, label: 'Office', val: '128 Rivonia Rd, Sandton, JHB' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="font-bold text-slate-900">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
              <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"></textarea>
            </div>
            <Button className="w-full !py-4 shadow-xl shadow-indigo-200">Send Message</Button>
          </form>
        </div>
      </div>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Your data is your business. We keep it that way.',
    icon: <ShieldCheck className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="prose prose-slate max-w-none space-y-8">
        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
          <p className="text-sm font-bold text-indigo-900 mb-0">Effective Date: April 7, 2026</p>
        </div>
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">1. Information We Collect</h3>
          <p className="text-slate-500">We collect information that you provide directly to us when you create an account, use our AI features, or communicate with us. This includes business registration details, financial data for invoicing, and interaction logs with our AI advisor.</p>
        </section>
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">2. How We Use Your Information</h3>
          <p className="text-slate-500">Your information is used solely to provide and improve the SMEPal experience. We use AI to analyze your data for the purpose of providing business insights, but this data is never shared with third parties for marketing purposes.</p>
        </section>
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">3. Data Sovereignty & Security</h3>
          <p className="text-slate-500">All data is encrypted at rest and in transit. We host our primary servers within South Africa to ensure compliance with local data sovereignty requirements and to provide the fastest possible service.</p>
        </section>
      </div>
    )
  },
  terms: {
    title: 'Terms of Service',
    subtitle: 'The legal framework for our partnership.',
    icon: <FileText className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">1. Acceptance of Terms</h3>
          <p className="text-slate-500">By accessing or using SMEPal, you agree to be bound by these Terms of Service and all applicable laws and regulations in the Republic of South Africa.</p>
        </section>
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">2. AI Disclaimer</h3>
          <p className="text-slate-500">SMEPal provides AI-driven business assistance. While we strive for high fidelity and accuracy, our outputs are for informational purposes only and do not constitute legal, financial, or professional advice. Always verify critical decisions with a qualified human professional.</p>
        </section>
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">3. Subscription & Billing</h3>
          <p className="text-slate-500">Subscriptions are billed in advance on a monthly or annual basis. You may cancel at any time, but no refunds will be provided for partial months of service.</p>
        </section>
      </div>
    )
  },
  popia: {
    title: 'POPIA Compliance',
    subtitle: 'Protecting personal information in the digital age.',
    icon: <Lock className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="prose prose-slate max-w-none space-y-8">
        <div className="p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-6">
          <ShieldCheck className="h-12 w-12 text-emerald-600 flex-shrink-0" />
          <div>
            <h3 className="text-emerald-900 font-black mb-1">Fully Compliant</h3>
            <p className="text-emerald-700 text-sm mb-0">SMEPal is engineered from the ground up to meet and exceed POPIA requirements.</p>
          </div>
        </div>
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">Our Commitment to Privacy</h3>
          <p className="text-slate-500">The Protection of Personal Information Act (POPIA) is the cornerstone of data privacy in South Africa. We adhere to the eight conditions for lawful processing:</p>
          <ul className="space-y-4">
            {[
              'Accountability: We take full responsibility for the data we process.',
              'Processing Limitation: We only process data for specific, lawful purposes.',
              'Purpose Specification: You always know why we are collecting your data.',
              'Further Processing Limitation: We don\'t use your data for secondary purposes without consent.',
              'Information Quality: We ensure your data is complete and accurate.',
              'Openness: We are transparent about our data practices.',
              'Security Safeguards: We use enterprise-grade encryption and local hosting.',
              'Data Subject Participation: You have full control over your information.'
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    )
  },
  cookie: {
    title: 'Cookie Policy',
    subtitle: 'How we use cookies to improve your experience.',
    icon: <Target className="h-8 w-8 text-indigo-600" />,
    content: (
      <div className="prose prose-slate max-w-none space-y-8">
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">What are cookies?</h3>
          <p className="text-slate-500">Cookies are small text files stored on your device that help us recognize you and remember your preferences. They are essential for providing a smooth and personalized experience on SMEPal.</p>
        </section>
        <section>
          <h3 className="text-xl font-black text-slate-900 mb-4">How we use them</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2">Essential</h4>
              <p className="text-xs text-slate-500">Necessary for the platform to function, such as keeping you logged in during your session.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <h4 className="font-bold text-slate-900 mb-2">Performance</h4>
              <p className="text-xs text-slate-500">Help us understand how users interact with our features so we can optimize them.</p>
            </div>
          </div>
        </section>
      </div>
    )
  }
};

const StaticPage: React.FC<StaticPageProps> = ({ slug, onBack, onNavigate }) => {
  const page = STATIC_CONTENT[slug];

  // Quick navigation links
  const relatedLinks: Record<StaticPageSlug, StaticPageSlug[]> = {
    features: ['pricing', 'roadmap', 'api'],
    pricing: ['features', 'contact', 'terms'],
    roadmap: ['features', 'blog', 'careers'],
    api: ['features', 'contact', 'terms'],
    about: ['careers', 'blog', 'contact'],
    careers: ['about', 'blog', 'contact'],
    blog: ['about', 'roadmap', 'features'],
    contact: ['about', 'careers', 'pricing'],
    privacy: ['terms', 'popia', 'cookie'],
    terms: ['privacy', 'popia', 'cookie'],
    popia: ['privacy', 'terms', 'cookie'],
    cookie: ['privacy', 'terms', 'popia']
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-black text-slate-600 hover:text-indigo-600 transition-all group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-indigo-600 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center mb-8 text-indigo-600">
              {page.icon}
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9]">
              {page.title}
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              {page.subtitle}
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl"
        >
          {page.content}
        </motion.div>

        {/* Related Links */}
        <div className="mt-32 pt-16 border-t border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-12">More to explore</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedLinks[slug].map((linkSlug) => (
              <button
                key={linkSlug}
                onClick={() => {
                  onNavigate(linkSlug);
                  window.scrollTo(0, 0);
                }}
                className="p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
              >
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Explore</p>
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 capitalize">{linkSlug.replace('-', ' ')}</span>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Final CTA */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8">Ready to join the Neural Core?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button onClick={onBack} className="!px-12 !py-5 !text-lg !rounded-2xl shadow-2xl shadow-indigo-500/20">
              Get Started Now
            </Button>
            <button onClick={() => onNavigate('contact')} className="text-sm font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            © 2026 Neural Core SA Enterprise. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Globe className="h-4 w-4 text-slate-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">South Africa (EN)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaticPage;
