import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@lib/prisma.ts";
import GithubProvider from "next-auth/providers/github";
import env from "@env";

export const authOptions: AuthOptions = {
	// @ts-ignore
	adapter: PrismaAdapter(prisma),
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
};
