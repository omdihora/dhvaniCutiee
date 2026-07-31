import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Heart, Image as ImageIcon, Sparkles, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HeroWelcomeProps {
  onStartQuiz: () => void;
  onOpenGallery?: () => void;
}

interface NavItem {
  title: string;
  items?: { label: string; action?: () => void }[];
  action?: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({ onStartQuiz, onOpenGallery }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);

  const handleStart = () => {
    soundEngine.playPageSwitch();
    onStartQuiz();
  };

  const handleGallery = () => {
    soundEngine.playPageSwitch();
    if (onOpenGallery) onOpenGallery();
    else onStartQuiz();
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
  ];

  return (
    <section className="h-screen w-full overflow-hidden relative font-sans flex flex-col select-none">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260703_053131_1ec3dd1c-d627-44fb-ab20-6e1fce41b0d5.mp4"
      />

      {/* Subtle Dark Overlay */}
      <div className="absolute inset-0 bg-black/25 z-0" />

      {/* Top Navigation */}
      <nav className="w-full px-5 sm:px-6 md:px-12 lg:px-16 py-4 sm:py-5 flex items-center justify-between z-20 relative">
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleStart}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 2L26 14L14 26L2 14L14 2Z"
              fill="#f43f5e"
              fillOpacity="0.9"
            />
            <path
              d="M14 6L22 14L14 22L6 14L14 6Z"
              fill="#fbcfe8"
              fillOpacity="0.7"
            />
          </svg>
          <span className="text-white text-lg sm:text-xl font-medium tracking-tight flex items-center gap-1.5">
            Relationship<span className="text-pink-300 font-bold">OS</span>
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
                className="text-white/90 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 py-1 cursor-pointer"
              >
                <span>{item.title}</span>
                {item.items && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      activeDropdown === item.title ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Dropdown Menu */}
              {item.items && activeDropdown === item.title && (
                <div className="!absolute top-full left-0 liquid-glass bg-[#180a29]/90 rounded-xl py-3 px-2 min-w-[170px] shadow-xl animate-dropdown z-30 mt-1 border border-pink-500/20 backdrop-blur-xl">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.label}
                      onClick={() => {
                        soundEngine.playClick();
                        if (subItem.action) subItem.action();
                        else handleStart();
                      }}
                      className="text-white/80 hover:text-pink-200 hover:bg-white/10 text-sm rounded-lg block px-3 py-2 transition-colors cursor-pointer"
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
            className="text-white/90 hover:text-white text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Welcome Dhvani</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </button>

          <button
            onClick={handleGallery}
            className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2 border border-pink-400/30 shadow-lg"
          >
            <ImageIcon className="w-4 h-4 text-pink-300" />
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
            className="md:hidden absolute top-16 left-4 right-4 bg-[#1e0832]/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl z-30 border border-pink-500/20 duration-400"
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
                    className="w-full flex items-center justify-between text-white font-medium text-base py-1 cursor-pointer"
                  >
                    <span>{item.title}</span>
                    {item.items && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMobileCategory === item.title ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {item.items && expandedMobileCategory === item.title && (
                    <div className="pl-4 space-y-2 border-l border-pink-500/20 my-1">
                      {item.items.map((sub) => (
                        <a
                          key={sub.label}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            if (sub.action) sub.action();
                            else handleStart();
                          }}
                          className="block text-pink-200/80 hover:text-white text-sm py-1 cursor-pointer"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t border-pink-500/20 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleStart();
                  }}
                  className="w-full text-center text-white/90 hover:text-white font-medium text-sm py-2 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Welcome Dhvani</span>
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleGallery();
                  }}
                  className="w-full liquid-glass rounded-full py-2.5 text-center text-white text-sm font-medium cursor-pointer flex items-center justify-center gap-2 border border-pink-400/30"
                >
                  <ImageIcon className="w-4 h-4 text-pink-300" />
                  <span>Visit Our Gallery 🖼️</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hero Content */}
      <div className="flex-1 flex items-start justify-center pt-16 sm:pt-20 md:pt-24 px-4 relative z-10">
        <div className="text-center max-w-3xl">
          {/* Main Heading */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-[-0.02em] font-medium">
            Bridging every{' '}
            <br className="hidden sm:inline" />
            distance. <span className="text-white/60 font-normal">Handcrafted for</span>
            <br />
            <span className="text-pink-200 font-medium">Dhvani ❤️</span>
          </h1>

          {/* Subheading */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto mt-6 sm:mt-8 font-normal">
            RelationshipOS unifies every memory, milestone, and message handcrafted by Om for Dhvani, so we spend less energy on the distance and more on real togetherness.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-white text-gray-900 text-sm sm:text-base font-semibold rounded-full hover:bg-white/90 transition-all active:scale-95 cursor-pointer shadow-lg flex items-center gap-2"
            >
              <span>Begin Our Journey ❤️</span>
              <ArrowRight className="w-4 h-4 text-gray-900" />
            </button>

            <button
              onClick={handleGallery}
              className="px-6 py-3 liquid-glass rounded-full text-white text-sm sm:text-base font-semibold hover:bg-white/10 transition-all active:scale-95 cursor-pointer flex items-center gap-2 border border-pink-400/40"
            >
              <span>Our Gallery 🖼️</span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWelcome;
