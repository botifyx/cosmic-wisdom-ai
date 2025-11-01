import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { PersonDetails, CosmicMatchAnalysis, AstrologyAnalysis, SacredUnionAnalysis, PalmReadingAnalysis, FaceReadingAnalysis, MoleologyAnalysis, TarotAnalysis, MantraAnalysis, ZodiacCompatibilityAnalysis, HandwritingAnalysis } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      ...(systemInstruction && { config: { systemInstruction } }),
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};

export const createArtPromptFromAnalysis = async (analysisText: string, featureContext: string): Promise<string> => {
  try {
    const prompt = `
      Based on the following esoteric analysis from a feature called "${featureContext}", generate a single, rich, symbolic, and descriptive prompt for an AI image generator like Imagen.

      The analysis is: "${analysisText}"

      The generated prompt should:
      - Be a single paragraph.
      - Be visually vivid and creative.
      - Capture the core essence, strengths, and spiritual path revealed in the analysis.
      - Describe a piece of art that could serve as a powerful personal wallpaper for a phone or desktop, meant to inspire and align the user with their cosmic potential.
      - Use mystical, spiritual, and Vedic-inspired keywords.
      - Examples: "A radiant sun in the heart of a celestial lion, cosmic dust swirling around its mane...", "Two hands intertwined, glowing lines of fate connecting them, set against a backdrop of their ruling planets...", "A sacred geometric mandala glowing with the colors of two intertwined souls, representing their karmic bond."

      Return ONLY the generated prompt as a single string.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error creating art prompt:", error);
    // Return a beautiful, generic fallback prompt in case of an error
    return "A wise yogi meditating under the cosmic tree of life, its branches filled with swirling galaxies and glowing nebulae, embodying peace and universal connection.";
  }
};


export const getVedicAstrologyAnalysis = async (birthDetails: { birthDate: string, birthTime: string, birthPlace: string, isBirthTimeUnknown?: boolean }): Promise<AstrologyAnalysis | null> => {
  try {
    const timeInfo = birthDetails.isBirthTimeUnknown
      ? `
- Time: Unknown/Estimated.
IMPORTANT: Since the birth time is unknown, you must perform the analysis using a standard astrological convention (e.g., Chandra Lagna or Surya Lagna as primary, or noon as a fallback). Crucially, you MUST explicitly state in the 'introduction' section of your analysis that the birth time was not provided, and explain that while planetary positions in signs are accurate, the Ascendant (Lagna) and house placements are estimations. This affects the precision of predictions related to specific life areas. The ascendant analysis should reflect this uncertainty.`
      : `- Time: ${birthDetails.birthTime}`;

    const prompt = `
      Act as an expert Vedic astrologer. Based on the birth details:
      - Date: ${birthDetails.birthDate}
      ${timeInfo}
      - Place: ${birthDetails.birthPlace}
      
      Provide two things:
      1. A JSON object detailing the planetary positions for three divisional charts: Rasi (D1), Navamsa (D9), and Drekkana (D3). For each chart, and for each of the 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu) and the Ascendant (Lagna), provide an object containing its zodiac 'sign' and a boolean 'isRetrograde' status where applicable. Note: Sun, Moon, and Ascendant are never retrograde. Rahu and Ketu are always retrograde. If the birth time is unknown, calculate the Ascendant based on your chosen convention but be aware it's an estimate.
      2. A detailed Vedic astrology reading based on the primary Rasi chart, broken down into specific sections. For each section, provide a 'title', a detailed 'description', and a 'category' key. The required categories are: 'introduction' (a general overview of the chart's dominant energies), 'ascendant' (detailed analysis of the Ascendant/Lagna sign and its lord), 'placements' (analysis of 2-3 key planetary placements and their effects), 'themes' (key life themes like career, relationships, spirituality), and 'summary' (a concluding summary with gentle guidance).
      
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
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting astrology analysis:", error);
    return null;
  }
};


export const getSacredUnionAnalysis = async (sign1: string, sign2: string): Promise<SacredUnionAnalysis | null> => {
  try {
    const prompt = `
      Act as an expert in Vedic astrology and the wisdom of the Kamasutra, focusing on spiritual and emotional connection.
      Analyze the compatibility between two zodiac signs: ${sign1} and ${sign2}.

      Provide a detailed analysis in a structured JSON format. The analysis should cover:
      - A brief summary for each sign, including its name, element, and a one-sentence description of its core energy signature.
      - A "sacredConnection" summary (2-3 sentences) describing their energetic dance.
      - A "spiritualHarmony" score (a number between 60 and 95).
      - "connectionStrengths": An array of 3-4 bullet points (strings).
      - "intimacyStyle": A summary string and a "spiritualBond" string.
      - "relationshipChallenges": An array of 3 bullet points (strings).
      - "kamasutraGuidance": An array of 3-4 practical tips (strings) for deepening their connection, inspired by the spiritual teachings of the Kamasutra (focus on mindfulness, energy exchange, not just positions).
      - A concluding "sacredRecommendation" paragraph (2-3 sentences).
      
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
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting Sacred Union analysis:", error);
    return null;
  }
};

export const getPalmReadingAnalysis = async (imageBase64: string, mimeType: string): Promise<PalmReadingAnalysis | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    };
    const textPart = {
      text: `Analyze this image of a palm based on ancient Indian palmistry (Samudrika Shastra). 
      Provide a detailed, structured analysis in a wise, insightful tone.
      The analysis must be broken down into specific sections. 
      For each section, provide a 'title', a detailed 'description', and a 'category' key.

      The required categories are:
      - 'impression': A general impression of the palm.
      - 'life_line': Detailed analysis of the Life Line (Jeevan Rekha).
      - 'head_line': Detailed analysis of the Head Line (Mastishka Rekha).
      - 'heart_line': Detailed analysis of the Heart Line (Hridaya Rekha).
      - 'fate_line': Detailed analysis of the Fate Line (Bhagya Rekha), if visible. If not clearly visible, note its absence and what that implies.
      - 'mounts': Analysis of the major mounts (Venus, Jupiter, Saturn, etc.).
      - 'summary': A concluding summary of the reading.

      Return ONLY a single JSON object that conforms to the schema.`
    };
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing image:", error);
    return null;
  }
};

export const getFaceReadingAnalysis = async (imageBase64: string, mimeType: string): Promise<FaceReadingAnalysis | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    };
    const textPart = {
      text: `Analyze this image of a person's face based on ancient physiognomy and Samudrika Shastra. 
      Provide a detailed, structured analysis in a wise, insightful tone.
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
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing image for face reading:", error);
    return null;
  }
};


