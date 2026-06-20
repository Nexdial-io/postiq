"use client";

import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Support', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 50,
        origin: { y: 0.7 }
      });
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Header */}
      <section className="relative w-full py-16 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-brand-purple/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/5 text-brand-purple text-xs font-semibold uppercase tracking-wider">
            <MessageSquare size={12} className="text-brand-purple" />
            Support Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gradient">
            We'd Love to Hear From You
          </h1>
          <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Have questions about our plans, billing, or enterprise white-label solutions? Reach out, and our team will respond shortly.
          </p>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="w-full max-w-5xl px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        
        {/* Left Side: Contact details (2/5 Width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 border border-card-border/70">
            <h3 className="font-bold text-lg border-b border-card-border/50 pb-3">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0">
                  <Mail size={16} />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Email Address</h4>
                  <a href="mailto:support@PostIQ.ai" className="text-zinc-500 hover:text-brand-purple transition-all font-medium mt-0.5 block">support@PostIQ.ai</a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-9 h-9 rounded-lg bg-brand-emerald/10 flex items-center justify-center text-brand-emerald shrink-0">
                  <Clock size={16} />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Support Hours</h4>
                  <span className="text-zinc-500 font-medium mt-0.5 block">Monday – Friday: 9 AM – 6 PM EST</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 bg-gradient-to-tr from-brand-purple/[0.02] to-brand-indigo/[0.02] border-brand-purple/10 space-y-3">
            <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">Looking for immediate answers?</h4>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Check out our FAQs or visit the Documentation hub to read tutorials on profile scores and hook frameworks.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="/help" className="text-xs font-bold text-brand-purple flex items-center gap-0.5 hover:underline">
                Help Center
                <ExternalLink size={12} />
              </Link>
              <Link href="/docs" className="text-xs font-bold text-brand-purple flex items-center gap-0.5 hover:underline">
                Read Documentation
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Form (3/5 Width) */}
        <div className="lg:col-span-3">
          <div className="glass-panel rounded-3xl p-6 md:p-8 border border-card-border/70 relative">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-350">
                <div className="w-16 h-16 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">Message Sent Successfully!</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto font-medium">
                  Thank you for reaching out, {formData.name}. We've received your request and will get back to you at {formData.email} shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General Support', message: '' }); }}
                  className="px-6 py-2.5 rounded-xl border border-card-border bg-black/5 dark:bg-white/5 font-semibold text-xs text-zinc-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-bold text-lg border-b border-card-border/50 pb-3">Send Support Ticket</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Alex Rivera"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@domain.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 block mb-1">Subject Matter</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all"
                  >
                    <option value="General Support">General Support</option>
                    <option value="Billing & Invoices">Billing & Invoices</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Partnership / Enterprise">Partnership / Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-500 block mb-1">Detailed Message</label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your issue or request..."
                    className="w-full p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border text-xs focus:outline-none focus:border-brand-purple transition-all resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold text-xs hover:opacity-95 shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Send size={13} />
                  {loading ? 'Submitting ticket...' : 'Submit Support Request'}
                </button>
              </form>
            )}
          </div>
        </div>

      </section>
    </div>
  );
}
