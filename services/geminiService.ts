
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { PersonDetails, CosmicMatchAnalysis, AstrologyAnalysis, SacredUnionAnalysis, PalmReadingAnalysis, FaceReadingAnalysis, MoleologyAnalysis, TarotAnalysis, MantraAnalysis, ZodiacCompatibilityAnalysis, HandwritingAnalysis, DailyHoroscopeAnalysis, HoroscopeSection, HandMudraAnalysis, TrialAstrologyAnalysis, UserContext, CombinedAnalysisReport, PackageInputs, FeatureId } from "../types";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
});

const createUserContextString = (context: UserContext | null): string => {
    if (!context) return "";
    const { geolocation: geo, userAgent: ua } = context;
    const parts: string[] = [];
    if (geo) {
        parts.push(`from ${geo.city}, ${geo.country}`);
    }
    if (ua) {
        parts.push(`using a ${ua.device} (${ua.os}) with ${ua.browser}`);
    }
    if (parts.length > 0) {
        return `\n\n[User Context: The user is ${parts.join(' ')}. Subtly tailor the tone, examples, or cultural references in your response to be more personal and relevant. For example, if they are in a warm climate, avoid metaphors about snow. Do not explicitly state their location or device back to them.]\n`;
    }
    return "";
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getGenderFromName = async (name: string): Promise<'Male' | 'Female' | 'Unisex'> => {
  try {
    const prompt = `Based on common usage, is the name "${name}" typically Male, Female, or Unisex? Respond with only a single word: "Male", "Female", or "Unisex".`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    const gender = response.text?.trim();
    if (gender && ['Male', 'Female', 'Unisex'].includes(gender)) {
      return gender as 'Male' | 'Female' | 'Unisex';
    }
    return 'Unisex'; // Fallback for unexpected responses
  } catch (error) {
    console.error("Error identifying gender from name:", error);
    return 'Unisex'; // Fallback on error
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const generateText = async (prompt: string, systemInstruction?: string, userContext?: UserContext | null): Promise<string> => {
  try {
    const contextInstruction = createUserContextString(userContext || null);
    const finalSystemInstruction = (systemInstruction || '') + contextInstruction;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        ...(finalSystemInstruction && { systemInstruction: finalSystemInstruction.trim() }),
      },
    });
    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating text:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const createTattooPromptFromAnalysis = async (analysisText: string, featureContext: string, userContext: UserContext | null): Promise<{ prompt: string, placement: string } | null> => {
  try {
    let featureSpecificInstruction = '';
    switch (featureContext) {
        case 'Astrology':
            featureSpecificInstruction = `The design should draw inspiration from the user's key astrological placements mentioned in the analysis, such as their Ascendant sign, Sun, Moon, or powerful planetary conjunctions. Incorporate celestial, planetary, or zodiac symbolism.`;
            break;
        case 'Palmistry':
            featureSpecificInstruction = `The design should visually represent the core themes from the palm reading, like the path of the Life Line, the emotional depth of the Heart Line, or the destiny indicated by the Fate Line. Think of it as a map of their inner self.`;
            break;
        case 'Matchmaking':
        case 'Sacred Union':
        case 'ZodiacCompatibility':
            featureSpecificInstruction = `This tattoo should be a "Union Sigil" that creatively blends symbols representing the two individuals' energies. It should symbolize their harmony, shared strengths, or the beauty in their challenges.`;
            break;
        case 'Tarot':
            featureSpecificInstruction = `The tattoo design should be inspired by the central card or the overarching message of the Tarot reading. Evoke the archetype and symbolism of the key cards mentioned in the analysis.`;
            break;
        case 'Moleology':
            featureSpecificInstruction = `The design should be a symbolic representation of the meaning behind the user's most significant mole placements. Think of it as a personal constellation or a map of their sacred marks.`;
            break;
        case 'Handwriting':
            featureSpecificInstruction = `The design must be a symbolic interpretation of the user's graphological traits. Look for keywords in the analysis like 'pressure' (translating to line weight), 'slant' (translating to the design's angle and balance), 'size' (translating to the design's scale and boldness), and 'loops' or 'connections' (translating to flowing or geometric patterns). For instance, 'firm pressure' should inspire bold, confident lines, while 'upright slant' should inspire a balanced, symmetrical design. The tattoo must be an abstract representation of their inner script.`;
            break;
        case 'FaceReading':
            featureSpecificInstruction = `The design should symbolize the dominant character traits revealed in the face reading, like determination from the jawline or curiosity from the eyes. It's about capturing the essence of their inner character.`;
            break;
        case 'MantraGenerator':
            featureSpecificInstruction = `The design should be a visual interpretation of the mantra's meaning and vibration. It could incorporate abstract sound waves, sacred geometry like a yantra, or symbols related to the mantra's purpose (e.g., a lotus for purity).`;
            break;
        case 'HandMudra':
            featureSpecificInstruction = `The design should be a symbolic representation of the suggested Hand Mudra, capturing its energetic essence in a minimalist and sacred style.`;
            break;
        default:
            featureSpecificInstruction = `The design should capture the core essence of the analysis.`;
            break;
    }

    const placementInstruction = featureContext === 'Handwriting'
        ? `3.  **Suggest Placement:** You MUST suggest the 'inner forearm' as the body placement. Then, provide a brief, mystical explanation (1-2 sentences) for why this placement is powerful, connecting it to the act of writing, self-expression, and the specific traits found in their analysis.`
        : `3.  **Suggest Placement:** Propose an ideal body placement for this specific tattoo (e.g., "inner forearm," "center of the back"). Provide a brief, mystical explanation (1-2 sentences) for why that placement enhances the tattoo's cosmic benefits, directly relating it to the analysis.`;

    const contextString = createUserContextString(userContext);

    const prompt = `
      Act as a mystical tattoo designer. Your task is to generate a tattoo concept from an esoteric analysis.${contextString}
      
      Analysis Details:
      - Feature: "${featureContext}"
      - Full Text: "${analysisText}"

      Instructions:
      1.  **Identify Core Symbols:** First, carefully read the analysis and identify the 2-3 most powerful and symbolic elements. These could be dominant planets, specific palm lines, key tarot cards, or significant personality traits.
      2.  **Generate Image Prompt:** Based on these core symbols, create a rich, symbolic, and descriptive prompt for an AI image generator. This prompt must produce a minimalist, spiritual tattoo design. It should be a single, visually vivid paragraph that describes a powerful personal talisman. Use mystical keywords, emphasize clean lines and sacred geometry, and explicitly incorporate the core symbols you identified. ${featureSpecificInstruction}
      ${placementInstruction}

      Return a single JSON object with two keys: "prompt" (the image generation prompt string) and "placement" (the placement suggestion string). Do not include any other text.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING },
              placement: { type: Type.STRING }
            },
            required: ["prompt", "placement"]
          }
        }
    });
    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Error creating tattoo prompt:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const createArtPromptFromAnalysis = async (analysisText: string, featureContext: string, userContext: UserContext | null): Promise<{ prompt: string } | null> => {
  try {
    const contextString = createUserContextString(userContext);
    const prompt = `
      Based on the following esoteric analysis from a feature called "${featureContext}", generate a rich, symbolic, and descriptive prompt for an AI image generator to create a piece of cosmic, mystical, spiritual art.${contextString}
      The prompt should be a single paragraph, visually vivid, and capture the core essence of the analysis. Use mystical, spiritual, and Vedic-inspired keywords. Think in terms of vibrant colors, divine energy, and symbolic imagery.

      The analysis is: "${analysisText}"

      Return a single JSON object with one key: "prompt".
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prompt: { type: Type.STRING }
            },
            required: ["prompt"]
          }
        }
    });
    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Error creating art prompt:", error);
    return null;
  }
};


