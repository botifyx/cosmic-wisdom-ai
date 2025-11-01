import React, { useState, useCallback } from 'react';
import { getSacredUnionAnalysis } from '../services/geminiService';
import { SacredUnionAnalysis, ZodiacSignInfo } from '../types';
import ArtSuggestion from './ArtSuggestion';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

interface SacredUnionProps {
  onSuggestArt: (prompt: string, aspectRatio: string) => void;
}

const ZodiacIcon: React.FC<{ sign: string, className?: string }> = ({ sign, className = "w-10 h-10" }) => {
    const icons: { [key: string]: string } = {
        Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
        Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    };
    return <span className={`text-4xl ${className}`} style={{ filter: 'drop-shadow(0 0 5px currentColor)'}}>{icons[sign] || '?'}</span>;
};

const SacredUnion: React.FC<SacredUnionProps> = ({ onSuggestArt }) => {
    const [sign1, setSign1] = useState<string>('Gemini');
    const [sign2, setSign2] = useState<string>('Leo');
    const [analysis, setAnalysis] = useState<SacredUnionAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setAnalysis(null);

        const result = await getSacredUnionAnalysis(sign1, sign2);

        if (result) {
            setAnalysis(result);
        } else {
            setError('Could not retrieve the sacred analysis. The stars may be clouded, please try again.');
        }
        setIsLoading(false);
    }, [sign1, sign2]);

    const handlePrint = () => { window.print(); };

    const handleShare = () => {
        if (analysis) {
            const textToCopy = `Our Sacred Union analysis (${sign1} & ${sign2}) on Taintra shows a spiritual harmony of ${analysis.spiritualHarmony}%! The connection is described as: "${analysis.sacredConnection}"`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Report summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy summary: ', err));
        }
    };
    
    const getAnalysisTextForArt = () => {
        if (!analysis) return "";
        return `Sacred Connection Summary: ${analysis.sacredConnection}\nRecommendation: ${analysis.sacredRecommendation}`;
    };

    const InfoCard: React.FC<{ title: string; items?: string[]; children?: React.ReactNode; icon: string; }> = ({ title, items, children, icon }) => (
        <div className="bg-slate-900/50 border border-purple-400/20 rounded-xl p-4 relative">
            <h4 className="font-bold text-lg text-purple-300 mb-3 flex items-center gap-2"><span className="text-xl">{icon}</span> {title}</h4>
            {items && (
              <ul className="space-y-2 text-sm text-gray-300 list-inside">
                  {items.map((item, i) => <li key={i} className="flex items-start"><span className="text-purple-400 mr-2 mt-1">✧</span><span>{item}</span></li>)}
              </ul>
            )}
            {children}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white">Kamasutra Insights</h2>
                <p className="mt-2 text-gray-300 max-w-3xl mx-auto">
                    Ancient wisdom for spiritual connection and sacred union. Discover the depths of compatibility through the lens of Vedic knowledge, astrology, and the teachings of Kamasutra.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                     <button className="bg-purple-600/50 text-white font-semibold py-2 px-4 rounded-full border-2 border-purple-400">
                        ✨ Zodiac Match
                     </button>
                      <button className="bg-slate-800/50 text-gray-300 font-semibold py-2 px-4 rounded-full border-2 border-slate-600 hover:border-purple-400 transition">
                        📜 Sacred Wisdom
                     </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-slate-900/50 border border-purple-400/30 rounded-2xl p-6 space-y-4">
                     <h3 className="text-2xl font-bold font-playfair text-purple-200">Spiritual Compatibility</h3>
                     <p className="text-gray-400 text-sm">Discover the sacred union between two souls through their zodiac signs.</p>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Your Zodiac Sign</label>
                            <select value={sign1} onChange={(e) => setSign1(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                {ZODIAC_SIGNS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Partner's Zodiac Sign</label>
                            <select value={sign2} onChange={(e) => setSign2(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                {ZODIAC_SIGNS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                     </div>
                     <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed">
                        {isLoading ? 'Consulting the Cosmos...' : 'Explore Compatibility'}
                     </button>
                     {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                </div>
                <div className="relative w-64 h-64 mx-auto">
                    <div className="absolute inset-0 border-2 border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '20s'}}></div>
                    <div className="absolute inset-2 border border-purple-400/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-4 border-2 border-purple-400/10 rounded-full"></div>
                    {analysis && Array.from({length: 12}).map((_, i) => (
                        <div key={i} className="absolute inset-8" style={{ transform: `rotate(${i * 30}deg)` }}>
                            <div className="absolute top-[-4px] left-1/2 -ml-[2px] w-1 h-1 bg-purple-300 rounded-full animate-pulse-dot" style={{ animationDelay: `${i * 100}ms` }}></div>
                        </div>
                    ))}
                    <div className="absolute inset-12 rounded-full flex items-center justify-center animate-pulse-glow" style={{ animationDuration: '4s'}}>
                         <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center animate-float" style={{ animationDuration: '6s'}}>
                            <span className="text-5xl" style={{ filter: 'drop-shadow(0 0 10px white)'}}>❤️</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {isLoading && (
                <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                </div>
            )}
            
            {analysis && (
                <div className="printable-report">
                    <div className="space-y-8 animate-[fadeIn_1s_ease-in-out]">
                        <h3 className="text-3xl font-bold font-playfair text-center text-white">Sacred Union Analysis for <span className="logo-text-gradient">{sign1} & {sign2}</span></h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {(['sign1Info', 'sign2Info'] as const).map(key => {
                                const info = analysis[key];
                                return (
                                    <div key={info.name} className="bg-slate-900/50 border border-purple-400/20 rounded-xl p-4 flex items-center gap-4">
                                        <ZodiacIcon sign={info.name} className="text-purple-300" />
                                        <div>
                                            <h4 className="font-bold text-lg text-white">{info.name} <span className="text-sm font-light text-gray-400">- {info.element}</span></h4>
                                            <p className="text-sm text-gray-300">{info.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="bg-slate-900/50 border border-purple-400/20 rounded-xl p-6 text-center">
                            <h4 className="font-bold text-xl text-purple-200">Sacred Connection</h4>
                            <p className="text-gray-300 mt-2 max-w-2xl mx-auto">{analysis.sacredConnection}</p>
                            <div className="mt-4 max-w-sm mx-auto">
                                <div className="flex justify-between text-sm font-bold text-white mb-1">
                                    <span>Spiritual Harmony</span>
                                    <span>{analysis.spiritualHarmony}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2.5">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full" style={{ width: `${analysis.spiritualHarmony}%`, transition: 'width 1s ease-in-out' }}></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <InfoCard title="Connection Strengths" items={analysis.connectionStrengths} icon="✨" />
                            <InfoCard title="Intimacy Style" icon="💞">
                                <p className="text-sm text-gray-300">{analysis.intimacyStyle.summary}</p>
                                <h5 className="font-semibold text-purple-400 mt-3 text-sm">Spiritual Bond:</h5>
                                <p className="text-sm text-gray-300">{analysis.intimacyStyle.spiritualBond}</p>
                            </InfoCard>
                            <InfoCard title="Relationship Challenges" items={analysis.relationshipChallenges} icon="🌪️" />
                            <InfoCard title="Kamasutra Guidance" items={analysis.kamasutraGuidance} icon="🧘" />
                        </div>

                        <div className="bg-slate-900/50 border border-purple-400/20 rounded-xl p-6 relative">
                            <h4 className="font-bold text-xl text-purple-200">Sacred Recommendation</h4>
                            <p className="text-gray-300 mt-2">{analysis.sacredRecommendation}</p>
                        </div>

                        {analysis && (
                            <>
                                <ArtSuggestion 
                                    analysisText={getAnalysisTextForArt()}
                                    onGeneratePrompt={onSuggestArt}
                                    featureName="Sacred Union"
                                />
                                 <div className="text-center mt-8 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                                    <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                        Print Report
                                    </button>
                                    <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                        Share Summary
                                    </button>
                                    <button onClick={() => { setAnalysis(null); }} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                                        Start a New Analysis
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            
             <div className="bg-slate-900/50 border border-purple-400/20 rounded-xl p-6 mt-16 print-hidden">
                 <h3 className="text-3xl font-bold font-playfair text-center text-white mb-2">Sacred Knowledge</h3>
                 <p className="text-center text-gray-400 max-w-3xl mx-auto mb-6">The Kamasutra, composed by sage Vātsyāyana, is a profound exploration of human connection. Beyond commonly misunderstood aspects, it offers timeless wisdom on achieving a fulfilling union.</p>
                 <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
                     {(['Sacred Union', 'Emotional Connection', 'Energy Harmony', 'Divine Partnership'] as const).map(title => (
                        <div key={title} className="bg-slate-800/70 p-4 rounded-lg border border-purple-400/10">
                            <h4 className="font-bold text-purple-300">{title}</h4>
                            <p className="text-xs text-gray-400 mt-1">
                                {{
                                    'Sacred Union': 'The spiritual joining of two souls through mutual respect, understanding, and devotion.',
                                    'Emotional Connection': 'Building deep bonds through shared experiences, communication, and mindful presence.',
                                    'Energy Harmony': 'Balancing masculine and feminine energies to achieve perfect spiritual alignment.',
                                    'Divine Partnership': 'Viewing relationships as a sacred pathway to spiritual growth and self-discovery.'
                                }[title]}
                            </p>
                        </div>
                     ))}
                 </div>
             </div>
        </div>
    );
};

export default SacredUnion;