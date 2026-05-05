import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { setSessionCookie } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.AUTH_SECRET) {
    return NextResponse.json(
      { error: "Auth is not configured. Fill DATABASE_URL and AUTH_SECRET in .env." },
      { status: 503 },
    );
  }

  const parsed = loginSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid email and password." },
      { status: 400 },
    );
  }

  const { email, password } = parsed.data;
  const user = await getPrisma().user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      plan: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json(
      { error: "Email or password is incorrect." },
      { status: 401 },
    );
  }

  await setSessionCookie(user.id);

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.plan,
  };

  return NextResponse.json({ user: safeUser });
}
