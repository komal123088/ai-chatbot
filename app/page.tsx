"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MessageSquare, Code2, FileText, Zap, ArrowRight, Sparkles, Shield, Globe } from "lucide-react";
import { useState, useEffect } from "react";

const TOOLS = [
  { icon: MessageSquare, title: "AI Chat", desc: "Context-aware conversations with Gemini&apos;s latest model. Streaming responses, message history.", color: "from-teal-500 to-cyan-500", bg: "bg-teal-500/10 border-teal-500/20" },
  { icon: Code2, title: "Code Generator", desc: "Generate, explain, and debug code across 20+ languages with syntax highlighting.", color: "from-violet-500 to-purple-500", bg: "bg-violet-500/10 border-violet-500/20" },
  { icon: FileText, title: "Text Summarizer", desc: "Transform long documents into crisp, structured bullet-point summaries instantly.", color: "from-amber-500 to-orange-500", bg: "bg-amber-500/10 border-amber-500/20" },
  { icon: Zap, title: "More Coming", desc: "Image analysis, audio transcription, and multi-modal tools in the pipeline.", color: "from-rose-500 to-pink-500", bg: "bg-rose-500/10 border-rose-500/20" },
];

const STATS = [
  { value: "1M+", label: "Tokens/min" },
  { value: "20+", label: "Languages" },
  { value: "99.9%", label: "Uptime" },
  { value: "<1s", label: "Latency" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 text-white overflow-x-hidden transition-theme">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid text-slate-800/30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl bg-slate-950/80 border-b border-white/[0.06]' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-display font-700 text-lg text-white tracking-tight">Gemini Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Open App <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-400 bg-teal-400/10 border border-teal-400/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            Powered by Google Gemini 1.5
          </div>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-800 leading-[1.05] tracking-tight mb-6 text-white">
            AI-Powered Tools
            <br />
            <span className="text-gradient">For Every Workflow</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Chat, generate code, and summarize text with Google Gemini&apos;s most capable model. 
            Built for developers, writers, and creators.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="group flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium px-7 py-3.5 rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200 text-base">
              Get Started Free
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a href="#tools" className="text-slate-400 hover:text-white border border-white/10 hover:border-white/20 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 text-base">
              Explore Tools
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-3xl mx-auto mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {STATS.map((s) => (
            <div key={s.label} className="bg-slate-950/90 px-6 py-6 text-center">
              <div className="font-display text-3xl font-700 text-white mb-1">{s.value}</div>
              <div className="text-slate-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="relative py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl font-700 text-white mb-4">Four Powerful Tools</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Everything you need to work smarter with AI, all in one platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOOLS.map((tool) => (
              <div key={tool.title} className={`group relative rounded-2xl border p-6 hover:scale-[1.02] transition-all duration-200 ${tool.bg} cursor-default`}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <tool.icon size={20} className="text-white" />
                </div>
                <h3 className="font-display font-600 text-lg text-white mb-2">{tool.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Secure by Default", desc: "Your API key stays in your environment. No data stored, no tracking." },
              { icon: Globe, title: "Gemini 1.5 Flash", desc: "Access the fastest, most capable Gemini model with 1M token context window." },
              { icon: Sparkles, title: "Beautiful Interface", desc: "Dark/light themes, responsive design, and smooth animations out of the box." },
            ].map((f) => (
              <div key={f.title} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <f.icon size={18} className="text-teal-400" />
                </div>
                <h3 className="font-display font-600 text-white">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl border border-teal-500/20 bg-gradient-to-b from-teal-500/10 to-transparent p-12">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-teal-500/5 to-transparent pointer-events-none" />
            <h2 className="font-display text-4xl font-700 text-white mb-4">Ready to build with AI?</h2>
            <p className="text-slate-400 mb-8">No signup required. Bring your Gemini API key and start instantly.</p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all duration-200 text-base">
              Launch Studio <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
            <span>Gemini Studio — Built with Next.js 14</span>
          </div>
          <span>Powered by Google Gemini API</span>
        </div>
      </footer>
    </div>
  );
}
