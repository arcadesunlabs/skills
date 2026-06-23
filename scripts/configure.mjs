#!/usr/bin/env node
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";
import {
  PHASE_PRESETS,
  PRESET_IDS,
  normalizePhasePreset,
} from "./phase-presets.mjs";

const skillsRepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const presetFlag = argv.find((arg) => arg.startsWith("--preset"));
const presetArg = presetFlag?.includes("=")
  ? presetFlag.split("=").slice(1).join("=")
  : presetFlag
    ? argv[argv.indexOf(presetFlag) + 1]
    : undefined;
const projectArg = argv.find((arg) => !arg.startsWith("-"));
const root = projectArg ? path.resolve(projectArg) : process.cwd();
const configPath = path.join(root, "skills.config.json");
const examplePath = path.join(root, "skills.config.example.json");
const schemaPath = path.join(root, "skills.config.schema.json");

const PRESETS = {
  minimal: {
    project: { name: "My Project", conventionsFile: "AGENTS.md" },
    docs: { root: "docs", indexFile: "docs/README.md", domainMirror: "src" },
    taskTracker: {
      provider: "none",
      enabled: false,
      cardKeyPrefix: "TASK",
      branchMatchesCardKey: true,
    },
    code: {},
    implementation: {
      preset: "minimal",
      phases: PHASE_PRESETS.minimal.phases,
    },
  },
  "single-app": {
    project: { name: "My Project", conventionsFile: "CLAUDE.md" },
    docs: { root: "docs", indexFile: "docs/index.md", domainMirror: "src" },
    taskTracker: {
      provider: "none",
      enabled: false,
      cardKeyPrefix: "TASK",
      branchMatchesCardKey: true,
    },
    code: { appRoot: ".", lintCommand: "", testCommand: "" },
    implementation: {
      preset: "minimal",
      phases: PHASE_PRESETS.minimal.phases,
    },
  },
  monorepo: {
    project: { name: "My Project", conventionsFile: "CLAUDE.md" },
    docs: {
      root: ".docs",
      indexFile: ".docs/index.md",
      domainMirror: "apps/my-app/lib/features",
    },
    taskTracker: {
      provider: "none",
      enabled: false,
      cardKeyPrefix: "TASK",
      branchMatchesCardKey: true,
    },
    code: {
      appRoot: "apps/my-app",
      lintCommand: "cd apps/my-app && npm run lint",
      testCommand: "cd apps/my-app && npm test",
    },
    implementation: {
      preset: "frontend-ui-first",
      phases: PHASE_PRESETS["frontend-ui-first"].phases,
    },
  },
};

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

  const preset =
    normalizePreset(presetArg) ||
    normalizePreset(
      await ask(
        "Project preset (minimal | single-app | monorepo | custom)",
        "minimal",
      ),
    ) ||
    "minimal";

  if (preset !== "custom" && PRESETS[preset]) {
    config = mergePreset(config, PRESETS[preset]);
    console.log(`Using preset: ${preset}`);
  }

  config.project.name = await ask("Project name", config.project.name);
  config.project.conventionsFile = await ask(
    "Project conventions file (e.g. CLAUDE.md, AGENTS.md)",
    config.project.conventionsFile,
  );

  if (preset === "custom") {
    config.docs.root = await ask("Docs root folder", config.docs.root);
    config.docs.indexFile = await ask("Docs index file", config.docs.indexFile);
    config.docs.domainMirror = await ask(
      "Code path that docs domains mirror (optional)",
      config.docs.domainMirror || "",
    );
  } else if (preset === "minimal") {
    const docsRoot = await ask("Docs root folder (empty to skip)", config.docs.root);
    if (!docsRoot) {
      config.docs = { root: "", indexFile: "", domainMirror: "" };
    } else {
      config.docs.root = docsRoot;
      config.docs.indexFile =
        config.docs.indexFile || `${docsRoot.replace(/\/$/, "")}/README.md`;
      config.docs.domainMirror = config.docs.domainMirror || "src";
    }
  }

  const provider = await ask(
    "Task tracker provider (trello | jira | linear | github | none)",
    config.taskTracker.provider,
  );
  config.taskTracker.provider = normalizeProvider(provider);
  config.taskTracker.enabled = config.taskTracker.provider !== "none";

  if (config.taskTracker.enabled) {
    config.taskTracker.cardKeyPrefix = (
      await ask(
        "Task ID prefix (e.g. REV, PM)",
        config.taskTracker.cardKeyPrefix,
      )
    ).toUpperCase();
    const branchMatch = await ask(
      "Branch name equals task ID? (Y/n)",
      config.taskTracker.branchMatchesCardKey ? "y" : "n",
    );
    config.taskTracker.branchMatchesCardKey = !/^n(o)?$/i.test(branchMatch);

    if (config.taskTracker.provider === "trello") {
      await configureTrello(config);
    } else if (config.taskTracker.provider === "jira") {
      await configureJira(config);
    }
  }

  await configureImplementation(config);

  if (preset === "custom" || preset === "monorepo" || preset === "single-app") {
    config.code ??= {};
    config.code.appRoot = await ask(
      "App root path (optional)",
      config.code.appRoot || "",
    );
    config.code.lintCommand = await ask(
      "Lint command (optional)",
      config.code.lintCommand || "",
    );
    config.code.testCommand = await ask(
      "Test command (optional)",
      config.code.testCommand || "",
    );
  }

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  console.log(`\nSaved ${configPath}`);
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

