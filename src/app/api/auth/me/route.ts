import { NextResponse } from "next/server";
import { getCurrentUser, isAuthConfigured } from "@/lib/auth";

export async function GET() {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { user: null, configured: false },
      { status: 200 },
    );
  }

  const user = await getCurrentUser();

  return NextResponse.json({ user, configured: true });
}
