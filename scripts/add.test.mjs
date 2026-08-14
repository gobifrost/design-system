import assert from "node:assert/strict";
import { appendFile, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = new URL("./add.mjs", import.meta.url).pathname;

function install(name, root) {
  return spawnSync(process.execPath, [script, name, "--root", root], { encoding: "utf8" });
}

test("source installer shares identical dependencies and protects consumer edits", async () => {
  const root = await mkdtemp(join(tmpdir(), "bds-registry-test-"));
  try {
    const first = install("data-table", root);
    assert.equal(first.status, 0, first.stderr);

    const composed = install("combobox", root);
    assert.equal(composed.status, 0, composed.stderr);
    assert.match(await readFile(join(root, "src/components/bifrost/BfCombobox.tsx"), "utf8"), /export function BfCombobox/);

    await appendFile(join(root, "src/components/bifrost/components.css"), "\n/* consumer customization */\n");
    const protectedInstall = install("alert", root);
    assert.equal(protectedInstall.status, 1);
    assert.match(await readFile(join(root, "src/components/bifrost/components.css"), "utf8"), /consumer customization/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
