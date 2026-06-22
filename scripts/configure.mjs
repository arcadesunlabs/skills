#!/usr/bin/env node
import { copyFile, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const skillsRepoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
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

  const provider = await ask(
    "Task tracker provider (trello | linear | github | none)",
    config.taskTracker.provider,
  );
  config.taskTracker.provider = normalizeProvider(provider);
  config.taskTracker.enabled = config.taskTracker.provider !== "none";

  if (config.taskTracker.enabled) {
    config.taskTracker.cardKeyPrefix = (
      await ask(
        "Card key prefix (e.g. REV, PM)",
        config.taskTracker.cardKeyPrefix,
      )
    ).toUpperCase();
    const branchMatch = await ask(
      "Branch name equals card key? (Y/n)",
      config.taskTracker.branchMatchesCardKey ? "y" : "n",
    );
    config.taskTracker.branchMatchesCardKey = !/^n(o)?$/i.test(branchMatch);

    if (config.taskTracker.provider === "trello") {
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
  }

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

function normalizeProvider(value) {
  const normalized = value.trim().toLowerCase();
  if (["trello", "linear", "github", "none"].includes(normalized)) {
    return normalized;
  }
  console.warn(`Unknown provider "${value}", using "none".`);
  return "none";
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
  return {
    $schema: "./skills.config.schema.json",
    project: { name: "My Project", conventionsFile: "CLAUDE.md" },
    docs: {
      root: ".docs",
      indexFile: ".docs/index.md",
      domainMirror: "lib/features",
    },
    taskTracker: {
      provider: "none",
      enabled: false,
      cardKeyPrefix: "TASK",
      branchMatchesCardKey: true,
    },
    code: {},
  };
}
