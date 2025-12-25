



import React from 'react';
import { FeatureId } from '../types';

interface FooterProps {
  onNavClick: (feature: FeatureId) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const quickLinks = [
    { label: 'Cosmic Readings', id: FeatureId.PACKAGES },
    { label: 'Vedic Astrology', id: FeatureId.ASTROLOGY },
    { label: 'Palm Reading', id: FeatureId.PALMISTRY },
    { label: 'Tarot Reading', id: FeatureId.TAROT },
    { label: 'Mantra Generator', id: FeatureId.MANTRA_GENERATOR },
    { label: 'Cosmic Art', id: FeatureId.COSMIC_ART_GENERATOR },
    { label: 'Cosmic Tattoo', id: FeatureId.TATTOO_MAKER }
  ];

  return (
    <footer className="bg-black/20 mt-20 pt-16 pb-8 border-t border-gray-800/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center">
          {/* Glowing Sacred Geometry: Seed of Life */}
          <div 
            className="relative w-24 h-24 mb-6" 
            style={{ animation: 'pulse-footer-glow 5s infinite ease-in-out' }}
            aria-label="Sacred Geometry"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-purple-300">
              <circle cx="50" cy="50" r="23.5" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="26.5" r="23.5" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="70.35" cy="38.25" r="23.5" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="70.35" cy="61.75" r="23.5" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="50" cy="73.5" r="23.5" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="29.65" cy="61.75" r="23.5" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="29.65" cy="38.25" r="23.5" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </div>

          <p className="text-xl font-playfair text-white mb-4">Taintra - AI Cosmic Wisdom</p>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-gray-400 mb-8">
            {quickLinks.map((link, index) => (
              <React.Fragment key={link.id}>
                <span onClick={() => onNavClick(link.id)} className="hover:text-yellow-400 transition-colors cursor-pointer">{link.label}</span>
                {index < quickLinks.length - 1 && <span className="opacity-50">/</span>}
              </React.Fragment>
            ))}
          </div>

          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Taintra. All rights reserved.</p>
          <p className="text-xs text-gray-600 mt-1">Harnessing the future through the wisdom of the past.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
