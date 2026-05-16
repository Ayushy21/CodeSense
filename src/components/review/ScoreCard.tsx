"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { useState } from "react";

interface ScoreCardProps {
  score: {
    accuracy: number;
    clarity: number;
    completeness: number;
    hallucinationRisk: number;
    overall: number;
    reasoning: string;
  };
  ruleFlags: {
    id: string;
    label: string;
    severity: "warning" | "error" | "info";
    passed: boolean;
  }[];
  expanded: boolean;
  onToggle: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 8) return "#22c55e";
  if (score >= 5) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Very Good";
  if (score >= 6) return "Good";
  if (score >= 4) return "Fair";
  return "Poor";
}

function ScoreRing({
  value,
  label,
  delay = 0,
  invert = false,
}: {
  value: number;
  label: string;
  delay?: number;
  invert?: boolean;
}) {
  const displayValue = invert ? 10 - value : value;
  const color = getScoreColor(invert ? displayValue : value);
  const circumference = 2 * Math.PI * 32;
  const progress = (value / 10) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={{ position: "relative", width: "76px", height: "76px" }}>
        <svg width="76" height="76" viewBox="0 0 76 76">
          {/* Background ring */}
          <circle
            cx="38"
            cy="38"
            r="32"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="5"
          />
          {/* Progress ring */}
          <motion.circle
            cx="38"
            cy="38"
            r="32"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "38px 38px",
              filter: `drop-shadow(0 0 4px ${color}60)`,
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {value}
          </motion.span>
        </div>
      </div>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 500,
          color: "#a0a0b5",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export default function ScoreCard({
  score,
  ruleFlags,
  expanded,
  onToggle,
}: ScoreCardProps) {
  const [showReasoning, setShowReasoning] = useState(false);
  const overallColor = getScoreColor(score.overall);

  return (
    <div className="glass-panel-sm" style={{ overflow: "hidden" }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderBottom: expanded
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
              background: `${overallColor}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield size={14} color={overallColor} />
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#f0f0f5",
              letterSpacing: "0.3px",
            }}
          >
            Quality Score
          </span>
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: overallColor,
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {score.overall}/10
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: overallColor,
              opacity: 0.8,
            }}
          >
            {getScoreLabel(score.overall)}
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={14} color="#6b6b80" />
        ) : (
          <ChevronDown size={14} color="#6b6b80" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ padding: "20px 16px" }}
          >
            {/* Overall Score Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  padding: "12px 28px",
                  borderRadius: "16px",
                  background: `${overallColor}12`,
                  border: `2px solid ${overallColor}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: `0 0 30px ${overallColor}15`,
                }}
              >
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    color: overallColor,
                    fontFamily: '"JetBrains Mono", monospace',
                  }}
                >
                  {score.overall}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#f0f0f5",
                    }}
                  >
                    {getScoreLabel(score.overall)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6b6b80" }}>
                    Overall Quality
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Score Rings */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "16px",
                marginBottom: "20px",
              }}
            >
              <ScoreRing
                value={score.accuracy}
                label="Accuracy"
                delay={0}
              />
              <ScoreRing value={score.clarity} label="Clarity" delay={0.1} />
              <ScoreRing
                value={score.completeness}
                label="Completeness"
                delay={0.2}
              />
              <ScoreRing
                value={score.hallucinationRisk}
                label="Hallucination Risk"
                delay={0.3}
                invert
              />
            </div>

            {/* Rule-based Flags */}
            {ruleFlags && ruleFlags.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#6b6b80",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "8px",
                  }}
                >
                  Automated Checks
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {ruleFlags.map((flag) => {
                    const Icon = flag.passed
                      ? CheckCircle
                      : flag.severity === "error"
                        ? XCircle
                        : AlertTriangle;
                    const color = flag.passed
                      ? "#22c55e"
                      : flag.severity === "error"
                        ? "#ef4444"
                        : "#f59e0b";
                    return (
                      <div
                        key={flag.id}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: 500,
                          color,
                          background: `${color}10`,
                          border: `1px solid ${color}20`,
                        }}
                      >
                        <Icon size={12} />
                        {flag.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evaluator Reasoning */}
            {score.reasoning && (
              <div>
                <button
                  onClick={() => setShowReasoning(!showReasoning)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#6b6b80",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Info size={12} />
                  Evaluator Reasoning
                  {showReasoning ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                </button>
                <AnimatePresence>
                  {showReasoning && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#a0a0b5",
                        lineHeight: 1.6,
                        padding: "10px 12px",
                        background: "rgba(255,255,255,0.02)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {score.reasoning}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
