"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Code2, FileText, Zap, LayoutDashboard, Menu, Sparkles, Home } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Chat" },
  { href: "/dashboard/code", icon: Code2, label: "Code Generator" },
  { href: "/dashboard/summarizer", icon: FileText, label: "Summarizer" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-theme overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[220px] flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/[0.07] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-slate-200 dark:border-white/[0.07]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Sparkles size={13} className="text-white" />
            </div>
            <span className="font-display font-700 text-slate-900 dark:text-white text-base tracking-tight">Gemini Studio</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <div className="px-2 py-1.5 mb-2">
            <span className="text-[10px] font-600 uppercase tracking-widest text-slate-400 dark:text-slate-500">Tools</span>
          </div>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${active
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent'
                  }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <div className="px-2 py-1.5 mt-4 mb-2">
            <span className="text-[10px] font-600 uppercase tracking-widest text-slate-400 dark:text-slate-500">Other</span>
          </div>
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white border border-transparent transition-all">
            <Home size={16} />
            Home
          </Link>
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-slate-200 dark:border-white/[0.07]">
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-slate-100 dark:bg-white/5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Zap size={12} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-600 text-slate-700 dark:text-slate-300 truncate">Gemini 1.5 Flash</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-500">Active</div>
            </div>
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center gap-3 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/[0.07] flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
            <Menu size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-600 text-slate-900 dark:text-white text-sm truncate">
              {NAV_ITEMS.find(i => pathname === i.href)?.label ?? "Dashboard"}
            </h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
