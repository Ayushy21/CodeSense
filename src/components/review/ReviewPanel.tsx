"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useReviewStore, ReviewData } from "@/store/useReviewStore";
import DiffViewer from "./DiffViewer";
import ScoreCard from "./ScoreCard";
import {
  Stethoscope,
  Wrench,
  BookOpen,
  Lightbulb,
  AlertCircle,
  FileCode,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface ReviewPanelProps {
  existingReview?: ReviewData | null;
}

export default function ReviewPanel({ existingReview }: ReviewPanelProps) {
  const { review: storeReview, isLoading, error, code } = useReviewStore();
  const review = storeReview || existingReview;

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["diagnosis", "fixedCode", "explanation", "suggestions", "score"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: "20px",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.06)",
            borderTopColor: "#22c55e",
          }}
        />
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "4px",
            }}
          >
            Analyzing your code...
          </p>
          <p style={{ fontSize: "13px", color: "#6b6b80" }}>
            Running AI review + quality evaluation
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: "16px",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "rgba(239,68,68,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AlertCircle size={28} color="#ef4444" />
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "4px",
            }}
          >
            Analysis Failed
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#a0a0b5",
              maxWidth: "300px",
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: "16px",
          padding: "40px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "rgba(34,197,94,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FileCode size={32} color="#22c55e" />
        </div>
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "6px",
            }}
          >
            Paste code & hit Analyze
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#6b6b80",
              maxWidth: "300px",
              lineHeight: 1.6,
            }}
          >
            Your AI-powered code review with diagnosis, fixes, and quality
            scores will appear here.
          </p>
        </div>
      </div>
    );
  }

  const SectionHeader = ({
    section,
    icon: Icon,
    title,
    color,
  }: {
    section: string;
    icon: typeof Stethoscope;
    title: string;
    color: string;
  }) => (
    <button
      onClick={() => toggleSection(section)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "12px 16px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        borderBottom: expandedSections.has(section)
          ? "1px solid rgba(255,255,255,0.04)"
          : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            background: `${color}15`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={14} color={color} />
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#f0f0f5",
            letterSpacing: "0.3px",
          }}
        >
          {title}
        </span>
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp size={14} color="#6b6b80" />
      ) : (
        <ChevronDown size={14} color="#6b6b80" />
      )}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Diagnosis */}
      <div className="glass-panel-sm" style={{ overflow: "hidden" }}>
        <SectionHeader
          section="diagnosis"
          icon={Stethoscope}
          title="Diagnosis"
          color="#ef4444"
        />
        <AnimatePresence>
          {expandedSections.has("diagnosis") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ padding: "16px" }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#d0d0df",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {review.diagnosis}
              </p>

              {review.lineReferences && review.lineReferences.length > 0 && (
                <div
                  style={{
                    marginTop: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {review.lineReferences.map((ref, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 10px",
                        background: "rgba(239,68,68,0.06)",
                        borderRadius: "6px",
                        border: "1px solid rgba(239,68,68,0.1)",
                        fontSize: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          color: "#ef4444",
                          fontWeight: 600,
                        }}
                      >
                        Line {ref.line}
                      </span>
                      <span style={{ color: "#a0a0b5" }}>{ref.issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Code (Diff View) */}
      <div className="glass-panel-sm" style={{ overflow: "hidden" }}>
        <SectionHeader
          section="fixedCode"
          icon={Wrench}
          title="Fixed Code"
          color="#22c55e"
        />
        <AnimatePresence>
          {expandedSections.has("fixedCode") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DiffViewer
                original={code || ""}
                modified={review.fixedCode}
                language="python"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Explanation */}
      <div className="glass-panel-sm" style={{ overflow: "hidden" }}>
        <SectionHeader
          section="explanation"
          icon={BookOpen}
          title="Explanation"
          color="#3b82f6"
        />
        <AnimatePresence>
          {expandedSections.has("explanation") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ padding: "16px" }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "#d0d0df",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {review.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions */}
      <div className="glass-panel-sm" style={{ overflow: "hidden" }}>
        <SectionHeader
          section="suggestions"
          icon={Lightbulb}
          title="Suggestions"
          color="#f59e0b"
        />
        <AnimatePresence>
          {expandedSections.has("suggestions") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ padding: "16px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {review.suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "10px",
                      padding: "10px 12px",
                      background: "rgba(245,158,11,0.05)",
                      borderRadius: "8px",
                      border: "1px solid rgba(245,158,11,0.08)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#f59e0b",
                        minWidth: "20px",
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "#d0d0df",
                        lineHeight: 1.5,
                      }}
                    >
                      {suggestion}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Score Card */}
      {review.score && (
        <ScoreCard
          score={review.score}
          ruleFlags={review.ruleFlags}
          expanded={expandedSections.has("score")}
          onToggle={() => toggleSection("score")}
        />
      )}
    </motion.div>
  );
}
