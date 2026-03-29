import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";
import { z } from "zod";
import { sendLeadConfirmationEmail } from "./email";
import { createDesign, markConfirmationSent, markDesignFailed, updateDesignUrl, upsertLead } from "./db";

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

  designs: router({
    generate: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          industry: z.string().optional(),
          vibe: z.string().optional(),
          slogan: z.string().optional(),
          colorPreference: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Create pending design record
        const designId = await createDesign({
          leadEmail: input.email,
          industry: input.industry,
          vibe: input.vibe,
          slogan: input.slogan,
          colorPreference: input.colorPreference,
          status: "pending",
        });

        // Build a rich prompt from the brief
        const industry = input.industry || "lifestyle";
        const vibe = input.vibe || "modern streetwear";
        const slogan = input.slogan || "";
        const color = input.colorPreference || "black and white";

        const sloganPart = slogan ? `, featuring the text "${slogan}"` : "";
        const prompt = `Professional t-shirt graphic design artwork, flat print-ready illustration on a clean white background. Style: ${vibe}, inspired by ${industry} culture${sloganPart}. Color palette: ${color}. Bold typography, high contrast, suitable for screen printing. No t-shirt shown, just the graphic artwork isolated on white. Highly detailed, commercial quality.`;

        try {
          // Call OpenAI image generation
          const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${ENV.openaiApiKey}`,
            },
            body: JSON.stringify({
              model: "dall-e-3",
              prompt,
              n: 1,
              size: "1024x1024",
              quality: "standard",
              response_format: "url",
            }),
          });

          if (!openaiRes.ok) {
            const errText = await openaiRes.text();
            console.error("[OpenAI] Image gen error:", openaiRes.status, errText);
            if (designId) await markDesignFailed(designId);
            throw new Error("Kunde inte generera design");
          }

          const openaiData = await openaiRes.json() as { data: { url: string }[] };
          const imageUrl = openaiData.data[0]?.url;

          if (!imageUrl) {
            if (designId) await markDesignFailed(designId);
            throw new Error("Ingen bild returnerades");
          }

          // Persist the URL
          if (designId) await updateDesignUrl(designId, imageUrl);

          // Notify owner
          await notifyOwner({
            title: `🎨 Ny design genererad för ${input.email}`,
            content: `Bransch: ${industry} | Känsla: ${vibe} | Slogan: ${slogan || "(ingen)"}`,
          });

          return { success: true, designUrl: imageUrl, designId };
        } catch (err) {
          if (designId) await markDesignFailed(designId).catch(() => {});
          throw err;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
