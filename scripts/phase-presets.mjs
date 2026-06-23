/** Default implementation phase presets for skills-configure and workflow discovery. */

export const PHASE_PRESETS = {
  minimal: {
    label: "Minimal — implement, test, finalize",
    phases: [
      { name: "Implementation", notes: "Core changes for the slice" },
      { name: "Tests", notes: "Purposeful coverage only", optional: true },
      {
        name: "Finalize docs",
        notes: "Mandatory — close-workflow",
        alwaysLast: true,
      },
    ],
  },
  "frontend-ui-first": {
    label: "Frontend UI-first — presentation through data and routes",
    phases: [
      { name: "UI", notes: "Match existing domain patterns" },
      { name: "Orchestration", notes: "Loading, errors, mutations" },
      { name: "UI ↔ Orchestration", notes: "Wire presentation to orchestration" },
      { name: "Data layer", notes: "Repositories, queries, migrations" },
      { name: "Routes / navigation", notes: "Every entry point from spec" },
      { name: "Tests", notes: "Purposeful coverage only", optional: true },
      {
        name: "Internationalization",
        notes: "All required locales",
        optional: true,
      },
      { name: "Analytics", notes: "Only when product asks", optional: true },
      { name: "Code review", notes: "Inline or code-reviewer subagent" },
      {
        name: "Finalize docs",
        notes: "Mandatory — close-workflow",
        alwaysLast: true,
      },
    ],
  },
  "api-first": {
    label: "API-first — data and contracts before UI",
    phases: [
      { name: "Data layer", notes: "Repositories, queries, migrations, API" },
      { name: "Orchestration", notes: "Loading, errors, mutations" },
      { name: "UI", notes: "Match existing domain patterns" },
      { name: "UI ↔ Orchestration", notes: "Wire presentation to orchestration" },
      { name: "Routes / navigation", notes: "Every entry point from spec" },
      { name: "Tests", notes: "Purposeful coverage only", optional: true },
      { name: "Code review", notes: "Inline or code-reviewer subagent" },
      {
        name: "Finalize docs",
        notes: "Mandatory — close-workflow",
        alwaysLast: true,
      },
    ],
  },
};

export const PRESET_IDS = Object.keys(PHASE_PRESETS);

export function normalizePhasePreset(value) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (PRESET_IDS.includes(normalized)) return normalized;
  if (normalized === "custom") return "custom";
  return undefined;
}
