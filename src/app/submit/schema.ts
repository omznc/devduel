import { imageConfig, validSources } from "@config";
import { z } from "zod";

export const submitFormSchema = z.object({
	title: z.string().min(3).max(100),
	description: z.string().min(3).max(5000),
	shortDescription: z.string().min(3).max(100),
	image: z.string().url(),
	website: z.string().url(),
	source: z
		.string()
		.url()
		.refine((val: string) => {
			if (!val) return true;
			return validSources.some((source) => val.startsWith(source));
		})
		.optional(),
});

export type submitFormSchemaType = z.infer<typeof submitFormSchema>;
