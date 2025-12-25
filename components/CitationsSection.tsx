import React, { useState, useEffect, useCallback, useRef } from 'react';

const impactPoints = [
  {
    id: 'career',
    icon: '🚀',
    label: 'GROWTH',
    title: 'Professional Alignment',
    quote: 'Align your career with your karmic blueprint.',
    desc: 'Stop fighting the tide. Our AI analyzes your astrological 10th house and palmistry "Fate Line" to identify professional paths where you naturally flourish.',
    color: 'from-blue-500 via-indigo-600 to-purple-700',
    glow: 'rgba(59, 130, 246, 0.4)'
  },
  {
    id: 'self',
    icon: '💎',
    label: 'DESTINY',
    title: 'Self-Enrichment',
    quote: 'The data of the soul, decoded.',
    desc: 'From the script of your handwriting to the marks on your skin, we synthesize thousands of data points into a single narrative of personal growth.',
    color: 'from-yellow-400 via-orange-500 to-red-600',
    glow: 'rgba(234, 179, 8, 0.4)'
  },
  {
    id: 'health',
    icon: '🧘',
    label: 'BALANCE',
    title: 'Holistic Well-being',
    quote: 'Tuning your daily vibration.',
    desc: 'Receive AI-generated mantras and mudras tailored to your current cosmic weather, reducing stress and enhancing focus through spiritual technology.',
    color: 'from-emerald-400 via-teal-500 to-cyan-600',
    glow: 'rgba(52, 211, 153, 0.4)'
  },
  {
    id: 'love',
    icon: '💍',
    label: 'UNION',
    title: 'Sacred Connection',
    quote: 'Union beyond the surface.',
    desc: 'Deepen relationships with synastry that goes beyond "likes." Understand the energetic contracts and growth opportunities between souls.',
    color: 'from-pink-500 via-rose-600 to-purple-800',
    glow: 'rgba(236, 72, 153, 0.4)'
  }
];

const CitationsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - left) / width,
      y: (e.clientY - top) / height
    });
  };

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % impactPoints.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + impactPoints.length) % impactPoints.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-40 px-6 overflow-hidden bg-[#02010a] min-h-[900px] flex flex-col justify-center cursor-default"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Nebula Aura */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[160px] opacity-30 pointer-events-none transition-all duration-1000 ease-out"
        style={{ 
          background: `radial-gradient(circle, ${impactPoints[activeIndex].glow} 0%, transparent 70%)`,
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)'
        }}
      ></div>

      {/* Massive Parallax Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span 
          className="text-[40vw] font-black tracking-tighter leading-none text-white/5 whitespace-nowrap transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
          style={{ 
            transform: `translateX(${(mousePos.x - 0.5) * -10}%) translateY(${(mousePos.y - 0.5) * -5}%)`,
            filter: 'blur(20px)'
          }}
        >
          {impactPoints[activeIndex].label}
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-center mb-32">
          <h2 className="text-6xl md:text-8xl font-bold font-playfair text-white mb-8 tracking-tighter">
            Impact of <span className="logo-text-gradient">Infinite Insight</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-2xl font-light opacity-60 italic leading-relaxed">
            "Your life is not a sequence of random events, but a sacred geometry waiting to be solved."
          </p>
        </div>

        {/* 3D Interactive Stack */}
        <div className="relative h-[650px] md:h-[550px] flex items-center justify-center perspective-[2500px]">
          {impactPoints.map((point, i) => {
            const offset = (i - activeIndex + impactPoints.length) % impactPoints.length;
            
            let zIndex = 0;
            let opacity = 0;
            let scale = 0.5;
            let translateX = 0;
            let rotateY = 0;
            let filter = 'blur(15px)';
            
            if (offset === 0) {
              zIndex = 40; opacity = 1; scale = 1.1; translateX = 0; rotateY = (mousePos.x - 0.5) * 15; filter = 'blur(0px)';
            } else if (offset === 1) {
              zIndex = 30; opacity = 0.4; scale = 0.8; translateX = 130; rotateY = -35;
            } else if (offset === impactPoints.length - 1) {
              zIndex = 30; opacity = 0.4; scale = 0.8; translateX = -130; rotateY = 35;
            }

            return (
              <div 
                key={point.id}
                className="absolute w-full max-w-[650px] transition-all duration-1000 cubic-bezier(0.19, 1, 0.22, 1) cursor-pointer"
                style={{
                  zIndex,
                  opacity,
                  transform: `translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg) translateZ(${offset === 0 ? '150px' : '-250px'})`,
                  filter
                }}
                onClick={() => setActiveIndex(i)}
              >
                <div className="relative p-12 md:p-16 rounded-[4rem] border border-white/10 bg-slate-950/80 backdrop-blur-3xl shadow-[0_50px_120px_rgba(0,0,0,0.9)] overflow-hidden group">
                  {/* Energy Aura Pulse */}
                  <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-10 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-to-br ${point.color}`}></div>

                  <div className="flex items-start justify-between mb-12">
                    <div className="text-9xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      {point.icon}
                    </div>
                    <div className="text-right">
                       <span className="text-[12px] tracking-[0.5em] font-black text-white/30 uppercase block mb-3">Impact Vector</span>
                       <span className={`text-sm font-bold px-5 py-2 rounded-full border border-white/10 bg-white/5 text-gray-400`}>
                          NODE_0{i + 1}
                       </span>
                    </div>
                  </div>

                  <h3 className="text-5xl font-bold text-white mb-8 font-playfair tracking-tighter">{point.title}</h3>
                  
                  <div className="relative mb-10 pl-8 border-l-4 border-yellow-500/40">
                    <p className="text-yellow-400 text-3xl font-medium leading-tight">
                      "{point.quote}"
                    </p>
                  </div>

                  <p className="text-gray-300 text-2xl leading-relaxed mb-12 font-extralight tracking-wide">
                    {point.desc}
                  </p>

                  <div className="flex items-center gap-8 pt-12 border-t border-white/5">
                    <div className="flex-grow h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full bg-gradient-to-r ${point.color} w-[85%] group-hover:w-full transition-all duration-[2500ms]`}></div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308] animate-pulse"></div>
                        <span className="text-[12px] font-black text-gray-500 tracking-[0.3em] uppercase">Sync Level 98%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cinematic Nav */}
        <div className="flex flex-col items-center gap-12 mt-32">
          <div className="flex items-center gap-8">
            <button onClick={prevSlide} className="w-18 h-18 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all active:scale-90 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <div className="flex gap-5">
              {impactPoints.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-700 ${activeIndex === i ? 'w-24 bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.8)]' : 'w-5 bg-white/10 hover:bg-white/30'}`}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="w-18 h-18 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all active:scale-90 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
            {['Vedic Engine', 'Neural Flow', 'Soul Mapping', 'Pranic Logic'].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                <span className="text-[13px] font-black text-white uppercase tracking-[0.4em]">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitationsSection;