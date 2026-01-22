# Repository Guidelines

## Project Structure & Module Organization

- `index.json` defines the curriculum navigation (units + lesson metadata).
- `chapters/*.md` contains lesson content rendered as-is by the consuming app.
- `CLAUDE.md` contains agent-facing operational rules.

## Build, Test, and Development Commands

- `node scripts/validate-index.mjs`: Validate `index.json` syntax, referenced lesson paths, and title ↔ H1 consistency.
- `node -e "JSON.parse(require('fs').readFileSync('index.json','utf8'))"`: Quick JSON syntax check.
- `rg "keyword" chapters`: Search across lesson content.

## Coding Style & Naming Conventions

- Markdown: Start each lesson with a single H1 (`# ...`) matching the corresponding `index.json` item `title`. Use fenced code blocks with language tags (e.g., `kotlin`, `bash`).
- Filenames: `chapters/NN-topic.md` (example: `chapters/04-project-start.md`).
- IDs: `kebab-case` and unique across the curriculum (example: `project-start`).
- JSON: Strict JSON only (no comments, no trailing commas). Prefer 2-space indentation and double quotes.

## Testing Guidelines

There is no unit test suite in this repository. Treat `node scripts/validate-index.mjs` as the required pre-PR check. If you add/remove lessons, keep `index.json` and `chapters/` in sync (paths, titles, and IDs).

## Commit & Pull Request Guidelines

- Commits: Use short, imperative messages consistent with history (e.g., `Add ...`, `Expand Unit 3: ...`).
- PRs: Include a summary, list of changed lesson paths, and note any navigation changes in `index.json`. Add screenshots if the consuming app’s UI/navigation is impacted.
