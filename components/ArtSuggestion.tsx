import React, { useState, useCallback } from 'react';
import { createArtPromptFromAnalysis } from '../services/geminiService';

interface ArtSuggestionProps {
  analysisText: string;
  onGeneratePrompt: (prompt: string, aspectRatio: string) => void;
  featureName: 'Astrology' | 'Palmistry' | 'Matchmaking' | 'Sacred Union' | 'FaceReading' | 'MantraGenerator' | 'ZodiacCompatibility' | 'Moleology' | 'Handwriting';
}

const ArtSuggestion: React.FC<ArtSuggestionProps> = ({ analysisText, onGeneratePrompt, featureName }) => {
    const [isLoading, setIsLoading] = useState(false);

    const config = {
        Astrology: {
            title: 'Harness Your Cosmic Blueprint',
            description: 'Transform the core insights from your Vedic chart into a powerful visual sigil. Create a personalized piece of cosmic art to use as a wallpaper, helping you align with your destiny.',
            buttonText: 'Generate Your Cosmic Sigil',
            icon: '✨'
        },
        Palmistry: {
            title: 'Visualize Your Path',
            description: 'Turn the story etched in your palm into a unique piece of art. Generate a symbolic image representing your life\'s journey and potential, a daily reminder of your destiny.',
            buttonText: 'Visualize Your Destiny',
            icon: '✋'
        },
        FaceReading: {
            title: 'Reflect Your Character',
            description: 'Create a visual portrait of your inner self. Generate a symbolic image that represents the unique character traits and potential revealed in your face reading.',
            buttonText: 'Visualize Your Character',
            icon: '🎭'
        },
        Handwriting: {
            title: 'Create Your Written Signature',
            description: 'Transform the essence of your handwriting analysis into a unique visual representation. Create an artistic signature that embodies the traits revealed in your writing.',
            buttonText: 'Visualize Your Signature',
            icon: '✍️'
        },
        Matchmaking: {
            title: 'Manifest Your Union',
            description: 'Create a visual representation of your unique connection. This "Union Mandala" will be a beautiful piece of art symbolizing your shared strengths and path for growth.',
            buttonText: 'Create Your Union Mandala',
            icon: '💞'
        },
        'Sacred Union': {
            title: 'Embody Your Sacred Bond',
            description: 'Translate the essence of your spiritual connection into a sacred image. This artwork can serve as a focal point for meditation and a celebration of your unique harmony.',
            buttonText: 'Manifest Your Sacred Bond',
            icon: '🧘'
        },
        MantraGenerator: {
            title: 'Create a Visual Portrait of Your Mantra',
            description: 'Transform the essence of your sacred mantra into a unique piece of cosmic art. This visual representation can serve as a powerful focal point for your meditation and daily intentions.',
            buttonText: 'Generate Visual Portrait',
            icon: '🎨'
        },
        ZodiacCompatibility: {
            title: 'Create a Visual Portrait of Your Connection',
            description: 'Transform the essence of your unique zodiac connection into a piece of cosmic art. This visual representation can serve as a beautiful reminder of your shared energies.',
            buttonText: 'Generate Visual Portrait',
            icon: '🎨'
        },
        Moleology: {
            title: 'Illustrate Your Markings',
            description: 'Convert the ancient wisdom revealed by your moles into a unique symbolic image. Create a personal piece of art that reflects your inherent traits and destiny.',
            buttonText: 'Visualize Your Markings',
            icon: '💠'
        },
    };

    const currentConfig = config[featureName];

    const startArtGeneration = useCallback(async () => {
        if (!analysisText) return;
        setIsLoading(true);
        const artPrompt = await createArtPromptFromAnalysis(analysisText, featureName);
        if (artPrompt) {
            // Default to phone wallpaper aspect ratio, which is ideal for personal sigils
            onGeneratePrompt(artPrompt, '9:16'); 
        }
        setIsLoading(false); 
    }, [analysisText, onGeneratePrompt, featureName]);
    
    return (
        <>
            <div className="mt-8 p-6 bg-gradient-to-br from-yellow-500/10 via-purple-500/10 to-slate-900/20 rounded-2xl border border-yellow-400/20 text-center animate-[fadeIn_1s_ease-in-out] print-hidden">
                <span className="text-4xl" role="img" aria-label="icon">{currentConfig.icon}</span>
                <h3 className="text-2xl font-playfair text-yellow-300 mt-2">{currentConfig.title}</h3>
                <p className="text-gray-300 max-w-2xl mx-auto my-4">{currentConfig.description}</p>
                <button
                    onClick={startArtGeneration}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center mx-auto"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Your Vision...
                        </>
                    ) : (
                        `${currentConfig.buttonText}`
                    )}
                </button>
            </div>
        </>
    );
};

export default ArtSuggestion;