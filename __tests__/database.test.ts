import { DatabaseManager } from "../src/database";

const dbManager = new DatabaseManager();

beforeAll(async () => {
	console.log("Creating database");
	await dbManager.createDatabase();
});

afterAll(async () => {
	console.log("Dropping database");
	await dbManager.dropDatabase();
});

beforeEach(async () => {
	console.log("Creating sample tables");
	await dbManager.createSampleTables();
	await dbManager.insertSampleData();
});

afterEach(async () => {
	console.log("Dropping sample tables");
	await dbManager.dropSampleTables();
});

describe("Database", () => {
	it("should create tables", async () => {
		// TODO
	});

	it("should insert data", async () => {
		// TODO
	});
});
