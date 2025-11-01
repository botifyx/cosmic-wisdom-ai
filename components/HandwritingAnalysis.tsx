import React, { useState, useCallback, useRef } from 'react';
import { getHandwritingAnalysis } from '../services/geminiService';
import { HandwritingAnalysisResult , HandwritingAnalysisSection } from '../types';
import ArtSuggestion from './ArtSuggestion';

interface HandwritingAnalysisProps {
  onSuggestArt: (prompt: string, aspectRatio: string) => void;
}

const HandwritingAnalysis: React.FC<HandwritingAnalysisProps> = ({ onSuggestArt }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<HandwritingAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!image) {
        setError('Please upload an image of your handwriting first.');
        return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis(null);

    const base64Data = image!.split(',')[1];
    const mimeType = image!.substring(image!.indexOf(':') + 1, image!.indexOf(';'));
    
    const result = await getHandwritingAnalysis(base64Data, mimeType);
    if(result) {
        setAnalysis(result);
    } else {
        setError("The cosmic energies are unclear. We could not generate a handwriting analysis. Please try again with a clearer image.");
    }
    setIsLoading(false);

  }, [image]);
  
  const handlePrint = () => { window.print(); };

  const handleShare = () => {
    if (analysis) {
        const summary = analysis.sections.find(s => s.category === 'summary')?.description || 'A fascinating insight into my personality.';
        const textToCopy = `I just got my AI Handwriting Analysis from Taintra! Here's a summary: "${summary}"`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Report summary copied to clipboard!'))
            .catch(err => console.error('Failed to copy summary: ', err));
    }
  };

  const AnalysisAccordionItem: React.FC<{ section: HandwritingAnalysisSection; defaultOpen?: boolean; index: number; }> = ({ section, defaultOpen = false, index }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);
    
    const icons: { [key: string]: string } = {
        overall_impression: '👤', pressure: '✒️', slant: ' 기울기', size: '↔️', 
        spacing: '…', signature: '✍️', summary: '📜'
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

  const getAnalysisTextForArt = () => {
      if (!analysis) return "";
      return analysis.sections.map(s => `${s.title}: ${s.description}`).join('\n');
  };

  return (
    <div className="max-w-4xl mx-auto">
        {!analysis && !isLoading && (
            <div className="animate-[fadeIn_0.5s_ease-in-out]">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold font-playfair text-white">AI Handwriting Analysis</h2>
                    <p className="mt-2 text-gray-400">Your handwriting is a map of your subconscious. Upload a sample to reveal your inner world.</p>
                </div>
                <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 flex flex-col items-center">
                    <label htmlFor="handwriting-upload" className="w-full h-80 relative flex flex-col justify-center items-center cursor-pointer group">
                        {image ? (
                             <img src={image} alt="Handwriting preview" className="absolute inset-0 w-full h-full object-contain rounded-lg z-10"/>
                        ) : (
                            <>
                                <svg viewBox="0 0 300 150" className="absolute inset-0 w-full h-full text-yellow-400/10 group-hover:text-yellow-400/20 transition-colors duration-500">
                                    <path d="M 20,80 Q 80,40 150,80 T 280,80" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="8, 8" strokeLinecap="round" />
                                    <path d="M 20,100 Q 80,60 150,100 T 280,100" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <defs><filter id="glow"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                                </svg>
                                <div className="text-center text-gray-400 relative z-10">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto mb-2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                    <span>Click to upload handwriting sample</span>
                                </div>
                            </>
                        )}
                    </label>
                    <input id="handwriting-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <button
                        onClick={handleAnalyze}
                        disabled={!image || isLoading}
                        className="mt-6 w-full max-w-sm bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        Reveal My Inner Script
                    </button>
                    {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                </div>
            </div>
        )}
      
        {isLoading && (
            <div className="flex flex-col justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                <p className="mt-4 text-yellow-400 text-lg">Analyzing your inner script...</p>
            </div>
        )}
        
        {analysis && (
            <div className="printable-report">
                <div className="animate-[fadeIn_1s_ease-in-out]">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold font-playfair text-white">Your Graphology Reading</h2>
                        <p className="mt-2 text-gray-400">Here is the wisdom your handwriting reveals, interpreted by our AI Guru.</p>
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
                    
                    {analysis && (
                        <>
                            <ArtSuggestion 
                                analysisText={getAnalysisTextForArt()}
                                onGeneratePrompt={onSuggestArt}
                                featureName="Handwriting"
                            />
                             <div className="text-center mt-8 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                                <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                    Print Report
                                </button>
                                <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                    Share Summary
                                </button>
                                <button
                                    onClick={() => { setAnalysis(null); setImage(null); }}
                                    className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Start a New Analysis
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}

    </div>
  );
};

export default HandwritingAnalysis;