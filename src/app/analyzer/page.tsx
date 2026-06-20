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
    if (lower.includes("fabric") || lower.includes("dp-600") || lower.includes("power bi")) {
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

        {/* Right 1 Column: Results Display */}
        <div className="space-y-6">
          {!analysis ? (
            <div className="glass-panel rounded-xl p-8 text-center py-20 space-y-4 flex flex-col items-center justify-center border-dashed border-2 border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22]">
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
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6 relative overflow-hidden">
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

                {/* Score comparison delta */}
                {originalContent && originalContent !== content && (
                  <div className="pt-4 border-t border-card-border/50 flex items-center justify-between text-xs font-bold text-zinc-500 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1">
                      <span>Original Score:</span>
                      <span className="text-zinc-650 dark:text-zinc-400">{originalScore}</span>
                    </div>
                    <span className="text-zinc-300">➔</span>
                    <div className="flex items-center gap-1.5">
                      <span>Current Score:</span>
                      <span className="text-brand-purple">{analysis.score}</span>
                      
                      {analysis.score - originalScore > 0 ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald font-black">
                          +{analysis.score - originalScore} pts
                        </span>
                      ) : analysis.score - originalScore < 0 ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-rose/10 border border-brand-rose/20 text-brand-rose font-black">
                          {analysis.score - originalScore} pts
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-card-border text-zinc-400 font-bold">
                          No change
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* LinkedIn Feed Preview */}
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <div className="flex justify-between items-center border-b border-card-border/50 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">LinkedIn Feed Preview</h4>
                  <button
                    onClick={handleCopyDraft}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
                      copySuccess 
                        ? 'border-brand-emerald bg-brand-emerald/10 text-brand-emerald' 
                        : 'border-card-border bg-black/5 dark:bg-white/5 hover:border-brand-purple/50'
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
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">• 1st</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 dark:text-zinc-400 block truncate leading-tight">
                        {profile?.headline || 'Lead Product Manager @ FinTech Leader | Launching AI Growth Engines'}
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
                        <span className="w-4 h-4 rounded-full bg-blue-550 flex items-center justify-center text-white text-[9px] select-none">👍</span>
                        <span className="w-4 h-4 rounded-full bg-emerald-550 flex items-center justify-center text-white text-[9px] select-none">👏</span>
                        <span className="w-4 h-4 rounded-full bg-red-550 flex items-center justify-center text-white text-[9px] select-none">❤️</span>
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
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/50 pb-2">Engagement Predictions</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      <ThumbsUp size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block">Likes</span>
                      <strong className="text-sm">{analysis.metrics.likes.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 border border-teal-500/20">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block">Comments</span>
                      <strong className="text-sm">{analysis.metrics.comments.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                      <Share2 size={16} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 block">Shares</span>
                      <strong className="text-sm">{analysis.metrics.shares.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex items-center gap-3">
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
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
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
              <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/50 pb-2">Actionable Suggestions</h4>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="flex gap-2 p-3 rounded-xl border border-card-border/50 bg-[#f8f9fa] dark:bg-[#141b22]">
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
