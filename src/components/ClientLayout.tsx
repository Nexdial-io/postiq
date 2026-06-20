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
  Bookmark
} from 'lucide-react';
import { mockDb } from '@/lib/mockDb';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
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
    { name: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { name: 'Billing & Plans', path: '/billing', icon: CreditCard },
  ];

  // If path is landing page (/) or doesn't start with dashboard/analyzer/etc. we show public header
  const isPublicPage = pathname === '/';

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
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        {/* Public Header */}
        <header className="sticky top-0 z-50 glass-panel border-b border-card-border bg-nav-bg w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-indigo flex items-center justify-center text-white font-bold shadow-md shadow-brand-purple/20">
                IQ
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-purple to-brand-emerald bg-clip-text text-transparent">
                LinkedInIQ AI
              </span>
            </Link>
            
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              <Link href="#features" className="hover:text-brand-purple transition-colors text-muted-foreground">Features</Link>
              <Link href="#pricing" className="hover:text-brand-purple transition-colors text-muted-foreground">Pricing</Link>
              <Link href="/dashboard" className="hover:text-brand-purple transition-colors text-muted-foreground">Dashboard Demo</Link>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-zinc-600" />}
              </button>
              
              <Link 
                href="/dashboard"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-brand-purple to-brand-indigo text-white hover:opacity-95 transition-all shadow-md shadow-brand-purple/20 flex items-center gap-1"
              >
                <Zap size={14} />
                Get Started Free
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        
        {/* Public Footer */}
        <footer className="border-t border-card-border bg-black/5 dark:bg-white/5 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gradient">LinkedInIQ AI</span>
              <span className="text-xs text-zinc-500">© 2026. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <Link href="#" className="hover:text-brand-purple">Privacy Policy</Link>
              <Link href="#" className="hover:text-brand-purple">Terms of Service</Link>
              <Link href="#" className="hover:text-brand-purple">Contact Support</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-card-border bg-sidebar-bg shrink-0">
        <div className="p-6 border-b border-card-border flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-indigo flex items-center justify-center text-white font-bold">
              IQ
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-purple to-brand-emerald bg-clip-text text-transparent">
              LinkedInIQ AI
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple border-l-2 border-brand-purple' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={`mr-3 transition-colors ${isActive ? 'text-brand-purple' : 'text-zinc-400 group-hover:text-brand-purple'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* User Card at bottom */}
        {profile && (
          <div className="p-4 border-t border-card-border bg-black/[0.02] dark:bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold text-sm shadow-inner uppercase">
                {profile.name[0]}
              </div>
              <div className="truncate max-w-[130px]">
                <h4 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">{profile.name}</h4>
                <span className="text-[10px] text-zinc-500 truncate block">Free Account</span>
              </div>
            </div>
            <Link href="/billing" className="p-1 rounded-md text-brand-purple hover:bg-brand-purple/10 transition-colors" title="Upgrade Plan">
              <Zap size={14} className="fill-brand-purple" />
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Drawer (Overlay Sidebar) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="relative flex flex-col w-72 max-w-xs bg-sidebar-bg h-full p-6 animate-in slide-in-from-left duration-300">
            <button 
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/5 dark:hover:bg-white/5"
            >
              <X size={18} />
            </button>
            
            <div className="flex items-center space-x-2 mb-8 mt-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-indigo flex items-center justify-center text-white font-bold">
                IQ
              </div>
              <span className="font-extrabold text-lg text-gradient">
                LinkedInIQ AI
              </span>
            </div>

            <nav className="flex-grow space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-gradient-to-r from-brand-purple/10 to-brand-indigo/10 text-brand-purple' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            
            {profile && (
              <div className="border-t border-card-border pt-4 flex items-center space-x-3 mt-auto">
                <div className="w-9 h-9 rounded-full bg-brand-purple flex items-center justify-center text-white font-bold uppercase">
                  {profile.name[0]}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold">{profile.name}</h4>
                  <span className="text-xs text-zinc-500">Free Account</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Authenticated Top Navbar */}
        <header className="sticky top-0 z-40 glass-panel border-b border-card-border bg-nav-bg w-full h-16 shrink-0 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
            
            {/* Command search trigger button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-card-border bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs w-64 transition-all"
            >
              <Search size={14} />
              <span className="flex-1 text-left">Search tools...</span>
              <kbd className="hidden md:inline-flex h-4 items-center gap-0.5 rounded border border-card-border bg-black/5 dark:bg-white/10 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
                ctrl k
              </kbd>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-zinc-600" />}
            </button>
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(prev => !prev)}
                className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
                title="Notifications"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-emerald rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-panel rounded-xl shadow-xl z-50 p-4 border border-card-border max-w-sm animate-in fade-in duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-sm">Notifications</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-zinc-400 hover:text-zinc-600">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="border-b border-card-border/50 pb-2 last:border-b-0 last:pb-0">
                        <p className="text-xs">{n.text}</p>
                        <span className="text-[10px] text-zinc-500 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link 
              href="/billing"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-indigo text-white text-xs font-semibold hover:opacity-95 shadow-md shadow-brand-purple/10"
            >
              <Zap size={12} className="fill-white" />
              Upgrade
            </Link>
          </div>
        </header>
        
        {/* Content Children */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Command Palette Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel border border-card-border rounded-xl shadow-2xl p-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-card-border pb-3 mb-4">
              <span className="text-xs font-semibold text-zinc-500">LinkedInIQ Command Hub</span>
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
                  className="w-full bg-black/10 dark:bg-white/5 border border-card-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-purple transition-all"
                  autoFocus
                />
              </div>
            </form>
            <div className="mt-4">
              <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Popular Commands</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button onClick={() => { setSearchQuery('analyzer'); router.push('/analyzer'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-300">
                  <Sparkles size={14} className="text-brand-purple" />
                  Analyze Post
                </button>
                <button onClick={() => { setSearchQuery('profile'); router.push('/profile-intelligence'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-300">
                  <UserCheck size={14} className="text-brand-emerald" />
                  Analyze Profile
                </button>
                <button onClick={() => { setSearchQuery('hooks'); router.push('/hooks'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-300">
                  <PenTool size={14} className="text-brand-indigo" />
                  Hook Generator
                </button>
                <button onClick={() => { setSearchQuery('calendar'); router.push('/calendar'); setShowSearchModal(false); }} className="flex items-center gap-2 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left text-zinc-700 dark:text-zinc-300">
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
