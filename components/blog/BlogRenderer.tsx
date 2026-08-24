"use client";

import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import DOMPurify from "dompurify";
import { useMemo } from "react";

interface BlogRendererProps {
  content: Record<string, unknown>;
}

const extensions = [
  StarterKit,
  Image,
  Link.configure({ openOnClick: true }),
  Youtube.configure({ width: 0, height: 0 }),
  Underline,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
];

export default function BlogRenderer({ content }: BlogRendererProps) {
  const html = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawHtml = generateHTML(content as any, extensions);
      if (typeof window !== "undefined") {
        return DOMPurify.sanitize(rawHtml, {
          ADD_TAGS: ["iframe"],
          ADD_ATTR: [
            "allow",
            "allowfullscreen",
            "frameborder",
            "scrolling",
            "src",
          ],
        });
      }
      return rawHtml;
    } catch {
      return "<p>Content could not be rendered.</p>";
    }
  }, [content]);

  return (
    <div
      className="blog-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
