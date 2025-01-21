import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Options } from "postgres";
import * as schema from "./database-schema";
import type { Logger } from "drizzle-orm";

export type Empty = Record<string, never>;

export class DatabaseManager {
	public logger: Logger | boolean;
	public postgresOptions: Options<Empty>;
	private sql: postgres.Sql;
	public drizzle: PostgresJsDatabase<typeof schema>;

	public constructor(
		logger: Logger | boolean = false,
		options: Options<Empty> = {
			user: "postgres",
			host: "localhost",
			database: "hello_skip",
			password: "your_password",
		},
	) {
		this.logger = logger;
		this.postgresOptions = options;
		this.sql = postgres(options);
		this.drizzle = drizzle<typeof schema>(this.sql, { schema, logger });
	}

	public async createDatabase(): Promise<void> {
		const adminSql = postgres({
			...this.postgresOptions,
			database: "postgres",
		});
		await adminSql`CREATE DATABASE ${this.sql(this.postgresOptions.database)}`;
		await adminSql.end();
	}

	public async dropDatabase(): Promise<void> {
		await this.sql.end();
		const adminSql = postgres({
			...this.postgresOptions,
			database: "postgres",
		});
		await adminSql`DROP DATABASE ${this.sql(this.postgresOptions.database)}`;
		await adminSql.end();
	}

	public async createSampleTables(): Promise<void> {
		// await this.sql`
		//   CREATE TABLE users (
		// 		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		// 		name TEXT,
		// 		active BOOLEAN
		//   );
		// `;
		// await this.sql`
		// 	CREATE TABLE groups (
		// 			id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		// 			name TEXT
		// 	);
		// `;
	}

	public async dropSampleTables(): Promise<void> {
		// list all tables
		const tables = await this
			.sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
		console.log({ tables });
		while (tables.length > 0) {
			const table = tables.pop();
			console.log(table);
			await this.sql`DROP TABLE ${table.table_name}`;
		}
	}
}
