import React from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 md:px-8 flex justify-between items-center border-b border-white/5 bg-dark-bg/40 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500 blur-lg opacity-40 rounded-full"></div>
          <div className="relative bg-gradient-to-tr from-primary-600 to-blue-500 p-2.5 rounded-xl border border-white/10 shadow-lg">
            <Gift className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-heading bg-gradient-to-r from-white via-primary-300 to-blue-400 bg-clip-text text-transparent tracking-tight m-0 flex items-center gap-1.5">
            LuckyPick
            <Sparkles className="w-4 h-4 text-primary-400" />
          </h1>
          <p className="text-xs text-gray-500 font-sans tracking-wide">Universal Comment Picker</p>
        </div>
      </div>

      <a
        href="https://github.com/promod10/giveaway"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-300"
      >
        <GithubIcon className="w-4 h-4" />
        <span className="hidden sm:inline">View Source</span>
      </a>
    </header>
  );
};

