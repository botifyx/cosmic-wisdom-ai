
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Hand } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import PalmReadingResult from '@/components/PalmReadingResult';

const Palmistry = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reading, setReading] = useState<any>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePalm = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Here we'll make the API call to OpenAI for palm reading
      // For now, just showing a placeholder response
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      setReading({
        heartLine: "Your heart line indicates strong emotional intelligence",
        headLine: "Your head line shows creative thinking abilities",
        lifeLine: "Your life line suggests good vitality and energy",
        fateLine: "A prominent fate line indicates a clear career path"
      });
      
      toast({
        title: "Analysis Complete",
        description: "Your palm reading is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze palm image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-midnight text-white">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-cosmic-gold">AI Palm Reading</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Upload a clear photo of your palm to receive personalized insights based on ancient palmistry wisdom enhanced by AI.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-cosmic-deep-purple/20 backdrop-blur-sm rounded-lg p-8 mb-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="mb-4">
                    <Hand className="w-12 h-12 text-cosmic-gold mx-auto mb-2" />
                    <Label htmlFor="palm-image" className="text-lg text-cosmic-bright-purple">
                      Upload Your Palm Image
                    </Label>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <Input
                      id="palm-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById('palm-image')?.click()}
                      className="cosmic-button"
                    >
                      <Upload className="mr-2" />
                      Select Image
                    </Button>
                  </div>
                </div>

                {selectedImage && (
                  <div className="mt-6 text-center">
                    <div className="relative w-64 h-64 mx-auto mb-4">
                      <img
                        src={selectedImage}
                        alt="Uploaded palm"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <Button
                      onClick={analyzePalm}
                      disabled={isAnalyzing}
                      className="cosmic-button"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Palm"}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {reading && <PalmReadingResult reading={reading} />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Palmistry;
