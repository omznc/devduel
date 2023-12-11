import { deleteSubmission } from "@/src/actions/submission.ts";
import { RoundButton, RoundLink } from "@components/buttons.tsx";
import { SubmissionEntry } from "@components/submission/submission-list.tsx";
import prisma from "@lib/prisma.ts";
import { isAuthorized } from "@lib/server-utils.ts";
import { getCurrentTask } from "@lib/task.ts";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import {
	PiCircleDashedDuotone,
	PiEyeDuotone,
	PiFolderDuotone,
	PiTrashDuotone,
} from "react-icons/pi";

const Form = dynamic(() => import("@app/submit/form.tsx"), {
	ssr: false,
	loading: () => (
		<div className="flex w-full items-center justify-center">
			<PiCircleDashedDuotone className="h-24 w-24 animate-spin" />
		</div>
	),
});

export default async function Page() {
	const session = await isAuthorized();
	const user = session?.user;
	if (!user) return redirect("/");

	const task = await getCurrentTask();
	const submission =
		task &&
		(await prisma.submission.findFirst({
			where: {
				taskId: task.id,
				userId: user.id,
			},
		}));

	let title = task ? `Ready? Let's go.` : "No task yet";
	title = submission ? "Editing" : title;
	title = task?.status === "VOTING" ? "Voting is open!" : title;

	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex h-full w-fit max-w-4xl flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]">
				<div className="flex w-full max-w-4xl flex-row flex-wrap items-center justify-center gap-4">
					<RoundLink href={`/task/${task?.slug}`}>
						Task: {task?.title}
					</RoundLink>
					{task?.status === "VOTING" && (
						<RoundLink href={"/explore"}>
							<PiEyeDuotone />
							{"Explore"}
						</RoundLink>
					)}
					{submission && (
						<>
							<RoundLink href={`/submission/${submission.slug}`}>
								<PiFolderDuotone />
								{"View"}
							</RoundLink>
							<RoundButton
								onClick={async () => {
									"use server";
									await deleteSubmission(submission.id);
								}}
							>
								<PiTrashDuotone />
								Delete
							</RoundButton>
						</>
					)}
				</div>
				<span className="fit-text w-full text-center transition-all">
					{title}
				</span>
				{task?.status === "OPEN" && (
					<Form submission={submission} key={submission?.id ?? "submit"} />
				)}
				{task?.status === "VOTING" && (
					<>
						<p className="text-center text-xl transition-all">
							{
								"It's the weekend! That means it's up to YOU to vote for this week's best submission."
							}
						</p>

						{submission && (
							<>
								<span className="w-full text-center text-4xl transition-all">
									Your submission
								</span>
								<SubmissionEntry submission={submission} />
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
}
