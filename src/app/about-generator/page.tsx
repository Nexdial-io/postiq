"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  BookOpen, 
  Info,
  ArrowLeft
} from 'lucide-react';

export default function AboutGeneratorPage() {
  const [role, setRole] = useState('');
  const [audience, setAudience] = useState('');
  const [achievements, setAchievements] = useState('');
  const [cta, setCta] = useState('');
  const [generatedAbout, setGeneratedAbout] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) return;

    const bulletPoints = achievements
      ? achievements.split('\n').map(line => line.trim()).filter(Boolean).map(line => `• ${line}`).join('\n')
      : "• Grew operational efficiencies and performance ratings.\n• Managed core product features lifecycle.\n• Collaborated with cross-functional stakeholders.";

    const text = `🚀 I help ${audience || "companies design and deploy high-fidelity digital interfaces"} as a ${role}.

With years of experience building products, I focus on solving key business constraints and delivering measurable user outcomes. I specialize in turning complex requirements into clean, scalable workflows.

Key achievements so far:
${bulletPoints}

📫 Want to discuss a project or role? Let's connect here or reach out directly: ${cta || "Send a direct message."}

Specialties: ${role} • Product Development • Heuristic Analysis • Professional Networking`;

    setGeneratedAbout(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAbout);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <BookOpen size={12} className="text-brand-purple" />
            Free Bio Tool
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            LinkedIn About Section Generator
          </h1>
          <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-semibold">
            Draft a structured, multi-paragraph LinkedIn summary that outlines your journey.
          </p>
        </div>
      </section>

      {/* Main Workspace */}
      <section className="w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Form panel */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 space-y-5">
          <h3 className="font-extrabold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-brand-purple" />
            Bio Details
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Your Specialization / Role</label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Stack Engineer, GTM Advisor"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Target Audience / Core Service</label>
              <input
                type="text"
                placeholder="e.g. B2B SaaS teams scale their API layers"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Major Achievements (one per line)</label>
              <textarea
                rows={3}
                placeholder="Managed a team of 4 engineers&#10;Integrated 12 payment APIs&#10;Reduced load times by 40%"
                value={achievements}
                onChange={(e) => setAchievements(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-600 dark:text-zinc-400">Call to Action (CTA)</label>
              <input
                type="text"
                placeholder="e.g. Email me at name@domain.com"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs shadow-md shadow-brand-purple/15 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Generate About Summary
              <Sparkles size={13} />
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 min-h-[350px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                <h3 className="font-extrabold text-base">Generated Biography</h3>
                {generatedAbout && (
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] font-bold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all flex items-center gap-1 cursor-pointer text-zinc-650 dark:text-zinc-300"
                  >
                    {copied ? <Check size={11} className="text-brand-emerald" /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy bio'}
                  </button>
                )}
              </div>
              
              {!generatedAbout ? (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-500 text-center gap-2">
                  <Info size={24} className="text-zinc-400" />
                  <p className="text-xs font-semibold leading-relaxed font-semibold">Enter your experience and call to action details to generate a formatted bio.</p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] text-xs font-semibold text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                  {generatedAbout}
                </div>
              )}
            </div>

            {/* Redirection CTA */}
            {generatedAbout && (
              <div className="pt-6 border-t border-card-border/50 mt-6 space-y-3">
                <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">
                  Once your bio is optimized, match it with post drafts that fit your positioning. Test post engagement indicators dynamically.
                </p>
                <Link
                  href="/analyzer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-purple hover:underline"
                >
                  Analyze LinkedIn Post Drafts
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
            "name": "LinkedIn About Section Generator",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "url": "https://postiq.nexdial.io/about-generator",
            "description": "Create a high-converting, professional LinkedIn About summary utilizing proven storytelling structures.",
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
