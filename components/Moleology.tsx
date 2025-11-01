import React, { useState, useCallback, useRef } from 'react';
import { getMoleologyAnalysis } from '../services/geminiService';
import { MoleologyAnalysis, MoleologyAnalysisSection } from '../types';
import ArtSuggestion from './ArtSuggestion';

type Gender = 'Male' | 'Female';
type View = 'full' | 'head' | 'torso' | 'arms' | 'legs';

type Inspiration = {
    title: string;
    description: string;
    gender: Gender;
    moles: string[];
    predictions: string[];
    analysis: MoleologyAnalysis;
};

const predictionTypes = [
  { id: 'personality', label: 'General Personality' },
  { id: 'love', label: 'Love & Relationships' },
  { id: 'health', label: 'Health & Wellbeing' },
  { id: 'wealth', label: 'Wealth & Fortune' },
  { id: 'career', label: 'Career & Life Path' },
  { id: 'spirituality', label: 'Spiritual Inclination' },
];

const moleSpots: Record<Exclude<View, 'full'>, { id: string; name: string; cx: number; cy: number }[]> = {
  head: [
    { id: 'head_top', name: 'Top of Head', cx: 150, cy: 35 },
    { id: 'head_forehead', name: 'Forehead', cx: 150, cy: 55 },
    { id: 'head_right_temple', name: 'Right Temple', cx: 180, cy: 65 },
    { id: 'head_left_temple', name: 'Left Temple', cx: 120, cy: 65 },
    { id: 'head_right_eye', name: 'Right Eye/Brow', cx: 165, cy: 75 },
    { id: 'head_left_eye', name: 'Left Eye/Brow', cx: 135, cy: 75 },
    { id: 'head_nose_tip', name: 'Tip of Nose', cx: 150, cy: 90 },
    { id: 'head_right_cheek', name: 'Right Cheek', cx: 175, cy: 100 },
    { id: 'head_left_cheek', name: 'Left Cheek', cx: 125, cy: 100 },
    { id: 'head_upper_lip', name: 'Upper Lip', cx: 150, cy: 110 },
    { id: 'head_lower_lip', name: 'Lower Lip/Chin', cx: 150, cy: 125 },
    { id: 'head_neck', name: 'Neck/Throat', cx: 150, cy: 150 },
  ],
  torso: [
    { id: 'torso_right_collarbone', name: 'Right Collarbone', cx: 180, cy: 50 },
    { id: 'torso_left_collarbone', name: 'Left Collarbone', cx: 120, cy: 50 },
    { id: 'torso_chest_center', name: 'Center of Chest', cx: 150, cy: 90 },
    { id: 'torso_right_chest', name: 'Right Chest', cx: 185, cy: 100 },
    { id: 'torso_left_chest', name: 'Left Chest', cx: 115, cy: 100 },
    { id: 'torso_solar_plexus', name: 'Solar Plexus', cx: 150, cy: 155 },
    { id: 'torso_navel', name: 'Navel Area', cx: 150, cy: 200 },
    { id: 'torso_lower_abdomen', name: 'Lower Abdomen', cx: 150, cy: 240 },
    { id: 'torso_right_side', name: 'Right Side/Ribs', cx: 210, cy: 170 },
    { id: 'torso_left_side', name: 'Left Side/Ribs', cx: 90, cy: 170 },
  ],
  arms: [
    { id: 'arms_right_shoulder', name: 'Right Shoulder', cx: 60, cy: 70 },
    { id: 'arms_left_shoulder', name: 'Left Shoulder', cx: 240, cy: 70 },
    { id: 'arms_right_bicep', name: 'Right Bicep', cx: 75, cy: 150 },
    { id: 'arms_left_bicep', name: 'Left Bicep', cx: 225, cy: 150 },
    { id: 'arms_right_elbow', name: 'Right Elbow', cx: 50, cy: 210 },
    { id: 'arms_left_elbow', name: 'Left Elbow', cx: 250, cy: 210 },
    { id: 'arms_right_forearm', name: 'Right Forearm', cx: 80, cy: 270 },
    { id: 'arms_left_forearm', name: 'Left Forearm', cx: 220, cy: 270 },
    { id: 'arms_right_hand', name: 'Right Hand/Wrist', cx: 65, cy: 340 },
    { id: 'arms_left_hand', name: 'Left Hand/Wrist', cx: 235, cy: 340 },
  ],
  legs: [
    { id: 'legs_right_hip', name: 'Right Hip/Groin', cx: 180, cy: 50 },
    { id: 'legs_left_hip', name: 'Left Hip/Groin', cx: 120, cy: 50 },
    { id: 'legs_right_thigh', name: 'Right Thigh', cx: 190, cy: 130 },
    { id: 'legs_left_thigh', name: 'Left Thigh', cx: 110, cy: 130 },
    { id: 'legs_right_knee', name: 'Right Knee', cx: 185, cy: 220 },
    { id: 'legs_left_knee', name: 'Left Knee', cx: 115, cy: 220 },
    { id: 'legs_right_calf', name: 'Right Calf', cx: 195, cy: 300 },
    { id: 'legs_left_calf', name: 'Left Calf', cx: 105, cy: 300 },
    { id: 'legs_right_ankle', name: 'Right Ankle', cx: 180, cy: 360 },
    { id: 'legs_left_ankle', name: 'Left Ankle', cx: 120, cy: 360 },
  ],
};

