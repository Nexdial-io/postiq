"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  UserCheck, 
  PenTool, 
  Hash, 
  Calendar, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export default function FeaturesPage() {
  const deepFeatures = [
    {
      icon: Cpu,
      title: "AI Post Scorer",
      badge: "Flagship",
      details: "Our scoring engine evaluates your updates in seconds, grading hook strength, emotional impact, readability, Authority signals, CTA clarity, and formatting layouts on a scale of 0 to 100.",
      bullets: ["Pre-flight virality estimations", "Structural visual flow optimization", "Likes & comments prediction models"]
    },
    {
      icon: UserCheck,
      title: "Profile Intelligence",
      badge: "Resume Audit",
      details: "Analyze and optimize your complete LinkedIn profile. Audits headline keyword volume, experience achievements metrics, featured links validation, and calculates recruiter attraction index scores.",
      bullets: ["ATS keyword matching analysis", "Headline variations generator", "Dream job resume gap analytics"]
    },
    {
      icon: PenTool,
      title: "Hook & Rewrite Studio",
      badge: "Creator Suite",
      details: "Stuck on your opener? Generate 50+ viral hooks based on curiosity, contrarian, authority, or storytelling frameworks. Instantly rewrite boring updates into high-performing creator scripts.",
      bullets: ["5 copy tones (Viral, Executive, Story, Professional, Creator)", "Copy-paste with one click", "Pattern-interrupt templates library"]
    },
    {
      icon: Hash,
      title: "Hashtag Intelligence",
      badge: "Discovery",
      details: "Audit hashtag popularity, estimated reach, and difficulty in real time. Generate broad, niche, trending, and industry-specific recommendations for maximum organic distribution.",
      bullets: ["Estimated organic reach index", "Difficulty scale analysis", "Topic clusters mapping"]
    },
    {
      icon: Calendar,
      title: "Content Calendar Planner",
      badge: "Scheduling",
      details: "Plan, schedule, and curate your updates. Drag-and-drop posts into daily, weekly, or monthly slots, and access best-time-to-post recommendations based on historical data.",
      bullets: ["Weekly and monthly scheduling slots", "Suggested topics recommendations", "Best-time posting heatmaps"]
    },
    {
      icon: Users,
      title: "Competitor Intelligence",
      badge: "Benchmarking",
      details: "Enter any profile URL to analyze posting frequency, engagement benchmarks, top topics, growth curves, and discover content gaps. Bridge the gap and adopt high-performance creator systems.",
      bullets: ["Posting consistency audits", "Content gaps discovery", "Engagement benchmark metrics"]
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-indigo/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <Zap size={12} className="fill-brand-purple/20 text-brand-purple" />
            Core Capabilities
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Deep Creator Intelligence
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Discover the tools engineered to elevate your LinkedIn professional branding, optimize reach, and scale engagement.
          </p>
        </div>
      </section>

      {/* Features Grid Details */}
      <section className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {deepFeatures.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div 
              key={index}
              className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden"
            >
              {/* Card background hover glow */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-purple/5 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <Icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple uppercase tracking-wider">
                    {feat.badge}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white">{feat.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{feat.details}</p>
                
                <ul className="space-y-2 border-t border-card-border/50 pt-4 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {feat.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald"></span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA section */}
      <section className="w-full max-w-5xl px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-10 bg-gradient-to-r from-brand-purple/5 to-brand-indigo/5 border-brand-purple/15 flex flex-col items-center space-y-6">
          <ShieldCheck className="text-brand-purple w-12 h-12" />
          <h3 className="text-2xl md:text-3xl font-extrabold">Ready to grow your LinkedIn feed?</h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-lg font-medium">
            Optimize your experience section, evaluate hooks, analyze posts, and attract recruiters today.
          </p>
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-brand-purple/20 transition-all hover:opacity-95"
          >
            Launch Platform Demo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
