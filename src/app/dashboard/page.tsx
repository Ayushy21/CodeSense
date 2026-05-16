"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Code2,
  Clock,
  Trash2,
  BarChart3,
  FileCode,
} from "lucide-react";

interface SessionData {
  id: string;
  language: string;
  rawCode: string;
  title: string | null;
  createdAt: string;
  review: {
    id: string;
    diagnosis: string;
    scoreBreakdown: {
      overall: number;
      accuracy: number;
      clarity: number;
    } | null;
  } | null;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "#22c55e";
  if (score >= 5) return "#f59e0b";
  return "#ef4444";
}

function getScoreBg(score: number): string {
  if (score >= 8) return "rgba(34,197,94,0.12)";
  if (score >= 5) return "rgba(245,158,11,0.12)";
  return "rgba(239,68,68,0.12)";
}

const languageColors: Record<string, string> = {
  python: "#3b82f6",
  javascript: "#f59e0b",
  typescript: "#3b82f6",
  cpp: "#ef4444",
  java: "#f97316",
  go: "#06b6d4",
  rust: "#f59e0b",
};

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#f0f0f5",
              marginBottom: "4px",
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: "#a0a0b5", fontSize: "14px" }}>
            Your code review history
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href="/dashboard/analytics"
            className="btn-secondary"
            style={{ textDecoration: "none" }}
          >
            <BarChart3 size={16} />
            Analytics
          </Link>
          <Link
            href="/review/new"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            <Plus size={16} />
            New Review
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {[
            {
              label: "Total Reviews",
              value: sessions.length,
              icon: FileCode,
              color: "#3b82f6",
            },
            {
              label: "Avg Score",
              value:
                sessions.filter((s) => s.review?.scoreBreakdown).length > 0
                  ? (
                      sessions
                        .filter((s) => s.review?.scoreBreakdown)
                        .reduce(
                          (acc, s) =>
                            acc + (s.review?.scoreBreakdown?.overall || 0),
                          0
                        ) /
                      sessions.filter((s) => s.review?.scoreBreakdown).length
                    ).toFixed(1)
                  : "—",
              icon: BarChart3,
              color: "#22c55e",
            },
            {
              label: "Languages Used",
              value: new Set(sessions.map((s) => s.language)).size,
              icon: Code2,
              color: "#8b5cf6",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-panel-sm"
              style={{ padding: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `${stat.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#f0f0f5",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b6b80",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Sessions Grid */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <div className="spinner spinner-lg" />
        </div>
      ) : sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{
            padding: "60px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(34,197,94,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Code2 size={32} color="#22c55e" />
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "8px",
            }}
          >
            No reviews yet
          </h2>
          <p
            style={{
              color: "#a0a0b5",
              fontSize: "14px",
              marginBottom: "24px",
              maxWidth: "400px",
              margin: "0 auto 24px",
            }}
          >
            Start by pasting some code — try a Python off-by-one error, a
            missing await in JavaScript, or a C++ memory leak.
          </p>
          <Link
            href="/review/new"
            className="btn-primary"
            style={{ textDecoration: "none" }}
          >
            <Plus size={16} />
            Create Your First Review
          </Link>
        </motion.div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            gap: "16px",
          }}
        >
          <AnimatePresence>
            {sessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/review/${session.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="card" style={{ cursor: "pointer" }}>
                    {/* Card Header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        className="badge"
                        style={{
                          color:
                            languageColors[session.language] || "#a0a0b5",
                          borderColor: `${languageColors[session.language] || "#a0a0b5"}40`,
                          background: `${languageColors[session.language] || "#a0a0b5"}12`,
                        }}
                      >
                        {session.language}
                      </div>

                      {session.review?.scoreBreakdown && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 12px",
                            borderRadius: "8px",
                            background: getScoreBg(
                              session.review.scoreBreakdown.overall
                            ),
                            fontSize: "14px",
                            fontWeight: 700,
                            color: getScoreColor(
                              session.review.scoreBreakdown.overall
                            ),
                          }}
                        >
                          {session.review.scoreBreakdown.overall}/10
                        </div>
                      )}
                    </div>

                    {/* Code Snippet */}
                    <div
                      style={{
                        background: "#0c0c0f",
                        borderRadius: "8px",
                        padding: "12px",
                        marginBottom: "12px",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "11px",
                        color: "#a0a0b5",
                        lineHeight: 1.6,
                        overflow: "hidden",
                        maxHeight: "80px",
                      }}
                    >
                      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                        {session.rawCode.slice(0, 150)}
                        {session.rawCode.length > 150 ? "..." : ""}
                      </pre>
                    </div>

                    {/* Card Footer */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          color: "#6b6b80",
                        }}
                      >
                        <Clock size={12} />
                        {new Date(session.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "6px",
                          color: "#6b6b80",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.color = "#ef4444";
                          (e.target as HTMLElement).style.background =
                            "rgba(239,68,68,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.color = "#6b6b80";
                          (e.target as HTMLElement).style.background =
                            "transparent";
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
