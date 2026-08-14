import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import ts from "../apps/bifrost-design-system/node_modules/typescript/lib/typescript.js";

const baseline = "a75ee49a432b3ed110df98f8ea0e27e87a4262cd";
const sourceRoot = "/home/jack/GitHub/bifrost/client/src";
const repositoryRoot = "/home/jack/GitHub/bifrost";
const output = resolve("docs/inventory/components.json");
const ledgerOutput = resolve("docs/inventory/migration-ledger.json");

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git", ".worktrees"].includes(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path));
    else result.push(path);
  }
  return result;
}

const allSourceFiles = (await walk(sourceRoot)).filter((path) => [".ts", ".tsx"].includes(extname(path)) && !/\.(test|spec)\.tsx?$/.test(path) && !path.endsWith("v1.d.ts"));
const sourceSet = new Set(allSourceFiles.map((path) => resolve(path)));

function lineOf(source, position) {
  return source.getLineAndCharacterOfPosition(position).line + 1;
}

function exported(node) {
  return node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function propsFromType(source, node) {
  const type = node.parameters?.[0]?.type;
  return type ? type.getText(source).replace(/\s+/g, " ") : null;
}

function extractExports(source) {
  const declarations = new Map();
  const names = new Set();
  for (const node of source.statements) {
    if (ts.isFunctionDeclaration(node)) {
      const name = node.name?.text ?? "default";
      declarations.set(name, { name, kind: "function", line: lineOf(source, node.getStart(source)), props: propsFromType(source, node) });
      if (exported(node) || node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) names.add(name);
    }
    if (ts.isClassDeclaration(node)) {
      const name = node.name?.text ?? "default";
      declarations.set(name, { name, kind: "class", line: lineOf(source, node.getStart(source)), props: null });
      if (exported(node)) names.add(name);
    }
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue;
        const value = { name: declaration.name.text, kind: "variable", line: lineOf(source, declaration.getStart(source)), props: null };
        declarations.set(value.name, value);
        if (exported(node)) names.add(value.name);
      }
    }
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const element of node.exportClause.elements) names.add(element.propertyName?.text ?? element.name.text);
    }
  }
  return [...names].map((name) => declarations.get(name) ?? { name, kind: "re-export", line: 1, props: null });
}

function extractPropInterfaces(source) {
  const values = [];
  for (const node of source.statements) {
    if ((ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) && /Props$/.test(node.name.text)) {
      const members = ts.isInterfaceDeclaration(node)
        ? node.members.map((member) => member.name?.getText(source)).filter(Boolean)
        : [];
      values.push({ name: node.name.text, line: lineOf(source, node.getStart(source)), exported: exported(node), members });
    }
  }
  return values;
}

function resolveImport(fromPath, specifier) {
  let base;
  if (specifier.startsWith("@/")) base = join(sourceRoot, specifier.slice(2));
  else if (specifier.startsWith(".")) base = resolve(dirname(fromPath), specifier);
  else return null;
  const candidates = [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")];
  return candidates.map((candidate) => resolve(candidate)).find((candidate) => sourceSet.has(candidate)) ?? null;
}

const records = [];
const inbound = new Map();
for (const path of allSourceFiles) {
  const text = await readFile(path, "utf8");
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const externalDependencies = new Set();
  const internalImports = [];
  for (const node of source.statements) {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
    const specifier = node.moduleSpecifier.text;
    const target = resolveImport(path, specifier);
    if (target) {
      internalImports.push(relative(repositoryRoot, target));
      const users = inbound.get(target) ?? [];
      users.push({ path: relative(repositoryRoot, path), line: lineOf(source, node.getStart(source)) });
      inbound.set(target, users);
    } else if (!specifier.startsWith(".")) {
      externalDependencies.add(specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0]);
    }
  }

  if (!path.endsWith(".tsx")) continue;
  const relativePath = relative(repositoryRoot, path);
  const components = extractExports(source).filter((entry) => /^[A-Z]/.test(entry.name) || entry.name === "default");
  const category = relativePath.includes("/components/") ? relativePath.split("/components/")[1].split(sep)[0] : relativePath.split(sep).slice(2, -1).join("/") || "root";
  const rawElements = Object.fromEntries(["button", "input", "select", "textarea", "dialog", "table", "form", "nav"].map((tag) => [tag, (text.match(new RegExp(`<${tag}\\b`, "g")) ?? []).length]).filter(([, count]) => count));
  const a11ySignals = ["aria-", "role=", "htmlFor=", "onKeyDown", "focus(", "sr-only"].filter((signal) => text.includes(signal));
  const stateSignals = ["loading", "error", "empty", "disabled", "permission", "destructive", "skeleton"].filter((signal) => text.toLowerCase().includes(signal));
  records.push({
    path: relativePath,
    line: 1,
    lines: text.split("\n").length,
    category,
    exports: components,
    propContracts: extractPropInterfaces(source),
    dependencies: [...externalDependencies].sort(),
    internalImports: internalImports.sort(),
    consumers: [],
    rawElements,
    accessibilitySignals: a11ySignals,
    stateSignals,
  });
}

