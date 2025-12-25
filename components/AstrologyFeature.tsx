
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getVedicAstrologyAnalysis, getDailyHoroscope } from '../services/geminiService';
import StarChart from './StarChart';
import { AstrologyAnalysis, AstrologyAnalysisSection, PlanetaryPositions, DailyHoroscopeAnalysis, UserContext } from '../types';
import TattooSuggestion from './TattooSuggestion';
import ArtSuggestion from './ArtSuggestion';
import MudraSuggestion from './MudraSuggestion';

type Gender = 'Male' | 'Female' | 'Unisex';

interface AstrologyFeatureProps {
    onSuggestTattoo: (details: { prompt: string; placement: string; aspectRatio: string; }) => void;
    onSuggestArt: (details: { prompt: string; aspectRatio: string; }) => void;
    userGender: Gender | null;
    userContext: UserContext | null;
}

const ZODIAC_ORDER = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const ZODIAC_SYMBOLS: { [key: string]: string } = {
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
};


const getRotatedPositions = (originalPositions: PlanetaryPositions, offset: number): PlanetaryPositions => {
    if (offset === 0) return originalPositions;
    const rotatedPositions: PlanetaryPositions = JSON.parse(JSON.stringify(originalPositions));
    (Object.keys(rotatedPositions) as Array<keyof PlanetaryPositions>).forEach(planet => {
        const originalSign = originalPositions[planet].sign;
        const originalIndex = ZODIAC_ORDER.indexOf(originalSign);
        if (originalIndex !== -1) {
            const newIndex = (originalIndex + offset + 12) % 12;
            rotatedPositions[planet].sign = ZODIAC_ORDER[newIndex];
        }
    });
    return rotatedPositions;
};

