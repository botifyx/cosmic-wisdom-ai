
import React, { useState, useCallback, useRef } from 'react';
import { PersonDetails, CosmicMatchAnalysis, AnalysisSection, SynastryAspect, UserContext } from '../types';
import { getCosmicMatchAnalysis } from '../services/geminiService';
import TattooSuggestion from './TattooSuggestion';
import ArtSuggestion from './ArtSuggestion';
import MudraSuggestion from './MudraSuggestion';

type Gender = 'Male' | 'Female' | 'Unisex';

interface DatingProps {
  onSuggestTattoo: (details: { prompt: string; placement: string; aspectRatio: string; }) => void;
  onSuggestArt: (details: { prompt: string; aspectRatio: string; }) => void;
  userGender: Gender | null;
  userContext: UserContext | null;
}

// A reusable form component for person details
const PersonForm: React.FC<{
  personNum: 1 | 2;
  details: PersonDetails;
  setDetails: React.Dispatch<React.SetStateAction<PersonDetails>>;
}> = ({ personNum, details, setDetails }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const key = id.replace(`person${personNum}_`, '');
    setDetails(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 space-y-4">
      <h3 className="text-2xl font-playfair font-bold text-yellow-400">
        {personNum === 1 ? 'Your Cosmic Profile' : 'Partner\'s Cosmic Profile'}
      </h3>
      <div>
        <label htmlFor={`person${personNum}_name`} className="block text-sm font-medium text-gray-300 mb-1">Name</label>
        <input type="text" id={`person${personNum}_name`} value={details.name} onChange={handleChange} className="input-field" placeholder="e.g., Priya" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`person${personNum}_birthDate`} className="block text-sm font-medium text-gray-300 mb-1">Birth Date</label>
          <input type="date" id={`person${personNum}_birthDate`} value={details.birthDate} onChange={handleChange} className="input-field" />
        </div>
        <div>
          <label htmlFor={`person${personNum}_birthTime`} className="block text-sm font-medium text-gray-300 mb-1">Birth Time</label>
          <input type="time" id={`person${personNum}_birthTime`} value={details.birthTime} onChange={handleChange} className="input-field" />
        </div>
      </div>
      <div>
        <label htmlFor={`person${personNum}_birthPlace`} className="block text-sm font-medium text-gray-300 mb-1">Birth Place</label>
        <input type="text" id={`person${personNum}_birthPlace`} value={details.birthPlace} onChange={handleChange} className="input-field" placeholder="e.g., Mumbai, India" />
      </div>
      <div>
        <label htmlFor={`person${personNum}_bio`} className="block text-sm font-medium text-gray-300 mb-1">Bio & Desires</label>
        <textarea id={`person${personNum}_bio`} rows={3} value={details.bio} onChange={handleChange} className="input-field" placeholder="A short bio and what you seek in a partner..."></textarea>
      </div>
    </div>
  );
};

