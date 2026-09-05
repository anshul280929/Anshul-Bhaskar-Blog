import Link from "next/link";
import { Code2, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/icons/SocialIcons";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border-default)",
        background: "var(--color-bg-secondary)",
        padding: "3rem 0 2rem",
        marginTop: "4rem",
      }}
    >
      <div className="container-wide">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#333333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Code2 size={16} color="white" />
              </div>
              <span
                style={{ fontWeight: 600, color: "var(--color-text-primary)" }}
              >
                anshulbhaskar
                <span style={{ color: "var(--color-text-secondary)" }}>
                  .blog
                </span>
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Writing about AI, startups, computer science, and building the
              future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}
            >
              Navigation
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[
                { href: "/blog", label: "Blog" },
                { href: "/news", label: "News" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-text-secondary)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem",
              }}
            >
              Connect
            </h4>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
              }}
            >
              {[
                { icon: GithubIcon, href: "https://github.com", label: "GitHub" },
                {
                  icon: LinkedinIcon,
                  href: "https://linkedin.com",
                  label: "LinkedIn",
                },
                { icon: TwitterIcon, href: "https://x.com", label: "X / Twitter" },
                {
                  icon: Mail,
                  href: "mailto:anshulbhaskar50@gmail.com",
                  label: "Email",
                },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
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
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--color-border-default)",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
            }}
          >
            © {new Date().getFullYear()} Anshul Bhaskar. All rights reserved.
          </p>
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
            }}
          >
            Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
