import { db } from "@/config/db";
import { openrouter } from "@/config/openrouter";
import {
  activityEventsTable,
  noteProcessingJobsTable,
  notesTable,
  relationshipsTable,
  tagsTable,
  topicsTable,
} from "@/config/schema";
import { and, desc, eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

type Topic = {
  name: string;
  description: string;
};

type Relationship = {
  source: string;
  target: string;
  relation: string;
};

type AnalysisResult = {
  title: string;
  shortSummary: string;
  detailedSummary: string;
  topics: Topic[];
  tags: string[];
  relationships: Relationship[];
};

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const sliced = text.slice(firstBrace, lastBrace + 1);
      return JSON.parse(sliced);
    }
    throw new Error("Model did not return valid JSON");
  }
}

function normalizeAnalysis(data: any): AnalysisResult {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid AI response object");
  }

  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : "Untitled Note";

  const shortSummary =
    typeof data.shortSummary === "string" ? data.shortSummary.trim() : "";

  const detailedSummary =
    typeof data.detailedSummary === "string" ? data.detailedSummary.trim() : "";

  const topics: Topic[] = Array.isArray(data.topics)
    ? data.topics
        .filter(
          (item: { name: string; description: any; }) =>
            item &&
            typeof item.name === "string" &&
            item.name.trim() &&
            typeof item.description === "string"
        )
        .map((item: { name: string; description: string; }) => ({
          name: item.name.trim(),
          description: item.description.trim(),
        }))
    : [];

  const tags: string[] = Array.isArray(data.tags)
    ? [...new Set(
        (data.tags as unknown[])
          .filter((tag): tag is string => typeof tag === "string" && tag.trim() !== "")
          .map((tag) => tag.trim().toLowerCase())
      )]
    : [];

  const relationships: Relationship[] = Array.isArray(data.relationships)
    ? data.relationships
        .filter(
          (item: { source: string; target: string; relation: string; }) =>
            item &&
            typeof item.source === "string" &&
            item.source.trim() &&
            typeof item.target === "string" &&
            item.target.trim() &&
            typeof item.relation === "string" &&
            item.relation.trim()
        )
        .map((item: { source: string; target: string; relation: string; }) => ({
          source: item.source.trim(),
          target: item.target.trim(),
          relation: item.relation.trim(),
        }))
    : [];

  if (!shortSummary) {
    throw new Error("shortSummary missing in AI response");
  }

  if (!detailedSummary) {
    throw new Error("detailedSummary missing in AI response");
  }

  return {
    title,
    shortSummary,
    detailedSummary,
    topics,
    tags,
    relationships,
  };
}

function buildPrompt(rawContent: string, noteTitle?: string, noteType?: string) {
  return `
You are an AI knowledge extraction engine.

Analyze the note below and return ONLY valid JSON.
Do not include markdown.
Do not wrap in backticks.
Do not include explanations outside JSON.

Required JSON shape:
{
  "title": "string",
  "shortSummary": "string",
  "detailedSummary": "string",
  "topics": [
    {
      "name": "string",
      "description": "string"
    }
  ],
  "tags": ["string"],
  "relationships": [
    {
      "source": "string",
      "target": "string",
      "relation": "string"
    }
  ]
}

Rules:
- shortSummary: 2 to 3 concise sentences
- detailedSummary: 1 solid paragraph
- topics: 3 to 8 major concepts
- tags: 3 to 10 concise searchable tags
- relationships: only meaningful topic-to-topic relationships
- preserve the original meaning
- if the note is short, still return the required structure with fewer topics if necessary

Context:
- Existing title: ${noteTitle ?? "N/A"}
- Note type: ${noteType ?? "personal"}

Note:
"""${rawContent}"""
`.trim();
}

async function callOpenRouter(prompt: string): Promise<AnalysisResult> {
  const response = await openrouter.chat.send({
    chatRequest: {
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You convert user notes into strict JSON knowledge objects. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
    }
  });

  // Depending on TypeScript strictness, assertion might be needed if stream flag isn't literal
  const content = (response as any).choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Empty response from model");
  }

  const parsed = safeJsonParse(content);
  return normalizeAnalysis(parsed);
}

