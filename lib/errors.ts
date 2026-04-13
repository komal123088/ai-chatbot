export function parseGeminiError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);

  if (
    msg.includes("429") ||
    msg.includes("quota") ||
    msg.includes("RESOURCE_EXHAUSTED")
  ) {
    return "⚠️ API quota exceeded. Free tier limit hit. Try: (1) Wait a minute and retry, (2) Use a different API key, or (3) Enable billing at aistudio.google.com";
  }
  if (
    msg.includes("API_KEY_INVALID") ||
    msg.includes("401") ||
    msg.includes("403")
  ) {
    return "❌ Invalid API key. Please check NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.";
  }
  if (msg.includes("MODEL_NOT_FOUND") || msg.includes("404")) {
    return "❌ Model not found. The selected model may not be available on your API key tier.";
  }
  if (msg.includes("503") || msg.includes("overloaded")) {
    return "⚠️ Gemini servers are overloaded. Please retry in a few seconds.";
  }
  return msg.length > 200 ? msg.slice(0, 200) + "…" : msg;
}
