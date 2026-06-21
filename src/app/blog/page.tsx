"use client";

import React, { useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  Mail,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function BlogHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const categories = [
    "All",
    "LinkedIn Growth",
    "Personal Branding",
    "Content Strategy",
    "Profile Optimization",
    "Creator Economy",
    "AI & Marketing",
    "SaaS Growth",
    "Case Studies"
  ];

  const articles = [
    {
      slug: "the-complete-linkedin-growth-playbook-2026",
      title: "The Complete LinkedIn Growth Playbook for 2026",
      desc: "Everything professionals, creators, founders, and job seekers need to know to build authority and grow visibility on LinkedIn. In this playbook, we'll break down the content patterns, engagement signals, and distribution factors that influence reach.",
      author: "Datta Sable",
      date: "June 20, 2026",
      readTime: "12 min read",
      difficulty: "Advanced",
      category: "LinkedIn Growth",
      badgeColor: "text-brand-purple bg-brand-purple/10 border-brand-purple/20",
      featured: true
    },
    {
      slug: "linkedin-algorithm-trends-2026",
      title: "LinkedIn Algorithm Breakdown: What Drives Organic Feed Reach in 2026",
      desc: "Most LinkedIn posts fail before they even get a chance to perform. In this guide, we'll break down the content patterns, engagement signals, and distribution factors that influence how posts spread across LinkedIn in 2026.",
      author: "Datta Sable",
      date: "June 18, 2026",
      readTime: "6 min read",
      difficulty: "Advanced",
      category: "Content Strategy",
      badgeColor: "text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20"
    },
    {
      slug: "ats-resume-keyword-optimization-guide",
      title: "ATS and LinkedIn SEO: Optimizing Your Experiences Section for Recruiters",
      desc: "Hiring systems rely on indexing algorithms. Discover the exact keyword structures and impact statements formulas to make your profile rank high in recruitment search results.",
      author: "PostIQ Editorial Team",
      date: "June 15, 2026",
      readTime: "8 min read",
      difficulty: "Beginner",
      category: "Profile Optimization",
      badgeColor: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
    },
    {
      slug: "saas-founder-profile-views-case-study",
      title: "How a SaaS Founder Increased Profile Views by 220%",
      desc: "Learn the step-by-step optimization strategy that transformed a quiet founder profile into a high-intent inbound lead generator. Contains full keyword breakdowns and positioning maps.",
      author: "Datta Sable",
      date: "June 10, 2026",
      readTime: "7 min read",
      difficulty: "Intermediate",
      category: "Case Studies",
      badgeColor: "text-brand-amber bg-brand-amber/10 border-brand-amber/20"
    },
    {
      slug: "linkedin-hook-conversion-breakdown",
      title: "From 500 to 15,000 Impressions: A LinkedIn Hook Breakdown",
      desc: "Analyze before-and-after hook examples to see exactly why some posts trigger feed distribution loops while others fall completely flat. Disrupt scroll habits with smart formatting.",
      author: "PostIQ Editorial Team",
      date: "June 08, 2026",
      readTime: "5 min read",
      difficulty: "Beginner",
      category: "LinkedIn Growth",
      badgeColor: "text-brand-purple bg-brand-purple/10 border-brand-purple/20"
    },
    {
      slug: "analyzing-10000-linkedin-posts",
      title: "What We Learned Analyzing 10,000 LinkedIn Posts",
      desc: "We crawled 10,000 simulated posts to identify formatting patterns, optimal whitespace ratios, and CTA strategies that consistently drive high-quality engagement.",
      author: "Datta Sable",
      date: "June 05, 2026",
      readTime: "10 min read",
      difficulty: "Advanced",
      category: "Creator Economy",
      badgeColor: "text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20"
    },
    {
      slug: "how-we-built-post-scoring-engine",
      title: "How We Built a LinkedIn Post Scoring Engine",
      desc: "Inside the engineering behind PostIQ. Learn how our weighted heuristic models evaluate scroll stopper scores and identify failure risks in content drafts.",
      author: "Datta Sable",
      date: "June 02, 2026",
      readTime: "9 min read",
      difficulty: "Advanced",
      category: "AI & Marketing",
      badgeColor: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
    },
    {
      slug: "inside-postiq-hook-framework",
      title: "Inside PostIQ's Hook Quality Framework",
      desc: "Discover the psychology behind our 8 hook categories and how Scroll Stopper checks predict initial impression velocity.",
      author: "PostIQ Editorial Team",
      date: "May 28, 2026",
      readTime: "6 min read",
      difficulty: "Intermediate",
      category: "Content Strategy",
      badgeColor: "text-brand-amber bg-brand-amber/10 border-brand-amber/20"
    },
    {
      slug: "understanding-engagement-prediction-models",
      title: "Understanding Engagement Prediction Models",
      desc: "A developer guide explaining how heuristic scores translate to simulated reach estimations and how to interpret score deltas.",
      author: "Datta Sable",
      date: "May 25, 2026",
      readTime: "8 min read",
      difficulty: "Intermediate",
      category: "AI & Marketing",
      badgeColor: "text-brand-purple bg-brand-purple/10 border-brand-purple/20"
    },
    {
      slug: "how-profile-intelligence-works",
      title: "How Profile Intelligence Works",
      desc: "Understand the algorithms behind LinkedIn SEO scoring, recruiter discoverability indices, and dream job skill matching.",
      author: "Datta Sable",
      date: "May 20, 2026",
      readTime: "7 min read",
      difficulty: "Beginner",
      category: "Profile Optimization",
      badgeColor: "text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20"
    }
  ];

  const featuredArticle = articles.find(art => art.featured) || articles[0];
  const regularArticles = articles.filter(art => !art.featured);

  const filteredArticles = regularArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setSubscribed(true);
      setEmail('');
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Blog Hero Banner */}
      <section className="relative w-full py-16 md:py-20 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[90px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <BookOpen size={12} className="text-brand-purple" />
            Creator Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            LinkedIn Growth Blog
          </h1>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-semibold leading-relaxed">
            Actionable guides on LinkedIn growth, personal branding, content strategy, profile optimization, creator analytics, and AI-powered audience building.
          </p>
        </div>
      </section>

      {/* Featured Guide Corner (Only shown when no search or category filters are active) */}
      {searchQuery === '' && activeCategory === 'All' && (
        <section className="w-full max-w-6xl px-4 pb-8 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 block mb-3 pl-2">
            Featured Guide
          </span>
          <div className="glass-panel rounded-3xl p-6 md:p-10 border border-brand-purple/20 bg-gradient-to-br from-brand-purple/[0.03] to-transparent flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 uppercase tracking-wider">
                  {featuredArticle.category}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  {featuredArticle.difficulty}
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                <Link href={`/blog/${featuredArticle.slug}`} className="hover:text-brand-purple transition-colors">
                  {featuredArticle.title}
                </Link>
              </h2>
              
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                {featuredArticle.desc}
              </p>

              <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-semibold pt-4">
                <span className="flex items-center gap-1"><User size={12} className="text-brand-purple" /> {featuredArticle.author}</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> {featuredArticle.date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {featuredArticle.readTime}</span>
              </div>
            </div>

            <div className="shrink-0 md:pl-6 w-full md:w-auto">
              <Link 
                href={`/blog/${featuredArticle.slug}`}
                className="w-full md:w-auto py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-purple/15 hover:opacity-95 hover:scale-[1.02] transition-all cursor-pointer"
              >
                Read Featured Article
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter Toolbar (Search & Categories) */}
      <section className="w-full max-w-6xl px-4 py-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between border-b border-card-border/40 pb-4">
          
          {/* Categories Grid/Wrap */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  activeCategory === cat 
                    ? "bg-brand-purple border-brand-purple text-white shadow-sm" 
                    : "bg-white dark:bg-[#141b22] border-card-border text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple transition-all font-semibold"
            />
          </div>
        </div>
      </section>

      {/* Regular Articles Grid */}
      <section className="w-full max-w-6xl px-4 py-4">
        {filteredArticles.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-zinc-500 text-xs font-semibold border border-card-border/60">
            No articles found matching your query/category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {filteredArticles.map((art, index) => (
              <div 
                key={index}
                className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:border-brand-purple/40 hover:-translate-y-0.5 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider inline-block ${art.badgeColor}`}>
                      {art.category}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase tracking-wider">
                      {art.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white leading-snug group-hover:text-brand-purple transition-colors">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h3>
                  
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    {art.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-card-border/50 mt-6 flex flex-col gap-3">
                  {/* Author & details */}
                  <div className="flex justify-between items-center text-[10px] text-zinc-400 font-semibold">
                    <div className="flex items-center gap-1">
                      <User size={12} className="text-brand-purple" />
                      <span>{art.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
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
          </div>
        )}
      </section>

      {/* Newsletter Signup Panel */}
      <section className="w-full max-w-4xl px-4 py-12 relative z-10">
        <div className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-brand-purple/5 to-brand-indigo/5 border-brand-purple/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Mail size={18} className="text-brand-purple animate-pulse" />
              Join 1,000+ professionals improving their LinkedIn strategy
            </h3>
            <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
              Get weekly growth insights, custom hook frameworks, simulated algorithm updates, and PostIQ platform announcements directly in your inbox.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            {subscribed ? (
              <div className="px-6 py-3.5 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-bold text-center animate-in zoom-in-95">
                ✓ Check your inbox to confirm your subscription!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your professional email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 text-xs rounded-xl bg-white dark:bg-[#141b22] border border-card-border focus:outline-none focus:border-brand-purple transition-all font-semibold min-w-[200px]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {subscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
