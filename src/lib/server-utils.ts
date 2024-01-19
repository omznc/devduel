import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import { getServerSession } from "next-auth";
import "server-only";

export async function isAuthorized(admin = false) {
	const session = await getServerSession(authOptions);
	if (session?.user) {
		if (!admin || (admin && session.user.admin)) {
			return session;
		}
	}
	return null;
}
