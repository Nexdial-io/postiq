"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  UserCheck, 
  PenTool, 
  Calendar as CalendarIcon, 
  Users, 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight,
  BookOpen,
  ArrowRight,
  History,
  Trash2
} from 'lucide-react';
import { mockDb, PostAnalysis, UserProfile } from '@/lib/mockDb';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<PostAnalysis[]>([]);
  const [activePlan, setActivePlan] = useState('Free');

  useEffect(() => {
    setProfile(mockDb.getProfile());
    setHistory(mockDb.getAnalyses());
    setActivePlan(mockDb.getSubscription().plan);
  }, []);

  const handleDeleteHistory = (id: string) => {
    mockDb.deleteAnalysis(id);
    setHistory(mockDb.getAnalyses());
  };

  const trendingTopics = [
    { topic: "Generative AI Agents in B2B", interest: "98%", opportunity: "High", keywords: ["agentic workflows", "automation", "LLMs"] },
    { topic: "Product-Led Growth (PLG) Metrics", interest: "85%", opportunity: "High", keywords: ["retention", "CAC payback", "LTV"] },
    { topic: "The Future of Remote Work Culture", interest: "72%", opportunity: "Medium", keywords: ["hybrid team", "asynchronous", "deep work"] },
    { topic: "SaaS Funding Cycles in 2026", interest: "61%", opportunity: "Medium", keywords: ["seed rounds", "profitability", "VC trends"] }
  ];

  const quickActions = [
    { title: "Analyze Post Draft", desc: "Predict reach and engagement metrics", link: "/analyzer", icon: Sparkles, color: "text-brand-purple bg-brand-purple/10 border-brand-purple/20" },
    { title: "Optimize Profile", desc: "Audit keywords & headline appeal", link: "/profile-intelligence", icon: UserCheck, color: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20" },
    { title: "Generate Hooks", desc: "Create 50+ hooks for a topic", link: "/hooks", icon: PenTool, color: "text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20" },
    { title: "Content Calendar", desc: "Plan weekly scheduling dates", link: "/calendar", icon: CalendarIcon, color: "text-brand-amber bg-brand-amber/10 border-brand-amber/20" },
  ];

  const scoreWidgets = [
    { title: "Profile Score", score: profile?.score || 72, label: "Above average", desc: "Update experience statements to reach 85+", color: "from-brand-purple to-brand-indigo" },
    { title: "Creator Score", score: 68, label: "Medium activity", desc: "Post 2 more times this week for 80+", color: "from-brand-indigo to-blue-500" },
    { title: "Recruiter Score", score: 79, label: "High search visibility", desc: "Keywords match 4 active jobs in your area", color: "from-brand-emerald to-teal-500" },
    { title: "SEO Score", score: 82, label: "Excellent indexing", desc: "Headline contains 3 high-volume tags", color: "from-brand-amber to-orange-500" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back, {profile?.name || 'Alex'}</h1>
          <p className="text-sm text-zinc-500 mt-1">Here is your LinkedIn performance and creator intelligence overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-card-border">
            Plan: <span className="font-bold text-brand-purple">{activePlan}</span>
          </span>
          {activePlan === 'Free' && (
            <Link 
              href="/billing"
              className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-brand-purple to-brand-indigo text-white hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center gap-1.5"
            >
              Upgrade to Pro
              <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {scoreWidgets.map((widget, i) => (
          <div key={i} className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-brand-purple/30 transition-all">
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{widget.title}</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-extrabold bg-gradient-to-tr ${widget.color} bg-clip-text text-transparent`}>
                  {widget.score}
                </span>
                <span className="text-xs font-semibold text-zinc-500">/100</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${widget.color} rounded-full`} style={{ width: `${widget.score}%` }}></div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-card-border/50">
              <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 block">{widget.label}</span>
              <p className="text-[10px] text-zinc-500 mt-0.5">{widget.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Activity & Opportunities (2/3 Width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Post Analyses */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <History size={16} className="text-brand-purple" />
                Recent Post Analyses
              </h3>
              {history.length > 0 && (
                <span className="text-xs text-zinc-500 font-semibold">{history.length} analyzed</span>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="py-10 text-center space-y-4">
                <p className="text-sm text-zinc-500">You haven't analyzed any posts yet.</p>
                <Link
                  href="/analyzer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-purple hover:underline"
                >
                  Analyze your first post draft
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
                {history.map((post) => (
                  <div key={post.id} className="p-4 rounded-xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] flex items-center justify-between gap-4 group">
                    <div className="truncate flex-1">
                      <p className="text-xs font-medium truncate text-zinc-700 dark:text-zinc-300">"{post.content}"</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500 font-semibold">
                        <span>Score: <strong className="text-brand-purple">{post.score}</strong></span>
                        <span>Virality: <strong className="text-brand-emerald">{post.metrics.virality}</strong></span>
                        <span>Reach: <strong>{post.metrics.reach.toLocaleString()}</strong></span>
                        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/analyzer?id=${post.id}`} 
                        className="px-2.5 py-1 rounded bg-brand-purple/10 text-brand-purple text-[10px] font-bold hover:bg-brand-purple/20 transition-all"
                      >
                        View Full
                      </Link>
                      <button
                        onClick={() => handleDeleteHistory(post.id)}
                        className="p-1 rounded text-zinc-400 hover:text-brand-rose hover:bg-brand-rose/10 opacity-0 group-hover:opacity-100 transition-all"
                        title="Delete record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending Creator Opportunities */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base flex items-center gap-2 border-b border-card-border/50 pb-3">
              <TrendingUp size={16} className="text-brand-emerald" />
              Trending Creator Opportunities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trendingTopics.map((item, index) => (
                <div key={index} className="p-4 rounded-xl border border-card-border/50 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between hover:border-brand-emerald/30 transition-all">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 max-w-[80%]">{item.topic}</h4>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald">{item.opportunity}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.keywords.map((kw, idx) => (
                        <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500">#{kw}</span>
                      ))}
                    </div>
                  </div>
                  <Link 
                    href={`/hooks?topic=${encodeURIComponent(item.topic)}`}
                    className="mt-4 text-[10px] font-bold text-brand-purple flex items-center gap-0.5 hover:underline"
                  >
                    Draft hooks on this
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Actions & Tips (1/3 Width) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Quick Actions */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base border-b border-card-border/50 pb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={i}
                    href={action.link}
                    className="flex items-center gap-3 p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] hover:-translate-y-0.5 transition-all group"
                  >
                    <div className={`p-2 rounded-lg border ${action.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-brand-purple transition-colors truncate">{action.title}</h4>
                      <p className="text-[10px] text-zinc-500 truncate">{action.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Creator IQ Tips */}
          <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-brand-purple/[0.02] to-brand-indigo/[0.02] border-brand-purple/10">
            <h3 className="font-bold text-base flex items-center gap-2 border-b border-card-border/50 pb-3">
              <BookOpen size={16} className="text-brand-purple" />
              Creator IQ Tips
            </h3>
            <ul className="mt-4 space-y-3 text-xs text-zinc-500 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5"></span>
                <span>Posts with exactly <strong>3 hashtags</strong> average 18% higher CTR than posts with none or more than 6.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5"></span>
                <span>Use short, punchy questions in your hook to increase the click-rate on the "see more" link.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5"></span>
                <span>Experience sections that highlight numerical achievements (e.g. 40% growth) double recruiter connection requests.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
