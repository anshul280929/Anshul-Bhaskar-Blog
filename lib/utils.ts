import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function readingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

export function extractTextFromTiptapJson(json: Record<string, unknown>): string {
  let text = "";
  if (json.type === "text" && typeof json.text === "string") {
    text += json.text + " ";
  }
  if (Array.isArray(json.content)) {
    for (const child of json.content) {
      text += extractTextFromTiptapJson(child as Record<string, unknown>);
    }
  }
  return text;
}

const REACTION_EMOJIS = ["👍", "❤️", "🔥", "🚀", "💡", "👏"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];
export { REACTION_EMOJIS };
