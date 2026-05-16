import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export interface CodeReviewResult {
  diagnosis: string;
  fixedCode: string;
  explanation: string;
  suggestions: string[];
  lineReferences: { line: number; issue: string }[];
}

export interface EvaluationResult {
  accuracy: number;
  clarity: number;
  completeness: number;
  hallucinationRisk: number;
  overall: number;
  reasoning: string;
}

/**
 * Runs code review via Gemini — acts as a senior engineer diagnosing issues.
 */
export async function runCodeReview(
  code: string,
  language: string
): Promise<CodeReviewResult> {
  const systemInstruction = `You are a senior software engineer performing a thorough code review.
Analyze the provided ${language} code for bugs, logic errors, performance issues, and bad practices.

Rules:
- diagnosis must reference specific line numbers where bugs occur
- fixedCode must be the COMPLETE corrected code, not just the changed lines
- explanation should be understandable by a junior developer
- suggestions should go beyond just the fix — recommend best practices
- lineReferences must map each buggy line to its specific issue`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: {
            type: Type.STRING,
            description: "A clear description of what's wrong with the code",
          },
          fixedCode: {
            type: Type.STRING,
            description: "The corrected version of the full code",
          },
          explanation: {
            type: Type.STRING,
            description: "Plain English explanation of why the bug happened and how the fix works",
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of actionable suggestions or best practices",
          },
          lineReferences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                line: { type: Type.INTEGER },
                issue: { type: Type.STRING },
              },
              required: ["line", "issue"],
            },
          },
        },
        required: [
          "diagnosis",
          "fixedCode",
          "explanation",
          "suggestions",
          "lineReferences",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to get response from Gemini");
  }

  const parsed = JSON.parse(response.text) as CodeReviewResult;

  return {
    diagnosis: parsed.diagnosis,
    fixedCode: parsed.fixedCode,
    explanation: parsed.explanation,
    suggestions: parsed.suggestions || [],
    lineReferences: parsed.lineReferences || [],
  };
}

/**
 * Runs evaluation via Gemini — LLM-as-judge scoring the review quality.
 */
export async function runEvaluation(
  originalCode: string,
  language: string,
  reviewOutput: CodeReviewResult
): Promise<EvaluationResult> {
  const systemInstruction = `You are an expert AI evaluator. Your job is to score the quality of a code review response.

You will receive:
1. The original code that was reviewed
2. The code review output (diagnosis, fix, explanation, suggestions)

Score each metric from 0 to 10:
- accuracy: Did it correctly identify the real bugs? (not imagined ones)
- clarity: Is the explanation easy to understand for a junior developer?
- completeness: Did it catch ALL the issues, not just one?
- hallucinationRisk: Did it make up issues that don't exist? (0 = hallucinated everything, 10 = no hallucinations, completely accurate)
- overall: Your holistic assessment of the review quality`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Evaluate this code review:

ORIGINAL ${language} CODE:
\`\`\`${language}
${originalCode}
\`\`\`

CODE REVIEW OUTPUT:
${JSON.stringify(reviewOutput, null, 2)}`,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          accuracy: { type: Type.INTEGER },
          clarity: { type: Type.INTEGER },
          completeness: { type: Type.INTEGER },
          hallucinationRisk: { type: Type.INTEGER },
          overall: { type: Type.INTEGER },
          reasoning: {
            type: Type.STRING,
            description: "Brief explanation of your scoring decisions",
          },
        },
        required: [
          "accuracy",
          "clarity",
          "completeness",
          "hallucinationRisk",
          "overall",
          "reasoning",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to get evaluation from Gemini");
  }

  const parsed = JSON.parse(response.text) as EvaluationResult;

  return {
    accuracy: Math.min(10, Math.max(0, parsed.accuracy || 0)),
    clarity: Math.min(10, Math.max(0, parsed.clarity || 0)),
    completeness: Math.min(10, Math.max(0, parsed.completeness || 0)),
    hallucinationRisk: Math.min(
      10,
      Math.max(0, parsed.hallucinationRisk || 0)
    ),
    overall: Math.min(10, Math.max(0, parsed.overall || 0)),
    reasoning: parsed.reasoning || "No reasoning provided",
  };
}
