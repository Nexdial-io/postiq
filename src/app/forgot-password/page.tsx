"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.6 }
      });
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel rounded-3xl p-6 md:p-8 border border-card-border/75 shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
        
        {/* Back link */}
        <Link 
          href="/login" 
          className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-500 hover:text-brand-purple transition-all mb-4"
        >
          <ArrowLeft size={12} />
          Back to Sign In
        </Link>

        {submitted ? (
          <div className="text-center space-y-4 py-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Check Your Inbox</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium">
              We've dispatched recovery steps to <strong>{email}</strong>. Please follow the instructions in the email to reset your credentials.
            </p>
            <button
              onClick={() => { setSubmitted(false); setEmail(''); }}
              className="px-6 py-2.5 rounded-xl border border-card-border bg-black/5 dark:bg-white/5 font-semibold text-xs text-zinc-700 dark:text-zinc-300"
            >
              Re-enter Email
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1">
              <h2 className="font-extrabold text-lg text-zinc-800 dark:text-zinc-200">Reset password</h2>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                Provide your account email address and we'll dispatch password recovery steps.
              </p>
            </div>

            <form onSubmit={handleResetSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Send size={13} />
                {loading ? 'Sending link...' : 'Send Recovery Instructions'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
