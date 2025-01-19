import path from "node:path";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as Schema from "./database-schema";
import { groupId, userId } from "./main";

export class DatabaseManager {
	public dbName = `test_db_${Date.now()}`;
	private config = {
		user: "postgres",
		host: "localhost",
		database: "hello_skip",
		password: "your_password",
		port: 5432,
	};
	private sql = postgres(this.config);
	private drizzle = drizzle(this.sql);

	public async createDatabase(): Promise<void> {
		const adminSql = postgres({
			...this.config,
			database: "postgres",
		});
		await adminSql`CREATE DATABASE ${this.sql(this.dbName)}`;
		await adminSql.end();
		this.config.database = this.dbName;
		this.sql = postgres(this.config);
		this.drizzle = drizzle(this.sql);
	}

	public async dropDatabase(): Promise<void> {
		await this.sql.end();
		const adminSql = postgres({
			...this.config,
			database: "postgres",
		});
		await adminSql`DROP DATABASE ${this.sql(this.dbName)}`;
		await adminSql.end();
	}

	public async createSampleTables(): Promise<void> {
		await this.sql`
		  CREATE TABLE users (
				id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
				name TEXT,
				active BOOLEAN
		  );
		`;
		await this.sql`
			CREATE TABLE groups (
					id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
					name TEXT
			);
		`;
	}

	public async insertSampleData(): Promise<void> {
		await this.drizzle
			.insert(Schema.users)
			.values([{ name: "User 1", active: true }]);
		await this.drizzle.insert(Schema.groups).values([{ name: "Group 1" }]);
	}

	public async dropSampleTables(): Promise<void> {
		await this.sql`DROP TABLE users`;
		await this.sql`DROP TABLE groups`;
	}
}
