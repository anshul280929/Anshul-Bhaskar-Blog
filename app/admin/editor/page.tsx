import EditorForm from "@/components/editor/EditorForm";

export default function NewPostPage() {
  return (
    <div>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          marginBottom: "2rem",
        }}
      >
        Create New Post
      </h1>
      <EditorForm />
    </div>
  );
}
