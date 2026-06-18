import React from 'react';
import type { GiveawayHistoryItem } from '../api';
import { Calendar, Link2, Award, History } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

interface HistoryLedgerProps {
  history: GiveawayHistoryItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const HistoryLedger: React.FC<HistoryLedgerProps> = ({ history, isLoading, onRefresh }) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube':
        return <YoutubeIcon className="w-4 h-4 text-red-400" />;
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-400" />;
      case 'facebook':
        return <FacebookIcon className="w-4 h-4 text-blue-400" />;
      default:
        return null;
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-6 md:p-8 rounded-3xl glow-blue mt-12">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary-400" />
          <h2 className="text-xl font-bold font-heading text-white">Giveaway History</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="text-xs font-semibold uppercase tracking-wider text-primary-400 hover:text-primary-300 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Logs'}
        </button>
      </div>

      {isLoading && history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm font-sans">Loading ledger entries...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center">
          <Award className="w-8 h-8 text-gray-600 mb-2" />
          <p className="text-gray-500 text-sm font-sans">No giveaways recorded yet.</p>
          <p className="text-gray-600 text-xs mt-1 font-sans">Winners picked will appear here in real time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-400">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 font-sans text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">Platform</th>
                <th className="pb-3 font-semibold">Post Link</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Winners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((item) => (
                <tr key={item._id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        {getPlatformIcon(item.platform)}
                      </span>
                      <span className="font-heading font-semibold text-white capitalize text-xs">
                        {item.platform}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 max-w-[200px] truncate">
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gray-400 hover:text-primary-300 font-sans transition-colors"
                    >
                      <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.postUrl}</span>
                    </a>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {item.winners.map((winner, idx) => (
                        <span
                          key={winner + idx}
                          className="inline-block text-[10px] font-semibold text-primary-300 bg-primary-500/10 px-2 py-0.5 rounded-md border border-primary-500/15"
                        >
                          {winner}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
