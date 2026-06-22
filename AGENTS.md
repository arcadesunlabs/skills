# Repository Guidelines

This repository stores personal agent skills.

- Put each skill in `skills/<skill-name>/SKILL.md`.
- Use lowercase hyphen-case names, and make the folder name match the `name` frontmatter.
- Keep skill frontmatter limited to `name` and `description`.
- Do not add README or extra documentation files inside individual skill folders.
- Put detailed optional context in `references/`, deterministic helpers in `scripts/`, and reusable output files in `assets/`.
- Workflow skills read `skills.config.json` at the workspace root; use `npm run configure` to generate it.
- Run `npm run validate` after adding or changing skills.

