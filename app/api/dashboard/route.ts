import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import {
  usersTable,
  notesTable,
  activityEventsTable,
  topicsTable,
} from "@/config/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get database user
    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, userId))
      .limit(1);

    if (!dbUser) {
      return new NextResponse("User not found in database", { status: 404 });
    }

    // Total Notes
    const [notesCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notesTable)
      .where(eq(notesTable.userId, dbUser.id));

    // Stats by status
    const statusStats = await db
      .select({
        status: notesTable.status,
        count: sql<number>`count(*)::int`,
      })
      .from(notesTable)
      .where(eq(notesTable.userId, dbUser.id))
      .groupBy(notesTable.status);

    // Recent activity (latest 5)
    const recentActivity = await db
      .select()
      .from(activityEventsTable)
      .where(eq(activityEventsTable.userId, dbUser.id))
      .orderBy(desc(activityEventsTable.createdAt))
      .limit(5);

    // Total topics generated for user's notes
    const [topicsCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(topicsTable)
      .innerJoin(notesTable, eq(topicsTable.noteId, notesTable.id))
      .where(eq(notesTable.userId, dbUser.id));

    return NextResponse.json({
      totalNotes: notesCountResult?.count || 0,
      totalTopics: topicsCountResult?.count || 0,
      statusStats: statusStats || [],
      recentActivity: recentActivity || [],
    });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
