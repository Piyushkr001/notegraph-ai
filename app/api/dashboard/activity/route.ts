import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable, activityEventsTable } from "@/config/schema";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

export const runtime = "nodejs";

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
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "20")));
    const offset = (page - 1) * pageSize;
    const type = searchParams.get("type");

    let whereClause = eq(activityEventsTable.userId, dbUser.id);
    if (type) {
      whereClause = and(whereClause, eq(activityEventsTable.activityType, type as any)) as any;
    }

    const [activities, [{ total }]] = await Promise.all([
      db
        .select()
        .from(activityEventsTable)
        .where(whereClause)
        .orderBy(desc(activityEventsTable.createdAt))
        .limit(pageSize)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(activityEventsTable)
        .where(whereClause),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("[ACTIVITY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
