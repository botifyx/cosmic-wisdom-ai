import React, { useState, useCallback } from 'react';
import { createTattooPromptFromAnalysis } from '../services/geminiService';
// Fix: Add UserContext to component props
import { UserContext } from '../types';

interface TattooSuggestionProps {
  analysisText: string;
  onGenerateTattoo: (details: { prompt: string; placement: string; aspectRatio: string; }) => void;
  featureName: 'Astrology' | 'Palmistry' | 'Matchmaking' | 'Sacred Union' | 'FaceReading' | 'MantraGenerator' | 'ZodiacCompatibility' | 'Moleology' | 'Handwriting' | 'Tarot';
  // Fix: Add userContext to the props interface
  userContext: UserContext | null;
}

const TattooSuggestion: React.FC<TattooSuggestionProps> = ({ analysisText, onGenerateTattoo, featureName, userContext }) => {
    const [isLoading, setIsLoading] = useState(false);

    const config = {
        Astrology: {
            title: 'Embody Your Cosmic Blueprint',
            description: 'Transform the core insights from your Vedic chart into a powerful visual talisman. Create a personalized sacred tattoo to carry your destiny with you.',
            buttonText: 'Generate Your Cosmic Tattoo',
            icon: '✨'
        },
        Palmistry: {
            title: 'Ink Your Path',
            description: 'Turn the story etched in your palm into a unique tattoo design. Generate a symbolic image representing your life\'s journey and potential, a permanent reminder of your destiny.',
            buttonText: 'Design Your Destiny Tattoo',
            icon: '✋'
        },
        FaceReading: {
            title: 'Wear Your Character',
            description: 'Create a visual tattoo of your inner self. Generate a symbolic design that represents the unique character traits and potential revealed in your face reading.',
            buttonText: 'Design Your Character Tattoo',
            icon: '🎭'
        },
        Handwriting: {
            title: 'Ink Your Inner Script',
            description: 'Transform the essence of your handwriting analysis into a unique visual representation. Create a sacred tattoo that embodies the traits revealed in your writing.',
            buttonText: 'Design Your Signature Tattoo',
            icon: '✍️'
        },
        Matchmaking: {
            title: 'Seal Your Union in Ink',
            description: 'Create a visual representation of your unique connection. This "Union Sigil" will be a beautiful tattoo design symbolizing your shared strengths and path for growth.',
            buttonText: 'Create Your Union Sigil',
            icon: '💞'
        },
        'Sacred Union': {
            title: 'Embody Your Sacred Bond',
            description: 'Translate the essence of your spiritual connection into a sacred tattoo. This artwork can serve as a focal point for meditation and a celebration of your unique harmony.',
            buttonText: 'Manifest Your Sacred Tattoo',
            icon: '🧘'
        },
        MantraGenerator: {
            title: 'Visualize Your Mantra as a Tattoo',
            description: 'Transform the essence of your sacred mantra into a unique piece of cosmic ink. This visual representation can serve as a powerful focal point for your daily intentions.',
            buttonText: 'Generate Mantra Tattoo',
            icon: '🎨'
        },
        ZodiacCompatibility: {
            title: 'Ink Your Cosmic Connection',
            description: 'Transform the essence of your unique zodiac connection into a piece of cosmic ink. This visual representation can serve as a beautiful reminder of your shared energies.',
            buttonText: 'Generate Connection Tattoo',
            icon: '🎨'
        },
        Moleology: {
            title: 'Illustrate Your Sacred Marks',
            description: 'Convert the ancient wisdom revealed by your moles into a unique symbolic tattoo. Create a personal design that reflects your inherent traits and destiny.',
            buttonText: 'Design Your Sacred Mark',
            icon: '💠'
        },
        Tarot: {
            title: 'Illustrate Your Reading',
            description: 'Convert the wisdom of your Tarot spread into a unique symbolic tattoo. Create a personal design that reflects your journey and the guidance you received.',
            buttonText: 'Design Your Tarot Tattoo',
            icon: '🃏'
        },
    };

    const currentConfig = config[featureName] || config.Astrology;

    const startTattooGeneration = useCallback(async () => {
        if (!analysisText) return;
        setIsLoading(true);
        // Fix: Pass userContext to the createTattooPromptFromAnalysis function call.
        const tattooDetails = await createTattooPromptFromAnalysis(analysisText, featureName, userContext);
        if (tattooDetails) {
            onGenerateTattoo({ 
                prompt: tattooDetails.prompt,
                placement: tattooDetails.placement,
                // Default to phone wallpaper aspect ratio, which is ideal for showing tattoo designs
                aspectRatio: '9:16'
            }); 
        }
        setIsLoading(false); 
    }, [analysisText, onGenerateTattoo, featureName, userContext]);
    
    return (
        <div className="p-6 bg-gradient-to-br from-yellow-500/10 via-purple-500/10 to-slate-900/20 rounded-2xl border border-yellow-400/20 text-center h-full flex flex-col justify-between">
            <div>
                <span className="text-4xl" role="img" aria-label="icon">{currentConfig.icon}</span>
                <h3 className="text-2xl font-playfair text-yellow-300 mt-2">{currentConfig.title}</h3>
                <p className="text-gray-300 max-w-2xl mx-auto my-4">{currentConfig.description}</p>
            </div>
            <button
                onClick={startTattooGeneration}
                disabled={isLoading}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center mx-auto mt-4"
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
    );
};

export default TattooSuggestion;