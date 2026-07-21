#!/usr/bin/env node
import {
  copyFile,
  mkdir,
  readFile,
  realpath,
  stat,
  writeFile,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const skillsRepoRoot = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const projectArg = process.argv.slice(2).find((arg) => !arg.startsWith("-"));
const root = projectArg ? path.resolve(projectArg) : process.cwd();
const configPath = path.join(root, "skills.config.json");
const examplePath = path.join(root, "skills.config.example.json");
const schemaPath = path.join(root, "skills.config.schema.json");
const defaultDocsFinalization =
  "Update docs.indexFile when domains, use cases, actors, capabilities, or navigation change. Use cases: update <use-case>.spec.md and <use-case>.context.md. Actors: update actor docs and actors/index.md when definitions or relationships change. Capabilities: update rules.md and scenarios.md when applicable. Remove transient plan.md, tasks.md, and handoff.md files after merge.";
const preIndexDocsFinalization =
  "Use cases: update <use-case>.spec.md and <use-case>.context.md. Actors: update actor docs and actors/index.md when definitions or relationships change. Capabilities: update rules.md and scenarios.md when applicable. Remove transient plan.md, tasks.md, and handoff.md files after merge.";
const preUniqueNameDocsFinalization =
  "Use cases: update spec.md and context.md. Actors: update actor docs and actors/index.md when definitions or relationships change. Capabilities: update rules.md and scenarios.md when applicable. Remove transient plan.md, tasks.md, and handoff.md files after merge.";
const preActorDocsFinalization =
  "Use cases: update spec.md and context.md. Capabilities: update rules.md and scenarios.md when applicable. Remove transient plan.md, tasks.md, and handoff.md files after merge.";
const legacyDocsFinalization =
  "Vertical features: update 01-spec.md and 02-context.md. Capabilities: update spec.md and scenarios.md (optional). Touchpoints: update features/<feature>/spec.md. Remove transient plan/task/handoff files after merge.";

const rl = readline.createInterface({ input, output });

try {
  if (!existsSync(root)) {
    console.error(`Project path does not exist: ${root}`);
    process.exit(1);
  }

  await ensureProjectTemplates();

  let config = existsSync(examplePath)
    ? JSON.parse(await readFile(examplePath, "utf8"))
    : defaultConfig();

  if (existsSync(configPath)) {
    const overwrite = await ask(
      "skills.config.json already exists. Overwrite? (y/N): ",
      "n",
    );
    if (!/^y(es)?$/i.test(overwrite)) {
      config = JSON.parse(await readFile(configPath, "utf8"));
      console.log("Editing existing config.");
    }
  }

  config.code ??= {};
  if (
    (!Array.isArray(config.code.searchRoots) ||
      config.code.searchRoots.length === 0) &&
    config.docs?.domainMirror
  ) {
    config.code.searchRoots = [config.docs.domainMirror];
  }
  delete config.docs.domainMirror;
  delete config.docs.touchpointsRoot;
  if (
    config.workflow?.docsFinalization === legacyDocsFinalization ||
    config.workflow?.docsFinalization === preActorDocsFinalization ||
    config.workflow?.docsFinalization === preUniqueNameDocsFinalization ||
    config.workflow?.docsFinalization === preIndexDocsFinalization
  ) {
    config.workflow.docsFinalization = defaultDocsFinalization;
  }

  console.log(
    "\nWorkflow skills setup — answer prompts or press Enter to keep defaults.\n",
  );
  console.log(
    "Docs are organized as <domain>/<use-case>. A domain is a stable product or business area, such as customers, orders, payments, or authentication — never a code folder or layer.\n",
  );
  console.log(
    "Distinct user types are actors, such as administrator, operator, manager, or salesperson. Document them under <docs-root>/actors; keep authorization rules separate.\n",
  );

  config.project.name = await ask("Project name", config.project.name);
  config.project.conventionsFile = await ask(
    "Project conventions file (e.g. CLAUDE.md)",
    config.project.conventionsFile,
  );

  config.docs.root = await ask("Docs root folder", config.docs.root);
  config.docs.indexFile = await ask("Docs index file", config.docs.indexFile);
  config.docs.capabilitiesRoot = await ask(
    "Capabilities folder (relative to docs root)",
    config.docs.capabilitiesRoot || "capabilities",
  );

  const appRoot = await ask(
    "App root path (optional)",
    config.code.appRoot || "",
  );
  if (appRoot) {
    config.code.appRoot = appRoot;
  } else {
    delete config.code.appRoot;
  }
  const searchRoots = parseList(
    await ask(
      "Code search roots (comma-separated, optional)",
      (config.code.searchRoots || []).join(", "),
    ),
  );
  if (searchRoots.length > 0) {
    config.code.searchRoots = searchRoots;
  } else {
    delete config.code.searchRoots;
  }

  config.workflow ??= {};
  const shouldAddWorkflow = await ask(
    "Add/edit workflow placeholders? (Y/n)",
    hasWorkflow(config.workflow) ? "n" : "y",
  );
  if (!/^n(o)?$/i.test(shouldAddWorkflow)) {
    if (!Array.isArray(config.workflow.implementationFlow)) {
      config.workflow.implementationFlow = defaultImplementationFlow();
    }
    config.workflow.validationCommands = parseList(
      await ask(
        "Validation commands (comma-separated, optional)",
        (config.workflow.validationCommands || []).join(", "),
      ),
    );
    config.workflow.review = await ask(
      "Review expectation",
      config.workflow.review ||
        "Use the project's normal review path; use a review agent for broad or cross-layer changes.",
    );
    config.workflow.docsFinalization = await ask(
      "Docs finalization rule",
      config.workflow.docsFinalization || defaultDocsFinalization,
    );
  }

  await ensureDocsIndex(config);
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(`\nSaved ${configPath}`);
  const architecturePath = path.join(
    root,
    config.docs.root,
    "architecture",
    "architecture.md",
  );
  console.log(
    `\nRecommended: add ${path.relative(root, architecturePath) || architecturePath}`,
  );
  console.log(
    "  (stack, layers, module boundaries — read by brainstorm and write-plan skills)",
  );
  console.log(
    "Recommended: refine workflow.implementationFlow with your real project phases, dependencies, and skills.",
  );
  console.log(
    "Docs convention: choose a business domain, then a verb-object user goal (for example, customers/create-customer).",
  );
  console.log(
    "Use-case files repeat that goal for descriptive graph labels (for example, create-customer.spec.md and create-customer.context.md).",
  );
  console.log(
    "Migration: rename existing use-case spec.md/context.md files and update their Markdown links before creating new docs.",
  );
  console.log(
    `Actors convention: document distinct product user types under ${path.join(config.docs.root, "actors")} (for example, actors/operator.md).`,
  );
  if (root !== process.cwd()) {
    console.log(`Project: ${root}`);
  }
  console.log(
    "Keep skills.config.json local; commit skills.config.example.json as a team reference if needed.",
  );
} finally {
  rl.close();
}

async function ask(question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || defaultValue;
}

function defaultConfig() {
  return {
    $schema: "./skills.config.schema.json",
    project: { name: "My Project", conventionsFile: "CLAUDE.md" },
    docs: {
      root: ".docs",
      indexFile: ".docs/index.md",
      capabilitiesRoot: "capabilities",
    },
    code: { searchRoots: ["lib/features"] },
    workflow: {
      implementationFlow: defaultImplementationFlow(),
      validationCommands: [],
      review:
        "Use the project's normal review path; use a review agent for broad or cross-layer changes.",
      docsFinalization: defaultDocsFinalization,
    },
  };
}

function defaultImplementationFlow() {
  return [
    {
      phase: "Surface / entry point",
      skills: [],
      notes: "Screens, pages, commands, routes, jobs, or API entry points.",
    },
    {
      phase: "Orchestration",
      skills: [],
      notes:
        "Controllers, hooks, blocs, services, state, loading, errors, and wiring.",
    },
    {
      phase: "Data / contracts",
      skills: [],
      notes:
        "Repositories, clients, schemas, migrations, generated types, or external contracts.",
    },
    {
      phase: "Validation and review",
      skills: [],
      notes:
        "Tests, lint, typecheck, manual checks, code review, and documentation finalization.",
    },
  ];
}

function hasWorkflow(workflow) {
  return Boolean(
    workflow &&
    ((Array.isArray(workflow.implementationFlow) &&
      workflow.implementationFlow.length > 0) ||
      (Array.isArray(workflow.validationCommands) &&
        workflow.validationCommands.length > 0) ||
      workflow.review ||
      workflow.docsFinalization),
  );
}

function parseList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function ensureDocsIndex(config) {
  const { capabilitiesPath, docsRoot, indexPath } = resolveDocsPaths(config);
  await assertRealPathInsideWorkspace(docsRoot, "docs.root");
  await assertRealPathInsideWorkspace(indexPath, "docs.indexFile");
  await assertRealPathInsideWorkspace(
    capabilitiesPath,
    "docs.capabilitiesRoot",
  );

  if (existsSync(indexPath)) {
    const indexStats = await stat(indexPath);
    if (!indexStats.isFile()) {
      throw new Error(`Docs index is not a file: ${indexPath}`);
    }
    console.log(`Docs index already exists: ${indexPath}`);
    return;
  }

  const architecturePath = path.join(
    docsRoot,
    "architecture",
    "architecture.md",
  );
  const actorsIndexPath = path.join(docsRoot, "actors", "index.md");
  const hasArchitecture =
    existsSync(architecturePath) && (await stat(architecturePath)).isFile();
  const hasActorsIndex =
    existsSync(actorsIndexPath) && (await stat(actorsIndexPath)).isFile();
  const linkFromIndex = (target) => {
    const relativePath = path
      .relative(path.dirname(indexPath), target)
      .split(path.sep)
      .join("/");
    return relativePath
      .split("/")
      .map((segment) =>
        encodeURIComponent(segment).replace(/[!'()*]/g, (character) =>
          `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
        ),
      )
      .join("/");
  };
  const availableStartLinks = [
    hasArchitecture
      ? `- [Architecture](${linkFromIndex(architecturePath)})`
      : "",
    hasActorsIndex
      ? `- [Actors](${linkFromIndex(actorsIndexPath)})`
      : "",
  ].filter(Boolean);
  const startLinks =
    availableStartLinks.length > 0
      ? availableStartLinks.join("\n")
      : "Add links to architecture, actors, and other existing documentation entry points.";
  const projectName = String(config.project.name).replace(/\s+/g, " ").trim();
  const capabilitiesRoot = config.docs.capabilitiesRoot || "capabilities";
  const docsPath = (...parts) =>
    path.join(config.docs.root, ...parts).split(path.sep).join("/");
  const markdownCode = (value) => {
    const backtickRuns = value.match(/`+/g) || [""];
    const delimiter = "`".repeat(
      Math.max(...backtickRuns.map((run) => run.length)) + 1,
    );
    return `${delimiter}${value}${delimiter}`;
  };
  const content = `# ${projectName} Documentation

Canonical entry point for project documentation. Use this file to find documentation and understand its organization; keep detailed rules in the linked canonical documents.

## Start Here

${startLinks}

## Documentation Map

- ${markdownCode(`${docsPath("actors")}/`)} — product user types, goals, responsibilities, and boundaries
- ${markdownCode(`${docsPath(capabilitiesRoot)}/`)} — rules and scenarios shared by multiple use cases
- ${markdownCode(`${docsPath("<domain>", "<verb-object>")}/`)} — user behavior specs and implementation context
- ${markdownCode(`${docsPath("codebase", "<initiative>")}/`)} — technical work without user behavior changes

Add links here for each domain, use case, actor catalog, capability, integration, setup guide, and other important documentation entry point.

## Conventions

- Organize behavior by user intent, not code structure.
- Name use cases as kebab-case verb-object goals.
- Keep behavior in \`<use-case>.spec.md\` and implementation mapping in \`<use-case>.context.md\`.
- Keep this index navigational; do not duplicate architecture, rules, specs, or implementation details.

## Maintenance

Update this index when documentation entry points are added, moved, renamed, or removed. Remove transient \`plan.md\`, \`tasks.md\`, and \`handoff.md\` files after work is finalized.
`;

  await mkdir(path.dirname(indexPath), { recursive: true });
  await writeFile(indexPath, content, { encoding: "utf8", flag: "wx" });
  console.log(`Created docs index: ${indexPath}`);
}

function resolveDocsPaths(config) {
  const docsRoot = resolveRelativePath(root, config.docs.root, "docs.root");
  const indexPath = resolveRelativePath(
    root,
    config.docs.indexFile,
    "docs.indexFile",
  );
  const capabilitiesPath = resolveRelativePath(
    docsRoot,
    config.docs.capabilitiesRoot || "capabilities",
    "docs.capabilitiesRoot",
  );
  return { capabilitiesPath, docsRoot, indexPath };
}

async function assertRealPathInsideWorkspace(targetPath, fieldName) {
  const workspaceRealPath = await realpath(root);
  let existingAncestor = targetPath;
  while (!existsSync(existingAncestor)) {
    const parent = path.dirname(existingAncestor);
    if (parent === existingAncestor) {
      break;
    }
    existingAncestor = parent;
  }

  const ancestorRealPath = await realpath(existingAncestor);
  const relativePath = path.relative(workspaceRealPath, ancestorRealPath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`${fieldName} resolves outside the workspace`);
  }
}

function resolveRelativePath(base, configuredPath, fieldName) {
  if (path.isAbsolute(configuredPath)) {
    throw new Error(`${fieldName} must be relative to the workspace`);
  }

  const resolvedPath = path.resolve(base, configuredPath);
  const relativePath = path.relative(base, resolvedPath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`${fieldName} must stay inside the workspace`);
  }
  return resolvedPath;
}

async function ensureProjectTemplates() {
  const repoExample = path.join(skillsRepoRoot, "skills.config.example.json");
  const repoSchema = path.join(skillsRepoRoot, "skills.config.schema.json");

  if (!existsSync(examplePath) && existsSync(repoExample)) {
    await copyFile(repoExample, examplePath);
    console.log(`Copied template to ${examplePath}`);
  }
  if (
    existsSync(repoSchema) &&
    path.resolve(schemaPath) !== path.resolve(repoSchema)
  ) {
    await copyFile(repoSchema, schemaPath);
  }
}
