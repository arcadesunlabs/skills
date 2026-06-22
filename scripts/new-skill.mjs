#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const nameParts = [];
let resourcesValue = "";

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--resources") {
    resourcesValue = args[index + 1] || "";
    index += 1;
    continue;
  }

  if (arg.startsWith("--resources=")) {
    resourcesValue = arg.split("=").slice(1).join("=");
    continue;
  }

  if (arg.startsWith("--")) {
    console.error(`Unknown option: ${arg}`);
    process.exit(1);
  }

  nameParts.push(arg);
}

const nameArg = nameParts.join(" ");

if (!nameArg) {
  console.error(
    "Usage: npm run new -- <skill-name> [--resources scripts,references,assets]",
  );
  process.exit(1);
}

const name = normalizeName(nameArg);

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
  console.error(`Invalid skill name: ${name}`);
  console.error("Use lowercase letters, digits, and hyphens only.");
  process.exit(1);
}

const resources = resourcesValue
  ? resourcesValue
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  : [];

const allowedResources = new Set(["scripts", "references", "assets"]);
const invalidResources = resources.filter(
  (resource) => !allowedResources.has(resource),
);

if (invalidResources.length > 0) {
  console.error(`Invalid resources: ${invalidResources.join(", ")}`);
  console.error("Allowed resources: scripts,references,assets");
  process.exit(1);
}

const skillDir = path.join(process.cwd(), "skills", name);
const skillFile = path.join(skillDir, "SKILL.md");

if (existsSync(skillDir)) {
  console.error(
    `Skill already exists: ${path.relative(process.cwd(), skillDir)}`,
  );
  process.exit(1);
}

await mkdir(skillDir, { recursive: true });

for (const resource of resources) {
  await mkdir(path.join(skillDir, resource), { recursive: true });
}

await writeFile(skillFile, skillTemplate(name), "utf8");
await updateSkillsShConfig(name);

console.log(`Created ${path.relative(process.cwd(), skillFile)}`);

function normalizeName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

function titleCase(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function skillTemplate(skillName) {
  const title = titleCase(skillName);

  return `---
name: ${skillName}
description: ${title}. Use when Codex needs to perform the ${skillName} workflow, apply its domain-specific procedures, or use its bundled resources.
---

# ${title}

## Workflow

1. Identify the user's concrete goal and relevant inputs.
2. Read only the bundled references needed for the task.
3. Use bundled scripts or assets when they make the result more reliable.
4. Verify the output before responding.

## Resources

- Use \`references/\` for detailed domain knowledge that should be loaded only when needed.
- Use \`scripts/\` for repeatable operations that should run deterministically.
- Use \`assets/\` for templates, examples, images, or other files used in outputs.
`;
}

async function updateSkillsShConfig(skillName) {
  const configPath = path.join(process.cwd(), "skills.sh.json");
  const placeholder = "my-first-skill";
  let config = {
    $schema: "https://skills.sh/schemas/skills.sh.schema.json",
    notGrouped: "bottom",
    groupings: [],
  };

  if (existsSync(configPath)) {
    try {
      config = JSON.parse(await readFile(configPath, "utf8"));
    } catch (error) {
      console.warn(`Skipped skills.sh.json update: ${error.message}`);
      return;
    }
  }

  if (!Array.isArray(config.groupings)) {
    config.groupings = [];
  }

  let personalGroup = config.groupings.find(
    (group) => group.title === "Personal",
  );

  if (!personalGroup) {
    personalGroup = {
      title: "Personal",
      description: "Skills pessoais mantidas neste repositorio.",
      skills: [],
    };
    config.groupings.unshift(personalGroup);
  }

  if (!Array.isArray(personalGroup.skills)) {
    personalGroup.skills = [];
  }

  personalGroup.skills = personalGroup.skills.filter(
    (entry) => entry !== placeholder,
  );

  if (!personalGroup.skills.includes(skillName)) {
    personalGroup.skills.push(skillName);
  }

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}
