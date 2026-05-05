import { NextResponse } from "next/server";
import { getLiveSignals } from "@/lib/ingestion";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get("refresh") === "1";
  const signals = await getLiveSignals({ refresh });
  const byPlatform = signals.reduce<Record<string, number>>((acc, signal) => {
    acc[signal.platform] = (acc[signal.platform] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    refreshedAt: new Date().toISOString(),
    refreshMode: refresh ? "live" : "cached",
    signalCount: signals.length,
    platforms: byPlatform,
    signals: signals.slice(0, 12),
  });
}
