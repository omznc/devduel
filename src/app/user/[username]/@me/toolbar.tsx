"use client";

import ActionBar from "@components/action-bar.tsx";
import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { signOut } from "next-auth/react";
import { PiAtDuotone, PiCopyDuotone, PiUserCircleMinusDuotone } from "react-icons/pi";
import { toast } from "sonner";

type ToolbarProps = {
	username: string;
};
export default function Toolbar({ username }: ToolbarProps) {
	return (
		<ActionBar>
			<RoundButton
				onClick={async () => {
					await signOut();
				}}
			>
				<PiUserCircleMinusDuotone />
				{"log out"}
			</RoundButton>

			<RoundLink href={"/user/me/username"}>
				<PiAtDuotone />
				{"set username"}
			</RoundLink>

			<RoundButton
				onClick={() => {
					const href = window.location.href;
					navigator.clipboard.writeText(href.replace("me", username));

					toast.info("Copied profile URL to clipboard!");
				}}
			>
				<PiCopyDuotone />
				{"copy profile link"}
			</RoundButton>
		</ActionBar>
	);
}
