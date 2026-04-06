import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { processNoteById } from "@/lib/ai/note-processor";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [dbUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, clerkUserId))
      .limit(1);

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const noteId = body?.noteId;

    if (!noteId) {
      return NextResponse.json(
        { error: "noteId is required" },
        { status: 400 }
      );
    }

    const result = await processNoteById({
      noteId,
      userId: dbUser.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[NOTE_PROCESS_POST]", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}