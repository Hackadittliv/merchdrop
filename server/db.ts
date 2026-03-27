import { and, eq, isNull, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertMerchdropLead, InsertUser, merchdropLeads, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

/** Upsert a MerchDrop lead (insert or update on duplicate email) */
export async function upsertLead(lead: InsertMerchdropLead): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert lead: database not available");
    return;
  }
  await db
    .insert(merchdropLeads)
    .values(lead)
    .onDuplicateKeyUpdate({
      set: {
        firstName: lead.firstName,
        lastName: lead.lastName,
        channel: lead.channel,
        description: lead.description,
      },
    });
}

/** Mark confirmation email as sent for a lead */
export async function markConfirmationSent(email: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(merchdropLeads)
    .set({ confirmationSentAt: new Date() })
    .where(eq(merchdropLeads.email, email));
}

/** Mark follow-up email as sent for a lead */
export async function markFollowupSent(email: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(merchdropLeads)
    .set({ followupSentAt: new Date() })
    .where(eq(merchdropLeads.email, email));
}

/**
 * Returns leads that:
 * - Submitted >= 48 hours ago
 * - Have NOT yet received a follow-up email
 * - Have NOT been marked as contacted
 */
export async function getLeadsDueForFollowup() {
  const db = await getDb();
  if (!db) return [];
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  return db
    .select()
    .from(merchdropLeads)
    .where(
      and(
        lt(merchdropLeads.submittedAt, cutoff),
        isNull(merchdropLeads.followupSentAt),
        eq(merchdropLeads.isContacted, 0)
      )
    );
}
