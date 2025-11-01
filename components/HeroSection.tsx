import React from 'react';
import { FeatureId, Feature } from '../types';
import FeatureCard from './FeatureCard';
import HighlightsSection from './HighlightsSection';

interface HeroSectionProps {
  onFeatureSelect: (feature: FeatureId) => void;
}

const AstrologyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" /></svg>
);
const PalmistryIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 12 10.125A2.625 2.625 0 0 0 12 4.875Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.875v.01" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75a3 3 0 1 1-6 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 11.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /><path strokeLinecap="round" strokeLinejoin="round"d="M6 11.25a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /></svg>
);
const FaceReadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 8.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0 1.5ZM12 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM8.25 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9 11.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15.75 9.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM15 11.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12 15.75a2.25 2.25 0 0 1-2.25-2.25H9a3.75 3.75 0 0 0 7.5 0h-.75A2.25 2.25 0 0 1 12 15.75Z M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/>
    </svg>
);
const HandwritingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
);
const CompatibilityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
);
const MoleologyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
);
const ImageGeneratorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.225.225 0 0 1 .225-.225h.008a.225.225 0 0 1 .225.225v.008a.225.225 0 0 1-.225.225h-.008a.225.225 0 0 1-.225-.225v-.008Z" /></svg>
);
const DatingIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
);
const MantraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5c-3.14 0-6.02.9-8.47 2.47M12 7.5c3.14 0-6.02.9 8.47 2.47M12 7.5v9.75m0-9.75a4.5 4.5 0 1 1 0 9.75 4.5 4.5 0 0 1 0-9.75ZM4.5 12a7.5 7.5 0 0 0 15 0" />
    </svg>
);
const SacredUnionIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);
const TarotIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a14.956 14.956 0 0 1-5.84 2.56m0 0a14.956 14.956 0 0 0-5.84-2.56m5.84 2.56v4.82a6 6 0 0 1-5.84-7.38m5.84 2.56c1.474 0 2.854-.366 4.093-.996m-4.093.996c-1.474 0-2.854-.366-4.093-.996m0 0a14.95 14.95 0 0 1-5.632-4.138m13.818 4.138a14.95 14.95 0 0 0 5.632-4.138m-13.818 4.138c-1.572 1.21-3.5 1.938-5.632 1.938m13.818-1.938c1.572 1.21 3.5 1.938 5.632 1.938M8.409 6.262a14.92 14.92 0 0 0-5.632 4.138m13.818-4.138a14.92 14.92 0 0 1 5.632 4.138" />
    </svg>
);
const GuideIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v16.5M3.75 12h16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m6.375 6.375 11.25 11.25M6.375 17.625 17.625 6.375" />
    </svg>
);


const features: Feature[] = [
  { id: FeatureId.TOUR, title: 'Cosmic Tour', description: 'New here? Take a guided tour of our AI-powered tools.', Icon: GuideIcon },
  { id: FeatureId.ASTROLOGY, title: 'AI Vedic Astrology', description: 'Generate your cosmic blueprint and Janam Kundali.', Icon: AstrologyIcon },
  { id: FeatureId.PALMISTRY, title: 'AI Palm Reading', description: 'Upload a photo of your palm for an AI-enhanced reading.', Icon: PalmistryIcon },
  { id: FeatureId.FACE_READING, title: 'AI Face Reading', description: 'Upload a photo of your face for an AI-enhanced reading.', Icon: FaceReadingIcon },
  { id: FeatureId.HANDWRITING_ANALYSIS, title: 'AI Handwriting Analysis', description: 'Analyze your handwriting to reveal personality traits and emotional states.', Icon: HandwritingIcon },
  { id: FeatureId.TAROT, title: 'AI Tarot Reading', description: 'Shuffle a virtual deck for AI interpretations of your cards.', Icon: TarotIcon },
  { id: FeatureId.SACRED_UNION, title: 'Sacred Union Insights', description: 'Explore spiritual connection and intimacy via Kamasutra wisdom.', Icon: SacredUnionIcon },
  { id: FeatureId.MANTRA_GENERATOR, title: 'AI Mantra Generator', description: 'Receive a personalized mantra for your goals.', Icon: MantraIcon },
  { id: FeatureId.COMPATIBILITY, title: 'Zodiac Compatibility', description: 'Analyze the cosmic connection between two zodiac signs.', Icon: CompatibilityIcon },
  { id: FeatureId.MOLEOLOGY, title: 'Moleology AI', description: 'Discover what your moles reveal about your personality.', Icon: MoleologyIcon },
  { id: FeatureId.IMAGE_GENERATOR, title: 'Cosmic Art Generator', description: 'Create mystical images from your imagination.', Icon: ImageGeneratorIcon },
  { id: FeatureId.DATING, title: 'Cosmic Matchmaking', description: 'Find your soulmate based on ancient wisdom.', Icon: DatingIcon },
];

const HeroSection: React.FC<HeroSectionProps> = ({ onFeatureSelect }) => {
  const handleExploreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const target = document.getElementById('cosmic-categories');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <>
      {/* Main Hero Banner */}
      <section className="hero-container bg-gray-900/40 py-20 px-6 md:px-12 mb-24">
        <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center md:text-left">
            <h1 
              className="text-5xl md:text-7xl font-bold font-playfair text-white leading-tight"
              style={{ textShadow: '0 0 20px rgba(234, 179, 8, 0.5)' }}
            >
              The Future of <span className="logo-text-gradient">Ancient Wisdom</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-xl mx-auto md:mx-0 text-gray-300">
              Unlock the secrets of the cosmos. Taintra merges timeless Vedic knowledge with advanced AI to offer profound insights into your life's path.
            </p>
            <button
              onClick={handleExploreClick}
              className="mt-10 inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold py-4 px-10 rounded-full text-lg transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/20"
            >
              Explore Cosmic Insights
            </button>
          </div>

          {/* Right: Visual Element */}
          <div className="relative w-full max-w-sm mx-auto h-80 md:h-96 hidden md:block">
            <div className="absolute inset-0" style={{ animation: 'pulse-orb-glow 5s infinite ease-in-out' }}>
                <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                        <radialGradient id="orb-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{ stopColor: 'rgba(168, 85, 247, 0.8)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'rgba(168, 85, 247, 0)', stopOpacity: 1 }} />
                        </radialGradient>
                    </defs>
                    <circle cx="100" cy="100" r="100" fill="url(#orb-gradient)" />
                </svg>
            </div>
            {/* Rotating Orbits */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ animation: 'rotate-orb-outer 20s linear infinite' }}>
                <ellipse cx="100" cy="100" rx="60" ry="95" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" fill="none" transform="rotate(25 100 100)" />
            </svg>
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" style={{ animation: 'rotate-orb-inner 25s linear infinite' }}>
                <ellipse cx="100" cy="100" rx="95" ry="45" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" fill="none" transform="rotate(-35 100 100)" />
            </svg>
            {/* Center Symbol (OM) */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-8xl font-serif" style={{ textShadow: '0 0 15px white' }}>
               ॐ
            </div>
          </div>
        </div>
      </section>

      <HighlightsSection onFeatureSelect={onFeatureSelect} />

      {/* Cosmic Categories Section */}
      <section id="cosmic-categories" className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white">Explore Cosmic Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-8 max-w-7xl mx-auto">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} onClick={() => onFeatureSelect(feature.id)} />
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroSection;