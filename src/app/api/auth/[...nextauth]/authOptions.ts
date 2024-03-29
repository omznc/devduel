import env from "@env";
import prisma from "@lib/prisma.ts";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
	// Required since I extended the PrismaClient type
	adapter: PrismaAdapter(prisma as unknown as PrismaClient),
	providers: [
		GithubProvider({
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		}),
	],
	secret: env.NEXTAUTH_SECRET,
	session: {
		strategy: "database",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async session({ session, user }) {
			if (session.user) {
				session.user = user;
			}
			return session;
		},
	},
	pages: {
		newUser: "/user/me/username",
		error: "/error",
	},
};
