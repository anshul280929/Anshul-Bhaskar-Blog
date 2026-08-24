import { fetchNews } from "@/lib/news";
import NewsPageClient from "@/components/news/NewsPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech News",
  description:
    "Latest news on AI, startups, computer science, and technology — curated by anshulbhaskar.blog.",
};

export const revalidate = 900; // 15 minutes

export default async function NewsPage() {
  const articles = await fetchNews("technology");

  return <NewsPageClient initialArticles={articles} />;
}
