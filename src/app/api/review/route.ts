import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { runCodeReview, runEvaluation } from "@/lib/gemini";
import { runRuleBasedChecks } from "@/lib/evaluator";
import { NextResponse } from "next/server";

// POST /api/review — Main endpoint: run code review + evaluation + save to DB
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, language, sessionId } = await req.json();

    if (!code || !language || !sessionId) {
      return NextResponse.json(
        { error: "Code, language, and sessionId are required" },
        { status: 400 }
      );
    }

    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Step 1: Run code review via Claude
    const reviewResult = await runCodeReview(code, language);

    // Step 2: Run evaluation via Claude (LLM-as-judge)
    const evaluationResult = await runEvaluation(code, language, reviewResult);

    // Step 3: Run rule-based checks
    const ruleFlags = runRuleBasedChecks(code, reviewResult);

    // Step 4: Save review to DB
    const review = await prisma.review.create({
      data: {
        sessionId,
        diagnosis: reviewResult.diagnosis,
        fixedCode: reviewResult.fixedCode,
        explanation: reviewResult.explanation,
        suggestions: reviewResult.suggestions,
        lineReferences: reviewResult.lineReferences,
        scoreBreakdown: {
          create: {
            accuracy: evaluationResult.accuracy,
            clarity: evaluationResult.clarity,
            completeness: evaluationResult.completeness,
            hallucinationRisk: evaluationResult.hallucinationRisk,
            overall: evaluationResult.overall,
            reasoning: evaluationResult.reasoning,
            ruleFlags: JSON.parse(JSON.stringify(ruleFlags)),
          },
        },
      },
      include: {
        scoreBreakdown: true,
      },
    });

    // Return full result to client
    return NextResponse.json({
      id: review.id,
      sessionId: review.sessionId,
      diagnosis: review.diagnosis,
      fixedCode: review.fixedCode,
      explanation: review.explanation,
      suggestions: review.suggestions,
      lineReferences: review.lineReferences,
      score: {
        accuracy: evaluationResult.accuracy,
        clarity: evaluationResult.clarity,
        completeness: evaluationResult.completeness,
        hallucinationRisk: evaluationResult.hallucinationRisk,
        overall: evaluationResult.overall,
        reasoning: evaluationResult.reasoning,
      },
      ruleFlags,
    });
  } catch (error) {
    console.error("Error running review:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to run review",
      },
      { status: 500 }
    );
  }
}
