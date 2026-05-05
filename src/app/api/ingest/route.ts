import { NextResponse } from "next/server";
import { getLiveSignals } from "@/lib/ingestion";

export async function GET() {
  const signals = await getLiveSignals();
  const byPlatform = signals.reduce<Record<string, number>>((acc, signal) => {
    acc[signal.platform] = (acc[signal.platform] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    refreshedAt: new Date().toISOString(),
    signalCount: signals.length,
    platforms: byPlatform,
    signals: signals.slice(0, 12),
  });
}
