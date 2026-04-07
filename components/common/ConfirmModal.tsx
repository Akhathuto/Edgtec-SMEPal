
import React from 'react';
import Button from './Button';
import Card from './Card';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'primary'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-md !rounded-[2.5rem] shadow-2xl border-0 p-10 animate-soft-reveal">
                <div className="text-center space-y-6">
                    <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto ${variant === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-600'}`}>
                        {variant === 'danger' ? (
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        ) : (
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">{message}</p>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Button variant="secondary" onClick={onCancel} className="flex-1 !py-4 !rounded-2xl">{cancelText}</Button>
                        <Button variant={variant === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} className="flex-1 !py-4 !rounded-2xl shadow-lg">{confirmText}</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ConfirmModal;
