import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const BUILDING_WITH_VITE = "__vite_start_time" in globalThis;
export const HAS_WINDOW = typeof window !== "undefined";
export const IS_TEST = "vitest" in globalThis;

export const env = createEnv({
	isServer: !BUILDING_WITH_VITE && !HAS_WINDOW,

	server: {
		CI: z
			.string()
			.transform((_) => true as const)
			.optional(),
		POSTGRES_USER: z.string(),
		POSTGRES_PASSWORD: z.string(),
		POSTGRES_DATABASE: z.string(),
		POSTGRES_HOST: z.string(),
		POSTGRES_PORT: z.string().transform((s) => Number.parseInt(s, 10)),
	},

	/**
	 * The prefix that client-side variables must have. This is enforced both at
	 * a type-level and at runtime.
	 */
	clientPrefix: "VITE_",

	client: {},

	/**
	 * What object holds the environment variables at runtime. This is usually
	 * `process.env` or `import.meta.env`.
	 */
	runtimeEnv: import.meta.env,

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * In order to solve these issues, we recommend that all new projects
	 * explicitly specify this option as true.
	 */
	emptyStringAsUndefined: true,
});
