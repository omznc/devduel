"use client";

import { deleteSubmission } from "@/src/actions/submission.ts";
import { RoundButton } from "@components/buttons.tsx";
import { usePathname, useRouter } from "next/navigation";
import { PiTrashDuotone } from "react-icons/pi";
import { toast } from "sonner";

type DeleteSubmissionButtonProps = {
	id: string;
};
export default function DeleteSubmissionButton({ id }: DeleteSubmissionButtonProps) {
	const path = usePathname();
	return (
		<RoundButton
			onClick={() => {
				toast.promise(deleteSubmission(id), {
					loading: "Deleting...",
					success: () => {
						// I reload because the image doesn't disappear otherwise.
						// TODO: Fix
						if (path === "/submit") {
							window.location.reload();
						}
						toast.dismiss("submit");
						return "Deleted!";
					},
					error: () => "Error",
				});
			}}
			confirmClick={true}
		>
			<PiTrashDuotone />
			Delete
		</RoundButton>
	);
}
