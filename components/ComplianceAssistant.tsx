
import React, { useState } from 'react';
import Card from './common/Card';
import TextArea from './common/TextArea';
import Button from './common/Button';
import { getComplianceGuide } from '../services/geminiService';
import type { ComplianceGuide } from '../types';

interface Topic {
    name: string;
    category: 'CIPC' | 'SARS' | 'Labour' | 'Growth';
    description: string;
    importance: 'Critical' | 'Mandatory' | 'Strategic';
    why: string;
    icon: React.ReactElement;
}

const topics: Topic[] = [
    { 
        name: 'CIPC Name Reservation', 
        category: 'CIPC',
        description: 'Get help with reserving a unique name for your new company.', 
        importance: 'Mandatory',
        why: 'Prevents trademark conflicts and ensures legal entity identification.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> 
    },
    { 
        name: 'Annual Returns Filing', 
        category: 'CIPC',
        description: 'Filing your yearly CIPC return to keep the company in "Active" status.', 
        importance: 'Critical',
        why: 'Failure to file for 2 years results in automatic deregistration (final dissolution).',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> 
    },
    { 
        name: 'SARS Tax Registration', 
        category: 'SARS',
        description: 'Guidance on registering for Income Tax, VAT, or PAYE.', 
        importance: 'Critical',
        why: 'Mandatory for all trading entities to avoid heavy penalties and interest.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 17h.01M12 17h.01M15 17h.01M9 14h.01M12 14h.01M15 14h.01M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg> 
    },
    { 
        name: 'Tax Clearance Status', 
        category: 'SARS',
        description: 'Maintaining a "Compliant" status for tenders and contracts.', 
        importance: 'Strategic',
        why: 'Required by almost all corporate and government clients before payment.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.417l5.318 2.074a1.5 1.5 0 001.364 0l5.318-2.074a12.02 12.02 0 005.618-14.377z" /></svg> 
    },
    { 
        name: 'UIF & PAYE Registration', 
        category: 'Labour',
        description: 'Registering as an employer with the Department of Labour.', 
        importance: 'Mandatory',
        why: 'Legal requirement if you pay employees more than the tax threshold.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
    },
    { 
        name: 'COIDA / Letter of Good Standing', 
        category: 'Labour',
        description: 'Workman\'s compensation for occupational injuries.', 
        importance: 'Mandatory',
        why: 'Protects against liability for workplace accidents; required for site work.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
        name: 'B-BBEE Affidavit', 
        category: 'Growth',
        description: 'Understanding EME (Exempt Micro Enterprise) certification.', 
        importance: 'Strategic',
        why: 'Boosts your scorecard for procurement; essential for B2B growth.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 
    },
    { 
        name: 'Skills Development (SDL)', 
        category: 'Growth',
        description: 'Contributing to the levy for business training.', 
        importance: 'Mandatory',
        why: 'Required if annual payroll exceeds R500,000.',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> 
    }
];

