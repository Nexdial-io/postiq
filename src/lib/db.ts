// Full-stack database adapter layer for the Creator Network (connections).
// Operates on localStorage for client-side stateful persistence and mock deployments.

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  github?: string;
  twitter?: string;
}

export interface NetworkUser {
  id: string;
  name: string;
  headline: string;
  avatarUrl?: string;
  bannerUrl?: string;
  profileScore: number;  // Profile Strength (0-100)
  contentScore: number;  // Content Creator Score (0-100)
  recruiterScore: number; // Recruiter Appeal Score (0-100)
  seoScore: number;       // LinkedIn SEO Score (0-100)
  about: string;
  skills: string[];
  isVerified?: boolean;
  contactInfo?: ContactInfo;
}

export interface ConnectionRelation {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

const FIRST_NAMES = ["James", "Emma", "Liam", "Olivia", "Noah", "Ava", "Oliver", "Sophia", "Elijah", "Isabella", "William", "Mia", "Lucas", "Charlotte", "Benjamin", "Amelia", "Alexander", "Harper", "Michael", "Evelyn", "Daniel", "Abigail", "Henry", "Emily", "Sebastian", "Elizabeth", "Jack", "Sofia", "Owen", "Avery", "Samuel", "Ella", "Matthew", "Scarlett", "Joseph", "Madison", "Levi", "Layla", "Mateo", "Victoria", "David", "Aria", "John", "Grace", "Wyatt", "Chloe", "Carter", "Camila", "Julian", "Penelope", "Gabriel", "Chloe", "Leo", "Layla", "Jackson", "Lillian", "Lincoln", "Nora", "Ryan", "Zoey"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes"];

const ROLES = [
  {
    title: "Senior Frontend Engineer",
    templates: [
      "Senior Frontend Engineer @ {Company} | React & Next.js Developer | Open Source Contributor",
      "Frontend Architect @ {Company} | Crafting High-Performance Web Applications | UI/UX Enthusiast",
      "Senior Software Engineer @ {Company} | Specialized in TypeScript, React, and Web Standards"
    ],
    about: "Frontend developer with a passion for web performance, accessibility, and modern React architectures. Over {years} years of experience designing scalable design systems and single-page apps.",
    skills: ["React", "TypeScript", "Next.js", "TailwindCSS", "Web Performance", "State Management", "Design Systems"]
  },
  {
    title: "Product Manager",
    templates: [
      "Lead Product Manager @ {Company} | Scaling B2B SaaS & Growth Loops | Ex-{PrevCompany}",
      "Senior PM @ {Company} | AI/ML Products & Data Analytics | User-Centric Design",
      "Product Director @ {Company} | Launching Growth Engines & PLG Plays | Strategy Consultant"
    ],
    about: "Product leader specialized in SaaS growth, customer discovery, and data-driven roadmapping. Managing cross-functional teams to ship impactful software with {years}+ years experience.",
    skills: ["Product Strategy", "SaaS Growth", "A/B Testing", "Agile Roadmap", "Data Analytics", "Customer Discovery"]
  },
  {
    title: "AI Researcher & ML Engineer",
    templates: [
      "AI Researcher @ {Company} | NLP, LLMs & Agentic Frameworks | Ex-Stanford AI",
      "Lead Machine Learning Engineer @ {Company} | Deep Learning & Computer Vision | Speaker",
      "ML Architect @ {Company} | Training Scalable Transformers & GenAI Pipelines"
    ],
    about: "Research scientist pushing the boundaries of generative AI and neural architectures. Publishing papers on LLMs and prompt engineering with {years} years in the tech landscape.",
    skills: ["Machine Learning", "Deep Learning", "PyTorch", "NLP", "LLM Fine-tuning", "Python", "GenAI Agents"]
  },
  {
    title: "Growth Marketer",
    templates: [
      "Head of Growth @ {Company} | B2B SaaS Demand Generation | Writing about Growth Plays",
      "Growth Marketing Manager @ {Company} | Performance Marketing & SEO | Personal Branding Specialist",
      "Founder & SaaS Advisor | Helping startups scale from $0 to $10M ARR | SEO Lead"
    ],
    about: "Data-driven marketer specializing in content acquisition, pay-per-click optimization, and viral loops. Helping tech brands build organic traction with {years}+ years history.",
    skills: ["Growth Marketing", "Search Engine Optimization", "B2B Copywriting", "PPC Analytics", "Conversion Rate Optimization"]
  },
  {
    title: "Talent Acquisition & Recruiter",
    templates: [
      "Principal Tech Recruiter @ {Company} | Building Engineering Teams | Career Coach",
      "Director of Talent Acquisition @ {Company} | Sourcing PMs, Design & Engineering Leaders",
      "Executive Recruiter @ {Company} | Connecting Top Creators with Venture-Backed Startups"
    ],
    about: "Recruiter dedicated to placing high-caliber candidates in technology organizations. Passionate about resume formatting, ATS optimizations, and career transition coaching.",
    skills: ["Talent Acquisition", "Technical Recruiting", "Executive Search", "Resume Review", "ATS Optimization", "Career Coaching"]
  },
  {
    title: "UX/UI Designer",
    templates: [
      "Senior Product Designer @ {Company} | Designing Glassmorphism & High-End Interfaces",
      "Lead UX Designer @ {Company} | Design Systems & User Research | Speaking on Interactive UX",
      "UI/UX Architect @ {Company} | specialized in Mobile App Workflows & SaaS Dashboards"
    ],
    about: "Visual designer crafting premium user experiences that combine aesthetic appeal with frictionless usability. Over {years} years of design experience.",
    skills: ["Product Design", "Figma", "Design Systems", "User Research", "Wireframing", "Interaction Design"]
  }
];

const COMPANIES = ["Stripe", "Vercel", "OpenAI", "Meta", "Google", "Microsoft", "Retool", "Linear", "Supabase", "Figma", "Netflix", "Scale AI", "Anthropic", "Shopify", "Airbnb", "Datadog", "Slack"];
const PREV_COMPANIES = ["Amazon", "Uber", "Apple", "Twitter", "Coinbase", "Plaid", "Intercom", "Dropbox", "HubSpot", "Salesforce"];

const generateDummyUsers = (): NetworkUser[] => {
  const users: NetworkUser[] = [];
  
  // Seeded random number generator to ensure identical server/client output (preventing Next.js hydration mismatches)
  let seed = 12345;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = 1; i <= 105; i++) {
    const firstName = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    
    const roleType = ROLES[Math.floor(random() * ROLES.length)];
    const company = COMPANIES[Math.floor(random() * COMPANIES.length)];
    const prevCompany = PREV_COMPANIES[Math.floor(random() * PREV_COMPANIES.length)];
    
    const template = roleType.templates[Math.floor(random() * roleType.templates.length)];
    const headline = template
      .replace("{Company}", company)
      .replace("{PrevCompany}", prevCompany);
      
    const years = Math.floor(random() * 8) + 3; // 3 to 10 years
    const about = roleType.about
      .replace("{role}", roleType.title.toLowerCase())
      .replace("{years}", years.toString());
      
    const profileScore = Math.floor(random() * 31) + 65;  // 65 to 95
    const contentScore = Math.floor(random() * 31) + 65;  // 65 to 95
    const recruiterScore = Math.floor(random() * 31) + 65;// 65 to 95
    const seoScore = Math.floor(random() * 31) + 65;      // 65 to 95
    
    const bannerIdx = Math.floor(random() * 5);
    const presets = ["Aurora", "Sunset", "Oceanic", "Silk", "Cosmic"];
    const bannerPresetMap: Record<string, string> = {
      Aurora: "gradient:bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500",
      Sunset: "gradient:bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700",
      Oceanic: "gradient:bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-900",
      Silk: "gradient:bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-650",
      Cosmic: "gradient:bg-gradient-to-r from-purple-800 via-indigo-900 to-black"
    };
    const bannerUrl = bannerPresetMap[presets[bannerIdx]];
    
    const contactInfo: ContactInfo = {
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@creatornetwork.net`,
      phone: `+1 (555) ${Math.floor(random() * 900) + 100}-${Math.floor(random() * 9000) + 1000}`,
      website: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.com`,
      github: `https://github.com/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      twitter: `https://x.com/${firstName.toLowerCase()}_${lastName.toLowerCase()}`
    };

    users.push({
      id: `dummy-user-${i}`,
      name,
      headline,
      avatarUrl: "",
      bannerUrl,
      profileScore,
      contentScore,
      recruiterScore,
      seoScore,
      about,
      skills: roleType.skills,
      contactInfo
    });
  }
  return users;
};

export const MOCK_NETWORK_USERS: NetworkUser[] = [
  {
    id: "user-datta",
    name: "Datta Sable",
    headline: "Founder @ Nexdial & PostIQ | Lead Architect | SaaS Growth Strategist",
    avatarUrl: "/author.png",
    bannerUrl: "gradient:bg-gradient-to-r from-purple-800 via-indigo-900 to-black",
    profileScore: 99,
    contentScore: 98,
    recruiterScore: 95,
    seoScore: 97,
    about: "Founder & Lead Architect at PostIQ and Nexdial. Building high-performing creator intelligence systems and B2B automation tools. Reach out at dattasable.com.",
    skills: ["SaaS Growth", "Full-Stack Architecture", "Next.js", "AI Integration", "Product Strategy"],
    isVerified: true,
    contactInfo: {
      email: "datta@nexdial.com",
      phone: "+91 98765 43210",
      website: "https://dattasable.com",
      github: "https://github.com/sabledattatray",
      twitter: "https://x.com/sabledattatray"
    }
  },
  {
    id: "user-alex",
    name: "Alex Rivera",
    headline: "Senior Product Manager @ FinTech Leader | Building AI-Driven Growth Engines | Product Consultant",
    avatarUrl: "",
    bannerUrl: "gradient:bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500",
    profileScore: 72,
    contentScore: 78,
    recruiterScore: 70,
    seoScore: 75,
    about: "I'm a passionate Product Leader with 8+ years of experience launching and scaling B2B SaaS and fintech applications. Focused on user-centric design, data-driven optimization, and high-performing teams.",
    skills: ["Product Strategy", "SaaS Growth", "AI/ML Integration", "A/B Testing", "Agile Methodologies"],
    contactInfo: {
      email: "alex.rivera@payflow.io",
      phone: "+1 (415) 808-2026",
      website: "https://alexrivera.pm",
      github: "https://github.com/alexrivera-pm",
      twitter: "https://x.com/alex_pm_growth"
    }
  },
  {
    id: "user-sarah",
    name: "Sarah Chen",
    headline: "Lead PM & AI Architect | Ex-Google | Tech Writer (48k+ followers) | Speaking on AI UX & Career Growth",
    avatarUrl: "",
    bannerUrl: "gradient:bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700",
    profileScore: 94,
    contentScore: 91,
    recruiterScore: 88,
    seoScore: 92,
    about: "Helping build the future of AI interfaces. Previously Lead PM at Google. I write about AI UX and PM career acceleration.",
    skills: ["Product Management", "Artificial Intelligence", "UX Design", "Public Speaking", "Growth Hacking"],
    contactInfo: {
      email: "sarah.chen@google.com",
      phone: "+1 (650) 555-0199",
      website: "https://sarahchen.ai",
      github: "https://github.com/schen-ai",
      twitter: "https://x.com/sarah_chen_ai"
    }
  },
  {
    id: "user-marcus",
    name: "Marcus Vance",
    headline: "Founder & SaaS Growth Advisor | 102k+ LinkedIn Followers | Sharing PLG Loops & B2B Plays",
    avatarUrl: "",
    bannerUrl: "gradient:bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-900",
    profileScore: 88,
    contentScore: 95,
    recruiterScore: 82,
    seoScore: 90,
    about: "Advisor to high-growth B2B SaaS startups. Specializing in Product-Led Growth (PLG), viral loops, and search engine acquisition.",
    skills: ["B2B SaaS", "Product-Led Growth", "Demand Generation", "Consulting", "Personal Branding"],
    contactInfo: {
      email: "marcus.vance@growthadvisors.co",
      phone: "+1 (302) 444-2390",
      website: "https://marcusvance.com",
      github: "https://github.com/mvance-growth",
      twitter: "https://x.com/marcusv_growth"
    }
  },
  {
    id: "user-elena",
    name: "Elena Rostova",
    headline: "Recruiting Director @ Global Scaleups | Career Architect | Hiring Tech Leaders, PMs & Engineers",
    avatarUrl: "",
    bannerUrl: "gradient:bg-gradient-to-r from-purple-800 via-indigo-900 to-black",
    profileScore: 85,
    contentScore: 80,
    recruiterScore: 92,
    seoScore: 87,
    about: "10+ years recruiting executive talent and building product organizations. Helping creators align their profiles with recruiter needs.",
    skills: ["Technical Recruiting", "Executive Search", "Career Coaching", "Human Resources", "Talent Acquisition"],
    contactInfo: {
      email: "elena@rostovatap.com",
      phone: "+44 20 7946 0958",
      website: "https://rostovacareers.com",
      github: "https://github.com/elena-rostova",
      twitter: "https://x.com/elena_recruiting"
    }
  },
  {
    id: "user-devin",
    name: "Devin Patel",
    headline: "Full-Stack Engineer & Dev Rel | Creating Interactive Web Tools | Writing about Next.js & AI Eng",
    avatarUrl: "",
    bannerUrl: "gradient:bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-650",
    profileScore: 79,
    contentScore: 84,
    recruiterScore: 85,
    seoScore: 80,
    about: "Developer advocate building open-source AI integrations. Enthusiastic about TypeScript, Next.js App Router, and prompt engineering.",
    skills: ["Next.js", "TypeScript", "React", "Node.js", "Developer Relations"],
    contactInfo: {
      email: "devin@pateldev.io",
      phone: "+1 (512) 555-0144",
      website: "https://pateldev.io",
      github: "https://github.com/devinpatel",
      twitter: "https://x.com/devinpatel_dev"
    }
  },
  ...generateDummyUsers()
];

const DEFAULT_RELATIONS: ConnectionRelation[] = [
  // Marcus is already connected to Alex
  {
    id: "rel-1",
    senderId: "user-marcus",
    receiverId: "user-alex",
    status: 'accepted',
    timestamp: "2 days ago"
  },
  // Devin is already connected to Alex
  {
    id: "rel-2",
    senderId: "user-alex",
    receiverId: "user-devin",
    status: 'accepted',
    timestamp: "5 days ago"
  },
  // Elena sent an incoming request to Alex (Pending)
  {
    id: "rel-3",
    senderId: "user-elena",
    receiverId: "user-alex",
    status: 'pending',
    timestamp: "1 hour ago"
  }
];

// Helper functions for storage persistence
const getStorageData = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageData = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

export const networkDb = {
  // Active Simulated Persona Selection
  getActiveUserId: (): string => getStorageData("liq_active_user", "user-alex"),
  setActiveUserId: (userId: string): void => setStorageData("liq_active_user", userId),
  
  getActiveUser: (): NetworkUser => {
    const activeId = networkDb.getActiveUserId();
    return networkDb.getUserById(activeId) || MOCK_NETWORK_USERS[0];
  },

  getUserById: (id: string): NetworkUser | undefined => {
    const overrides = getStorageData<{ [id: string]: Partial<NetworkUser> }>("liq_user_overrides", {});
    const baseUser = MOCK_NETWORK_USERS.find(u => u.id === id);
    if (!baseUser) return undefined;
    if (overrides[id]) {
      return { ...baseUser, ...overrides[id] };
    }
    return baseUser;
  },

  updateUser: (userId: string, updates: Partial<NetworkUser>): void => {
    const overrides = getStorageData<{ [id: string]: Partial<NetworkUser> }>("liq_user_overrides", {});
    overrides[userId] = { ...(overrides[userId] || {}), ...updates };
    setStorageData("liq_user_overrides", overrides);
  },

  // Relations database
  getRelations: (): ConnectionRelation[] => getStorageData("liq_relations", DEFAULT_RELATIONS),
  saveRelations: (relations: ConnectionRelation[]): void => setStorageData("liq_relations", relations),

  // Retrieve connections for a user
  getConnections: (userId: string): NetworkUser[] => {
    const relations = networkDb.getRelations();
    const connectedIds = relations
      .filter(r => r.status === 'accepted' && (r.senderId === userId || r.receiverId === userId))
      .map(r => r.senderId === userId ? r.receiverId : r.senderId);
    
    return connectedIds
      .map(id => networkDb.getUserById(id))
      .filter((u): u is NetworkUser => u !== undefined);
  },

  // Retrieve pending requests sent to a user
  getPendingRequests: (userId: string): NetworkUser[] => {
    const relations = networkDb.getRelations();
    const pendingSenderIds = relations
      .filter(r => r.status === 'pending' && r.receiverId === userId)
      .map(r => r.senderId);
    
    return pendingSenderIds
      .map(id => networkDb.getUserById(id))
      .filter((u): u is NetworkUser => u !== undefined);
  },

  // Retrieve connections that have pending requests sent BY a user (outgoing)
  getSentPendingRequests: (userId: string): string[] => {
    const relations = networkDb.getRelations();
    return relations
      .filter(r => r.status === 'pending' && r.senderId === userId)
      .map(r => r.receiverId);
  },

  // Send a connection request
  sendConnectionRequest: (senderId: string, receiverId: string): void => {
    const relations = networkDb.getRelations();
    
    // Check if relation already exists
    const exists = relations.some(r => 
      (r.senderId === senderId && r.receiverId === receiverId) ||
      (r.senderId === receiverId && r.receiverId === senderId)
    );
    if (exists) return;

    const newRelation: ConnectionRelation = {
      id: `rel-${Date.now()}`,
      senderId,
      receiverId,
      status: 'pending',
      timestamp: "Just now"
    };

    networkDb.saveRelations([...relations, newRelation]);
  },

  // Accept a connection request
  acceptConnectionRequest: (userId: string, senderId: string): void => {
    const relations = networkDb.getRelations();
    const updated = relations.map(r => {
      if (r.status === 'pending' && r.senderId === senderId && r.receiverId === userId) {
        return { ...r, status: 'accepted' as const, timestamp: "Just now" };
      }
      return r;
    });
    networkDb.saveRelations(updated);
  },

  // Reject/remove a connection or request
  removeConnectionOrRequest: (userId: string, targetId: string): void => {
    const relations = networkDb.getRelations();
    const filtered = relations.filter(r => 
      !(
        (r.senderId === userId && r.receiverId === targetId) ||
        (r.senderId === targetId && r.receiverId === userId)
      )
    );
    networkDb.saveRelations(filtered);
  },

  // Discover new creators (not connected, no pending requests)
  getDiscoverCreators: (userId: string): NetworkUser[] => {
    const relations = networkDb.getRelations();
    
    // Find all user IDs that have an accepted relationship with the current user, or sent a pending request to the current user
    const excludedIds = relations
      .filter(r => 
        (r.status === 'accepted' && (r.senderId === userId || r.receiverId === userId)) ||
        (r.status === 'pending' && r.receiverId === userId)
      )
      .map(r => r.senderId === userId ? r.receiverId : r.senderId);

    // Also exclude ourselves
    const finalExcluded = [...excludedIds, userId];

    return MOCK_NETWORK_USERS
      .filter(u => !finalExcluded.includes(u.id))
      .map(u => networkDb.getUserById(u.id))
      .filter((u): u is NetworkUser => u !== undefined);
  }
};
