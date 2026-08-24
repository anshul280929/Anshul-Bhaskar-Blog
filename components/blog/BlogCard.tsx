"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowUpRight } from "lucide-react";
import { formatDate, extractTextFromTiptapJson, readingTime } from "@/lib/utils";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image_url: string | null;
    tags: string[];
    published_at: string;
    content: Record<string, unknown>;
  };
  index: number;
}

export default function BlogCard({ post, index }: BlogCardProps) {
  const fullText = extractTextFromTiptapJson(post.content);
  const time = readingTime(fullText);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <article
          className="glass-card glow-effect"
          style={{
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          {/* Cover Image */}
          {post.cover_image_url && (
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/9",
                overflow: "hidden",
              }}
            >
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, var(--color-bg-card) 0%, transparent 50%)",
                }}
              />
            </div>
          )}

          <div style={{ padding: "1.5rem" }}>
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: "0.5rem",
                color: "var(--color-text-primary)",
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <span style={{ flex: 1 }}>{post.title}</span>
              <ArrowUpRight
                size={18}
                style={{
                  flexShrink: 0,
                  color: "var(--color-text-muted)",
                  marginTop: 4,
                }}
              />
            </h2>

            {/* Excerpt */}
            {post.excerpt && (
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <Calendar size={14} />
                {formatDate(post.published_at)}
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                }}
              >
                <Clock size={14} />
                {time}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
