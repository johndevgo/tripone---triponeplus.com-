import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const [, , sourceArgument, destinationArgument] = process.argv;

if (!sourceArgument) {
  throw new Error(
    "Usage: node scripts/import-seo-catalog.mjs <source.tsv> [destination.json]",
  );
}

const source = resolve(sourceArgument);
const destination = resolve(
  destinationArgument ?? "src/content/seo-catalog.generated.json",
);
const text = await readFile(source, "utf8");
const lines = text.split(/\r?\n/);
const header = lines[0]?.split("\t");

if (!header || header.length !== 20) {
  throw new Error(
    "The SEO catalog must contain the expected 20-column header.",
  );
}

const clean = (value) =>
  value
    .replace(/^\uFEFF/, "")
    .trim()
    .normalize("NFC");

const splitList = (value) =>
  clean(value)
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

const records = [];
for (const line of lines.slice(1)) {
  if (!line.trim()) break;
  const columns = line.split("\t");
  if (columns.length !== header.length) {
    throw new Error(
      `Row ${records.length + 2} contains ${columns.length} columns instead of ${header.length}.`,
    );
  }
  const [
    sn,
    pageType,
    title,
    primaryKeyword,
    secondaryKeywords,
    keywordCluster,
    path,
    entities,
    metaTitle,
    metaDescription,
    faqs,
    intent,
    funnelStage,
    vertical,
    internalLinks,
    inboundLinks,
    contentAngle,
    cta,
    priority,
    demandSignal,
  ] = columns.map(clean);

  records.push({
    sn: Number(sn),
    pageType,
    title,
    primaryKeyword,
    secondaryKeywords: splitList(secondaryKeywords),
    keywordCluster,
    path,
    entities: splitList(entities),
    metaTitle,
    metaDescription,
    faqs: splitList(faqs),
    intent,
    funnelStage,
    vertical,
    internalLinks: splitList(internalLinks),
    inboundLinks: splitList(inboundLinks),
    contentAngle,
    cta,
    priority,
    demandSignal,
  });
}

if (records.length !== 138) {
  throw new Error(`Expected 138 catalog records but parsed ${records.length}.`);
}

const paths = new Set(records.map((record) => record.path));
if (paths.size !== records.length) {
  throw new Error("The SEO catalog contains duplicate paths.");
}

await writeFile(destination, `${JSON.stringify(records, null, 2)}\n`, "utf8");
console.log(`Generated ${records.length} SEO page records at ${destination}.`);