function normalizePreset(value) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (["minimal", "single-app", "monorepo", "custom"].includes(normalized)) {
    return normalized;
  }
  console.warn(`Unknown preset "${value}", using interactive custom flow.`);
  return "custom";
}

function mergePreset(base, preset) {
  return {
    ...base,
    $schema: base.$schema || "./skills.config.schema.json",
    project: { ...base.project, ...preset.project },
    docs: { ...base.docs, ...preset.docs },
    taskTracker: { ...base.taskTracker, ...preset.taskTracker },
    code: { ...base.code, ...preset.code },
    implementation: {
      ...base.implementation,
      ...preset.implementation,
      phases: clonePhases(
        preset.implementation?.phases ?? base.implementation?.phases ?? [],
      ),
    },
  };
}

function clonePhases(phases) {
  return phases.map((phase) => ({ ...phase }));
}

async function configureImplementation(config) {
  console.log(
    "\nImplementation workflow — map how you go from approved plan to shipped code.",
  );
  for (const id of PRESET_IDS) {
    console.log(`  ${id}: ${PHASE_PRESETS[id].label}`);
  }
  console.log("  custom: define your own ordered phases\n");

  const currentPreset = config.implementation?.preset || "minimal";
  const phasePreset =
    normalizePhasePreset(
      await ask(
        `Implementation preset (${PRESET_IDS.join(" | ")} | custom)`,
        currentPreset,
      ),
    ) || currentPreset;

  if (phasePreset === "custom") {
    config.implementation = {
      preset: "custom",
      phases: await buildCustomPhases(config.implementation?.phases),
    };
    return;
  }

  config.implementation = {
    preset: phasePreset,
    phases: clonePhases(PHASE_PRESETS[phasePreset].phases),
  };
}

async function buildCustomPhases(existingPhases = []) {
  const phases = [];
  const reuse =
    existingPhases.length > 0
      ? (await ask("Start from current phases? (Y/n)", "y")).trim()
      : "n";

  if (!/^n(o)?$/i.test(reuse)) {
    phases.push(...clonePhases(existingPhases));
    console.log("Edit by adding phases below; existing order is kept.");
  }

  console.log(
    "Add phases in delivery order. Press Enter on an empty name to finish.",
  );
  console.log(
    'Tip: mark finalize with "always last" when prompted for optional phases.',
  );

  while (true) {
    const name = await ask(`Phase ${phases.length + 1} name`, "");
    if (!name) break;

    const notes = await ask("  Short note (optional)", "");
    const optionalAnswer = await ask("  Optional phase? (y/N)", "n");
    const alwaysLastAnswer = await ask("  Always run last? (y/N)", "n");

    const phase = { name };
    if (notes) phase.notes = notes;
    if (/^y(es)?$/i.test(optionalAnswer)) phase.optional = true;
    if (/^y(es)?$/i.test(alwaysLastAnswer)) phase.alwaysLast = true;
    phases.push(phase);
  }

  if (phases.length === 0) {
    console.warn("No phases entered; falling back to minimal preset.");
    return clonePhases(PHASE_PRESETS.minimal.phases);
  }

  if (!phases.some((phase) => phase.alwaysLast)) {
    const addFinalize = await ask(
      'Append mandatory "Finalize docs" as last phase? (Y/n)',
      "y",
    );
    if (!/^n(o)?$/i.test(addFinalize)) {
      phases.push({
        name: "Finalize docs",
        notes: "Mandatory — close-workflow",
        alwaysLast: true,
      });
    }
  }

  return phases;
}

