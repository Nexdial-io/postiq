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
  Zap
} from 'lucide-react';
import { networkDb, NetworkUser, MOCK_NETWORK_USERS } from '@/lib/db';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid 
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
  const [chartMounted, setChartMounted] = useState(false);

  useEffect(() => {
    setChartMounted(true);
    loadNetworkData();
  }, []);

  const loadNetworkData = () => {
    const user = networkDb.getActiveUser();
    setActiveUser(user);
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
  const getComparisonData = (target: NetworkUser) => {
    if (!activeUser) return [];
    return [
      { subject: 'Profile Strength', You: activeUser.profileScore, Target: target.profileScore, fullMark: 100 },
      { subject: 'Content Creator', You: activeUser.contentScore, Target: target.contentScore, fullMark: 100 },
      { subject: 'Recruiter Appeal', You: activeUser.recruiterScore, Target: target.recruiterScore, fullMark: 100 },
      { subject: 'SEO Position', You: activeUser.seoScore, Target: target.seoScore, fullMark: 100 },
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
            <span className="text-[10px] uppercase font-black text-zinc-450 tracking-wider">Connected</span>
            <span className="text-2xl font-black text-brand-purple mt-1">{connections.length}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center flex flex-col justify-center min-w-[90px] md:min-w-[110px]">
            <span className="text-[10px] uppercase font-black text-zinc-450 tracking-wider">Invites</span>
            <span className="text-2xl font-black text-brand-emerald mt-1">{pendingRequests.length}</span>
          </div>
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center flex flex-col justify-center min-w-[90px] md:min-w-[110px]">
            <span className="text-[10px] uppercase font-black text-zinc-450 tracking-wider">Avg Score</span>
            <span className="text-2xl font-black text-brand-amber mt-1">{averageNetworkScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Panel + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Filter Tabs (LinkedIn Sidebar style) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel border border-card-border/75 rounded-2xl p-4 bg-card-bg">
            <h3 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider mb-3 px-1">My Network</h3>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => { setActiveTab('connections'); setSearchQuery(''); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'connections'
                    ? 'bg-brand-purple/10 text-brand-purple'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
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
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
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
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
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
              <button className="w-full mt-2 py-2 rounded-xl bg-brand-amber text-black hover:opacity-95 text-[10px] font-black transition-all shadow-md shadow-brand-amber/10">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search bar inside tab container */}
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
                      <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white font-black text-lg uppercase shadow-inner shrink-0">
                        {creator.name[0]}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate flex items-center gap-1.5">
                          {creator.name}
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
                        onClick={() => setCompareTarget(creator)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-card-border hover:border-brand-purple hover:text-brand-purple text-[10px] font-black text-zinc-650 dark:text-zinc-350 transition-all"
                      >
                        <ArrowLeftRight size={12} />
                        Compare
                      </button>
                      
                      <button 
                        onClick={() => handleDisconnect(creator.id)}
                        className="p-2 rounded-xl border border-transparent hover:border-brand-rose/25 text-zinc-400 hover:text-brand-rose transition-all"
                        title="Disconnect"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-panel border border-card-border/75 rounded-2xl p-12 bg-card-bg text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <Users size={20} />
                  </div>
                  <h4 className="font-black text-sm">No connections found</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto font-semibold">
                    {searchQuery ? "No creators matched your search query." : "Discover and connect with other LinkedIn creators to start comparing analytics."}
                  </p>
                  {!searchQuery && (
                    <button 
                      onClick={() => setActiveTab('discover')}
                      className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/10"
                    >
                      Discover Creators
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INCOMING REQUESTS */}
          {activeTab === 'invites' && (
            <div className="space-y-3">
              {pendingRequests.length > 0 ? (
                pendingRequests.map((creator) => (
                  <div 
                    key={creator.id} 
                    className="glass-panel border border-card-border/75 rounded-2xl p-4 md:p-5 bg-card-bg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-brand-purple/20 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 flex-grow min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white font-black text-lg uppercase shadow-inner shrink-0">
                        {creator.name[0]}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate flex items-center gap-1.5">
                          {creator.name}
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
                        onClick={() => handleAcceptRequest(creator.id)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4.5 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/15"
                      >
                        <Check size={12} />
                        Accept
                      </button>
                      <button 
                        onClick={() => handleDeclineRequest(creator.id)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl border border-card-border text-zinc-650 dark:text-zinc-350 hover:bg-brand-rose/5 hover:border-brand-rose hover:text-brand-rose text-[10px] font-black transition-all"
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
                        <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center text-white font-black text-lg uppercase shadow-inner shrink-0">
                          {creator.name[0]}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate flex items-center gap-1.5">
                            {creator.name}
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">
                              {creator.profileScore}%
                            </span>
                          </h4>
                          <p className="text-[11px] text-zinc-500 font-semibold truncate leading-normal pr-4">
                            {creator.headline}
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                        {isSent ? (
                          <span className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-card-border text-[10px] font-black cursor-default">
                            <Check size={11} />
                            Requested
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleSendRequest(creator.id)}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4.5 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/15"
                          >
                            <UserPlus size={12} />
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="glass-panel border border-card-border/75 rounded-2xl p-12 bg-card-bg text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
                    <Search size={20} />
                  </div>
                  <h4 className="font-black text-sm">No creators found</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto font-semibold">
                    {searchQuery ? "No creators matched your search query." : "All registered PostIQ creators are already connected to your network!"}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* COMPARISON MODAL (RECHARTS INTEGRATION) */}
      {compareTarget && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl glass-panel border border-card-border bg-card-bg rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-250">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-card-border p-5 shrink-0">
              <div className="flex items-center gap-2">
                <ArrowLeftRight size={16} className="text-brand-purple" />
                <h3 className="font-black text-base text-zinc-900 dark:text-white">Creator Analytics Comparison</h3>
              </div>
              <button 
                onClick={() => setCompareTarget(null)} 
                className="p-1 rounded-lg border border-card-border text-zinc-450 hover:text-zinc-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* Header Cards (Side by Side) */}
              <div className="grid grid-cols-2 gap-4">
                {/* You Card */}
                <div className="p-4 rounded-2xl border border-brand-purple/20 bg-brand-purple/[0.02] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center text-white font-black text-base uppercase shrink-0">
                    {activeUser.name[0]}
                  </div>
                  <div className="truncate">
                    <span className="text-[9px] uppercase font-black text-brand-purple tracking-wider">You</span>
                    <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white truncate">{activeUser.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold truncate leading-none mt-1">Score: {activeUser.profileScore}%</p>
                  </div>
                </div>

                {/* Target Creator Card */}
                <div className="p-4 rounded-2xl border border-brand-emerald/20 bg-brand-emerald/[0.02] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-emerald flex items-center justify-center text-white font-black text-base uppercase shrink-0">
                    {compareTarget.name[0]}
                  </div>
                  <div className="truncate">
                    <span className="text-[9px] uppercase font-black text-brand-emerald tracking-wider">Connection</span>
                    <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white truncate">{compareTarget.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold truncate leading-none mt-1">Score: {compareTarget.profileScore}%</p>
                  </div>
                </div>
              </div>

              {/* Radar Chart Section */}
              {chartMounted && (
                <div className="p-4 rounded-2xl border border-card-border bg-black/5 dark:bg-black/20 flex flex-col items-center">
                  <h4 className="font-bold text-xs text-zinc-500 dark:text-zinc-400 mb-4">Competency Blueprint</h4>
                  <div className="w-full h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getComparisonData(compareTarget)}>
                        <PolarGrid stroke="#e4e4e7" strokeDasharray="3 3" opacity={0.3} />
                        <PolarAngleAxis 
                          dataKey="subject" 
                          tick={{ fill: '#888888', fontSize: 10, fontWeight: '700' }} 
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 100]} 
                          tick={{ fill: '#888888', fontSize: 8 }} 
                        />
                        <Radar 
                          name="You" 
                          dataKey="You" 
                          stroke="#0a66c2" 
                          fill="#0a66c2" 
                          fillOpacity={0.25} 
                        />
                        <Radar 
                          name={compareTarget.name} 
                          dataKey="Target" 
                          stroke="#059669" 
                          fill="#059669" 
                          fillOpacity={0.25} 
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
                        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dynamic Analytics Interpretation */}
              <div className="p-4 rounded-2xl border border-card-border/75 bg-card-bg space-y-3">
                <h4 className="font-extrabold text-xs flex items-center gap-1.5">
                  <Sparkles size={14} className="text-brand-amber" />
                  Creator Collaboration Insights
                </h4>
                <ul className="space-y-2 text-[11px] leading-relaxed font-semibold text-zinc-650 dark:text-zinc-350">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5 shrink-0"></span>
                    <span>
                      {activeUser.contentScore > compareTarget.contentScore 
                        ? `Your Content Creator Score (${activeUser.contentScore}) leads by ${activeUser.contentScore - compareTarget.contentScore} points. Marcus's PLG loops or Sarah's editorial structure could benefit from your engaging writing formats.`
                        : `Your Content Creator Score (${activeUser.contentScore}) trailing ${compareTarget.name}'s (${compareTarget.contentScore}). Try referencing their formatting layouts or hooks to drive engagement.`}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-1.5 shrink-0"></span>
                    <span>
                      {activeUser.seoScore > compareTarget.seoScore
                        ? `You have a stronger LinkedIn SEO profile (${activeUser.seoScore} vs ${compareTarget.seoScore}), which helps in recruiter keyword visibility.`
                        : `${compareTarget.name} has a highly optimized keyword footprint (${compareTarget.seoScore} vs your ${activeUser.seoScore}). Reviewing their Headline & Skills tags might uncover high-value search terms.`}
                    </span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-card-border p-4 bg-black/5 dark:bg-black/20 flex justify-end gap-2 shrink-0">
              <button 
                onClick={() => setCompareTarget(null)}
                className="px-4 py-2 rounded-xl bg-brand-purple text-white text-[10px] font-black hover:opacity-95 transition-all shadow-md shadow-brand-purple/10"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
