import { validSources } from "@config";
import { z } from "zod";

export const submitFormSchema = z.object({
	title: z.string({
		description: "Title must be a string",
	}).min(3, {
		message: "Title must be at least 3 characters long",
	}).max(100, {
		message: "Title must be less than 100 characters long",
	}),
	description: z.string().min(3, { message: "Description must be at least 3 characters long" })
		.max(5000, { message: "Description must be less than 5000 characters long" }),
	shortDescription: z.string().min(3, { message: "Short description must be at least 3 characters long" })
		.max(100, { message: "Short description must be less than 100 characters long" }),
	image: z.string().url({ message: "Image field must be a valid URL" }),
	website: z.string().url({ message: "Website field must be a valid URL" }),
	source: z
		.string()
		.url({ message: "Source field must be a valid URL" })
		.refine((val: string) => {
			if (!val) return true;
			return validSources.some((source) => val.startsWith(source));
		}, { message: "Provided source URL is not in valid sources" })
		.optional()
		.nullable(),
});

export type submitFormSchemaType = z.infer<typeof submitFormSchema>;
