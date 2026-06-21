"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  TrendingUp, 
  Info,
  ArrowLeft
} from 'lucide-react';

interface HashtagGroup {
  category: string;
  tags: string[];
}

export default function HashtagGeneratorPage() {
  const [topic, setTopic] = useState('');
  const [generatedTags, setGeneratedTags] = useState<HashtagGroup[]>([]);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const baseTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');

    const groups: HashtagGroup[] = [
      {
        category: "High Reach (1M+ followers)",
        tags: ["#personalbranding", `#${baseTopic}`, "#networking", "#careers"]
      },
      {
        category: "Medium Reach (100k+ followers)",
        tags: [`#${baseTopic}strategy`, "#contentcreation", "#productivity"]
      },
      {
        category: "Niche Reach (10k+ followers)",
        tags: [`#${baseTopic}growth`, "#profileseo", "#creatorinsights"]
      }
    ];

    setGeneratedTags(groups);
  };

  const handleCopyTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const handleCopyAll = () => {
    const allTags = generatedTags.flatMap(g => g.tags).join(' ');
    navigator.clipboard.writeText(allTags);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center pb-16">
      {/* Header */}
      <section className="relative w-full py-16 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[95px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <Link href="/blog" className="inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-brand-purple transition-all mb-2">
            <ArrowLeft size={13} /> Back to Blog & Guides
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <TrendingUp size={12} className="text-brand-purple" />
            Free Reach Tool
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            LinkedIn Hashtag Generator
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-semibold">
            Identify relevant hashtags and cluster terms to maximize feed distribution for your updates.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Form panel */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 space-y-5">
          <h3 className="font-extrabold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-brand-purple" />
            Topic Cluster
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Post Topic / Core Keyword</label>
              <input
                type="text"
                required
                placeholder="e.g. SaaS Startup, Product Design, Hiring"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs shadow-md shadow-brand-purple/15 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Generate Hashtags
              <Sparkles size={13} />
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 min-h-[300px] flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                <h3 className="font-extrabold text-base">Recommended Tags</h3>
                {generatedTags.length > 0 && (
                  <button
                    onClick={handleCopyAll}
                    className="px-2.5 py-1 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all flex items-center gap-1 cursor-pointer text-zinc-650 dark:text-zinc-300"
                  >
                    {copiedAll ? <Check size={11} className="text-brand-emerald" /> : <Copy size={11} />}
                    {copiedAll ? 'Copied All' : 'Copy all tags'}
                  </button>
                )}
              </div>
              
              {generatedTags.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500 text-center gap-2">
                  <Info size={24} className="text-zinc-400" />
                  <p className="text-xs font-semibold leading-relaxed">Enter a core topic keyword to categorize and structure reach-optimized hashtags.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedTags.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-1.5">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">{group.category}</span>
                      <div className="flex flex-wrap gap-2">
                        {group.tags.map((tag, tIdx) => (
                          <button
                            key={tIdx}
                            onClick={() => handleCopyTag(tag)}
                            className="px-2.5 py-1 rounded-lg border border-card-border bg-[#f8f9fa] dark:bg-[#1d2226] text-xs font-bold text-brand-purple hover:bg-brand-purple/5 hover:border-brand-purple/30 transition-all flex items-center gap-1 cursor-pointer"
                          >
                            {tag}
                            {copiedTag === tag ? <Check size={11} className="text-brand-emerald" /> : <Copy size={11} className="opacity-40" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Redirection CTA */}
            {generatedTags.length > 0 && (
              <div className="pt-6 border-t border-card-border/50 mt-6 space-y-3">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                  Want to schedule your optimized posts with optimal timing windows? Get started with our Content Calendar on the pricing page.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
                >
                  View Pricing Plans & Calendar
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "LinkedIn Hashtag Generator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "url": "https://postiq.nexdial.io/hashtag-generator",
            "description": "Identify relevant hashtags and cluster terms to maximize feed distribution for your LinkedIn updates.",
            "creator": {
              "@type": "Person",
              "name": "Datta Sable",
              "jobTitle": "Founder & Lead Architect",
              "url": "https://www.linkedin.com/in/dattasable/"
            }
          })
        }}
      />
    </div>
  );
}
