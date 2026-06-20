"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Globe, 
  Users,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Map
} from 'lucide-react';
import { mockDb, CalendarEvent } from '@/lib/mockDb';

export default function ContentCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form fields
  const [content, setContent] = useState("");
  const [time, setTime] = useState("09:00");
  const [postType, setPostType] = useState('Post');

  // Heatmap controls
  const [industry, setIndustry] = useState("Tech");
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

  useEffect(() => {
    setEvents(mockDb.getCalendar());
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
      id: Math.random().toString(36).substring(7),
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
  };

  const handleDeleteEvent = (id: string) => {
    mockDb.deleteCalendarEvent(id);
    setEvents(mockDb.getCalendar());
  };

  // Pre-generated AI topics to seed the suggestions panel
  const plannerSuggestions = [
    {
      title: "FinTech Scaling Framework",
      hook: "We spent 6 months re-engineering our fintech API checkout. The result? A 40% growth spike.",
      cta: "Drop 'API' in the comments and I'll send you our launch framework checklist! 💬",
      time: "08:15 AM",
      type: "Carousel"
    },
    {
      title: "Product Management Pitfall",
      hook: "Most Product Managers fail because they act as project coordinators instead of strategic leaders.",
      cta: "Are you stuck writing engineers' tickets? Let's discuss in the comments.",
      time: "10:30 AM",
      type: "Post"
    },
    {
      title: "The Autopilot Trend",
      hook: "AI agents aren't replacing developers. They are replacing developers who refuse to adopt AI.",
      cta: "Repost ♻️ if you agree that AI literacy is the new career standard.",
      time: "12:00 PM",
      type: "Poll"
    }
  ];

  const handleApplySuggestion = (sug: typeof plannerSuggestions[0], date: string) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substring(7),
      date,
      time: sug.time.split(' ')[0], // extract 08:15
      content: `${sug.hook}\n\n[Core Content Details]\n\n${sug.cta}`,
      type: sug.type,
      status: 'Draft',
      hookSuggestion: sug.hook,
      ctaSuggestion: sug.cta
    };
    mockDb.addCalendarEvent(newEvent);
    setEvents(mockDb.getCalendar());
  };

  // Generate dynamic heatmap grid data based on filters
  const generateHeatmapGrid = () => {
    const hash = (industry + audience + region).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const grid = [];
    const hours = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
    
    for (let hIndex = 0; hIndex < hours.length; hIndex++) {
      const row = [];
      for (let dIndex = 0; dIndex < 7; dIndex++) {
        // Calculate deterministic score based on selections
        const score = (hash * (hIndex + 1) * (dIndex + 3)) % 100;
        row.push({ hour: hours[hIndex], day: weekdays[dIndex], score });
      }
      grid.push(row);
    }
    return grid;
  };

  const heatmapGrid = generateHeatmapGrid();

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Content Planner & Calendar</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Map out your LinkedIn content strategy, drag-and-drop drafts, and verify optimal scheduling windows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Columns (3): Calendar Grid */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Calendar Header Nav */}
          <div className="flex justify-between items-center glass-panel rounded-xl p-4 border border-card-border/70">
            <div className="flex items-center gap-2">
              <CalendarIcon className="text-brand-purple" size={18} />
              <strong className="text-sm">Weekly View</strong>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-bold">
              <button 
                onClick={handlePrevWeek} 
                className="p-1 rounded-lg border border-card-border/80 bg-[#eef3f8] dark:bg-[#383f47] text-zinc-650 dark:text-zinc-350 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-zinc-700 dark:text-zinc-300">
                {new Date(weekDates[0]).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} – {new Date(weekDates[6]).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
              </span>
              <button 
                onClick={handleNextWeek} 
                className="p-1 rounded-lg border border-card-border/80 bg-[#eef3f8] dark:bg-[#383f47] text-zinc-650 dark:text-zinc-350 hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* 7-Day Week Card Grid */}
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
                            <span className="px-1.5 py-0.2 rounded bg-brand-purple/10 text-brand-purple text-[8px] uppercase">{event.type}</span>
                          </div>
                          
                          <p className="text-[10px] text-zinc-700 dark:text-zinc-300 font-medium truncate">
                            {event.content}
                          </p>

                          <div className="absolute inset-0 bg-background/95 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-brand-rose hover:bg-brand-rose/10 p-1 rounded"
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
                    <span className="text-[9px] text-zinc-400 italic text-center block py-12">Empty</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Best Time to Post Heatmap Widget */}
          <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border/50 pb-4">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <TrendingUp size={16} className="text-brand-emerald" />
                Audience Activity Heatmap
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
                      // Determine bg opacity based on score
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
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-emerald/70 border"></span> Viral Window (Optimal)</div>
            </div>
          </div>
        </div>

        {/* Right Column (1): AI Suggestions Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-card-border/70 space-y-4">
            <h3 className="font-bold text-base flex items-center gap-1.5 border-b border-card-border/50 pb-3">
              <Sparkles className="text-brand-purple" size={16} />
              AI Plan Suggestions
            </h3>
            
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              We generated these post templates for your Fintech PM niche. Click schedule to drop them into your draft list.
            </p>

            <div className="space-y-4">
              {plannerSuggestions.map((sug, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-brand-purple">{sug.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500">{sug.type}</span>
                  </div>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed italic">
                    "{sug.hook}"
                  </p>
                  
                  {/* Select scheduling date */}
                  <div className="flex justify-between items-center pt-2 border-t border-card-border/50">
                    <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-0.5">
                      <Clock size={10} />
                      Best: {sug.time}
                    </span>
                    
                    <button
                      onClick={() => handleApplySuggestion(sug, weekDates[0])}
                      className="px-2.5 py-1 rounded bg-brand-purple/10 text-brand-purple text-[9px] font-bold hover:bg-brand-purple/20 transition-all"
                    >
                      Schedule Mon
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Schedule Event Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel border border-card-border/70 rounded-xl shadow-xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <h3 className="font-bold text-base">Schedule LinkedIn Update</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-zinc-800">×</button>
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
                className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:opacity-90 shadow-md"
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
