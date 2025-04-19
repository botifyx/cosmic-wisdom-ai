
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { zodiacSigns } from '@/lib/zodiac-data';
import KamasutraCompatibilityResult from '@/components/KamasutraCompatibilityResult';
import KamasutraAIChat from '@/components/KamasutraAIChat';

type FormValues = {
  signA: string;
  signB: string;
};

const Kamasutra = () => {
  const [loading, setLoading] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("compatibility");

  const form = useForm<FormValues>({
    defaultValues: {
      signA: '',
      signB: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // This is a mock implementation until OpenAI integration is complete
      const mockResult = getMockCompatibilityResult(data.signA, data.signB);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCompatibilityResult(mockResult);
      toast.success("Sacred compatibility analysis complete!");
    } catch (error) {
      toast.error("The cosmic energies are disturbed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-midnight text-white">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-glow">
            <span className="text-white">Kamasutra</span>{" "}
            <span className="text-cosmic-gold">Insights</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Ancient wisdom for spiritual connection and sacred union. Discover the depths of 
            compatibility through the lens of Vedic knowledge, astrology, and the teachings of Kamasutra.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList className="bg-cosmic-midnight/80 border border-cosmic-bright-purple/30">
              <TabsTrigger value="compatibility" className="data-[state=active]:bg-cosmic-deep-purple/40 data-[state=active]:text-cosmic-gold">
                🔮 Zodiac Match
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-cosmic-deep-purple/40 data-[state=active]:text-cosmic-gold">
                💑 Sacred Wisdom
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="compatibility" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-cosmic-midnight/90 border-cosmic-bright-purple/30 shadow-lg">
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-cosmic-gold mb-2">Spiritual Compatibility</h2>
                    <p className="text-gray-400">Discover the sacred union between two souls through their zodiac signs.</p>
                  </div>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="signA"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Your Zodiac Sign</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-muted/20 border-cosmic-bright-purple/20">
                                    <SelectValue placeholder="Select your zodiac sign" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {zodiacSigns.map((sign) => (
                                    <SelectItem key={sign.name} value={sign.name}>
                                      {sign.emoji} {sign.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="signB"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Partner's Zodiac Sign</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-muted/20 border-cosmic-bright-purple/20">
                                    <SelectValue placeholder="Select partner's zodiac sign" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {zodiacSigns.map((sign) => (
                                    <SelectItem key={sign.name} value={sign.name}>
                                      {sign.emoji} {sign.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="text-center">
                        <Button 
                          type="submit" 
                          className="cosmic-button w-full sm:w-auto" 
                          disabled={loading}
                        >
                          {loading ? "Analyzing Sacred Connection..." : "Explore Compatibility"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 rounded-full border-2 border-cosmic-bright-purple/30 star-field"></div>
                  <div className="absolute inset-4 rounded-full border border-cosmic-gold/30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-cosmic-gold text-6xl">❤️</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 opacity-20 bg-cosmic-bright-purple rounded-full blur-xl animate-pulse"></div>
                  </div>
                  {/* Stylized lotus petals positioned around the circle */}
                  {Array.from({ length: 8 }).map((_, index) => {
                    const angle = (index * 45) * (Math.PI / 180);
                    const radius = 44; // % of container
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    
                    return (
                      <div 
                        key={index}
                        className="absolute w-6 h-12 bg-cosmic-bright-purple/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                        style={{ 
                          left: `${x}%`, 
                          top: `${y}%`,
                          transform: `translate(-50%, -50%) rotate(${angle * (180/Math.PI)}deg)`,
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="mt-6">
            <KamasutraAIChat />
          </TabsContent>
        </Tabs>
        
        {compatibilityResult && activeTab === "compatibility" && (
          <KamasutraCompatibilityResult result={compatibilityResult} />
        )}
        
        <div className="mt-12 bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg p-6 border border-cosmic-bright-purple/20">
          <h2 className="text-2xl font-semibold text-cosmic-gold mb-4">Sacred Knowledge</h2>
          <p className="text-gray-200 mb-6">
            The Kamasutra, composed by sage Vatsyayana between 400 BCE and 200 CE, is a profound exploration 
            of human connection. Beyond commonly misunderstood aspects, it offers wisdom on:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-cosmic-deep-purple/20 p-4 rounded-lg border border-cosmic-bright-purple/10">
              <h3 className="text-cosmic-gold text-lg mb-2">Sacred Union</h3>
              <p className="text-gray-300 text-sm">The spiritual joining of two souls through mutual respect, understanding, and devotion.</p>
            </div>
            <div className="bg-cosmic-deep-purple/20 p-4 rounded-lg border border-cosmic-bright-purple/10">
              <h3 className="text-cosmic-gold text-lg mb-2">Emotional Connection</h3>
              <p className="text-gray-300 text-sm">Building deep bonds through shared experiences, communication, and mindful presence.</p>
            </div>
            <div className="bg-cosmic-deep-purple/20 p-4 rounded-lg border border-cosmic-bright-purple/10">
              <h3 className="text-cosmic-gold text-lg mb-2">Energy Harmony</h3>
              <p className="text-gray-300 text-sm">Balancing masculine and feminine energies to achieve perfect spiritual alignment.</p>
            </div>
            <div className="bg-cosmic-deep-purple/20 p-4 rounded-lg border border-cosmic-bright-purple/10">
              <h3 className="text-cosmic-gold text-lg mb-2">Divine Partnership</h3>
              <p className="text-gray-300 text-sm">Treating relationships as sacred pathways to spiritual growth and self-discovery.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Mock function to generate results until OpenAI integration is complete
function getMockCompatibilityResult(signA: string, signB: string): any {
  return {
    signA: {
      name: signA,
      emoji: zodiacSigns.find(sign => sign.name === signA)?.emoji || "⭐",
      element: zodiacSigns.find(sign => sign.name === signA)?.element || "Unknown",
      personality: `${signA} souls carry a unique energy signature - a blend of ${zodiacSigns.find(sign => sign.name === signA)?.element || "elemental"} essence that influences their approach to connection and intimacy.`
    },
    signB: {
      name: signB,
      emoji: zodiacSigns.find(sign => sign.name === signB)?.emoji || "⭐",
      element: zodiacSigns.find(sign => sign.name === signB)?.element || "Unknown",
      personality: `${signB} beings embody the qualities of ${zodiacSigns.find(sign => sign.name === signB)?.element || "elemental"} energy, bringing their distinctive spiritual signature to relationships and sacred unions.`
    },
    compatibility: {
      overview: `The sacred union between ${signA} and ${signB} creates a unique energetic dance. Your souls connect in ways that honor both tradition and spiritual exploration.`,
      intimacyStyle: "Your connection is characterized by a beautiful balance of passion and tenderness, creating space for both physical and emotional exploration.",
      spiritualBond: "The ancient texts suggest your union has potential for profound spiritual growth through mutual respect and understanding.",
      strengths: [
        "Natural energetic alignment",
        "Complementary emotional expression",
        "Potential for spiritual growth together"
      ],
      challenges: [
        "Different approaches to expressing desire",
        "Varying needs for emotional intimacy",
        "Balancing individual spiritual paths"
      ],
      harmonyScore: 78,
      kamasutraGuidance: [
        "Practice mindful presence during intimate moments",
        "Explore communication through gentle touch and eye contact",
        "Honor each other's boundaries as sacred spaces",
        "Cultivate gratitude for the divine in your partner"
      ],
      recommendation: `The ancient wisdom suggests that ${signA} and ${signB} can create a deeply fulfilling sacred bond by honoring each other's elemental nature. Through patience, understanding, and mindful presence, you can experience the transcendent connection described in the classical texts.`
    }
  };
}

export default Kamasutra;
