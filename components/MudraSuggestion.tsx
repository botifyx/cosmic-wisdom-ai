import React, { useState, useCallback } from 'react';
import { getHandMudraAnalysis } from '../services/geminiService';
// Fix: Import UserContext to use in component props
import { HandMudraAnalysis, UserContext } from '../types';

// Fix: Add Gender type, as it's passed from parent components.
type Gender = 'Male' | 'Female' | 'Unisex';

interface MudraSuggestionProps {
    analysisText: string;
    featureName: string;
    // Fix: Add userGender to props to be passed to the API.
    userGender: Gender | null;
    // Fix: Add userContext to the props interface
    userContext: UserContext | null;
}

const MudraSuggestion: React.FC<MudraSuggestionProps> = ({ analysisText, featureName, userGender, userContext }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [mudraData, setMudraData] = useState<(HandMudraAnalysis & { imageUrl: string | null }) | null>(null);
    const [error, setError] = useState('');

    const startMudraGeneration = useCallback(async () => {
        if (!analysisText) return;
        setIsLoading(true);
        setError('');
        setMudraData(null);

        // Fix: Pass the user's gender and userContext to the getHandMudraAnalysis function to satisfy its signature.
        const result = await getHandMudraAnalysis(analysisText, featureName, userGender || 'Unisex', userContext);
        if (result) {
            setMudraData(result);
        } else {
            setError('Could not generate a mudra suggestion at this time.');
        }
        setIsLoading(false);
    }, [analysisText, featureName, userGender, userContext]);

    return (
        <>
            <div className="p-6 bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-slate-900/20 rounded-2xl border border-blue-400/20 text-center h-full flex flex-col justify-between">
                <div>
                    <span className="text-4xl" role="img" aria-label="icon">🙏</span>
                    <h3 className="text-2xl font-playfair text-blue-300 mt-2">Find Your Cosmic Mudra</h3>
                    <p className="text-gray-300 max-w-2xl mx-auto my-4">Receive a personalized Hand Mudra (sacred gesture) to help channel the energies and insights from your reading into your daily life.</p>
                </div>
                <button
                    onClick={startMudraGeneration}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center mx-auto mt-4"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Revealing Mudra...
                        </>
                    ) : 'Reveal My Cosmic Mudra'}
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {mudraData && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.3s_ease-out]"
                    onClick={() => setMudraData(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mudra-modal-title"
                >
                    <div
                        className="bg-slate-900 border border-blue-400/30 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative mystic-card max-h-[90vh] overflow-y-auto custom-scrollbar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setMudraData(null)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            <div className="flex flex-col items-center">
                                {mudraData.imageUrl ? (
                                    <img src={mudraData.imageUrl} alt={mudraData.mudraName} className="w-full rounded-lg shadow-lg shadow-blue-500/10 mb-4" />
                                ) : (
                                    <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                                        <p className="text-gray-500">Image not available</p>
                                    </div>
                                )}
                                <h3 id="mudra-modal-title" className="text-2xl font-playfair text-blue-300 text-center">{mudraData.mudraName}</h3>
                                <p className="text-gray-400 text-center">{mudraData.sanskritName}</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-lg text-yellow-400">Description</h4>
                                    <p className="text-gray-300 text-sm">{mudraData.description}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-yellow-400">Instructions</h4>
                                    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                                        {mudraData.instructions.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-yellow-400">Your Personalized Guidance</h4>
                                    <p className="text-gray-300 text-sm">{mudraData.personalizedGuidance}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-yellow-400">Practice</h4>
                                    <p className="text-gray-300 text-sm">{mudraData.practice}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MudraSuggestion;