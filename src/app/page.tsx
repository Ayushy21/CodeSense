"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // If user is already signed in, redirect to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while checking auth (prevents flash)
  if (!isLoaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0c0c0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  // If signed in, show loading while redirect happens
  if (isSignedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0c0c0f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="spinner spinner-lg" />
        <p style={{ color: "#a0a0b5", fontSize: "14px" }}>
          Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c0c0f",
        overflow: "hidden",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        {/* Gradient Orbs */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* Nav */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "20px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
            <span style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0f5" }}>
              CodeSense
            </span>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href="/sign-in"
              className="btn-ghost"
              style={{ textDecoration: "none" }}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            textAlign: "center",
            maxWidth: "800px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "100px",
              marginBottom: "32px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#22c55e",
            }}
          >
            <Sparkles size={14} />
            Powered by Gemini AI Evaluation Pipeline
          </motion.div>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#f0f0f5" }}>Debug Your Code</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #22c55e, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              With AI Precision
            </span>
          </h1>

          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.7,
              color: "#a0a0b5",
              maxWidth: "600px",
              margin: "0 auto 40px",
            }}
          >
            Paste your code, get instant AI-powered diagnosis, fixes with diff
            views, plain English explanations, and a quality score for every
            review.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            <Link
              href="/sign-up"
              className="btn-primary"
              style={{
                textDecoration: "none",
                padding: "14px 32px",
                fontSize: "16px",
              }}
            >
              Start Reviewing
              <ChevronRight size={18} />
            </Link>
            <Link
              href="/sign-in"
              className="btn-secondary"
              style={{
                textDecoration: "none",
                padding: "14px 32px",
                fontSize: "16px",
              }}
            >
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Code Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            marginTop: "60px",
            width: "100%",
            maxWidth: "700px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: "24px",
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "13px",
              lineHeight: 1.8,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#ef4444",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#f59e0b",
                }}
              />
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#22c55e",
                }}
              />
            </div>
            <pre style={{ color: "#a0a0b5", margin: 0, overflow: "auto" }}>
              <code>
                <span style={{ color: "#8b5cf6" }}>def</span>{" "}
                <span style={{ color: "#22c55e" }}>find_max</span>(arr):
                {"\n"}
                {"    "}max_val = arr[<span style={{ color: "#f59e0b" }}>0</span>]
                {"\n"}
                {"    "}
                <span style={{ color: "#8b5cf6" }}>for</span> i{" "}
                <span style={{ color: "#8b5cf6" }}>in</span>{" "}
                <span style={{ color: "#22c55e" }}>range</span>(
                <span style={{ color: "#f59e0b" }}>1</span>,{" "}
                <span style={{ color: "#22c55e" }}>len</span>(arr){" "}
                <span style={{ color: "#ef4444" }}>+ 1</span>):
                {"  "}
                <span style={{ color: "#ef4444" }}>← bug here</span>
                {"\n"}
                {"        "}
                <span style={{ color: "#8b5cf6" }}>if</span> arr[i] {">"}{" "}
                max_val:{"\n"}
                {"            "}max_val = arr[i]{"\n"}
                {"    "}
                <span style={{ color: "#8b5cf6" }}>return</span> max_val
              </code>
            </pre>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div
        style={{
          padding: "100px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#f0f0f5",
              marginBottom: "16px",
            }}
          >
            How It Works
          </h2>
          <p style={{ color: "#a0a0b5", fontSize: "16px" }}>
            Two-layer AI evaluation — review + scoring in one click
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              icon: Zap,
              title: "Instant Diagnosis",
              desc: "Paste your code and get line-by-line bug detection with specific issue descriptions.",
              color: "#f59e0b",
            },
            {
              icon: Code2,
              title: "Smart Fixes",
              desc: "See the corrected code with a side-by-side diff view showing exactly what changed.",
              color: "#22c55e",
            },
            {
              icon: Shield,
              title: "Quality Scoring",
              desc: "Every review is scored by a second AI call — accuracy, clarity, completeness, and hallucination risk.",
              color: "#3b82f6",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              desc: "Track your review history with charts showing score trends and common bug patterns.",
              color: "#8b5cf6",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="card"
              style={{ cursor: "default" }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: `${feature.color}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <feature.icon size={22} color={feature.color} />
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#f0f0f5",
                  marginBottom: "8px",
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#a0a0b5", lineHeight: 1.6 }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          padding: "80px 24px",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#f0f0f5",
            marginBottom: "16px",
          }}
        >
          Ready to debug smarter?
        </h2>
        <p
          style={{
            color: "#a0a0b5",
            marginBottom: "32px",
            fontSize: "16px",
          }}
        >
          Start analyzing your code with AI-powered precision.
        </p>
        <Link
          href="/sign-up"
          className="btn-primary"
          style={{
            textDecoration: "none",
            padding: "14px 32px",
            fontSize: "16px",
          }}
        >
          Get Started Free
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
