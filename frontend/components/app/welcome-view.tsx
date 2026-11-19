'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
  ArrowRight,
  Bell,
  Clock,
  Compass,
  FileText,
  Heart,
  Home as HomeIcon,
  Leaf,
  Lightbulb,
  Menu,
  MessageSquare,
  Moon,
  Newspaper,
  Search,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '@/lib/shadcn/utils';
import { AGENTS, type AgentDefinition } from './app';

interface WelcomeViewProps {
  startButtonText?: string;
  onStartCall?: () => void;
  onSelectAgent: (agent: AgentDefinition) => void;
}

export const WelcomeView = ({
  onSelectAgent,
  startButtonText = 'Talk with Neha',
}: WelcomeViewProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('Good morning');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Set greeting based on time of day
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  if (!mounted) return null;

  const nehaAgent = AGENTS[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectAgent(nehaAgent);
  };

  const menuItems = [
    { label: 'Home', icon: HomeIcon, active: true },
    { label: 'Companion Chat', icon: MessageSquare, active: false },
    { label: 'Live Search', icon: Search, active: false },
    { label: 'Saved Notes', icon: FileText, active: false },
    { label: 'Headlines', icon: Newspaper, active: false },
    { label: 'History', icon: Clock, active: false },
    { label: 'Settings', icon: Settings, active: false },
  ];

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-[#f4f6fb] font-sans text-slate-800">
      {/* ── Background Subtle Glows ── */}
      <div
        className="pointer-events-none absolute top-[-10%] left-[-10%] size-[40vw] rounded-full opacity-[0.14] blur-[150px]"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] bottom-[-10%] size-[50vw] rounded-full opacity-[0.10] blur-[180px]"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
      />

      {/* ── Left Sidebar: Desktop ── */}
      <aside className="fixed top-0 bottom-0 left-0 z-30 hidden w-[220px] flex-col justify-between border-r border-slate-200 bg-white p-5 shadow-sm select-none lg:flex">
        <div>
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2.5 px-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-900/20">
              <Leaf className="size-4.5 animate-pulse fill-white/20 text-white" />
            </div>
            <span className="flex items-center gap-1.5 font-sans text-[18px] font-bold tracking-tight text-blue-700">
              Neha
              <Sparkles className="size-3.5 fill-blue-300/20 text-blue-400" />
            </span>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => onSelectAgent(nehaAgent)}
                  className={cn(
                    'group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium tracking-wide transition-all duration-200',
                    item.active
                      ? 'bg-blue-50 font-semibold text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  )}
                >
                  <Icon
                    className={cn(
                      'size-4 transition-colors',
                      item.active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                    )}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Companion Status Card */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-indigo-50 p-4 shadow-sm">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-blue-600 uppercase">
              <Heart className="size-3 fill-rose-400 text-rose-500" />
              Your Personal AI Companion
            </div>
            <p className="mb-3 text-[11px] leading-relaxed font-medium text-slate-500">
              Feeling alone? Talk to me anytime. Let&apos;s explore ideas and topics together!
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-600">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              Always Here for You
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between border-t border-slate-200 px-1 py-2 pt-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500">
              <Moon className="size-3.5" />
              Dark Mode
            </span>
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className={cn(
                'relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                resolvedTheme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'
              )}
            >
              <span
                className={cn(
                  'pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  resolvedTheme === 'dark' ? 'translate-x-4.5' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex h-full w-[240px] flex-col justify-between bg-white p-5 shadow-xl">
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600">
                    <Leaf className="size-4 text-white" />
                  </div>
                  <span className="font-sans text-base font-bold text-blue-700">Neha</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSelectAgent(nehaAgent);
                      }}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                        item.active
                          ? 'bg-blue-50 font-semibold text-blue-700'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content Area ── */}
      <div className="z-10 flex min-h-screen w-full flex-1 flex-col lg:pl-[220px]">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm md:px-8">
          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="cursor-pointer text-slate-400 hover:text-slate-700 lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          {/* Search Bar — centered */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-4 flex max-w-xl flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 shadow-inner focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100"
          >
            <Search className="mr-2.5 size-4 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Feeling alone? Talk with Neha, discover ideas, explore topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="ml-2 cursor-pointer rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
            >
              Join Me →
            </button>
          </form>

          {/* User controls (Top Right) */}
          <div className="flex items-center gap-3">
            {/* Bell Button */}
            <button className="relative cursor-pointer rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 animate-pulse rounded-full bg-blue-500" />
            </button>

            {/* Profile with Neha's Photo */}
            <div className="group flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition hover:bg-slate-50">
              <div className="relative flex size-7 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-slate-700">
                <Image
                  src="/avatars/livesearch_agent.png"
                  alt="Neha"
                  width={28}
                  height={28}
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-bold text-slate-700">Aanand</span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-7 p-5 md:p-8">
          {/* Welcome Heading */}
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600">
              <Heart className="size-3.5 fill-rose-500 text-rose-500" />
              Neha – Your Personal AI Companion
            </div>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-800 md:text-3xl">
              {greeting}, Aanand <span>👋</span>
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm font-medium leading-relaxed text-slate-600">
              Feeling alone? You can always talk to me. Let&apos;s explore the world together! I&apos;m Neha, your personal AI companion—here to chat, discover new ideas, and explore anything you&apos;re curious about.
            </p>
          </div>

          {/* ── Neha Hero Agent Showcase ── */}
          <div className="overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Photo Area with Neha's large picture */}
              <div className="relative h-[320px] md:col-span-5 md:h-auto overflow-hidden bg-gradient-to-tr from-slate-900 to-blue-950">
                <Image
                  src="/avatars/livesearch_agent.png"
                  alt="Neha - Your Personal AI Companion"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                {/* Overlay Badge Top-Left */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-blue-700 shadow-sm backdrop-blur-md">
                  <Heart className="size-3.5 fill-rose-500 text-rose-500" />
                  Your Personal AI Companion
                </div>
                {/* LIVE Badge Top-Right */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-slate-700 shadow-sm backdrop-blur-md">
                  <span className="size-2 animate-ping rounded-full bg-green-500" />
                  <span className="size-2 rounded-full bg-green-500" />
                  ONLINE
                </div>
              </div>

              {/* Neha Info & Call to Action (Right side of Avatar) */}
              <div className="flex flex-col justify-between p-6 md:col-span-7 md:p-8">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                    Join Me
                  </h2>

                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    Join me in the room so we can talk! I can talk like your friend, and you can explore ideas, web topics, and collect data with me.
                  </p>

                  {/* Feature pills */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      <Heart className="size-4 text-rose-500" />
                      Talk Like a Friend
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      <Lightbulb className="size-4 text-amber-500" />
                      Discover Ideas
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      <Compass className="size-4 text-blue-600" />
                      Search Web Topics
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                      <FileText className="size-4 text-violet-600" />
                      Collect Data & Notes
                    </div>
                  </div>
                </div>

                {/* Primary Button */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => onSelectAgent(nehaAgent)}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:scale-98"
                  >
                    {startButtonText || 'Join Me in the Room'}
                    <ArrowRight className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-center gap-2 border-t border-slate-200 py-6 text-xs font-semibold text-slate-400 select-none">
            <Sparkles className="size-3.5 fill-blue-400/10 text-blue-400" />
            <span>&quot;Neha – Your Personal AI Companion · Talk, Discover Ideas, Explore Topics &amp; Collect Data&quot;</span>
            <Sparkles className="size-3.5 fill-indigo-400/10 text-indigo-400" />
          </div>
        </main>
      </div>
    </div>
  );
};
