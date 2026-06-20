"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Eye, 
  Check, 
  Plus, 
  Wand2,
  FileText,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';
import { analyzePostContent, autoFixPost } from '@/lib/scoringEngine';
import { mockDb, PostAnalysis } from '@/lib/mockDb';

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<PostAnalysis | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const records = mockDb.getAnalyses();
      const match = records.find(r => r.id === id);
      if (match) {
        setContent(match.content);
        setAnalysis(match);
        setShowFullPreview(false);
      }
    }
  }, [searchParams]);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    const res = analyzePostContent(content);
    setAnalysis(res);
    setSavedSuccess(false);
    setShowFullPreview(false);
  };

  const handleAutoFix = (type: 'hook' | 'cta' | 'format') => {
    const fixed = autoFixPost(content, type);
    setContent(fixed);
    // Automatically re-analyze
    const res = analyzePostContent(fixed);
    setAnalysis(res);
    setSavedSuccess(false);
    setShowFullPreview(false);
  };

  const handleSave = () => {
    if (!analysis) return;
    mockDb.saveAnalysis(analysis);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getViralityColor = (level: string) => {
    switch (level) {
      case 'Viral': return 'text-brand-rose bg-brand-rose/10 border-brand-rose/20';
      case 'High': return 'text-brand-purple bg-brand-purple/10 border-brand-purple/20';
      case 'Medium': return 'text-brand-indigo bg-brand-indigo/10 border-brand-indigo/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-card-border';
    }
  };

  const breakdownFields = [
    { label: "Hook Quality (20%)", value: analysis?.breakdown.hook || 0, color: "bg-[#71B7FB]" },
    { label: "Readability (15%)", value: analysis?.breakdown.readability || 0, color: "bg-brand-emerald" },
    { label: "Authority Statement (15%)", value: analysis?.breakdown.authority || 0, color: "bg-blue-500" },
    { label: "Emotional Impact (15%)", value: analysis?.breakdown.emotional || 0, color: "bg-brand-rose" },
    { label: "Visual Formatting (10%)", value: analysis?.breakdown.formatting || 0, color: "bg-brand-indigo" },
    { label: "Call To Action (10%)", value: analysis?.breakdown.cta || 0, color: "bg-purple-500" },
    { label: "Hashtag Relevance (5%)", value: analysis?.breakdown.hashtags || 0, color: "bg-teal-500" },
    { label: "Trend Index (10%)", value: analysis?.breakdown.trend || 0, color: "bg-brand-amber" },
  ];

  const hasSeeMore = content.length > 250;
  const previewText = hasSeeMore && !showFullPreview 
    ? content.substring(0, 220) + "..." 
    : content;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">AI LinkedIn Post Analyzer</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Paste your post drafts to receive immediate score feedback, engagement metrics, and suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Draft Editor & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="post-content" className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Post Content Draft</label>
              <div className="flex gap-4 text-xs text-zinc-500 font-semibold">
                <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
                <span>Characters: {content.length}</span>
              </div>
            </div>

            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start drafting or paste your post here..."
              rows={12}
              className="w-full p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-sm focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
            />

            {/* Smart Auto Fixes */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs font-bold text-zinc-400 flex items-center mr-2">
                <Wand2 size={13} className="mr-1" /> Auto-Fix Tools:
              </span>
              <button
                onClick={() => handleAutoFix('hook')}
                disabled={!content.trim()}
                className="px-3 py-1.5 rounded-lg border border-card-border bg-black/5 dark:bg-white/5 text-xs font-semibold hover:border-brand-purple/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Optimize Hook
              </button>
              <button
                onClick={() => handleAutoFix('format')}
                disabled={!content.trim()}
                className="px-3 py-1.5 rounded-lg border border-card-border bg-black/5 dark:bg-white/5 text-xs font-semibold hover:border-brand-purple/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Structure Spacing
              </button>
              <button
                onClick={() => handleAutoFix('cta')}
                disabled={!content.trim()}
                className="px-3 py-1.5 rounded-lg border border-card-border bg-black/5 dark:bg-white/5 text-xs font-semibold hover:border-brand-purple/50 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Insert Final CTA
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-card-border/50">
              <button
                onClick={() => setContent("")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all"
              >
                Clear Draft
              </button>
              
              <button
                onClick={handleAnalyze}
                disabled={!content.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-sm shadow-md shadow-brand-purple/20 hover:opacity-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
              >
                <Sparkles size={16} />
                Analyze Draft
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Results Display */}
        <div className="space-y-6">
          {!analysis ? (
            <div className="glass-panel rounded-2xl p-8 text-center py-20 space-y-4 flex flex-col items-center justify-center border-dashed border-2">
              <FileText className="text-zinc-400 w-12 h-12 stroke-[1.5]" />
              <div>
                <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No Analysis Done</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-[200px] mx-auto">
                  Type a post draft on the left and click "Analyze Draft" to evaluate metrics.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Score card & Save button */}
              <div className="glass-panel rounded-2xl p-6 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Post Virality Score</span>
                  <button
                    onClick={handleSave}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all ${
                      savedSuccess 
                        ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' 
                        : 'border-card-border bg-black/5 dark:bg-white/5 hover:border-brand-purple/50'
                    }`}
                  >
                    {savedSuccess ? <BookmarkCheck size={13} /> : <Plus size={13} />}
                    {savedSuccess ? 'Saved to Hub' : 'Save Analysis'}
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  {/* Gauge */}
                  <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-[6px] border-[#71B7FB]/20 bg-[#71B7FB]/5 shadow-inner">
                    <span className="text-3xl font-extrabold text-[#71B7FB]">{analysis.score}</span>
                    <span className="text-[10px] text-zinc-500 absolute bottom-3">/100</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-zinc-500">Virality Check:</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase border ${getViralityColor(analysis.metrics.virality)}`}>
                        {analysis.metrics.virality}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {analysis.score >= 80 ? "Outstanding formatting and hook strength! High potential to spread rapidly." :
                       analysis.score >= 60 ? "Solid post. Consider applying recommendations to boost emotional impact or CTA CTR." :
                       "Draft needs revisions. Add bullet list structure or a punchier hook to attract eyes."}
                    </p>
                  </div>
                </div>
              </div>

              {/* LinkedIn Feed Preview */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/50 pb-2">LinkedIn Feed Preview</h4>
                
                <div className="bg-white dark:bg-[#1d2226] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-[#e0e0e0] font-sans">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
                      A
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">Alex Rivera</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">• 1st</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block truncate leading-tight">
                        Lead Product Manager @ FinTech Leader | Launching AI Growth Engines
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block leading-tight mt-0.5">1h • Edited • 🌐</span>
                    </div>
                  </div>
                  
                  {/* Body Text */}
                  <div className="text-xs text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed break-words">
                    {previewText}
                    {hasSeeMore && !showFullPreview && (
                      <button 
                        onClick={() => setShowFullPreview(true)} 
                        className="text-brand-purple font-semibold hover:underline ml-1"
                      >
                        see more
                      </button>
                    )}
                  </div>

                  {/* Likes/Comments Stats bar */}
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] text-zinc-500 font-semibold">
                    <div className="flex items-center space-x-1.5">
                      <span className="flex -space-x-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[9px] select-none">👍</span>
                        <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] select-none">👏</span>
                        <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[9px] select-none">❤️</span>
                      </span>
                      <span className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">{analysis.metrics.likes.toLocaleString()}</span>
                    </div>
                    <div className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">
                      <span>{analysis.metrics.comments} comments • {analysis.metrics.shares} reposts</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-around items-center border-t border-zinc-100 dark:border-zinc-800/80 mt-2.5 pt-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                    <button className="flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/5 py-2 px-2.5 rounded-lg transition-colors">
                      <span>👍</span><span>Like</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/5 py-2 px-2.5 rounded-lg transition-colors">
                      <span>💬</span><span>Comment</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/5 py-2 px-2.5 rounded-lg transition-colors">
                      <span>♻️</span><span>Repost</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:bg-black/5 dark:hover:bg-white/5 py-2 px-2.5 rounded-lg transition-colors">
                      <span>📤</span><span>Send</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Engagement Predictions */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/50 pb-2">Engagement Predictions</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <ThumbsUp size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block">Likes</span>
                      <strong className="text-sm">{analysis.metrics.likes.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/20">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block">Comments</span>
                      <strong className="text-sm">{analysis.metrics.comments.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      <Share2 size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block">Shares</span>
                      <strong className="text-sm">{analysis.metrics.shares.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                      <Eye size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block">Estimated Reach</span>
                      <strong className="text-sm">{analysis.metrics.reach.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscores Breakdown */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/50 pb-2">Subscore Ratios</h4>
                <div className="space-y-3.5">
                  {breakdownFields.map((field, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1 font-semibold text-zinc-700 dark:text-zinc-300">
                        <span>{field.label}</span>
                        <span>{field.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full ${field.color} rounded-full`} style={{ width: `${field.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="glass-panel rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/50 pb-2">Actionable Suggestions</h4>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex gap-2 p-3 rounded-xl border border-card-border/50 bg-black/5 dark:bg-white/5">
                      <AlertCircle size={14} className="text-brand-purple shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">{suggestion}</p>
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

export default function Analyzer() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading analyzer components...</div>}>
      <AnalyzerContent />
    </Suspense>
  );
}
