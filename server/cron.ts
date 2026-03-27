/**
 * Cron job handler for sending follow-up emails to leads.
 *
 * Endpoint: POST /api/cron/followup-emails
 * Protected by a shared CRON_SECRET header so only authorised callers can trigger it.
 *
 * Intended to be called every hour by an external cron service (e.g. cron-job.org, Upstash, etc.)
 * The handler is idempotent - it only sends to leads that:
 *   - Submitted >= 48 hours ago
 *   - Have NOT yet received a follow-up email
 *   - Have NOT been marked as contacted
 */

import { Router } from "express";
import { getLeadsDueForFollowup, markFollowupSent } from "./db";
import { sendLeadFollowupEmail } from "./email";
import { ENV } from "./_core/env";

export function registerCronRoutes(app: Router) {
  app.post("/api/cron/followup-emails", async (req, res) => {
    // Simple secret-based auth to prevent unauthorised triggers
    const secret = req.headers["x-cron-secret"];
    if (!ENV.cronSecret || secret !== ENV.cronSecret) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const leads = await getLeadsDueForFollowup();
      console.log(`[Cron] Found ${leads.length} lead(s) due for follow-up`);

      const results = await Promise.allSettled(
        leads.map(async (lead) => {
          const sent = await sendLeadFollowupEmail({
            toEmail: lead.email,
            firstName: lead.firstName ?? "",
          });

          if (sent) {
            await markFollowupSent(lead.email);
            console.log(`[Cron] Follow-up sent to ${lead.email}`);
          } else {
            console.warn(`[Cron] Failed to send follow-up to ${lead.email}`);
          }

          return { email: lead.email, sent };
        })
      );

      const sent = results.filter(
        (r) => r.status === "fulfilled" && r.value.sent
      ).length;
      const failed = results.length - sent;

      res.json({
        success: true,
        processed: results.length,
        sent,
        failed,
      });
    } catch (err) {
      console.error("[Cron] Error processing follow-up emails:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
