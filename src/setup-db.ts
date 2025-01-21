import * as os from "node:os";
import { resolve } from "node:path";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres, { type Options } from "postgres";
import type { Empty } from "./database";

export async function setupDatabase(options: Options<Empty>) {
	const osUser = os.userInfo().username;
	const admin = osUser === "runner" ? "postgres" : osUser;

	console.log({ postgresSetupCredentials: options });

	const adminSql = postgres({ ...options, user: admin, database: "postgres" });

	try {
		console.log("🚀 Creating database ${env.POSTGRES_DATABASE}... ");
		await adminSql`CREATE DATABASE ${adminSql(options.database)}`;
		console.log("Done!");
	} catch (thrown) {
		if (thrown instanceof Error) {
			console.error("💥 Failed:", thrown.message);
		}
	}

	try {
		console.log(`🚀 Creating user ${options.user}... `);
		await adminSql.unsafe(
			`CREATE USER ${options.user} WITH PASSWORD '${options.password}'`,
		);
		console.log("Done!");
	} catch (thrown) {
		if (thrown instanceof Error) {
			console.error("💥 Failed:", thrown.message);
		}
	}

	try {
		console.log(
			`🚀 Granting privileges to ${options.user} on ${options.database}... `,
		);
		await adminSql`GRANT ALL PRIVILEGES ON DATABASE ${adminSql(options.database)} TO ${adminSql(
			options.user,
		)}`;
		console.log("Done!");
	} catch (thrown) {
		if (thrown instanceof Error) {
			console.error("💥 Failed:", thrown.message);
		}
	}
	await adminSql.end();

	const sql = postgres(options);
	try {
		console.log(`🚀 Migrating database ${options.database}... `);
		const db = drizzle(sql);
		const migrationsFolder = resolve(
			import.meta.dir ?? import.meta.dirname,
			"../drizzle",
		);
		console.log({ migrationsFolder });
		await migrate(db, { migrationsFolder });
		console.log("Done!");
	} catch (thrown) {
		if (thrown instanceof Error) {
			console.error("💥 Failed:", thrown.message);
		}
	}
	await sql.end();

	console.log("🚀 Database connection closed");
}
