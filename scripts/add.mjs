import { access, copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const [name, rootFlag, rootValue] = process.argv.slice(2);

if (!name || rootFlag !== "--root" || !rootValue) {
  console.error("Usage: node scripts/add.mjs <item> --root /path/to/consumer-app");
  process.exit(1);
}

const consumerRoot = isAbsolute(rootValue) ? rootValue : resolve(process.cwd(), rootValue);
const registry = JSON.parse(await readFile(join(repoRoot, "registry.json"), "utf8"));
const byName = new Map(registry.items.map((item) => [item.name, item]));
const selected = byName.get(name);

if (!selected) {
  console.error(`Unknown item "${name}". Available: ${[...byName.keys()].join(", ")}`);
  process.exit(1);
}

const seen = new Set();
const files = [];
function collect(item) {
  if (seen.has(item.name)) return;
  for (const dependency of item.registryDependencies ?? []) collect(byName.get(dependency));
  files.push(...item.files);
  seen.add(item.name);
}

collect(selected);

const collisions = [];
const identical = new Set();
for (const file of files) {
  try {
    const target = join(consumerRoot, file.target);
    await access(target);
    const [existingContent, sourceContent] = await Promise.all([
      readFile(target),
      readFile(join(repoRoot, file.path)),
    ]);
    if (existingContent.equals(sourceContent)) identical.add(file.target);
    else collisions.push(file.target);
  } catch {
    // The target is free to create.
  }
}

if (collisions.length) {
  console.error(`Refusing to overwrite existing source:\n${collisions.map((path) => `- ${path}`).join("\n")}`);
  process.exit(1);
}

for (const file of files) {
    if (identical.has(file.target)) {
      console.log(`kept ${file.target} (identical)`);
      continue;
    }
    const target = join(consumerRoot, file.target);
    await mkdir(dirname(target), { recursive: true });
    await copyFile(join(repoRoot, file.path), target);
    console.log(`added ${file.target}`);
}
