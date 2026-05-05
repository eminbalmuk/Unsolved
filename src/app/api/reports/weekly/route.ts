import { NextResponse } from "next/server";
import { weeklyReport } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ report: weeklyReport });
}
