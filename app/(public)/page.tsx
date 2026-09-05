"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Newspaper } from "lucide-react";

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 720 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 1rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 9999,
            }}
          >
            <Sparkles size={14} />
            Tech, AI & Startups
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Hi, I&apos;m{" "}
          <span className="gradient-text">Anshul Bhaskar</span>
          <br />
          <span style={{ color: "var(--color-text-secondary)" }}>
            I write about the future.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: "1.125rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 2.5rem",
          }}
        >
          Exploring artificial intelligence, building startups, and diving deep
          into computer science. Read my thoughts or catch up on the latest tech
          news.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link href="/blog" className="btn-primary">
            <Sparkles size={16} />
            Read Blog
            <ArrowRight size={16} />
          </Link>
          <Link href="/news" className="btn-secondary">
            <Newspaper size={16} />
            Tech News
          </Link>
        </motion.div>

        {/* Decorative gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.02) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255, 255, 255, 0.015) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
}
