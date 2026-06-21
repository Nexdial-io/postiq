"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Shield, 
  Zap, 
  Users, 
  Search, 
  BarChart3, 
  MessageSquare,
  Activity,
  Cpu,
  Wand2,
  Share2,
  BookmarkCheck
} from 'lucide-react';
import { analyzePostContent, autoFixPost } from '@/lib/scoringEngine';
import confetti from 'canvas-confetti';

export default function Home() {
  const [demoContent, setDemoContent] = useState(
    "How I grew my SaaS to $10k MRR in just 6 months. 🚀\n\nNo venture capital, no huge marketing budget.\nJust one simple system:\n\n1. Consistent daily publishing\n2. Focusing on user-centric design\n3. Iterating on direct feedback\n\nWhat is your #1 strategy for SaaS growth? Let's discuss below!"
  );
  const [analysis, setAnalysis] = useState(analyzePostContent(demoContent));
  const [isAnnual, setIsAnnual] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleDemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDemoContent(text);
    setAnalysis(analyzePostContent(text));
    setShowFullPreview(false);
  };

  const handleAutoFix = (type: 'hook' | 'cta' | 'format') => {
    const fixed = autoFixPost(demoContent, type);
    setDemoContent(fixed);
    setAnalysis(analyzePostContent(fixed));
    setShowFullPreview(false);
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 }
    });
  };

  const handleShareScore = () => {
    const shareText = `I just scored a ${analysis.score}/100 on my LinkedIn post draft using PostIQ! 🚀\n\nTest your own drafts and optimize hooks at https://postiq.nexdial.io`;
    navigator.clipboard.writeText(shareText);
    setShareSuccess(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const features = [
    {
      icon: Cpu,
      title: "Content Intelligence",
      description: "Publish posts with confidence. Analyze hook strength, authority signals, readability score, and CTA quality before publishing."
    },
    {
      icon: Activity,
      title: "Reach Optimizer",
      description: "Index your content successfully. Discover niche hashtags, cluster relevance, and get estimated reach metrics."
    },
    {
      icon: Users,
      title: "Profile Optimizer",
      description: "Optimize profile visibility. Audit headline keywords, resume compatibility metrics, and recruiter search appearances."
    },
    {
      icon: Sparkles,
      title: "Hook & Content Studio",
      description: "Never stare at a blank screen. Generate curiosity, authority, or contrarian openers from filterable swipe files."
    },
    {
      icon: BarChart3,
      title: "Competitive Insights",
      description: "Bridge content gaps. Compare engagement baselines and evaluate competitor strategies in your niche."
    },
    {
      icon: MessageSquare,
      title: "AI Scheduling Engine",
      description: "Master optimal timing. Map content mixes on visual calendars with demographic optimal slots."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center text-center px-4 overflow-hidden">
        {/* Glow circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none pulse-glow-purple"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-emerald/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={12} className="fill-brand-purple/20" />
            The AI Operating System for LinkedIn Growth
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-gradient">
            Grow Faster on LinkedIn<br />With Creator Intelligence
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            Optimize your content, strengthen your profile, discover trending opportunities, and build a personal brand that attracts recruiters, clients, and followers.
          </p>

          <div className="flex items-center justify-center gap-2 py-1 text-xs font-bold text-brand-purple tracking-wide uppercase">
            <span>Analyze posts</span>
            <span className="text-zinc-450">•</span>
            <span>Improve visibility</span>
            <span className="text-zinc-450">•</span>
            <span>Scale your influence</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-base hover:opacity-95 shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-2 animate-pulse-glow"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link 
              href="#demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-card-border bg-black/5 dark:bg-white/5 font-semibold text-base hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center justify-center"
            >
              Try Live Demo
            </Link>
          </div>

          <div className="pt-8 border-t border-card-border/40 max-w-md mx-auto flex flex-col items-center gap-2">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-extrabold uppercase tracking-wider">Early-Stage Traction</span>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-zinc-600 dark:text-zinc-300 mt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse"></span>
                <span>500+ Posts Analyzed</span>
              </div>
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">|</span>
              <div className="flex items-center gap-1.5">
                <span>100+ Profiles Optimized</span>
              </div>
              <span className="text-zinc-400 dark:text-zinc-500 font-normal">|</span>
              <div>
                <span className="text-brand-purple">Built for Creators</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Professionals Use PostIQ (Results Section) */}
      <section className="w-full max-w-5xl px-4 py-8 relative z-10">
        <div className="glass-panel rounded-3xl p-8 border border-card-border/70 bg-gradient-to-r from-brand-purple/[0.02] to-transparent">
          <h3 className="text-center text-xl sm:text-2xl font-extrabold mb-8">
            Why Professionals Use PostIQ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {[
              { title: "Identify weak posts before publishing", desc: "Scan drafts for readability, CTA power, and hook strength." },
              { title: "Improve recruiter visibility", desc: "Optimize headlines and experience logs for search algorithms." },
              { title: "Discover content opportunities earlier", desc: "Capitalize on emerging industry trends before they saturate." },
              { title: "Build a stronger personal brand", desc: "Track brand scores and signal authority with every upload." },
              { title: "Make data-driven content decisions", desc: "Rely on simulated performance indicators rather than guesswork." }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2.5 p-4 rounded-2xl border border-card-border/40 hover:border-brand-purple/20 transition-all">
                <div className="w-8 h-8 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center shrink-0">
                  <Check size={16} />
                </div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 leading-snug">{item.title}</h4>
                <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-semibold leading-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-5xl px-4 py-12 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white">How It Works</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto font-semibold">
            Optimizing your personal brand and content drafts takes three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Paste Your Post Draft", desc: "Input your content in the optimizer to check hook authority, readability, failure risks, and emotional tone." },
            { step: "2", title: "Apply AI Recommendations", desc: "Integrate one-click AI formatting edits, structural adjustments, and context-specific CTAs to lift engagement scores." },
            { step: "3", title: "Publish & Track Success", desc: "Upload optimized content to LinkedIn and audit your profile key phrases regularly to boost search appearance counts." }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 border border-card-border flex flex-col space-y-4 relative">
              <span className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-extrabold text-xs shrink-0">{item.step}</span>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">{item.title}</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Demo Widget Section */}
      <section id="demo" className="w-full max-w-5xl px-4 py-16 scroll-mt-16">
        <div className="glass-panel rounded-xl p-6 md:p-8 border border-card-border/70">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Input Box */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg md:text-xl flex items-center gap-2">
                  <Sparkles className="text-brand-purple" size={20} />
                  Test the Live Post Scorer
                </h3>
                <span className="text-xs text-zinc-500 font-semibold">{demoContent.length} chars</span>
              </div>
              
              <textarea
                value={demoContent}
                onChange={handleDemoChange}
                placeholder="Paste or write your LinkedIn post here..."
                rows={8}
                className="w-full p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-sm focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
              />

              {/* Smart Auto Fixes */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs font-bold text-zinc-400 flex items-center mr-1">
                  <Wand2 size={13} className="mr-1" /> AI Auto-Fix:
                </span>
                <button
                  onClick={() => handleAutoFix('hook')}
                  disabled={!demoContent.trim()}
                  className="px-2.5 py-1 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Optimize Hook
                </button>
                <button
                  onClick={() => handleAutoFix('format')}
                  disabled={!demoContent.trim()}
                  className="px-2.5 py-1 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Structure Spacing
                </button>
                <button
                  onClick={() => handleAutoFix('cta')}
                  disabled={!demoContent.trim()}
                  className="px-2.5 py-1 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Insert CTA
                </button>
              </div>

              {/* Live LinkedIn Feed Preview */}
              <div className="space-y-2 pt-4 border-t border-card-border/50">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Live LinkedIn Feed Preview</h4>
                <div className="border border-card-border/60 rounded-xl p-4 bg-white dark:bg-[#1d2226] text-zinc-900 dark:text-[#e0e0e0] font-sans text-left">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase shrink-0">
                      G
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">Guest Creator</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">• 1st</span>
                      </div>
                      <span className="text-[9px] text-zinc-505 dark:text-zinc-400 block truncate leading-tight">
                        SaaS Founder & Growth Expert (Visiting PostIQ)
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block leading-tight mt-0.5">Just now • 🌐</span>
                    </div>
                  </div>
                  
                  {/* Body Text */}
                  <div className="text-xs text-zinc-800 dark:text-zinc-350 whitespace-pre-wrap leading-relaxed break-words">
                    {demoContent.length > 250 && !showFullPreview 
                      ? demoContent.substring(0, 220) + "..."
                      : demoContent}
                    {demoContent.length > 250 && !showFullPreview && (
                      <button 
                        onClick={() => setShowFullPreview(true)} 
                        className="text-brand-purple font-semibold hover:underline ml-1"
                      >
                        see more
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Output */}
            <div className="w-full lg:w-[350px] space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 border-b border-card-border/50 pb-2">AI Score Card</h4>
                
                {/* Score Gauge */}
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-brand-purple/20 bg-brand-purple/5 shrink-0">
                    <span className="text-2xl font-extrabold text-brand-purple">{analysis.score}</span>
                    <span className="text-[10px] text-zinc-500 absolute bottom-3">/100</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base">Engagement:</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                        analysis.metrics.virality === 'Viral' ? 'bg-brand-rose/10 text-brand-rose' :
                        analysis.metrics.virality === 'High' ? 'bg-brand-purple/10 text-brand-purple' :
                        analysis.metrics.virality === 'Medium' ? 'bg-brand-indigo/10 text-brand-indigo' :
                        'bg-zinc-550/10 text-zinc-555'
                      }`}>
                        {analysis.metrics.virality}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Predicted Reach: <span className="font-semibold text-foreground">{analysis.metrics.reach.toLocaleString()}</span>
                    </p>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>Hook Quality (20%)</span>
                      <span>{analysis.breakdown.hook}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-purple rounded-full" style={{ width: `${analysis.breakdown.hook}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>Emotional Impact (15%)</span>
                      <span>{analysis.breakdown.emotional}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-indigo rounded-full" style={{ width: `${analysis.breakdown.emotional}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>Readability (15%)</span>
                      <span>{analysis.breakdown.readability}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${analysis.breakdown.readability}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <div className="pt-4 border-t border-card-border/50">
                  <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Key Recommendation</h5>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-[#f8f9fa] dark:bg-[#141b22] p-3 rounded-xl border border-card-border/50 font-medium leading-relaxed">
                    {analysis.suggestions[0]}
                  </p>
                </div>
              </div>

              {/* Share Score / Launch App Action Panel */}
              <div className="pt-4 border-t border-card-border/50 space-y-2.5">
                <button
                  onClick={handleShareScore}
                  className="w-full py-2.5 rounded-xl border border-card-border/80 bg-[#eef3f8] dark:bg-[#383f47] text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 size={13} />
                  {shareSuccess ? 'Copied Share Link!' : 'Share My Score Draft'}
                </button>

                <Link
                  href="/dashboard"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-center text-xs font-bold shadow-md shadow-brand-purple/20 hover:opacity-95 transition-all flex items-center justify-center gap-1"
                >
                  <BookmarkCheck size={13} />
                  Unlock Full Tool Suite Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Brand Score Section */}
      <section className="w-full max-w-5xl px-4 py-12 text-center">
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-card-border/70 relative overflow-hidden bg-gradient-to-b from-brand-purple/[0.03] to-transparent">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/5 blur-[80px] pointer-events-none"></div>
          <div className="max-w-2xl mx-auto space-y-4 mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Track Your Entire LinkedIn Presence
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-semibold">
              PostIQ is not just an AI writing tool. It is your **LinkedIn Growth Operating System** that monitors, scores, and optimizes every dimension of your personal brand.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Content Score", score: 84, color: "text-brand-purple", bg: "bg-brand-purple/5" },
              { name: "Profile Score", score: 91, color: "text-brand-indigo", bg: "bg-brand-indigo/5" },
              { name: "Network Score", score: 74, color: "text-brand-emerald", bg: "bg-brand-emerald/5" },
              { name: "Trend Alignment", score: 88, color: "text-brand-amber", bg: "bg-brand-amber/5" },
              { name: "Overall Brand Score", score: 84, color: "text-brand-purple bg-gradient-to-r from-brand-purple to-brand-indigo bg-clip-text", bg: "bg-brand-purple/10 border-brand-purple/30", highlight: true }
            ].map((card, idx) => (
              <div key={idx} className={`rounded-2xl p-5 border text-center transition-all ${card.highlight ? 'border-brand-purple/30 bg-brand-purple/[0.04] scale-105 shadow-md shadow-brand-purple/5' : 'border-card-border bg-black/[0.01] dark:bg-white/[0.01]'} hover:border-brand-purple/30`}>
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block tracking-wider mb-3">{card.name}</span>
                <div className="flex justify-center items-baseline gap-1 my-2">
                  <span className={`text-4xl font-extrabold tracking-tight ${card.color}`}>{card.score}</span>
                  <span className="text-zinc-400 text-xs font-semibold">/100</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                  <div className={`h-full rounded-full ${card.highlight ? 'bg-gradient-to-r from-brand-purple to-brand-indigo' : 'bg-brand-purple'}`} style={{ width: `${card.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="w-full max-w-4xl px-4 py-16 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold">A Smarter Approach to LinkedIn</h2>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto font-semibold">See how PostIQ compares to traditional content creation methods.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Without PostIQ */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-brand-rose/10 bg-brand-rose/[0.01] space-y-6">
            <h4 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-base flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-rose/10 text-brand-rose flex items-center justify-center text-xs shrink-0 font-bold">❌</span>
              Without PostIQ
            </h4>
            <ul className="space-y-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-3">
                <span className="text-brand-rose mt-0.5 shrink-0">❌</span>
                <span>Guess what to post without knowing readability, hook power, or engagement potential.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-rose mt-0.5 shrink-0">❌</span>
                <span>Publish drafts with generic CTAs or layout structures that decrease feed retention.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-rose mt-0.5 shrink-0">❌</span>
                <span>Miss emerging industry trends because you are unaware of shifting audience interests.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-rose mt-0.5 shrink-0">❌</span>
                <span>Remain invisible to tech recruiters due to unindexed headline keywords and profile structures.</span>
              </li>
            </ul>
          </div>

          {/* With PostIQ */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-brand-emerald/20 bg-brand-emerald/[0.01] space-y-6 glow-emerald">
            <h4 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-base flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center text-xs shrink-0 font-bold">✓</span>
              With PostIQ
            </h4>
            <ul className="space-y-4 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              <li className="flex items-start gap-3">
                <span className="text-brand-emerald mt-0.5 shrink-0">✓</span>
                <span>Predict draft performance scores and scan sentences against 14 readability metrics before publishing.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-emerald mt-0.5 shrink-0">✓</span>
                <span>Refine hooks and formats instantly using context-aware auto-fix templates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-emerald mt-0.5 shrink-0">✓</span>
                <span>Discover emerging topic opportunities early with dedicated demographic opportunity indicators.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-emerald mt-0.5 shrink-0">✓</span>
                <span>Ensure headlines, about logs, and experience items rank highly for recruiter search key phrases.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full max-w-7xl px-4 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Supercharged Growth Tools
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Optimize every metric of your LinkedIn activity. Our analytics suite analyzes performance patterns to tell you exactly how to grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div key={index} className="glass-panel rounded-2xl p-6 flex flex-col justify-between hover:border-brand-purple/40 hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white">{feat.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visual Product Showcase Section */}
      <section className="w-full max-w-5xl px-4 py-16 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white font-sans">
            Explore the Growth Engine
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-xs font-semibold">
            Take a closer look at the advanced creator intelligence workspace screens designed to accelerate your reach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {[
            { title: "Estimated Content Intelligence", desc: "Gain immediate feedback on post structure. Optimize hooks, CTA placement, formatting styles, and get estimated reach metrics dynamically.", img: "/analyzer_preview.png" },
            { title: "Simulated Profile Optimizer", desc: "Audit your LinkedIn SEO score, identify missing key phrases, compare current vs. potential search visibility, and rewrite copy using optimized templates.", img: "/profile_intel_preview.png" },
            { title: "Hook & Content Studio", desc: "Never stare at a blank screen again. Compare two hook structures side-by-side to predict CTR differences, filter swipe templates, and auto-generate draft frameworks.", img: "/hook_studio_preview.png" },
            { title: "Simulated Trends Discovery", desc: "Capitalize on emerging industry conversations. Map out opportunity signals based on competition density vs. topic interest across your target demographic.", img: "/trends_preview.png" }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel rounded-3xl p-6 border border-card-border/60 flex flex-col justify-between space-y-4 hover:border-brand-purple/20 transition-all group">
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg text-zinc-955 dark:text-zinc-50">{item.title}</h3>
                <p className="text-xs text-zinc-500 font-semibold leading-relaxed">{item.desc}</p>
              </div>
              <div className="rounded-2xl border border-card-border overflow-hidden bg-black/5 dark:bg-black/25 relative aspect-[16/10] mt-4 flex items-center justify-center">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.015] transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full max-w-6xl px-4 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold">Predictable Pricing</h2>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            Choose the right plan for your professional journey. Switch billing cycles anytime.
          </p>
          
          {/* Switcher toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border gap-2">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-md' : 'text-zinc-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-md' : 'text-zinc-400'}`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between border-card-border relative">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-xl">Free</h4>
                <p className="text-xs text-zinc-500 mt-1">For casual creators and professionals</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-zinc-500 text-xs ml-1">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> 10 post analyses / day</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Basic profile score</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Simple hook generation</li>
                <li className="flex items-center gap-2 text-zinc-400 line-through"><Check size={14} className="text-zinc-400" /> Full profile rewrite studio</li>
              </ul>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 w-full py-3 rounded-xl border border-card-border text-center text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Try Demo App
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between border-brand-purple/40 glow-purple relative bg-gradient-to-b from-brand-purple/[0.03] to-transparent">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-xl">Pro</h4>
                <p className="text-xs text-brand-purple mt-1 font-semibold">For serious content creators & consultants</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">${isAnnual ? 19 : 24}</span>
                <span className="text-zinc-500 text-xs ml-1">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Unlimited post analyses</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Deep Profile Intelligence Audits</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Competitor gap tracking</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Drag-and-drop Content Calendar</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> High-fidelity rewrite models</li>
              </ul>
            </div>
            <Link
              href="/billing?plan=pro"
              className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-center text-sm font-bold shadow-md shadow-brand-purple/20 hover:opacity-95 transition-all"
            >
              Get Pro Now
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Bottom Banner */}
      <section className="w-full max-w-5xl px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-10 bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 border-brand-purple/20 flex flex-col items-center space-y-6">
          <Shield className="text-brand-purple w-12 h-12" />
          <h3 className="text-2xl md:text-3xl font-extrabold">Ready to dominate your industry feed?</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-lg font-medium">
            Optimize your profile for recruiters, draft engaging posts, and predict performance metrics in minutes.
          </p>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center gap-2"
          >
            Launch Platform Demo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
