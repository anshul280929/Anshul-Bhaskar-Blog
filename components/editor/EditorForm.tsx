"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import TipTapEditor from "@/components/editor/TipTapEditor";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";
import { Save, Send, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditorFormProps {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image_url: string;
    content: Record<string, unknown>;
    tags: string[];
    status: string;
  };
}

export default function EditorForm({ initialData }: EditorFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.cover_image_url || ""
  );
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [content, setContent] = useState<Record<string, unknown>>(
    initialData?.content || {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  };

  const savePost = async (status: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      const postData = {
        title: title.trim(),
        slug: slug || slugify(title),
        excerpt: excerpt.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        content,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status,
        author_id: user.id,
        ...(status === "published" ? { published_at: new Date().toISOString() } : {}),
      };

      if (isEditing && initialData) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success(
          status === "published" ? "Post updated & published!" : "Draft saved!"
        );
      } else {
        const { error } = await supabase.from("posts").insert(postData);

        if (error) throw error;
        toast.success(
          status === "published" ? "Post published!" : "Draft saved!"
        );
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <Link
          href="/admin/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => savePost("draft")}
            disabled={isSaving}
            className="btn-secondary"
          >
            {isSaving ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Save size={16} />
            )}
            Save Draft
          </button>
          <button
            onClick={() => savePost("published")}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Send size={16} />
            )}
            Publish
          </button>
        </div>
      </div>

      {/* Post metadata */}
      <div
        className="glass-card"
        style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title..."
            style={{
              width: "100%",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.3,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--color-text-muted)",
                marginBottom: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="input-field"
              placeholder="post-url-slug"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--color-text-muted)",
                marginBottom: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="input-field"
              placeholder="AI, Startups, Web Dev"
            />
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-text-muted)",
              marginBottom: "0.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="input-field"
            placeholder="A brief summary of your post..."
            rows={2}
            style={{ resize: "vertical" }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-text-muted)",
              marginBottom: "0.25rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Cover Image URL
          </label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="input-field"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Editor */}
      <TipTapEditor content={content} onChange={setContent} />

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
