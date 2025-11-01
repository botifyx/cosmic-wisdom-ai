import React, { useState, useCallback, useEffect, useRef } from 'react';
import { getTarotReading } from '../services/geminiService';
import { TarotAnalysis, TarotCardReading } from '../types';
import ArtSuggestion from './ArtSuggestion';

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


const shuffle = (array: string[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

interface TarotReadingProps {
  onSuggestArt: (prompt: string, aspectRatio: string) => void;
}

const TarotReading: React.FC<TarotReadingProps> = ({ onSuggestArt }) => {
  const [deck, setDeck] = useState<string[]>([]);
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [analysis, setAnalysis] = useState<TarotAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [selectedSpreadKey, setSelectedSpreadKey] = useState<SpreadKey>('threeCard');
  const [allCardsDrawn, setAllCardsDrawn] = useState(false);
  
  const selectedSpread = SPREADS[selectedSpreadKey];
  
  const resetReading = () => {
    setIsShuffled(false);
    setDrawnCards([]);
    setAnalysis(null);
    setError('');
    setAllCardsDrawn(false);
  }

  const handleShuffle = useCallback(() => {
    setDeck(shuffle([...FULL_DECK]));
    setDrawnCards([]);
    setIsShuffled(true);
    setAnalysis(null);
    setError('');
    setRevealed(Array(selectedSpread.cardCount).fill(false));
    setAllCardsDrawn(false);
  }, [selectedSpread]);

  const drawCard = () => {
    if (drawnCards.length < selectedSpread.cardCount && deck.length > 0) {
      const newDeck = [...deck];
      const card = newDeck.pop()!;
      setDeck(newDeck);
      setDrawnCards(prev => [...prev, card]);
    }
  };
  
  useEffect(() => {
    if (drawnCards.length === selectedSpread.cardCount) {
        setAllCardsDrawn(true);
    }
  }, [drawnCards, selectedSpread.cardCount]);
  
  const performAnalysis = async () => {
    if (drawnCards.length !== selectedSpread.cardCount) return;

    setIsLoading(true);
    const cardsWithPositions = drawnCards.map((cardName, index) => ({
      cardName,
      position: selectedSpread.positions[index],
    }));
    const result = await getTarotReading(selectedSpread.name, cardsWithPositions);
    
    if (result) {
      setAnalysis(result);
      // Reveal all cards one by one after analysis
      for (let i = 0; i < selectedSpread.cardCount; i++) {
        setTimeout(() => setRevealed(r => {
            const newRevealed = [...r];
            if (i < newRevealed.length) newRevealed[i] = true;
            return newRevealed;
        }), 100 + i * 400);
      }
    } else {
      setError('The cosmic connection is faint. Could not interpret the cards. Please try again.');
    }
    setIsLoading(false);
  };

  const handlePrint = () => { window.print(); };

  const handleShare = () => {
    if (analysis) {
        const textToCopy = `My Tarot reading from Taintra was so insightful! Here's the summary: "${analysis.overallSummary}"`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Reading summary copied to clipboard!'))
            .catch(err => console.error('Failed to copy summary: ', err));
    }
  };


  const AnalysisAccordion: React.FC<{ reading: TarotCardReading, icon: string, defaultOpen: boolean; }> = ({ reading, icon, defaultOpen }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        const contentRef = useRef<HTMLDivElement>(null);
        
        return (
            <div className="border border-purple-400/20 rounded-lg overflow-hidden bg-gray-800/30">
                <button onClick={() => setIsOpen(!isOpen)} className="w-full text-left p-4 flex justify-between items-center cursor-pointer print-hidden">
                    <div className="flex items-center gap-3 pr-4">
                        <span className="text-xl">{icon}</span>
                        <div>
                           <p className={`text-sm text-purple-300`}>{reading.position}</p>
                           <h4 className={`font-bold text-lg text-yellow-300`}>{reading.cardName}</h4>
                        </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </button>
                <div ref={contentRef} style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }} className="overflow-hidden transition-all duration-500 ease-in-out accordion-content-print">
                    <div className="px-5 pb-4 pt-2 border-t border-purple-400/20">
                        <p className="text-gray-300 mb-3">{reading.interpretation}</p>
                        <div className="flex flex-wrap gap-2">
                           {reading.keywords.map(kw => <span key={kw} className="text-xs bg-gray-700 text-purple-300 px-2 py-1 rounded-full">{kw}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        );
  };
  
  const getAnalysisTextForArt = () => {
    if (!analysis) return "";
    const cardNames = analysis.readings.map(r => r.cardName).join(', ');
    return `My tarot reading for a "${selectedSpread.name}" spread gave me: ${cardNames}. The overall summary is: ${analysis.overallSummary}`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white">AI Tarot Reading</h2>
          <p className="mt-2 text-gray-400 max-w-2xl mx-auto">Select a spread, shuffle the virtual deck, draw your cards, and receive AI-powered interpretations based on ancient Tarot wisdom.</p>
      </div>

      {!isShuffled && (
          <div className="text-center p-10 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-playfair text-yellow-400 mb-4">Choose Your Spread</h3>
              <div className="flex justify-center gap-4 mb-8">
                  {(Object.keys(SPREADS) as SpreadKey[]).map(key => (
                      <button key={key} onClick={() => setSelectedSpreadKey(key)} className={`px-5 py-2 rounded-full border-2 font-semibold transition-colors ${selectedSpreadKey === key ? 'bg-yellow-500 border-yellow-500 text-gray-900' : 'bg-gray-700 border-gray-600 hover:border-yellow-400 text-white'}`}>
                          {SPREADS[key].name} ({SPREADS[key].cardCount} Cards)
                      </button>
                  ))}
              </div>
              <button onClick={handleShuffle} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-12 rounded-lg hover:opacity-90 transition-opacity text-xl">
                  Shuffle the Deck
              </button>
          </div>
      )}

      {isShuffled && (
        <div className="space-y-8">
          <div className={`grid grid-cols-1 ${analysis ? 'lg:grid-cols-2' : ''} gap-8 items-start min-h-[24rem]`}>
            <div className={`grid ${selectedSpread.layout} gap-4 h-96 items-center`}>
              {Array.from({ length: selectedSpread.cardCount }).map((_, i) => {
                const isNextToDraw = drawnCards.length === i && !allCardsDrawn;
                const flipperClasses = [
                    'card-flipper w-32 h-48 mx-auto',
                    revealed[i] ? 'flipped revealed-glow' : '',
                    isNextToDraw ? 'card-slot-active' : ''
                ].filter(Boolean).join(' ');

                return (
                  <div key={i} className="text-center" style={{ gridArea: selectedSpread.gridAreas[i] }}>
                    <div className={flipperClasses} onClick={isNextToDraw ? drawCard : undefined}>
                        <div className="card-inner">
                            <div className="card-front bg-slate-900 border-2 border-purple-400/50 rounded-lg p-2 flex items-center justify-center overflow-hidden">
                              <div className="w-full h-full border border-yellow-400/20 rounded-md flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-900 relative">
                                  <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 text-yellow-300" style={{ animation: 'pulse-card-back 4s infinite ease-in-out' }}>
                                      <path d="M10 50 Q 50 20 90 50 Q 50 80 10 50 Z" stroke="currentColor" strokeWidth="3.5" fill="none" />
                                      <circle cx="50" cy="50" r="10" fill="currentColor" />
                                      <g stroke="currentColor" strokeWidth="2">
                                          <path d="M50 5 L50 15" /> <path d="M50 95 L50 85" />
                                          <path d="M5 50 L15 50" /> <path d="M95 50 L85 50" />
                                          <path d="M20 20 L27 27" /> <path d="M80 80 L73 73" />
                                          <path d="M20 80 L27 73" /> <path d="M80 20 L73 27" />
                                      </g>
                                  </svg>
                              </div>
                            </div>
                            <div className="card-back bg-slate-900 border border-yellow-400/50 rounded-lg p-2 flex flex-col justify-center items-center">
                              {drawnCards[i] && (
                                  <p className="text-xs text-yellow-300 font-bold leading-tight text-center">{drawnCards[i].replace(' of ', '\nof ')}</p>
                              )}
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 text-gray-400 font-semibold text-xs">{selectedSpread.positions[i]}</p>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col items-center justify-center h-full">
              {!allCardsDrawn && (
                <>
                  <p className="text-lg text-yellow-400 mb-4 h-6">Draw a card for: {selectedSpread.positions[drawnCards.length]}</p>
                  <div className="relative w-40 h-64 cursor-pointer group animate-[pulse-draw-glow_3s_infinite]" onClick={drawCard}>
                    {Array.from({ length: Math.max(1, deck.length / 10) }).map((_, i) => (
                      <div key={i} className="absolute inset-0 bg-slate-800 border-2 border-purple-400 rounded-lg" style={{ transform: `translate(${i * 2}px, ${i * 2}px)` }}></div>
                    ))}
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-800 rounded-lg flex items-center justify-center border-2 border-purple-300">
                        <span className="text-5xl text-yellow-300" style={{filter: 'drop-shadow(0 0 10px currentColor)'}}>✨</span>
                     </div>
                  </div>
                </>
              )}
              {allCardsDrawn && !analysis && !isLoading && (
                  <div className="text-center">
                      <h3 className="text-xl font-playfair text-yellow-300">All cards have been drawn.</h3>
                      <p className="text-gray-400 my-4">Are you ready to unveil your reading?</p>
                      <button onClick={performAnalysis} className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors">
                          Reveal My Reading
                      </button>
                  </div>
              )}
              {isLoading && (
                  <div className="flex flex-col justify-center items-center py-10">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                      <p className="mt-4 text-yellow-400 text-lg">Interpreting the cosmos...</p>
                  </div>
              )}
              {analysis && (
                  <div className="printable-report w-full">
                    <h3 className="text-3xl font-bold font-playfair text-center text-white mb-4">Your {selectedSpread.name} Reading</h3>
                    <div className="space-y-4">
                      {analysis.readings.map((reading, index) => (
                          <AnalysisAccordion key={reading.cardName + index} reading={reading} icon="✨" defaultOpen={index === 0} />
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </div>
        
          {analysis && (
            <div className="animate-[fadeIn_1s_ease-in-out] printable-report space-y-8">
                <div className="border border-purple-400/20 rounded-lg p-6 bg-gray-800/30 relative">
                    <h4 className="font-bold text-xl text-yellow-300 mb-2">Overall Summary</h4>
                    <p className="text-gray-300">{analysis.overallSummary}</p>
                </div>
                {analysis && (
                    <>
                        <ArtSuggestion 
                          analysisText={getAnalysisTextForArt()}
                          onGeneratePrompt={onSuggestArt}
                          featureName="Astrology" // Reusing
                        />
                        <div className="text-center pt-4 space-y-4 md:space-y-0 md:space-x-4 print-hidden">
                            <button onClick={handlePrint} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                Print Report
                            </button>
                             <button onClick={handleShare} className="bg-transparent border border-yellow-400 text-yellow-400 font-bold py-2 px-6 rounded-lg hover:bg-yellow-400/10 transition-colors">
                                Share Summary
                            </button>
                            <button onClick={resetReading} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">
                                Start a New Reading
                            </button>
                        </div>
                    </>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TarotReading;