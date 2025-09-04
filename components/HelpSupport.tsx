import React from 'react';
import Card from './common/Card';

const faqs = [
    {
        question: "How do I generate an invoice?",
        answer: "Navigate to the 'Invoice Generator' tool. Fill in your details and your client's details in the form. Add line items for your products or services, then click 'Generate Invoice'. A preview will appear on the right."
    },
    {
        question: "How does the Client Management tool work?",
        answer: "In 'Client Management', you can add, edit, or delete clients. Once a client is saved, you can quickly select them from the dropdown in the 'Invoice Generator' to auto-fill their details, saving you time."
    },
    {
        question: "Is the tax calculation official tax advice?",
        answer: "No. The 'Tax Calculator' provides an estimate for informational purposes only, based on standard sole proprietor tax brackets in South Africa. It is not a substitute for professional financial advice. Please consult with a registered tax practitioner."
    },
    {
        question: "Can I customize the generated contracts?",
        answer: "The 'Contract Assistant' generates a basic template based on your description. You can copy the generated text and modify it in any text editor. For legally binding agreements, we strongly recommend having a lawyer review the contract."
    },
    {
        question: "Is my data stored securely?",
        answer: "Your client data is stored locally in your browser's localStorage. It is not sent to any server, ensuring your privacy. Clearing your browser data will remove saved clients."
    }
];

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
    <div className="py-5">
        <dt className="text-md font-semibold text-gray-900">{question}</dt>
        <dd className="mt-2 text-sm text-gray-600">{answer}</dd>
    </div>
);

const HelpSupport: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Card title="Frequently Asked Questions">
                 <div className="divide-y divide-gray-200">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                 </div>
            </Card>
        </div>
    );
};

export default HelpSupport;