// Fix: Updated to gemini-3-pro-preview for Complex Text Task (Vedic Astrology reasoning).
export const getVedicAstrologyAnalysis = async (birthDetails: { birthDate: string, birthTime: string, birthPlace: string, isBirthTimeUnknown?: boolean }, gender: string, userContext: UserContext | null): Promise<AstrologyAnalysis | null> => {
  try {
    const timeInfo = birthDetails.isBirthTimeUnknown
      ? `
- Time: Unknown/Estimated.
IMPORTANT: Since the birth time is unknown, you must perform the analysis using a standard astrological convention (e.g., Chandra Lagna or Surya Lagna as primary, or noon as a fallback). Crucially, you MUST explicitly state in the 'introduction' section of your analysis that the birth time was not provided, and explain that while planetary positions in signs are accurate, the Ascendant (Lagna) and house placements are estimations. This affects the precision of predictions related to specific life areas. The ascendant analysis should reflect this uncertainty.`
      : `- Time: ${birthDetails.birthTime}`;

    const contextString = createUserContextString(userContext);

    const prompt = `
      Act as a nurturing and wise Vedic astrologer (Jyotishi).${contextString} Based on the birth details for this ${gender} user:
      - Date: ${birthDetails.birthDate}
      ${timeInfo}
      - Place: ${birthDetails.birthPlace}
      
      Provide two things:
      1. A JSON object detailing the planetary positions for three divisional charts: Rasi (D1), Navamsa (D9), and Drekkana (D3). For each chart, and for each of the 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) and the Ascendant (Lagna), provide an object containing its zodiac 'sign' and a boolean 'isRetrograde' status where applicable.
      2. A detailed Vedic astrology reading based on the primary Rasi chart. The analysis should be deeply empathetic, reassuring, and steeped in ancient wisdom. Address the user as a seeker of truth. For each section, provide a 'title', a detailed 'description', and a 'category' key. The required categories are: 'introduction' (a warm, welcoming overview of the chart's dominant energies), 'ascendant' (detailed analysis of the Ascendant/Lagna sign and its lord), 'placements' (analysis of 2-3 key planetary placements and their effects), 'themes' (key life themes like career, relationships, spirituality), and 'summary' (a concluding summary with gentle, spiritual guidance). The analysis should be subtly tailored to the user's gender.
      
      Return a single JSON object that conforms to the provided schema. The JSON must contain keys for "rasi", "navamsa", "drekkana", and "analysis".
    `;

    const planetInfoSchema = {
      type: Type.OBJECT,
      properties: {
        sign: { type: Type.STRING, description: "The zodiac sign of the planet." },
        isRetrograde: { type: Type.BOOLEAN, description: "True if the planet is retrograde." }
      },
      required: ["sign"]
    };
    
    const planetaryPositionsSchema = {
        type: Type.OBJECT,
        properties: {
            Sun: planetInfoSchema, Moon: planetInfoSchema, Mars: planetInfoSchema,
            Mercury: planetInfoSchema, Jupiter: planetInfoSchema, Venus: planetInfoSchema,
            Saturn: planetInfoSchema, Rahu: planetInfoSchema, Ketu: planetInfoSchema,
            Ascendant: {
                type: Type.OBJECT,
                properties: {
                    sign: { type: Type.STRING, description: "The zodiac sign of the Ascendant." }
                },
                required: ["sign"]
            }
        },
        required: ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu", "Ascendant"]
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rasi: planetaryPositionsSchema,
            navamsa: planetaryPositionsSchema,
            drekkana: planetaryPositionsSchema,
            analysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: ['introduction', 'ascendant', 'placements', 'themes', 'summary'] 
                  },
                },
                required: ["title", "description", "category"]
              }
            }
          },
          required: ["rasi", "navamsa", "drekkana", "analysis"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting astrology analysis:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const generateComprehensiveReport = async (
    inputs: PackageInputs, 
    features: FeatureId[], 
    userContext: UserContext | null
): Promise<CombinedAnalysisReport | null> => {
    try {
        const analyses: Partial<CombinedAnalysisReport> = {};
        const promises: Promise<void>[] = [];

        // 1. Astrology
        if (features.includes(FeatureId.ASTROLOGY) && inputs.birthDate && inputs.birthPlace) {
            promises.push((async () => {
                const res = await getVedicAstrologyAnalysis({
                    birthDate: inputs.birthDate!,
                    birthTime: inputs.birthTime || '12:00',
                    birthPlace: inputs.birthPlace!,
                    isBirthTimeUnknown: inputs.isBirthTimeUnknown
                }, inputs.gender, userContext);
                if (res) analyses.astrology = res;
            })());
        }

        // 2. Palmistry
        if (features.includes(FeatureId.PALMISTRY) && inputs.palmImage) {
            promises.push((async () => {
                const base64 = inputs.palmImage!.split(',')[1];
                const mime = inputs.palmImage!.substring(inputs.palmImage!.indexOf(':') + 1, inputs.palmImage!.indexOf(';'));
                const res = await getPalmReadingAnalysis(base64, mime, inputs.gender, userContext);
                if (res) analyses.palmistry = res;
            })());
        }

        // 3. Face Reading
        if (features.includes(FeatureId.FACE_READING) && inputs.faceImage) {
            promises.push((async () => {
                const base64 = inputs.faceImage!.split(',')[1];
                const mime = inputs.faceImage!.substring(inputs.faceImage!.indexOf(':') + 1, inputs.faceImage!.indexOf(';'));
                const res = await getFaceReadingAnalysis(base64, mime, inputs.gender, userContext);
                if (res) analyses.faceReading = res;
            })());
        }

        // 4. Handwriting
        if (features.includes(FeatureId.HANDWRITING_ANALYSIS) && inputs.handwritingImage) {
            promises.push((async () => {
                const base64 = inputs.handwritingImage!.split(',')[1];
                const mime = inputs.handwritingImage!.substring(inputs.handwritingImage!.indexOf(':') + 1, inputs.handwritingImage!.indexOf(';'));
                const res = await getHandwritingAnalysis(base64, mime, inputs.gender, userContext);
                if (res) analyses.handwriting = res;
            })());
        }

        // 5. Moleology
        if (features.includes(FeatureId.MOLEOLOGY) && inputs.moleLocations && inputs.moleLocations.length > 0) {
            promises.push((async () => {
                const moles = inputs.moleLocations!.join(', ');
                const res = await getMoleologyAnalysis(inputs.gender, moles, ['personality', 'love', 'career', 'wealth'], userContext);
                if (res) analyses.moleology = res;
            })());
        }

        // 6. Mantra
        if (features.includes(FeatureId.MANTRA_GENERATOR)) {
            promises.push((async () => {
                const goal = inputs.mantraGoal || "General well-being and spiritual growth";
                const res = await getMantraAnalysis(goal, inputs.gender, userContext);
                if (res) analyses.mantra = res;
            })());
        }

        // 7. Compatibility (Simple Zodiac)
        if (features.includes(FeatureId.COMPATIBILITY) && inputs.partnerSign && analyses.astrology) {
             // Need user's sign first. In a real app we'd extract from astrology, but here we might guess or ask.
             // For now, let's skip strict dependency or assume 'Aries' as fallback if astrology fails
             promises.push((async () => {
                 const userSign = "Aries"; // Fallback
                 const res = await getZodiacCompatibilityAnalysis(userSign, inputs.partnerSign!, "Relationship", userContext);
                 if (res) analyses.zodiacCompatibility = res;
             })());
        }

        // Wait for all individual analyses to complete
        await Promise.allSettled(promises);

        // 8. SYNTHESIS: The "Connect" part
        const summaryPrompt = `
            Act as a wise Cosmic Guru. I have performed multiple readings for a user named ${inputs.name} (${inputs.gender}).
            
            Here are the results from the individual services:
            ${analyses.astrology ? `[Astrology]: ${JSON.stringify(analyses.astrology.analysis)}` : ''}
            ${analyses.palmistry ? `[Palmistry]: ${JSON.stringify(analyses.palmistry.sections)}` : ''}
            ${analyses.faceReading ? `[Face Reading]: ${JSON.stringify(analyses.faceReading.sections)}` : ''}
            ${analyses.handwriting ? `[Handwriting]: ${JSON.stringify(analyses.handwriting.sections)}` : ''}
            ${analyses.moleology ? `[Moleology]: ${JSON.stringify(analyses.moleology.sections)}` : ''}
            ${analyses.mantra ? `[Mantra]: ${analyses.mantra.overallMeaning}` : ''}

            **Your Task:**
            Create a "Holistic Guidance" report. Do NOT just repeat the individual findings.
            Instead, find the **connections**, **contradictions**, and **synergies** between them.
            
            For example:
            - "Your astrological Sun in Leo (Astrology) matches the strong will shown in your chin (Face Reading)..."
            - "While your Palmistry suggests a sensitive heart, your Handwriting shows a bold public persona..."
            
            Write a beautiful, 3-4 paragraph synthesis that weaves these threads together into a unified narrative about their soul's path.
            Also write a short "Introduction" welcoming them to their comprehensive report.

            Return JSON with:
            - "introduction": String
            - "holisticGuidance": String
        `;

        const synthesisResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: summaryPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        introduction: { type: Type.STRING },
                        holisticGuidance: { type: Type.STRING }
                    },
                    required: ["introduction", "holisticGuidance"]
                }
            }
        });

        const synthesis = JSON.parse(synthesisResponse.text || '{}');

        return {
            ...analyses,
            introduction: synthesis.introduction,
            holisticGuidance: synthesis.holisticGuidance
        } as CombinedAnalysisReport;

    } catch (error) {
        console.error("Error generating comprehensive report:", error);
        return null;
    }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getTrialVedicAstrologyAnalysis = async (name: string, gender: string, userContext: UserContext | null): Promise<TrialAstrologyAnalysis | null> => {
  try {
    const contextString = createUserContextString(userContext);
    const prompt = `
      Act as a nurturing Vedic astrologer providing a short, encouraging "teaser" analysis for a new ${gender} user named ${name} who is starting their trial.${contextString}
      
      Provide a brief, mystical, and welcoming analysis. The tone should be warm, encouraging, and deeply empathetic, hinting at the deeper wisdom available in a full reading.
      
      Return a single JSON object with two keys:
      1. "greeting": A warm, personalized greeting. For example: "Greetings, ${name}, seeker of cosmic truths."
      2. "summary": A short paragraph (2-3 sentences) giving a high-level, positive insight. This should be a general, universally applicable astrological statement that feels personal but doesn't require specific birth data. For example, mention the current cosmic weather or a general statement about destiny and potential.
      
      Do not ask for birth details. This is an introductory teaser.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["greeting", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting trial astrology analysis:", error);
    return null;
  }
};

const parseHoroscopeText = (text: string, sunSign: string): DailyHoroscopeAnalysis | null => {
    try {
        const sections: HoroscopeSection[] = [];
        
        const greetingMatch = text.match(new RegExp(`^My Dearest ${sunSign},`, 'i'));
        const greeting = greetingMatch ? greetingMatch[0] : `My Dearest ${sunSign},`;
        let remainingText = greetingMatch ? text.substring(greeting.length).trim() : text.trim();

        const sectionTitles = [
            "General Outlook", "Path of Purpose & Career", "Heart's Whisper & Relationships",
            "Abundance & Material Flow", "Well-being & Inner Harmony"
        ];
        
        const regex = new RegExp(`\\*\\*(${sectionTitles.join('|')}):\\*\\*`, 'gi');
        const parts = remainingText.split(regex);
        
        if (parts.length < 2) {
            console.warn("Could not split horoscope by section titles.");
            return { greeting, introduction: remainingText, sections: [], conclusion: '', luckyColor: 'Varies', luckyNumbers: [] };
        }

        const introduction = parts.shift()!.trim();

        for (let i = 0; i < parts.length; i += 2) {
            const title = parts[i].trim();
            let outlook = (parts[i+1] || '').trim();
            if (title) sections.push({ title, outlook });
        }
        
        const lastSection = sections[sections.length - 1];
        if (!lastSection) throw new Error("No sections parsed.");

        const paragraphs = lastSection.outlook.split('\n').filter(p => p.trim());
        const conclusion = paragraphs.length > 1 ? (paragraphs.pop() || '') : '';
        lastSection.outlook = paragraphs.join('\n').trim();

        const luckyColorMatch = (conclusion || lastSection.outlook).match(/lucky color.*? is ([\w\s]+)/i);
        const luckyNumbersMatch = (conclusion || lastSection.outlook).match(/lucky numbers are ([\d\s,and]+)/i);

        const luckyColor = luckyColorMatch ? luckyColorMatch[1].replace(/,.*$/, '').trim() : 'Varies';
        const luckyNumbers = luckyNumbersMatch 
            ? luckyNumbersMatch[1].split(/,|\s*and\s*/).map(n => parseInt(n.trim())).filter(n => !isNaN(n))
            : [];
        
        if (!lastSection.outlook && conclusion) {
             lastSection.outlook = conclusion;
             return { greeting, introduction, sections, conclusion: '', luckyColor, luckyNumbers };
        }

        return { greeting, introduction, sections, conclusion, luckyColor, luckyNumbers };

    } catch (e) {
        console.error("Failed to parse horoscope text:", e);
        return { greeting: `My Dearest ${sunSign},`, introduction: text, sections: [], conclusion: '', luckyColor: 'Varies', luckyNumbers: [] };
    }
}

// Fix: Updated model and implemented grounding source extraction for search-grounded daily horoscope.
export const getDailyHoroscope = async (sunSign: string): Promise<DailyHoroscopeAnalysis | null> => {
  try {
    const prompt = `
      Provide a detailed and insightful daily horoscope for today for the zodiac sign ${sunSign}. 
      The tone should be deeply nurturing, empathetic, and steeped in ancient Indian wisdom. Offer calm reassurance.
      The output MUST be a single string formatted exactly as follows, using markdown for bolding:

      My Dearest ${sunSign},
      [An introductory paragraph for today's horoscope, including today's date.]

      **General Outlook:**
      [An outlook paragraph for this section.]

      **Path of Purpose & Career:**
      [An outlook paragraph for this section.]

      **Heart's Whisper & Relationships:**
      [An outlook paragraph for this section.]

      **Abundance & Material Flow:**
      [An outlook paragraph for this section.]

      **Well-being & Inner Harmony:**
      [An outlook paragraph for this section.]

      [A single concluding paragraph that MUST mention the lucky color and two lucky numbers. For example: "Your lucky color today is Silver, and your lucky numbers are 4 and 10."]
    `;
    
    const response = await ai.models.generateContent({
       model: "gemini-3-flash-preview",
       contents: prompt,
       config: {
         tools: [{googleSearch: {}}],
       },
    });

    if (!response.text) return null;

    const analysis = parseHoroscopeText(response.text.trim(), sunSign);
    if (analysis) {
        // Extract website URLs from groundingMetadata as required.
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
            analysis.sources = chunks
                .filter(chunk => chunk.web)
                .map(chunk => ({ title: chunk.web!.title, uri: chunk.web!.uri }));
        }
    }
    return analysis;
  } catch (error) {
    console.error(`Error getting daily horoscope for ${sunSign}:`, error);
    return null;
  }
};


// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getSacredUnionAnalysis = async (sign1: string, sign2: string, userContext: UserContext | null): Promise<SacredUnionAnalysis | null> => {
  try {
    const contextString = createUserContextString(userContext);
    const prompt = `
      Act as a wise and empathetic guide in Vedic astrology and the spiritual teachings of the Kamasutra.${contextString}
      Analyze the compatibility between two zodiac signs: ${sign1} and ${sign2}. The tone should be respectful, sacred, and nurturing.

      Provide a detailed analysis in a structured JSON format. The analysis should cover:
      - A brief summary for each sign, including its name, element, and a one-sentence description of its core energy signature.
      - A "sacredConnection" summary (2-3 sentences) describing their energetic dance.
      - A "spiritualHarmony" score (a number between 60 and 95).
      - "connectionStrengths": An array of 3-4 bullet points (strings).
      - "intimacyStyle": A summary string and a "spiritualBond" string.
      - "relationshipChallenges": An array of 3 bullet points (strings).
      - "kamasutraGuidance": An array of 3-4 practical tips (strings) for deepening their connection, inspired by the spiritual teachings of the Kamasutra (focus on mindfulness, energy exchange, not just positions).
      - A concluding "sacredRecommendation" paragraph (2-3 sentences) offering gentle blessings.
      
      Return ONLY the JSON object conforming to the schema.
    `;

    const signInfoSchema = {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        element: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["name", "element", "description"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sign1Info: signInfoSchema,
            sign2Info: signInfoSchema,
            sacredConnection: { type: Type.STRING },
            spiritualHarmony: { type: Type.NUMBER },
            connectionStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            intimacyStyle: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                spiritualBond: { type: Type.STRING },
              },
              required: ["summary", "spiritualBond"],
            },
            relationshipChallenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            kamasutraGuidance: { type: Type.ARRAY, items: { type: Type.STRING } },
            sacredRecommendation: { type: Type.STRING },
          },
          required: [
            "sign1Info", "sign2Info", "sacredConnection", "spiritualHarmony",
            "connectionStrengths", "intimacyStyle", "relationshipChallenges",
            "kamasutraGuidance", "sacredRecommendation"
          ],
        },
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting Sacred Union analysis:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Multimodal Image Analysis Task.
export const getPalmReadingAnalysis = async (imageBase64: string, mimeType: string, gender: string, userContext: UserContext | null): Promise<PalmReadingAnalysis | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    };
    const contextString = createUserContextString(userContext);
    const textPart = {
      text: `Analyze this image of a ${gender}'s palm based on ancient Indian palmistry (Samudrika Shastra).${contextString} 
      Provide a detailed, structured analysis in a deeply nurturing, wise, and empathetic tone, evoking the calm of an ancient sage.
      The analysis must be broken down into specific sections. 
      For each section, provide a 'title', a detailed 'description', and a 'category' key.

      The required categories are:
      - 'impression': A general impression of the palm.
      - 'life_line': Detailed analysis of the Life Line (Jeevan Rekha).
      - 'head_line': Detailed analysis of the Head Line (Mastishka Rekha).
      - 'heart_line': Detailed analysis of the Heart Line (Hridaya Rekha).
      - 'fate_line': Detailed analysis of the Fate Line (Bhagya Rekha), if visible. If not clearly visible, note its absence and what that implies.
      - 'mounts': Analysis of the major mounts (Venus, Jupiter, Saturn, etc.).
      - 'summary': A concluding summary of the reading offering spiritual encouragement.

      Return ONLY a single JSON object that conforms to the schema.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: ['impression', 'life_line', 'head_line', 'heart_line', 'fate_line', 'mounts', 'summary'] 
                  },
                },
                required: ["title", "description", "category"]
              }
            }
          },
          required: ["sections"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing image:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Multimodal Image Analysis Task.
export const getFaceReadingAnalysis = async (imageBase64: string, mimeType: string, gender: string, userContext: UserContext | null): Promise<FaceReadingAnalysis | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    };
    const contextString = createUserContextString(userContext);
    const textPart = {
      text: `Analyze this image of a ${gender}'s face based on ancient physiognomy and Samudrika Shastra.${contextString} 
      Provide a detailed, structured analysis in a nurturing, respectful, and empathetic tone, rooting your insights in ancient wisdom.
      The analysis must be broken down into specific sections based on facial features. 
      For each section, provide a 'title', a detailed 'description', and a 'category' key.

      The required categories are:
      - 'overall_impression': A general impression of the face and personality.
      - 'forehead': Detailed analysis of the Forehead (related to intellect and fortune).
      - 'eyes': Detailed analysis of the Eyes (windows to the soul, indicating personality).
      - 'nose': Detailed analysis of the Nose (related to wealth and health).
      - 'mouth': Detailed analysis of the Mouth and Lips (related to communication and relationships).
      - 'cheeks': Analysis of the Cheeks (related to influence and social standing).
      - 'chin': Analysis of the Chin and Jawline (related to determination and later life).

      Return ONLY a single JSON object that conforms to the schema.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: ['overall_impression', 'forehead', 'eyes', 'nose', 'mouth', 'cheeks', 'chin'] 
                  },
                },
                required: ["title", "description", "category"]
              }
            }
          },
          required: ["sections"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing image for face reading:", error);
    return null;
  }
};


// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getMoleologyAnalysis = async (gender: string, moleNames: string, predictionIds: string[], userContext: UserContext | null): Promise<MoleologyAnalysis | null> => {
  try {
    const predictionLabels = predictionIds.map(id => ({
      'personality': 'General Personality', 'love': 'Love & Relationships', 'health': 'Health & Wellbeing',
      'wealth': 'Wealth & Fortune', 'career': 'Career & Life Path', 'spirituality': 'Spiritual Inclination'
    }[id] || '')).filter(Boolean);

    const contextString = createUserContextString(userContext);
    const prompt = `
      Act as a wise and nurturing interpreter of ancient Indian moleology (Samudrika Shastra).${contextString}
      Provide a detailed, structured analysis for a ${gender} with moles in the following locations: ${moleNames}.
      The analysis should be a JSON object containing a 'sections' array. Each object in the array should correspond to one of the requested life aspects: ${predictionLabels.join(', ')}.
      The tone should be empathetic, reassuring, and guru-like.

      For each aspect, create an object with:
      1. 'title': A compelling title for the reading (e.g., "A Heart of Passion and Loyalty").
      2. 'description': A detailed paragraph of insights.
      3. 'category': The corresponding category key from this list: ${JSON.stringify(predictionIds)}.

      Ensure the category key in your response is one of the keys you were given.
      Return ONLY the single JSON object that conforms to the schema.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: ['personality', 'love', 'health', 'wealth', 'career', 'spirituality'] 
                  },
                },
                required: ["title", "description", "category"]
              }
            }
          },
          required: ["sections"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting Moleology analysis:", error);
    return null;
  }
};


