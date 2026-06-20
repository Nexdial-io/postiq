"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: 0,
      desc: "For casual creators and professionals testing post evaluation basics.",
      features: [
        "10 post analyses / day",
        "Profile Strength Score Audit",
        "Curiosity & Contrarian Hooks generator",
        "Community forum access",
        "Standard latency analytics"
      ]
    },
    {
      name: "Pro",
      price: isAnnual ? 19 : 24,
      desc: "For serious content creators, consultants, and personal brand builders.",
      features: [
        "Unlimited post analyses",
        "Deep Resume Keyword & ATS Intelligence",
        "Best Time to Post Heatmap planner",
        "Competitor gap & opportunity notifications",
        "50+ hooks & rewriter tones generator",
        "Priority AI queue support",
        "Historical exports (CSV)"
      ],
      popular: true
    },
    {
      name: "Agency",
      price: isAnnual ? 79 : 99,
      desc: "For brands, agencies, growth networks, and teams managing clients.",
      features: [
        "Everything in Pro tier plan",
        "Multiple client workspaces (up to 10)",
        "Branded reports exports (PDF, CSV, PPT)",
        "Dedicated account strategist review",
        "Autopilot post suggestions calendar",
        "Team members seats (up to 5)",
        "API access keys"
      ]
    }
  ];

  const faqs = [
    { q: "Can I change plans at any time?", a: "Yes, you can upgrade, downgrade, or cancel your subscription plan at any time. If you upgrade, the price change is prorated." },
    { q: "What is your refund policy?", a: "We offer a 14-day refund policy for all new subscriptions. Simply contact support within 14 days and we will issue a full refund." },
    { q: "How does the annual discount work?", a: "By choosing annual billing, you are billed for 12 months upfront. This saves you 20% compared to paying monthly." },
    { q: "Can I export my profile audits?", a: "Yes, Pro users can export data in CSV format, and Agency users can export formatted PDF and PowerPoint presentations." }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <Zap size={12} className="fill-brand-purple/20 text-brand-purple" />
            Simple Tiers
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Flexible, Value-Packed Pricing
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Choose the perfect plan for your professional journey. Upgrade, downgrade, or cancel at any time.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border gap-2 mt-6">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${!isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-md' : 'text-zinc-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-md' : 'text-zinc-400'}`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, idx) => {
          const cost = isAnnual ? plan.price * 12 : plan.price;
          return (
            <div 
              key={idx}
              className={`glass-panel rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden ${
                plan.popular 
                  ? 'border-brand-purple/40 glow-purple bg-gradient-to-b from-brand-purple/[0.03] to-transparent' 
                  : 'border-card-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-brand-purple text-white text-[9px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-xl">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal min-h-[36px]">{plan.desc}</p>
                </div>
                
                <div className="flex items-baseline border-b border-card-border/50 pb-5">
                  <span className="text-4xl font-extrabold">${cost}</span>
                  <span className="text-zinc-500 text-xs ml-1.5">{isAnnual ? '/ year' : '/ month'}</span>
                </div>
                
                <ul className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 font-medium">
                      <Check size={14} className="text-brand-emerald shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href={`/billing?plan=${plan.name.toLowerCase()}`}
                className={`mt-8 w-full py-3 rounded-2xl text-center text-xs font-bold transition-all ${
                  plan.name === 'Free' 
                    ? 'border border-card-border hover:bg-black/5 dark:hover:bg-white/5 text-zinc-800 dark:text-zinc-200' 
                    : 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white hover:opacity-95 shadow-md shadow-brand-purple/20'
                }`}
              >
                {plan.name === 'Free' ? 'Try Free Demo' : `Subscribe to ${plan.name}`}
              </Link>
            </div>
          );
        })}
      </section>

      {/* FAQ Grid */}
      <section className="w-full max-w-4xl px-4 py-16 space-y-10">
        <h3 className="text-2xl font-bold text-center">Frequently Asked Questions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, fIdx) => (
            <div key={fIdx} className="glass-panel rounded-2xl p-5 space-y-2 border border-card-border/60">
              <div className="flex gap-2 text-brand-purple">
                <HelpCircle size={16} className="shrink-0 mt-0.5" />
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 leading-snug">{faq.q}</h4>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
