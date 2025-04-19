
// Body parts where moles can be found
export type BodyPart = {
  id: string;
  name: string;
  meanings: {
    general: string;
    fortune: string;
    love: string;
    career: string;
    health: string;
  };
  maleSpecific?: string;
  femaleSpecific?: string;
  imageCoordinates: {
    x: number;
    y: number;
  };
}

export type Gender = "male" | "female";

export type PredictionType = "general" | "fortune" | "love" | "career" | "health" | "spiritual";

export type MoleologyAnalysis = {
  overview: string;
  bodyParts: {
    part: string;
    interpretations: {
      general: string;
      fortune: string;
      love: string;
      career: string;
      health: string;
      spiritual: string;
    }
  }[];
  scriptQuotes: string[];
  personalityTraits: string[];
  lifePathPrediction: string;
  relationshipCompatibility?: string;
}

// Mock data for initial development
export const bodyPartsMale: BodyPart[] = [
  {
    id: "forehead",
    name: "Forehead",
    meanings: {
      general: "Indicates wisdom and intellectual pursuits",
      fortune: "Success through knowledge and strategy",
      love: "Attracts partners who value intelligence",
      career: "Leadership positions and academic success",
      health: "Pay attention to stress levels and mental health"
    },
    imageCoordinates: { x: 50, y: 10 }
  },
  {
    id: "leftCheek",
    name: "Left Cheek",
    meanings: {
      general: "Represents artistic talents and creativity",
      fortune: "Success in creative ventures",
      love: "Romantic and passionate relationships",
      career: "Arts, design, or creative fields",
      health: "Emotional wellbeing is essential"
    },
    imageCoordinates: { x: 35, y: 20 }
  },
  {
    id: "rightCheek",
    name: "Right Cheek",
    meanings: {
      general: "Indicates practical skills and organization",
      fortune: "Steady financial growth",
      love: "Stable and dependable relationships",
      career: "Management and administrative success",
      health: "Generally robust constitution"
    },
    imageCoordinates: { x: 65, y: 20 }
  },
  {
    id: "chin",
    name: "Chin",
    meanings: {
      general: "Represents determination and willpower",
      fortune: "Success through perseverance",
      love: "Loyal and committed in relationships",
      career: "Entrepreneurial success",
      health: "Digestive health is important"
    },
    imageCoordinates: { x: 50, y: 30 }
  },
  {
    id: "chest",
    name: "Chest",
    meanings: {
      general: "Symbolizes wealth and prosperity",
      fortune: "Financial abundance",
      love: "Generous and protective in relationships",
      career: "Success in finance or business",
      health: "Heart and lung health are focal points"
    },
    maleSpecific: "Particularly auspicious for wealth in men",
    imageCoordinates: { x: 50, y: 45 }
  },
  {
    id: "rightArm",
    name: "Right Arm",
    meanings: {
      general: "Represents action and ambition",
      fortune: "Success through hard work",
      love: "Active and adventurous relationships",
      career: "Physical or action-oriented professions",
      health: "Upper body strength and mobility"
    },
    imageCoordinates: { x: 80, y: 50 }
  },
  {
    id: "leftArm",
    name: "Left Arm",
    meanings: {
      general: "Indicates support and assistance",
      fortune: "Support from others in ventures",
      love: "Supportive relationships",
      career: "Teamwork and collaboration",
      health: "Joint health is important"
    },
    imageCoordinates: { x: 20, y: 50 }
  },
  {
    id: "stomach",
    name: "Stomach",
    meanings: {
      general: "Represents abundance and nourishment",
      fortune: "Never lacking in basic needs",
      love: "Nurturing relationships",
      career: "Success in food, hospitality or care industries",
      health: "Digestive health focus"
    },
    imageCoordinates: { x: 50, y: 60 }
  },
  {
    id: "back",
    name: "Back",
    meanings: {
      general: "Represents hidden strengths",
      fortune: "Success through unseen efforts",
      love: "Deep loyalty in relationships",
      career: "Behind-the-scenes roles and support positions",
      health: "Skeletal health is important"
    },
    imageCoordinates: { x: 50, y: 45 }
  },
  {
    id: "rightLeg",
    name: "Right Leg",
    meanings: {
      general: "Symbolizes movement and progress",
      fortune: "Travel and exploration bringing fortune",
      love: "Relationships that evolve and grow",
      career: "Success in travel or transportation industries",
      health: "Circulation and mobility focus"
    },
    imageCoordinates: { x: 60, y: 80 }
  },
  {
    id: "leftLeg",
    name: "Left Leg",
    meanings: {
      general: "Represents foundation and stability",
      fortune: "Steady, reliable income",
      love: "Stable, long-term relationships",
      career: "Success in established institutions",
      health: "Lower body strength and balance"
    },
    imageCoordinates: { x: 40, y: 80 }
  }
];

