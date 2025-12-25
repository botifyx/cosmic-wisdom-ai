
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getMoleologyAnalysis } from '../services/geminiService';
import { MoleologyAnalysis, MoleologyAnalysisSection, UserContext } from '../types';
import TattooSuggestion from './TattooSuggestion';
import ArtSuggestion from './ArtSuggestion';
import MudraSuggestion from './MudraSuggestion';
import { SAMPLE_ANALYSES } from '../services/sampleData';
import { FeatureId } from '../types';

type Gender = 'Male' | 'Female';
type UserGender = 'Male' | 'Female' | 'Unisex';
type View = 'full' | 'head' | 'torso' | 'arms' | 'legs';

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
        { id: 'head_top', name: 'Top of Head', cx: 150, cy: 35 }, { id: 'head_forehead', name: 'Forehead', cx: 150, cy: 55 },
        { id: 'head_right_temple', name: 'Right Temple', cx: 180, cy: 65 }, { id: 'head_left_temple', name: 'Left Temple', cx: 120, cy: 65 },
        { id: 'head_right_eye', name: 'Right Eye/Brow', cx: 165, cy: 75 }, { id: 'head_left_eye', name: 'Left Eye/Brow', cx: 135, cy: 75 },
        { id: 'head_nose_tip', name: 'Tip of Nose', cx: 150, cy: 90 }, { id: 'head_right_cheek', name: 'Right Cheek', cx: 175, cy: 100 },
        { id: 'head_left_cheek', name: 'Left Cheek', cx: 125, cy: 100 }, { id: 'head_upper_lip', name: 'Upper Lip', cx: 150, cy: 110 },
        { id: 'head_lower_lip', name: 'Lower Lip/Chin', cx: 150, cy: 125 }, { id: 'head_neck', name: 'Neck/Throat', cx: 150, cy: 150 },
    ],
    torso: [
        { id: 'torso_right_collarbone', name: 'Right Collarbone', cx: 180, cy: 50 }, { id: 'torso_left_collarbone', name: 'Left Collarbone', cx: 120, cy: 50 },
        { id: 'torso_chest_center', name: 'Center of Chest', cx: 150, cy: 90 }, { id: 'torso_right_chest', name: 'Right Chest', cx: 185, cy: 100 },
        { id: 'torso_left_chest', name: 'Left Chest', cx: 115, cy: 100 }, { id: 'torso_solar_plexus', name: 'Solar Plexus', cx: 150, cy: 155 },
        { id: 'torso_navel', name: 'Navel Area', cx: 150, cy: 200 }, { id: 'torso_lower_abdomen', name: 'Lower Abdomen', cx: 150, cy: 240 },
        { id: 'torso_right_side', name: 'Right Side/Ribs', cx: 210, cy: 170 }, { id: 'torso_left_side', name: 'Left Side/Ribs', cx: 90, cy: 170 },
    ],
    arms: [
        { id: 'arms_right_shoulder', name: 'Right Shoulder', cx: 60, cy: 70 }, { id: 'arms_left_shoulder', name: 'Left Shoulder', cx: 240, cy: 70 },
        { id: 'arms_right_bicep', name: 'Right Bicep', cx: 75, cy: 150 }, { id: 'arms_left_bicep', name: 'Left Bicep', cx: 225, cy: 150 },
        { id: 'arms_right_elbow', name: 'Right Elbow', cx: 50, cy: 210 }, { id: 'arms_left_elbow', name: 'Left Elbow', cx: 250, cy: 210 },
        { id: 'arms_right_forearm', name: 'Right Forearm', cx: 80, cy: 270 }, { id: 'arms_left_forearm', name: 'Left Forearm', cx: 220, cy: 270 },
        { id: 'arms_right_hand', name: 'Right Hand/Wrist', cx: 65, cy: 340 }, { id: 'arms_left_hand', name: 'Left Hand/Wrist', cx: 235, cy: 340 },
    ],
    legs: [
        { id: 'legs_right_hip', name: 'Right Hip/Groin', cx: 180, cy: 50 }, { id: 'legs_left_hip', name: 'Left Hip/Groin', cx: 120, cy: 50 },
        { id: 'legs_right_thigh', name: 'Right Thigh', cx: 190, cy: 130 }, { id: 'legs_left_thigh', name: 'Left Thigh', cx: 110, cy: 130 },
        { id: 'legs_right_knee', name: 'Right Knee', cx: 185, cy: 220 }, { id: 'legs_left_knee', name: 'Left Knee', cx: 115, cy: 220 },
        { id: 'legs_right_calf', name: 'Right Calf', cx: 195, cy: 300 }, { id: 'legs_left_calf', name: 'Left Calf', cx: 105, cy: 300 },
        { id: 'legs_right_ankle', name: 'Right Ankle', cx: 180, cy: 360 }, { id: 'legs_left_ankle', name: 'Left Ankle', cx: 120, cy: 360 },
    ],
};

const allMoleSpots = Object.values(moleSpots).flat();
const getMoleNameById = (id: string) => allMoleSpots.find(spot => spot.id === id)?.name || 'Unknown';

