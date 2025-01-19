import {
	boolean,
	pgTable,
	primaryKey,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import type { GroupID, UserID } from "./main";
import { gt, lt, relations } from "drizzle-orm";

export const users = pgTable(
	"users",
	{
		id: uuid().primaryKey().defaultRandom().$type<UserID>(),
		name: varchar({ length: 256 }),
		active: boolean(),
	},
	(col) => {
		return [uniqueIndex("nameIdx").on(col.name)];
	},
);

export const groups = pgTable("groups", {
	id: uuid().primaryKey().defaultRandom().$type<GroupID>(),
	name: varchar({ length: 256 }),
});

export const userGroups = pgTable(
	"userGroups",
	{
		userId: uuid()
			.$type<UserID>()
			.references(() => users.id),
		groupId: uuid()
			.$type<GroupID>()
			.references(() => groups.id),
	},
	(t) => [{ pk: primaryKey({ columns: [t.userId, t.groupId] }) }],
);

export const usersRelations = relations(users, ({ many }) => ({
	friends: many(userFriends),
}));

export const userFriends = pgTable(
	"userFriends",
	{
		userId: uuid()
			.notNull()
			.references(() => users.id),
		friendId: uuid()
			.notNull()
			.references(() => users.id),
	},
	(t) => [
		{ pk: primaryKey({ columns: [t.userId, t.friendId] }) },
		uniqueIndex("friendship").on(
			gt(t.userId, t.friendId),
			lt(t.userId, t.friendId),
		),
	],
);

export const usersToFriendsRelations = relations(userFriends, ({ one }) => ({
	user: one(users, {
		fields: [userFriends.userId],
		references: [users.id],
	}),
	friend: one(users, {
		fields: [userFriends.friendId],
		references: [users.id],
	}),
}));
