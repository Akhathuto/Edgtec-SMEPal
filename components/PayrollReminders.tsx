
import React from 'react';
import Card from './common/Card';
import Button from './common/Button';

const reminders = [
    {
        day: '7th',
        title: 'PAYE / UIF / SDL Submission',
        description: 'Monthly EMP201 return and payment for Pay-As-You-Earn, Unemployment Insurance Fund, and Skills Development Levy.'
    },
    {
        day: '25th',
        title: 'VAT Return & Payment',
        description: 'For Category A vendors, the VAT201 return and payment is due by the 25th of the month following the tax period end.'
    },
    {
        day: 'Bi-Annually',
        title: 'EMP501 Reconciliation',
        description: 'Submission of the Employer Reconciliation Declaration (EMP501) and IRP5/IT3(a) certificates.'
    },
];

const ReminderCard: React.FC<{ day: string; title: string; description: string; }> = ({ day, title, description }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-start space-x-4">
        <div className="flex-shrink-0 bg-indigo-100 text-indigo-700 font-bold rounded-md w-20 h-20 flex items-center justify-center text-center text-xl">
            {day}
        </div>
        <div>
            <h3 className="text-md font-semibold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
    </div>
);


const PayrollReminders: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Card>
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">Key Payroll & Tax Dates</h2>
                    <p className="text-gray-600 mt-2 mb-6">Here are some important compliance dates for South African SMEs. We recommend setting these in your own calendar.</p>
                </div>

                <div className="space-y-4">
                    {reminders.map(reminder => <ReminderCard key={reminder.title} {...reminder} />)}
                </div>

                <div className="mt-8 text-center bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800">Want Automated Reminders?</h3>
                    <p className="text-gray-600 mt-2 mb-4">Our Pro plan integrates with your calendar to send you personalized reminders so you never miss a deadline.</p>
                    <Button>Upgrade to Pro</Button>
                </div>
            </Card>
        </div>
    );
};

export default PayrollReminders;
