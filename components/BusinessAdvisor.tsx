
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from './common/Card';
import Button from './common/Button';
import { createAdvisorChat } from '../services/geminiService';
import { GenerateContentResponse, Chat, GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

interface Message {
    role: 'user' | 'model';
    text: string;
}

// Simple Markdown Formatter for visual enhancement
const formatResponse = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
        let content = line;
        // Bold: **text**
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>');
        // List: * item
        if (line.trim().startsWith('* ')) {
            return <li key={i} className="ml-4 mb-1 list-disc" dangerouslySetInnerHTML={{ __html: content.substring(2) }} />;
        }
        // Headings: ### 
        if (line.trim().startsWith('###')) {
            return <h4 key={i} className="text-sm font-black uppercase tracking-widest text-indigo-600 mt-4 mb-2" dangerouslySetInnerHTML={{ __html: content.substring(3) }} />;
        }
        return <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ __html: content }} />;
    });
};

const BusinessAdvisor: React.FC = () => {
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello! I'm your AI Business Advisor. I can help you with questions about South African tax, compliance, marketing strategies, or general business advice. How can I assist you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatSessionRef = useRef<Chat | null>(null);

    // Live API Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const liveSessionRef = useRef<any>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

    useEffect(() => {
        chatSessionRef.current = createAdvisorChat();
        return () => {
            stopVoiceMode();
        };
    }, []);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const encodePCM = (data: Float32Array): string => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = Math.max(-1, Math.min(1, data[i])) * 32767;
        }
        let binary = '';
        const bytes = new Uint8Array(int16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const decodePCM = async (base64: string, ctx: AudioContext): Promise<AudioBuffer> => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
            channelData[i] = dataInt16[i] / 32768.0;
        }
        return buffer;
    };

    const startVoiceMode = async () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micStreamRef.current = stream;

            const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = outputCtx;

            const sessionPromise = ai.live.connect({
                model: 'gemini-3.1-flash-live-preview',
                callbacks: {
                    onopen: () => {
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const base64 = encodePCM(inputData);
                            sessionPromise.then(s => s.sendRealtimeInput({ 
                                audio: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
                            }));
                        };
                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                        setIsVoiceMode(true);
                    },
                    onmessage: async (msg: LiveServerMessage) => {
                        const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (audioData) {
                            const buffer = await decodePCM(audioData, outputCtx);
                            const source = outputCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(outputCtx.destination);
                            const start = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                            source.start(start);
                            nextStartTimeRef.current = start + buffer.duration;
                            sourcesRef.current.add(source);
                            source.onended = () => sourcesRef.current.delete(source);
                        }
                        if (msg.serverContent?.interrupted) {
                            sourcesRef.current.forEach(s => s.stop());
                            sourcesRef.current.clear();
                        }
                    },
                    onerror: () => stopVoiceMode(),
                    onclose: () => stopVoiceMode(),
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: "You are a professional business advisor. Keep spoken responses concise and helpful.",
                }
            });
            liveSessionRef.current = await sessionPromise;
        } catch (err) {
            console.error("Mic error", err);
        }
    };

    const stopVoiceMode = () => {
        setIsVoiceMode(false);
        micStreamRef.current?.getTracks().forEach(t => t.stop());
        liveSessionRef.current?.close();
        audioContextRef.current?.close();
        sourcesRef.current.forEach(s => s.stop());
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatSessionRef.current) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            setMessages(prev => [...prev, { role: 'model', text: '' }]);
            const resultStream = await chatSessionRef.current.sendMessageStream({ message: userMessage });
            let fullText = '';
            for await (const chunk of resultStream) {
                 const c = chunk as GenerateContentResponse;
                 fullText += c.text || '';
                 setMessages(prev => {
                    const newMessages = [...prev];
                    const last = newMessages[newMessages.length - 1];
                    if (last.role === 'model') last.text = fullText;
                    return newMessages;
                 });
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Telemetry failure. Re-synchronizing neural link..." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
            <Card className="flex-1 flex flex-col overflow-hidden !p-0 shadow-2xl rounded-[2.5rem] border-0 bg-white">
                <div className="bg-indigo-600 p-6 text-white flex justify-between items-center shadow-lg relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        </div>
                        <div>
                            <h2 className="font-black text-xl tracking-tight leading-none mb-1">Strategy Desk</h2>
                            <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => isVoiceMode ? stopVoiceMode() : startVoiceMode()}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${isVoiceMode ? 'bg-rose-500 text-white animate-pulse shadow-rose-200 shadow-lg' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
                    >
                        <div className={`h-2 w-2 rounded-full ${isVoiceMode ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`}></div>
                        {isVoiceMode ? 'VOICE: ACTIVE' : 'LAUNCH VOICE'}
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] md:max-w-[80%] rounded-[1.8rem] px-6 py-5 shadow-sm transition-all animate-fade-in-up ${
                                msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                                : 'bg-white text-slate-700 border border-slate-200/60 rounded-tl-none font-medium'
                            }`}>
                                {msg.role === 'model' ? (
                                    <div className="text-sm leading-relaxed prose prose-indigo">
                                        {formatResponse(msg.text)}
                                        {idx === messages.length - 1 && isLoading && (
                                            <span className="inline-flex items-center gap-1 ml-1 translate-y-1">
                                                <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"></span>
                                                <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                                                <span className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed font-bold">{msg.text}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    {isVoiceMode && (
                        <div className="flex justify-center py-12 animate-fade-in">
                            <div className="flex items-center gap-1.5 h-12">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="w-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 40 + 10}px`, animationDelay: `${i * 0.08}s` }}></div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-8 bg-white border-t border-slate-100 relative shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.05)]">
                    <form onSubmit={handleSubmit} className="relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit(e as any))}
                            placeholder="Consult on legal, tax, or growth strategies..."
                            className="w-full pl-6 pr-16 py-5 rounded-3xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 resize-none shadow-sm text-sm font-medium transition-all"
                            rows={2}
                            disabled={isLoading || isVoiceMode}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim() || isVoiceMode}
                            className="absolute right-3.5 top-3.5 p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                            )}
                        </button>
                    </form>
                    <p className="text-center text-[10px] text-slate-400 mt-4 font-black uppercase tracking-[0.2em] opacity-60">SMEPal AI Engine · Local Data Security Active</p>
                </div>
            </Card>
        </div>
    );
};

export default BusinessAdvisor;
