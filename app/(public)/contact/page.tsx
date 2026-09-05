"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }

      setIsSuccess(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-wide" style={{ padding: "3rem 1.5rem 4rem" }}>
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}
          >
            Get in Touch
          </h1>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-secondary)",
              lineHeight: 1.7,
            }}
          >
            Have a question, idea, or just want to say hi? Drop me a message and
            I&apos;ll get back to you.
          </p>
        </motion.div>

        {/* Direct email */}
        <motion.a
          href="mailto:anshulbhaskar50@gmail.com"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Mail size={20} style={{ color: "var(--color-text-secondary)" }} />
          </div>
          <div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
                marginBottom: "0.125rem",
              }}
            >
              Email me directly
            </p>
            <p
              style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              anshulbhaskar50@gmail.com
            </p>
          </div>
        </motion.a>

        {/* Form */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{
              padding: "3rem",
              textAlign: "center",
            }}
          >
            <CheckCircle
              size={48}
              style={{
                color: "var(--color-success)",
                marginBottom: "1rem",
              }}
            />
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
              }}
            >
              Message Sent!
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "1.5rem",
              }}
            >
              Thanks for reaching out. I&apos;ll get back to you soon.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="btn-secondary"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card"
            style={{ padding: "2rem" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    marginBottom: "0.375rem",
                  }}
                >
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--color-text-secondary)",
                    marginBottom: "0.375rem",
                  }}
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="subject"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.375rem",
                }}
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className="input-field"
                placeholder="What's this about?"
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="message"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  marginBottom: "0.375rem",
                }}
              >
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="input-field"
                placeholder="Your message..."
                style={{ resize: "vertical", minHeight: 120 }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.875rem",
                fontSize: "0.9375rem",
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={18}
                    style={{
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Message
                </>
              )}
            </button>
          </motion.form>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
