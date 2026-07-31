/** Minimal fetch-based chat clients — same five providers as the AppFacts generator. */

export type Provider = "ollama" | "openai" | "anthropic" | "xai" | "gemini";

export interface LlmOptions {
  provider: Provider;
  model: string;
  ollamaHost: string;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export async function chat(opts: LlmOptions, prompt: string): Promise<string> {
  switch (opts.provider) {
    case "ollama": {
      const res = await fetch(`${opts.ollamaHost}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: opts.model,
          stream: false,
          format: "json",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`ollama: HTTP ${res.status} ${await res.text()}`);
      const data = (await res.json()) as { message?: { content?: string } };
      return data.message?.content ?? "";
    }
    case "openai":
    case "xai": {
      const base = opts.provider === "openai" ? "https://api.openai.com" : "https://api.x.ai";
      const key = requireEnv(opts.provider === "openai" ? "OPENAI_API_KEY" : "XAI_API_KEY");
      const res = await fetch(`${base}/v1/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: opts.model,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`${opts.provider}: HTTP ${res.status} ${await res.text()}`);
      const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      return data.choices?.[0]?.message?.content ?? "";
    }
    case "anthropic": {
      const key = requireEnv("ANTHROPIC_API_KEY");
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: opts.model,
          max_tokens: 4096,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) throw new Error(`anthropic: HTTP ${res.status} ${await res.text()}`);
      const data = (await res.json()) as { content?: Array<{ type: string; text?: string }> };
      return data.content?.find((c) => c.type === "text")?.text ?? "";
    }
    case "gemini": {
      const key = requireEnv("GEMINI_API_KEY");
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        },
      );
      if (!res.ok) throw new Error(`gemini: HTTP ${res.status} ${await res.text()}`);
      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }
  }
}

/** Tolerant JSON extraction: strips code fences, grabs outermost braces. */
export function extractJson(text: string): unknown {
  let t = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) throw new Error("LLM response contained no JSON object");
  return JSON.parse(t.slice(start, end + 1));
}
