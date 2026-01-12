import React, { useState, useEffect, useMemo } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { useClients } from '../hooks/useClients';
import { Tool, Expense } from '../types';
import { getDailyBusinessTip } from '../services/geminiService';

interface DashboardProps {
    onNavigate: (tool: Tool) => void;
}

const Sparkline: React.FC<{ color: string }> = ({ color }) => (
    <svg viewBox="0 0 100 30" className="h-10 w-full overflow-visible">
        <path
            d="M0 25 Q 10 5, 20 20 T 40 10 T 60 25 T 80 5 T 100 20"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-draw"
        />
    </svg>
);

const PulseWidget: React.FC = () => {
    // Simulated real-time SA data
    const [pulse, setPulse] = useState({
        zarRate: '18.42',
        eskomStatus: 'Stage 0',
        eskomColor: 'emerald',
        primeRate: '11.75%'
    });

    useEffect(() => {
        // Randomize slightly for "live" feel
        const timer = setInterval(() => {
            setPulse(prev => ({
                ...prev,
                zarRate: (18.4 + Math.random() * 0.1).toFixed(2)
            }));
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ZAR/USD Pulse</p>
                <p className="text-lg font-black text-slate-800">R {pulse.zarRate}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Eskom Grid</p>
                <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full bg-${pulse.eskomColor}-500`}></div>
                    <p className="text-lg font-black text-slate-800">{pulse.eskomStatus}</p>
                </div>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { clients } = useClients();
    const [dailyTip, setDailyTip] = useState<string | null>(null);
    const [loadingTip, setLoadingTip] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [userName, setUserName] = useState('Entrepreneur');
    const [businessSector, setBusinessSector] = useState('Growth');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        
        const storedExpenses = localStorage.getItem('sme-pal-expenses');
        if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
        
        const session = localStorage.getItem('smepal_session');
        if (session) {
            const parsed = JSON.parse(session);
            setUserName(parsed.name?.split(' ')[0] || 'Entrepreneur');
        }

        const profile = localStorage.getItem('smepal_business_profile');
        if (profile) {
            const parsed = JSON.parse(profile);
            setBusinessSector(parsed.businessSector || 'Growth');
        }

        return () => clearInterval(timer);
    }, []);

    const monthlySpend = useMemo(() => {
        const now = new Date();
        return expenses
            .filter(e => new Date(e.date).getMonth() === now.getMonth())
            .reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);

    const projectedRevenue = useMemo(() => clients.length * 12500, [clients]);
    const cashFlowRatio = projectedRevenue > 0 ? (monthlySpend / projectedRevenue) * 100 : 0;

    const handleGetTip = async () => {
        setLoadingTip(true);
        try {
            const tip = await getDailyBusinessTip();
            setDailyTip(tip);
        } catch (e) {
            setDailyTip("Focus on core competencies to optimize unit economics.");
        } finally {
            setLoadingTip(false);
        }
    };

    const hour = currentTime.getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-16 animate-fade-in">
            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none">{greeting}, {userName}.</h1>
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {currentTime.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })}
                        <span className="mx-1">·</span>
                        {businessSector} Hub Active
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex flex-col items-end mr-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Regional Time (SAST)</p>
                        <p className="text-xl font-black text-slate-700 font-mono tracking-tighter">
                            {currentTime.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                    </div>
                    <Button variant="secondary" onClick={() => onNavigate(Tool.USER_PROFILE)} className="!rounded-xl px-5 border-slate-200">User Profile</Button>
                    <Button onClick={() => onNavigate(Tool.INVOICE)} className="!rounded-xl px-6 shadow-xl shadow-indigo-100">+ New Invoice</Button>
                </div>
            </div>

            {/* MAIN KPI GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* FINANCIAL ENGINE */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="!p-8 bg-white border-0 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                            <Sparkline color="#4f46e5" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1">Inflow Velocity</p>
                                    <h3 className="text-lg font-black text-slate-800">Projected Revenue</h3>
                                </div>
                                <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-3xl font-black text-slate-800 tracking-tighter">R {projectedRevenue.toLocaleString()}</p>
                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Optimal</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Active Partner Allocation</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="!p-8 bg-white border-0 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                            <Sparkline color="#f43f5e" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-1">Operational Burn</p>
                                    <h3 className="text-lg font-black text-slate-800">Scanned Expenses</h3>
                                </div>
                                <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"/></svg>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-3xl font-black text-slate-800 tracking-tighter">R {monthlySpend.toLocaleString()}</p>
                                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase">Verified</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(cashFlowRatio, 100)}%` }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Revenue Impact Ratio</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ADVISORY PULSE */}
                <div className="lg:col-span-4 bg-indigo-600 rounded-[2.5rem] p-8 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                    </div>
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">Strategy Terminal</p>
                                <p className="text-sm font-black text-white">ZAF Context Active</p>
                            </div>
                        </div>
                        <p className="text-[15px] font-bold leading-relaxed italic text-indigo-50 border-l-2 border-white/20 pl-4 py-1">
                            {dailyTip ? `"${dailyTip}"` : '"Initializing advisory protocols for the South African market..."'}
                        </p>
                    </div>
                    <button 
                        onClick={handleGetTip} 
                        disabled={loadingTip}
                        className="mt-8 bg-white/10 text-white border border-white/20 backdrop-blur-sm py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-white hover:text-indigo-600 transition-all disabled:opacity-50"
                    >
                        {loadingTip ? 'CALCULATING...' : 'REFRESH INSIGHT'}
                    </button>
                </div>
            </div>

            {/* SECONDARY TOOLS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { tool: Tool.INVOICE, label: 'Invoicing', color: 'indigo', icon: <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
                            { tool: Tool.TAX, label: 'Taxation', color: 'emerald', icon: <path d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 17h.01M12 17h.01M15 17h.01M9 14h.01M12 14h.01M15 14h.01M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" /> },
                            { tool: Tool.CLIENTS, label: 'Directory', color: 'sky', icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
                            { tool: Tool.EXPENSES, label: 'Audit Scanner', color: 'violet', icon: <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> },
                        ].map((item, i) => (
                            <button 
                                key={item.label}
                                onClick={() => onNavigate(item.tool)}
                                className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
                            >
                                <div className={`h-14 w-14 mx-auto bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-${item.color}-50 group-hover:text-${item.color}-600 transition-all mb-4`}>
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>{item.icon}</svg>
                                </div>
                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-indigo-600">{item.label}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-6">
                        <Card title="Latest Audit Logs" className="!p-0 border-0 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/80">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Date</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Signature</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Impact (ZAR)</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {expenses.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-16 text-center text-slate-300 italic text-sm">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <svg className="h-10 w-10 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                                        No transaction telemetry detected.
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            expenses.slice(0, 5).map((e, i) => (
                                                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-8 py-5 text-xs text-slate-400 font-bold">{new Date(e.date).toLocaleDateString('en-ZA', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                                                    <td className="px-8 py-5 text-sm font-black text-slate-700">{e.merchant}</td>
                                                    <td className="px-8 py-5 text-sm font-black text-slate-700 text-right">- R {e.amount.toLocaleString()}</td>
                                                    <td className="px-8 py-5 text-center">
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">Verified</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <Card title="Business Pulse" className="!p-8 border-0 shadow-sm">
                        <PulseWidget />
                    </Card>

                    <Card title="Compliance Calendar" className="!p-8 border-0 shadow-sm relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
                        <div className="space-y-6 relative z-10">
                            {[
                                { label: 'SARS EMP201 (PAYE)', status: 'Due 7th', color: 'emerald' },
                                { label: 'VAT 201 Filing', status: 'Due 25th', color: 'amber' },
                                { label: 'UIF Declaration', status: 'Due 7th', color: 'emerald' },
                                { label: 'CIPC Annual Return', status: 'Due Yearly', color: 'rose' },
                            ].map(item => (
                                <div key={item.label} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full bg-${item.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.1)] group-hover:animate-ping`}></div>
                                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-100`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={() => onNavigate(Tool.COMPLIANCE)} className="w-full !py-3 !text-[10px] !uppercase !tracking-[0.2em] border-slate-200 hover:bg-slate-50 transition-all">Launch Compliance Suite</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
