import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Share2, Sparkles, Check } from 'lucide-react';

interface WinnerCelebrationProps {
  winners: string[];
  platform: string;
  onReset: () => void;
}

export const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({ winners, platform, onReset }) => {
  const [phase, setPhase] = useState<'spinning' | 'celebrating'>('spinning');
  const [copied, setCopied] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('@alex_dev');

  const mockCycleUsers = [
    '@sarah_codes', '@mike_js', '@emma_ts', '@john_react', '@lisa_node', 
    '@chris_db', '@anna_css', '@pramod10', '@nina_html', '@tom_vue', 
    '@lucy_angular', '@sam_python', '@kate_java', '@ryan_ruby'
  ];

  useEffect(() => {
    if (phase === 'spinning') {
      let index = 0;
      const interval = setInterval(() => {
        setCurrentUser(mockCycleUsers[index % mockCycleUsers.length]);
        index++;
      }, 70);

      // Stop spinning after 3.5 seconds and trigger celebration
      const timeout = setTimeout(() => {
        clearInterval(interval);
        setPhase('celebrating');
        triggerConfetti();
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [phase]);

  const triggerConfetti = () => {
    // Left burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.1, y: 0.6 }
    });
    // Right burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.9, y: 0.6 }
    });
    // Center burst
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { x: 0.5, y: 0.5 }
      });
    }, 400);
  };

  const handleShare = () => {
    const text = `🎉 Lucky winners of our ${platform.toUpperCase()} giveaway: ${winners.join(', ')}! Picked fairly via LuckyPick.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto glass-panel p-8 rounded-3xl text-center glow-pink relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-pink-500/10 to-primary-500/10 blur-3xl pointer-events-none"></div>

      {phase === 'spinning' ? (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
            <div className="relative w-24 h-24 border-4 border-dashed border-primary-400 rounded-full flex items-center justify-center animate-spin-slow">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
          </div>
          
          <h2 className="text-xl font-bold font-heading text-gray-400 uppercase tracking-widest mb-4">
            Shuffling Comments
          </h2>
          
          {/* Rolling UI */}
          <div className="h-16 overflow-hidden relative w-64 border-y border-white/10 flex items-center justify-center">
            <span className="text-2xl font-bold font-heading text-primary-300 animate-pulse">
              {currentUser}
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-6 font-sans">
            Randomizing selection using secure backend shuffling...
          </p>
        </div>
      ) : (
        <div className="py-6 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500 to-pink-500 blur-2xl opacity-30 rounded-full"></div>
            <div className="relative bg-gradient-to-tr from-yellow-500 to-amber-400 p-4 rounded-full border border-white/20 shadow-2xl">
              <Trophy className="w-12 h-12 text-dark-bg animate-bounce" />
            </div>
          </div>

          <h2 className="text-3xl font-extrabold font-heading text-white mb-2 tracking-tight">
            We Have a Winner!
          </h2>
          <p className="text-gray-400 text-sm font-sans mb-8">
            Selected from your {platform.toUpperCase()} post comments.
          </p>

          {/* Winner cards */}
          <div className="w-full space-y-3 mb-8">
            {winners.map((winner, idx) => (
              <div
                key={winner + idx}
                style={{ animationDelay: `${idx * 150}ms` }}
                className="relative glass-panel bg-white/2 border border-white/10 px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg overflow-hidden animate-fade-in group hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary-500 to-blue-500"></div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center font-bold font-heading text-primary-300 text-sm">
                    #{idx + 1}
                  </div>
                  <span className="text-xl font-bold font-heading text-white tracking-wide group-hover:text-primary-300 transition-colors">
                    {winner}
                  </span>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full border border-primary-500/20">
                  Fair Pick
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={handleShare}
              className="flex-1 py-3.5 px-6 rounded-2xl font-semibold font-heading text-white border border-white/10 hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied results!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy Results</span>
                </>
              )}
            </button>
            <button
              onClick={onReset}
              className="flex-1 py-3.5 px-6 rounded-2xl font-semibold font-heading text-white bg-gradient-to-tr from-primary-600 to-blue-500 hover:brightness-110 shadow-lg hover:shadow-primary-500/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Pick Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
