import React, { useState } from 'react';
import Card from './common/Card';
import TextArea from './common/TextArea';
import Button from './common/Button';
import type { ToastType } from './common/Toast';
import { generateContract } from '../services/geminiService';
import type { GeneratedContract } from '../types';
import { useContracts, SavedContract } from '../hooks/useContracts';

interface ContractAssistantProps {
    showToast: (m: string, t: ToastType) => void;
}

const ContractAssistant: React.FC<ContractAssistantProps> = ({ showToast }) => {
    const { contracts: savedContracts, saveContract: archiveContract, deleteContract: removeContract, isLoading } = useContracts();
    const [description, setDescription] = useState('A simple freelance graphic design agreement for a logo design project. The freelancer will provide 3 initial concepts, and the client gets 2 rounds of revisions. Total project cost is R5000, with 50% upfront and 50% on completion.');
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState<GeneratedContract | null>(null);
    const [error, setError] = useState('');
    const [showLibrary, setShowLibrary] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setContract(null);

        try {
            const result = await generateContract(description);
            setContract(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveContract = async () => {
        if (!contract) return;
        const newContract: Omit<SavedContract, 'id'> = {
            ...contract,
            description,
            createdAt: new Date().toISOString()
        };
        await archiveContract(newContract);
        showToast('Contract archived to library!', 'success');
    };

    const loadContract = (c: SavedContract) => {
        setContract(c);
        setDescription(c.description);
        setShowLibrary(false);
    };

    const handleDeleteContract = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await removeContract(id);
        showToast('Contract removed from library.', 'info');
    };
    
    return (
        <div className="max-w-[1600px] mx-auto pb-24 animate-fade-in relative">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Drafting Panel */}
                <div className="w-full lg:w-[450px] space-y-8">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Legal Studio</h1>
                            <p className="text-sm font-medium text-slate-500 italic">"Draft professional agreements using AI logic."</p>
                        </div>
                        <button 
                            onClick={() => setShowLibrary(!showLibrary)}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                            title="Legal Library"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </button>
                    </div>

                    <Card className="!rounded-[2.5rem] !p-8 shadow-2xl border-0 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <TextArea
                                label="Agreement Framework"
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={8}
                                required
                                tooltip="Be specific: Parties involved, deliverables, payment milestones, and termination clauses."
                            />
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Legal Disclaimer
                                </p>
                                <p className="text-[10px] text-indigo-600 font-medium italic leading-relaxed">
                                    Template generated for information only. Not a substitute for professional legal advice from a qualified attorney.
                                </p>
                            </div>
                            <Button type="submit" isLoading={loading} className="w-full !py-5 shadow-2xl shadow-indigo-100 !rounded-2xl text-base font-black uppercase tracking-widest">
                                {loading ? 'DRAFTING CLAUSES...' : 'GENERATE DRAFT'}
                            </Button>
                            {error && <p className="text-xs font-black text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}
                        </form>
                    </Card>

                    {contract && (
                         <Button 
                            variant="secondary" 
                            onClick={handleSaveContract}
                            className="w-full !py-3 !rounded-xl border-slate-200 text-xs font-black uppercase tracking-widest"
                        >
                            Save to library
                        </Button>
                    )}
                </div>

                {/* Paper Preview */}
                <div className="flex-1 w-full space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Digital Parchment</h3>
                        {contract && (
                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => {
                                    navigator.clipboard.writeText(
                                        `${contract.title}\n\n${contract.clauses.map((c, i) => `${i + 1}. ${c.heading}\n${c.body}`).join('\n\n')}`
                                    );
                                    showToast('Contract copied to clipboard!', 'info');
                                }} className="!py-2 !px-4 text-[10px] font-black uppercase tracking-widest bg-white border border-slate-100 shadow-sm">Copy Text</Button>
                                <Button className="!py-2 !px-4 text-[10px] font-black uppercase tracking-widest" onClick={() => window.print()}>Print Draft</Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-200/30 rounded-[3rem] p-6 sm:p-16 shadow-inner min-h-[800px] flex justify-center">
                        {contract ? (
                            <div className="w-full max-w-[210mm] bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-lg p-16 animate-scale-in origin-top">
                                <h2 className="text-3xl font-black text-slate-800 border-b-4 border-indigo-600 pb-6 mb-12 uppercase tracking-tighter">{contract.title}</h2>
                                <div className="space-y-10">
                                    {contract.clauses.map((clause, index) => (
                                        <div key={index} className="space-y-3">
                                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Clause {index + 1}: {clause.heading}</h3>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap border-l-2 border-slate-100 pl-6 italic">{clause.body}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-center">
                                    <div className="space-y-2">
                                        <div className="h-px w-48 bg-slate-200"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signatory A</p>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <div className="h-px w-48 bg-slate-200"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signatory B</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 text-center space-y-4">
                                <div className="h-24 w-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                </div>
                                <p className="text-lg font-black text-slate-800 tracking-tight">Legal Terminal Idle.</p>
                                <p className="text-sm font-medium max-w-xs px-10 italic">"Define your contractual scope to generate a high-fidelity legal template."</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* LIBRARY DRAWER */}
            {showLibrary && (
                <>
                    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setShowLibrary(false)}></div>
                    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[70] p-8 border-l border-slate-100 animate-slide-in-right overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Legal Library</h4>
                            <button onClick={() => setShowLibrary(false)} className="text-slate-400 hover:text-slate-600"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        {savedContracts.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No saved legal templates found.</p>
                        ) : (
                            <div className="space-y-4">
                                {savedContracts.map((c) => (
                                    <div 
                                        key={c.id} 
                                        onClick={() => loadContract(c)}
                                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white transition-all cursor-pointer group relative"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-black text-slate-800 pr-6">{c.title}</span>
                                            <button onClick={(e) => handleDeleteContract(c.id, e)} className="text-slate-300 hover:text-rose-500 absolute top-4 right-4 transition-colors">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-3">"{c.description.substring(0, 60)}..."</p>
                                        <div className="flex justify-end">
                                            <span className="text-[9px] font-bold text-slate-300">{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ContractAssistant;