
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
import ZodiacCompatibilityResult from '@/components/ZodiacCompatibilityResult';
import { toast } from 'sonner';
import { zodiacSigns, CompatibilityResult } from '@/lib/zodiac-data';

type FormValues = {
  signA: string;
  signB: string;
};

const Zodiac = () => {
  const [loading, setLoading] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);

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
      // In production, this would make a call to an API endpoint
      const mockResult = getMockCompatibilityResult(data.signA, data.signB);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCompatibilityResult(mockResult);
      toast.success("Compatibility analysis complete!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
            <span className="text-white">Zodiac</span>{" "}
            <span className="text-cosmic-gold">Compatibility</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Discover the cosmic connection between two zodiac signs. Our AI analyzes personality traits
            and provides detailed compatibility insights for love, communication, and long-term harmony.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-cosmic-midnight/90 border-cosmic-bright-purple/30 shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-cosmic-gold mb-2">Select Zodiac Signs</h2>
                <p className="text-gray-400">Choose two zodiac signs to analyze their compatibility.</p>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="signA"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-200">First Zodiac Sign</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-muted/20 border-cosmic-bright-purple/20">
                                <SelectValue placeholder="Select first zodiac sign" />
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
                          <FormLabel className="text-gray-200">Second Zodiac Sign</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-muted/20 border-cosmic-bright-purple/20">
                                <SelectValue placeholder="Select second zodiac sign" />
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
                      {loading ? "Analyzing Cosmic Connection..." : "Analyze Compatibility"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <div className="hidden lg:flex items-center justify-center">
            <div className="cosmic-chart relative w-80 h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full border-2 border-cosmic-bright-purple/30 star-field"></div>
              <div className="absolute inset-4 rounded-full border border-cosmic-gold/30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-cosmic-gold text-6xl">⭐</div>
              </div>
              {/* Zodiac symbols positioned in a circle */}
              {zodiacSigns.map((sign, index) => {
                const angle = (index * 30) * (Math.PI / 180);
                const radius = 42; // % of container
                const x = 50 + radius * Math.cos(angle - Math.PI/2);
                const y = 50 + radius * Math.sin(angle - Math.PI/2);
                
                return (
                  <div 
                    key={sign.name}
                    className="absolute text-2xl transform -translate-x-1/2 -translate-y-1/2"
                    style={{ 
                      left: `${x}%`, 
                      top: `${y}%`,
                    }}
                  >
                    {sign.emoji}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {compatibilityResult && (
          <ZodiacCompatibilityResult result={compatibilityResult} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

// Mock function to generate results until OpenAI integration is complete
function getMockCompatibilityResult(signA: string, signB: string): CompatibilityResult {
  return {
    signA: {
      name: signA,
      emoji: zodiacSigns.find(sign => sign.name === signA)?.emoji || "⭐",
      personality: `${signA} individuals are known for their unique blend of traits that make them stand out in the zodiac. They possess natural charm and depth that draws others to them.`
    },
    signB: {
      name: signB,
      emoji: zodiacSigns.find(sign => sign.name === signB)?.emoji || "⭐",
      personality: `${signB} personalities are characterized by their distinctive approach to life. They bring special qualities to relationships that create memorable connections.`
    },
    compatibility: {
      overview: `The ${signA}-${signB} combination creates an interesting dynamic with both challenges and harmonious elements. Their energies interact in ways that can lead to growth and understanding.`,
      strengths: [
        "Natural communication flow",
        "Complementary emotional styles",
        "Shared values in important areas"
      ],
      weaknesses: [
        "Potential misunderstandings in stress",
        "Different approaches to problem-solving",
        "May need to balance independence vs. togetherness"
      ],
      loveScore: 75,
      recommendation: `This pairing has significant potential with mindful attention to communication and respecting differences. By focusing on the natural strengths of this combination, a lasting and fulfilling relationship is certainly possible.`
    }
  };
}

export default Zodiac;
