import { NextResponse } from "next/server";
import { getLiveProblemBySlug } from "@/lib/ingestion";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const problem = await getLiveProblemBySlug(id);

  if (!problem) {
    return NextResponse.json({ error: "Problem not found" }, { status: 404 });
  }

  return NextResponse.json({ problem });
}
