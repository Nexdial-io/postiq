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
  Sparkles,
  Camera,
  Image as ImageIcon,
  Trash2,
  Upload
} from 'lucide-react';
import { mockDb } from '@/lib/mockDb';
import confetti from 'canvas-confetti';

const BANNER_PRESETS = [
  { name: 'Aurora', value: 'gradient:bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500', colors: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500' },
  { name: 'Sunset', value: 'gradient:bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700', colors: 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700' },
  { name: 'Oceanic', value: 'gradient:bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-900', colors: 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-900' },
  { name: 'Silk', value: 'gradient:bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-650', colors: 'bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-650' },
  { name: 'Cosmic', value: 'gradient:bg-gradient-to-r from-purple-800 via-indigo-900 to-black', colors: 'bg-gradient-to-r from-purple-800 via-indigo-900 to-black' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'api-keys'>('profile');
  const [name, setName] = useState('Alex Rivera');
  const [headline, setHeadline] = useState('B2B SaaS Growth Lead | Building Scalable User Acquisition Frameworks');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [website, setWebsite] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const prof = mockDb.getProfile();
    if (prof) {
      setName(prof.name);
      if (prof.headline) setHeadline(prof.headline);
      setAvatarUrl(prof.avatarUrl || '');
      setBannerUrl(prof.bannerUrl || '');
      setIsVerified(prof.isVerified || false);
      if (prof.contactInfo) {
        setWebsite(prof.contactInfo.website || '');
        setGithub(prof.contactInfo.github || '');
        setTwitter(prof.contactInfo.twitter || '');
        setEmail(prof.contactInfo.email || '');
        setPhone(prof.contactInfo.phone || '');
      }
    }
  }, []);

  const compressImage = (base64Str: string, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const compressed = await compressImage(base64, 200, 200);
      setAvatarUrl(compressed);
    };
    reader.readAsDataURL(file);
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const compressed = await compressImage(base64, 800, 300);
      setBannerUrl(compressed);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentProfile = mockDb.getProfile();
    const updated = {
      ...currentProfile,
      name,
      headline,
      avatarUrl,
      bannerUrl,
      isVerified,
      contactInfo: {
        website,
        github,
        twitter,
        email,
        phone
      }
    };
    mockDb.saveProfile(updated);
    confetti({ particleCount: 30, spread: 40 });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText("liq_live_7c3aed4f46e510b981f43f5e0b");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBannerBgClass = (url: string) => {
    if (!url) {
      return 'bg-gradient-to-r from-[#71B7FB]/30 via-brand-purple/20 to-brand-indigo/30';
    }
    if (url.startsWith('gradient:')) {
      return url.replace('gradient:', '');
    }
    return '';
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

                {/* PREMIUM LIVE PREVIEW CARD */}
                <div className="space-y-2">
                  <label className="text-zinc-500 block text-xs font-semibold">Live Profile Card Preview</label>
                  <div className="border border-card-border/70 rounded-2xl overflow-hidden bg-card-bg shadow-lg max-w-lg mx-auto w-full transition-all">
                    {/* Banner backdrop */}
                    <div 
                      className={`h-24 w-full relative transition-all ${getBannerBgClass(bannerUrl)}`}
                      style={(!bannerUrl.startsWith('gradient:') && bannerUrl) ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      <span className="absolute top-2 right-2 text-[9px] bg-black/40 text-white/95 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">Live Preview</span>
                    </div>
                    
                    {/* Avatar overlap & Profile Header */}
                    <div className="flex justify-start px-5 -mt-8 relative z-10 items-end gap-3.5 pb-4">
                      <div className="w-16 h-16 rounded-full border-4 border-card-bg bg-brand-purple flex items-center justify-center text-white text-2xl font-black shadow-md uppercase overflow-hidden shrink-0">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                          name ? name[0] : 'A'
                        )}
                      </div>
                      <div className="pb-1 max-w-[calc(100%-80px)] truncate">
                        <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white truncate flex items-center gap-1">
                          {name || 'Your Name'}
                          {isVerified && (
                            <span className="inline-flex items-center justify-center bg-blue-600 dark:bg-blue-500 text-white rounded-full w-3.5 h-3.5 shrink-0 shadow-sm" title="Verified Creator">
                              <svg className="w-2 h-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] text-zinc-550 dark:text-zinc-400 font-semibold truncate leading-none mt-1">{headline || 'Your Professional Headline'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AVATAR & BANNER DESIGN CONTROL PANELS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Avatar Upload Panel */}
                  <div className="p-4 rounded-2xl border border-card-border/60 bg-black/[0.02] dark:bg-white/[0.01] space-y-3">
                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Camera size={14} className="text-brand-purple" />
                      Profile Avatar Photo
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-semibold leading-normal">
                      Upload a square headshot image (formats: PNG, JPG, WEBP).
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 hover:from-brand-purple/15 hover:to-brand-indigo/15 border border-brand-purple/20 text-brand-purple font-bold text-[10px] cursor-pointer transition-all flex items-center gap-1">
                        <Upload size={12} />
                        Choose Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarChange} 
                          className="hidden" 
                        />
                      </label>
                      
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => setAvatarUrl('')}
                          className="px-3.5 py-2 rounded-xl border border-brand-rose/25 text-brand-rose hover:bg-brand-rose/5 font-bold text-[10px] transition-all flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Banner Preset & Upload Panel */}
                  <div className="p-4 rounded-2xl border border-card-border/60 bg-black/[0.02] dark:bg-white/[0.01] space-y-3">
                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-brand-indigo" />
                      Custom Header Banner
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-semibold leading-normal">
                      Select a premium gradient preset or upload a custom image.
                    </p>

                    {/* Presets Grid */}
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {BANNER_PRESETS.map((preset) => {
                        const isSelected = bannerUrl === preset.value;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setBannerUrl(preset.value)}
                            className={`w-7 h-7 rounded-lg ${preset.colors} transition-all relative ${
                              isSelected ? 'ring-2 ring-brand-purple ring-offset-2 dark:ring-offset-zinc-900 scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'
                            }`}
                            title={preset.name}
                          >
                            {isSelected && (
                              <span className="absolute inset-0 flex items-center justify-center text-white bg-black/20 rounded-lg">
                                <Check size={11} className="stroke-[3px]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-indigo/10 to-blue-500/10 hover:from-brand-indigo/15 hover:to-blue-500/15 border border-brand-indigo/20 text-brand-indigo font-bold text-[10px] cursor-pointer transition-all flex items-center gap-1">
                        <Upload size={12} />
                        Upload Banner
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleBannerChange} 
                          className="hidden" 
                        />
                      </label>

                      {bannerUrl && (
                        <button
                          type="button"
                          onClick={() => setBannerUrl('')}
                          className="px-3.5 py-2 rounded-xl border border-brand-rose/25 text-brand-rose hover:bg-brand-rose/5 font-bold text-[10px] transition-all flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Reset Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01]">
                    <div className="max-w-[80%] pr-2">
                      <h4 className="text-zinc-800 dark:text-zinc-200">Verified Creator Badge</h4>
                      <p className="text-[10px] text-zinc-500 font-medium mt-0.5 leading-relaxed">
                        Show a premium blue checkmark tick badge next to your profile name across all pages.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isVerified}
                        onChange={(e) => setIsVerified(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none dark:bg-zinc-850 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-brand-purple"></div>
                    </label>
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1">LinkedIn Headline</label>
                    <textarea
                      rows={3}
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
                    />
                    <p className="text-[10px] text-zinc-500 italic mt-1 font-medium">
                      Tip: Including relevant SaaS and marketing keywords will boost your simulated SEO scores.
                    </p>
                  </div>

                  {/* LinkedIn Contact Options Section */}
                  <div className="border-t border-card-border/50 pt-5 mt-4 space-y-4">
                    <h4 className="text-zinc-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider">
                      Contact Options (LinkedIn style)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-zinc-500 block mb-1">Personal Website URL</label>
                        <input
                          type="url"
                          placeholder="https://dattasable.com"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 block mb-1">GitHub Profile Link</label>
                        <input
                          type="url"
                          placeholder="https://github.com/dattasable"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 block mb-1">Twitter / X URL</label>
                        <input
                          type="url"
                          placeholder="https://x.com/dattasable"
                          value={twitter}
                          onChange={(e) => setTwitter(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-zinc-500 block mb-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="datta@nexdial.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-zinc-500 block mb-1">Phone Number</label>
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#f8f9fa] dark:bg-[#141b22] border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                        />
                      </div>
                    </div>
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
