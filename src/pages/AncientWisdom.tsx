
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AIChatBox from '@/components/AIChatBox';

const AncientWisdom = () => {
  return (
    <div className="min-h-screen bg-cosmic-midnight text-white">
      <Navbar />
      
      <main className="pt-20 pb-16"> {/* Add padding-top to account for fixed navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="py-8 md:py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 star-field opacity-20"></div>
            <div className="absolute inset-0 bg-cosmic-radial opacity-10"></div>
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-glow">
                <span className="text-white">Ancient</span>{" "}
                <span className="text-cosmic-gold">Wisdom</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore the profound knowledge of ancient Indian texts, philosophies, and cosmic 
                sciences that have guided spiritual seekers for millennia.
              </p>
            </div>
          </section>

          {/* Tabs Section */}
          <section className="mb-16">
            <Tabs defaultValue="vedas" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-cosmic-deep-purple/30">
                <TabsTrigger value="vedas">The Vedas</TabsTrigger>
                <TabsTrigger value="upanishads">Upanishads</TabsTrigger>
                <TabsTrigger value="ayurveda">Ayurveda</TabsTrigger>
                <TabsTrigger value="dharma">Dharma & Karma</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vedas" className="mt-6">
                <Card className="bg-cosmic-deep-purple/20 border-cosmic-gold/30 p-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-cosmic-gold">The Vedas: Ancient Knowledge</h2>
                    <p className="text-gray-300">
                      The Vedas are the oldest sacred texts of Hinduism, composed between 1500 and 500 BCE. 
                      These ancient scriptures contain hymns, philosophical discussions, and instructions for rituals.
                    </p>
                    
                    <h3 className="text-xl text-cosmic-bright-purple mt-6">The Four Vedas</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Rigveda</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Contains hymns to the deities, philosophical discussions, and information about ancient 
                          Indian society. It is the oldest of the Vedas, with over 1,000 hymns dedicated 
                          to various deities.
                        </p>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Samaveda</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Consists of melodies and chants for liturgical purposes. Many of its verses are 
                          taken from the Rigveda but set to music for ritual singing during ceremonies.
                        </p>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Yajurveda</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Focuses on liturgy, ritual offerings, and formulas to be used during 
                          sacrificial ceremonies. It contains prose mantras and explanations of rituals.
                        </p>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Atharvaveda</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Contains spells, charms, and incantations for healing, prolonging life, 
                          and protection against enemies. It also includes philosophical speculations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-cosmic-gold/20 pt-6">
                      <h3 className="text-xl text-cosmic-bright-purple">Vedic Wisdom in Modern Life</h3>
                      <p className="text-gray-300 mt-2">
                        The Vedas contain timeless insights about the nature of reality, consciousness, and 
                        the universe. Many of these ancient ideas are now being validated by modern science, 
                        including concepts of quantum physics, the interconnectedness of all life, and the 
                        power of consciousness to influence reality.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="upanishads" className="mt-6">
                <Card className="bg-cosmic-deep-purple/20 border-cosmic-gold/30 p-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-cosmic-gold">Upanishads: The Path to Self-Realization</h2>
                    <p className="text-gray-300">
                      The Upanishads are a collection of philosophical texts that form the theoretical basis for 
                      the Hindu religion. They contain discussions on the nature of reality, consciousness, the self (Atman), 
                      and the ultimate reality (Brahman).
                    </p>
                    
                    <h3 className="text-xl text-cosmic-bright-purple mt-6">Key Concepts</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Brahman & Atman</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Brahman is the ultimate reality, the cosmic consciousness that pervades everything. 
                          Atman is the individual soul or self. The central realization in the Upanishads is 
                          "Aham Brahmasmi" (I am Brahman) – the understanding that one's true self (Atman) is 
                          identical with the ultimate reality (Brahman).
                        </p>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Maya</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Maya refers to the illusory nature of the world. It is not that the world doesn't exist, 
                          but rather that we don't see it as it truly is. Our perception is veiled by ignorance (avidya) 
                          which causes us to see separation where there is unity.
                        </p>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Samsara</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Samsara is the cycle of birth, death, and rebirth. According to the Upanishads, 
                          the soul is bound to this cycle due to karma (actions) and the resulting attachment 
                          to the fruits of those actions.
                        </p>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Moksha</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Moksha is liberation from the cycle of rebirth and the realization of one's true nature. 
                          It is achieved through self-knowledge, detachment from the fruits of action, and the 
                          direct experience of the unity of all existence.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-cosmic-gold/20 pt-6">
                      <h3 className="text-xl text-cosmic-bright-purple">Famous Upanishadic Sayings</h3>
                      <div className="space-y-4 mt-4">
                        <div className="bg-cosmic-midnight/40 p-4 rounded-lg italic text-center">
                          <p className="text-cosmic-gold">"Tat Tvam Asi"</p>
                          <p className="text-gray-300 text-sm mt-1">"That Thou Art" – You are one with the ultimate reality</p>
                        </div>
                        <div className="bg-cosmic-midnight/40 p-4 rounded-lg italic text-center">
                          <p className="text-cosmic-gold">"Aham Brahmasmi"</p>
                          <p className="text-gray-300 text-sm mt-1">"I am Brahman" – Recognition of one's divine nature</p>
                        </div>
                        <div className="bg-cosmic-midnight/40 p-4 rounded-lg italic text-center">
                          <p className="text-cosmic-gold">"Prajnanam Brahma"</p>
                          <p className="text-gray-300 text-sm mt-1">"Consciousness is Brahman" – Pure awareness is the ultimate reality</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="ayurveda" className="mt-6">
                <Card className="bg-cosmic-deep-purple/20 border-cosmic-gold/30 p-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-cosmic-gold">Ayurveda: Science of Life</h2>
                    <p className="text-gray-300">
                      Ayurveda is one of the world's oldest holistic healing systems, developed more than 3,000 
                      years ago in India. It's based on the belief that health and wellness depend on a delicate 
                      balance between the mind, body, and spirit.
                    </p>
                    
                    <h3 className="text-xl text-cosmic-bright-purple mt-6">The Three Doshas</h3>
                    <p className="text-gray-300">
                      According to Ayurveda, five elements make up the universe: Space (Akasha), Air (Vayu), 
                      Fire (Tejas), Water (Jala), and Earth (Prithvi). These elements combine in the human body 
                      to form three life forces or energies, called doshas.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Vata (Space + Air)</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Controls movement, breathing, circulation, and other bodily functions. 
                          People with dominant Vata tend to be thin, creative, and quick-thinking,
                          but can become anxious or ungrounded when out of balance.
                        </p>
                        <div className="mt-3">
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1 mr-1">Creative</span>
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1 mr-1">Quick</span>
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1">Changeable</span>
                        </div>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Pitta (Fire + Water)</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Governs digestion, metabolism, and energy production. Pitta-dominant 
                          individuals are often intelligent, focused, and ambitious but may become
                          irritable or overly critical when imbalanced.
                        </p>
                        <div className="mt-3">
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1 mr-1">Sharp</span>
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1 mr-1">Intense</span>
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1">Precise</span>
                        </div>
                      </div>
                      <div className="bg-cosmic-midnight/60 p-4 rounded-lg">
                        <h4 className="font-medium text-cosmic-gold">Kapha (Water + Earth)</h4>
                        <p className="text-sm text-gray-300 mt-2">
                          Maintains structure, lubrication, and provides strength and stability. 
                          Kapha types are typically strong, calm, and loyal but can become sluggish 
                          or resistant to change when out of balance.
                        </p>
                        <div className="mt-3">
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1 mr-1">Steady</span>
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1 mr-1">Patient</span>
                          <span className="bg-cosmic-bright-purple/20 text-xs rounded px-2 py-1">Nurturing</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t border-cosmic-gold/20 pt-6">
                      <h3 className="text-xl text-cosmic-bright-purple">Ayurvedic Principles for Modern Life</h3>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-cosmic-midnight/40 p-4 rounded-lg">
                          <h4 className="text-cosmic-gold">Daily Routine (Dinacharya)</h4>
                          <p className="text-sm text-gray-300 mt-2">
                            Establishing regular routines aligned with natural cycles helps maintain dosha balance. 
                            This includes waking with the sun, eating meals at regular times, and sleeping by 10 PM.
                          </p>
                        </div>
                        <div className="bg-cosmic-midnight/40 p-4 rounded-lg">
                          <h4 className="text-cosmic-gold">Seasonal Living (Ritucharya)</h4>
                          <p className="text-sm text-gray-300 mt-2">
                            Adapting lifestyle and diet according to the seasons helps prevent dosha imbalances. 
                            For example, warming foods in winter and cooling foods in summer maintain harmony with nature.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="dharma" className="mt-6">
                <Card className="bg-cosmic-deep-purple/20 border-cosmic-gold/30 p-6">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-cosmic-gold">Dharma & Karma: The Cosmic Law</h2>
                    <p className="text-gray-300">
                      Dharma and Karma are foundational concepts in Indian philosophy that explain the moral and cosmic 
                      order of the universe and the consequences of our actions.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="text-xl text-cosmic-bright-purple">Dharma: The Path of Righteousness</h3>
                        <p className="text-gray-300 mt-2">
                          Dharma refers to the moral order that sustains the universe, society, and the individual. 
                          It encompasses duties, rights, laws, conduct, virtues, and the "right way of living."
                        </p>
                        
                        <div className="bg-cosmic-midnight/60 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-cosmic-gold">Types of Dharma</h4>
                          <ul className="text-sm text-gray-300 mt-2 space-y-2">
                            <li><span className="text-cosmic-gold">Sanatana Dharma:</span> The eternal order that governs the cosmic universe</li>
                            <li><span className="text-cosmic-gold">Samanya Dharma:</span> Universal duties applicable to all humans (truthfulness, non-violence, etc.)</li>
                            <li><span className="text-cosmic-gold">Vishesha Dharma:</span> Specific duties based on one's social position, age, and capabilities</li>
                            <li><span className="text-cosmic-gold">Sva-dharma:</span> Personal duty based on one's inner nature and capabilities</li>
                          </ul>
                        </div>
                        
                        <div className="bg-cosmic-midnight/60 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-cosmic-gold">The Four Aims of Life (Purusharthas)</h4>
                          <ul className="text-sm text-gray-300 mt-2 space-y-2">
                            <li><span className="text-cosmic-gold">Dharma:</span> Righteousness, moral values</li>
                            <li><span className="text-cosmic-gold">Artha:</span> Prosperity, economic values</li>
                            <li><span className="text-cosmic-gold">Kama:</span> Pleasure, love, psychological values</li>
                            <li><span className="text-cosmic-gold">Moksha:</span> Liberation, spiritual values</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl text-cosmic-bright-purple">Karma: The Law of Cause and Effect</h3>
                        <p className="text-gray-300 mt-2">
                          Karma refers to the spiritual principle of cause and effect where intent and actions of an 
                          individual (cause) influence their future (effect). Good intent and good deeds contribute to good 
                          karma and happier rebirths, while bad intent and bad deeds contribute to bad karma and bad rebirths.
                        </p>
                        
                        <div className="bg-cosmic-midnight/60 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-cosmic-gold">Types of Karma</h4>
                          <ul className="text-sm text-gray-300 mt-2 space-y-2">
                            <li><span className="text-cosmic-gold">Sanchita Karma:</span> Accumulated karma from past lives</li>
                            <li><span className="text-cosmic-gold">Prarabdha Karma:</span> Portion of Sanchita karma currently being experienced</li>
                            <li><span className="text-cosmic-gold">Kriyamana Karma:</span> Karma being created in the present lifetime</li>
                            <li><span className="text-cosmic-gold">Agami Karma:</span> Future karma being created by current actions</li>
                          </ul>
                        </div>
                        
                        <div className="bg-cosmic-midnight/60 p-4 rounded-lg mt-4">
                          <h4 className="font-medium text-cosmic-gold">Karma and Liberation</h4>
                          <p className="text-sm text-gray-300 mt-2">
                            Liberation (Moksha) is achieved when one transcends karma through self-knowledge, 
                            detachment, and selfless action. The Bhagavad Gita teaches the path of Karma Yoga - 
                            performing one's duty without attachment to the results, dedicated to the Divine.
                          </p>
                          <p className="text-sm text-gray-300 mt-2 italic">
                            "You have a right to perform your prescribed duties, but you are not entitled to the 
                            fruits of your actions." - Bhagavad Gita 2.47
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
          
          {/* Chat with Guru Section */}
          <section className="mb-16">
            <Card className="max-w-4xl mx-auto bg-cosmic-deep-purple/20 backdrop-blur-sm p-6 rounded-lg border-cosmic-gold/30">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif mb-3 text-cosmic-gold">Ask the Cosmic Guru</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Explore the depths of ancient wisdom by asking our AI Guru about the Vedas, Upanishads, 
                  Ayurveda, Dharma, Karma, or any other aspect of ancient Indian knowledge.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div className="p-4 rounded-lg bg-cosmic-deep-purple/10 backdrop-blur-sm">
                  <h3 className="font-medium text-cosmic-gold mb-2">Sample Questions</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>📜 "What do the Vedas say about meditation?"</li>
                    <li>🧘‍♀️ "Explain the concept of dharma in daily life"</li>
                    <li>🌿 "How can I balance my doshas according to Ayurveda?"</li>
                    <li>⭐ "What is the relationship between karma and free will?"</li>
                    <li>🕉️ "How can I begin practicing self-inquiry as mentioned in the Upanishads?"</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-cosmic-deep-purple/10 backdrop-blur-sm">
                  <h3 className="font-medium text-cosmic-gold mb-2">Areas of Ancient Wisdom</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>📚 Vedic Knowledge & Philosophy</li>
                    <li>🧠 Consciousness & Self-Realization</li>
                    <li>🌿 Ayurvedic Health & Wellness</li>
                    <li>⚖️ Dharma & Ethical Living</li>
                    <li>🔄 Karma & Cosmic Cycles</li>
                  </ul>
                </div>
              </div>

              <AIChatBox />
            </Card>
          </section>
          
          {/* Quote Section */}
          <section className="mb-16">
            <div className="bg-cosmic-deep-purple/20 backdrop-blur-sm p-8 rounded-lg text-center border border-cosmic-gold/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-cosmic-radial opacity-10"></div>
              <div className="relative z-10">
                <p className="text-2xl text-cosmic-gold italic mb-4">
                  "The Self is the constant witness of all states of consciousness"
                </p>
                <p className="text-gray-300">
                  — The Upanishads
                </p>
              </div>
            </div>
          </section>
          
          {/* Further Reading Section */}
          <section>
            <h2 className="text-2xl font-serif text-cosmic-gold mb-6 text-center">Further Exploration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-cosmic-midnight/60 p-6 rounded-lg border border-cosmic-bright-purple/20">
                <h3 className="text-lg font-medium text-cosmic-bright-purple mb-4">Sacred Texts</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Bhagavad Gita</li>
                  <li>• Upanishads Collection</li>
                  <li>• Yoga Sutras of Patanjali</li>
                  <li>• Charaka Samhita (Ayurveda)</li>
                  <li>• Brahma Sutras</li>
                </ul>
              </div>
              <div className="bg-cosmic-midnight/60 p-6 rounded-lg border border-cosmic-bright-purple/20">
                <h3 className="text-lg font-medium text-cosmic-bright-purple mb-4">Meditation Practices</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Transcendental Meditation</li>
                  <li>• Vipassana</li>
                  <li>• Yoga Nidra</li>
                  <li>• Mantra Meditation</li>
                  <li>• Self-Inquiry (Atma Vichara)</li>
                </ul>
              </div>
              <div className="bg-cosmic-midnight/60 p-6 rounded-lg border border-cosmic-bright-purple/20">
                <h3 className="text-lg font-medium text-cosmic-bright-purple mb-4">Modern Applications</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Mindfulness in Daily Life</li>
                  <li>• Ayurvedic Wellness Routines</li>
                  <li>• Dharmic Business Ethics</li>
                  <li>• Conscious Living Practices</li>
                  <li>• Yogic Psychology</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AncientWisdom;