const allMoleSpots = Object.values(moleSpots).flat();
const getMoleNameById = (id: string) => allMoleSpots.find(spot => spot.id === id)?.name || 'Unknown';

const inspirations: Inspiration[] = [
  {
    title: "The Ambitious Leader",
    description: "For a man with moles on his shoulder and thigh, focusing on career and wealth.",
    gender: 'Male',
    moles: ['arms_right_shoulder', 'legs_left_thigh'],
    predictions: ['career', 'wealth'],
    analysis: {
        sections: [
            { category: 'career', title: 'Path of the Leader', description: "A mole on the right shoulder signifies a person who carries responsibilities with great fortitude. You are destined to be a leader, shouldering significant duties not just for yourself, but for many. This placement suggests a life of action and authority. Coupled with a mole on the left thigh, which indicates a bold and adventurous spirit, your career path will likely involve journeys and overcoming challenges. You are not one to stay stagnant; your progress is marked by constant movement and strategic risk-taking." },
            { category: 'wealth', title: 'Fortune Through Fortitude', description: "The shoulder mole is a powerful indicator of financial success earned through hard work and perseverance. You are likely to build your wealth methodically. The mole on the thigh, however, suggests that fortune may come from unexpected sources, sometimes linked to travel or partnerships. It also serves as a reminder to be prudent and avoid impulsiveness in financial matters. Your greatest fortune will come from ventures that require both strength and courage." }
        ]
    }
  },
  {
    title: "The Compassionate Healer",
    description: "For a woman with moles on her chest and forearm, exploring love and spirituality.",
    gender: 'Female',
    moles: ['torso_chest_center', 'arms_left_forearm'],
    predictions: ['love', 'spirituality'],
    analysis: {
        sections: [
            { category: 'love', title: 'A Heart of Devotion', description: "A mole on the center of the chest is a profound sign of a heart full of passion, warmth, and generosity. You love deeply and are fiercely loyal. You seek a relationship built on trust and emotional security. The presence of a mole on the left forearm suggests you are hardworking and patient in your relationships. You possess an innate ability to build and nurture a strong foundation, making you a cherished companion." },
            { category: 'spirituality', title: 'Path of the Heart', description: "The chest mole connects directly to the heart chakra (Anahata), indicating a natural inclination towards spiritual paths related to love and devotion (Bhakti Yoga). The mole on the forearm enhances this, suggesting you may find spiritual fulfillment through creative or service-oriented work ('seva'). You may find peace in practices like meditation, chanting, or selfless acts of kindness." }
        ]
    }
  },
  {
    title: "The Creative Maverick",
    description: "For a person with moles on the head and abdomen, analyzing personality.",
    gender: 'Female',
    moles: ['head_top', 'torso_lower_abdomen'],
    predictions: ['personality', 'health'],
    analysis: {
        sections: [
            { category: 'personality', title: 'The Visionary Doer', description: "A mole on the very top of the head is a rare and significant marking. It denotes a direct connection to higher consciousness and suggests you are a thinker, a dreamer, and an innovator. This is balanced by a mole on the lower abdomen, which signifies a grounded, practical nature. You have the remarkable ability to bring your high-minded ideas into tangible reality. You are both a visionary and a doer, a powerful combination for creative success." },
            { category: 'health', title: 'Mind-Body Harmony', description: "The head mole suggests you should be mindful of mental exertion; practices like meditation are crucial to keep your active mind serene. The mole on the lower abdomen points to a strong constitution but also highlights the importance of gut health and a balanced diet. Your overall wellbeing is maintained when you find harmony between your mental and physical energies." }
        ]
    }
  }
];

