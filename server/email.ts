import { Resend } from "resend";
import { ENV } from "./_core/env";

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  if (!ENV.resendApiKey) return null;
  if (!resendClient) {
    resendClient = new Resend(ENV.resendApiKey);
  }
  return resendClient;
}

export type LeadFollowupEmailParams = {
  toEmail: string;
  firstName: string;
};

export type LeadConfirmationEmailParams = {
  toEmail: string;
  firstName: string;
};

/**
 * Sends a branded confirmation email to the lead after form submission.
 * Returns true on success, false if Resend is not configured or the send fails.
 */
export async function sendLeadConfirmationEmail(
  params: LeadConfirmationEmailParams
): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] Resend API key not configured - skipping confirmation email");
    return false;
  }

  const { toEmail, firstName } = params;
  const name = firstName || "Creator";

  const html = `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Välkommen till MerchDrop!</title>
</head>
<body style="margin:0;padding:0;background-color:#0F0A1E;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F0A1E;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/merchdrop_logo_final_f25cafe4.png"
                alt="MerchDrop" height="48" style="display:block;" />
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0f3a,#2d1050);border-radius:24px;padding:48px 40px;text-align:center;border:1px solid rgba(168,85,247,0.2);">

              <!-- Checkmark icon -->
              <div style="display:inline-block;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#ec4899);text-align:center;line-height:72px;margin-bottom:24px;">
                <span style="font-size:32px;line-height:72px;display:inline-block;">✓</span>
              </div>

              <h1 style="color:#ffffff;font-size:32px;font-weight:800;margin:0 0 12px;line-height:1.2;">
                Du är med på listan, ${name}! 🚀
              </h1>
              <p style="color:rgba(255,255,255,0.65);font-size:17px;line-height:1.6;margin:0 0 32px;">
                Vi har tagit emot din ansökan och hör av oss inom <strong style="color:#ffffff;">48 timmar</strong> för att sätta upp din personliga merch-butik.
              </p>

              <!-- CTA button -->
              <a href="https://merchdrop.se/tack" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#ec4899);color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 36px;border-radius:100px;margin-bottom:8px;">
                Se vad som händer nu →
              </a>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="padding:32px 0 0;">
              <h2 style="color:#ffffff;font-size:20px;font-weight:700;margin:0 0 24px;text-align:center;">
                Vad händer nu?
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;padding-top:2px;">
                                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#ec4899);text-align:center;line-height:32px;font-size:14px;">📧</div>
                              </td>
                              <td style="padding-left:16px;">
                                <p style="color:#ffffff;font-weight:700;font-size:15px;margin:0 0 4px;">Kolla din e-post</p>
                                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;line-height:1.5;">Du har precis fått det här bekräftelsemailet. Spara det gärna!</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;padding-top:2px;">
                                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#ec4899,#f97316);text-align:center;line-height:32px;font-size:14px;">⏱</div>
                              </td>
                              <td style="padding-left:16px;">
                                <p style="color:#ffffff;font-weight:700;font-size:15px;margin:0 0 4px;">Vi hör av oss inom 48h</p>
                                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;line-height:1.5;">Vårt team granskar din ansökan och kontaktar dig för att diskutera din butik.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;padding-top:2px;">
                                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#f97316,#eab308);text-align:center;line-height:32px;font-size:14px;">⚡</div>
                              </td>
                              <td style="padding-left:16px;">
                                <p style="color:#ffffff;font-weight:700;font-size:15px;margin:0 0 4px;">Din butik sätts upp</p>
                                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;line-height:1.5;">Vi designar och lanserar din personliga merch-butik - helt utan att du behöver lyfta ett finger.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);">
                      <tr>
                        <td style="padding:20px 24px;">
                          <table cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:40px;vertical-align:top;padding-top:2px;">
                                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#eab308,#7c3aed);text-align:center;line-height:32px;font-size:14px;">💰</div>
                              </td>
                              <td style="padding-left:16px;">
                                <p style="color:#ffffff;font-weight:700;font-size:15px;margin:0 0 4px;">Börja tjäna pengar</p>
                                <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0;line-height:1.5;">Dela länken med dina fans och se provisionen rulla in. 30% på varje försäljning.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);margin-top:32px;">
              <p style="color:rgba(255,255,255,0.3);font-size:13px;margin:0 0 8px;">
                © ${new Date().getFullYear()} MerchDrop. Alla rättigheter förbehållna.
              </p>
              <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
                Byggt av <a href="https://conversify.io" style="color:rgba(168,85,247,0.7);text-decoration:none;">Conversify.io</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Hej ${name}!

Du är med på listan! 🚀

Vi har tagit emot din ansökan och hör av oss inom 48 timmar för att sätta upp din personliga merch-butik.

Vad händer nu?
1. Kolla din e-post - du har precis fått det här bekräftelsemailet.
2. Vi hör av oss inom 48h - vårt team granskar din ansökan.
3. Din butik sätts upp - vi designar och lanserar din merch-butik.
4. Börja tjäna pengar - 30% provision på varje försäljning.

Se mer på: https://merchdrop.se/tack

Med vänliga hälsningar,
MerchDrop-teamet

---
© ${new Date().getFullYear()} MerchDrop | Byggt av Conversify.io
  `.trim();

  try {
    const result = await resend.emails.send({
      from: "MerchDrop <noreply@merchdrop.se>",
      to: [toEmail],
      subject: `Välkommen till MerchDrop, ${name}! Din ansökan är mottagen 🚀`,
      html,
      text,
    });

    if (result.error) {
      console.error("[Email] Resend error:", result.error);
      return false;
    }

    console.log("[Email] Confirmation sent to", toEmail, "id:", result.data?.id);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send confirmation email:", err);
    return false;
  }
}

