"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  PenTool, 
  Sparkles, 
  HelpCircle, 
  RotateCw, 
  Copy, 
  Check, 
  Flame, 
  BrainCircuit, 
  Compass, 
  Wand2,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  BarChart,
  FileText,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';
import { analyzePostContent } from '@/lib/scoringEngine';

const SWIPE_FILES = [
  { category: "SaaS", hook: "90% of B2B SaaS startups fail at growth because they overlook this one simple system:", source: "Alex Rivera", virality: "94%", score: 92, curiosity: 95, authority: 88, emotion: 91 },
  { category: "SaaS", hook: "The most expensive mistake in B2B SaaS is building features before establishing distribution.", source: "Marcus Vance", virality: "91%", score: 89, curiosity: 90, authority: 92, emotion: 85 },
  { category: "AI", hook: "AI isn't replacing developers. Developers who master prompt workflows are replacing developers who don't.", source: "Sarah Chen", virality: "96%", score: 95, curiosity: 98, authority: 90, emotion: 95 },
  { category: "AI", hook: "I spent 40+ hours testing AI agents last week. Here are the 3 workflows that actually save time:", source: "Datta Sable", virality: "95%", score: 94, curiosity: 96, authority: 94, emotion: 90 },
  { category: "Founders", hook: "I've spent 8+ years building products, and this is the biggest mistake I see teams make: 🧵", source: "Alex Rivera", virality: "88%", score: 87, curiosity: 92, authority: 89, emotion: 80 },
  { category: "Founders", hook: "If you want to build a $10M company, you must stop doing these 5 things today:", source: "Founder Daily", virality: "92%", score: 91, curiosity: 94, authority: 90, emotion: 89 },
  { category: "Product", hook: "Unpopular opinion: writing tickets is only 10% of a Product Manager's job.", source: "Alex Rivera", virality: "89%", score: 88, curiosity: 95, authority: 82, emotion: 86 },
  { category: "Product", hook: "How we grew our active users by 40% in less than 6 months (the exact breakdown):", source: "Growth Hub", virality: "93%", score: 92, curiosity: 90, authority: 95, emotion: 90 },
  { category: "Recruiters", hook: "Recruiters are ignoring your LinkedIn profile because you are missing these 3 keywords:", source: "Elena Rostova", virality: "87%", score: 86, curiosity: 91, authority: 80, emotion: 88 },
  { category: "Creators", hook: "LinkedIn is shifting. Authentic, metric-backed stories are beating AI templates every single day.", source: "Creator Academy", virality: "90%", score: 89, curiosity: 93, authority: 85, emotion: 90 }
];

function HookStudioContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'generator' | 'comparison' | 'swipefile' | 'rewriter'>('generator');
  
  // Hook Generator State
  const [topic, setTopic] = useState("AI Agents in SaaS");
  const [generatedHooks, setGeneratedHooks] = useState<any>(null);
  const [selectedHook, setSelectedHook] = useState<string | null>(null);
  
  // Hook Comparison Engine States
  const [optionA, setOptionA] = useState("Unpopular opinion: writing tickets is only 10% of a Product Manager's job.");
  const [optionB, setOptionB] = useState("I've spent 8+ years building products, and this is the biggest mistake I see teams make: 🧵");
  const [comparisonResult, setComparisonResult] = useState<any>(null);

  // Content Generation States
  const [genType, setGenType] = useState<'post' | 'carousel' | 'poll' | null>(null);
  const [genOutput, setGenOutput] = useState<any>(null);
  const [generatingContent, setGeneratingContent] = useState(false);

  // Swipe file active category
  const [swipeCategory, setSwipeCategory] = useState<string>("All");

  // Rewriter State
  const [draft, setDraft] = useState(
    "I want to share my thoughts on working in tech. It's really hard. You have to learn new things constantly. Sometimes it feels like you're falling behind. But if you keep going, you can get great results. Let me know what you think."
  );
  const [rewrittenContent, setRewrittenContent] = useState<any>(null);
  const [selectedTone, setSelectedTone] = useState<'viral' | 'professional' | 'executive' | 'story' | 'creator'>('viral');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    const topicParam = searchParams.get('topic');
    if (topicParam) {
      setTopic(topicParam);
      setActiveTab('generator');
      handleGenerateHooks(topicParam);
    }
  }, [searchParams]);

  const handleGenerateHooks = (t: string) => {
    const activeTopic = t || topic;
    if (!activeTopic.trim()) return;

    const key = activeTopic.trim();
    
    // 8 Categories: Curiosity, Authority, Contrarian, Story, Question, Statistic, Founder, Fear
    const categories = {
      curiosity: {
        hook: `90% of professionals fail to scale their strategy in ${key}. Here is the one shift that changes everything:`,
        score: 95, curiosity: 98, authority: 82, emotion: 88,
        why: "Curiosity gap sparks reader interest by hiding the direct resolution.",
        how: "Open with a dramatic percentage, then hint at 'one shift' or 'framework'.",
        impact: "+14% reach CTR"
      },
      authority: {
        hook: `After 8 years of engineering growth systems, this is my blueprint for scaling ${key}:`,
        score: 91, curiosity: 82, authority: 98, emotion: 80,
        why: "Immediate credibility claim reduces skepticism and builds direct trust.",
        how: "State duration, role target, and name your custom methodology ('blueprint').",
        impact: "+22% follow-through conversion rate"
      },
      contrarian: {
        hook: `Unpopular opinion: Stop trying to learn ${key} the traditional way. It's a complete waste of time.`,
        score: 89, curiosity: 92, authority: 85, emotion: 91,
        why: "Disrupts the feed scanning behavior by attacking conventional wisdom.",
        how: "Use strong phrasing ('waste of time') to trigger immediate attention.",
        impact: "+18% comment engagement"
      },
      story: {
        hook: `Last year, I hit rock bottom trying to scale ${key}. I was ready to quit. Then, I changed one thing.`,
        score: 93, curiosity: 95, authority: 80, emotion: 96,
        why: "Emotional hooks engage readers deeply through empathetic narrative design.",
        how: "Share a vulnerability ('rock bottom') before presenting the resolution.",
        impact: "+30% viral sharing index"
      },
      question: {
        hook: `Are you still relying on outdated models to scale your ${key}? Here is why they are holding you back:`,
        score: 84, curiosity: 90, authority: 75, emotion: 82,
        why: "Engages reader by prompting a self-assessment or feedback loop.",
        how: "Ask a direct question highlighting an active pain point.",
        impact: "+12% profile click-through rate"
      },
      statistic: {
        hook: `We analyzed 500+ projects in ${key}. The results shocked us: 78% failed due to this single error:`,
        score: 92, curiosity: 93, authority: 95, emotion: 84,
        why: "Numeric proofs establish instant analytical authority.",
        how: "Lead with a case sample size ('500+ projects') and an extreme outcome ('78% failed').",
        impact: "+25% reach expansion"
      },
      founder: {
        hook: `I spent 8+ years building startups in ${key}. Here is the biggest bottleneck we encountered:`,
        score: 88, curiosity: 88, authority: 96, emotion: 85,
        why: "Targets founders and VCs through shared operational challenges.",
        how: "Leverage startup-specific vocabulary ('startups', 'bottleneck', 'seed').",
        impact: "+18% Est. SSI Authority Score"
      },
      fear: {
        hook: `If you don't integrate AI into your ${key} workflow this week, your competitors will bypass you entirely:`,
        score: 86, curiosity: 92, authority: 82, emotion: 94,
        why: "Leverages FOMO/fear of obsolescence to drive clicks.",
        how: "Outline a clear threat of falling behind to induce urgent reading.",
        impact: "+15% direct message outreach"
      }
    };

    setGeneratedHooks(categories);
    setSelectedHook(null);
    setGenOutput(null);
    setGenType(null);
  };

  const handleCompareHooks = () => {
    if (!optionA.trim() || !optionB.trim()) return;

    // Simulate analysis parameters
    const analysisA = {
      score: 82,
      reach: 8000,
      curiosity: 85,
      authority: 80,
      emotion: 75,
      verdict: "Solid hook. Predicts good reach but lacks contrarian elements to hook scrolling users.",
      why: "Contains standard keywords but length exceeds ideal 90 characters.",
      how: "Bold the first 5 words or add a specific number.",
      impact: "+10% engagement potential"
    };

    const analysisB = {
      score: 94,
      reach: 12000,
      curiosity: 96,
      authority: 92,
      emotion: 90,
      verdict: "Highly optimized hook. Uses thread emoji and numbers to create a Curiosity Gap.",
      why: "Includes contrarian triggers ('biggest mistake') and specific duration ('8+ years').",
      how: "Use as-is. Schedule during peak Tuesday or Thursday windows.",
      impact: "+40% reach expansion"
    };

    setComparisonResult({ a: analysisA, b: analysisB });
  };

  const handleGenerateContent = (hookText: string, type: 'post' | 'carousel' | 'poll') => {
    setGenType(type);
    setSelectedHook(hookText);
    setGeneratingContent(true);

    setTimeout(() => {
      let output = {};
      const topicText = topic || "this topic";

      if (type === 'post') {
        output = {
          body: `${hookText}\n\nHere is the exact framework we deployed to address this challenge:\n\n1. Analyze the core bottlenecks: Map out current workflows and identify redundancies.\n2. Leverage automated pipelines: Reduce human hand-off steps by up to 50%.\n3. Implement continuous A/B testing: Never assume, always test your theories.\n\nBy restructuring these nodes, we unlocked high efficiency gains.\n\nWhat is your perspective on this? Let me know below! 👇`,
          why: "The post body follows the Hook-Value-CTA framework for maximum readability.",
          how: "Copy this draft and schedule it on your calendar page.",
          impact: "+12% CTR boost"
        };
      } else if (type === 'carousel') {
        output = {
          slides: [
            { title: "Slide 1: Hook Intro", desc: hookText },
            { title: "Slide 2: The Core Conflict", desc: "Why traditional models crash under scale. (Highlighting inefficiency, low metrics)" },
            { title: "Slide 3: Step 1 Solution", desc: "Isolate high-cost nodes. Standardize automation frameworks first." },
            { title: "Slide 4: Step 2 Solution", desc: "Introduce AI recommendations pipelines. Run continuous optimization loops." },
            { title: "Slide 5: Expected Impact", desc: "Unlock 40%+ conversions and double your active reader reach metrics." },
            { title: "Slide 6: Final CTA", desc: "Agree? Repost to help others, and share your takes in the comments! ♻️" }
          ],
          why: "Carousels drive 3x more LinkedIn impressions by keeping users on the screen longer.",
          how: "Export each slide text or save this template to generate a PDF presentation.",
          impact: "+30% reach boost"
        };
      } else {
        output = {
          pollQuestion: "What is your biggest bottleneck in this process?",
          options: [
            "Lacking clear strategy",
            "Slow tooling pipelines",
            "Scaling audience reach",
            "Hiring specialized talents"
          ],
          body: `${hookText}\n\nI talk with teams every day and they all struggle with scaling. But the exact bottleneck depends on your model.\n\nLet's run a quick assessment.\n\nVote in the poll below and let's discuss details! 👇`,
          why: "Polls trigger high engagement rates because users only need one click to participate.",
          how: "Set the poll duration to 7 days to maximize algorithmic exposure.",
          impact: "+45% comment rates"
        };
      }

      setGenOutput(output);
      setGeneratingContent(false);
    }, 800);
  };

  const handleRewrite = () => {
    if (!draft.trim()) return;

    const rewrites = {
      viral: `The tech industry is moving faster than ever. If you aren't adapting, you're falling behind. 🚀\n\nIt feels exhausting. The constant learning. The imposter syndrome.\n\nBut here's the truth:\n\nConsistency is the only competitive advantage.\n\nWhat's your biggest struggle in tech right now? Let's discuss in the comments! 💬`,
      professional: `Navigating a career in technology requires continuous learning and resilience. While the rapid pace of change can be challenging, maintaining a consistent growth mindset yields substantial professional advancement. \n\nI would be interested in hearing how others manage professional development in this dynamic environment.`,
      executive: `Continuous professional development is a strategic imperative in today's tech landscape. Success hinges on a team's adaptability and commitment to persistent learning.\n\nHow is your organization structuring upskilling initiatives this year?`,
      story: `Five years ago, I almost quit tech. The pacing felt impossible. Every week there was a new framework to learn, and I felt like a fraud.\n\nBut then I realized: nobody has it all figured out.\n\nOnce I embraced continuous learning as part of the job description, everything changed. Strategy beats speed every single time.`,
      creator: `Tech is hard. Real hard.\n\nMost people see the promotions and SaaS growth metrics.\nThey don't see the burnout and imposter syndrome.\n\nMy 3 rules to stay sane:\n1. Limit tutorial loops\n2. Build real projects\n3. Rest is a feature, not a bug.\n\nRepost ♻️ if you needed this today.`
    };

    setRewrittenContent(rewrites);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 3000);
  };

  const filteredSwipeFiles = swipeCategory === "All" 
    ? SWIPE_FILES 
    : SWIPE_FILES.filter(s => s.category === swipeCategory);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Hook & Content Generation Studio</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Generate high-performance hooks, compare alternative options, or utilize proven templates to build posts, carousels, and polls.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-card-border gap-2 pb-px overflow-x-auto">
        {[
          { id: 'generator', label: 'AI Hook Generator' },
          { id: 'comparison', label: 'Hook Comparison Engine' },
          { id: 'swipefile', label: 'Swipe File Library' },
          { id: 'rewriter', label: 'Viral Post Rewriter' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS CONTAINER */}
      <div>
        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Topic input */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-1.5">
                  <BrainCircuit size={16} className="text-brand-purple" />
                  Define Hook Topic
                </h3>
                
                <div>
                  <label className="text-xs font-bold text-zinc-500 block mb-1">Target Subject / Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. B2B SaaS marketing growth"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple font-semibold"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateHooks("")}
                  />
                </div>

                <button
                  onClick={() => handleGenerateHooks("")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Wand2 size={14} />
                  Generate Hooks
                </button>
              </div>
            </div>

            {/* Right Column: Output Categories */}
            <div className="lg:col-span-2 space-y-6">
              {!generatedHooks ? (
                <div className="glass-panel rounded-xl p-8 py-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22] h-full">
                  <Compass size={36} className="text-zinc-400 mb-3" />
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Generate Hooks</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">
                    Type a topic on the left and hit generate to access high-performance hook frameworks.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Visual Overview */}
                  <div className="glass-panel rounded-xl p-4 border border-card-border/70 flex items-center gap-3">
                    <Sparkles size={16} className="text-brand-purple shrink-0" />
                    <p className="text-[10px] font-semibold text-zinc-500 leading-normal">
                      Generated hooks span 8 core creator psychology models. Select any hook below to trigger the 1-click **Full Content Generation Pipeline**.
                    </p>
                  </div>

                  {Object.entries(generatedHooks).map(([catKey, data]: [string, any]) => (
                    <div key={catKey} className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4">
                      
                      {/* Header with Hook Score */}
                      <div className="flex justify-between items-center border-b border-card-border/50 pb-2">
                        <div className="flex items-center gap-2">
                          <Flame size={14} className="text-brand-purple shrink-0" />
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                            {catKey} Framework
                          </h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-zinc-400">Curiosity: {data.curiosity} | Auth: {data.authority} | Emotion: {data.emotion}</span>
                          <span className="text-[10px] font-black text-brand-purple bg-brand-purple/10 border border-brand-purple/20 px-2 py-0.5 rounded shrink-0">
                            Score: {data.score}/100
                          </span>
                        </div>
                      </div>

                      {/* Hook Quote */}
                      <div className="p-3.5 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] relative group">
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed pr-8">
                          "{data.hook}"
                        </p>
                        <button
                          onClick={() => handleCopy(data.hook, `gen-${catKey}`)}
                          className={`absolute top-3.5 right-3.5 p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all ${
                            copySuccess === `gen-${catKey}` ? 'text-brand-emerald' : 'text-zinc-400'
                          }`}
                        >
                          {copySuccess === `gen-${catKey}` ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>

                      {/* Generation pipeline buttons */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <button
                          onClick={() => handleGenerateContent(data.hook, 'post')}
                          className="px-2.5 py-1.5 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] flex items-center gap-1 cursor-pointer"
                        >
                          <FileText size={11} className="text-brand-purple" />
                          Generate Post
                        </button>
                        <button
                          onClick={() => handleGenerateContent(data.hook, 'carousel')}
                          className="px-2.5 py-1.5 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] flex items-center gap-1 cursor-pointer"
                        >
                          <Layers size={11} className="text-brand-indigo" />
                          Generate Carousel
                        </button>
                        <button
                          onClick={() => handleGenerateContent(data.hook, 'poll')}
                          className="px-2.5 py-1.5 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold text-zinc-700 dark:text-zinc-350 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] flex items-center gap-1 cursor-pointer"
                        >
                          <BarChart size={11} className="text-brand-emerald" />
                          Generate Poll
                        </button>
                      </div>

                      {/* Why? How? Impact? */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3.5 border-t border-card-border/40 text-[9px] leading-relaxed font-semibold text-zinc-550">
                        <div>
                          <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why?</strong>
                          {data.why}
                        </div>
                        <div>
                          <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How?</strong>
                          {data.how}
                        </div>
                        <div>
                          <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Impact?</strong>
                          <span className="text-brand-emerald font-black block">{data.impact}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HOOK COMPARISON ENGINE TAB */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Options */}
            <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
              <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-1.5">
                <BarChart size={16} className="text-brand-purple animate-pulse" />
                Hook A/B Reach Prediction
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Option A Hook</label>
                  <textarea
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple resize-none font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-500">Option B Hook</label>
                  <textarea
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    rows={3}
                    className="w-full p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple resize-none font-semibold"
                  />
                </div>
              </div>

              <button
                onClick={handleCompareHooks}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-xs font-bold hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-purple/10"
              >
                Compare Hook Performance
              </button>
            </div>

            {/* Comparison Output */}
            <div className="lg:col-span-1">
              {!comparisonResult ? (
                <div className="glass-panel rounded-xl p-8 py-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22] h-full">
                  <BarChart size={36} className="text-zinc-400 mb-3" />
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200">A/B Reach Predictions</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[250px] mx-auto">
                    Type both hook options on the left and hit compare to output predicted audience engagement reach metrics.
                  </p>
                </div>
              ) : (
                <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
                  <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                    <h3 className="font-bold text-base">Reach Simulation Output</h3>
                    <span className="text-[9px] font-black uppercase bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded">
                      Model confidence: High
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Option A Result */}
                    <div className="p-4 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-500 uppercase">Option A</span>
                        <span className="text-[10px] font-black text-zinc-700">{comparisonResult.a.score}/100</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-zinc-400 block uppercase">Expected Reach</span>
                        <strong className="text-xl font-black text-zinc-700 dark:text-zinc-350">
                          {comparisonResult.a.reach.toLocaleString()}
                        </strong>
                      </div>
                      <div className="text-[9px] font-bold text-zinc-450 dark:text-zinc-450 border-t border-card-border/40 pt-2 leading-relaxed">
                        {comparisonResult.a.verdict}
                      </div>
                    </div>

                    {/* Option B Result */}
                    <div className="p-4 rounded-xl border border-brand-purple/20 bg-brand-purple/[0.02] space-y-3 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-12 h-12 bg-brand-purple/5 rounded-full blur-xl pointer-events-none"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-brand-purple uppercase">Option B</span>
                        <span className="text-[10px] font-black text-brand-purple">{comparisonResult.b.score}/100</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-brand-purple/80 block uppercase">Expected Reach</span>
                        <strong className="text-xl font-black text-brand-purple">
                          {comparisonResult.b.reach.toLocaleString()}
                        </strong>
                      </div>
                      <div className="text-[9px] font-bold text-zinc-450 dark:text-zinc-450 border-t border-card-border/40 pt-2 leading-relaxed">
                        {comparisonResult.b.verdict}
                      </div>
                    </div>
                  </div>

                  {/* Deep Analysis & Delta */}
                  <div className="pt-2.5 border-t border-card-border/50 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                      <span>Reach Difference:</span>
                      <span className="text-brand-emerald font-black">
                        +{ (comparisonResult.b.reach - comparisonResult.a.reach).toLocaleString() } views (+50%)
                      </span>
                    </div>

                    {/* Why? How? Impact? */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3.5 border-t border-card-border/40 text-[9px] leading-relaxed font-semibold text-zinc-550">
                      <div>
                        <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why the delta?</strong>
                        Option B triggers Curiosity and lists credentials ('8+ years') compared to Option A's generic statement.
                      </div>
                      <div>
                        <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How to optimize A?</strong>
                        {comparisonResult.a.how}
                      </div>
                      <div>
                        <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Impact?</strong>
                        <span className="text-brand-emerald font-black block">{comparisonResult.b.impact}</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {/* SWIPE FILE LIBRARY TAB */}
        {activeTab === 'swipefile' && (
          <div className="space-y-6">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              {["All", "SaaS", "AI", "Founders", "Product", "Recruiters", "Creators"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSwipeCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                    swipeCategory === cat 
                      ? 'bg-brand-purple text-white border-brand-purple shadow-sm' 
                      : 'bg-black/5 dark:bg-white/5 border-card-border hover:bg-black/10 text-zinc-650'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Swipe file grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSwipeFiles.map((swipe, idx) => (
                <div key={idx} className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4">
                  <div className="flex justify-between items-center border-b border-card-border/50 pb-2">
                    <span className="text-[8px] font-black uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded">
                      {swipe.category} Niche
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-500 font-semibold">Creator: {swipe.source}</span>
                      <span className="text-[10px] font-black text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded">
                        Virality: {swipe.virality}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    "{swipe.hook}"
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-card-border/40">
                    <button
                      onClick={() => handleCopy(swipe.hook, `swipe-${idx}`)}
                      className={`px-2 py-1 rounded border text-[10px] font-bold flex items-center gap-1 transition-all ${
                        copySuccess === `swipe-${idx}` ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' : 'border-card-border bg-black/5 dark:bg-white/5 text-zinc-650'
                      }`}
                    >
                      {copySuccess === `swipe-${idx}` ? <Check size={11} /> : <Copy size={11} />}
                      <span>Copy Template</span>
                    </button>
                    <button
                      onClick={() => handleGenerateContent(swipe.hook, 'post')}
                      className="px-2 py-1 rounded border border-card-border bg-brand-purple/10 text-brand-purple text-[10px] font-bold hover:bg-brand-purple/20 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={11} />
                      Use in Generator
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIRAL POST REWRITER TAB */}
        {activeTab === 'rewriter' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Box */}
            <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
              <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-1.5">
                <PenTool size={16} className="text-brand-purple" />
                Original Post Draft
              </h3>
              
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Paste the post you want to rewrite..."
                rows={10}
                className="w-full p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple resize-none font-sans"
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-zinc-500 font-semibold">{draft.split(/\s+/).filter(Boolean).length} words</span>
                <button
                  onClick={handleRewrite}
                  disabled={!draft.trim()}
                  className="px-5 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer shadow-md shadow-brand-purple/15"
                >
                  <RotateCw size={13} />
                  Rewrite Draft
                </button>
              </div>
            </div>

            {/* Rewritten Output */}
            <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border/50 pb-3">
                <h3 className="font-bold text-base">Rewritten Versions</h3>
                
                {/* Tone Selectors */}
                <div className="flex p-0.5 rounded-lg bg-[#eef3f8] dark:bg-[#383f47] border border-card-border gap-1 overflow-x-auto w-full sm:w-auto">
                  {(['viral', 'professional', 'executive', 'story', 'creator'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-2 py-1 rounded-md text-[9px] font-extrabold uppercase transition-all whitespace-nowrap ${
                        selectedTone === tone ? 'bg-brand-purple text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {!rewrittenContent ? (
                <div className="py-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22] rounded-xl h-64">
                  <Sparkles size={32} className="text-zinc-400 mb-2" />
                  <span className="text-xs text-zinc-500 font-bold">Click rewrite to view output options</span>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-card-border/70 bg-[#f8f9fa] dark:bg-[#141b22] relative space-y-4">
                  <div className="flex justify-between items-center border-b border-card-border/30 pb-2">
                    <span className="text-[9px] font-extrabold bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded uppercase">
                      {selectedTone} tone
                    </span>
                    
                    <button
                      onClick={() => handleCopy(rewrittenContent[selectedTone], 'rewrite-copy')}
                      className={`p-1.5 rounded hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all flex items-center gap-1 text-[10px] font-bold ${
                        copySuccess === 'rewrite-copy' ? 'text-brand-emerald' : 'text-zinc-400'
                      }`}
                    >
                      {copySuccess === 'rewrite-copy' ? <Check size={12} /> : <Copy size={12} />}
                      Copy Version
                    </button>
                  </div>
                  
                  <p className="text-xs text-zinc-650 dark:text-zinc-350 font-semibold leading-relaxed whitespace-pre-wrap">
                    {rewrittenContent[selectedTone]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RENDER DRAFT OUTPUT PIPELINE IF ACTIVE */}
      {selectedHook && genType && genOutput && (
        <div className="glass-panel rounded-2xl p-6 border border-brand-purple/20 bg-gradient-to-br from-brand-purple/[0.03] to-transparent space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-250">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-center border-b border-card-border/50 pb-4">
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Sparkles className="text-brand-purple" size={18} />
                Full Pipeline Content Output
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                Generated from hook: <span className="italic">"{selectedHook.substring(0, 50)}..."</span>
              </p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2.5 py-1 rounded">
              {genType} Mode
            </span>
          </div>

          {/* Render output details depending on type */}
          {genType === 'post' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] relative">
                <button
                  onClick={() => handleCopy(genOutput.body, 'pipeline-post')}
                  className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                    copySuccess === 'pipeline-post' ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' : 'border-card-border bg-black/5 dark:bg-white/5 text-zinc-650'
                  }`}
                >
                  {copySuccess === 'pipeline-post' ? <Check size={11} /> : <Copy size={11} />}
                  <span>Copy Post</span>
                </button>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed whitespace-pre-wrap max-w-[90%]">
                  {genOutput.body}
                </p>
              </div>
            </div>
          )}

          {genType === 'carousel' && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Generated Slide Deck Deck Templates</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {genOutput.slides.map((slide: any, sIdx: number) => (
                  <div key={sIdx} className="p-3.5 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2">
                    <span className="text-[9px] font-black text-brand-purple uppercase">{slide.title}</span>
                    <p className="text-[10px] font-semibold text-zinc-650 dark:text-zinc-400 leading-normal">
                      {slide.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {genType === 'poll' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Poll Details */}
              <div className="p-4 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-3">
                <span className="text-[9px] font-black text-brand-purple uppercase">LinkedIn Poll Parameters</span>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 block">Question</span>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">"{genOutput.pollQuestion}"</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-500 block mb-1">Voting Options (30 Chars max)</span>
                  <div className="space-y-1.5">
                    {genOutput.options.map((opt: string, oIdx: number) => (
                      <div key={oIdx} className="px-2.5 py-1 text-[10px] font-semibold rounded bg-black/5 dark:bg-white/5 border border-card-border/50 text-zinc-650">
                        Option {oIdx + 1}: {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Poll Body */}
              <div className="p-4 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-3 relative">
                <button
                  onClick={() => handleCopy(genOutput.body, 'pipeline-poll')}
                  className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                    copySuccess === 'pipeline-poll' ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' : 'border-card-border bg-black/5 dark:bg-white/5 text-zinc-650'
                  }`}
                >
                  {copySuccess === 'pipeline-poll' ? <Check size={11} /> : <Copy size={11} />}
                  <span>Copy Body</span>
                </button>
                <span className="text-[9px] font-black text-brand-purple uppercase">Poll Post Body</span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed whitespace-pre-wrap max-w-[90%]">
                  {genOutput.body}
                </p>
              </div>
            </div>
          )}

          {/* Why? How? Impact? */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-card-border/40 text-[10px] leading-relaxed font-semibold text-zinc-550">
            <div>
              <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why this setup?</strong>
              {genOutput.why}
            </div>
            <div>
              <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How to implement?</strong>
              {genOutput.how}
            </div>
            <div>
              <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Impact?</strong>
              <span className="text-brand-emerald font-black block">{genOutput.impact}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function HookStudio() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading studio components...</div>}>
      <HookStudioContent />
    </Suspense>
  );
}
