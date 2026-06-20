"use client";

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Key, 
  Save, 
  Eye, 
  EyeOff, 
  Check, 
  Copy,
  Sparkles
} from 'lucide-react';
import { mockDb } from '@/lib/mockDb';
import confetti from 'canvas-confetti';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'api-keys'>('profile');
  const [name, setName] = useState('Alex Rivera');
  const [headline, setHeadline] = useState('B2B SaaS Growth Lead | Building Scalable User Acquisition Frameworks');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prof = mockDb.getProfile();
    if (prof) {
      setName(prof.name);
      if (prof.headline) setHeadline(prof.headline);
    }
  }, []);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentProfile = mockDb.getProfile();
    const updated = {
      ...currentProfile,
      name,
      headline
    };
    mockDb.saveProfile(updated);
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText("liq_live_7c3aed4f46e510b981f43f5e0b");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Title */}
      <div className="border-b border-card-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Account & Developer Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Customize your creator details, adjust notification preferences, and retrieve developer access tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Navigation Tabs (1/4 Width) */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-4 space-y-1.5 font-semibold text-xs border border-card-border/75">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                activeTab === 'profile' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <User size={14} className={activeTab === 'profile' ? 'text-brand-purple' : 'text-zinc-400'} />
              Creator Profile
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Bell size={14} className={activeTab === 'notifications' ? 'text-brand-purple' : 'text-zinc-400'} />
              Notifications
            </button>

            <button
              onClick={() => setActiveTab('api-keys')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left transition-all ${
                activeTab === 'api-keys' 
                  ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <Key size={14} className={activeTab === 'api-keys' ? 'text-brand-purple' : 'text-zinc-400'} />
              Developer API Keys
            </button>
          </div>
        </div>

        {/* Right Side: Tab Panel (3/4 Width) */}
        <div className="lg:col-span-3">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 min-h-[380px]">
            
            {/* Creator Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-6 animate-in fade-in duration-300">
                <h3 className="font-bold text-base flex items-center gap-1.5 border-b border-card-border/50 pb-3">
                  <User size={16} className="text-brand-purple" />
                  Creator Profile Details
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="text-zinc-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1">LinkedIn Headline</label>
                    <textarea
                      rows={3}
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
                    />
                    <p className="text-[10px] text-zinc-500 italic mt-1 font-medium">
                      Tip: Including relevant SaaS and marketing keywords will boost your simulated SEO scores.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center gap-1.5 transition-all"
                  >
                    <Save size={13} />
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="font-bold text-base flex items-center gap-1.5 border-b border-card-border/50 pb-3">
                  <Bell size={16} className="text-brand-purple" />
                  Notification Preferences
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  {[
                    { title: "Weekly Scorer Audit", desc: "Receive email reports summarizing last week's post scores and keyword changes." },
                    { title: "Competitor Alert Alerts", desc: "Get notified immediately when tracked competitor profiles post trending updates." },
                    { title: "Recruiter Search Visibility Warnings", desc: "Receive alerts when target keyword search volumes drop." }
                  ].map((pref, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                      <div className="max-w-[80%]">
                        <h4 className="text-zinc-800 dark:text-zinc-200">{pref.title}</h4>
                        <p className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-relaxed">{pref.desc}</p>
                      </div>
                      
                      {/* Interactive switch wrapper */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none dark:bg-zinc-850 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-brand-purple"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === 'api-keys' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="font-bold text-base flex items-center gap-1.5 border-b border-card-border/50 pb-3">
                  <Key size={16} className="text-brand-purple" />
                  Developer API Access
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Use this token to authenticate programmatic post analysis requests. Keep this key confidential and do not share it in client scripts.
                </p>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl border border-card-border bg-[#09081a] flex justify-between items-center text-xs font-mono">
                    <div className="truncate flex-1 pr-4">
                      {showKey ? (
                        <span className="text-brand-emerald select-all font-bold">liq_live_7c3aed4f46e510b981f43f5e0b</span>
                      ) : (
                        <span className="text-zinc-500">••••••••••••••••••••••••••••••••••••••••</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-zinc-200"
                        title={showKey ? 'Hide key' : 'Show key'}
                      >
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>

                      <button
                        onClick={handleCopyKey}
                        className={`p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-zinc-200 ${copied ? 'text-brand-emerald' : ''}`}
                        title="Copy key"
                      >
                        {copied ? <Check size={14} className="text-brand-emerald" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
