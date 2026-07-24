import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TerminalBoot } from './components/TerminalBoot';
import { HeroWelcome } from './components/HeroWelcome';
import { LoveProtocolQuiz } from './components/LoveProtocolQuiz';
import { NightSkyLetter } from './components/NightSkyLetter';
import { GrandFinale } from './components/GrandFinale';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { BackgroundParticles } from './components/BackgroundParticles';
import { HeaderControls } from './components/HeaderControls';
import { EasterEggsModal } from './components/EasterEggsModal';

type AppStage = 'terminal' | 'welcome' | 'quiz' | 'letter' | 'finale';

export function App() {
  const [stage, setStage] = useState<AppStage>('terminal');
  const [isOpenHint, setIsOpenHint] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full relative bg-[#0b0612] text-slate-100 overflow-x-hidden select-none font-sans">
      {/* 1. Custom Interactive Heart Cursor Trail */}
      <HeartCursorTrail />

      {/* 2. Dynamic Particle Canvas Background */}
      <BackgroundParticles mode={stage === 'letter' || stage === 'finale' ? 'nightsky' : 'default'} />

      {/* 3. Header Controls (Visible after Terminal Boot) */}
      {stage !== 'terminal' && (
        <HeaderControls
          currentStage={stage}
          onOpenSecretHint={() => setIsOpenHint(true)}
        />
      )}

      {/* 4. Main Stage Content Viewport */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center">
        <AnimatePresence mode="wait">
          {stage === 'terminal' && (
            <TerminalBoot
              key="terminal-stage"
              onComplete={() => setStage('welcome')}
            />
          )}

          {stage === 'welcome' && (
            <HeroWelcome
              key="welcome-stage"
              onStartQuiz={() => setStage('quiz')}
            />
          )}

          {stage === 'quiz' && (
            <LoveProtocolQuiz
              key="quiz-stage"
              onQuizComplete={() => setStage('letter')}
            />
          )}

          {stage === 'letter' && (
            <NightSkyLetter
              key="letter-stage"
              onOneLastClick={() => setStage('finale')}
            />
          )}

          {stage === 'finale' && (
            <GrandFinale
              key="finale-stage"
              onRestart={() => setStage('welcome')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* 5. Secret Easter Egg Listener & Hints Drawer */}
      <EasterEggsModal
        isOpenHint={isOpenHint}
        onCloseHint={() => setIsOpenHint(false)}
      />
    </div>
  );
}

export default App;
