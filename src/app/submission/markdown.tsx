import { Submission } from "@prisma/client";
import { remark } from "remark";
import html from "remark-html";
import "@app/markdown.css";

interface MarkdownProps {
	submission: Submission;
}

export default function Markdown({ submission }: MarkdownProps) {
	const processed = remark()
		.use(html)
		.processSync(submission?.description ?? "")
		.toString();

	return (
		<div
			className="markdown-body border-normal z-20 h-full w-full max-w-4xl rounded-lg rounded-t-none p-4"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: We trust the markdown
			dangerouslySetInnerHTML={{ __html: processed }}
		/>
	);
}
