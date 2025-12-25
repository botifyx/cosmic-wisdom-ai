import React from 'react';
import { FeatureId } from '../types';
import { ArtIcon, MudraIcon, TattooIcon } from '../features';


interface HighlightsSectionProps {
  onFeatureSelect: (feature: FeatureId) => void;
}

const HighlightsSection: React.FC<HighlightsSectionProps> = ({ onFeatureSelect }) => {
  return (
    <section className="text-center my-24 animate-[fadeInUp_1s_ease-in-out]">
      <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-2">Unique AI-Powered Experiences</h2>
      <p className="text-gray-400 mb-10 max-w-3xl mx-auto">Explore our one-of-a-kind tools that transform ancient wisdom into a deeply personal and creative journey.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {/* Cosmic Art Generator Highlight */}
        <div className="highlight-card p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
            <ArtIcon className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="text-2xl font-bold font-playfair text-white mb-3">Cosmic Art Generator</h3>
          <p className="text-gray-400 text-base mb-6 flex-grow">
            Transform your personal analysis into a stunning piece of cosmic art. Our AI translates your unique energetic blueprint into a visual masterpiece.
          </p>
          <button
            onClick={() => onFeatureSelect(FeatureId.COSMIC_ART_GENERATOR)}
            className="bg-purple-500 text-white font-bold py-2 px-8 rounded-full hover:bg-purple-400 transition-colors"
          >
            Create Your Art
          </button>
        </div>

        {/* Tour Highlight - replacing Mudra for now */}
        <div className="highlight-card p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-300"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm.75-13.5a.75.75 0 1 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6ZM12 15.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
          </div>
          <h3 className="text-2xl font-bold font-playfair text-white mb-3">How It All Works</h3>
          <p className="text-gray-400 text-base mb-6 flex-grow">
            New to Taintra? Take a guided tour to understand our philosophy and see how each cosmic tool can illuminate your path.
          </p>
          <button
            onClick={() => onFeatureSelect(FeatureId.TOUR)}
            className="bg-blue-500 text-white font-bold py-2 px-8 rounded-full hover:bg-blue-400 transition-colors"
          >
            Take the Tour
          </button>
        </div>

        {/* Cosmic Tattoo Maker Highlight */}
        <div className="highlight-card p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
            <TattooIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold font-playfair text-white mb-3">Cosmic Tattoo Maker</h3>
          <p className="text-gray-400 text-base mb-6 flex-grow">
            Don't just read your analysis—embody it. Our AI designs a sacred tattoo and suggests the perfect body placement to enhance its power.
          </p>
          <button
            onClick={() => onFeatureSelect(FeatureId.TATTOO_MAKER)}
            className="bg-yellow-500 text-gray-900 font-bold py-2 px-8 rounded-full hover:bg-yellow-400 transition-colors"
          >
            Design Your Tattoo
          </button>
        </div>

      </div>
    </section>
  );
};

export default HighlightsSection;