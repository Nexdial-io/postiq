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
  Cpu
} from 'lucide-react';
import { analyzePostContent } from '@/lib/scoringEngine';

export default function Home() {
  const [demoContent, setDemoContent] = useState(
    "How I grew my SaaS to $10k MRR in just 6 months. 🚀\n\nNo venture capital, no huge marketing budget.\nJust one simple system:\n\n1. Consistent daily publishing\n2. Focusing on user-centric design\n3. Iterating on direct feedback\n\nWhat is your #1 strategy for SaaS growth? Let's discuss below!"
  );
  const [analysis, setAnalysis] = useState(analyzePostContent(demoContent));
  const [isAnnual, setIsAnnual] = useState(false);

  const handleDemoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDemoContent(text);
    setAnalysis(analyzePostContent(text));
  };

  const features = [
    {
      icon: Cpu,
      title: "AI Post Scorer",
      description: "Analyze hook, authority, readability, emotional impact, and formatting in seconds."
    },
    {
      icon: Activity,
      title: "Engagement Predictor",
      description: "Get predictive metrics for likes, comments, and shares before you hit publish."
    },
    {
      icon: Users,
      title: "Profile Intelligence",
      description: "Get a comprehensive resume audit, LinkedIn SEO optimization suggestions, and job matching metrics."
    },
    {
      icon: Sparkles,
      title: "Hook Generator",
      description: "Stuck on your opener? Generate 50+ viral hooks across curiosity, authority, and contrarian frameworks."
    },
    {
      icon: BarChart3,
      title: "Competitor Comparison",
      description: "Track competitors, find content gaps, and adapt high-performing templates for your niche."
    },
    {
      icon: MessageSquare,
      title: "Growth Calendar",
      description: "Plan and schedule your updates. Access optimal posting times based on target demographics."
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
            AI-Powered LinkedIn Optimization
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-gradient">
            Analyze. Predict. Optimize.<br />Grow on LinkedIn.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            LinkedInIQ AI is the ultimate toolkit for professionals, creators, and marketers seeking to build authority, attract recruiters, and scale engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-base hover:opacity-95 shadow-lg shadow-brand-purple/20 transition-all flex items-center justify-center gap-2"
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
        </div>
      </section>

      {/* Live Demo Widget Section */}
      <section id="demo" className="w-full max-w-5xl px-4 py-16 scroll-mt-16">
        <div className="glass-panel rounded-3xl p-6 md:p-8 glow-border">
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
                rows={10}
                className="w-full p-4 rounded-2xl bg-black/10 dark:bg-white/5 border border-card-border text-sm focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
              />
              <p className="text-xs text-zinc-500 italic">
                Tip: Add line breaks, emojis, a call to action, or write about trending topics like AI or SaaS to watch the score change!
              </p>
            </div>

            {/* Live Output */}
            <div className="w-full lg:w-[350px] space-y-6 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">AI Score Card</h4>
                
                {/* Score Gauge */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-brand-purple/20 bg-brand-purple/5">
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
                        'bg-zinc-500/10 text-zinc-500'
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
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Hook Quality (20%)</span>
                      <span>{analysis.breakdown.hook}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-purple rounded-full" style={{ width: `${analysis.breakdown.hook}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Emotional Impact (15%)</span>
                      <span>{analysis.breakdown.emotional}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-indigo rounded-full" style={{ width: `${analysis.breakdown.emotional}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span>Readability (15%)</span>
                      <span>{analysis.breakdown.readability}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-emerald rounded-full" style={{ width: `${analysis.breakdown.readability}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="mt-6 pt-4 border-t border-card-border">
                <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Key Recommendation</h5>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 bg-black/10 dark:bg-white/5 p-3 rounded-xl border border-card-border/50">
                  {analysis.suggestions[0]}
                </p>
              </div>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
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

          {/* Agency Plan */}
          <div className="glass-panel rounded-2xl p-8 flex flex-col justify-between border-card-border relative">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-xl">Agency</h4>
                <p className="text-xs text-zinc-500 mt-1">For brands, agencies & networks</p>
              </div>
              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold">${isAnnual ? 79 : 99}</span>
                <span className="text-zinc-500 text-xs ml-1">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Multiple client workspaces</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Export PDF/DOCX/PPT reports</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Multi-user team dashboards</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-brand-emerald" /> Automated autopilot suggestions</li>
              </ul>
            </div>
            <Link
              href="/billing?plan=agency"
              className="mt-8 w-full py-3 rounded-xl border border-card-border text-center text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              Get Agency Now
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
