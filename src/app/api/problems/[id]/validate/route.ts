import { NextResponse } from "next/server";
import { getCurrentUser, isAuthConfigured } from "@/lib/auth";
import { getLiveProblemBySlug } from "@/lib/ingestion";
import { getPrisma } from "@/lib/prisma";
import type { ValidationState } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const problem = await getLiveProblemBySlug(id);

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  if (isAuthConfigured()) {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to validate this problem." },
        { status: 401 },
      );
    }

    const prisma = getPrisma();

    await prisma.problemValidation.upsert({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId: problem.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        problemId: problem.id,
        source: "explora",
      },
    });

    const databaseValidationCount = await prisma.problemValidation.count({
      where: { problemId: problem.id },
    });

    return NextResponse.json(
      {
        problemId: problem.id,
        userHasValidated: true,
        validationCount: problem.validationCount + databaseValidationCount,
        threshold: 50,
      } satisfies ValidationState,
      { status: 201 },
    );
  }

  const state: ValidationState = {
    problemId: problem.id,
    userHasValidated: true,
    validationCount: problem.validationCount + 1,
    threshold: 50,
  };

  return NextResponse.json(state, { status: 201 });
}
