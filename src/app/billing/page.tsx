"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Gift, 
  HelpCircle, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Tag,
  Clock
} from 'lucide-react';
import { mockDb } from '@/lib/mockDb';
import confetti from 'canvas-confetti';

function BillingContent() {
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState({ plan: 'Free', status: 'Active', expires: 'Never' });
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'Free' | 'Pro' | 'Agency' | null>(null);
  
  // Checkout coupon fields
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState("");

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    setSubscription(mockDb.getSubscription());
    
    // Check if redirecting from landing page upgrade click
    const planParam = searchParams.get('plan');
    if (planParam === 'pro') setSelectedPlan('Pro');
    if (planParam === 'agency') setSelectedPlan('Agency');
  }, [searchParams]);

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === 'LAUNCH20') {
      setCouponApplied(true);
      setCouponDiscount(20);
    } else if (code === 'GROWFREE') {
      setCouponApplied(true);
      setCouponDiscount(100);
    } else {
      setCouponError("Invalid coupon code. Try LAUNCH20");
    }
  };

  const handleCheckout = () => {
    if (!selectedPlan) return;
    setCheckoutLoading(true);

    setTimeout(() => {
      // Complete payment simulation
      const expDate = new Date();
      expDate.setMonth(expDate.getMonth() + (isAnnual ? 12 : 1));
      
      mockDb.saveSubscription(
        selectedPlan, 
        'Active', 
        expDate.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})
      );
      
      setSubscription(mockDb.getSubscription());
      setSelectedPlan(null);
      setCheckoutLoading(false);
      setCouponApplied(false);
      setCouponCode("");
      
      // Fire confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  const pricingTiers = [
    {
      name: "Free",
      price: 0,
      desc: "Perfect for testing post evaluation basics.",
      features: [
        "10 post analyses / day",
        "Profile Strength Score Audit",
        "Curiosity & Contrarian Hooks generator"
      ]
    },
    {
      name: "Pro",
      price: isAnnual ? 19 : 24,
      desc: "For content creators and personal brand building.",
      features: [
        "Unlimited post analyses",
        "Deep Resume Keyword & ATS Intelligence",
        "Best Time to Post Heatmap planner",
        "Competitor gap & opportunity notifications",
        "50+ hooks & rewriter tones generator"
      ]
    },
    {
      name: "Agency",
      price: isAnnual ? 79 : 99,
      desc: "For content networks, brands & growth consultants.",
      features: [
        "Everything in Pro tier plan",
        "Multiple client workspaces",
        "Branded exports (PDF, CSV, PPT)",
        "Dedicated account strategist review",
        "Autopilot post suggestions calendar"
      ]
    }
  ];

  // Calculations for checkout modal
  const basePrice = selectedPlan ? pricingTiers.find(p => p.name === selectedPlan)?.price || 0 : 0;
  const cycleLabel = isAnnual ? '/ year' : '/ month';
  const rawTotal = isAnnual ? basePrice * 12 : basePrice;
  const discountVal = rawTotal * (couponDiscount / 100);
  const finalTotal = rawTotal - discountVal;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-card-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Settings & Subscription</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage workspace settings, update payment subscription tiers, and audit historical invoices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (2): Subscription Plans */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Subscription pricing cycles */}
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-base">Select Subscription Plan</h3>
                <span className="text-xs text-zinc-500">Currently subscribed to the <strong className="text-brand-purple">{subscription.plan}</strong> Plan</span>
              </div>

              {/* Billing Cycle Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-black/10 dark:bg-white/5 border border-card-border gap-2 text-xs">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-1.5 rounded-lg font-bold transition-all ${!isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow' : 'text-zinc-500'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-1.5 rounded-lg font-bold transition-all ${isAnnual ? 'bg-gradient-to-r from-brand-purple to-brand-indigo text-white shadow' : 'text-zinc-500'}`}
                >
                  Annual (20% Off)
                </button>
              </div>
            </div>

            {/* Pricing list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {pricingTiers.map((tier) => {
                const isCurrent = subscription.plan === tier.name;
                const cost = isAnnual ? tier.price * 12 : tier.price;
                
                return (
                  <div 
                    key={tier.name}
                    className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                      isCurrent 
                        ? 'border-brand-purple/40 bg-brand-purple/[0.01]' 
                        : 'border-card-border hover:border-brand-purple/30 transition-all'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{tier.name}</span>
                        {isCurrent && (
                          <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald uppercase">Current</span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">{tier.desc}</p>
                      
                      <div className="flex items-baseline pt-2">
                        <span className="text-2xl font-extrabold">${cost}</span>
                        <span className="text-zinc-500 text-[10px] ml-1">{isAnnual ? '/ yr' : '/ mo'}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-[10px] text-zinc-500 font-semibold border-t border-card-border/50 pt-3">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <Check size={11} className="text-brand-emerald shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {tier.name !== 'Free' && !isCurrent && (
                      <button
                        onClick={() => setSelectedPlan(tier.name as any)}
                        className="w-full py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:opacity-90 shadow-md transition-all"
                      >
                        Subscribe {tier.name}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Invoices */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base border-b border-card-border/50 pb-3 flex items-center gap-1.5">
              <Clock size={16} className="text-brand-purple" />
              Billing & Invoice History
            </h3>
            
            <div className="space-y-3">
              {[
                { date: "June 15, 2026", desc: "FinTech Platform Pro Trial", amount: "$0.00", status: "Paid" },
                { date: "May 15, 2026", desc: "LinkedInIQ Free Setup", amount: "$0.00", status: "Paid" }
              ].map((inv, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-card-border bg-black/[0.01] dark:bg-white/[0.01] flex justify-between items-center text-xs font-semibold">
                  <div>
                    <h4 className="text-zinc-800 dark:text-zinc-200">{inv.desc}</h4>
                    <span className="text-[10px] text-zinc-500">{inv.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{inv.amount}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-brand-emerald/10 text-brand-emerald font-extrabold uppercase">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1): Status details / Referral info */}
        <div className="space-y-6">
          
          {/* Subscription state card */}
          <div className="glass-panel rounded-2xl p-6 bg-gradient-to-br from-brand-purple/[0.02] to-brand-indigo/[0.02] border-brand-purple/10 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-500">Plan Summary</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Tier:</span>
                <strong className="text-brand-purple">{subscription.plan}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status:</span>
                <strong className="text-brand-emerald">{subscription.status}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Renewal Date:</span>
                <strong className="text-zinc-700 dark:text-zinc-300">{subscription.expires}</strong>
              </div>
            </div>
          </div>

          {/* Referral promo */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <Gift size={16} className="text-brand-purple" />
              Referral Program
            </h3>
            
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Share your custom code with a colleague. When they sign up for a Pro plan, you both get **20% off** your subscription bill.
            </p>

            <div className="p-2.5 rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono font-bold text-center text-brand-purple flex justify-between items-center">
              <span>IQ-ALEX-RIVERA-2026</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("IQ-ALEX-RIVERA-2026");
                  confetti({ particleCount: 30, spread: 40 });
                }} 
                className="text-[10px] font-extrabold text-zinc-400 hover:text-brand-purple uppercase"
              >
                Copy
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Stripe-like Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel border border-card-border rounded-2xl shadow-2xl p-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-card-border pb-3">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <CreditCard size={18} className="text-brand-purple" />
                Stripe Secure Checkout
              </h3>
              <button onClick={() => { setSelectedPlan(null); setCouponApplied(false); setCouponCode(""); }} className="text-zinc-500 hover:text-zinc-800">×</button>
            </div>

            {/* Calculations details */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-zinc-500">Plan:</span>
                <span>{selectedPlan} Plan ({isAnnual ? 'Annual' : 'Monthly'})</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span className="text-zinc-500">Cycle Price:</span>
                <span>${basePrice} {cycleLabel}</span>
              </div>

              {/* Coupon form */}
              <div className="pt-2 border-t border-card-border/50">
                <label className="font-bold text-zinc-500 block mb-1.5">Apply Promo Coupon</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. LAUNCH20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/5 border border-card-border focus:outline-none"
                    disabled={couponApplied}
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode.trim()}
                    className="px-3 py-1.5 rounded-lg bg-black/10 dark:bg-white/5 border border-card-border font-bold hover:border-brand-purple/50 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <span className="text-[10px] text-brand-rose mt-1 block font-bold">{couponError}</span>}
                {couponApplied && (
                  <span className="text-[10px] text-brand-emerald mt-1 block font-bold flex items-center gap-1">
                    <Tag size={10} /> Coupon Applied: {couponDiscount}% Discount!
                  </span>
                )}
              </div>

              {/* Invoices breakdown calculation */}
              <div className="pt-4 border-t border-card-border space-y-2.5 font-bold">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal Due:</span>
                  <span>${rawTotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-brand-emerald">
                    <span>Discount:</span>
                    <span>-${discountVal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-card-border/50 pt-2.5 text-zinc-900 dark:text-white">
                  <span>Total Due Today:</span>
                  <span className="text-brand-purple">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="flex justify-end gap-3 pt-3 border-t border-card-border">
              <button
                onClick={() => { setSelectedPlan(null); setCouponApplied(false); setCouponCode(""); }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:bg-black/5 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 shadow-md"
              >
                {checkoutLoading ? 'Processing...' : 'Pay with Stripe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Billing() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading billing components...</div>}>
      <BillingContent />
    </Suspense>
  );
}
