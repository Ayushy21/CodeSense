import { CodeReviewResult } from "./gemini";

export interface RuleFlag {
  id: string;
  label: string;
  severity: "warning" | "error" | "info";
  passed: boolean;
}

/**
 * Rule-based checks that run alongside the LLM judge.
 * These catch obvious issues the LLM evaluation might miss.
 */
export function runRuleBasedChecks(
  originalCode: string,
  review: CodeReviewResult
): RuleFlag[] {
  const flags: RuleFlag[] = [];

  // Check 1: Did the response include line references?
  const hasLineRefs =
    review.lineReferences && review.lineReferences.length > 0;
  flags.push({
    id: "line-references",
    label: hasLineRefs
      ? "Line references included"
      : "⚠ No line references found",
    severity: hasLineRefs ? "info" : "warning",
    passed: hasLineRefs,
  });

  // Check 2: Did the fixed code actually change?
  const codeChanged = review.fixedCode.trim() !== originalCode.trim();
  flags.push({
    id: "code-changed",
    label: codeChanged
      ? "Fixed code differs from original"
      : "⚠ Fixed code identical to original",
    severity: codeChanged ? "info" : "error",
    passed: codeChanged,
  });

  // Check 3: Are suggestions non-empty?
  const hasSuggestions =
    review.suggestions &&
    review.suggestions.length > 0 &&
    review.suggestions.every((s) => s.trim().length > 0);
  flags.push({
    id: "suggestions-present",
    label: hasSuggestions
      ? "Suggestions provided"
      : "⚠ Missing or empty suggestions",
    severity: hasSuggestions ? "info" : "warning",
    passed: hasSuggestions,
  });

  // Check 4: Is the diagnosis non-trivial (more than 20 chars)?
  const hasSubstantialDiagnosis = review.diagnosis.trim().length > 20;
  flags.push({
    id: "substantial-diagnosis",
    label: hasSubstantialDiagnosis
      ? "Diagnosis is detailed"
      : "⚠ Diagnosis seems too brief",
    severity: hasSubstantialDiagnosis ? "info" : "warning",
    passed: hasSubstantialDiagnosis,
  });

  // Check 5: Fixed code length sanity check
  const originalLen = originalCode.trim().length;
  const fixedLen = review.fixedCode.trim().length;
  const lengthRatio = fixedLen / Math.max(originalLen, 1);
  const reasonableLength = lengthRatio > 0.3 && lengthRatio < 5;
  flags.push({
    id: "length-sanity",
    label: reasonableLength
      ? "Fixed code length is reasonable"
      : "⚠ Fixed code length seems suspicious",
    severity: reasonableLength ? "info" : "warning",
    passed: reasonableLength,
  });

  // Check 6: Explanation is present and substantial
  const hasExplanation = review.explanation.trim().length > 30;
  flags.push({
    id: "explanation-present",
    label: hasExplanation
      ? "Explanation is thorough"
      : "⚠ Explanation seems too short",
    severity: hasExplanation ? "info" : "warning",
    passed: hasExplanation,
  });

  return flags;
}
