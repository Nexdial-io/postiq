"use client";

import React from 'react';
import { BookOpen, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BlogHubPage() {
  const articles = [
    {
      slug: "linkedin-algorithm-trends-2026",
      title: "LinkedIn Algorithm Breakdown: What Drives Organic Feed Reach in 2026",
      desc: "An in-depth look at LinkedIn's updated distribution engine. Discover why external outbound links, tags density, and immediate comment responses determine your post's virality score.",
      author: "Alex Rivera",
      date: "June 18, 2026",
      readTime: "6 min read",
      category: "Algorithm Tips",
      badgeColor: "text-brand-purple bg-brand-purple/10 border-brand-purple/20"
    },
    {
      slug: "mastering-curiosity-hooks-for-ctr",
      title: "Mastering Curiosity Hooks: How to Double Your Post 'See More' Click Rate",
      desc: "Curiosity and contrarian hooks disrupt reading patterns. Learn how to draft openers that compel users to hit the see more button, boosting your authority indicators by up to 40%.",
      author: "Sarah Chen",
      date: "June 12, 2026",
      readTime: "5 min read",
      category: "Content Strategy",
      badgeColor: "text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20"
    },
    {
      slug: "ats-resume-keyword-optimization-guide",
      title: "ATS and LinkedIn SEO: Optimizing Your Experiences Section for Recruiters",
      desc: "hiring systems rely on indexing algorithms. Discover the exact keyword structures and impact statements formulas to make your profile rank in recruitment search results.",
      author: "Datta Sable",
      date: "June 05, 2026",
      readTime: "8 min read",
      category: "Career & SEO",
      badgeColor: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Blog Hero Banner */}
      <section className="relative w-full py-16 md:py-20 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[90px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={12} className="text-brand-purple" />
            Creator Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            Latest Creator Analytics Insights
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Guides, breakdowns, and frameworks written by marketing experts and engineers to optimize your growth.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="w-full max-w-6xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {articles.map((art, index) => (
          <div 
            key={index}
            className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden"
          >
            <div className="space-y-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider inline-block ${art.badgeColor}`}>
                {art.category}
              </span>
              
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white leading-snug group-hover:text-brand-purple transition-colors">
                <Link href={`/blog/${art.slug}`}>{art.title}</Link>
              </h3>
              
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                {art.desc}
              </p>
            </div>

            <div className="pt-6 border-t border-card-border/50 mt-6 flex flex-col gap-3">
              {/* Author & details */}
              <div className="flex justify-between items-center text-[10px] text-zinc-500 font-semibold">
                <div className="flex items-center gap-1">
                  <User size={12} className="text-brand-purple" />
                  <span>{art.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5"><Calendar size={11} /> {art.date}</span>
                  <span className="flex items-center gap-0.5"><Clock size={11} /> {art.readTime}</span>
                </div>
              </div>

              <Link 
                href={`/blog/${art.slug}`}
                className="text-xs font-bold text-brand-purple flex items-center gap-0.5 hover:underline mt-2 justify-end group-hover:gap-1.5 transition-all"
              >
                Read Article
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
