import React from 'react';
import Card from './common/Card';

const contactDetails = {
    email: 'r.lepheane@outlook.com',
    phone: '+27 71 184 6709',
    address: '106312 Ngwabe Street, Kwa-Thema Mini Selecourt, Springs, Gauteng, 1575, South Africa'
};

const ContactInfoItem: React.FC<{ icon: JSX.Element; title: string; value: string; href?: string }> = ({ icon, title, value, href }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-lg text-indigo-600">
            {icon}
        </div>
        <div>
            <h4 className="text-md font-semibold text-gray-800">{title}</h4>
            {href ? (
                 <a href={href} className="text-sm text-indigo-600 hover:text-indigo-800 break-all">{value}</a>
            ) : (
                <p className="text-sm text-gray-600">{value}</p>
            )}
        </div>
    </div>
);

const Contact: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Card title="Contact Us">
                 <div className="text-center mb-8">
                    <p className="text-gray-600">Have questions or need support? Reach out to us.</p>
                </div>
                <div className="space-y-6">
                    <ContactInfoItem
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        title="Email"
                        value={contactDetails.email}
                        href={`mailto:${contactDetails.email}`}
                    />
                     <ContactInfoItem
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                        title="Phone"
                        value={contactDetails.phone}
                        href={`tel:${contactDetails.phone.replace(/\s/g, '')}`}
                    />
                     <ContactInfoItem
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        title="Address"
                        value={contactDetails.address}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Contact;