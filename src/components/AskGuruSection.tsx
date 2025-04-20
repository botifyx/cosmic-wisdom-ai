import React from 'react';
import AIChatBox from './AIChatBox';
import { Sun } from 'lucide-react';
import { Card } from './ui/card';

const AskGuruSection = () => {
  return (
    <section className="py-12 px-4">
      <Card className="max-w-4xl mx-auto bg-cosmic-deep-purple/20 backdrop-blur-sm p-6 rounded-lg border-cosmic-gold/30">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Sun className="h-12 w-12 text-cosmic-gold" />
          </div>
          <h2 className="text-2xl font-serif mb-3 text-cosmic-gold">Ask the Cosmic Guru</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover the secrets of cosmic knowledge through our AI-powered insights into astrology,
            palmistry, and ancient Indian wisdom.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="p-4 rounded-lg bg-cosmic-deep-purple/10 backdrop-blur-sm">
            <h3 className="font-medium text-cosmic-gold mb-2">Sample Questions</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🌟 "What does my palm say about my destiny?"</li>
              <li>💫 "Are Cancer and Aries spiritually compatible?"</li>
              <li>🔮 "What's the meaning of a mole on my right shoulder?"</li>
              <li>🕉️ "How can I understand my karmic path?"</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-cosmic-deep-purple/10 backdrop-blur-sm">
            <h3 className="font-medium text-cosmic-gold mb-2">Areas of Wisdom</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🌌 Vedic Astrology & Zodiac Signs</li>
              <li>✋ Ancient Palmistry Insights</li>
              <li>⭐ Karmic & Spiritual Guidance</li>
              <li>🧘‍♀️ Holistic Life Wisdom</li>
            </ul>
          </div>
        </div>

        <AIChatBox />
      </Card>
    </section>
  );
};

export default AskGuruSection;
