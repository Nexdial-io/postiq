"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Check, 
  X, 
  Search, 
  Sparkles, 
  TrendingUp, 
  ArrowLeftRight, 
  UserCheck, 
  Bookmark, 
  MessageSquare,
  ShieldAlert,
  Zap,
  Globe,
  Copy,
  Mail,
  Phone,
  AlertCircle
} from 'lucide-react';
import { networkDb, NetworkUser, MOCK_NETWORK_USERS } from '@/lib/db';

const GithubIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = ({ className, size = 16 }: { className?: string; size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip
} from 'recharts';

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'invites' | 'discover'>('connections');
  const [activeUser, setActiveUser] = useState<NetworkUser | null>(null);
  const [connections, setConnections] = useState<NetworkUser[]>([]);
  const [pendingRequests, setPendingRequests] = useState<NetworkUser[]>([]);
  const [discoverCreators, setDiscoverCreators] = useState<NetworkUser[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Comparative modal state
  const [compareTarget, setCompareTarget] = useState<NetworkUser | null>(null);
  const [comparisonType, setComparisonType] = useState<'connection' | 'top_performer' | 'industry_avg' | 'network_avg'>('connection');
  const [showShareReport, setShowShareReport] = useState(false);
  const [chartMounted, setChartMounted] = useState(false);
  const [selectedContactUser, setSelectedContactUser] = useState<NetworkUser | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setChartMounted(true);
    loadNetworkData();
  }, []);

  const loadNetworkData = () => {
    const user = networkDb.getActiveUser();
    setActiveUser(user);

    // Seed 3 incoming invitations if they are a new registered user with no connections/invites yet
    const currentRelations = networkDb.getRelations();
    const hasAnyRelations = currentRelations.some(r => r.senderId === user.id || r.receiverId === user.id);
    
    if (user.id.startsWith('custom-user-') && !hasAnyRelations) {
      const dummyPool = MOCK_NETWORK_USERS.filter(u => u.id.startsWith('dummy-user-'));
      if (dummyPool.length >= 3) {
        const seededRelations = [
          ...currentRelations,
          {
            id: `rel-seed-1`,
            senderId: dummyPool[0].id,
            receiverId: user.id,
            status: 'pending' as const,
            timestamp: "2 hours ago"
          },
          {
            id: `rel-seed-2`,
            senderId: dummyPool[1].id,
            receiverId: user.id,
            status: 'pending' as const,
            timestamp: "5 hours ago"
          },
          {
            id: `rel-seed-3`,
            senderId: dummyPool[2].id,
            receiverId: user.id,
            status: 'pending' as const,
            timestamp: "1 day ago"
          }
        ];
        networkDb.saveRelations(seededRelations);
      }
    }

    setConnections(networkDb.getConnections(user.id));
    setPendingRequests(networkDb.getPendingRequests(user.id));
    setDiscoverCreators(networkDb.getDiscoverCreators(user.id));
    setSentRequests(networkDb.getSentPendingRequests(user.id));
  };

  const handleAcceptRequest = (senderId: string) => {
    if (!activeUser) return;
    networkDb.acceptConnectionRequest(activeUser.id, senderId);
    loadNetworkData();
  };

  const handleDeclineRequest = (senderId: string) => {
    if (!activeUser) return;
    networkDb.removeConnectionOrRequest(activeUser.id, senderId);
    loadNetworkData();
  };

  const handleSendRequest = (receiverId: string) => {
    if (!activeUser) return;
    networkDb.sendConnectionRequest(activeUser.id, receiverId);
    loadNetworkData();
  };

  const handleDisconnect = (targetId: string) => {
    if (!activeUser) return;
    if (confirm("Are you sure you want to disconnect from this creator?")) {
      networkDb.removeConnectionOrRequest(activeUser.id, targetId);
      loadNetworkData();
    }
  };

  // Filter discover creators by search query
  const filteredDiscover = discoverCreators.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.headline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter connections by search query
  const filteredConnections = connections.filter(creator => 
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.headline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Average Score of all connected creators
  const averageNetworkScore = connections.length > 0 
    ? Math.round(connections.reduce((acc, c) => acc + c.profileScore, 0) / connections.length)
    : 0;

  // Data for Recharts Radar comparison
  const getComparisonData = (targetScores: { profile: number; content: number; recruiter: number; seo: number }) => {
    if (!activeUser) return [];
    return [
      { subject: 'Profile Strength', You: activeUser.profileScore, Target: targetScores.profile, fullMark: 100 },
      { subject: 'Content Creator', You: activeUser.contentScore, Target: targetScores.content, fullMark: 100 },
      { subject: 'Recruiter Appeal', You: activeUser.recruiterScore, Target: targetScores.recruiter, fullMark: 100 },
      { subject: 'SEO Position', You: activeUser.seoScore, Target: targetScores.seo, fullMark: 100 },
    ];
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Area */}
      <div className="relative rounded-3xl overflow-hidden border border-card-border/50 bg-[#1d2226] dark:bg-[#1d2226] text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-[200px] h-[200px] rounded-full bg-brand-emerald/10 blur-[80px] pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10 text-center md:text-left max-w-xl">
          <div className="inline-flex items-center gap-1 bg-brand-purple/20 text-brand-purple border border-brand-purple/20 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <Zap size={12} className="animate-pulse" />
            Creator Collaboration Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Connect with High-Scoring Creators
          </h1>
          <p className="text-sm text-zinc-350 leading-relaxed font-semibold">
            Evaluate your LinkedIn profile strength, discover content synergies, and compare creator stats side-by-side with other professionals.
          </p>
        </div>

        {/* Network Metrics Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full md:w-auto relative z-10 shrink-0">
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center flex flex-col justify-center min-w-[90px] md:min-w-[110px]">
            <span className="text-[10px] uppercase font-black text-zinc-455 tracking-wider">Connected</span>
            <span className="text-2xl font-black text-[#71B7FB] mt-1">{connections.length}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center flex flex-col justify-center min-w-[90px] md:min-w-[110px]">
            <span className="text-[10px] uppercase font-black text-zinc-455 tracking-wider">Invites</span>
            <span className="text-2xl font-black text-brand-emerald mt-1">{pendingRequests.length}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center flex flex-col justify-center min-w-[90px] md:min-w-[110px]">
            <span className="text-[10px] uppercase font-black text-zinc-455 tracking-wider">Avg Score</span>
            <span className="text-2xl font-black text-brand-amber mt-1">{averageNetworkScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Tabs Sidebar, List Center, Network Health Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Column 1: Filter Tabs & Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel border border-card-border/75 rounded-2xl p-4 bg-card-bg">
            <h3 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider mb-3 px-1">My Network</h3>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => { setActiveTab('connections'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'connections'
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>Connections</span>
                </div>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">{connections.length}</span>
              </button>

              <button
                onClick={() => { setActiveTab('invites'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'invites'
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <UserPlus size={14} />
                  <span>Pending Invites</span>
                </div>
                {pendingRequests.length > 0 && (
                  <span className="text-[10px] bg-brand-emerald text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { setActiveTab('discover'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'discover'
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} />
                  <span>Discover Creators</span>
                </div>
                <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">{discoverCreators.length}</span>
              </button>
            </div>
          </div>
          
          {/* Pro Promotion Panel */}
          <div className="glass-panel border border-brand-amber/20 rounded-2xl p-4 bg-gradient-to-tr from-brand-amber/5 to-transparent relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="text-[9px] font-black tracking-wider uppercase bg-brand-amber/20 text-brand-amber border border-brand-amber/25 px-2 py-0.5 rounded-full">
                Premium Feature
              </span>
              <h4 className="font-extrabold text-xs">Unlock Creator Circles</h4>
              <p className="text-[10px] text-zinc-500 leading-normal font-semibold">
                Access verified creator benchmark datasets and track competitor analytics with direct dashboard synchronization.
              </p>
              <button className="w-full mt-2 py-2 rounded-xl bg-brand-amber text-black hover:opacity-95 text-[10px] font-black transition-all shadow-md shadow-brand-amber/15 cursor-pointer">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Main directory lists */}
        <div className="lg:col-span-2 space-y-4">
          
          {(activeTab === 'connections' || activeTab === 'discover') && (
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-3 text-zinc-400" size={15} />
              <input
                type="text"
                placeholder={activeTab === 'connections' ? "Search your connections..." : "Search creators by name, headline, topic..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card-bg border border-card-border/75 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-brand-purple transition-all text-zinc-900 dark:text-white font-semibold"
              />
            </div>
          )}

          {/* TAB 1: CONNECTIONS LIST */}
          {activeTab === 'connections' && (
            <div className="space-y-3">
              {filteredConnections.length > 0 ? (
                filteredConnections.map((creator) => (
                  <div 
                    key={creator.id} 
                    className="glass-panel border border-card-border/75 rounded-2xl p-4 md:p-5 bg-card-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-brand-purple/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4 flex-grow min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white font-black text-lg uppercase shadow-inner shrink-0 overflow-hidden">
                        {creator.avatarUrl ? (
                          <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
                        ) : (
                          creator.name[0]
                        )}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate flex items-center gap-1.5">
                          {creator.name}
                          {creator.isVerified && (
                            <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                              <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">
                            {creator.profileScore}%
                          </span>
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-semibold truncate leading-normal pr-4">
                          {creator.headline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                      <button 
                        onClick={() => setSelectedContactUser(creator)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-card-border hover:border-brand-purple hover:text-brand-purple text-[10px] font-black text-zinc-650 dark:text-zinc-350 transition-all cursor-pointer"
                      >
                        <Globe size={12} className="text-brand-purple" />
                        Contact Info
                      </button>

                      <button 
                        onClick={() => setCompareTarget(creator)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-card-border hover:border-brand-purple hover:text-brand-purple text-[10px] font-black text-zinc-650 dark:text-zinc-350 transition-all cursor-pointer"
                      >
                        <ArrowLeftRight size={12} />
                        Compare
                      </button>
                      
                      <button 
                        onClick={() => handleDisconnect(creator.id)}
                        className="p-2 rounded-xl border border-transparent hover:border-brand-rose/25 text-zinc-400 hover:text-brand-rose transition-all cursor-pointer"
                        title="Disconnect"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (() => {
                // Exclude the active user themselves from the discover hint
                const discoverMatches = searchQuery.length >= 3 ? discoverCreators.filter(creator => 
                  creator.id !== activeUser?.id &&
                  (creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  creator.headline.toLowerCase().includes(searchQuery.toLowerCase()))
                ) : [];

                // Check if the searched user is in pending invites (min 3 chars to avoid false positives)
                const pendingMatches = searchQuery.length >= 3 ? pendingRequests.filter(creator =>
                  creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  creator.headline.toLowerCase().includes(searchQuery.toLowerCase())
                ) : [];

                return (
                  <div className="glass-panel border border-card-border/75 rounded-2xl p-12 bg-card-bg text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                      <Users size={20} />
                    </div>
                    <h4 className="font-black text-sm">No connections found</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto font-semibold">
                      {searchQuery ? "No creators matched your search query in connections." : "Discover and connect with other LinkedIn creators to start comparing analytics."}
                    </p>
                    {searchQuery && pendingMatches.length > 0 ? (
                      <div className="p-4 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/[0.02] max-w-sm mx-auto space-y-3 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <p className="text-[10px] text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold">
                          <strong className="text-zinc-900 dark:text-white">{pendingMatches[0].name}</strong> has already sent you a connection request! Accept it in <strong>Pending Invites</strong>.
                        </p>
                        <button 
                          onClick={() => { setActiveTab('invites'); }}
                          className="px-4 py-2 rounded-xl bg-brand-emerald text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-emerald/10 cursor-pointer w-full flex items-center justify-center gap-1"
                        >
                          <Check size={11} />
                          View Pending Invites
                        </button>
                      </div>
                    ) : searchQuery && discoverMatches.length > 0 ? (
                      <div className="p-4 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.02] max-w-sm mx-auto space-y-3 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <p className="text-[10px] text-zinc-550 dark:text-zinc-400 leading-relaxed font-semibold">
                          We found <strong className="text-zinc-900 dark:text-white">{discoverMatches.length} matching creator(s)</strong> in the <strong>Discover Creators</strong> tab, including <strong>{discoverMatches[0].name}</strong>!
                        </p>
                        <button 
                          onClick={() => setActiveTab('discover')}
                          className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/10 cursor-pointer w-full flex items-center justify-center gap-1"
                        >
                          <Sparkles size={11} />
                          Search in Discover
                        </button>
                      </div>
                    ) : searchQuery ? (
                      <button 
                        onClick={() => { setActiveTab('discover'); }}
                        className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/10 cursor-pointer"
                      >
                        Search discover directory
                      </button>
                    ) : (
                      <button 
                        onClick={() => setActiveTab('discover')}
                        className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/10 cursor-pointer"
                      >
                        Discover Creators
                      </button>
                    )}
                   </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: PENDING INVITES */}
          {activeTab === 'invites' && (
            <div className="space-y-3">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((creator) => (
                  <div 
                    key={creator.id} 
                    className="glass-panel border border-card-border/75 rounded-2xl p-4 md:p-5 bg-card-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-brand-purple/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 flex-grow min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white font-black text-lg uppercase shadow-inner shrink-0 overflow-hidden">
                        {creator.avatarUrl ? (
                          <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
                        ) : (
                          creator.name[0]
                        )}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate flex items-center gap-1.5">
                          {creator.name}
                          {creator.isVerified && (
                            <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                              <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">
                            {creator.profileScore}%
                          </span>
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-semibold truncate leading-normal pr-4">
                          {creator.headline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                      <button 
                        onClick={() => setSelectedContactUser(creator)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl border border-card-border hover:border-brand-purple hover:text-brand-purple text-[10px] font-black text-zinc-650 dark:text-zinc-355 transition-all cursor-pointer"
                      >
                        <Globe size={11} className="text-brand-purple" />
                        Contact
                      </button>
                      <button 
                        onClick={() => handleAcceptRequest(creator.id)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4.5 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/15 cursor-pointer"
                      >
                        <Check size={12} />
                        Accept
                      </button>
                      <button 
                        onClick={() => handleDeclineRequest(creator.id)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-card-border text-zinc-650 dark:text-zinc-350 hover:bg-brand-rose/5 hover:border-brand-rose hover:text-brand-rose text-[10px] font-black transition-all cursor-pointer"
                      >
                        <X size={12} />
                        Ignore
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel border border-card-border/75 rounded-2xl p-12 bg-card-bg text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <UserPlus size={20} />
                  </div>
                  <h4 className="font-black text-sm">No pending requests</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto font-semibold">
                    You have no incoming connection requests at the moment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISCOVER DIRECTORY */}
          {activeTab === 'discover' && (
            <div className="space-y-3">
              {filteredDiscover.length > 0 ? (
                filteredDiscover.map((creator) => {
                  const isSent = sentRequests.includes(creator.id);
                  return (
                    <div 
                      key={creator.id} 
                      className="glass-panel border border-card-border/75 rounded-2xl p-4 md:p-5 bg-card-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-brand-purple/20 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4 flex-grow min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white font-black text-lg uppercase shadow-inner shrink-0 overflow-hidden">
                          {creator.avatarUrl ? (
                            <img src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
                          ) : (
                            creator.name[0]
                          )}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate flex items-center gap-1.5">
                            {creator.name}
                            {creator.isVerified && (
                              <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                                <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            )}
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">
                              {creator.profileScore}%
                            </span>
                          </h4>
                          <p className="text-[11px] text-zinc-500 font-semibold truncate leading-normal pr-4">
                            {creator.headline}
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0 flex gap-2 justify-end">
                        <button
                          onClick={() => setSelectedContactUser(creator)}
                          className="p-2 rounded-xl border border-card-border hover:border-brand-purple hover:text-brand-purple text-zinc-450 dark:text-zinc-355 transition-all cursor-pointer"
                          title="Contact Info"
                        >
                          <Globe size={13} />
                        </button>
                        {isSent ? (
                          <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-card-border text-[10px] font-black cursor-default">
                            <Check size={11} />
                            Requested
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleSendRequest(creator.id)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4.5 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/15 cursor-pointer"
                          >
                            <UserPlus size={12} />
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (() => {
                // Check if the searched person is in pending invites (min 3 chars to avoid false positives)
                const pendingDiscoverMatches = searchQuery.length >= 3 ? pendingRequests.filter(creator =>
                  creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  creator.headline.toLowerCase().includes(searchQuery.toLowerCase())
                ) : [];

                // Check if it's the active user searching for themselves (min 3 chars)
                const isSelf = searchQuery.length >= 3 && activeUser &&
                  (activeUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  activeUser.headline.toLowerCase().includes(searchQuery.toLowerCase()));

                return (
                  <div className="glass-panel border border-card-border/75 rounded-2xl p-12 bg-card-bg text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                      <Search size={20} />
                    </div>
                    <h4 className="font-black text-sm">No creators found</h4>
                    {isSelf ? (
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto font-semibold">
                        That&apos;s you! You can&apos;t connect with yourself.
                      </p>
                    ) : pendingDiscoverMatches.length > 0 ? (
                      <div className="space-y-3">
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto font-semibold">
                          <strong className="text-zinc-800 dark:text-zinc-200">{pendingDiscoverMatches[0].name}</strong> already sent you a connection request!
                        </p>
                        <button
                          onClick={() => setActiveTab('invites')}
                          className="px-4 py-2 rounded-xl bg-brand-emerald text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-emerald/10 cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <Check size={11} />
                          View Pending Invites
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto font-semibold">
                        {searchQuery ? "No creators matched your search query." : "All registered PostIQ creators are already connected to your network!"}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

        </div>

        {/* Column 4: Network Health Dashboard Column */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Network Health Score Card */}
          <div className="glass-panel border border-card-border/75 rounded-2xl p-5 bg-card-bg space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/5 rounded-full blur-xl pointer-events-none"></div>
            
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550 border-b border-card-border/40 pb-2 flex items-center gap-1">
              <Zap size={13} className="text-brand-purple" />
              Network Health
            </h3>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full border-4 border-brand-purple/20 bg-brand-purple/5 flex items-center justify-center font-black text-brand-purple text-lg select-none">
                74
                <span className="text-[8px] text-zinc-550 absolute bottom-1.5">/100</span>
              </div>
              <div className="text-[10px] leading-normal font-semibold text-zinc-500">
                <strong className="text-zinc-700 dark:text-zinc-300">Target Range Achieved.</strong>
                Connect with recruiters or founders to push score past 85.
              </div>
            </div>

            {/* Why/How/Impact */}
            <div className="pt-3 border-t border-card-border/40 text-[9px] leading-relaxed font-semibold text-zinc-550 space-y-2">
              <div>
                <strong className="text-brand-purple uppercase tracking-wide block mb-0.5">Why?</strong>
                Network score tracks your connection overlap with target hiring pools and creators.
              </div>
              <div>
                <strong className="text-brand-indigo uppercase tracking-wide block mb-0.5">How?</strong>
                Accept pending invites and expand your founder network in discover.
              </div>
              <div>
                <strong className="text-brand-emerald uppercase tracking-wide block mb-0.5">Impact?</strong>
                <span className="text-brand-emerald font-black block">+15% Est. Social Selling Index (SSI)</span>
              </div>
            </div>
          </div>

          {/* Audience Breakdown Widget */}
          <div className="glass-panel border border-card-border/75 rounded-2xl p-5 bg-card-bg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550 border-b border-card-border/40 pb-2">
              Audience Breakdown
            </h3>

            <div className="space-y-2.5 text-xs font-semibold">
              {[
                { label: "Founders", count: 420, pct: 53, color: "bg-brand-purple" },
                { label: "Product Managers", count: 150, pct: 20, color: "bg-[#71B7FB]" },
                { label: "Marketers", count: 100, pct: 15, color: "bg-brand-rose" },
                { label: "Recruiters", count: 60, pct: 12, color: "bg-brand-emerald" }
              ].map((aud, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-zinc-650 dark:text-zinc-400">
                    <span>{aud.label}</span>
                    <span className="text-zinc-900 dark:text-zinc-200 font-extrabold">{aud.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${aud.color} rounded-full`} style={{ width: `${aud.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Connections (Recommendations Outreach) */}
          <div className="glass-panel border border-card-border/75 rounded-2xl p-5 bg-card-bg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550 border-b border-card-border/40 pb-2">
              Recommended Outreach
            </h3>

            <div className="space-y-2">
              {[
                { tag: "+15 Recruiters", desc: "For career placement search indexes." },
                { tag: "+20 SaaS Founders", desc: "For early B2B product feedback loops." },
                { tag: "+10 Product Directors", desc: "For regional PM leadership authority." }
              ].map((rec, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] space-y-0.5">
                  <strong className="text-[10px] font-black text-brand-purple uppercase tracking-wide block">{rec.tag}</strong>
                  <span className="text-[9px] text-zinc-500 font-bold block leading-snug">{rec.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Relationship Quality */}
          <div className="glass-panel border border-card-border/75 rounded-2xl p-5 bg-card-bg space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550 border-b border-card-border/40 pb-2">
              Relationship Quality
            </h3>

            <div className="space-y-2 text-xs font-semibold">
              {[
                { label: "Strong Connections", val: "40%", color: "bg-brand-emerald" },
                { label: "Weak Connections", val: "45%", color: "bg-brand-purple" },
                { label: "Dormant / Inactive", val: "15%", color: "bg-zinc-300 dark:bg-zinc-700" }
              ].map((rel, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${rel.color}`} />
                    <span className="text-zinc-650 dark:text-zinc-400">{rel.label}</span>
                  </div>
                  <strong className="text-zinc-800 dark:text-zinc-200">{rel.val}</strong>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* COMPARISON MODAL */}
      {compareTarget && activeUser && (() => {
        // Resolve dynamic Target Metadata based on selection
        const targetMeta = (() => {
          switch (comparisonType) {
            case 'top_performer':
              return {
                name: "Top Performer (Datta Sable)",
                headline: "Founder @ Nexdial & PostIQ | B2B SaaS Growth Lead",
                avatarUrl: "/author.png",
                isVerified: true,
                scores: { profile: 99, content: 98, recruiter: 95, seo: 97 }
              };
            case 'industry_avg':
              return {
                name: "Industry Average",
                headline: "Average Benchmark of B2B SaaS Creators",
                avatarUrl: "",
                isVerified: false,
                scores: { profile: 74, content: 71, recruiter: 68, seo: 72 }
              };
            case 'network_avg':
              return {
                name: "Your Network Average",
                headline: "Average metrics of your connected peers",
                avatarUrl: "",
                isVerified: false,
                scores: { profile: averageNetworkScore || 78, content: 80, recruiter: 76, seo: 79 }
              };
            case 'connection':
            default:
              return {
                name: compareTarget.name,
                headline: compareTarget.headline,
                avatarUrl: compareTarget.avatarUrl,
                isVerified: compareTarget.isVerified,
                scores: { profile: compareTarget.profileScore, content: compareTarget.contentScore, recruiter: compareTarget.recruiterScore, seo: compareTarget.seoScore }
              };
          }
        })();

        // Calculate differences
        const diffs = [
          { name: 'Profile Strength', you: activeUser.profileScore, target: targetMeta.scores.profile, diff: activeUser.profileScore - targetMeta.scores.profile },
          { name: 'Content Creator', you: activeUser.contentScore, target: targetMeta.scores.content, diff: activeUser.contentScore - targetMeta.scores.content },
          { name: 'Recruiter Appeal', you: activeUser.recruiterScore, target: targetMeta.scores.recruiter, diff: activeUser.recruiterScore - targetMeta.scores.recruiter },
          { name: 'SEO Position', you: activeUser.seoScore, target: targetMeta.scores.seo, diff: activeUser.seoScore - targetMeta.scores.seo },
        ];

        // Find biggest trailing gap
        const sortedDiffs = [...diffs].sort((a, b) => a.diff - b.diff);
        const biggestGapItem = sortedDiffs[0]; // most negative diff

        // Dynamic AI Summary
        const wins = diffs.filter(d => d.diff > 0).map(d => d.name);
        const losses = diffs.filter(d => d.diff < 0).map(d => d.name);
        let aiSummaryText = "";
        if (wins.length > 0) {
          aiSummaryText += `You're outperforming the target in ${wins.join(" and ")}. `;
        } else {
          aiSummaryText += `You are currently matching or trailing the target across the board. `;
        }
        if (losses.length > 0) {
          aiSummaryText += `Your biggest growth opportunity is in ${biggestGapItem.name}. Improving this score can close the gap by up to ${Math.round(Math.abs(biggestGapItem.diff) * 1.5)}% of total reach capacity.`;
        } else {
          aiSummaryText += `You have secured a dominant personal brand score against this benchmark!`;
        }

        // Estimated Improvement Outcomes for Biggest Opportunity
        const gapOutcome = (() => {
          switch (biggestGapItem.name) {
            case 'Profile Strength': return '+24% search visibility';
            case 'Content Creator': return '+18% engagement lift';
            case 'Recruiter Appeal': return '+15% recruiter response';
            case 'SEO Position': return '+20% organic footprint';
            default: return '+15% visibility boost';
          }
        })();

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl glass-panel border border-card-border bg-card-bg rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-250">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-card-border p-5 shrink-0">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight size={16} className="text-brand-purple" />
                  <h3 className="font-black text-base text-zinc-900 dark:text-white">Creator Benchmark Comparison</h3>
                </div>
                <button 
                  onClick={() => { setCompareTarget(null); setComparisonType('connection'); }} 
                  className="p-1 rounded-lg border border-card-border text-zinc-455 hover:text-zinc-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow scrollbar-hide">
                
                {/* Benchmark Selector */}
                <div className="p-3 rounded-2xl border border-card-border bg-[#f8f9fa] dark:bg-[#141b22] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                  <span className="text-xs font-bold text-zinc-650 dark:text-zinc-350">
                    Benchmark against:
                  </span>
                  <select
                    value={comparisonType}
                    onChange={(e: any) => setComparisonType(e.target.value)}
                    className="bg-card-bg border border-card-border rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-white focus:outline-none focus:border-brand-purple cursor-pointer"
                  >
                    <option value="connection">Selected Connection ({compareTarget.name})</option>
                    <option value="top_performer">Top Performer (Datta Sable)</option>
                    <option value="industry_avg">Industry Average (SaaS Creators)</option>
                    <option value="network_avg">Your Network Average</option>
                  </select>
                </div>

                {/* AI Summary Box */}
                <div className="p-4 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.02] space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-brand-purple" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-zinc-905 dark:text-white">AI Summary</h4>
                  </div>
                  <p className="text-[11px] font-semibold leading-relaxed text-zinc-650 dark:text-zinc-350">
                    {aiSummaryText}
                  </p>
                </div>

                {/* Header Cards (Side by Side) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* You Card */}
                  <div className="p-4 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.02] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center text-white font-black text-base uppercase shrink-0 overflow-hidden">
                      {activeUser.avatarUrl ? (
                        <img src={activeUser.avatarUrl} alt="You" className="w-full h-full object-cover" />
                      ) : (
                        activeUser.name[0]
                      )}
                    </div>
                    <div className="truncate">
                      <span className="text-[9px] uppercase font-black text-brand-purple tracking-wider">You</span>
                      <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white truncate flex items-center gap-1">
                        {activeUser.name}
                        {activeUser.isVerified && (
                          <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3 h-3 shrink-0 shadow-sm" title="Verified Creator">
                            <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-semibold truncate leading-none mt-1 font-bold">Overall Score: {Math.round((activeUser.profileScore + activeUser.contentScore + activeUser.recruiterScore + activeUser.seoScore)/4)}%</p>
                    </div>
                  </div>

                  {/* Target Creator Card */}
                  <div className="p-4 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/[0.02] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-emerald flex items-center justify-center text-white font-black text-base uppercase shrink-0 overflow-hidden">
                      {targetMeta.avatarUrl ? (
                        <img src={targetMeta.avatarUrl} alt={targetMeta.name} className="w-full h-full object-cover" />
                      ) : (
                        targetMeta.name[0]
                      )}
                    </div>
                    <div className="truncate">
                      <span className="text-[9px] uppercase font-black text-brand-emerald tracking-wider">{comparisonType === 'connection' ? 'Connection' : 'Benchmark'}</span>
                      <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white truncate flex items-center gap-1">
                        {targetMeta.name}
                        {targetMeta.isVerified && (
                          <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3 h-3 shrink-0 shadow-sm" title="Verified Creator">
                            <svg className="w-1.5 h-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-semibold truncate leading-none mt-1 font-bold">Overall Score: {Math.round((targetMeta.scores.profile + targetMeta.scores.content + targetMeta.scores.recruiter + targetMeta.scores.seo)/4)}%</p>
                    </div>
                  </div>
                </div>

                {/* Radar Chart & Diffs Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Radar Chart Block */}
                  {chartMounted && (
                    <div className="p-4 rounded-2xl border border-card-border bg-black/5 dark:bg-black/20 flex flex-col items-center">
                      <h4 className="font-bold text-xs text-zinc-500 dark:text-zinc-400 mb-2">Personal Brand Benchmark</h4>
                      <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getComparisonData(targetMeta.scores)}>
                            <PolarGrid stroke="#e4e4e7" strokeDasharray="3 3" opacity={0.3} />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tick={{ fill: '#888888', fontSize: 9, fontWeight: '700' }} 
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              tick={{ fill: '#888888', fontSize: 8 }} 
                            />
                            <Radar 
                              name="You" 
                              dataKey="You" 
                              stroke="#8b5cf6" 
                              fill="#8b5cf6" 
                              fillOpacity={0.2} 
                            />
                            <Radar 
                              name={targetMeta.name} 
                              dataKey="Target" 
                              stroke="#059669" 
                              fill="#059669" 
                              fillOpacity={0.2} 
                            />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(29, 34, 38, 0.95)', 
                                border: '1px solid rgba(255, 255, 255, 0.1)', 
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: '600'
                              }} 
                            />
                            <Legend wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Diffs Win/Loss Checklist */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl border border-card-border/75 bg-card-bg space-y-3">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-zinc-500">Metric Breakdown & Diffs</h4>
                      <div className="space-y-2 font-bold text-[10px]">
                        {diffs.map((d, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-card-border/40">
                            <span className="text-zinc-650 dark:text-zinc-400">{d.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500">You: <strong className="text-zinc-800 dark:text-zinc-200">{d.you}</strong> | Target: <strong className="text-zinc-800 dark:text-zinc-200">{d.target}</strong></span>
                              <span className={`px-2 py-0.5 rounded font-black text-[9px] min-w-[45px] text-center ${
                                d.diff > 0 ? 'bg-brand-emerald/10 text-brand-emerald' : 
                                d.diff < 0 ? 'bg-brand-rose/10 text-brand-rose' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                              }`}>
                                {d.diff > 0 ? `↑ +${d.diff}` : d.diff < 0 ? `↓ ${d.diff}` : '0'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Biggest Opportunity Card */}
                    {biggestGapItem.diff < 0 ? (
                      <div className="p-4 rounded-2xl border border-brand-amber/35 bg-brand-amber/[0.02] space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-brand-amber/5 rounded-full blur-xl pointer-events-none"></div>
                        <span className="text-[8px] font-black uppercase bg-brand-amber/20 text-brand-amber border border-brand-amber/25 px-1.5 py-0.5 rounded">
                          Biggest Opportunity
                        </span>
                        <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white mt-1">
                          {biggestGapItem.name}
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-semibold">
                          You trail by <span className="text-brand-rose font-extrabold">{Math.abs(biggestGapItem.diff)} points</span>. Fixing this area is estimated to deliver:
                        </p>
                        <div className="text-xs font-black text-brand-emerald">
                          {gapOutcome}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl border border-brand-emerald/35 bg-brand-emerald/[0.02] space-y-1">
                        <span className="text-[8px] font-black uppercase bg-brand-emerald/20 text-brand-emerald px-1.5 py-0.5 rounded">
                          Benchmark Domination
                        </span>
                        <p className="text-[10px] text-zinc-500 font-semibold mt-1">
                          You are outperforming this target benchmark across all personal brand metrics!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Concrete Comparisons & Patterns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Detailed Metric Comparison */}
                  <div className="p-4 rounded-2xl border border-card-border/75 bg-card-bg space-y-3">
                    <h4 className="font-extrabold text-xs flex items-center gap-1.5 text-zinc-900 dark:text-white border-b border-card-border/40 pb-1.5">
                      <TrendingUp size={14} className="text-brand-purple" />
                      Detailed Metric Insights
                    </h4>
                    <div className="space-y-2 text-[10px] leading-relaxed font-semibold text-zinc-550 dark:text-zinc-400">
                      <div className="p-2.5 rounded-xl border border-card-border/50 bg-[#f8f9fa] dark:bg-[#141b22] flex justify-between items-center">
                        <span>Average Post Hook Score:</span>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-200">You: 72% | Target: 88%</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-card-border/50 bg-[#f8f9fa] dark:bg-[#141b22] flex justify-between items-center">
                        <span>Experience Quantifiers:</span>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-200">You: 1.8x metrics / post | Target: 4.8x metrics</span>
                      </div>
                      <div className="p-2.5 rounded-xl border border-card-border/50 bg-[#f8f9fa] dark:bg-[#141b22] flex justify-between items-center">
                        <span>Post Paragraph Length:</span>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-200">You: 3-4 sentences | Target: Spaced single sentences</span>
                      </div>
                    </div>
                  </div>

                  {/* Patterns Worth Adopting */}
                  <div className="p-4 rounded-2xl border border-card-border/75 bg-card-bg space-y-3">
                    <h4 className="font-extrabold text-xs flex items-center gap-1.5 text-zinc-900 dark:text-white border-b border-card-border/40 pb-1.5">
                      <Check size={14} className="text-brand-emerald" />
                      Patterns Worth Adopting
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] leading-relaxed font-semibold text-zinc-550 dark:text-zinc-400">
                      <li className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-card-border/30">
                        <span className="text-brand-emerald font-extrabold">✓</span>
                        <span>Uses 3 hashtags consistently</span>
                      </li>
                      <li className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-card-border/30">
                        <span className="text-brand-emerald font-extrabold">✓</span>
                        <span>Posts between 8 AM and 10 AM</span>
                      </li>
                      <li className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-card-border/30">
                        <span className="text-brand-emerald font-extrabold">✓</span>
                        <span>Uses question-based CTAs</span>
                      </li>
                      <li className="flex items-center gap-1.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-card-border/30">
                        <span className="text-brand-emerald font-extrabold">✓</span>
                        <span>Publishes 4 times per week</span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="border-t border-card-border p-4 bg-black/5 dark:bg-black/20 flex justify-between gap-2 shrink-0">
                <button
                  onClick={() => setShowShareReport(true)}
                  className="px-4 py-2 rounded-xl border border-brand-purple hover:bg-brand-purple/5 text-brand-purple text-[10px] font-black transition-all cursor-pointer flex items-center gap-1"
                >
                  <Sparkles size={11} />
                  Generate Shareable Report
                </button>
                <button 
                  onClick={() => { setCompareTarget(null); setComparisonType('connection'); }}
                  className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/10 cursor-pointer"
                >
                  Close Comparison
                </button>
              </div>

            </div>
          </div>
        );
      })()}


      {/* SHAREABLE REPORT MODAL */}
      {showShareReport && activeUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md glass-panel border border-brand-purple bg-card-bg rounded-3xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-250">
            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <h3 className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="text-brand-purple" size={16} />
                Personal Brand Benchmark Report
              </h3>
              <button 
                onClick={() => { setShowShareReport(false); setCopiedLink(false); }} 
                className="p-1 rounded-lg border border-card-border text-zinc-450 hover:text-zinc-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Mock Report Card to share */}
            <div id="share-card" className="p-6 rounded-2xl border border-brand-purple/20 bg-gradient-to-br from-brand-purple/[0.05] to-transparent space-y-4 text-center select-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-1">
                <strong className="text-[10px] uppercase tracking-wider text-brand-purple font-black">PostIQ Authority Ranking</strong>
                <h4 className="text-lg font-black text-zinc-900 dark:text-white">{activeUser.name}</h4>
                <p className="text-[9px] text-zinc-500 font-semibold">{activeUser.headline.split('|')[0]}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border/50 text-center">
                  <span className="text-[9px] uppercase font-black text-zinc-455 tracking-wider">Profile Strength</span>
                  <span className="text-sm font-black text-brand-emerald block mt-0.5">Top 15%</span>
                </div>
                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border/50 text-center">
                  <span className="text-[9px] uppercase font-black text-zinc-455 tracking-wider">Recruiter Appeal</span>
                  <span className="text-sm font-black text-brand-emerald block mt-0.5">Top 30%</span>
                </div>
                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border/50 text-center">
                  <span className="text-[9px] uppercase font-black text-zinc-455 tracking-wider">SEO Visibility</span>
                  <span className="text-sm font-black text-[#71B7FB] block mt-0.5">Top 10%</span>
                </div>
                <div className="p-3 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border/50 text-center">
                  <span className="text-[9px] uppercase font-black text-zinc-455 tracking-wider">Overall Brand Score</span>
                  <span className="text-sm font-black text-brand-purple block mt-0.5">{Math.round((activeUser.profileScore + activeUser.contentScore + activeUser.recruiterScore + activeUser.seoScore)/4)}%</span>
                </div>
              </div>

              <p className="text-[8px] text-zinc-500 font-semibold italic mt-2">Verified via PostIQ Personal Brand Intelligence Engine.</p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`https://postiq.ai/benchmark-report/${activeUser.id}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-[11px] font-black hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-purple/15 cursor-pointer"
              >
                {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                {copiedLink ? 'Copied Link!' : 'Copy Shareable Link'}
              </button>

              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://postiq.ai/benchmark-report/${activeUser.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-card-border hover:border-brand-purple hover:bg-brand-purple/[0.01] text-zinc-755 dark:text-white text-[11px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Share to LinkedIn Feed
              </a>
            </div>
          </div>
        </div>
      )}


      {/* CONTACT INFO GLASSMORPHISM MODAL */}
      {selectedContactUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel border border-card-border bg-card-bg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-250">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-card-border p-5">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-brand-purple" />
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">Contact Info</h3>
              </div>
              <button 
                onClick={() => setSelectedContactUser(null)}
                className="p-1 rounded-lg border border-card-border text-zinc-455 hover:text-zinc-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Profile Brief */}
            <div className="p-5 border-b border-card-border/50 bg-black/[0.015] dark:bg-white/[0.015] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm uppercase overflow-hidden shrink-0">
                {selectedContactUser.avatarUrl ? (
                  <img src={selectedContactUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  selectedContactUser.name[0]
                )}
              </div>
              <div className="truncate flex-1">
                <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white flex items-center gap-1">
                  {selectedContactUser.name}
                  {selectedContactUser.isVerified && (
                    <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                      <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-zinc-500 font-semibold truncate leading-none mt-1">{selectedContactUser.headline}</p>
              </div>
            </div>

            {/* Links Directory */}
            <div className="p-5 space-y-4 text-xs font-semibold">
              {/* Website */}
              <div className="flex items-start gap-3">
                <Globe className="text-brand-purple shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">Website</span>
                  {selectedContactUser.contactInfo?.website ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={selectedContactUser.contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-brand-purple hover:underline truncate"
                      >
                        {selectedContactUser.contactInfo.website}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedContactUser.contactInfo?.website || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450 cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-505 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-start gap-3">
                <GithubIcon className="text-brand-purple shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">GitHub Profile</span>
                  {selectedContactUser.contactInfo?.github ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={selectedContactUser.contactInfo.github} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-brand-purple hover:underline truncate"
                      >
                        {selectedContactUser.contactInfo.github}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedContactUser.contactInfo?.github || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450 cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-550 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* Twitter */}
              <div className="flex items-start gap-3">
                <TwitterIcon className="text-[#1da1f2] shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">Twitter / X</span>
                  {selectedContactUser.contactInfo?.twitter ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={selectedContactUser.contactInfo.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#1da1f2] hover:underline truncate"
                      >
                        {selectedContactUser.contactInfo.twitter}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedContactUser.contactInfo?.twitter || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-455 cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-550 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="text-brand-emerald shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">Email Address</span>
                  {selectedContactUser.contactInfo?.email ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <a 
                        href={`mailto:${selectedContactUser.contactInfo.email}`} 
                        className="text-brand-emerald hover:underline truncate"
                      >
                        {selectedContactUser.contactInfo.email}
                      </a>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedContactUser.contactInfo?.email || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450 cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-550 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="text-brand-amber shrink-0 mt-0.5" size={15} />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-550 uppercase tracking-wider block">Phone Number</span>
                  {selectedContactUser.contactInfo?.phone ? (
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-zinc-800 dark:text-zinc-355 truncate">{selectedContactUser.contactInfo.phone}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(selectedContactUser.contactInfo?.phone || '')}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-450 cursor-pointer"
                        title="Copy"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-zinc-505 italic font-medium mt-0.5 block">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/5 dark:bg-black/20 border-t border-card-border flex justify-end">
              <button 
                onClick={() => setSelectedContactUser(null)}
                className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 shadow-md shadow-brand-purple/10 cursor-pointer"
              >
                Close Info
              </button>
            </div>
          </div>
        </div>
      )}
 
     </div>
   );
}