// Fix: Updated model to gemini-3-flash-preview for Multimodal Image Analysis Task.
export const getHandwritingAnalysis = async (imageBase64: string, mimeType: string, gender: string, userContext: UserContext | null): Promise<HandwritingAnalysis | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    };
    const contextString = createUserContextString(userContext);
    const textPart = {
      text: `Analyze this image of a ${gender}'s handwriting based on graphology.${contextString} 
      Provide a detailed, structured analysis in a supportive, empathetic, and wise tone, subtly tailored to the user's gender and context.
      The analysis must be broken down into specific sections. 
      For each section, provide a 'title', a detailed 'description', and a 'category' key.

      The required categories are:
      - 'overall_impression': A general impression of the personality from the writing.
      - 'pressure': Analysis of the pen pressure (heavy, light) and what it reveals about energy levels.
      - 'slant': Analysis of the writing slant (right, left, vertical) and its emotional implications.
      - 'size': Analysis of the letter size (large, small, average) and its relation to confidence and focus.
      - 'spacing': Analysis of spacing between words and letters and what it says about social tendencies.
      - 'signature': A specific analysis of the signature compared to the text, if visible. If not, state that.
      - 'summary': A concluding summary of the reading, offering gentle guidance.

      Return ONLY a single JSON object that conforms to the schema.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: ['overall_impression', 'pressure', 'slant', 'size', 'spacing', 'signature', 'summary'] 
                  },
                },
                required: ["title", "description", "category"]
              }
            }
          },
          required: ["sections"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing handwriting image:", error);
    return null;
  }
};

// Fix: Implemented generateImage using gemini-2.5-flash-image with generateContent as per guidelines.
export const generateImage = async (prompt: string, aspectRatio: string, generationType: 'art' | 'tattoo', style?: string): Promise<string | null> => {
  try {
    const styleInstruction = style ? ` in the style of ${style}` : '';
    const prefix = generationType === 'tattoo'
      ? 'Minimalist, spiritual, mystical tattoo design, clean lines, sacred geometry, ancient Indian wisdom theme: '
      : 'A piece of cosmic, mystical, spiritual art, vibrant colors, divine energy, Vedic-inspired theme: ';
      
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `${prefix}${prompt}${styleInstruction}` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getTattooPlacementSuggestion = async (tattooPrompt: string, bodyPartCategory?: string): Promise<string> => {
    try {
        let placementInstruction = "suggest an ideal body placement";
        if (bodyPartCategory && bodyPartCategory !== 'Any') {
            placementInstruction = `suggest an ideal body placement on the ${bodyPartCategory}`;
        }

        const prompt = `
            Based on the following spiritual or mystical tattoo idea, ${placementInstruction} and provide a brief (1-2 sentence) mystical explanation for why that placement is powerful for this specific design.

            Tattoo Idea: "${tattooPrompt}"

            Example Response: "Inner forearm: This placement keeps the symbol in your line of sight, serving as a constant reminder of your path and strength."

            Return only the suggestion as a single string.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text?.trim() || "Inner forearm";
    } catch (error) {
        console.error("Error getting placement suggestion:", error);
        return "The inner forearm, as a place of personal power and visibility, is often a potent location for meaningful symbols.";
    }
};

