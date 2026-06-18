import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GiveawayForm } from './components/GiveawayForm';
import type { FormData } from './components/GiveawayForm';
import { WinnerCelebration } from './components/WinnerCelebration';
import { HistoryLedger } from './components/HistoryLedger';
import { api } from './api';
import type { GiveawayHistoryItem } from './api';
import { Server, WifiOff } from 'lucide-react';

function App() {
  const [view, setView] = useState<'form' | 'celebration'>('form');
  const [winners, setWinners] = useState<string[]>([]);
  const [platform, setPlatform] = useState<string>('youtube');
  const [history, setHistory] = useState<GiveawayHistoryItem[]>([]);
  
  // Loading indicators
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Fetch initial logs on mount
  useEffect(() => {
    fetchHistoryData();
  }, []);

  const fetchHistoryData = async () => {
    setIsHistoryLoading(true);
    setConnectionError(null);
    try {
      const logs = await api.getHistory();
      setHistory(logs);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setConnectionError(
        'Could not connect to the backend server. Please verify the API is running at http://localhost:3001.'
      );
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handlePickWinner = async (formData: FormData) => {
    setIsSubmitting(true);
    setConnectionError(null);
    try {
      const result = await api.pickWinner(formData);
      setWinners(result.winners);
      setPlatform(formData.platform);
      setView('celebration');
      // Refresh the ledger automatically
      fetchHistoryData();
    } catch (err: any) {
      console.error('Failed to pick winner:', err);
      const msg = err.response?.data?.error || 'Failed to submit picker request. Check server console.';
      setConnectionError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setWinners([]);
    setView('form');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 flex flex-col font-sans selection:bg-primary-500/30 selection:text-white">
      {/* Premium Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 md:py-16 flex flex-col items-center justify-start gap-12">
        {/* Intro Hero Section */}
        {view === 'form' && (
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
              Pick Fair Giveaway Winners <br />
              <span className="bg-gradient-to-r from-primary-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                Instantly & Bias-Free
              </span>
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
              No authorization required. Paste your social media post link and select random commenters fairly in seconds.
            </p>
          </div>
        )}

        {/* Backend Connection Alert */}
        {connectionError && (
          <div className="w-full max-w-xl bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 flex gap-4 text-left glow-pink">
            <WifiOff className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-heading font-bold text-white text-sm">Backend Connection Notice</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">{connectionError}</p>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 text-[10px] font-mono text-gray-500 flex items-center gap-2">
                <Server className="w-3.5 h-3.5" />
                <span>Run `cd backend && npm run dev` to start backend on local port 3001.</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="w-full">
          {view === 'form' ? (
            <GiveawayForm onSubmit={handlePickWinner} isLoading={isSubmitting} />
          ) : (
            <WinnerCelebration winners={winners} platform={platform} onReset={handleReset} />
          )}
        </div>

        {/* Giveaway History Logs */}
        <HistoryLedger history={history} isLoading={isHistoryLoading} onRefresh={fetchHistoryData} />
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-white/5 bg-black/20 text-xs text-gray-600 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} LuckyPick Comment Picker. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
