import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// TODO: Add your tables here

/**
 * Tracks MerchDrop leads and their email communication state.
 * Used to schedule and record follow-up emails.
 */
export const merchdropLeads = mysqlTable("merchdrop_leads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 128 }),
  lastName: varchar("lastName", { length: 128 }),
  channel: text("channel"),
  description: text("description"),
  /** Timestamp when the lead submitted the form */
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  /** Timestamp when the confirmation email was sent (null = not yet sent) */
  confirmationSentAt: timestamp("confirmationSentAt"),
  /** Timestamp when the follow-up email was sent (null = not yet sent) */
  followupSentAt: timestamp("followupSentAt"),
  /** Whether the lead has been marked as contacted/handled by the team */
  isContacted: int("isContacted").default(0).notNull(),
});

export type MerchdropLead = typeof merchdropLeads.$inferSelect;
export type InsertMerchdropLead = typeof merchdropLeads.$inferInsert;