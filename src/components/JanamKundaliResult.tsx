import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type KundaliData = {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
};

// Mock function to determine ascendant based on birth time
const determineAscendant = (birthTime: string): string => {
  const hour = parseInt(birthTime.split(':')[0]);
  
  // Simplified logic for demo purposes
  const ascendants = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 
    'Leo', 'Virgo', 'Libra', 'Scorpio', 
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  return ascendants[hour % 12];
};

// Mock planetary positions
const generatePlanetaryPositions = (birthDate: string) => {
  // In a real app, this would use complex astronomical calculations
  // Here we'll use simplified mock data
  const day = parseInt(birthDate.split('-')[0]);
  
  return [
    { planet: 'Sun', sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][day % 12], house: (day % 12) + 1 },
    { planet: 'Moon', sign: ['Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Aries'][day % 12], house: ((day + 2) % 12) + 1 },
    { planet: 'Mercury', sign: ['Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus'][day % 12], house: ((day + 4) % 12) + 1 },
    { planet: 'Venus', sign: ['Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo'][day % 12], house: ((day + 6) % 12) + 1 },
    { planet: 'Mars', sign: ['Aries', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo'][day % 12], house: ((day + 1) % 12) + 1 },
    { planet: 'Jupiter', sign: ['Sagittarius', 'Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio'][day % 12], house: ((day + 3) % 12) + 1 },
    { planet: 'Saturn', sign: ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'][day % 12], house: ((day + 5) % 12) + 1 },
    { planet: 'Rahu', sign: ['Gemini', 'Taurus', 'Aries', 'Pisces', 'Aquarius', 'Capricorn', 'Sagittarius', 'Scorpio', 'Libra', 'Virgo', 'Leo', 'Cancer'][day % 12], house: ((day + 7) % 12) + 1 },
    { planet: 'Ketu', sign: ['Sagittarius', 'Scorpio', 'Libra', 'Virgo', 'Leo', 'Cancer', 'Gemini', 'Taurus', 'Aries', 'Pisces', 'Aquarius', 'Capricorn'][day % 12], house: ((day + 9) % 12) + 1 },
  ];
};

// Generate yogas (auspicious combinations)
const generateYogas = (birthDate: string) => {
  const day = parseInt(birthDate.split('-')[0]);
  
  // Mock yogas
  const allYogas = [
    { name: 'Gaj Kesari Yoga', description: 'Bestows courage, leadership qualities, and success in endeavors.' },
    { name: 'Budh-Aditya Yoga', description: 'Enhances intelligence, communication skills, and success in education.' },
    { name: 'Chandra-Mangal Yoga', description: 'Provides wealth, courage, and a passionate nature.' },
    { name: 'Panch Mahapurush Yoga', description: 'Indicates a person of extraordinary qualities and potential.' },
    { name: 'Neech Bhanga Raja Yoga', description: 'Turns negative planetary influences into powerful positive ones.' },
    { name: 'Dhana Yoga', description: 'Creates opportunities for accumulating wealth and prosperity.' }
  ];
  
  // Select 2-3 yogas based on birth date
  return allYogas.slice(day % 3, day % 3 + 2);
};

// Check for doshas (negative influences)
const checkDoshas = (birthDate: string, birthTime: string) => {
  const day = parseInt(birthDate.split('-')[0]);
  const hour = parseInt(birthTime.split(':')[0]);
  
  // Mock doshas
  const allDoshas = [
    { name: 'Mangal Dosha', present: (day % 4 === 0), description: 'Mars in certain houses causing potential challenges in marriage.', remedy: 'Recite Hanuman Chalisa and wear Red Coral after proper rituals.' },
    { name: 'Kaal Sarp Dosha', present: (hour % 5 === 0), description: 'All planets hemmed between Rahu and Ketu causing delays in life progress.', remedy: 'Perform Kaal Sarp Dosha Nivaran puja and recite Sri Rudram.' },
    { name: 'Pitra Dosha', present: (day % 7 === 0), description: 'Indicates ancestral displeasure affecting family harmony.', remedy: 'Perform Shradh ceremonies and Pitra Tarpan rituals.' },
    { name: 'Shani Dosha', present: (day % 8 === 0), description: 'Saturn\'s negative influence causing delays and hardships.', remedy: 'Visit Shani temple on Saturdays and donate black sesame seeds.' },
  ];
  
  // Filter doshas that are present
  return allDoshas.filter(dosha => dosha.present);
};

export function JanamKundaliResult() {
  const navigate = useNavigate();
  const [kundaliData, setKundaliData] = useState<KundaliData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Retrieve the stored data
    const storedData = sessionStorage.getItem('kundaliData');
    
    if (!storedData) {
      // If no data, redirect back to the form
      navigate('/astrology');
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedData);
      setKundaliData(parsedData);
    } catch (error) {
      console.error('Failed to parse kundali data:', error);
      navigate('/astrology');
    }
    
    // Simulate loading time for analysis
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  if (loading || !kundaliData) {
    return (
      <div className="min-h-screen bg-cosmic-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-16 w-16 border-4 border-cosmic-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cosmic-gold text-lg">Consulting the cosmic energies...</p>
        </div>
      </div>
    );
  }

  // Generate analysis components based on the data
  const ascendant = determineAscendant(kundaliData.birthTime);
  const planetaryPositions = generatePlanetaryPositions(kundaliData.birthDate);
  const yogas = generateYogas(kundaliData.birthDate);
  const doshas = checkDoshas(kundaliData.birthDate, kundaliData.birthTime);
  
  return (
    <div className="bg-cosmic-midnight text-white pt-8 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/astrology" className="inline-flex items-center text-cosmic-gold hover:text-cosmic-gold/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Astrology
          </Link>
        </div>
        
        <div className="cosmic-card p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-cosmic-gold">Janam Kundali Analysis</h1>
            <p className="text-xl text-gray-300">Vedic Birth Chart for {kundaliData.fullName}</p>
            <div className="text-sm text-gray-400 mt-2">
              Born on {kundaliData.birthDate} at {kundaliData.birthTime} in {kundaliData.birthPlace}
            </div>
          </div>
          
          <div className="mb-8 text-center italic text-gray-300">
            <p>"Namaste, seeker. Based on your birth details, I have drawn your Vedic birth chart. Let us now interpret what the stars reveal..."</p>
          </div>
          
          <Separator className="my-6 bg-cosmic-gold/30" />
          
          {/* Ascendant & Personality Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-cosmic-gold">
              🌅 Ascendant & Personality Traits
            </h2>
            <p className="mb-4 text-gray-300">
              Your ascendant (lagna) is <span className="text-cosmic-gold font-semibold">{ascendant}</span>, which forms the foundation of your birth chart and shapes your outward personality and physical appearance.
            </p>
            
            <div className="bg-cosmic-deep-purple/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Key personality traits influenced by your {ascendant} ascendant:</h3>
              {ascendant === 'Aries' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Bold, energetic, and pioneering spirit</li>
                  <li>Natural leadership abilities and competitive drive</li>
                  <li>Quick to act and straightforward in communication</li>
                  <li>Courageous approach to life's challenges</li>
                </ul>
              )}
              {ascendant === 'Taurus' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Steadfast, reliable, and practical nature</li>
                  <li>Strong appreciation for beauty and comfort</li>
                  <li>Patient and persistent in achieving goals</li>
                  <li>Enjoys sensory pleasures and material security</li>
                </ul>
              )}
              {ascendant === 'Gemini' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Intellectually curious and adaptable mind</li>
                  <li>Excellent communication skills and quick wit</li>
                  <li>Versatile approach to different situations</li>
                  <li>Enjoys variety and tends to have multiple interests</li>
                </ul>
              )}
              {ascendant === 'Cancer' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Emotionally sensitive and nurturing personality</li>
                  <li>Strong intuition and protective instincts</li>
                  <li>Deep connection to home and family</li>
                  <li>Retentive memory and sentimental nature</li>
                </ul>
              )}
              {ascendant === 'Leo' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Natural charisma and dignified presence</li>
                  <li>Creative expression and dramatic flair</li>
                  <li>Generous spirit with a warm heart</li>
                  <li>Strong sense of pride and natural authority</li>
                </ul>
              )}
              {ascendant === 'Virgo' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Analytical mind with attention to detail</li>
                  <li>Practical approach to problem-solving</li>
                  <li>Service-oriented with a healing nature</li>
                  <li>Methodical and organized in daily life</li>
                </ul>
              )}
              {ascendant === 'Libra' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Refined aesthetic sense and diplomatic nature</li>
                  <li>Strong desire for harmony and balance</li>
                  <li>Natural charm and social grace</li>
                  <li>Fair-minded approach to relationships</li>
                </ul>
              )}
              {ascendant === 'Scorpio' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Intense and penetrating personality</li>
                  <li>Resourceful with transformative power</li>
                  <li>Deep emotional nature and magnetic presence</li>
                  <li>Determined and resilient in facing challenges</li>
                </ul>
              )}
              {ascendant === 'Sagittarius' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Optimistic outlook and philosophical mind</li>
                  <li>Love of freedom and adventure</li>
                  <li>Honest and direct communication style</li>
                  <li>Expansive vision and belief in possibilities</li>
                </ul>
              )}
              {ascendant === 'Capricorn' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Disciplined approach to goals and responsibilities</li>
                  <li>Natural sense of authority and ambition</li>
                  <li>Practical wisdom and strategic thinking</li>
                  <li>Patient and steady progress toward success</li>
                </ul>
              )}
              {ascendant === 'Aquarius' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Innovative thinking and humanitarian ideals</li>
                  <li>Independent spirit and original perspective</li>
                  <li>Forward-looking vision and intellectual detachment</li>
                  <li>Interest in group dynamics and social progress</li>
                </ul>
              )}
              {ascendant === 'Pisces' && (
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Compassionate heart and spiritual sensitivity</li>
                  <li>Imaginative mind with artistic potential</li>
                  <li>Intuitive understanding of others' feelings</li>
                  <li>Adaptable nature with oceanic emotional depth</li>
                </ul>
              )}
            </div>
          </section>
          
          {/* Planetary Positions Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-cosmic-gold">
              🌌 Planetary Positions
            </h2>
            <p className="mb-4 text-gray-300">
              The positions of the planets at the moment of your birth reveal your unique cosmic blueprint. Each planet influences different aspects of your life journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="cosmic-card p-4">
                <h3 className="font-medium mb-3 text-center">Position by Sign</h3>
                <ul className="space-y-2">
                  {planetaryPositions.map((planet, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="font-medium">{planet.planet}</span>
                      <span className="text-cosmic-gold">{planet.sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="cosmic-card p-4">
                <h3 className="font-medium mb-3 text-center">Position by House</h3>
                <ul className="space-y-2">
                  {planetaryPositions.map((planet, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="font-medium">{planet.planet}</span>
                      <span className="text-cosmic-gold">House {planet.house}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          
          {/* Life Areas Insights Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-cosmic-gold">
              🪔 Life Area Insights
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Career & Financial Path</h3>
                <p className="text-gray-300">
                  With {planetaryPositions[0].planet} in {planetaryPositions[0].sign} and {planetaryPositions[2].planet} in {planetaryPositions[2].sign}, you are naturally drawn to careers that involve {planetaryPositions[0].sign === 'Leo' || planetaryPositions[0].sign === 'Aries' ? 'leadership and self-expression' : planetaryPositions[0].sign === 'Gemini' || planetaryPositions[0].sign === 'Libra' ? 'communication and relationships' : planetaryPositions[0].sign === 'Taurus' || planetaryPositions[0].sign === 'Virgo' ? 'practical skills and analysis' : 'intuition and creativity'}. Your financial approach tends to be {planetaryPositions[5].sign === 'Sagittarius' || planetaryPositions[5].sign === 'Leo' ? 'generous and optimistic' : planetaryPositions[5].sign === 'Capricorn' || planetaryPositions[5].sign === 'Taurus' ? 'cautious and security-focused' : 'adaptable and innovative'}.
                </p>
                <p className="mt-2 text-gray-300">
                  The position of Jupiter in your chart suggests opportunities for growth through {planetaryPositions[5].house === 10 || planetaryPositions[5].house === 6 ? 'professional achievements and service' : planetaryPositions[5].house === 2 || planetaryPositions[5].house === 11 ? 'wealth accumulation and social networks' : 'personal development and creative pursuits'}.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Relationships & Love Life</h3>
                <p className="text-gray-300">
                  Venus in {planetaryPositions[3].sign} indicates that you approach relationships with {planetaryPositions[3].sign === 'Libra' || planetaryPositions[3].sign === 'Taurus' ? 'harmony, beauty, and a desire for balance' : planetaryPositions[3].sign === 'Scorpio' || planetaryPositions[3].sign === 'Aries' ? 'intensity, passion, and directness' : 'thoughtfulness, adaptability, and emotional depth'}. Your romantic nature is {planetaryPositions[1].sign === 'Cancer' || planetaryPositions[1].sign === 'Pisces' ? 'sensitive, nurturing, and emotionally deep' : planetaryPositions[1].sign === 'Leo' || planetaryPositions[1].sign === 'Sagittarius' ? 'warm, generous, and expressive' : 'thoughtful, practical, and communicative'}.
                </p>
                <p className="mt-2 text-gray-300">
                  The position of Venus in your {planetaryPositions[3].house}th house suggests that relationships may play a significant role in your {planetaryPositions[3].house === 7 ? 'partnerships and marriage' : planetaryPositions[3].house === 5 ? 'creative expression and romance' : planetaryPositions[3].house === 2 ? 'values and self-worth' : 'personal growth and life purpose'}.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Health & Vitality</h3>
                <p className="text-gray-300">
                  The Sun in your chart shows your core energy and vitality flowing through {planetaryPositions[0].sign}, suggesting that your health is connected to your ability to express {planetaryPositions[0].sign === 'Leo' || planetaryPositions[0].sign === 'Aries' ? 'confidence, courage, and personal power' : planetaryPositions[0].sign === 'Taurus' || planetaryPositions[0].sign === 'Capricorn' ? 'stability, patience, and practicality' : 'adaptability, communication, and mental clarity'}.
                </p>
                <p className="mt-2 text-gray-300">
                  Mars in {planetaryPositions[4].sign} influences your physical energy, showing that you may have particular strength in your {planetaryPositions[4].sign === 'Aries' || planetaryPositions[4].sign === 'Scorpio' ? 'determination, endurance, and recovery power' : planetaryPositions[4].sign === 'Taurus' || planetaryPositions[4].sign === 'Capricorn' ? 'stamina, resistance, and practical health approaches' : 'nervous system, adaptability, and quick movements'}.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Spiritual Inclination</h3>
                <p className="text-gray-300">
                  The position of Ketu in your chart suggests a spiritual connection to {planetaryPositions[8].sign}, indicating that your soul's growth may come through {planetaryPositions[8].sign === 'Pisces' || planetaryPositions[8].sign === 'Cancer' ? 'emotional surrender, compassion, and intuitive wisdom' : planetaryPositions[8].sign === 'Sagittarius' || planetaryPositions[8].sign === 'Aquarius' ? 'philosophical understanding, universal truth, and humanitarian ideals' : 'discipline, detachment, and practical spiritual practice'}.
                </p>
                <p className="mt-2 text-gray-300">
                  The Moon in {planetaryPositions[1].sign} reveals your inner emotional landscape and spiritual needs, suggesting that your spiritual journey is nourished through {planetaryPositions[1].sign === 'Cancer' || planetaryPositions[1].sign === 'Pisces' ? 'devotion, emotional connection, and nurturing practices' : planetaryPositions[1].sign === 'Leo' || planetaryPositions[1].sign === 'Sagittarius' ? 'joyful expression, generous action, and faith' : 'disciplined meditation, intellectual understanding, and practical application'}.
                </p>
              </div>
            </div>
          </section>
          
          {/* Dosha Check & Remedies Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-cosmic-gold">
              🧿 Dosha Check & Remedies
            </h2>
            
            {doshas.length > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-300">
                  Your birth chart reveals the presence of the following doshas (planetary challenges) that may influence certain areas of your life:
                </p>
                
                {doshas.map((dosha, index) => (
                  <div key={index} className="cosmic-card p-4 bg-cosmic-deep-purple/30">
                    <h3 className="font-medium text-lg mb-1">{dosha.name}</h3>
                    <p className="text-gray-300 mb-2">{dosha.description}</p>
                    <div>
                      <span className="text-cosmic-gold font-medium">Recommended Remedy: </span>
                      <span className="text-gray-300">{dosha.remedy}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="cosmic-card p-4 bg-cosmic-deep-purple/30">
                <p className="text-gray-300">
                  Your birth chart does not show significant doshas. This indicates a harmonious planetary alignment without major challenging combinations. Continue to nurture your positive karma through good deeds and spiritual practices.
                </p>
              </div>
            )}
          </section>
          
          {/* Yogas Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-cosmic-gold">
              🔮 Notable Yogas in the Kundali
            </h2>
            
            <p className="mb-4 text-gray-300">
              Yogas are special planetary combinations that can bring positive energies and opportunities into your life. Your birth chart reveals the following auspicious yogas:
            </p>
            
            <div className="space-y-4">
              {yogas.map((yoga, index) => (
                <div key={index} className="cosmic-card p-4 bg-cosmic-deep-purple/30">
                  <h3 className="font-medium text-lg mb-1">{yoga.name}</h3>
                  <p className="text-gray-300">{yoga.description}</p>
                </div>
              ))}
            </div>
          </section>
          
          {/* Final Guidance Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-cosmic-gold">
              🕉️ Final Guidance from the Stars
            </h2>
            
            <p className="text-gray-300 mb-4">
              Based on your unique birth chart, the cosmic energies suggest focusing on developing your {ascendant === 'Aries' || ascendant === 'Leo' || ascendant === 'Sagittarius' ? 'creative leadership and confident self-expression' : ascendant === 'Taurus' || ascendant === 'Virgo' || ascendant === 'Capricorn' ? 'practical wisdom and disciplined approach to goals' : 'emotional intelligence and intuitive understanding'}.
            </p>
            
            <p className="text-gray-300 mb-4">
              The current planetary period (dasha) indicates a time of {planetaryPositions[0].house === 1 || planetaryPositions[0].house === 5 || planetaryPositions[0].house === 9 ? 'growth, expansion, and new beginnings' : planetaryPositions[0].house === 4 || planetaryPositions[0].house === 8 || planetaryPositions[0].house === 12 ? 'introspection, transformation, and spiritual development' : 'practical achievements, relationship building, and communication'}.
            </p>
            
            <div className="bg-cosmic-deep-purple/30 p-4 rounded-lg mt-6">
              <p className="italic text-center text-gray-300">
                "May your path be filled with light, balance, and divine insight. 🪔🕉️"
              </p>
            </div>
          </section>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 mt-10">
            <Button className="cosmic-button flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Download Full Analysis
            </Button>
            <Button variant="outline" className="border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold/10 flex items-center">
              <Share2 className="mr-2 h-4 w-4" />
              Share Your Kundali
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
