"use client";

import { DiffEditor } from "@monaco-editor/react";

interface DiffViewerProps {
  original: string;
  modified: string;
  language?: string;
}

export default function DiffViewer({
  original,
  modified,
  language = "python",
}: DiffViewerProps) {
  return (
    <div style={{ height: "300px", position: "relative" }}>
      <DiffEditor
        height="300px"
        language={language}
        original={original}
        modified={modified}
        theme="vs-dark"
        options={{
          readOnly: true,
          fontSize: 13,
          fontFamily: '"JetBrains Mono", monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderSideBySide: true,
          padding: { top: 12, bottom: 12 },
          lineNumbers: "on",
          glyphMargin: false,
          folding: false,
          renderOverviewRuler: false,
          diffWordWrap: "on",
        }}
      />
    </div>
  );
}
