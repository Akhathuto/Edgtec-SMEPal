import React, { useState } from 'react';
import Card from './common/Card';
import Input from './common/Input';
import Button from './common/Button';
import ToggleSwitch from './common/ToggleSwitch';

const UserProfile: React.FC = () => {
    // Mock user data, in a real app this would come from an API/auth context
    const [user, setUser] = useState({
        name: 'Ranthutu Lepheane',
        email: 'ranthutu.lepheane@example.com',
        company: 'EDGTEC (Pty) Ltd',
        avatar: 'https://picsum.photos/100', // Placeholder avatar
    });

    const [notifications, setNotifications] = useState({
        weeklySummary: true,
        productUpdates: true,
        securityAlerts: false,
    });

    const handleUserChange = (field: keyof typeof user, value: string) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleUserChange('avatar', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would call an API here
        alert('Profile saved successfully!');
    };
    
    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would call an API here
        alert('Password changed successfully!');
    };

    const handleDeleteAccount = () => {
        if (window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
             // In a real app, you would call an API here
            alert("Account deletion initiated.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">User Profile</h1>
            
            <Card title="Profile Details">
                <form onSubmit={handleSaveChanges} className="space-y-6">
                     <div className="flex items-center space-x-6">
                        <img src={user.avatar} alt="User Avatar" className="h-24 w-24 rounded-full object-cover" />
                        <div>
                            <label htmlFor="avatar-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                                Change
                            </label>
                            <input id="avatar-upload" name="avatar-upload" type="file" className="sr-only" onChange={handleAvatarUpload} accept="image/*" />
                            <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 2MB.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Full Name" id="name" value={user.name} onChange={e => handleUserChange('name', e.target.value)} />
                        <Input label="Email Address" id="email" type="email" value={user.email} onChange={e => handleUserChange('email', e.target.value)} />
                    </div>
                     <Input label="Company Name" id="company" value={user.company} onChange={e => handleUserChange('company', e.target.value)} />

                    <div className="flex justify-end">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </Card>

            <Card title="Change Password">
                 <form onSubmit={handleChangePassword} className="space-y-4">
                    <Input label="Current Password" id="current-password" type="password" />
                    <Input label="New Password" id="new-password" type="password" />
                    <Input label="Confirm New Password" id="confirm-password" type="password" />
                    <div className="flex justify-end">
                        <Button type="submit">Update Password</Button>
                    </div>
                </form>
            </Card>

            <Card title="Notification Settings">
                <div className="space-y-4">
                    <ToggleSwitch
                        label="Weekly Summary"
                        description="Receive a weekly summary of your business activity."
                        enabled={notifications.weeklySummary}
                        setEnabled={(value) => setNotifications(p => ({ ...p, weeklySummary: value }))}
                    />
                     <ToggleSwitch
                        label="Product Updates"
                        description="Get notified about new features and updates to SMEPal."
                        enabled={notifications.productUpdates}
                        setEnabled={(value) => setNotifications(p => ({ ...p, productUpdates: value }))}
                    />
                     <ToggleSwitch
                        label="Security Alerts"
                        description="Receive alerts for important security events."
                        enabled={notifications.securityAlerts}
                        setEnabled={(value) => setNotifications(p => ({ ...p, securityAlerts: value }))}
                    />
                </div>
            </Card>

            <Card title="Danger Zone">
                <div className="flex justify-between items-center bg-red-50 p-4 rounded-lg">
                    <div>
                        <h4 className="font-semibold text-red-800">Delete Your Account</h4>
                        <p className="text-sm text-red-700">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <Button variant="danger" onClick={handleDeleteAccount}>Delete Account</Button>
                </div>
            </Card>
        </div>
    );
};

export default UserProfile;
