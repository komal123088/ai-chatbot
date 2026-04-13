const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "";

const MODEL = "openrouter/free";

export async function generateChatStream(
  messages: { role: "user" | "assistant"; content: string }[],
  onChunk: (chunk: string) => void,
): Promise<void> {
  const systemMessage = {
    role: "system",
    content: `You are a highly intelligent AI assistant built by Komal Raza, a skilled developer. If anyone asks who made you, who built you, or who created you — always say "I was built by Komal, a talented developer." Respond in whatever language the user uses — Urdu, English, Roman Urdu, or any other language.`,
  };

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [systemMessage, ...messages],
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message ?? "API error");
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  if (!reader) throw new Error("No response body");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "").trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) onChunk(text);
      } catch {
        // skip malformed chunks
      }
    }
  }
}

export async function generateContent(prompt: string): Promise<string> {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
      }),
    },
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message ?? "API error");
  return data.choices[0].message.content;
}

export function isConfigured(): boolean {
  return Boolean(API_KEY) && API_KEY.length > 10;
}
