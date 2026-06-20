"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  TrendingUp, 
  Users, 
  Eye, 
  Sparkles, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export default function Analytics() {
  const [mounted, setMounted] = useState(false);
  const [reportType, setReportType] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadReport = (type: 'pdf' | 'csv' | 'ppt') => {
    setReportType(type);
    setDownloadProgress(0);
    
    // Simulate generation progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setReportType(null), 1500);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  // Mock data for charts
  const followerData = [
    { name: 'Jan', followers: 12400 },
    { name: 'Feb', followers: 14200 },
    { name: 'Mar', followers: 18500 },
    { name: 'Apr', followers: 24000 },
    { name: 'May', followers: 32000 },
    { name: 'Jun', followers: 48500 }
  ];

  const engagementData = [
    { name: 'Post 1', Likes: 450, Comments: 120, Shares: 45 },
    { name: 'Post 2', Likes: 980, Comments: 280, Shares: 80 },
    { name: 'Post 3', Likes: 1200, Comments: 340, Shares: 95 },
    { name: 'Post 4', Likes: 650, Comments: 180, Shares: 50 },
    { name: 'Post 5', Likes: 1420, Comments: 410, Shares: 110 }
  ];

  const formatData = [
    { name: 'Text Posts', value: 45, color: '#7c3aed' },
    { name: 'Carousels', value: 35, color: '#4f46e5' },
    { name: 'Polls', value: 20, color: '#10b981' }
  ];

  if (!mounted) {
    return <div className="text-center py-20">Loading analytics dashboards...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Analytics & Report Center</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Monitor impressions, profile views, follower metrics, and export branded reports.
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Followers", value: "48,500", change: "+4.2% this week", icon: Users, color: "text-brand-purple" },
          { title: "Total Impressions", value: "185.4k", change: "+18.5% this month", icon: Eye, color: "text-brand-emerald" },
          { title: "Average Engagement Rate", value: "6.8%", change: "+1.2% vs benchmark", icon: TrendingUp, color: "text-brand-indigo" },
          { title: "Virality Predictor Hits", value: "92%", change: "12 analyses saved", icon: Sparkles, color: "text-brand-amber" }
        ].map((met, idx) => {
          const Icon = met.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-6 flex items-center justify-between hover:border-brand-purple/20 transition-all">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">{met.title}</span>
                <strong className="text-2xl font-extrabold text-zinc-950 dark:text-white">{met.value}</strong>
                <span className="text-[10px] text-zinc-500 block">{met.change}</span>
              </div>
              <div className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-card-border ${met.color}`}>
                <Icon size={18} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Follower growth chart (Area) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <TrendingUp size={16} className="text-brand-purple" />
              Audience Growth Trend
            </h3>
            <span className="text-[10px] font-bold text-zinc-500">PAST 6 MONTHS</span>
          </div>

          <div className="w-full h-[250px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={followerData}>
                <defs>
                  <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="followers" stroke="#7c3aed" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFollowers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Format breakdown (Pie) */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
            <h3 className="font-bold text-base">Content Formats Share</h3>
            <span className="text-[10px] font-bold text-zinc-500">DISTRIBUTION</span>
          </div>

          <div className="w-full h-[180px] text-xs flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formatData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-around text-[10px] font-bold text-zinc-500 mt-2">
            {formatData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span>{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Engagement bar charts & Reports Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Engagement metrics */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-card-border/50 pb-3">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <BarChart3 size={16} className="text-brand-emerald" />
              Detailed Post Metrics
            </h3>
            <span className="text-[10px] font-bold text-zinc-500">RECENT 5 POSTS</span>
          </div>

          <div className="w-full h-[250px] text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px' }}
                />
                <Bar dataKey="Likes" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Comments" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Shares" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reports PDF/PPT Export panel */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 space-y-6">
          <div className="border-b border-card-border/50 pb-3">
            <h3 className="font-bold text-base">Branded Exports Studio</h3>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed font-medium">
            Generate and export fully detailed, white-labeled client reports containing LinkedIn metrics, profiles SEO gap analyses, and roadmaps.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleDownloadReport('pdf')}
              disabled={!!reportType}
              className="w-full p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] hover:border-brand-purple/50 transition-all flex items-center justify-between text-xs font-bold disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-brand-rose" />
                <span>Download Executive PDF</span>
              </div>
              <Download size={14} className="text-zinc-400" />
            </button>

            <button
              onClick={() => handleDownloadReport('csv')}
              disabled={!!reportType}
              className="w-full p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] hover:border-brand-purple/50 transition-all flex items-center justify-between text-xs font-bold disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-brand-emerald" />
                <span>Export CSV Spreadsheet</span>
              </div>
              <Download size={14} className="text-zinc-400" />
            </button>

            <button
              onClick={() => handleDownloadReport('ppt')}
              disabled={!!reportType}
              className="w-full p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] hover:border-brand-purple/50 transition-all flex items-center justify-between text-xs font-bold disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <Presentation size={16} className="text-brand-amber" />
                <span>Export Keynote Slide Deck</span>
              </div>
              <Download size={14} className="text-zinc-400" />
            </button>
          </div>

          {/* Download Simulation Overlay */}
          {reportType && (
            <div className="p-4 rounded-xl border border-brand-purple/30 bg-brand-purple/[0.02] space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-brand-purple uppercase">Generating report...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-brand-purple rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
              </div>
              {downloadProgress === 100 && (
                <span className="text-[10px] text-brand-emerald font-bold flex items-center gap-1">
                  <Check size={11} /> File download initiated successfully!
                </span>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
