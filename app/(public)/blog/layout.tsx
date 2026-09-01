import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles about AI, startups, computer science, and technology by Anshul Bhaskar.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
