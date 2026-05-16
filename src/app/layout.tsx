import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeSense — AI Code Review & Debugging Agent",
  description:
    "Paste broken or messy code and get AI-powered diagnosis, fixes, explanations, and quality scores. Built with Claude AI evaluation pipeline.",
  keywords: [
    "code review",
    "AI debugging",
    "code analysis",
    "Claude AI",
    "code quality",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#22c55e",
          colorBackground: "#13131a",
          colorText: "#f0f0f5",
          colorTextSecondary: "#a0a0b5",
          colorInputBackground: "#1a1a25",
          colorInputText: "#f0f0f5",
          borderRadius: "12px",
        },
      }}
    >
      <html lang="en" className="dark h-full antialiased">
        <body
          className="min-h-full flex flex-col"
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            background: "#0c0c0f",
          }}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
