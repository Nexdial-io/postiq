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
  Plus,
  ChevronRight
} from 'lucide-react';
import { mockDb, PostAnalysis, UserProfile } from '@/lib/mockDb';
import { networkDb } from '@/lib/db';
import { analyzePostContent } from '@/lib/scoringEngine';
import confetti from 'canvas-confetti';
import { Mail, Phone, Check, Copy, X, Share } from 'lucide-react';

const GithubIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const getBannerStyleOrClass = (bannerUrl: string | undefined) => {
  if (!bannerUrl) {
    return {
      className: "bg-gradient-to-r from-[#71B7FB]/30 via-brand-purple/20 to-brand-indigo/30",
      style: {}
    };
  }
  if (bannerUrl.startsWith('gradient:')) {
    return {
      className: bannerUrl.replace('gradient:', ''),
      style: {}
    };
  }
  return {
    className: "",
    style: { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  };
};

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<PostAnalysis[]>([]);
  const [activePlan, setActivePlan] = useState('Free');
  const [activeUser, setActiveUser] = useState<any>(null);
  
  // Start a Post Box expansion states
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftContent, setDraftContent] = useState('');
  const [liveAnalysis, setLiveAnalysis] = useState<any>(null);

  // Feed interactions
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  // Contact and Share Dialog States
  const [showContactModal, setShowContactModal] = useState(false);
  const [sharingPost, setSharingPost] = useState<PostAnalysis | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sentMessageTo, setSentMessageTo] = useState<Record<string, boolean>>({});
  const [connections, setConnections] = useState<any[]>([]);

  // Comment thread states
  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    const loadProfileData = () => {
      const activeId = networkDb.getActiveUserId();
      const currentProfile = mockDb.getProfile();
      setProfile(currentProfile);
      setConnections(networkDb.getConnections(activeId));
      setActiveUser(networkDb.getActiveUser());
    };
    loadProfileData();
    setHistory(mockDb.getAnalyses());
    setActivePlan(mockDb.getSubscription().plan);

    window.addEventListener('liq-profile-updated', loadProfileData);
    return () => {
      window.removeEventListener('liq-profile-updated', loadProfileData);
    };
  }, []);

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    mockDb.deleteAnalysis(id);
    setHistory(mockDb.getAnalyses());
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim() || !profile) return;
    
    const newComment = {
      id: `comment-${Date.now()}`,
      authorName: profile.name,
      authorHeadline: profile.headline,
      authorAvatarUrl: profile.avatarUrl,
      authorIsVerified: profile.isVerified,
      content: newCommentText,
      timestamp: "Just now",
      likes: 0
    };

    const updatedHistory = history.map(post => {
      if (post.id === postId) {
        const currentComments = post.comments || [];
        const updatedComments = [newComment, ...currentComments];
        return {
          ...post,
          comments: updatedComments,
          metrics: {
            ...post.metrics,
            comments: updatedComments.length
          }
        };
      }
      return post;
    });

    setHistory(updatedHistory);
    setNewCommentText('');
    localStorage.setItem("liq_analyses", JSON.stringify(updatedHistory));
  };

  const handleRepost = (postToRepost: PostAnalysis) => {
    if (!profile) return;
    
    const repostedAnalysis: PostAnalysis = {
      id: `repost-${Date.now()}`,
      content: `♻️ Reposted from ${postToRepost.id.startsWith('repost-') ? 'original author' : (profile?.name || 'Creator')}:\n\n${postToRepost.content}`,
      score: postToRepost.score,
      breakdown: { ...postToRepost.breakdown },
      metrics: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        virality: 'Low'
      },
      suggestions: postToRepost.suggestions,
      timestamp: new Date().toISOString(),
      comments: []
    };

    mockDb.saveAnalysis(repostedAnalysis);
    setHistory(mockDb.getAnalyses());
    setSharingPost(null);
    
    confetti({
      particleCount: 50,
      spread: 30,
      origin: { y: 0.6 }
    });
  };

  const handleCopyShareLink = (postId: string) => {
    navigator.clipboard.writeText(`https://postiq.ai/posts/${postId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendDirectMessage = (userId: string) => {
    setSentMessageTo(prev => ({ ...prev, [userId]: true }));
    setTimeout(() => {
      setSentMessageTo(prev => ({ ...prev, [userId]: false }));
    }, 3000);
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
      
      {/* 📂 Column 1: Profile Card + Widgets — sticky on large screens, natural scroll on mobile */}
      <div className="lg:col-span-1 lg:sticky lg:top-[60px] lg:max-h-[calc(100vh-68px)] lg:overflow-y-auto space-y-3 pb-2 scrollbar-hide">

        {/* Profile Card — compact */}
        <div className="glass-panel rounded-xl overflow-hidden border border-card-border/70">
          {/* Banner */}
          {(() => {
            const banner = getBannerStyleOrClass(profile?.bannerUrl);
            return (
              <div 
                className={`h-20 sm:h-24 w-full relative transition-all ${banner.className}`} 
                style={banner.style}
              />
            );
          })()}

          {/* Avatar overlap */}
          <div className="flex justify-center -mt-6 relative z-10">
            <div className="w-12 h-12 rounded-full border-2 border-card-bg bg-brand-purple flex items-center justify-center text-white text-lg font-black shadow-md uppercase overflow-hidden shrink-0">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.name ? profile.name[0] : 'A'
              )}
            </div>
          </div>

          <div className="px-4 pt-2 pb-3 space-y-2 text-center">
            <div className="border-b border-card-border/50 pb-2">
              <h3 className="font-extrabold text-xs text-zinc-900 dark:text-white leading-snug hover:underline cursor-pointer flex items-center justify-center gap-1">
                {profile?.name || 'Alex Rivera'}
                {profile?.isVerified && (
                  <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                    <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5 leading-normal max-w-[190px] mx-auto line-clamp-2">
                {profile?.headline || 'SaaS Growth Specialist'}
              </p>
            </div>
            
            {/* Contact Info link */}
            <div className="pt-1.5 pb-0.5 border-b border-card-border/50 text-center">
              <button 
                onClick={() => setShowContactModal(true)}
                className="text-[10px] text-brand-purple hover:underline font-bold flex items-center justify-center gap-1 mx-auto"
              >
                <Globe size={11} className="stroke-[2.2px]" />
                Contact Info
              </button>
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
        
        {/* 🌟 NEW FEATURE: PERSONAL BRAND DASHBOARD */}
        <div className="glass-panel rounded-2xl p-6 border border-brand-purple/20 bg-gradient-to-br from-brand-purple/[0.03] to-transparent space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border/50 pb-4">
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                <Sparkles className="text-brand-purple" size={18} />
                Personal Brand Intelligence Dashboard
              </h2>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                Real-time visibility metrics and content recommendations.
              </p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2 py-0.5 rounded">
              Active Sync
            </span>
          </div>

          {(() => {
            const contentScoreVal = activeUser?.contentScore || 82;
            const profileScoreVal = activeUser?.profileScore || 91;
            const networkScoreVal = activeUser?.recruiterScore || 74;
            const trendScoreVal = activeUser?.seoScore || 88;
            const brandScoreVal = Math.round((contentScoreVal + profileScoreVal + networkScoreVal + trendScoreVal) / 4);

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Circular brand score gauge */}
                <div className="flex flex-col items-center justify-center p-4 border border-card-border/60 bg-black/5 dark:bg-black/10 rounded-2xl text-center space-y-2 shrink-0 select-none">
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-[6px] border-brand-purple/20 bg-brand-purple/5 shadow-inner">
                    <span className="text-3xl font-extrabold text-brand-purple">{brandScoreVal}</span>
                    <span className="text-[10px] text-zinc-500 absolute bottom-3">/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider">Overall Brand Score</span>
                    <span className="text-[9px] text-brand-purple font-bold block mt-0.5">
                      {brandScoreVal >= 85 ? "Authoritative Presence" : brandScoreVal >= 70 ? "Consistent Optimizer" : "Growth Required"}
                    </span>
                  </div>
                </div>

                {/* Subscores Grid */}
                <div className="md:col-span-2 grid grid-cols-2 gap-3">
                  {[
                    { name: "Content Score", val: contentScoreVal, path: "/analyzer", color: "text-[#71B7FB] border-[#71B7FB]/20" },
                    { name: "Profile Score", val: profileScoreVal, path: "/profile-intelligence", color: "text-brand-emerald border-brand-emerald/20" },
                    { name: "Network Score", val: networkScoreVal, path: "/network", color: "text-brand-amber border-brand-amber/20" },
                    { name: "Trend Score", val: trendScoreVal, path: "/trends", color: "text-brand-indigo border-brand-indigo/20" }
                  ].map((sub, idx) => (
                    <Link 
                      href={sub.path} 
                      key={idx}
                      className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all flex justify-between items-center group cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-zinc-500 block group-hover:text-brand-purple transition-colors">{sub.name}</span>
                        <strong className={`text-lg font-black ${sub.color.split(" ")[0]} mt-0.5 block`}>{sub.val}</strong>
                      </div>
                      <ChevronRight size={14} className="text-zinc-400 group-hover:text-brand-purple group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Weekly Action Plan */}
          <div className="border-t border-card-border/50 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500">Weekly Action Plan</h3>
              <span className="text-[9px] text-zinc-400 font-bold">Priority ordered checklist</span>
            </div>

            <div className="space-y-2.5">
              {[
                { 
                  prio: "Priority 1", 
                  title: "Improve CTA Quality", 
                  path: "/analyzer",
                  why: "CTA quality directly drives comment rate and algorithmic feed visibility.",
                  how: "Review hooks & optimize spacing using the Post Analyzer auto-fixes.",
                  impact: "+12% engagement CTR"
                },
                { 
                  prio: "Priority 2", 
                  title: "Add metrics to About section", 
                  path: "/profile-intelligence",
                  why: "ATS models and recruiter filters index profile summaries containing quantified metrics.",
                  how: "Use the AI Profile Rewrite Studio to insert key B2B SaaS accomplishments.",
                  impact: "+18% search visibility"
                },
                { 
                  prio: "Priority 3", 
                  title: "Publish 2 trend-based posts", 
                  path: "/trends",
                  why: "Writing on trending topics (e.g. B2B AI Agents) triggers early-adoption reach loops.",
                  how: "Generate a custom post directly from the Trends Discovery tab.",
                  impact: "+30% reach boost"
                },
                { 
                  prio: "Priority 4", 
                  title: "Connect with 15 PM leaders", 
                  path: "/network",
                  why: "Connecting with peers increases the reach overlap score for your content.",
                  how: "Review the recommended connection lists in the Creator Network tab.",
                  impact: "+15% SSI index boost"
                }
              ].map((act, i) => (
                <div key={i} className="group p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2 hover:border-brand-purple/20 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded">{act.prio}</span>
                      <Link href={act.path} className="text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-brand-purple hover:underline transition-all">
                        {act.title}
                      </Link>
                    </div>
                    
                    <Link href={act.path} className="text-[10px] font-bold text-brand-purple flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      Take Action
                      <ChevronRight size={10} />
                    </Link>
                  </div>

                  {/* Why / How / Impact Explanatory Tooltips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-card-border/40 text-[9px] leading-normal font-semibold text-zinc-550">
                    <div>
                      <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why?</strong>
                      <span className="block leading-relaxed">{act.why}</span>
                    </div>
                    <div>
                      <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How?</strong>
                      <span className="block leading-relaxed">{act.how}</span>
                    </div>
                    <div>
                      <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Impact?</strong>
                      <span className="text-brand-emerald font-black block">{act.impact}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* "Start a Post" composer card */}
        <div className="glass-panel rounded-2xl p-4 md:p-5 border border-card-border/70 space-y-4">
          
          {/* Top row composer trigger */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase shrink-0 overflow-hidden">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile?.name ? profile.name[0] : 'A'
              )}
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
                    <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-black text-sm uppercase shadow-inner shrink-0 overflow-hidden">
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile?.name ? profile.name[0] : 'A'
                      )}
                    </div>
                    
                    <div className="truncate flex-1">
                      <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white truncate flex items-center gap-1">
                        {profile?.name || 'Alex Rivera'}
                        {profile?.isVerified && (
                          <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                            <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
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
                    <span>{(post.comments || []).length} comments • {post.metrics.shares} shares</span>
                  </div>

                  {/* Action row buttons */}
                  <div className="flex justify-around items-center pt-1 text-xs font-bold text-zinc-555 dark:text-zinc-400">
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
                      onClick={() => setCommentingPostId(commentingPostId === post.id ? null : post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all ${
                        commentingPostId === post.id ? 'text-brand-purple' : ''
                      }`}
                    >
                      <MessageSquare size={14} />
                      <span>Comment</span>
                    </button>

                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                      onClick={() => setSharingPost(post)}
                    >
                      <Share2 size={14} />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Collapsible Comment Thread Block */}
                  {commentingPostId === post.id && (
                    <div className="border-t border-card-border/40 pt-4 mt-3 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* Input row */}
                      <div className="flex gap-2.5 items-start">
                        <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-xs uppercase overflow-hidden shrink-0">
                          {profile?.avatarUrl ? (
                            <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            profile?.name ? profile.name[0] : 'A'
                          )}
                        </div>
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a comment on this draft evaluation..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(post.id);
                            }}
                            className="flex-grow bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-purple transition-all"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!newCommentText.trim()}
                            className="px-3.5 py-2 rounded-xl bg-brand-purple text-white hover:opacity-90 disabled:opacity-50 text-[10px] font-black transition-all shadow-sm shrink-0"
                          >
                            Comment
                          </button>
                        </div>
                      </div>

                      {/* Comments Listing */}
                      <div className="space-y-3 pt-1">
                        {(post.comments || []).map((comment) => (
                          <div key={comment.id} className="flex gap-2.5 items-start text-xs font-semibold">
                            <div className="w-7 h-7 rounded-full bg-brand-indigo flex items-center justify-center text-white font-black text-[10px] uppercase overflow-hidden shrink-0">
                              {comment.authorAvatarUrl ? (
                                <img src={comment.authorAvatarUrl} alt={comment.authorName} className="w-full h-full object-cover" />
                              ) : (
                                comment.authorName[0]
                              )}
                            </div>
                            
                            <div className="flex-1 bg-black/[0.015] dark:bg-white/[0.015] p-2.5 rounded-2xl border border-card-border/50">
                              <div className="flex justify-between items-center">
                                <span className="font-extrabold text-zinc-900 dark:text-white text-[11px] flex items-center gap-1.5">
                                  {comment.authorName}
                                  {comment.authorIsVerified && (
                                    <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3 h-3 shrink-0 shadow-sm" title="Verified Creator">
                                      <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </span>
                                  )}
                                </span>
                                <span className="text-[9px] text-zinc-500 font-medium">{comment.timestamp}</span>
                              </div>
                              <p className="text-[9px] text-zinc-500 mt-0.5 truncate leading-none font-medium max-w-[220px]">{comment.authorHeadline}</p>
                              <p className="text-zinc-700 dark:text-zinc-300 font-medium mt-2 leading-relaxed break-words">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

        </div>

      </div>

      {/* ⚡ Column 3: News & creator tips — sticky right column on large screens, natural scroll on mobile */}
      <div className="lg:col-span-1 lg:sticky lg:top-[60px] lg:max-h-[calc(100vh-68px)] lg:overflow-y-auto space-y-3 pb-2 scrollbar-hide">
        
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

      {/* CONTACT INFO GLASSMORPHISM MODAL */}
      {showContactModal && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel border border-card-border bg-card-bg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border p-5">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-brand-purple" />
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">Contact Info</h3>
              </div>
              <button 
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-lg border border-card-border text-zinc-450 hover:text-zinc-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Profile Brief */}
            <div className="p-5 border-b border-card-border/50 bg-black/[0.015] dark:bg-white/[0.015] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm uppercase overflow-hidden shrink-0">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile.name[0]
                )}
              </div>
              <div className="truncate flex-1">
                <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white flex items-center gap-1">
                  {profile.name}
                  {profile.isVerified && (
                    <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                      <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-semibold truncate leading-none mt-1">{profile.headline}</p>
              </div>
            </div>

            {/* Links Directory */}
            <div className="p-5 space-y-4 text-xs font-semibold">
              {/* Website */}
              <div className="flex items-start gap-3">
                <Globe className="text-brand-purple shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-505 uppercase tracking-wider block">Website</span>
                  {profile.contactInfo?.website ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={profile.contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-brand-purple hover:underline truncate"
                      >
                        {profile.contactInfo.website}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(profile.contactInfo?.website || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-505 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-start gap-3">
                <GithubIcon className="text-brand-indigo shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">GitHub Profile</span>
                  {profile.contactInfo?.github ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={profile.contactInfo.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-brand-indigo hover:underline truncate"
                      >
                        {profile.contactInfo.github}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(profile.contactInfo?.github || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-505 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* Twitter */}
              <div className="flex items-start gap-3">
                <TwitterIcon className="text-[#1da1f2] shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">Twitter / X</span>
                  {profile.contactInfo?.twitter ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={profile.contactInfo.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#1da1f2] hover:underline truncate"
                      >
                        {profile.contactInfo.twitter}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(profile.contactInfo?.twitter || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-505 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="text-brand-emerald shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">Email Address</span>
                  {profile.contactInfo?.email ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={`mailto:${profile.contactInfo.email}`} 
                        className="text-brand-emerald hover:underline truncate"
                      >
                        {profile.contactInfo.email}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(profile.contactInfo?.email || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-550 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="text-brand-amber shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">Phone Number</span>
                  {profile.contactInfo?.phone ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-zinc-800 dark:text-zinc-350 truncate">{profile.contactInfo.phone}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(profile.contactInfo?.phone || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-505 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/5 dark:bg-black/20 border-t border-card-border flex justify-end">
              <button 
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 shadow-md shadow-brand-purple/10"
              >
                Close Info
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE DIALOG MODAL */}
      {sharingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel border border-card-border bg-card-bg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border p-5">
              <div className="flex items-center gap-2">
                <Share size={16} className="text-brand-purple" />
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">Share Post Evaluation</h3>
              </div>
              <button 
                onClick={() => { setSharingPost(null); setCopiedLink(false); }}
                className="p-1 rounded-lg border border-card-border text-zinc-450 hover:text-zinc-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Post excerpt */}
            <div className="p-4 bg-black/[0.015] dark:bg-white/[0.015] border-b border-card-border/50 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <p className="line-clamp-2 italic leading-relaxed">"{sharingPost.content}"</p>
            </div>

            {/* Options */}
            <div className="p-5 space-y-5 text-xs font-semibold">
              <div className="space-y-1.5">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Direct Post Link</span>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={`https://postiq.ai/posts/${sharingPost.id}`} 
                    className="flex-grow bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border rounded-xl px-3 py-2 text-xs focus:outline-none font-mono text-brand-purple"
                  />
                  <button 
                    onClick={() => handleCopyShareLink(sharingPost.id)}
                    className="px-4 py-2 rounded-xl bg-brand-purple text-white font-bold hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm min-w-[100px]"
                  >
                    {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRepost(sharingPost)}
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-card-border hover:border-brand-purple hover:bg-brand-purple/[0.01] transition-all group"
                >
                  <Share2 className="text-brand-purple group-hover:scale-105 transition-transform" size={16} />
                  <div className="text-left">
                    <p className="font-extrabold text-zinc-800 dark:text-zinc-200">Repost Instantly</p>
                    <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Publish back to your feed</p>
                  </div>
                </button>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my evaluated post score of ${sharingPost.score}/100 on PostIQ! 🚀\n\n"${sharingPost.content.slice(0, 100)}..."`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-card-border hover:border-[#1da1f2] hover:bg-[#1da1f2]/[0.01] transition-all group"
                >
                  <TwitterIcon className="text-[#1da1f2] group-hover:scale-105 transition-transform" size={16} />
                  <div className="text-left">
                    <p className="font-extrabold text-zinc-800 dark:text-zinc-200">Share to Twitter</p>
                    <p className="text-[9px] text-zinc-500 font-medium mt-0.5">Post to your X feed</p>
                  </div>
                </a>
              </div>

              <div className="space-y-2 pt-1 border-t border-card-border/50">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Send to Simulated Connections</span>
                {connections.length === 0 ? (
                  <p className="text-[10px] text-zinc-500 italic font-semibold">You have no connections to send to yet. Add connections in the Creator Network!</p>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1.5 scrollbar-hide">
                    {connections.map((user) => (
                      <div key={user.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-2.5 min-w-0 pr-3">
                          <div className="w-7 h-7 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-[10px] uppercase overflow-hidden shrink-0">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name[0]
                            )}
                          </div>
                          <div className="truncate">
                            <p className="font-bold truncate text-[11px] text-zinc-800 dark:text-zinc-200">{user.name}</p>
                            <p className="text-[9px] text-zinc-500 truncate font-semibold leading-none mt-0.5">{user.headline.split('|')[0]}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSendDirectMessage(user.id)}
                          className={`px-3 py-1 rounded-lg font-black text-[9px] transition-all shrink-0 ${
                            sentMessageTo[user.id] 
                              ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 cursor-default' 
                              : 'border border-card-border text-zinc-650 dark:text-zinc-350 hover:bg-brand-purple hover:text-white hover:border-transparent'
                          }`}
                        >
                          {sentMessageTo[user.id] ? (
                            <span className="flex items-center gap-0.5">
                              <Check size={8} />
                              Sent!
                            </span>
                          ) : (
                            'Send'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-black/5 dark:bg-black/20 border-t border-card-border flex justify-end">
              <button 
                onClick={() => { setSharingPost(null); setCopiedLink(false); }}
                className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 shadow-md shadow-brand-purple/10"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
