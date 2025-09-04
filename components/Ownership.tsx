import React from 'react';
import Card from './common/Card';

const ownershipData = {
    legalName: 'EDGTEC',
    registrationNumber: '2025/534716/07',
    owners: [
        { name: 'RANTHUTU LEPHEANE', percentage: '70.00%' },
        { name: 'SIPHOSAKHE MATHEWS MSIMANGO', percentage: '30.00%' },
    ]
};

const Ownership: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Card title="Ownership Information">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Company Details</h3>
                        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Legal Name</dt>
                                <dd className="mt-1 text-sm text-gray-900">{ownershipData.legalName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">Company Registration Number</dt>
                                <dd className="mt-1 text-sm text-gray-900">{ownershipData.registrationNumber}</dd>
                            </div>
                        </dl>
                    </div>
                     <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Owners</h3>
                        <ul role="list" className="mt-4 divide-y divide-gray-200">
                            {ownershipData.owners.map((owner) => (
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
        </div>
    );
};

export default Ownership;