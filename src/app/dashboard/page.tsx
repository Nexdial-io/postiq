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
  Trash2,
  Camera,
  Video,
  Newspaper,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send as SendIcon,
  MoreHorizontal,
  Globe,
  Award,
  Plus
} from 'lucide-react';
import { mockDb, PostAnalysis, UserProfile } from '@/lib/mockDb';
import { analyzePostContent } from '@/lib/scoringEngine';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<PostAnalysis[]>([]);
  const [activePlan, setActivePlan] = useState('Free');
  
  // Start a Post Box expansion states
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [liveAnalysis, setLiveAnalysis] = useState<any>(null);

  // Feed interactions
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setProfile(mockDb.getProfile());
    setHistory(mockDb.getAnalyses());
    setActivePlan(mockDb.getSubscription().plan);
  }, []);

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    mockDb.deleteAnalysis(id);
    setHistory(mockDb.getAnalyses());
  };

  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setDraftContent(val);
    if (val.trim()) {
      setLiveAnalysis(analyzePostContent(val));
    } else {
      setLiveAnalysis(null);
    }
  };

  const handlePublishDraft = () => {
    if (!draftContent.trim() || !liveAnalysis) return;

    // Build standard PostAnalysis structure
    const newAnalysis: PostAnalysis = {
      id: `post-${Date.now()}`,
      content: draftContent,
      score: liveAnalysis.score,
      breakdown: {
        hook: liveAnalysis.breakdown.hook,
        readability: liveAnalysis.breakdown.readability,
        authority: liveAnalysis.breakdown.emotional || 80, // Map emotional to authority
        emotional: liveAnalysis.breakdown.emotional,
        formatting: 85,
        cta: 80,
        hashtags: 90,
        trend: 85
      },
      metrics: {
        likes: liveAnalysis.metrics.likes || Math.floor(Math.random() * 200) + 10,
        comments: liveAnalysis.metrics.comments || Math.floor(Math.random() * 60) + 2,
        shares: Math.floor(Math.random() * 15),
        reach: liveAnalysis.metrics.reach,
        virality: liveAnalysis.metrics.virality
      },
      suggestions: liveAnalysis.suggestions,
      timestamp: new Date().toISOString()
    };

    mockDb.saveAnalysis(newAnalysis);
    setHistory(mockDb.getAnalyses());
    
    // Clear and collapse editor
    setDraftContent('');
    setLiveAnalysis(null);
    setIsDrafting(false);
    
    // Fire celebratory confetti
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleInjectTopic = (topic: string) => {
    const text = `Let's talk about ${topic}. 🚀\n\nHere is what most professionals miss:\n\n1. Spacing out text builds visual flow.\n2. Leading with data proofs increases trust.\n\nWhat is your perspective on this? Let me know below!`;
    setDraftContent(text);
    setLiveAnalysis(analyzePostContent(text));
    setIsDrafting(true);
    
    // Scroll to the post composer smooth
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLikeToggle = (id: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandToggle = (id: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const trendingTopics = [
    { topic: "Generative AI Agents in B2B", interest: "98%", opportunity: "High", keywords: ["agentic", "LLMs"] },
    { topic: "Product-Led Growth (PLG) Metrics", interest: "85%", opportunity: "High", keywords: ["retention", "LTV"] },
    { topic: "The Future of Remote Work Culture", interest: "72%", opportunity: "Medium", keywords: ["hybrid", "deep work"] }
  ];

  const scoreWidgets = [
    { title: "Profile Strength", score: profile?.score || 72, label: "Above average", desc: "Add skills to reach 85+", color: "from-brand-purple to-brand-indigo" },
    { title: "Creator Score", score: 68, label: "Medium consistency", desc: "Post twice this week for 80+", color: "from-brand-indigo to-blue-500" },
    { title: "Recruiter Appeal", score: 79, label: "High visibility", desc: "Matches active hiring posts", color: "from-brand-emerald to-teal-500" },
    { title: "SEO indexing", score: 82, label: "Excellent matching", desc: "Headline contains key tags", color: "from-brand-amber to-orange-500" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      
      {/* 📂 Column 1: Profile Card + Widgets — sticky, all visible without scroll */}
      <div className="lg:col-span-1 sticky top-[60px] max-h-[calc(100vh-68px)] overflow-y-auto space-y-3 pb-2 scrollbar-hide">

        {/* Profile Card — compact */}
        <div className="glass-panel rounded-xl overflow-hidden border border-card-border/70">
          {/* Banner */}
          <div className="h-10 bg-zinc-300 dark:bg-zinc-700"></div>

          {/* Avatar overlap */}
          <div className="flex justify-center -mt-6 relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-card-bg bg-brand-purple flex items-center justify-center text-white text-lg font-black shadow-md uppercase">
              {profile?.name ? profile.name[0] : 'A'}
            </div>
          </div>

          <div className="px-4 pt-2 pb-3 space-y-2 text-center">
            <div className="border-b border-card-border/50 pb-2">
              <h3 className="font-extrabold text-xs text-zinc-900 dark:text-white leading-snug hover:underline cursor-pointer">{profile?.name || 'Alex Rivera'}</h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 leading-normal max-w-[190px] mx-auto line-clamp-2">
                {profile?.headline || 'SaaS Growth Specialist'}
              </p>
            </div>

            {/* Metrics */}
            <div className="text-[10px] font-bold text-zinc-500 text-left space-y-1 border-b border-card-border/50 pb-2">
              <div className="flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 px-1 py-0.5 rounded cursor-pointer transition-colors">
                <span className="font-semibold">Profile viewers</span>
                <span className="text-[#71B7FB] font-black">142</span>
              </div>
              <div className="flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 px-1 py-0.5 rounded cursor-pointer transition-colors">
                <span className="font-semibold">Post impressions</span>
                <span className="text-[#71B7FB] font-black">1,840</span>
              </div>
            </div>

            {/* Creator scores — single compact row, no bars */}
            <div className="text-[9px] font-semibold text-zinc-500 text-left space-y-1 border-b border-card-border/50 pb-2">
              <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400 block">Creator Intelligence</span>
              {scoreWidgets.slice(0, 3).map((w, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="truncate pr-2">{w.title}</span>
                  <strong className="text-[#71B7FB] shrink-0">{w.score}/100</strong>
                </div>
              ))}
            </div>

            <div className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 text-left flex justify-between items-center">
              <span>Account level:</span>
              <span className="text-brand-purple uppercase font-black">{activePlan}</span>
            </div>
          </div>
        </div>

        {/* My Pages Card — compact */}
        <div className="glass-panel rounded-xl overflow-hidden border border-card-border/70">
          <div className="px-3 pt-3 pb-1">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-2">My pages</h4>
            <div className="space-y-0.5">
              {[
                { name: 'Nexdial', initial: 'N', color: 'bg-blue-600' },
                { name: 'Viral UX', initial: 'V', color: 'bg-rose-500' },
                { name: 'Bigdata Automation', initial: 'B', color: 'bg-emerald-600' },
              ].map((page) => (
                <div
                  key={page.name}
                  className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <div className={`w-7 h-7 rounded ${page.color} flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm`}>
                    {page.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-zinc-900 dark:text-white truncate group-hover:text-brand-purple transition-colors">{page.name}</p>
                    <p className="text-[9px] text-zinc-500">Activity <span className="font-bold text-zinc-600 dark:text-zinc-300">0</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-card-border/40 px-3 py-2 space-y-0.5">
            <a href="/features" className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-brand-purple transition-colors py-0.5 cursor-pointer">
              <Plus size={10} className="shrink-0" />
              Grow your business faster
            </a>
            <a href="/billing" className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-brand-purple transition-colors py-0.5 cursor-pointer">
              <ArrowRight size={10} className="shrink-0" />
              Try Premium Page
            </a>
            <a href="/features" className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-brand-purple transition-colors py-0.5 cursor-pointer">
              <TrendingUp size={10} className="shrink-0" />
              Advertise on PostIQ
            </a>
          </div>
        </div>

        {/* Quick Shortcuts — compact */}
        <div className="glass-panel rounded-xl border border-card-border/70 px-3 py-3">
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">Quick Shortcuts</h4>
          <div className="grid grid-cols-2 gap-1">
            <Link href="/analyzer" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold">
              <Sparkles size={11} className="text-brand-purple shrink-0" />
              Post Scorer
            </Link>
            <Link href="/profile-intelligence" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold">
              <UserCheck size={11} className="text-brand-emerald shrink-0" />
              Profile IQ
            </Link>
            <Link href="/hooks" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold">
              <PenTool size={11} className="text-brand-indigo shrink-0" />
              Hook Studio
            </Link>
            <Link href="/calendar" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300 text-[10px] font-semibold">
              <CalendarIcon size={11} className="text-brand-amber shrink-0" />
              Calendar
            </Link>
          </div>
        </div>

        {/* Saved & Explore — compact */}
        <div className="glass-panel rounded-xl overflow-hidden border border-card-border/70">
          <div className="px-3 py-2 space-y-0">
            {[
              { label: 'Saved items', icon: BookOpen, href: '/dashboard' },
              { label: 'Groups', icon: Users, href: '/competitors' },
              { label: 'Newsletters', icon: Newspaper, href: '/trends' },
              { label: 'Events', icon: CalendarIcon, href: '/calendar' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                >
                  <Icon size={13} className="text-zinc-500 group-hover:text-brand-purple transition-colors shrink-0 stroke-[1.8px]" />
                  <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-brand-purple dark:group-hover:text-white transition-colors">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* 📝 Column 2: Interactive Feed &Composer (Center - 50% width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* "Start a Post" composer card */}
        <div className="glass-panel rounded-2xl p-4 md:p-5 border border-card-border/70 space-y-4">
          
          {/* Top row composer trigger */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase shrink-0">
              {profile?.name ? profile.name[0] : 'A'}
            </div>
            
            {!isDrafting ? (
              <button
                onClick={() => setIsDrafting(true)}
                className="flex-grow px-4 py-2.5 rounded-full border border-transparent bg-[#eef3f8] dark:bg-[#383f47] text-zinc-650 dark:text-zinc-350 text-xs font-semibold text-left hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all cursor-pointer"
              >
                Start a post, or let AI score your draft...
              </button>
            ) : (
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Draft Post Evaluation</span>
            )}
          </div>

          {/* Expanded AI Composer */}
          {isDrafting && (
            <div className="space-y-4 pt-2 border-t border-card-border/40 animate-in fade-in duration-200">
              <textarea
                value={draftContent}
                onChange={handleDraftChange}
                placeholder="Write or paste your LinkedIn post draft here..."
                rows={6}
                className="w-full p-3 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
                autoFocus
              />

              {/* Inline AI evaluation stats */}
              {liveAnalysis ? (
                <div className="p-4 rounded-2xl border border-brand-purple/10 bg-brand-purple/[0.01] space-y-4">
                  <div className="flex justify-between items-center border-b border-card-border/40 pb-2">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <Sparkles size={14} className="text-brand-purple animate-pulse" />
                      Live AI Score Card
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${
                      liveAnalysis.metrics.virality === 'Viral' ? 'bg-brand-rose/10 text-brand-rose border-brand-rose/20' :
                      liveAnalysis.metrics.virality === 'High' ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' :
                      liveAnalysis.metrics.virality === 'Medium' ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' :
                      'bg-zinc-550/10 text-zinc-550 border-zinc-500/20'
                    }`}>
                      {liveAnalysis.metrics.virality} Virality
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full border-4 border-[#71B7FB]/20 bg-[#71B7FB]/5 flex items-center justify-center font-black text-[#71B7FB] text-lg select-none">
                      {liveAnalysis.score}
                      <span className="text-[8px] text-zinc-500 absolute bottom-1.5">/100</span>
                    </div>

                    <div className="flex-1 space-y-2 text-[10px] font-semibold text-zinc-550">
                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Hook Power</span>
                          <span>{liveAnalysis.breakdown.hook}%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-[#71B7FB] rounded-full" style={{ width: `${liveAnalysis.breakdown.hook}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-0.5">
                          <span>Readability Structure</span>
                          <span>{liveAnalysis.breakdown.readability}%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${liveAnalysis.breakdown.readability}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {liveAnalysis.suggestions?.length > 0 && (
                    <div className="text-[10px] bg-black/10 dark:bg-white/5 p-2.5 rounded-xl border border-card-border/50 text-zinc-600 dark:text-zinc-400 font-medium">
                      <strong>AI Tip:</strong> {liveAnalysis.suggestions[0]}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[10px] text-zinc-500 italic">Start typing to evaluate your post draft in real time.</p>
              )}

              {/* Action buttons composer */}
              <div className="flex justify-end items-center gap-2 border-t border-card-border/40 pt-3">
                <button
                  onClick={() => { setIsDrafting(false); setDraftContent(''); setLiveAnalysis(null); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-550 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handlePublishDraft}
                  disabled={!draftContent.trim() || !liveAnalysis}
                  className="px-5 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-brand-purple/15"
                >
                  <SendIcon size={12} />
                  Analyze & Post
                </button>
              </div>
            </div>
          )}

          {/* Bottom row actions mockup (clickable when composer is open) */}
          <div className="flex items-center justify-between border-t border-card-border/40 pt-3">
            <div className="flex gap-2">
              <button 
                onClick={() => setIsDrafting(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-550 dark:text-zinc-400 text-xs font-bold transition-all"
              >
                <Camera size={15} className="text-blue-500" />
                <span className="hidden sm:inline">Photo</span>
              </button>
              <button 
                onClick={() => setIsDrafting(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-550 dark:text-zinc-400 text-xs font-bold transition-all"
              >
                <Video size={15} className="text-brand-emerald" />
                <span className="hidden sm:inline">Video</span>
              </button>
              <button 
                onClick={() => setIsDrafting(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-zinc-550 dark:text-zinc-400 text-xs font-bold transition-all"
              >
                <CalendarIcon size={15} className="text-brand-amber" />
                <span className="hidden sm:inline">Event</span>
              </button>
            </div>

            {isDrafting && (
              <span className="text-[10px] text-zinc-500 font-semibold">{draftContent.length} chars</span>
            )}
          </div>

        </div>

        {/* 📋 LinkedIn Feed section (Dynamic list of posts) */}
        <div className="space-y-4">
          
          {history.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 py-16 text-center space-y-4 border border-card-border/60">
              <History className="mx-auto text-zinc-400" size={32} />
              <p className="text-xs font-semibold text-zinc-500">Your post history is empty. Try drafting a post above!</p>
            </div>
          ) : (
            history.map((post) => {
              const isLiked = likedPosts[post.id] || false;
              const isExpanded = expandedPosts[post.id] || false;
              
              // Calculate truncated length
              const shouldTruncate = post.content.length > 250;
              const displayText = shouldTruncate && !isExpanded 
                ? `${post.content.slice(0, 240)}...` 
                : post.content;
              
              // Render relative date mockup
              const ageLabel = post.id.startsWith('post-') ? 'Just now' : '2 hours ago';
              
              return (
                <div key={post.id} className="glass-panel rounded-2xl p-4 md:p-5 border border-card-border/70 space-y-4 hover:border-brand-purple/20 transition-all relative group">
                  
                  {/* Floating AI score overlay tag */}
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <span className="text-[9px] font-extrabold bg-[#71B7FB]/10 text-[#71B7FB] px-2 py-0.5 rounded border border-[#71B7FB]/20 shadow-inner">
                      Score: {post.score}
                    </span>
                    <button
                      onClick={(e) => handleDeleteHistory(post.id, e)}
                      className="p-1 rounded text-zinc-450 hover:text-brand-rose hover:bg-brand-rose/10 opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete log"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Header Row */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-black text-sm uppercase shadow-inner shrink-0">
                      {profile?.name ? profile.name[0] : 'A'}
                    </div>
                    
                    <div className="truncate flex-1">
                      <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white truncate flex items-center gap-1">
                        {profile?.name || 'Alex Rivera'}
                        <Award size={12} className="text-brand-purple fill-brand-purple/10" />
                      </h4>
                      <p className="text-[9px] text-zinc-550 dark:text-zinc-400 font-medium truncate leading-normal max-w-[80%]">
                        {profile?.headline || 'Growth Lead'}
                      </p>
                      <div className="flex items-center gap-1 text-[8px] text-zinc-500 mt-0.5 font-bold">
                        <span>{ageLabel}</span>
                        <span>•</span>
                        <Globe size={9} />
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed whitespace-pre-wrap font-medium">
                    {displayText}
                    {shouldTruncate && !isExpanded && (
                      <button
                        onClick={() => handleExpandToggle(post.id)}
                        className="text-zinc-500 hover:text-brand-purple dark:text-zinc-450 dark:hover:text-white font-bold ml-1 hover:underline text-[10px]"
                      >
                        ...see more
                      </button>
                    )}
                  </div>

                  {/* Metrics count bar mockup */}
                  <div className="flex justify-between items-center text-[9px] text-zinc-500 font-semibold border-b border-card-border/40 pb-2">
                    <span>
                      {isLiked ? 'Liked by you and ' : ''}
                      {post.metrics.likes + (isLiked ? 1 : 0)} creators
                    </span>
                    <span>{post.metrics.comments} comments • {post.metrics.shares} shares</span>
                  </div>

                  {/* Action row buttons */}
                  <div className="flex justify-around items-center pt-1 text-xs font-bold text-zinc-550 dark:text-zinc-400">
                    <button
                      onClick={() => handleLikeToggle(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all ${
                        isLiked ? 'text-brand-purple' : ''
                      }`}
                    >
                      <ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} />
                      <span>Like</span>
                    </button>

                    <button
                      onClick={() => handleExpandToggle(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                      <MessageSquare size={14} />
                      <span>Comment</span>
                    </button>

                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                      onClick={() => handleExpandToggle(post.id)}
                    >
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}

        </div>

      </div>

      {/* ⚡ Column 3: News & creator tips — sticky right column */}
      <div className="lg:col-span-1 sticky top-[60px] max-h-[calc(100vh-68px)] overflow-y-auto space-y-3 pb-2 scrollbar-hide">
        
        {/* Creator opportunities / Trending news */}
        <div className="glass-panel rounded-2xl p-4 md:p-5 border border-card-border/70 space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <TrendingUp size={14} className="text-brand-emerald" />
            Trending Creator Topics
          </h3>
          
          <div className="space-y-3.5">
            {trendingTopics.map((trend, i) => (
              <div 
                key={i} 
                className="space-y-1 text-xs hover:bg-black/[0.02] dark:hover:bg-white/[0.01] p-1.5 rounded-xl border border-transparent hover:border-card-border/50 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-250 leading-snug max-w-[80%]">
                    {trend.topic}
                  </h4>
                  <span className="text-[8px] font-black text-brand-emerald bg-brand-emerald/10 px-1.5 py-0.5 rounded uppercase">
                    {trend.opportunity}
                  </span>
                </div>
                
                <p className="text-[10px] text-zinc-500 font-medium">Interest: {trend.interest}</p>
                
                <button
                  onClick={() => handleInjectTopic(trend.topic)}
                  className="text-[9px] font-bold text-brand-purple items-center gap-0.5 hover:underline mt-1.5 hidden group-hover:inline-flex animate-in fade-in duration-200"
                >
                  Draft hooks on this
                  <ArrowUpRight size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Creator Guidelines Card */}
        <div className="glass-panel rounded-2xl p-4 md:p-5 bg-gradient-to-br from-brand-purple/[0.02] to-brand-indigo/[0.02] border-brand-purple/10 space-y-4">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <BookOpen size={14} className="text-brand-purple" />
            Creator IQ Guidelines
          </h3>
          
          <ul className="space-y-3 text-[10px] text-zinc-500 leading-normal font-semibold">
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
              <span>Keep body updates spaced with single line breaks to increase readability indexing.</span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
              <span>Leading posts with curiosity-style hooks double the click-rate on the 'see more' button.</span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
              <span>Posts containing 3 hashtags rank 18% higher than posts with &gt;6 tags.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
}
