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
  AlertCircle,
  Copy,
  Download,
  RotateCcw,
  Smile,
  Hash,
  Type,
  TrendingUp,
  Bold,
  Italic,
  Code
} from 'lucide-react';
import { analyzePostContent, autoFixPost } from '@/lib/scoringEngine';
import { mockDb, PostAnalysis } from '@/lib/mockDb';

// Unicode formatting utilities for LinkedIn mathematical styling
function toBoldSans(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48));
    return char;
  }).join('');
}

function toItalicSans(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D608 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D622 + (code - 97));
    return char;
  }).join('');
}

function toBoldItalicSans(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D63C + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D656 + (code - 97));
    return char;
  }).join('');
}

function toMonospace(text: string): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + (code - 65));
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + (code - 97));
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + (code - 48));
    return char;
  }).join('');
}

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState<PostAnalysis | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Advanced Creator states
  const [originalContent, setOriginalContent] = useState("");
  const [originalScore, setOriginalScore] = useState(0);
  const [toolkitSuccessMessage, setToolkitSuccessMessage] = useState("");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfileData = () => {
      setProfile(mockDb.getProfile());
    };
    loadProfileData();
    window.addEventListener('liq-profile-updated', loadProfileData);
    return () => {
      window.removeEventListener('liq-profile-updated', loadProfileData);
    };
  }, []);

  const handleCopyDraft = () => {
    if (!content.trim()) return;
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const records = mockDb.getAnalyses();
      const match = records.find(r => r.id === id);
      if (match) {
        setContent(match.content);
        setAnalysis(match);
        setOriginalContent(match.content);
        setOriginalScore(match.score);
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
    
    // Store original version if it's the first time
    if (!originalContent) {
      setOriginalContent(content);
      setOriginalScore(res.score);
    }
  };

  const handleAutoFix = (type: 'hook' | 'cta' | 'format') => {
    const fixed = autoFixPost(content, type);
    setContent(fixed);
    // Automatically re-analyze
    const res = analyzePostContent(fixed);
    setAnalysis(res);
    setSavedSuccess(false);
    setShowFullPreview(false);

    // Store original version if it's the first time
    if (!originalContent) {
      setOriginalContent(content);
      setOriginalScore(res.score);
    }
  };

  const handleSave = () => {
    if (!analysis) return;
    mockDb.saveAnalysis(analysis);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const triggerSuccessMessage = (msg: string) => {
    setToolkitSuccessMessage(msg);
    setTimeout(() => setToolkitSuccessMessage(""), 2500);
  };

  const handleFormatSelection = (style: 'bold' | 'italic' | 'boldItalic' | 'monospace') => {
    const textarea = document.getElementById('post-content') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    if (!selectedText.trim()) {
      triggerSuccessMessage("Highlight text in the editor first to style it!");
      return;
    }
    
    let styled = "";
    if (style === 'bold') styled = toBoldSans(selectedText);
    else if (style === 'italic') styled = toItalicSans(selectedText);
    else if (style === 'boldItalic') styled = toBoldItalicSans(selectedText);
    else if (style === 'monospace') styled = toMonospace(selectedText);
    
    const newContent = text.substring(0, start) + styled + text.substring(end);
    setContent(newContent);
    
    const res = analyzePostContent(newContent);
    setAnalysis(res);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + styled.length);
    }, 50);
  };

  const handleBoldHook = () => {
    const lines = content.split('\n');
    if (lines.length > 0) {
      let firstLineIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().length > 0) {
          firstLineIndex = i;
          break;
        }
      }
      if (firstLineIndex !== -1) {
        lines[firstLineIndex] = toBoldSans(lines[firstLineIndex]);
        const newContent = lines.join('\n');
        setContent(newContent);
        const res = analyzePostContent(newContent);
        setAnalysis(res);
        triggerSuccessMessage("First line bolded!");
      }
    }
  };

  const handleBoldHeaders = () => {
    const lines = content.split('\n');
    const newLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.endsWith(':') && trimmed.length > 1) {
        return toBoldSans(trimmed.slice(0, -1)) + ":";
      }
      return line;
    });
    const newContent = newLines.join('\n');
    setContent(newContent);
    const res = analyzePostContent(newContent);
    setAnalysis(res);
    triggerSuccessMessage("Headers bolded!");
  };

  const handleStripEmojis = () => {
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const cleaned = content.replace(emojiRegex, '').trim();
    setContent(cleaned);
    const res = analyzePostContent(cleaned);
    setAnalysis(res);
    triggerSuccessMessage("All emojis removed!");
  };

  const handleFormatListItemsToEmojis = () => {
    const lines = content.split('\n');
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') && !trimmed.startsWith('---')) {
        return "🚀 " + trimmed.substring(1).trim();
      }
      if (trimmed.startsWith('*') && !trimmed.startsWith('***')) {
        return "✔ " + trimmed.substring(1).trim();
      }
      if (trimmed.startsWith('•')) {
        return "👉 " + trimmed.substring(1).trim();
      }
      return line;
    });
    const newContent = formattedLines.join('\n');
    setContent(newContent);
    const res = analyzePostContent(newContent);
    setAnalysis(res);
    triggerSuccessMessage("Bullet points optimized!");
  };

  const handleDownloadDraft = () => {
    if (!content.trim()) return;
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "linkedin_post_draft.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerSuccessMessage("Downloaded draft as .txt");
  };

  const getSuggestedHashtags = () => {
    const lower = content.toLowerCase();
    if (lower.includes("linkedin") || lower.includes("personal brand") || lower.includes("creator") || lower.includes("postiq")) {
      return ["#LinkedInGrowth", "#PersonalBranding", "#ContentMarketing", "#CreatorEconomy", "#SaaS", "#BuildInPublic", "#AI", "#ProfessionalDevelopment"];
    } else if (lower.includes("fabric") || lower.includes("dp-600") || lower.includes("power bi")) {
      return ["#MicrosoftFabric", "#DP600", "#DataEngineering", "#PowerBI"];
    } else if (lower.includes("saas") || lower.includes("growth") || lower.includes("b2b")) {
      return ["#B2BSaaS", "#SaaSGrowth", "#GrowthMarketing", "#Startups"];
    } else if (lower.includes("product manager") || lower.includes("product strategy")) {
      return ["#ProductManagement", "#ProductStrategy", "#ProductManager", "#Roadmap"];
    } else if (lower.includes("ai") || lower.includes("llm") || lower.includes("gpt")) {
      return ["#GenerativeAI", "#AIAgents", "#LLMs", "#TechInnovation"];
    }
    return ["#LinkedInTips", "#CareerGrowth", "#PersonalBranding", "#ProfessionalDevelopment"];
  };

  const handleToggleHashtag = (tag: string) => {
    const tagLower = tag.toLowerCase();
    const containsTag = content.toLowerCase().includes(tagLower);
    let newContent = "";
    if (containsTag) {
      const regex = new RegExp(`\\s*${tag}\\b`, 'gi');
      newContent = content.replace(regex, '').trim();
    } else {
      if (content.trim().endsWith(tag)) {
        newContent = content;
      } else {
        const trimmed = content.trim();
        const hasAnyHashtags = /#\w+/.test(trimmed.split('\n').pop() || "");
        if (hasAnyHashtags) {
          newContent = trimmed + " " + tag;
        } else {
          newContent = trimmed + "\n\n" + tag;
        }
      }
    }
    setContent(newContent);
    const res = analyzePostContent(newContent);
    setAnalysis(res);
  };

  const handleRestoreOriginal = () => {
    if (!originalContent) return;
    setContent(originalContent);
    const res = analyzePostContent(originalContent);
    setAnalysis(res);
    triggerSuccessMessage("Restored original draft!");
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
          <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="post-content" className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Post Content Draft</label>
              <div className="flex gap-4 text-xs text-zinc-500 font-semibold">
                <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
                <span>Characters: {content.length}</span>
              </div>
            </div>

            {/* Inline success feedback toast */}
            {toolkitSuccessMessage && (
              <div className="p-2 bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-[11px] font-bold rounded-lg flex items-center gap-1.5 animate-in slide-in-from-top-2 duration-150">
                <Check size={12} />
                <span>{toolkitSuccessMessage}</span>
              </div>
            )}

            {/* Rich Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-t-xl bg-[#eef3f8] dark:bg-[#1d2226] border-t border-x border-card-border select-none">
              {/* Left group: Unicode Character Stylers */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleFormatSelection('bold')}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-750 dark:text-zinc-300 font-extrabold text-xs flex items-center justify-center gap-1 transition-all"
                  title="Make selection Bold Sans"
                >
                  <Bold size={13} className="stroke-[3px]" />
                  <span className="hidden sm:inline">Bold</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatSelection('italic')}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-750 dark:text-zinc-300 font-extrabold text-xs flex items-center justify-center gap-1 transition-all"
                  title="Make selection Italic Sans"
                >
                  <Italic size={13} className="stroke-[2.5px]" />
                  <span className="hidden sm:inline">Italic</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatSelection('boldItalic')}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-750 dark:text-zinc-300 font-extrabold text-xs flex items-center justify-center gap-0.5 transition-all"
                  title="Make selection Bold Italic"
                >
                  <Bold size={11} className="stroke-[3px]" />
                  <Italic size={11} className="stroke-[2.5px]" />
                  <span className="hidden sm:inline">Bold Italic</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatSelection('monospace')}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-750 dark:text-zinc-300 font-extrabold text-xs flex items-center justify-center gap-1 transition-all"
                  title="Make selection Monospace"
                >
                  <Code size={13} />
                  <span className="hidden sm:inline">Mono</span>
                </button>

                <div className="h-5 w-[1px] bg-card-border/60 mx-1"></div>

                {/* Bulk tools */}
                <button
                  type="button"
                  onClick={handleBoldHook}
                  className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold transition-all"
                  title="Bold the first line/hook"
                >
                  Bold Hook
                </button>
                <button
                  type="button"
                  onClick={handleBoldHeaders}
                  className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold transition-all"
                  title="Bold all lines ending with colons"
                >
                  Bold Headers
                </button>
              </div>

              {/* Right group: Emoji tools & Download */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleFormatListItemsToEmojis}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Format bullet items with emojis"
                >
                  <Smile size={13} className="text-brand-purple" />
                  <span className="hidden md:inline text-[10px]">Bullet Emojis</span>
                </button>
                <button
                  type="button"
                  onClick={handleStripEmojis}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 text-xs font-bold flex items-center gap-1 transition-all"
                  title="Remove all emojis"
                >
                  <Smile size={13} className="text-zinc-400" />
                  <span className="hidden md:inline text-[10px]">Strip Emojis</span>
                </button>

                <div className="h-5 w-[1px] bg-card-border/60 mx-1"></div>

                <button
                  type="button"
                  onClick={handleDownloadDraft}
                  className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-650 dark:text-zinc-350 transition-all"
                  title="Download draft as .txt"
                >
                  <Download size={13} />
                </button>
              </div>
            </div>

            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start drafting or paste your post here..."
              rows={12}
              className="w-full p-4 rounded-b-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-t-0 border-card-border text-sm focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
            />

            {/* Suggested Hashtags Toggle Row */}
            {content.trim() && (
              <div className="p-3.5 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-550 dark:text-zinc-400 uppercase tracking-wider">
                  <Hash size={11} className="text-brand-purple" />
                  <span>Niche Hashtags (Click to toggle)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getSuggestedHashtags().map((tag) => {
                    const active = content.toLowerCase().includes(tag.toLowerCase());
                    return (
                      <button
                        key={tag}
                        onClick={() => handleToggleHashtag(tag)}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-all border ${
                          active 
                            ? 'bg-brand-purple/10 border-brand-purple text-brand-purple' 
                            : 'bg-black/5 dark:bg-white/5 border-card-border text-zinc-550 hover:bg-black/10 dark:hover:bg-white/10'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Smart Auto Fixes */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
              <span className="text-xs font-bold text-zinc-400 flex items-center mr-2 w-full sm:w-auto">
                <Wand2 size={13} className="mr-1" /> Auto-Fix Tools:
              </span>
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <button
                  onClick={() => handleAutoFix('hook')}
                  disabled={!content.trim()}
                  className="flex-grow sm:flex-grow-0 text-center justify-center px-2.5 py-1.5 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] sm:text-xs font-semibold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Optimize Hook
                </button>
                <button
                  onClick={() => handleAutoFix('format')}
                  disabled={!content.trim()}
                  className="flex-grow sm:flex-grow-0 text-center justify-center px-2.5 py-1.5 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] sm:text-xs font-semibold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Structure Spacing
                </button>
                <button
                  onClick={() => handleAutoFix('cta')}
                  disabled={!content.trim()}
                  className="flex-grow sm:flex-grow-0 text-center justify-center px-2.5 py-1.5 rounded-lg border border-card-border bg-[#eef3f8] dark:bg-[#383f47] text-[10px] sm:text-xs font-semibold hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  Insert Final CTA
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-card-border/50">
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <button
                  onClick={() => {
                    setContent("");
                    setAnalysis(null);
                    setOriginalContent("");
                    setOriginalScore(0);
                    setShowFullPreview(false);
                  }}
                  className="flex-grow sm:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-center cursor-pointer"
                >
                  Clear
                </button>
                <button
                  onClick={handleCopyDraft}
                  disabled={!content.trim()}
                  className={`flex-grow sm:flex-grow-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    copySuccess 
                      ? 'text-brand-emerald bg-brand-emerald/10' 
                      : 'text-zinc-555 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50 disabled:pointer-events-none'
                  }`}
                >
                  {copySuccess ? <Check size={13} /> : <Copy size={13} />}
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>

                {originalContent && originalContent !== content && (
                  <button
                    onClick={handleRestoreOriginal}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Restore back to the original draft text"
                  >
                    <RotateCcw size={13} />
                    <span>Restore Original</span>
                  </button>
                )}
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={!content.trim()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-sm shadow-md shadow-brand-purple/20 hover:opacity-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={16} />
                Analyze Draft
              </button>
            </div>
          </div>
        </div>
        {/* Right Column: Important Core Score Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Post Virality Score */}
          <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4 relative overflow-hidden flex flex-col justify-between h-[135px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Post Virality Score</span>
                {analysis && (
                  <button
                    onClick={handleSave}
                    className={`px-2 py-0.5 rounded border text-[8px] font-bold flex items-center gap-1 transition-all ${
                      savedSuccess 
                        ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' 
                        : 'border-card-border bg-black/5 dark:bg-white/5 hover:border-brand-purple/50'
                    }`}
                  >
                    {savedSuccess ? <BookmarkCheck size={10} /> : <Plus size={10} />}
                    {savedSuccess ? 'Saved' : 'Save'}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Gauge */}
                <div className={`relative w-14 h-14 flex items-center justify-center rounded-full border-4 ${
                  analysis ? 'border-[#71B7FB]/25 bg-[#71B7FB]/5' : 'border-zinc-300/25 bg-zinc-100/5'
                } shadow-inner shrink-0`}>
                  <span className={`text-lg font-extrabold ${analysis ? 'text-[#71B7FB]' : 'text-zinc-400'}`}>
                    {analysis ? analysis.score : '--'}
                  </span>
                  <span className="text-[7px] text-zinc-555 absolute bottom-1">/100</span>
                </div>
                
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-zinc-500">Virality:</span>
                    {analysis ? (
                      <span className={`text-[8px] px-1 py-0.2 rounded font-black uppercase border ${getViralityColor(analysis.metrics.virality)}`}>
                        {analysis.metrics.virality}
                      </span>
                    ) : (
                      <span className="text-[8.5px] text-zinc-400 font-bold uppercase">Pending</span>
                    )}
                  </div>
                  <p className="text-[9.5px] text-zinc-500 leading-tight font-semibold">
                    {analysis 
                      ? (analysis.score >= 80 ? "Outstanding formatting! High potential to spread rapidly." :
                         analysis.score >= 60 ? "Solid post. Apply suggestions to boost CTR." :
                         "Draft needs revisions. Add bullet list structure.")
                      : "Enter text and click 'Analyze Draft' to compute score."}
                  </p>
                </div>
              </div>
            </div>

            {/* Score comparison delta */}
            {analysis && originalContent && originalContent !== content && (
              <div className="pt-2 border-t border-card-border/40 flex items-center justify-between text-[9px] font-bold text-zinc-555 animate-in fade-in duration-200">
                <div className="flex items-center gap-1">
                  <span>Original:</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{originalScore}</span>
                </div>
                <span className="text-zinc-400">➔</span>
                <div className="flex items-center gap-1">
                  <span>Current:</span>
                  <span className="text-brand-purple">{analysis.score}</span>
                  {analysis.score - originalScore > 0 ? (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-black">
                      +{analysis.score - originalScore}
                    </span>
                  ) : analysis.score - originalScore < 0 ? (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-brand-rose/10 border border-brand-rose/20 text-brand-rose font-black">
                      {analysis.score - originalScore}
                    </span>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* 2. Personal Brand Signals Card */}
          <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-3.5 relative overflow-hidden flex flex-col justify-between h-[180px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-emerald/5 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-card-border/40 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Personal Brand Signals</span>
                <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                  analysis ? 'text-brand-emerald bg-brand-emerald/10' : 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800'
                }`}>
                  Score: {analysis ? (analysis.personalBrandScore || 70) : '--'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`relative w-10 h-10 flex items-center justify-center rounded-full border-4 ${
                  analysis ? 'border-brand-emerald/20 bg-brand-emerald/5' : 'border-zinc-300/20 bg-zinc-100/5'
                } shrink-0`}>
                  <span className={`text-sm font-extrabold ${analysis ? 'text-brand-emerald' : 'text-zinc-400'}`}>
                    {analysis ? (analysis.personalBrandScore || 70) : '--'}
                  </span>
                </div>
                <div className="text-[9px] leading-snug font-semibold text-zinc-550">
                  <strong className="text-zinc-755 dark:text-zinc-300">Brand Impact:</strong> Connects content to authority & trust.
                </div>
              </div>
            </div>

            <div className="space-y-1 text-[8.5px] font-bold text-zinc-650 dark:text-zinc-455">
              {[
                { name: "Authority", val: analysis?.personalBrandSignals?.authority || 72, color: "bg-blue-500" },
                { name: "Expertise", val: analysis?.personalBrandSignals?.expertise || 80, color: "bg-brand-purple" },
                { name: "Uniqueness", val: analysis?.personalBrandSignals?.uniqueness || 55, color: "bg-brand-rose" },
                { name: "Trustworthiness", val: analysis?.personalBrandSignals?.trust || 74, color: "bg-brand-emerald" }
              ].map((sig, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex justify-between">
                    <span>{sig.name}</span>
                    <span>{analysis ? `${sig.val}%` : '--'}</span>
                  </div>
                  <div className="h-0.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${analysis ? sig.color : 'bg-zinc-300 dark:bg-zinc-700'} rounded-full`} style={{ width: analysis ? `${sig.val}%` : '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Scroll Stopper Score & Hook Checklist */}
          <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-3.5 flex flex-col justify-between h-[180px]">
            <div className="space-y-2">
              <div className="flex justify-between items-center border-b border-card-border/40 pb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Scroll Stopper</span>
                <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                  analysis ? 'text-brand-purple bg-brand-purple/10' : 'text-zinc-400 bg-zinc-100 dark:bg-zinc-800'
                }`}>
                  Score: {analysis ? (analysis.scrollStopperScore || analysis.breakdown.hook) : '--'}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`relative w-10 h-10 flex items-center justify-center rounded-full border-4 ${
                  analysis ? 'border-brand-purple/20 bg-brand-purple/5' : 'border-zinc-300/20 bg-zinc-100/5'
                } shrink-0`}>
                  <span className={`text-sm font-extrabold ${analysis ? 'text-brand-purple' : 'text-zinc-400'}`}>
                    {analysis ? (analysis.scrollStopperScore || analysis.breakdown.hook) : '--'}
                  </span>
                </div>
                <div className="text-[9px] leading-snug font-semibold text-zinc-555">
                  <strong className="text-zinc-755 dark:text-zinc-300">Feed Stopper:</strong> Hook validation checklist.
                </div>
              </div>
            </div>

            <div className="space-y-1 text-[8.5px]">
              {[
                { name: "Curiosity trigger", detected: analysis?.hookExplanations?.curiosity },
                { name: "Numeric/Stat claim", detected: analysis?.hookExplanations?.statistic },
                { name: "Contrarian interrupts", detected: analysis?.hookExplanations?.contrarian },
                { name: "Question tag", detected: analysis?.hookExplanations?.question },
              ].map((chk, i) => (
                <div key={i} className="flex items-center justify-between font-bold">
                  <span className="text-zinc-555 dark:text-zinc-400">{chk.name}</span>
                  <span className={`text-[9px] font-bold ${analysis ? (chk.detected ? 'text-brand-emerald' : 'text-zinc-405') : 'text-zinc-300'}`}>
                    {analysis ? (chk.detected ? '✓ Yes' : '✗ No') : '--'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Detailed AI performance metrics dashboard */}
      {analysis && (
        <div className="space-y-6 pt-6 border-t border-card-border/50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div>
            <h2 className="text-base font-black tracking-tight flex items-center gap-1.5">
              <Sparkles className="text-brand-purple" size={16} />
              AI Performance Analysis Results
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold mt-0.5">
              Detailed feed optimization metrics, keyword density assessments, and engagement predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 1 Column: Feed Preview */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <div className="flex justify-between items-center border-b border-card-border/50 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">LinkedIn Feed Preview</h4>
                  <button
                    onClick={handleCopyDraft}
                    disabled={!content.trim()}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                      copySuccess 
                        ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' 
                        : 'border-card-border bg-black/5 dark:bg-white/5 hover:border-brand-purple/50 text-zinc-550'
                    }`}
                  >
                    {copySuccess ? <Check size={11} /> : <Copy size={11} />}
                    {copySuccess ? 'Copied Draft!' : 'Copy Draft'}
                  </button>
                </div>
                
                <div className="bg-white dark:bg-[#1d2226] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-[#e0e0e0] font-sans">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase overflow-hidden shrink-0">
                      {profile?.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile?.name ? profile.name[0] : 'A'
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
                          {profile?.name || 'Alex Rivera'}
                          {profile?.isVerified && (
                            <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3 h-3 shrink-0 shadow-sm" title="Verified Creator">
                              <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-555 font-semibold">• 1st</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block truncate leading-tight">
                        {profile?.headline || 'Lead Product Manager @ FinTech Leader | Launching AI Growth Engines'}
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-550 block leading-tight mt-0.5">1h • Edited • 🌐</span>
                    </div>
                  </div>
                  
                  {/* Body Text */}
                  <div className="text-xs text-zinc-800 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed break-words font-medium">
                    {content.trim() 
                      ? (hasSeeMore && !showFullPreview ? content.substring(0, 220) + "..." : content) 
                      : "Your real-time post preview will appear here as you type. Click 'Analyze Draft' to run virality score checks."}
                    {hasSeeMore && !showFullPreview && content.trim() && (
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
                        <span className="w-4 h-4 rounded-full bg-blue-550 flex items-center justify-center text-white text-[9px] select-none font-sans">👍</span>
                        <span className="w-4 h-4 rounded-full bg-emerald-550 flex items-center justify-center text-white text-[9px] select-none font-sans">👏</span>
                        <span className="w-4 h-4 rounded-full bg-red-550 flex items-center justify-center text-white text-[9px] select-none font-sans">❤️</span>
                      </span>
                      <span className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">
                        {analysis.metrics.likes.toLocaleString()}
                      </span>
                    </div>
                    <div className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer">
                      <span>
                        {analysis.metrics.comments} comments • {analysis.metrics.shares} reposts
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-around items-center border-t border-zinc-100 dark:border-zinc-800/80 mt-2.5 pt-2 text-[11px] font-bold text-zinc-555 dark:text-zinc-400">
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
            </div>

            {/* Right 2 Columns: Transparency, Suggestions, & Audits */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Trust & Transparency Report Card */}
              <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4">
                <div className="border-b border-card-border/40 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-brand-purple" />
                    Trust & Transparency Report
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-bold mt-0.5">
                    Algorithm parameters evaluated by our heuristic model to justify your subscores.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Hook Transparency */}
                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-card-border/40 pb-1 mb-1">
                        <span className="text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-300">Hook</span>
                        <span className="text-[9px] font-black text-brand-purple">{analysis.breakdown.hook}%</span>
                      </div>
                      <div className="space-y-1 text-[8px] font-bold">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Curiosity gap</span>
                          <span className={analysis.transparencyReport?.hook.curiosity ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.hook.curiosity ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Stat / Number</span>
                          <span className={analysis.transparencyReport?.hook.statistic ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.hook.statistic ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Contrarian angle</span>
                          <span className={analysis.transparencyReport?.hook.contrarian ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.hook.contrarian ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Question prompt</span>
                          <span className={analysis.transparencyReport?.hook.question ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.hook.question ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Readability Transparency */}
                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-card-border/40 pb-1 mb-1">
                        <span className="text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-300">Readability</span>
                        <span className="text-[9px] font-black text-brand-emerald">{analysis.breakdown.readability}%</span>
                      </div>
                      <div className="space-y-1 text-[8px] font-bold">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Conversational</span>
                          <span className={analysis.transparencyReport?.readability.sentenceLength ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.readability.sentenceLength ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">No dense blocks</span>
                          <span className={analysis.transparencyReport?.readability.paragraphBreaks ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.readability.paragraphBreaks ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Short formatting</span>
                          <span className={analysis.transparencyReport?.readability.punchyFormatting ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.readability.punchyFormatting ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Authority Transparency */}
                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-card-border/40 pb-1 mb-1">
                        <span className="text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-300">Authority</span>
                        <span className="text-[9px] font-black text-blue-500">{analysis.breakdown.authority}%</span>
                      </div>
                      <div className="space-y-1 text-[8px] font-bold">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Framework/Sys</span>
                          <span className={analysis.transparencyReport?.authority.frameworkName ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.authority.frameworkName ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Metrics & Data</span>
                          <span className={analysis.transparencyReport?.authority.metricsProvided ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.authority.metricsProvided ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Exp claim</span>
                          <span className={analysis.transparencyReport?.authority.experienceClaim ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.authority.experienceClaim ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emotional Transparency */}
                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-card-border/40 pb-1 mb-1">
                        <span className="text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-300">Emotional</span>
                        <span className="text-[9px] font-black text-brand-rose">{analysis.breakdown.emotional}%</span>
                      </div>
                      <div className="space-y-1 text-[8px] font-bold">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Struggle/Emotion</span>
                          <span className={analysis.transparencyReport?.emotional.emotionalWords ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.emotional.emotionalWords ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Mod Emojis</span>
                          <span className={analysis.transparencyReport?.emotional.moderateEmojis ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.emotional.moderateEmojis ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Authentic Tone</span>
                          <span className={analysis.transparencyReport?.emotional.authenticTone ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.emotional.authenticTone ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Transparency */}
                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center border-b border-card-border/40 pb-1 mb-1">
                        <span className="text-[9px] font-black uppercase text-zinc-700 dark:text-zinc-300">CTA</span>
                        <span className="text-[9px] font-black text-purple-500">{analysis.breakdown.cta}%</span>
                      </div>
                      <div className="space-y-1 text-[8px] font-bold">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Low friction choice</span>
                          <span className={analysis.transparencyReport?.cta.lowFrictionPrompt ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.cta.lowFrictionPrompt ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Direct Question</span>
                          <span className={analysis.transparencyReport?.cta.engagementQuestion ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.cta.engagementQuestion ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-555">Explicit next step</span>
                          <span className={analysis.transparencyReport?.cta.explicitNextStep ? 'text-brand-emerald' : 'text-zinc-400'}>
                            {analysis.transparencyReport?.cta.explicitNextStep ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-3">
                <div className="flex items-center gap-1.5 border-b border-card-border/40 pb-2">
                  <Wand2 size={13} className="text-brand-purple" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Actionable Suggestions</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex gap-2 p-2.5 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] items-start transition-all hover:border-brand-purple/30">
                      <AlertCircle size={13} className="text-brand-purple shrink-0 mt-0.5" />
                      <p className="text-[10px] text-zinc-655 dark:text-zinc-355 font-semibold leading-normal">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2-Column Audit & Audience row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Feed Optimization Audit (Failure Risks + Missing Elements) */}
                <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4">
                  {/* Potential Issues */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand-rose">Potential Failure Risks</h4>
                    {analysis.potentialIssues && analysis.potentialIssues.length > 0 ? (
                      <div className="space-y-1.5">
                        {analysis.potentialIssues.map((issue, i) => (
                          <div key={i} className="flex gap-1.5 p-2 rounded-xl border border-brand-rose/25 bg-brand-rose/[0.02] text-brand-rose text-[10px] font-semibold items-center">
                            <AlertCircle size={12} className="shrink-0" />
                            <span>{issue}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl border border-brand-emerald/20 bg-brand-emerald/[0.02] text-brand-emerald text-[10px] font-semibold flex items-center gap-1.5">
                        <Check size={12} />
                        No critical failure risks!
                      </div>
                    )}
                  </div>

                  {/* Missing Elements */}
                  <div className="space-y-3 pt-3 border-t border-card-border/40">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Missing Elements Check</h4>
                    <div className="space-y-1.5 text-[10px]">
                      {["Story", "Social Proof", "Statistic", "Customer Insight"].map((el, i) => {
                        const isMissing = !analysis.missingElements || analysis.missingElements.includes(el);
                        return (
                          <div key={i} className="flex items-center justify-between font-semibold">
                            <span className="text-zinc-555 dark:text-zinc-400">{el}</span>
                            <span className={`text-[9px] font-bold ${isMissing ? 'text-brand-rose' : 'text-brand-emerald'}`}>
                              {isMissing ? '✗ Missing' : '✓ Included'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Audience Affinity & Engagement Predictions */}
                <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4">
                  {/* Predictions */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Engagement Predictions</h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-1.5">
                        <ThumbsUp size={11} className="text-blue-500 shrink-0" />
                        <div>
                          <span className="text-[7.5px] font-bold text-zinc-500 block leading-none">Est. Likes</span>
                          <strong className="text-[11px] font-black text-zinc-800 dark:text-zinc-200">{analysis.metrics.likes.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-1.5">
                        <MessageSquare size={11} className="text-teal-500 shrink-0" />
                        <div>
                          <span className="text-[7.5px] font-bold text-zinc-500 block leading-none">Est. Comments</span>
                          <strong className="text-[11px] font-black text-zinc-800 dark:text-zinc-200">{analysis.metrics.comments.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-1.5">
                        <Share2 size={11} className="text-brand-purple shrink-0" />
                        <div>
                          <span className="text-[7.5px] font-bold text-zinc-500 block leading-none">Est. Shares</span>
                          <strong className="text-[11px] font-black text-zinc-800 dark:text-zinc-200">{analysis.metrics.shares.toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-1.5">
                        <Eye size={11} className="text-brand-emerald shrink-0" />
                        <div>
                          <span className="text-[7.5px] font-bold text-zinc-500 block leading-none">Est. Reach</span>
                          <strong className="text-[11px] font-black text-zinc-800 dark:text-zinc-200">{analysis.metrics.reach.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Audience Fit Index */}
                  <div className="space-y-3 pt-3 border-t border-card-border/40">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Audience Affinity Match</h4>
                    <div className="space-y-1.5">
                      {[
                        { name: "Founders & VCs", score: analysis.audienceMatch?.founders || 60, color: "bg-brand-purple" },
                        { name: "Content Creators", score: analysis.audienceMatch?.creators || 70, color: "bg-brand-indigo" },
                        { name: "Talent Recruiters", score: analysis.audienceMatch?.recruiters || 45, color: "bg-brand-emerald" }
                      ].map((aud, i) => (
                        <div key={i} className="space-y-0.5 text-[9px]">
                          <div className="flex justify-between font-semibold text-zinc-650 dark:text-zinc-455">
                            <span>{aud.name.split(" ")[0]}</span>
                            <span>{aud.score}%</span>
                          </div>
                          <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className={`h-full ${aud.color} rounded-full`} style={{ width: `${aud.score}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
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
