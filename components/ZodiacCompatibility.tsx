import React, { useState, useCallback, useRef } from 'react';
import { getZodiacCompatibilityAnalysis } from '../services/geminiService';
import { ZodiacCompatibilityAnalysis, ZodiacCompatibilitySection } from '../types';
import ArtSuggestion from './ArtSuggestion';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RELATIONSHIP_CONTEXTS = ["Love", "Friendship", "Work", "Marriage"];

const CompatibilityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);

interface ZodiacCompatibilityProps {
  onSuggestArt: (prompt: string, aspectRatio: string) => void;
}

const ZodiacCompatibility: React.FC<ZodiacCompatibilityProps> = ({ onSuggestArt }) => {
    const [sign1, setSign1] = useState('Aries');
    const [sign2, setSign2] = useState('Libra');
    const [context, setContext] = useState('Love');
    const [analysis, setAnalysis] = useState<ZodiacCompatibilityAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setAnalysis(null);

        const result = await getZodiacCompatibilityAnalysis(sign1, sign2, context);
        if (result) {
            setAnalysis(result);
        } else {
            setError('Could not generate a compatibility analysis at this time. Please try again.');
        }
        setIsLoading(false);
    }, [sign1, sign2, context]);
    
    const handlePrint = () => { window.print(); };

    const handleShare = () => {
        if (analysis) {
            const vibe = analysis.sections.find(s => s.category === 'vibe')?.description || 'a unique cosmic connection.';
            const textToCopy = `I just analyzed my ${context} compatibility between ${sign1} & ${sign2} on Taintra! The overall vibe is: "${vibe}"`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Report summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy summary: ', err));
        }
    };

    const getAnalysisTextForArt = () => {
        if (!analysis) return "";
        const vibe = analysis.sections.find(s => s.category === 'vibe')?.description || "";
        const conclusion = analysis.sections.find(s => s.category === 'conclusion')?.description || "";
        return `The ${context} connection between ${sign1} and ${sign2}. The overall vibe is: "${vibe}". The conclusion is: "${conclusion}".`;
    };

    const AnalysisAccordionItem: React.FC<{ section: ZodiacCompatibilitySection; defaultOpen?: boolean; index: number; }> = ({ section, defaultOpen = false, index }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        const contentRef = useRef<HTMLDivElement>(null);
        
        const icons: { [key: string]: string } = {
            vibe: '✨', strengths: '🔥', challenges: '⛈️', tips: '💡', conclusion: '📜'
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

    return (
        <div className="max-w-4xl mx-auto">
            {!analysis && !isLoading ? (
                <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="text-center mb-8">
                        <CompatibilityIcon className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                        <h2 className="text-4xl font-bold font-playfair text-white">Zodiac Compatibility</h2>
                        <p className="mt-2 text-gray-400">Discover the cosmic connection between two zodiac signs. Our AI analyses personality traits for insights on love, communication, and harmony.</p>
                    </div>
                     <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">First Sign</label>
                                <select value={sign1} onChange={(e) => setSign1(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                    {ZODIAC_SIGNS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Second Sign</label>
                                <select value={sign2} onChange={(e) => setSign2(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                    {ZODIAC_SIGNS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Relationship Context</label>
                            <select value={context} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setContext(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                {RELATIONSHIP_CONTEXTS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            Generate Analysis
                        </button>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                </div>
            ) : null}
            
            {isLoading && (
                <div className="flex flex-col justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                    <p className="mt-4 text-yellow-400 text-lg">Aligning the stars...</p>
                </div>
            )}

            {analysis && (
                <div className="printable-report">
                    <div className="animate-[fadeIn_1s_ease-in-out]">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold font-playfair text-white">Compatibility Analysis</h2>
                            <p className="mt-2 text-gray-400">The cosmic bond between {sign1} and {sign2} for {context}.</p>
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
                                    featureName="ZodiacCompatibility"
                                />
                                <div className="text-center mt-8 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                                    <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                        Print Report
                                    </button>
                                    <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                        Share Summary
                                    </button>
                                    <button
                                        onClick={() => { setAnalysis(null); }}
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

export default ZodiacCompatibility;