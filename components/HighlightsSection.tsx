import React from 'react';
import { FeatureId } from '../types';

interface HighlightsSectionProps {
  onFeatureSelect: (feature: FeatureId) => void;
}

const ImageGeneratorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.225.225 0 0 1 .225-.225h.008a.225.225 0 0 1 .225.225v.008a.225.225 0 0 1-.225.225h-.008a.225.225 0 0 1-.225-.225v-.008Z" /></svg>
);

const MantraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5c-3.14 0-6.02.9-8.47 2.47M12 7.5c3.14 0-6.02.9 8.47 2.47M12 7.5v9.75m0-9.75a4.5 4.5 0 1 1 0 9.75 4.5 4.5 0 0 1 0-9.75ZM4.5 12a7.5 7.5 0 0 0 15 0" />
    </svg>
);


const HighlightsSection: React.FC<HighlightsSectionProps> = ({ onFeatureSelect }) => {
  return (
    <section className="text-center my-24 animate-[fadeInUp_1s_ease-in-out]">
      <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-2">Unique AI-Powered Experiences</h2>
      <p className="text-gray-400 mb-10 max-w-3xl mx-auto">Explore our one-of-a-kind tools that transform ancient wisdom into a deeply personal and creative journey.</p>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        
        {/* Cosmic Art Generator Highlight */}
        <div className="highlight-card p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
            <ImageGeneratorIcon className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold font-playfair text-white mb-3">Cosmic Art Generator</h3>
          <p className="text-gray-400 text-base mb-6 flex-grow">
            Don't just read your analysis—see it. Transform the wisdom from your astrology, palmistry, or mantra reading into a unique visual sigil. Create a stunning, personalized wallpaper that acts as a daily reminder of your cosmic potential.
          </p>
          <button
            onClick={() => onFeatureSelect(FeatureId.IMAGE_GENERATOR)}
            className="bg-yellow-500 text-gray-900 font-bold py-2 px-8 rounded-full hover:bg-yellow-400 transition-colors"
          >
            Create Your Art
          </button>
        </div>

        {/* Mantra Generator Highlight */}
        <div className="highlight-card p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/30">
            <MantraIcon className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="text-2xl font-bold font-playfair text-white mb-3">AI Mantra Generator</h3>
          <p className="text-gray-400 text-base mb-6 flex-grow">
            Harness the power of sacred sound. Based on your specific goals, our AI crafts a personalized Sanskrit mantra just for you, complete with a detailed breakdown and authentic audio pronunciation. A tool for focus and transformation found nowhere else.
          </p>
          <button
            onClick={() => onFeatureSelect(FeatureId.MANTRA_GENERATOR)}
            className="bg-purple-500 text-white font-bold py-2 px-8 rounded-full hover:bg-purple-400 transition-colors"
          >
            Find Your Mantra
          </button>
        </div>

      </div>
    </section>
  );
};

export default HighlightsSection;
