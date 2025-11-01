
import React from 'react';
import { FeatureId } from '../types';

interface HeaderProps {
  onNavClick: (feature: FeatureId) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavClick }) => {
  return (
    <header className="header-bg-animate sticky top-0 z-50 border-b border-gray-800/50 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavClick(FeatureId.HOME)}
        >
          <div className="w-10 h-10 relative">
            {/* AI Core */}
            <div className="absolute inset-2 rounded-full bg-yellow-400/80" style={{ animation: 'pulse-logo-glow 3s infinite ease-in-out' }}></div>
            {/* Orbits */}
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '10s' }}>
              <circle cx="50" cy="50" r="45" stroke="rgba(253, 224, 71, 0.5)" strokeWidth="4" fill="none" />
            </svg>
            <svg viewBox="0 0 100 100" className="w-full h-full absolute top-0 left-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <ellipse cx="50" cy="50" rx="30" ry="48" stroke="rgba(253, 224, 71, 0.3)" strokeWidth="3" fill="none" transform="rotate(45 50 50)" />
            </svg>
          </div>
          <span className="text-3xl font-bold font-playfair logo-text-gradient">
            Taintra
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-lg text-gray-300">
          <a onClick={() => onNavClick(FeatureId.TOUR)} className="nav-link-hover-glow cursor-pointer">Tour</a>
          <a onClick={() => onNavClick(FeatureId.ASTROLOGY)} className="nav-link-hover-glow cursor-pointer">Astrology</a>
          <a onClick={() => onNavClick(FeatureId.PALMISTRY)} className="nav-link-hover-glow cursor-pointer">Palmistry</a>
          <a onClick={() => onNavClick(FeatureId.DATING)} className="nav-link-hover-glow cursor-pointer">Matchmaking</a>
           <a onClick={() => onNavClick(FeatureId.IMAGE_GENERATOR)} className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors font-semibold cursor-pointer nav-link-hover-glow">Cosmic Art</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;