"use client";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { generateChatStream } from "@/lib/gemini";
import { parseGeminiError } from "@/lib/errors";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-white" />
      </div>
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot w-2 h-2 rounded-full bg-slate-400" />
          <span className="typing-dot w-2 h-2 rounded-full bg-slate-400" />
          <span className="typing-dot w-2 h-2 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? "bg-slate-700 dark:bg-slate-600" : "bg-gradient-to-br from-teal-500 to-cyan-500"}`}
      >
        {isUser ? (
          <User size={13} className="text-white" />
        ) : (
          <Bot size={13} className="text-white" />
        )}
      </div>
      <div
        className={`group max-w-[75%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-tr-sm"
              : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] text-slate-800 dark:text-slate-200 rounded-tl-sm"
          }`}
        >
          {message.content}
          {isStreaming && (
            <span className="inline-block w-0.5 h-4 bg-teal-500 ml-0.5 animate-pulse align-middle" />
          )}
        </div>
        {!isStreaming && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? (
                  <Check size={11} className="text-teal-500" />
                ) : (
                  <Copy
                    size={11}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  />
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const SUGGESTED_PROMPTS = [
  "Explain quantum computing simply",
  "Explain React hooks with examples",
  "Write a Python web scraper",
  "Give me some life advice",
];
export default function ChatPage() {
  // BAAD:
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("chat-messages");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
    } catch {
      return [];
    }
  });
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreamingId(assistantId);
    setInput("");
    setLoading(true);
    setError(null);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      await generateChatStream(history, (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        );
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    } catch (err) {
      setError(parseGeminiError(err));
      // Remove empty assistant message on error
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setStreamingId(null);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 160) + "px";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900/50 flex-shrink-0">
        <div>
          <h2 className="font-display font-600 text-slate-900 dark:text-white">
            AI Chat
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {messages.filter((m) => m.role === "user").length} messages ·
            DeepSeek V3 · Any language
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => {
              setMessages([]);
              setError(null);
              localStorage.removeItem("chat-messages");
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/5 border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
          >
            <Trash2 size={13} /> Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center">
              <Bot size={32} className="text-teal-500" />
            </div>
            <div>
              <h3 className="font-display font-600 text-slate-900 dark:text-white text-xl mb-2">
                Start a conversation
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                Ask anything in any language. Powered by OpenRouter free tier.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => handleSend(p)}
                  className="text-left text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/[0.07] hover:border-teal-500/30 hover:text-teal-600 dark:hover:text-teal-400 px-4 py-3 rounded-xl transition-all duration-150"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
            isStreaming={m.id === streamingId}
          />
        ))}

        {/* Show typing indicator only before first chunk arrives */}
        {loading &&
          streamingId &&
          messages.find((m) => m.id === streamingId)?.content === "" && (
            <TypingIndicator />
          )}

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 animate-fade-in">
            <AlertCircle
              size={15}
              className="text-red-500 flex-shrink-0 mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              {error.includes("quota") && (
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <RefreshCw size={10} /> Get a new API key at openrouter.ai
                </a>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-white/[0.07] bg-white dark:bg-slate-900/50 flex-shrink-0">
        <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/[0.07] rounded-2xl px-4 py-3 focus-within:border-teal-500/40 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message AI… (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm resize-none outline-none leading-relaxed min-h-[24px]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:shadow-teal-500/30 transition-all flex-shrink-0"
          >
            {loading ? (
              <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          DeepSeek V3 · Streaming · English / Urdu / Roman Urdu supported
        </p>
      </div>
    </div>
  );
}
