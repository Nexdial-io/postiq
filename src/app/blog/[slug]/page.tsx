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
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Heart,
  ChevronRight
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
    difficulty: string;
    category: string;
    intro: string;
    content: React.ReactNode;
    ctaText: string;
    ctaLink: string;
  }> = {
    "the-complete-linkedin-growth-playbook-2026": {
      title: "The Complete LinkedIn Growth Playbook for 2026",
      author: "Datta Sable",
      date: "June 20, 2026",
      readTime: "12 min read",
      difficulty: "Advanced",
      category: "LinkedIn Growth",
      intro: "Everything professionals, creators, founders, and job seekers need to know to build authority and grow visibility on LinkedIn. In this playbook, we'll break down the content patterns, engagement signals, and distribution factors that influence reach.",
      content: (
        <div className="space-y-4">
          <p>
            Scaling your visibility on LinkedIn in 2026 is no longer about raw publishing volume or hoping the algorithm favors your updates. With millions of creators competing for the same feed slots, success depends on understanding content structures, profile optimization, and user intent.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">1. Optimize the First 150 Characters (The Hook)</h4>
          <p>
            Your post's first two lines determine whether scrolling users will click "See More". If they don't click, the feed algorithm immediately flags the post as low-engagement and dampens its reach. Use pattern interrupts or statistical hooks to trigger this click.
          </p>
          <p>
            To check if your hook is strong enough, try testing your drafts in the <Link href="/analyzer" className="text-brand-purple font-bold hover:underline">AI Post Analyzer</Link>. It will audit your hook opening against virality models before you publish.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">2. Adopt a Recruiter-Friendly SEO Structure</h4>
          <p>
            If you are looking for roles or consulting clients, your profile must act as a landing page. Recruiters use Boolean queries to find candidates. If you lack critical keywords in your headline or experience bullets, your profile remains hidden.
          </p>
          <p>
            Audit your keyword density maps and search visibility targets using the <Link href="/profile-intelligence" className="text-brand-purple font-bold hover:underline">Profile Intelligence</Link> analyzer to find and close gaps instantly.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">3. Build Content Around Trending Opportunity Scores</h4>
          <p>
            Write about topics before they saturate. Our trends discoverer ranks industry trends by their opportunity score (search velocity vs. competitor density). Target emerging topics early to establish authority.
          </p>
        </div>
      ),
      ctaText: "Analyze Your First Draft Now",
      ctaLink: "/analyzer"
    },
    "linkedin-algorithm-trends-2026": {
      title: "LinkedIn Algorithm Breakdown: What Drives Organic Feed Reach in 2026",
      author: "Datta Sable",
      date: "June 18, 2026",
      readTime: "6 min read",
      difficulty: "Advanced",
      category: "Content Strategy",
      intro: "Outbound link updates and immediate comment replies are key in the 2026 LinkedIn distribution engine. Here is the technical breakdown of how to adapt your sharing strategies.",
      content: (
        <div className="space-y-4">
          <p>
            Most LinkedIn posts fail before they even get a chance to perform. Creators write high-quality copy but trigger algorithm penalties that cut their seed audience reach by half.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The Outbound Link Penalty</h4>
          <p>
            LinkedIn wants to keep users on their site. Pasting external links directly in the post body signals to the algorithm that users will leave. This lowers your initial feed weight.
          </p>
          <div className="p-4 rounded-2xl border border-brand-purple/10 bg-brand-purple/[0.01] my-4 space-y-2">
            <h5 className="font-bold text-xs text-brand-purple flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-brand-emerald" />
              SaaS Action Step:
            </h5>
            <p className="text-xs text-zinc-500 font-medium">
              Publish your post as text-only. Add your link in the comments, or direct readers to a link pinned in your profile's featured section.
            </p>
          </div>
          <p>
            You can verify your links and formatting score with the <Link href="/analyzer" className="text-brand-purple font-bold hover:underline">AI Post Analyzer</Link> to ensure formatting penalties are avoided.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">Immediate Conversational Loops</h4>
          <p>
            Feed distribution loops prioritize posts that generate comments within the first 60 minutes. Replying to comments quickly tells the algorithm the post is highly engaging, boosting organic impressions.
          </p>
        </div>
      ),
      ctaText: "Audit Post Formatting Risks",
      ctaLink: "/analyzer"
    },
    "ats-resume-keyword-optimization-guide": {
      title: "ATS and LinkedIn SEO: Optimizing Your Experiences Section for Recruiters",
      author: "PostIQ Editorial Team",
      date: "June 15, 2026",
      readTime: "8 min read",
      difficulty: "Beginner",
      category: "Profile Optimization",
      intro: "Hiring lookup tools rely on indexing parameters. Make your experience statements rank high in active searches.",
      content: (
        <div className="space-y-4">
          <p>
            When recruiters look for talent, they use complex search terms on LinkedIn Recruiter. If your profile is missing these target phrases, you're invisible.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The Experience statement XYZ Formula</h4>
          <p>
            Do not list passive tasks. Frame achievements using the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]."
          </p>
          <div className="p-4 rounded-2xl border border-brand-emerald/10 bg-brand-emerald/[0.01] my-4 text-xs text-zinc-500 font-semibold leading-relaxed">
            <span className="text-brand-emerald font-bold block mb-1">X-Y-Z Example:</span>
            "Improved dashboard processing speed by 40% (X) as measured by query response times (Y), by implementing PostgreSQL index adjustments (Z)."
          </div>
          <p>
            Run a search presence audit on the <Link href="/profile-intelligence" className="text-brand-purple font-bold hover:underline">Profile Intel</Link> workspace to find out which high-volume industry keywords are missing from your bio.
          </p>
        </div>
      ),
      ctaText: "Check Your Profile SEO Score",
      ctaLink: "/profile-intelligence"
    },
    "saas-founder-profile-views-case-study": {
      title: "How a SaaS Founder Increased Profile Views by 220%",
      author: "Datta Sable",
      date: "June 10, 2026",
      readTime: "7 min read",
      difficulty: "Intermediate",
      category: "Case Studies",
      intro: "A detailed breakdown of profile tweaks, positioning adjustments, and content loops that drove 220% growth in high-value page visits.",
      content: (
        <div className="space-y-4">
          <p>
            In this case study, we document how a B2B SaaS founder optimized their personal profile to turn passive impressions into high-intent inbound inquiries.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The Three Key Adjustments</h4>
          <ul className="list-disc list-inside space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <li><strong>Headline Rewrite:</strong> Changed from "Founder at SaaSCo" to "Building SaaS solutions that help marketing agencies automate reporting | Full-stack Engineer".</li>
            <li><strong>Featured Section Pinning:</strong> Pinned a direct product demonstration link instead of generic articles.</li>
            <li><strong>About Storytelling:</strong> Focused on the founder journey, problems solved, and client outcomes rather than feature lists.</li>
          </ul>
          <p>
            To rewrite your headline and about sections, use the AI copy generator inside the <Link href="/profile-intelligence" className="text-brand-purple font-bold hover:underline">Profile Intelligence Rewrite Studio</Link>.
          </p>
        </div>
      ),
      ctaText: "Open Profile Rewrite Studio",
      ctaLink: "/profile-intelligence"
    },
    "linkedin-hook-conversion-breakdown": {
      title: "From 500 to 15,000 Impressions: A LinkedIn Hook Breakdown",
      author: "PostIQ Editorial Team",
      date: "June 08, 2026",
      readTime: "5 min read",
      difficulty: "Beginner",
      category: "LinkedIn Growth",
      intro: "The first 150 characters determine your reach. We analyze 5 viral posts to see how pattern interrupts drive impressions.",
      content: (
        <div className="space-y-4">
          <p>
            Writing the body of your post is only half the battle. If your opener fails to stop the scroll, users skip it. Here are two hook strategies:
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">1. The Contrarian Hook</h4>
          <p>
            Interrupt expectations by challenging a common belief: "Stop trying to write daily LinkedIn updates. It's hurting your organic growth."
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">2. The Curiosity Hook</h4>
          <p>
            Introduce a metric and hold back the secret: "90% of creators fail to grow on LinkedIn because they miss this simple system..."
          </p>
          <p>
            Generate and test different templates in the <Link href="/hooks" className="text-brand-purple font-bold hover:underline">Hook Studio</Link> to compare their scroll stopper potential.
          </p>
        </div>
      ),
      ctaText: "Test Hooks Side-by-Side",
      ctaLink: "/hooks"
    },
    "analyzing-10000-linkedin-posts": {
      title: "What We Learned Analyzing 10,000 LinkedIn Posts",
      author: "Datta Sable",
      date: "June 05, 2026",
      readTime: "10 min read",
      difficulty: "Advanced",
      category: "Creator Economy",
      intro: "Data-driven research into length, emoji frequencies, reading level, and hook phrasing. Here is what the numbers say.",
      content: (
        <div className="space-y-4">
          <p>
            We analyzed 10,000 simulated post drafts to extract the core formatting and content patterns that drive engagement scores:
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">Key Insights</h4>
          <ul className="list-disc list-inside space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <li><strong>Optimal Paragraph Height:</strong> Paragraphs containing 1-2 lines perform 40% better than blocks of text.</li>
            <li><strong>Emoji Balance:</strong> Using 2-5 emojis maintains professional tone. Exceeding 8 emojis decreases authority ratings.</li>
            <li><strong>Clear CTA:</strong> Posts ending with a single context-aware question receive double the reply comments.</li>
          </ul>
          <p>
            Audit your drafts against these insights instantly on the <Link href="/analyzer" className="text-brand-purple font-bold hover:underline">AI Post Analyzer</Link>.
          </p>
        </div>
      ),
      ctaText: "Run Formatting Audit",
      ctaLink: "/analyzer"
    },
    "how-we-built-post-scoring-engine": {
      title: "How We Built a LinkedIn Post Scoring Engine",
      author: "Datta Sable",
      date: "June 02, 2026",
      readTime: "9 min read",
      difficulty: "Advanced",
      category: "AI & Marketing",
      intro: "An engineering deep dive into building content parsing systems, classifying hooks, and calculating simulated audience affinity indices.",
      content: (
        <div className="space-y-4">
          <p>
            Building the scoring engine for PostIQ involved translating professional writing guidelines into weighted heuristic algorithms.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The Algorithm Blueprint</h4>
          <p>
            Our core evaluator parses raw string data to assess character lengths, spacing ratios, hashtag counts, and matches hooks against patterns of curiosity or authority. This calculates a **Scroll Stopper Score** that estimates scroll retention.
          </p>
          <p>
            To understand how our engine weights each category, read the <Link href="/docs" className="text-brand-purple font-bold hover:underline">Scoring Methodology Documentation</Link>.
          </p>
        </div>
      ),
      ctaText: "Read Scoring Model Specs",
      ctaLink: "/docs"
    },
    "inside-postiq-hook-framework": {
      title: "Inside PostIQ's Hook Quality Framework",
      author: "PostIQ Editorial Team",
      date: "May 28, 2026",
      readTime: "6 min read",
      difficulty: "Intermediate",
      category: "Content Strategy",
      intro: "Why curiosity, contrarian, and authority hooks drive different audience actions, and how to balance them on your calendar.",
      content: (
        <div className="space-y-4">
          <p>
            Not all hooks are created equal. A curiosity hook works best for broad viral impressions, while an authority hook is essential to convert high-value buyers or recruiters.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">The 8 Key Hook Categories</h4>
          <p>
            PostIQ generates hooks across 8 key templates including Story, Statistic, Founder, and Contrarian. Keeping your content calendar balanced between these hooks maintains reader interest.
          </p>
          <p>
            Generate templates matching your brand on the <Link href="/hooks" className="text-brand-purple font-bold hover:underline">Hook Studio</Link>.
          </p>
        </div>
      ),
      ctaText: "Open Hook Studio",
      ctaLink: "/hooks"
    },
    "understanding-engagement-prediction-models": {
      title: "Understanding Engagement Prediction Models",
      author: "Datta Sable",
      date: "May 25, 2026",
      readTime: "8 min read",
      difficulty: "Intermediate",
      category: "AI & Marketing",
      intro: "How scoring parameters like CTA strength, readability level, and trend weights compute simulated feed performance.",
      content: (
        <div className="space-y-4">
          <p>
            PostIQ computes reach predictions by evaluating how well your draft conforms to formatting guidelines, active industry trends, and emotional hooks.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">Simulated Feedback Loops</h4>
          <p>
            A high score indicates strong optimization against established readability models, helping you spot failure risks before you publish.
          </p>
          <p>
            For a technical guide on programmatic integrations, check out the <Link href="/docs" className="text-brand-purple font-bold hover:underline">REST API Documentation</Link>.
          </p>
        </div>
      ),
      ctaText: "Check Developer Docs",
      ctaLink: "/docs"
    },
    "how-profile-intelligence-works": {
      title: "How Profile Intelligence Works",
      author: "Datta Sable",
      date: "May 20, 2026",
      readTime: "7 min read",
      difficulty: "Beginner",
      category: "Profile Optimization",
      intro: "A detailed guide to profile indexing, Boolean search terms match rates, and how keyword density maps to target roles.",
      content: (
        <div className="space-y-4">
          <p>
            Your LinkedIn profile is indexed by search engines. The Profile Intel engine evaluates your Headline, About summary, and Experiences list for search keyword coverage.
          </p>
          <h4 className="font-extrabold text-base text-zinc-800 dark:text-zinc-200 mt-6">Recruiter Visibility Index</h4>
          <p>
            This score simulates recruiter search matching, helping you identify missing high-volume skills in your profile copy.
          </p>
          <p>
            To run a profile audit and generate optimized headlines, check the <Link href="/profile-intelligence" className="text-brand-purple font-bold hover:underline">Profile Intelligence</Link> section.
          </p>
        </div>
      ),
      ctaText: "Audit Your LinkedIn Profile",
      ctaLink: "/profile-intelligence"
    }
  };

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
            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-semibold border-b border-card-border/50 pb-4">
              <span className="flex items-center gap-1"><User size={12} className="text-brand-purple" /> {article.author}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
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
    </div>
  );
}
