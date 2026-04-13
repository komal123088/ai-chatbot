"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className={`w-9 h-9 rounded-lg ${className}`} />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 dark:border-white/10 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 ${className}`}
      title="Toggle theme"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