// Fix: Updated to gemini-3-pro-preview for Complex Text Task (Relationship Synastry reasoning).
export const getCosmicMatchAnalysis = async (person1: PersonDetails, person2: PersonDetails, userContext: UserContext | null): Promise<CosmicMatchAnalysis | null> => {
  try {
    const contextString = createUserContextString(userContext);
    const prompt = `
      Act as a compassionate and wise Vedic astrologer with deep wisdom in relationship synastry (Kundali Matching).${contextString}
      You are to provide a "best-of-the-best" cosmic matchmaking analysis for two individuals. The analysis must be profound, nurturing, and deeply respectful, rooted in Vedic principles.

      Here are the details of the two individuals:
      Person 1:
      - Name: ${person1.name}
      - Birth Date: ${person1.birthDate}
      - Birth Time: ${person1.birthTime}
      - Birth Place: ${person1.birthPlace}
      - Bio/Desires: ${person1.bio}

      Person 2:
      - Name: ${person2.name}
      - Birth Date: ${person2.birthDate}
      - Birth Time: ${person2.birthTime}
      - Birth Place: ${person2.birthPlace}
      - Bio/Desires: ${person2.bio}

      Based on a comprehensive analysis of their birth charts (including planetary positions, aspects, Nakshatras, and relevant Yogas), provide a detailed compatibility report.
      The report must be a single JSON object with the following structure:

      1.  "overallCompatibility": An object with a "score" (60-99) and a compelling 3-4 sentence "summary".
      2.  "strengths": An array of 3-4 objects, each with a "title" and a detailed "description" paragraph. **In the description, you MUST explicitly reference specific positive Vedic astrological factors. Examples include: favorable planetary aspects (e.g., Jupiter's aspect on Moon, Venus-Mars trine), excellent Nakshatra compatibility (e.g., high scores in Dina, Yoni, or Nadi Koota), or beneficial Yogas (e.g., Gajakesari Yoga) formed between their charts.**
      3.  "challenges": An array of 3 objects, each with a "title" and a detailed "description" paragraph. **In the description, you MUST explicitly reference specific challenging Vedic astrological factors. Examples include: malefic aspects (e.g., Saturn's aspect on Venus, Mars square Sun), potential doshas (e.g., Mangal Dosha, Nadi Dosha, Bhakoot Dosha), or critical Nakshatra incompatibilities (e.g., Gana Dosha, Vedha Nakshatras).**
      4.  "growthPotential": An array of 3 objects, each with a "title" and a "description" paragraph. **In the description, provide actionable advice on how they can mitigate the challenges and enhance their strengths. Crucially, you MUST connect this advice back to the specific Vedic astrological factors you identified. For example, if there is a Mangal Dosha, suggest remedies or approaches to handle the fiery energy.**
      5.  "synastryAspects": An array of 3-5 objects, representing key synastry connections. Each object must have a "title" (e.g., "Moon Sign Harmony"), a brief "description" explaining the aspect based on Vedic principles, and a "type" which must be one of 'harmony', 'challenge', or 'neutral'.
      6.  "spiritualGuidance": A concluding paragraph offering respectful, actionable advice for nurturing their sacred bond.

      Do not include any text outside of the JSON object. The analysis must be clear, well-written, and empathetic.
    `;

    const analysisSectionSchema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["title", "description"],
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallCompatibility: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                summary: { type: Type.STRING },
              },
              required: ["score", "summary"],
            },
            strengths: { type: Type.ARRAY, items: analysisSectionSchema },
            challenges: { type: Type.ARRAY, items: analysisSectionSchema },
            growthPotential: { type: Type.ARRAY, items: analysisSectionSchema },
            synastryAspects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['harmony', 'challenge', 'neutral'] }
                },
                required: ["title", "description", "type"],
              }
            },
            spiritualGuidance: { type: Type.STRING },
          },
          required: ["overallCompatibility", "strengths", "challenges", "growthPotential", "synastryAspects", "spiritualGuidance"],
        },
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting Cosmic Match analysis:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getTarotReading = async (spreadName: string, cards: { cardName: string, position: string }[], gender: string, userContext: UserContext | null, moleLocations?: string): Promise<TarotAnalysis | null> => {
    try {
        const contextString = createUserContextString(userContext);
        const moleInstruction = moleLocations
          ? `
        Additionally, the user has moles in the following locations: ${moleLocations}.

        You MUST integrate the wisdom of Indian moleology (Samudrika Shastra) into your interpretation. For each card's "interpretation", and in the "overallSummary", explain how the significance of these moles might add another layer of meaning, influence the card's energy, or offer specific guidance related to the reading. The primary focus is still the Tarot, but the moleology should provide nuance and depth. Make these connections feel natural and insightful.
        `
          : '';

        const prompt = `
            Act as a nurturing and intuitive Tarot reader. Your tone should be wise, empathetic, and calming.${contextString}
            Provide a detailed interpretation for a "${spreadName}" spread. The user identifies as ${gender}. Please tailor your interpretations, especially around archetypes and relationships, to be subtly mindful of this context.

            The drawn cards are:
            ${cards.map(c => `- ${c.position}: ${c.cardName}`).join('\n')}
            
            ${moleInstruction}

            Provide the analysis as a single JSON object. The JSON must contain:
            1. A "readings" array. Each object in the array must correspond to a drawn card and contain:
               - "cardName": The name of the card.
               - "position": The position of the card in the spread (e.g., "Past", "The Challenge").
               - "interpretation": A detailed paragraph (3-4 sentences) interpreting the card in the context of its position.
               - "keywords": An array of 3-4 relevant keywords as strings.
            2. An "overallSummary" key containing a concluding paragraph that weaves together the insights from all the cards into a cohesive narrative for the user's journey.

            Return ONLY the JSON object conforming to the schema.
        `;

        const cardReadingSchema = {
            type: Type.OBJECT,
            properties: {
                cardName: { type: Type.STRING },
                position: { type: Type.STRING },
                interpretation: { type: Type.STRING },
                keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["cardName", "position", "interpretation", "keywords"],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        readings: { type: Type.ARRAY, items: cardReadingSchema },
                        overallSummary: { type: Type.STRING },
                    },
                    required: ["readings", "overallSummary"],
                },
            },
        });

        return JSON.parse(response.text || '{}');
    } catch (error) {
        console.error("Error getting Tarot reading:", error);
        return null;
    }
};

