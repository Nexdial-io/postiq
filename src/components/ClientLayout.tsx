"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  UserCheck, 
  PenTool, 
  Hash, 
  Calendar, 
  Users, 
  BarChart3, 
  CreditCard,
  Sun, 
  Moon, 
  Menu, 
  X, 
  Bell, 
  Search,
  Zap,
  TrendingUp,
  Bookmark,
  Settings,
  Globe,
  ExternalLink,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Shield,
  FileText
} from 'lucide-react';
import { mockDb } from '@/lib/mockDb';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem("liq_profile");
        return item ? JSON.parse(item) : { name: "Alex Rivera", headline: "Senior Product Manager" };
      } catch (e) {
        return { name: "Alex Rivera", headline: "Senior Product Manager" };
      }
    }
    return { name: "Alex Rivera", headline: "Senior Product Manager" };
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [publicMenuOpen, setPublicMenuOpen] = useState(false);
  const [showMeDropdown, setShowMeDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Remove preload class to allow transitions after page load
    document.documentElement.classList.remove('preload');
    
    // Load theme from storage
    const savedTheme = localStorage.getItem('liq_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const darkActive = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDark(darkActive);
    
    if (darkActive) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Load profile
    setProfile(mockDb.getProfile());
    
    // Keyboard shortcut for command search (Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('liq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('liq_theme', 'light');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Post Analyzer', path: '/analyzer', icon: Sparkles },
    { name: 'Profile Intelligence', path: '/profile-intelligence', icon: UserCheck },
    { name: 'Hook & Rewrite Studio', path: '/hooks', icon: PenTool },
    { name: 'Hashtag Intelligence', path: '/hashtags', icon: Hash },
    { name: 'Content Calendar', path: '/calendar', icon: Calendar },
    { name: 'Competitor Intel', path: '/competitors', icon: Users },
    { name: 'Trends Discovery', path: '/trends', icon: TrendingUp },
    { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { name: 'Billing & Plans', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const topNavItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyzer', path: '/analyzer', icon: Sparkles },
    { name: 'Profile Intel', path: '/profile-intelligence', icon: UserCheck },
    { name: 'Hook Studio', path: '/hooks', icon: PenTool },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Trends', path: '/trends', icon: TrendingUp },
  ];

  // If path doesn't start with dashboard/analyzer/etc. we show public header
  const authPaths = [
    '/dashboard',
    '/analyzer',
    '/profile-intelligence',
    '/hooks',
    '/hashtags',
    '/calendar',
    '/competitors',
    '/analytics',
    '/billing',
    '/settings',
    '/trends'
  ];
  const isPublicPage = !authPaths.some(p => pathname === p || pathname?.startsWith(p + '/'));

  const notifications = [
    { id: 1, text: "AI Post Scorer: Your last hook was evaluated at 92/100!", time: "2 hours ago" },
    { id: 2, text: "Competitor Alert: Sarah Chen posted a new high-performing post", time: "1 day ago" },
    { id: 3, text: "Profile SEO: Recruiter visibility score increased by 8 points", time: "3 days ago" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    setShowSearchModal(false);
    
    // Navigate based on query keywords
    const q = searchQuery.toLowerCase();
    if (q.includes('hook') || q.includes('write')) router.push('/hooks');
    else if (q.includes('profile') || q.includes('resume') || q.includes('job')) router.push('/profile-intelligence');
    else if (q.includes('hash')) router.push('/hashtags');
    else if (q.includes('calendar') || q.includes('time')) router.push('/calendar');
    else if (q.includes('comp') || q.includes('competitor')) router.push('/competitors');
    else if (q.includes('bill') || q.includes('price')) router.push('/billing');
    else if (q.includes('analytics') || q.includes('chart') || q.includes('report')) router.push('/analytics');
    else router.push('/analyzer');
    
    setSearchQuery('');
  };

  if (isPublicPage) {
    const publicLinks = [
      { name: 'Features', path: '/features' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Docs', path: '/docs' },
    ];

    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Public Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-card-border bg-nav-bg w-full backdrop-blur-md">
          <div className="max-w-[1128px] mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <img 
                src="/postiq-icon.png?v=2" 
                alt="PostIQ Logo" 
                className="w-9 h-9 rounded-xl shadow-md shadow-brand-purple/10 group-hover:scale-105 transition-transform duration-250"
              />
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-purple to-brand-emerald bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                PostIQ
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-8 text-sm font-semibold">
              {publicLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link 
                    key={link.name} 
                    href={link.path} 
                    className={`transition-colors py-1 relative ${
                      isActive 
                        ? 'text-brand-purple' 
                        : 'text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in zoom-in-50 duration-300"></span>
                    )}
                  </Link>
                );
              })}
              <Link href="/dashboard" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors py-1">
                Dashboard Demo
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Toggle Theme"
              >
                {mounted ? (
                  isDark ? <Sun size={18} className="text-yellow-400 animate-pulse" /> : <Moon size={18} className="text-zinc-600" />
                ) : (
                  <div className="w-[18px] h-[18px]" />
                )}
              </button>
              
              <Link 
                href="/login"
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all text-zinc-700 dark:text-zinc-300"
              >
                Log In
              </Link>

              <Link 
                href="/register"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-brand-purple to-brand-indigo text-white hover:opacity-95 hover:shadow-brand-purple/35 transition-all shadow-md shadow-brand-purple/20 flex items-center gap-1"
              >
                <Zap size={12} className="fill-white" />
                Sign Up
              </Link>

              {/* Mobile Public Hamburger */}
              <button
                onClick={() => setPublicMenuOpen(!publicMenuOpen)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors md:hidden text-zinc-550"
                title="Toggle Menu"
              >
                {publicMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Public Menu Dropdown */}
          {publicMenuOpen && (
            <div className="md:hidden glass-panel border-b border-card-border bg-nav-bg w-full animate-in slide-in-from-top duration-250 absolute top-16 left-0 right-0 p-4 space-y-3 flex flex-col font-semibold shadow-xl">
              {publicLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setPublicMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    pathname === link.path 
                      ? 'bg-brand-purple/10 text-brand-purple' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setPublicMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300"
              >
                Dashboard Demo
              </Link>
              <div className="h-px bg-card-border my-2"></div>
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setPublicMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-lg border border-card-border hover:bg-black/5 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setPublicMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold rounded-lg bg-gradient-to-r from-brand-purple to-brand-indigo text-white"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </header>
        
        <main className="flex-grow">{children}</main>
        
        {/* Premium Public Footer */}
        <footer className="border-t border-card-border bg-black/5 dark:bg-[#07051f]/50 py-16 px-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] rounded-full bg-brand-purple/5 blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 relative z-10">
            {/* Column 1: Brand details */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <img 
                  src="/postiq-icon.png?v=2" 
                  alt="PostIQ Logo" 
                  className="w-8 h-8 rounded-lg shadow-sm"
                />
                <span className="font-extrabold text-lg text-gradient">
                  PostIQ
                </span>
              </Link>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm leading-relaxed font-medium">
                The ultimate creator intelligence engine. Optimize your LinkedIn headlines, analyze engagement scores, audit ATS compatibility, and scale your personal brand with generative AI.
              </p>
              <div className="flex items-center gap-3 text-zinc-400">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-purple transition-all" title="LinkedIn">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-purple transition-all" title="GitHub">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-purple transition-all" title="Twitter">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>

            {/* Column 2: Platform Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">Platform</h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link href="/features" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Key Features</Link></li>
                <li><Link href="/pricing" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Pricing Plans</Link></li>
                <li><Link href="/trends" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Trends Engine</Link></li>
                <li><Link href="/hooks" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Hook Generator</Link></li>
              </ul>
            </div>

            {/* Column 3: Resources Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">Resources</h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link href="/blog" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Industry Blog</Link></li>
                <li><Link href="/docs" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/help" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/changelog" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Changelog Hub</Link></li>
              </ul>
            </div>

            {/* Column 4: Support & Legal Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-550">Company & Legal</h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li><Link href="/about" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link href="/privacy" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-zinc-550 hover:text-brand-purple dark:text-zinc-400 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-card-border flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 text-xs font-semibold">
            <span className="text-zinc-550">© 2026 PostIQ. All rights reserved.</span>
            <div className="flex items-center gap-1">
              <span className="text-zinc-555">Designed &</span>
              <a 
                href="https://dattasable.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-brand-purple hover:underline bg-brand-purple/5 px-2.5 py-1 rounded-full border border-brand-purple/10 hover:border-brand-purple/35 transition-all shadow-inner hover:scale-[1.03]"
              >
                built by Datta Sable
                <ExternalLink size={10} className="stroke-[2.5px]" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      
      {/* Sticky Top LinkedIn-Style Navigation Bar — full device width, content pinned to 1128px */}
      <header className="sticky top-0 z-40 border-b border-card-border bg-nav-bg w-full h-14 shrink-0 backdrop-blur-md">
        <div className="max-w-[1128px] mx-auto h-full px-4 flex items-center justify-between">

          {/* Left Side: Logo & Search Box */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link href="/dashboard" className="flex items-center space-x-2 shrink-0 group">
              <img 
                src="/postiq-icon.png?v=2" 
                alt="PostIQ Logo" 
                className="w-8 h-8 rounded shadow-md group-hover:scale-105 transition-transform duration-200"
              />
              <span className="hidden lg:inline-block font-extrabold text-sm tracking-tight text-gradient">
                PostIQ
              </span>
            </Link>

            {/* Integrated Search Box */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[#eef3f8] dark:bg-[#383f47] border border-transparent hover:bg-[#e6ecf2] dark:hover:bg-[#434c56] text-zinc-550 dark:text-zinc-400 text-xs w-[200px] transition-all text-left"
            >
              <Search size={13} className="text-zinc-500 dark:text-zinc-400 shrink-0" />
              <span className="flex-grow text-zinc-500 dark:text-zinc-400 truncate">Search tools...</span>
              <kbd className="hidden md:inline-flex h-4 items-center gap-0.5 rounded border border-card-border bg-black/5 dark:bg-white/10 px-1 font-mono text-[9px] text-zinc-505 shrink-0">
                ctrl k
              </kbd>
            </button>
          </div>

          {/* Center: Stacked Nav Links */}
          <nav className="flex items-center h-full">
            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex flex-col items-center justify-center px-4 md:px-5 h-full relative group transition-colors ${
                    isActive 
                      ? 'text-brand-purple' 
                      : 'text-zinc-555 dark:text-zinc-400 hover:text-brand-purple dark:hover:text-white'
                  }`}
                >
                  <Icon size={18} className="stroke-[2.2px] mb-0.5" />
                  <span className="hidden sm:inline-block text-[9px] font-bold tracking-tight">{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-brand-purple rounded-t"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side: Notifications & Profile Dropdown */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => { setShowNotifications(prev => !prev); setShowMeDropdown(false); }}
                className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative text-zinc-550 dark:text-zinc-400 hover:text-brand-purple dark:hover:text-white"
                title="Notifications"
              >
                <Bell size={18} className="stroke-[2.2px]" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-emerald rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-72 glass-panel rounded-xl shadow-xl z-50 p-4 border border-card-border animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-extrabold text-xs">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-zinc-550 hover:text-zinc-700">
                      <X size={12} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="border-b border-card-border/50 pb-2 last:border-b-0 last:pb-0 text-[10px] font-semibold leading-relaxed">
                        <p className="text-zinc-700 dark:text-zinc-300">"{n.text}"</p>
                        <span className="text-[9px] text-zinc-555 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown ("Me") */}
            {profile && (
              <div className="relative">
                <button
                  onClick={() => { setShowMeDropdown(prev => !prev); setShowNotifications(false); }}
                  className="flex flex-col items-center justify-center px-1 py-1 hover:opacity-90 transition-opacity"
                  title="Profile Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-xs uppercase shadow-inner">
                    {profile.name[0]}
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-0.5 text-[8px] font-bold text-zinc-500 mt-0.5 uppercase tracking-wide">
                    Me
                    <ChevronRight size={8} className="rotate-90 stroke-[2.5px]" />
                  </span>
                </button>

                {showMeDropdown && (
                  <div className="absolute right-0 mt-2.5 w-60 glass-panel rounded-2xl shadow-xl z-50 border border-card-border p-4 animate-in fade-in duration-200 text-xs font-semibold">
                    
                    {/* User profile header */}
                    <div className="flex items-center space-x-3 border-b border-card-border/50 pb-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-black text-sm uppercase">
                        {profile.name[0]}
                      </div>
                      <div className="truncate flex-1">
                        <h4 className="font-extrabold text-zinc-900 dark:text-white truncate">{profile.name}</h4>
                        <p className="text-[10px] text-zinc-505 truncate mt-0.5 leading-normal">{profile.headline || 'Creator Account'}</p>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1.5">
                      <Link 
                        href="/settings" 
                        onClick={() => setShowMeDropdown(false)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-zinc-555 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
                      >
                        <Settings size={13} className="text-zinc-400" />
                        Settings & Privacy
                      </Link>

                      <Link 
                        href="/billing" 
                        onClick={() => setShowMeDropdown(false)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-zinc-555 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
                      >
                        <CreditCard size={13} className="text-zinc-400" />
                        Billing & Plans
                      </Link>

                      <Link 
                        href="/analytics" 
                        onClick={() => setShowMeDropdown(false)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-zinc-555 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
                      >
                        <BarChart3 size={13} className="text-zinc-400" />
                        Analytics & Reports
                      </Link>

                      <Link 
                        href="/competitors" 
                        onClick={() => setShowMeDropdown(false)}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-zinc-555 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all text-left"
                      >
                        <Users size={13} className="text-zinc-400" />
                        Competitor Intel
                      </Link>
                    </div>

                    {/* Theme Switcher in Me Dropdown */}
                    <div className="h-px bg-card-border/50 my-2.5"></div>
                    <div className="flex justify-between items-center px-2 py-1 text-zinc-500">
                      <span>Dark Theme</span>
                      <button 
                        onClick={toggleTheme}
                        className="p-1 rounded-md bg-black/5 dark:bg-white/5 border border-card-border text-zinc-400 hover:text-zinc-200"
                      >
                        {mounted ? (
                          isDark ? <Sun size={12} className="text-yellow-400 animate-pulse" /> : <Moon size={12} />
                        ) : (
                          <div className="w-[12px] h-[12px]" />
                        )}
                      </button>
                    </div>

                    <div className="h-px bg-card-border/50 my-2.5"></div>
                    <Link 
                      href="/" 
                      onClick={() => setShowMeDropdown(false)}
                      className="w-full block text-center p-2 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 font-bold"
                    >
                      Sign Out
                    </Link>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </header>

      {/* Main Workspace Frame — pinned to same 1128px content width as header */}
      <main className="flex-grow pt-6 pb-12">
        <div className="max-w-[1128px] mx-auto px-4 space-y-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>

      {/* Command Palette Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel border border-card-border rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
              <span className="text-xs font-semibold text-zinc-505">PostIQ Command Hub</span>
              <button onClick={() => setShowSearchModal(false)} className="text-zinc-400 hover:text-zinc-600">
                <kbd className="text-[10px] border border-card-border px-1.5 py-0.5 rounded">ESC</kbd>
              </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-zinc-400" size={18} />
                <input
                  type="text"
                  placeholder="Search tool (e.g., 'hooks', 'profile', 'calendar')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#eef3f8] dark:bg-[#383f47] border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-purple transition-all text-zinc-955 dark:text-white"
                  autoFocus
                />
              </div>
            </form>
            <div className="mt-4">
              <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Popular Commands</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button onClick={() => { setSearchQuery('analyzer'); router.push('/analyzer'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-350">
                  <Sparkles size={14} className="text-brand-purple" />
                  Analyze Post
                </button>
                <button onClick={() => { setSearchQuery('profile'); router.push('/profile-intelligence'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-350">
                  <UserCheck size={14} className="text-brand-emerald" />
                  Analyze Profile
                </button>
                <button onClick={() => { setSearchQuery('hooks'); router.push('/hooks'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-350">
                  <PenTool size={14} className="text-brand-indigo" />
                  Hook Generator
                </button>
                <button onClick={() => { setSearchQuery('calendar'); router.push('/calendar'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-350">
                  <Calendar size={14} className="text-brand-amber" />
                  Calendar Suggestions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
