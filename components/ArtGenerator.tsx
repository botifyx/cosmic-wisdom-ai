import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateImage } from '../services/geminiService';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
const artStyles = ['Vedic/Indian Folk', 'Art Nouveau', 'Surrealism', 'Abstract', 'Oil Painting', 'Yantra-inspired', 'Cyberpunk', 'Watercolor', 'Digital Art'];

const exampleCreations = [
  {
    prompt: 'A vibrant nebula in the shape of a celestial peacock, cosmic feathers shimmering with galaxies.',
    aspectRatio: '16:9',
  },
  {
    prompt: 'The cosmic dance of Shiva and Shakti, energies swirling, creating universes, abstract and powerful.',
    aspectRatio: '9:16',
  },
  {
    prompt: 'A mystical Banyan tree with roots in the earth and branches in the starry cosmos, digital art.',
    aspectRatio: '1:1',
  },
   {
    prompt: 'The goddess Lakshmi rising from a cosmic lotus, showering golden light, in the style of Ravi Varma.',
    aspectRatio: '3:4',
  },
  {
    prompt: 'A glowing OM symbol at the center of a swirling galaxy, spiritual energy radiating outwards.',
    aspectRatio: '4:3',
  },
];

interface ArtGeneratorProps {
    initialPrompt?: string;
    initialAspectRatio?: string;
    onGenerationComplete?: () => void;
}

const ArtGenerator: React.FC<ArtGeneratorProps> = ({ initialPrompt, initialAspectRatio, onGenerationComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [selectedStyle, setSelectedStyle] = useState('Vedic/Indian Folk');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const initialPromptHandled = useRef(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = () => {
    if (!galleryRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
    setIsAtStart(scrollLeft < 10);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
      if (!galleryRef.current) return;
      const scrollAmount = galleryRef.current.clientWidth * 0.8;
      galleryRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
      });
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      handleScroll(); // Initial check
      gallery.addEventListener('scroll', handleScroll, { passive: true });
      const resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(gallery);
      return () => {
        gallery.removeEventListener('scroll', handleScroll);
        resizeObserver.unobserve(gallery);
      };
    }
  }, [isLoading]);


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
      setError('Please enter a prompt to generate your cosmic art.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);
    
    const result = await generateImage(prompt, aspectRatio, 'art', selectedStyle);
    
    if (result) {
      setGeneratedImage(result);
    } else {
      setError('Failed to generate art. The cosmos might be busy, please try again.');
    }
    
    setIsLoading(false);
    if (initialPrompt) {
        onGenerationComplete?.();
    }
  }, [prompt, aspectRatio, initialPrompt, onGenerationComplete, selectedStyle]);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold font-playfair text-white">Cosmic Art Generator</h2>
        <p className="mt-2 text-gray-400">
          {initialPrompt ? "Your personalized cosmic vision is ready to be generated. Bring it to life now or refine the concept." : "Create mystical art powered by AI. Describe your spiritual vision and let the cosmos paint."}
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
            placeholder="e.g., A vibrant nebula in the shape of a celestial peacock..."
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div>
            <label className="block text-lg font-medium text-yellow-400 mb-2">Artistic Style</label>
            <div className="flex flex-wrap gap-2">
                {artStyles.map((style) => (
                    <button 
                        key={style} 
                        onClick={() => setSelectedStyle(style)} 
                        className={`px-4 py-2 text-xs sm:text-sm rounded-full border-2 transition-all duration-300 ${selectedStyle === style ? 'bg-yellow-500 border-yellow-500 text-gray-900 font-semibold shadow-md shadow-yellow-500/20' : 'bg-gray-800 border-gray-600 hover:border-yellow-400 text-gray-300'}`}
                    >
                        {style}
                    </button>
                ))}
            </div>
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
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center text-lg"
        >
          {isLoading ? 'Painting the cosmos...' : 'Generate Cosmic Art'}
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
      
       <div className="mt-10">
          <h3 className="text-lg font-medium text-yellow-400 mb-4 text-center">Inspiration Idea</h3>
          <div className="relative group/gallery">
               <button
                  onClick={() => scrollGallery('left')}
                  disabled={isAtStart}
                  aria-label="Scroll left"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-all opacity-0 group-hover/gallery:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed -translate-x-4"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              </button>
              <div
                  ref={galleryRef}
                  className="flex overflow-x-auto space-x-4 p-2 -mx-2 hide-scrollbar"
                  style={{ scrollSnapType: 'x mandatory' }}
              >
                  {exampleCreations.map((example, index) => (
                      <div
                          key={index}
                          className="mystic-card p-5 flex flex-col flex-shrink-0 w-64 h-40 group cursor-pointer"
                          style={{ scrollSnapAlign: 'start' }}
                          onClick={() => {
                              setPrompt(example.prompt);
                              setAspectRatio(example.aspectRatio);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          title="Click to use this prompt"
                      >
                           <div className="flex-grow overflow-hidden">
                                <p className="text-gray-300 text-sm leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                                    {example.prompt}
                                </p>
                            </div>
                            <div className="flex-shrink-0 flex justify-end items-center pt-2">
                                <span className="bg-black/50 text-yellow-400 text-xs font-mono font-semibold py-1 px-3 rounded-full border border-yellow-500/30 backdrop-blur-sm">
                                    {example.aspectRatio}
                                </span>
                            </div>
                      </div>
                  ))}
              </div>
              <button
                  onClick={() => scrollGallery('right')}
                  disabled={isAtEnd}
                  aria-label="Scroll right"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-all opacity-0 group-hover/gallery:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed translate-x-4"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </button>
          </div>
      </div>


      <div className="mt-8">
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-80 bg-gray-800/50 rounded-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
            <p className="mt-4 text-purple-300">Conjuring your vision...</p>
          </div>
        )}
        {generatedImage && (
          <div className="bg-gray-800/50 p-2 rounded-lg">
              <img src={generatedImage} alt="Generated cosmic art" className="w-full h-auto rounded-md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtGenerator;