
import React, { useState, useCallback } from 'react';
import { FeatureId } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import GufyChatbot from './components/GufyChatbot';
import PalmReading from './components/PalmReading';
import FaceReading from './components/FaceReading';
import ImageGenerator from './components/ImageGenerator';
import Dating from './components/Dating';
import Moleology from './components/Moleology';
import AstrologyFeature from './components/AstrologyFeature';
import SacredUnion from './components/SacredUnion';
import TarotReading from './components/TarotReading';
import MantraGenerator from './components/MantraGenerator';
import Tour from './components/Tour';
import HandwritingAnalysis from './components/HandwritingAnalysis';
// Fix: Correct import to ensure module is resolved properly. This error is often a symptom of an issue in the imported file.
import ZodiacCompatibility from './components/ZodiacCompatibility';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<FeatureId>(FeatureId.HOME);
  const [artGenerationDetails, setArtGenerationDetails] = useState<{ prompt: string; aspectRatio: string; } | null>(null);

  const handleSuggestArt = useCallback((prompt: string, aspectRatio: string) => {
    setArtGenerationDetails({ prompt, aspectRatio });
    setActiveFeature(FeatureId.IMAGE_GENERATOR);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleArtGenerationComplete = useCallback(() => {
    setArtGenerationDetails(null);
  }, []);

  const handleNavClick = (feature: FeatureId) => {
    // Clear the art prompt if we are navigating away from the image generator
    if (activeFeature === FeatureId.IMAGE_GENERATOR && feature !== FeatureId.IMAGE_GENERATOR) {
        setArtGenerationDetails(null);
    }
    setActiveFeature(feature);
  };

  const renderContent = () => {
    switch (activeFeature) {
      case FeatureId.HOME:
        return <HeroSection onFeatureSelect={setActiveFeature} />;
      case FeatureId.PALMISTRY:
        return <PalmReading onSuggestArt={handleSuggestArt} />;
      case FeatureId.FACE_READING:
        return <FaceReading onSuggestArt={handleSuggestArt} />;
      case FeatureId.HANDWRITING_ANALYSIS:
        return <HandwritingAnalysis onSuggestArt={handleSuggestArt} />;
      case FeatureId.IMAGE_GENERATOR:
        return <ImageGenerator 
          initialPrompt={artGenerationDetails?.prompt} 
          initialAspectRatio={artGenerationDetails?.aspectRatio}
          onGenerationComplete={handleArtGenerationComplete} 
        />;
       case FeatureId.ASTROLOGY:
        return <AstrologyFeature onSuggestArt={handleSuggestArt} />;
      case FeatureId.COMPATIBILITY:
        return <ZodiacCompatibility onSuggestArt={handleSuggestArt} />;
      case FeatureId.MOLEOLOGY:
        return <Moleology onSuggestArt={handleSuggestArt} />;
      case FeatureId.MANTRA_GENERATOR:
        return <MantraGenerator onSuggestArt={handleSuggestArt} />;
       case FeatureId.SACRED_UNION:
        return <SacredUnion onSuggestArt={handleSuggestArt} />;
      case FeatureId.DATING:
        return <Dating onSuggestArt={handleSuggestArt} />;
      case FeatureId.TAROT:
        return <TarotReading onSuggestArt={handleSuggestArt} />;
      case FeatureId.TOUR:
        return <Tour onFeatureSelect={setActiveFeature} />;
      default:
        return <HeroSection onFeatureSelect={setActiveFeature} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavClick={handleNavClick} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {activeFeature !== FeatureId.HOME && (
          <button
            onClick={() => handleNavClick(FeatureId.HOME)}
            className="mb-8 flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
            Back to Home
          </button>
        )}
        {renderContent()}
      </main>
      <GufyChatbot activeFeature={activeFeature} />
      <Footer onNavClick={handleNavClick} />
    </div>
  );
};

export default App;
