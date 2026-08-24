"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2 } from "lucide-react";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const toggleOptions = [
  { href: "/blog", label: "Blog" },
  { href: "/news", label: "News" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const activeToggle = toggleOptions.find((opt) =>
    pathname.startsWith(opt.href)
  );

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: isScrolled
            ? "rgba(6, 6, 10, 0.85)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
          borderBottom: isScrolled
            ? "1px solid var(--color-border-default)"
            : "1px solid transparent",
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Code2 size={20} color="white" />
            </div>
            <span
              style={{
                fontSize: "1.125rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              anshulbhaskar
              <span style={{ color: "var(--color-accent-primary)" }}>
                .blog
              </span>
            </span>
          </Link>

          {/* Center: Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
            }}
            className="hide-mobile"
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "var(--color-bg-secondary)",
                borderRadius: 12,
                padding: 4,
                border: "1px solid var(--color-border-default)",
                position: "relative",
              }}
            >
              {toggleOptions.map((opt) => (
                <Link
                  key={opt.href}
                  href={opt.href}
                  style={{
                    position: "relative",
                    padding: "0.5rem 1.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color:
                      activeToggle?.href === opt.href
                        ? "white"
                        : "var(--color-text-secondary)",
                    zIndex: 1,
                    borderRadius: 8,
                    transition: "color 0.2s",
                    textDecoration: "none",
                  }}
                >
                  {activeToggle?.href === opt.href && (
                    <motion.div
                      layoutId="toggle-pill"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))",
                        borderRadius: 8,
                        zIndex: -1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Nav Links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
            className="hide-mobile"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: pathname === link.href
                    ? "var(--color-text-primary)"
                    : "var(--color-text-secondary)",
                  borderRadius: 8,
                  transition: "all 0.2s",
                  textDecoration: "none",
                  background: pathname === link.href
                    ? "var(--color-bg-tertiary)"
                    : "transparent",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="show-mobile"
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border-default)",
              color: "var(--color-text-primary)",
              cursor: "pointer",
            }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 72,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
              background: "rgba(6, 6, 10, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              padding: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {/* Toggle in mobile */}
              <div
                style={{
                  display: "flex",
                  background: "var(--color-bg-secondary)",
                  borderRadius: 12,
                  padding: 4,
                  border: "1px solid var(--color-border-default)",
                  marginBottom: "1rem",
                }}
              >
                {toggleOptions.map((opt) => (
                  <Link
                    key={opt.href}
                    href={opt.href}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "0.75rem",
                      fontSize: "0.9375rem",
                      fontWeight: 500,
                      color:
                        activeToggle?.href === opt.href
                          ? "white"
                          : "var(--color-text-secondary)",
                      background:
                        activeToggle?.href === opt.href
                          ? "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))"
                          : "transparent",
                      borderRadius: 8,
                      textDecoration: "none",
                    }}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "1rem 1.25rem",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color:
                      pathname === link.href
                        ? "var(--color-text-primary)"
                        : "var(--color-text-secondary)",
                    background:
                      pathname === link.href
                        ? "var(--color-bg-tertiary)"
                        : "transparent",
                    borderRadius: 12,
                    textDecoration: "none",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
          .show-mobile {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .show-mobile {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
