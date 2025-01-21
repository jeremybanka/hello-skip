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
export const usersRelations = relations(users, ({ many }) => ({
	userGroups: many(userGroups),
}));

export const groups = pgTable("groups", {
	id: uuid().primaryKey().defaultRandom().$type<GroupID>(),
	name: varchar({ length: 256 }),
});
export const groupsRelations = relations(groups, ({ many }) => ({
	userGroups: many(userGroups),
}));

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
export const userGroupsRelations = relations(userGroups, ({ one }) => ({
	group: one(groups, {
		fields: [userGroups.groupId],
		references: [groups.id],
	}),
	user: one(users, {
		fields: [userGroups.userId],
		references: [users.id],
	}),
}));

export const leaderFollowers = pgTable(
	"leaderFollowers",
	{
		leaderId: uuid()
			.$type<UserID>()
			.references(() => users.id),
		followerId: uuid()
			.$type<UserID>()
			.references(() => users.id),
	},
	(t) => [
		{
			pk: primaryKey({ columns: [t.leaderId, t.followerId] }),
			unique: uniqueIndex("userIdFollowerIdIdx").on(t.leaderId, t.followerId),
		},
	],
);

export const leaderFollowersRelations = relations(
	leaderFollowers,
	({ one }) => ({
		leader: one(users, {
			fields: [leaderFollowers.leaderId],
			references: [users.id],
		}),
		follower: one(users, {
			fields: [leaderFollowers.followerId],
			references: [users.id],
		}),
	}),
);
