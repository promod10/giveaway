import React, { useState, useEffect } from 'react';
import { Instagram, Youtube, Facebook, Trophy, History, Loader2, Link as LinkIcon, Users, AlertCircle, Sparkles, Copy, CheckCircle2 } from 'lucide-react';

// Simulated database & comments
const MOCK_COMMENTS = {
  instagram: ['@alex_dev', '@sarah_codes', '@mike_js', '@emma_ts', '@photo_guru', '@travel_junkie', '@foodie_daily'],
  youtube: ['John Doe', 'Tech Master', 'Code Ninja', 'Sarah Vlogs', 'Gaming Pro', 'Music Lover', 'DIY Queen'],
  facebook: ['Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Evan Wright', 'Fiona Gallagher']
};

export default function App() {
  const [platform, setPlatform] = useState('instagram');
  const [postUrl, setPostUrl] = useState('');
  const [winnersCount, setWinnersCount] = useState(1);
  
  const [winners, setWinners] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [announcement, setAnnouncement] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // API Helper for Gemini with Exponential Backoff
  const fetchWithRetry = async (url, options, retries = 5) => {
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(res => setTimeout(res, delays[i]));
      }
    }
  };

  const handleGenerateAnnouncement = async () => {
    setIsGenerating(true);
    setAnnouncement('');
    setCopied(false);

    const apiKey = ""; 
    const prompt = `Write a fun, engaging, and exciting social media announcement post for ${platform} announcing the winners of a giveaway. The winners are: ${winners.join(', ')}. Keep it under 2 paragraphs, include relevant emojis, and add appropriate hashtags for a giveaway winner announcement. Tone: enthusiastic.`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: "You are an expert social media manager." }] }
        })
      };

      const result = await fetchWithRetry(url, options);
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        setAnnouncement(text);
      } else {
        setAnnouncement("Failed to generate announcement. Please try again.");
      }
    } catch (err) {
      setAnnouncement("Error connecting to AI. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = announcement;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulating an API call to the backend
  const handlePickWinner = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setWinners([]);
    setAnnouncement('');
    setCopied(false);

    // Simulate network delay
    setTimeout(() => {
      if (!postUrl.includes('http')) {
        setError('Please enter a valid URL starting with http:// or https://');
        setLoading(false);
        return;
      }

      const availableComments = MOCK_COMMENTS[platform];
      
      if (winnersCount > availableComments.length) {
        setError(`Not enough comments! Max available for this demo is ${availableComments.length}.`);
        setLoading(false);
        return;
      }

      // Shuffle and pick winners
      const shuffled = [...availableComments].sort(() => 0.5 - Math.random());
      const selectedWinners = shuffled.slice(0, winnersCount);

      setWinners(selectedWinners);

      // Add to simulated database/history
      const newHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        platform,
        postUrl,
        winners: selectedWinners,
        createdAt: new Date().toISOString()
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      setLoading(false);
    }, 1500); // 1.5s delay to simulate scraping/fetching
  };

  const getPlatformIcon = (plat, size = 20) => {
    switch (plat) {
      case 'instagram': return <Instagram size={size} className="text-pink-600" />;
      case 'youtube': return <Youtube size={size} className="text-red-600" />;
      case 'facebook': return <Facebook size={size} className="text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-2">
            <Trophy className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Universal Comment Picker
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Fairly and randomly select winners from your social media giveaways without any login required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Action Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              Configure Giveaway
            </h2>
            
            <form onSubmit={handlePickWinner} className="space-y-5">
              {/* Platform Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Platform</label>
                <div className="grid grid-cols-3 gap-3">
                  {['instagram', 'youtube', 'facebook'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                        platform === p 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {getPlatformIcon(p, 24)}
                      <span className="mt-2 text-xs font-semibold capitalize">{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Post URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    value={postUrl}
                    onChange={(e) => setPostUrl(e.target.value)}
                    placeholder="https://..."
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Winners Count */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Number of Winners</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={winnersCount}
                    onChange={(e) => setWinnersCount(Number(e.target.value))}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Fetching & Picking...
                  </>
                ) : (
                  'Start Giveaway'
                )}
              </button>
            </form>
          </div>

          {/* Results & History Column */}
          <div className="space-y-6">
            
            {/* Winners Result Card */}
            {winners.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg p-6 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  <h2 className="text-xl font-bold">Congratulations!</h2>
                </div>
                <div className="space-y-2">
                  {winners.map((winner, idx) => (
                    <div key={idx} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 font-semibold text-lg flex items-center justify-between">
                      <span>{winner}</span>
                      <span className="text-sm bg-white/30 px-2 py-1 rounded-md">Winner #{idx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* ✨ Gemini LLM Feature: Winner Announcement Generator */}
                <div className="mt-5 pt-5 border-t border-emerald-300/30">
                  {!announcement && !isGenerating ? (
                    <button 
                      onClick={handleGenerateAnnouncement}
                      className="w-full py-3 px-4 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center group"
                    >
                      <Sparkles className="w-5 h-5 mr-2 text-amber-400 group-hover:scale-110 transition-transform" />
                      ✨ Draft Winner Announcement
                    </button>
                  ) : isGenerating ? (
                    <div className="flex items-center justify-center space-x-3 py-3 text-emerald-50 bg-emerald-800/20 rounded-xl">
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span className="font-medium">AI is writing your post...</span>
                    </div>
                  ) : (
                    <div className="bg-emerald-800/30 rounded-xl p-4 relative text-emerald-50 shadow-inner">
                       <div className="flex justify-between items-center mb-3 pb-2 border-b border-emerald-400/20">
                          <span className="text-xs font-bold uppercase tracking-wider flex items-center text-emerald-100">
                             <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                             AI Generated Draft
                          </span>
                          <button 
                            onClick={copyToClipboard}
                            className="flex items-center space-x-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-xs font-medium"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                       </div>
                       <p className="text-sm whitespace-pre-wrap leading-relaxed">{announcement}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full min-h-[300px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <History className="w-5 h-5 mr-2 text-slate-500" />
                  Recent History
                </h2>
                <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Local Session</span>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center text-slate-400 py-8 flex flex-col items-center">
                  <History className="w-12 h-12 mb-3 opacity-20" />
                  <p>No giveaways yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {history.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(item.platform, 16)}
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {item.platform}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-slate-800 line-clamp-1 mb-1">
                        {item.winners.join(', ')}
                      </div>
                      <a href={item.postUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline truncate block w-full">
                        {item.postUrl}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}