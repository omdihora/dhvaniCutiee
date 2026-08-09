import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Page Components (Pages 0 to 21 - All 22 Interactive Chapters)
import { FingerprintAuth } from './components/FingerprintAuth';
import { TerminalBoot } from './components/TerminalBoot';
import { HeroWelcome } from './components/HeroWelcome';
import { LoveEnvelope } from './components/LoveEnvelope';
import { BloomingRose } from './components/BloomingRose';
import { ShootingStar } from './components/ShootingStar';
import { HeartSync } from './components/HeartSync';
import { OurStoryTimeline } from './components/OurStoryTimeline';
import { DevTerminal } from './components/DevTerminal';
import { FunButtons } from './components/FunButtons';
import { LoveProtocolQuiz } from './components/LoveProtocolQuiz';
import { SilentApology } from './components/SilentApology';
import { NightSkyLetter } from './components/NightSkyLetter';
import { OurUniverse } from './components/OurUniverse';
import { LoveDNAScanner } from './components/LoveDNAScanner';
import { GitHubCommitHistory } from './components/GitHubCommitHistory';
import { RelationshipDatabase } from './components/RelationshipDatabase';
import { LoveGPTChat } from './components/LoveGPTChat';
import { EnchantedGarden } from './components/EnchantedGarden';
import { LotusLake } from './components/LotusLake';
import { July9thSpecial } from './components/July9thSpecial';
import { GrandFinale } from './components/GrandFinale';
import { OurGallery } from './components/OurGallery';

// 3D World Canvas, Bento Hub & Floating Dock
import { WorldCanvas3D } from './components/WorldCanvas3D';
import { ButterflyGuide } from './components/ButterflyGuide';
import { ExperienceBentoHub } from './components/ExperienceBentoHub';
import { FloatingDock } from './components/FloatingDock';

// Global Overlays & Controls
import { NavigationHeader } from './components/NavigationHeader';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { BackgroundParticles } from './components/BackgroundParticles';
import { EasterEggsModal } from './components/EasterEggsModal';

