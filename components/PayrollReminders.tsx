import React from 'react';
import Card from './common/Card';
import Button from './common/Button';

const reminders = [
    {
        day: '7th',
        title: 'PAYE / UIF / SDL Submission',
        description: 'Monthly EMP201 return and payment for Pay-As-You-Earn, Unemployment Insurance Fund, and Skills Development Levy. Mandatory for all employers.'
    },
    {
        day: '25th',
        title: 'VAT Return & Payment',
        description: 'For Category A vendors, the VAT201 return and payment is due by the 25th of the month following the tax period end. Use eFiling for faster processing.'
    },
    {
        day: '7th',
        title: 'UIF uFiling Declaration',
        description: 'Submit your monthly employee declarations to the Department of Labour via the uFiling portal. Ensures benefits are accurate for staff.'
    },
    {
        day: 'Bi-Annually',
        title: 'EMP501 Reconciliation',
        description: 'Submission of the Employer Reconciliation Declaration (EMP501) and IRP5/IT3(a) certificates to SARS. Happens in May and October.'
    },
    {
        day: 'Annually',
        title: 'COIDA Return of Earnings',
        description: 'Submit your annual return of earnings to the Compensation Fund to maintain your Letter of Good Standing.'
    },
];

const ReminderCard: React.FC<{ day: string; title: string; description: string; }> = ({ day, title, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start space-x-6 hover:shadow-md transition-shadow group">
        <div className="flex-shrink-0 bg-indigo-600 text-white font-black rounded-2xl w-20 h-20 flex items-center justify-center text-center text-xl shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
            {day}
        </div>
        <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium italic">"{description}"</p>
        </div>
    </div>
);


const PayrollReminders: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-16 animate-fade-in">
            <div className="text-center space-y-4 pt-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Compliance Calendar</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">Never miss a SARS or Labour deadline. These are the critical statutory dates for South African SMEs.</p>
            </div>

            <div className="space-y-6">
                {reminders.map(reminder => <ReminderCard key={reminder.title} {...reminder} />)}
            </div>

            <div className="bg-indigo-700 text-white rounded-[3rem] p-12 text-center relative overflow-hidden shadow-3xl">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                     <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/></svg>
                </div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-4">Want Automated Reminders?</h3>
                    <p className="text-indigo-100 text-lg mb-8 max-w-md mx-auto">Our Professional Tier integrates directly with your Google or Outlook calendar to send you real-time push alerts.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button className="!bg-white !text-indigo-700 hover:!bg-indigo-50 !py-4 px-10 shadow-2xl">Upgrade to Pro</Button>
                        <Button variant="ghost" className="!text-white border border-white/20 hover:!bg-white/10 !py-4 px-10">Export .ICS File</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollReminders;
