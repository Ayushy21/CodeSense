"use client";

import { create } from "zustand";

export interface ReviewData {
  id: string;
  sessionId: string;
  diagnosis: string;
  fixedCode: string;
  explanation: string;
  suggestions: string[];
  lineReferences: { line: number; issue: string }[];
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
}

interface ReviewStore {
  code: string;
  language: string;
  isLoading: boolean;
  error: string | null;
  review: ReviewData | null;
  sessionId: string | null;

  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setSessionId: (id: string) => void;
  setReview: (review: ReviewData) => void;
  clearReview: () => void;
  submitReview: () => Promise<void>;
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  code: "",
  language: "python",
  isLoading: false,
  error: null,
  review: null,
  sessionId: null,

  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setSessionId: (id) => set({ sessionId: id }),
  setReview: (review) => set({ review }),
  clearReview: () => set({ review: null, error: null }),

  submitReview: async () => {
    const { code, language } = get();

    if (!code.trim()) {
      set({ error: "Please enter some code to analyze" });
      return;
    }

    set({ isLoading: true, error: null, review: null });

    try {
      // Step 1: Create a session
      const sessionRes = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to create session");
      }

      const session = await sessionRes.json();

      // Step 2: Run the review
      const reviewRes = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          sessionId: session.id,
        }),
      });

      if (!reviewRes.ok) {
        const errorData = await reviewRes.json();
        throw new Error(errorData.error || "Review failed");
      }

      const reviewData = await reviewRes.json();
      set({
        review: reviewData,
        sessionId: session.id,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An error occurred",
        isLoading: false,
      });
    }
  },
}));
