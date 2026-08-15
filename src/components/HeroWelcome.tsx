import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Heart, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeroWelcomeProps {
  onStartQuiz: () => void;
  onOpenGallery?: () => void;
  onOpenRecoveryRoom?: () => void;
}

interface NavItem {
  title: string;
  items?: { label: string; action?: () => void }[];
  action?: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onStartQuiz, onOpenGallery, onOpenRecoveryRoom }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  // 3D Card Tilt State
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glowX: 50, glowY: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rx = ((y - centerY) / centerY) * -12;
    const ry = ((x - centerX) / centerX) * 12;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ rx, ry, glowX, glowY });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  };

  const handleStart = () => {
    soundEngine.playPageSwitch();
    onStartQuiz();
  };

  const handleGallery = () => {
    soundEngine.playPageSwitch();
    if (onOpenGallery) onOpenGallery();
    else onStartQuiz();
  };

  const handleRecovery = () => {
    soundEngine.playPageSwitch();
    if (onOpenRecoveryRoom) onOpenRecoveryRoom();
  };

  const navItems: NavItem[] = [
    {
      title: 'Memories',
      items: [
        { label: 'Our Story Timeline', action: handleStart },
        { label: 'Our First Date', action: handleStart },
        { label: 'Memory Museum', action: handleGallery },
      ],
    },
    {
      title: 'Interactive',
      items: [
        { label: 'Love Terminal', action: handleStart },
        { label: 'Love DNA Scanner', action: handleStart },
        { label: 'LoveGPT Chatbot', action: handleStart },
        { label: 'Enchanted Garden 🌸', action: handleStart },
        ...(onOpenRecoveryRoom ? [{ label: "Dhvani's Recovery Room ❤️", action: handleRecovery }] : []),
      ],
    },
    {
      title: 'About Us',
      items: [
        { label: 'Handcrafted by Om', action: handleStart },
        { label: 'Dedicated to Dhvani', action: handleStart },
        { label: 'Lifetime License ♾️', action: handleStart },
      ],
    },
    {
      title: 'Our Gallery 🖼️',
      action: handleGallery,
    },
    ...(onOpenRecoveryRoom
      ? [
          {
            title: 'Recovery Room ❤️',
            action: handleRecovery,
          },
        ]
      : []),
  ];

  return (
    <section className="min-h-screen w-full overflow-hidden relative font-sans flex flex-col justify-between select-none bg-[#0f051d]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 filter saturate-150 contrast-110"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4"
      />

      {/* Luxury Gradient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f051d]/90 via-[#0f051d]/60 to-[#0f051d]/95 z-0 pointer-events-none" />

      {/* Floating Petals & Butterflies */}
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={`hero-petal-${i}`}
          className="absolute pointer-events-none animate-petal-fall"
          style={{
            left: `${(i * 7) % 95}%`,
            top: '-5%',
            animationDelay: `${i * 0.9}s`,
            animationDuration: `${12 + (i % 5) * 2}s`,
            zIndex: 2,
          }}
        >
          <div
            className="w-3 h-4 rounded-full opacity-60 filter blur-[0.3px]"
            style={{
              background: ['#f7e7ce', '#fadadd', '#f8c8dc', '#b76e79'][i % 4],
              transform: `rotate(${i * 45}deg)`,
            }}
          />
        </div>
      ))}

      {/* Top Floating Glass Navigation */}
      <nav className="w-full px-5 sm:px-6 md:px-12 lg:px-16 py-4 sm:py-5 flex items-center justify-between z-20 relative backdrop-blur-xl bg-[#0f051d]/60 border-b border-[#f7e7ce]/15">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleStart}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b76e79] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105 transition-all">
            <div className="w-full h-full rounded-full bg-[#0f051d] flex items-center justify-center">
              <span className="text-sm">👑</span>
            </div>
          </div>
          <span className="text-white text-lg sm:text-xl font-serif-luxury font-medium tracking-wide flex items-center gap-1.5">
            Relationship<span className="text-[#f7e7ce] font-bold">OS</span>
            <span className="text-rose-400">❤️</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => item.items && setActiveDropdown(item.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => {
                  if (item.action) item.action();
                }}
                className="text-pink-100/90 hover:text-[#f7e7ce] text-sm font-serif-luxury tracking-wide transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <span>{item.title}</span>
                {item.items && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#d4af37] transition-transform duration-200 ${
                      activeDropdown === item.title ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Dropdown Menu */}
              {item.items && activeDropdown === item.title && (
                <div className="!absolute top-full left-0 glass-card-luxury bg-[#0f051d]/95 rounded-2xl py-3 px-2 min-w-[190px] shadow-2xl z-30 mt-2 border border-[#f7e7ce]/30 backdrop-blur-2xl">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.label}
                      onClick={() => {
                        soundEngine.playClick();
                        if (subItem.action) subItem.action();
                        else handleStart();
                      }}
                      className="text-slate-200 hover:text-[#f7e7ce] hover:bg-white/10 text-xs font-serif-luxury rounded-xl block px-3.5 py-2.5 transition-colors cursor-pointer"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleStart}
            className="text-pink-100/90 hover:text-[#f7e7ce] text-xs font-serif-luxury font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Welcome Dhvani</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </button>

          <button
            onClick={handleGallery}
            className="glass-pill rounded-full px-5 py-2 text-[#f7e7ce] text-xs font-serif-luxury font-medium hover:bg-white/15 transition-all cursor-pointer flex items-center gap-2 border border-[#f7e7ce]/30 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
          >
            <ImageIcon className="w-4 h-4 text-[#d4af37]" />
            <span>Our Gallery 🖼️</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsMobileMenuOpen(!isMobileMenuOpen);
          }}
          className="md:hidden text-white p-2 focus:outline-none z-30"
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <Menu
              className={`w-6 h-6 absolute transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'
              }`}
            />
            <X
              className={`w-6 h-6 absolute transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 -rotate-90'
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-16 left-4 right-4 bg-[#0f051d]/95 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl z-30 border border-[#f7e7ce]/30"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <div key={item.title} className="space-y-2">
                  <button
                    onClick={() => {
                      if (item.action) {
                        setIsMobileMenuOpen(false);
                        item.action();
                      } else {
                        setExpandedMobileCategory(
                          expandedMobileCategory === item.title ? null : item.title
                        );
                      }
                    }}
                    className="w-full flex items-center justify-between text-white font-serif-luxury text-base py-1 cursor-pointer"
                  >
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronDown
                        className={`w-4 h-4 text-[#d4af37] transition-transform duration-200 ${
                          expandedMobileCategory === item.title ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {item.items && expandedMobileCategory === item.title && (
                    <div className="pl-4 space-y-2 border-l border-[#f7e7ce]/20 my-1">
                      {item.items.map((sub) => (
                        <a
                          key={sub.label}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            if (sub.action) sub.action();
                            else handleStart();
                          }}
                          className="block text-pink-200/80 hover:text-[#f7e7ce] text-xs py-1 cursor-pointer"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-[#f7e7ce]/20 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleStart();
                  }}
                  className="w-full text-center text-white/90 hover:text-white font-serif-luxury text-sm py-2 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Welcome Dhvani</span>
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleGallery();
                  }}
                  className="w-full glass-pill rounded-full py-2.5 text-center text-[#f7e7ce] text-xs font-serif-luxury cursor-pointer flex items-center justify-center gap-2 border border-[#f7e7ce]/30"
                >
                  <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                  <span>Visit Our Gallery 🖼️</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Hero Main Content with 3D Tilt Card Centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Heading & Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center md:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#f7e7ce]/30 text-[#f7e7ce] text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>HANDCRAFTED FOR DHVANI</span>
            </div>

            <h1 className="text-[#fdfbf7] font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Bridging every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7e7ce] via-[#fadadd] to-[#d4af37]">
                distance.
              </span>
            </h1>

            {/* Handwritten Quote Layered */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-handwritten text-xl sm:text-2xl text-[#f7e7ce] leading-relaxed"
            >
              "Distance means so little when someone means so much. Handcrafted with all my love, Om ❤️"
            </motion.p>

            <p className="text-pink-100/80 text-xs sm:text-sm leading-relaxed font-body max-w-md">
              RelationshipOS unifies every memory, milestone, and message so we spend less energy on the miles and more on true togetherness.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={handleStart}
                className="px-7 py-3.5 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b76e79] text-[#0f051d] text-sm font-semibold rounded-full hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all active:scale-95 cursor-pointer flex items-center gap-2 font-serif-luxury"
              >
                <span>Begin Our Journey ❤️</span>
                <ArrowRight className="w-4 h-4 text-[#0f051d]" />
              </button>

              <button
                onClick={handleGallery}
                className="px-7 py-3.5 glass-button rounded-full text-[#f7e7ce] text-sm font-semibold hover:bg-white/15 transition-all active:scale-95 cursor-pointer flex items-center gap-2 border border-[#f7e7ce]/40 font-serif-luxury"
              >
                <span>Our Gallery 🖼️</span>
                <Sparkles className="w-4 h-4 text-[#e5c158] animate-spin" style={{ animationDuration: '6s' }} />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Centerpiece Photo with 3D Tilt & Glass Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, type: 'spring', stiffness: 90 }}
            className="flex justify-center"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-72 sm:w-80 md:w-88 aspect-[3/4] rounded-3xl p-3 glass-card-luxury border-2 border-[#f7e7ce]/40 shadow-[0_30px_90px_rgba(212,175,55,0.25)] transition-transform duration-200 ease-out cursor-pointer group"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              }}
              onClick={handleGallery}
            >
              {/* Soft Lighting Reflection Overlay */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)`,
                }}
              />

              {/* Photo Frame */}
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                <img
                  src="/gallery/photo6.jpg"
                  alt="Om & Dhvani"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating handwritten caption over photo */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-center">
                  <span className="font-handwritten text-lg text-[#f7e7ce] drop-shadow">
                    "Our First Date Under Starlit Trees ✨"
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroWelcome;
