import {
  pgTable,
  text,
  timestamp,
  jsonb,
  varchar,
  unique,
  index,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

//
// USERS (same format, hardened defaults + timezone + notNull where appropriate)
//
export const usersTable = pgTable(
  "users",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    // Clerk ID (unique)
    clerkUserId: text("clerk_user_id").notNull().unique(),

    email: text("email").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    avatarUrl: text("avatar_url"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),

    // for "active users" calculation
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  },
  (t) => ({
    clerkIdx: index("users_clerkUserId_idx").on(t.clerkUserId),
    emailIdx: index("users_email_idx").on(t.email),
  })
);

