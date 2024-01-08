"use client";

import { RoundButton } from "@components/buttons.tsx";
import { deleteSubmission } from "@/src/actions/submission.ts";
import { PiTrashDuotone } from "react-icons/pi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteSubmissionButton({
	id,
}: {
	id: string;
}) {
	const router = useRouter();
	return (
		<RoundButton
			onClick={() => {
				// await deleteSubmission(id)
				toast.promise(deleteSubmission(id), {
					loading: "Deleting...",
					success: () => {
						router.refresh();
						return "Deleted!";
					},
					error: (e) => e?.message ?? "Error",
				});
			}}
			confirmClick={true}
		>
			<PiTrashDuotone />
			Delete
		</RoundButton>
	);
}
