import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDate, extractTextFromTiptapJson, readingTime } from "@/lib/utils";
import BlogRenderer from "@/components/blog/BlogRenderer";
import ReactionBar from "@/components/blog/ReactionBar";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles(display_name, avatar_url)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const fullText = extractTextFromTiptapJson(post.content);
  const time = readingTime(fullText);

  return (
    <article style={{ padding: "2rem 0 4rem" }}>
      {/* Back link */}
      <div className="container-blog" style={{ marginBottom: "2rem" }}>
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
      </div>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto 2.5rem",
            padding: "0 1.5rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      )}

      {/* Post Header */}
      <div className="container-blog">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            {post.tags.map((tag: string) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            marginBottom: "2.5rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid var(--color-border-default)",
          }}
        >
          {post.profiles && (
            <span style={{ fontWeight: 500, color: "var(--color-text-secondary)" }}>
              {(post.profiles as { display_name: string }).display_name}
            </span>
          )}
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

        {/* Content */}
        <BlogRenderer content={post.content} />

        {/* Reactions */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--color-border-default)",
          }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Did you find this post helpful?
          </p>
          <ReactionBar postId={post.id} />
        </div>
      </div>
    </article>
  );
}
