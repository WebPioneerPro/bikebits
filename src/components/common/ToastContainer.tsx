import React from 'react';
import { useToast } from '../../context/ToastContext';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        type={toast.type}
                        message={toast.message}
                        onClose={() => removeToast(toast.id)}
                    />
                </div>
            ))}
        </div>
    );
};
