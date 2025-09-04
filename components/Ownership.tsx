import React from 'react';
import Card from './common/Card';
import type { OwnershipData } from '../types';

interface OwnershipProps {
    title: string;
    data: OwnershipData;
}

const Ownership: React.FC<OwnershipProps> = ({ title, data }) => {
    return (
        <Card title={title}>
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Company Details</h3>
                    <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Legal Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{data.legalName}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Company Registration Number</dt>
                            <dd className="mt-1 text-sm text-gray-900">{data.registrationNumber}</dd>
                        </div>
                    </dl>
                </div>
                 <div>
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Owners</h3>
                    <ul role="list" className="mt-4 divide-y divide-gray-200">
                        {data.owners.map((owner) => (
                            <li key={owner.name} className="flex items-center justify-between py-3">
                                <div className="flex items-center">
                                     <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="font-bold text-indigo-700">{owner.name.charAt(0)}</span>
                                     </div>
                                    <p className="ml-4 text-sm font-medium text-gray-900">{owner.name}</p>
                                </div>
                                <p className="text-sm text-gray-500">{owner.percentage}</p>
                            </li>
                         ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default Ownership;