import { describe, expect, it, vi, beforeEach } from "vitest";
import express from "express";
import request from "supertest";

// Mock DB helpers
vi.mock("./db", () => ({
  getLeadsDueForFollowup: vi.fn(),
  markFollowupSent: vi.fn().mockResolvedValue(undefined),
  upsertLead: vi.fn().mockResolvedValue(undefined),
  markConfirmationSent: vi.fn().mockResolvedValue(undefined),
}));

// Mock email helpers
vi.mock("./email", () => ({
  sendLeadFollowupEmail: vi.fn().mockResolvedValue(true),
  sendLeadConfirmationEmail: vi.fn().mockResolvedValue(true),
}));

// Mock ENV with a known cron secret
vi.mock("./_core/env", () => ({
  ENV: {
    cronSecret: "test-cron-secret-abc123",
    resendApiKey: "re_test_key",
    hdlApiKey: "hdl_test",
    forgeApiUrl: "https://forge.example.com",
    forgeApiKey: "forge_test",
    appId: "",
    cookieSecret: "",
    databaseUrl: "",
    oAuthServerUrl: "",
    ownerOpenId: "",
    isProduction: false,
  },
}));

import { registerCronRoutes } from "./cron";
import { getLeadsDueForFollowup, markFollowupSent } from "./db";
import { sendLeadFollowupEmail } from "./email";

function buildApp() {
  const app = express();
  app.use(express.json());
  registerCronRoutes(app);
  return app;
}

describe("POST /api/cron/followup-emails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when no cron secret is provided", async () => {
    const app = buildApp();
    const res = await request(app).post("/api/cron/followup-emails");
    expect(res.status).toBe(401);
  });

  it("returns 401 when wrong cron secret is provided", async () => {
    const app = buildApp();
    const res = await request(app)
      .post("/api/cron/followup-emails")
      .set("x-cron-secret", "wrong-secret");
    expect(res.status).toBe(401);
  });

  it("returns 200 with zero processed when no leads are due", async () => {
    vi.mocked(getLeadsDueForFollowup).mockResolvedValue([]);
    const app = buildApp();
    const res = await request(app)
      .post("/api/cron/followup-emails")
      .set("x-cron-secret", "test-cron-secret-abc123");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.processed).toBe(0);
    expect(res.body.sent).toBe(0);
  });

  it("sends follow-up emails and marks them as sent", async () => {
    const mockLeads = [
      {
        id: 1,
        email: "creator1@test.se",
        firstName: "Anna",
        lastName: "Svensson",
        channel: "@anna",
        description: null,
        submittedAt: new Date(Date.now() - 50 * 60 * 60 * 1000),
        confirmationSentAt: new Date(),
        followupSentAt: null,
        isContacted: 0,
      },
      {
        id: 2,
        email: "creator2@test.se",
        firstName: "Erik",
        lastName: null,
        channel: null,
        description: null,
        submittedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        confirmationSentAt: null,
        followupSentAt: null,
        isContacted: 0,
      },
    ];

    vi.mocked(getLeadsDueForFollowup).mockResolvedValue(mockLeads);
    vi.mocked(sendLeadFollowupEmail).mockResolvedValue(true);

    const app = buildApp();
    const res = await request(app)
      .post("/api/cron/followup-emails")
      .set("x-cron-secret", "test-cron-secret-abc123");

    expect(res.status).toBe(200);
    expect(res.body.processed).toBe(2);
    expect(res.body.sent).toBe(2);
    expect(res.body.failed).toBe(0);

    // Verify follow-up email was called for each lead
    expect(sendLeadFollowupEmail).toHaveBeenCalledTimes(2);
    expect(sendLeadFollowupEmail).toHaveBeenCalledWith({
      toEmail: "creator1@test.se",
      firstName: "Anna",
    });

    // Verify markFollowupSent was called for each lead
    expect(markFollowupSent).toHaveBeenCalledTimes(2);
    expect(markFollowupSent).toHaveBeenCalledWith("creator1@test.se");
    expect(markFollowupSent).toHaveBeenCalledWith("creator2@test.se");
  });

  it("counts failed sends correctly when email sending fails", async () => {
    vi.mocked(getLeadsDueForFollowup).mockResolvedValue([
      {
        id: 3,
        email: "fail@test.se",
        firstName: "Test",
        lastName: null,
        channel: null,
        description: null,
        submittedAt: new Date(Date.now() - 50 * 60 * 60 * 1000),
        confirmationSentAt: null,
        followupSentAt: null,
        isContacted: 0,
      },
    ]);
    vi.mocked(sendLeadFollowupEmail).mockResolvedValue(false);

    const app = buildApp();
    const res = await request(app)
      .post("/api/cron/followup-emails")
      .set("x-cron-secret", "test-cron-secret-abc123");

    expect(res.status).toBe(200);
    expect(res.body.processed).toBe(1);
    expect(res.body.sent).toBe(0);
    expect(res.body.failed).toBe(1);
    // markFollowupSent should NOT be called when email fails
    expect(markFollowupSent).not.toHaveBeenCalled();
  });
});

describe("CRON_SECRET configuration", () => {
  it("is set in the environment", () => {
    const secret = process.env.CRON_SECRET ?? "";
    expect(secret.length).toBeGreaterThan(0);
  });
});
