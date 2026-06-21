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
  TrendingDown,
  Check,
  AlertCircle,
  Sparkles,
  Zap,
  Layers,
  BarChart,
  FileText,
  Copy,
  Clock,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function TrendsPage() {
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');
  
  // Generation Overlay states
  const [activeTrend, setActiveTrend] = useState<any>(null);
  const [genType, setGenType] = useState<'hook' | 'post' | 'carousel' | 'poll' | null>(null);
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const earlyAlerts = [
    {
      topic: "AI Voice Agents in CRM",
      growth: "+280%",
      competition: "Low",
      lifecycle: "Emerging",
      bestFor: ["Founders", "SaaS Builders", "Sales Directors"],
      rec: "Publish This Week",
      hook: "B2B CRM models are undergoing a massive shift. Voice-native AI agents are replacing text workflows. If you aren't testing this today, your sales team is falling behind:"
    },
    {
      topic: "Zero-Click Content Marketing",
      growth: "+145%",
      competition: "Low",
      lifecycle: "Emerging",
      bestFor: ["Creators", "B2B Marketers", "SaaS Founders"],
      rec: "Publish This Week",
      hook: "LinkedIn and Google algorithms are penalizing external link clicks. The solution? Zero-click content strategy. Here is how we build value entirely inside the feed:"
    }
  ];

  const trends = [
    { 
      topic: "Generative AI Agents in B2B", 
      volume: "24.5k posts", 
      growth: "↑ 31% this week",
      lifecycle: "Emerging", 
      score: 92, 
      competition: "Low", 
      growthSpeed: "High", 
      bestFor: ["Founders", "Product Managers", "SaaS Leaders"], 
      keywords: ["agentic workflows", "automation", "LLMs"],
      hook: "90% of B2B SaaS startups fail at growth because they overlook this one simple system:"
    },
    { 
      topic: "Product-Led Growth (PLG) Metrics", 
      volume: "18.2k posts", 
      growth: "↑ 18% this week",
      lifecycle: "Growing", 
      score: 85, 
      competition: "Medium", 
      growthSpeed: "High", 
      bestFor: ["Product Managers", "Growth Marketers"], 
      keywords: ["retention", "CAC payback", "LTV"],
      hook: "Unpopular opinion: writing tickets is only 10% of a Product Manager's job."
    },
    { 
      topic: "The Future of Remote Work Culture", 
      volume: "12.8k posts", 
      growth: "↓ 5% this week",
      lifecycle: "Peak", 
      score: 72, 
      competition: "High", 
      growthSpeed: "Medium", 
      bestFor: ["HR Leads", "Engineers", "Founders"], 
      keywords: ["hybrid team", "asynchronous", "deep work"],
      hook: "Five years ago, I almost quit tech. The pacing felt impossible."
    },
    { 
      topic: "SaaS Funding Cycles in 2026", 
      volume: "9.5k posts", 
      growth: "↑ 12% this week",
      lifecycle: "Growing", 
      score: 61, 
      competition: "High", 
      growthSpeed: "Medium", 
      bestFor: ["Founders", "VCs"], 
      keywords: ["seed rounds", "profitability", "VC trends"],
      hook: "If you want to build a $10M company, you must stop doing these 5 things today:"
    },
    { 
      topic: "Personal Branding for Engineers", 
      volume: "31.2k posts", 
      growth: "↑ 45% this week",
      lifecycle: "Emerging", 
      score: 90, 
      competition: "Low", 
      growthSpeed: "High", 
      bestFor: ["Engineers", "Creators"], 
      keywords: ["career growth", "writing online", "networking"],
      hook: "AI isn't replacing developers. Developers who master prompt workflows are replacing developers who don't."
    },
    { 
      topic: "Solopreneur SaaS Frameworks", 
      volume: "6.4k posts", 
      growth: "↓ 8% this week",
      lifecycle: "Declining", 
      score: 55, 
      competition: "Medium", 
      growthSpeed: "Low", 
      bestFor: ["Solopreneurs", "Creators"], 
      keywords: ["micro-saas", "indie hackers", "lean build"],
      hook: "I spoke to 15 founders who scaled SaaS products. One lesson stood out: They didn't start with tools."
    }
  ];

  const filteredTrends = trends.filter(t => {
    if (filter === 'high') return t.score >= 80;
    if (filter === 'medium') return t.score >= 60 && t.score < 80;
    return true;
  });

  const handleTriggerGenerate = (trend: any, type: 'hook' | 'post' | 'carousel' | 'poll') => {
    setActiveTrend(trend);
    setGenType(type);
    setGenerating(true);
    setGeneratedDraft(null);

    setTimeout(() => {
      let draft = {};
      const subject = trend.topic;

      if (type === 'hook') {
        draft = {
          body: `"${trend.hook}"\n\n- Curiosity: 95/100\n- Authority: 85/100\n- Emotion: 90/100`,
          why: "Creates a curiosity gap by teasing high stakes before establishing the answer.",
          how: "Place this exact quote as the first line of your next post draft.",
          impact: "+15% expected views"
        };
      } else if (type === 'post') {
        draft = {
          body: `${trend.hook}\n\nHere is the exact blueprint we are deploying for ${subject}:\n\n1. Audit current pipelines: Isolate bottleneck nodes.\n2. Standardize automation triggers: Keep operations lean.\n3. Run continuous A/B test intervals.\n\nBy following this system, we reduced overhead costs by 30%.\n\nWhat is your perspective on this? Let me know below! 👇`,
          why: "Follows the Hook-Value-CTA framework for maximum mobile readability.",
          how: "Copy this text into the post composer on the dashboard.",
          impact: "+22% engagement rate"
        };
      } else if (type === 'carousel') {
        draft = {
          body: `Slide 1: Hook Intro - ${trend.hook}\n\nSlide 2: The Core Challenge - Why traditional models fail to scale.\n\nSlide 3: Phase 1 Solution - Streamline operations using automated triggers.\n\nSlide 4: Phase 2 Solution - Defer to intelligent caching pipelines.\n\nSlide 5: Expected Impact - Save 40%+ overhead costs.\n\nSlide 6: CTA - Repost ♻️ to help others, and drop your takes below!`,
          why: "Carousels build session time by keeping readers on screen.",
          how: "Save this copy and format into a simple presentation PDF.",
          impact: "+35% reach boost"
        };
      } else {
        draft = {
          body: `Poll: What is your primary bottleneck in scaling ${subject}?\n\n- Lack of clear strategy\n- Slow tooling pipelines\n- High customer acquisition CAC\n- Recruiting specialized talent\n\nVote in the poll below and let's discuss details! 👇`,
          why: "Polls require low user friction to participate, driving high comment rates.",
          how: "Set duration to 7 days for maximum algorithm feed exposure.",
          impact: "+40% comment CTR"
        };
      }

      setGeneratedDraft(draft);
      setGenerating(false);
    }, 600);
  };

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

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
            Monitor trending topics, index search volumes, and generate content directly from emerging signals.
          </p>
        </div>
        
        {/* Toggle Filter */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#eef3f8] dark:bg-[#383f47] border border-card-border/70 gap-2 text-xs">
          {[
            { id: 'all', label: 'All Trends' },
            { id: 'high', label: 'High Opportunity' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as any)}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                filter === btn.id 
                  ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow' 
                  : 'text-zinc-555 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* EARLY TREND ALERTS PANEL */}
      <div className="glass-panel rounded-2xl p-6 border border-brand-purple/20 bg-gradient-to-br from-brand-purple/[0.03] to-transparent space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 border-b border-card-border/40 pb-2">
          <Sparkles className="text-brand-purple" size={14} />
          Early Trend Alerts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {earlyAlerts.map((alert, i) => (
            <div key={i} className="p-4 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-purple/5 rounded-full blur-xl pointer-events-none group-hover:bg-brand-purple/10 transition-colors"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200">{alert.topic}</h4>
                  <span className="text-[9px] font-black uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded block w-fit mt-1">
                    {alert.lifecycle} lifecycle
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-brand-emerald block">{alert.growth} growth</span>
                  <span className="text-[8px] font-bold text-zinc-400 block uppercase mt-0.5">Comp: {alert.competition}</span>
                </div>
              </div>

              {/* Best For Audience Match */}
              <div className="flex flex-wrap gap-1">
                {alert.bestFor.map((aud, aIdx) => (
                  <span key={aIdx} className="text-[8px] font-bold bg-black/5 dark:bg-white/5 text-zinc-550 px-1.5 py-0.5 rounded">
                    ✓ {aud}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-card-border/45 pt-3 mt-1">
                <span className="text-[9px] font-bold text-brand-emerald flex items-center gap-1">
                  <Check size={11} />
                  {alert.rec}
                </span>

                <button
                  onClick={() => handleTriggerGenerate(alert, 'post')}
                  className="px-2.5 py-1 rounded bg-brand-purple/15 text-brand-purple hover:bg-brand-purple/20 text-[10px] font-bold transition-all flex items-center gap-0.5 cursor-pointer"
                >
                  Generate Post
                  <ArrowRight size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TREND OPPORTUNITY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((trend, index) => (
          <div 
            key={index}
            className="glass-panel rounded-xl p-6 flex flex-col justify-between border border-card-border/70 hover:border-brand-emerald/40 hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-emerald/5 blur-[25px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold block">{trend.volume} ({trend.growth})</span>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug">{trend.topic}</h3>
                </div>
                
                {/* Score badge */}
                <div className="relative w-11 h-11 flex items-center justify-center rounded-full border-2 border-brand-emerald/20 bg-brand-emerald/5 font-black text-xs text-brand-emerald select-none">
                  {trend.score}
                </div>
              </div>

              {/* Status parameters */}
              <div className="grid grid-cols-3 gap-2 text-[9px] border-t border-card-border/40 pt-4 font-bold text-zinc-500 uppercase tracking-wider">
                <div className="space-y-0.5">
                  <span>Lifecycle:</span>
                  <strong className="block text-brand-purple font-black">{trend.lifecycle}</strong>
                </div>
                <div className="space-y-0.5">
                  <span>Growth:</span>
                  <strong className="block text-brand-emerald font-black">{trend.growthSpeed}</strong>
                </div>
                <div className="space-y-0.5">
                  <span>Competition:</span>
                  <strong className="block text-zinc-800 dark:text-zinc-200 font-black">{trend.competition}</strong>
                </div>
              </div>

              {/* Audience Match (Best For) */}
              <div className="pt-2 border-t border-card-border/40">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Audience Match</span>
                <div className="flex flex-wrap gap-1">
                  {trend.bestFor.map((aud, idx) => (
                    <span key={idx} className="text-[8px] font-bold text-brand-emerald bg-brand-emerald/5 px-1.5 py-0.5 rounded">
                      ✓ {aud}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Action Tray */}
            <div className="pt-6 border-t border-card-border/50 mt-6 space-y-2">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">One-Click Content Triggers</span>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { type: 'hook', label: 'Hook', icon: Sparkles },
                  { type: 'post', label: 'Post', icon: FileText },
                  { type: 'carousel', label: 'Slide', icon: Layers },
                  { type: 'poll', label: 'Poll', icon: BarChart }
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.type}
                      onClick={() => handleTriggerGenerate(trend, act.type as any)}
                      className="py-1 rounded bg-[#eef3f8] dark:bg-[#383f47] text-[#71B7FB] hover:bg-brand-purple/10 text-[9px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                    >
                      <Icon size={10} />
                      {act.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GENERATION OVERLAY MODAL */}
      {activeTrend && genType && generatedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl glass-panel border border-brand-purple/20 rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-1.5">
                  <Sparkles size={16} className="text-brand-purple" />
                  AI Content Generator
                </h3>
                <span className="text-[10px] text-zinc-500 font-semibold mt-0.5">Topic: {activeTrend.topic}</span>
              </div>
              <button 
                onClick={() => { setActiveTrend(null); setGenType(null); setGeneratedDraft(null); }}
                className="text-zinc-500 hover:text-zinc-800 p-1 text-lg"
              >
                <X size={18} />
              </button>
            </div>

            {generating ? (
              <div className="py-20 text-center text-xs text-zinc-500 font-bold space-y-2 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
                <span>Generating content for simulated creator...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] relative">
                  <button
                    onClick={() => handleCopyDraft(generatedDraft.body)}
                    className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                      copySuccess ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' : 'border-card-border bg-black/5 dark:bg-white/5 text-zinc-650'
                    }`}
                  >
                    {copySuccess ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copySuccess ? 'Copied!' : 'Copy Copy'}</span>
                  </button>

                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed whitespace-pre-wrap max-w-[90%]">
                    {generatedDraft.body}
                  </p>
                </div>

                {/* Why? How? Impact? */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-card-border/40 text-[9px] leading-relaxed font-semibold text-zinc-550">
                  <div>
                    <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why this setup?</strong>
                    {generatedDraft.why}
                  </div>
                  <div>
                    <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How to implement?</strong>
                    {generatedDraft.how}
                  </div>
                  <div>
                    <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Expected Impact?</strong>
                    <span className="text-brand-emerald font-black block">{generatedDraft.impact}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
