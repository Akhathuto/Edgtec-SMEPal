
import React from 'react';
import Card from './common/Card';
import Ownership from './Ownership';
import type { OwnershipData } from '../types';

const ownershipInfo: OwnershipData = {
    legalName: 'EDGTEC (Pty) Ltd',
    registrationNumber: '2025/534716/07',
    owners: [
        { name: 'RANTHUTU LEPHEANE', percentage: '70.00%' },
        { name: 'SIPHOSAKHE MATHEWS MSIMANGO', percentage: '30.00%' },
    ]
};

const About: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-24 text-left animate-fade-in">
            {/* HERO IDENTITY */}
            <div className="text-center space-y-6 pt-12">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black tracking-[0.2em] uppercase mb-2">
                    Our Identity
                </div>
                <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                    Built by <span className="text-indigo-600">Founders</span>,<br />for <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-600">South Africa.</span>
                </h1>
                <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                    SMEPal is more than a tool. It's a digital ally for the 2.5 million entrepreneurs who form the backbone of our economy.
                </p>
            </div>

            {/* MISSION GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.04)] space-y-8 h-full">
                    <div className="h-16 w-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">The Mission.</h2>
                    <div className="space-y-4 text-slate-600 font-medium leading-relaxed">
                        <p>
                            We民主化 professional services. High-end legal and financial guidance shouldn't only belong to the Top 1%.
                        </p>
                        <p>
                            By leveraging Google's Gemini AI, we've distilled complex South African legislation into actionable instructions that any business owner can follow.
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card title="Corporate Values" className="!rounded-[3rem] !p-10 shadow-lg">
                        <ul className="space-y-6">
                            {[
                                { title: 'Local Expertise', text: 'Built specifically for SA tax laws & CIPC requirements.', color: 'emerald' },
                                { title: 'Privacy First', text: 'Your sensitive business data never leaves your device.', color: 'indigo' },
                                { title: 'Radical Simplicity', text: 'Turning 50-page gazettes into 5-step roadmaps.', color: 'rose' },
                            ].map((v, i) => (
                                <li key={i} className="flex gap-5 items-start group">
                                    <div className={`mt-1 h-2.5 w-2.5 rounded-full bg-${v.color}-500 shadow-[0_0_12px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-150`}></div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-sm mb-1">{v.title}</h4>
                                        <p className="text-xs text-slate-400 font-medium">{v.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    
                    <div className="bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <h3 className="text-2xl font-black mb-2">Our Vision 2030.</h3>
                        <p className="text-indigo-100 text-sm font-medium italic leading-relaxed">
                            "To be the digital companion for 1 million South African businesses, fostering a culture of compliance and professional excellence."
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-10">
                <Ownership title="Legal Accountability & Transparency" data={ownershipInfo} />
            </div>

            {/* STATS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'SME Contribution', value: '34% of GDP', detail: 'The core of SA wealth.' },
                    { label: 'Our Target', value: '1M Entities', detail: 'Helping businesses thrive.' },
                    { label: 'Friction Reduced', value: '90%', detail: 'Admin tasks automated.' },
                ].map((stat, i) => (
                    <div key={i} className="text-center p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-indigo-100 transition-colors">
                        <p className="text-4xl font-black text-slate-900 mb-2">{stat.value}</p>
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{stat.detail}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;
