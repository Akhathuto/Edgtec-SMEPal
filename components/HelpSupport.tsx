import React, { useState } from 'react';
import Card from './common/Card';

interface FAQItemProps {
    question: string;
    answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100 py-4 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left focus:outline-none group"
            >
                <span className="text-md font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{question}</span>
                <svg 
                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div className="mt-3 text-sm text-slate-600 leading-relaxed animate-fade-in">
                    {answer}
                </div>
            )}
        </div>
    );
};

const HelpSupport: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Knowledge Base & Support</h1>
                <p className="mt-2 text-slate-600">Everything you need to know about SMEPal and South African business compliance.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SIDEBAR NAVIGATION */}
                <div className="lg:col-span-1 space-y-4">
                    <Card title="Quick Links">
                        <nav className="space-y-2">
                            <a href="#registration" className="block p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium">🏢 Company Registration</a>
                            <a href="#financials" className="block p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium">💰 Financial Tools</a>
                            <a href="#ai-advisor" className="block p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium">🤖 AI Assistants</a>
                            <a href="#privacy" className="block p-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors font-medium">🛡️ Data & Privacy</a>
                        </nav>
                    </Card>
                    <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-md">
                        <h4 className="font-bold mb-2">Need direct help?</h4>
                        <p className="text-xs opacity-80 mb-4">Our support team is available Monday - Friday, 9am to 5pm SAST.</p>
                        <a href="mailto:support@edgtec.co.za" className="text-sm font-semibold bg-white text-indigo-600 px-4 py-2 rounded-lg block text-center hover:bg-indigo-50 transition-colors">Email Support</a>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="lg:col-span-2 space-y-8">
                    {/* SECTION: REGISTRATION */}
                    <section id="registration">
                        <Card title="Company Registration (CIPC)">
                            <FAQItem 
                                question="What is the difference between a (Pty) Ltd and an NPC?"
                                answer={
                                    <div className="space-y-2">
                                        <p><strong>Private Company ((Pty) Ltd):</strong> A for-profit entity. Owned by shareholders and managed by at least one director. This is the standard choice for entrepreneurs.</p>
                                        <p><strong>Non-Profit Company (NPC):</strong> An entity established for public benefit. It has no shareholders and must have a minimum of <strong>3 directors</strong>. All income must be used to further its social objectives.</p>
                                    </div>
                                }
                            />
                            <FAQItem 
                                question="What are the specific document requirements?"
                                answer={
                                    <ul className="list-disc list-inside space-y-2">
                                        <li><strong>Certified IDs:</strong> Must be certified by a Commissioner of Oaths (e.g., SAPS) within the last 3 months. High-quality digital scans are required.</li>
                                        <li><strong>Proof of Address:</strong> A utility bill or bank statement (not older than 3 months) is required for FICA compliance to verify the physical location of the business.</li>
                                        <li><strong>NPC Objects:</strong> For NPCs, you must provide a clear description of the company's social benefit or public goal for the MOI.</li>
                                    </ul>
                                }
                            />
                            <FAQItem 
                                question="How long does registration take?"
                                answer="Once submitted through SMEPal, the CIPC typically processes registrations within 3 to 5 business days. You will receive your Cor14.3 (Registration Certificate) and MOI via email as soon as they are issued."
                            />
                        </Card>
                    </section>

                    {/* SECTION: FINANCIALS */}
                    <section id="financials">
                        <Card title="Financial & Invoicing Tools">
                            <FAQItem 
                                question="Can I customize the look of my invoices?"
                                answer="Yes! SMEPal offers four visual themes: Standard (Professional), Modern (Sleek), Minimal (Clean), and Bold (High Contrast). You can also upload your own company logo and save 'Branding Profiles' to quickly switch between different business identities."
                            />
                            <FAQItem 
                                question="Is the Receipt Scanner accurate?"
                                answer="Our AI-powered scanner uses advanced OCR to extract merchant names, dates, and amounts. For best results, ensure the receipt is flat, well-lit, and the text is not blurry. You can always manually edit any extracted details before saving."
                            />
                            <FAQItem 
                                question="Is the Tax Calculator accurate?"
                                answer="The Tax Estimator provides a high-level estimate based on the current South African personal income tax brackets for sole proprietors. It is not a substitute for professional accounting advice and does not include complex deductions like capital gains or corporate tax structures."
                            />
                        </Card>
                    </section>

                    {/* SECTION: AI ADVISOR */}
                    <section id="ai-advisor">
                        <Card title="Using the AI Assistants">
                            <FAQItem 
                                question="What can the Business Advisor help with?"
                                answer="The AI Advisor is trained on South African business regulations and marketing strategies. You can ask it about SARS compliance, labor laws (CCMA), marketing ideas for the local market, or general operational strategy."
                            />
                            <FAQItem 
                                question="Are the generated contracts legally binding?"
                                answer="The Contract Assistant provides a professional base template based on your specific needs. While it includes standard legal protections, we strongly recommend having any high-value or complex agreement reviewed by a qualified South African attorney."
                            />
                        </Card>
                    </section>

                    {/* SECTION: PRIVACY */}
                    <section id="privacy">
                        <Card title="Data Privacy & Security">
                            <FAQItem 
                                question="Where is my business data stored?"
                                answer={
                                    <div className="space-y-2">
                                        <p>To ensure maximum privacy, your <strong>Client List</strong>, <strong>Expense Logs</strong>, and <strong>Invoice History</strong> are stored locally in your browser's <code className="bg-slate-100 px-1 rounded">localStorage</code>.</p>
                                        <p>This means your sensitive business data <strong>never leaves your device</strong> unless you explicitly submit a form for processing (like Company Registration).</p>
                                        <p className="text-amber-600 font-medium">⚠️ Note: Clearing your browser's cache or 'Site Data' will delete your saved clients and expenses. We recommend regular CSV exports for backup.</p>
                                    </div>
                                }
                            />
                            <FAQItem 
                                question="Is my payment information safe?"
                                answer="We do not store your credit card details on our servers. All registration payments are processed through a secure, PCI-DSS compliant partner gateway using industry-standard encryption."
                            />
                        </Card>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;