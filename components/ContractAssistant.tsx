
import React, { useState } from 'react';
import Card from './common/Card';
import TextArea from './common/TextArea';
import Button from './common/Button';
import { generateContract } from '../services/geminiService';
import type { GeneratedContract } from '../types';

const ContractAssistant: React.FC = () => {
    const [description, setDescription] = useState('A simple freelance graphic design agreement for a logo design project. The freelancer will provide 3 initial concepts, and the client gets 2 rounds of revisions. Total project cost is R5000, with 50% upfront and 50% on completion.');
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState<GeneratedContract | null>(null);
    const [error, setError] = useState('');

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
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Contract Assistant</h2>
                <p className="text-gray-600 mb-6">Describe the agreement you need, and our AI will generate a basic template. This is not legal advice; consult a lawyer for important contracts.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextArea
                        label="Describe the agreement"
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={5}
                        required
                    />
                    <Button type="submit" isLoading={loading} className="w-full">
                        Generate Contract
                    </Button>
                </form>
            </Card>

            {loading && <Card><div className="text-center text-slate-600 p-8">Drafting your contract...</div></Card>}
            {error && <Card><div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div></Card>}
            
            {contract && (
                <Card>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{contract.title}</h2>
                    <div className="space-y-6 prose prose-slate max-w-none">
                        {contract.clauses.map((clause, index) => (
                            <div key={index}>
                                <h3 className="font-semibold text-gray-700">{index + 1}. {clause.heading}</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{clause.body}</p>
                            </div>
                        ))}
                    </div>
                     <div className="mt-8 text-center">
                        <Button variant="secondary" onClick={() => navigator.clipboard.writeText(
                            `${contract.title}\n\n${contract.clauses.map((c, i) => `${i + 1}. ${c.heading}\n${c.body}`).join('\n\n')}`
                        )}>
                            Copy Text
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ContractAssistant;
