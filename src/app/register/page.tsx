"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Zap } from 'lucide-react';
import { mockDb } from '@/lib/mockDb';
import { networkDb } from '@/lib/db';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'creator' | 'jobseeker'>('creator');
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    setLoading(true);
    setTimeout(() => {
      // Create a new simulated active user from register name!
      const newUserId = `custom-user-${Date.now()}`;
      
      // Save profile overrides in db.ts
      networkDb.updateUser(newUserId, {
        id: newUserId,
        name: name,
        headline: role === 'creator' 
          ? "SaaS Creator | Building PostIQ | Sharing growth ideas" 
          : "Active Job Seeker | Open to Frontend & Product Roles",
        avatarUrl: "",
        bannerUrl: "gradient:bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500",
        profileScore: 70,
        contentScore: 70,
        recruiterScore: 70,
        seoScore: 70,
        about: `Hello, I'm ${name}. I registered on PostIQ to grow my LinkedIn presence!`,
        skills: role === 'creator' ? ["Content Strategy", "Personal Branding"] : ["TypeScript", "React"]
      });

      // Set active user id
      networkDb.setActiveUserId(newUserId);

      // Initialize mockDb profile for this user
      mockDb.saveProfile({
        name: name,
        headline: role === 'creator' 
          ? "SaaS Creator | Building PostIQ | Sharing growth ideas" 
          : "Active Job Seeker | Open to Frontend & Product Roles",
        about: `Hello, I'm ${name}. I registered on PostIQ to grow my LinkedIn presence!`,
        experience: [
          {
            role: role === 'creator' ? "Independent Creator" : "Software Engineer",
            company: "Independent",
            duration: "2024 - Present",
            description: "Growing personal brand and engineering skills on PostIQ."
          }
        ],
        skills: role === 'creator' ? ["Content Strategy", "Personal Branding"] : ["TypeScript", "React"],
        certifications: ["PostIQ Certified User"],
        avatarUrl: "",
        bannerUrl: "gradient:bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500",
        score: 70
      });

      // Dispatch profile update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('liq-profile-updated'));
      }

      setLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[250px] h-[250px] rounded-full bg-brand-emerald/5 blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel rounded-3xl p-6 md:p-8 border border-card-border/75 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
        
        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-indigo flex items-center justify-center text-white font-bold">
              IQ
            </div>
            <span className="font-extrabold text-lg text-gradient">PostIQ</span>
          </Link>
          <h2 className="font-bold text-lg text-zinc-800 dark:text-zinc-200 mt-2">Create your account</h2>
          <p className="text-[11px] text-zinc-500 font-medium">Join 5,000+ creators scaling their LinkedIn authority.</p>
        </div>

        {/* Account Role Selector */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-center font-bold">
          <button 
            type="button"
            onClick={() => setRole('creator')}
            className={`p-2 rounded-xl border text-[10px] uppercase transition-all ${
              role === 'creator' 
                ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' 
                : 'border-card-border hover:bg-black/5 dark:hover:bg-white/5 text-zinc-400'
            }`}
          >
            Creator
          </button>
          <button 
            type="button"
            onClick={() => setRole('jobseeker')}
            className={`p-2 rounded-xl border text-[10px] uppercase transition-all ${
              role === 'jobseeker' 
                ? 'border-brand-purple bg-brand-purple/10 text-brand-purple' 
                : 'border-card-border hover:bg-black/5 dark:hover:bg-white/5 text-zinc-400'
            }`}
          >
            Job Seeker
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-zinc-400" size={14} />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-zinc-400" size={14} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@domain.com"
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-500 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-zinc-400" size={14} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Zap size={13} />
            {loading ? 'Creating account...' : 'Start Free Trial'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-semibold text-zinc-500 border-t border-card-border/50 pt-4">
          <span>Already have an account? </span>
          <Link href="/login" className="text-brand-purple hover:underline font-bold">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
