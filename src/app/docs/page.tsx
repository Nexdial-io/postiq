"use client";

import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Code, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Activity,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const [activeSec, setActiveSec] = useState<'getting-started' | 'scoring-model' | 'api-integration'>('getting-started');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiSnippet = `curl -X POST "https://api.PostIQ.ai/v1/score" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "How I grew my SaaS to $10k MRR in just 6 months. \\n\\nConsistent daily publishing is the secret...",
    "tone": "creator",
    "hashtags": ["saas", "growth"]
  }'`;

  const apiResponse = `{
  "score": 92,
  "metrics": {
    "virality": "High",
    "reach": 15400,
    "likes": 245,
    "comments": 68
  },
  "breakdown": {
    "hook": 95,
    "emotional": 88,
    "readability": 90
  },
  "suggestions": [
    "Increase spacing between paragraphs.",
    "Add a direct call-to-action question at the end."
  ]
}`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Banner */}
      <section className="relative w-full py-12 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[95px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={12} className="text-brand-purple" />
            Developer Hub
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Platform Documentation
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Guides, scoring model specifications, and API integration tools for PostIQ.
          </p>
        </div>
      </section>

      {/* Nav Tabs & Content Column */}
      <section className="w-full max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Nav Menu (1/4 Width) */}
        <div className="lg:col-span-1 space-y-2.5">
          <div className="glass-panel rounded-2xl p-4 space-y-1.5 font-semibold text-xs border border-card-border/75">
            <button
              onClick={() => setActiveSec('getting-started')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                activeSec === 'getting-started' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Layers size={14} className={activeSec === 'getting-started' ? 'text-brand-purple' : 'text-zinc-400'} />
              Getting Started Guide
            </button>

            <button
              onClick={() => setActiveSec('scoring-model')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                activeSec === 'scoring-model' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Sparkles size={14} className={activeSec === 'scoring-model' ? 'text-brand-purple' : 'text-zinc-400'} />
              AI Scoring Model
            </button>

            <button
              onClick={() => setActiveSec('api-integration')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                activeSec === 'api-integration' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Terminal size={14} className={activeSec === 'api-integration' ? 'text-brand-purple' : 'text-zinc-400'} />
              API Rest Integration
            </button>
          </div>
        </div>

        {/* Right Content Panel (3/4 Width) */}
        <div className="lg:col-span-3">
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 border border-card-border/70 min-h-[450px]">
            
            {/* Getting Started Guide */}
            {activeSec === 'getting-started' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-card-border pb-3">
                  <Layers size={18} className="text-brand-purple" />
                  Getting Started with PostIQ
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Welcome to PostIQ! Our platform is engineered to supercharge your organic growth and authority on LinkedIn. Here is how to configure your account for the first time:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <div className="text-xs">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Run a Profile Strength Audit</h4>
                      <p className="text-zinc-500 mt-1 leading-normal font-medium">Visit the [Profile Intelligence](file:///d:/Linked%20In/frontend-nextjs/src/app/profile-intelligence) page to audit your experiences and headlines. Follow the keyword recommendations to reach an 85+ score.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <div className="text-xs">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Draft and Evaluate Posts</h4>
                      <p className="text-zinc-500 mt-1 leading-normal font-medium">Use the [AI Post Analyzer](file:///d:/Linked%20In/frontend-nextjs/src/app/analyzer) to paste and review draft updates. Modify paragraph spacing and hooks until the analyzer gives you a high engagement grade.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <div className="text-xs">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Schedule Content Calendar</h4>
                      <p className="text-zinc-500 mt-1 leading-normal font-medium">Map out your content strategy using the [Content Calendar](file:///d:/Linked%20In/frontend-nextjs/src/app/calendar). Align postings with the heatmaps recommendations for peak recruiter active hours.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scoring Model Details */}
            {activeSec === 'scoring-model' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-card-border pb-3">
                  <Sparkles size={18} className="text-brand-purple" />
                  Understanding the AI Scoring System
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Our core virality scoring algorithm measures how likely a post is to trigger LinkedIn's organic distribution loops. The overall score is calculated as a weighted average of three core metrics:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-semibold text-center">
                  <div className="p-4 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-2xl font-black text-brand-purple">20%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Hook Opener</h5>
                    <p className="text-[10px] text-zinc-500 font-medium leading-normal">First 2 lines power and visual readability depth.</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-2xl font-black text-brand-emerald">15%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Readability</h5>
                    <p className="text-[10px] text-zinc-500 font-medium leading-normal">Spacing density, bullet structure, and paragraph height.</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-2xl font-black text-brand-indigo">15%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Emotional Power</h5>
                    <p className="text-[10px] text-zinc-500 font-medium leading-normal">Tone index, story dynamics, and professional credibility cues.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-brand-purple/10 bg-brand-purple/[0.01] text-xs text-zinc-500 leading-relaxed">
                  <strong>Algorithm Note:</strong> Adding excessive hashtags (&gt;6) or tags will automatically trigger a penalty, decreasing the formatting score by up to 15 points.
                </div>
              </div>
            )}

            {/* API REST Integration */}
            {activeSec === 'api-integration' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex justify-between items-center border-b border-card-border pb-3">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Terminal size={18} className="text-brand-purple" />
                    REST API Integration
                  </h3>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple uppercase">V1.0 Stable</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Programmatically submit draft posts for score evaluations and recommendation extractions using standard REST endpoints.
                </p>

                {/* HTTP Request snippet */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center font-bold text-zinc-500">
                    <span>cURL Request POST</span>
                    <button 
                      onClick={() => handleCopyCode(apiSnippet)}
                      className="text-[10px] hover:text-brand-purple uppercase flex items-center gap-1"
                    >
                      {copied ? <Check size={12} className="text-brand-emerald" /> : <Code size={12} />}
                      {copied ? 'Copied' : 'Copy cURL'}
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[#09081a] border border-card-border text-brand-indigo font-mono overflow-x-auto whitespace-pre leading-relaxed text-[11px] select-all">
                    {apiSnippet}
                  </pre>
                </div>

                {/* HTTP Response snippet */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-zinc-500">JSON Response</span>
                  <pre className="p-4 rounded-2xl bg-[#09081a] border border-card-border text-brand-emerald font-mono overflow-x-auto whitespace-pre leading-relaxed text-[11px]">
                    {apiResponse}
                  </pre>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>
    </div>
  );
}
