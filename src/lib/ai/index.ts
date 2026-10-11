import { AIProvider } from "./types";
import { GeminiProvider } from "./gemini-provider";
import { MockProvider } from "./mock-provider";

let cachedProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cachedProvider) {
    return cachedProvider;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

  if (apiKey && apiKey.trim().length > 0 && apiKey !== "your-gemini-api-key-here") {
    try {
      cachedProvider = new GeminiProvider(apiKey, model);
      return cachedProvider;
    } catch (err) {
      console.warn("Failed to initialize GeminiProvider, falling back to MockProvider:", err);
    }
  }

  cachedProvider = new MockProvider();
  return cachedProvider;
}

export * from "./types";
