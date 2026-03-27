import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("leads.subscribe", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("calls HDL API and returns success for a new lead", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: "Tack!", isNewLead: true }),
    });

    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.leads.subscribe({
      email: "test@merchdrop.se",
      first_name: "Anna",
      last_name: "Svensson",
      channel: "@annatest",
    });

    expect(result.success).toBe(true);
    expect(result.isNewLead).toBe(true);

    // Verify the API was called with correct payload
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe("https://fcgjhzccucyyrpgggjwj.supabase.co/functions/v1/subscribe-lead");
    const body = JSON.parse(options.body);
    expect(body.email).toBe("test@merchdrop.se");
    expect(body.source).toBe("merchdrop");
    expect(body.track).toBe("merchdrop");
    expect(body.tags).toContain("merchdrop_lead");
  });

  it("throws an error when HDL API returns non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    });

    const caller = appRouter.createCaller(createPublicContext());
    await expect(
      caller.leads.subscribe({ email: "bad@test.se" })
    ).rejects.toThrow();
  });
});
