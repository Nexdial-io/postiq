"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  BarChart3, 
  Lightbulb,
  User,
  GitCompare
} from 'lucide-react';
import { mockDb, Competitor } from '@/lib/mockDb';

export default function Competitors() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [activeComp, setActiveComp] = useState<Competitor | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const list = mockDb.getCompetitors();
    setCompetitors(list);
    if (list.length > 0) {
      setActiveComp(list[0]);
    }
  }, []);

  const handleAddCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setLoading(true);

    setTimeout(() => {
      // Parse handle
      const raw = newUrl.trim();
      const cleanHandle = raw.includes('linkedin.com/in/') 
        ? raw.split('linkedin.com/in/')[1].replace('/', '') 
        : raw.replace('@', '');

      const formattedName = cleanHandle
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const newComp: Competitor = {
        id: `comp-${Math.random().toString(36).substring(7)}`,
        name: formattedName || "Competitor Profile",
        handle: cleanHandle,
        postFrequency: "4 posts / week",
        avgEngagement: 1850,
        followers: 62000,
        growthRate: "+5.1%",
        topTopics: ["SaaS Architecture", "B2B Outreach", "Growth Hacking"],
        posts: [
          { id: `p-${Math.random()}`, content: "Here is the exact cold email template we used to secure 50+ enterprise demo calls in 30 days:", engagement: 3100, date: "3 days ago" },
          { id: `p-${Math.random()}`, content: "Why tech debt is a business decision, not just an engineering problem. Thread 👇", engagement: 1200, date: "6 days ago" }
        ]
      };

      mockDb.addCompetitor(newComp);
      const list = mockDb.getCompetitors();
      setCompetitors(list);
      setActiveComp(newComp);
      setNewUrl("");
      setLoading(false);
    }, 1200);
  };

  const handleDeleteCompetitor = (id: string) => {
    const list = competitors.filter(c => c.id !== id);
    mockDb.saveCompetitors(list);
    setCompetitors(list);
    if (activeComp?.id === id) {
      setActiveComp(list.length > 0 ? list[0] : null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Competitor Intelligence</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Compare growth metrics against competitors, analyze content frequency, and leverage traffic gaps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (1): Competitors List & Add Form */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Add Form */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-sm">Track Competitor</h3>
            <form onSubmit={handleAddCompetitor} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="URL or profile handle..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !newUrl.trim()}
                className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? 'Auditing...' : 'Add Profile'}
              </button>
            </form>
          </div>

          {/* List */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400">Competitors List</h3>
            
            <div className="space-y-2">
              {competitors.map(comp => (
                <div
                  key={comp.id}
                  onClick={() => setActiveComp(comp)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                    activeComp?.id === comp.id 
                      ? 'border-brand-purple/50 bg-brand-purple/[0.03] text-brand-purple' 
                      : 'border-card-border hover:border-brand-purple/30'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {comp.name[0]}
                    </div>
                    <div className="truncate text-xs font-semibold">
                      <h4 className="truncate text-zinc-800 dark:text-zinc-200 font-bold">{comp.name}</h4>
                      <span className="text-[10px] text-zinc-500 block truncate">@{comp.handle}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteCompetitor(comp.id); }}
                    className="p-1 rounded text-zinc-400 hover:text-brand-rose hover:bg-brand-rose/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Stop tracking"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {competitors.length === 0 && (
                <span className="text-xs text-zinc-500 italic block py-4 text-center">No profiles tracked yet</span>
              )}
            </div>
          </div>

        </div>

        {/* Right Columns (3): Detailed Metrics Panel */}
        <div className="lg:col-span-3">
          {!activeComp ? (
            <div className="glass-panel rounded-2xl p-8 py-24 text-center flex flex-col items-center justify-center border-dashed border-2">
              <Users size={36} className="text-zinc-400 mb-2" />
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Track a Competitor</h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">
                Add a profile handle or select a profile on the left to review metrics comparison.
              </p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Profile Header */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center font-bold text-lg text-brand-purple">
                    {activeComp.name[0]}
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{activeComp.name}</h2>
                    <span className="text-xs text-zinc-500">linkedin.com/in/{activeComp.handle}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 block uppercase">Followers</span>
                    <strong className="text-sm">{activeComp.followers.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 block uppercase">Avg Likes</span>
                    <strong className="text-sm">{activeComp.avgEngagement.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 block uppercase">Weekly Growth</span>
                    <strong className="text-sm text-brand-emerald">{activeComp.growthRate}</strong>
                  </div>
                </div>
              </div>

              {/* Head-to-Head Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Content Gaps & Traffic Opportunities */}
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-1.5 border-b border-card-border/50 pb-3">
                    <Lightbulb size={16} className="text-brand-purple" />
                    Content Gap Recommendations
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-purple">
                        <Sparkles size={13} />
                        Topic Traffic Gap Opportunity
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                        {activeComp.name} posts heavily on <strong className="text-foreground">{activeComp.topTopics[0]}</strong> but lacks depth on <strong className="text-foreground">AI Integration Frameworks</strong>. Publishing posts on AI API engineering could capture an untapped reader audience in your shared network.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-brand-emerald">
                        <BarChart3 size={13} />
                        Posting Schedule Shift
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed font-semibold">
                        Their content frequency is highest on Tuesday mornings. Shift your primary publishing window to Thursday mornings at 08:30 AM (US Eastern) to avoid overlapping attention and capture highest feed indexing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Growth and Posting Stats comparison table */}
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-base flex items-center gap-1.5 border-b border-card-border/50 pb-3">
                    <GitCompare size={16} className="text-brand-emerald" />
                    Head-to-Head Comparison
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-3 font-bold border-b border-card-border pb-2 text-[10px] uppercase text-zinc-500 tracking-wider">
                      <span>Metric</span>
                      <span>You</span>
                      <span>{activeComp.name.split(' ')[0]}</span>
                    </div>

                    {[
                      { name: "Avg Engagement", you: "320 likes", comp: `${activeComp.avgEngagement} likes` },
                      { name: "Posting Consistency", you: "1 / week", comp: activeComp.postFrequency },
                      { name: "Content Formats", you: "Text only", comp: "Carousels, Video" },
                      { name: "Creator Score", you: "68 / 100", comp: "84 / 100" },
                      { name: "Reach Index", you: "Moderate", comp: "High (Viral)" }
                    ].map((row, idx) => (
                      <div key={idx} className="grid grid-cols-3 font-semibold text-zinc-600 dark:text-zinc-400 py-1.5 border-b border-card-border/40 last:border-0 last:pb-0">
                        <span className="text-zinc-500">{row.name}</span>
                        <span>{row.you}</span>
                        <span className="text-brand-purple">{row.comp}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Competitor Top Performing Posts list */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base border-b border-card-border/50 pb-3">
                  Top Performance Posts by {activeComp.name}
                </h3>
                
                <div className="space-y-4">
                  {activeComp.posts.map(post => (
                    <div key={post.id} className="p-4 rounded-xl border border-card-border/70 bg-black/[0.01] dark:bg-white/[0.01] space-y-2 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed">
                          "{post.content}"
                        </p>
                        <div className="flex gap-4 text-[10px] text-zinc-500 font-bold pt-1.5">
                          <span>Engagement Score: <strong className="text-brand-purple">{post.engagement.toLocaleString()}</strong></span>
                          <span>Published: {post.date}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          const rewriteRoute = `/hooks?rewrite_src=${encodeURIComponent(post.content)}`;
                          // Simulate routing to hooks studio
                          window.location.href = rewriteRoute;
                        }}
                        className="px-2.5 py-1 rounded bg-brand-purple/10 text-brand-purple text-[9px] font-bold hover:bg-brand-purple/20 transition-all shrink-0"
                      >
                        Model Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
