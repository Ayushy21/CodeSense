"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/shared/Navbar";
import CodeEditor from "@/components/editor/CodeEditor";
import ReviewPanel from "@/components/review/ReviewPanel";
import { useReviewStore, ReviewData } from "@/store/useReviewStore";

interface SessionWithReview {
  id: string;
  language: string;
  rawCode: string;
  review?: {
    id: string;
    diagnosis: string;
    fixedCode: string;
    explanation: string;
    suggestions: string[];
    lineReferences: { line: number; issue: string }[];
    scoreBreakdown?: {
      accuracy: number;
      clarity: number;
      completeness: number;
      hallucinationRisk: number;
      overall: number;
      reasoning: string;
      ruleFlags: { id: string; label: string; severity: string; passed: boolean }[];
    };
  };
}

export default function ReviewPage() {
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";
  const [existingReview, setExistingReview] = useState<ReviewData | null>(null);
  const [existingCode, setExistingCode] = useState<string>("");
  const [existingLanguage, setExistingLanguage] = useState<string>("");
  const [loadingSession, setLoadingSession] = useState(!isNew);

  const { setCode, setLanguage, setSessionId } = useReviewStore();

  const loadSession = useCallback(async () => {
    if (isNew) return;
    
    try {
      const res = await fetch(`/api/sessions/${id}`);
      if (res.ok) {
        const session: SessionWithReview = await res.json();
        setExistingCode(session.rawCode);
        setExistingLanguage(session.language);
        setCode(session.rawCode);
        setLanguage(session.language);
        setSessionId(session.id);

        if (session.review) {
          const r = session.review;
          setExistingReview({
            id: r.id,
            sessionId: session.id,
            diagnosis: r.diagnosis,
            fixedCode: r.fixedCode,
            explanation: r.explanation,
            suggestions: r.suggestions as string[],
            lineReferences: r.lineReferences as { line: number; issue: string }[],
            score: r.scoreBreakdown
              ? {
                  accuracy: r.scoreBreakdown.accuracy,
                  clarity: r.scoreBreakdown.clarity,
                  completeness: r.scoreBreakdown.completeness,
                  hallucinationRisk: r.scoreBreakdown.hallucinationRisk,
                  overall: r.scoreBreakdown.overall,
                  reasoning: r.scoreBreakdown.reasoning,
                }
              : {
                  accuracy: 0,
                  clarity: 0,
                  completeness: 0,
                  hallucinationRisk: 0,
                  overall: 0,
                  reasoning: "",
                },
            ruleFlags: (r.scoreBreakdown?.ruleFlags || []) as ReviewData["ruleFlags"],
          });
        }
      }
    } catch (err) {
      console.error("Failed to load session:", err);
    } finally {
      setLoadingSession(false);
    }
  }, [id, isNew, setCode, setLanguage, setSessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (loadingSession) {
    return (
      <div style={{ minHeight: "100vh", background: "#0c0c0f" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 64px)",
          }}
        >
          <div className="spinner spinner-lg" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0f" }}>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        {/* Left Panel — Code Editor */}
        <div
          style={{
            borderRight: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CodeEditor
            initialCode={existingCode}
            initialLanguage={existingLanguage}
          />
        </div>

        {/* Right Panel — Review Output */}
        <div
          style={{
            overflow: "auto",
            background: "#0e0e13",
          }}
        >
          <ReviewPanel existingReview={existingReview} />
        </div>
      </motion.div>
    </div>
  );
}
