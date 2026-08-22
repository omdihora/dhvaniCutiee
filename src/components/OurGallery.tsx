import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Download, Shuffle, Play, Pause, ChevronLeft, ChevronRight,
  Maximize2, Grid, Layers, Clock, Volume2, VolumeX,
  X, Compass, Eye, Star
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

export interface GalleryItem {
  id: number;
  src: string;
  title: string;
  caption: string;
  chapterId: 'beginning' | 'favorite' | 'memories' | 'forever';
  chapterName: string;
  rotation: number;
  hasButterfly?: boolean;
}

const INITIAL_PHOTOS: GalleryItem[] = [
  {
    id: 6,
    src: '/gallery/photo6.jpg',
    title: 'Our Very First Date ❤️',
    caption: 'Underneath the glowing fairy lights of the illuminated trees, where our story officially began. Standing beside you on our first date, I knew you were the one.',
    chapterId: 'beginning',
    chapterName: 'The Beginning ❤️',
    rotation: 2,
    hasButterfly: true,
  },
  {
    id: 7,
    src: '/gallery/photo7.jpg',
    title: 'First Date Magic ✨',
    caption: 'Our enchanted first date under the starlit tree canopy. Dressed up, smiling bright, and falling for you with every passing second.',
    chapterId: 'beginning',
    chapterName: 'The Beginning ❤️',
    rotation: -3,
  },
  {
    id: 1,
    src: '/gallery/photo1.jpg',
    title: 'Unfiltered Giggles & Infinite Smiles',
    caption: 'That laugh of yours is still my absolute favorite sound in the whole wide world. No matter how crazy life gets, one look at your smile brings me instant peace.',
    chapterId: 'beginning',
    chapterName: 'The Beginning ❤️',
    rotation: -3,
    hasButterfly: true,
  },
  {
    id: 2,
    src: '/gallery/photo2.jpg',
    title: 'Sweet Delights & Endless Joy',
    caption: 'Shared sweet treats and even sweeter laughter. Time literally stands still whenever we are together — every moment turned into a memory.',
    chapterId: 'favorite',
    chapterName: 'Our Favorite Moments 💕',
    rotation: 2,
  },
  {
    id: 3,
    src: '/gallery/photo3.jpg',
    title: 'Reaching Into Your Heart',
    caption: 'Reaching out my hand to the only one who holds my heart forever. You make every ordinary day feel like a magical movie scene.',
    chapterId: 'memories',
    chapterName: 'Beautiful Memories ✨',
    rotation: -2,
    hasButterfly: true,
  },
  {
    id: 4,
    src: '/gallery/photo4.jpg',
    title: 'Framed By True Love',
    caption: 'Two hands forming one heart, framing the most precious person in my entire universe. Proof that perfection exists when I look at you.',
    chapterId: 'memories',
    chapterName: 'Beautiful Memories ✨',
    rotation: 4,
  },
  {
    id: 5,
    src: '/gallery/photo5.jpg',
    title: 'Resting On Your Shoulder',
    caption: 'Leaning on you feels like coming home. Every single day with you is a gift I promise to cherish for a lifetime.',
    chapterId: 'forever',
    chapterName: 'Forever to Come 💖',
    rotation: -4,
    hasButterfly: true,
  },
  {
    id: 8,
    src: '/gallery/photo8.jpg',
    title: 'Cozy Snuggles & Pure Joy',
    caption: 'Leaning close and sharing quiet giggles. The warmth of your embrace makes the whole world fade away.',
    chapterId: 'memories',
    chapterName: 'Beautiful Memories ✨',
    rotation: 3,
    hasButterfly: true,
  },
  {
    id: 9,
    src: '/gallery/photo9.jpg',
    title: 'Soft Whispers & Gentle Touches',
    caption: 'A gentle touch, a shy smile, and a heart full of love. With you, every single gesture is pure magic.',
    chapterId: 'forever',
    chapterName: 'Forever to Come 💖',
    rotation: -2,
  },
  {
    id: 10,
    src: '/gallery/photo10.jpg',
    title: 'Festive Lights & Warmest Smiles ✨',
    caption: 'Wrapped in festive colors and glowing fairy lights, your smile lights up my whole world brighter than any celebration.',
    chapterId: 'favorite',
    chapterName: 'Our Favorite Moments 💕',
    rotation: -3,
    hasButterfly: true,
  },
  {
    id: 11,
    src: '/gallery/photo11.jpg',
    title: 'Cozy Moments Under Golden Ribbons 🎗️',
    caption: 'Lean in close, forget the world. With you, every single ordinary moment turns into pure magic.',
    chapterId: 'favorite',
    chapterName: 'Our Favorite Moments 💕',
    rotation: 3,
  },
  {
    id: 12,
    src: '/gallery/photo12.jpg',
    title: 'Playful Glances & Sweet Quiet Love 💕',
    caption: 'The way you look at me with those beautiful eyes and glasses — my heart skips a beat every single time.',
    chapterId: 'memories',
    chapterName: 'Beautiful Memories ✨',
    rotation: -2,
    hasButterfly: true,
  },
  {
    id: 13,
    src: '/gallery/photo13.jpg',
    title: 'Radiant Laughter & Pure Celebration 💖',
    caption: 'Big smiles, endless joy, and curls cascading like poetry. Being by your side is my happiest place on Earth.',
    chapterId: 'memories',
    chapterName: 'Beautiful Memories ✨',
    rotation: 4,
  },
  {
    id: 14,
    src: '/gallery/photo14.jpg',
    title: 'My Most Precious Gem 🌸',
    caption: 'Your playful, gorgeous smile framed by golden lights. You are the prettiest fairytale in my life.',
    chapterId: 'forever',
    chapterName: 'Forever to Come 💖',
    rotation: -3,
    hasButterfly: true,
  },
  {
    id: 15,
    src: '/gallery/photo15.jpg',
    title: 'Resting Close & Holding Hands 💕',
    caption: 'Leaning against you at the table, wrapped in your pink linen shirt. Your warmth is my favorite comfort in the world.',
    chapterId: 'favorite',
    chapterName: 'Our Favorite Moments 💕',
    rotation: 3,
    hasButterfly: true,
  },
  {
    id: 16,
    src: '/gallery/photo16.jpg',
    title: 'Starlit Evening Smiles ✨',
    caption: 'Under the open night sky, dressed in pink florals with your radiant smile and cute glasses shining brighter than the city lights.',
    chapterId: 'memories',
    chapterName: 'Beautiful Memories ✨',
    rotation: -2,
  },
  {
    id: 17,
    src: '/gallery/photo17.jpg',
    title: 'Hands on Chin & Endless Charm 💖',
    caption: 'Resting your chin on your hands with that adorable smile. Looking at you, I fall in love all over again.',
    chapterId: 'forever',
    chapterName: 'Forever to Come 💖',
    rotation: 4,
    hasButterfly: true,
  },
  {
    id: 18,
    src: '/gallery/photo18.jpg',
    title: 'A Symphony of Colors & Love 🌈',
    caption: 'Standing beneath a canopy of vibrant streamers and twinkling lights. You are the bright color in my life every single day.',
    chapterId: 'forever',
    chapterName: 'Forever to Come 💖',
    rotation: -3,
    hasButterfly: true,
  },
  {
    id: 19,
    src: '/gallery/photo19.jpg',
    title: 'Gold Medalist & University Topper 🥇👑',
    caption: 'Holding her Gold Medal & Certificate of Excellence for achieving the highest academic distinction in B.Pharm at Nirma University. Brains, beauty, dedication, and grace — the most brilliant topper in the world, and I am the proudest person alive! 💕',
    chapterId: 'favorite',
    chapterName: 'Our Favorite Moments 💕',
    rotation: 3,
    hasButterfly: true,
  },
  {
    id: 20,
    src: '/gallery/photo20.jpg',
    title: 'Poetry in Handwriting ✍️✨',
    caption: 'Her handwriting is pure perfection — every cursive curve, every letter written with effortless grace and elegance. Even her pharmaceutical study notes look like a work of romantic art. 📖💖',
    chapterId: 'memories',
    chapterName: 'Beautiful Memories ✨',
    rotation: -3,
    hasButterfly: true,
  },
  {
    id: 21,
    src: '/gallery/photo21.jpg',
    title: 'Moonlit Elegance & Starlit Grace 🌙✨',
    caption: 'Standing beneath the evening night sky in her elegant white dress. That quiet, radiant side profile smile outshines every star in the universe. Ethereal beauty in its purest form. 💫🤍',
    chapterId: 'forever',
    chapterName: 'Forever to Come 💖',
    rotation: 2,
    hasButterfly: true,
  },
  {
    id: 22,
    src: '/gallery/photo22.jpg',
    title: 'Pink Flower in Her Hair 🌸👓',
    caption: 'A vibrant pink flower tucked softly behind her ear, adorable glasses, and that enchanting smile that makes my whole world stop. She is the prettiest fairytale come true. 💕',
    chapterId: 'favorite',
    chapterName: 'Our Favorite Moments 💕',
    rotation: -2,
    hasButterfly: true,
  },
];

