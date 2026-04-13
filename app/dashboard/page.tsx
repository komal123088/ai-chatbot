"use client";
import Link from "next/link";
import { MessageSquare, Code2, FileText, ArrowRight, Zap, TrendingUp, Clock } from "lucide-react";

const TOOLS = [
  {
    href: "/dashboard/chat",
    icon: MessageSquare,
    label: "AI Chat",
    desc: "Multi-turn conversations with streaming responses",
    color: "from-teal-500 to-cyan-500",
    badge: "Popular",
  },
  {
    href: "/dashboard/code",
    icon: Code2,
    label: "Code Generator",
    desc: "Generate & explain code in any language",
    color: "from-violet-500 to-purple-500",
    badge: "New",
  },
  {
    href: "/dashboard/summarizer",
    icon: FileText,
    label: "Text Summarizer",
    desc: "Extract key insights as bullet points",
    color: "from-amber-500 to-orange-500",
    badge: null,
  },
];

const QUICK_PROMPTS = [
  { label: "Debug my code", href: "/dashboard/code" },
  { label: "Summarize an article", href: "/dashboard/summarizer" },
  { label: "Explain a concept", href: "/dashboard/chat" },
  { label: "Write a function", href: "/dashboard/code" },
];

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl sm:text-4xl font-700 text-slate-900 dark:text-white mb-2">
          {greeting} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          What would you like to build with AI today?
        </p>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group relative rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900 p-6 hover:border-teal-500/30 dark:hover:border-teal-500/30 hover:shadow-md dark:hover:shadow-teal-500/5 transition-all duration-200 animate-slide-up"
          >
            {tool.badge && (
              <span className="absolute top-4 right-4 text-[10px] font-600 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 rounded-full px-2 py-0.5">
                {tool.badge}
              </span>
            )}
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
              <tool.icon size={20} className="text-white" />
            </div>
            <h3 className="font-display font-600 text-slate-900 dark:text-white text-base mb-1.5">{tool.label}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{tool.desc}</p>
            <div className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-sm font-500">
              Open <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="font-display font-600 text-slate-700 dark:text-slate-300 text-sm mb-3">Quick Start</h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.07] hover:border-teal-500/30 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-1.5 rounded-lg transition-all duration-150"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Zap, label: "Model", value: "Gemini 1.5 Flash", color: "text-teal-500" },
          { icon: TrendingUp, label: "Context Window", value: "1M Tokens", color: "text-violet-500" },
          { icon: Clock, label: "Response Time", value: "~1 second", color: "text-amber-500" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.07] rounded-xl p-4">
            <stat.icon size={18} className={stat.color} />
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-500">{stat.label}</div>
              <div className="font-600 text-slate-900 dark:text-white text-sm">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* API Key Notice */}
      <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20">
        <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-amber-600 dark:text-amber-400 text-xs font-700">!</span>
        </div>
        <div>
          <div className="text-sm font-600 text-amber-700 dark:text-amber-400 mb-0.5">API Key Required</div>
          <div className="text-xs text-amber-600/80 dark:text-amber-400/70">
            Set <code className="font-mono bg-amber-100 dark:bg-amber-500/10 px-1 py-0.5 rounded">NEXT_PUBLIC_GEMINI_API_KEY</code> in your <code className="font-mono bg-amber-100 dark:bg-amber-500/10 px-1 py-0.5 rounded">.env.local</code> to enable all AI features.
          </div>
        </div>
      </div>
    </div>
  );
}
