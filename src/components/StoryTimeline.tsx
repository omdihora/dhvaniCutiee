import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { soundEngine } from '../utils/audio';

// ✨ Page 2: Our Story Timeline
// Beautiful milestones with blooming flowers, handwritten notes, and butterflies

interface StoryTimelineProps {
  onNext: () => void;
}

interface Milestone {
  date: string;
  title: string;
  description: string;
  emoji: string;
  photo?: string;
  note?: string;
}

const MILESTONES: Milestone[] = [
  {
    date: 'The Very Beginning',
    title: 'When Our Eyes First Met',
    description: 'In a world of 8 billion people, fate chose us to cross paths. That very first glance changed everything forever.',
    emoji: '✨',
    note: 'I knew from the very first moment...',
  },
  {
    date: 'The First Conversation',
    title: 'When Words Became Magic',
    description: 'Every message, every call, every word exchanged felt like poetry being written in real-time by the universe itself.',
    emoji: '💬',
  },
  {
    date: 'Our First Date',
    title: 'A Night to Remember Forever',
    description: 'Under the glowing fairy lights, standing next to you, I realized that home is not a place — it is a person.',
    emoji: '🌟',
    photo: '/gallery/photo6.jpg',
    note: 'The best night of my life ❤️',
  },
  {
    date: 'Falling Deeper',
    title: 'When Like Became Love',
    description: "It wasn't a single moment. It was every laugh, every silence, every look — all of them slowly weaving love into my heart.",
    emoji: '🌹',
  },
  {
    date: 'The Distance',
    title: 'Love That Bridges Every Mile',
    description: 'They say distance is the greatest test of love. But for us, it only made every reunion more magical and every moment more precious.',
    emoji: '🌏',
    note: 'Distance means nothing when the heart is full',
  },
  {
    date: 'Growing Together',
    title: 'Building Our Beautiful World',
    description: 'Every challenge faced together, every dream shared, every plan made — we are not just in a relationship, we are building a universe.',
    emoji: '🌸',
    photo: '/gallery/photo3.jpg',
  },
  {
    date: 'Today & Beyond',
    title: 'Every Day Is Our New Chapter',
    description: 'Our story doesn\'t have an ending because the best love stories never do. Every sunrise brings a new page in our forever book.',
    emoji: '💕',
    note: 'Forever is not long enough with you ❤️',
  },
];

const MilestoneCard: React.FC<{ milestone: Milestone; index: number; isLeft: boolean }> = ({
  milestone, index, isLeft,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [showButterfly, setShowButterfly] = useState(false);

  useEffect(() => {
    if (isInView) {
      soundEngine.playFlowerBloom();
      const t = setTimeout(() => setShowButterfly(true), 800);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 sm:gap-8 w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60, scale: 0.9 }}
        animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100, delay: 0.1 }}
        className="flex-1 max-w-md relative"
      >
        <div className="glass-card-romantic p-5 sm:p-6 relative overflow-hidden">
          {/* Emoji badge */}
          <div className="text-3xl mb-3">{milestone.emoji}</div>

          {/* Date */}
          <p className="font-body text-xs text-white/40 uppercase tracking-widest mb-1">
            {milestone.date}
          </p>

          {/* Title */}
          <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
            {milestone.title}
          </h3>

          {/* Description */}
          <p className="font-body text-sm text-white/60 leading-relaxed">
            {milestone.description}
          </p>

          {/* Photo if any */}
          {milestone.photo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-4 rounded-xl overflow-hidden"
            >
              <img
                src={milestone.photo}
                alt={milestone.title}
                className="w-full h-36 sm:h-44 object-cover rounded-xl"
                loading="lazy"
              />
            </motion.div>
          )}

          {/* Handwritten note */}
          {milestone.note && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="font-handwritten text-base sm:text-lg text-pink-300/80 mt-3 italic"
            >
              "{milestone.note}"
            </motion.p>
          )}

          {/* Decorative flower bloom */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 0.4 } : {}}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
            className="absolute -top-4 -right-4 text-4xl pointer-events-none"
          >
            🌸
          </motion.div>

          {/* Butterfly */}
          {showButterfly && (
            <motion.div
              initial={{ opacity: 0, x: isLeft ? -30 : 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1.5, type: 'spring' }}
              className="absolute -top-6 right-8 text-xl pointer-events-none"
            >
              <span className="animate-butterfly-wings inline-block">🦋</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        className="flex-shrink-0 relative"
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-pink-400 bg-pink-500/30"
          style={{
            boxShadow: isInView
              ? '0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(236, 72, 153, 0.2)'
              : 'none',
          }}
        />
        {/* Blooming flower at node */}
        {isInView && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="absolute -top-2 -left-2 text-xl pointer-events-none"
          >
            🌺
          </motion.div>
        )}
      </motion.div>

      {/* Spacer for alignment */}
      <div className="flex-1 max-w-md" />
    </div>
  );
};

export const StoryTimeline: React.FC<StoryTimelineProps> = ({ onNext }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={containerRef}
      className="min-h-screen w-full py-12 px-4 sm:px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f051d 0%, #1a0a2e 50%, #0f051d 100%)' }}
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white glow-text-blush">
          Our Story 📖
        </h2>
        <p className="font-body text-sm sm:text-base text-white/40 mt-2">
          Every chapter written with love
        </p>
      </motion.div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto relative">
        {/* Central vine/line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(236, 72, 153, 0.3), rgba(216, 180, 254, 0.3), transparent)',
          }}
        />

        {/* Milestones */}
        <div className="space-y-12 sm:space-y-16 relative z-10">
          {MILESTONES.map((milestone, index) => (
            <MilestoneCard
              key={index}
              milestone={milestone}
              index={index}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>

      {/* Next button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex justify-center mt-16"
      >
        <button
          onClick={() => { soundEngine.playPageSwitch(); onNext(); }}
          className="glass-button text-sm sm:text-base"
        >
          Explore the Garden 🌸
        </button>
      </motion.div>
    </section>
  );
};
