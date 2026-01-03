export type Locale = (typeof locales)[number];

export const locales = ["en", "mm", "th"] as const;
export const defaultLocale: Locale = "en";
