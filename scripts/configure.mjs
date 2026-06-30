#!/usr/bin/env node
import { copyFile, readFile, writeFile } from "node:fs/promises";
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

  console.log(
    "\nWorkflow skills setup — answer prompts or press Enter to keep defaults.\n",
  );

  config.project.name = await ask("Project name", config.project.name);
  config.project.conventionsFile = await ask(
    "Project conventions file (e.g. CLAUDE.md)",
    config.project.conventionsFile,
  );

  config.docs.root = await ask("Docs root folder", config.docs.root);
  config.docs.indexFile = await ask("Docs index file", config.docs.indexFile);
  config.docs.domainMirror = await ask(
    "Code path that docs domains mirror",
    config.docs.domainMirror,
  );
  config.docs.capabilitiesRoot = await ask(
    "Capabilities folder (relative to docs root)",
    config.docs.capabilitiesRoot || "capabilities",
  );
  config.docs.touchpointsRoot = await ask(
    "Feature touchpoints folder (relative to docs root)",
    config.docs.touchpointsRoot || "features",
  );

  config.code ??= {};
  config.code.appRoot = await ask(
    "App root path (optional)",
    config.code.appRoot || "",
  );

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
      config.workflow.docsFinalization ||
        "Vertical features: update 01-spec.md and 02-context.md. Capabilities: update spec.md and scenarios.md (optional). Touchpoints: update features/<feature>/spec.md. Remove transient plan/task/handoff files after merge.",
    );
  }

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(`\nSaved ${configPath}`);
  const architecturePath = path.join(
    root,
    config.docs.root,
    "codebase",
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
      domainMirror: "lib/features",
      capabilitiesRoot: "capabilities",
      touchpointsRoot: "features",
    },
    code: {},
    workflow: {
      implementationFlow: defaultImplementationFlow(),
      validationCommands: [],
      review:
        "Use the project's normal review path; use a review agent for broad or cross-layer changes.",
      docsFinalization:
        "Vertical features: update 01-spec.md and 02-context.md. Capabilities: update spec.md and scenarios.md (optional). Touchpoints: update features/<feature>/spec.md. Remove transient plan/task/handoff files after merge.",
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

async function ensureProjectTemplates() {
  const repoExample = path.join(skillsRepoRoot, "skills.config.example.json");
  const repoSchema = path.join(skillsRepoRoot, "skills.config.schema.json");

  if (!existsSync(examplePath) && existsSync(repoExample)) {
    await copyFile(repoExample, examplePath);
    console.log(`Copied template to ${examplePath}`);
  }
  if (!existsSync(schemaPath) && existsSync(repoSchema)) {
    await copyFile(repoSchema, schemaPath);
  }
}
