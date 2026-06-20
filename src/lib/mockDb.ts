// Client-side local storage mock database to persist workspace data.

export interface UserProfile {
  name: string;
  headline: string;
  about: string;
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
  certifications: string[];
  avatarUrl?: string;
  score: number;
}

export interface PostAnalysis {
  id: string;
  content: string;
  score: number;
  breakdown: {
    hook: number;
    readability: number;
    authority: number;
    emotional: number;
    formatting: number;
    cta: number;
    hashtags: number;
    trend: number;
  };
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    virality: 'Low' | 'Medium' | 'High' | 'Viral';
  };
  suggestions: string[];
  timestamp: string;
}

export interface Competitor {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  postFrequency: string;
  avgEngagement: number;
  followers: number;
  growthRate: string;
  topTopics: string[];
  posts: { id: string; content: string; engagement: number; date: string }[];
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  content: string;
  type: string; // 'Post' | 'Carousel' | 'Poll'
  status: 'Scheduled' | 'Draft' | 'Published';
  hookSuggestion?: string;
  ctaSuggestion?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Alex Rivera",
  headline: "Senior Product Manager @ FinTech Leader | Building AI-Driven Growth Engines | Product Strategy Consultant",
  about: "I'm a passionate Product Leader with 8+ years of experience launching and scaling B2B SaaS and fintech applications. Focused on user-centric design, data-driven optimization, and high-performing teams.",
  experience: [
    {
      role: "Lead Product Manager",
      company: "Apex Wealth Technologies",
      duration: "2023 - Present",
      description: "Own the growth roadmap, resulting in a 40% increase in active trial sign-ups. Built an AI recommendations module that drove 18% lift in customer lifetime value."
    },
    {
      role: "Product Manager",
      company: "PayFlow Inc",
      duration: "2020 - 2023",
      description: "Led team of 6 engineers and 2 designers. Launched API integration products which processed $200M+ in transactions annually."
    }
  ],
  skills: ["Product Strategy", "SaaS Growth", "AI/ML Integration", "A/B Testing", "Agile Methodologies"],
  certifications: ["AWS Certified Cloud Practitioner", "Product Alliance Leadership"],
  score: 72
};

const DEFAULT_COMPETITORS: Competitor[] = [
  {
    id: "comp-1",
    name: "Sarah Chen",
    handle: "sarahchen-pm",
    avatarUrl: "",
    postFrequency: "3 posts / week",
    avgEngagement: 1420,
    followers: 48500,
    growthRate: "+4.2%",
    topTopics: ["Product Design", "AI UX", "Career Advice"],
    posts: [
      { id: "p1", content: "How AI is completely reshaping the responsibilities of PMs in 2026. Spoiler: writing tickets is 10% of the job now...", engagement: 2100, date: "2 days ago" },
      { id: "p2", content: "The 3 books that completely changed the way I think about product positioning:", engagement: 950, date: "5 days ago" }
    ]
  },
  {
    id: "comp-2",
    name: "Marcus Vance",
    handle: "marcusv-growth",
    avatarUrl: "",
    postFrequency: "5 posts / week",
    avgEngagement: 2890,
    followers: 102000,
    growthRate: "+7.8%",
    topTopics: ["SaaS Growth", "Viral Loops", "PLG Metrics"],
    posts: [
      { id: "p3", content: "Most companies fail at Product-Led Growth (PLG) because they think it's just a free trial. It's actually...", engagement: 4200, date: "1 day ago" }
    ]
  }
];

const DEFAULT_CALENDAR: CalendarEvent[] = [
  {
    id: "cal-1",
    date: new Date().toISOString().split('T')[0],
    time: "09:00",
    content: "The landscape of LinkedIn content is shifting. Authentic, data-backed personal stories are winning over AI-generated platitudes. Here is what I am doing differently...",
    type: "Post",
    status: "Scheduled",
    hookSuggestion: "LinkedIn is shifting. Authentic stories are beating AI templates.",
    ctaSuggestion: "Are you seeing a drop in templates? Let's discuss."
  }
];

// Helper safe storage
const getStorageItem = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error("Storage error:", e);
    return fallback;
  }
};

const setStorageItem = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

export const mockDb = {
  getProfile: (): UserProfile => getStorageItem("liq_profile", DEFAULT_PROFILE),
  saveProfile: (profile: UserProfile): void => setStorageItem("liq_profile", profile),

  getAnalyses: (): PostAnalysis[] => getStorageItem("liq_analyses", []),
  saveAnalysis: (analysis: PostAnalysis): void => {
    const analyses = mockDb.getAnalyses();
    setStorageItem("liq_analyses", [analysis, ...analyses].slice(0, 50));
  },
  deleteAnalysis: (id: string): void => {
    const analyses = mockDb.getAnalyses();
    setStorageItem("liq_analyses", analyses.filter((a: PostAnalysis) => a.id !== id));
  },

  getCompetitors: (): Competitor[] => getStorageItem("liq_competitors", DEFAULT_COMPETITORS),
  saveCompetitors: (competitors: Competitor[]): void => setStorageItem("liq_competitors", competitors),
  addCompetitor: (competitor: Competitor): void => {
    const list = mockDb.getCompetitors();
    setStorageItem("liq_competitors", [...list, competitor]);
  },

  getCalendar: (): CalendarEvent[] => getStorageItem("liq_calendar", DEFAULT_CALENDAR),
  saveCalendar: (events: CalendarEvent[]): void => setStorageItem("liq_calendar", events),
  addCalendarEvent: (event: CalendarEvent): void => {
    const list = mockDb.getCalendar();
    setStorageItem("liq_calendar", [...list, event]);
  },
  updateCalendarEvent: (event: CalendarEvent): void => {
    const list = mockDb.getCalendar();
    setStorageItem("liq_calendar", list.map((e: CalendarEvent) => e.id === event.id ? event : e));
  },
  deleteCalendarEvent: (id: string): void => {
    const list = mockDb.getCalendar();
    setStorageItem("liq_calendar", list.filter((e: CalendarEvent) => e.id !== id));
  },

  getSubscription: (): { plan: 'Free' | 'Pro' | 'Agency'; status: string; expires: string } => 
    getStorageItem("liq_sub", { plan: 'Free', status: 'Active', expires: 'Never' }),
  saveSubscription: (plan: 'Free' | 'Pro' | 'Agency', status: string, expires: string): void => 
    setStorageItem("liq_sub", { plan, status, expires })
};