export async function generateContent(prompt: string, noteType: string = "personal"): Promise<{ title: string, content: string }> {
  const response = await openrouter.chat.send({
    chatRequest: {
      model: "openai/gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You are an AI note-writing assistant. Write a detailed, comprehensive note based on the user's prompt. Target note type: ${noteType}.
Return YOUR EXACT RESPONSE in strict JSON format:
{
  "title": "A suitable title for the note",
  "content": "The full detailed content of the note using markdown."
}`
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }
  });

  const contentStr = (response as any).choices?.[0]?.message?.content;
  if (!contentStr || typeof contentStr !== "string") {
    throw new Error("Empty response from model when generating content.");
  }

  const parsed = safeJsonParse(contentStr);
  return {
    title: parsed.title || "Generated Note",
    content: parsed.content || "Content could not be generated."
  };
}

export async function processNoteById({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) {
  const [note] = await db
    .select()
    .from(notesTable)
    .where(and(eq(notesTable.id, noteId), eq(notesTable.userId, userId)))
    .limit(1);

  if (!note) {
    throw new Error("Note not found");
  }

  const [existingJob] = await db
    .select()
    .from(noteProcessingJobsTable)
    .where(eq(noteProcessingJobsTable.noteId, noteId))
    .orderBy(desc(noteProcessingJobsTable.createdAt))
    .limit(1);

  let jobId = existingJob?.id;

  if (!jobId) {
    const [job] = await db
      .insert(noteProcessingJobsTable)
      .values({
        noteId,
        userId,
        status: "pending",
        attemptCount: 0,
      })
      .returning();
    jobId = job.id;
  }

  await db
    .update(notesTable)
    .set({
      status: "processing",
      processingStartedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(notesTable.id, noteId));

  await db
    .update(noteProcessingJobsTable)
    .set({
      status: "processing",
      attemptCount: (existingJob?.attemptCount ?? 0) + 1,
      startedAt: new Date(),
      updatedAt: new Date(),
      errorMessage: null,
    })
    .where(eq(noteProcessingJobsTable.id, jobId));

  await db.insert(activityEventsTable).values({
    userId,
    noteId,
    activityType: "note_processing_started",
    title: "Note Processing Started",
    description: `AI processing started for "${note.title}".`,
    metadata: JSON.stringify({
      noteType: note.noteType,
      wordCount: note.wordCount,
    }),
  });

  try {
    const result = await callOpenRouter(
      buildPrompt(note.rawContent, note.title, note.noteType)
    );

    // Clear previous derived knowledge if reprocessing
    await db.delete(topicsTable).where(eq(topicsTable.noteId, noteId));
    await db.delete(tagsTable).where(eq(tagsTable.noteId, noteId));
    await db
      .delete(relationshipsTable)
      .where(eq(relationshipsTable.noteId, noteId));

    await db
      .update(notesTable)
      .set({
        title: result.title || note.title,
        shortSummary: result.shortSummary,
        detailedSummary: result.detailedSummary,
        status: "completed",
        processingCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(notesTable.id, noteId));

    if (result.topics.length > 0) {
      await db.insert(topicsTable).values(
        result.topics.map((topic) => ({
          id: createId(),
          noteId,
          name: topic.name,
          description: topic.description,
        }))
      );
    }

    if (result.tags.length > 0) {
      await db.insert(tagsTable).values(
        result.tags.map((tag) => ({
          id: createId(),
          noteId,
          tagName: tag,
        }))
      );
    }

    if (result.relationships.length > 0) {
      await db.insert(relationshipsTable).values(
        result.relationships.map((relationship) => ({
          id: createId(),
          noteId,
          sourceTopic: relationship.source,
          targetTopic: relationship.target,
          relationType: relationship.relation,
        }))
      );
    }

    await db
      .update(noteProcessingJobsTable)
      .set({
        status: "completed",
        completedAt: new Date(),
        updatedAt: new Date(),
        errorMessage: null,
      })
      .where(eq(noteProcessingJobsTable.id, jobId));

    await db.insert(activityEventsTable).values([
      {
        userId,
        noteId,
        activityType: "note_processing_completed",
        title: "Note Processing Completed",
        description: `AI processing completed for "${result.title || note.title}".`,
        metadata: JSON.stringify({
          topicCount: result.topics.length,
          tagCount: result.tags.length,
          relationshipCount: result.relationships.length,
        }),
      },
      {
        userId,
        noteId,
        activityType: "topics_generated",
        title: "Topics Generated",
        description: `${result.topics.length} topics were extracted.`,
        metadata: JSON.stringify({
          topicCount: result.topics.length,
        }),
      },
      {
        userId,
        noteId,
        activityType: "tags_generated",
        title: "Tags Generated",
        description: `${result.tags.length} tags were generated.`,
        metadata: JSON.stringify({
          tagCount: result.tags.length,
        }),
      },
      {
        userId,
        noteId,
        activityType: "relationships_generated",
        title: "Relationships Generated",
        description: `${result.relationships.length} concept relationships were identified.`,
        metadata: JSON.stringify({
          relationshipCount: result.relationships.length,
        }),
      },
    ]);

    return {
      success: true,
      noteId,
      status: "completed" as const,
      result,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown processing error";

    await db
      .update(notesTable)
      .set({
        status: "failed",
        updatedAt: new Date(),
      })
      .where(eq(notesTable.id, noteId));

    await db
      .update(noteProcessingJobsTable)
      .set({
        status: "failed",
        completedAt: new Date(),
        updatedAt: new Date(),
        errorMessage: message,
      })
      .where(eq(noteProcessingJobsTable.id, jobId));

    await db.insert(activityEventsTable).values({
      userId,
      noteId,
      activityType: "note_processing_failed",
      title: "Note Processing Failed",
      description: `AI processing failed for "${note.title}".`,
      metadata: JSON.stringify({
        error: message,
      }),
    });

    throw error;
  }
}