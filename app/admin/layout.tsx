import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Code2, LayoutDashboard, PenSquare, LogOut, Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "var(--color-bg-secondary)",
          borderRight: "1px solid var(--color-border-default)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 30,
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
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Code2 size={16} color="white" />
          </div>
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            Admin Panel
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
          <AdminNavLink
            href="/admin/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />
          <AdminNavLink
            href="/admin/editor"
            icon={<PenSquare size={18} />}
            label="New Post"
          />
          <AdminNavLink
            href="/"
            icon={<Home size={18} />}
            label="View Site"
          />
        </nav>

        {/* User info & logout */}
        <div
          style={{
            borderTop: "1px solid var(--color-border-default)",
            paddingTop: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--color-text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            {profile.display_name || user.email}
          </p>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
                color: "var(--color-error)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: "0.5rem 0",
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: 260,
          padding: "2rem",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "var(--color-text-secondary)",
        borderRadius: 10,
        textDecoration: "none",
        transition: "all 0.2s",
      }}
    >
      {icon}
      {label}
    </Link>
  );
}