/**
 * Sends a branded follow-up email to a lead ~48h after signup.
 * Only called if the lead has not yet been contacted by the team.
 * Returns true on success, false if Resend is not configured or the send fails.
 */
export async function sendLeadFollowupEmail(
  params: LeadFollowupEmailParams
): Promise<boolean> {
  const resend = getResend();
  if (!resend) {
    console.warn("[Email] Resend API key not configured - skipping follow-up email");
    return false;
  }

  const { toEmail, firstName } = params;
  const name = firstName || "Creator";

  const html = `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Har du frågor om din MerchDrop-butik?</title>
</head>
<body style="margin:0;padding:0;background-color:#0F0A1E;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F0A1E;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663450584758/XErJVV8ZFJdEBccSE4fBzi/merchdrop_logo_final_f25cafe4.png"
                alt="MerchDrop" height="48" style="display:block;" />
            </td>
          </tr>

          <!-- Hero card -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0f3a,#2d1050);border-radius:24px;padding:48px 40px;text-align:center;border:1px solid rgba(168,85,247,0.2);">

              <!-- Reminder icon -->
              <div style="display:inline-block;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#ec4899,#f97316);text-align:center;line-height:72px;margin-bottom:24px;">
                <span style="font-size:32px;line-height:72px;display:inline-block;">👋</span>
              </div>

              <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0 0 12px;line-height:1.2;">
                Hej ${name}, hur går det?
              </h1>
              <p style="color:rgba(255,255,255,0.65);font-size:17px;line-height:1.6;margin:0 0 12px;">
                Du anmälde dig till MerchDrop för ett par dagar sedan - vi vill bara kolla att allt är bra och att du inte har några frågor.
              </p>
              <p style="color:rgba(255,255,255,0.65);font-size:17px;line-height:1.6;margin:0 0 32px;">
                Vårt team jobbar på att sätta upp din butik och hör av sig inom kort. Om du är nyfiken eller vill veta mer - svara gärna på det här mailet!
              </p>

              <!-- CTA button -->
              <a href="https://merchdrop.se" style="display:inline-block;background:linear-gradient(135deg,#ec4899,#f97316);color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 36px;border-radius:100px;margin-bottom:8px;">
                Besök MerchDrop →
              </a>
            </td>
          </tr>

          <!-- Value reminder -->
          <tr>
            <td style="padding:32px 0 0;">
              <h2 style="color:#ffffff;font-size:18px;font-weight:700;margin:0 0 20px;text-align:center;">
                Påminn dig om vad du får
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="padding:0 8px 0 0;vertical-align:top;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);text-align:center;">
                      <tr>
                        <td style="padding:20px 16px;">
                          <div style="font-size:28px;margin-bottom:8px;">🆓</div>
                          <p style="color:#ffffff;font-weight:700;font-size:14px;margin:0 0 4px;">100% Gratis</p>
                          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;line-height:1.4;">Ingen startkostnad, inga dolda avgifter</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding:0 4px;vertical-align:top;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);text-align:center;">
                      <tr>
                        <td style="padding:20px 16px;">
                          <div style="font-size:28px;margin-bottom:8px;">💰</div>
                          <p style="color:#ffffff;font-weight:700;font-size:14px;margin:0 0 4px;">30% Provision</p>
                          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;line-height:1.4;">Du tjänar på varje försäljning</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="33%" style="padding:0 0 0 8px;vertical-align:top;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:16px;border:1px solid rgba(255,255,255,0.08);text-align:center;">
                      <tr>
                        <td style="padding:20px 16px;">
                          <div style="font-size:28px;margin-bottom:8px;">📦</div>
                          <p style="color:#ffffff;font-weight:700;font-size:14px;margin:0 0 4px;">Vi sköter allt</p>
                          <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0;line-height:1.4;">Tryck, frakt och kundservice</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding:32px 0 0;text-align:center;">
              <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:0 0 16px;">
                Har du frågor? Svara direkt på det här mailet - vi svarar inom 24 timmar.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:40px;text-align:center;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="color:rgba(255,255,255,0.3);font-size:13px;margin:0 0 8px;">
                © ${new Date().getFullYear()} MerchDrop. Alla rättigheter förbehållna.
              </p>
              <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
                Byggt av <a href="https://conversify.io" style="color:rgba(168,85,247,0.7);text-decoration:none;">Conversify.io</a>
              </p>
              <p style="color:rgba(255,255,255,0.15);font-size:11px;margin:8px 0 0;">
                Du får det här mailet för att du anmält dig på merchdrop.se.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Hej ${name}!

Du anmälde dig till MerchDrop för ett par dagar sedan - vi vill bara kolla att allt är bra.

Vårt team jobbar på att sätta upp din butik och hör av sig inom kort. Om du har frågor - svara gärna på det här mailet!

Påminn dig om vad du får:
- 100% Gratis att starta - ingen startkostnad
- 30% Provision på varje försäljning
- Vi sköter allt - tryck, frakt och kundservice

Besök oss: https://merchdrop.se

Med vänliga hälsningar,
MerchDrop-teamet

---
© ${new Date().getFullYear()} MerchDrop | Byggt av Conversify.io
Du får det här mailet för att du anmält dig på merchdrop.se.
  `.trim();

  try {
    const result = await resend.emails.send({
      from: "MerchDrop <noreply@merchdrop.se>",
      to: [toEmail],
      subject: `Hej ${name}, hur går det med din merch-butik? 👋`,
      html,
      text,
    });

    if (result.error) {
      console.error("[Email] Resend follow-up error:", result.error);
      return false;
    }

    console.log("[Email] Follow-up sent to", toEmail, "id:", result.data?.id);
    return true;
  } catch (err) {
    console.error("[Email] Failed to send follow-up email:", err);
    return false;
  }
}
