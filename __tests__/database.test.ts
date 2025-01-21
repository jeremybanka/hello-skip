import { DatabaseManager, type Empty } from "../src/database";
import * as schema from "../src/database-schema";
import * as DK from "drizzle-kit";
import { setupDatabase } from "../src/setup-db";
import type { Options } from "postgres";

const pgOptions = {
	user: "postgres",
	host: "localhost",
	database: `test_db_${Date.now()}`,
	password: "your_password",
} as const satisfies Options<Empty>;

const dbManager = new DatabaseManager(
	{
		logQuery(query, params) {
			console.info("📝 query", query, params);
		},
	},
	pgOptions,
);

beforeEach(async () => {
	console.log("🗃️ Setting up database");
	await setupDatabase(pgOptions);
	await dbManager.drizzle
		.insert(schema.users)
		.values([{ name: "User 1", active: true }]);
	await dbManager.drizzle.insert(schema.groups).values([{ name: "Group 1" }]);
});

afterEach(async () => {
	// console.log("🗃️ Dropping sample tables");
	// await dbManager.dropSampleTables();
	console.log("🗃️ Dropping database");
	await dbManager.dropDatabase();
});

describe("Database", () => {
	it("should query data", async () => {
		const [user] = await dbManager.drizzle.query.users.findMany({
			with: {
				userGroups: {
					with: {
						group: {
							columns: {
								name: true,
							},
						},
					},
				},
			},
		});
		console.log(user.userGroups[0]);
		expect(user).toBeDefined();
	});
});
