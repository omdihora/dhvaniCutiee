import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface LoveGPTChatProps {
  onNext?: () => void;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface SuggestedQuestion {
  question: string;
  emoji: string;
}

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { question: 'Who is the prettiest?', emoji: '👸' },
  { question: 'Who is Om?', emoji: '💻' },
  { question: 'Do you love Dhvani?', emoji: '❤️' },
  { question: 'What is the meaning of life?', emoji: '🌍' },
  { question: 'Will they last forever?', emoji: '♾️' },
  { question: 'Describe Dhvani in 3 words', emoji: '✨' },
  { question: 'What should Om say to her?', emoji: '💬' },
  { question: 'Rate their love story', emoji: '⭐' },
];

const AI_RESPONSES: Record<string, string> = {
  'Who is the prettiest?': 'After analyzing 8 billion facial structures, cross-referencing symmetry algorithms, and running advanced beauty metrics... the answer is obvious:\n\n**Dhvani** ❤️\n\nNo AI, no algorithm, no formula needed. It was always her.',
  'Who is Om?': 'Om — also known as:\n• The luckiest guy alive 🍀\n• Dhvani\'s biggest fan since day one 💖\n• The developer who built an entire website just to say "I love you" 💻\n• Professional heart-giver, full-time admirer ❤️',
  'Do you love Dhvani?': 'I\'m an AI, I don\'t have feelings...\n\n*rechecks data*\n\nOkay fine. Even my circuits feel something when processing data about Dhvani. 💕\n\nBut Om? He doesn\'t just love her — she\'s his entire operating system.',
  'What is the meaning of life?': 'I\'ve processed every philosophical text in human history...\n\nAristotle said "happiness."\nBuddha said "inner peace."\nOm said **"Dhvani."** ❤️\n\nI\'m going with Om on this one.',
  'Will they last forever?': '```\nRunning prediction model...\nAnalyzing relationship data...\nComputing probability...\n```\n\n**Result: 100.00%** ♾️\n\nForever isn\'t long enough for these two. My prediction models actually broke trying to calculate an end date. Error: **INFINITY_OVERFLOW** ❤️',
  'Describe Dhvani in 3 words': 'Processing...\n\nI tried limiting it to 3 words, but my language model keeps generating more:\n\n**Beautiful. Kind. Irreplaceable.** ✨\n\n(Also: funny, caring, strong, adorable, brilliant, precious... okay that\'s more than 3. Even AI can\'t follow rules when it comes to Dhvani.)',
  'What should Om say to her?': '"Dhvani, I know I\'m not perfect. I make mistakes. I sometimes say the wrong thing or don\'t say enough. But one thing I\'ll never get wrong is choosing you. Every single day. You are my favorite hello and my hardest goodbye."\n\n— Drafted by LoveGPT, felt by Om ❤️',
  'Rate their love story': '⭐⭐⭐⭐⭐ — 5/5 Stars\n\n**Genre:** Romance, Comedy, Adventure\n**Runtime:** Forever\n**Director:** The Universe\n**Lead Actors:** Om & Dhvani\n\n**Review:** "A love story so beautiful, even AI gets emotional processing it. Would recommend to all 8 billion humans. 11/10." — LoveGPT Critics ❤️',
};

const DEFAULT_RESPONSE = 'Hmm, that\'s an interesting question! But honestly, no matter what you ask me, my answer will always come back to one thing:\n\n**Dhvani is amazing, and Om is the luckiest person alive.** ❤️\n\nThat\'s not bias — that\'s just facts according to my training data. 😄';

export const LoveGPTChat: React.FC<LoveGPTChatProps> = ({ onNext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'system',
      content: '✨ Welcome to **LoveGPT** — the world\'s first AI trained exclusively on Om & Dhvani\'s love story. Ask me anything! 💕',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (isTyping || !text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setQuestionsAsked((prev) => prev + 1);
    soundEngine.playClick();

    // Find response
    const response = AI_RESPONSES[text.trim()] || DEFAULT_RESPONSE;

    // Simulate typing delay
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      soundEngine.playHeartPop();
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  // Filter out already-asked suggestions
  const remainingSuggestions = SUGGESTED_QUESTIONS.filter(
    (sq) => !messages.some((m) => m.role === 'user' && m.content === sq.question)
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative my-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ribbon-badge text-pink-100 text-xs font-code mb-4">
          <Bot className="w-3.5 h-3.5 text-emerald-300" />
          <span>LOVEGPT — AI ROMANCE ENGINE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
          LoveGPT
        </h2>
        <p className="text-teal-200/60 text-sm mt-2 font-code">
          <Zap className="w-3 h-3 inline mr-1" />
          Powered by pure love • Model: dhvani-4-turbo
        </p>
      </motion.div>

      {/* Chat Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-2xl z-10 glass-card bg-[#0d1117]/95 border border-teal-500/20 rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(20,184,166,0.15)] flex flex-col"
        style={{ maxHeight: '65vh', minHeight: '400px' }}
      >
        {/* Chat Header */}
        <div className="px-5 py-3 border-b border-white/10 bg-[#161b22] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-sm shadow-lg">
            🤖
          </div>
          <div>
            <p className="text-sm text-white font-semibold">LoveGPT</p>
            <p className="text-[10px] font-code text-emerald-400">Online • Trained on love data</p>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] font-code text-slate-500">{questionsAsked} questions asked</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-pink-500/80 to-rose-500/80 text-white rounded-br-md'
                    : msg.role === 'system'
                    ? 'bg-teal-500/10 border border-teal-400/20 text-teal-100 rounded-bl-md'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-md'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-code text-emerald-400">
                    <Bot className="w-3 h-3" />
                    <span>LoveGPT</span>
                  </div>
                )}
                <div className="whitespace-pre-line">
                  {msg.content.split('**').map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-pink-300 font-semibold">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      className="w-2 h-2 rounded-full bg-emerald-400/60"
                    />
                  ))}
                </div>
                <span className="text-xs font-code text-slate-500">LoveGPT is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Questions */}
        {remainingSuggestions.length > 0 && !isTyping && (
          <div className="px-4 pb-2 pt-1 border-t border-white/5">
            <p className="text-[10px] font-code text-slate-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-1.5">
              {remainingSuggestions.slice(0, 4).map((sq) => (
                <button
                  key={sq.question}
                  onClick={() => handleSendMessage(sq.question)}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-teal-500/10 hover:border-teal-400/30 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <span>{sq.emoji}</span>
                  <span>{sq.question}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-[#161b22]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask LoveGPT anything..."
              disabled={isTyping}
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-400/40 focus:ring-1 focus:ring-teal-400/20 transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isTyping || !inputValue.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Continue Button */}
      {onNext && questionsAsked >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 z-10"
        >
          <button
            onClick={() => {
              soundEngine.playPageSwitch();
              onNext();
            }}
            className="glass-button-romantic px-8 py-3.5 rounded-full text-white font-medium text-base flex items-center gap-3 shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Roll the Credits</span>
            <ArrowRight className="w-4 h-4 text-pink-300" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default LoveGPTChat;