const TopicCard: React.FC<{ topic: Topic, onSelect: () => void }> = ({ topic, onSelect }) => (
    <div onClick={onSelect} className="group relative flex flex-col p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200 cursor-pointer text-left h-full">
        <div className="flex justify-between items-start mb-4">
            <div className="flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-lg p-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {topic.icon}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                topic.importance === 'Critical' ? 'bg-red-100 text-red-700' : 
                topic.importance === 'Mandatory' ? 'bg-amber-100 text-amber-700' : 
                'bg-blue-100 text-blue-700'
            }`}>
                {topic.importance}
            </span>
        </div>
        <div className="flex-1">
            <h3 className="text-base font-bold text-slate-800 mb-1">{topic.name}</h3>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter mb-2 block">{topic.category}</span>
            <p className="text-xs text-slate-600 line-clamp-2">{topic.description}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50">
            <p className="text-[10px] text-indigo-600 font-medium italic leading-tight">Law: {topic.why}</p>
        </div>
    </div>
);

const ComplianceAssistant: React.FC = () => {
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [guide, setGuide] = useState<ComplianceGuide | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTopic) return;
        
        setLoading(true);
        setError('');
        setGuide(null);
        try {
            const result = await getComplianceGuide(selectedTopic, description);
            setGuide(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartOver = () => {
        setSelectedTopic(null);
        setDescription('');
        setGuide(null);
        setError('');
    };

    if (!selectedTopic) {
        return (
            <div className="max-w-6xl mx-auto space-y-10 pb-16">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Compliance & Regulatory Roadmap</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">SMEPal helps you navigate the complex South African regulatory landscape. Select a topic to build your personalized compliance guide.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {topics.map(topic => (
                        <TopicCard key={topic.name} topic={topic} onSelect={() => setSelectedTopic(topic.name)} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card title="Business Compliance Lifecycle">
                            <div className="relative py-8 px-4 sm:px-10">
                                <div className="absolute left-4 sm:left-1/2 -ml-0.5 w-0.5 h-full bg-slate-100"></div>
                                <div className="space-y-12 relative">
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="sm:w-1/2 text-left sm:text-right">
                                            <h4 className="font-bold text-slate-800 text-sm">Formation (Month 1)</h4>
                                            <p className="text-xs text-slate-500">CIPC Registration, Name Reservation, and opening your first business bank account.</p>
                                        </div>
                                        <div className="z-10 bg-indigo-600 w-4 h-4 rounded-full border-4 border-white shadow-sm absolute left-2 sm:static sm:mx-0"></div>
                                        <div className="sm:w-1/2 hidden sm:block"></div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="sm:w-1/2 hidden sm:block"></div>
                                        <div className="z-10 bg-indigo-600 w-4 h-4 rounded-full border-4 border-white shadow-sm absolute left-2 sm:static sm:mx-0"></div>
                                        <div className="sm:w-1/2 text-left">
                                            <h4 className="font-bold text-slate-800 text-sm">Tax & Labour (Month 2-4)</h4>
                                            <p className="text-xs text-slate-500">Income Tax activation, VAT registration (if needed), and UIF/PAYE employer registration.</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="sm:w-1/2 text-left sm:text-right">
                                            <h4 className="font-bold text-slate-800 text-sm">Growth (Month 6-12)</h4>
                                            <p className="text-xs text-slate-500">B-BBEE EME Affidavit, Workman's Comp (COIDA) registration, and Letter of Good Standing.</p>
                                        </div>
                                        <div className="z-10 bg-indigo-600 w-4 h-4 rounded-full border-4 border-white shadow-sm absolute left-2 sm:static sm:mx-0"></div>
                                        <div className="sm:w-1/2 hidden sm:block"></div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="sm:w-1/2 hidden sm:block"></div>
                                        <div className="z-10 bg-indigo-600 w-4 h-4 rounded-full border-4 border-white shadow-sm absolute left-2 sm:static sm:mx-0"></div>
                                        <div className="sm:w-1/2 text-left">
                                            <h4 className="font-bold text-slate-800 text-sm">Maintenance (Yearly)</h4>
                                            <p className="text-xs text-slate-500">CIPC Annual Returns, SARS Tax Season, and COIDA return of earnings.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title="Why Compliance Matters">
                            <ul className="space-y-4 text-left">
                                <li className="flex gap-3">
                                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 h-fit">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-xs">Tender Eligibility</h5>
                                        <p className="text-[10px] text-slate-500 leading-tight">You cannot apply for government or corporate contracts without a Tax Clearance and BEE Affidavit.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 h-fit">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-xs">Liability Protection</h5>
                                        <p className="text-[10px] text-slate-500 leading-tight">COIDA ensures that if an employee is injured, the fund covers the cost, not your personal assets.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="bg-green-100 p-1.5 rounded-full text-green-600 h-fit">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-xs">Business Continuity</h5>
                                        <p className="text-[10px] text-slate-500 leading-tight">CIPC Annual Returns prevent your company from being deregistered, keeping your bank accounts open.</p>
                                    </div>
                                </li>
                            </ul>
                        </Card>
                        
                        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-xl text-left space-y-4">
                            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h4 className="font-bold">Next SARS Deadline</h4>
                            <p className="text-xs text-indigo-100">Monthly EMP201 (PAYE/UIF) submissions are due on the 7th of every month.</p>
                            <Button variant="secondary" className="w-full !py-2 !text-xs !bg-white !text-indigo-600">Add to Calendar</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            <Card>
                <div className="flex justify-between items-start text-left">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Compliance Guide: {selectedTopic}</h2>
                        <p className="text-sm text-slate-600 mt-1">SMEPal AI is preparing your custom roadmap for {selectedTopic}.</p>
                    </div>
                    <Button variant="secondary" onClick={handleStartOver} className="!py-1 !px-3 text-xs">Back to Topics</Button>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
                    <TextArea
                        label="Provide details about your current situation"
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        placeholder="e.g., I have a Pty Ltd registered in 2023, I have 2 employees and need to register for UIF."
                        required
                        tooltip="The more detail you provide about your entity type and employee count, the better the guide will be."
                    />
                    <Button type="submit" isLoading={loading} className="w-full !py-3 text-lg">
                        Build Step-by-Step Guide
                    </Button>
                </form>
            </Card>

            {loading && <Card><div className="text-center text-slate-600 p-12 flex flex-col items-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>Accessing regulatory databases and drafting your instructions...</div></Card>}
            {error && <Card><div className="text-red-600 bg-red-50 p-4 rounded-md text-left border border-red-100">{error}</div></Card>}

            {guide && (
                <Card>
                    <div className="text-left space-y-8 animate-fade-in">
                        <div className="text-center bg-slate-50 py-8 px-4 rounded-2xl border border-slate-100">
                            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{guide.title}</h2>
                            <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">{guide.introduction}</p>
                        </div>
                        
                        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Preparation Checklist
                            </h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                {guide.requiredDocuments.map((doc, index) => (
                                    <li key={index} className="flex gap-3 text-sm text-slate-700 items-start">
                                        <div className="h-5 w-5 rounded bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                                        </div>
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                Action Roadmap
                             </h3>
                             <div className="space-y-4">
                                {guide.steps.map((step) => (
                                    <div key={step.step} className="flex items-start gap-4 p-5 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors">
                                        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs">
                                            {step.step}
                                        </div>
                                        <div className="flex-1">
                                            <div className="prose prose-sm text-slate-900 max-w-none font-bold" dangerouslySetInnerHTML={{ __html: step.instruction.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline inline-flex items-center"><span>$1</span><svg class="h-3 w-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>') }} />
                                            <p className="text-xs text-slate-500 mt-2 leading-relaxed">{step.details}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="text-[10px] text-amber-800 leading-normal"><span className="font-bold">Disclaimer:</span> {guide.disclaimer} SMEPal is not a law firm; always verify with official government gazettes.</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ComplianceAssistant;
