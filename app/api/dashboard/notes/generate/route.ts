import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { usersTable, notesTable, activityEventsTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

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
    const { prompt, noteType = "personal" } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const { generateContent, processNoteById } = await import("@/lib/ai/note-processor");

    // 1. Generate Content via AI
    const generated = await generateContent(prompt, noteType);

    const wordCount = generated.content.trim().split(/\s+/).filter(Boolean).length;

    // 2. Insert to DB
    const [note] = await db
      .insert(notesTable)
      .values({
        userId: dbUser.id,
        title: generated.title.trim(),
        rawContent: generated.content.trim(),
        noteType,
        status: "pending",
        wordCount,
        isAiGenerated: true,
        prompt: prompt.trim(),
      })
      .returning();

    await db.insert(activityEventsTable).values({
      userId: dbUser.id,
      noteId: note.id,
      activityType: "note_created",
      title: "Note Generated with AI",
      description: `"${note.title}" was generated via AI prompt.`,
      metadata: JSON.stringify({
        noteType,
        wordCount,
        isAiGenerated: true,
      }),
    });

    // 3. Process the note structuration
    const processingResult = await processNoteById({
      noteId: note.id,
      userId: dbUser.id,
    });

    return NextResponse.json(
      {
        noteId: note.id,
        created: true,
        processed: true,
        result: processingResult,
        generatedContent: generated.content,
        generatedTitle: generated.title,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[NOTES_GENERATE_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
