"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Search, 
  Flame, 
  Compass, 
  Cpu, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import Link from 'next/link';

export default function TrendsPage() {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');

  const trends = [
    { topic: "Generative AI Agents in B2B", volume: "24.5k posts", opportunity: "High", score: 98, difficulty: "Easy", keywords: ["agentic workflows", "automation", "LLMs"], status: "up" },
    { topic: "Product-Led Growth (PLG) Metrics", volume: "18.2k posts", opportunity: "High", score: 85, difficulty: "Medium", keywords: ["retention", "CAC payback", "LTV"], status: "up" },
    { topic: "The Future of Remote Work Culture", volume: "12.8k posts", opportunity: "Medium", score: 72, difficulty: "Medium", keywords: ["hybrid team", "asynchronous", "deep work"], status: "down" },
    { topic: "SaaS Funding Cycles in 2026", volume: "9.5k posts", opportunity: "Medium", score: 61, difficulty: "Hard", keywords: ["seed rounds", "profitability", "VC trends"], status: "up" },
    { topic: "Personal Branding for Engineers", volume: "31.2k posts", opportunity: "High", score: 90, difficulty: "Easy", keywords: ["career growth", "writing online", "networking"], status: "up" },
    { topic: "Solopreneur SaaS Frameworks", volume: "6.4k posts", opportunity: "Medium", score: 55, difficulty: "Hard", keywords: ["micro-saas", "indie hackers", "lean build"], status: "down" }
  ];

  const filteredTrends = trends.filter(t => {
    if (filter === 'high') return t.opportunity === 'High';
    if (filter === 'medium') return t.opportunity === 'Medium';
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <TrendingUp className="text-brand-emerald" size={28} />
            Trend Discovery Engine
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor trending topics, index search volumes, and identify high-opportunity subject domains.
          </p>
        </div>
        
        {/* Toggle Filter */}
        <div className="inline-flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${filter === 'all' ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow' : 'text-zinc-500'}`}
          >
            All Trends
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-1.5 rounded-lg font-bold transition-all ${filter === 'high' ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow' : 'text-zinc-500'}`}
          >
            High Opportunity
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend, index) => (
          <div 
            key={index}
            className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-brand-emerald/40 hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden"
          >
            {/* Hover accent */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-emerald/5 blur-[25px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-550 dark:text-zinc-450 font-bold block">{trend.volume}</span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">{trend.topic}</h3>
                </div>
                
                {/* Score badge */}
                <div className="relative w-11 h-11 flex items-center justify-center rounded-full border-2 border-brand-emerald/20 bg-brand-emerald/5 font-black text-xs text-brand-emerald select-none">
                  {trend.score}
                </div>
              </div>

              {/* Status parameters */}
              <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-card-border/50 pt-4 font-semibold text-zinc-500">
                <div className="space-y-0.5">
                  <span>Difficulty:</span>
                  <strong className={`block ${
                    trend.difficulty === 'Easy' ? 'text-brand-emerald' :
                    trend.difficulty === 'Medium' ? 'text-brand-purple' :
                    'text-brand-rose'
                  }`}>{trend.difficulty}</strong>
                </div>
                <div className="space-y-0.5">
                  <span>Opportunity:</span>
                  <strong className="block text-zinc-800 dark:text-zinc-200">{trend.opportunity}</strong>
                </div>
              </div>

              {/* Hashtag list */}
              <div className="flex flex-wrap gap-1 mt-2">
                {trend.keywords.map((kw, idx) => (
                  <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-450 font-bold">#{kw}</span>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-card-border/50 mt-6">
              <Link 
                href={`/hooks?topic=${encodeURIComponent(trend.topic)}`}
                className="text-xs font-bold text-brand-purple flex items-center gap-0.5 hover:underline justify-end group-hover:gap-1.5 transition-all"
              >
                Draft Hooks on Topic
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
