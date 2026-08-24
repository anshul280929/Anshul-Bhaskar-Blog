import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditorForm from "@/components/editor/EditorForm";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          marginBottom: "2rem",
        }}
      >
        Edit Post
      </h1>
      <EditorForm
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          cover_image_url: post.cover_image_url || "",
          content: post.content,
          tags: post.tags || [],
          status: post.status,
        }}
      />
    </div>
  );
}
