import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech News",
  description:
    "Latest news on AI, startups, computer science, and technology — curated by anshulbhaskar.blog.",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
