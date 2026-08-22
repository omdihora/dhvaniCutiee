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

    const rx = ((y - centerY) / centerY) * -14;
    const ry = ((x - centerX) / centerX) * 14;

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
    soundEngine.playHeartbeat();
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
    <section className="min-h-screen w-full overflow-hidden relative font-sans flex flex-col justify-between select-none bg-[#090214]">
      {/* Cinematic Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 filter saturate-150 contrast-115"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4"
      />

      {/* Luxury Gradient Vignette Overlay & Atmospheric Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090214]/90 via-[#090214]/65 to-[#090214]/95 z-0 pointer-events-none" />

      {/* Floating Stardust Petals */}
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={`hero-petal-${i}`}
          className="absolute pointer-events-none animate-petal-fall"
          style={{
            left: `${(i * 6.5) % 96}%`,
            top: '-5%',
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${12 + (i % 5) * 2}s`,
            zIndex: 2,
          }}
        >
          <div
            className="w-3.5 h-4.5 rounded-full opacity-70 filter blur-[0.2px] shadow-[0_0_10px_rgba(255,215,0,0.5)]"
            style={{
              background: ['#ffd700', '#f7e7ce', '#ff2e8c', '#fadadd'][i % 4],
              transform: `rotate(${i * 45}deg)`,
            }}
          />
        </div>
      ))}

      {/* Top Floating Holographic Glass Navigation */}
      <nav className="w-full px-4 sm:px-6 md:px-12 lg:px-16 py-3.5 sm:py-4 flex items-center justify-between z-20 relative backdrop-blur-2xl bg-[#090214]/75 border-b border-amber-400/25">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={handleStart}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 via-rose-400 to-pink-500 p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:scale-110 transition-all">
            <div className="w-full h-full rounded-full bg-[#090214] flex items-center justify-center">
              <span className="text-sm">👑</span>
            </div>
          </div>
          <span className="text-white text-lg sm:text-xl font-serif-luxury font-medium tracking-wide flex items-center gap-1.5">
            Relationship<span className="text-amber-300 font-bold">OS</span>
            <span className="text-rose-400 animate-pulse">❤️</span>
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
                className="text-pink-100/90 hover:text-amber-300 text-sm font-serif-luxury tracking-wide transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <span>{item.title}</span>
                {item.items && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-amber-400 transition-transform duration-200 ${
                      activeDropdown === item.title ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Dropdown Menu */}
              {item.items && activeDropdown === item.title && (
                <div className="!absolute top-full left-0 glass-card-3d bg-[#0d031c]/95 rounded-2xl py-3 px-2 min-w-[190px] shadow-2xl z-30 mt-2 border border-amber-400/35 backdrop-blur-2xl">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.label}
                      onClick={() => {
                        soundEngine.playClick();
                        if (subItem.action) subItem.action();
                        else handleStart();
                      }}
                      className="text-slate-200 hover:text-amber-200 hover:bg-white/10 text-xs font-serif-luxury rounded-xl block px-3.5 py-2.5 transition-colors cursor-pointer"
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
            className="text-pink-100/90 hover:text-amber-300 text-xs font-serif-luxury font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Welcome Dhvani</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
          </button>

          <button
            onClick={handleGallery}
            className="glass-pill rounded-full px-5 py-2 text-amber-200 text-xs font-serif-luxury font-semibold hover:bg-white/15 transition-all cursor-pointer flex items-center gap-2 border border-amber-400/35 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
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
            className="md:hidden absolute top-16 left-4 right-4 bg-[#0d031c]/95 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl z-30 border border-amber-400/35"
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
                        className={`w-4 h-4 text-amber-400 transition-transform duration-200 ${
                          expandedMobileCategory === item.title ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {item.items && expandedMobileCategory === item.title && (
                    <div className="pl-4 space-y-2 border-l border-amber-400/20 my-1">
                      {item.items.map((sub) => (
                        <a
                          key={sub.label}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            if (sub.action) sub.action();
                            else handleStart();
                          }}
                          className="block text-pink-200/80 hover:text-amber-200 text-xs py-1 cursor-pointer"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-amber-400/20 flex flex-col space-y-3">
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
                  className="w-full glass-pill rounded-full py-2.5 text-center text-amber-200 text-xs font-serif-luxury cursor-pointer flex items-center justify-center gap-2 border border-amber-400/35"
                >
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  <span>Visit Our Gallery 🖼️</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Hero Main Content with 3D Tilt Card Centerpiece */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Heading & Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center md:text-left space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-amber-400/35 text-amber-200 text-xs font-mono shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>HANDCRAFTED FOR DHVANI</span>
            </div>

            <h1 className="text-white font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Bridging every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-500 drop-shadow-[0_0_30px_rgba(255,46,140,0.5)]">
                distance.
              </span>
            </h1>

            {/* Handwritten Quote Layered */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-serif-luxury italic text-xl sm:text-2xl text-amber-100/90 leading-relaxed font-light"
            >
              "Distance means so little when someone means so much. Handcrafted with all my love, Om ❤️"
            </motion.p>

            <p className="text-pink-100/80 text-xs sm:text-sm leading-relaxed font-outfit max-w-md">
              RelationshipOS unifies every memory, milestone, and message so we spend less energy on the miles and more on true togetherness.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={handleStart}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 text-sm font-bold rounded-full hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] transition-all active:scale-95 cursor-pointer flex items-center gap-2 font-outfit"
              >
                <span>Begin Our Journey ❤️</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={handleGallery}
                className="px-7 py-3.5 glass-card-3d rounded-full text-amber-200 text-sm font-semibold hover:bg-white/15 transition-all active:scale-95 cursor-pointer flex items-center gap-2 border border-amber-400/40 font-outfit"
              >
                <span>Our Gallery 🖼️</span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
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
              className="relative w-72 sm:w-80 md:w-88 aspect-[3/4] rounded-3xl p-3.5 glass-card-3d border-2 border-amber-400/40 shadow-[0_30px_90px_rgba(212,175,55,0.3)] transition-transform duration-200 ease-out cursor-pointer group"
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              }}
              onClick={handleGallery}
            >
              {/* Soft Lighting Reflection Overlay */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%)`,
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
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-center">
                  <span className="font-serif-luxury italic text-lg text-amber-200 drop-shadow">
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
