
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateImage, getTattooPlacementSuggestion } from '../services/geminiService';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
const bodyPartCategories = ['Any', 'Arm', 'Leg', 'Torso', 'Back'];
const tattooStyles = ['Minimalist', 'Geometric', 'Yantra-inspired', 'Dotwork', 'Traditional', 'Watercolor', 'Sketch', 'Tribal', 'Line Art'];

const exampleCreations = [
  { prompt: 'A minimalist geometric lotus unalome, clean lines, representing purity and enlightenment.', aspectRatio: '1:1' },
  { prompt: "A constellation map of Leo as a powerful lion, made of stars and nebula dust, minimalist style.", aspectRatio: '4:3' },
  { prompt: "An abstract design showing a strong, unbroken Life Line transforming into a flowing river, symbolizing a long and purposeful journey. Single-line style.", aspectRatio: '9:16' },
  { prompt: "Minimalist tattoo of the Fate Line from a palm reading. A single, clean, unbroken line that flows with determination, symbolizing a clear and purposeful path of destiny.", aspectRatio: '9:16' },
  { prompt: "The third eye (Ajna chakra) symbol, minimalist and geometric, with a single ray of light emanating from its center, for inner wisdom.", aspectRatio: '1:1' },
  { prompt: "A tattoo representing 'firm pressure' and 'creative loops' from handwriting analysis. Bold, confident flowing lines form an abstract symbol of self-expression.", aspectRatio: '16:9' },
  { prompt: "The Capricorn constellation integrated with a mountain range, symbolizing ambition and resilience. Saturn's rings subtly encircle the highest peak.", aspectRatio: '3:4' }
];

interface SavedTattoo {
  prompt: string;
  generatedImage: string;
  placement: string;
  aspectRatio: string;
  bodyPartCategory: string;
  style?: string;
}

interface TattooMakerProps {
    initialPrompt?: string;
    initialAspectRatio?: string;
    initialPlacement?: string;
    onGenerationComplete?: () => void;
}