function normalizeProvider(value) {
  const normalized = value.trim().toLowerCase();
  if (["trello", "jira", "linear", "github", "none"].includes(normalized)) {
    return normalized;
  }
  console.warn(`Unknown provider "${value}", using "none".`);
  return "none";
}

async function configureTrello(config) {
  config.taskTracker.mcpServer = await ask(
    "Trello MCP server name",
    config.taskTracker.mcpServer || "user-trello",
  );
  config.taskTracker.trello ??= {};
  config.taskTracker.trello.boardName = await ask(
    "Trello board name",
    config.taskTracker.trello.boardName || "",
  );
  config.taskTracker.trello.boardUrl = await ask(
    "Trello board URL",
    config.taskTracker.trello.boardUrl || "",
  );
  config.taskTracker.trello.boardId = await ask(
    "Trello board ID",
    config.taskTracker.trello.boardId || "",
  );
  config.taskTracker.trello.lists ??= {};
  for (const key of ["todo", "inProgress", "backlog", "done"]) {
    config.taskTracker.trello.lists[key] ??= { name: "", id: "" };
    const label = listLabel(key);
    config.taskTracker.trello.lists[key].name = await ask(
      `${label} list name`,
      config.taskTracker.trello.lists[key].name,
    );
    config.taskTracker.trello.lists[key].id = await ask(
      `${label} list ID`,
      config.taskTracker.trello.lists[key].id,
    );
  }
}

async function configureJira(config) {
  config.taskTracker.mcpServer = await ask(
    "Jira MCP server name (if installed)",
    config.taskTracker.mcpServer ||
      config.taskTracker.jira?.mcpServer ||
      "user-jira",
  );
  config.taskTracker.jira ??= {};
  config.taskTracker.jira.mcpServer = config.taskTracker.mcpServer;
  config.taskTracker.jira.siteUrl = await ask(
    "Jira site URL (e.g. https://company.atlassian.net)",
    config.taskTracker.jira.siteUrl || "",
  );
  config.taskTracker.jira.projectKey = (
    await ask(
      "Jira project key (e.g. REV)",
      config.taskTracker.jira.projectKey || config.taskTracker.cardKeyPrefix || "",
    )
  ).toUpperCase();
  config.taskTracker.jira.boardId = await ask(
    "Jira board ID (optional, for Scrum/Kanban boards)",
    config.taskTracker.jira.boardId || "",
  );
  config.taskTracker.jira.issueTypes ??= {};
  config.taskTracker.jira.issueTypes.epic = await ask(
    "Epic issue type name",
    config.taskTracker.jira.issueTypes.epic || "Epic",
  );
  config.taskTracker.jira.issueTypes.story = await ask(
    "Story issue type name",
    config.taskTracker.jira.issueTypes.story || "Story",
  );
  config.taskTracker.jira.issueTypes.task = await ask(
    "Task issue type name",
    config.taskTracker.jira.issueTypes.task || "Task",
  );
  config.taskTracker.jira.statuses ??= {};
  for (const key of ["todo", "inProgress", "backlog", "done"]) {
    const defaults = {
      todo: "To Do",
      inProgress: "In Progress",
      backlog: "Backlog",
      done: "Done",
    };
    config.taskTracker.jira.statuses[key] = await ask(
      `${listLabel(key)} status name`,
      config.taskTracker.jira.statuses[key] || defaults[key],
    );
  }
}

function listLabel(key) {
  return {
    todo: "To do",
    inProgress: "In progress",
    backlog: "Backlog",
    done: "Done",
  }[key];
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

function defaultConfig() {
  return mergePreset({}, PRESETS.minimal);
}