const inspirations = SAMPLE_ANALYSES[FeatureId.MOLEOLOGY].inspirations;

interface MoleologyProps {
    onSuggestTattoo: (details: { prompt: string; placement: string; aspectRatio: string; }) => void;
    onSuggestArt: (details: { prompt: string; aspectRatio: string; }) => void;
    userGender: UserGender | null;
    userContext: UserContext | null;
}

const Moleology: React.FC<MoleologyProps> = ({ onSuggestTattoo, onSuggestArt, userGender, userContext }) => {
    const [gender, setGender] = useState<Gender>(userGender === 'Female' ? 'Female' : 'Male');
    const [selectedMoles, setSelectedMoles] = useState<string[]>([]);
    const [selectedPredictions, setSelectedPredictions] = useState<string[]>(['personality', 'love']);
    const [analysis, setAnalysis] = useState<MoleologyAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currentView, setCurrentView] = useState<View>('full');
    const [isExample, setIsExample] = useState(false);

    useEffect(() => {
        if (userGender) {
            setGender(userGender === 'Female' ? 'Female' : 'Male');
        }
    }, [userGender]);

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
        const result = await getMoleologyAnalysis(gender, moleNames, selectedPredictions, userContext);

        if (result) {
            setAnalysis(result);
        } else {
            setError("The cosmic energies are unclear. Could not generate an analysis. Please try again.");
        }

        setIsLoading(false);
    }, [gender, selectedMoles, selectedPredictions, userContext]);

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

    const handleInspirationClick = (inspiration: typeof inspirations[0]) => {
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

    const getAnalysisTextForSuggestion = () => {
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
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

    const BodyMap = () => {
        if (currentView === 'full') {
            return (
                <svg viewBox="0 0 100 200" className="w-auto h-full max-h-full">
                    <g fill="#EAB308" fillOpacity="0.3">
                        <path className="body-region" onClick={() => setCurrentView('arms')} d="M35 55 L5 130 L20 135 L48 65 Z M65 55 L95 130 L80 135 L52 65 Z" />
                        <ellipse className="body-region" onClick={() => setCurrentView('head')} cx="50" cy="30" rx="25" ry="25" />
                        <path className="body-region" onClick={() => setCurrentView('torso')} d="M35 50 H65 V110 H35 Z" />
                        <path className="body-region" onClick={() => setCurrentView('legs')} d="M35 110 L25 180 L45 195 L50 110 Z M65 110 L75 180 L55 195 L50 110 Z" />
                    </g>
                </svg>
            );
        }

        const spots = moleSpots[currentView];
        const viewConfig: any = {
            head: { viewBox: "80 10 140 170", shape: <ellipse cx="150" cy="90" rx="60" ry="80" fill="#EAB308" fillOpacity="0.1" /> },
            torso: { viewBox: "70 20 160 260", shape: <rect x="90" y="30" width="120" height="240" rx="40" fill="#EAB308" fillOpacity="0.1" /> },
            arms: { viewBox: "20 40 260 340", shape: <path d="M30 50 L-20 350 L20 360 L80 50 Z M270 50 L320 350 L280 360 L220 50 Z" fill="#EAB308" fillOpacity="0.1" /> },
            legs: { viewBox: "80 20 140 380", shape: <path d="M100 30 L80 400 L130 400 Z M200 30 L220 400 L170 400 Z" fill="#EAB308" fillOpacity="0.1" /> },
        };

        return (
            <svg viewBox={viewConfig[currentView].viewBox} className="w-auto h-full max-h-full">
                <g className="cursor-pointer" onClick={() => setCurrentView('full')}>
                    <text x="10" y="20" fill="#fde047" className="text-sm font-semibold">&#x2190; Back</text>
                </g>
                {viewConfig[currentView].shape}
                <g>
                    {spots.map(spot => (
                        <g key={spot.id} onClick={() => toggleMole(spot.id)} className="mole-spot cursor-pointer">
                            <circle cx={spot.cx} cy={spot.cy} r="10" fill="transparent" />
                            <circle
                                cx={spot.cx}
                                cy={spot.cy}
                                r="5"
                                fill={selectedMoles.includes(spot.id) ? "rgba(253, 224, 71, 1)" : "rgba(255, 255, 255, 0.5)"}
                                className={`mole-spot-circle ${selectedMoles.includes(spot.id) ? 'selected' : ''}`}
                            />
                        </g>
                    ))}
                </g>
            </svg>
        );
    };

    return (
        <div className="max-w-6xl mx-auto">
            {!analysis && !isLoading ? (
                <>
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold font-playfair text-white">Moleology AI</h2>
                        <p className="mt-2 text-gray-400">Discover what your moles reveal about your personality, life path, and relationships based on ancient Indian wisdom, enhanced by AI analysis.</p>
                    </div>

                    <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 animate-[fadeIn_0.5s_ease-in-out]">
                        <div className="grid md:grid-cols-2 gap-8 xl:gap-12">
                            {/* Left Column */}
                            <div>
                                <h3 className="text-2xl font-playfair font-bold text-yellow-400 mb-4">Your Analysis Settings</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mb-6">
                                    {predictionTypes.map(({ id, label }) => (
                                        <label key={id} className="flex items-center space-x-3 cursor-pointer group">
                                            <input type="checkbox" checked={selectedPredictions.includes(id)} onChange={() => togglePrediction(id)}
                                                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-gray-900" />
                                            <span className="text-gray-300 group-hover:text-white transition-colors">{label}</span>
                                        </label>
                                    ))}
                                </div>
                                <hr className="border-gray-700 my-6" />
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Selected Mole Locations</h4>
                                    <div className="min-h-[6rem] max-h-48 overflow-y-auto bg-gray-800/50 rounded-lg p-3 custom-scrollbar">
                                        {selectedMoles.length > 0 ? (
                                            <ul className="space-y-1 text-sm text-yellow-300">
                                                {selectedMoles.map(id => (
                                                    <li key={id} className="flex justify-between items-center bg-gray-700/30 px-2 py-1 rounded">
                                                        <span>{getMoleNameById(id)}</span>
                                                        <button onClick={() => toggleMole(id)} className="text-red-400 hover:text-red-300 text-lg font-bold">&times;</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (<p className="text-gray-500 text-sm text-center pt-4">No moles selected yet.</p>)}
                                    </div>
                                </div>
                            </div>
                            {/* Right Column */}
                            <div className="flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-playfair font-bold text-yellow-400">
                                        {currentView === 'full' ? 'Select a Body Region' : `Select Moles on ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}`}
                                    </h3>
                                    <div className="bg-gray-800/70 p-1 rounded-full flex items-center border border-gray-700">
                                        {(['Male', 'Female'] as Gender[]).map(g => (
                                            <button key={g} onClick={() => setGender(g)} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${gender === g ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:bg-gray-700'}`}>{g}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative w-full flex-grow min-h-[400px] bg-gray-800/30 rounded-lg p-2 flex items-center justify-center">
                                    {currentView !== 'full' && (
                                        <button onClick={() => setCurrentView('full')} className="absolute top-2 left-2 z-10 text-yellow-400 hover:text-yellow-300 transition-colors bg-black/30 rounded-full p-2" aria-label="Back to Full View">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                                        </button>
                                    )}
                                    <BodyMap />
                                </div>
                                {currentView === 'full' && <p className="text-center text-gray-500 mt-2 text-sm">Click a region to zoom in.</p>}
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-700">
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full max-w-md mx-auto bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center text-lg">
                                Generate Moleology Analysis
                            </button>
                            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        </div>
                    </div>

                    <div className="mt-16 animate-[fadeInUp_1s_ease-in-out_0.5s]">
                        <h3 className="text-3xl font-playfair text-center text-white mb-4">Inspiration Idea</h3>
                        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                            Curious about what your reading might look like? Explore these ideas. Click any card to load the example analysis.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {inspirations.map((item, index) => (
                                <div key={index} onClick={() => handleInspirationClick(item)} className="mystic-card p-6 cursor-pointer group flex flex-col">
                                    <h4 className="text-xl font-bold font-playfair text-yellow-400 mb-2 group-hover:text-yellow-300 transition-colors">{item.title}</h4>
                                    <p className="text-gray-400 text-sm flex-grow">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : null}

            {isLoading && (
                <div className="flex flex-col justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                    <p className="mt-4 text-yellow-400 text-lg">Reading your sacred marks...</p>
                </div>
            )}

            {analysis && (
                <div className="printable-report">
                    <div className="animate-[fadeIn_1s_ease-in-out]">
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold font-playfair text-white">Your Moleology Reading {isExample && <span className="text-gray-400 text-3xl">(Example)</span>}</h2>
                            <p className="mt-2 text-gray-400">Here is the wisdom your moles reveal, interpreted by our AI Guru.</p>
                        </div>
                        <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 space-y-4">
                            {analysis.sections.map((section, index) => (
                                <AnalysisAccordionItem key={section.category} section={section} defaultOpen={index === 0} index={index} />
                            ))}
                        </div>

                        <div className="mt-8 animate-[fadeIn_1s_ease-in-out] print-hidden">
                            <div className="grid md:grid-cols-3 gap-4">
                                <TattooSuggestion
                                    analysisText={getAnalysisTextForSuggestion()}
                                    onGenerateTattoo={onSuggestTattoo}
                                    featureName="Moleology"
                                    userContext={userContext}
                                />
                                <ArtSuggestion
                                    analysisText={getAnalysisTextForSuggestion()}
                                    onGenerateArt={onSuggestArt}
                                    featureName="Moleology"
                                    userContext={userContext}
                                />
                                <MudraSuggestion
                                    analysisText={getAnalysisTextForSuggestion()}
                                    featureName="Moleology"
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
                            <button onClick={() => { setAnalysis(null); setSelectedMoles([]); setIsExample(false); }} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                                Start a New Analysis
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Moleology;
