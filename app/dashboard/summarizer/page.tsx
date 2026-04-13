"use client";
import { useState } from "react";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { generateContent, isConfigured } from "@/lib/gemini";
import { parseGeminiError } from "@/lib/errors";

const SUMMARY_MODES = [
  {
    value: "bullets",
    label: "Bullet Points",
    desc: "Key takeaways as bullets",
  },
  { value: "tldr", label: "TL;DR", desc: "One-paragraph summary" },
  { value: "keypoints", label: "Key Points", desc: "Numbered key points" },
  { value: "outline", label: "Outline", desc: "Hierarchical outline" },
];

const EXAMPLES = [
  {
    title: "Article snippet",
    text: "Artificial intelligence has transformed how businesses operate across all sectors. From healthcare to finance, AI systems are now making decisions that once required human expertise. Machine learning algorithms analyze vast datasets to predict outcomes, detect anomalies, and automate complex processes. Natural language processing enables chatbots and virtual assistants to handle customer inquiries at scale. Computer vision powers quality control in manufacturing and medical imaging analysis. However, this rapid adoption raises important questions about job displacement, algorithmic bias, and data privacy.",
  },
  {
    title: "Research abstract",
    text: "This study examines the relationship between sleep duration and cognitive performance in adults aged 25-65. Using a randomized controlled trial with 500 participants over 12 weeks, we measured memory retention, problem-solving ability, and reaction time. Results show that participants averaging 7-9 hours of sleep outperformed those with less than 6 hours by 34% on memory tasks and 27% on problem-solving benchmarks. The correlation between sleep quality and cognitive function was statistically significant (p<0.001). These findings suggest that sleep optimization interventions could meaningfully improve workplace productivity.",
  },
];

interface BulletResult {
  title?: string;
  bullets: string[];
  raw: string;
}

function parseBullets(text: string): BulletResult {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const bullets: string[] = [];
  let title = "";

  for (const line of lines) {
    if (line.match(/^[#]+\s/)) {
      title = line.replace(/^[#]+\s/, "");
    } else if (line.match(/^[-•*]\s/) || line.match(/^\d+\.\s/)) {
      bullets.push(line.replace(/^[-•*]\s|^\d+\.\s/, ""));
    } else {
      bullets.push(line);
    }
  }

  return { title, bullets: bullets.filter(Boolean), raw: text };
}

export default function SummarizerPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("bullets");
  const [result, setResult] = useState<BulletResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    const content = text.trim();
    if (!content || loading) return;

    if (!isConfigured()) {
      setError(
        "NEXT_PUBLIC_OPENROUTER_API_KEY is not set. Add it to .env.local and restart.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const prompts: Record<string, string> = {
      bullets: `Summarize the following text as 5-8 clear bullet points, each starting with "• ". Focus on the most important information. Return only the bullet points, no other text:\n\n${content}`,
      tldr: `Write a TL;DR summary of the following text in 2-3 sentences. Be direct and concise:\n\n${content}`,
      keypoints: `Extract 5-7 key points from the following text. Number each point starting with "1. ". Be specific and informative:\n\n${content}`,
      outline: `Create a structured outline of the following text with main sections and sub-points. Use "# " for sections and "- " for sub-points:\n\n${content}`,
    };

    try {
      const responseText = await generateContent(prompts[mode]);
      setResult(parseBullets(responseText));
    } catch (err) {
      setError(parseGeminiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Input Panel */}
      <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/[0.07]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900/50 flex-shrink-0">
          <div>
            <h2 className="font-display font-600 text-slate-900 dark:text-white">
              Text Summarizer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste text, get instant summaries
            </p>
          </div>
          {text && (
            <button
              onClick={() => {
                setText("");
                setResult(null);
                setError(null);
              }}
              className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} /> Clear
            </button>
          )}
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900/30 overflow-x-auto flex-shrink-0">
          {SUMMARY_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`flex-shrink-0 text-xs font-500 px-3 py-1.5 rounded-lg transition-all ${
                mode === m.value
                  ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article, research paper, email, or any text here..."
            className="w-full h-full min-h-[200px] bg-white dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm px-5 py-4 resize-none outline-none leading-relaxed"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900/50 flex-shrink-0">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {wordCount} words · {charCount} chars
          </span>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1">
              {EXAMPLES.map((e) => (
                <button
                  key={e.title}
                  onClick={() => setText(e.text)}
                  className="text-xs text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 px-2 py-1 rounded hover:bg-teal-50 dark:hover:bg-teal-500/5 transition-colors"
                >
                  {e.title}
                </button>
              ))}
            </div>
            <button
              onClick={handleSummarize}
              disabled={!text.trim() || loading}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-500 text-sm px-4 py-2 rounded-lg disabled:opacity-40 hover:shadow-md hover:shadow-teal-500/25 transition-all"
            >
              {loading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Sparkles size={13} />
              )}
              {loading ? "Summarizing..." : "Summarize"}
            </button>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/20">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/[0.07] flex-shrink-0">
          <h3 className="font-display font-600 text-slate-700 dark:text-slate-300 text-sm">
            Summary
          </h3>
          {result && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-teal-500" />
                  <span className="text-teal-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy all
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <FileText size={28} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-display font-600 text-slate-900 dark:text-white mb-1">
                  Summary will appear here
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                  Paste any text on the left and click Summarize to get instant
                  key points.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-3 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    {i % 2 === 0 && (
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {result && !loading && (
            <div className="animate-fade-in space-y-2">
              {result.title && (
                <h4 className="font-display font-600 text-slate-900 dark:text-white mb-4">
                  {result.title}
                </h4>
              )}
              {result.bullets.map((bullet, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 group p-3 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors"
                >
                  <ChevronRight
                    size={14}
                    className="text-teal-500 flex-shrink-0 mt-0.5"
                  />
                  <span className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    {bullet}
                  </span>
                </div>
              ))}
              <div className="pt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-white/[0.07] mt-2">
                <Sparkles size={11} className="text-teal-500" />
                Summarized by Gemini 2.0 Flash ·{" "}
                {SUMMARY_MODES.find((m) => m.value === mode)?.label}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
