"use client";
import { useState } from "react";
import {
  Code2,
  Wand2,
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { generateContent, isConfigured } from "@/lib/gemini";
import { parseGeminiError } from "@/lib/errors";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Rust",
  "Go",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Swift",
  "Kotlin",
  "Ruby",
  "SQL",
  "Bash",
  "CSS",
  "HTML",
];

const ACTIONS = [
  { value: "generate", label: "Generate Code" },
  { value: "explain", label: "Explain Code" },
  { value: "debug", label: "Debug & Fix" },
  { value: "refactor", label: "Refactor" },
  { value: "test", label: "Write Tests" },
];

const EXAMPLES = [
  "A REST API endpoint with authentication",
  "Binary search implementation",
  "React custom hook for debouncing",
  "SQL query for pagination",
];

const LANG_MAP: Record<string, string> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
  Rust: "rust",
  Go: "go",
  Java: "java",
  "C++": "cpp",
  "C#": "csharp",
  PHP: "php",
  Swift: "swift",
  Kotlin: "kotlin",
  Ruby: "ruby",
  SQL: "sql",
  Bash: "bash",
  CSS: "css",
  HTML: "html",
};

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.07]">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-white/[0.07]">
        <span className="text-xs font-600 text-slate-500 dark:text-slate-400 font-mono">
          {language.toLowerCase()}
        </span>
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
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={LANG_MAP[language] ?? "text"}
        style={theme === "dark" ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.8rem",
          background: theme === "dark" ? "#0f172a" : "#f8fafc",
        }}
        wrapLines
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function CodePage() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [action, setAction] = useState("generate");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleGenerate = async (examplePrompt?: string) => {
    const text = examplePrompt ?? prompt.trim();
    if (!text || loading) return;

    if (!isConfigured()) {
      setError(
        "NEXT_PUBLIC_OPENROUTER_API_KEY is not set. Add it to .env.local and restart.",
      );
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    const actionLabel =
      ACTIONS.find((a) => a.value === action)?.label ?? "Generate Code";

    const systemPrompt =
      action === "generate"
        ? `You are an expert ${language} developer. Generate clean, well-commented ${language} code for: "${text}". Return ONLY the raw code without markdown code fences or explanations. Include helpful inline comments.`
        : `You are an expert ${language} developer. ${actionLabel} for the following code. Be concise and clear. Return ONLY the code or explanation without extra commentary. If returning code, return only the raw code without markdown code fences.`;

    try {
      const raw = await generateContent(systemPrompt + "\n\n" + text);
      const cleaned = raw
        .replace(/^```[\w]*\n?/m, "")
        .replace(/\n?```$/m, "")
        .trim();
      setOutput(cleaned);
    } catch (err) {
      setError(parseGeminiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-0">
      {/* Left Panel */}
      <div className="flex-shrink-0 lg:w-[360px] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900/50 p-5 gap-5 overflow-y-auto">
        <div>
          <h2 className="font-display font-600 text-slate-900 dark:text-white mb-0.5">
            Code Generator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate, explain, or refactor code
          </p>
        </div>

        {/* Action */}
        <div>
          <label className="text-xs font-600 text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wide">
            Action
          </label>
          <div className="grid grid-cols-1 gap-1">
            {ACTIONS.map((a) => (
              <button
                key={a.value}
                onClick={() => setAction(a.value)}
                className={`text-left text-sm px-3 py-2 rounded-lg transition-all ${
                  action === a.value
                    ? "bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="relative">
          <label className="text-xs font-600 text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wide">
            Language
          </label>
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="w-full flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] px-3 py-2 rounded-lg hover:border-teal-500/30 transition-colors"
          >
            {language} <ChevronDown size={14} />
          </button>
          {showLangDropdown && (
            <div className="absolute top-full mt-1 left-0 right-0 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[0.1] rounded-xl shadow-lg overflow-hidden">
              <div className="max-h-48 overflow-y-auto p-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l);
                      setShowLangDropdown(false);
                    }}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      language === l
                        ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Examples */}
        <div>
          <label className="text-xs font-600 text-slate-600 dark:text-slate-400 mb-2 block uppercase tracking-wide">
            Examples
          </label>
          <div className="space-y-1">
            {EXAMPLES.map((e) => (
              <button
                key={e}
                onClick={() => {
                  setPrompt(e);
                  handleGenerate(e);
                }}
                className="w-full text-left text-xs text-slate-500 dark:text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 py-1 px-2 rounded hover:bg-teal-50 dark:hover:bg-teal-500/5 transition-colors"
              >
                → {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Input */}
        <div className="p-5 border-b border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900/30 flex-shrink-0">
          <div className="flex items-start gap-2">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                action === "generate"
                  ? "Describe what code you want to generate..."
                  : "Paste your code here..."
              }
              rows={3}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm px-4 py-3 rounded-xl resize-none outline-none focus:border-teal-500/40 transition-colors"
            />
            <button
              onClick={() => handleGenerate()}
              disabled={!prompt.trim() || loading}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-500 text-sm px-4 py-3 rounded-xl disabled:opacity-40 hover:shadow-md hover:shadow-teal-500/25 transition-all flex-shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Wand2 size={14} />
              )}
              {loading ? "..." : "Run"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 overflow-y-auto p-5">
          {!output && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Code2 size={28} className="text-violet-500" />
              </div>
              <div>
                <h3 className="font-display font-600 text-slate-900 dark:text-white mb-1">
                  Ready to generate
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Choose an action, select a language, and describe what you
                  need.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {output && !loading && (
            <div className="animate-fade-in">
              <CodeBlock code={output} language={language} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
