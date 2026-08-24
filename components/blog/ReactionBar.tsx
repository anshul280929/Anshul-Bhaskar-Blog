"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { REACTION_EMOJIS, type ReactionEmoji } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface ReactionBarProps {
  postId: string;
}

interface ReactionCount {
  emoji: ReactionEmoji;
  count: number;
  hasReacted: boolean;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = localStorage.getItem("reaction_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("reaction_session_id", sessionId);
  }
  return sessionId;
}

export default function ReactionBar({ postId }: ReactionBarProps) {
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReactions = useCallback(async () => {
    const supabase = createClient();
    const sessionId = getSessionId();

    const { data: allReactions } = await supabase
      .from("reactions")
      .select("emoji, session_id")
      .eq("post_id", postId);

    const counts: ReactionCount[] = REACTION_EMOJIS.map((emoji) => {
      const matching = (allReactions || []).filter((r) => r.emoji === emoji);
      return {
        emoji,
        count: matching.length,
        hasReacted: matching.some((r) => r.session_id === sessionId),
      };
    });

    setReactions(counts);
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (emoji: ReactionEmoji) => {
    const supabase = createClient();
    const sessionId = getSessionId();

    const current = reactions.find((r) => r.emoji === emoji);
    if (!current) return;

    if (current.hasReacted) {
      await supabase
        .from("reactions")
        .delete()
        .eq("post_id", postId)
        .eq("emoji", emoji)
        .eq("session_id", sessionId);
    } else {
      await supabase.from("reactions").insert({
        post_id: postId,
        emoji,
        session_id: sessionId,
      });
    }

    fetchReactions();
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "1rem 0",
        }}
      >
        {REACTION_EMOJIS.map((emoji) => (
          <div
            key={emoji}
            className="skeleton"
            style={{ width: 60, height: 40 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        padding: "1.5rem 0",
      }}
    >
      {reactions.map((reaction) => (
        <motion.button
          key={reaction.emoji}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleReaction(reaction.emoji)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.875rem",
            fontSize: "0.875rem",
            background: reaction.hasReacted
              ? "rgba(16, 185, 129, 0.15)"
              : "var(--color-bg-tertiary)",
            border: reaction.hasReacted
              ? "1px solid var(--color-accent-primary)"
              : "1px solid var(--color-border-default)",
            borderRadius: 9999,
            cursor: "pointer",
            color: "var(--color-text-primary)",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          <span style={{ fontSize: "1.125rem" }}>{reaction.emoji}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={reaction.count}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                fontWeight: 500,
                color: reaction.hasReacted
                  ? "var(--color-accent-primary)"
                  : "var(--color-text-secondary)",
              }}
            >
              {reaction.count > 0 ? reaction.count : ""}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  );
}
