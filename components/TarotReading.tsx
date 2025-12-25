import React, { useState, useCallback, useRef } from 'react';
import { getTarotReading, getTarotCardDescriptions } from '../services/geminiService';
import { TarotAnalysis, TarotCardReading, UserContext } from '../types';
import ArtSuggestion from './ArtSuggestion';
import TattooSuggestion from './TattooSuggestion';
import MudraSuggestion from './MudraSuggestion';

type Gender = 'Male' | 'Female' | 'Unisex';

const FULL_DECK = [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World",
    "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands", "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands", "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands",
    "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups", "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups", "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups",
    "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords", "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords", "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords",
    "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles", "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles", "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
];

const SPREADS = {
    threeCard: {
        name: "Past, Present, Future",
        cardCount: 3,
        positions: ["Past", "Present", "Future"],
        layout: "grid-cols-3",
        gridAreas: ["1 / 1 / 2 / 2", "1 / 2 / 2 / 3", "1 / 3 / 2 / 4"],
    },
    fiveCard: {
        name: "Path & Potential",
        cardCount: 5,
        positions: ["The Situation", "The Challenge", "Guiding Advice", "The Near Future", "Potential Outcome"],
        layout: "grid-cols-3 grid-rows-3",
        gridAreas: ["2 / 2 / 3 / 3", "2 / 1 / 3 / 2", "1 / 2 / 2 / 3", "2 / 3 / 3 / 4", "3 / 2 / 4 / 3"],
    }
};

type SpreadKey = keyof typeof SPREADS;

type View = 'full' | 'head' | 'torso' | 'arms' | 'legs';
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

interface TarotReadingProps {
    onSuggestTattoo: (details: { prompt: string; placement: string; aspectRatio: string; }) => void;
    onSuggestArt: (details: { prompt: string; aspectRatio: string; }) => void;
    userGender: Gender | null;
    userContext: UserContext | null;
}

