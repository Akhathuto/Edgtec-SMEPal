
import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import TextArea from './common/TextArea';
import Button from './common/Button';

const contactDetails = {
    email: 'r.lepheane@outlook.com',
    phone: '+27 71 184 6709',
    address: '106312 Ngwabe Street, Kwa-Thema Mini Selecourt, Springs, Gauteng, 1575, South Africa',
    hours: 'Mon - Fri: 09:00 - 17:00 (SAST)',
    linkedin: 'https://linkedin.com/company/edgtec',
    twitter: 'https://twitter.com/edgtec_sa'
};

const ContactInfoItem: React.FC<{ icon: React.ReactElement; title: string; value: string; href?: string }> = ({ icon, title, value, href }) => (
    <div className="flex items-start space-x-4 p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all duration-300">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 rounded-lg text-indigo-600">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h4>
            {href ? (
                 <a href={href} className="text-md text-indigo-600 hover:text-indigo-800 break-all font-medium">{value}</a>
            ) : (
                <p className="text-md text-slate-600">{value}</p>
            )}
        </div>
    </div>
);

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-16">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">We're here to support your business journey. Reach out with questions, feedback, or partnership ideas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: INFO */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Get in Touch">
                        <div className="space-y-4">
                            <ContactInfoItem
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                                title="Email Address"
                                value={contactDetails.email}
                                href={`mailto:${contactDetails.email}`}
                            />
                            <ContactInfoItem
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                                title="Phone Number"
                                value={contactDetails.phone}
                                href={`tel:${contactDetails.phone.replace(/\s/g, '')}`}
                            />
                            <ContactInfoItem
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                title="Head Office"
                                value={contactDetails.address}
                            />
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Operating Hours</h4>
                            <div className="flex items-center text-sm text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {contactDetails.hours}
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href={contactDetails.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                                <a href={contactDetails.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-indigo-600 hover:text-white transition-all">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* RIGHT: FORM */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Send us a Message">
                        {submitted ? (
                            <div className="text-center py-12 space-y-4 animate-fade-in">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                                <p className="text-slate-600 max-w-sm mx-auto">Thank you for reaching out. A member of our team will get back to you within 24 hours.</p>
                                <Button variant="secondary" onClick={() => setSubmitted(false)}>Send another message</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input 
                                        label="Full Name" 
                                        id="name" 
                                        value={formData.name} 
                                        onChange={handleInputChange} 
                                        placeholder="John Doe" 
                                        required 
                                    />
                                    <Input 
                                        label="Email Address" 
                                        id="email" 
                                        type="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange} 
                                        placeholder="john@example.com" 
                                        required 
                                    />
                                </div>
                                <Input 
                                    label="Subject" 
                                    id="subject" 
                                    value={formData.subject} 
                                    onChange={handleInputChange} 
                                    placeholder="How can we help?" 
                                    required 
                                />
                                <TextArea 
                                    label="Message" 
                                    id="message" 
                                    value={formData.message} 
                                    onChange={handleInputChange} 
                                    rows={5} 
                                    placeholder="Tell us more about your inquiry..." 
                                    required 
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto px-10">
                                        Send Message
                                    </Button>
                                </div>
                            </form>
                        )}
                    </Card>

                    <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                             <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18.286c-3.472 0-6.286-2.814-6.286-6.286s2.814-6.286 6.286-6.286 6.286 2.814 6.286 6.286-2.814 6.286-6.286 6.286z"/></svg>
                        </div>
                        <div className="z-10 text-center md:text-left space-y-2">
                            <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
                            <p className="text-indigo-100 text-sm max-w-md">Looking for immediate answers? Our help center covers everything from registration to tax calculations.</p>
                        </div>
                        <div className="z-10 flex-shrink-0">
                            <button 
                                onClick={() => {/* Navigation handled via App parent */}} 
                                className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
                            >
                                Browse FAQs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
