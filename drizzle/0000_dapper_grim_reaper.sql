CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "leaderFollowers" (
	"leaderId" uuid,
	"followerId" uuid
);
--> statement-breakpoint
CREATE TABLE "userGroups" (
	"userId" uuid,
	"groupId" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"active" boolean
);
--> statement-breakpoint
ALTER TABLE "leaderFollowers" ADD CONSTRAINT "leaderFollowers_leaderId_users_id_fk" FOREIGN KEY ("leaderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderFollowers" ADD CONSTRAINT "leaderFollowers_followerId_users_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userGroups" ADD CONSTRAINT "userGroups_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userGroups" ADD CONSTRAINT "userGroups_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "nameIdx" ON "users" USING btree ("name");