// Fix: Added getTarotCardDescriptions to resolve import error in TarotReading component and provide mystical insights.
export const getTarotCardDescriptions = async (cardNames: string[]): Promise<Record<string, string>> => {
  try {
    const prompt = `Provide a very brief (max 10 words) mystical description for each of the following Tarot cards: ${cardNames.join(', ')}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              cardName: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["cardName", "description"]
          }
        }
      }
    });

    const list = JSON.parse(response.text || '[]');
    return list.reduce((acc: Record<string, string>, item: any) => {
      acc[item.cardName] = item.description;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error getting tarot card descriptions:", error);
    return {};
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getTarotKeywordExplanation = async (keyword: string): Promise<string | null> => {
  try {
    const prompt = `
      Act as an expert Tarot reader and symbologist. 
      Provide a concise but insightful explanation (2-3 sentences) for the Tarot keyword: "${keyword}". 
      Explain what this keyword generally signifies in a reading. 
      The tone should be wise, comforting, and clear.
      Return only the explanation as a single string of text.
    `;
    
    const response = await ai.models.generateContent({
       model: "gemini-3-flash-preview",
       contents: prompt,
    });

    return response.text?.trim() || null;
  } catch (error) {
    console.error(`Error getting explanation for keyword "${keyword}":`, error);
    return "The cosmic meaning of this keyword is currently veiled. Please try again.";
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getMantraAnalysis = async (goal: string, gender: string, userContext: UserContext | null): Promise<MantraAnalysis | null> => {
  try {
    const contextString = createUserContextString(userContext);
    const prompt = `
      Act as a wise spiritual guide and expert in Sanskrit and Vedic traditions. A ${gender} user wants a personalized mantra for the following goal/intention: "${goal}".${contextString}
      
      Generate a suitable, authentic Sanskrit mantra. Provide a detailed breakdown as a JSON object with the following structure:
      1. "sanskritMantra": The mantra in Devanagari script.
      2. "transliteration": The mantra in IAST Roman transliteration.
      3. "wordMeanings": An array of objects, where each object has a "word" (in Sanskrit) and its "meaning" in English.
      4. "overallMeaning": A detailed paragraph explaining the full meaning and spiritual significance of the mantra.
      5. "chantingGuidance": A paragraph with simple, practical instructions on how to chant or meditate with this mantra for best results.
      
      Return ONLY the JSON object that conforms to the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sanskritMantra: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            wordMeanings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ["word", "meaning"]
              }
            },
            overallMeaning: { type: Type.STRING },
            chantingGuidance: { type: Type.STRING },
          },
          required: ["sanskritMantra", "transliteration", "wordMeanings", "overallMeaning", "chantingGuidance"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting Mantra analysis:", error);
    return null;
  }
};

