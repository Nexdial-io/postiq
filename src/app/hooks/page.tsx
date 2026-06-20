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
  Bookmark
} from 'lucide-react';

function HookStudioContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'generator' | 'rewriter'>('generator');
  
  // Hook Generator State
  const [topic, setTopic] = useState("AI Agents in SaaS");
  const [generatedHooks, setGeneratedHooks] = useState<any>(null);
  
  // Rewriter State
  const [draft, setDraft] = useState(
    "I want to share my thoughts on working in tech. It's really hard. You have to learn new things constantly. Sometimes it feels like you're falling behind. But if you keep going, you can get great results. Let me know what you think."
  );
  const [rewrittenContent, setRewrittenContent] = useState<any>(null);
  const [selectedTone, setSelectedTone] = useState<'viral' | 'professional' | 'executive' | 'story' | 'creator'>('viral');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    // If a topic parameter was passed (e.g. from Dashboard Trending Topics)
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

    // Construct realistic frameworks dynamically based on the input topic
    const key = activeTopic.trim();
    
    const categories = {
      curiosity: [
        `90% of professionals fail to scale their strategy in ${key}. Here is the one shift that changes everything:`,
        `The secret to mastering ${key} isn't what you think. It comes down to this 3-step loop:`,
        `Most articles on ${key} are missing the point entirely. Here is what they won't tell you:`
      ],
      contrarian: [
        `Unpopular opinion: Stop trying to learn ${key} the traditional way. It's a waste of time.`,
        `Everyone is wrong about ${key}. Here is why the 'expert' advice is holding you back:`,
        `You don't need a huge budget to dominate ${key}. In fact, that's exactly why you're failing.`
      ],
      storytelling: [
        `Last year, I hit rock bottom trying to scale ${key}. I was ready to quit. Then, I changed one thing.`,
        `We spent 6 months building a framework for ${key}. It crashed in 2 days. What we did next saved our company:`,
        `I spoke to 15 founders who scaled ${key}. One lesson stood out: They didn't start with tools.`
      ],
      authority: [
        `After 8 years of engineering growth systems, this is my blueprint for scaling ${key}:`,
        `Here are the 4 key metrics that separate successful ${key} programs from failures:`,
        `We engineered a ${key} model that handles $10M+ in volume. Here is the technical breakdown:`
      ],
      dataDriven: [
        `We analyzed 500+ projects in ${key}. The results shocked us: 78% failed due to this single error.`,
        `Adding this one checklist to our ${key} workflow boosted efficiency by exactly 42%.`,
        `Data check: How we reduced costs in ${key} by 30% while doubling output.`
      ],
      viral: [
        `${key} is changing faster than ever. If you aren't doing these 3 things, you're falling behind: 🧵`,
        `How to master ${key} in 5 minutes a day (without paying for courses):`,
        `The ultimate cheat-sheet for ${key} in 2026. Bookmark this before it gets buried:`
      ]
    };

    setGeneratedHooks(categories);
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

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Hook & Rewrite Studio</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Generate high-performance openers or rewrite drafts using advanced creator frameworks.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-card-border gap-2 pb-px">
        <button
          onClick={() => setActiveTab('generator')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'generator' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          AI Hook Generator
        </button>
        <button
          onClick={() => { setActiveTab('rewriter'); handleRewrite(); }}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'rewriter' ? 'border-brand-purple text-brand-purple' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          Viral Post Rewriter
        </button>
      </div>

      {/* TABS CONTAINER */}
      <div>
        {activeTab === 'generator' ? (
          
          /* HOOK GENERATOR TAB */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Form */}
            <div className="lg:col-span-1">
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
                    className="w-full px-3 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple"
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateHooks("")}
                  />
                </div>

                <button
                  onClick={() => handleGenerateHooks("")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5"
                >
                  <Wand2 size={14} />
                  Generate Hooks
                </button>
              </div>
            </div>

            {/* Generated Hooks Output */}
            <div className="lg:col-span-2">
              {!generatedHooks ? (
                <div className="glass-panel rounded-xl p-8 py-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22]">
                  <Compass size={36} className="text-zinc-400 mb-3" />
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Generate hooks</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">
                    Type a topic on the left and hit generate to access frameworks.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Category outputs */}
                  {[
                    { title: "Curiosity Hooks (FOMO & Suspense)", list: generatedHooks.curiosity, color: "text-brand-purple bg-brand-purple/10" },
                    { title: "Contrarian Hooks (Pattern Interrupt)", list: generatedHooks.contrarian, color: "text-brand-rose bg-brand-rose/10" },
                    { title: "Storytelling Hooks (Narrative Hook)", list: generatedHooks.storytelling, color: "text-blue-500 bg-blue-500/10" },
                    { title: "Authority Hooks (Credibility Claim)", list: generatedHooks.authority, color: "text-brand-emerald bg-brand-emerald/10" },
                    { title: "Data-Driven Hooks (Proof Claim)", list: generatedHooks.dataDriven, color: "text-brand-amber bg-brand-amber/10" },
                    { title: "Viral Format Hooks (Thread Templates)", list: generatedHooks.viral, color: "text-pink-500 bg-pink-500/10" }
                  ].map((cat, idx) => (
                    <div key={idx} className="glass-panel rounded-xl p-5 space-y-3">
                      <div className="flex items-center gap-2 border-b border-card-border/50 pb-2">
                        <Flame size={14} className="text-brand-purple" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">{cat.title}</h4>
                      </div>
                      
                      <div className="space-y-2.5">
                        {cat.list.map((hook: string, hIdx: number) => (
                          <div key={hIdx} className="p-3 rounded-lg border border-card-border/70 bg-[#f8f9fa] dark:bg-[#141b22] flex justify-between items-center gap-4 text-xs font-medium">
                            <span className="text-zinc-800 dark:text-zinc-200 leading-relaxed">"{hook}"</span>
                            <button
                              onClick={() => handleCopy(hook, `hook-${idx}-${hIdx}`)}
                              className={`p-1 rounded hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all shrink-0 ${copySuccess === `hook-${idx}-${hIdx}` ? 'text-brand-emerald' : 'text-zinc-400'}`}
                            >
                              {copySuccess === `hook-${idx}-${hIdx}` ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>

          </div>
        ) : (
          
          /* POST REWRITER TAB */
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
                  className="px-5 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-1"
                >
                  <RotateCw size={13} />
                  Rewrite Draft
                </button>
              </div>
            </div>

            {/* Rewritten Output */}
            <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
              <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                <h3 className="font-bold text-base">Rewritten Versions</h3>
                
                {/* Tone Selectors */}
                <div className="flex p-0.5 rounded-lg bg-[#eef3f8] dark:bg-[#383f47] border border-card-border gap-1">
                  {(['viral', 'professional', 'executive', 'story', 'creator'] as const).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase transition-all ${
                        selectedTone === tone ? 'bg-brand-purple text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {!rewrittenContent ? (
                <div className="py-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22] rounded-xl">
                  <Sparkles size={32} className="text-zinc-400 mb-2" />
                  <span className="text-xs text-zinc-500">Click rewrite to view output options</span>
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
                  
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap">
                    {rewrittenContent[selectedTone]}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
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
