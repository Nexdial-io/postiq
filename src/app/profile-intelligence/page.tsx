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
  HeartHandshake
} from 'lucide-react';
import { mockDb, UserProfile } from '@/lib/mockDb';

export default function ProfileIntelligence() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'scores' | 'rewrite' | 'matcher' | 'seo' | 'roadmap'>('scores');
  
  // Job Matcher State
  const [jobDescription, setJobDescription] = useState(
    "We are looking for a Senior Product Manager with experience launching fintech SaaS products. Critical requirements:\n- 6+ years in product development\n- Deep experience in SaaS Growth, A/B Testing, and PLG tactics\n- Knowledge of SQL, Python, or AI/ML integrations\n- Certifications like AWS Cloud Practitioner or Scrum Master are a plus."
  );
  const [matchResult, setMatchResult] = useState<any>(null);
  
  // Custom Edit States
  const [newSkill, setNewSkill] = useState("");
  const [newCert, setNewCert] = useState("");
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    setProfile(mockDb.getProfile());
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
      "ux design", "roadmap", "project management", "leadership"
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
    const requiredYears = matches ? parseInt(matches[1]) : 5;
    
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
      missingSkills,
      matchedCerts,
      missingCerts,
      experienceMatch: matchesYears ? `Yes (${profileYears} yrs matches required ${requiredYears} yrs)` : `Partial (${profileYears} yrs available)`,
      roadmap: missingSkills.map(s => `Complete a 3-hour micro-course on ${s.toUpperCase()} to add key validation to your skills section.`)
        .concat(missingCerts.map(c => `Enroll in the ${c} certification path. This credential is listed as preferred by recruiters in 78% of active roles.`))
    });
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 3500);
  };

  if (!profile) return <div className="text-center py-20">Loading profile analysis...</div>;

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
        <div className="flex items-center gap-4 bg-black/10 dark:bg-white/5 border border-card-border p-3 rounded-2xl">
          <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-4 border-brand-emerald/20 bg-brand-emerald/5">
            <span className="text-sm font-extrabold text-brand-emerald">{profile.score}</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Overall Strength</h4>
            <span className="text-[10px] text-zinc-500 block">Top 15% in FinTech Product</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-card-border overflow-x-auto pb-px gap-2">
        {(['scores', 'rewrite', 'matcher', 'seo', 'roadmap'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab 
                ? 'border-brand-purple text-brand-purple' 
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab === 'scores' && 'Overview Scores'}
            {tab === 'rewrite' && 'Profile Rewrite Studio'}
            {tab === 'matcher' && 'Dream Job Matcher'}
            {tab === 'seo' && 'SEO & Visual Audit'}
            {tab === 'roadmap' && 'Growth Roadmap'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        
        {/* OVERVIEW SCORES TAB */}
        {activeTab === 'scores' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Score Breakdown Cards */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-panel rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3">Strength Index Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: "Headline Keyword Density", score: 85, desc: "Excellent use of targets", color: "bg-brand-purple" },
                    { title: "About Section Storytelling", score: 68, desc: "Could use achievements", color: "bg-brand-indigo" },
                    { title: "Experience Impact Bullets", score: 70, desc: "Needs more numerical stats", color: "bg-blue-500" },
                    { title: "Skills Relevance", score: 90, desc: "Aligned with job targets", color: "bg-brand-emerald" },
                    { title: "Certification Authority", score: 60, desc: "Additional Cloud/Agile fits well", color: "bg-brand-amber" },
                    { title: "Branding Visual Appeal", score: 60, desc: "Banner has no target description", color: "bg-brand-rose" },
                  ].map((sub, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-zinc-700 dark:text-zinc-300">{sub.title}</span>
                        <span>{sub.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${sub.color} rounded-full`} style={{ width: `${sub.score}%` }}></div>
                      </div>
                      <span className="text-[10px] text-zinc-500 block">{sub.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SSI Predictor */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3">LinkedIn SSI (Social Selling Index) Simulation</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Establish Brand", score: 18, max: 25, color: "text-[#71B7FB]" },
                    { label: "Find Right People", score: 14, max: 25, color: "text-brand-indigo" },
                    { label: "Engage with Insights", score: 12, max: 25, color: "text-brand-emerald" },
                    { label: "Build Relationships", score: 19, max: 25, color: "text-brand-amber" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-card-border/60 bg-black/[0.01] dark:bg-white/[0.01] text-center space-y-2">
                      <span className="text-[10px] font-bold text-zinc-500 block leading-tight">{item.label}</span>
                      <strong className={`text-2xl font-extrabold ${item.color}`}>{item.score}</strong>
                      <span className="text-[10px] text-zinc-500 block">/ {item.max}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recruiter Appeal & Creator potential */}
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-2">Recruiter Appeal Index</h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-extrabold text-brand-emerald">82%</span>
                  <div className="text-xs text-zinc-500 font-medium">
                    Strong ATS formatting, but missing 2 preferred certifications for leadership PM positions.
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-2">Creator Authority Score</h3>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-extrabold text-[#71B7FB]">64%</span>
                  <div className="text-xs text-zinc-500 font-medium">
                    Moderate posting consistency. Optimize hashtags to reach a wider network index.
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-brand-purple/[0.02] to-brand-indigo/[0.02] border-brand-purple/10">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500">Key Priorities</h3>
                <ul className="mt-3 space-y-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-brand-purple shrink-0 mt-0.5" />
                    <span>Headline lacks an authority statement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-brand-purple shrink-0 mt-0.5" />
                    <span>About section needs numerical metrics</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* PROFILE REWRITE STUDIO TAB */}
        {activeTab === 'rewrite' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Editor */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3">Current Profiles Data</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Headline</label>
                    <textarea 
                      value={profile.headline}
                      onChange={(e) => handleProfileSave({ ...profile, headline: e.target.value })}
                      rows={3}
                      className="w-full p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">About Summary</label>
                    <textarea 
                      value={profile.about}
                      onChange={(e) => handleProfileSave({ ...profile, about: e.target.value })}
                      rows={5}
                      className="w-full p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Skills & Credentials Manager */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3">Skills & Certifications</h3>
                
                <div>
                  <label className="text-xs font-bold text-zinc-500 block mb-2">Skills ({profile.skills.length})</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button onClick={handleAddSkill} className="p-2 rounded-lg bg-brand-purple text-white hover:opacity-90">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-[120px] overflow-y-auto pr-1">
                    {profile.skills.map((skill, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                        {skill}
                        <button onClick={() => handleRemoveSkill(idx)} className="hover:text-brand-rose">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-card-border/50">
                  <label className="text-xs font-bold text-zinc-500 block mb-2">Certifications ({profile.certifications.length})</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Add certification..."
                      value={newCert}
                      onChange={(e) => setNewCert(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCert()}
                    />
                    <button onClick={handleAddCert} className="p-2 rounded-lg bg-brand-purple text-white hover:opacity-90">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-[100px] overflow-y-auto pr-1">
                    {profile.certifications.map((cert, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                        <span>{cert}</span>
                        <button onClick={() => handleRemoveCert(idx)} className="hover:text-brand-rose"><Trash2 size={10} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Studio Copies */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-2xl p-6 space-y-6">
                <h3 className="font-bold text-base flex items-center gap-2 border-b border-card-border/50 pb-3">
                  <Sparkles size={16} className="text-brand-purple" />
                  Optimized Generator Outputs
                </h3>

                {/* Headline Versions */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Suggested Headlines</h4>
                  
                  {[
                    { tag: "Recruiter Version (ATS Focused)", text: "Lead Product Manager | 8+ Yrs PM | B2B SaaS, FinTech, PLG Growth | Agile & AWS Certified" },
                    { tag: "Creator Version (Authority Focused)", text: "Lead Product Manager @ FinTech Leader | Launching AI Growth Engines | Writing daily on PLG frameworks" },
                    { tag: "Executive Version (Branding Focused)", text: "Product Executive | Specializing in Fintech SaaS Scalability & High-Performance Product Teams" }
                  ].map((hl, i) => (
                    <div key={i} className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded uppercase">{hl.tag}</span>
                        <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{hl.text}</p>
                      </div>
                      <button 
                        onClick={() => handleCopyText(hl.text, `hl-${i}`)}
                        className={`p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all ${copySuccess === `hl-${i}` ? 'text-brand-emerald' : 'text-zinc-400'}`}
                        title="Copy to clipboard"
                      >
                        {copySuccess === `hl-${i}` ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  ))}
                </div>

                {/* About Rewrite output */}
                <div className="space-y-4 pt-4 border-t border-card-border/50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Optimized About Statement</h4>
                  <div className="p-4 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-4 relative">
                    <button 
                      onClick={() => handleCopyText(
                        `I am a Lead Product Manager with 8+ years of experience specialized in scaling B2B SaaS and fintech applications. \n\n🚀 Key Achievements:\n- Drove a 40% increase in active trial sign-ups by redesigning the onboarding flow.\n- Built and launched an AI recommendations engine yielding an 18% lift in customer LTV.\n- Scaled payment integrations handling $200M+ in yearly transactions.\n\nSkills: Product Strategy, SaaS Growth, AI/ML Integrations, PLG metrics, A/B Testing.`,
                        'about-rewrite'
                      )}
                      className={`absolute top-4 right-4 p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-all ${copySuccess === 'about-rewrite' ? 'text-brand-emerald' : 'text-zinc-400'}`}
                      title="Copy rewrite"
                    >
                      {copySuccess === 'about-rewrite' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-[90%]">
                      I am a Lead Product Manager with 8+ years of experience specialized in scaling B2B SaaS and fintech applications.
                      <br /><br />
                      <strong>🚀 Key Achievements:</strong><br />
                      - Drove a 40% increase in active trial sign-ups by redesigning the onboarding flow.<br />
                      - Built and launched an AI recommendations engine yielding an 18% lift in customer LTV.<br />
                      - Scaled payment integrations handling $200M+ in yearly transactions.
                      <br /><br />
                      <strong>Skills:</strong> Product Strategy, SaaS Growth, AI/ML Integrations, PLG metrics, A/B Testing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DREAM JOB MATCHER TAB */}
        {activeTab === 'matcher' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Job Description */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
                  <Briefcase size={16} className="text-brand-purple" />
                  Target Job Details
                </h3>
                
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  rows={10}
                  className="w-full p-3 rounded-lg bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple resize-none font-sans"
                />

                <button
                  onClick={handleAnalyzeJobMatch}
                  className="w-full py-2.5 rounded-lg bg-brand-purple text-white text-xs font-bold hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <Search size={14} />
                  Calculate Match Score
                </button>
              </div>
            </div>

            {/* Match output results */}
            <div className="lg:col-span-2">
              {!matchResult ? (
                <div className="glass-panel rounded-2xl p-8 py-20 text-center flex flex-col items-center justify-center border-dashed border-2">
                  <Briefcase size={36} className="text-zinc-400 mb-3" />
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Ready to match</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-[250px] mx-auto">
                    Paste a job description on the left and click calculate to identify keyword, skills, and certification gaps.
                  </p>
                </div>
              ) : (
                <div className="glass-panel rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
                    <h3 className="font-bold text-base">Match Analysis</h3>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                      matchResult.score >= 80 ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' :
                      matchResult.score >= 60 ? 'border-[#71B7FB]/25 bg-[#71B7FB]/10 text-[#71B7FB]' :
                      'border-brand-rose bg-brand-rose/10 text-brand-rose'
                    }`}>
                      {matchResult.score}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Matched Skills */}
                      <div>
                        <h4 className="text-xs font-bold text-brand-emerald uppercase tracking-wider mb-2">Matched Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {matchResult.matchedSkills.length === 0 ? (
                            <span className="text-xs text-zinc-500">None detected</span>
                          ) : (
                            matchResult.matchedSkills.map((s: string, i: number) => (
                              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald">
                                {s}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                      
                      {/* Missing Skills */}
                      <div>
                        <h4 className="text-xs font-bold text-brand-rose uppercase tracking-wider mb-2">Missing Skills Gap</h4>
                        <div className="flex flex-wrap gap-1">
                          {matchResult.missingSkills.length === 0 ? (
                            <span className="text-xs text-brand-emerald font-semibold">Profile covers all listed skills!</span>
                          ) : (
                            matchResult.missingSkills.map((s: string, i: number) => (
                              <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-rose/10 text-brand-rose">
                                {s}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Certifications check */}
                      <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Experience Years Requirement</h4>
                        <span className="text-xs font-semibold">{matchResult.experienceMatch}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Credentials Gap</h4>
                        <div className="flex flex-wrap gap-1">
                          {matchResult.missingCerts.length === 0 && matchResult.matchedCerts.length === 0 ? (
                            <span className="text-xs text-zinc-500">No certifications mentioned in description</span>
                          ) : (
                            <>
                              {matchResult.matchedCerts.map((c: string, i: number) => (
                                <span key={`mc-${i}`} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald">
                                  {c} (Matched)
                                </span>
                              ))}
                              {matchResult.missingCerts.map((c: string, i: number) => (
                                <span key={`mic-${i}`} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-rose/10 text-brand-rose">
                                  {c} (Missing)
                                </span>
                              ))}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills/Training roadmap */}
                  <div className="pt-4 border-t border-card-border/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-1.5">
                      <BookOpen size={14} className="text-brand-purple" />
                      Target Action Roadmap
                    </h4>
                    <div className="space-y-2">
                      {matchResult.roadmap.map((step: string, i: number) => (
                        <div key={i} className="flex gap-2 p-3 rounded-xl border border-card-border/50 bg-black/5 dark:bg-white/5">
                          <ChevronRight size={14} className="text-brand-purple shrink-0 mt-0.5" />
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        )}

        {/* SEO & VISUAL AUDIT TAB */}
        {activeTab === 'seo' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              
              {/* Keywords audit */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
                  <Search size={16} className="text-brand-purple" />
                  SEO Searchability Engine
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-500 block mb-2">High Volume Keywords Found</span>
                    <div className="flex flex-wrap gap-1">
                      {["Product Manager", "FinTech", "Product Strategy", "SaaS Growth", "A/B Testing"].map((kw, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald">
                          {kw} (High Traffic)
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-500 block mb-2">Missing High Traffic Keywords (Recommended)</span>
                    <div className="flex flex-wrap gap-1">
                      {["Agile Development", "PLG Metrics", "Roadmapping", "Scrum Agile", "SQL Database"].map((kw, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-rose/10 text-brand-rose">
                          +{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications recommend */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-2">
                  <Award size={16} className="text-brand-emerald" />
                  Recommended Career Certifications
                </h3>
                <div className="space-y-3">
                  {[
                    { name: "Certified Scrum Product Owner (CSPO)", institution: "Scrum Alliance", impact: "High - increases Agile indexing by 35%" },
                    { name: "Professional Scrum Product Owner (PSPO I)", institution: "Scrum.org", impact: "Medium - alternative credentials" },
                    { name: "Product Management Leadership Certification", institution: "Reforge", impact: "High - establishes growth strategies authority" }
                  ].map((cert, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex justify-between items-center">
                      <div>
                        <strong className="text-xs text-zinc-800 dark:text-zinc-200 block">{cert.name}</strong>
                        <span className="text-[10px] text-zinc-500">{cert.institution}</span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-brand-purple/10 text-brand-purple rounded">{cert.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo / Banner visual audit */}
            <div className="space-y-6">
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-2 flex items-center gap-1.5">
                  <Camera size={16} className="text-brand-purple" />
                  Profile Photo Audit
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Framing & Focus</span>
                    <span className="font-bold text-brand-emerald">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Background contrast</span>
                    <span className="font-bold text-brand-emerald">Good</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Expression (Smile)</span>
                    <span className="font-bold text-brand-purple">Neutral</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 pt-2 border-t border-card-border/50">
                    Audit Recommendation: Your current photo is highly professional. A slightly brighter background contrast could enhance appearance in search lists.
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-2 flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-brand-indigo" />
                  Banner Graphic Audit
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Professional Theme</span>
                    <span className="font-bold text-brand-emerald">Yes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Value Proposition text</span>
                    <span className="font-bold text-brand-rose">Missing</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 pt-2 border-t border-card-border/50">
                    Audit Recommendation: Your banner is generic. We recommend generating a custom text banner (e.g. \"Helping Fintech SaaS scale via PLG frameworks\") using our suggested assets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GROWTH ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass-panel rounded-2xl p-6 space-y-6">
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
                    <li className="flex items-center gap-2"><Check size={12} className="text-brand-emerald" /> Apply suggested Recruiter Headline containing core technical keywords.</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-brand-emerald" /> Rewrite the About summary using numerical PM achievements.</li>
                    <li className="flex items-center gap-2"><Check size={12} className="text-brand-emerald" /> Add "Agile Development" and "PLG Metrics" to your skills section.</li>
                  </ul>
                </div>

                {/* Day 31 - 60 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-indigo border-2 border-background shadow"></div>
                  <h4 className="text-sm font-bold text-brand-indigo">Day 31 - 60: Establish Topic Authority</h4>
                  <ul className="mt-2 space-y-2 text-xs text-zinc-500 font-semibold">
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple" /> Start posting 3 times a week about fintech metrics and SaaS growth.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple" /> Respond to 5 industry comments daily to boost connection indexing.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple" /> Feature 1 high-performing article or case study link in your Featured section.</li>
                  </ul>
                </div>

                {/* Day 61 - 90 */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-brand-emerald border-2 border-background shadow"></div>
                  <h4 className="text-sm font-bold text-brand-emerald">Day 61 - 90: Autopilot Outreach & Connection</h4>
                  <ul className="mt-2 space-y-2 text-xs text-zinc-500 font-semibold">
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple" /> Review competitor content gaps using the dashboard tracking.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple" /> Reach out to 10 recruiters in your niche using personalized AI messages.</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-purple" /> Complete your CSPO/AWS Cloud certification course to unlock highest visibility tier.</li>
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
