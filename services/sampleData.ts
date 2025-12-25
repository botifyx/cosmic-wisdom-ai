import {
    FeatureId,
    PalmReadingAnalysis,
    FaceReadingAnalysis,
    HandwritingAnalysis,
    MoleologyAnalysis,
    AstrologyAnalysis,
    TarotAnalysis,
    SacredUnionAnalysis,
    ZodiacCompatibilityAnalysis,
    MantraAnalysis,
    CosmicMatchAnalysis,
} from '../types';

type SampleData = {
    [key in FeatureId]?: {
        analysis?: any; // To hold the main analysis object
        inspirations?: any[]; // To hold list of examples if applicable
    }
}

export const SAMPLE_ANALYSES: SampleData = {
    [FeatureId.PALMISTRY]: {
        analysis: {
            sections: [
                { category: 'impression', title: 'A Hand of Sensitivity', description: 'This palm shows a highly creative and emotionally attuned individual. The overall structure is delicate, suggesting a refined nature.' },
                { category: 'heart_line', title: 'The Romantic Heart', description: 'A long, curving Heart Line points to a warm, expressive, and romantic nature. This person loves deeply and seeks profound emotional connections.' },
                { category: 'head_line', title: 'The Imaginative Mind', description: 'The Head Line is separate from the Life Line, indicating an independent thinker with a vivid imagination.' },
                { category: 'life_line', title: 'A Life of Passion', description: 'The Life Line is well-defined, showing good vitality, but its path suggests a life guided by passion and creative pursuits rather than a conventional route.' },
                { category: 'fate_line', title: 'Destiny in Creativity', description: 'The Fate Line is faint but rises from the Mount of Moon, indicating success and public recognition will come from creative or artistic endeavors.' },
                { category: 'mounts', title: 'Developed Mounts of Venus and Moon', description: 'Strong mounts of Venus (love, beauty) and Moon (imagination, intuition) reinforce the theme of a creative and romantic destiny.' },
                { category: 'summary', title: 'The Creative Soul', description: 'This is the palm of an artist, a dreamer, and a romantic. Their path is one of emotional expression and creative fulfillment. Nurturing their artistic talents will lead to their greatest happiness and success.' }
            ]
        } as PalmReadingAnalysis,
        inspirations: [
            {
                title: "The Artist's Hand",
                description: "A prominent Heart Line and long, tapering fingers suggest a creative, romantic, and sensitive soul.",
                analysis: { /* Omitted for brevity */ }
            },
            {
                title: "The Passionate Creator",
                description: "A Radiant Pulse Unalome design for a life guided by artistic drive and emotional depth.",
                analysis: { /* Omitted for brevity */ }
            }
        ]
    },
    [FeatureId.FACE_READING]: {
        analysis: {
            sections: [
                { category: 'overall_impression', title: 'An Aura of Authority', description: 'This face commands respect. There is an intensity and focus that suggests a person born to lead and make an impact.' },
                { category: 'forehead', title: 'The Expansive Intellect', description: 'A high, broad forehead signifies superior intelligence and a visionary outlook. This individual thinks strategically and is always looking at the bigger picture.' },
                { category: 'eyes', title: 'Penetrating Gaze', description: 'The eyes are clear and focused, indicating a sharp, perceptive mind that can easily see through deception. This is a person of great integrity and conviction.' },
                { category: 'nose', title: 'The Ambitious Bridge', description: 'A strong, straight nose points to power, ambition, and an ability to manage wealth and resources effectively.' },
                { category: 'mouth', title: 'The Decisive Speaker', description: 'A firm, well-defined mouth shows decisiveness and an ability to communicate with authority and clarity.' },
                { category: 'cheeks', title: 'Prominent Influence', description: 'Well-defined cheekbones indicate a person who wields influence and commands authority naturally.' },
                { category: 'chin', title: 'The Resolute Will', description: 'A strong chin and jawline reveal immense determination, willpower, and the resilience to overcome any obstacle.' }
            ]
        } as FaceReadingAnalysis,
        inspirations: [
            {
                title: "The Visionary Leader",
                description: "A broad forehead, intense eyes, and a strong jawline suggest intellect, determination, and natural leadership.",
                analysis: { /* Omitted for brevity */ }
            }
        ]
    },
    [FeatureId.HANDWRITING_ANALYSIS]: {
        analysis: {
            sections: [
                { category: 'overall_impression', title: 'A Force of Energy', description: 'This handwriting exudes confidence and a forward-moving energy. The writer is likely an extrovert who is comfortable expressing their ideas and taking charge of situations.' },
                { category: 'pressure', title: 'Firm and Assertive', description: 'The consistently firm pressure indicates a high level of vitality and emotional depth. This person invests significant energy into their commitments and feels things strongly.' },
                { category: 'slant', title: 'Forward-Leaning', description: 'A distinct rightward slant reveals an emotionally expressive and future-oriented individual. They are likely sociable, responsive, and quick to act on their feelings.' },
                { category: 'size', title: 'Large and Open', description: 'The large letter size suggests a desire to be seen and understood. This writer is not afraid to take up space and likely enjoys being in the spotlight.' },
                { category: 'spacing', title: 'Balanced Word Spacing', description: 'The well-balanced spacing between words indicates a person who is comfortable with both social interaction and personal time. They can navigate social settings with ease but also value their independence.' },
                { category: 'signature', title: 'Clear and Legible', description: 'A clear signature that matches the text shows transparency and self-acceptance. What you see is what you get with this individual.' },
                { category: 'summary', title: 'The Outgoing Leader', description: 'Overall, this script belongs to a confident, energetic, and emotionally expressive individual. They are natural communicators and leaders who are driven by passion and a desire to connect with others.' }
            ]
        } as HandwritingAnalysis,
        inspirations: [
            {
                title: "The Confident Communicator",
                description: "Large, flowing letters with firm pressure, indicating an outgoing and energetic personality.",
                analysis: { /* Omitted for brevity */ }
            }
        ]
    },
    [FeatureId.MOLEOLOGY]: {
        analysis: {
            sections: [
                { category: 'career', title: 'Path of the Leader', description: "A mole on the right shoulder signifies a person who carries responsibilities with great fortitude. You are destined to be a leader, shouldering significant duties not just for yourself, but for many." },
                { category: 'wealth', title: 'Fortune Through Fortitude', description: "The shoulder mole is a powerful indicator of financial success earned through hard work and perseverance." }
            ]
        } as MoleologyAnalysis,
        inspirations: [
            {
                title: "The Ambitious Leader", description: "For a man with moles on his shoulder and thigh, focusing on career and wealth.", gender: 'Male',
                moles: ['arms_right_shoulder', 'legs_left_thigh'], predictions: ['career', 'wealth'], analysis: { /* Omitted for brevity */ }
            }
        ]
    },
    [FeatureId.ASTROLOGY]: {
        analysis: {
            analysis: [
                { category: 'introduction', title: 'The Compassionate Leader', description: "Your Vedic chart reveals a powerful combination of watery, emotional depth and fiery, ambitious drive." },
                { category: 'summary', title: 'Summary & Guidance', description: "Embrace your role as a compassionate leader. Trust your powerful intuition, but do not be afraid to step into the spotlight." }
            ]
        } as unknown as AstrologyAnalysis
    },
    [FeatureId.TAROT]: {
        analysis: {
            overallSummary: "Your reading points to a significant period of transition and new beginnings.",
            readings: [
                { cardName: "The Tower", position: "Past", interpretation: "The past has been marked by a sudden upheaval.", keywords: ["Sudden Change", "Upheaval"] },
                { cardName: "Strength", position: "Present", interpretation: "Currently, you are embodying the archetype of Strength.", keywords: ["Courage", "Inner Strength"] }
            ]
        } as TarotAnalysis
    },
    [FeatureId.SACRED_UNION]: {
        analysis: {
            sign1Info: { name: 'Gemini', element: 'Air', description: 'Represents communication, intellect, and adaptability.' },
            sign2Info: { name: 'Leo', element: 'Fire', description: 'Embodies creativity, leadership, and generous self-expression.' },
            sacredConnection: "This is a vibrant and dynamic connection where Gemini's intellectual curiosity fuels Leo's creative fire.",
            spiritualHarmony: 88,
            connectionStrengths: ["Excellent communication and intellectual synergy."],
            intimacyStyle: { summary: "Their intimacy is playful and expressive.", spiritualBond: "Their spiritual bond is forged through shared ideas." },
            relationshipChallenges: ["Leo's need for adoration may clash with Gemini's nature."],
            kamasutraGuidance: ["Practice Vatsyayana's Dialogue."],
            sacredRecommendation: "Nurture this beautiful connection by celebrating each other's gifts."
        } as SacredUnionAnalysis
    },
    [FeatureId.COMPATIBILITY]: {
        analysis: {
            sections: [
                { category: 'vibe', title: 'The Overall Vibe', description: "The connection between a grounded Taurus and a mystical Pisces is one of earthly sensuality meeting dreamy romance." }
            ]
        } as ZodiacCompatibilityAnalysis
    },
    [FeatureId.MANTRA_GENERATOR]: {
        analysis: {
            sanskritMantra: "ॐ शान्तिः शान्तिः शान्तिः",
            transliteration: "Om Shanti Shanti Shanti",
            wordMeanings: [{ word: "Om (ॐ)", meaning: "The primordial sound." }, { word: "Shanti (शान्तिः)", meaning: "Peace." }],
            overallMeaning: "This universal mantra is an invocation for peace.",
            chantingGuidance: "Find a quiet space and sit comfortably."
        } as MantraAnalysis
    },
    [FeatureId.DATING]: {
        analysis: {
            overallCompatibility: { score: 85, summary: "This is a powerful and transformative connection." },
            strengths: [{ title: "Shared Fire and Passion", description: "With an Aries Ascendant and Sagittarius Moon, both partners share a love for life." }],
            challenges: [{ title: "Impatience vs. Freedom", description: "The Arian need for action can clash with the Sagittarian need for freedom." }],
            growthPotential: [{ title: "Channeling Energy Wisely", description: "Engage in shared physical activities." }],
            synastryAspects: [{ title: "Sun-Moon Conjunction", description: "A classic indicator of a successful bond.", type: 'harmony' }],
            spiritualGuidance: "Your sacred bond is a journey of mutual expansion."
        } as CosmicMatchAnalysis
    }
};