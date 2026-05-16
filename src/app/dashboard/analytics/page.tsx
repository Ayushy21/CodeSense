"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Target, Zap, Bug } from "lucide-react";

interface SessionData {
  id: string;
  language: string;
  rawCode: string;
  createdAt: string;
  review: {
    id: string;
    diagnosis: string;
    scoreBreakdown: {
      accuracy: number;
      clarity: number;
      completeness: number;
      hallucinationRisk: number;
      overall: number;
    } | null;
  } | null;
}

const CHART_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1a1a25",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
      }}
    >
      <p style={{ color: "#a0a0b5", marginBottom: "4px" }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: "#f0f0f5", fontWeight: 600 }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchSessions();
  }, []);

  // Prepare chart data
  const reviewedSessions = sessions.filter((s) => s.review?.scoreBreakdown);

  // Score over time
  const scoreOverTime = reviewedSessions
    .slice()
    .reverse()
    .map((s, i) => ({
      name: `#${i + 1}`,
      date: new Date(s.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      overall: s.review?.scoreBreakdown?.overall || 0,
      accuracy: s.review?.scoreBreakdown?.accuracy || 0,
      clarity: s.review?.scoreBreakdown?.clarity || 0,
    }));

  // Score by language
  const languageGroups: Record<string, number[]> = {};
  reviewedSessions.forEach((s) => {
    const lang = s.language;
    if (!languageGroups[lang]) languageGroups[lang] = [];
    languageGroups[lang].push(s.review?.scoreBreakdown?.overall || 0);
  });
  const scoreByLanguage = Object.entries(languageGroups).map(
    ([lang, scores]) => ({
      language: lang.charAt(0).toUpperCase() + lang.slice(1),
      avgScore: Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)),
      count: scores.length,
    })
  );

  // Pass/fail per metric
  const metricPassFail = [
    {
      metric: "Accuracy",
      pass: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.accuracy || 0) >= 7).length,
      fail: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.accuracy || 0) < 7).length,
    },
    {
      metric: "Clarity",
      pass: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.clarity || 0) >= 7).length,
      fail: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.clarity || 0) < 7).length,
    },
    {
      metric: "Completeness",
      pass: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.completeness || 0) >= 7).length,
      fail: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.completeness || 0) < 7).length,
    },
    {
      metric: "Low Hallucination",
      pass: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.hallucinationRisk || 0) >= 7).length,
      fail: reviewedSessions.filter((s) => (s.review?.scoreBreakdown?.hallucinationRisk || 0) < 7).length,
    },
  ];

  // Language distribution pie
  const languageDistribution = Object.entries(languageGroups).map(
    ([lang, scores], i) => ({
      name: lang.charAt(0).toUpperCase() + lang.slice(1),
      value: scores.length,
      color: CHART_COLORS[i % CHART_COLORS.length],
    })
  );

  // Bug type keywords
  const bugKeywords: Record<string, string[]> = {
    "Off-by-one": ["off-by-one", "index", "range", "bounds", "boundary"],
    "Async/Await": ["async", "await", "promise", "fetch"],
    "Memory": ["memory", "leak", "delete", "free", "allocation"],
    "Type Error": ["type", "undefined", "null", "NaN"],
    "Logic Error": ["logic", "condition", "comparison", "operator"],
    "Other": [],
  };

  const bugTypeCounts: Record<string, number> = {};
  Object.keys(bugKeywords).forEach((k) => (bugTypeCounts[k] = 0));
  
  reviewedSessions.forEach((s) => {
    const diag = (s.review?.diagnosis || "").toLowerCase();
    let matched = false;
    for (const [type, keywords] of Object.entries(bugKeywords)) {
      if (type === "Other") continue;
      if (keywords.some((kw) => diag.includes(kw))) {
        bugTypeCounts[type] = (bugTypeCounts[type] || 0) + 1;
        matched = true;
        break;
      }
    }
    if (!matched) bugTypeCounts["Other"] = (bugTypeCounts["Other"] || 0) + 1;
  });

  const bugTypeData = Object.entries(bugTypeCounts)
    .filter(([, count]) => count > 0)
    .map(([type, count], i) => ({
      type,
      count,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

  // Stats
  const totalReviews = reviewedSessions.length;
  const avgScore =
    totalReviews > 0
      ? (
          reviewedSessions.reduce(
            (acc, s) => acc + (s.review?.scoreBreakdown?.overall || 0),
            0
          ) / totalReviews
        ).toFixed(1)
      : "—";
  const highScoreCount = reviewedSessions.filter(
    (s) => (s.review?.scoreBreakdown?.overall || 0) >= 8
  ).length;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  if (totalReviews === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: "60px", textAlign: "center" }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "rgba(59,130,246,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <TrendingUp size={32} color="#3b82f6" />
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#f0f0f5", marginBottom: "8px" }}>
          No analytics data yet
        </h2>
        <p style={{ color: "#a0a0b5", fontSize: "14px" }}>
          Complete some code reviews to see your analytics here.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#f0f0f5", marginBottom: "4px" }}>
          Analytics
        </h1>
        <p style={{ color: "#a0a0b5", fontSize: "14px" }}>
          Track your code review quality over time
        </p>
      </div>

      {/* Stat Cards */}
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
          { label: "Total Reviews", value: totalReviews, icon: Target, color: "#3b82f6" },
          { label: "Avg Score", value: avgScore, icon: TrendingUp, color: "#22c55e" },
          { label: "High Scores (≥8)", value: highScoreCount, icon: Zap, color: "#f59e0b" },
          {
            label: "Languages",
            value: Object.keys(languageGroups).length,
            icon: Bug,
            color: "#8b5cf6",
          },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel-sm" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
                <div style={{ fontSize: "22px", fontWeight: 700, color: "#f0f0f5" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "12px", color: "#6b6b80", fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Score Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel-sm"
          style={{ padding: "24px" }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "20px",
            }}
          >
            Score Over Time
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={scoreOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                stroke="#6b6b80"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#6b6b80"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="overall"
                name="Overall"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: "#22c55e", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy"
                stroke="#3b82f6"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Score by Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel-sm"
          style={{ padding: "24px" }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "20px",
            }}
          >
            Average Score by Language
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreByLanguage}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="language"
                stroke="#6b6b80"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 10]}
                stroke="#6b6b80"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgScore" name="Avg Score" radius={[4, 4, 0, 0]}>
                {scoreByLanguage.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pass/Fail per Metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel-sm"
          style={{ padding: "24px" }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "20px",
            }}
          >
            Pass/Fail per Metric (≥7 = Pass)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={metricPassFail} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" stroke="#6b6b80" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="metric"
                stroke="#6b6b80"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pass" name="Pass" fill="#22c55e" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="fail" name="Fail" fill="#ef4444" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bug Type Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel-sm"
          style={{ padding: "24px" }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#f0f0f5",
              marginBottom: "20px",
            }}
          >
            Bug Type Distribution
          </h3>
          {bugTypeData.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={bugTypeData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={0}
                  >
                    {bugTypeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                {bugTypeData.map((entry) => (
                  <div
                    key={entry.type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "3px",
                        background: entry.color,
                      }}
                    />
                    <span style={{ color: "#a0a0b5", flex: 1 }}>{entry.type}</span>
                    <span style={{ color: "#f0f0f5", fontWeight: 600 }}>{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ color: "#6b6b80", fontSize: "13px", textAlign: "center", padding: "40px" }}>
              No bug data available yet
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
