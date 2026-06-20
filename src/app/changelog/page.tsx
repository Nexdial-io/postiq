"use client";

import React from 'react';
import { Sparkles, Zap, Calendar, ArrowLeft, GitCommit, Check } from 'lucide-react';
import Link from 'next/link';

export default function ChangelogPage() {
  const updates = [
    {
      version: "v1.1.0",
      date: "June 20, 2026",
      badge: "Latest Release",
      badgeColor: "text-brand-purple bg-brand-purple/10 border-brand-purple/20",
      intro: "We've completely overhauled the layout, integrated new support docs, built an interactive FAQ help center, and designed a custom biography portfolio section.",
      changes: [
        "Added ultra-premium layout header and footer with smooth active highlights.",
        "Integrated built by credit link pointing directly to creator portfolio dattasable.com.",
        "Created fully operational interactive FAQ search filter component.",
        "Introduced dynamic developer API REST integrations documentation tab.",
        "Optimized mobile drawer and public navigation workflows."
      ]
    },
    {
      version: "v1.0.0",
      date: "May 15, 2026",
      badge: "Major Release",
      badgeColor: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20",
      intro: "PostIQ launches globally with core post analyzing models, resume scoring systems, calendar planning heatmaps, and hooks generators.",
      changes: [
        "Released AI Post Scorer analyzing hook quality, authority cues, readability, and visual layout.",
        "Launched Profile Intelligence Audits with resume keyword ATS scoring engines.",
        "Built Hook Generator producing 50+ templates (Curiosity, Story, Contrarian frameworks).",
        "Created Drag-and-drop Content Calendar suggestions system.",
        "Integrated secure Stripe Mock Billing subscriptions workflow."
      ]
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Header */}
      <section className="relative w-full py-16 md:py-20 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[95px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <GitCommit size={12} className="text-brand-purple" />
            Release Log
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Product Changelog
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Stay up to date with new features, algorithm adjustments, and system enhancements for PostIQ.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="w-full max-w-4xl px-4 py-8 relative">
        {/* Timeline connector line */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 bg-card-border pointer-events-none -translate-x-1/2 hidden sm:block"></div>

        <div className="space-y-12">
          {updates.map((upd, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col sm:flex-row items-stretch gap-6 sm:gap-12 relative animate-in fade-in slide-in-from-bottom-4 duration-350 ${
                idx % 2 === 1 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 sm:left-1/2 w-4 h-4 rounded-full bg-brand-purple border-4 border-background -translate-x-1/2 z-10 hidden sm:block shadow-md"></div>

              {/* Version & Date Card (1/2 Width) */}
              <div className="w-full sm:w-[45%] text-left sm:text-right flex flex-col justify-center sm:items-end gap-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider inline-block ${upd.badgeColor}`}>
                  {upd.badge}
                </span>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-1">{upd.version}</h3>
                <span className="text-xs text-zinc-500 font-semibold flex items-center gap-1 mt-0.5 sm:justify-end">
                  <Calendar size={12} /> {upd.date}
                </span>
              </div>

              {/* Space filler (middle line spacer) */}
              <div className="w-0 sm:w-[10%] shrink-0"></div>

              {/* Changes Card (1/2 Width) */}
              <div className="w-full sm:w-[45%] glass-panel rounded-3xl p-6 border border-card-border/70 hover:border-brand-purple/20 transition-all text-left">
                <p className="text-xs text-zinc-600 dark:text-zinc-300 italic font-semibold leading-relaxed mb-4">
                  "{upd.intro}"
                </p>
                <ul className="space-y-2.5 text-xs text-zinc-500 font-medium border-t border-card-border/50 pt-4">
                  {upd.changes.map((change, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2">
                      <Check size={12} className="text-brand-emerald shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
