import { afterEach, describe, expect, it, vi } from "vitest";
import { addProviderDomain } from "./provider";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
});

describe("Vercel domain verification", () => {
  it("keeps a project-owned domain pending while DNS is misconfigured", async () => {
    configureProvider();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response({ verified: true }))
        .mockResolvedValueOnce(response({ misconfigured: true })),
    );
    const result = await addProviderDomain("booking.example.com");
    expect(result.projectVerified).toBe(true);
    expect(result.dnsConfigured).toBe(false);
    expect(result.verified).toBe(false);
  });

  it("marks a domain ready only after ownership and DNS both pass", async () => {
    configureProvider();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response({ verified: true }))
        .mockResolvedValueOnce(
          response({
            misconfigured: false,
            recommendedCNAME: [{ value: "cname.vercel-dns.com" }],
          }),
        ),
    );
    const result = await addProviderDomain("booking.example.com");
    expect(result.verified).toBe(true);
    expect(result.records).toContainEqual({
      type: "CNAME",
      domain: "booking",
      value: "cname.vercel-dns.com",
    });
  });
});

function configureProvider() {
  process.env.VERCEL_TOKEN = "test-token";
  process.env.VERCEL_PROJECT_ID = "test-project";
  delete process.env.VERCEL_TEAM_ID;
}

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
