import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { topicsTable, relationshipsTable, notesTable, usersTable } from "@/config/schema";
import { eq, inArray } from "drizzle-orm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, userId))
      .limit(1);

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get all notes for user
    const userNotes = await db
      .select({ id: notesTable.id })
      .from(notesTable)
      .where(eq(notesTable.userId, dbUser.id));

    const noteIds = userNotes.map((n) => n.id);

    if (noteIds.length === 0) {
      return NextResponse.json({ topics: [], relationships: [] });
    }

    // Get all topics and relationships belonging to these notes
    const [topics, relationships] = await Promise.all([
      db
        .select({
          id: topicsTable.id,
          name: topicsTable.name,
          noteId: topicsTable.noteId,
        })
        .from(topicsTable)
        .where(inArray(topicsTable.noteId, noteIds)),
      db
        .select({
          id: relationshipsTable.id,
          sourceTopic: relationshipsTable.sourceTopic,
          targetTopic: relationshipsTable.targetTopic,
          relationType: relationshipsTable.relationType,
        })
        .from(relationshipsTable)
        .where(inArray(relationshipsTable.noteId, noteIds)),
    ]);

    return NextResponse.json({ topics, relationships });
  } catch (error) {
    console.error("[GRAPH_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
