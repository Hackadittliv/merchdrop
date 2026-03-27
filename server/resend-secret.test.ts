import { describe, expect, it } from "vitest";

/**
 * Validates that the RESEND_API_KEY environment variable is configured
 * and has the expected format (starts with "re_").
 */
describe("RESEND_API_KEY configuration", () => {
  it("is set and has the expected Resend API key format", () => {
    const key = process.env.RESEND_API_KEY ?? "";
    expect(key.length).toBeGreaterThan(0);
    expect(key.startsWith("re_")).toBe(true);
  });
});
