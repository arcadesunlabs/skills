#!/usr/bin/env node
// Claude Code UserPromptSubmit hook: asks the agent to run the triage skill
// until triage has run once in the session. Afterwards it adds nothing.
import { readFileSync, existsSync } from "node:fs";

const TRIAGE_RAN =
  /"skill"\s*:\s*"(?:[\w/.-]+:)?triage"|<command-name>\/triage<\/command-name>/;

let input = {};
try {
  input = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const prompt = (input.prompt ?? "").trim();
if (prompt.startsWith("/")) process.exit(0);

const transcript = input.transcript_path;
if (transcript && existsSync(transcript)) {
  if (TRIAGE_RAN.test(readFileSync(transcript, "utf8"))) process.exit(0);
}

console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      additionalContext:
        "If this message starts a task, run the triage skill before acting.",
    },
  }),
);
