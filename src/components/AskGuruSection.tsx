
import React from 'react';
import { Link } from 'react-router-dom';
import AIChatBox from './AIChatBox';
import { Sun, BookOpen } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

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
            palmistry, kamasutra, and ancient Indian wisdom.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="p-4 rounded-lg bg-cosmic-deep-purple/10 backdrop-blur-sm">
            <h3 className="font-medium text-cosmic-gold mb-2">Sample Questions</h3>
            <ul className="space-y-2 text-gray-300">
              <li>✋ "What does my palm say about my destiny?"</li>
              <li>💫 "I'm a Cancer, my partner is Aries - are we compatible?"</li>
              <li>🔮 "What's the meaning of a mole on my right shoulder?"</li>
              <li>🧘‍♀️ "How can I understand my karmic path?"</li>
              <li>❤️ "What does Kamasutra say about emotional bonding?"</li>
              <li>📜 "What do the Vedas teach about meditation?"</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-cosmic-deep-purple/10 backdrop-blur-sm">
            <h3 className="font-medium text-cosmic-gold mb-2">Areas of Wisdom</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🌌 Vedic Astrology & Zodiac Signs</li>
              <li>✋ Ancient Palmistry Insights</li>
              <li>⭐ Karmic & Spiritual Guidance</li>
              <li>🧘‍♀️ Holistic Life Wisdom</li>
              <li>💕 Kamasutra & Relationship Harmony</li>
              <li>📚 Vedic Philosophy & Ancient Texts</li>
            </ul>
          </div>
        </div>

        <AIChatBox />

        <div className="mt-6 text-center">
          <Link to="/ancient-wisdom">
            <Button variant="outline" className="mt-4 border-cosmic-gold/50 text-cosmic-gold hover:bg-cosmic-deep-purple/30">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore Ancient Wisdom
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default AskGuruSection;
