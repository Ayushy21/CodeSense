"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import {
  Code2,
  LayoutDashboard,
  BarChart3,
  LogIn,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav
      style={{
        background: "rgba(12, 12, 15, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(34,197,94,0.3)",
            }}
          >
            <Code2 size={20} color="#fff" />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #f0f0f5, #a0a0b5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CodeSense
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {isSignedIn ? (
            <>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                      color: isActive ? "#22c55e" : "#a0a0b5",
                      background: isActive
                        ? "rgba(34,197,94,0.1)"
                        : "transparent",
                    }}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}

              <div
                style={{
                  width: "1px",
                  height: "24px",
                  background: "rgba(255,255,255,0.08)",
                  margin: "0 8px",
                }}
              />

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "32px",
                      height: "32px",
                    },
                  },
                }}
              />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
