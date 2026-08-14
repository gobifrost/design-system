import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const registry = JSON.parse(await readFile(join(root, "registry.json"), "utf8"));
const output = join(root, "apps/bifrost-design-system/public/r");

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const item of registry.items) {
  const files = await Promise.all(item.files.map(async (file) => ({
    path: file.target,
    type: file.type,
    content: await readFile(join(root, file.path), "utf8"),
  })));
  await writeFile(join(output, `${item.name}.json`), `${JSON.stringify({ ...item, files }, null, 2)}\n`);
}

await writeFile(join(output, "index.json"), `${JSON.stringify(registry, null, 2)}\n`);
console.log(`Built ${registry.items.length} registry items in ${output}`);
