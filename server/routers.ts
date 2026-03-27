import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";

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
        return { success: true, isNewLead: data.isNewLead ?? true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
