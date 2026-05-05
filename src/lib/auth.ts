import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getPrisma } from "@/lib/prisma";

export const SESSION_COOKIE = "unsolved_session";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  plan: string;
};

type SessionPayload = {
  userId: string;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string) {
  return new SignJWT({ userId } satisfies SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAuthSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getAuthSecret());
  const userId = payload.userId;

  return typeof userId === "string" ? userId : null;
}

export async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token || !process.env.AUTH_SECRET || !process.env.DATABASE_URL) {
    return null;
  }

  try {
    const userId = await verifySessionToken(token);
    if (!userId) return null;

    const user = await getPrisma().user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}

export function isAuthConfigured() {
  return Boolean(process.env.DATABASE_URL && process.env.AUTH_SECRET);
}