export function App() {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'cinema' | 'bento'>('cinema');
  const [isOpenHint, setIsOpenHint] = useState<boolean>(false);

  const handleNavigateToPage = (index: number) => {
    setCurrentPageIndex(index);
  };

  // Keyboard navigation & view toggle (Escape key toggles Bento Hub)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewMode((prev) => (prev === 'cinema' ? 'bento' : 'cinema'));
      } else if (viewMode === 'cinema') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          setCurrentPageIndex((prev) => (prev < 22 ? prev + 1 : prev));
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          setCurrentPageIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const renderCurrentPage = () => {
    switch (currentPageIndex) {
      case 0:
        return <FingerprintAuth onAuthenticated={() => handleNavigateToPage(1)} />;
      case 1:
        return <TerminalBoot onComplete={() => handleNavigateToPage(2)} />;
      case 2:
        return <HeroWelcome onStartQuiz={() => handleNavigateToPage(3)} onOpenGallery={() => handleNavigateToPage(22)} />;
      case 3:
        return <LoveEnvelope onNext={() => handleNavigateToPage(4)} />;
      case 4:
        return <BloomingRose onNext={() => handleNavigateToPage(5)} />;
      case 5:
        return <ShootingStar onNext={() => handleNavigateToPage(6)} />;
      case 6:
        return <HeartSync onNext={() => handleNavigateToPage(7)} />;
      case 7:
        return <OurStoryTimeline onNext={() => handleNavigateToPage(8)} />;
      case 8:
        return <DevTerminal onNext={() => handleNavigateToPage(9)} />;
      case 9:
        return <FunButtons onNext={() => handleNavigateToPage(10)} />;
      case 10:
        return <LoveProtocolQuiz onQuizComplete={() => handleNavigateToPage(11)} />;
      case 11:
        return <SilentApology onNext={() => handleNavigateToPage(12)} />;
      case 12:
        return <NightSkyLetter onOneLastClick={() => handleNavigateToPage(13)} />;
      case 13:
        return <OurUniverse onNext={() => handleNavigateToPage(14)} />;
      case 14:
        return <LoveDNAScanner onNext={() => handleNavigateToPage(15)} />;
      case 15:
        return <GitHubCommitHistory onNext={() => handleNavigateToPage(16)} />;
      case 16:
        return <RelationshipDatabase onNext={() => handleNavigateToPage(17)} />;
      case 17:
        return <LoveGPTChat onNext={() => handleNavigateToPage(18)} />;
      case 18:
        return <EnchantedGarden onNext={() => handleNavigateToPage(19)} />;
      case 19:
        return <LotusLake onNext={() => handleNavigateToPage(20)} />;
      case 20:
        return <July9thSpecial onNext={() => handleNavigateToPage(21)} />;
      case 21:
        return <GrandFinale onRestart={() => handleNavigateToPage(0)} onOpenGallery={() => handleNavigateToPage(22)} />;
      case 22:
        return <OurGallery onNext={() => handleNavigateToPage(0)} />;
      default:
        return <FingerprintAuth onAuthenticated={() => handleNavigateToPage(1)} />;
    }
  };

  const isNightSkyMode = currentPageIndex === 5 || currentPageIndex === 12 || currentPageIndex === 19 || currentPageIndex === 21;
  const isFullBleedPage = currentPageIndex === 2 || currentPageIndex === 11 || currentPageIndex === 18 || currentPageIndex === 19 || currentPageIndex === 20 || currentPageIndex === 22;
  const isHeroPage = currentPageIndex === 2;

  const progressPercentage = ((currentPageIndex + 1) / 23) * 100;

  return (
    <div className="min-h-screen w-full relative bg-[#0f051d] text-slate-100 overflow-x-hidden select-none font-sans flex flex-col justify-between">
      {/* Global Top Experience Progress Indicator Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-white/10 z-50 pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 shadow-[0_0_12px_rgba(212,175,55,0.8)]"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* 1. Continuous 3D WebGL World Canvas */}
      <WorldCanvas3D currentPageIndex={currentPageIndex} />

      {/* 2. Interactive Light Butterfly Guide */}
      <ButterflyGuide currentPageIndex={currentPageIndex} />

      {/* 3. Custom Interactive Heart & Gold Cursor Trail */}
      <HeartCursorTrail />

      {/* 4. Dynamic Ambient Particle Canvas */}
      {!isHeroPage && <BackgroundParticles mode={isNightSkyMode ? 'nightsky' : 'default'} />}

      {/* 5. Navigation Header & Page Selector Controls */}
      {!isHeroPage && (
        <NavigationHeader
          currentPageIndex={currentPageIndex}
          onNavigate={handleNavigateToPage}
          onOpenSecretHint={() => setIsOpenHint(true)}
        />
      )}

      {/* 6. Main Viewport (Cinema Mode vs. Bento Hub Mode) */}
      <main className={`relative z-10 w-full min-h-screen flex flex-col justify-center items-center ${isFullBleedPage ? 'p-0' : 'pt-14 pb-24 px-2 sm:px-4'}`}>
        <AnimatePresence mode="wait">
          {viewMode === 'bento' ? (
            <motion.div
              key="bento"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <ExperienceBentoHub
                currentPageIndex={currentPageIndex}
                onSelectChapter={handleNavigateToPage}
                onCloseHub={() => setViewMode('cinema')}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentPageIndex}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex justify-center items-center"
            >
              {renderCurrentPage()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 7. Floating Mac / iOS Glass Dock */}
      <FloatingDock
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onNavigate={handleNavigateToPage}
        onOpenSecretHint={() => setIsOpenHint(true)}
      />

      {/* 8. Keyboard Secrets & Hints Modal */}
      <EasterEggsModal
        isOpenHint={isOpenHint}
        onCloseHint={() => setIsOpenHint(false)}
      />
    </div>
  );
}

export default App;
