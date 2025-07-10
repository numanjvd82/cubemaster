import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/signin");
  }

  return session;
}

export async function getOptionalAuth() {
  return await getAuthSession();
}
