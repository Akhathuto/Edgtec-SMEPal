import React from 'react';
import Card from './common/Card';
import Ownership from './Ownership';
import type { OwnershipData } from '../types';

const ownershipInfo: OwnershipData = {
    legalName: 'EDGTEC',
    registrationNumber: '2025/534716/07',
    owners: [
        { name: 'RANTHUTU LEPHEANE', percentage: '70.00%' },
        { name: 'SIPHOSAKHE MATHEWS MSIMANGO', percentage: '30.00%' },
    ]
};

const About: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <h2 className="text-2xl font-bold text-gray-800">About SMEPal</h2>
                <p className="mt-4 text-gray-600">
                    SMEPal is an AI-powered assistant designed to help South African Small and Medium-sized Enterprises (SMEs) streamline their administrative tasks. 
                    Our mission is to provide a suite of tools that simplify invoicing, tax estimation, contract drafting, and client management, saving business owners valuable time and effort so they can focus on what they do best: growing their business.
                </p>
            </Card>
            <Ownership title="Our Company" data={ownershipInfo} />
        </div>
    );
};

export default About;