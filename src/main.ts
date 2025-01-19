import { type EagerCollection, OneToOneMapper } from "@skipruntime/api";
import { runService } from "@skipruntime/server";

export type UserID = string & { __type: "user" };
export const userId = (id: string): UserID => id as UserID;
export type GroupID = string & { __type: "group" };
export const groupId = (id: string): GroupID =>
	Object.assign(id, { __type: "group" as const });
type User = { name: string; active: boolean; friends: UserID[] };
type Group = { name: string; members: UserID[] };

// Type alias for inputs to our service
type ServiceInputs = {
	users: EagerCollection<UserID, User>;
	groups: EagerCollection<GroupID, Group>;
};

// Type alias for inputs to the active friends resource
type ResourceInputs = {
	users: EagerCollection<UserID, User>;
	actives: EagerCollection<GroupID, UserID[]>;
};

// Mapper function to compute the active users of each group
class ActiveUsers extends OneToOneMapper<GroupID, Group, UserID[]> {
	constructor(private users: EagerCollection<UserID, User>) {
		super();
	}

	mapValue(group: Group): UserID[] {
		return group.members.filter((uid) => this.users.getUnique(uid).active);
	}
}

// Load initial data from a source-of-truth database (mocked for simplicity)
// const [users, groups] = await Promise.all([db.getUsers(), db.getGroups()]);

// // Specify and run the reactive service
// const service = await runService({
// 	initialData: { users, groups },
// 	resources: { active_friends: ActiveFriends },
// 	createGraph(input: ServiceInputs): ResourceInputs {
// 		const actives = input.groups.map(ActiveUsers, input.users);
// 		return { users: input.users, actives };
// 	},
// });
