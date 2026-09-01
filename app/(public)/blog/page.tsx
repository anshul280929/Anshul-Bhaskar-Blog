"use client";

import { useState, useEffect, useRef } from "react";
import BlogCard from "@/components/blog/BlogCard";

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

// Module-level cache — survives across navigations
let cachedPosts: BlogCardPost[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60 seconds

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogCardPost[]>(cachedPosts ?? []);
  const [isLoading, setIsLoading] = useState(!cachedPosts);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const now = Date.now();
    const cacheValid = cachedPosts && now - cacheTimestamp < CACHE_TTL;

    if (cacheValid) {
      setPosts(cachedPosts!);
      setIsLoading(false);
      return;
    }

    // Prevent double-fetch in StrictMode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: BlogCardPost[]) => {
        cachedPosts = data;
        cacheTimestamp = Date.now();
        setPosts(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

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

      {/* Loading Skeleton */}
      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="glass-card"
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "var(--color-bg-tertiary)",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <div style={{ padding: "1.5rem" }}>
                <div
                  style={{
                    height: 12,
                    width: "40%",
                    borderRadius: 6,
                    background: "var(--color-bg-tertiary)",
                    marginBottom: "0.75rem",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    height: 20,
                    width: "85%",
                    borderRadius: 6,
                    background: "var(--color-bg-tertiary)",
                    marginBottom: "0.5rem",
                    animation: "pulse 1.5s ease-in-out 0.1s infinite",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    width: "65%",
                    borderRadius: 6,
                    background: "var(--color-bg-tertiary)",
                    animation: "pulse 1.5s ease-in-out 0.2s infinite",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : posts && posts.length > 0 ? (
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

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
