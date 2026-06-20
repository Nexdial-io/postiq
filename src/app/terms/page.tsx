"use client";

import React from 'react';
import { Shield, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <section className="relative w-full py-16 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-indigo/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <Shield size={12} className="text-brand-purple" />
            Terms of Use
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Terms of Service
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 font-semibold mt-2">
            <Clock size={12} />
            <span>Last Updated: June 20, 2026</span>
          </div>
        </div>
      </section>

      {/* Main Text Content */}
      <section className="w-full max-w-4xl px-4 py-8">
        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-8 border border-card-border/70 text-sm leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">
          
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              1. Acceptance of Terms
            </h2>
            <p>
              By registering an account and using PostIQ (including post analysis, hooks generator, rewrite studios, calendar suggestions, and competitor audits), you explicitly agree to follow and be bound by these Terms of Service. If you disagree with any terms, you must terminate platform usage immediately.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              2. Accounts & Subscriptions
            </h2>
            <p>
              You must provide accurate, complete registration credentials. You are responsible for safeguarding your login keys. Subscriptions (Pro, Agency plans) grant access to advanced AI capabilities and higher processing limits:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-500 font-medium">
              <li>Billing occurs on a recurring cycle (monthly or annual).</li>
              <li>You can cancel recurring subscription plans at any time via your settings panel.</li>
              <li>Free accounts are limited to 10 post evaluations per day.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              3. Fair Usage Policy
            </h2>
            <p>
              You agree not to abuse platform APIs, copy source layouts, bypass rate limits, run automated extraction scrapers, or submit inputs containing offensive, illicit, or malicious scripts. We reserve the right to suspend or block accounts violating these guidelines.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              4. Disclaimer of Warranty
            </h2>
            <p>
              PostIQ scores, suggestions, and prediction algorithms are simulated analytics. We do not guarantee actual LinkedIn engagement levels, virality metrics, or employment hires resulting from suggestions. Services are provided "as is" and "as available".
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              5. Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with standard corporate guidelines, without regard to its conflict of law provisions.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
