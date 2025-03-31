
import { useState, useEffect } from 'react';

type Testimonial = {
  id: number;
  name: string;
  location: string;
  text: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Arjun Patel",
    location: "Mumbai, India",
    text: "The Astrology AI predictions were remarkably accurate. It provided insights about my career that aligned perfectly with my life path. I'm truly impressed!",
    avatar: "AP",
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi, India",
    text: "I was skeptical at first, but the palmistry analysis revealed things about my personality that even my close friends don't know. This is truly ancient wisdom meets modern technology.",
    avatar: "PS",
  },
  {
    id: 3,
    name: "Raj Malhotra",
    location: "Bangalore, India",
    text: "The zodiac compatibility tool helped me understand my relationship dynamics better. The remedies suggested have brought positive changes in my marriage life.",
    avatar: "RM",
  },
  {
    id: 4,
    name: "Ananya Desai",
    location: "Pune, India",
    text: "The Ancient Wisdom AI gave me practical spiritual guidance that has transformed my daily routine. The mantras suggested have helped with my anxiety issues significantly.",
    avatar: "AD",
  },
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-cosmic-midnight relative overflow-hidden">
      <div className="absolute inset-0 bg-cosmic-radial opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-glow">
          <span className="text-white">Cosmic Insights from</span>{" "}
          <span className="text-cosmic-gold">Our Community</span>
        </h2>
        
        <div className="relative">
          <div className="max-w-3xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-opacity duration-500 absolute inset-0 ${
                  index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="bg-cosmic-deep-purple/20 backdrop-blur-sm p-8 rounded-lg border border-cosmic-deep-purple/30">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-cosmic-gold text-cosmic-midnight flex items-center justify-center font-bold text-lg mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.location}</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-300 text-lg italic relative">
                    <span className="absolute -top-2 -left-2 text-4xl text-cosmic-gold opacity-50">"</span>
                    {testimonial.text}
                    <span className="absolute -bottom-6 -right-2 text-4xl text-cosmic-gold opacity-50">"</span>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex
                    ? "bg-cosmic-gold"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
