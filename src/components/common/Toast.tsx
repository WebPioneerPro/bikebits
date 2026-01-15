import React from 'react';
import { ToastType } from '../../context/ToastContext';
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

const toastStyles = {
    success: {
        icon: <CheckCircleIcon className="w-6 h-6 text-emerald-500" />,
        borderColor: 'border-emerald-500/20',
        bgColor: 'bg-emerald-50/70 dark:bg-emerald-900/30',
        textColor: 'text-emerald-900 dark:text-emerald-100',
    },
    error: {
        icon: <XCircleIcon className="w-6 h-6 text-rose-500" />,
        borderColor: 'border-rose-500/20',
        bgColor: 'bg-rose-50/70 dark:bg-rose-900/30',
        textColor: 'text-rose-900 dark:text-rose-100',
    },
    warning: {
        icon: <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />,
        borderColor: 'border-amber-500/20',
        bgColor: 'bg-amber-50/70 dark:bg-amber-900/30',
        textColor: 'text-amber-900 dark:text-amber-100',
    },
    info: {
        icon: <InformationCircleIcon className="w-6 h-6 text-sky-500" />,
        borderColor: 'border-sky-500/20',
        bgColor: 'bg-sky-50/70 dark:bg-sky-900/30',
        textColor: 'text-sky-900 dark:text-sky-100',
    },
};

export const Toast: React.FC<ToastProps> = ({ type, message, onClose }) => {
    const style = toastStyles[type];

    return (
        <div
            className={`
        flex items-center gap-3 p-4 pr-10 rounded-xl border
        backdrop-blur-md shadow-2xl transition-all duration-500
        animate-in slide-in-from-right-full fade-in
        ${style.bgColor} ${style.borderColor} ${style.textColor}
        min-w-[320px] max-w-md relative group
      `}
        >
            <div className="flex-shrink-0 animate-pulse">
                {style.icon}
            </div>
            <p className="text-sm font-semibold leading-relaxed">
                {message}
            </p>
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/5"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>

            {/* Visual Bottom Bar */}
            <div className={`absolute bottom-0 left-0 h-1 rounded-full animate-progress-shrink ${style.icon.props.className.split(' ').find(c => c.startsWith('text-')).replace('text-', 'bg-')}`} />
        </div>
    );
};
