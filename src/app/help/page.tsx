"use client";

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ArrowRight, 
  LifeBuoy, 
  CreditCard, 
  UserCheck, 
  Sparkles,
  Mail
} from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: "Account & Access",
      icon: LifeBuoy,
      color: "text-brand-purple bg-brand-purple/10",
      faqs: [
        { q: "How do I connect my LinkedIn profile?", a: "To analyze your profile, you can either paste your LinkedIn public URL, import a manual PDF export of your profile, or enter your experience details manually in the Profile Intelligence hub." },
        { q: "Is PostIQ affiliated with LinkedIn?", a: "No, PostIQ is an independent creator intelligence platform. We are not officially affiliated with or endorsed by LinkedIn Corporation." },
        { q: "Can I manage team member workspaces?", a: "Yes, our Agency plan supports creating up to 10 distinct client workspaces and inviting up to 5 team members to collaborate." }
      ]
    },
    {
      title: "Billing & Plans",
      icon: CreditCard,
      color: "text-brand-emerald bg-brand-emerald/10",
      faqs: [
        { q: "How do I upgrade to Pro or Agency?", a: "Visit the Billing & Plans settings, choose either monthly or annual billing, and click 'Subscribe'. Checkout is securely handled by Stripe." },
        { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel recurring renewals at any time from the billing page. You will retain premium access until the end of your billing cycle." },
        { q: "Are there any hidden API fees?", a: "No, all post analysis, hook generation, and keyword auditing costs are covered by your subscription fee. There are no additional per-use token charges." }
      ]
    },
    {
      title: "AI Post Scorer",
      icon: Sparkles,
      color: "text-brand-indigo bg-brand-indigo/10",
      faqs: [
        { q: "How is the post score calculated?", a: "Our AI evaluates readability (length, structure), hook strength (first two lines power), Authority cues (proof points, formatting), CTA effectiveness, and hashtag relevance." },
        { q: "What does a score of 80+ mean?", a: "A score of 80+ represents high readability, strong hooks, and solid structural formatting. Historically, posts in this tier see 35% higher engagement." },
        { q: "How accurate is engagement prediction?", a: "Predictions are simulated estimations based on content density, industry trends, and topic popularity metrics. Actual post performance varies based on publishing time." }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(cat => {
    const filteredFaqs = cat.faqs.filter(
      f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
           f.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, faqs: filteredFaqs };
  }).filter(cat => cat.faqs.length > 0);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Help Banner */}
      <section className="relative w-full py-16 md:py-20 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[90px] pointer-events-none"></div>
        
        <div className="max-w-2xl mx-auto space-y-5 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <HelpCircle size={12} className="text-brand-purple" />
            Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            How can we help you?
          </h1>
          
          {/* Interactive Search Bar */}
          <div className="relative max-w-lg mx-auto mt-4">
            <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search help articles (e.g. 'Stripe', 'Score', 'LinkedIn')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/10 dark:bg-white/5 border border-card-border rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-purple transition-all shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Categorized FAQs Grid */}
      <section className="w-full max-w-5xl px-4 py-6 space-y-12">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border-dashed border-2">
            <HelpCircle className="mx-auto text-zinc-400 mb-2" size={32} />
            <p className="text-sm font-semibold text-zinc-500">No help articles match your search query.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-bold text-brand-purple hover:underline"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          filteredCategories.map((category, cIdx) => {
            const Icon = category.icon;
            return (
              <div key={cIdx} className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-card-border/50">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <Icon size={16} />
                  </div>
                  <h3 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200">{category.title}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.faqs.map((faq, fIdx) => (
                    <div key={fIdx} className="glass-panel rounded-2xl p-5 space-y-2.5 border border-card-border/60 hover:border-brand-purple/20 transition-all">
                      <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 leading-snug">{faq.q}</h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Need more help Callout */}
      <section className="w-full max-w-5xl px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-brand-purple/5 to-brand-emerald/5 border-card-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <Mail size={16} className="text-brand-purple" />
              Still need assistance?
            </h3>
            <p className="text-xs text-zinc-500 font-medium">Open a direct support ticket. Our engineering support desk typically replies within 12 hours.</p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-brand-purple/20 transition-all hover:opacity-95 shrink-0"
          >
            Create Support Ticket
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
