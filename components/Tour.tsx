import React from 'react';
import { FeatureId } from '../types';

interface TourProps {
  onFeatureSelect: (feature: FeatureId) => void;
}

const tools = [
  { id: FeatureId.ASTROLOGY, title: 'AI Vedic Astrology', description: 'Enter your birth date, time, and place. Our AI generates a detailed Vedic horoscope (Kundali), including planetary positions and in-depth analysis of your life path, strengths, and challenges.' },
  { id: FeatureId.PALMISTRY, title: 'AI Palm Reading', description: 'Upload a clear photo of your dominant hand. The AI analyzes your major lines (Heart, Head, Life, etc.) and mounts to reveal insights into your character and destiny.' },
  { id: FeatureId.FACE_READING, title: 'AI Face Reading', description: 'Upload a clear photo of your face. The AI studies your facial features—forehead, eyes, nose, and more—to provide insights into your personality and potential.' },
  { id: FeatureId.HANDWRITING_ANALYSIS, title: 'AI Handwriting Analysis', description: 'Upload a sample of your handwriting. The AI analyzes pressure, slant, size, and spacing to reveal deep insights into your personality and subconscious mind.' },
  { id: FeatureId.TAROT, title: 'AI Tarot Reading', description: 'Choose a spread (e.g., Past-Present-Future), then shuffle and draw cards. Our AI provides a nuanced interpretation of each card in its position and a summary of your reading.' },
  { id: FeatureId.SACRED_UNION, title: 'Sacred Union Insights', description: 'Select your and your partner\'s zodiac signs to explore your spiritual and intimate connection, with guidance inspired by the wisdom of the Kamasutra.' },
  { id: FeatureId.MANTRA_GENERATOR, title: 'AI Mantra Generator', description: 'Describe your goal or intention (e.g., "for focus," "for peace"). The AI will generate a personalized Sanskrit mantra with meanings and audio pronunciation.' },
  { id: FeatureId.COMPATIBILITY, title: 'Zodiac Compatibility', description: 'Select two zodiac signs and a relationship context (e.g., Love, Work). The AI provides a tailored analysis of the dynamic between the signs.' },
  { id: FeatureId.MOLEOLOGY, title: 'Moleology AI', description: 'Select your mole locations on an interactive body map. Our AI provides insights into what these marks signify about your personality, fortune, and life path.' },
  { id: FeatureId.DATING, title: 'Cosmic Matchmaking', description: 'Enter the birth details for two people. The AI performs a detailed astrological synastry (Kundali matching) to assess compatibility for a deep, meaningful connection.' },
  { id: FeatureId.IMAGE_GENERATOR, title: 'Cosmic Art Generator', description: 'Describe a mystical vision or use an analysis from another tool to generate a prompt. The AI will create a unique, beautiful piece of cosmic art for you.' },
];


const Tour: React.FC<TourProps> = ({ onFeatureSelect }) => {
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
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Provide Your Input</h3>
            <p className="text-gray-400">Enter your unique details—whether it's your birth information, a photo of your palm, or a simple intention for a mantra.</p>
          </div>
          <div className="p-6 bg-gray-900/30 rounded-xl">
            <div className="text-4xl mb-3">3.</div>
            <h3 className="text-xl font-playfair font-semibold text-white mb-2">Receive AI-Powered Wisdom</h3>
            <p className="text-gray-400">Our AI analyzes your input and delivers a detailed, structured report filled with personalized insights, guidance, and spiritual context.</p>
          </div>
        </div>
        <div className="mt-8 text-center p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-lg">
          <p className="text-yellow-300">
            <span className="font-bold">Please Note:</span> Print and Share Report for all Analysis are not enabled right now, it's planned for future releases.
          </p>
        </div>
      </section>

      {/* Discover Our Tools Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-playfair font-bold text-center text-yellow-400 mb-8">Discover Our Tools</h2>
        <div className="space-y-6">
          {tools.map((tool) => (
            <div key={tool.id} className="mystic-card p-6 flex flex-col md:flex-row gap-6 items-center !transform-none !shadow-none hover:!border-yellow-400/50">
              <div className="flex-grow">
                <h3 className="text-xl font-playfair font-bold text-white">{tool.title}</h3>
                <p className="text-gray-400 mt-1">{tool.description}</p>
              </div>
              <button
                onClick={() => onFeatureSelect(tool.id)}
                className="bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-colors flex-shrink-0"
              >
                Try Now
              </button>
            </div>
          ))}
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
