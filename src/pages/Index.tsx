
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import TestimonialSection from '@/components/TestimonialSection';
import AIChatBox from '@/components/AIChatBox';
import { Button } from '@/components/ui/button';

const Index = () => {
  const categories = [
    {
      title: "Astrology AI",
      description: "AI-powered birth chart analysis, predictions and remedies based on Vedic Astrology.",
      icon: "🔮",
      to: "/astrology",
      gradientClass: "from-indigo-600 to-purple-600"
    },
    {
      title: "Palmistry AI",
      description: "Upload your palm image and receive detailed AI analysis of your life, health, and fortune lines.",
      icon: "✋",
      to: "/palmistry",
      gradientClass: "from-pink-600 to-rose-600"
    },
    {
      title: "Moleology AI",
      description: "Discover what your moles and birthmarks mean according to ancient Indian knowledge.",
      icon: "⚫",
      to: "/moleology",
      gradientClass: "from-amber-600 to-orange-600"
    },
    {
      title: "Zodiac Personality",
      description: "Detailed personality analysis and compatibility matching based on your zodiac sign.",
      icon: "⭐",
      to: "/zodiac",
      gradientClass: "from-sky-600 to-blue-600"
    },
    {
      title: "Kamasutra Insights",
      description: "AI-driven relationship and intimacy guidance based on ancient Indian wisdom.",
      icon: "❤️",
      to: "/kamasutra",
      gradientClass: "from-red-600 to-rose-600"
    },
    {
      title: "Ancient Wisdom",
      description: "Explore AI-generated insights from Vedas, Upanishads, and other ancient Indian texts.",
      icon: "📜",
      to: "/ancient-wisdom",
      gradientClass: "from-emerald-600 to-teal-600"
    },
  ];

  return (
    <div className="min-h-screen bg-cosmic-midnight text-white">
      <Navbar />
      
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <HeroSection />
        
        {/* Categories Section */}
        <section className="py-16 bg-cosmic-midnight/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-glow">
              <span className="text-white">Explore Cosmic</span>{" "}
              <span className="text-cosmic-gold">Categories</span>
            </h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
              Discover the different dimensions of ancient Indian wisdom, powered by cutting-edge AI technology for insights into your past, present, and future.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <CategoryCard
                  key={category.title}
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  to={category.to}
                  gradientClass={category.gradientClass}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Chat with AI Section */}
        <section className="py-16 bg-gradient-to-b from-cosmic-midnight to-cosmic-deep-purple/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-glow">
              <span className="text-white">Ask</span>{" "}
              <span className="text-cosmic-gold">Guru AI</span>
            </h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
              Seek guidance from our Cosmic Guru AI, powered by the wisdom of ancient Indian texts and modern machine learning.
            </p>
            
            <AIChatBox />
            
            <div className="text-center mt-12">
              <Link to="/chat">
                <Button className="cosmic-button">
                  Continue Conversation with Guru AI
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        <TestimonialSection />
        
        {/* CTA Section */}
        <section className="py-16 bg-cosmic-deep-purple relative overflow-hidden">
          <div className="absolute inset-0 star-field opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-cosmic-midnight/80 backdrop-blur-sm border border-cosmic-bright-purple/20 rounded-lg p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-glow">
                <span className="text-white">Begin Your</span>{" "}
                <span className="text-cosmic-gold">Cosmic Journey</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto">
                Unlock premium cosmic insights and personalized guidance with our subscription plans. Start your spiritual journey today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Button className="cosmic-button h-12 px-8 text-lg">
                  Sign Up Now
                </Button>
                <Link to="/pricing">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-6">
                    View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
