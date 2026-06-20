"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Mail, Lock, Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setTimeout(() => {
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
          <h2 className="font-bold text-lg text-zinc-800 dark:text-zinc-200 mt-2">Log in to your account</h2>
          <p className="text-[11px] text-zinc-500 font-medium">Welcome back! Please enter your details below.</p>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button 
            onClick={() => { setLoading(true); setTimeout(() => router.push('/dashboard'), 800); }}
            className="flex items-center justify-center gap-2 p-2 rounded-xl border border-card-border hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <svg className="w-3.5 h-3.5 fill-current text-blue-600" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            LinkedIn
          </button>
          <button 
            onClick={() => { setLoading(true); setTimeout(() => router.push('/dashboard'), 800); }}
            className="flex items-center justify-center gap-2 p-2 rounded-xl border border-card-border hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <svg className="w-3.5 h-3.5 fill-current text-rose-500" viewBox="0 0 24 24"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.414 0-6.19-2.77-6.19-6.185 0-3.414 2.776-6.184 6.19-6.184 1.523 0 2.943.565 4.048 1.498l3.195-3.194C19.145 1.83 15.932.96 12.24.96c-6.1 0-11.04 4.94-11.04 11.04 0 6.1 4.94 11.04 11.04 11.04 5.677 0 10.56-4.007 10.56-11.04 0-.74-.066-1.454-.19-2.115H12.24z"/></svg>
            Google
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-px bg-card-border flex-1"></div>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">or email</span>
          <div className="h-px bg-card-border flex-1"></div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
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
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-zinc-500 block">Password</label>
              <Link href="/forgot-password" className="text-[10px] font-bold text-brand-purple hover:underline">
                Forgot password?
              </Link>
            </div>
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
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-semibold text-zinc-500 border-t border-card-border/50 pt-4">
          <span>Don't have an account? </span>
          <Link href="/register" className="text-brand-purple hover:underline font-bold">
            Create account
          </Link>
        </div>

      </div>
    </div>
  );
}
