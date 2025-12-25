
import React, { useState, useCallback, useRef } from 'react';
import { getMantraAnalysis, generateMantraAudio } from '../services/geminiService';
import { MantraAnalysis, UserContext } from '../types';
// Fix: Corrected import to ArtSuggestion and added TattooSuggestion
import ArtSuggestion from './ArtSuggestion';
import TattooSuggestion from './TattooSuggestion';
import MudraSuggestion from './MudraSuggestion';

type Gender = 'Male' | 'Female' | 'Unisex';

const MantraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5c-3.14 0-6.02.9-8.47 2.47M12 7.5c3.14 0-6.02.9 8.47 2.47M12 7.5v9.75m0-9.75a4.5 4.5 0 1 1 0 9.75 4.5 4.5 0 0 1 0-9.75ZM4.5 12a7.5 7.5 0 0 0 15 0" />
    </svg>
);

interface MantraGeneratorProps {
  onSuggestTattoo: (details: { prompt: string; placement: string; aspectRatio: string; }) => void;
  onSuggestArt: (details: { prompt: string; aspectRatio: string; }) => void;
  userGender: Gender | null;
  userContext: UserContext | null;
}

// Audio helper functions from guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const MantraGenerator: React.FC<MantraGeneratorProps> = ({ onSuggestTattoo, onSuggestArt, userGender, userContext }) => {
    const [goal, setGoal] = useState('');
    const [analysis, setAnalysis] = useState<MantraAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!goal.trim()) {
            setError('Please enter your goal or intention.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis(null);
        setAudioBuffer(null); // Reset audio on new generation

        const result = await getMantraAnalysis(goal, userGender || 'Unisex', userContext);
        if (result) {
            setAnalysis(result);
        } else {
            setError('Could not generate a mantra at this time. Please try refining your intention.');
        }
        setIsLoading(false);
    }, [goal, userGender, userContext]);
    
    const handlePlayMantra = useCallback(async () => {
        if (!analysis) return;
        
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        
        if (audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
            return;
        }

        setIsAudioLoading(true);
        const audioData = await generateMantraAudio(analysis.transliteration);
        
        if (audioData && audioContext) {
            try {
                const decodedBytes = decode(audioData);
                const buffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
                setAudioBuffer(buffer);
                
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start();

            } catch (e) {
                console.error("Error decoding or playing audio:", e);
                setError("Failed to play mantra audio.");
            }
        } else {
            setError("Could not generate audio for the mantra.");
        }

        setIsAudioLoading(false);
    }, [analysis, audioBuffer]);
    
    const handlePrint = () => { window.print(); };

    const handleShare = () => {
        if (analysis) {
            const textToCopy = `My personalized mantra from Taintra for "${goal}" is: ${analysis.transliteration}. It means: "${analysis.overallMeaning}"`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Mantra summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy summary: ', err));
        }
    };

    const getAnalysisTextForTattoo = () => {
        if (!analysis) return "";
        return `My personal mantra is "${analysis.transliteration}". Its meaning is: "${analysis.overallMeaning}". I want to create a visual representation of this.`;
    };

    const AnalysisAccordionItem: React.FC<{ title: string; children: React.ReactNode; icon: string; defaultOpen?: boolean; index: number; }> = ({ title, children, icon, defaultOpen = false, index }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        const contentRef = useRef<HTMLDivElement>(null);

        return (
            <div className={`border border-yellow-400/20 rounded-lg overflow-hidden transition-all duration-300 bg-gray-800/30 hover:bg-gray-800/60`} style={{ animation: `fadeInUp 0.5s ${index * 0.1}s both` }}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-left p-4 flex justify-between items-center cursor-pointer print-hidden"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center gap-3 pr-4">
                        <span className="text-xl">{icon}</span>
                        <h4 className={`font-bold text-lg text-yellow-300`}>{title}</h4>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </button>
                <div
                    ref={contentRef}
                    style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
                    className="overflow-hidden transition-all duration-500 ease-in-out accordion-content-print"
                >
                    <div className="px-5 pb-4 pt-2 border-t border-yellow-400/20">
                        {children}
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
                        <MantraIcon className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                        <h2 className="text-4xl font-bold font-playfair text-white">AI Mantra Generator</h2>
                        <p className="mt-2 text-gray-400">Receive a personalized Sanskrit mantra based on your goals. Harness the power of sacred sound for transformation and focus.</p>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            rows={3}
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g., Seeking clarity in my career, overcoming anxiety, finding inner peace..."
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="w-full bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            Generate Mantra
                        </button>
                        {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                </div>
            ) : null}
            
            {isLoading && (
                <div className="flex flex-col justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                    <p className="mt-4 text-yellow-400 text-lg">Crafting your sacred mantra...</p>
                </div>
            )}
            
            {analysis && (
                <div className="printable-report">
                    <div className="animate-[fadeIn_1s_ease-in-out]">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold font-playfair text-white">Your Personal Mantra</h2>
                            <p className="mt-2 text-gray-400">Here is the sacred sound crafted for your intention.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="border border-yellow-400/20 rounded-lg bg-gray-800/30 p-4">
                               <div className="flex justify-between items-center py-2">
                                    <div>
                                        <p className="text-sm text-yellow-300">Sanskrit</p>
                                        <p className="text-3xl font-serif text-white flex-grow mr-4" lang="sa">{analysis.sanskritMantra}</p>
                                        <p className="text-sm text-yellow-300 mt-2">Transliteration</p>
                                        <p className="text-xl italic text-gray-300">{analysis.transliteration}</p>
                                    </div>
                                    <button 
                                        onClick={handlePlayMantra} 
                                        disabled={isAudioLoading}
                                        className="p-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 print-hidden"
                                        title={audioBuffer ? "Play Again" : "Listen to Mantra"}
                                    >
                                        {isAudioLoading ? (
                                            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <AnalysisAccordionItem title="Word-by-Word Meanings" icon="📖" index={2}>
                                <div className="space-y-2 py-2">
                                    {analysis.wordMeanings.map((wm, i) => (
                                        <p key={i} className="text-gray-300"><strong className="text-yellow-300 font-semibold">{wm.word}:</strong> {wm.meaning}</p>
                                    ))}
                                </div>
                            </AnalysisAccordionItem>
                            <AnalysisAccordionItem title="Overall Meaning" icon="💡" index={3}>
                                <p className="text-gray-300 leading-relaxed py-2">{analysis.overallMeaning}</p>
                            </AnalysisAccordionItem>
                             <AnalysisAccordionItem title="How to Chant & Meditate" icon="🧘" index={4}>
                                <p className="text-gray-300 leading-relaxed py-2">{analysis.chantingGuidance}</p>
                            </AnalysisAccordionItem>
                        </div>
                        {analysis && (
                            <>
                                <div className="grid md:grid-cols-3 gap-4 mt-8 print-hidden">
                                    <TattooSuggestion 
                                        analysisText={getAnalysisTextForTattoo()}
                                        onGenerateTattoo={onSuggestTattoo}
                                        featureName="MantraGenerator"
                                        userContext={userContext}
                                    />
                                    <ArtSuggestion 
                                        analysisText={getAnalysisTextForTattoo()}
                                        onGenerateArt={onSuggestArt}
                                        featureName="MantraGenerator"
                                        userContext={userContext}
                                    />
                                    <MudraSuggestion
                                        analysisText={getAnalysisTextForTattoo()}
                                        featureName="MantraGenerator"
                                        userGender={userGender}
                                        userContext={userContext}
                                    />
                                </div>
                                <div className="text-center mt-8 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                                    <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                        Print Analysis
                                    </button>
                                    <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                        Share Mantra
                                    </button>
                                    <button
                                        onClick={() => { setAnalysis(null); setGoal(''); setAudioBuffer(null); }}
                                        className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Create a New Mantra
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

export default MantraGenerator;