const ROMANTIC_QUOTES = [
  "\"In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.\" — Maya Angelou ✨",
  "\"Every picture holds a piece of our story, but the best chapters are still waiting to be written together.\" 🌹",
  "\"You are my today and all of my tomorrows.\" 💕",
  "\"If I had a flower for every time I thought of you, I could walk through my garden forever.\" 🌸",
];

interface OurGalleryProps {
  onNext?: () => void;
}

export const OurGallery: React.FC<OurGalleryProps> = ({ onNext }) => {
  const [photos, setPhotos] = useState<GalleryItem[]>(INITIAL_PHOTOS);
  const [activeLayout, setActiveLayout] = useState<'masonry' | 'polaroid' | 'stacks' | 'carousel' | 'timeline'>('masonry');
  const [activeFilter] = useState<'all' | 'beginning' | 'favorite' | 'memories' | 'forever'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState<boolean>(false);
  const [slideshowIndex, setSlideshowIndex] = useState<number>(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [burstHearts, setBurstHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Hero Featured Slideshow State
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);

  // Filtered Photos
  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'all') return photos;
    return photos.filter((p) => p.chapterId === activeFilter);
  }, [photos, activeFilter]);

  // Featured Photo Crossfade Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [photos.length]);

  // Handle Toast Notifications
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sparkle / Heart Burst Effect
  const handleScreenClick = (e: React.MouseEvent) => {
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
    };
    setBurstHearts((prev) => [...prev.slice(-8), newHeart]);
  };

  // Image Download Functionality
  const handleDownloadImage = async (photo: GalleryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playSuccess();
    try {
      showToast(`Downloading "${photo.title}"... 💕`);
      const response = await fetch(photo.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Dhvani_Memory_${photo.id}_${photo.title.replace(/\s+/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast(`Saved "${photo.title}" to downloads! 📥✨`);
    } catch {
      const link = document.createElement('a');
      link.href = photo.src;
      link.target = '_blank';
      link.download = `Memory_${photo.id}.jpg`;
      link.click();
      showToast(`Opened photo for download 💕`);
    }
  };

  // Memory Shuffle with Smooth Rearrange
  const handleShuffle = () => {
    soundEngine.playWhoosh();
    setPhotos((prev) => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
    showToast('Memory cards rearranged with love! 🔀✨');
  };

  // Slideshow Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (isSlideshowActive && isSlideshowPlaying) {
      soundEngine.startAmbientBGM();
      interval = setInterval(() => {
        setSlideshowIndex((prev) => (prev + 1) % filteredPhotos.length);
      }, 4500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSlideshowActive, isSlideshowPlaying, filteredPhotos.length]);

  // Start Slideshow
  const startSlideshow = () => {
    soundEngine.playClick();
    setSlideshowIndex(0);
    setIsSlideshowActive(true);
    setIsSlideshowPlaying(true);
  };

  // Audio Toggle
  const toggleSound = () => {
    const nextMute = soundEngine.toggleMute();
    setIsMuted(nextMute);
    if (!nextMute) {
      soundEngine.startAmbientBGM();
    }
  };

  const currentFeatured = photos[featuredIndex] || photos[0];

  return (
    <div
      onClick={handleScreenClick}
      className="min-h-screen w-full relative pt-16 pb-24 px-3 sm:px-6 lg:px-12 flex flex-col items-center select-none overflow-x-hidden bg-[#0f051d]"
    >
      {/* Floating Petals Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-[#f7e7ce]/40 animate-petal-drift pointer-events-none"
            style={{
              left: `${(i * 13 + 5) % 95}%`,
              animationDelay: `${i * 1.8}s`,
              animationDuration: `${10 + (i % 4) * 3}s`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* Floating Heart Bursts on Screen Click */}
      {burstHearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, scale: 0.5, y: h.y, x: h.x - 12 }}
          animate={{ opacity: 0, scale: 1.8, y: h.y - 80, x: h.x + (Math.random() * 40 - 20) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          onAnimationComplete={() =>
            setBurstHearts((prev) => prev.filter((item) => item.id !== h.id))
          }
          className="fixed z-50 text-2xl pointer-events-none"
        >
          💖
        </motion.div>
      ))}

      {/* Toast Notification Bar */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-20 z-50 glass-pill bg-[#2d0a10]/95 border border-[#f7e7ce]/40 text-[#f7e7ce] px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-[0_10px_30px_rgba(212,175,55,0.3)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#e5c158] animate-spin" style={{ animationDuration: '4s' }} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dedicated "Our Favorite Moments" Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl z-10 relative pt-4 mb-10 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill border border-[#f7e7ce]/30 text-[#f7e7ce] text-xs font-mono mb-4 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          <span>OUR FAVORITE MOMENTS // LUXURY MUSEUM</span>
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif-luxury font-bold tracking-tight bg-gradient-to-r from-[#f7e7ce] via-[#fadadd] to-[#d4af37] bg-clip-text text-transparent leading-tight drop-shadow-[0_4px_20px_rgba(212,175,55,0.25)]">
          Every Picture Holds a Piece of Our Story ❤️
        </h1>

        {/* Featured Hero Photo Showcase with Slow Crossfade */}
        <div className="mt-8 relative w-full aspect-[16/9] max-h-[380px] rounded-3xl overflow-hidden glass-card-luxury border-2 border-[#f7e7ce]/30 shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeatured.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={currentFeatured.src}
                alt={currentFeatured.title}
                className="w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f051d] via-[#0f051d]/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-left">
                <span className="text-[#d4af37] text-xs font-mono font-bold tracking-widest uppercase mb-1">
                  {currentFeatured.chapterName}
                </span>
                <h3 className="text-white font-serif-luxury text-2xl sm:text-3xl font-bold">
                  {currentFeatured.title}
                </h3>
                <p className="font-handwritten text-xl sm:text-2xl text-[#f7e7ce] mt-1 max-w-2xl">
                  "{currentFeatured.caption}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={startSlideshow}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b76e79] text-[#0f051d] text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all font-serif-luxury"
          >
            <Play className="w-4 h-4 text-[#0f051d] fill-[#0f051d]" />
            <span>Play Fullscreen Slideshow</span>
          </button>

          <button
            onClick={handleShuffle}
            className="glass-pill hover:bg-white/15 px-5 py-2.5 text-xs sm:text-sm font-medium text-[#f7e7ce] flex items-center gap-2 border border-[#f7e7ce]/30 active:scale-95 transition-all font-serif-luxury"
          >
            <Shuffle className="w-4 h-4 text-[#d4af37]" />
            <span>Memory Shuffle</span>
          </button>

          <button
            onClick={toggleSound}
            className="glass-pill hover:bg-white/15 p-2.5 text-xs font-medium text-[#f7e7ce] flex items-center gap-2 border border-[#f7e7ce]/30 active:scale-95 transition-all font-serif-luxury"
            title={isMuted ? 'Play Romantic Piano BGM' : 'Mute Background Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-[#e5c158]" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Soft Piano'}</span>
          </button>
        </div>
      </motion.div>

      {/* Interactive Controls Header: Layout Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-6xl z-10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 glass-card-luxury bg-[#0f051d]/80 border border-[#f7e7ce]/20 p-3 sm:p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        {/* All Memories Header Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/20 border border-[#f7e7ce]/30 text-white text-xs sm:text-sm font-semibold font-serif-luxury">
          <span>💖</span>
          <span>All Memories ({photos.length})</span>
        </div>

        {/* Layout Switcher Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-[#f7e7ce]/20">
          {[
            { id: 'masonry', label: 'Masonry', icon: <Grid className="w-3.5 h-3.5" /> },
            { id: 'polaroid', label: 'Polaroid', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'stacks', label: 'Stacks', icon: <Compass className="w-3.5 h-3.5" /> },
            { id: 'carousel', label: '3D Carousel', icon: <Eye className="w-3.5 h-3.5" /> },
            { id: 'timeline', label: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
          ].map((mode) => {
            const isActive = activeLayout === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveLayout(mode.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all font-serif-luxury ${
                  isActive
                    ? 'bg-[#d4af37]/30 text-white border border-[#f7e7ce]/60 shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                    : 'text-pink-200/60 hover:text-white hover:bg-white/5'
                }`}
                title={`Switch to ${mode.label} View`}
              >
                {mode.icon}
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* MAIN GALLERY DISPLAY CONTENT */}
      <div className="w-full max-w-6xl z-10 min-h-[500px] relative">
        <AnimatePresence mode="wait">
          {/* LAYOUT 1: MASONRY GRID */}
          {activeLayout === 'masonry' && (
            <motion.div
              key="masonry"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {filteredPhotos.map((photo, idx) => (
                <InteractiveGlassCard
                  key={photo.id}
                  photo={photo}
                  index={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  onDownload={(e) => handleDownloadImage(photo, e)}
                />
              ))}
            </motion.div>
          )}

          {/* LAYOUT 2: POLAROID STYLE */}
          {activeLayout === 'polaroid' && (
            <motion.div
              key="polaroid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4"
            >
              {filteredPhotos.map((photo, idx) => (
                <PolaroidCard
                  key={photo.id}
                  photo={photo}
                  index={idx}
                  onClick={() => setSelectedPhoto(photo)}
                  onDownload={(e) => handleDownloadImage(photo, e)}
                />
              ))}
            </motion.div>
          )}

          {/* LAYOUT 3: OVERLAPPING MEMORY STACKS */}
          {activeLayout === 'stacks' && (
            <motion.div
              key="stacks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-8 space-y-12"
            >
              <div className="text-center">
                <span className="text-xs font-mono text-[#d4af37] tracking-widest uppercase">Fan-out Memory Album</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-serif-luxury">Hover & Click to Unfold Memories</h3>
              </div>
              <MemoryCardDeck
                photos={filteredPhotos}
                onSelect={(photo) => setSelectedPhoto(photo)}
                onDownload={(photo, e) => handleDownloadImage(photo, e)}
              />
            </motion.div>
          )}

          {/* LAYOUT 4: 3D CAROUSEL */}
          {activeLayout === 'carousel' && (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-6"
            >
              <ThreeDCarousel
                photos={filteredPhotos}
                currentIndex={carouselIndex}
                onChangeIndex={(newIdx) => setCarouselIndex(newIdx)}
                onSelect={(photo) => setSelectedPhoto(photo)}
                onDownload={(photo, e) => handleDownloadImage(photo, e)}
              />
            </motion.div>
          )}

          {/* LAYOUT 5: CHRONOLOGICAL TIMELINE */}
          {activeLayout === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              className="py-4"
            >
              <TimelineGalleryView
                photos={photos}
                onSelect={(photo) => setSelectedPhoto(photo)}
                onDownload={(photo, e) => handleDownloadImage(photo, e)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CHAPTER DIVIDER WITH BLOOMING ROSE & QUOTE */}
      <div className="w-full max-w-4xl my-16 relative z-10 flex flex-col items-center text-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f7e7ce]/40 to-transparent mb-8" />
        
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-[#d4af37]/10 border border-[#f7e7ce]/30 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)] mb-4"
        >
          🌹
        </motion.div>

        <p className="font-handwritten text-2xl sm:text-3xl text-[#f7e7ce] max-w-xl px-4 leading-relaxed">
          {ROMANTIC_QUOTES[Math.floor(photos.length % ROMANTIC_QUOTES.length)]}
        </p>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#f7e7ce]/40 to-transparent mt-8" />
      </div>

      {/* FINAL BOTTOM GRAND PHOTO FRAME */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl z-10 mt-6 glass-card-luxury bg-gradient-to-b from-[#2d0a10]/60 to-[#0f051d]/90 border-2 border-[#f7e7ce]/40 rounded-[36px] p-6 sm:p-10 shadow-[0_0_70px_rgba(212,175,55,0.25)] text-center relative overflow-hidden group"
      >
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#d4af37]/20 border border-[#f7e7ce]/30 text-[#f7e7ce] text-xs font-mono">
            <Star className="w-3.5 h-3.5 text-[#e5c158] fill-[#e5c158]" />
            <span>FOREVER IN PROGRESS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight">
            The Best Picture Is Still Waiting to Be Taken... Together ❤️
          </h2>

          <p className="text-pink-200/80 font-handwritten text-xl sm:text-2xl max-w-lg">
            Our story doesn't end here. It gets sweeter with every passing day, every shared laughter, and every quiet embrace.
          </p>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playCelebration();
                confetti({
                  particleCount: 80,
                  spread: 100,
                  origin: { y: 0.8 },
                });
                showToast('Here is to an eternity of beautiful memories! 🥂💖');
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b76e79] text-[#0f051d] text-sm font-semibold flex items-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:scale-105 active:scale-95 transition-all font-serif-luxury"
            >
              <span>Celebrate Our Journey</span>
            </button>

            {onNext && (
              <button
                onClick={() => {
                  soundEngine.playPageSwitch();
                  onNext();
                }}
                className="glass-pill hover:bg-white/15 px-5 py-3 text-sm font-medium text-[#f7e7ce] flex items-center gap-2 border border-[#f7e7ce]/30 active:scale-95 transition-all font-serif-luxury"
              >
                <span>Continue Next Chapter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <LightboxModal
            photo={selectedPhoto}
            photos={filteredPhotos}
            onClose={() => setSelectedPhoto(null)}
            onNavigate={(newPhoto) => setSelectedPhoto(newPhoto)}
            onDownload={(photo) => handleDownloadImage(photo)}
            onStartSlideshow={() => {
              setSelectedPhoto(null);
              startSlideshow();
            }}
          />
        )}
      </AnimatePresence>

      {/* FULLSCREEN AUTOMATED SLIDESHOW */}
      <AnimatePresence>
        {isSlideshowActive && (
          <SlideshowOverlay
            photos={filteredPhotos}
            currentIndex={slideshowIndex}
            isPlaying={isSlideshowPlaying}
            onTogglePlay={() => setIsSlideshowPlaying(!isSlideshowPlaying)}
            onPrev={() =>
              setSlideshowIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1))
            }
            onNext={() => setSlideshowIndex((prev) => (prev + 1) % filteredPhotos.length)}
            onClose={() => {
              setIsSlideshowActive(false);
              soundEngine.stopAmbientBGM();
            }}
            onDownload={(photo) => handleDownloadImage(photo)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* =========================================================
   SUB-COMPONENT 1: INTERACTIVE GLASS CARD (3D TILT EFFECT)
   ========================================================= */
interface CardProps {
  photo: GalleryItem;
  index: number;
  onClick: () => void;
  onDownload: (e: React.MouseEvent) => void;
}

const InteractiveGlassCard: React.FC<CardProps> = ({
  photo,
  index,
  onClick,
  onDownload,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotX(-((y - centerY) / centerY) * 10);
    setRotY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="break-inside-avoid mb-6 cursor-pointer"
      onClick={onClick}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className="glass-card-luxury bg-[#0f051d]/85 border border-[#f7e7ce]/25 rounded-[28px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)] transition-all duration-300 relative group overflow-hidden"
      >
        {/* Butterfly Landing Micro-Animation */}
        {photo.hasButterfly && isHovered && (
          <motion.div
            initial={{ scale: 0, x: 20, y: -20, rotate: -20 }}
            animate={{ scale: 1, x: 0, y: 0, rotate: 10 }}
            exit={{ scale: 0 }}
            className="absolute top-6 right-6 z-30 text-2xl animate-butterfly pointer-events-none drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
          >
            🦋
          </motion.div>
        )}

        {/* Image Container with Reflection Overlay */}
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-3 bg-black/40">
          <img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            loading="lazy"
          />

          {/* Glass Reflection */}
          <div className="absolute inset-0 glass-reflection pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity" />

          {/* Quick Hover Download Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex items-start justify-between">
            <span className="glass-pill px-3 py-1 text-[11px] font-mono text-[#f7e7ce]">
              {photo.chapterName}
            </span>

            <button
              onClick={onDownload}
              className="w-9 h-9 rounded-full bg-[#d4af37] hover:bg-[#e5c158] text-[#0f051d] flex items-center justify-center backdrop-blur-md shadow-lg active:scale-90 transition-all"
              title="Download Photo 📥"
            >
              <Download className="w-4 h-4 text-[#0f051d]" />
            </button>
          </div>
        </div>

        {/* Caption & Handwritten Note */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-serif-luxury font-bold text-white tracking-tight group-hover:text-[#f7e7ce] transition-colors">
            {photo.title}
          </h3>
          <p className="font-handwritten text-lg sm:text-xl text-[#f7e7ce] leading-snug line-clamp-2">
            "{photo.caption}"
          </p>
          <div className="flex items-center justify-end text-[11px] text-[#d4af37] font-mono pt-1">
            <span className="flex items-center gap-1 hover:text-white">
              <Maximize2 className="w-3 h-3" /> View Full
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   SUB-COMPONENT 2: POLAROID CARD FRAME
   ========================================================= */
const PolaroidCard: React.FC<CardProps> = ({
  photo,
  index,
  onClick,
  onDownload,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: photo.rotation * 2 }}
      animate={{ opacity: 1, scale: 1, rotate: photo.rotation }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={onClick}
      className="polaroid-frame p-4 pb-6 rounded-sm cursor-pointer shadow-2xl transition-all relative group"
    >
      {/* Tape Decoration */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[#f7e7ce]/40 backdrop-blur-sm border border-white/50 rotate-[-2deg] shadow-sm pointer-events-none" />

      {/* Image */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 mb-4 rounded-xs relative">
        <img
          src={photo.src}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={onDownload}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-[#d4af37] transition-all"
          title="Download Photo"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Handwritten Polaroid Note */}
      <div className="text-slate-800 space-y-1">
        <h4 className="font-handwritten text-2xl font-bold text-slate-900 leading-tight">
          {photo.title}
        </h4>
        <p className="font-handwritten text-lg text-slate-600 line-clamp-2">
          {photo.caption}
        </p>
      </div>
    </motion.div>
  );
};

/* =========================================================
   SUB-COMPONENT 3: MEMORY CARD STACK / FAN-OUT DECK
   ========================================================= */
const MemoryCardDeck: React.FC<{
  photos: GalleryItem[];
  onSelect: (p: GalleryItem) => void;
  onDownload: (p: GalleryItem, e: React.MouseEvent) => void;
}> = ({ photos, onSelect, onDownload }) => {
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);

  return (
    <div className="relative w-full max-w-md h-[420px] flex items-center justify-center">
      {photos.map((photo, i) => {
        const offset = i - activeDeckIndex;
        const isCurrent = i === activeDeckIndex;

        return (
          <motion.div
            key={photo.id}
            initial={false}
            animate={{
              x: offset * 35,
              y: Math.abs(offset) * 12,
              rotate: offset * 6,
              scale: 1 - Math.abs(offset) * 0.06,
              zIndex: 10 - Math.abs(offset),
            }}
            transition={{ duration: 0.4 }}
            onClick={() => {
              if (isCurrent) onSelect(photo);
              else setActiveDeckIndex(i);
            }}
            className={`absolute top-0 w-80 sm:w-96 glass-card-luxury bg-[#0f051d]/95 border-2 ${
              isCurrent ? 'border-[#f7e7ce]/80 shadow-[0_0_40px_rgba(212,175,55,0.4)]' : 'border-[#f7e7ce]/20'
            } rounded-3xl p-4 cursor-pointer hover:scale-102 transition-all`}
          >
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black mb-3 relative">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
              <button
                onClick={(e) => onDownload(photo, e)}
                className="absolute top-3 right-3 p-2 rounded-full bg-[#d4af37] text-[#0f051d] shadow-lg"
              >
                <Download className="w-4 h-4 text-[#0f051d]" />
              </button>
            </div>
            <h4 className="text-white font-serif-luxury font-bold text-lg">{photo.title}</h4>
            <p className="font-handwritten text-[#f7e7ce] text-lg line-clamp-1">{photo.caption}</p>
          </motion.div>
        );
      })}

      {/* Deck Controls */}
      <div className="absolute -bottom-14 flex items-center gap-4">
        <button
          onClick={() => setActiveDeckIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeDeckIndex === 0}
          className="p-2.5 rounded-full glass-pill text-white disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[#f7e7ce] text-xs font-mono">
          Card {activeDeckIndex + 1} of {photos.length}
        </span>
        <button
          onClick={() => setActiveDeckIndex((prev) => Math.min(photos.length - 1, prev + 1))}
          disabled={activeDeckIndex >= photos.length - 1}
          className="p-2.5 rounded-full glass-pill text-white disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   SUB-COMPONENT 4: 3D CAROUSEL VIEW
   ========================================================= */
const ThreeDCarousel: React.FC<{
  photos: GalleryItem[];
  currentIndex: number;
  onChangeIndex: (n: number) => void;
  onSelect: (p: GalleryItem) => void;
  onDownload: (p: GalleryItem, e: React.MouseEvent) => void;
}> = ({ photos, currentIndex, onChangeIndex, onSelect, onDownload }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6">
      <div className="relative w-full max-w-4xl h-[420px] flex items-center justify-center overflow-hidden">
        {photos.map((photo, idx) => {
          const count = photos.length;
          let diff = idx - currentIndex;
          if (diff > count / 2) diff -= count;
          if (diff < -count / 2) diff += count;

          const isActive = diff === 0;
          const absDiff = Math.abs(diff);

          if (absDiff > 2) return null;

          return (
            <motion.div
              key={photo.id}
              animate={{
                x: diff * 220,
                scale: isActive ? 1 : 0.8 - absDiff * 0.1,
                rotateY: diff * -25,
                zIndex: 20 - absDiff,
                opacity: 1 - absDiff * 0.35,
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                if (isActive) onSelect(photo);
                else onChangeIndex(idx);
              }}
              className={`absolute w-72 sm:w-88 glass-card-luxury bg-[#0f051d]/95 border-2 ${
                isActive ? 'border-[#f7e7ce] shadow-[0_0_50px_rgba(212,175,55,0.4)]' : 'border-[#f7e7ce]/20'
              } rounded-3xl p-4 cursor-pointer`}
            >
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black mb-3 relative">
                <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                <button
                  onClick={(e) => onDownload(photo, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-[#d4af37] text-[#0f051d] shadow-lg"
                >
                  <Download className="w-4 h-4 text-[#0f051d]" />
                </button>
              </div>
              <h4 className="text-white font-serif-luxury font-bold text-lg truncate">{photo.title}</h4>
              <p className="font-handwritten text-[#f7e7ce] text-base truncate">{photo.caption}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => onChangeIndex(currentIndex === 0 ? photos.length - 1 : currentIndex - 1)}
          className="p-3 rounded-full glass-pill text-white hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-[#f7e7ce] text-xs font-mono">
          {currentIndex + 1} / {photos.length}
        </span>
        <button
          onClick={() => onChangeIndex((currentIndex + 1) % photos.length)}
          className="p-3 rounded-full glass-pill text-white hover:bg-white/20"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   SUB-COMPONENT 5: TIMELINE GALLERY VIEW
   ========================================================= */
const TimelineGalleryView: React.FC<{
  photos: GalleryItem[];
  onSelect: (p: GalleryItem) => void;
  onDownload: (p: GalleryItem, e: React.MouseEvent) => void;
}> = ({ photos, onSelect, onDownload }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-[#f7e7ce]/40 to-transparent" />
      <div className="space-y-12">
        {photos.map((photo, i) => {
          const isEven = i % 2 === 0;
          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, x: isEven ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex items-center gap-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="w-1/2 flex justify-end">
                <div
                  onClick={() => onSelect(photo)}
                  className="glass-card-luxury bg-[#0f051d]/90 border border-[#f7e7ce]/30 p-4 rounded-3xl max-w-sm cursor-pointer hover:border-[#f7e7ce]"
                >
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden mb-3 relative">
                    <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => onDownload(photo, e)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-[#d4af37] text-[#0f051d]"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0f051d]" />
                    </button>
                  </div>
                  <h4 className="text-white font-serif-luxury font-bold text-base">{photo.title}</h4>
                  <p className="font-handwritten text-[#f7e7ce] text-base line-clamp-2">{photo.caption}</p>
                </div>
              </div>
              <div className="w-6 h-6 rounded-full bg-[#d4af37] border-4 border-[#0f051d] z-10 shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
              <div className="w-1/2" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================
   SUB-COMPONENT 6: LIGHTBOX MODAL
   ========================================================= */
const LightboxModal: React.FC<{
  photo: GalleryItem;
  photos: GalleryItem[];
  onClose: () => void;
  onNavigate: (p: GalleryItem) => void;
  onDownload: (p: GalleryItem) => void;
  onStartSlideshow: () => void;
}> = ({ photo, photos, onClose, onNavigate, onDownload, onStartSlideshow }) => {
  const currentIndex = photos.findIndex((p) => p.id === photo.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card-luxury bg-[#0f051d]/95 border-2 border-[#f7e7ce]/40 rounded-3xl p-5 max-w-4xl w-full shadow-[0_0_90px_rgba(212,175,55,0.3)] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black relative">
            <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4 text-left">
            <span className="text-[#d4af37] font-mono text-xs font-bold uppercase tracking-wider">
              {photo.chapterName}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
              {photo.title}
            </h2>
            <p className="font-handwritten text-xl text-[#f7e7ce] leading-relaxed">
              "{photo.caption}"
            </p>

            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => onDownload(photo)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b76e79] text-[#0f051d] text-xs font-semibold flex items-center gap-2 font-serif-luxury"
              >
                <Download className="w-4 h-4 text-[#0f051d]" />
                <span>Download High-Res</span>
              </button>

              <button
                onClick={onStartSlideshow}
                className="glass-pill px-4 py-2.5 text-xs text-[#f7e7ce] font-serif-luxury flex items-center gap-2 border border-[#f7e7ce]/30 hover:bg-white/15"
              >
                <Play className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Slideshow</span>
              </button>
            </div>
          </div>
        </div>

        {/* Previous / Next Controls */}
        <div className="flex items-center justify-between border-t border-[#f7e7ce]/20 pt-4 mt-6">
          <button
            onClick={() =>
              onNavigate(photos[currentIndex === 0 ? photos.length - 1 : currentIndex - 1])
            }
            className="flex items-center gap-1.5 text-xs font-mono text-[#f7e7ce] hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Memory
          </button>

          <button
            onClick={() => onNavigate(photos[(currentIndex + 1) % photos.length])}
            className="flex items-center gap-1.5 text-xs font-mono text-[#f7e7ce] hover:text-white"
          >
            Next Memory <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* =========================================================
   SUB-COMPONENT 7: FULLSCREEN AUTOMATED SLIDESHOW OVERLAY
   ========================================================= */
const SlideshowOverlay: React.FC<{
  photos: GalleryItem[];
  currentIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onDownload: (p: GalleryItem) => void;
}> = ({
  photos,
  currentIndex,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onClose,
  onDownload,
}) => {
  const currentPhoto = photos[currentIndex] || photos[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 sm:p-8 select-none"
    >
      <div className="flex items-center justify-between z-20">
        <span className="text-[#f7e7ce] font-serif-luxury text-lg font-semibold flex items-center gap-2">
          <span>💖</span> Memory Museum Slideshow
        </span>
        <button onClick={onClose} className="text-white/70 hover:text-white p-2">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="w-full h-full max-w-5xl flex flex-col items-center justify-center"
          >
            <div className="relative max-h-[70vh] rounded-3xl overflow-hidden border-2 border-[#f7e7ce]/40 shadow-[0_0_80px_rgba(212,175,55,0.3)]">
              <img
                src={currentPhoto.src}
                alt={currentPhoto.title}
                className="max-h-[70vh] w-auto object-contain rounded-2xl"
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-white font-serif-luxury text-2xl font-bold">{currentPhoto.title}</h3>
              <p className="font-handwritten text-xl text-[#f7e7ce] mt-1">{currentPhoto.caption}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 z-20">
        <button onClick={onPrev} className="p-3 rounded-full glass-pill text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button onClick={onTogglePlay} className="p-4 rounded-full bg-[#d4af37] text-[#0f051d] shadow-lg">
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
        </button>

        <button onClick={onNext} className="p-3 rounded-full glass-pill text-white">
          <ChevronRight className="w-5 h-5" />
        </button>

        <button onClick={() => onDownload(currentPhoto)} className="p-3 rounded-full glass-pill text-[#f7e7ce]">
          <Download className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default OurGallery;