export const bodyPartsFemale: BodyPart[] = [
  {
    id: "forehead",
    name: "Forehead",
    meanings: {
      general: "Indicates wisdom and foresight",
      fortune: "Success through intuition and planning",
      love: "Attracts intellectually stimulating relationships",
      career: "Leadership and strategic positions",
      health: "Mental clarity and health focus"
    },
    femaleSpecific: "Enhanced intuition and perception",
    imageCoordinates: { x: 50, y: 10 }
  },
  {
    id: "leftCheek",
    name: "Left Cheek",
    meanings: {
      general: "Represents creativity and expression",
      fortune: "Success in artistic ventures",
      love: "Passionate and emotionally rich relationships",
      career: "Arts, communication, or creative fields",
      health: "Emotional wellbeing affects physical health"
    },
    imageCoordinates: { x: 35, y: 20 }
  },
  {
    id: "rightCheek",
    name: "Right Cheek",
    meanings: {
      general: "Indicates practical wisdom and diplomacy",
      fortune: "Success through networking",
      love: "Harmonious and balanced relationships",
      career: "Management and public relations",
      health: "Balanced lifestyle importance"
    },
    imageCoordinates: { x: 65, y: 20 }
  },
  {
    id: "chin",
    name: "Chin",
    meanings: {
      general: "Represents determination and independence",
      fortune: "Self-made success",
      love: "Equal partnerships",
      career: "Entrepreneurship and leadership",
      health: "Dental and jaw health focus"
    },
    femaleSpecific: "Particularly indicates leadership qualities in women",
    imageCoordinates: { x: 50, y: 30 }
  },
  {
    id: "chest",
    name: "Chest",
    meanings: {
      general: "Symbolizes nurturing and emotional wealth",
      fortune: "Prosperity through care for others",
      love: "Deeply nurturing relationships",
      career: "Success in care, education, or healing professions",
      health: "Heart and breast health focus"
    },
    femaleSpecific: "Enhanced intuition about others' needs",
    imageCoordinates: { x: 50, y: 40 }
  },
  {
    id: "rightArm",
    name: "Right Arm",
    meanings: {
      general: "Represents action and initiative",
      fortune: "Success through personal effort",
      love: "Protective and active in relationships",
      career: "Hands-on professions and crafts",
      health: "Upper body strength and dexterity"
    },
    imageCoordinates: { x: 80, y: 45 }
  },
  {
    id: "leftArm",
    name: "Left Arm",
    meanings: {
      general: "Indicates receptivity and support",
      fortune: "Receiving help at crucial moments",
      love: "Being supported in relationships",
      career: "Collaborative ventures and teamwork",
      health: "Importance of accepting help when needed"
    },
    imageCoordinates: { x: 20, y: 45 }
  },
  {
    id: "stomach",
    name: "Stomach",
    meanings: {
      general: "Represents intuition and emotional processing",
      fortune: "Success through trusting instincts",
      love: "Emotionally intuitive relationships",
      career: "Success in counseling or psychology",
      health: "Digestive health connected to emotions"
    },
    imageCoordinates: { x: 50, y: 55 }
  },
  {
    id: "back",
    name: "Back",
    meanings: {
      general: "Represents strength and resilience",
      fortune: "Overcoming obstacles to succeed",
      love: "Supportive backbone in relationships",
      career: "Endurance in challenging fields",
      health: "Posture and spinal health focus"
    },
    imageCoordinates: { x: 50, y: 45 }
  },
  {
    id: "rightLeg",
    name: "Right Leg",
    meanings: {
      general: "Symbolizes forward movement and progress",
      fortune: "Success through persistence",
      love: "Relationships that evolve positively",
      career: "Progressive career path",
      health: "Mobility and circulation focus"
    },
    imageCoordinates: { x: 60, y: 80 }
  },
  {
    id: "leftLeg",
    name: "Left Leg",
    meanings: {
      general: "Represents grounding and stability",
      fortune: "Building lasting wealth",
      love: "Stable, enduring relationships",
      career: "Long-term career success",
      health: "Bone strength and structural health"
    },
    imageCoordinates: { x: 40, y: 80 }
  },
  {
    id: "rightHip",
    name: "Right Hip",
    meanings: {
      general: "Indicates fertility and creativity",
      fortune: "Prosperity through creative endeavors",
      love: "Fulfilling family relationships",
      career: "Success in creative or nurturing fields",
      health: "Reproductive health focus"
    },
    femaleSpecific: "Enhanced fertility and maternal instincts",
    imageCoordinates: { x: 65, y: 65 }
  },
  {
    id: "leftHip",
    name: "Left Hip",
    meanings: {
      general: "Represents balance and harmony",
      fortune: "Well-balanced prosperity",
      love: "Harmonious home and family life",
      career: "Work-life balance success",
      health: "Hormonal balance importance"
    },
    imageCoordinates: { x: 35, y: 65 }
  }
];

export const ancientScriptQuotes = [
  "The mole on the forehead speaks of wisdom beyond years, a mark of those destined for greatness through knowledge.",
  "When the left cheek bears a mark, the gods have blessed one with creative vision that transcends the ordinary.",
  "Samudrika Shastra teaches that a mole upon the right arm signifies one who shall achieve through action what others merely dream.",
  "The ancient texts reveal that those marked upon the chest carry wealth not just of gold, but of spirit and generosity.",
  "A mole upon the back, as the sages tell, reveals strength hidden from view but essential to one's destiny.",
  "The wise ones of old knew that marks upon the stomach indicate one who shall never know true hunger in body or soul.",
  "Marks on the legs, as written in the ancient scrolls, show a path of movement, of journey, both physical and spiritual."
];

// Default analysis for when no specific moles are selected
export const defaultAnalysis: MoleologyAnalysis = {
  overview: "Select mole locations on the body map to receive a personalized analysis based on ancient Indian wisdom.",
  bodyParts: [],
  scriptQuotes: [],
  personalityTraits: [],
  lifePathPrediction: ""
};
