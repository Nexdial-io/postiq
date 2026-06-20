"use client";

import React, { useState } from 'react';
import { 
  Hash, 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  TrendingUp, 
  ShieldAlert,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';

interface HashtagItem {
  tag: string;
  category: 'Broad' | 'Niche' | 'Trending' | 'Industry';
  reach: string;
  popularity: 'High' | 'Medium' | 'Low';
  difficulty: number; // 0 - 100
}

export default function Hashtags() {
  const [keyword, setKeyword] = useState("Product Management");
  const [results, setResults] = useState<HashtagItem[] | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleGenerateHashtags = () => {
    if (!keyword.trim()) return;
    const cleanKey = keyword.trim().replace(/\s+/g, '');
    
    // Heuristic generator based on input keyword
    const mockData: HashtagItem[] = [
      // Broad
      { tag: `#${cleanKey}`, category: 'Broad', reach: '2.4M', popularity: 'High', difficulty: 88 },
      { tag: `#Careers`, category: 'Broad', reach: '5.1M', popularity: 'High', difficulty: 92 },
      { tag: `#Innovation`, category: 'Broad', reach: '8.3M', popularity: 'High', difficulty: 95 },
      
      // Niche
      { tag: `#${cleanKey}Strategy`, category: 'Niche', reach: '120k', popularity: 'Medium', difficulty: 45 },
      { tag: `#${cleanKey}Tips`, category: 'Niche', reach: '45k', popularity: 'Medium', difficulty: 30 },
      { tag: `#${cleanKey}Rules`, category: 'Niche', reach: '12k', popularity: 'Low', difficulty: 18 },
      
      // Trending
      { tag: `#FutureOf${cleanKey}`, category: 'Trending', reach: '340k', popularity: 'High', difficulty: 60 },
      { tag: `#AIin${cleanKey}`, category: 'Trending', reach: '520k', popularity: 'High', difficulty: 70 },
      { tag: `#Remote${cleanKey}`, category: 'Trending', reach: '95k', popularity: 'Medium', difficulty: 40 },
      
      // Industry
      { tag: `#SaaS`, category: 'Industry', reach: '1.8M', popularity: 'High', difficulty: 82 },
      { tag: `#B2BMarketing`, category: 'Industry', reach: '780k', popularity: 'Medium', difficulty: 65 },
      { tag: `#PLG`, category: 'Industry', reach: '150k', popularity: 'Medium', difficulty: 50 },
    ];

    setResults(mockData);
    setSelectedTags([]);
  };

  const handleToggleSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectAll = (category?: string) => {
    if (!results) return;
    const targets = category 
      ? results.filter(r => r.category === category).map(r => r.tag)
      : results.map(r => r.tag);
      
    // If all are already selected, deselect them
    const allSelected = targets.every(t => selectedTags.includes(t));
    if (allSelected) {
      setSelectedTags(selectedTags.filter(t => !targets.includes(t)));
    } else {
      setSelectedTags([...Array.from(new Set([...selectedTags, ...targets]))]);
    }
  };

  const handleCopySelected = () => {
    if (selectedTags.length === 0) return;
    navigator.clipboard.writeText(selectedTags.join(' '));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const getDifficultyColor = (score: number) => {
    if (score >= 80) return 'text-brand-rose';
    if (score >= 50) return 'text-brand-amber';
    return 'text-brand-emerald';
  };

  const getPopularityStyle = (pop: string) => {
    switch (pop) {
      case 'High': return 'bg-brand-rose/10 text-brand-rose';
      case 'Medium': return 'bg-brand-purple/10 text-brand-purple';
      default: return 'bg-zinc-500/10 text-zinc-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hashtag Intelligence</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Research hashtag statistics, identify low-difficulty niche keywords, and generate optimal tags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-1.5">
              <Hash size={16} className="text-brand-purple" />
              Tag Research
            </h3>
            
            <div>
              <label className="text-xs font-bold text-zinc-500 block mb-1">Target Niche or Keyword</label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. Product Management"
                className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateHashtags()}
              />
            </div>

            <button
              onClick={handleGenerateHashtags}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5"
            >
              <Wand2 size={14} />
              Analyze Hashtags
            </button>
          </div>

          {/* Guidelines */}
          <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-brand-purple/[0.02] to-brand-indigo/[0.02] border-brand-purple/10 mt-6">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <ShieldAlert size={14} className="text-brand-purple" />
              Hashtag Recommendations
            </h4>
            <ul className="space-y-3 text-xs text-zinc-500 font-medium">
              <li>- Use a 1:2 ratio: 1 Broad/Industry tag to 2 Niche/Trending tags.</li>
              <li>- Avoid tags with difficulty scores &gt; 90 unless you already have 10k+ followers.</li>
              <li>- Never use more than 5 hashtags; it triggers feed filters.</li>
            </ul>
          </div>
        </div>

        {/* Right Columns: Output Display */}
        <div className="lg:col-span-2">
          {!results ? (
            <div className="glass-panel rounded-2xl p-8 py-20 text-center flex flex-col items-center justify-center border-dashed border-2">
              <Search size={36} className="text-zinc-400 mb-2" />
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200">No Research Done</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">
                Type an industry keyword on the left and click analyze.
              </p>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-6 space-y-6">
              
              {/* Copy Selected Header */}
              <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">Keywords Matrix</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-bold">
                    {selectedTags.length} selected
                  </span>
                </div>

                {selectedTags.length > 0 && (
                  <button
                    onClick={handleCopySelected}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      copySuccess 
                        ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' 
                        : 'border-card-border bg-black/5 dark:bg-white/5 hover:border-brand-purple/50'
                    }`}
                  >
                    {copySuccess ? <Check size={13} /> : <Copy size={13} />}
                    {copySuccess ? 'Copied!' : 'Copy Selected'}
                  </button>
                )}
              </div>

              {/* Grid categories of hashtags */}
              <div className="space-y-6">
                {(['Broad', 'Niche', 'Trending', 'Industry'] as const).map((cat) => {
                  const items = results.filter(r => r.category === cat);
                  const allSelected = items.every(i => selectedTags.includes(i.tag));
                  
                  return (
                    <div key={cat} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider">{cat} Tags</h4>
                        <button
                          onClick={() => handleSelectAll(cat)}
                          className="text-[10px] font-bold text-brand-purple hover:underline"
                        >
                          {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {items.map((item, idx) => {
                          const isSelected = selectedTags.includes(item.tag);
                          return (
                            <div 
                              key={idx}
                              onClick={() => handleToggleSelect(item.tag)}
                              className={`p-3 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-2.5 ${
                                isSelected 
                                  ? 'border-brand-purple/50 bg-brand-purple/[0.03] glow-purple' 
                                  : 'border-card-border bg-black/[0.01] dark:bg-white/[0.01] hover:border-brand-purple/30'
                              }`}
                            >
                              <div className="mt-0.5 text-brand-purple">
                                {isSelected ? <CheckSquare size={13} className="fill-brand-purple/20" /> : <Square size={13} />}
                              </div>
                              <div className="space-y-1.5 truncate">
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate block">{item.tag}</span>
                                <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-semibold">
                                  <span>Reach: <strong className="text-foreground">{item.reach}</strong></span>
                                  <span className={`px-1 rounded text-[8px] font-bold ${getPopularityStyle(item.popularity)}`}>{item.popularity}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px]">
                                  <span>Difficulty:</span>
                                  <span className={`font-bold ${getDifficultyColor(item.difficulty)}`}>{item.difficulty}/100</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
