import prisma from "@lib/prisma.ts";
import { getServerSession } from "next-auth";
import "server-only";
import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";

export async function isAuthorized(admin = false) {
  const session = await getServerSession(authOptions);
  if (session && session.user) {
    if (!admin || (admin && session.user.admin)) {
      return session;
    }
  }
  return null;
}
