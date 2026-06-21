import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Heart,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { articlesData } from '@/lib/blogData';


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = articlesData[slug];

  if (!article) {
    return {
      title: "Article Not Found | PostIQ",
    };
  }

  return {
    title: `${article.title} | PostIQ`,
    description: article.intro,
    alternates: {
      canonical: `https://postiq.nexdial.io/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.intro,
      url: `https://postiq.nexdial.io/blog/${slug}`,
      type: "article",
      images: [
        {
          url: "/og-image.png",
          alt: article.title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.intro,
    }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const article = articlesData[slug];

  if (!article) {
    return (
      <div className="w-full flex flex-col items-center py-16">
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md border border-card-border/60">
          <h2 className="text-xl font-bold">Article Not Found</h2>
          <p className="text-xs text-zinc-500 font-semibold">We were unable to locate the requested blog post.</p>
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-purple hover:underline">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Related Articles: Find 3 other articles, prioritizing the same category
  const allArticles = Object.entries(articlesData).map(([s, data]) => ({
    slug: s,
    title: data.title,
    category: data.category,
    readTime: data.readTime,
    difficulty: data.difficulty
  }));

  const relatedArticles = allArticles
    .filter(art => art.slug !== slug)
    .sort((a, b) => (a.category === article.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="w-full flex flex-col items-center pb-16">
      <section className="w-full max-w-3xl px-4 py-8 space-y-6 animate-in fade-in duration-300">
        
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-brand-purple transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          Back to Creator Blog
        </Link>

        {/* Article Card */}
        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-6 border border-card-border/70">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 uppercase tracking-wider inline-block">
                {article.category}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                {article.difficulty}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white leading-snug">
              {article.title}
            </h1>
            
            {/* Meta details */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 font-semibold border-b border-card-border/50 pb-4">
              <span className="flex items-center gap-1">
                <User size={12} className="text-brand-purple" /> 
                {article.author} ({article.authorRole})
              </span>
              <span className="flex items-center gap-1"><Calendar size={12} /> Published: {article.date}</span>
              <span className="flex items-center gap-1"><Calendar size={12} className="opacity-70" /> Updated: {article.updatedDate}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-300 italic font-semibold leading-relaxed border-l-2 border-brand-purple pl-4 my-4">
            "{article.intro}"
          </p>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-semibold">
            {article.content}
          </div>
        </div>

        {/* Author Bio Card for EEAT */}
        {article.author === "Datta Sable" && (
          <div className="glass-panel rounded-3xl p-6 border border-card-border/60 flex flex-col sm:flex-row items-center gap-4 bg-black/[0.01] dark:bg-white/[0.01] my-8 text-left">
            <img src="/author.png" alt="Datta Sable" className="w-12 h-12 rounded-full object-cover border border-brand-purple/30 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">Datta Sable</h4>
              <p className="text-[10px] text-zinc-500 font-semibold">Founder & Lead Architect, PostIQ</p>
              <p className="text-[10px] text-zinc-650 dark:text-zinc-400 font-medium leading-relaxed font-semibold">
                Datta Sable is the Founder & Lead Architect of PostIQ. As an active software builder and creator, he designs advisory frameworks to help professionals optimize content reach and LinkedIn search presence.
              </p>
            </div>
          </div>
        )}

        {/* Product-Led CTA */}
        <div className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-brand-purple/5 to-brand-indigo/5 border-brand-purple/20 text-center space-y-4">
          <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">Want to test your own post drafts or profile SEO keywords?</h4>
          <p className="text-xs text-zinc-500 max-w-md mx-auto font-medium">
            PostIQ unifies scroll stopper hook scoring, profile keyword audits, calendar scheduling, and audience affinity index simulations.
          </p>
          <Link
            href={article.ctaLink}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            {article.ctaText}
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Related Reading Section */}
        <div className="pt-8 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 pl-2">
            Related Reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((art, aIdx) => (
              <Link 
                key={aIdx} 
                href={`/blog/${art.slug}`}
                className="glass-panel rounded-2xl p-4 space-y-2 border border-card-border/60 hover:border-brand-purple/20 transition-all block group"
              >
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase tracking-wider inline-block">
                  {art.category}
                </span>
                <h4 className="font-bold text-xs text-zinc-850 dark:text-zinc-200 leading-snug group-hover:text-brand-purple transition-colors">
                  {art.title}
                </h4>
                <div className="flex justify-between items-center text-[9px] text-zinc-400 pt-1 font-semibold">
                  <span>{art.difficulty}</span>
                  <span>{art.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>

      {/* Dynamic BlogPosting & BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "headline": article.title,
                "description": article.intro,
                "datePublished": article.date,
                "dateModified": article.updatedDate,
                "author": {
                  "@type": "Person",
                  "name": article.author,
                  "jobTitle": article.authorRole,
                  "url": "https://www.linkedin.com/in/dattasable/"
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "PostIQ",
                  "logo": "https://postiq.nexdial.io/postiq-icon.png"
                },
                "mainEntityOfPage": `https://postiq.nexdial.io/blog/${slug}`
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://postiq.nexdial.io"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Blog",
                    "item": "https://postiq.nexdial.io/blog"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": article.title,
                    "item": `https://postiq.nexdial.io/blog/${slug}`
                  }
                ]
              }
            ]
          })
        }}
      />
    </div>
  );
}
