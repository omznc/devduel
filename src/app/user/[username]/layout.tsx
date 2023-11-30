import { authOptions } from "@app/api/auth/[...nextauth]/authOptions.ts";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";

export default async function Layout({
	me,
	other,
	params,
}: {
	me: ReactNode;
	other: ReactNode;
	params: {
		username: string;
	};
}) {
	const session = await getServerSession(authOptions);
	if (!session) return <>{other}</>;

	const isSameUser = [session.user?.username, "me"].includes(params?.username);
	return <>{isSameUser ? me : other}</>;
}
