
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MoleBodyMap from '@/components/MoleBodyMap';
import MoleologyAnalysisResult from '@/components/MoleologyAnalysisResult';
import { 
  Gender, 
  BodyPart, 
  bodyPartsMale, 
  bodyPartsFemale, 
  MoleologyAnalysis, 
  defaultAnalysis,
  PredictionType,
  ancientScriptQuotes
} from '@/lib/moleology-data';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';

type FormValues = {
  predictionTypes: PredictionType[];
  partnerAnalysis: boolean;
};

const predictionOptions: { value: PredictionType; label: string }[] = [
  { value: 'general', label: 'General Personality' },
  { value: 'fortune', label: 'Wealth & Fortune' },
  { value: 'love', label: 'Love & Relationships' },
  { value: 'career', label: 'Career & Life Path' },
  { value: 'health', label: 'Health & Wellbeing' },
  { value: 'spiritual', label: 'Spiritual Inclination' },
];

const Moleology = () => {
  const [gender, setGender] = useState<Gender>('male');
  const [bodyParts, setBodyParts] = useState<BodyPart[]>(bodyPartsMale);
  const [selectedBodyPartIds, setSelectedBodyPartIds] = useState<string[]>([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState<BodyPart[]>([]);
  const [analysis, setAnalysis] = useState<MoleologyAnalysis>(defaultAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPartnerMode, setIsPartnerMode] = useState(false);
  const [partnerGender, setPartnerGender] = useState<Gender>('female');
  const [partnerBodyParts, setPartnerBodyParts] = useState<BodyPart[]>(bodyPartsFemale);
  const [selectedPartnerBodyPartIds, setSelectedPartnerBodyPartIds] = useState<string[]>([]);
  const [selectedPartnerBodyParts, setSelectedPartnerBodyParts] = useState<BodyPart[]>([]);
  
  const form = useForm<FormValues>({
    defaultValues: {
      predictionTypes: ['general', 'fortune', 'love'],
      partnerAnalysis: false,
    }
  });

  // Update body parts when gender changes
  useEffect(() => {
    setBodyParts(gender === 'male' ? bodyPartsMale : bodyPartsFemale);
  }, [gender]);

  useEffect(() => {
    setPartnerBodyParts(partnerGender === 'male' ? bodyPartsMale : bodyPartsFemale);
  }, [partnerGender]);

  // Update selected body parts when IDs or gender changes
  useEffect(() => {
    const parts = bodyParts.filter(part => selectedBodyPartIds.includes(part.id));
    setSelectedBodyParts(parts);
  }, [selectedBodyPartIds, bodyParts]);

  useEffect(() => {
    const parts = partnerBodyParts.filter(part => selectedPartnerBodyPartIds.includes(part.id));
    setSelectedPartnerBodyParts(parts);
  }, [selectedPartnerBodyPartIds, partnerBodyParts]);

  const toggleBodyPart = (partId: string) => {
    setSelectedBodyPartIds(prev => 
      prev.includes(partId)
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const togglePartnerBodyPart = (partId: string) => {
    setSelectedPartnerBodyPartIds(prev => 
      prev.includes(partId)
        ? prev.filter(id => id !== partId)
        : [...prev, partId]
    );
  };

  const handleChangeGender = (newGender: Gender) => {
    setGender(newGender);
    setSelectedBodyPartIds([]); // Reset selection when changing gender
  };

  const handleChangePartnerGender = (newGender: Gender) => {
    setPartnerGender(newGender);
    setSelectedPartnerBodyPartIds([]); // Reset selection when changing gender
  };

  const togglePartnerMode = () => {
    setIsPartnerMode(!isPartnerMode);
    if (!isPartnerMode) {
      form.setValue('partnerAnalysis', true);
    } else {
      form.setValue('partnerAnalysis', false);
      setSelectedPartnerBodyPartIds([]);
    }
  };

  // This function would normally call OpenAI API
  const generateAnalysis = async () => {
    if (selectedBodyParts.length === 0) {
      toast.error("Please select at least one mole location");
      return;
    }

    setIsAnalyzing(true);
    
    // Mock delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real implementation, this would call the OpenAI API
    const values = form.getValues();
    
    // Create a mock analysis based on selected body parts
    const personalityTraits = selectedBodyParts.map(part => {
      const trait = part.meanings.general.split(" ")[1];
      return trait.charAt(0).toUpperCase() + trait.slice(1);
    });

    // Select some quotes related to the selected body parts
    const relevantQuotes = ancientScriptQuotes
      .filter(quote => 
        selectedBodyParts.some(part => 
          quote.toLowerCase().includes(part.name.toLowerCase())
        )
      )
      .slice(0, 2);

    // Generate lifePathPrediction combining meanings from all selected parts
    const lifePathPrediction = `Your life path reveals ${selectedBodyParts.map(part => 
      part.meanings.general.toLowerCase()
    ).join(', and ')}. This suggests a journey of ${selectedBodyParts.map(part => 
      part.meanings.career.toLowerCase()
    ).join(' combined with ')}.`;

    // Generate compatibility analysis if in partner mode
    let relationshipCompatibility = undefined;
    if (isPartnerMode && selectedPartnerBodyParts.length > 0) {
      relationshipCompatibility = `The compatibility between you and your partner suggests ${
        Math.random() > 0.5 ? 'harmonious' : 'challenging but growth-oriented'
      } dynamics. Your ${selectedBodyParts[0]?.meanings.love.toLowerCase()} complements their ${
        selectedPartnerBodyParts[0]?.meanings.love.toLowerCase()
      }. Together, you may experience ${
        Math.random() > 0.5 ? 'profound connection' : 'transformative growth'
      } in your relationship.`;
    }

    const newAnalysis: MoleologyAnalysis = {
      overview: `Based on your mole pattern analysis, we observe that you possess ${
        selectedBodyParts.map(part => part.meanings.general.toLowerCase()).join(' and ')
      }. This unique configuration suggests a life path characterized by ${
        selectedBodyParts.length > 1 ? 'multifaceted talents' : 'specialized abilities'
      } and distinctive personal qualities.`,
      bodyParts: selectedBodyParts.map(part => ({
        part: part.name,
        interpretations: {
          general: part.meanings.general,
          fortune: part.meanings.fortune,
          love: part.meanings.love,
          career: part.meanings.career,
          health: part.meanings.health,
          spiritual: `Your spiritual journey is influenced by ${part.meanings.general.toLowerCase()}, leading to a path of ${
            Math.random() > 0.5 ? 'mindful awareness' : 'intuitive connection'
          }.`
        }
      })),
      scriptQuotes: relevantQuotes.length > 0 ? relevantQuotes : [
        "According to Samudrika Shastra, each mark upon the body reveals a chapter of one's destiny, written before birth."
      ],
      personalityTraits,
      lifePathPrediction,
      relationshipCompatibility
    };

    setAnalysis(newAnalysis);
    setIsAnalyzing(false);
    toast.success("Your moleology analysis is ready!");
  };

  return (
    <div className="min-h-screen bg-cosmic-midnight text-white">
      <Navbar />
      
      <main className="pt-20 pb-16"> {/* Add padding-top to account for fixed navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-8 md:py-12 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-glow">
              <span className="text-white">Moleology</span>{" "}
              <span className="text-cosmic-gold">AI</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover what your moles reveal about your personality, life path, and relationships based on ancient Indian wisdom, enhanced by AI analysis.
            </p>
          </section>

          {/* Form Section */}
          <section className="mb-16">
            <Form {...form}>
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-cosmic-midnight/60 backdrop-blur-sm rounded-lg border border-cosmic-bright-purple/20 p-6">
                      <h2 className="text-xl font-semibold text-cosmic-gold mb-4">
                        Your Analysis Settings
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name="predictionTypes"
                            render={() => (
                              <FormItem>
                                <div className="flex justify-between items-center">
                                  <FormLabel className="text-base">Prediction Types</FormLabel>
                                  <HoverCard>
                                    <HoverCardTrigger asChild>
                                      <Button variant="ghost" size="sm" className="p-0 h-auto">
                                        <Info className="h-4 w-4 text-cosmic-bright-purple" />
                                      </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="bg-cosmic-deep-purple/95 text-white border-cosmic-bright-purple/20">
                                      Select the types of predictions you'd like to receive in your analysis
                                    </HoverCardContent>
                                  </HoverCard>
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {predictionOptions.map((option) => (
                                    <FormField
                                      key={option.value}
                                      control={form.control}
                                      name="predictionTypes"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={option.value}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(option.value)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, option.value])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== option.value
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal text-gray-300 cursor-pointer">
                                              {option.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="partnerAnalysis"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    setIsPartnerMode(!!checked);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-gray-300">
                                  Include relationship compatibility analysis
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    {isPartnerMode && (
                      <MoleBodyMap
                        gender={partnerGender}
                        bodyParts={partnerBodyParts}
                        selectedParts={selectedPartnerBodyPartIds}
                        onToggleBodyPart={togglePartnerBodyPart}
                        onChangeGender={handleChangePartnerGender}
                      />
                    )}
                  </div>

                  <MoleBodyMap
                    gender={gender}
                    bodyParts={bodyParts}
                    selectedParts={selectedBodyPartIds}
                    onToggleBodyPart={toggleBodyPart}
                    onChangeGender={handleChangeGender}
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    type="button"
                    className="cosmic-button text-lg px-8 py-6 h-auto"
                    onClick={generateAnalysis}
                    disabled={isAnalyzing || selectedBodyPartIds.length === 0}
                  >
                    {isAnalyzing ? "Analyzing..." : "Generate Moleology Analysis"}
                  </Button>
                </div>
              </form>
            </Form>
          </section>

          {/* Results Section */}
          <section>
            <MoleologyAnalysisResult 
              analysis={analysis}
              selectedBodyParts={selectedBodyParts}
            />
          </section>
          
          {/* Info Section */}
          <section className="py-16">
            <div className="bg-cosmic-deep-purple/30 backdrop-blur-sm rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-cosmic-gold mb-6">About Moleology</h2>
              <p className="text-gray-300 max-w-3xl mx-auto mb-8">
                Moleology, also known as Moleosophy or Samudrika Shastra in ancient Indian texts, 
                is the study of moles, marks, and physical traits on the body and their supposed 
                influence on one's character, future, and destiny. This practice dates back thousands 
                of years and combines elements of astrology, physiology, and spiritual beliefs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-cosmic-midnight/60 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-cosmic-bright-purple mb-3">Ancient Origins</h3>
                  <p className="text-gray-300 text-sm">
                    Originated in ancient India as part of Samudrika Shastra, a system of bodily analysis 
                    mentioned in classic texts like the Brihat Samhita and various Puranas.
                  </p>
                </div>
                <div className="bg-cosmic-midnight/60 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-cosmic-bright-purple mb-3">Scientific Perspective</h3>
                  <p className="text-gray-300 text-sm">
                    While modern science views moles as collections of pigmented cells, ancient traditions 
                    believe their placement corresponds to planetary influences and life outcomes.
                  </p>
                </div>
                <div className="bg-cosmic-midnight/60 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-cosmic-bright-purple mb-3">Our Approach</h3>
                  <p className="text-gray-300 text-sm">
                    We combine traditional moleology wisdom with modern AI to provide a nuanced 
                    interpretation that honors ancient knowledge while offering practical insights.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Moleology;
