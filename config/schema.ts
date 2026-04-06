import {
  pgTable,
  text,
  timestamp,
  varchar,
  index,
  integer,
  boolean,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

//
// ENUMS
//
export const noteTypeEnum = pgEnum("note_type", [
  "study",
  "meeting",
  "research",
  "personal",
  "technical",
]);

export const noteStatusEnum = pgEnum("note_status", [
  "draft",
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "user_signed_up",
  "user_logged_in",
  "note_created",
  "note_updated",
  "note_deleted",
  "note_processing_started",
  "note_processing_completed",
  "note_processing_failed",
  "topics_generated",
  "tags_generated",
  "relationships_generated",
  "dashboard_viewed",
]);

//
// USERS
//
export const usersTable = pgTable(
  "users",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    clerkUserId: text("clerk_user_id").notNull().unique(),

    email: text("email").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    avatarUrl: text("avatar_url"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  },
  (t) => ({
    clerkIdx: index("users_clerk_user_id_idx").on(t.clerkUserId),
    emailIdx: index("users_email_idx").on(t.email),
  })
);

//
// NOTES
//
export const notesTable = pgTable(
  "notes",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 255 }).notNull(),
    rawContent: text("raw_content").notNull(),

    noteType: noteTypeEnum("note_type").notNull().default("personal"),
    status: noteStatusEnum("status").notNull().default("pending"),

    shortSummary: text("short_summary"),
    detailedSummary: text("detailed_summary"),

    wordCount: integer("word_count").notNull().default(0),

    processingStartedAt: timestamp("processing_started_at", {
      withTimezone: true,
    }),
    processingCompletedAt: timestamp("processing_completed_at", {
      withTimezone: true,
    }),

    isArchived: boolean("is_archived").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("notes_user_id_idx").on(t.userId),
    statusIdx: index("notes_status_idx").on(t.status),
    typeIdx: index("notes_note_type_idx").on(t.noteType),
    createdAtIdx: index("notes_created_at_idx").on(t.createdAt),
    archivedIdx: index("notes_is_archived_idx").on(t.isArchived),
  })
);

//
// TOPICS
//
export const topicsTable = pgTable(
  "topics",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    noteId: text("note_id")
      .notNull()
      .references(() => notesTable.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    noteIdx: index("topics_note_id_idx").on(t.noteId),
    nameIdx: index("topics_name_idx").on(t.name),
  })
);

//
// TAGS
//
export const tagsTable = pgTable(
  "tags",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    noteId: text("note_id")
      .notNull()
      .references(() => notesTable.id, { onDelete: "cascade" }),

    tagName: varchar("tag_name", { length: 100 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    noteIdx: index("tags_note_id_idx").on(t.noteId),
    tagIdx: index("tags_tag_name_idx").on(t.tagName),
    uniqueTagPerNoteIdx: uniqueIndex("tags_note_id_tag_name_unique").on(
      t.noteId,
      t.tagName
    ),
  })
);

//
// RELATIONSHIPS
//
export const relationshipsTable = pgTable(
  "relationships",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    noteId: text("note_id")
      .notNull()
      .references(() => notesTable.id, { onDelete: "cascade" }),

    sourceTopic: varchar("source_topic", { length: 255 }).notNull(),
    targetTopic: varchar("target_topic", { length: 255 }).notNull(),
    relationType: varchar("relation_type", { length: 100 }).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    noteIdx: index("relationships_note_id_idx").on(t.noteId),
    sourceIdx: index("relationships_source_topic_idx").on(t.sourceTopic),
    targetIdx: index("relationships_target_topic_idx").on(t.targetTopic),
  })
);

//
// NOTE PROCESSING JOBS
// Useful for realtime dashboard status tracking
//
export const noteProcessingJobsTable = pgTable(
  "note_processing_jobs",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    noteId: text("note_id")
      .notNull()
      .references(() => notesTable.id, { onDelete: "cascade" }),

    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    status: noteStatusEnum("status").notNull().default("pending"),

    attemptCount: integer("attempt_count").notNull().default(0),
    errorMessage: text("error_message"),

    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    noteIdx: index("note_processing_jobs_note_id_idx").on(t.noteId),
    userIdx: index("note_processing_jobs_user_id_idx").on(t.userId),
    statusIdx: index("note_processing_jobs_status_idx").on(t.status),
    createdIdx: index("note_processing_jobs_created_at_idx").on(t.createdAt),
  })
);

//
// ACTIVITY EVENTS
// Best table for realtime/admin dashboard feeds
//
export const activityEventsTable = pgTable(
  "activity_events",
  {
    id: text("id")
      .$defaultFn(() => createId())
      .primaryKey(),

    userId: text("user_id").references(() => usersTable.id, {
      onDelete: "set null",
    }),

    noteId: text("note_id").references(() => notesTable.id, {
      onDelete: "set null",
    }),

    activityType: activityTypeEnum("activity_type").notNull(),

    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),

    metadata: text("metadata"), // optional JSON string, or switch to jsonb if you want structured metadata

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userIdx: index("activity_events_user_id_idx").on(t.userId),
    noteIdx: index("activity_events_note_id_idx").on(t.noteId),
    typeIdx: index("activity_events_activity_type_idx").on(t.activityType),
    createdIdx: index("activity_events_created_at_idx").on(t.createdAt),
  })
);