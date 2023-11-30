import env from "@env";

export const validSources = env.NEXT_PUBLIC_CONFIG_VALID_SOURCES;

export const imageConfig = {
  formats: env.NEXT_PUBLIC_CONFIG_IMAGE_FORMATS,
  maxSize: env.NEXT_PUBLIC_CONFIG_IMAGE_MAX_SIZE,
  compression: {
    enabled: env.NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_ENABLED,
    quality: env.NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_QUALITY,
    format: env.NEXT_PUBLIC_CONFIG_IMAGE_COMPRESSION_FORMAT,
  },
};
