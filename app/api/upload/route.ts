import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { fileName, contentType } = await request.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { message: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    // Validate content type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { message: "File type not allowed" },
        { status: 400 }
      );
    }

    // Generate unique path
    const ext = fileName.split(".").pop();
    const path = `blog/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    // Create signed upload URL
    const { data, error } = await supabase.storage
      .from("media")
      .createSignedUploadUrl(path);

    if (error) {
      console.error("Signed URL error:", error);
      return NextResponse.json(
        { message: "Failed to create upload URL" },
        { status: 500 }
      );
    }

    // Get the public URL for the file
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
      publicUrl,
    });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
