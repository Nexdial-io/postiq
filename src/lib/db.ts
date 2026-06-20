// Full-stack database adapter layer for the Creator Network (connections).
// Operates on localStorage for client-side stateful persistence and mock deployments.

export interface NetworkUser {
  id: string;
  name: string;
  headline: string;
  avatarUrl?: string;
  profileScore: number;  // Profile Strength (0-100)
  contentScore: number;  // Content Creator Score (0-100)
  recruiterScore: number; // Recruiter Appeal Score (0-100)
  seoScore: number;       // LinkedIn SEO Score (0-100)
  about: string;
  skills: string[];
}

export interface ConnectionRelation {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

export const MOCK_NETWORK_USERS: NetworkUser[] = [
  {
    id: "user-alex",
    name: "Alex Rivera",
    headline: "Senior Product Manager @ FinTech Leader | Building AI-Driven Growth Engines | Product Consultant",
    avatarUrl: "", // Initials will be used
    profileScore: 72,
    contentScore: 78,
    recruiterScore: 70,
    seoScore: 75,
    about: "I'm a passionate Product Leader with 8+ years of experience launching and scaling B2B SaaS and fintech applications. Focused on user-centric design, data-driven optimization, and high-performing teams.",
    skills: ["Product Strategy", "SaaS Growth", "AI/ML Integration", "A/B Testing", "Agile Methodologies"]
  },
  {
    id: "user-sarah",
    name: "Sarah Chen",
    headline: "Lead PM & AI Architect | Ex-Google | Tech Writer (48k+ followers) | Speaking on AI UX & Career Growth",
    avatarUrl: "",
    profileScore: 94,
    contentScore: 91,
    recruiterScore: 88,
    seoScore: 92,
    about: "Helping build the future of AI interfaces. Previously Lead PM at Google. I write about AI UX and PM career acceleration.",
    skills: ["Product Management", "Artificial Intelligence", "UX Design", "Public Speaking", "Growth Hacking"]
  },
  {
    id: "user-marcus",
    name: "Marcus Vance",
    headline: "Founder & SaaS Growth Advisor | 102k+ LinkedIn Followers | Sharing PLG Loops & B2B Plays",
    avatarUrl: "",
    profileScore: 88,
    contentScore: 95,
    recruiterScore: 82,
    seoScore: 90,
    about: "Advisor to high-growth B2B SaaS startups. Specializing in Product-Led Growth (PLG), viral loops, and search engine acquisition.",
    skills: ["B2B SaaS", "Product-Led Growth", "Demand Generation", "Consulting", "Personal Branding"]
  },
  {
    id: "user-elena",
    name: "Elena Rostova",
    headline: "Recruiting Director @ Global Scaleups | Career Architect | Hiring Tech Leaders, PMs & Engineers",
    avatarUrl: "",
    profileScore: 85,
    contentScore: 80,
    recruiterScore: 92,
    seoScore: 87,
    about: "10+ years recruiting executive talent and building product organizations. Helping creators align their profiles with recruiter needs.",
    skills: ["Technical Recruiting", "Executive Search", "Career Coaching", "Human Resources", "Talent Acquisition"]
  },
  {
    id: "user-devin",
    name: "Devin Patel",
    headline: "Full-Stack Engineer & Dev Rel | Creating Interactive Web Tools | Writing about Next.js & AI Eng",
    avatarUrl: "",
    profileScore: 79,
    contentScore: 84,
    recruiterScore: 85,
    seoScore: 80,
    about: "Developer advocate building open-source AI integrations. Enthusiastic about TypeScript, Next.js App Router, and prompt engineering.",
    skills: ["Next.js", "TypeScript", "React", "Node.js", "Developer Relations"]
  }
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
    
    // Find all user IDs that have any relationship with the current user
    const relatedIds = relations
      .filter(r => r.senderId === userId || r.receiverId === userId)
      .map(r => r.senderId === userId ? r.receiverId : r.senderId);

    // Also exclude ourselves
    const excludedIds = [...relatedIds, userId];

    return MOCK_NETWORK_USERS
      .filter(u => !excludedIds.includes(u.id))
      .map(u => networkDb.getUserById(u.id))
      .filter((u): u is NetworkUser => u !== undefined);
  }
};
