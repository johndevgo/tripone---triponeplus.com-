import { z } from "zod";

const pathRule = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .regex(/^\/(?!\/)/, "Paths must start with one slash.");

export const advancedScriptSchema = z
  .object({
    id: z
      .string()
      .min(8)
      .max(100)
      .regex(/^[a-zA-Z0-9_-]+$/),
    name: z.string().trim().min(2).max(80),
    placement: z.enum(["head", "body_start", "body_end"]),
    consentCategory: z.enum(["essential", "analytics", "marketing"]),
    enabled: z.boolean(),
    sourceUrl: z.union([
      z.literal(""),
      z.url().refine((value) => value.startsWith("https://"), {
        message: "External scripts must use HTTPS.",
      }),
    ]),
    code: z.string().max(20_000),
    includePaths: z.array(pathRule).max(50),
    excludePaths: z.array(pathRule).max(50),
  })
  .refine((script) => script.sourceUrl || script.code.trim(), {
    message: "Add an HTTPS source URL or JavaScript code.",
  });

export const advancedScriptsSchema = z.array(advancedScriptSchema).max(20);
export type AdvancedScript = z.infer<typeof advancedScriptSchema>;

export function parseAdvancedScripts(value: unknown): AdvancedScript[] {
  const parsed = advancedScriptsSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

export function scriptMatchesPath(script: AdvancedScript, pathname: string) {
  const path = normalizePath(pathname);
  const included =
    script.includePaths.length === 0 ||
    script.includePaths.some((rule) => matchesRule(path, rule));
  return (
    script.enabled &&
    included &&
    !script.excludePaths.some((rule) => matchesRule(path, rule))
  );
}

export function parsePathRules(value: string) {
  return [...new Set(value.split(/[\n,]/).map(normalizePath).filter(Boolean))];
}

export function safeInlineScript(code: string) {
  return code.replace(/<\/script/gi, "<\\/script");
}

function matchesRule(pathname: string, rule: string) {
  const normalized = normalizePath(rule);
  if (normalized === "/*") return true;
  if (normalized.endsWith("/*")) {
    const prefix = normalized.slice(0, -2);
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  }
  return pathname === normalized;
}

function normalizePath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const wildcard = trimmed.endsWith("/*");
  const rawPath = wildcard ? trimmed.slice(0, -2) : trimmed;
  const base = rawPath
    .replace(/^\/+/, "/")
    .replace(/\/{2,}/g, "/")
    .replace(/\/$/, "");
  if (!wildcard) return base || "/";
  return base && base !== "/" ? `${base}/*` : "/*";
}
