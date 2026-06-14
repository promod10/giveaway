import React, { useState } from 'react';
import { Link2, Users, ArrowRight } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

export interface FormData {
  platform: string;
  postUrl: string;
  winnersCount: number;
}

interface GiveawayFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const GiveawayForm: React.FC<GiveawayFormProps> = ({ onSubmit, isLoading }) => {
  const [platform, setPlatform] = useState<string>('youtube');
  const [postUrl, setPostUrl] = useState<string>('');
  const [winnersCount, setWinnersCount] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const validateUrl = (url: string, plat: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      if (plat === 'youtube') {
        return parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be');
      }
      if (plat === 'instagram') {
        return parsedUrl.hostname.includes('instagram.com');
      }
      if (plat === 'facebook') {
        return parsedUrl.hostname.includes('facebook.com');
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!postUrl.trim()) {
      setError('Please enter a post URL.');
      return;
    }

    if (!validateUrl(postUrl, platform)) {
      setError(`Please enter a valid ${platform.charAt(0).toUpperCase() + platform.slice(1)} URL.`);
      return;
    }

    if (winnersCount < 1) {
      setError('Please specify at least 1 winner.');
      return;
    }

    if (winnersCount > 20) {
      setError('You can pick a maximum of 20 winners at a time.');
      return;
    }

    onSubmit({ platform, postUrl, winnersCount });
  };

  const platforms = [
    { id: 'youtube', name: 'YouTube', icon: YoutubeIcon, color: 'hover:border-red-500/30 hover:bg-red-500/5', activeColor: 'border-red-500 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]' },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon, color: 'hover:border-pink-500/30 hover:bg-pink-500/5', activeColor: 'border-pink-500 bg-pink-500/10 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.15)]' },
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon, color: 'hover:border-blue-500/30 hover:bg-blue-500/5', activeColor: 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' }
  ];

  return (
    <div className="w-full max-w-xl mx-auto glass-panel p-6 md:p-8 rounded-3xl glow-purple">
      <h2 className="text-2xl font-bold font-heading text-white text-center mb-2">Configure Your Giveaway</h2>
      <p className="text-gray-400 text-sm text-center mb-8 font-sans">
        Select the target platform, paste the post link, and specify winners to begin the picker.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 font-sans text-left">
            Select Platform
          </label>
          <div className="grid grid-cols-3 gap-3">
            {platforms.map((p) => {
              const Icon = p.icon;
              const isActive = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center py-4 px-3 rounded-2xl border text-sm font-semibold transition-all duration-300 gap-2 ${
                    isActive ? p.activeColor : 'border-white/5 bg-white/2 text-gray-400 ' + p.color
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* URL Input */}
        <div className="relative text-left">
          <label htmlFor="postUrl" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-sans">
            Post URL Link
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <Link2 className="w-5 h-5" />
            </div>
            <input
              id="postUrl"
              type="text"
              placeholder={`e.g. https://www.${platform}.com/...`}
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              disabled={isLoading}
              className="w-full py-3.5 pl-12 pr-4 rounded-2xl glass-input text-white text-sm font-sans placeholder-gray-600"
            />
          </div>
        </div>

        {/* Winners Count */}
        <div className="relative text-left">
          <label htmlFor="winnersCount" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-sans">
            Number of Winners
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <Users className="w-5 h-5" />
            </div>
            <input
              id="winnersCount"
              type="number"
              min="1"
              max="20"
              value={winnersCount}
              onChange={(e) => setWinnersCount(parseInt(e.target.value) || 1)}
              disabled={isLoading}
              className="w-full py-3.5 pl-12 pr-4 rounded-2xl glass-input text-white text-sm font-sans"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl text-center font-medium font-sans">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-2xl font-bold font-heading text-white glow-btn hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching comments...</span>
            </div>
          ) : (
            <>
              <span>Pick Random Winner</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
