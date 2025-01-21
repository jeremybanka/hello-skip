#!/usr/bin/env bun

import { setupDatabase } from "./setup-db";

import { env } from "./env";

console.log({ env });

await setupDatabase({
	user: env.POSTGRES_USER,
	password: env.POSTGRES_PASSWORD,
	database: "postgres",
	host: env.POSTGRES_HOST,
	port: env.POSTGRES_PORT,
});
