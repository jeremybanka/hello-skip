import { DatabaseManager, type Empty } from "../src/database";
import * as schema from "../src/database-schema";
import { setupDatabase } from "../src/setup-db";
import type { Options } from "postgres";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import type { UserID } from "../src/main";
import { inspect } from "node:util";

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
});

afterEach(async () => {
	console.log("🗃️ Dropping database");
	await dbManager.dropDatabase();
});

describe("Database", () => {
	it("should query data", async () => {
		const id0 = randomUUID();
		const id1 = randomUUID();
		await dbManager.drizzle.insert(schema.users).values([
			{ id: id0, name: "Frog", active: true },
			{ id: id1, name: "Toad", active: true },
		]);
		await dbManager.drizzle.insert(schema.leaderFollowers).values([
			{ leaderId: id0, followerId: id1 },
			{ leaderId: id1, followerId: id0 },
		]);
		await dbManager.drizzle.insert(schema.groups).values([{ name: "Group 1" }]);

		const users = await dbManager.drizzle.query.users.findFirst({
			where: eq(schema.users.id, id0 as UserID),
			with: {
				leaders: {
					where: (users, { eq }) => eq(users.leaderId, id0),
					with: {
						follower: true,
					},
				},
			},
		});
		console.log(inspect(users, { depth: Number.POSITIVE_INFINITY }));
		expect(users).toBeDefined();
	});
});
