import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";

export const runtime = "nodejs";

/**
 * Upserts the DB user from Clerk and always updates:
 * - updatedAt
 * - lastSeenAt (used for "active users" / realtime dashboard)
 *
 * IMPORTANT:
 * - Uses clerkUserId as the stable unique key.
 * - Avoids inserting blank email/name where possible.
 */
async function upsertUserFromClerk() {
  const clerk = await currentUser();
  if (!clerk) return null;

  const clerkUserId = clerk.id;

  const email =
    clerk.emailAddresses?.find((e) => e.id === clerk.primaryEmailAddressId)
      ?.emailAddress ??
    clerk.emailAddresses?.[0]?.emailAddress ??
    "";

  const name =
    [clerk.firstName, clerk.lastName].filter(Boolean).join(" ") ||
    clerk.fullName ||
    clerk.username ||
    email ||
    "User";

  const avatarUrl = clerk.imageUrl || undefined;

  const now = new Date();

  // If email is still empty, block insert (your schema has email notNull)
  if (!email) {
    return NextResponse.json(
      { error: "Primary email not found on Clerk user." },
      { status: 400 }
    );
  }

  const [row] = await db
    .insert(usersTable)
    .values({
      clerkUserId,
      email,
      name,
      avatarUrl,
      createdAt: now, // safe even on conflict; ignored on update
      updatedAt: now,
      lastSeenAt: now,
    })
    .onConflictDoUpdate({
      target: usersTable.clerkUserId,
      set: {
        email,
        name,
        avatarUrl,
        updatedAt: now,
        lastSeenAt: now,
      },
    })
    .returning();

  return row;
}

export async function POST() {
  // POST = "sync me now"
  const row = await upsertUserFromClerk();
  if (!row || "headers" in (row as any)) {
    // In case upsertUserFromClerk returned a NextResponse (email missing)
    return row as any;
  }
  return NextResponse.json(row);
}

export async function GET() {
  // GET = fetch user; also update lastSeenAt for "active users"
  const clerk = await currentUser();
  if (!clerk) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, clerk.id))
    .limit(1);

  // If user not found (rare), create it
  if (!user) {
    const row = await upsertUserFromClerk();
    if (!row || "headers" in (row as any)) return row as any;
    return NextResponse.json(row);
  }

  // Update lastSeenAt on GET too (so dashboard "active users" works even if
  // frontend only calls GET)
  const now = new Date();
  await db
    .update(usersTable)
    .set({ lastSeenAt: now, updatedAt: now })
    .where(eq(usersTable.id, user.id));

  const [fresh] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user.id))
    .limit(1);

  return NextResponse.json(fresh ?? user);
}