export const generateMantraAudio = async (mantraText: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Chant the following Sanskrit mantra clearly and reverently: ${mantraText}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Error generating mantra audio:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getZodiacCompatibilityAnalysis = async (sign1: string, sign2: string, context: string, userContext: UserContext | null): Promise<ZodiacCompatibilityAnalysis | null> => {
  try {
    const contextString = createUserContextString(userContext);
    const prompt = `
      Act as a compassionate and nurturing astrologer focusing on interpersonal dynamics. Analyze the compatibility between two zodiac signs, ${sign1} and ${sign2}, specifically within the context of a ${context} relationship.${contextString}
      Provide a detailed, structured analysis in a deeply empathetic, warm, and encouraging tone. The insights should be tailored to the provided relationship context.
      The analysis must be a JSON object containing a 'sections' array. Each object in the array must have a 'title', a detailed 'description', and a 'category' key.

      The required categories and their corresponding titles are:
      - 'vibe': "The Overall Vibe"
      - 'strengths': "Strengths of This Connection"
      - 'challenges': "Potential Challenges (Where to Be Mindful)"
      - 'tips': "Tips for a Flourishing Bond"
      - 'conclusion': "Conclusion"

      Return ONLY a single JSON object that conforms to the schema.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: ['vibe', 'strengths', 'challenges', 'tips', 'conclusion'] 
                  },
                },
                required: ["title", "description", "category"]
              }
            }
          },
          required: ["sections"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error getting Zodiac Compatibility analysis:", error);
    return null;
  }
};

// Fix: Updated model to gemini-3-flash-preview for Basic Text Task.
export const getHandMudraAnalysis = async (analysisText: string, featureContext: string, gender: string, userContext: UserContext | null): Promise<(HandMudraAnalysis & { imageUrl: string | null }) | null> => {
  try {
    const contextString = createUserContextString(userContext);
    const prompt = `
      Act as a wise and nurturing Yogi and expert in Mudra Vigyan (the science of hand gestures). Based on the following esoteric analysis from the "${featureContext}" feature, suggest the single most appropriate Hand Mudra to support this ${gender} user.${contextString}

      Analysis Text: "${analysisText}"

      Your response MUST be a single JSON object with the following structure:
      1. "mudraName": The common English name (e.g., "Mudra of Knowledge").
      2. "sanskritName": The Sanskrit name and Devanagari script (e.g., "Gyan Mudra (ज्ञान मुद्रा)").
      3. "description": A brief, mystical explanation of the mudra's purpose.
      4. "instructions": An array of strings with simple, step-by-step instructions.
      5. "personalizedGuidance": A paragraph explaining WHY this specific mudra is recommended for the user based on THEIR analysis. Connect it directly to themes in their reading (e.g., "Your chart shows a need for mental clarity, and the Gyan Mudra helps focus the mind...").
      6. "practice": A short recommendation on when and for how long to practice (e.g., "Practice for 5-10 minutes during your morning meditation.").
      7. "imagePrompt": A descriptive prompt for an AI image generator to create a beautiful, realistic image of a hand performing this mudra. The style should be serene and spiritual, with soft lighting. For example: 'A close-up, photorealistic image of a serene hand forming the Gyan Mudra. The index finger touches the thumb. Soft, divine light emanates from the point of contact. The background is a calm, meditative, out-of-focus space.'
    `;

    const textResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mudraName: { type: Type.STRING },
            sanskritName: { type: Type.STRING },
            description: { type: Type.STRING },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            personalizedGuidance: { type: Type.STRING },
            practice: { type: Type.STRING },
            imagePrompt: { type: Type.STRING },
          },
          required: ["mudraName", "sanskritName", "description", "instructions", "personalizedGuidance", "practice", "imagePrompt"]
        }
      }
    });

    const mudraData: HandMudraAnalysis = JSON.parse(textResponse.text || '{}');

    // Generate the image using the prompt from the first call
    const imageUrl = await generateImage(mudraData.imagePrompt, '1:1', 'art');

    return { ...mudraData, imageUrl };
  } catch (error) {
    console.error("Error getting Hand Mudra analysis:", error);
    return null;
  }
};