for (const record of records) {
  record.consumers = (inbound.get(resolve(repositoryRoot, record.path)) ?? []).sort((a, b) => a.path.localeCompare(b.path) || a.line - b.line);
}
records.sort((a, b) => a.path.localeCompare(b.path));

const additionalFrontendRoots = [join(repositoryRoot, "apps"), join(repositoryRoot, "docs/demo")];
const repositoryTsx = (await Promise.all(additionalFrontendRoots.map(walk))).flat().filter((path) => path.endsWith(".tsx") && !/\.(test|spec)\.tsx$/.test(path));
const summary = {
  componentFiles: records.length,
  exportedComponents: records.reduce((total, record) => total + record.exports.length, 0),
  filesWithNoInboundImports: records.filter((record) => record.consumers.length === 0).length,
  uiPrimitiveFiles: records.filter((record) => record.path.includes("client/src/components/ui/")).length,
  frontendTsxOutsideClientSrc: repositoryTsx.map((path) => relative(repositoryRoot, path)).sort(),
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify({ schemaVersion: 1, baseline, sourceRoot: "client/src", generatedAt: "2026-08-14", summary, components: records }, null, 2)}\n`);
const phaseOneTargets = new Map([
  ["button", "BfButton"], ["input", "BfField"], ["textarea", "BfField"], ["select", "BfField"],
  ["checkbox", "BfSelection"], ["radio-group", "BfSelection"], ["switch", "BfSelection"],
  ["tabs", "BfTabs"], ["badge", "BfStatus"], ["alert", "BfAlert"], ["dialog", "BfDialog"],
]);

function proposal(record) {
  const base = record.path.split("/").pop().replace(/\.tsx$/, "");
  if (record.path.includes("/components/ui/") && phaseOneTargets.has(base)) {
    return {
      name: phaseOneTargets.get(base),
      compatibility: "Adapter required: preserve the existing shadcn/Radix export and prop surface while applying Bifrost tokens and behavioral contracts.",
      notes: `Introduce a compatibility entry point for ${base}; migrate direct consumers only after parity tests cover the current API.`,
      status: "phase-1 target available; product adapter pending",
      unresolved: "Confirm visual snapshots and edge-state parity before changing the existing import path.",
    };
  }
  if (record.path.includes("/components/ui/")) {
    return {
      name: `Bf${base.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join("")}`,
      compatibility: "Preserve the current primitive API; redesign internals and tokens before considering any public prop change.",
      notes: "Add to the source registry with a product-compatible adapter and focused accessibility/state tests.",
      status: "inventoried; reinvention planned",
      unresolved: "Determine whether the product primitive or a slimmer app-facing API should be canonical after consumer tracing.",
    };
  }
  if (record.path.includes("/components/layout/") || record.path.includes("EditorLayout") || record.path.includes("ChatLayout")) {
    return {
      name: "Application shell / workspace layout pattern",
      compatibility: "Composition-level migration; retain routing, resize, dock, and persistence behavior while replacing visual structure incrementally.",
      notes: "Extract shell slots and workspace regions; do not force feature state into a generic presentational component.",
      status: "inventoried; pattern consolidation planned",
      unresolved: "Define the minimum stable shell-slot contract across platform, editor, and chat workspaces.",
    };
  }
  return {
    name: `Feature pattern: ${record.exports[0]?.name ?? base}`,
    compatibility: "Keep the feature API and domain behavior; migrate its underlying primitives and repeated state anatomy first.",
    notes: "Treat as a consumer or higher-order recipe unless another source demonstrates a genuinely shared product contract.",
    status: "inventoried; awaiting family-level migration",
    unresolved: record.consumers.length === 0 ? "Verify whether this source is route-owned, dynamically referenced, or obsolete before migration." : "No breaking change proposed.",
  };
}

const migrationLedger = records.map((record) => {
  const target = proposal(record);
  return {
    proposedDesignSystemName: target.name,
    sourcePath: record.path,
    sourceLine: record.exports[0]?.line ?? 1,
    baseline,
    existingApi: { exports: record.exports, propContracts: record.propContracts },
    consumers: record.consumers,
    searchEvidence: `${record.consumers.length} static inbound import(s); ${record.lines} source lines`,
    compatibilityAssessment: target.compatibility,
    replacementOrAdapter: target.notes,
    status: target.status,
    unresolvedDecisions: target.unresolved,
  };
});
await writeFile(ledgerOutput, `${JSON.stringify({ schemaVersion: 1, baseline, generatedAt: "2026-08-14", items: migrationLedger }, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
