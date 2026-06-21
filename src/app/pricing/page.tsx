"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  HelpCircle, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  X,
  Sparkles,
  TrendingUp,
  UserCheck,
  Award,
  Users
} from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const prePricingBenefits = [
    "Analyze posts before publishing",
    "Optimize your profile for visibility",
    "Discover high-opportunity trends",
    "Build a stronger personal brand",
    "Make data-driven growth decisions",
    "Save hours of trial and error"
  ];

  const plans = [
    {
      name: "Free",
      price: 0,
      desc: "Experience the platform and start optimizing your content basics.",
      features: [
        "10 Post Analyses Daily",
        "Basic Profile Audit",
        "Hook Generator (Basic Tones)",
        "Trend Discovery Preview",
        "Weekly Content Planner Preview",
        "Community Access"
      ]
    },
    {
      name: "Pro",
      price: isAnnual ? 19 : 24,
      desc: "For serious content creators, consultants, and personal brand builders.",
      savingsCallout: "Less than the cost of one coffee shop visit per week.",
      features: [
        "Everything in Free, plus:",
        "Unlimited Post Intelligence Reports",
        "Advanced Profile SEO & Recruiter Visibility Audits",
        "Audience Affinity Analysis",
        "Competitor Intelligence & Content Gap Discovery",
        "AI Calendar & Posting Heatmaps",
        "Trend Opportunity Detection",
        "Personal Brand Growth Insights",
        "Priority AI Processing",
        "CSV Export & Reporting"
      ],
      popular: true
    }
  ];

  const comparisonFeatures = [
    { name: "Post Analysis Limits", free: "10 / day", pro: "Unlimited" },
    { name: "Profile Audit Depth", free: "Basic", pro: "Advanced (Full SEO & Heatmaps)" },
    { name: "Hook Studio", free: "Basic Tones", pro: "50+ Frameworks & Templates" },
    { name: "Trends Discovery", free: "Preview Only", pro: "Full Opportunity Scoring" },
    { name: "Competitor Intelligence", free: "❌", pro: "✅" },
    { name: "Content Calendar & Mix", free: "❌", pro: "✅" },
    { name: "Weekly Action Planner", free: "Preview", pro: "✅" },
    { name: "CSV Exports & Reports", free: "❌", pro: "✅" },
    { name: "AI Latency Support", free: "Standard", pro: "Priority Queue" }
  ];

  const whoIsThisFor = [
    { role: "Creators", benefit: "Grow audience, maximize simulated virality potential, and boost engagement." },
    { role: "Founders", benefit: "Build industry authority, establish trust, and attract inbound leads." },
    { role: "Consultants", benefit: "Generate high-ticket business inquiries and showcase expertise." },
    { role: "Job Seekers", benefit: "Increase recruiter visibility indices and optimize profile keywords." },
    { role: "Professionals", benefit: "Strengthen personal branding signals and command higher authority." }
  ];

  const roiBenefits = [
    "Publish with confidence using simulated virality tests",
    "Discover content opportunities earlier before feeds saturate",
    "Improve profile visibility with recruiter keyword audits",
    "Build authority faster by targeting the right keywords",
    "Save hours of manual analysis every single week"
  ];

  const trustSignals = [
    "Built independently by a SaaS founder to solve real LinkedIn growth friction.",
    "Continuously improved through active user feedback and weekly releases.",
    "Independent platform focused 100% on creator growth analytics."
  ];

  const faqs = [
    { 
      q: "How are engagement predictions calculated?", 
      a: "Predictions are generated using weighted heuristic scoring models that analyze hooks, paragraph formatting, emotional sentiment, and structural layout against historical virality patterns. These serve as directional estimates rather than guarantees." 
    },
    { 
      q: "Are recruiter scores real LinkedIn scores?", 
      a: "No. The Recruiter Appeal Index and other visibility scores are independent heuristics that simulate recruiter search behaviors based on keyword densities, profile completeness, and role alignments." 
    },
    { 
      q: "Does PostIQ connect directly to LinkedIn?", 
      a: "No. PostIQ is an independent analytics platform and does not connect to your LinkedIn profile. You paste draft content and profile copy manually. We do not automate actions or scrape LinkedIn to guarantee compliance with their Terms of Service." 
    },
    { 
      q: "Can I export my profile audits?", 
      a: "Yes. Pro users can export keywords audits, competitor gaps, and action checklists in CSV format for reference or team use." 
    },
    { 
      q: "How often are trend signals updated?", 
      a: "Simulated trend signals, opportunity scores, and topic lifecycle tags are updated daily to reflect fresh industry topics and momentum shifts." 
    },
    { 
      q: "Will PostIQ post content automatically?", 
      a: "No. PostIQ is purely an intelligence and advisory planner. You copy your finalized, optimized posts from the analyzer workspace and publish them manually to LinkedIn." 
    }
  ];

  return (
    <div className="w-full flex flex-col items-center pb-16">
      
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-5 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <Zap size={12} className="fill-brand-purple/20 text-brand-purple" />
            Simple Tiers
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient max-w-2xl mx-auto">
            Choose the Plan That Accelerates Your LinkedIn Growth
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-semibold leading-relaxed">
            Whether you're building a personal brand, attracting recruiters, or growing a business, PostIQ helps you make smarter content and profile decisions.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex flex-col items-center gap-2 mt-6">
            <div className="inline-flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border gap-2">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${!isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-md' : 'text-zinc-400 hover:text-zinc-300'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow-md' : 'text-zinc-400 hover:text-zinc-300'}`}
              >
                Annual (Save 20%)
              </button>
            </div>
            {isAnnual && (
              <span className="text-[10px] text-brand-emerald font-extrabold uppercase tracking-wider animate-in fade-in duration-200">
                Billed as $230/year — Save $58 compared to monthly billing
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Value Summary Checklist */}
      <section className="w-full max-w-4xl px-4 py-4 text-center">
        <div className="glass-panel rounded-2xl p-6 border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01]">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
            What You Get With PostIQ
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left">
            {prePricingBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <Check size={14} className="text-brand-emerald shrink-0" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="w-full max-w-4xl px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {plans.map((plan, idx) => {
          const cost = isAnnual ? (plan.name === "Pro" ? 19 : 0) : plan.price;
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
                
                <div className="flex flex-col border-b border-card-border/50 pb-5">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">${cost}</span>
                    <span className="text-zinc-500 text-xs ml-1.5">{isAnnual ? '/ month' : '/ month'}</span>
                  </div>
                  {isAnnual && plan.name === "Pro" && (
                    <span className="text-[10px] text-zinc-400 mt-1 font-semibold">Billed annually ($230/yr)</span>
                  )}
                  {plan.savingsCallout && (
                    <span className="text-[10px] text-brand-purple mt-2 font-bold italic leading-tight">
                      * {plan.savingsCallout}
                    </span>
                  )}
                </div>
                
                <ul className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 font-medium leading-relaxed">
                      {feat.toLowerCase().includes("everything in free") ? (
                        <Sparkles size={14} className="text-brand-purple shrink-0 mt-0.5" />
                      ) : (
                        <Check size={14} className="text-brand-emerald shrink-0 mt-0.5" />
                      )}
                      <span className={feat.toLowerCase().includes("everything in free") ? "font-bold text-zinc-900 dark:text-white" : ""}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link
                href={`/billing?plan=${plan.name.toLowerCase()}&billing=${isAnnual ? 'annual' : 'monthly'}`}
                className={`mt-8 w-full py-3.5 rounded-2xl text-center text-xs font-bold transition-all cursor-pointer ${
                  plan.name === 'Free' 
                    ? 'border border-card-border hover:bg-black/5 dark:hover:bg-white/5 text-zinc-800 dark:text-zinc-200' 
                    : 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white hover:opacity-95 shadow-md shadow-brand-purple/20 hover:scale-[1.01]'
                }`}
              >
                {plan.name === 'Free' ? 'Try Free Demo' : `Subscribe to ${plan.name}`}
              </Link>
            </div>
          );
        })}
      </section>

      {/* Feature Comparison Table */}
      <section className="w-full max-w-4xl px-4 py-8">
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 border border-card-border/60">
          <h3 className="text-lg font-bold text-center">Plan Feature Comparison</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border text-zinc-500 font-bold">
                  <th className="py-3 px-2">Core Optimization Capabilities</th>
                  <th className="py-3 px-2 text-center w-24">Free Tier</th>
                  <th className="py-3 px-2 text-center w-24">Pro Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border/50 font-semibold text-zinc-700 dark:text-zinc-300">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                    <td className="py-3 px-2">{row.name}</td>
                    <td className="py-3 px-2 text-center text-zinc-500">{row.free}</td>
                    <td className="py-3 px-2 text-center font-bold text-brand-purple">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Who is it for & ROI grid */}
      <section className="w-full max-w-4xl px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Who is it for */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 border border-card-border/60">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-card-border/50 pb-4">
            <Users size={18} className="text-brand-purple" />
            Who Is PostIQ For?
          </h3>
          <div className="space-y-4">
            {whoIsThisFor.map((item, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <span className="font-extrabold text-zinc-900 dark:text-white block">{item.role}</span>
                <p className="text-zinc-500 font-medium leading-relaxed">{item.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Section */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 border border-card-border/60 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 border-b border-card-border/50 pb-4">
              <Award size={18} className="text-brand-emerald" />
              Why Upgrade to Pro? (ROI)
            </h3>
            <div className="space-y-3.5">
              {roiBenefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <Check size={14} className="text-brand-emerald shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Signals Block */}
          <div className="pt-6 border-t border-card-border/50 space-y-3">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
              Our Trust Principles
            </span>
            <div className="space-y-2 text-[10px] text-zinc-500 font-medium leading-relaxed">
              {trustSignals.map((signal, sIdx) => (
                <div key={sIdx} className="flex items-start gap-1.5">
                  <span className="text-brand-purple font-extrabold shrink-0">•</span>
                  <span>{signal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Grid */}
      <section className="w-full max-w-4xl px-4 py-12 space-y-10">
        <h3 className="text-2xl font-bold text-center">Frequently Asked Questions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
