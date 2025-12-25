import React, { useState, useEffect } from 'react';
import type { Feature } from '../types';
import { SAMPLE_ANALYSES } from '../services/sampleData';

interface FeaturePreviewProps {
  feature: Feature;
  onClose: () => void;
  onSelectPackage: () => void;
}

const FeaturePreview: React.FC<FeaturePreviewProps> = ({ feature, onClose, onSelectPackage }) => {
    const [isClosing, setIsClosing] = useState(false);
    const sampleData = SAMPLE_ANALYSES[feature.id];
    const firstSection = sampleData?.analysis?.sections?.[0];
    const otherSections = sampleData?.analysis?.sections?.slice(1);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const modalAnimation = isClosing ? 'animate-[fadeOut_0.3s_ease-in-out]' : 'preview-modal-overlay';
    const containerAnimation = isClosing ? 'animate-[modal-scale-down_0.3s_ease-in-out]' : 'preview-modal-container';

    return (
        <div
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${modalAnimation}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-yellow-400/20 flex flex-col overflow-hidden ${containerAnimation}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 text-center border-b border-gray-700/50">
                    <feature.Icon className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h2 className="text-3xl font-playfair font-bold text-white">Sample {feature.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                    {firstSection ? (
                        <>
                            <div className="mb-6">
                                <h3 className="font-bold text-lg text-yellow-300">{firstSection.title}</h3>
                                <p className="text-gray-300 whitespace-pre-wrap">{firstSection.description}</p>
                            </div>

                            <div className="space-y-4">
                                {otherSections.map((section: any, index: number) => (
                                    <div key={index} className="locked-section p-4 border border-gray-700/50 rounded-lg">
                                        <div className="locked-content">
                                            <h4 className="font-bold text-lg text-yellow-300">{section.title}</h4>
                                            <p className="text-gray-300 whitespace-pre-wrap">{section.description}</p>
                                        </div>
                                        {index === 0 && (
                                            <div className="locked-indicator">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                                                <span className="text-sm font-semibold text-white">Unlock to view all sections</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400 text-center">This is a creative tool. Purchase a package to generate your own unique tattoos, art, and more based on your personal cosmic readings!</p>
                    )}
                </div>

                <div className="p-6 border-t border-gray-700/50 bg-gray-900/50">
                    <button
                        onClick={onSelectPackage}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/20"
                    >
                        Unlock with a Cosmic Reading
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturePreview;