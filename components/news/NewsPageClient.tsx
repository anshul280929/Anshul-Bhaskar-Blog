"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Clock,
  Newspaper,
} from "lucide-react";
import type { NormalizedArticle } from "@/lib/news";
import Image from "next/image";

const categories = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI" },
  { key: "startup", label: "Startups" },
  { key: "programming", label: "Programming" },
  { key: "science", label: "Science" },
];

interface NewsPageClientProps {
  initialArticles: NormalizedArticle[];
}

export default function NewsPageClient({
  initialArticles,
}: NewsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? initialArticles
      : initialArticles.filter(
          (a) =>
            a.title.toLowerCase().includes(activeCategory) ||
            a.description.toLowerCase().includes(activeCategory) ||
            a.category.some((c) =>
              c.toLowerCase().includes(activeCategory)
            )
        );

  return (
    <div className="container-wide" style={{ padding: "3rem 1.5rem" }}>
      {/* Header */}
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

      {/* Category Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            style={{
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              borderRadius: 9999,
              border:
                activeCategory === cat.key
                  ? "1px solid rgba(255, 255, 255, 0.2)"
                  : "1px solid var(--color-border-default)",
              background:
                activeCategory === cat.key
                  ? "rgba(255, 255, 255, 0.1)"
                  : "var(--color-bg-secondary)",
              color:
                activeCategory === cat.key
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles */}
      {filtered.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filtered.map((article, index) => (
            <motion.a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass-card"
              style={{
                display: "block",
                textDecoration: "none",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {/* Thumbnail */}
              {article.imageUrl && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    background: "var(--color-bg-tertiary)",
                  }}
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                </div>
              )}

              <div style={{ padding: "1.25rem" }}>
                {/* Source */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--color-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {article.source}
                  </span>
                  <ExternalLink
                    size={14}
                    style={{ color: "var(--color-text-muted)" }}
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: "1.0625rem",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    color: "var(--color-text-primary)",
                    marginBottom: "0.5rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {article.title}
                </h3>

                {/* Description */}
                {article.description && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5,
                      marginBottom: "0.75rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.description}
                  </p>
                )}

                {/* Date */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Clock size={12} />
                  {new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </motion.a>
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
          <Newspaper
            size={48}
            style={{ marginBottom: "1rem", opacity: 0.3 }}
          />
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            No news articles found
          </p>
          <p style={{ fontSize: "0.875rem" }}>
            Try a different category or check back later.
          </p>
        </div>
      )}

      {/* Attribution */}
      <p
        style={{
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          marginTop: "3rem",
          padding: "1rem",
        }}
      >
        News powered by NewsData.io & Currents API
      </p>
    </div>
  );
}
