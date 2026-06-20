"use client";

import React from 'react';
import { Shield, Clock, FileText } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <section className="relative w-full py-16 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <Shield size={12} className="text-brand-purple" />
            Security & Trust
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Privacy Policy
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
              1. Overview
            </h2>
            <p>
              At PostIQ, we prioritize the protection of your personal information and creator outputs. This Privacy Policy details how we collect, process, secure, and store your data when utilizing our post scoring, keyword analysis, and profile auditing services.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              2. Information We Collect
            </h2>
            <p>
              We collect information that you explicitly share with the platform, including:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-500 font-medium">
              <li>Account registration credentials (username, email) via security authentication.</li>
              <li>Text inputs and draft post contents submitted for AI scorer analysis.</li>
              <li>LinkedIn profile headlines, experience statements, and skills submitted for resume keyword auditing.</li>
              <li>Subscription data (payment references, billing addresses) securely managed by Stripe payment processor.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              3. Processing and Utilization
            </h2>
            <p>
              We process data strictly to deliver platform services, specifically to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-zinc-500 font-medium">
              <li>Score post hook power, CTAs, emotional impact, and visual layout.</li>
              <li>Generate custom curiosity, authority, contrarian hooks, or rephrase updates.</li>
              <li>Draft resume enhancements and highlight keyword gaps.</li>
              <li>Deliver subscription capabilities, security validations, and support services.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              4. Data Retention & Sharing
            </h2>
            <p>
              PostIQ does **not** sell, rent, or trade your personal information to marketing brokers. We share inputs only with secure cloud processors (databases, OpenAI integrations) essential for service delivery. You can request deletion of all analyzed history logs from your dashboard settings.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 border-b border-card-border/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-brand-purple" />
              5. Contact Us
            </h2>
            <p>
              If you have any questions or data concerns regarding this policy, please reach out via our support channel:
            </p>
            <Link href="/contact" className="text-brand-purple hover:underline font-bold mt-1 inline-block">
              Open Support Ticket &rarr;
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
