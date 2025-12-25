import React, { useState, useCallback } from 'react';
import { createArtPromptFromAnalysis } from '../services/geminiService';
// Fix: Add UserContext to component props
import { UserContext } from '../types';

interface ArtSuggestionProps {
  analysisText: string;
  onGenerateArt: (details: { prompt: string; aspectRatio: string; }) => void;
  featureName: 'Astrology' | 'Palmistry' | 'Matchmaking' | 'Sacred Union' | 'FaceReading' | 'MantraGenerator' | 'ZodiacCompatibility' | 'Moleology' | 'Handwriting' | 'Tarot';
  // Fix: Add userContext to the props interface
  userContext: UserContext | null;
}

const ArtSuggestion: React.FC<ArtSuggestionProps> = ({ analysisText, onGenerateArt, featureName, userContext }) => {
    const [isLoading, setIsLoading] = useState(false);

    const config = {
        title: 'Visualize Your Cosmic Story',
        description: 'Transform the essence of your analysis into a stunning piece of mystical art. Generate a unique, vibrant image to use as a wallpaper or personal inspiration.',
        buttonText: 'Generate Cosmic Art',
        icon: '🎨'
    };

    const startArtGeneration = useCallback(async () => {
        if (!analysisText) return;
        setIsLoading(true);
        // Fix: Pass userContext to the createArtPromptFromAnalysis function call.
        const artDetails = await createArtPromptFromAnalysis(analysisText, featureName, userContext);
        if (artDetails) {
            onGenerateArt({ 
                prompt: artDetails.prompt,
                aspectRatio: '16:9' // Default to a wide aspect ratio for art
            }); 
        }
        setIsLoading(false); 
    }, [analysisText, onGenerateArt, featureName, userContext]);
    
    return (
        <div className="p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-slate-900/20 rounded-2xl border border-purple-400/20 text-center h-full flex flex-col justify-between">
            <div>
                <span className="text-4xl" role="img" aria-label="icon">{config.icon}</span>
                <h3 className="text-2xl font-playfair text-purple-300 mt-2">{config.title}</h3>
                <p className="text-gray-300 max-w-2xl mx-auto my-4">{config.description}</p>
            </div>
            <button
                onClick={startArtGeneration}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center mx-auto mt-4"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Your Vision...
                    </>
                ) : (
                    `${config.buttonText}`
                )}
            </button>
        </div>
    );
};

export default ArtSuggestion;