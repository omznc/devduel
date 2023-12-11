import { cn } from "@lib/utils.ts";
import { Submission } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { default as MD } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
	submission: Submission;
}

export default function Markdown({ submission }: MarkdownProps) {
	return (
		<MD
			remarkPlugins={[remarkGfm]}
			components={{
				img: ({ ...props }) => {
					const { src } = props;
					// if (!src?.startsWith("https://i.imgur.com/"))
					// 	return (
					// 		<Link href={src ?? "#"} target={"_blank"}>
					// 			External Image
					// 		</Link>
					// 	);
					return (
						<Image
							src={src!}
							width={parseInt((props.width as string) ?? "1000")}
							height={parseInt((props.height as string) ?? "1000")}
							alt={(props.alt as string) ?? "Submission Image"}
							className="w-fit rounded-lg"
							unoptimized={true}
						/>
					);
				},
			}}
			className={cn(
				"markdown-body border-normal z-20 h-full w-full max-w-4xl rounded-lg p-4",
			)}
		>
			{submission?.description}
		</MD>
	);
}
