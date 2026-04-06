import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  usersTable,
  notesTable,
  tagsTable,
  activityEventsTable,
} from "@/config/schema";
import { eq, desc, and, ilike, sql, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const runtime = "nodejs";

// GET /api/dashboard/notes
// Query params: page, pageSize, status, noteType, q (search), archived
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, userId))
      .limit(1);

    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "10")));
    const offset = (page - 1) * pageSize;
    const status = searchParams.get("status");
    const noteType = searchParams.get("noteType");
    const q = searchParams.get("q")?.trim();
    const archived = searchParams.get("archived") === "true";

    // Build where conditions
    const conditions = [
      eq(notesTable.userId, dbUser.id),
      eq(notesTable.isArchived, archived),
      ...(status ? [eq(notesTable.status, status as any)] : []),
      ...(noteType ? [eq(notesTable.noteType, noteType as any)] : []),
      ...(q ? [ilike(notesTable.title, `%${q}%`)] : []),
    ];

    const whereClause = and(...conditions);

    // Fetch notes with pagination
    const [notes, [{ total }]] = await Promise.all([
      db
        .select({
          id: notesTable.id,
          title: notesTable.title,
          noteType: notesTable.noteType,
          status: notesTable.status,
          shortSummary: notesTable.shortSummary,
          wordCount: notesTable.wordCount,
          isArchived: notesTable.isArchived,
          createdAt: notesTable.createdAt,
          updatedAt: notesTable.updatedAt,
          processingCompletedAt: notesTable.processingCompletedAt,
        })
        .from(notesTable)
        .where(whereClause)
        .orderBy(desc(notesTable.createdAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(notesTable)
        .where(whereClause),
    ]);

    // Fetch tags for returned notes
    let tagsMap: Record<string, string[]> = {};
    if (notes.length > 0) {
      const noteIds = notes.map((n) => n.id);
      const tags = await db
        .select({ noteId: tagsTable.noteId, tagName: tagsTable.tagName })
        .from(tagsTable)
        .where(inArray(tagsTable.noteId, noteIds));
      for (const tag of tags) {
        if (!tagsMap[tag.noteId]) tagsMap[tag.noteId] = [];
        tagsMap[tag.noteId].push(tag.tagName);
      }
    }

    const notesWithTags = notes.map((note) => ({
      ...note,
      tags: tagsMap[note.id] ?? [],
    }));

    return NextResponse.json({
      notes: notesWithTags,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[NOTES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST /api/dashboard/notes
// Body: { title, rawContent, noteType }
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, userId))
      .limit(1);

    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const body = await req.json();
    const { title, rawContent, noteType = "personal" } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!rawContent?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const wordCount = rawContent.trim().split(/\s+/).filter(Boolean).length;

    const [note] = await db
      .insert(notesTable)
      .values({
        userId: dbUser.id,
        title: title.trim(),
        rawContent: rawContent.trim(),
        noteType,
        status: "pending",
        wordCount,
      })
      .returning();

    // Log activity event
    await db.insert(activityEventsTable).values({
      userId: dbUser.id,
      noteId: note.id,
      activityType: "note_created",
      title: "Note Created",
      description: `"${note.title}" was added to your workspace.`,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("[NOTES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PATCH /api/dashboard/notes — archive toggle or title update
// Body: { id, isArchived? }
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, userId))
      .limit(1);

    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const body = await req.json();
    const { id, isArchived } = body;

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
    }

    const updates: Record<string, any> = { updatedAt: new Date() };
    if (typeof isArchived === "boolean") updates.isArchived = isArchived;

    const [updated] = await db
      .update(notesTable)
      .set(updates)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, dbUser.id)))
      .returning();

    if (!updated) {
      return new NextResponse("Note not found", { status: 404 });
    }

    // Log activity event for archive/unarchive
    if (typeof isArchived === "boolean") {
      await db.insert(activityEventsTable).values({
        userId: dbUser.id,
        noteId: id,
        activityType: isArchived ? "note_updated" : "note_updated",
        title: isArchived ? "Note Archived" : "Note Restored",
        description: `"${updated.title}" was ${isArchived ? "archived" : "restored"}.`,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[NOTES_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/dashboard/notes?id=<noteId>
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, userId))
      .limit(1);

    if (!dbUser) return new NextResponse("User not found", { status: 404 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Note ID is required" }, { status: 400 });

    // Get note title before deleting for the activity log
    const [note] = await db
      .select({ title: notesTable.title })
      .from(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, dbUser.id)))
      .limit(1);

    if (!note) return new NextResponse("Note not found", { status: 404 });

    await db
      .delete(notesTable)
      .where(and(eq(notesTable.id, id), eq(notesTable.userId, dbUser.id)));

    // Log deletion (note_id will be set null via DB cascade, so log before)
    await db.insert(activityEventsTable).values({
      userId: dbUser.id,
      noteId: null,
      activityType: "note_deleted",
      title: "Note Deleted",
      description: `"${note.title}" was permanently deleted.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTES_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
