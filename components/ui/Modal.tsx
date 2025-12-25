
import React from 'react';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: ModalType;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    type = 'info', 
    title, 
    message, 
    actionLabel = 'Close',
    onAction 
}) => {
    if (!isOpen) return null;

    const handleAction = () => {
        if (onAction) onAction();
        onClose();
    };

    // Theme Config based on type
    const theme = {
        success: {
            bgIcon: 'bg-green-100',
            textIcon: 'text-green-600',
            button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
            border: 'border-green-500/30',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            )
        },
        error: {
            bgIcon: 'bg-red-100',
            textIcon: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
            border: 'border-red-500/30',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        warning: {
            bgIcon: 'bg-yellow-100',
            textIcon: 'text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
            border: 'border-yellow-500/30',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            )
        },
        info: {
            bgIcon: 'bg-blue-100',
            textIcon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
            border: 'border-blue-500/30',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    };

    const currentTheme = theme[type];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]" onClick={onClose}>
            <div className={`bg-gray-900 border ${currentTheme.border} rounded-xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-[scaleIn_0.2s_ease-out]`} onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${currentTheme.bgIcon} mb-4`}>
                        <div className={currentTheme.textIcon}>
                            {currentTheme.icon}
                        </div>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-white font-playfair">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-300">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="mt-5 sm:mt-6">
                    <button
                        type="button"
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors ${currentTheme.button}`}
                        onClick={handleAction}
                    >
                        {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
