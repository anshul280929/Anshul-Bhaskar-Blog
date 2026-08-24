import { createClient } from "@/lib/supabase/server";
import BlogCard from "@/components/blog/BlogCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read articles about AI, startups, computer science, and technology by Anshul Bhaskar.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image_url, tags, published_at, content")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="container-wide" style={{ padding: "3rem 1.5rem" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          Blog
        </h1>
        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--color-text-secondary)",
            maxWidth: 560,
          }}
        >
          Thoughts on AI, building startups, computer science deep dives, and
          everything in between.
        </p>
      </div>

      {/* Posts Grid */}
      {posts && posts.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {posts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post as BlogCardPost}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "6rem 2rem",
            color: "var(--color-text-muted)",
          }}
        >
          <p style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            No posts yet
          </p>
          <p style={{ fontSize: "0.9375rem" }}>
            Check back soon — new content is on the way!
          </p>
        </div>
      )}
    </div>
  );
}

type BlogCardPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  published_at: string;
  content: Record<string, unknown>;
};
