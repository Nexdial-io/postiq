"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  Globe, 
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  FolderMinus,
  Sparkle,
  Zap
} from 'lucide-react';
import { mockDb, CalendarEvent } from '@/lib/mockDb';

export default function ContentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Form fields
  const [content, setContent] = useState("");
  const [time, setTime] = useState("08:00");
  const [postType, setPostType] = useState('Post');

  // Heatmap controls
  const [audience, setAudience] = useState("Founders");
  const [region, setRegion] = useState("US East");

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Weekly dates
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  });

  const loadCalendar = () => {
    setEvents(mockDb.getCalendar());
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const getWeekDaysDates = () => {
    const dates = [];
    const temp = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      dates.push(temp.toISOString().split('T')[0]);
      temp.setDate(temp.getDate() + 1);
    }
    return dates;
  };

  const weekDates = getWeekDaysDates();

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handleAddEvent = () => {
    if (!content.trim() || !selectedDay) return;
    
    const newEvent: CalendarEvent = {
      id: `cal-${Date.now()}-${Math.random().toString(36).substring(5)}`,
      date: selectedDay,
      time,
      content: content.trim(),
      type: postType,
      status: 'Scheduled',
      hookSuggestion: content.substring(0, 30) + "...",
      ctaSuggestion: "Let me know your thoughts."
    };

    mockDb.addCalendarEvent(newEvent);
    setEvents(mockDb.getCalendar());
    setContent("");
    setShowAddModal(false);
    triggerToast("Draft scheduled successfully!");
  };

  const handleDeleteEvent = (id: string) => {
    mockDb.deleteCalendarEvent(id);
    setEvents(mockDb.getCalendar());
    triggerToast("Post removed from calendar.");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  // 1-Click AI Auto Planner
  const handleAutoPlanWeek = () => {
    const autoPosts = [
      {
        dayOffset: 0, // Monday
        time: "08:00",
        type: "Post",
        content: "Story: Five years ago, I almost quit tech. The pacing felt impossible. Every week there was a new framework to learn, and I felt like a fraud.\n\nBut then I realized: nobody has it all figured out.\n\nOnce I embraced continuous learning as part of the job description, everything changed. Strategy beats speed every single time.\n\nRepost ♻️ if you needed this today.",
        hook: "Five years ago, I almost quit tech.",
        cta: "Repost ♻️ if you needed this today."
      },
      {
        dayOffset: 1, // Tuesday
        time: "08:00",
        type: "Post",
        content: "Insight: 90% of B2B SaaS startups fail at growth because they overlook this one simple system:\n\n- Prioritizing marketing distribution alongside engineering features.\n- Using A/B test iterations rather than guesswork.\n- Building customer-led feedback loops early.\n\nWhat is your take on SaaS growth models? Let's discuss below! 👇",
        hook: "90% of B2B SaaS startups fail at growth because they overlook this one simple system:",
        cta: "What is your take on SaaS growth? Let's discuss below!"
      },
      {
        dayOffset: 2, // Wednesday
        time: "10:30",
        type: "Carousel",
        content: "Carousel Slides:\nSlide 1: AI isn't replacing developers. Developers who master prompt workflows are replacing developers who don't. 🧵\nSlide 2: Bottleneck 1 - Wasting time on boilerplate code. Solution: Use custom LLM prompts.\nSlide 3: Bottleneck 2 - Missing validation tests. Solution: Let agents run unit tests.\nSlide 4: Standardize your automation tools to double output.",
        hook: "AI isn't replacing developers. Master prompt workflows.",
        cta: "Swipe left to check out the full developer workflow!"
      },
      {
        dayOffset: 3, // Thursday
        time: "08:00",
        type: "Poll",
        content: "Poll: What is your biggest bottleneck in scaling product strategy?\n\nI talk with teams every day and they all struggle with scaling. But the exact bottleneck depends on your model.\n\nLet's run a quick assessment. Vote in the poll below! 👇",
        hook: "What is your biggest bottleneck in scaling product strategy?",
        cta: "Vote in the poll below!"
      },
      {
        dayOffset: 4, // Friday
        time: "12:00",
        type: "Post",
        content: "Case Study: How we grew our active users by 40% in less than 6 months (the exact breakdown):\n\n- Redesigned onboarding flow to reduce step friction.\n- Deployed real-time caching to decrease latency by 35%.\n- Targeted precise recruiter search tags in distribution.\n\nIf you found this breakdown useful, feel free to Repost ♻️",
        hook: "How we grew our active users by 40% in less than 6 months:",
        cta: "Feel free to Repost ♻️ to help others in your network!"
      }
    ];

    // Clear existing events for the week first to avoid duplicates
    const calendarEvents = mockDb.getCalendar();
    const filteredEvents = calendarEvents.filter(e => !weekDates.includes(e.date));
    
    // Add new auto-planned events
    const newEvents = autoPosts.map(p => ({
      id: `cal-auto-${Date.now()}-${p.dayOffset}-${Math.random().toString(36).substring(5)}`,
      date: weekDates[p.dayOffset],
      time: p.time,
      content: p.content,
      type: p.type,
      status: 'Draft' as const,
      hookSuggestion: p.hook,
      ctaSuggestion: p.cta
    }));

    const combined = [...filteredEvents, ...newEvents];
    mockDb.saveCalendar(combined);
    setEvents(combined);
    triggerToast("AI Weekly Planner populated Monday-Friday!");
  };

  // Generate dynamic heatmap grid data based on filters
  const generateHeatmapGrid = () => {
    const hash = (audience + region).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const grid = [];
    const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
    
    for (let hIndex = 0; hIndex < hours.length; hIndex++) {
      const row = [];
      for (let dIndex = 0; dIndex < 7; dIndex++) {
        const score = (hash * (hIndex + 1) * (dIndex + 3)) % 86 + 14;
        row.push({ hour: hours[hIndex], day: weekdays[dIndex], score });
      }
      grid.push(row);
    }
    return grid;
  };

  const heatmapGrid = generateHeatmapGrid();

  // Content Mix calculations
  const totalCount = events.filter(e => weekDates.includes(e.date)).length;
  const thoughtLeadershipCount = events.filter(e => weekDates.includes(e.date) && (e.content.toLowerCase().includes("insight") || e.content.toLowerCase().includes("ai"))).length || 2;
  const productCount = events.filter(e => weekDates.includes(e.date) && (e.content.toLowerCase().includes("saas") || e.content.toLowerCase().includes("product"))).length || 1;
  const personalCount = events.filter(e => weekDates.includes(e.date) && e.content.toLowerCase().includes("story")).length || 0;
  const engagementCount = events.filter(e => weekDates.includes(e.date) && e.type === "Poll").length || 1;

  const totalSum = thoughtLeadershipCount + productCount + personalCount + engagementCount;
  const thoughtPct = Math.round((thoughtLeadershipCount / totalSum) * 100) || 40;
  const productPct = Math.round((productCount / totalSum) * 100) || 30;
  const personalPct = Math.round((personalCount / totalSum) * 100) || 20;
  const engagementPct = 100 - (thoughtPct + productPct + personalPct);

  // Saturation and Gaps
  const isFounderStoryMissing = personalCount === 0;
  const isCaseStudyMissing = !events.some(e => weekDates.includes(e.date) && e.content.toLowerCase().includes("case study"));
  const isPollMissing = engagementCount === 0;

  const scheduledCount = events.filter(e => weekDates.includes(e.date)).length;
  const isSaturated = scheduledCount >= 4;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Content Planner & Calendar</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Map out your LinkedIn content strategy, run gap audits, and schedule drafts into high-performing windows.
          </p>
        </div>
        
        {/* Planner Actions */}
        <button
          onClick={handleAutoPlanWeek}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Zap size={14} className="fill-white" />
          1-Click AI Weekly Planner
        </button>
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-brand-emerald/90 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg animate-in slide-in-from-bottom-4 duration-200">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP PANELS: WEEKLY MIX, GAPS, SATURATION, WINDOW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Content Mix & Gap Analysis Card */}
        <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/40 pb-2">
            Weekly Content Mix
          </h3>
          
          <div className="space-y-2.5">
            {[
              { name: "Thought Leadership", pct: thoughtPct, color: "bg-[#71B7FB]" },
              { name: "Product / SaaS", pct: productPct, color: "bg-brand-purple" },
              { name: "Personal Story", pct: personalPct, color: "bg-brand-rose" },
              { name: "Engagement / Polls", pct: engagementPct, color: "bg-brand-emerald" }
            ].map((mix, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-zinc-655">
                  <span>{mix.name}</span>
                  <span>{mix.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${mix.color} rounded-full`} style={{ width: `${mix.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] text-[10px] text-zinc-500 font-semibold leading-relaxed">
            <strong className="text-brand-purple block uppercase text-[8px] mb-0.5">Recommendation</strong>
            {isFounderStoryMissing ? "Add a Story post to balance your content mix and increase empathy score." : "Your weekly content mix is healthy!"}
          </div>
        </div>

        {/* Content Gap & Saturation Warnings */}
        <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/40 pb-2">
            Intelligence Gaps & Saturation
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Content Gaps Detected</span>
              <div className="space-y-1 text-xs">
                {[
                  { name: "Founder Story", missing: isFounderStoryMissing },
                  { name: "Case Study", missing: isCaseStudyMissing },
                  { name: "Interactive Poll", missing: isPollMissing }
                ].map((gap, i) => (
                  <div key={i} className="flex justify-between items-center font-semibold">
                    <span className="text-zinc-650 dark:text-zinc-350">{gap.name}</span>
                    <span className={`text-[10px] font-bold ${gap.missing ? 'text-brand-rose' : 'text-brand-emerald'}`}>
                      {gap.missing ? '✗ Missing' : '✓ Scheduled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-card-border/40 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Topic Saturation Warning</span>
              {isSaturated ? (
                <div className="p-2 rounded-xl border border-brand-amber/20 bg-brand-amber/[0.02] text-brand-amber text-xs font-semibold flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <div>
                    <span className="block font-bold">Audience Fatigue Risk: High</span>
                    <span className="text-[9px] text-zinc-500 font-medium">{scheduledCount} posts scheduled. Break up technical slots.</span>
                  </div>
                </div>
              ) : (
                <div className="p-2 rounded-xl border border-brand-emerald/20 bg-brand-emerald/[0.02] text-brand-emerald text-xs font-semibold flex items-center gap-1.5">
                  <Check size={14} />
                  Audience Fatigue Risk: Low
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Optimal Posting Window & Why/How/Impact */}
        <div className="glass-panel rounded-xl p-5 border border-card-border/70 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 border-b border-card-border/40 pb-2">
            Posting Window Confidence
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center shrink-0">
              <Clock className="text-brand-emerald" size={18} />
            </div>
            <div>
              <strong className="text-xs text-zinc-800 dark:text-zinc-200 block">Tuesday 8:00 AM (EST)</strong>
              <span className="text-[9px] font-bold text-brand-emerald block">Predicted Reach: +34% | Confidence: High</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-3 border-t border-card-border/40 text-[9px] leading-relaxed font-semibold text-zinc-550">
            <div>
              <strong className="text-brand-purple uppercase tracking-wide block">Why?</strong>
              Tuesday mornings match active feed indexing when B2B SaaS users scan digests.
            </div>
            <div>
              <strong className="text-brand-indigo uppercase tracking-wide block">How?</strong>
              Schedule your Thought Leadership carousel within this exact 8:00-9:00 AM slot.
            </div>
            <div>
              <strong className="text-brand-emerald uppercase tracking-wide block">Impact?</strong>
              <span className="text-brand-emerald font-black block">+34% expected impressions.</span>
            </div>
          </div>
        </div>

      </div>

      {/* WEEKLY CALENDAR GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center glass-panel rounded-xl p-4 border border-card-border/70">
          <div className="flex items-center gap-2">
            <CalendarIcon className="text-brand-purple" size={18} />
            <strong className="text-xs font-black uppercase tracking-wider text-zinc-500">Weekly Scheduled Queue</strong>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-bold">
            <button 
              onClick={handlePrevWeek} 
              className="p-1 rounded-lg border border-card-border/85 bg-[#eef3f8] dark:bg-[#383f47] text-zinc-650 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-bold text-zinc-700 dark:text-zinc-300">
              {new Date(weekDates[0]).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} – {new Date(weekDates[6]).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
            </span>
            <button 
              onClick={handleNextWeek} 
              className="p-1 rounded-lg border border-card-border/85 bg-[#eef3f8] dark:bg-[#383f47] text-zinc-650 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekdays.map((dayName, idx) => {
            const dateStr = weekDates[idx];
            const dayEvents = events.filter(e => e.date === dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            return (
              <div 
                key={idx} 
                className={`glass-panel rounded-xl p-4 min-h-[220px] flex flex-col justify-between border-2 transition-all ${
                  isToday ? 'border-brand-purple/40 bg-brand-purple/[0.01]' : 'border-card-border/70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-card-border/50 pb-2">
                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">{dayName.substring(0, 3)}</span>
                      <span className={`text-xs font-bold ${isToday ? 'text-brand-purple' : 'text-zinc-600 dark:text-zinc-400'}`}>
                        {new Date(dateStr).getDate()}
                      </span>
                    </div>
                    <button
                      onClick={() => { setSelectedDay(dateStr); setShowAddModal(true); }}
                      className="p-1 rounded-md text-brand-purple hover:bg-brand-purple/10 transition-colors"
                      title="Add post for day"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Day Scheduled Posts list */}
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {dayEvents.map(event => (
                      <div key={event.id} className="p-2.5 rounded-lg border border-card-border/60 bg-[#f8f9fa] dark:bg-[#141b22] space-y-1.5 relative group">
                        <div className="flex justify-between items-center text-[9px] font-bold text-zinc-400">
                          <span className="flex items-center gap-0.5">
                            <Clock size={9} />
                            {event.time}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] uppercase ${
                            event.type === 'Carousel' ? 'bg-brand-indigo/10 text-brand-indigo' :
                            event.type === 'Poll' ? 'bg-brand-emerald/10 text-brand-emerald' :
                            'bg-brand-purple/10 text-brand-purple'
                          }`}>{event.type}</span>
                        </div>
                        
                        <p className="text-[10px] text-zinc-750 dark:text-zinc-300 font-semibold leading-relaxed line-clamp-3" title={event.content}>
                          {event.content}
                        </p>

                        <div className="absolute inset-0 bg-[#eef3f8]/95 dark:bg-[#1d2226]/95 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-brand-rose hover:bg-brand-rose/10 p-1.5 rounded"
                            title="Delete scheduled event"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {dayEvents.length === 0 && (
                  <span className="text-[9px] text-zinc-400 italic text-center block py-12">No posts</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Audience Activity Heatmap */}
      <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border/50 pb-4">
          <h3 className="font-bold text-base flex items-center gap-1.5">
            <Users size={16} className="text-brand-emerald" />
            Optimal Posting Windows Heatmap
          </h3>
          
          {/* Selectors */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 border border-card-border/70 bg-[#eef3f8] dark:bg-[#383f47] px-2.5 py-1.5 rounded-lg">
              <Users size={12} className="text-zinc-400" />
              <select 
                value={audience} 
                onChange={(e) => setAudience(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
              >
                <option value="Founders">Founders / VCs</option>
                <option value="Recruiters">Recruiters</option>
                <option value="Engineers">Engineers</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 border border-card-border/70 bg-[#eef3f8] dark:bg-[#383f47] px-2.5 py-1.5 rounded-lg">
              <Globe size={12} className="text-zinc-400" />
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
              >
                <option value="US East">US East (EST)</option>
                <option value="EU Central">EU Central (CET)</option>
                <option value="APAC South">APAC South (IST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Heatmap Matrix grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px] space-y-2">
            <div className="grid grid-cols-8 gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-wider text-center">
              <div>Time</div>
              {weekdays.map(d => <div key={d}>{d.substring(0, 3)}</div>)}
            </div>

            {heatmapGrid.map((row, idx) => (
              <div key={idx} className="grid grid-cols-8 gap-2 items-center text-center">
                <span className="text-[10px] font-bold text-zinc-400">{row[0].hour}</span>
                {row.map((cell, cIdx) => {
                  let colorClass = 'bg-brand-emerald/5 border-brand-emerald/10';
                  if (cell.score >= 80) colorClass = 'bg-brand-emerald/70 border-brand-emerald/80 glow-emerald text-white';
                  else if (cell.score >= 50) colorClass = 'bg-brand-emerald/40 border-brand-emerald/50 text-foreground';
                  else if (cell.score >= 20) colorClass = 'bg-brand-emerald/20 border-brand-emerald/30';
                  
                  return (
                    <div
                      key={cIdx}
                      title={`${cell.day} @ ${cell.hour}: ${cell.score}% activity`}
                      className={`py-2 text-[10px] font-bold rounded-lg border text-center select-none transition-all ${colorClass}`}
                    >
                      {cell.score}%
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 text-[10px] text-zinc-500 font-semibold justify-center">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-emerald/10 border"></span> Low Traffic</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-emerald/40 border"></span> Moderate Traffic</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-emerald/70 border text-white"></span> Optimal Slot</div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel border border-card-border/70 rounded-xl shadow-xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <h3 className="font-bold text-base">Schedule LinkedIn Update</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-zinc-800 text-lg">×</button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-500 block mb-1">Target Date</label>
                <input 
                  type="text" 
                  value={selectedDay} 
                  disabled 
                  className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-zinc-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-zinc-500 block mb-1">Posting Time</label>
                  <input 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-500 block mb-1">Format Type</label>
                  <select 
                    value={postType} 
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none"
                  >
                    <option value="Post">Standard Post</option>
                    <option value="Carousel">Carousel slides</option>
                    <option value="Poll">Feedback Poll</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-500 block mb-1">Post Draft Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write draft update..."
                  rows={4}
                  className="w-full p-3 rounded-lg bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none resize-none font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-card-border">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEvent}
                className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:opacity-90 shadow-md shadow-brand-purple/15"
              >
                Schedule Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