const TattooMaker: React.FC<TattooMakerProps> = ({ initialPrompt, initialAspectRatio, initialPlacement, onGenerationComplete }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [bodyPartCategory, setBodyPartCategory] = useState('Any');
  const [selectedStyle, setSelectedStyle] = useState('Minimalist');
  const [placement, setPlacement] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loadedFromSave, setLoadedFromSave] = useState(false);
  const initialPromptHandled = useRef(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = useCallback(() => {
    if (!galleryRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
    setIsAtStart(scrollLeft < 10);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
  }, []);

  const scrollGallery = (direction: 'left' | 'right') => {
      if (!galleryRef.current) return;
      const scrollAmount = galleryRef.current.clientWidth * 0.8;
      galleryRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const gallery = galleryRef.current;
    if (gallery) {
      handleScroll();
      gallery.addEventListener('scroll', handleScroll, { passive: true });
      const resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(gallery);
      return () => {
        gallery.removeEventListener('scroll', handleScroll);
        resizeObserver.unobserve(gallery);
      };
    }
  }, [isLoading, handleScroll]);
  
  useEffect(() => {
    const savedTattooJson = localStorage.getItem('taintra-saved-tattoo');
    if (savedTattooJson && !initialPrompt) {
      try {
        const savedTattoo: SavedTattoo = JSON.parse(savedTattooJson);
        setPrompt(savedTattoo.prompt);
        setGeneratedImage(savedTattoo.generatedImage);
        setPlacement(savedTattoo.placement);
        setAspectRatio(savedTattoo.aspectRatio);
        setBodyPartCategory(savedTattoo.bodyPartCategory);
        if (savedTattoo.style) setSelectedStyle(savedTattoo.style);
        setIsSaved(true);
        setLoadedFromSave(true);
      } catch (e) {
        console.error("Failed to parse saved tattoo from localStorage", e);
        localStorage.removeItem('taintra-saved-tattoo');
      }
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (initialPrompt && !initialPromptHandled.current) {
        setPrompt(initialPrompt);
        if (initialAspectRatio) setAspectRatio(initialAspectRatio);
        if (initialPlacement) setPlacement(initialPlacement);
        setGeneratedImage(null);
        setIsSaved(false);
        setLoadedFromSave(false);
        localStorage.removeItem('taintra-saved-tattoo');
        initialPromptHandled.current = true;
    }
  }, [initialPrompt, initialAspectRatio, initialPlacement]);

  const startGeneration = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please describe your vision to generate a sacred tattoo.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedImage(null);
    setIsSaved(false);
    setLoadedFromSave(false);

    let currentPlacement = placement;
    if (!currentPlacement || !initialPlacement) {
        currentPlacement = await getTattooPlacementSuggestion(prompt, bodyPartCategory);
        setPlacement(currentPlacement);
    }
    
    // Fix: Added 'tattoo' as the third argument to the generateImage function call.
    const result = await generateImage(prompt, aspectRatio, 'tattoo', selectedStyle);
    
    if (result) {
      setGeneratedImage(result);
    } else {
      setError('Failed to generate tattoo. The cosmos might be busy, please try again.');
    }
    
    setIsLoading(false);
    if (onGenerationComplete) onGenerationComplete();
  }, [prompt, aspectRatio, placement, bodyPartCategory, initialPlacement, onGenerationComplete, selectedStyle]);
  
  const handleSaveDesign = () => {
    if (!prompt || !generatedImage || !placement) return;
    const designToSave: SavedTattoo = { prompt, generatedImage, placement, aspectRatio, bodyPartCategory, style: selectedStyle };
    localStorage.setItem('taintra-saved-tattoo', JSON.stringify(designToSave));
    setIsSaved(true);
  };

  const handleStartNewDesign = () => {
    setPrompt('');
    setAspectRatio('1:1');
    setBodyPartCategory('Any');
    setPlacement('');
    setSelectedStyle('Minimalist');
    setGeneratedImage(null);
    setError('');
    setIsSaved(false);
    setLoadedFromSave(false);
    localStorage.removeItem('taintra-saved-tattoo');
    initialPromptHandled.current = false;
    if (onGenerationComplete) onGenerationComplete();
  };
  
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <svg width="150" height="150" viewBox="0 0 100 100" className="mb-4">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor: '#fde047', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#f97316', stopOpacity: 1}} />
                </linearGradient>
            </defs>
            <path d="M 50,5 L 60,40 L 95,40 L 67,65 L 78,95 L 50,75 L 22,95 L 33,65 L 5,40 L 40,40 Z" fill="none" stroke="url(#grad)" strokeWidth="1.5" strokeDasharray="300" strokeDashoffset="300" style={{ animation: 'draw-line 2s ease-out forwards' }} />
            <circle cx="20" cy="20" r="1.5" fill="#fff" opacity="0" style={{ animation: 'fade-in-star 1s 1s ease-in forwards' }} />
            <circle cx="80" cy="25" r="1" fill="#fff" opacity="0" style={{ animation: 'fade-in-star 1s 1.2s ease-in forwards' }} />
            <circle cx="15" cy="70" r="1.2" fill="#fff" opacity="0" style={{ animation: 'fade-in-star 1s 1.4s ease-in forwards' }} />
            <circle cx="85" cy="75" r="1.5" fill="#fff" opacity="0" style={{ animation: 'fade-in-star 1s 1.6s ease-in forwards' }} />
            <circle cx="50" cy="50" r="2" fill="#fff" opacity="0" style={{ animation: 'fade-in-star 1s 1.8s ease-in forwards' }} />
        </svg>
        <p className="text-xl font-playfair text-yellow-300 animate-pulse">Inking the Cosmos...</p>
        <p className="text-gray-400">Your sacred symbol is materializing.</p>
    </div>
  );

  const PlaceholderState = () => (
      <div className="flex flex-col items-center justify-center h-full text-center">
          <svg width="200" height="200" viewBox="0 0 100 100" className="text-yellow-400/80" style={{ animation: 'sacred-geometry-pulse 6s infinite ease-in-out' }}>
              <path d="M50 2.5 a 23.75 23.75 0 1 0 0 47.5 a 23.75 23.75 0 1 0 0 -47.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M50 2.5 L50 97.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M2.5 50 L97.5 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="47.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
          </svg>
          <p className="text-xl font-playfair text-gray-300 mt-4">The Canvas Awaits</p>
          <p className="text-gray-500">Describe your vision to begin creation.</p>
      </div>
  );

  const ResultDisplay = () => (
      <div className="h-full flex flex-col animate-[fadeIn_0.5s_ease-in-out]">
          {loadedFromSave && (
              <p className="text-center text-sm text-yellow-400/80 mb-4">Showing your last saved creation.</p>
          )}
          <div className="relative flex-grow w-full h-4/5 bg-gray-900/30 rounded-lg p-2 flex items-center justify-center">
              <img src={generatedImage!} alt="Generated cosmic tattoo" className="max-w-full max-h-full object-contain rounded-md" />
          </div>
          <div className="flex-shrink-0 mt-4 space-y-4">
              {placement && (
                  <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                      <h3 className="text-lg font-playfair text-yellow-400 mb-1">Suggested Placement</h3>
                      <p className="text-gray-300 text-sm">{placement}</p>
                  </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleSaveDesign} disabled={isSaved} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" /></svg>
                      {isSaved ? 'Design Saved' : 'Save Design'}
                  </button>
                  <button onClick={handleStartNewDesign} className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition-colors flex justify-center items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.5a2.25 2.25 0 0 1-1.061.61L6.11 21.73a.75.75 0 0 1-.908-.908l.63-3.468a2.25 2.25 0 0 1 .61-1.06l10.272-10.273Zm-3.47-3.47 3.47 3.47" /></svg>
                      New Design
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-in-out]">
        <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white">Cosmic Tattoo Maker</h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          {initialPrompt ? "Your personalized tattoo is ready to be visualized. Generate it now or refine the concept." : "Channel your essence into a sacred symbol. Describe your vision for a personal talisman."}
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 xl:gap-12">
        {/* CONTROLS */}
        <div className="lg:col-span-2 space-y-6 animate-[fadeInUp_0.7s_ease-in-out]">
            <div className="mystic-card p-6 space-y-6">
              <div>
                  <label htmlFor="prompt" className="block text-lg font-medium text-yellow-400 mb-2">Your Vision</label>
                  <textarea id="prompt" rows={4} value={prompt} onChange={(e) => { setPrompt(e.target.value); setPlacement(''); setIsSaved(false); }} placeholder="e.g., A minimalist geometric lotus unalome, clean lines..." className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" />
              </div>
              <div>
                  <label className="block text-lg font-medium text-yellow-400 mb-2">Artistic Style</label>
                  <div className="flex flex-wrap gap-2">
                      {tattooStyles.map((style) => (
                          <button 
                              key={style} 
                              onClick={() => { setSelectedStyle(style); setIsSaved(false); }} 
                              className={`px-4 py-2 text-xs sm:text-sm rounded-full border-2 transition-all duration-300 ${selectedStyle === style ? 'bg-yellow-500 border-yellow-500 text-gray-900 font-semibold shadow-md shadow-yellow-500/20' : 'bg-gray-800 border-gray-600 hover:border-yellow-400 text-gray-300'}`}
                          >
                              {style}
                          </button>
                      ))}
                  </div>
              </div>
              <div>
                  <label className="block text-lg font-medium text-yellow-400 mb-2">Body Part Focus (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                      {bodyPartCategories.map((c) => ( <button key={c} onClick={() => { setBodyPartCategory(c); setIsSaved(false); }} className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-300 ${bodyPartCategory === c ? 'bg-yellow-500 border-yellow-500 text-gray-900 font-semibold shadow-md shadow-yellow-500/20' : 'bg-gray-800 border-gray-600 hover:border-yellow-400 text-gray-300'}`}>{c}</button>))}
                  </div>
              </div>
              <div>
                  <label className="block text-lg font-medium text-yellow-400 mb-2">Aspect Ratio</label>
                  <div className="flex flex-wrap gap-2">
                      {aspectRatios.map((r) => (<button key={r} onClick={() => { setAspectRatio(r); setIsSaved(false); }} className={`px-4 py-2 text-sm rounded-full border-2 transition-all duration-300 ${aspectRatio === r ? 'bg-yellow-500 border-yellow-500 text-gray-900 font-semibold shadow-md shadow-yellow-500/20' : 'bg-gray-800 border-gray-600 hover:border-yellow-400 text-gray-300'}`}>{r}</button>))}
                  </div>
              </div>
            </div>
            <button onClick={startGeneration} disabled={isLoading} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-4 px-4 rounded-lg hover:scale-105 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:hover:scale-100 flex justify-center items-center text-xl shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30">
                {isLoading ? 'Inking...' : (generatedImage ? 'Regenerate' : 'Generate Sacred Tattoo')}
            </button>
            {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        </div>

        {/* VISUALIZATION */}
        <div className="lg:col-span-3 min-h-[500px] lg:min-h-full p-4 bg-gray-900/40 rounded-2xl border border-gray-700/50 animate-[fadeIn_0.9s_ease-in-out]">
            {isLoading && <LoadingState />}
            {!isLoading && !generatedImage && <PlaceholderState />}
            {!isLoading && generatedImage && <ResultDisplay />}
        </div>
      </div>
      
      {!generatedImage && !isLoading && (
        <div className="mt-20 animate-[fadeInUp_1.1s_ease-in-out]">
            <h3 className="text-2xl font-playfair text-center text-yellow-400 mb-6">Inspiration Idea</h3>
            <div className="relative group/gallery">
                <button onClick={() => scrollGallery('left')} disabled={isAtStart} aria-label="Scroll left" className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-all opacity-0 group-hover/gallery:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed -translate-x-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg></button>
                <div ref={galleryRef} className="flex overflow-x-auto space-x-4 pb-2 hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
                    {exampleCreations.map((ex, i) => (
                         <div 
                            key={i} 
                            className="mystic-card p-5 flex flex-col flex-shrink-0 w-52 h-64 group cursor-pointer"
                            style={{ scrollSnapAlign: 'start' }} 
                            onClick={() => { setPrompt(ex.prompt); setAspectRatio(ex.aspectRatio); setPlacement(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                            title="Click to use this prompt"
                        >
                            <div className="flex-grow overflow-y-auto hide-scrollbar pr-2 -mr-2"> 
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {ex.prompt}
                                </p>
                            </div>
                            
                            <div className="flex-shrink-0 flex justify-end items-center pt-4">
                                <span className="bg-black/50 text-yellow-400 text-xs font-mono font-semibold py-1 px-3 rounded-full border border-yellow-500/30 backdrop-blur-sm">
                                    {ex.aspectRatio}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => scrollGallery('right')} disabled={isAtEnd} aria-label="Scroll right" className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-all opacity-0 group-hover/gallery:opacity-100 disabled:opacity-0 disabled:cursor-not-allowed translate-x-4"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg></button>
            </div>
        </div>
      )}
    </div>
  );
};

export default TattooMaker;
