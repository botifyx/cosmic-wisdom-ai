
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon, MapPin, Clock, Download, Share2, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Astrology = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      toast({
        title: "Missing information",
        description: "Please fill in all the fields to generate your astrological chart.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasResults(true);
      toast({
        title: "Cosmic analysis complete",
        description: "Your astrological chart has been generated successfully.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-cosmic-midnight text-white flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-cosmic-midnight">
            <div className="star-field absolute inset-0"></div>
            <div className="absolute inset-0 bg-cosmic-radial opacity-30"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              <span className="text-white">AI-Powered</span>{" "}
              <span className="text-cosmic-gold">Vedic Astrology</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover your cosmic blueprint with our advanced AI astrology system. Combining ancient Vedic wisdom with modern technology.
            </p>
          </div>
        </section>
        
        {/* Input Form Section */}
        <section className="py-12 bg-cosmic-deep-purple/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="cosmic-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Generate Your Astrology Chart</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="cosmic-input w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium mb-2">
                      Birth Date
                    </label>
                    <div className="relative">
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="cosmic-input w-full"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="birthTime" className="block text-sm font-medium mb-2">
                      Birth Time
                    </label>
                    <div className="relative">
                      <Input
                        id="birthTime"
                        name="birthTime"
                        type="time"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="cosmic-input w-full"
                      />
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="birthPlace" className="block text-sm font-medium mb-2">
                    Birth Place
                  </label>
                  <div className="relative">
                    <Input
                      id="birthPlace"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className="cosmic-input w-full"
                    />
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="cosmic-button w-full h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Consulting the Stars...
                      </>
                    ) : (
                      "Generate Astrology Chart"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
        
        {/* Results Section - Conditionally rendered */}
        {hasResults && (
          <section className="py-16 bg-cosmic-midnight">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center text-glow">
                <span className="text-white">Your Cosmic</span>{" "}
                <span className="text-cosmic-gold">Blueprint</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="cosmic-card p-6">
                  <h3 className="text-xl font-medium mb-4 text-center">Planetary Positions</h3>
                  <ul className="space-y-3">
                    <PlanetItem planet="Sun" sign="Leo" degree="15°" />
                    <PlanetItem planet="Moon" sign="Cancer" degree="22°" />
                    <PlanetItem planet="Mercury" sign="Virgo" degree="8°" />
                    <PlanetItem planet="Venus" sign="Libra" degree="3°" />
                    <PlanetItem planet="Mars" sign="Aries" degree="27°" />
                    <PlanetItem planet="Jupiter" sign="Sagittarius" degree="11°" />
                    <PlanetItem planet="Saturn" sign="Capricorn" degree="19°" />
                  </ul>
                </div>
                
                <div className="cosmic-card p-6">
                  <h3 className="text-xl font-medium mb-4 text-center">Dasha Periods</h3>
                  <ul className="space-y-3">
                    <DashaItem period="Saturn Mahadasha" dates="2020 - 2039" active={true} />
                    <DashaItem period="Mercury Antardasha" dates="2023 - 2026" active={true} />
                    <DashaItem period="Ketu Pratyantar" dates="Oct 2023 - Dec 2023" active={false} />
                    <DashaItem period="Venus Pratyantar" dates="Jan 2024 - June 2024" active={false} />
                    <DashaItem period="Sun Pratyantar" dates="June 2024 - Aug 2024" active={false} />
                    <DashaItem period="Moon Pratyantar" dates="Aug 2024 - Nov 2024" active={false} />
                  </ul>
                </div>
                
                <div className="cosmic-card p-6">
                  <h3 className="text-xl font-medium mb-4 text-center">House Influences</h3>
                  <ul className="space-y-3">
                    <HouseItem house="1st House (Self)" planets="Moon" influence="Strong" />
                    <HouseItem house="4th House (Home)" planets="Jupiter" influence="Moderate" />
                    <HouseItem house="7th House (Partnership)" planets="Venus" influence="Very Strong" />
                    <HouseItem house="10th House (Career)" planets="Sun, Mercury" influence="Strong" />
                    <HouseItem house="12th House (Spirituality)" planets="Saturn" influence="Moderate" />
                  </ul>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="cosmic-card p-6">
                  <h3 className="text-xl font-medium mb-4">Cosmic Insights</h3>
                  <p className="text-gray-300 mb-3">
                    Your chart shows a strong alignment between your moon and ascendant, indicating a harmonious connection between your emotions and outward personality.
                  </p>
                  <p className="text-gray-300 mb-3">
                    The Saturn Mahadasha period you're currently in is focused on discipline, responsibility, and long-term growth. This is a time of building foundations.
                  </p>
                  <p className="text-gray-300">
                    Venus in the 7th house suggests favorable conditions for relationships and partnerships. This is amplified by Jupiter's aspect, indicating potential for growth through connections with others.
                  </p>
                </div>
                
                <div className="cosmic-card p-6">
                  <h3 className="text-xl font-medium mb-4">Remedies & Recommendations</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 bg-cosmic-gold rounded-full p-1 text-cosmic-midnight">
                        <Star className="h-4 w-4" />
                      </div>
                      <span className="text-gray-300">
                        Wear a yellow sapphire (Pukhraj) on the index finger of your right hand on Thursday morning during Shukla Paksha.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 bg-cosmic-gold rounded-full p-1 text-cosmic-midnight">
                        <Star className="h-4 w-4" />
                      </div>
                      <span className="text-gray-300">
                        Recite the Shani Chalisa every Saturday to mitigate the challenging aspects of your Saturn dasha.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="mt-1 mr-3 bg-cosmic-gold rounded-full p-1 text-cosmic-midnight">
                        <Star className="h-4 w-4" />
                      </div>
                      <span className="text-gray-300">
                        Practice meditation focused on the root chakra to strengthen your connection to stability and security.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Button className="cosmic-button flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="border-cosmic-gold text-cosmic-gold hover:bg-cosmic-gold/10 flex items-center">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Your Chart
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-cosmic-midnight to-cosmic-deep-purple/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-12 text-center text-glow">
              <span className="text-white">Featured</span>{" "}
              <span className="text-cosmic-gold">Astrology Services</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Janam Kundali Analysis"
                description="Comprehensive birth chart analysis using traditional Vedic methodologies enhanced by AI precision."
                icon="🌟"
              />
              <FeatureCard
                title="Career & Finance Predictions"
                description="Detailed insights into your professional path and financial future based on planetary positions."
                icon="💼"
              />
              <FeatureCard
                title="Relationship Compatibility"
                description="Analyze your relationship dynamics with detailed Vedic compatibility metrics and insights."
                icon="❤️"
              />
              <FeatureCard
                title="Yearly Predictions"
                description="Detailed forecast for the coming year with month-by-month breakdown of planetary influences."
                icon="📅"
              />
              <FeatureCard
                title="Gem & Yantra Recommendations"
                description="Personalized remedies including gemstones, yantras, and mantras to balance planetary energies."
                icon="💎"
              />
              <FeatureCard
                title="Muhurta Selection"
                description="Find the most auspicious time for important events like marriage, business launch, or travel."
                icon="⏰"
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper components
const PlanetItem = ({ planet, sign, degree }: { planet: string; sign: string; degree: string }) => (
  <li className="flex justify-between items-center">
    <span className="font-medium">{planet}</span>
    <span className="text-cosmic-gold">
      {sign} {degree}
    </span>
  </li>
);

const DashaItem = ({ period, dates, active }: { period: string; dates: string; active: boolean }) => (
  <li className="flex justify-between items-center">
    <span className={`font-medium ${active ? "text-cosmic-gold" : ""}`}>{period}</span>
    <span className={active ? "text-cosmic-gold" : "text-gray-400"}>{dates}</span>
  </li>
);

const HouseItem = ({ house, planets, influence }: { house: string; planets: string; influence: string }) => (
  <li className="flex justify-between items-center">
    <span className="font-medium">{house}</span>
    <div className="text-right">
      <span className="text-cosmic-gold block">{planets}</span>
      <span className="text-gray-400 text-sm">{influence}</span>
    </div>
  </li>
);

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="cosmic-card p-6 flex flex-col h-full">
    <div className="text-4xl mb-4 text-cosmic-gold">{icon}</div>
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <p className="text-gray-400 flex-grow">{description}</p>
    <Button variant="link" className="text-cosmic-gold p-0 mt-4 self-start">
      Learn more
    </Button>
  </div>
);

export default Astrology;
