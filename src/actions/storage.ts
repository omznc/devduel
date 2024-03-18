"use server";

import { getSignedURL } from "@lib/storage.ts";

export const getSignedUploadURL = async (type: string, size: number) => {
	return getSignedURL(type, size);
};
