import React, { useRef, useEffect, useState } from 'react';
import { FeatureId, Feature } from '../types';
import FeatureCard from './FeatureCard';
import HighlightsSection from './HighlightsSection';
import Testimonials from './Testimonials';
import CitationsSection from './CitationsSection';
import { features } from '../features';

interface HeroSectionProps {
  onFeatureSelect: (feature: FeatureId) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onFeatureSelect }) => {
  const yantraRef = useRef<HTMLDivElement>(null);
  const [activePart, setActivePart] = useState<{title: string, desc: string} | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!yantraRef.current) return;

      const { clientX, clientY, currentTarget } = event;
      const { left, top, width, height } = (currentTarget as HTMLElement).getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const rotateY = (x - 0.5) * -30; // Max rotation 15 degrees
      const rotateX = (y - 0.5) * 30; // Max rotation 15 degrees

      yantraRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const container = document.querySelector('.hero-container');
    container?.addEventListener('mousemove', handleMouseMove as EventListener);
    container?.addEventListener('mouseleave', () => {
        if (yantraRef.current) {
            yantraRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
        }
    });

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove as EventListener);
    };
  }, []);
  
  const handleExploreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const target = document.getElementById('cosmic-impact-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const particles = Array.from({ length: 50 }).map((_, i) => {
    const style = {
      '--x-start': `${Math.random() * 100}vw`,
      '--y-start': `${Math.random() * 100}vh`,
      '--x-end': `${45 + Math.random() * 10}vw`,
      '--y-end': `${45 + Math.random() * 10}vh`,
      animationDuration: `${5 + Math.random() * 5}s`,
      animationDelay: `${Math.random() * 10}s`,
    } as React.CSSProperties;
    return <div key={i} className="data-particle" style={style}></div>
  });

  const cosmicReadingsFeature = features.find(f => f.id === FeatureId.PACKAGES);
  const otherFeatures = features.filter(f => f.id !== FeatureId.PACKAGES);

  // Define explicit layout classes for a more dynamic masonry grid
  const cardLayouts: { [key in FeatureId]?: string } = {
      [FeatureId.ASTROLOGY]: 'lg:col-span-2 lg:row-span-2 large-feature-card',
      [FeatureId.TATTOO_MAKER]: 'lg:col-span-2 wide-feature-card creative-tool-card',
      [FeatureId.COSMIC_ART_GENERATOR]: 'creative-tool-card',
  };

  // Yantra Interaction Data
  const yantraParts = {
    bindu: { title: "The Bindu", desc: "The center of creation. Pure consciousness beyond time and space." },
    upTriangle: { title: "Shiva (Ascending)", desc: "Masculine energy, aspiration, and the fire of transformation." },
    downTriangle: { title: "Shakti (Descending)", desc: "Feminine energy, divine grace, and the flow of creativity." },
    innerWeb: { title: "The Cosmic Web", desc: "The complex interplay of energies that weave the fabric of reality." },
    innerCircle: { title: "Vayu (Rhythm)", desc: "The circle of vital breath and the cyclical nature of time." },
    outerCircle: { title: "Padma (Lotus)", desc: "The blossoming of consciousness and spiritual awakening." },
    square: { title: "Bhupura (Earth)", desc: "The earthly plane. Stability, grounding, and material boundaries." }
  };

  const handleEnter = (key: keyof typeof yantraParts) => {
      setHoveredId(key);
      setActivePart(yantraParts[key]);
  };
  const handleLeave = () => {
      setHoveredId(null);
      setActivePart(null);
  };

  const getStrokeColor = (key: string) => hoveredId === key ? "#FBBF24" : "#8b5cf6";
  const getStrokeWidth = (key: string) => hoveredId === key ? "1.5" : "0.5";
  const getFilter = (key: string) => hoveredId === key ? "drop-shadow(0 0 8px #FBBF24)" : "";

  return (
    <>
      {/* Main Hero Banner */}
      <section className="hero-container py-20 px-6 md:px-12 mb-12">
        <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center md:text-left hero-content">
            <h1 className="text-5xl md:text-6xl font-bold font-playfair text-white leading-tight">
              The Future of<br />
              <span className="logo-text-gradient text-6xl md:text-7xl">Ancient Wisdom</span>
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
          <div ref={yantraRef} className="ai-yantra-container relative w-full min-h-[24rem] h-80 md:h-96 flex items-center justify-center">
              <div className="particle-stream">{particles}</div>
              <div className="ai-yantra-glow"></div>
              
              {/* Floating Info Card */}
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-30 bg-gray-900/90 backdrop-blur-md border border-yellow-500/30 px-6 py-4 rounded-xl text-center transition-all duration-300 w-72 pointer-events-none shadow-2xl ${activePart ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
                {activePart && (
                    <>
                    <h4 className="text-yellow-400 font-playfair font-bold text-xl mb-1">{activePart.title}</h4>
                    <p className="text-gray-300 text-sm leading-snug">{activePart.desc}</p>
                    </>
                )}
              </div>

              <svg id="ai-yantra" viewBox="0 0 200 200" className="w-full h-full max-w-md overflow-visible">
                {/* Visible Geometry */}
                <g fill="none" style={{ transition: 'stroke 0.3s, stroke-width 0.3s, filter 0.3s' }}>
                  {/* Upward Triangle */}
                  <path className="yantra-line" style={{animationDelay: '0s', stroke: getStrokeColor('upTriangle'), strokeWidth: getStrokeWidth('upTriangle'), filter: getFilter('upTriangle')}} d="M100 20 L180 165 L20 165 Z" />
                  
                  {/* Downward Triangle */}
                  <path className="yantra-line" style={{animationDelay: '0.5s', stroke: getStrokeColor('downTriangle'), strokeWidth: getStrokeWidth('downTriangle'), filter: getFilter('downTriangle')}} d="M100 180 L20 35 L180 35 Z" />
                  
                  {/* Inner Web Group */}
                  <g style={{ stroke: getStrokeColor('innerWeb'), strokeWidth: getStrokeWidth('innerWeb'), filter: getFilter('innerWeb') }}>
                    <path className="yantra-line" style={{animationDelay: '1s'}} d="M62 82.5 L138 82.5 L100 142.5 Z" />
                    <path className="yantra-line" style={{animationDelay: '1.5s'}} d="M100 57.5 L138 117.5 L62 117.5 Z" />
                    <path className="yantra-line" style={{animationDelay: '2s'}} d="M81 95 L119 95 L100 125 Z" />
                    <path className="yantra-line" style={{animationDelay: '2.5s'}} d="M100 75 L119 105 L81 105 Z" />
                  </g>

                  {/* Circles */}
                  <circle className="yantra-line" style={{animationDelay: '3s', stroke: getStrokeColor('innerCircle'), strokeWidth: getStrokeWidth('innerCircle'), filter: getFilter('innerCircle')}} cx="100" cy="100" r="40" />
                  <circle className="yantra-line" style={{animationDelay: '3.5s', stroke: getStrokeColor('outerCircle'), strokeWidth: getStrokeWidth('outerCircle'), filter: getFilter('outerCircle')}} cx="100" cy="100" r="55" />
                  
                  {/* Square */}
                  <rect className="yantra-line" style={{animationDelay: '4s', stroke: getStrokeColor('square'), strokeWidth: getStrokeWidth('square'), filter: getFilter('square')}} x="10" y="10" width="180" height="180" />
                </g>
                
                {/* Bindu - separate handling */}
                <circle className="bindu" cx="100" cy="100" r="3" fill={hoveredId === 'bindu' ? "#FBBF24" : "#c4b5fd"} style={{ transition: 'fill 0.3s', filter: getFilter('bindu') }} />

                {/* Invisible Hit Areas for Interaction */}
                <g stroke="transparent" strokeWidth="15" fill="none" style={{ cursor: 'help', pointerEvents: 'stroke' }}>
                    <path d="M100 20 L180 165 L20 165 Z" onMouseEnter={() => handleEnter('upTriangle')} onMouseLeave={handleLeave} />
                    <path d="M100 180 L20 35 L180 35 Z" onMouseEnter={() => handleEnter('downTriangle')} onMouseLeave={handleLeave} />
                    
                    <g onMouseEnter={() => handleEnter('innerWeb')} onMouseLeave={handleLeave}>
                        <path d="M62 82.5 L138 82.5 L100 142.5 Z" />
                        <path d="M100 57.5 L138 117.5 L62 117.5 Z" />
                        <path d="M81 95 L119 95 L100 125 Z" />
                        <path d="M100 75 L119 105 L81 105 Z" />
                    </g>

                    <circle cx="100" cy="100" r="40" onMouseEnter={() => handleEnter('innerCircle')} onMouseLeave={handleLeave} />
                    <circle cx="100" cy="100" r="55" strokeWidth="10" onMouseEnter={() => handleEnter('outerCircle')} onMouseLeave={handleLeave} />
                    <rect x="10" y="10" width="180" height="180" onMouseEnter={() => handleEnter('square')} onMouseLeave={handleLeave} />
                    
                    {/* Bindu Hit Area */}
                    <circle cx="100" cy="100" r="10" fill="transparent" stroke="none" style={{pointerEvents: 'fill'}} onMouseEnter={() => handleEnter('bindu')} onMouseLeave={handleLeave} />
                </g>
              </svg>
          </div>
        </div>
      </section>

      {/* Cosmic Impact Citations Section */}
      <div id="cosmic-impact-section">
        <CitationsSection />
      </div>

      <HighlightsSection onFeatureSelect={onFeatureSelect} />

      {/* Your Cosmic Journey Section */}
      <section className="cosmic-journey-section rounded-2xl p-8 md:p-12 my-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-[fadeInUp_1s_ease-in-out_0.2s]">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white mb-4">Your Cosmic Journey</h2>
            <p className="text-gray-300 text-lg mb-6">
              Discover how Taintra fuses the timeless knowledge of the cosmos with the power of artificial intelligence. We translate ancient symbols and wisdom into clear, personal guidance, illuminating your unique path.
            </p>
            <button
              onClick={() => onFeatureSelect(FeatureId.TOUR)}
              className="banner-button"
            >
              Explore Our Tools
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-xs">
              <g className="journey-lotus" fill="#ec4899">
                <path d="M100 80 Q 80 80, 75 95 C 70 110, 85 120, 100 130 C 115 120, 130 110, 125 95 Q 120 80, 100 80 Z" />
                <path d="M100 85 Q 90 90, 85 100 C 80 110, 90 115, 100 125 C 110 115, 120 110, 115 100 Q 110 90, 100 85 Z" opacity="0.7" />
                <path d="M100 90 Q 95 95, 92 100 C 90 105, 95 110, 100 115 C 105 110, 110 105, 108 100 Q 105 95, 100 90 Z" opacity="0.5" />
              </g>
              <g stroke="#67e8f9" strokeWidth="0.7" fill="none">
                <path className="journey-circuit-line" style={{animationDelay: '0.2s'}} d="M100 80 C 60 70, 40 40, 20 30" />
                <path className="journey-circuit-line" style={{animationDelay: '0.4s'}} d="M125 95 C 140 85, 160 70, 180 65" />
                <path className="journey-circuit-line" style={{animationDelay: '0.6s'}} d="M75 95 C 60 85, 40 70, 20 65" />
                <path className="journey-circuit-line" style={{animationDelay: '0.8s'}} d="M100 130 C 80 145, 70 165, 60 180" />
                <path className="journey-circuit-line" style={{animationDelay: '1s'}} d="M100 130 C 120 145, 130 165, 140 180" />
                <circle className="journey-node" style={{animationDelay: '0.2s'}} cx="20" cy="30" r="2" fill="#67e8f9" />
                <circle className="journey-node" style={{animationDelay: '0.4s'}} cx="180" cy="65" r="2" fill="#67e8f9" />
                <circle className="journey-node" style={{animationDelay: '0.6s'}} cx="20" cy="65" r="2" fill="#67e8f9" />
                <circle className="journey-node" style={{animationDelay: '0.8s'}} cx="60" cy="180" r="2" fill="#67e8f9" />
                <circle className="journey-node" style={{animationDelay: '1s'}} cx="140" cy="180" r="2" fill="#67e8f9" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* Cosmic Categories Section */}
      <section id="cosmic-categories" className="text-center">

        {/* Cosmic Readings Banner */}
        {cosmicReadingsFeature && (
            <div 
                className="cosmic-readings-banner mystic-card p-8 mb-16 max-w-5xl mx-auto cursor-pointer"
                onClick={() => onFeatureSelect(cosmicReadingsFeature.id)}
            >
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="banner-icon-container">
                        <cosmicReadingsFeature.Icon className="w-12 h-12 md:w-16 md:h-16 text-yellow-300" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <h3 className="text-2xl md:text-3xl font-playfair font-bold text-white mb-2">{cosmicReadingsFeature.title}</h3>
                        <p className="text-gray-300">{cosmicReadingsFeature.description}</p>
                    </div>
                    <button className="banner-button mt-4 md:mt-0">
                        Build Your Reading
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </button>
                </div>
            </div>
        )}

        <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white">Explore Cosmic Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-6 mt-8 max-w-7xl mx-auto">
            {otherFeatures.map((feature) => {
                const layoutClass = cardLayouts[feature.id] || '';
                return (
                    <FeatureCard
                        key={feature.id}
                        feature={feature}
                        onClick={() => onFeatureSelect(feature.id)}
                        className={layoutClass}
                    />
                );
            })}
        </div>
      </section>

      <Testimonials />
    </>
  );
};

export default HeroSection;