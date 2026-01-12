
import React, { useState, useEffect } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';
import { generateMarketingContent } from '../services/geminiService';
import type { MarketingContent } from '../types';

const platforms = ['LinkedIn', 'Facebook', 'Instagram', 'Twitter/X', 'Email Newsletter'];
const STORAGE_KEY = 'sme-pal-marketing-drafts';

interface SavedDraft extends MarketingContent {
    id: string;
    topic: string;
    timestamp: number;
}

const MarketingAssistant: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [audience, setAudience] = useState('');
    const [platform, setPlatform] = useState('LinkedIn');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MarketingContent | null>(null);
    const [error, setError] = useState('');
    const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>([]);
    const [showLibrary, setShowLibrary] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setSavedDrafts(JSON.parse(stored));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const content = await generateMarketingContent(topic, platform, audience);
            setResult(content);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const saveDraft = () => {
        if (!result) return;
        const newDraft: SavedDraft = {
            ...result,
            id: crypto.randomUUID(),
            topic,
            timestamp: Date.now()
        };
        const updated = [newDraft, ...savedDrafts].slice(0, 20);
        setSavedDrafts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        alert('Draft archived to library!');
    };

    const loadDraft = (d: SavedDraft) => {
        setResult(d);
        setPlatform(d.platform);
        setTopic(d.topic);
        setShowLibrary(false);
    };

    const deleteDraft = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = savedDrafts.filter(d => d.id !== id);
        setSavedDrafts(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    return (
        <div className="max-w-[1600px] mx-auto animate-fade-in pb-16 relative">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* STUDIO CONTROLS */}
                <div className="w-full lg:w-[450px] space-y-8 lg:sticky lg:top-24">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Marketing Studio</h1>
                            <p className="text-sm font-medium text-slate-500 italic">"Generate high-converting creative copy in seconds."</p>
                        </div>
                        <button 
                            onClick={() => setShowLibrary(!showLibrary)}
                            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                            title="Creative Library"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                        </button>
                    </div>

                    <Card className="!rounded-[2.5rem] !p-0 shadow-2xl border-0 overflow-hidden">
                        <div className="bg-indigo-600 p-8 text-white">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-6">Channel Configuration</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {platforms.map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => setPlatform(p)}
                                        className={`px-4 py-3 rounded-xl text-[11px] font-black transition-all border ${platform === p ? 'bg-white text-indigo-600 border-white shadow-lg' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white">
                            <Input 
                                label="Campaign Objective" 
                                id="topic" 
                                value={topic} 
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="e.g., Year-end Sale on Web Design" 
                                required 
                                tooltip="What are you promoting? Be specific about offers."
                            />
                            <TextArea 
                                label="Target Demographic" 
                                id="audience" 
                                value={audience} 
                                onChange={(e) => setAudience(e.target.value)} 
                                rows={3} 
                                placeholder="e.g., Tech startups in Cape Town"
                                required 
                                tooltip="The AI will tune the voice and vocabulary to this group."
                            />
                            <Button type="submit" isLoading={loading} className="w-full !rounded-2xl !py-5 shadow-2xl shadow-indigo-100 text-base font-black uppercase tracking-widest">
                                {loading ? 'SYNTHESIZING...' : 'GENERATE ASSETS'}
                            </Button>
                            {error && <p className="text-[10px] font-black text-rose-500 bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}
                        </form>
                    </Card>
                    
                    {result && (
                         <Button 
                            variant="secondary" 
                            onClick={saveDraft}
                            className="w-full !py-3 !rounded-xl border-slate-200 text-xs font-black uppercase tracking-widest"
                        >
                            Save to library
                        </Button>
                    )}
                </div>

                {/* PREVIEW CANVAS */}
                <div className="flex-1 w-full space-y-8">
                    <div className="flex justify-between items-center px-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Creative Sandbox</h3>
                        {result && (
                            <div className="flex gap-3">
                                <Button variant="ghost" onClick={() => copyToClipboard(result.content)} className="!py-2 !px-4 text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl">Copy Text</Button>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-100/50 rounded-[3rem] p-6 sm:p-12 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                        {loading ? (
                            <div className="flex flex-col items-center space-y-6 animate-pulse">
                                <div className="h-16 w-16 bg-indigo-200 rounded-[1.5rem] flex items-center justify-center">
                                    <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <p className="text-sm font-black text-indigo-900 uppercase tracking-[0.2em]">Synthesizing Creative Data...</p>
                            </div>
                        ) : result ? (
                            <div className="w-full max-w-xl space-y-8 animate-scale-in">
                                {/* Social Card Mockup */}
                                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
                                    <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black uppercase">JP</div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 leading-none">Jane Pro (SMEPal)</p>
                                            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{platform} · Sponsored</p>
                                        </div>
                                    </div>
                                    <div className="p-8 text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                                        {result.content}
                                    </div>
                                    <div className="p-8 pt-0 flex flex-wrap gap-2">
                                        {result.hashtags.map(tag => (
                                            <span key={tag} className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 cursor-pointer">#{tag.replace('#','')}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100 text-left">
                                        <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-3">AI Visual Prompt</h4>
                                        <p className="text-xs text-amber-900/80 font-medium italic leading-relaxed">"{result.imageIdea}"</p>
                                    </div>
                                    <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 text-left">
                                        <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-3">Engine Logic</h4>
                                        <p className="text-xs text-emerald-900/80 font-medium leading-relaxed italic">"Tone balanced with high-converting call-to-action."</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400 text-center space-y-4">
                                <div className="h-24 w-24 rounded-[2rem] bg-white shadow-xl flex items-center justify-center mb-4 border border-slate-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                </div>
                                <p className="text-lg font-black text-slate-800 tracking-tight">Studio Idle.</p>
                                <p className="text-sm font-medium max-w-xs px-10 italic">"Define your campaign parameters to synthesize high-converting assets."</p>
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
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs">Creative Library</h4>
                            <button onClick={() => setShowLibrary(false)} className="text-slate-400 hover:text-slate-600"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        {savedDrafts.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">No saved creative content found.</p>
                        ) : (
                            <div className="space-y-4">
                                {savedDrafts.map((d) => (
                                    <div 
                                        key={d.id} 
                                        onClick={() => loadDraft(d)}
                                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-white transition-all cursor-pointer group relative"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-black text-slate-800 truncate pr-6">{d.topic}</span>
                                            <button onClick={(e) => deleteDraft(d.id, e)} className="text-slate-300 hover:text-rose-500 absolute top-4 right-4 transition-colors">
                                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase mb-3">{d.platform}</p>
                                        <p className="text-[11px] text-slate-500 line-clamp-2 italic mb-3">"{d.content.substring(0, 60)}..."</p>
                                        <div className="flex justify-end">
                                            <span className="text-[9px] font-bold text-slate-300">{new Date(d.timestamp).toLocaleDateString()}</span>
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

export default MarketingAssistant;
