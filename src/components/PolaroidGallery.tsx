import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

// ✨ Page 1: Interactive Polaroid Gallery on Fairy Lights
// Photos as polaroids hanging from twinkling fairy light strings

interface PolaroidGalleryProps {
  onNext: () => void;
}

interface PhotoItem {
  id: number; src: string; title: string; caption: string;
  rotation: number;
}

const PHOTOS: PhotoItem[] = [
  { id: 1, src: '/gallery/photo6.jpg', title: 'Our Very First Date ❤️', caption: 'Underneath the glowing fairy lights of the illuminated trees, where our story officially began.', rotation: -3 },
  { id: 2, src: '/gallery/photo7.jpg', title: 'First Date Magic ✨', caption: 'Our enchanted first date under the starlit tree canopy. Dressed up, smiling bright, and falling for you with every passing second.', rotation: 4 },
  { id: 3, src: '/gallery/photo1.jpg', title: 'Unfiltered Giggles 💕', caption: 'That laugh of yours is still my absolute favorite sound in the whole wide world.', rotation: -2 },
  { id: 4, src: '/gallery/photo2.jpg', title: 'Sweet Delights 🍰', caption: 'Shared sweet treats and even sweeter laughter. Time literally stands still whenever we are together.', rotation: 3 },
  { id: 5, src: '/gallery/photo3.jpg', title: 'Reaching Into Your Heart 💖', caption: 'Reaching out my hand to the only one who holds my heart forever.', rotation: -4 },
  { id: 6, src: '/gallery/photo4.jpg', title: 'Framed By True Love 🤍', caption: 'Two hands forming one heart, framing the most precious person in my entire universe.', rotation: 2 },
  { id: 7, src: '/gallery/photo5.jpg', title: 'Blooming Together 🌸', caption: 'Like flowers blooming in spring, our love grows more beautiful with every passing day.', rotation: -1 },
  { id: 8, src: '/gallery/photo8.jpg', title: 'Golden Moments ✨', caption: 'These golden moments with you are the treasures I hold closest to my heart.', rotation: 3 },
  { id: 9, src: '/gallery/photo9.jpg', title: 'Forever & Always 💕', caption: 'With you, every ending is just a new beginning. Forever and always, my love.', rotation: -3 },
  { id: 10, src: '/gallery/photo10.jpg', title: 'Festive Lights & Warmest Smiles ✨', caption: 'Wrapped in festive colors and glowing fairy lights, your smile lights up my whole world.', rotation: 2 },
  { id: 11, src: '/gallery/photo11.jpg', title: 'Cozy Moments Under Golden Ribbons 🎗️', caption: 'Lean in close, forget the world. With you, every single ordinary moment turns into pure magic.', rotation: -4 },
  { id: 12, src: '/gallery/photo12.jpg', title: 'Playful Glances & Sweet Quiet Love 💕', caption: 'The way you look at me with those beautiful eyes and glasses — my heart skips a beat every single time.', rotation: 3 },
  { id: 13, src: '/gallery/photo13.jpg', title: 'Radiant Laughter & Pure Celebration 💖', caption: 'Big smiles, endless joy, and curls cascading like poetry. Being by your side is my happiest place on Earth.', rotation: -2 },
  { id: 14, src: '/gallery/photo14.jpg', title: 'My Most Precious Gem 🌸', caption: 'Your playful, gorgeous smile framed by golden lights. You are the prettiest fairytale in my life.', rotation: 4 },
  { id: 15, src: '/gallery/photo15.jpg', title: 'Resting Close & Holding Hands 💕', caption: 'Leaning against you at the table, wrapped in your pink linen shirt. Your warmth is my favorite comfort in the world.', rotation: -3 },
  { id: 16, src: '/gallery/photo16.jpg', title: 'Starlit Evening Smiles ✨', caption: 'Under the open night sky, dressed in pink florals with your radiant smile and cute glasses shining brighter than the city lights.', rotation: 2 },
  { id: 17, src: '/gallery/photo17.jpg', title: 'Hands on Chin & Endless Charm 💖', caption: 'Resting your chin on your hands with that adorable smile. Looking at you, I fall in love all over again.', rotation: -4 },
  { id: 18, src: '/gallery/photo18.jpg', title: 'A Symphony of Colors & Love 🌈', caption: 'Standing beneath a canopy of vibrant streamers and twinkling lights. You are the bright color in my life every single day.', rotation: 3 },
  { id: 19, src: '/gallery/photo19.jpg', title: 'Gold Medalist & University Topper 🥇👑', caption: 'Holding her Gold Medal & Certificate of Excellence with highest distinction in B.Pharm at Nirma University. The most brilliant topper in the world! 💕', rotation: -2 },
  { id: 20, src: '/gallery/photo20.jpg', title: 'Poetry in Handwriting ✍️✨', caption: 'Her handwriting is pure perfection — neat, elegant, and effortless. Even her study notes look like a work of romantic art. 📖💖', rotation: 3 },
  { id: 21, src: '/gallery/photo21.jpg', title: 'Moonlit Elegance & Starlit Grace 🌙✨', caption: 'Standing beneath the open starlit sky in her elegant white dress. Ethereal beauty in its purest form. 💫🤍', rotation: -3 },
  { id: 22, src: '/gallery/photo22.jpg', title: 'Pink Flower in Her Hair 🌸👓', caption: 'A fresh pink flower tucked softly behind her ear, adorable glasses, and that sweet enchanting smile. 💕', rotation: 2 },
];

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ onNext }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [butterflyTarget, setButterflyTarget] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Random butterfly movement
  useEffect(() => {
    const interval = setInterval(() => {
      setButterflyTarget({
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 60,
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePhotoClick = (photo: PhotoItem) => {
    soundEngine.playClick();
    setSelectedPhoto(photo);
  };

  const handleClose = () => {
    soundEngine.playClick();
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: number) => {
    if (!selectedPhoto) return;
    soundEngine.playPageSwitch();
    const currentIdx = PHOTOS.findIndex(p => p.id === selectedPhoto.id);
    const nextIdx = (currentIdx + direction + PHOTOS.length) % PHOTOS.length;
    setSelectedPhoto(PHOTOS[nextIdx]);
  };

  // Fairy light positions dynamically calculated based on photo count
  const numStrings = Math.ceil(PHOTOS.length / 3);
  const strings = Array.from({ length: numStrings }, (_, idx) => ({
    y: `${8 + idx * 18}%`,
    sag: 20 + (idx % 3) * 4,
  }));

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a0a2e 0%, #0f051d 50%, #1a0a2e 100%)' }}
    >
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center pt-8 pb-4 relative z-10"
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white glow-text-blush">
          Our Memories 📸
        </h2>
        <p className="font-body text-sm sm:text-base text-white/50 mt-2">
          Each photo is a chapter in our love story
        </p>
      </motion.div>

      {/* Fairy Light Strings with Polaroids */}
      <div className="relative w-full" style={{ minHeight: `${Math.max(80, numStrings * 28)}vh`, paddingBottom: '4rem' }}>
        {strings.map((string, sIdx) => {
          const photosOnString = PHOTOS.slice(sIdx * 3, sIdx * 3 + 3);
          return (
            <div key={sIdx} className="absolute w-full" style={{ top: string.y }}>
              {/* String/rope */}
              <svg className="absolute w-full" style={{ top: 0, height: '40px', overflow: 'visible' }}>
                <path
                  d={`M 0 20 Q ${window.innerWidth / 2} ${20 + string.sag} ${window.innerWidth} 20`}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1.5"
                  fill="none"
                />
                {/* Fairy lights on string */}
                {Array.from({ length: 15 }, (_, i) => {
                  const t = (i + 1) / 16;
                  const x = window.innerWidth * t;
                  const y = 20 + Math.sin(t * Math.PI) * string.sag;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={`hsl(${40 + Math.random() * 20}, 90%, 75%)`}
                      opacity={0.5 + Math.sin(Date.now() * 0.002 + i) * 0.3}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;1;0.4"
                        dur={`${2 + Math.random() * 2}s`}
                        repeatCount="indefinite"
                      />
                    </circle>
                  );
                })}
              </svg>

              {/* Polaroids hanging from string */}
              <div className="flex justify-around items-start px-8 sm:px-16 md:px-24 pt-6 relative z-10">
                {photosOnString.map((photo, pIdx) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, y: -30, rotate: photo.rotation }}
                    animate={{ opacity: 1, y: 0, rotate: photo.rotation }}
                    transition={{ delay: 0.3 + sIdx * 0.3 + pIdx * 0.15, duration: 0.7, type: 'spring' }}
                    className="relative"
                    style={{
                      transformOrigin: 'top center',
                      animation: `polaroidSwing ${3 + pIdx * 0.5}s ease-in-out infinite`,
                      ['--swing-from' as any]: `${photo.rotation - 1.5}deg`,
                      ['--swing-to' as any]: `${photo.rotation + 1.5}deg`,
                    }}
                  >
                    {/* Clip/pin connector */}
                    <div className="w-1 h-6 bg-white/20 mx-auto mb-0" />

                    {/* Polaroid card */}
                    <div
                      className="polaroid-frame p-2 sm:p-3 w-28 sm:w-36 md:w-44 transition-transform duration-500"
                      onClick={() => handlePhotoClick(photo)}
                    >
                      <div className="relative overflow-hidden rounded-sm aspect-[3/4]">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          loading="lazy"
                        />
                        {/* Subtle sparkle overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                      <p className="font-handwritten text-gray-700 text-xs sm:text-sm mt-2 text-center leading-tight">
                        {photo.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Floating butterfly */}
        <motion.div
          animate={{ left: `${butterflyTarget.x}%`, top: `${butterflyTarget.y}%` }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className="absolute text-2xl pointer-events-none"
          style={{ zIndex: 20 }}
        >
          <span className="animate-butterfly-wings inline-block">🦋</span>
        </motion.div>
      </div>

      {/* Fullscreen Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 flex items-center justify-center p-4 sm:p-8"
            style={{ zIndex: 50, background: 'rgba(10, 5, 20, 0.92)', backdropFilter: 'blur(20px)' }}
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="relative max-w-4xl w-full glass-card-romantic p-4 sm:p-6 rounded-3xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-20 p-2"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo */}
              <div className="relative overflow-hidden rounded-2xl film-grain">
                <motion.img
                  key={selectedPhoto.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[60vh] object-contain rounded-2xl"
                />
              </div>

              {/* Caption */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 text-center"
              >
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {selectedPhoto.title}
                </h3>
                <p className="font-body text-white/60 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
                  {selectedPhoto.caption}
                </p>
              </motion.div>

              {/* Navigation arrows */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={(e) => { e.stopPropagation(); navigatePhoto(-1); }}
                  className="glass-pill p-3 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-white/30 text-xs font-body">
                  {PHOTOS.findIndex(p => p.id === selectedPhoto.id) + 1} / {PHOTOS.length}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigatePhoto(1); }}
                  className="glass-pill p-3 text-white/70 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="flex justify-center pb-8 relative z-10"
      >
        <button onClick={() => { soundEngine.playPageSwitch(); onNext(); }} className="glass-button text-sm sm:text-base">
          Continue Our Journey 🌸
        </button>
      </motion.div>
    </section>
  );
};
