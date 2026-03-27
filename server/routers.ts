import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";
import { sendLeadConfirmationEmail } from "./email";
import { markConfirmationSent, upsertLead } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  leads: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          first_name: z.string().optional(),
          last_name: z.string().optional(),
          channel: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const response = await fetch(
          "https://fcgjhzccucyyrpgggjwj.supabase.co/functions/v1/subscribe-lead",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": ENV.hdlApiKey,
            },
            body: JSON.stringify({
              email: input.email,
              first_name: input.first_name,
              last_name: input.last_name,
              source: "merchdrop",
              tags: ["hdl_newsletter", "merchdrop_lead"],
              track: "merchdrop",
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[HDL API Error]", response.status, errorText);
          throw new Error("Kunde inte spara lead");
        }

        const data = await response.json();

        // Notify owner about new lead
        const isNew = data.isNewLead ?? true;
        const name = [input.first_name, input.last_name].filter(Boolean).join(" ") || "Okänt namn";
        const channel = input.channel ? ` | Kanal: ${input.channel}` : "";
        const desc = input.description ? `\n\nOm sig själv: ${input.description}` : "";
        await notifyOwner({
          title: isNew ? `🎉 Ny MerchDrop-lead: ${name}` : `🔄 Återkommande lead: ${name}`,
          content: `E-post: ${input.email}${channel}${desc}`,
        });

        // Persist lead in DB for follow-up email tracking (best-effort)
        upsertLead({
          email: input.email,
          firstName: input.first_name,
          lastName: input.last_name,
          channel: input.channel,
          description: input.description,
        }).catch((err) => console.error("[DB] Failed to upsert lead:", err));

        // Send confirmation email to the lead (best-effort, non-blocking)
        sendLeadConfirmationEmail({
          toEmail: input.email,
          firstName: input.first_name ?? name,
        }).then((sent) => {
          if (sent) {
            markConfirmationSent(input.email).catch((err) =>
              console.error("[DB] Failed to mark confirmation sent:", err)
            );
          }
        }).catch((err) => console.error("[Email] Unexpected error:", err));

        return { success: true, isNewLead: isNew };
      }),
  }),
});

export type AppRouter = typeof appRouter;