const AnalysisAccordionItem: React.FC<{ reading: TarotCardReading; defaultOpen?: boolean; index: number; }> = ({ reading, defaultOpen = false, index }) => {
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
                    <span className="text-xl">🃏</span>
                    <div>
                        <h4 className={`font-bold text-lg text-yellow-300`}>{reading.cardName}</h4>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">{reading.position}</p>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <div
                ref={contentRef}
                style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
                className="overflow-hidden transition-all duration-500 ease-in-out accordion-content-print"
            >
                <div className="px-5 pb-4 pt-2 border-t border-yellow-400/20">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{reading.interpretation}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {reading.keywords.map(kw => (
                            <span key={kw} className="text-xs bg-gray-700 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">{kw}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function TarotReading({ onSuggestTattoo, onSuggestArt, userGender, userContext }: TarotReadingProps) {
    const [spreadKey, setSpreadKey] = useState<SpreadKey>('threeCard');
    const [drawnCards, setDrawnCards] = useState<{ cardName: string, position: string }[]>([]);
    const [cardDescriptions, setCardDescriptions] = useState<Record<string, string>>({});
    const [analysis, setAnalysis] = useState<TarotAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [shuffling, setShuffling] = useState(false);
    const [addMoleology, setAddMoleology] = useState(false);
    const [selectedMoles, setSelectedMoles] = useState<string[]>([]);
    const [currentView, setCurrentView] = useState<View>('full');

    const handleDrawCards = useCallback(() => {
        setAnalysis(null);
        setShuffling(true);
        setCardDescriptions({});
        const shuffled = [...FULL_DECK].sort(() => 0.5 - Math.random());
        const spread = SPREADS[spreadKey];
        const cards = spread.positions.map((position, index) => ({
            cardName: shuffled[index],
            position: position,
        }));

        setTimeout(() => {
            setDrawnCards(cards);
            setShuffling(false);
            const cardNames = cards.map(c => c.cardName);
            getTarotCardDescriptions(cardNames).then(descriptions => {
                setCardDescriptions(descriptions);
            });
        }, 1500);
    }, [spreadKey]);

    const handleGetReading = useCallback(async () => {
        setIsLoading(true);
        setError('');
        const moleLocations = addMoleology ? selectedMoles.map(getMoleNameById).join(', ') : undefined;
        const result = await getTarotReading(SPREADS[spreadKey].name, drawnCards, userGender || 'Unisex', userContext, moleLocations);
        if (result) {
            setAnalysis(result);
        } else {
            setError("Could not get a reading. The cards are veiled. Please try again.");
        }
        setIsLoading(false);
    }, [drawnCards, spreadKey, addMoleology, selectedMoles, userGender, userContext]);

    const getAnalysisTextForSuggestion = () => {
        if (!analysis) return "";
        return `The overall summary of my reading was: ${analysis.overallSummary}. Key cards were ${analysis.readings.map(r => r.cardName).join(', ')}.`;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-bold font-playfair text-white">AI Tarot Reading</h2>
                <p className="mt-2 text-gray-400">Consult the cards and receive AI-powered wisdom for your path.</p>
            </div>

            {!analysis && (
                <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <label className="text-lg text-yellow-400">Choose a Spread:</label>
                        <div className="bg-gray-800/70 p-1 rounded-full flex items-center border border-gray-700">
                            {(Object.keys(SPREADS) as SpreadKey[]).map(key => (
                                <button key={key} onClick={() => { setSpreadKey(key); setDrawnCards([]); }} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${spreadKey === key ? 'bg-yellow-500 text-gray-900' : 'text-gray-400 hover:bg-gray-700'}`}>{SPREADS[key].name}</button>
                            ))}
                        </div>
                    </div>

                    {drawnCards.length === 0 ? (
                        <div className="text-center py-8">
                            <button onClick={handleDrawCards} disabled={shuffling} className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 text-lg">
                                {shuffling ? 'Shuffling...' : 'Draw Cards'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-playfair text-yellow-300">Your Drawn Cards</h3>
                                <div className="mt-4 grid gap-4 max-w-lg mx-auto" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, auto)' }}>
                                    {drawnCards.map((card, index) => (
                                        <div key={index} className="text-center group relative" style={{ gridArea: SPREADS[spreadKey].gridAreas[index] }}>
                                            <div className="p-2 border-2 border-yellow-400/50 rounded-lg bg-gray-800 h-32 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-300 hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.3)]">
                                                <p className="font-bold text-sm text-white relative z-10">{card.cardName}</p>
                                                <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                                    {cardDescriptions[card.cardName] ? (
                                                        <p className="text-[10px] leading-tight text-yellow-100 font-medium">{cardDescriptions[card.cardName]}</p>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400">Revealing...</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-xs text-yellow-400 mt-1 font-medium">{card.position}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-gray-800/50 rounded-lg">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={addMoleology} onChange={() => setAddMoleology(!addMoleology)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                                    <span className="text-gray-300">Add Moleology Insights to Reading</span>
                                </label>
                            </div>

                            <div className="text-center py-4">
                                <button onClick={handleGetReading} disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-lg">
                                    {isLoading ? 'Interpreting...' : 'Get My Reading'}
                                </button>
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {analysis && (
                <div className="space-y-6 animate-[fadeIn_1s_ease-in-out]">
                    <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl">
                        <h3 className="text-2xl font-playfair text-yellow-300 mb-2">Overall Summary</h3>
                        <p className="text-gray-300 leading-relaxed">{analysis.overallSummary}</p>
                    </div>

                    <div className="space-y-4">
                        {analysis.readings.map((reading, index) => (
                            <AnalysisAccordionItem
                                key={index}
                                reading={reading}
                                defaultOpen={index === 0}
                                index={index}
                            />
                        ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 print-hidden">
                        <TattooSuggestion analysisText={getAnalysisTextForSuggestion()} onGenerateTattoo={onSuggestTattoo} featureName="Tarot" userContext={userContext} />
                        <ArtSuggestion analysisText={getAnalysisTextForSuggestion()} onGenerateArt={onSuggestArt} featureName="Tarot" userContext={userContext} />
                        <MudraSuggestion analysisText={getAnalysisTextForSuggestion()} featureName="Tarot" userGender={userGender} userContext={userContext} />
                    </div>

                    <div className="text-center print-hidden">
                        <button onClick={() => { setAnalysis(null); setDrawnCards([]); setCardDescriptions({}); }} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                            Start a New Reading
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}