interface MoleologyProps {
  onSuggestArt: (prompt: string, aspectRatio: string) => void;
}

const Moleology: React.FC<MoleologyProps> = ({ onSuggestArt }) => {
    const [gender, setGender] = useState<Gender>('Male');
    const [selectedMoles, setSelectedMoles] = useState<string[]>([]);
    const [selectedPredictions, setSelectedPredictions] = useState<string[]>(['personality', 'love']);
    const [analysis, setAnalysis] = useState<MoleologyAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currentView, setCurrentView] = useState<View>('full');
    const [isExample, setIsExample] = useState(false);

    const toggleMole = (moleId: string) => {
        setSelectedMoles(prev =>
            prev.includes(moleId)
                ? prev.filter(id => id !== moleId)
                : [...prev, moleId]
        );
    };

    const togglePrediction = (predictionId: string) => {
        setSelectedPredictions(prev =>
            prev.includes(predictionId)
                ? prev.filter(id => id !== predictionId)
                : [...prev, predictionId]
        );
    };

    const handleGenerate = useCallback(async () => {
        if (selectedMoles.length === 0) {
            setError('Please select at least one mole location.');
            return;
        }
        if (selectedPredictions.length === 0) {
            setError('Please select at least one prediction type.');
            return;
        }
        setIsLoading(true);
        setError('');
        setAnalysis(null);
        setIsExample(false);

        const moleNames = selectedMoles.map(getMoleNameById).join(', ');
        const result = await getMoleologyAnalysis(gender, moleNames, selectedPredictions);
        
        if(result) {
            setAnalysis(result);
        } else {
            setError("The cosmic energies are unclear. Could not generate an analysis. Please try again.");
        }

        setIsLoading(false);
    }, [gender, selectedMoles, selectedPredictions]);
    
    const handlePrint = () => { window.print(); };

    const handleShare = () => {
        if (analysis) {
            const summary = analysis.sections
              .map(s => s.title)
              .join(' | ') || 'A fascinating insight into my destiny.';
            const textToCopy = `I just got my AI Moleology Reading from Taintra! Key insights include: "${summary}"`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Report summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy summary: ', err));
        }
    };

    const handleInspirationClick = (inspiration: Inspiration) => {
        setGender(inspiration.gender);
        setSelectedMoles(inspiration.moles);
        setSelectedPredictions(inspiration.predictions);
        setAnalysis(inspiration.analysis);
        setIsExample(true);
        setCurrentView('full');
        setError('');
        setIsLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    const getAnalysisTextForArt = () => {
        if (!analysis) return "";
        return analysis.sections.map(s => `${s.title}: ${s.description}`).join('\n\n');
    };

    const AnalysisAccordionItem: React.FC<{ section: MoleologyAnalysisSection; defaultOpen?: boolean; index: number; }> = ({ section, defaultOpen = false, index }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        const contentRef = useRef<HTMLDivElement>(null);
        
        const icons: { [key: string]: string } = {
            personality: '👤', love: '❤️', health: '🌿', 
            wealth: '💰', career: '🚀', spirituality: '✨'
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
    
    const renderMoleSpot = (spot: { id: string; cx: number; cy: number }) => (
        <g key={spot.id} onClick={() => toggleMole(spot.id)} className="cursor-pointer group">
            <circle cx={spot.cx} cy={spot.cy} r="12" fill={selectedMoles.includes(spot.id) ? 'rgba(234, 179, 8, 0.5)' : 'rgba(255, 255, 255, 0.1)'} stroke={selectedMoles.includes(spot.id) ? '#FBBF24' : '#888'} strokeWidth="1.5" className="transition-all" />
            <circle cx={spot.cx} cy={spot.cy} r="18" fill="transparent" className="group-hover:fill-yellow-400/20 transition-all" />
            <title>{getMoleNameById(spot.id)}</title>
        </g>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white">Moleology AI</h2>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Discover what your moles reveal about your personality, life path, and relationships based on ancient Indian wisdom, enhanced by AI analysis.</p>
            </div>

            {!analysis && !isLoading &&
                <div className="animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        {/* Left Panel: Settings */}
                        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 space-y-6">
                            <h3 className="text-2xl font-playfair font-bold text-yellow-400 border-b border-gray-700 pb-2">Your Analysis Settings</h3>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                                {predictionTypes.map(pt => (
                                    <label key={pt.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input 
                                            type="checkbox"
                                            checked={selectedPredictions.includes(pt.id)}
                                            onChange={() => togglePrediction(pt.id)}
                                            className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900"
                                        />
                                        <span className="text-gray-300">{pt.label}</span>
                                    </label>
                                ))}
                            </div>
                             <div>
                                <h4 className="text-lg font-semibold text-white mb-3 mt-4 border-t border-gray-700 pt-4">Selected Mole Locations</h4>
                                {selectedMoles.length > 0 ? (
                                    <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
                                        {selectedMoles.map(moleId => (
                                            <li key={moleId} className="flex justify-between items-center bg-gray-800/50 px-3 py-1 rounded-md">
                                                <span className="text-gray-300">{getMoleNameById(moleId)}</span>
                                                <button onClick={() => toggleMole(moleId)} className="text-red-500 hover:text-red-400 text-xl">&times;</button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No moles selected yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Right Panel: Body Map */}
                        <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 p-6 flex flex-col items-center">
                            <div className="w-full flex justify-between items-center mb-4">
                                {currentView !== 'full' ? (
                                    <button onClick={() => setCurrentView('full')} className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                                        Back to Full Body
                                    </button>
                                ) : <div></div>}
                                <div className="flex items-center bg-gray-800 rounded-full p-1">
                                    <button onClick={() => setGender('Male')} className={`px-4 py-1.5 rounded-full font-semibold transition-colors text-sm ${gender === 'Male' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700'}`}>
                                        Male
                                    </button>
                                    <button onClick={() => setGender('Female')} className={`px-4 py-1.5 rounded-full font-semibold transition-colors text-sm ${gender === 'Female' ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700'}`}>
                                        Female
                                    </button>
                                </div>
                            </div>
                            
                            <h4 className="text-lg font-semibold text-white mb-2 h-7">
                                {currentView === 'full' && 'Select a Body Region'}
                                {currentView === 'head' && 'Head & Neck'}
                                {currentView === 'torso' && 'Torso'}
                                {currentView === 'arms' && 'Arms'}
                                {currentView === 'legs' && 'Legs'}
                            </h4>

                            <svg viewBox="0 0 300 400" className="max-w-xs w-full">
                                {/* Full Body View */}
                                {currentView === 'full' && (
                                    <g>
                                        <path d="M150 20 C 130 20 120 40 120 55 C 120 70 110 80 110 100 L 115 250 C 115 280 100 380 125 380 L 175 380 C 200 380 185 280 185 250 L 190 100 C 190 80 180 70 180 55 C 180 40 170 20 150 20 Z" fill="rgba(234, 179, 8, 0.05)" stroke="#444" strokeWidth="2" />
                                        <path onClick={() => setCurrentView('head')} className="cursor-pointer opacity-20 fill-yellow-400 hover:opacity-40 transition-opacity" d="M150,80 a40,60 0 1,0 0,-0.1 Z" />
                                        <rect onClick={() => setCurrentView('torso')} className="cursor-pointer opacity-20 fill-yellow-400 hover:opacity-40 transition-opacity" x="110" y="80" width="80" height="170" />
                                        <path onClick={() => setCurrentView('arms')} className="cursor-pointer opacity-20 fill-yellow-400 hover:opacity-40 transition-opacity" d="M90,80 L40,350 L70,350 L110,100 Z M210,80 L260,350 L230,350 L190,100 Z" />
                                        <path onClick={() => setCurrentView('legs')} className="cursor-pointer opacity-20 fill-yellow-400 hover:opacity-40 transition-opacity" d="M115,250 L100,380 L145,380 L145,250 Z M185,250 L200,380 L155,380 L155,250 Z" />
                                    </g>
                                )}
                                {currentView === 'head' && <g><path d="M150 15 a50 50 0 0 0 -50 50 v 80 a10 10 0 0 0 10 10 h 80 a10 10 0 0 0 10 -10 v -80 a50 50 0 0 0 -50 -50Z" fill="rgba(234, 179, 8, 0.05)" stroke="#555" strokeWidth="2" />{moleSpots.head.map(renderMoleSpot)}</g>}
                                {currentView === 'torso' && <g><path d="M100 20 h100 v 250 h -100 Z" fill="rgba(234, 179, 8, 0.05)" stroke="#555" strokeWidth="2" />{moleSpots.torso.map(renderMoleSpot)}</g>}
                                {currentView === 'arms' && <g><path d="M50 50 l30 200 l -20 100 h30 l10 -100 l-20-200Z M250 50 l-30 200 l 20 100 h-30 l-10 -100 l20-200Z" fill="rgba(234, 179, 8, 0.05)" stroke="#555" strokeWidth="2" />{moleSpots.arms.map(renderMoleSpot)}</g>}
                                {currentView === 'legs' && <g><path d="M100 20 l20 180 l-10 180 h40 l-10 -180 l20 -180 Z M200 20 l-20 180 l10 180 h-40 l10 -180 l-20 -180Z" fill="rgba(234, 179, 8, 0.05)" stroke="#555" strokeWidth="2" />{moleSpots.legs.map(renderMoleSpot)}</g>}
                            </svg>

                            <p className="text-gray-400 mt-4 text-center h-10">{currentView === 'full' ? 'Click a region to zoom in.' : 'Click to select a mole location.'}</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-4 px-12 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed flex justify-center items-center text-xl mx-auto"
                        >
                            {isLoading ? 'Analyzing...' : 'Generate Moleology Analysis'}
                        </button>
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </div>
                </div>
            }

            {isLoading && (
                 <div className="flex flex-col justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                    <p className="mt-4 text-yellow-400 text-lg">Reading the signs of your destiny...</p>
                </div>
            )}
            
            {analysis && (
                 <div className="printable-report">
                    <div className="mt-10 animate-[fadeIn_1s_ease-in-out]">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold font-playfair text-white">Your Cosmic Mole Reading</h2>
                            <p className="mt-2 text-gray-400">Here is the wisdom revealed by your sacred markings.</p>
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

                        
                        <ArtSuggestion 
                            analysisText={getAnalysisTextForArt()}
                            onGeneratePrompt={onSuggestArt}
                            featureName="Moleology"
                        />
                        <div className="text-center mt-8 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                            <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                Print Report
                            </button>
                            <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                Share Summary
                            </button>
                            <button
                                onClick={() => { setAnalysis(null); setSelectedMoles([]); setIsExample(false); }}
                                className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Start a New Analysis
                            </button>
                        </div>
                        
                    </div>
                 </div>
            )}

            {!analysis && !isLoading &&
                <div className="mt-16">
                    <h3 className="text-3xl font-playfair text-center text-white mb-4">Inspiration Gallery</h3>
                    <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                        Curious about what your reading might look like? Explore these examples to see the power of Moleology AI. Click any card to load the example.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {inspirations.map((item, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleInspirationClick(item)}
                                className="bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50
                                           transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer
                                           shadow-lg hover:shadow-yellow-400/20"
                            >
                                <h4 className="text-xl font-bold font-playfair text-yellow-400 mb-2">{item.title}</h4>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    );
};

export default Moleology;