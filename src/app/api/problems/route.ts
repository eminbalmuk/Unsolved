import { NextResponse } from "next/server";
import { getLiveProblems } from "@/lib/ingestion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase().trim() ?? "";
  const sector = searchParams.get("sector") ?? "all";
  const sort = searchParams.get("sort") ?? "pain";
  const refresh = searchParams.get("refresh") === "1";
  const problems = await getLiveProblems({ refresh });

  let results = problems.filter((problem) => {
    const matchesSector =
      sector === "all" || problem.sector.toLowerCase() === sector.toLowerCase();
    const matchesQuery =
      !query ||
      [problem.title, problem.summary, problem.aiSummary, ...problem.tags]
        .join(" ")
        .toLowerCase()
        .includes(query);

    return matchesSector && matchesQuery;
  });

  results = results.sort((a, b) => {
    if (sort === "new") {
      return new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime();
    }

    if (sort === "validated") {
      return b.validationCount - a.validationCount;
    }

    return b.painScore - a.painScore;
  });

  return NextResponse.json({
    problems: results,
    refreshedAt: new Date().toISOString(),
    refreshMode: refresh ? "live" : "cached",
  });
}
