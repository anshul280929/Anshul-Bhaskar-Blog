import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  PenSquare,
  FileText,
  FilePenLine,
  Trash2,
  Eye,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  const published = posts?.filter((p) => p.status === "published") || [];
  const drafts = posts?.filter((p) => p.status === "draft") || [];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              marginBottom: "0.25rem",
            }}
          >
            Dashboard
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            Manage your blog posts
          </p>
        </div>
        <Link href="/admin/editor" className="btn-primary">
          <PenSquare size={16} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: "1.25rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-accent-primary)",
            }}
          >
            {posts?.length || 0}
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
            }}
          >
            Total Posts
          </p>
        </div>
        <div
          className="glass-card"
          style={{
            padding: "1.25rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-success)",
            }}
          >
            {published.length}
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
            }}
          >
            Published
          </p>
        </div>
        <div
          className="glass-card"
          style={{
            padding: "1.25rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--color-warning)",
            }}
          >
            {drafts.length}
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
            }}
          >
            Drafts
          </p>
        </div>
      </div>

      {/* Posts List */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "1rem 1.5rem",
            borderBottom: "1px solid var(--color-border-default)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <FileText size={18} style={{ color: "var(--color-text-muted)" }} />
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            All Posts
          </h2>
        </div>

        {posts && posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid var(--color-border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-muted)",
                      marginTop: "0.125rem",
                    }}
                  >
                    {post.status === "published"
                      ? `Published ${new Date(post.published_at).toLocaleDateString()}`
                      : `Draft · Created ${new Date(post.created_at).toLocaleDateString()}`}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  {/* Status badge */}
                  <span
                    style={{
                      padding: "0.25rem 0.625rem",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      borderRadius: 9999,
                      background:
                        post.status === "published"
                          ? "rgba(110, 201, 110, 0.1)"
                          : "rgba(212, 168, 68, 0.1)",
                      color:
                        post.status === "published"
                          ? "var(--color-success)"
                          : "var(--color-warning)",
                      border:
                        post.status === "published"
                          ? "1px solid rgba(110, 201, 110, 0.2)"
                          : "1px solid rgba(212, 168, 68, 0.2)",
                    }}
                  >
                    {post.status}
                  </span>

                  {/* Actions */}
                  {post.status === "published" && (
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--color-text-muted)",
                        textDecoration: "none",
                      }}
                      title="View post"
                    >
                      <Eye size={16} />
                    </Link>
                  )}
                  <Link
                    href={`/admin/editor/${post.id}`}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                    }}
                    title="Edit post"
                  >
                    <FilePenLine size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--color-text-muted)",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>No posts yet</p>
            <Link href="/admin/editor" className="btn-primary">
              <PenSquare size={16} />
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
