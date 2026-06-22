import { afterEach, describe, expect, it } from "vitest";
import { createSessionCookie, isAuthenticated, verifyPassword } from "../../api/_lib/auth";
import { readJsonBody } from "../../api/_lib/http";
import type { ApiRequest } from "../../api/_lib/http";
import { isContentData } from "../../shared/content";

const originalPassword = process.env.ADMIN_PASSWORD;
const originalSecret = process.env.SESSION_SECRET;

afterEach(() => {
  if (originalPassword === undefined) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = originalPassword;

  if (originalSecret === undefined) delete process.env.SESSION_SECRET;
  else process.env.SESSION_SECRET = originalSecret;
});

describe("admin authentication", () => {
  it("creates and validates a server-side session cookie", () => {
    process.env.ADMIN_PASSWORD = "test-password";
    process.env.SESSION_SECRET = "test-secret-with-enough-entropy";
    const request = { headers: {} } as ApiRequest;

    expect(verifyPassword("test-password")).toBe(true);
    expect(verifyPassword("wrong-password")).toBe(false);

    const cookie = createSessionCookie(request).split(";", 1)[0];
    expect(isAuthenticated({ headers: { cookie } } as ApiRequest)).toBe(true);
  });
});

describe("API JSON parsing", () => {
  it("parses valid JSON supplied by Vercel", async () => {
    const request = { body: '{"ok":true}', headers: {} } as ApiRequest;
    await expect(readJsonBody(request)).resolves.toEqual({ ok: true });
  });

  it("maps a malformed Vercel body to a 400 error", async () => {
    const request = { headers: {} } as ApiRequest;
    Object.defineProperty(request, "body", { get: () => { throw new Error("Invalid JSON"); } });

    await expect(readJsonBody(request)).rejects.toMatchObject({ statusCode: 400 });
  });
});

describe("shared content validation", () => {
  it("accepts complete content and rejects malformed records", () => {
    expect(isContentData({ courses: [], subjects: [], topics: [], resources: [] })).toBe(true);
    expect(isContentData({ courses: [{}], subjects: [], topics: [], resources: [] })).toBe(false);
  });
});
