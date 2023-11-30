import { imageConfig, validSources } from "@config";
import { z } from "zod";

export const submitFormSchema = z.object({
	title: z.string().min(3).max(100),
	description: z.string().min(3).max(5000),
	shortDescription: z.string().min(3).max(100),
	image: z.any().refine((val: any) => {
		if (!val) return true;
		if (val.size > imageConfig.maxSize) return false;
		if (!imageConfig.formats.includes(val.type)) return false;
		return true;
	}),
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
