"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Globe, 
  Cpu, 
  Heart, 
  Code2, 
  User, 
  Target 
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Section */}
      <section className="relative w-full py-16 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none pulse-glow-purple"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <Target size={12} className="text-brand-purple" />
            Our Vision & Story
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Empowering the Next Generation<br />of LinkedIn Creators
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            PostIQ was born out of a simple idea: creator analytics and AI intelligence should be unified, premium, and accessible.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
        
        {/* Story & Philosophy Section (2/3 Width) */}
        <div className="lg:col-span-2 space-y-8 flex flex-col justify-between">
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b border-card-border/50 pb-4">
              <Cpu size={22} className="text-brand-purple" />
              The Platform Philosophy
            </h2>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Most LinkedIn growth strategies rely on guesswork. Creators write blindly, hoping a hook works, while job seekers construct headlines hoping they match recruiter searches.
            </p>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              PostIQ shifts the paradigm by introducing **data-driven creator intelligence**. We evaluate posts against proven psychological virality models, analyze emotional sentiment, structure readability, and calculate real-time recruiter attraction index scores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-purple">Predictive Scoring</h4>
                <p className="text-xs text-zinc-500 font-medium">Evaluate hook power, CTA efficiency, structural layout, and get reach estimations before hitting publish.</p>
              </div>
              <div className="p-4 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-brand-emerald">ATS & Keyword Auditing</h4>
                <p className="text-xs text-zinc-500 font-medium">Ensure your professional bio, experience achievements, and headline are fully optimized for hiring managers.</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="glass-panel rounded-3xl p-6 bg-gradient-to-r from-brand-purple/5 to-brand-indigo/5 border-brand-purple/10 flex justify-around items-center text-center gap-4 py-8">
            <div>
              <span className="text-3xl font-extrabold text-brand-purple block">98%</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Analysis Accuracy</span>
            </div>
            <div className="w-px h-10 bg-card-border"></div>
            <div>
              <span className="text-3xl font-extrabold text-brand-indigo block">50k+</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Hooks Generated</span>
            </div>
            <div className="w-px h-10 bg-card-border"></div>
            <div>
              <span className="text-3xl font-extrabold text-brand-emerald block">4.9/5</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Creator Rating</span>
            </div>
          </div>
        </div>

        {/* Creator Bio Section (1/3 Width) - Premium Card */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full border-brand-purple/20 glow-purple relative overflow-hidden bg-gradient-to-b from-brand-purple/[0.04] to-transparent">
            {/* Header backdrop */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-purple/10 blur-[40px] pointer-events-none"></div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-2 border-b border-card-border/50 pb-4">
                <User size={20} className="text-brand-purple" />
                <h3 className="font-bold text-base">Meet the Architect</h3>
              </div>

              {/* Creator Mock Avatar */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-purple to-brand-indigo p-1 shadow-xl shadow-brand-purple/25 overflow-hidden flex items-center justify-center">
                  <img src="/author.png" alt="Datta Sable" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-lg text-zinc-900 dark:text-white">Datta Sable</h4>
                  <span className="text-xs text-brand-purple font-bold">Creator & Lead Architect</span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium text-center">
                Datta Sable is a full-stack engineer and AI specialist passionate about building high-fidelity creator tools and SaaS products.
              </p>

              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between p-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.01]">
                  <span className="text-zinc-500">Role:</span>
                  <span>Founder / Engineer</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-xl border border-card-border bg-black/[0.02] dark:bg-white/[0.01]">
                  <span className="text-zinc-500">Core Focus:</span>
                  <span>AI Agent Integrations</span>
                </div>
              </div>
            </div>

            {/* Premium Link & Socials */}
            <div className="space-y-4 pt-6 border-t border-card-border/50 relative z-10">
              <a 
                href="https://dattasable.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand-purple/15 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
              >
                <Globe size={13} />
                Visit dattasable.com
                <ExternalLink size={11} className="stroke-[2.5px]" />
              </a>

              {/* Social icons row */}
              <div className="flex items-center justify-center gap-4 text-zinc-400">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-purple transition-all" title="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-purple transition-all" title="GitHub">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-purple transition-all" title="Twitter">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Philosophy Call-out */}
      <section className="w-full max-w-5xl px-4 py-12 text-center">
        <div className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-brand-purple/5 to-brand-emerald/5 border-card-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1 max-w-xl">
            <h3 className="font-bold text-lg">Inspired to optimize your LinkedIn presence?</h3>
            <p className="text-xs text-zinc-500 font-medium">Build a powerful profile, analyze your next post draft, and connect with dream companies today.</p>
          </div>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-purple/20 transition-all hover:opacity-95 shrink-0"
          >
            Launch Platform Demo
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
