import React, { useState } from 'react';
import Card from './common/Card';
import TextArea from './common/TextArea';
import Button from './common/Button';
import { getComplianceGuide } from '../services/geminiService';
import type { ComplianceGuide } from '../types';

const topics = [
    { name: 'CIPC Name Reservation', description: 'Get help with reserving a name for your new company.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> },
    { name: 'SARS Tax Registration', description: 'Guidance on registering for Income Tax, VAT, or PAYE.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h3m-3-10h.01M9 17h.01M12 17h.01M15 17h.01M9 14h.01M12 14h.01M15 14h.01M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z" /></svg> },
    { name: 'UIF Registration', description: 'Learn how to register your business and employees for UIF.', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
];

const TopicCard: React.FC<{ name: string, description: string, icon: JSX.Element, onSelect: () => void }> = ({ name, description, icon, onSelect }) => (
    <div onClick={onSelect} className="group flex items-center p-4 bg-white rounded-lg shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-lg h-16 w-16 flex items-center justify-center">
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-md font-semibold text-slate-800">{name}</h3>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
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
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Compliance Assistant</h2>
                    <p className="text-gray-600 mt-2">Get AI-powered guidance for key South African business compliance tasks. Select a topic to get started.</p>
                </div>
                <div className="space-y-4">
                    {topics.map(topic => (
                        <TopicCard key={topic.name} {...topic} onSelect={() => setSelectedTopic(topic.name)} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Compliance Guide: {selectedTopic}</h2>
                        <p className="text-gray-600 mb-6">Describe your business situation below for a personalized guide.</p>
                    </div>
                    <Button variant="secondary" onClick={handleStartOver}>Start Over</Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextArea
                        label="Describe your business and what you need to do"
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        placeholder="e.g., I'm a sole trader providing IT services and need to register for income tax."
                        required
                    />
                    <Button type="submit" isLoading={loading} className="w-full">
                        Generate Guide
                    </Button>
                </form>
            </Card>

            {loading && <Card><div className="text-center text-slate-600 p-8">Generating your compliance guide...</div></Card>}
            {error && <Card><div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div></Card>}

            {guide && (
                <Card>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">{guide.title}</h2>
                    <p className="text-center text-gray-600 mb-8">{guide.introduction}</p>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Required Documents & Information</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {guide.requiredDocuments.map((doc, index) => <li key={index}>{doc}</li>)}
                            </ul>
                        </div>

                        <div>
                             <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3">Step-by-Step Guide</h3>
                             <div className="space-y-6">
                                {guide.steps.map((step) => (
                                    <div key={step.step} className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">
                                            {step.step}
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-semibold text-gray-800 prose" dangerouslySetInnerHTML={{ __html: step.instruction.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline">$1</a>') }}></p>
                                            <p className="text-gray-600 mt-1">{step.details}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>

                        <div className="text-xs text-gray-500 bg-slate-50 p-4 rounded-md">
                            <span className="font-semibold">Disclaimer:</span> {guide.disclaimer}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ComplianceAssistant;
