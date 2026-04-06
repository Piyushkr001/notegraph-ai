import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  usersTable,
  notesTable,
  tagsTable,
  topicsTable,
  relationshipsTable,
} from "@/config/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { noteId } = await context.params;

    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, clerkUserId))
      .limit(1);

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const [note] = await db
      .select()
      .from(notesTable)
      .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, dbUser.id)))
      .limit(1);

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const [tags, topics, relationships] = await Promise.all([
      db
        .select({
          id: tagsTable.id,
          tagName: tagsTable.tagName,
        })
        .from(tagsTable)
        .where(eq(tagsTable.noteId, noteId)),

      db
        .select({
          id: topicsTable.id,
          name: topicsTable.name,
          description: topicsTable.description,
        })
        .from(topicsTable)
        .where(eq(topicsTable.noteId, noteId)),

      db
        .select({
          id: relationshipsTable.id,
          sourceTopic: relationshipsTable.sourceTopic,
          targetTopic: relationshipsTable.targetTopic,
          relationType: relationshipsTable.relationType,
        })
        .from(relationshipsTable)
        .where(eq(relationshipsTable.noteId, noteId)),
    ]);

    return NextResponse.json({
      ...note,
      tags: tags.map((tag) => tag.tagName),
      topics,
      relationships,
    });
  } catch (error) {
    console.error("[NOTE_DETAIL_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}