export const getMoleologyAnalysis = async (gender: string, moleNames: string, predictionIds: string[]): Promise<MoleologyAnalysis | null> => {
  try {
    const predictionLabels = predictionIds.map(id => ({
      'personality': 'General Personality', 'love': 'Love & Relationships', 'health': 'Health & Wellbeing',
      'wealth': 'Wealth & Fortune', 'career': 'Career & Life Path', 'spirituality': 'Spiritual Inclination'
    }[id] || '')).filter(Boolean);

    const prompt = `
      Act as a master of ancient Indian moleology (Samudrika Shastra).
      Provide a detailed, structured analysis for a ${gender} with moles in the following locations: ${moleNames}.
      The analysis should be a JSON object containing a 'sections' array. Each object in the array should correspond to one of the requested life aspects: ${predictionLabels.join(', ')}.

      For each aspect, create an object with:
      1. 'title': A compelling title for the reading (e.g., "A Heart of Passion and Loyalty").
      2. 'description': A detailed paragraph of insights in a wise, mystical, and guru-like tone.
      3. 'category': The corresponding category key from this list: ${JSON.stringify(predictionIds)}.

      Ensure the category key in your response is one of the keys you were given.
      Return ONLY the single JSON object that conforms to the schema.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting Moleology analysis:", error);
    return null;
  }
};


export const getHandwritingAnalysis = async (imageBase64: string, mimeType: string): Promise<HandwritingAnalysis | null> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    };
    const textPart = {
      text: `Analyze this image of handwriting based on graphology. 
      Provide a detailed, structured analysis in a wise, insightful tone.
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
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error analyzing handwriting image:", error);
    return null;
  }
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Spiritual, mystical, ancient Indian wisdom theme: ${prompt}`,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

export const getCosmicMatchAnalysis = async (person1: PersonDetails, person2: PersonDetails): Promise<CosmicMatchAnalysis | null> => {
  try {
    const prompt = `
      Act as a master Vedic astrologer with deep wisdom in relationship synastry (Kundali Matching).
      You are to provide a "best-of-the-best" cosmic matchmaking analysis for two individuals. The analysis must be profound, insightful, respectful, and deeply rooted in Vedic principles.

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
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting Cosmic Match analysis:", error);
    return null;
  }
};

export const getTarotReading = async (spreadName: string, cards: { cardName: string, position: string }[]): Promise<TarotAnalysis | null> => {
    try {
        const prompt = `
            Act as an expert Tarot reader with a wise, insightful, and spiritual tone.
            Provide a detailed interpretation for a "${spreadName}" spread.

            The drawn cards are:
            ${cards.map(c => `- ${c.position}: ${c.cardName}`).join('\n')}

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
            model: 'gemini-2.5-flash',
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

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Error getting Tarot reading:", error);
        return null;
    }
};

export const getMantraAnalysis = async (goal: string): Promise<MantraAnalysis | null> => {
  try {
    const prompt = `
      Act as an expert in Sanskrit and Vedic traditions. A user wants a personalized mantra for the following goal/intention: "${goal}".
      
      Generate a suitable, authentic Sanskrit mantra. Provide a detailed breakdown as a JSON object with the following structure:
      1. "sanskritMantra": The mantra in Devanagari script.
      2. "transliteration": The mantra in IAST Roman transliteration.
      3. "wordMeanings": An array of objects, where each object has a "word" (in Sanskrit) and its "meaning" in English.
      4. "overallMeaning": A detailed paragraph explaining the full meaning and spiritual significance of the mantra.
      5. "chantingGuidance": A paragraph with simple, practical instructions on how to chant or meditate with this mantra for best results.
      
      Return ONLY the JSON object that conforms to the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
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

export const getZodiacCompatibilityAnalysis = async (sign1: string, sign2: string, context: string): Promise<ZodiacCompatibilityAnalysis | null> => {
  try {
    const prompt = `
      Act as a wise, insightful astrologer focusing on interpersonal dynamics. Analyze the compatibility between two zodiac signs, ${sign1} and ${sign2}, specifically within the context of a ${context} relationship.
      Provide a detailed, structured analysis in a warm and encouraging tone. The insights should be tailored to the provided relationship context.
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
      model: 'gemini-2.5-flash',
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error getting Zodiac Compatibility analysis:", error);
    return null;
  }
};