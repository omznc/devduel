import { RoundLink } from "@/src/components/buttons";

type PageProps = {
	searchParams: {
		error?: string;
	};
};
export default function Page({ searchParams }: PageProps) {
	return (
		<div className="flex h-full min-h-[calc(100dvh-6rem)] w-full flex-col items-center justify-start gap-4">
			<div className="flex h-full w-full flex-col items-center justify-start gap-4 font-bold transition-all md:min-w-[800px]">
				<h2 className="text-4xl text-center">
					{"That wasn't supposed to happen"}
				</h2>
				<p className="text-2xl text-center">
					{"There's been a problem, and we're on it."}
				</p>
				{searchParams.error && (
					<p className="text-center">{`Error code: ${searchParams.error}`}</p>
				)}
				<RoundLink href="/">Go Home</RoundLink>
			</div>
		</div>
	);
}
