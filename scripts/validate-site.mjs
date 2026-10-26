import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
let htmlCount = 0;
let internalReferenceCount = 0;
const seoPages = new Map([
  ["products/index.html", "https://jessekapps.com/products/"],
  ["products/jesse-k-mileage/index.html", "https://jessekapps.com/products/jesse-k-mileage/"],
  ["products/jesse-k-books/index.html", "https://jessekapps.com/products/jesse-k-books/"],
  ["products/jk-connect/index.html", "https://jessekapps.com/products/jk-connect/"],
]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

function localTarget(reference) {
  if (!reference.startsWith("/") || reference.startsWith("//")) return null;
  const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
  const relative = pathname.slice(1);
  if (!relative) return path.join(root, "index.html");
  return path.join(root, relative.endsWith("/") ? relative + "index.html" : relative);
}

for (const file of await walk(root)) {
  if (!file.endsWith(".html")) continue;
  htmlCount += 1;
  const relative = path.relative(root, file);
  const html = await readFile(file, "utf8");

  if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${relative}: missing title`);
  if (!/<meta name="description" content="[^"]+">/i.test(html)) failures.push(`${relative}: missing meta description`);
  if (!/name="robots" content="noindex/i.test(html) && !/<link rel="canonical" href="https:\/\/jessekapps\.com\/[^"]*">/i.test(html)) failures.push(`${relative}: missing canonical URL`);
  if (!/<main[^>]+id="main"/i.test(html)) failures.push(`${relative}: missing #main landmark`);

  if (seoPages.has(relative)) {
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "";
    const description = html.match(/<meta name="description" content="([^"]+)">/i)?.[1] ?? "";
    const canonical = html.match(/<link rel="canonical" href="([^"]+)">/i)?.[1] ?? "";
    const h1Count = [...html.matchAll(/<h1(?:\s[^>]*)?>/gi)].length;

    if (title.length < 30 || title.length > 65) failures.push(`${relative}: title length ${title.length} is outside 30-65 characters`);
    if (description.length < 120 || description.length > 160) failures.push(`${relative}: meta description length ${description.length} is outside 120-160 characters`);
    if (canonical !== seoPages.get(relative)) failures.push(`${relative}: canonical URL does not match the public route`);
    if (h1Count !== 1) failures.push(`${relative}: expected one h1, found ${h1Count}`);
    if (/name="robots" content="[^"]*noindex/i.test(html)) failures.push(`${relative}: target SEO page must be indexable`);
  }

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length) failures.push(`${relative}: duplicate ids ${[...new Set(duplicates)].join(", ")}`);

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); }
    catch (error) { failures.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const target = localTarget(match[1]);
    if (!target) continue;
    internalReferenceCount += 1;
    try { await stat(target); }
    catch { failures.push(`${relative}: missing local target ${match[1]}`); }
  }
}

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Validated ${htmlCount} HTML files and ${internalReferenceCount} internal references.`);
