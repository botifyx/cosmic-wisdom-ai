import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateImage } from '../services/geminiService';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const exampleCreations = [
  {
    prompt: 'A wise old owl with galaxies in its eyes, perched on a crescent moon.',
    imageUrl: 'https://picsum.photos/seed/owl/300/300',
    aspectRatio: '1:1',
  },
  {
    prompt: 'The cosmic dance of Shiva and Shakti, rendered in vibrant neon light.',
    imageUrl: 'https://picsum.photos/seed/shiva/533/300',
    aspectRatio: '16:9',
  },
  {
    prompt: 'Portrait of a beautiful Indian goddess, adorned with glowing lotuses.',
    imageUrl: 'https://picsum.photos/seed/goddess/300/400',
    aspectRatio: '3:4',
  },
   {
    prompt: 'An ancient temple floating in the clouds of Jupiter, with lightning.',
    imageUrl: 'https://picsum.photos/seed/temple/400/300',
    aspectRatio: '4:3',
  },
  {
    prompt: 'A meditating yogi dissolving into the fabric of the universe, phone wallpaper.',
    imageUrl: 'https://picsum.photos/seed/yogi/270/480',
    aspectRatio: '9:16',
  },
];

interface ImageGeneratorProps {
    initialPrompt?: string;
    initialAspectRatio?: string;
    onGenerationComplete?: () => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ initialPrompt, initialAspectRatio, onGenerationComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
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
        initialPromptHandled.current = true; // Mark as handled
    }
  }, [initialPrompt, initialAspectRatio]);

  const startGeneration = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);

    const result = await generateImage(prompt, aspectRatio);
    
    if (result) {
      setGeneratedImage(result);
    } else {
      setError('Failed to generate image. Please try again.');
    }
    
    setIsLoading(false);
    if (initialPrompt) {
        onGenerationComplete?.();
    }
  }, [prompt, aspectRatio, initialPrompt, onGenerationComplete]);

  const handleGenerateClick = () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate an image.');
      return;
    }
    setError('');
    startGeneration();
  };
  
  return (
    <>
    <div className="max-w-4xl mx-auto p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold font-playfair text-white">Cosmic Art Generator</h2>
        <p className="mt-2 text-gray-400">
          {initialPrompt ? "Your personalized vision is ready. Generate it now or refine the prompt." : "Create mystical and spiritual art powered by AI. Describe your vision."}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-lg font-medium text-yellow-400 mb-2">Your Vision</label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A meditating yogi under the cosmic tree of life, glowing nebula background"
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
          onClick={handleGenerateClick}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center text-lg"
        >
          {isLoading ? 'Creating...' : 'Generate Cosmic Art'}
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
            <p className="mt-4 text-yellow-400">Conjuring your vision...</p>
          </div>
        )}
        {generatedImage && (
          <div className="bg-gray-800/50 p-2 rounded-lg">
            <img src={generatedImage} alt="Generated cosmic art" className="w-full h-auto rounded-md" />
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ImageGenerator;