const AstrologyFeature: React.FC<AstrologyFeatureProps> = ({ onSuggestTattoo, onSuggestArt, userGender, userContext }) => {
    // States for birth chart
    const [birthDetails, setBirthDetails] = useState({ birthDate: '', birthTime: '', birthPlace: '' });
    const [analysis, setAnalysis] = useState<AstrologyAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isBirthTimeUnknown, setIsBirthTimeUnknown] = useState(false);
    const [chartRotation, setChartRotation] = useState(0);

    // States for daily horoscope
    const [dailyHoroscope, setDailyHoroscope] = useState<DailyHoroscopeAnalysis | null>(null);
    const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
    const [selectedSign, setSelectedSign] = useState<string | null>(null);

    // States for UV Index
    const [uvIndex, setUvIndex] = useState<number | null>(null);

    // Auto-select sun sign if birth chart is generated
    useEffect(() => {
        if (analysis?.rasi.Sun.sign) {
            setSelectedSign(analysis.rasi.Sun.sign);
        }
    }, [analysis]);

    // Fetch horoscope when sign changes
    useEffect(() => {
        const fetchHoroscope = async () => {
            if (selectedSign) {
                setIsHoroscopeLoading(true);
                setDailyHoroscope(null);
                const horoscope = await getDailyHoroscope(selectedSign);
                setDailyHoroscope(horoscope);
                setIsHoroscopeLoading(false);
            }
        };
        fetchHoroscope();
    }, [selectedSign]);

    // Fetch UV Index
    useEffect(() => {
        const fetchUV = async () => {
            if (userContext?.geolocation) {
                try {
                    const { latitude, longitude } = userContext.geolocation;
                    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=uv_index&timezone=auto`);
                    const data = await response.json();
                    if (data.current && typeof data.current.uv_index === 'number') {
                        setUvIndex(data.current.uv_index);
                    }
                } catch (e) {
                    console.error("Failed to fetch UV index", e);
                }
            }
        };
        fetchUV();
    }, [userContext]);


    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBirthDetails({ ...birthDetails, [e.target.name]: e.target.value });
    };

    const handleGenerate = useCallback(async () => {
        // Validation
        if (!birthDetails.birthDate) {
            setError('Please select your birth date.');
            return;
        }

        const selectedDate = new Date(birthDetails.birthDate);
        const today = new Date();
        if (selectedDate > today) {
            setError("Birth date cannot be in the future.");
            return;
        }

        if (!isBirthTimeUnknown && !birthDetails.birthTime) {
            setError('Please select your birth time.');
            return;
        }

        if (!birthDetails.birthPlace || birthDetails.birthPlace.trim().length < 2) {
            setError('Please enter a valid birth place.');
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysis(null);
        setChartRotation(0);

        const result = await getVedicAstrologyAnalysis({ ...birthDetails, isBirthTimeUnknown }, userGender || 'Unisex', userContext);
        if (result) {
            setAnalysis(result);
        } else {
            setError("The cosmic energies are unclear. We could not generate a chart. Please check the details and try again.");
        }
        setIsLoading(false);
    }, [birthDetails, isBirthTimeUnknown, userGender, userContext]);

    const handlePrint = () => window.print();

    const handleShare = () => {
        if (analysis) {
            const summary = analysis.analysis.find(s => s.category === 'summary')?.description || 'A fascinating insight into my cosmic blueprint.';
            const textToCopy = `I just got my AI Vedic Astrology chart from Taintra! Here's a summary: "${summary}"`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert('Report summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy summary: ', err));
        }
    };

    const getAnalysisTextForSuggestion = () => {
        if (!analysis) return "";
        return analysis.analysis.map(s => `${s.title}: ${s.description}`).join('\n');
    };

    const rotatedRasi = analysis ? getRotatedPositions(analysis.rasi, chartRotation) : null;
    const rotatedNavamsa = analysis ? getRotatedPositions(analysis.navamsa, chartRotation) : null;
    const rotatedDrekkana = analysis ? getRotatedPositions(analysis.drekkana, chartRotation) : null;

    const getUVInfo = (uv: number) => {
        if (uv <= 2) return { label: "Low", color: "text-green-400", icon: "🌱" };
        if (uv <= 5) return { label: "Moderate", color: "text-yellow-400", icon: "☀️" };
        if (uv <= 7) return { label: "High", color: "text-orange-400", icon: "🔥" };
        if (uv <= 10) return { label: "Very High", color: "text-red-400", icon: "🥵" };
        return { label: "Extreme", color: "text-purple-400", icon: "☠️" };
    };

    const DailyHoroscopeSection = () => {
        const uvInfo = uvIndex !== null ? getUVInfo(uvIndex) : null;

        return (
            <div className="p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 mb-12 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-3xl font-playfair font-bold text-white">Daily Cosmic Guidance</h2>
                        </div>
                        {uvInfo && (
                            <div className="mt-4 md:mt-0 flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-600/50">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Solar Intensity</span>
                                    <span className={`font-bold ${uvInfo.color} flex items-center gap-1`}>
                                        {uvInfo.icon} {uvIndex} {uvInfo.label}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                        {ZODIAC_ORDER.map(sign => (
                            <button
                                key={sign}
                                onClick={() => setSelectedSign(sign)}
                                className={`zodiac-selector-btn ${selectedSign === sign ? 'active' : ''} flex-grow sm:flex-grow-0 flex items-center gap-2 px-3 py-1.5 rounded-full`}
                            >
                                <span className="zodiac-symbol text-lg">{ZODIAC_SYMBOLS[sign]}</span>
                                <span className="text-sm font-semibold">{sign}</span>
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[20rem]">
                        {isHoroscopeLoading && (
                            <div className="flex justify-center items-center h-full pt-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                            </div>
                        )}
                        {dailyHoroscope && selectedSign && (
                            <div className="animate-[fadeIn_0.5s_ease-out]">
                                <h3 className="text-2xl font-playfair text-yellow-300 text-center md:text-left mb-1">{dailyHoroscope.greeting}</h3>
                                <p className="text-gray-400 text-center md:text-left mb-4">{dailyHoroscope.introduction}</p>
                                <div className="space-y-4">
                                    {dailyHoroscope.sections.map(section => (
                                        <div key={section.title}>
                                            <h4 className="font-bold text-white">{section.title}</h4>
                                            <p className="text-gray-300 text-sm">{section.outlook}</p>
                                        </div>
                                    ))}
                                    {dailyHoroscope.conclusion && (
                                        <p className="text-gray-300 text-sm italic">{dailyHoroscope.conclusion}</p>
                                    )}

                                    {/* Fix: Render grounding sources from Google Search as required by coding guidelines. */}
                                    {dailyHoroscope.sources && dailyHoroscope.sources.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Cosmic Sources</p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                                {dailyHoroscope.sources.map((source, i) => (
                                                    <a
                                                        key={i}
                                                        href={source.uri}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
                                                    >
                                                        {source.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="horoscope-lucky-box p-4 rounded-lg mt-4 flex justify-center items-center gap-6">
                                        <div>
                                            <p className="text-xs text-yellow-200 uppercase tracking-wider">Lucky Color</p>
                                            <p className="font-bold text-white text-lg">{dailyHoroscope.luckyColor}</p>
                                        </div>
                                        <div className="border-l border-yellow-400/30 h-8"></div>
                                        <div>
                                            <p className="text-xs text-yellow-200 uppercase tracking-wider">Lucky Numbers</p>
                                            <p className="font-bold text-white text-lg">{dailyHoroscope.luckyNumbers.join(', ')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!selectedSign && !isHoroscopeLoading && (
                            <p className="text-center text-gray-500 pt-12">Select your zodiac sign to view your daily horoscope.</p>
                        )}
                    </div>
                </div>
            </div>
        )
    };

    const AnalysisAccordionItem: React.FC<{ section: AstrologyAnalysisSection; defaultOpen?: boolean; index: number; }> = ({ section, defaultOpen = false, index }) => {
        const [isOpen, setIsOpen] = useState(defaultOpen);
        const contentRef = useRef<HTMLDivElement>(null);

        const icons: { [key: string]: string } = {
            introduction: '✨', ascendant: '🌅', placements: '🪐', themes: '🔑', summary: '📜'
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

    return (
        <div className="max-w-7xl mx-auto">
            <DailyHoroscopeSection />

            <div className="text-center mb-8 pt-8 border-t border-gray-700/50">
                <h2 className="text-4xl font-bold font-playfair text-white">Your Vedic Birth Chart</h2>
                <p className="mt-2 text-gray-400">Generate your cosmic blueprint (Janam Kundali) for a deep dive into your life's path.</p>
            </div>
            {!analysis && !isLoading && (
                <div className="max-w-2xl mx-auto p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50 animate-[fadeIn_0.5s_ease-in-out]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-yellow-400 mb-2" htmlFor="birthDate">Date of Birth</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="date"
                                    name="birthDate"
                                    id="birthDate"
                                    value={birthDetails.birthDate}
                                    onChange={handleDetailChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    onClick={(e) => {
                                        try {
                                            if ('showPicker' in HTMLInputElement.prototype) {
                                                e.currentTarget.showPicker();
                                            }
                                        } catch (err) { }
                                    }}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-shadow"
                                    placeholder="YYYY-MM-DD"
                                />
                            </div>
                        </div>

                        {/* Time of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-yellow-400 mb-2" htmlFor="birthTime">Time of Birth</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="time"
                                    name="birthTime"
                                    id="birthTime"
                                    value={birthDetails.birthTime}
                                    onChange={handleDetailChange}
                                    disabled={isBirthTimeUnknown}
                                    onClick={(e) => {
                                        try {
                                            if ('showPicker' in HTMLInputElement.prototype) {
                                                e.currentTarget.showPicker();
                                            }
                                        } catch (err) { }
                                    }}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-shadow"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Birth Place */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-yellow-400 mb-2" htmlFor="birthPlace">Place of Birth</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="birthPlace"
                                id="birthPlace"
                                value={birthDetails.birthPlace}
                                onChange={handleDetailChange}
                                placeholder="e.g., Mumbai, India"
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-shadow"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isBirthTimeUnknown}
                                    onChange={(e) => setIsBirthTimeUnknown(e.target.checked)}
                                    className="peer h-5 w-5 appearance-none rounded border border-gray-600 bg-gray-700 transition-all checked:border-yellow-500 checked:bg-yellow-500 hover:border-yellow-400"
                                />
                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-900 opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">I don't know my birth time</span>
                        </label>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="mt-8 w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                    >
                        Generate My Chart
                    </button>
                    {error && <p className="text-red-400 mt-3 text-center text-sm">{error}</p>}
                </div>
            )}

            {isLoading && (
                <div className="flex flex-col justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400"></div>
                    <p className="mt-4 text-yellow-400 text-lg">Calculating your cosmic blueprint...</p>
                </div>
            )}

            {analysis && (
                <div className="printable-report">
                    <div className="animate-[fadeIn_1s_ease-in-out]">
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-playfair text-center text-yellow-300 mb-2">Rasi (D1) Chart</h3>
                                    <div className="star-chart-print-container">
                                        {rotatedRasi && <StarChart positions={rotatedRasi} />}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-playfair text-center text-yellow-300 mb-2">Navamsa (D9) Chart</h3>
                                    <div className="star-chart-print-container">
                                        {rotatedNavamsa && <StarChart positions={rotatedNavamsa} />}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 space-y-4">
                                {analysis.analysis.map((section, index) => (
                                    <AnalysisAccordionItem key={section.category} section={section} defaultOpen={index === 0} index={index} />
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 animate-[fadeIn_1s_ease-in-out] print-hidden">
                            <div className="grid md:grid-cols-3 gap-4">
                                <TattooSuggestion
                                    analysisText={getAnalysisTextForSuggestion()}
                                    onGenerateTattoo={onSuggestTattoo}
                                    featureName="Astrology"
                                    userContext={userContext}
                                />
                                <ArtSuggestion
                                    analysisText={getAnalysisTextForSuggestion()}
                                    onGenerateArt={onSuggestArt}
                                    featureName="Astrology"
                                    userContext={userContext}
                                />
                                <MudraSuggestion
                                    analysisText={getAnalysisTextForSuggestion()}
                                    featureName="Astrology"
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
                                onClick={() => { setAnalysis(null); setSelectedSign(null); setDailyHoroscope(null); }}
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
