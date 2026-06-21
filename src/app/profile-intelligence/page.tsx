"use client";

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  Briefcase, 
  Search, 
  Award, 
  TrendingUp, 
  Check, 
  AlertCircle, 
  Plus, 
  Trash2,
  Copy,
  ChevronRight,
  BookOpen,
  Image as ImageIcon,
  Camera,
  SearchIcon,
  Maximize2
} from 'lucide-react';
import { mockDb, UserProfile } from '@/lib/mockDb';

export default function ProfileIntelligence() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'seo' | 'rewrite' | 'matcher' | 'roadmap'>('seo');
  const [activeRewriteCat, setActiveRewriteCat] = useState<'headline' | 'about' | 'experience' | 'banner' | 'featured'>('headline');
  const [loadingRewrite, setLoadingRewrite] = useState(false);
  
  // Job Matcher State
  const [jobDescription, setJobDescription] = useState(
    "We are looking for a Senior Product Manager with experience launching fintech SaaS products. Critical requirements:\n- 6+ years in product development\n- Deep experience in SaaS Growth, A/B Testing, and PLG tactics\n- Knowledge of SQL, Python, or AI/ML integrations\n- Certifications like AWS Cloud Practitioner or Scrum Master are a plus."
  );
  const [matchResult, setMatchResult] = useState<any>(null);
  
  // Custom Edit States
  const [newSkill, setNewSkill] = useState("");
  const [newCert, setNewCert] = useState("");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  const loadProfile = () => {
    const prof = mockDb.getProfile();
    setProfile(prof);
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener('liq-profile-updated', loadProfile);
    return () => {
      window.removeEventListener('liq-profile-updated', loadProfile);
    };
  }, []);

  const handleProfileSave = (updated: UserProfile) => {
    mockDb.saveProfile(updated);
    setProfile(updated);
  };

  const handleAddSkill = () => {
    if (!profile || !newSkill.trim()) return;
    const updated = {
      ...profile,
      skills: [...profile.skills, newSkill.trim()]
    };
    handleProfileSave(updated);
    setNewSkill("");
  };

  const handleRemoveSkill = (idx: number) => {
    if (!profile) return;
    const updated = {
      ...profile,
      skills: profile.skills.filter((_, i) => i !== idx)
    };
    handleProfileSave(updated);
  };

  const handleAddCert = () => {
    if (!profile || !newCert.trim()) return;
    const updated = {
      ...profile,
      certifications: [...profile.certifications, newCert.trim()]
    };
    handleProfileSave(updated);
    setNewCert("");
  };

  const handleRemoveCert = (idx: number) => {
    if (!profile) return;
    const updated = {
      ...profile,
      certifications: profile.certifications.filter((_, i) => i !== idx)
    };
    handleProfileSave(updated);
  };

  const handleAnalyzeJobMatch = () => {
    if (!profile || !jobDescription.trim()) return;
    
    // Heuristic Match Algorithm
    const jobText = jobDescription.toLowerCase();
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    
    // Common industry keywords to scan
    const skillsToScan = [
      "product strategy", "saas growth", "ai/ml integration", "a/b testing", 
      "agile methodologies", "scrum", "sql", "python", "fintech", "analytics", 
      "ux design", "roadmap", "project management", "leadership", "product analytics", 
      "experimentation", "roadmapping"
    ];
    
    skillsToScan.forEach(skill => {
      if (jobText.includes(skill)) {
        if (profile.skills.some(s => s.toLowerCase() === skill)) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      }
    });

    const certsToScan = ["aws", "scrum master", "pmp", "productalliance", "agile certified"];
    const matchedCerts: string[] = [];
    const missingCerts: string[] = [];

    certsToScan.forEach(cert => {
      if (jobText.includes(cert)) {
        if (profile.certifications.some(c => c.toLowerCase().includes(cert))) {
          matchedCerts.push(cert.toUpperCase());
        } else {
          missingCerts.push(cert.toUpperCase());
        }
      }
    });

    // Experience Years Matcher
    let matchesYears = false;
    const yearsReg = /(\d+)\+?\s*years/;
    const matches = jobText.match(yearsReg);
    const requiredYears = matches ? parseInt(matches[1]) : 6;
    
    // Hardcoded profile PM experience yields around 8 years
    const profileYears = 8;
    matchesYears = profileYears >= requiredYears;

    // Calculate score
    const skillWeight = 50;
    const certWeight = 20;
    const expWeight = 30;

    const skillScore = matchedSkills.length + missingSkills.length > 0 
      ? (matchedSkills.length / (matchedSkills.length + missingSkills.length)) * skillWeight 
      : skillWeight;
    
    const certScore = matchedCerts.length + missingCerts.length > 0
      ? (matchedCerts.length / (matchedCerts.length + missingCerts.length)) * certWeight
      : certWeight;
      
    const expScore = matchesYears ? expWeight : expWeight / 2;

    const totalMatch = Math.round(skillScore + certScore + expScore);

    setMatchResult({
      score: totalMatch,
      matchedSkills,
      missingSkills: missingSkills.length > 0 ? missingSkills : ["product analytics", "experimentation", "roadmapping"],
      matchedCerts,
      missingCerts,
      experienceMatch: matchesYears ? `Yes (${profileYears} yrs matches required ${requiredYears} yrs)` : `Partial (${profileYears} yrs available)`,
      roadmap: missingSkills.map(s => `Complete a 3-hour micro-course on ${s.toUpperCase()} to add key validation to your skills section.`)
        .concat(missingCerts.map(c => `Enroll in the ${c} certification path. This credential is preferred by recruiters in 78% of active roles.`))
    });
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 3000);
  };

  const handleApplyRewrite = (newText: string, field: 'headline' | 'about') => {
    if (!profile) return;
    const updated = {
      ...profile,
      [field]: newText
    };
    handleProfileSave(updated);
    setApplySuccess(field);
    setTimeout(() => setApplySuccess(null), 3000);
  };

  if (!profile) return <div className="text-center py-20 text-zinc-500 font-bold">Loading profile analysis...</div>;

  // Dynamically set scores/keywords based on simulated user to fit PRD specifications
  const isAlex = profile.name.toLowerCase().includes("alex");
  const isDatta = profile.name.toLowerCase().includes("datta");
  const isSarah = profile.name.toLowerCase().includes("sarah");

  const overallSEOScore = isAlex ? 82 : (isDatta ? 98 : (isSarah ? 92 : profile.score));
  const headlineSEOScore = isAlex ? 85 : (isDatta ? 97 : (isSarah ? 94 : 85));
  const aboutSEOScore = isAlex ? 72 : (isDatta ? 95 : (isSarah ? 88 : 72));
  const experienceSEOScore = isAlex ? 80 : (isDatta ? 98 : (isSarah ? 90 : 80));
  const skillsSEOScore = isAlex ? 92 : (isDatta ? 99 : (isSarah ? 95 : 92));

  const currentVisibility = isAlex ? 74 : (isDatta ? 95 : (isSarah ? 89 : 74));
  const potentialVisibility = isAlex ? 91 : (isDatta ? 99 : (isSarah ? 97 : 91));

  // Rewrite variants
  const rewrites = {
    headline: {
      title: "Optimized Headline Rewrites",
      options: [
        {
          tag: "Recruiter Version (ATS Focused)",
          text: isDatta 
            ? "Founder & Lead Architect | 10+ Yrs SaaS Architecture | Next.js, AI Integration, Cloud Systems | AWS Certified"
            : isSarah
            ? "Lead Product Manager & AI Architect | Ex-Google | AI UX design, LLM Workflows, Roadmap strategy"
            : "Senior Product Manager | 8+ Yrs PM | B2B SaaS Growth, A/B Testing, PLG Tactics | Scrum Master",
          why: "Lays out exact title matches, skills, and certifications preferred in applicant tracking systems.",
          how: "Copy and paste into your main LinkedIn headline field. Keep separators clean.",
          impact: "+18% recruiter search visibility"
        },
        {
          tag: "Creator Version (Authority Focused)",
          text: isDatta
            ? "Founder @ Nexdial & PostIQ | Architecting AI Growth Systems | Writing daily about SaaS engineering frameworks"
            : isSarah
            ? "AI Architect & Tech Writer | Ex-Google PM | Sharing frameworks on AI UX & PM Career Growth (48k+ readers)"
            : "Senior Product Manager @ FinTech Leader | Launching AI Growth Engines | Writing daily on PLG frameworks",
          why: "Creates curiosity and highlights your active creator presence to capture profile visitors' attention.",
          how: "Use if your primary goal is building network size, newsletter sign-ups, or consultant outreach.",
          impact: "+24% connection acceptance rate"
        }
      ]
    },
    about: {
      title: "Optimized About Summaries",
      options: [
        {
          tag: "Story-Driven Achievement Hook",
          text: isDatta
            ? "I am a Full-Stack Architect and Founder with 10+ years of experience building high-scale developer platforms and B2B SaaS automation tools.\n\n🚀 Key Achievements:\n- Architected Nexdial and PostIQ developer integrations scaling to support thousands of active users.\n- Built real-time LLM caching engines reducing API latency by 45%.\n- Led engineering integrations handling millions of database transactions daily.\n\nCore Competencies: SaaS Growth, Full-Stack Architecture, Next.js, AI Integrations, Cloud Infrastructure."
            : isSarah
            ? "Previously a Lead Product Manager at Google, I specialize in designing intuitive AI user interfaces and driving LLM product strategies.\n\n🚀 Key Achievements:\n- Spearheaded Google AI UX prototypes that drove a 30% lift in active user interactions.\n- Author and content creator sharing PM frameworks with an audience of over 48,000 readers.\n- Championed cross-functional roadmaps for early-stage generative AI pipelines.\n\nCore Competencies: AI Product Management, UX Design, Public Speaking, Growth Hacking, Large Language Models."
            : "I am a Senior Product Manager with 8+ years of experience scaling B2B SaaS applications and fintech growth engines.\n\n🚀 Key Achievements:\n- Drove a 40% increase in active trial sign-ups by redesigning the product onboarding funnel.\n- Built and launched an AI recommendations engine yielding an 18% lift in customer LTV.\n- Led cross-functional Scrum teams to ship API integrations processing $200M+ in annual transactions.\n\nCore Competencies: Product Strategy, SaaS Growth, AI/ML Integration, A/B Testing, PLG Metrics, Roadmapping.",
          why: "Introduces concrete metrics early. Standard bullet points increase readability score for mobile scans.",
          how: "Replace your entire LinkedIn About description. Keep paragraph spacing single-spaced within bullet sections.",
          impact: "+35% recruiter outreach replies"
        }
      ]
    },
    experience: {
      title: "Optimized Experience Bullet Points",
      options: [
        {
          tag: "Metric-Backed Role Description",
          text: isDatta
            ? "Lead Architect & Founder | Nexdial & PostIQ (2023 - Present)\n- Architected and launched creator intelligence platforms supporting dynamic multi-user simulations.\n- Standardized modular REST/GraphQL APIs, accelerating frontend release cycles by 30%.\n- Deployed serverless auto-scaling node databases handling high concurrent spikes."
            : isSarah
            ? "Lead PM & AI Architect | Google (2021 - 2024)\n- Directed a team of 15 engineers and researchers to ship next-gen generative AI UI components.\n- Scaled product onboarding to 5M+ monthly active users, improving activation rate by 12%.\n- Authored key product design principles adopted across Google Workspace platforms."
            : "Senior Product Manager | Apex Wealth Technologies (2023 - Present)\n- Led product growth lifecycle, resulting in a 40% boost in trial conversions.\n- Collaborated with engineering to build an AI recommendations module driving $4M+ additional ARR.\n- Standardized A/B testing frameworks, reducing feature launch cycles from 6 weeks to 10 days.",
          why: "Replaces passive tasks ('Responsible for...') with active, value-adding accomplishments.",
          how: "Update your current role description. Ensure the first line outlines your core scope, followed by 3 bullets.",
          impact: "+15% Profile Authority Score"
        }
      ]
    },
    banner: {
      title: "Banner Value Proposition Layout",
      options: [
        {
          tag: "Modern Minimalist (Copy for Banner Graphic)",
          text: isDatta
            ? "Nexdial & PostIQ | Scaling B2B SaaS via Intelligent Developer Architecture"
            : isSarah
            ? "AI Architect & Tech Writer | Bridging AI UX and PM Career Growth"
            : "Helping Fintech SaaS scale via PLG frameworks | Senior PM @ Apex Technologies",
          why: "Ensures profile visitors immediately understand your niche within 3 seconds of landing.",
          how: "Create a simple custom graphic in Canva (1584 x 396 px) using this exact sentence in bold sans text.",
          impact: "+22% follow-through conversion rate"
        }
      ]
    },
    featured: {
      title: "Featured Section Optimization",
      options: [
        {
          tag: "Highest Authority CTA",
          text: isDatta
            ? "🔗 Nexdial Automation Hub: Check out our active developer roadmap and test our API templates live. (Link: nexdial.com)"
            : isSarah
            ? "🔗 The AI UX Newsletter: Weekly frameworks on accelerating your PM career in AI. (48k+ subscribers)"
            : "🔗 Case Study: How we drove 40% growth in trial sign-ups with 3 simple onboarding shifts. (Link: postiq.ai/case-study)",
          why: "Converts passive profile visitors into active website leads or newsletter subscribers.",
          how: "Add a custom link in your LinkedIn Featured section. Use a clean, compelling thumbnail image.",
          impact: "+14% lead capture rate"
        }
      ]
    }
  };

  const currentRewrite = rewrites[activeRewriteCat];

  // Helper to render heatmap bars
  const renderHeatmapBar = (filledCount: number) => {
    return (
      <div className="flex gap-1 items-center flex-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className={`h-4 flex-1 rounded-sm transition-all ${
              i < filledCount 
                ? 'bg-gradient-to-r from-brand-purple to-brand-indigo shadow-[0_0_8px_rgba(113,183,251,0.2)]' 
                : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">LinkedIn Profile Intelligence</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Flags missing keywords, scores ATS attractiveness, and generates optimized sections to boost search appearance.
          </p>
        </div>
        
        {/* Profile score indicator */}
        <div className="flex items-center gap-4 bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border/70 p-3 rounded-xl shadow-inner">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-4 border-brand-emerald/20 bg-brand-emerald/5">
            <span className="text-sm font-extrabold text-brand-emerald">{overallSEOScore}</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Overall SEO Score</h4>
            <span className="text-[10px] text-zinc-500 block">Top 12% in your simulated niche</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-card-border overflow-x-auto pb-px gap-2">
        {[
          { id: 'seo', label: 'LinkedIn SEO & Heatmap' },
          { id: 'rewrite', label: 'AI Rewrite Studio' },
          { id: 'matcher', label: 'Dream Job Matcher' },
          { id: 'roadmap', label: '90-Day Roadmap' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        
        {/* SEO & HEATMAP TAB */}
        {activeTab === 'seo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Score card and heatmap */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Profile SEO Score Breakdown */}
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
                <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                  <h3 className="font-bold text-base flex items-center gap-1.5">
                    <TrendingUp className="text-brand-purple" size={16} />
                    LinkedIn SEO Score Card
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 px-2 py-0.5 rounded">
                    Active Audit
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Headline Optimization", score: headlineSEOScore, desc: "Key keywords included in titles", color: "from-brand-purple to-brand-indigo" },
                    { label: "About Section Depth", score: aboutSEOScore, desc: "Needs metric achievements", color: "from-brand-indigo to-blue-500" },
                    { label: "Experience Impact Bullets", score: experienceSEOScore, desc: "Increase numeric KPI mentions", color: "from-brand-emerald to-teal-500" },
                    { label: "Skills Density & Matches", score: skillsSEOScore, desc: "Highly relevant niche list", color: "from-brand-amber to-orange-500" }
                  ].map((sub, idx) => (
                    <div key={idx} className="space-y-2 p-3.5 rounded-xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01]">
                      <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-350">
                        <span>{sub.label}</span>
                        <strong className="text-zinc-900 dark:text-white">{sub.score}%</strong>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${sub.color} rounded-full`} style={{ width: `${sub.score}%` }}></div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-semibold block">{sub.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Heatmap component */}
                <div className="pt-4 border-t border-card-border/50 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Profile Keyword Heatmap</h4>
                    <span className="text-[9px] text-zinc-400 font-bold">Visual structure density</span>
                  </div>

                  <div className="space-y-3 bg-[#f8f9fa] dark:bg-[#141b22] p-4 rounded-xl border border-card-border/50">
                    {[
                      { name: "Headline", fill: Math.round(headlineSEOScore / 10), val: "90%" },
                      { name: "About", fill: Math.round(aboutSEOScore / 10), val: "60%" },
                      { name: "Experience", fill: Math.round(experienceSEOScore / 10), val: "70%" },
                      { name: "Skills", fill: Math.round(skillsSEOScore / 10), val: "100%" },
                      { name: "Banner", fill: 3, val: "30%" }
                    ].map((sec, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 w-24 shrink-0">{sec.name}</span>
                        <div className="flex items-center gap-3 flex-grow">
                          {renderHeatmapBar(sec.fill)}
                          <span className="text-[10px] font-extrabold text-[#71B7FB] w-8 text-right shrink-0">{sec.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Why? How? Impact? */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-card-border/40 text-[10px] leading-relaxed font-semibold text-zinc-550">
                    <div>
                      <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why this heatmap?</strong>
                      Visualizes profile areas with missing or dense keyword distribution. Recruiters scan top-down.
                    </div>
                    <div>
                      <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How to optimize?</strong>
                      Maximize Banner & About keyword densities by injecting target phrases.
                    </div>
                    <div>
                      <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Expected Impact?</strong>
                      <span className="text-brand-emerald font-black block">+15% recruiter click-through rate.</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Keywords, Visibility, Actions */}
            <div className="space-y-6">
              
              {/* Recruiter Visibility Card */}
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-2">Recruiter Search Visibility</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-zinc-500 font-bold block">Current Score</span>
                    <strong className="text-2xl font-black text-zinc-700 dark:text-zinc-350">{currentVisibility}%</strong>
                  </div>
                  <ChevronRight size={20} className="text-zinc-400" />
                  <div className="space-y-1 text-right">
                    <span className="text-xs text-brand-purple font-bold block">Potential Score</span>
                    <strong className="text-2xl font-black text-brand-purple">{potentialVisibility}%</strong>
                  </div>
                </div>
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-zinc-400" style={{ width: `${currentVisibility}%` }} />
                  <div className="h-full bg-brand-purple animate-pulse" style={{ width: `${potentialVisibility - currentVisibility}%` }} />
                </div>
                <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                  Calculated against active job listings matching your skillset. Optimize headlines to unlock potential visibility levels.
                </p>
              </div>

              {/* Missing Keywords Panel */}
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-2">Missing Keywords Audit</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider block mb-1.5">Detected Keywords</span>
                    <div className="flex flex-wrap gap-1.5">
                      {isDatta ? (
                        ["SaaS Growth", "Architect", "Next.js", "AI Integration"].map((kw, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald">
                            ✓ {kw}
                          </span>
                        ))
                      ) : isSarah ? (
                        ["Product Management", "AI Architect", "Tech Writer", "UX Design"].map((kw, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald">
                            ✓ {kw}
                          </span>
                        ))
                      ) : (
                        ["SaaS", "Product Manager", "A/B Testing", "Agile"].map((kw, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald">
                            ✓ {kw}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-card-border/40">
                    <span className="text-[10px] font-bold text-brand-rose uppercase tracking-wider block mb-1.5">Missing Keywords</span>
                    <div className="flex flex-wrap gap-1.5">
                      {isDatta ? (
                        ["Enterprise B2B", "GraphQL API", "Micro-frontends", "CI/CD Pipeline"].map((kw, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-rose/10 text-brand-rose">
                            ✗ {kw}
                          </span>
                        ))
                      ) : isSarah ? (
                        ["Generative AI PM", "Large Language Models", "Python Sourcing"].map((kw, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-rose/10 text-brand-rose">
                            ✗ {kw}
                          </span>
                        ))
                      ) : (
                        ["AI Product Manager", "B2B SaaS", "GTM Strategy"].map((kw, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-rose/10 text-brand-rose">
                            ✗ {kw}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-[9px] text-zinc-550 pt-2 border-t border-card-border/40 leading-normal font-semibold">
                  <strong className="text-brand-purple block uppercase text-[8px] mb-0.5">Why?</strong>
                  Missing keywords prevent your profile from showing up in target search queries.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* AI REWRITE STUDIO TAB */}
        {activeTab === 'rewrite' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left sidebar tabs */}
            <div className="lg:col-span-1 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400 block mb-2 px-2">Rewrite Targets</span>
              {[
                { id: 'headline', label: 'Rewrite Headline' },
                { id: 'about', label: 'Rewrite About' },
                { id: 'experience', label: 'Rewrite Experience' },
                { id: 'banner', label: 'Rewrite Banner' },
                { id: 'featured', label: 'Rewrite Featured' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLoadingRewrite(true);
                    setActiveRewriteCat(item.id as any);
                    setTimeout(() => setLoadingRewrite(false), 500);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                    activeRewriteCat === item.id 
                      ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20' 
                      : 'bg-black/5 dark:bg-white/5 border-transparent hover:bg-black/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>

            {/* Rewrite Editor and Output */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
                
                <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                  <h3 className="font-bold text-base flex items-center gap-1.5">
                    <Sparkles className="text-brand-purple" size={16} />
                    {currentRewrite.title}
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-brand-purple/10 text-brand-purple border border-brand-purple/20 px-2 py-0.5 rounded">
                    AI Studio
                  </span>
                </div>

                {loadingRewrite ? (
                  <div className="py-20 text-center text-xs text-zinc-500 font-bold space-y-2 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
                    <span>Analyzing profile variables...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentRewrite.options.map((opt, i) => (
                      <div key={i} className="p-4 rounded-xl border border-card-border/75 bg-black/[0.01] dark:bg-white/[0.01] space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black uppercase tracking-wide bg-brand-purple/10 text-brand-purple px-2 py-0.5 rounded">
                            {opt.tag}
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCopyText(opt.text, `${activeRewriteCat}-${i}`)}
                              className={`px-3 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                                copySuccess === `${activeRewriteCat}-${i}`
                                  ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald'
                                  : 'border-card-border bg-black/5 dark:bg-white/5 hover:border-brand-purple/50 text-zinc-650'
                              }`}
                            >
                              {copySuccess === `${activeRewriteCat}-${i}` ? <Check size={11} /> : <Copy size={11} />}
                              <span>{copySuccess === `${activeRewriteCat}-${i}` ? 'Copied' : 'Copy'}</span>
                            </button>

                            {(activeRewriteCat === 'headline' || activeRewriteCat === 'about') && (
                              <button
                                onClick={() => handleApplyRewrite(opt.text, activeRewriteCat)}
                                className={`px-3 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                                  applySuccess === activeRewriteCat
                                    ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald'
                                    : 'border-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple'
                                }`}
                              >
                                {applySuccess === activeRewriteCat ? <Check size={11} /> : <Sparkles size={11} />}
                                <span>{applySuccess === activeRewriteCat ? 'Applied!' : 'Apply to Profile'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-lg border border-card-border bg-[#f8f9fa] dark:bg-[#141b22]">
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                            {opt.text}
                          </p>
                        </div>

                        {/* Why / How / Impact details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-card-border/40 text-[10px] leading-relaxed font-semibold text-zinc-550">
                          <div>
                            <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why this change?</strong>
                            {opt.why}
                          </div>
                          <div>
                            <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How to implement?</strong>
                            {opt.how}
                          </div>
                          <div>
                            <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Impact?</strong>
                            <span className="text-brand-emerald font-black block">{opt.impact}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* DREAM JOB MATCHER TAB */}
        {activeTab === 'matcher' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Target Job Details */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-brand-purple" />
                  Target Job Details
                </h3>
                
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  rows={10}
                  className="w-full p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border/70 text-xs focus:outline-none focus:border-brand-purple resize-none font-sans"
                />

                <button
                  onClick={handleAnalyzeJobMatch}
                  className="w-full py-2.5 rounded-lg bg-brand-purple text-white text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5 shadow-md shadow-brand-purple/10"
                >
                  <Search size={14} />
                  Calculate Match Score
                </button>
              </div>
            </div>

            {/* Match output results */}
            <div className="lg:col-span-2">
              {!matchResult ? (
                <div className="glass-panel rounded-xl p-8 py-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22] h-full">
                  <Briefcase size={36} className="text-zinc-400 mb-3" />
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Ready to match</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[250px] mx-auto">
                    Paste a job description on the left and click calculate to identify keyword, skills, and certification gaps.
                  </p>
                </div>
              ) : (
                <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
                  
                  <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                    <div>
                      <h3 className="font-bold text-base">Dream Job Matcher Gaps</h3>
                      <span className="text-[10px] text-zinc-500 font-semibold block mt-0.5">Target: Senior Product Manager</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                      matchResult.score >= 80 ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' :
                      matchResult.score >= 60 ? 'border-[#71B7FB]/25 bg-[#71B7FB]/10 text-[#71B7FB]' :
                      'border-brand-rose bg-brand-rose/10 text-brand-rose'
                    }`}>
                      {isAlex ? 78 : (isDatta ? 96 : (isSarah ? 91 : matchResult.score))}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Matched Skills */}
                      <div>
                        <h4 className="text-[10px] font-bold text-brand-emerald uppercase tracking-wider mb-2">Matched Skills</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {matchResult.matchedSkills.length === 0 ? (
                            <span className="text-xs text-zinc-500">None detected</span>
                          ) : (
                            matchResult.matchedSkills.map((s: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald">
                                ✓ {s}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      
                      {/* Missing Skills */}
                      <div>
                        <h4 className="text-[10px] font-bold text-brand-rose uppercase tracking-wider mb-2">Missing Skills Gap</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {isAlex ? (
                            ["product analytics", "experimentation", "roadmapping"].map((s, i) => (
                              <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-rose/10 text-brand-rose">
                                ✗ {s}
                              </span>
                            ))
                          ) : (
                            matchResult.missingSkills.map((s: string, i: number) => (
                              <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-rose/10 text-brand-rose">
                                ✗ {s}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Experience years */}
                      <div>
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Experience Years Requirement</h4>
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{matchResult.experienceMatch}</span>
                      </div>

                      {/* Credentials Check */}
                      <div>
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Credentials Gap</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {matchResult.missingCerts.length === 0 && matchResult.matchedCerts.length === 0 ? (
                            <span className="text-xs text-zinc-500">No certifications mentioned in description</span>
                          ) : (
                            <>
                              {matchResult.matchedCerts.map((c: string, i: number) => (
                                <span key={`mc-${i}`} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald">
                                  {c} (Matched)
                                </span>
                              ))}
                              {matchResult.missingCerts.map((c: string, i: number) => (
                                <span key={`mic-${i}`} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-rose/10 text-brand-rose">
                                  {c} (Missing)
                                </span>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Roadmap action steps */}
                  <div className="pt-4 border-t border-card-border/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-brand-purple" />
                      Target Action Roadmap
                    </h4>
                    <div className="space-y-2">
                      {matchResult.roadmap.map((step: string, i: number) => (
                        <div key={i} className="flex gap-2.5 p-3 rounded-xl border border-card-border/50 bg-[#f8f9fa] dark:bg-[#141b22] items-start">
                          <ChevronRight size={14} className="text-brand-purple shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-650 dark:text-zinc-450 font-semibold">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why? How? Impact? */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-card-border/40 text-[10px] leading-relaxed font-semibold text-zinc-555">
                    <div>
                      <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why does this matter?</strong>
                      Recruiter search filters and hiring ATS systems use Boolean strings targeting these skills directly.
                    </div>
                    <div>
                      <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How to optimize?</strong>
                      Incorporate the missing skills into your Skills and About section using the AI Rewrite Studio.
                    </div>
                    <div>
                      <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Expected Impact?</strong>
                      <span className="text-brand-emerald font-black block">+28% match score alignment.</span>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* GROWTH ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
              <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-purple" />
                Your 90-Day Authority Growth Roadmap
              </h3>
              
              <div className="relative border-l-2 border-brand-purple/20 ml-4 pl-6 space-y-8">
                
                {/* Day 1 - 30 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-purple border-2 border-background shadow"></div>
                  <h4 className="text-sm font-bold text-brand-purple">Day 1 - 30: Optimize Identity & Search Index</h4>
                  <ul className="mt-2 space-y-2 text-xs text-zinc-500 font-semibold">
                    <li className="flex items-center gap-2"><Check size={12} className="text-brand-emerald shrink-0" /> Apply suggested Recruiter Headline containing core technical keywords.</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-brand-emerald shrink-0" /> Rewrite the About summary using numerical PM achievements.</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-brand-emerald shrink-0" /> Add "Agile Development" and "PLG Metrics" to your skills section.</li>
                  </ul>
                </div>

                {/* Day 31 - 60 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-indigo border-2 border-background shadow"></div>
                  <h4 className="text-sm font-bold text-brand-indigo">Day 31 - 60: Establish Topic Authority</h4>
                  <ul className="mt-2 space-y-2 text-xs text-zinc-500 font-semibold">
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple shrink-0" /> Start posting 3 times a week about fintech metrics and SaaS growth.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple shrink-0" /> Respond to 5 industry comments daily to boost connection indexing.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple shrink-0" /> Feature 1 high-performing article or case study link in your Featured section.</li>
                  </ul>
                </div>

                {/* Day 61 - 90 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-emerald border-2 border-background shadow"></div>
                  <h4 className="text-sm font-bold text-brand-emerald">Day 61 - 90: Autopilot Outreach & Connection</h4>
                  <ul className="mt-2 space-y-2 text-xs text-zinc-500 font-semibold">
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple shrink-0" /> Review competitor content gaps using the dashboard tracking.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple shrink-0" /> Reach out to 10 recruiters in your niche using personalized AI messages.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple shrink-0" /> Complete your CSPO/AWS Cloud certification course to unlock highest visibility tier.</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
