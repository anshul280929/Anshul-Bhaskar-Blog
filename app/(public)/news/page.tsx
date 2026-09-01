"use client";

import { useState, useEffect, useRef } from "react";
import NewsPageClient from "@/components/news/NewsPageClient";
import type { NormalizedArticle } from "@/lib/news";

// Module-level cache — survives across navigations
let cachedArticles: NormalizedArticle[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 900_000; // 15 minutes

export default function NewsPage() {
  const [articles, setArticles] = useState<NormalizedArticle[]>(cachedArticles ?? []);
  const [isLoading, setIsLoading] = useState(!cachedArticles);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const now = Date.now();
    const cacheValid = cachedArticles && now - cacheTimestamp < CACHE_TTL;

    if (cacheValid) {
      setArticles(cachedArticles!);
      setIsLoading(false);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch("/api/news")
      .then((res) => res.json())
      .then((data: NormalizedArticle[]) => {
        cachedArticles = data;
        cacheTimestamp = Date.now();
        setArticles(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="container-wide" style={{ padding: "3rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Tech News
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-secondary)",
              maxWidth: 560,
            }}
          >
            Stay updated with the latest in AI, startups, computer science, and
            technology.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
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
              <div style={{ padding: "1.25rem" }}>
                <div
                  style={{
                    height: 10,
                    width: "30%",
                    borderRadius: 6,
                    background: "var(--color-bg-tertiary)",
                    marginBottom: "0.5rem",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
                <div
                  style={{
                    height: 18,
                    width: "90%",
                    borderRadius: 6,
                    background: "var(--color-bg-tertiary)",
                    marginBottom: "0.5rem",
                    animation: "pulse 1.5s ease-in-out 0.1s infinite",
                  }}
                />
                <div
                  style={{
                    height: 14,
                    width: "70%",
                    borderRadius: 6,
                    background: "var(--color-bg-tertiary)",
                    animation: "pulse 1.5s ease-in-out 0.2s infinite",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.15; }
          }
        `}</style>
      </div>
    );
  }

  return <NewsPageClient initialArticles={articles} />;
}