// Main Dating component
const Dating: React.FC<DatingProps> = ({ onSuggestTattoo, onSuggestArt, userGender, userContext }) => {
  const [person1, setPerson1] = useState<PersonDetails>({ name: '', birthDate: '', birthTime: '', birthPlace: '', bio: '' });
  const [person2, setPerson2] = useState<PersonDetails>({ name: '', birthDate: '', birthTime: '', birthPlace: '', bio: '' });
  const [analysis, setAnalysis] = useState<CosmicMatchAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = useCallback(async () => {
    setError('');
    setIsLoading(true);
    setAnalysis(null);

    const result = await getCosmicMatchAnalysis(person1, person2, userContext);
    if (result) {
      setAnalysis(result);
    } else {
      setError("The cosmic energies are unclear at this moment. We could not generate a matchmaking analysis. Please try again.");
    }

    setIsLoading(false);
  }, [person1, person2, userContext]);

  const handleAnalyzeClick = () => {
    for (const key in person1) {
      if (!person1[key as keyof PersonDetails]) {
        setError("Please complete all fields for your profile.");
        return;
      }
    }
    for (const key in person2) {
      if (!person2[key as keyof PersonDetails]) {
        setError("Please complete all fields for your partner's profile.");
        return;
      }
    }
    setError('');
    handleAnalyze();
  };

  const handlePrint = () => { window.print(); };

  const handleShare = () => {
    if (analysis) {
      const textToCopy = `Taintra Cosmic Matchmaking analysis for ${person1.name} & ${person2.name}: Our compatibility score is ${analysis.overallCompatibility.score}%! Summary: "${analysis.overallCompatibility.summary}"`;
      navigator.clipboard.writeText(textToCopy)
        .then(() => alert('Report summary copied to clipboard!'))
        .catch(err => console.error('Failed to copy summary: ', err));
    }
  };

  const AnalysisAccordionItem: React.FC<{ section: AnalysisSection; icon: string; color: string; defaultOpen?: boolean; }> = ({ section, icon, color, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
      <div className={`border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-300 bg-gray-800/30 hover:bg-gray-800/60`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-4 flex justify-between items-center cursor-pointer print-hidden"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3 pr-4">
            <span className="text-xl">{icon}</span>
            <h4 className={`font-bold text-base md:text-lg ${color}`}>{section.title}</h4>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
        </button>
        <div
          ref={contentRef}
          style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
          className="overflow-hidden transition-all duration-500 ease-in-out accordion-content-print"
        >
          <div className="px-5 pb-4 pt-2 border-t border-gray-700/50">
            <p className="text-gray-300 text-sm leading-relaxed">{section.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const SynastryVisualizer: React.FC<{ aspects: SynastryAspect[]; person1Name: string; person2Name: string; }> = ({ aspects, person1Name, person2Name }) => {
    const [activeAspect, setActiveAspect] = useState<SynastryAspect | null>(null);

    const aspectStyles = {
      harmony: { color: '#4ade80', icon: '✨' }, // green-400
      challenge: { color: '#f87171', icon: '⚡' }, // red-400
      neutral: { color: '#60a5fa', icon: '🔗' }, // blue-400
    };

    return (
      <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50 relative overflow-hidden">
        <h3 className="text-2xl font-playfair text-center text-yellow-400 mb-8">Key Cosmic Connections</h3>
        <div className="flex justify-between items-center px-4">
          <div className="text-center w-1/4">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/30 flex items-center justify-center text-blue-300 text-2xl font-bold">{person1Name.charAt(0)}</div>
            <p className="mt-2 font-semibold text-white truncate">{person1Name}</p>
          </div>
          <div className="relative flex-1 h-48">
            {aspects.map((aspect, index) => {
              const top = `${15 + (index * 70) / (aspects.length > 1 ? aspects.length - 1 : 1)}%`;
              const { color, icon } = aspectStyles[aspect.type];
              return (
                <div key={index} className="absolute w-full" style={{ top }}>
                  <div className="absolute w-full top-1/2 h-px bg-gray-600/50"></div>
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                      animation: `pulse-icon-glow 3s infinite ease-in-out`,
                      border: `1px solid ${color}80`
                    }}
                    onMouseEnter={() => setActiveAspect(aspect)}
                    onMouseLeave={() => setActiveAspect(null)}
                  >
                    {icon}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="text-center w-1/4">
            <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/30 flex items-center justify-center text-pink-300 text-2xl font-bold">{person2Name.charAt(0)}</div>
            <p className="mt-2 font-semibold text-white truncate">{person2Name}</p>
          </div>
        </div>
        {/* Tooltip display */}
        <div className="mt-6 h-24 text-center flex flex-col justify-center items-center">
          {activeAspect ? (
            <div className="animate-[fadeIn_0.3s_ease-in-out]">
              <h4 className="font-bold text-lg" style={{ color: aspectStyles[activeAspect.type].color }}>{activeAspect.title}</h4>
              <p className="text-gray-300 text-sm max-w-md mx-auto">{activeAspect.description}</p>
            </div>
          ) : (
            <p className="text-gray-500">
              Hover over a connection to see details
            </p>
          )}
        </div>
      </div>
    );
  };


  const ResultDisplay: React.FC<{ analysis: CosmicMatchAnalysis; onSuggestTattoo: Function; onSuggestArt: Function; userGender: Gender | null; userContext: UserContext | null; }> = ({ analysis, onSuggestTattoo, onSuggestArt, userGender, userContext }) => {
    const getAnalysisTextForSuggestion = () => {
      if (!analysis) return "";
      return `Compatibility Summary: ${analysis.overallCompatibility.summary}\nSpiritual Guidance: ${analysis.spiritualGuidance}`;
    };

    return (
      <div className="printable-report">
        <div className="space-y-8 mt-12 animate-[fadeIn_1s_ease-in-out]">
          <div className="text-center p-6 bg-gray-900/50 rounded-2xl border border-yellow-400/30">
            <h3 className="text-3xl font-playfair text-white">Overall Cosmic Compatibility</h3>
            <div className="relative w-40 h-40 mx-auto my-4 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(234, 179, 8, 0.2)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="45" fill="none" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45 * (analysis.overallCompatibility.score / 100)} ${2 * Math.PI * 45}`}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                />
              </svg>
              <span className="text-4xl font-bold text-yellow-300">{analysis.overallCompatibility.score}%</span>
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto">{analysis.overallCompatibility.summary}</p>
          </div>

          {analysis.synastryAspects && analysis.synastryAspects.length > 0 && (
            <SynastryVisualizer aspects={analysis.synastryAspects} person1Name={person1.name} person2Name={person2.name} />
          )}

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="text-2xl font-playfair text-green-400 text-center lg:text-left">Areas of Harmony</h3>
              {analysis.strengths.map((item, i) => <AnalysisAccordionItem key={`strength-${i}`} section={item} icon="✨" color="text-green-400" defaultOpen={i === 0} />)}
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-playfair text-red-400 text-center lg:text-left">Potential Challenges</h3>
              {analysis.challenges.map((item, i) => <AnalysisAccordionItem key={`challenge-${i}`} section={item} icon="🌪️" color="text-red-400" />)}
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-playfair text-purple-400 text-center lg:text-left">Path for Growth</h3>
              {analysis.growthPotential.map((item, i) => <AnalysisAccordionItem key={`growth-${i}`} section={item} icon="🌱" color="text-purple-400" />)}
            </div>
          </div>

          <div className="p-6 bg-gray-900/50 rounded-2xl border border-gray-700/50 relative">
            <h3 className="text-2xl font-playfair text-yellow-400 mb-2">Spiritual Guidance</h3>
            <p className="text-gray-300">{analysis.spiritualGuidance}</p>
          </div>

          <div className="mt-8 animate-[fadeIn_1s_ease-in-out] print-hidden">
            <div className="grid md:grid-cols-3 gap-4">
              <TattooSuggestion
                analysisText={getAnalysisTextForSuggestion()}
                onGenerateTattoo={onSuggestTattoo as any}
                featureName="Matchmaking"
                userContext={userContext}
              />
              <ArtSuggestion
                analysisText={getAnalysisTextForSuggestion()}
                onGenerateArt={onSuggestArt as any}
                featureName="Matchmaking"
                userContext={userContext}
              />
              <MudraSuggestion
                analysisText={getAnalysisTextForSuggestion()}
                featureName="Matchmaking"
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
              onClick={() => { setAnalysis(null); }}
              className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Start a New Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <style>{`.input-field { width: 100%; background-color: #1F2937; border: 1px solid #4B5563; border-radius: 0.5rem; padding: 0.75rem; color: white; transition: all 0.2s; } .input-field:focus { outline: none; border-color: #FBBF24; box-shadow: 0 0 0 1px #FBBF24; }`}</style>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold font-playfair text-white">Cosmic Matchmaking Analysis</h2>
        <p className="mt-2 text-gray-400 max-w-3xl mx-auto">
          Unveil the sacred connection between two souls. Provide the birth details for a deep, AI-powered compatibility analysis based on Vedic wisdom.
        </p>
      </div>

      {!analysis && !isLoading && (
        <div className="space-y-8 animate-[fadeIn_0.5s_ease-in-out]">
          <div className="grid md:grid-cols-2 gap-8">
            <PersonForm personNum={1} details={person1} setDetails={setPerson1} />
            <PersonForm personNum={2} details={person2} setDetails={setPerson2} />
          </div>
          <div className="text-center">
            <button
              onClick={handleAnalyzeClick}
              disabled={isLoading}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-4 px-12 rounded-lg hover:opacity-90 transition-opacity disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-xl"
            >
              Analyze Cosmic Compatibility
            </button>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mb-4"></div>
          <p className="text-xl text-yellow-400">Consulting the cosmos for your analysis...</p>
          <p className="text-gray-400">This may take a moment as we align the stars.</p>
        </div>
      )}

      {analysis && <ResultDisplay analysis={analysis} onSuggestTattoo={onSuggestTattoo} onSuggestArt={onSuggestArt} userGender={userGender} userContext={userContext} />}

    </div>
  );
};

export default Dating;
