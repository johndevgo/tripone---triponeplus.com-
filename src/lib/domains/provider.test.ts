import { afterEach, describe, expect, it, vi } from "vitest";
import { addProviderDomain, verifyProviderDomain } from "./provider";

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

  it("shows one ranked route record and a separate ownership challenge", async () => {
    configureProvider();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          response({
            verified: false,
            verification: [
              {
                type: "CNAME",
                domain: "booking",
                value: "cname.vercel-dns.com",
              },
              {
                type: "TXT",
                domain: "_vercel",
                value: "vc-domain-verify=example",
              },
            ],
          }),
        )
        .mockResolvedValueOnce(
          response({
            misconfigured: true,
            recommendedCNAME: [
              { value: "cname.vercel-dns.com", rank: 10 },
              { value: "project.vercel-dns-017.com", rank: 1 },
            ],
          }),
        ),
    );
    const result = await addProviderDomain("booking.example.com");
    expect(result.records).toEqual([
      {
        type: "CNAME",
        domain: "booking",
        value: "project.vercel-dns-017.com",
      },
      {
        type: "TXT",
        domain: "_vercel",
        value: "vc-domain-verify=example",
        reason: undefined,
      },
    ]);
  });

  it("keeps a manual verification check pending when Vercel returns 400", async () => {
    configureProvider();
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(response({ message: "not verified" }, 400))
        .mockResolvedValueOnce(response({ verified: false }))
        .mockResolvedValueOnce(
          response({
            misconfigured: true,
            recommendedCNAME: [
              { value: "project.vercel-dns-017.com", rank: 1 },
            ],
          }),
        ),
    );
    const result = await verifyProviderDomain("booking.example.com");
    expect(result.verified).toBe(false);
    expect(result.records).toEqual([
      {
        type: "CNAME",
        domain: "booking",
        value: "project.vercel-dns-017.com",
      },
    ]);
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
