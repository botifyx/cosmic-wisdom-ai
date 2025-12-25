
import React, { useState, useCallback, useRef } from 'react';
import { getFaceReadingAnalysis } from '../services/geminiService';
import { FaceReadingAnalysis, FaceAnalysisSection, UserContext } from '../types';
import TattooSuggestion from './TattooSuggestion';
import ArtSuggestion from './ArtSuggestion';
import MudraSuggestion from './MudraSuggestion';
import { SAMPLE_ANALYSES } from '../services/sampleData';
import { FeatureId } from '../types';

type Gender = 'Male' | 'Female' | 'Unisex';

interface FaceReadingProps {
  onSuggestTattoo: (details: { prompt: string; placement: string; aspectRatio: string; }) => void;
  onSuggestArt: (details: { prompt: string; aspectRatio: string; }) => void;
  userGender: Gender | null;
  userContext: UserContext | null;
}

const inspirations = SAMPLE_ANALYSES[FeatureId.FACE_READING].inspirations;

const FaceReading: React.FC<FaceReadingProps> = ({ onSuggestTattoo, onSuggestArt, userGender, userContext }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FaceReadingAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isExample, setIsExample] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError('');
        setIsExample(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!image) {
        setError('Please upload an image of your face first.');
        return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    setIsExample(false);

    const base64Data = image!.split(',')[1];
    const mimeType = image!.substring(image!.indexOf(':') + 1, image!.indexOf(';'));
    
    const result = await getFaceReadingAnalysis(base64Data, mimeType, userGender || 'Unisex', userContext);
    if(result) {
        setAnalysis(result);
    } else {
        setError("The cosmic energies are unclear. We could not generate a face reading. Please try again with a clearer image.");
    }
    setIsLoading(false);
  }, [image, userGender, userContext]);
  
  const handleInspirationClick = (inspiration: typeof inspirations[0]) => {
    setImage(null);
    setAnalysis(inspiration.analysis);
    setIsExample(true);
    setError('');
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => { window.print(); };

  const handleShare = () => {
    if (analysis) {
        const summary = analysis.sections.find(s => s.category === 'overall_impression')?.description || 'A fascinating insight into my personality.';
        const textToCopy = `I just got my AI Face Reading from Taintra! Here's a summary: "${summary}"`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Report summary copied to clipboard!'))
            .catch(err => console.error('Failed to copy summary: ', err));
    }
  };

  const AnalysisAccordionItem: React.FC<{ section: FaceAnalysisSection; defaultOpen?: boolean; index: number; }> = ({ section, defaultOpen = false, index }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    
    const icons: { [key: string]: string } = {
        overall_impression: '🎭', forehead: '🤔', eyes: '👁️', nose: '👃', mouth: '👄', cheeks: '😊', chin: '🗿'
    };

    return (
        <div className={`border border-yellow-400/20 rounded-lg overflow-hidden transition-all duration-300 bg-gray-800/30 hover:bg-gray-800/60`} style={{ animation: `fadeInUp 0.5s ${index * 0.1}s both` }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 flex justify-between items-center cursor-pointer print-hidden"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3 pr-4">
                    <span className="text-xl">{icons[section.category] || '✧'}</span>
                    <h4 className={`font-bold text-lg text-yellow-300`}>{section.title}</h4>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
                className="overflow-hidden transition-all duration-500 ease-in-out accordion-content-print"
            >
                <div className="px-5 pb-4 pt-2 border-t border-yellow-400/20">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{section.description}</p>
                </div>
            </div>
        </div>
    );
  };

  const getAnalysisTextForSuggestion = () => {
      if (!analysis) return "";
      return analysis.sections.map(s => `${s.title}: ${s.description}`).join('\n');
  };

  return (
    <div className="max-w-4xl mx-auto">
        {!analysis && !isLoading && (
            <>
                <div className="animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold font-playfair text-white">AI Face Reading</h2>
                        <p className="mt-2 text-gray-400">The face is a mirror to the soul. Upload a photo to see what yours reveals.</p>
                    </div>
                    <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 flex flex-col items-center">
                        <label htmlFor="face-upload" className="w-80 h-96 relative flex flex-col justify-center items-center cursor-pointer group">
                            {image ? (
                                <img src={image} alt="Face preview" className="absolute inset-0 w-full h-full object-cover rounded-lg z-10"/>
                            ) : (
                                <>
                                    <svg viewBox="0 0 200 250" className="absolute inset-0 w-full h-full text-yellow-400/10 group-hover:text-yellow-400/20 transition-colors duration-500">
                                      <path d="M 100,20 A 60,70 0 1,0 100,160 A 60,70 0 1,0 100,20 M 100,160 Q 100,230 70,240 M 100,160 Q 100,230 130,240" fill="currentColor" filter="url(#glow)"/>
                                      <defs><filter id="glow"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                                    </svg>
                                    <div className="text-center text-gray-400 relative z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                        <span>Click to upload image</span>
                                    </div>
                                </>
                            )}
                        </label>
                        <input id="face-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <button
                            onClick={handleAnalyze}
                            disabled={!image || isLoading}
                            className="mt-6 w-full max-w-sm bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            Reveal My Character
                        </button>
                        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                    </div>
                </div>

                <div className="mt-16 animate-[fadeInUp_1s_ease-in-out_0.5s]">
                    <h3 className="text-3xl font-playfair text-center text-white mb-4">Inspiration Idea</h3>
                    <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                        Explore these archetypes to see how different facial features are interpreted. Click to load an example analysis.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {inspirations.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleInspirationClick(item)}
                                className="mystic-card p-6 cursor-pointer group flex flex-col"
                            >
                                <h4 className="text-xl font-bold font-playfair text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">{item.title}</h4>
                                <p className="text-gray-400 text-sm flex-grow">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}
      
        {isLoading && (
            <div className="flex flex-col justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                <p className="mt-4 text-yellow-400 text-lg">Reading your features...</p>
            </div>
        )}

        {analysis && (
            <div className="printable-report">
                <div className="animate-[fadeIn_1s_ease-in-out]">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold font-playfair text-white">Your Physiognomy Reading {isExample && <span className="text-gray-400 text-3xl">(Example)</span>}</h2>
                        <p className="mt-2 text-gray-400">Here is the wisdom your face reveals, interpreted by our AI Guru.</p>
                        {isExample && image && (
                            <img src={image} alt="Example face" className="mt-4 max-w-sm mx-auto rounded-lg shadow-lg" />
                        )}
                    </div>
                    <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 space-y-4">
                        {analysis.sections.map((section, index) => (
                            <AnalysisAccordionItem 
                                key={section.category} 
                                section={section} 
                                defaultOpen={index === 0} 
                                index={index}
                            />
                        ))}
                    </div>
                    
                    <div className="mt-8 animate-[fadeIn_1s_ease-in-out] print-hidden">
                        <div className="grid md:grid-cols-3 gap-4">
                             <TattooSuggestion 
                                analysisText={getAnalysisTextForSuggestion()}
                                onGenerateTattoo={onSuggestTattoo}
                                featureName="FaceReading"
                                userContext={userContext}
                            />
                             <ArtSuggestion 
                                analysisText={getAnalysisTextForSuggestion()}
                                onGenerateArt={onSuggestArt}
                                featureName="FaceReading"
                                userContext={userContext}
                            />
                            <MudraSuggestion
                                analysisText={getAnalysisTextForSuggestion()}
                                featureName="FaceReading"
                                userGender={userGender}
                                userContext={userContext}
                            />
                        </div>
                    </div>
                   
                    <div className="text-center mt-8 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                        <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                            Print Report
                        </button>
                        <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                            Share Summary
                        </button>
                        <button
                            onClick={() => { setAnalysis(null); setImage(null); setIsExample(false); }}
                            className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Start a New Reading
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default FaceReading;
