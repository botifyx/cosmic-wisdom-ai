import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateImage, getTattooPlacementSuggestion } from '../services/geminiService';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const exampleCreations = [
  { prompt: 'A minimalist geometric lotus unalome, clean lines, representing purity and enlightenment.', imageUrl: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-for-developers/images/tattoo_lotus.jpeg', aspectRatio: '1:1' },
  { prompt: "A constellation map of Leo as a powerful lion, made of stars and nebula dust, minimalist style.", imageUrl: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-for-developers/images/tattoo_leo.jpeg', aspectRatio: '4:3' },
  { prompt: "An abstract design showing a strong, unbroken Life Line transforming into a flowing river, symbolizing a long and purposeful journey. Single-line style.", imageUrl: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-for-developers/images/tattoo_lifeline.jpeg', aspectRatio: '9:16' },
  { prompt: "Minimalist tattoo of the Fate Line from a palm reading. A single, clean, unbroken line that flows with determination, symbolizing a clear and purposeful path of destiny.", imageUrl: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-for-developers/images/tattoo_fateline.jpeg', aspectRatio: '9:16' },
  { prompt: "The third eye (Ajna chakra) symbol, minimalist and geometric, with a single ray of light emanating from its center, for inner wisdom.", imageUrl: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-for-developers/images/tattoo_thirdeye.jpeg', aspectRatio: '1:1' },
  { prompt: "A tattoo representing 'firm pressure' and 'creative loops' from handwriting analysis. Bold, confident flowing lines form an abstract symbol of self-expression.", imageUrl: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-for-developers/images/tattoo_script.jpeg', aspectRatio: '16:9' },
  { prompt: "The Capricorn constellation integrated with a mountain range, symbolizing ambition and resilience. Saturn's rings subtly encircle the highest peak.", imageUrl: 'https://storage.googleapis.com/aistudio-hosting/generative-ai-for-developers/images/tattoo_capricorn.jpeg', aspectRatio: '3:4' }
];

interface TattooMakerProps {
    initialPrompt?: string;
    initialAspectRatio?: string;
    initialPlacement?: string;
    onGenerationComplete?: () => void;
}

const TattooMaker: React.FC<TattooMakerProps> = ({ initialPrompt, initialAspectRatio, initialPlacement, onGenerationComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [placement, setPlacement] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const initialPromptHandled = useRef(false);

  useEffect(() => {
    if (initialPrompt && !initialPromptHandled.current) {
        setPrompt(initialPrompt);
        if (initialAspectRatio) {
            setAspectRatio(initialAspectRatio);
        }
        if (initialPlacement) {
            setPlacement(initialPlacement);
        }
        initialPromptHandled.current = true; // Mark as handled
    }
  }, [initialPrompt, initialAspectRatio, initialPlacement]);

  const startGeneration = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate a tattoo design.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);

    // If placement is not pre-filled, generate it now.
    let currentPlacement = placement;
    if (!currentPlacement && !initialPlacement) {
        currentPlacement = await getTattooPlacementSuggestion(prompt);
        setPlacement(currentPlacement);
    }
    
    // Fix: Added 'tattoo' as the third argument to the generateImage function call.
    const result = await generateImage(prompt, aspectRatio, 'tattoo');
    
    if (result) {
      setGeneratedImage(result);
    } else {
      setError('Failed to generate tattoo. The cosmos might be busy, please try again.');
    }
    
    setIsLoading(false);
    if (initialPrompt) {
        onGenerationComplete?.();
    }
  }, [prompt, aspectRatio, placement, initialPrompt, onGenerationComplete, initialPlacement]);
  
  return (
    <>
    <div className="max-w-4xl mx-auto p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold font-playfair text-white">Cosmic Tattoo Maker</h2>
        <p className="mt-2 text-gray-400">
          {initialPrompt ? "Your personalized tattoo is ready to be visualized. Generate it now or refine the concept." : "Create a sacred tattoo powered by AI. Describe your vision for a personal talisman."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-lg font-medium text-yellow-400 mb-2">Your Vision</label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => {
                setPrompt(e.target.value);
                // Clear placement if user edits prompt, so it can be regenerated
                if (placement) setPlacement('');
            }}
            placeholder="e.g., A minimalist geometric lotus unalome, clean lines"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div>
          <label htmlFor="aspect-ratio" className="block text-lg font-medium text-yellow-400 mb-2">Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-4 py-2 rounded-full border-2 transition-colors ${
                  aspectRatio === ratio 
                  ? 'bg-yellow-500 border-yellow-500 text-gray-900 font-semibold' 
                  : 'bg-gray-700 border-gray-600 hover:border-yellow-400'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={startGeneration}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center text-lg"
        >
          {isLoading ? 'Inking the cosmos...' : 'Generate Sacred Tattoo'}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
      
      <div className="mt-10">
        <h3 className="text-lg font-medium text-yellow-400 mb-4 text-center">Inspiration Gallery</h3>
        <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {exampleCreations.map((example, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-40 h-56 rounded-lg overflow-hidden group cursor-pointer shadow-lg"
              onClick={() => {
                setPrompt(example.prompt);
                setAspectRatio(example.aspectRatio);
                setPlacement(''); // Clear placement for new idea
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title="Click to use this prompt"
            >
              <img src={example.imageUrl} alt={example.prompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <p className="text-white text-xs font-medium leading-tight">{example.prompt}</p>
              </div>
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                {example.aspectRatio}
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="mt-8">
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-80 bg-gray-800/50 rounded-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
            <p className="mt-4 text-yellow-400">Conjuring your design...</p>
          </div>
        )}
        {generatedImage && (
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="bg-gray-800/50 p-2 rounded-lg">
                <img src={generatedImage} alt="Generated cosmic tattoo" className="w-full h-auto rounded-md" />
            </div>
            {placement && (
                <div className="bg-gray-800/50 p-6 rounded-lg text-center animate-[fadeIn_0.5s_ease-in-out]">
                    <h3 className="text-xl font-playfair text-yellow-400 mb-2">Suggested Placement</h3>
                    <p className="text-gray-300">{placement}</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default TattooMaker;