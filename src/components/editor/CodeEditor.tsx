"use client";

import { useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useReviewStore } from "@/store/useReviewStore";
import { Play, Loader2 } from "lucide-react";

const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

interface CodeEditorProps {
  initialCode?: string;
  initialLanguage?: string;
}

export default function CodeEditor({
  initialCode,
  initialLanguage,
}: CodeEditorProps) {
  const { code, language, isLoading, setCode, setLanguage, submitReview } =
    useReviewStore();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (initialCode) setCode(initialCode);
      if (initialLanguage) setLanguage(initialLanguage);
      initialized.current = true;
    }
  }, [initialCode, initialLanguage, setCode, setLanguage]);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const getMonacoLanguage = (lang: string): string => {
    const map: Record<string, string> = {
      python: "python",
      javascript: "javascript",
      typescript: "typescript",
      cpp: "cpp",
      java: "java",
      go: "go",
      rust: "rust",
    };
    return map[lang] || "plaintext";
  };

  const lineCount = code.split("\n").length;
  const charCount = code.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#0c0c0f",
      }}
    >
      {/* Editor Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "#101017",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: "#1a1a25",
              color: "#f0f0f5",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>

          <span
            style={{
              fontSize: "12px",
              color: "#6b6b80",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {lineCount} lines · {charCount} chars
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={submitReview}
          disabled={isLoading || !code.trim()}
          style={{
            padding: "8px 20px",
            fontSize: "13px",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={14} className="animate-spin" style={{ animation: "spin-slow 0.8s linear infinite" }} />
              Analyzing...
            </>
          ) : (
            <>
              <Play size={14} />
              Analyze Code
            </>
          )}
        </button>
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1, position: "relative" }}>
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(value) => setCode(value || "")}
          onMount={handleEditorMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: '"JetBrains Mono", monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            lineNumbers: "on",
            glyphMargin: true,
            folding: true,
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            renderLineHighlight: "line",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            contextmenu: true,
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
    </div>
  );
}
