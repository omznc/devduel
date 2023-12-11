"use client";

import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { signOut } from "next-auth/react";
import { BiCog } from "react-icons/bi";
import { PiAtDuotone, PiUserCircleMinusDuotone } from "react-icons/pi";
import ActionBar from "@components/action-bar.tsx";

export default function Toolbar() {
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
			<RoundLink href={"/user/me/settings"}>
				<BiCog />
				{"settings"}
			</RoundLink>
		</ActionBar>
	);
}
