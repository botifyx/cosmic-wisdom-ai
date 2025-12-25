import React, { useRef } from 'react';

const testimonials = [
  {
    name: 'Anika S.',
    location: 'Bangalore, IN',
    feature: 'Mantra Generator',
    text: "I was feeling so lost about my career. The mantra Taintra generated... I can't explain it, but chanting it every morning has brought me so much clarity. The audio pronunciation was a huge help! It feels so personal and powerful."
  },
  {
    name: 'Liam T.',
    location: 'New York, USA',
    feature: 'Cosmic Tattoo Maker',
    text: "I've wanted a meaningful tattoo for years. I did my astrology reading, and the AI designed a prompt that was pure magic. It captured my soul. My tattoo artist was blown away by the concept and said it was one of the most unique ideas he'd ever worked on."
  },
  {
    name: 'Sofia R.',
    location: 'Madrid, ES',
    feature: 'Cosmic Mudra Suggestion',
    text: "After my palm reading, the app suggested a specific Hand Mudra. I've been practicing it during meditation, and the sense of calm is incredible. It feels like a secret superpower that's tailored just for me. This feature is unlike anything I've ever seen."
  },
  {
    name: 'Kenji M.',
    location: 'Tokyo, JP',
    feature: 'Vedic Astrology',
    text: "The astrology report was shockingly detailed and accurate. It wasn't just generic advice; it felt like it truly understood my chart. Taintra is my daily dose of cosmic wisdom now. The AI Guru, Gufy, is such a fun companion!"
  },
  {
    name: 'Fatima Z.',
    location: 'Dubai, UAE',
    feature: 'Sacred Union Insights',
    text: "My partner and I explored the Sacred Union feature, and it opened up such beautiful conversations for us. The guidance was respectful, profound, and helped us understand our connection on a much deeper, spiritual level."
  },
  {
    name: 'David C.',
    location: 'London, UK',
    feature: 'Handwriting Analysis',
    text: "I was skeptical about handwriting analysis, but I'm a believer now. The insights into my personality were spot-on. It's fascinating how much our inner script reveals. The tattoo suggestion based on it was a genius touch!"
  },
];

const TestimonialCard: React.FC<{ testimonial: typeof testimonials[0], index: number }> = ({ testimonial, index }) => {
    return (
        <div
            className="testimonial-card flex-shrink-0 w-full sm:w-[45%] lg:w-[31%] flex flex-col p-6 text-left"
            style={{ animation: `fadeInUp 0.5s ${index * 0.1}s both`, scrollSnapAlign: 'start' }}
        >
            <div className="quote-icon">“</div>
            <div className="relative z-10 flex flex-col h-full">
                <div className="w-full pb-3 mb-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-yellow-400">{testimonial.feature}</p>
                        <div className="star-rating text-yellow-400">
                            {'★★★★★'.split('').map((star, i) => <span key={i}>{star}</span>)}
                        </div>
                    </div>
                </div>
                <p className="text-gray-300 italic text-base leading-relaxed flex-grow">"{testimonial.text}"</p>
                <div className="mt-6 text-right w-full">
                    <div className="flex justify-end items-center gap-2">
                        <p className="font-bold text-white">{testimonial.name}</p>
                        <span className="verified-badge text-xs font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>
                            Verified Seeker
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{testimonial.location}</p>
                </div>
            </div>
        </div>
    );
};

const Testimonials = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.9;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="mt-24 py-16 bg-black/20">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-playfair text-white">Whispers from Our Community</h2>
                    <p className="mt-2 text-gray-400 mb-12 max-w-3xl mx-auto">See how seekers from around the world are connecting with their cosmic selves through Taintra.</p>
                </div>
                <div className="testimonial-carousel-container">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-8 pb-8 hide-scrollbar"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} testimonial={testimonial} index={index} />
                        ))}
                    </div>
                    <button onClick={() => scroll('left')} className="scroll-arrow left -translate-x-4" aria-label="Scroll left">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="scroll-arrow right translate-x-4" aria-label="Scroll right">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-yellow-400"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;