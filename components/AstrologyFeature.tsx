import React, { useState, useCallback, useRef } from 'react';
import { getVedicAstrologyAnalysis } from '../services/geminiService';
import StarChart from './StarChart';
import { AstrologyAnalysis, AstrologyAnalysisSection } from '../types';
import ArtSuggestion from './ArtSuggestion';

const AstrologyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" /></svg>
);

type ChartType = 'rasi' | 'navamsa' | 'drekkana';

interface AstrologyFeatureProps {
    onSuggestArt: (prompt: string, aspectRatio: string) => void;
}

const AstrologyFeature: React.FC<AstrologyFeatureProps> = ({ onSuggestArt }) => {
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [birthPlace, setBirthPlace] = useState('');
    const [isBirthTimeUnknown, setIsBirthTimeUnknown] = useState(false);
    const [astrologyData, setAstrologyData] = useState<AstrologyAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeChart, setActiveChart] = useState<ChartType>('rasi');

    const handleGenerate = useCallback(async () => {
        if (!birthDate || (!birthTime && !isBirthTimeUnknown) || !birthPlace.trim()) {
            setError('Please enter all your birth details to generate a chart.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAstrologyData(null);
        setActiveChart('rasi'); // Reset to default chart on new generation

        const result = await getVedicAstrologyAnalysis({ birthDate, birthTime, birthPlace, isBirthTimeUnknown });

        if (result) {
            setAstrologyData(result);
        } else {
            setError('Sorry, we could not generate your cosmic blueprint at this time. Please try again.');
        }
        setIsLoading(false);
    }, [birthDate, birthTime, birthPlace, isBirthTimeUnknown]);
    
    const handlePrint = () => { window.print(); };

    const handleShare = () => {
        if (astrologyData) {
            const summary = astrologyData.analysis.find(s => s.category === 'summary')?.description || 'A deep dive into my cosmic blueprint.';
            const ascendant = astrologyData.rasi.Ascendant.sign;
            const textToCopy = `I just got my AI Vedic Astrology report from Taintra! I'm a ${ascendant} ascendant. Here's a summary: "${summary}"`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Report summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy summary: ', err));
        }
    };

    const chartTitles: Record<ChartType, string> = {
        rasi: 'Rasi (D1) Chart',
        navamsa: 'Navamsa (D9) Chart',
        drekkana: 'Drekkana (D3) Chart',
    };

    const AnalysisAccordionItem: React.FC<{ section: AstrologyAnalysisSection; defaultOpen?: boolean; index: number; }> = ({ section, defaultOpen = false, index }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        const contentRef = useRef<HTMLDivElement>(null);
        
        const icons: { [key: string]: string } = {
            introduction: '🌌', ascendant: '🌅', placements: '🪐', 
            themes: '❤️‍🔥', summary: '📜'
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
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
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
      if (!astrologyData) return "";
      return astrologyData.analysis.map(s => `${s.title}: ${s.description}`).join('\n\n');
    };
    
    return (
        <div className="max-w-6xl mx-auto">
             <div className="text-center mb-8 p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 print-hidden">
                <AstrologyIcon className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <h2 className="text-4xl font-bold font-playfair text-white">AI Vedic Astrology</h2>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Enter your birth details to generate a cosmic blueprint. Our AI combines ancient Vedic wisdom with modern technology for a personalized Janam Kundali analysis.</p>
            </div>

            {!astrologyData && !isLoading && (
                <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 print-hidden">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label htmlFor="birthDate" className="block text-sm font-medium text-yellow-400 mb-1">Date of Birth</label>
                            <input type="date" id="birthDate" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        </div>
                         <div>
                            <label htmlFor="birthTime" className="block text-sm font-medium text-yellow-400 mb-1">Time of Birth</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="time" 
                                    id="birthTime" 
                                    value={birthTime} 
                                    onChange={(e) => setBirthTime(e.target.value)}
                                    disabled={isBirthTimeUnknown}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-700/50 disabled:cursor-not-allowed" 
                                />
                                <div className="relative group flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 cursor-help">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                    </svg>
                                    <div className="absolute bottom-full -right-4 mb-2 w-72 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 border border-gray-600 shadow-lg">
                                        An accurate birth time is crucial for precise Ascendant (Lagna) and house calculations. If unknown, the analysis will proceed but may be less precise for certain predictions.
                                        <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="birthPlace" className="block text-sm font-medium text-yellow-400 mb-1">Place of Birth</label>
                            <input type="text" id="birthPlace" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="e.g., Delhi, India" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={isBirthTimeUnknown}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setIsBirthTimeUnknown(checked);
                                    if (checked) {
                                        setBirthTime('');
                                    }
                                }}
                                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900"
                            />
                            <span className="text-gray-300">My birth time is unknown / estimated.</span>
                        </label>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center text-lg"
                    >
                        {isLoading ? 'Generating Blueprint...' : 'Generate Cosmic Blueprint'}
                    </button>
                    {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                </div>
            )}


            {isLoading && (
                <div className="flex flex-col justify-center items-center min-h-[400px] mt-8 bg-gray-900/50 rounded-2xl">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                    <p className="mt-4 text-yellow-400">Casting your horoscope...</p>
                </div>
            )}

            {!isLoading && astrologyData && (
                <div className="printable-report">
                    <div className="mt-8 animate-[fadeIn_1s_ease-in-out]">
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-4 star-chart-print-container">
                                <div className="w-full max-w-sm mx-auto mb-4 p-1 bg-gray-800/70 rounded-full flex justify-center space-x-1 print-hidden">
                                    {(Object.keys(chartTitles) as ChartType[]).map(chart => (
                                        <button
                                            key={chart}
                                            onClick={() => setActiveChart(chart)}
                                            className={`w-full text-sm font-semibold py-2 px-3 rounded-full transition-colors duration-300 ${activeChart === chart ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700/50'}`}
                                        >
                                            {chart.charAt(0).toUpperCase() + chart.slice(1)} ({ {rasi: 'D1', navamsa: 'D9', drekkana: 'D3'}[chart] })
                                        </button>
                                    ))}
                                </div>
                                <h3 className="text-2xl font-playfair text-yellow-400 mb-4 text-center">{chartTitles[activeChart]}</h3>
                                <StarChart key={activeChart} positions={astrologyData[activeChart]} />
                            </div>
                            <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 space-y-4">
                                <h3 className="text-2xl font-playfair text-yellow-400 mb-2">Your Cosmic Analysis</h3>
                                {astrologyData.analysis.map((section, index) => (
                                    <AnalysisAccordionItem 
                                        key={section.category} 
                                        section={section} 
                                        defaultOpen={index === 0} 
                                        index={index} 
                                    />
                                ))}
                            </div>
                        </div>

                        
                        <ArtSuggestion 
                            analysisText={getAnalysisTextForArt()}
                            onGeneratePrompt={onSuggestArt}
                            featureName="Astrology"
                        />
                        <div className="text-center mt-8 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                            <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                Print Report
                            </button>
                            <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                Share Summary
                            </button>
                            <button
                                onClick={() => { setAstrologyData(null); }}
                                className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Start a New Analysis
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}

        </div>
    );
};

export default AstrologyFeature;