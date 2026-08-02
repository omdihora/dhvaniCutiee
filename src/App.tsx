import React, { useState } from 'react';
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
import { NightSkyLetter } from './components/NightSkyLetter';
import { OurUniverse } from './components/OurUniverse';
import { LoveDNAScanner } from './components/LoveDNAScanner';
import { GitHubCommitHistory } from './components/GitHubCommitHistory';
import { RelationshipDatabase } from './components/RelationshipDatabase';
import { LoveGPTChat } from './components/LoveGPTChat';
import { EnchantedGarden } from './components/EnchantedGarden';
import { LotusLake } from './components/LotusLake';
import { GirlfriendDay } from './components/GirlfriendDay';
import { GrandFinale } from './components/GrandFinale';
import { OurGallery } from './components/OurGallery';

// 3D World Canvas & Interactive Butterfly Guide
import { WorldCanvas3D } from './components/WorldCanvas3D';
import { ButterflyGuide } from './components/ButterflyGuide';

// Global Overlays & Controls
import { NavigationHeader } from './components/NavigationHeader';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { BackgroundParticles } from './components/BackgroundParticles';
import { EasterEggsModal } from './components/EasterEggsModal';

export function App() {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isOpenHint, setIsOpenHint] = useState<boolean>(false);

  const handleNavigateToPage = (index: number) => {
    setCurrentPageIndex(index);
  };

  const renderCurrentPage = () => {
    switch (currentPageIndex) {
      case 0:
        return <FingerprintAuth onAuthenticated={() => handleNavigateToPage(1)} />;
      case 1:
        return <TerminalBoot onComplete={() => handleNavigateToPage(2)} />;
      case 2:
        return <HeroWelcome onStartQuiz={() => handleNavigateToPage(3)} onOpenGallery={() => handleNavigateToPage(21)} />;
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
        return <NightSkyLetter onOneLastClick={() => handleNavigateToPage(12)} />;
      case 12:
        return <OurUniverse onNext={() => handleNavigateToPage(13)} />;
      case 13:
        return <LoveDNAScanner onNext={() => handleNavigateToPage(14)} />;
      case 14:
        return <GitHubCommitHistory onNext={() => handleNavigateToPage(15)} />;
      case 15:
        return <RelationshipDatabase onNext={() => handleNavigateToPage(16)} />;
      case 16:
        return <LoveGPTChat onNext={() => handleNavigateToPage(17)} />;
      case 17:
        return <EnchantedGarden onNext={() => handleNavigateToPage(18)} />;
      case 18:
        return <LotusLake onNext={() => handleNavigateToPage(19)} />;
      case 19:
        return <GirlfriendDay onNext={() => handleNavigateToPage(20)} />;
      case 20:
        return <GrandFinale onRestart={() => handleNavigateToPage(0)} onOpenGallery={() => handleNavigateToPage(21)} />;
      case 21:
        return <OurGallery onNext={() => handleNavigateToPage(0)} />;
      default:
        return <FingerprintAuth onAuthenticated={() => handleNavigateToPage(1)} />;
    }
  };

  const isNightSkyMode = currentPageIndex === 5 || currentPageIndex === 11 || currentPageIndex === 18 || currentPageIndex === 20;
  const isFullBleedPage = currentPageIndex === 2 || currentPageIndex === 17 || currentPageIndex === 18 || currentPageIndex === 19 || currentPageIndex === 21;
  const isHeroPage = currentPageIndex === 2;

  return (
    <div className="min-h-screen w-full relative bg-[#0f051d] text-slate-100 overflow-x-hidden select-none font-sans flex flex-col justify-between">
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

      {/* 6. Main Viewport with Smooth Journey Transitions */}
      <main className={`relative z-10 w-full min-h-screen flex flex-col justify-center items-center ${isFullBleedPage ? 'p-0' : 'pt-14 pb-16 px-2 sm:px-4'}`}>
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </main>

      {/* 7. Keyboard Secrets & Hints Modal */}
      <EasterEggsModal
        isOpenHint={isOpenHint}
        onCloseHint={() => setIsOpenHint(false)}
      />
    </div>
  );
}

export default App;
