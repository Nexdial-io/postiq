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
  Check,
  HelpCircle,
  History,
  AlertCircle,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const [activeSec, setActiveSec] = useState<'getting-started' | 'feature-guides' | 'scoring-methodology' | 'api-integration' | 'faq' | 'changelog'>('getting-started');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const apiSnippet = `curl -X POST "https://api-sandbox.postiq.ai/v1/score" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "90% of creators fail to grow on LinkedIn because they miss this simple system... \\n\\nConsistent daily publishing is the secret...",
    "tone": "creator",
    "hashtags": ["saas", "growth"]
  }'`;

  const apiResponse = `{
  "score": 92,
  "metrics": {
    "virality": "High (Simulated)",
    "estimatedReach": 15400,
    "simulatedLikes": 245,
    "simulatedComments": 68
  },
  "breakdown": {
    "hookQuality": 95,
    "readability": 90,
    "authorityStatement": 85,
    "emotionalImpact": 88,
    "visualFormatting": 90,
    "ctaStrength": 80,
    "hashtagRelevance": 95,
    "trendIndex": 70
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
            Developer Hub & Guides
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
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeSec === 'getting-started' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Layers size={14} className={activeSec === 'getting-started' ? 'text-brand-purple' : 'text-zinc-400'} />
              Getting Started
            </button>

            <button
              onClick={() => setActiveSec('feature-guides')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeSec === 'feature-guides' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <BookOpen size={14} className={activeSec === 'feature-guides' ? 'text-brand-purple' : 'text-zinc-400'} />
              Feature Guides
            </button>

            <button
              onClick={() => setActiveSec('scoring-methodology')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeSec === 'scoring-methodology' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Sparkles size={14} className={activeSec === 'scoring-methodology' ? 'text-brand-purple' : 'text-zinc-400'} />
              Scoring Methodology
            </button>

            <button
              onClick={() => setActiveSec('api-integration')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeSec === 'api-integration' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Terminal size={14} className={activeSec === 'api-integration' ? 'text-brand-purple' : 'text-zinc-400'} />
              API Rest Integration
            </button>

            <button
              onClick={() => setActiveSec('faq')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeSec === 'faq' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <HelpCircle size={14} className={activeSec === 'faq' ? 'text-brand-purple' : 'text-zinc-400'} />
              FAQ Section
            </button>

            <button
              onClick={() => setActiveSec('changelog')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                activeSec === 'changelog' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <History size={14} className={activeSec === 'changelog' ? 'text-brand-purple' : 'text-zinc-400'} />
              Release Changelog
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
                <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">
                  <p>
                    PostIQ is an AI-powered LinkedIn Growth Operating System designed for professionals, creators, consultants, job seekers, and founders. It unifies creator analytics, profile optimization, trend discovery, and content planning into a single advisory dashboard.
                  </p>
                  <p>
                    By evaluating content and profile metrics against proven engagement patterns, PostIQ helps you make better decisions before publishing, optimizing your personal brand with confidence.
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-3">Who is PostIQ for?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                      <span className="font-bold text-brand-purple">Creators & Consultants</span>
                      <p className="text-zinc-500 font-medium leading-normal mt-0.5">Optimize hook structures, readability margins, and CTA placement to maximize reach.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                      <span className="font-bold text-brand-emerald">Founders & Job Seekers</span>
                      <p className="text-zinc-500 font-medium leading-normal mt-0.5">Audit profile keywords, simulate recruiter search visibility, and align headline structures with target roles.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Step-by-Step Setup</h4>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <div className="text-xs font-semibold">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Run a Profile Strength Audit</h4>
                      <p className="text-zinc-500 mt-1 leading-normal font-medium">
                        Visit the <Link href="/profile-intelligence" className="text-brand-purple hover:underline">Profile Intelligence</Link> workspace. Enter your profile data, review keyword gaps, headline structures, and target an 85+ score.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <div className="text-xs font-semibold">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Draft and Evaluate Posts</h4>
                      <p className="text-zinc-500 mt-1 leading-normal font-medium">
                        Paste drafts in the <Link href="/analyzer" className="text-brand-purple hover:underline">AI Post Analyzer</Link> workspace. Modify hooks, CTA formats, and paragraph layouts to verify score gains in real-time.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <div className="text-xs font-semibold">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Schedule Content Calendar</h4>
                      <p className="text-zinc-500 mt-1 leading-normal font-medium">
                        Plan updates using the <Link href="/calendar" className="text-brand-purple hover:underline">Content Calendar</Link>. Build content plans using the weekly planner and target peak audience heatmaps.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Guides */}
            {activeSec === 'feature-guides' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-card-border pb-3">
                  <BookOpen size={18} className="text-brand-purple" />
                  Product Feature Guides
                </h3>

                {/* AI Post Analyzer */}
                <div className="space-y-2">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-brand-purple" />
                    AI Post Analyzer
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                    Evaluates post drafts against proven engagement models. The engine measures hook strength, paragraph densities, and failure risks (such as early self-promotion or missing stories).
                  </p>
                  <p className="text-[10px] text-zinc-400 italic">
                    Note: Analytics are heuristic estimations of content patterns, and are intended as guidelines to help you optimize drafts before publication.
                  </p>
                </div>

                {/* Profile Intelligence */}
                <div className="space-y-2 pt-2 border-t border-card-border/40">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <User size={14} className="text-brand-purple" />
                    Profile Optimizer & Recruiter Appeal Index
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                    Audits your professional bio, headline structure, and experience logs. The **Recruiter Appeal Index** measures keyword coverage (mapping against high-volume keywords in your niche), profile completeness, and job alignment scores to estimate recruiter discoverability.
                  </p>
                </div>

                {/* Trend Engine */}
                <div className="space-y-2 pt-2 border-t border-card-border/40">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-brand-emerald" />
                    Trend Discovery Opportunity Scores
                  </h4>
                  <div className="text-xs text-zinc-500 leading-relaxed font-semibold space-y-2">
                    <p>Our trend discovery tool scores industry topics using five unique data indicators:</p>
                    <ul className="list-disc list-inside space-y-1 font-semibold pl-1 text-[11px]">
                      <li><strong className="text-zinc-800 dark:text-zinc-200">Opportunity Score:</strong> Evaluates search momentum relative to current content creator density. High scores suggest unsaturated demand.</li>
                      <li><strong className="text-zinc-800 dark:text-zinc-200">Difficulty Score:</strong> Estimates the brand authority levels required to stand out in the topic feed.</li>
                      <li><strong className="text-zinc-800 dark:text-zinc-200">Trend Growth:</strong> Weekly percentage change in simulated topic mentions.</li>
                      <li><strong className="text-zinc-800 dark:text-zinc-200">Trend Lifecycle:</strong> Phase categorizations (Emerging, Growing, Peak, Declining) to plan write-ups.</li>
                      <li><strong className="text-zinc-800 dark:text-zinc-200">Audience Fit:</strong> Calculates simulated alignment with specific professional roles.</li>
                    </ul>
                  </div>
                </div>

                {/* Calendar & Calendar Mix */}
                <div className="space-y-2 pt-2 border-t border-card-border/40">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-indigo" />
                    Content Planner & Scheduling
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                    Maintains posting consistency using a 1-click AI planner. It checks calendar slots for **content mix balance** (e.g. mix of thought leadership, stories, and CTAs) and checks for saturation warnings to avoid viewer fatigue.
                  </p>
                </div>
              </div>
            )}

            {/* Scoring Model Details */}
            {activeSec === 'scoring-methodology' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-card-border pb-3">
                  <Sparkles size={18} className="text-brand-purple" />
                  Scoring Methodology & Weights
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  The post virality indicator evaluates draft structures using eight weighted content metrics. The weights are configured to align with established engagement practices:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-semibold text-center">
                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-brand-purple">20%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Hook Quality</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">First 2 lines readability, attention triggers.</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-brand-emerald">15%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Readability</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">Spacing, paragraph length, sentence flow.</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-brand-indigo">15%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Authority</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">Cues of credentials, experience, proof.</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-brand-amber">15%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Emotional Power</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">Tone balance, narrative hooks, story drive.</p>
                  </div>

                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-zinc-700 dark:text-zinc-300">10%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Formatting</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">Whitespace usage, list structures, breaks.</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-brand-rose">10%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">CTA Strength</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">Question tagging, clear action triggers.</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-teal-600">5%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Hashtags</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">Hashtag counts, content alignment.</p>
                  </div>
                  <div className="p-3 rounded-2xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] space-y-1">
                    <span className="text-xl font-black text-brand-purple">10%</span>
                    <h5 className="text-[10px] text-zinc-800 dark:text-zinc-200 uppercase">Trend Index</h5>
                    <p className="text-[9px] text-zinc-500 font-medium leading-normal mt-0.5">Relevance score against active trends.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-brand-rose/25 bg-brand-rose/[0.02] text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                  <AlertCircle size={16} className="text-brand-rose shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong>Algorithmic Penalties:</strong>
                    <p className="text-[11px] font-medium leading-relaxed">
                      Including excessive hashtags (&gt;6) or product links in the early hook will trigger formatting penalties, reducing your formatting subscore by up to 15 points.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-4 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.02] text-xs text-zinc-600 dark:text-zinc-400 font-semibold">
                  <AlertCircle size={16} className="text-brand-purple shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong>Trademark & Advisory Disclaimer:</strong>
                    <p className="text-[11px] font-medium leading-relaxed">
                      PostIQ's scoring framework estimates content optimization potential based on engagement-oriented content patterns. Scores are advisory, serve as educational guidelines, and do not guarantee actual reach, impressions, or engagement. PostIQ is an independent platform and is not affiliated with or endorsed by LinkedIn Corporation.
                    </p>
                  </div>
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
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-brand-purple/10 text-brand-purple uppercase">Coming Soon (Private Beta)</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                  Programmatically submit draft posts for score evaluations and recommendation extractions using standard REST endpoints. 
                  <strong className="text-brand-purple block mt-1">Note: This API is currently under construction and available for preview integration.</strong>
                </p>

                {/* HTTP Request snippet */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center font-bold text-zinc-500">
                    <span>cURL Request POST (Sandbox Endpoint)</span>
                    <button 
                      onClick={() => handleCopyCode(apiSnippet)}
                      className="text-[10px] hover:text-brand-purple uppercase flex items-center gap-1 cursor-pointer"
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
                  <span className="font-bold text-zinc-500">JSON Sandbox Response</span>
                  <pre className="p-4 rounded-2xl bg-[#09081a] border border-card-border text-brand-emerald font-mono overflow-x-auto whitespace-pre leading-relaxed text-[11px]">
                    {apiResponse}
                  </pre>
                </div>
              </div>
            )}

            {/* FAQ Section */}
            {activeSec === 'faq' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-card-border pb-3">
                  <HelpCircle size={18} className="text-brand-purple" />
                  Frequently Asked Questions
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">How accurate are engagement predictions?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                      Predictions are generated using heuristic scoring models and should be considered directional estimates rather than guarantees. Actual performance depends on LinkedIn's dynamic distribution loops, posting time, and real-time audience behavior.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-card-border/40">
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">Why did my score decrease?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                      Changes in hook structure, CTA quality, readability, and formatting can affect overall optimization scores. For example, adding excessive hashtags (&gt;6) or product links in the hook will trigger a penalty.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-card-border/40">
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">Does PostIQ connect directly to LinkedIn?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                      No. PostIQ is an independent analytics platform and is not affiliated with or endorsed by LinkedIn Corporation. We do not use web scrapers or automate actions on LinkedIn to ensure compliance.
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-card-border/40">
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">Are these profiles real?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                      Profile scores, keyword audits, and network stats are simulation matrices intended for training and planning. No user credentials or actual profiles are modified.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Changelog */}
            {activeSec === 'changelog' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2 border-b border-card-border pb-3">
                  <History size={18} className="text-brand-purple" />
                  Product Release Changelog
                </h3>

                <div className="space-y-6">
                  {/* v1.2.0 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">v1.2.0 (Stable Release)</span>
                      <span className="text-[10px] text-zinc-400 font-medium">June 2026</span>
                    </div>
                    <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside font-semibold leading-relaxed">
                      <li>Added **Scroll Stopper Analyzer** to checklist hooks before publication.</li>
                      <li>Added **Audience Affinity Match** to target specific user groups.</li>
                      <li>Added **Missing Elements Detection** to suggest story and proof prompts.</li>
                    </ul>
                  </div>

                  {/* v1.1.0 */}
                  <div className="space-y-2 pt-4 border-t border-card-border/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">v1.1.0</span>
                      <span className="text-[10px] text-zinc-400 font-medium">April 2026</span>
                    </div>
                    <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside font-semibold leading-relaxed">
                      <li>Integrated **Hook Comparison Engine** for side-by-side A/B testing.</li>
                      <li>Introduced **LinkedIn SEO Audit Heatmap** for profile keyword densities.</li>
                      <li>Added custom Unicode formatting tools to the post analyzer workspace.</li>
                    </ul>
                  </div>

                  {/* v1.0.0 */}
                  <div className="space-y-2 pt-4 border-t border-card-border/40">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">v1.0.0 (Initial Beta)</span>
                      <span className="text-[10px] text-zinc-400 font-medium">January 2026</span>
                    </div>
                    <ul className="text-xs text-zinc-500 space-y-1 list-disc list-inside font-semibold leading-relaxed">
                      <li>Launched core post-evaluation scoring engine.</li>
                      <li>Enabled profile keywords audit and headlines optimizer rewrite engine.</li>
                      <li>Introduced content mix calendar and connection network tracker dashboard.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>
    </div>
  );
}
