"use client";

import { createSubmission } from "@/src/actions/submission.ts";
import { submitFormSchemaType } from "@app/submit/schema.ts";
import { SubmitFormButton } from "@components/buttons.tsx";
import { imageConfig } from "@config";
import { cn } from "@lib/utils.ts";
import { Submission } from "@prisma/client";
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { ReactNode, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { PiCircleDashedDuotone, PiTrashDuotone } from "react-icons/pi";
import rehypeSanitize from "rehype-sanitize";

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
		image: null,
		website: submission?.website || "",
		source: submission?.source || "",
	});

	const [mounted, setMounted] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return;

	console.log(submission);

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
							setData((data) => ({
								...data,
								image: files[0],
							}));
						}}
					>
						{!submission?.image && !data?.image && (
							<span className="flex h-[300px] w-[300px] items-center justify-center text-center transition-all">
								{"Drop it like it's hot... or just click."}
							</span>
						)}
						{!submission?.image && data.image && (
							<span
								className="group relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-sm text-center transition-all"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setData((data) => ({
										...data,
										image: new File([], ""),
									}));
								}}
							>
								<Image
									src={URL.createObjectURL(data.image)}
									width={200}
									height={200}
									alt="Preview"
									className="aspect-square h-[300px] w-[300px] rounded-sm object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter"
								/>
								<div className="absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100">
									<PiTrashDuotone className="h-12 w-12" />
									<span className="text-2xl">{"Remove"}</span>
								</div>
							</span>
						)}
						{submission?.image && (
							<span
								className="group relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden rounded-sm text-center transition-all"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setData((data) => ({
										...data,
										image: new File([], ""),
									}));
									submission.image = "";
								}}
							>
								<Image
									src={submission.image}
									id={"existing-image"}
									width={200}
									height={200}
									alt="Preview"
									className="aspect-square h-[300px] w-[300px] rounded-sm object-cover transition-all group-hover:scale-105 group-hover:blur-sm group-hover:brightness-50 group-hover:filter"
								/>
								<div className="absolute z-30 flex flex-col items-center justify-center text-white opacity-0 transition-all group-hover:opacity-100">
									<PiTrashDuotone className="h-12 w-12" />
									<span className="text-2xl">{"Remove"}</span>
								</div>
							</span>
						)}
					</Dropzone>
				</div>
				<div className="flex w-full flex-col justify-start gap-4">
					<div className="flex w-full flex-col gap-2">
						<label htmlFor="title">{`Title (${data.title.length}/50)`}</label>
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
						<label htmlFor="source">{"Source Code"}</label>
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
						const formData = new FormData();
						formData.append("title", data.title);
						formData.append("description", data.description);
						formData.append("shortDescription", data.shortDescription);
						formData.append("website", data.website);
						if (data.source) formData.append("source", data.source);
						formData.append("image", data.image);

						// Don't do anything if the user didn't change anything
						if (
							submission?.title === data.title &&
							submission?.description === data.description &&
							submission?.shortDescription === data.shortDescription &&
							submission?.website === data.website &&
							submission?.source === data.source &&
							submission?.image &&
							data.image.size === 0
						) {
							toast.success("Nothing to update.");
							return;
						}

						if (submission?.image) {
							// 	get the existing image as a file
							const existingImage = document.getElementById(
								"existing-image",
							) as HTMLImageElement;
							const response = await fetch(existingImage.src);
							const blob = await response.blob();
							formData.set(
								"image",
								new File([blob], "image", {
									type: blob.type,
								}),
							);
						}

						toast.promise(createSubmission(formData), {
							loading: submission?.id ? "Updating..." : "Submitting...",
							success: submission?.id ? "Updated!" : "Submitted!",
							error: (e) => {
								return e?.message ?? "Failed to submit.";
							},
						});
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
				`border-normal flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-black bg-opacity-10 p-4 text-black transition-all dark:bg-white dark:bg-opacity-10 dark:text-white md:max-w-fit`,
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
