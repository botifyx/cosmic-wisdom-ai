



import React, { useState } from 'react';
import { FeatureId } from '../types';
import { PAYMENT_TERMS, PRIVACY_POLICY, REFUND_POLICY, SHIPPING_POLICY, CONTACT_US } from '../services/terms';

interface FooterProps {
  onNavClick: (feature: FeatureId) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const [activePolicy, setActivePolicy] = useState<{ title: string; content: string } | null>(null);

  const quickLinks = [
    { label: 'Cosmic Readings', id: FeatureId.PACKAGES },
    { label: 'Vedic Astrology', id: FeatureId.ASTROLOGY },
    { label: 'Palm Reading', id: FeatureId.PALMISTRY },
    { label: 'Tarot Reading', id: FeatureId.TAROT },
    { label: 'Mantra Generator', id: FeatureId.MANTRA_GENERATOR },
    { label: 'Cosmic Art', id: FeatureId.COSMIC_ART_GENERATOR },
    { label: 'Cosmic Tattoo', id: FeatureId.TATTOO_MAKER }
  ];

  const policyLinks = [
    { label: 'Privacy Policy', content: PRIVACY_POLICY },
    { label: 'Refund Policy', content: REFUND_POLICY },
    { label: 'Shipping Policy', content: SHIPPING_POLICY },
    { label: 'Terms & Conditions', content: PAYMENT_TERMS },
    { label: 'Contact Us', content: CONTACT_US },
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

        {/* Policy Links Section */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-500 border-t border-gray-800 pt-6">
           {policyLinks.map((policy) => (
             <button 
                key={policy.label} 
                onClick={() => setActivePolicy({ title: policy.label, content: policy.content })}
                className="hover:text-gray-300 transition-colors"
             >
               {policy.label}
             </button>
           ))}
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setActivePolicy(null)}>
            <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative shadow-2xl animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
                <button onClick={() => setActivePolicy(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h3 className="text-2xl font-bold font-playfair text-white mb-6 border-b border-gray-800 pb-4">{activePolicy.title}</h3>
                <div className="text-gray-300 space-y-4 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {activePolicy.content}
                </div>
            </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
