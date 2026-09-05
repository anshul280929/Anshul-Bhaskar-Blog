"use client";

import { motion } from "framer-motion";
import {
  Mail,
  ExternalLink,
  Code2,
  MapPin,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";

// TODO: Replace with your actual projects
const projects: {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}[] = [
  {
    title: "Project One",
    description:
      "A brief description of your first project. What it does, the problem it solves.",
    tags: ["Next.js", "Supabase", "AI"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    title: "Project Two",
    description:
      "A brief description of your second project. Highlight the tech and impact.",
    tags: ["Python", "Machine Learning", "FastAPI"],
    githubUrl: "https://github.com",
  },
  {
    title: "Project Three",
    description:
      "A brief description of your third project. What makes it unique.",
    tags: ["React", "TypeScript", "Node.js"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
];

const socials = [
  { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
  { icon: LinkedinIcon, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: TwitterIcon, href: "https://x.com", label: "X / Twitter" },
  {
    icon: Mail,
    href: "mailto:anshulbhaskar50@gmail.com",
    label: "Email",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  return (
    <div className="container-wide" style={{ padding: "3rem 1.5rem 4rem" }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "4rem",
        }}
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "#333333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            boxShadow: "0 0 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Code2 size={48} color="white" />
        </motion.div>

        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            marginBottom: "0.5rem",
            letterSpacing: "-0.02em",
          }}
        >
          Anshul Bhaskar
        </h1>

        <p
          style={{
            fontSize: "1.125rem",
            color: "var(--color-text-secondary)",
            fontWeight: 500,
            marginBottom: "0.75rem",
          }}
        >
          Developer · Writer · Tech Enthusiast
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          <MapPin size={14} />
          India
        </div>

        <p
          style={{
            fontSize: "1.0625rem",
            color: "var(--color-text-secondary)",
            lineHeight: 1.7,
            maxWidth: 560,
            marginBottom: "2rem",
          }}
        >
          Passionate about artificial intelligence, building startups, and
          exploring the frontiers of computer science. I write to share what I
          learn and to connect with like-minded builders.
        </p>

        {/* Social Links */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {socials.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={label}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "var(--color-bg-tertiary)",
                border: "1px solid var(--color-border-default)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-secondary)",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Projects Section */}
      <div style={{ marginBottom: "4rem" }}>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            letterSpacing: "-0.01em",
          }}
        >
          Projects
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "2rem",
          }}
        >
          Some things I&apos;ve built and contributed to.
        </motion.p>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={item}
              className="glass-card"
              style={{ padding: "1.5rem" }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--color-text-primary)",
                }}
              >
                {project.title}
              </h3>

              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                {project.description}
              </p>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.375rem",
                  marginBottom: "1rem",
                }}
              >
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "0.2rem 0.6rem",
                      fontSize: "0.6875rem",
                      fontWeight: 500,
                      color: "var(--color-text-muted)",
                      background: "var(--color-bg-tertiary)",
                      borderRadius: 6,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: "var(--color-text-secondary)",
                      textDecoration: "none",
                    }}
                  >
                    <GithubIcon size={14} />
                    Source
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
