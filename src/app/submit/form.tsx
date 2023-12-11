"use client";

import {
	createSubmission,
	getSignedUploadURL,
} from "@/src/actions/submission.ts";
import { submitFormSchema, submitFormSchemaType } from "@app/submit/schema.ts";
import { SubmitFormButton } from "@components/buttons.tsx";
import { imageConfig, validSources } from "@config";
import { cn } from "@lib/utils.ts";
import { Submission } from "@prisma/client";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import {
	PiArrowUpRightDuotone,
	PiCircleDashedDuotone,
	PiTrashDuotone,
} from "react-icons/pi";
import rehypeSanitize from "rehype-sanitize";
import Link from "next/link";
import { ZodError } from "zod";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
	ssr: false,
	loading: () => (
		<div className="flex w-full items-center justify-center">
			<PiCircleDashedDuotone className="h-24 w-24 animate-spin" />
		</div>
	),
});

export default function Form({
	submission,
}: {
	submission: Submission | null;
}) {
	const [data, setData] = useState<submitFormSchemaType>({
		title: submission?.title || "",
		description: submission?.description || "# My amazing submission",
		shortDescription: submission?.shortDescription || "",
		image: submission?.image || "",
		website: submission?.website || "",
		source: submission?.source || "",
	});
	const [image, setImage] = useState<File | null>(null);

	const [mounted, setMounted] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return;

	return (
		<>
			<form className="flex w-full flex-col gap-4 md:flex-row">
				<div className="flex h-full flex-col gap-2">
					<label htmlFor="cover">{`Cover Image (${
						imageConfig.maxSize / 1000000
					}MB max)`}</label>
					<Dropzone
						onDrop={(files) => {
							if (files.length > 1) {
								toast.error("Only one image allowed.");
								return;
							}
							if (files[0].size > imageConfig.maxSize) {
								toast.error(
									`Image too large. Max size is ${
										imageConfig.maxSize / 1000000
									}MB.`,
								);
								return;
							}
							setImage(files[0]);
						}}
					>
						{image && (
							<span
								className="group relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-sm text-center transition-all"
								onClick={(e) => {
									console.log("remove image");
									e.preventDefault();
									e.stopPropagation();
									setImage(null);
								}}
							>
								<Image
									src={URL.createObjectURL(image)}
									width={200}
									height={200}
									alt="Preview"
									className="aspect-square z-20 h-[300px] w-[300px] fade-in rounded-sm object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter"
								/>
								<div className="absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100">
									<PiTrashDuotone className="h-12 w-12" />
									<span className="text-2xl">{"Remove"}</span>
								</div>
							</span>
						)}
						{!image && (
							<>
								{data.image && (
									<span
										className="group relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-sm text-center transition-all"
										onClick={(e) => {
											console.log("remove image");
											e.preventDefault();
											e.stopPropagation();
											setData((data) => ({
												...data,
												image: "",
											}));
										}}
									>
										<Image
											src={data.image}
											width={200}
											height={200}
											alt="Preview"
											className="aspect-square z-20 h-[300px] w-[300px] fade-in rounded-sm object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter"
										/>
										<div className="absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100">
											<PiTrashDuotone className="h-12 w-12" />
											<span className="text-2xl">{"Remove"}</span>
										</div>
									</span>
								)}
								{!data.image && (
									<span className="flex h-[300px] w-[300px] items-center justify-center text-center transition-all">
										{"Drop it like it's hot... or just click."}
									</span>
								)}
							</>
						)}
					</Dropzone>
				</div>
				<div className="flex w-full flex-col justify-start gap-4">
					<div className="flex w-full flex-col gap-2">
						<label htmlFor="title">{`Title (${data.title.length}/50)`}</label>
						{submission && (
							<span className="text-sm text-gray-500">
								The URL of{" "}
								<Link
									className={"underline"}
									href={`/submission/${submission.slug}`}
									target="_blank"
								>
									your submission
									<PiArrowUpRightDuotone className="ml-1 inline" />
								</Link>{" "}
								will not change
							</span>
						)}
						<input
							type="text"
							id="title"
							className="border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white"
							onChange={(e) => {
								e.target.value = e.target.value.slice(0, 50);
								setData((data) => ({
									...data,
									title: e.target.value,
								}));
							}}
							defaultValue={submission?.title}
						/>
					</div>
					<div className="flex w-full flex-col gap-2">
						<label htmlFor="website">{"Website"}</label>
						<input
							type="website"
							id="website"
							className="border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white"
							onChange={(e) =>
								setData((data) => ({
									...data,
									website: e.target.value,
								}))
							}
							defaultValue={submission?.website}
						/>
					</div>
					<div className="flex w-full flex-col gap-2">
						<label htmlFor="short-description">
							{`Short Description (${data.shortDescription.length}/100)`}
						</label>
						<input
							type="short-description"
							id="short-description"
							className="border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white"
							onChange={(e) => {
								e.target.value = e.target.value.slice(0, 100);
								setData((data) => ({
									...data,
									shortDescription: e.target.value,
								}));
							}}
							defaultValue={submission?.shortDescription}
						/>
					</div>
					<div className="flex w-full flex-col gap-2">
						<label htmlFor="source">{"Source Code (optional)"}</label>
						<span className="text-sm text-gray-500">
							{`Available: ${validSources
								.map((source) => source.substring(8))
								.join(", ")}`}
						</span>
						<input
							type="text"
							id="source"
							className="border-normal rounded-sm bg-white p-2 dark:bg-black dark:text-white"
							onChange={(e) =>
								setData((data) => ({
									...data,
									source: e.target.value,
								}))
							}
							defaultValue={submission?.source || ""}
						/>
					</div>
				</div>
			</form>
			<div
				className="z-20 flex w-full max-w-4xl flex-col gap-4"
				data-color-mode={theme}
			>
				<label htmlFor="description">{`Description (${
					data.description?.length ?? 0
				}/10000)`}</label>
				<span className="text-md -mt-2 text-gray-500">
					{
						"Markdown is supported, HTML is not. You can use external images as well."
					}
				</span>

				<MDEditor
					height={200}
					onChange={(value) => {
						value = value?.slice(0, 10000);
						setData((data) => ({
							...data,
							description: value || "",
						}));
					}}
					value={data.description ?? submission?.description ?? ""}
					className="editor rounded-sm"
					data-theme={theme}
					previewOptions={{
						rehypePlugins: [[rehypeSanitize]],
					}}
				/>
				<SubmitFormButton
					onClick={async () => {
						toast.promise(
							(async () => {
								const formData = new FormData();
								formData.append("title", data.title);
								formData.append("description", data.description);
								formData.append("shortDescription", data.shortDescription);
								formData.append("website", data.website);
								if (data.source) formData.append("source", data.source);

								if (image) {
									console.log("uploading image");
									const signedUrl = await getSignedUploadURL(
										image.type,
										image.size,
									);
									const resp = await fetch(signedUrl, {
										method: "PUT",
										body: image,
										headers: {
											"Content-Type": image.type,
											"Content-Length": image.size.toString(),
										},
									})
										.then((resp) => resp.ok)
										.catch(() => false);

									if (!resp) {
										toast.error("Failed to upload image.");
										return;
									}

									formData.append("image", signedUrl.split("?")[0]);
								} else if (data.image) {
									formData.append("image", data.image);
								} else {
									toast.error("No image provided.");
									return;
								}

								// If nothing changed, don't submit
								if (
									submission?.title === data.title &&
									submission?.description === data.description &&
									submission?.shortDescription === data.shortDescription &&
									submission?.website === data.website &&
									submission?.source === data.source &&
									submission?.image === data.image
								) {
									throw new Error("No changes");
								}

								try {
									submitFormSchema.parse({
										title: formData.get("title"),
										description: formData.get("description"),
										shortDescription: formData.get("shortDescription"),
										image: formData.get("image"),
										website: formData.get("website"),
										source: formData.get("source"),
									});
								} catch (e: any) {
									throw new Error(
										e.errors.map((err: any) => err.message).join("\n"),
									);
								}

								await createSubmission(formData);
							})(),
							{
								loading: submission?.id ? "Updating..." : "Submitting...",
								success: () => {
									window?.scrollTo({
										top: 0,
										behavior: "smooth",
									});
									return submission?.id ? "Updated!" : "Submitted!";
								},
								error: (e) => e?.message || "Failed",
							},
						);
					}}
				>
					{submission?.id ? "Update" : "Submit"}
				</SubmitFormButton>
			</div>
		</>
	);
}

type DropzoneProps = {
	onDrop?: (_: File[]) => void;
	children: ReactNode;
};
const Dropzone = ({ onDrop, children }: DropzoneProps) => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/png": [".png"],
			"image/jpeg": [".jpeg", ".jpg"],
			"image/gif": [".gif"],
			"image/webp": [".webp"],
		},
	});

	return (
		<div
			{...getRootProps()}
			className={cn(
				"border-normal flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-black bg-opacity-10 p-4 text-black transition-all dark:bg-white dark:bg-opacity-10 dark:text-white md:max-w-fit",
				{
					"p-8": isDragActive,
				},
			)}
		>
			<input {...getInputProps()} />
			{children}
		</div>
	);
};
