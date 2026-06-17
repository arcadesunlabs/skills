#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const skillsDir = path.join(root, "skills");
const errors = [];

if (!existsSync(skillsDir)) {
  console.log("No skills directory found.");
  process.exit(0);
}

const entries = await readdir(skillsDir);
const skillDirs = [];

for (const entry of entries) {
  const fullPath = path.join(skillsDir, entry);
  if ((await stat(fullPath)).isDirectory()) {
    skillDirs.push(entry);
  }
}

for (const dirName of skillDirs) {
  const skillPath = path.join(skillsDir, dirName, "SKILL.md");

  if (!existsSync(skillPath)) {
    errors.push(`${relative(skillPath)} is missing`);
    continue;
  }

  const contents = await readFile(skillPath, "utf8");
  const frontmatter = parseFrontmatter(contents);

  if (!frontmatter) {
    errors.push(`${relative(skillPath)} must start with YAML frontmatter`);
    continue;
  }

  const keys = Object.keys(frontmatter);
  const extraKeys = keys.filter((key) => !["name", "description"].includes(key));

  if (extraKeys.length > 0) {
    errors.push(`${relative(skillPath)} has unsupported frontmatter fields: ${extraKeys.join(", ")}`);
  }

  if (!frontmatter.name) {
    errors.push(`${relative(skillPath)} is missing frontmatter field: name`);
  } else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name)) {
      errors.push(`${relative(skillPath)} name must use lowercase letters, digits, and hyphens only`);
    }

    if (frontmatter.name !== dirName) {
      errors.push(`${relative(skillPath)} name "${frontmatter.name}" must match directory "${dirName}"`);
    }
  }

  if (!frontmatter.description) {
    errors.push(`${relative(skillPath)} is missing frontmatter field: description`);
  }
}

if (errors.length > 0) {
  console.error("Skill validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${skillDirs.length} skill${skillDirs.length === 1 ? "" : "s"}.`);

function parseFrontmatter(contents) {
  if (!contents.startsWith("---\n")) {
    return null;
  }

  const end = contents.indexOf("\n---", 4);
  if (end === -1) {
    return null;
  }

  const yaml = contents.slice(4, end).trim();
  const result = {};

  for (const line of yaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const separator = trimmed.indexOf(":");
    if (separator === -1) {
      return null;
    }

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    result[key] = value;
  }

  return result;
}

function relative(filePath) {
  return path.relative(root, filePath);
}

