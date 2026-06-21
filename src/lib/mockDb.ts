// Client-side local storage mock database to persist workspace data.
import { networkDb, ContactInfo } from './db';

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
  bannerUrl?: string;
  score: number;
  isVerified?: boolean;
  contactInfo?: ContactInfo;
}

export interface PostComment {
  id: string;
  authorName: string;
  authorHeadline: string;
  authorAvatarUrl?: string;
  authorIsVerified?: boolean;
  content: string;
  timestamp: string;
  likes: number;
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
  comments?: PostComment[];
  scrollStopperScore?: number;
  hookExplanations?: {
    curiosity: boolean;
    statistic: boolean;
    contrarian: boolean;
    question: boolean;
    recommendation: string;
  };
  originalScore?: number;
  potentialIssues?: string[];
  missingElements?: string[];
  audienceMatch?: {
    founders: number;
    creators: number;
    recruiters: number;
  };
  personalBrandScore?: number;
  personalBrandSignals?: {
    authority: number;
    expertise: number;
    uniqueness: number;
    trust: number;
  };
  transparencyReport?: {
    hook: { curiosity: boolean; statistic: boolean; contrarian: boolean; question: boolean };
    readability: { sentenceLength: boolean; paragraphBreaks: boolean; punchyFormatting: boolean };
    authority: { frameworkName: boolean; metricsProvided: boolean; experienceClaim: boolean };
    emotional: { emotionalWords: boolean; moderateEmojis: boolean; authenticTone: boolean };
    cta: { lowFrictionPrompt: boolean; engagementQuestion: boolean; explicitNextStep: boolean };
  };
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

const MOCK_CREATOR_COMMENTS = [
  {
    authorName: "Sarah Chen",
    authorHeadline: "Lead PM @ Google | AI Architect",
    authorIsVerified: true,
    content: "This is pure gold! The way you structured the hook is highly engaging. Definitely saving this for reference.",
    timestamp: "2 hours ago"
  },
  {
    authorName: "Marcus Vance",
    authorHeadline: "SaaS Growth Advisor | B2B PLG Lead",
    authorIsVerified: false,
    content: "Excellent formatting. The single-sentence spacing makes this incredibly easy to scan on mobile devices.",
    timestamp: "3 hours ago"
  },
  {
    authorName: "Devin Patel",
    authorHeadline: "Dev Advocate @ Next.js | AI Engineer",
    authorIsVerified: false,
    content: "Spot on! Adding data points in the first 3 lines increases authority indexing significantly.",
    timestamp: "5 hours ago"
  },
  {
    authorName: "Elena Rostova",
    authorHeadline: "Recruiting Director | Sourcing Executive Talent",
    authorIsVerified: false,
    content: "From a recruiter's perspective, this level of clarity in communication is exactly what stands out in a candidate's profile.",
    timestamp: "1 day ago"
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

const getFallbackProfileForUser = (userId: string): UserProfile => {
  const user = networkDb.getUserById(userId);
  if (!user) return DEFAULT_PROFILE;
  
  return {
    name: user.name,
    headline: user.headline,
    about: user.about,
    experience: userId === 'user-alex' ? DEFAULT_PROFILE.experience : [
      {
        role: user.headline.split('|')[0].trim(),
        company: "Creator Academy",
        duration: "2022 - Present",
        description: `Lead growth and content strategy. Focused on LinkedIn marketing, personal branding, and B2B SaaS consulting.`
      }
    ],
    skills: user.skills,
    certifications: userId === 'user-alex' ? DEFAULT_PROFILE.certifications : ["PostIQ Certified Creator", "LinkedIn Growth Strategist"],
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    score: user.profileScore,
    isVerified: user.isVerified,
    contactInfo: user.contactInfo
  };
};

export const mockDb = {
  getProfile: (): UserProfile => {
    const activeId = networkDb.getActiveUserId();
    const fallback = getFallbackProfileForUser(activeId);
    return getStorageItem(`liq_profile_${activeId}`, fallback);
  },
  saveProfile: (profile: UserProfile): void => {
    const activeId = networkDb.getActiveUserId();
    setStorageItem(`liq_profile_${activeId}`, profile);
    
    // Synchronize to the network database representation so it reflects in layouts and network tab instantly
    networkDb.updateUser(activeId, {
      name: profile.name,
      headline: profile.headline,
      avatarUrl: profile.avatarUrl,
      bannerUrl: profile.bannerUrl,
      profileScore: profile.score,
      isVerified: profile.isVerified,
      contactInfo: profile.contactInfo
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('liq-profile-updated'));
    }
  },

  getAnalyses: (): PostAnalysis[] => {
    const list = getStorageItem("liq_analyses", []);
    let updated = false;
    const mapped = list.map((post: PostAnalysis) => {
      if (!post.comments || post.comments.length === 0) {
        updated = true;
        const seedVal = post.id.split('-').pop() || "0";
        const numSeed = Number(seedVal) || 0;
        const seedIndex1 = numSeed % MOCK_CREATOR_COMMENTS.length;
        const seedIndex2 = (numSeed + 1) % MOCK_CREATOR_COMMENTS.length;
        const postComments = [
          {
            id: `c-seed-1-${post.id}`,
            ...MOCK_CREATOR_COMMENTS[seedIndex1],
            likes: (numSeed % 12) + 3
          },
          {
            id: `c-seed-2-${post.id}`,
            ...MOCK_CREATOR_COMMENTS[seedIndex2],
            likes: (numSeed % 5) + 1
          }
        ];
        return {
          ...post,
          comments: postComments
        };
      }
      return post;
    });
    if (updated) {
      setStorageItem("liq_analyses", mapped);
    }
    return mapped;
  },
  saveAnalysis: (analysis: PostAnalysis): void => {
    const analyses = mockDb.getAnalyses();
    // Default comments if new analysis is added
    const withComments = {
      ...analysis,
      comments: analysis.comments || [
        {
          id: `c-seed-1-${analysis.id}`,
          authorName: "Sarah Chen",
          authorHeadline: "Lead PM @ Google | AI Architect",
          authorIsVerified: true,
          content: "Really strong hook structure! The readability index on this is fantastic.",
          timestamp: "Just now",
          likes: 2
        }
      ]
    };
    setStorageItem("liq_analyses", [withComments, ...analyses].slice(0, 50));
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

  getSubscription: (): { plan: 'Free' | 'Pro'; status: string; expires: string } => 
    getStorageItem("liq_sub", { plan: 'Free', status: 'Active', expires: 'Never' }),
  saveSubscription: (plan: 'Free' | 'Pro', status: string, expires: string): void => 
    setStorageItem("liq_sub", { plan, status, expires })
};
