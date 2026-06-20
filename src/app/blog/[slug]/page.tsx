"use client";

import React, { use } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const articlesData: Record<string, {
    title: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    intro: string;
    content: React.ReactNode;
  }> = {
    "linkedin-algorithm-trends-2026": {
      title: "LinkedIn Algorithm Breakdown: What Drives Organic Feed Reach in 2026",
      author: "Alex Rivera",
      date: "June 18, 2026",
      readTime: "6 min read",
      category: "Algorithm Tips",
      intro: "Outbound link updates and immediate comment replies are key in the 2026 LinkedIn distribution engine. Here is the technical breakdown of how to adapt your sharing strategies.",
      content: (
        <div className="space-y-4">
          <p>
            LinkedIn's algorithm has undergone a major rewrite. The feed distribution engine is heavily penalizing outward links pasted directly into the body text.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The Outbound Link Penalty</h4>
          <p>
            When you insert an external link directly into a post body, the feed processor flags the post as a 'churn risk' (redirecting users off the LinkedIn website). This lowers the initial seed audience visibility by up to 60%.
          </p>
          <div className="p-4 rounded-2xl border border-brand-purple/10 bg-brand-purple/[0.01] my-4 space-y-2">
            <h5 className="font-bold text-xs text-brand-purple">Best Practice Rule:</h5>
            <p className="text-xs text-zinc-500 font-medium">
              Publish your post with clean formatting, then add the link as the very first comment, or write a post directing users to click the link in your profile featured section.
            </p>
          </div>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">Immediate Comment Responses</h4>
          <p>
            The distribution loops prioritize posts that generate active conversations. Replying to comments within the first 60 minutes of publishing tells the algorithm the creator is engaged, increasing seed reach by up to 25%.
          </p>
        </div>
      )
    },
    "mastering-curiosity-hooks-for-ctr": {
      title: "Mastering Curiosity Hooks: How to Double Your Post 'See More' Click Rate",
      author: "Sarah Chen",
      date: "June 12, 2026",
      readTime: "5 min read",
      category: "Content Strategy",
      intro: "Disrupt the feed and increase authority clicks. Opener frameworks are key to unlocking LinkedIn organic reach.",
      content: (
        <div className="space-y-4">
          <p>
            The first 150 characters of a post determine its success. If a user scrolling the feed does not click the 'see more' button, LinkedIn marks the post as low-value, preventing it from reaching secondary networks.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The Hook Frameworks</h4>
          <ul className="space-y-3 pl-2 mt-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
              <span><strong>Curiosity hooks:</strong> Introduce an unexpected metric combined with a mystery shift (e.g. '90% of professionals fail at this. Here is the shift...').</span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
              <span><strong>Contrarian hooks:</strong> Break industry echo-chambers with a pattern interrupt (e.g. 'Stop trying to learn marketing the traditional way. It's holding you back.').</span>
            </li>
            <li className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
              <span><strong>Authority hooks:</strong> Lead with credibility proofs (e.g. 'After engineering data pipelines handling $10M+ in volume, this is my blueprint...').</span>
            </li>
          </ul>
        </div>
      )
    },
    "ats-resume-keyword-optimization-guide": {
      title: "ATS and LinkedIn SEO: Optimizing Your Experiences Section for Recruiters",
      author: "Datta Sable",
      date: "June 05, 2026",
      readTime: "8 min read",
      category: "Career & SEO",
      intro: "Recruitment lookup tools rely on indexing parameters. Make your experience statements rank high in active searches.",
      content: (
        <div className="space-y-4">
          <p>
            When recruiters search for candidates, they use advanced Boolean search queries (e.g., 'React' AND 'TypeScript' AND 'Next.js'). If your profile doesn't contain these key terms, you won't appear in the results, regardless of your talent.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The Experience Bullet Formula</h4>
          <p>
            Instead of writing lists of responsibilities, focus on numerical achievements. Use the Google X-Y-Z formula:
          </p>
          <div className="p-4 rounded-2xl border border-brand-emerald/10 bg-brand-emerald/[0.01] text-xs leading-normal text-zinc-500 font-semibold my-4">
            <span className="text-brand-emerald font-bold block mb-1">X-Y-Z Formula:</span>
            "Accomplished [X] as measured by [Y], by doing [Z]."
            <br className="mb-2" />
            <em className="text-zinc-400 mt-1 block">Example: "Optimized dashboard data processing speed by 40% (X) as measured by latency reductions (Y) by refactoring PostgreSQL indexes (Z)."</em>
          </div>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">Missing Keyword Gap Audits</h4>
          <p>
            Ensure relevant skills are listed in your Skills section. These are indexed heavily by search systems. Use the [Dream Job Match Analyzer](file:///d:/Linked%20In/frontend-nextjs/src/app/profile-intelligence) to compare your profile details directly against target description keywords.
          </p>
        </div>
      )
    }
  };

  const article = articlesData[slug] || {
    title: "Article Not Found",
    author: "Unknown",
    date: "N/A",
    readTime: "0 min",
    category: "General",
    intro: "We were unable to locate the requested blog post.",
    content: <p>Please go back and select a different article.</p>
  };

  return (
    <div className="w-full flex flex-col items-center">
      <section className="w-full max-w-3xl px-4 py-8 space-y-6 animate-in fade-in duration-300">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-brand-purple transition-all"
        >
          <ArrowLeft size={14} />
          Back to Creator Blog
        </Link>

        {/* Article Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-6 border border-card-border/70">
          <div className="space-y-4">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 uppercase tracking-wider inline-block">
              {article.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-snug">
              {article.title}
            </h1>
            
            {/* Meta details */}
            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold border-b border-card-border/50 pb-4">
              <span className="flex items-center gap-1"><User size={12} className="text-brand-purple" /> {article.author}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 italic font-semibold leading-relaxed border-l-2 border-brand-purple pl-4 my-4">
            "{article.intro}"
          </p>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {article.content}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="glass-panel rounded-3xl p-6 bg-gradient-to-r from-brand-purple/5 to-brand-indigo/5 border-card-border text-center space-y-4">
          <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">Want to test your own post drafts or profile headline?</h4>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02]"
          >
            Launch Platform Demo
            <ArrowRight size={13} />
          </Link>
        </div>

      </section>
    </div>
  );
}
