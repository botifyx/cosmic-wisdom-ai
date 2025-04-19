
// Type definition for zodiac sign information
export interface ZodiacSign {
  name: string;
  emoji: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  traits: string[];
}

// Type definition for compatibility result
export interface CompatibilityResult {
  signA: {
    name: string;
    emoji: string;
    personality: string;
  };
  signB: {
    name: string;
    emoji: string;
    personality: string;
  };
  compatibility: {
    overview: string;
    strengths: string[];
    weaknesses: string[];
    loveScore: number;
    recommendation: string;
  };
}

// Zodiac signs data
export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    emoji: '♈',
    dates: 'March 21 - April 19',
    element: 'Fire',
    traits: ['Courageous', 'Energetic', 'Impulsive', 'Competitive']
  },
  {
    name: 'Taurus',
    emoji: '♉',
    dates: 'April 20 - May 20',
    element: 'Earth',
    traits: ['Patient', 'Reliable', 'Stubborn', 'Possessive']
  },
  {
    name: 'Gemini',
    emoji: '♊',
    dates: 'May 21 - June 20',
    element: 'Air',
    traits: ['Adaptable', 'Curious', 'Inconsistent', 'Indecisive']
  },
  {
    name: 'Cancer',
    emoji: '♋',
    dates: 'June 21 - July 22',
    element: 'Water',
    traits: ['Loyal', 'Emotional', 'Moody', 'Nurturing']
  },
  {
    name: 'Leo',
    emoji: '♌',
    dates: 'July 23 - August 22',
    element: 'Fire',
    traits: ['Generous', 'Proud', 'Theatrical', 'Domineering']
  },
  {
    name: 'Virgo',
    emoji: '♍',
    dates: 'August 23 - September 22',
    element: 'Earth',
    traits: ['Analytical', 'Practical', 'Perfectionist', 'Critical']
  },
  {
    name: 'Libra',
    emoji: '♎',
    dates: 'September 23 - October 22',
    element: 'Air',
    traits: ['Diplomatic', 'Harmonious', 'Indecisive', 'People-pleaser']
  },
  {
    name: 'Scorpio',
    emoji: '♏',
    dates: 'October 23 - November 21',
    element: 'Water',
    traits: ['Passionate', 'Intense', 'Secretive', 'Jealous']
  },
  {
    name: 'Sagittarius',
    emoji: '♐',
    dates: 'November 22 - December 21',
    element: 'Fire',
    traits: ['Optimistic', 'Adventurous', 'Tactless', 'Restless']
  },
  {
    name: 'Capricorn',
    emoji: '♑',
    dates: 'December 22 - January 19',
    element: 'Earth',
    traits: ['Ambitious', 'Disciplined', 'Rigid', 'Status-conscious']
  },
  {
    name: 'Aquarius',
    emoji: '♒',
    dates: 'January 20 - February 18',
    element: 'Air',
    traits: ['Innovative', 'Independent', 'Detached', 'Unpredictable']
  },
  {
    name: 'Pisces',
    emoji: '♓',
    dates: 'February 19 - March 20',
    element: 'Water',
    traits: ['Compassionate', 'Intuitive', 'Escapist', 'Oversensitive']
  }
];

// Helper function to get sign info
export function getZodiacSignInfo(name: string): ZodiacSign | undefined {
  return zodiacSigns.find(sign => sign.name === name);
}

// Add animation class for the fade-in effect
export const animateFadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};
