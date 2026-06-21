"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  UserCheck, 
  Info,
  ArrowLeft
} from 'lucide-react';

export default function HeadlineGeneratorPage() {
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [usp, setUsp] = useState('');
  const [generatedHeadlines, setGeneratedHeadlines] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    const primarySkills = skillList.slice(0, 3).join(' • ');
    
    const options = [
      // XYZ Formula
      `${role} | Helping organizations ${usp || "build robust digital solutions"} | Specializing in ${primarySkills || "software architecture"}`,
      // Authority / Core Specialization
      `${role} specializing in ${primarySkills || "full-stack development"} | ${usp || "Building products from zero to one"}`,
      // Creator / Value Prop
      `${role} — Passionate about ${primarySkills || "UI/UX design"} & ${usp || "helping creators scale online"}. Let's connect!`,
      // Minimalist Keyword Stack
      `${role} • ${primarySkills || "Next.js • TailwindCSS"} • ${usp || "Product Architecture"}`
    ];

    setGeneratedHeadlines(options);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
            <Sparkles size={12} className="text-brand-purple" />
            Free Backlink Tool
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            LinkedIn Headline Generator
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-semibold">
            Draft high-converting, keyword-dense headlines to attract recruiters and profile viewers.
          </p>
        </div>
      </section>

      {/* Main Interactive Workspace */}
      <section className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Form panel */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 space-y-5">
          <h3 className="font-extrabold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
            <UserCheck size={18} className="text-brand-purple" />
            Headline Parameters
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Current / Target Role</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Engineer, SaaS Founder"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Top Skills (Comma Separated)</label>
              <input
                type="text"
                placeholder="e.g. Next.js, Go, System Design"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">USP / Major Achievement</label>
              <textarea
                rows={3}
                placeholder="e.g. Scaling developer portals, Grew app MRR to $15k"
                value={usp}
                onChange={(e) => setUsp(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs shadow-md shadow-brand-purple/15 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Generate Headlines
              <Sparkles size={13} />
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 min-h-[280px] flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-base border-b border-card-border/50 pb-3">
                Generated Variations
              </h3>
              
              {generatedHeadlines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500 text-center gap-2">
                  <Info size={24} className="text-zinc-400" />
                  <p className="text-xs font-semibold leading-relaxed">Enter your role and achievements to generate search-optimized headline variations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedHeadlines.map((headline, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex justify-between items-start gap-3 group hover:border-brand-purple/20 transition-all text-xs font-semibold text-zinc-800 dark:text-zinc-300 leading-relaxed"
                    >
                      <p className="flex-1">{headline}</p>
                      <button
                        onClick={() => handleCopy(headline, idx)}
                        className="p-1.5 rounded-lg border border-card-border bg-white dark:bg-[#1d2226] text-zinc-400 hover:text-brand-purple transition-all shrink-0 cursor-pointer"
                      >
                        {copiedIndex === idx ? <Check size={13} className="text-brand-emerald" /> : <Copy size={13} />}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Redirection CTA */}
            {generatedHeadlines.length > 0 && (
              <div className="pt-6 border-t border-card-border/50 mt-6 space-y-3">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                  Headlines are only 20% of LinkedIn SEO. Run a full profile audit to discover missing keywords and Recruiter Search Appearance metrics.
                </p>
                <Link
                  href="/profile-intelligence"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
                >
                  Analyze Full Profile Copy
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
            "name": "LinkedIn Headline Generator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "url": "https://postiq.nexdial.io/headline-generator",
            "description": "Generate professional, high-converting, keyword-optimized LinkedIn headlines using proven creator formulas.",
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
