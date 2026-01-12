
import React, { useState, useMemo, useEffect } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import Spinner from './common/Spinner';
import { calculateTax } from '../services/geminiService';
import type { TaxCalculationResult } from '../types';

interface SavedTaxScenario {
    id: string;
    name: string;
    income: number;
    expenses: number;
    deductions: number;
    credits: number;
    result: TaxCalculationResult;
    timestamp: number;
}

const STORAGE_KEY = 'sme-pal-tax-history';

const formatCurrency = (value: string | number | undefined) => {
    if (value === undefined || value === null) return '0.00';
    const num = Number(value);
    if (isNaN(num)) return String(value);
    return num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const TaxGauge: React.FC<{ percentage: number }> = ({ percentage }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;
    const color = percentage < 15 ? '#10b981' : percentage < 30 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative flex items-center justify-center">
            <svg className="h-40 w-40 transform -rotate-90">
                <circle cx="80" cy="80" r={radius} stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle 
                    cx="80" cy="80" r={radius} stroke={color} strokeWidth="8" fill="transparent" 
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">{percentage.toFixed(1)}%</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Effective</span>
            </div>
        </div>
    );
};

const TaxCalculator = () => {
    const [income, setIncome] = useState<number>(500000);
    const [expenses, setExpenses] = useState<number>(120000);
    const [deductions, setDeductions] = useState<number>(35000);
    const [credits, setCredits] = useState<number>(17235);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TaxCalculationResult | null>(null);
    const [error, setError] = useState('');
    const [history, setHistory] = useState<SavedTaxScenario[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setHistory(JSON.parse(stored));
    }, []);

    const effectiveRate = useMemo(() => {
        if (!result || income === 0) return 0;
        const tax = Number(result.estimatedTax);
        return (tax / income) * 100;
    }, [result, income]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const taxResult = await calculateTax(income, expenses, deductions, credits);
            setResult(taxResult);
        } catch (err: any) {
            setError(err.message || "Tax engine connection error.");
        } finally {
            setLoading(false);
        }
    };

    const saveScenario = () => {
        if (!result) return;
        const name = window.prompt("Name this tax scenario:", `Scenario ${new Date().toLocaleTimeString()}`);
        if (!name) return;

        const newScenario: SavedTaxScenario = {
            id: crypto.randomUUID(),
            name,
            income,
            expenses,
            deductions,
            credits,
            result,
            timestamp: Date.now()
        };
        const updated = [newScenario, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const loadScenario = (s: SavedTaxScenario) => {
        setIncome(s.income);
        setExpenses(s.expenses);
        setDeductions(s.deductions);
        setCredits(s.credits);
        setResult(s.result);
        setShowHistory(false);
    };

    const deleteScenario = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = history.filter(h => h.id !== id);
        setHistory(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fade-in relative">
            <div className="flex justify-between items-end">
                <div className="text-left space-y-1">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">Taxation Estimator</h1>
                    <p className="text-slate-500 font-medium text-sm italic">"Strategic forecasting based on 2024/2025 SARS legislative brackets."</p>
                </div>
                <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                    <Card title="Input Telemetry" className="shadow-none border-slate-200/60 rounded-[2rem]">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input label="Annual Gross (R)" id="income" type="number" value={income} onChange={e => setIncome(Number(e.target.value))} required />
                            <Input label="Operational Costs (R)" id="expenses" type="number" value={expenses} onChange={e => setExpenses(Number(e.target.value))} required />
                            <Input label="Legal Deductions (R)" id="deductions" type="number" value={deductions} onChange={e => setDeductions(Number(e.target.value))} required />
                            <Input label="Total Credits (R)" id="credits" type="number" value={credits} onChange={e => setCredits(Number(e.target.value))} required />
                            <Button type="submit" isLoading={loading} className="w-full !rounded-2xl !py-4 text-base font-black uppercase tracking-widest shadow-xl shadow-indigo-100">Authorize Calculation</Button>
                        </form>
                    </Card>
                    
                    {result && (
                        <Button 
                            variant="secondary" 
                            onClick={saveScenario}
                            className="w-full !py-3 !rounded-xl border-slate-200 text-xs font-black uppercase tracking-widest"
                        >
                            Save current scenario
                        </Button>
                    )}
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white card-elevation rounded-[2.5rem] p-0 overflow-hidden flex flex-col justify-center min-h-[550px] border-0 shadow-2xl relative">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-20">
                                <Spinner />
                                <p className="mt-8 text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] animate-pulse">Consulting SARS Engine...</p>
                            </div>
                        ) : result ? (
                            <div className="animate-soft-reveal flex flex-col h-full">
                                <div className="p-12 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-12 bg-white">
                                    <TaxGauge percentage={effectiveRate} />
                                    <div className="flex-1 text-center md:text-right space-y-2">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">Estimated Liability</p>
                                        <p className="text-6xl font-black text-slate-800 tracking-tighter leading-none">R {formatCurrency(result.estimatedTax)}</p>
                                        <p className="text-sm font-bold text-slate-400 italic">Net Taxable Payload: R {formatCurrency(result.taxableIncome)}</p>
                                    </div>
                                </div>
                                <div className="p-12 bg-slate-50/40 flex-1">
                                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Legislative Engine Observations</h4>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                         {result.notes.map((n, i) => (
                                             <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex gap-4 items-start group hover:border-indigo-200 transition-colors">
                                                 <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0 group-hover:animate-ping"></div>
                                                 <p className="text-xs text-slate-600 font-semibold leading-relaxed">{n}</p>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-20 space-y-6">
                                <div className="h-20 w-20 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Awaiting Financial Telemetry</p>
                                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">Enter your annual figures on the left to initialize the calculation engine.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* HISTORY DRAWER */}
            {showHistory && (
                <>
                    <div className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[60] lg:hidden" onClick={() => setShowHistory(false)}></div>
                    <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-[70] p-8 border-l border-slate-100 animate-slide-in-right overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Scenario Vault</h4>
                            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        {history.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No saved scenarios detected.</p>
                        ) : (
                            <div className="space-y-4">
                                {history.map((s) => (
                                    <div 
                                        key={s.id} 
                                        onClick={() => loadScenario(s)}
                                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white transition-all cursor-pointer group relative"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-black text-slate-800 truncate pr-6">{s.name}</span>
                                            <button onClick={(e) => deleteScenario(s.id, e)} className="text-slate-300 hover:text-rose-500 absolute top-4 right-4">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-3">Gross: R {s.income.toLocaleString()}</p>
                                        <div className="flex justify-between items-end">
                                            <div className="text-indigo-600 font-black text-sm">R {formatCurrency(s.result.estimatedTax)}</div>
                                            <span className="text-[9px] font-bold text-slate-300">{new Date(s.timestamp).toLocaleDateString()}</span>
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

export default TaxCalculator;
