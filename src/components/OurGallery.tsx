import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Download, Shuffle, Play, Pause, ChevronLeft, ChevronRight,
  Maximize2, Grid, Layers, Clock, Volume2, VolumeX,
  X, Compass, Eye, Star, Music
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'beginning' | 'favorite' | 'memories' | 'forever'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [isSlideshowActive, setIsSlideshowActive] = useState<boolean>(false);
  const [slideshowIndex, setSlideshowIndex] = useState<number>(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [burstHearts, setBurstHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Filtered Photos
  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'all') return photos;
    return photos.filter((p) => p.chapterId === activeFilter);
  }, [photos, activeFilter]);

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
    } catch (err) {
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

  return (
    <div
      onClick={handleScreenClick}
      className="min-h-screen w-full relative pt-16 pb-24 px-3 sm:px-6 lg:px-12 flex flex-col items-center select-none overflow-x-hidden"
    >
      {/* Floating Petals Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-300/40 animate-petal-drift pointer-events-none"
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
            className="fixed top-20 z-50 glass-pill bg-pink-900/90 border border-pink-400/40 text-pink-100 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-[0_10px_30px_rgba(236,72,153,0.4)] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl w-full mb-10 z-10 relative pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
          <span>INTERACTIVE MEMORY MUSEUM</span>
          <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-200 via-rose-200 to-lavender-200 bg-clip-text text-transparent leading-tight drop-shadow-[0_4px_20px_rgba(236,72,153,0.3)]">
          Every Picture Holds a Piece of Our Story ❤️
        </h1>

        <p className="text-pink-200/80 text-sm sm:text-base mt-3 font-light max-w-2xl mx-auto leading-relaxed">
          Welcome to our digital sanctuary of love. Every frame suspended in glass, every laugh preserved forever. Hover to feel the 3D tilt, click to explore memories, or download your favorite moments.
        </p>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={startSlideshow}
            className="glass-button-romantic px-5 py-2.5 text-xs sm:text-sm font-semibold text-white flex items-center gap-2 shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 text-pink-300 fill-pink-300" />
            <span>Play Slideshow</span>
          </button>

          <button
            onClick={handleShuffle}
            className="glass-pill hover:bg-white/15 px-4 py-2.5 text-xs sm:text-sm font-medium text-pink-200 flex items-center gap-2 border border-pink-300/30 hover:border-pink-300/60 active:scale-95 transition-all"
          >
            <Shuffle className="w-4 h-4 text-rose-300" />
            <span>Memory Shuffle</span>
          </button>

          <button
            onClick={toggleSound}
            className="glass-pill hover:bg-white/15 p-2.5 text-xs font-medium text-pink-200 flex items-center gap-2 border border-pink-300/30 active:scale-95 transition-all"
            title={isMuted ? 'Play Romantic Piano BGM' : 'Mute Background Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-rose-300" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Soft Piano'}</span>
          </button>
        </div>
      </motion.div>

      {/* Interactive Controls Header: Layout Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-6xl z-10 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 glass-card bg-[#14061f]/70 border border-pink-500/20 p-3 sm:p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl"
      >
        {/* All Memories Header Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-400/30 text-white text-xs sm:text-sm font-semibold">
          <span>💖</span>
          <span>All Memories ({photos.length})</span>
        </div>

        {/* Layout Switcher Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-pink-500/20">
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
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-pink-500/30 text-white border border-pink-400/50 shadow-[0_0_12px_rgba(236,72,153,0.3)]'
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
                <span className="text-xs font-code text-pink-300 tracking-widest uppercase">Fan-out Memory Album</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">Hover & Click to Unfold Memories</h3>
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
        <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mb-8" />
        
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="w-14 h-14 rounded-full bg-pink-500/10 border border-pink-400/30 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(236,72,153,0.3)] mb-4"
        >
          🌹
        </motion.div>

        <p className="font-handwritten text-2xl sm:text-3xl text-pink-200 glow-text-blush max-w-xl px-4 leading-relaxed">
          {ROMANTIC_QUOTES[Math.floor(photos.length % ROMANTIC_QUOTES.length)]}
        </p>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent mt-8" />
      </div>

      {/* FINAL BOTTOM GRAND PHOTO FRAME */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl z-10 mt-6 glass-card bg-gradient-to-b from-pink-950/40 to-[#12061e]/90 border-2 border-pink-400/40 rounded-[36px] p-6 sm:p-10 shadow-[0_0_60px_rgba(236,72,153,0.3)] text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 text-pink-300 font-serif text-9xl select-none pointer-events-none">
          ❤️
        </div>

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-200 text-xs font-code">
            <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>FOREVER IN PROGRESS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white glow-text-pink tracking-tight">
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
              className="glass-button-romantic px-6 py-3 text-sm font-semibold text-white flex items-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Celebrate Our Journey</span>
            </button>

            {onNext && (
              <button
                onClick={() => {
                  soundEngine.playPageSwitch();
                  onNext();
                }}
                className="glass-pill hover:bg-white/15 px-5 py-3 text-sm font-medium text-pink-200 flex items-center gap-2 border border-pink-300/30 hover:border-pink-300/60 active:scale-95 transition-all"
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
        className="glass-card bg-[#140722]/80 border border-pink-500/20 rounded-[28px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.35)] hover:border-pink-400/50 transition-all duration-300 relative group overflow-hidden"
      >
        {/* Butterfly Landing Micro-Animation */}
        {photo.hasButterfly && isHovered && (
          <motion.div
            initial={{ scale: 0, x: 20, y: -20, rotate: -20 }}
            animate={{ scale: 1, x: 0, y: 0, rotate: 10 }}
            exit={{ scale: 0 }}
            className="absolute top-6 right-6 z-30 text-2xl animate-butterfly pointer-events-none drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]"
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
            <span className="glass-pill px-3 py-1 text-[11px] font-code text-pink-200">
              {photo.chapterName}
            </span>

            <button
              onClick={onDownload}
              className="w-9 h-9 rounded-full bg-pink-500/80 hover:bg-pink-500 text-white flex items-center justify-center backdrop-blur-md shadow-lg active:scale-90 transition-all"
              title="Download Photo 📥"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Caption & Handwritten Note */}
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-pink-200 transition-colors">
            {photo.title}
          </h3>
          <p className="font-handwritten text-lg sm:text-xl text-pink-200/90 leading-snug line-clamp-2">
            "{photo.caption}"
          </p>
          <div className="flex items-center justify-end text-[11px] text-pink-300/60 font-code pt-1">
            <span className="flex items-center gap-1 text-pink-300 hover:text-white">
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
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200/40 backdrop-blur-sm border border-white/50 rotate-[-2deg] shadow-sm pointer-events-none" />

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
          className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-pink-500 transition-all"
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
            className={`absolute top-0 w-80 sm:w-96 glass-card bg-[#18092a]/95 border-2 ${
              isCurrent ? 'border-pink-400/80 shadow-[0_0_40px_rgba(236,72,153,0.4)]' : 'border-pink-500/20'
            } rounded-3xl p-4 cursor-pointer hover:scale-102 transition-all`}
          >
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black mb-3 relative">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
              <button
                onClick={(e) => onDownload(photo, e)}
                className="absolute top-3 right-3 p-2 rounded-full bg-pink-500 text-white shadow-lg"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-white font-bold text-lg">{photo.title}</h4>
            <p className="font-handwritten text-pink-200 text-lg line-clamp-1">{photo.caption}</p>
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
        <span className="text-pink-200 text-xs font-code">
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
  onChangeIndex: (idx: number) => void;
  onSelect: (p: GalleryItem) => void;
  onDownload: (p: GalleryItem, e: React.MouseEvent) => void;
}> = ({ photos, currentIndex, onChangeIndex, onSelect, onDownload }) => {
  const count = photos.length;

  return (
    <div className="relative w-full max-w-4xl h-[460px] flex items-center justify-center overflow-hidden">
      {photos.map((photo, idx) => {
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
              opacity: absDiff === 2 ? 0.3 : 1 - absDiff * 0.25,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={() => {
              if (isActive) onSelect(photo);
              else onChangeIndex(idx);
            }}
            className={`absolute w-72 sm:w-88 glass-card bg-[#140620]/90 border-2 ${
              isActive ? 'border-pink-400 shadow-[0_0_50px_rgba(236,72,153,0.5)]' : 'border-pink-500/20'
            } rounded-3xl p-4 cursor-pointer`}
            style={{ perspective: 1000 }}
          >
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black mb-3 relative">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
              {isActive && (
                <button
                  onClick={(e) => onDownload(photo, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-pink-500 text-white shadow-md"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
            <h4 className="text-white font-bold text-base">{photo.title}</h4>
            <p className="font-handwritten text-pink-200 text-base line-clamp-1">{photo.caption}</p>
          </motion.div>
        );
      })}

      {/* Navigation Buttons */}
      <button
        onClick={() => onChangeIndex((currentIndex - 1 + count) % count)}
        className="absolute left-2 z-30 p-3 rounded-full glass-button-romantic text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => onChangeIndex((currentIndex + 1) % count)}
        className="absolute right-2 z-30 p-3 rounded-full glass-button-romantic text-white"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

/* =========================================================
   SUB-COMPONENT 5: CHRONOLOGICAL TIMELINE GALLERY
   ========================================================= */
const TimelineGalleryView: React.FC<{
  photos: GalleryItem[];
  onSelect: (p: GalleryItem) => void;
  onDownload: (p: GalleryItem, e: React.MouseEvent) => void;
}> = ({ photos, onSelect, onDownload }) => {
  return (
    <div className="relative max-w-4xl mx-auto space-y-10 pl-6 sm:pl-10">
      {/* Animated Glowing Line */}
      <div className="absolute left-3 sm:left-5 top-4 bottom-4 w-1 bg-gradient-to-b from-pink-400 via-rose-500 to-purple-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.8)]" />

      {/* Timeline Chapter Badge */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-pink-500 border-4 border-[#0e0716] shadow-[0_0_15px_rgba(236,72,153,1)] z-10 -ml-[25px] sm:-ml-[33px]" />
        <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <span>💖</span>
          <span>Our Memory Journey ❤️</span>
        </h3>
      </div>

      {/* Photos Grid for Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onSelect(photo)}
            className="glass-card bg-[#160726]/80 border border-pink-500/20 rounded-2xl p-4 cursor-pointer hover:scale-102 hover:border-pink-400/50 transition-all group"
          >
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black mb-3 relative">
              <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
              <button
                onClick={(e) => onDownload(photo, e)}
                className="absolute top-2 right-2 p-2 rounded-full bg-pink-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-white font-bold text-base">{photo.title}</h4>
            <p className="font-handwritten text-pink-200 text-lg line-clamp-2">{photo.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   SUB-COMPONENT 6: LIGHTBOX MODAL WITH FULLSCREEN DOWNLOAD
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

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playPageSwitch();
    const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(photos[prevIdx]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playPageSwitch();
    const nextIdx = (currentIndex + 1) % photos.length;
    onNavigate(photos[nextIdx]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        const prevIdx = (currentIndex - 1 + photos.length) % photos.length;
        onNavigate(photos[prevIdx]);
      }
      if (e.key === 'ArrowRight') {
        const nextIdx = (currentIndex + 1) % photos.length;
        onNavigate(photos[nextIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos, onClose, onNavigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card bg-[#14061e]/95 border-2 border-pink-400/40 rounded-[32px] max-w-4xl w-full p-4 sm:p-6 shadow-[0_0_80px_rgba(236,72,153,0.5)] flex flex-col md:flex-row gap-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Photo Display */}
        <div className="relative flex-1 aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
          <img src={photo.src} alt={photo.title} className="w-full h-full object-contain" />

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 p-3 rounded-full bg-black/60 hover:bg-pink-500 text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 p-3 rounded-full bg-black/60 hover:bg-pink-500 text-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Photo Details Sidebar */}
        <div className="w-full md:w-80 flex flex-col justify-between space-y-4 pt-2">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-200 text-xs font-code mb-3">
              <span>{photo.chapterName}</span>
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">{photo.title}</h2>

            <div className="glass-card bg-white/5 p-4 rounded-2xl border border-white/10 mt-3">
              <p className="font-handwritten text-2xl text-pink-100 leading-relaxed">
                "{photo.caption}"
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-pink-500/20">
            {/* Direct Download Button */}
            <button
              onClick={() => onDownload(photo)}
              className="w-full glass-button-romantic py-3 px-4 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:scale-102 active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res Photo 📥</span>
            </button>

            <button
              onClick={onStartSlideshow}
              className="w-full glass-pill py-2.5 px-4 text-xs font-medium text-pink-200 flex items-center justify-center gap-1.5 hover:bg-white/10"
            >
              <Play className="w-3.5 h-3.5 text-pink-300" />
              <span>Start Slideshow</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* =========================================================
   SUB-COMPONENT 7: FULLSCREEN AUTOMATED SLIDESHOW
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
}> = ({ photos, currentIndex, isPlaying, onTogglePlay, onPrev, onNext, onClose, onDownload }) => {
  const current = photos[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 sm:p-8"
    >
      {/* Background Ken Burns Zoom Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url(${current.src})` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70 pointer-events-none" />

      {/* Top Controls */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-code text-xs sm:text-sm">
          <Music className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Playing Romantic Memory Slideshow</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onDownload(current)}
            className="glass-pill p-3 text-white hover:bg-pink-500 transition-all"
            title="Download Current Photo"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="glass-pill p-3 text-white hover:bg-rose-500 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Handwritten Caption */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3 mb-6">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="glass-pill px-4 py-1 text-xs font-code text-pink-200">
            {current.chapterName}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 glow-text-pink">
            {current.title}
          </h2>

          <p className="font-handwritten text-2xl sm:text-3xl text-pink-100 max-w-xl mx-auto mt-2">
            "{current.caption}"
          </p>
        </motion.div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button onClick={onPrev} className="p-3 rounded-full glass-pill text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className="p-4 rounded-full glass-button-romantic text-white shadow-[0_0_30px_rgba(236,72,153,0.6)]"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white" />}
          </button>

          <button onClick={onNext} className="p-3 rounded-full glass-pill text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OurGallery;
