import React, { useState } from 'react';
import { FeatureId } from '../types';
import { features } from '../features';

interface TourProps {
  onFeatureSelect: (feature: FeatureId) => void;
}

const Tour: React.FC<TourProps> = ({ onFeatureSelect }) => {
  const [openAccordion, setOpenAccordion] = useState<FeatureId | null>(null);

  const handleAccordionClick = (featureId: FeatureId) => {
    setOpenAccordion(openAccordion === featureId ? null : featureId);
  };

  // Filter out non-tool features for this list
  const tools = features.filter(f => ![FeatureId.HOME, FeatureId.TOUR, FeatureId.PACKAGES].includes(f.id));

  return (
    <div className="max-w-5xl mx-auto animate-[fadeIn_0.5s_ease-in-out]">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold font-playfair text-white leading-tight" style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.5)' }}>
          Welcome to <span className="logo-text-gradient">Taintra</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">Your personal guide to the cosmos, powered by the fusion of ancient wisdom and artificial intelligence.</p>
      </div>

      {/* Our Philosophy Section */}
      <section className="mb-16 p-8 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700/50">
        <h2 className="text-3xl font-playfair font-bold text-center text-yellow-400 mb-4">Our Philosophy: Ancient Soul, Modern Mind</h2>
        <p className="text-center text-gray-300 leading-relaxed">
          For millennia, humanity has looked to the stars and the self for answers. Vedic astrology, palmistry, and other esoteric arts have provided a map to understanding our lives, but interpreting this ancient language requires deep wisdom. Taintra was born from a simple yet profound idea: What if we could pair the soul of this timeless knowledge with the analytical power of a modern AI?
          <br /><br />
          We are not replacing the guru; we are creating a new kind of cosmic looking glass. Our AI is trained on foundational Vedic and spiritual texts, allowing it to act as your personal guide. It translates the complex symbols of your life into clear, actionable insights, making profound self-discovery accessible to everyone.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-playfair font-bold text-center text-yellow-400 mb-8">How It Works: A Simple Path to Insight</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <div className="text-4xl mb-3">1.</div>
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Choose Your Tool</h3>
            <p className="text-gray-400">Select from our suite of cosmic tools. Are you curious about your birth chart, the lines on your palm, or your connection with another?</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <div className="text-4xl mb-3">2.</div>
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Get a Preview</h3>
            <p className="text-gray-400">Explore a sample reading to see the depth of insights available. Get the first section for free to understand the power of our analysis.</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <div className="text-4xl mb-3">3.</div>
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Unlock Full Wisdom</h3>
            <p className="text-gray-400">Select a Cosmic Reading package to receive your complete, personalized report, combining insights from multiple esoteric arts.</p>
          </div>
        </div>
      </section>

      {/* Discover Our Tools Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-playfair font-bold text-center text-yellow-400 mb-8">Discover Our Tools</h2>
        <div className="space-y-4">
          {tools.sort((a, b) => a.title.localeCompare(b.title)).map((tool) => {
            const isOpen = openAccordion === tool.id;
            return (
              <div key={tool.id} className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden transition-all duration-300">
                <button
                  onClick={() => handleAccordionClick(tool.id)}
                  className="w-full text-left p-4 md:p-6 flex justify-between items-center cursor-pointer hover:bg-gray-800/40"
                  aria-expanded={isOpen}
                  aria-controls={`accordion-content-${tool.id}`}
                >
                  <h3 className="text-xl font-playfair font-bold text-white">{tool.title}</h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-6 h-6 text-yellow-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                      }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                <div
                  id={`accordion-content-${tool.id}`}
                  className={`accordion-content ${isOpen ? 'open' : ''}`}
                >
                  <div>
                    <div className="p-4 md:p-6 pt-2 border-t border-gray-700/30 flex flex-col md:flex-row gap-6 items-center">
                      <p className="text-gray-400 flex-grow">{tool.description}</p>
                      <button
                        onClick={() => onFeatureSelect(tool.id)}
                        className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-colors flex-shrink-0"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The Taintra Difference Section */}
      <section>
        <h2 className="text-3xl font-playfair font-bold text-center text-yellow-400 mb-8">The Taintra Difference</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Structured, In-Depth Analysis</h3>
            <p className="text-gray-400">Unlike simple paragraph generators, our AI provides structured, detailed reports with clear sections, making the wisdom easy to understand and revisit.</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Personalized Cosmic Art</h3>
            <p className="text-gray-400">After receiving an analysis, you can transform its essence into a unique piece of AI-generated art—a personal sigil for your phone or desktop.</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Interactive Experience</h3>
            <p className="text-gray-400">From interactive star charts and body maps for moleology to a virtual Tarot deck, our tools are designed to be engaging and intuitive.</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Context-Aware AI Guru</h3>
            <p className="text-gray-400">Our chatbot, Gufy, understands which tool you're using and provides relevant, context-aware guidance to enhance your discovery.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Tour;