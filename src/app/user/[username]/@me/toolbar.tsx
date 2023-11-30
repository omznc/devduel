"use client";

import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { signOut } from "next-auth/react";
import { BiCog } from "react-icons/bi";
import { PiAtDuotone, PiUserCircleMinusDuotone } from "react-icons/pi";

export default function Toolbar() {
	return (
		<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
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
		</div>
	);
}
