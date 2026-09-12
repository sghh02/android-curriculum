import { readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const repoRoot = resolve(new URL("..", import.meta.url).pathname);
const indexPath = resolve(repoRoot, "index.json");
const index = JSON.parse(readFileSync(indexPath, "utf-8"));

const errors = [];
const warnings = [];

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractH2Section(markdown, headingText) {
  const lines = markdown.split(/\r?\n/);
  const headingPattern = new RegExp(`^##\\s+${escapeRegExp(headingText)}\\s*$`);

  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (headingPattern.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

const normalizeTitle = (value) =>
  value
    .trim()
    .replace(/^\d+\s+/, "")
    .replace(/\s+/g, "");

const getLessons = (group) =>
  Array.isArray(group.items)
    ? group.items
    : Array.isArray(group.lessons)
      ? group.lessons
      : [];

const groups = Array.isArray(index.chapters)
  ? index.chapters
  : Array.isArray(index.units)
    ? index.units
    : [];

const pathToTitle = new Map();
for (const group of groups) {
  for (const lesson of getLessons(group)) {
    if (typeof lesson?.path === "string" && typeof lesson?.title === "string") {
      pathToTitle.set(lesson.path, lesson.title);
    }
  }
}

for (const group of groups) {
  const lessons = getLessons(group);

  for (const lesson of lessons) {
    if (!lesson?.path || !lesson?.title) {
      errors.push(`Invalid lesson entry: ${JSON.stringify(lesson)}`);
      continue;
    }
    if (typeof lesson.hasAssignment !== "boolean") {
      errors.push(`Missing/invalid hasAssignment (expected boolean): ${lesson.path}`);
    }

    const lessonPath = resolve(repoRoot, lesson.path);
    let content = "";
    try {
      content = readFileSync(lessonPath, "utf-8");
    } catch (error) {
      errors.push(`Missing file: ${lesson.path}`);
      continue;
    }

    const titleLine = content.split(/\r?\n/).find((line) => line.startsWith("# "));
    const fileTitle = titleLine?.replace(/^#\s+/, "");
    if (!fileTitle) {
      errors.push(`Missing title: ${lesson.path}`);
      continue;
    }

    if (normalizeTitle(fileTitle) !== normalizeTitle(lesson.title)) {
      errors.push(`Title mismatch: ${lesson.path} (index: ${lesson.title}, file: ${fileTitle})`);
    }

    // Ensure assignment/completion section exists, and branch naming follows the curriculum rule.
    if (typeof lesson.hasAssignment === "boolean") {
      if (lesson.hasAssignment) {
        const section = extractH2Section(content, "課題提出");
        if (!section) {
          errors.push(`Missing required section: ${lesson.path} (## 課題提出)`);
        } else {
          const expectedBranch = `feature/${basename(lesson.path, ".md")}`;
          if (!section.includes(expectedBranch)) {
            errors.push(
              `課題提出 must include branch name \`${expectedBranch}\`: ${lesson.path}`
            );
          }
        }
      } else {
        const section = extractH2Section(content, "完了記録");
        if (!section) {
          errors.push(`Missing required section: ${lesson.path} (## 完了記録)`);
        }
      }
    }

    // Ensure internal chapter links are valid for the viewer (path-based navigation).
    {
      const lines = content.split(/\r?\n/);
      let inFence = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("```")) {
          inFence = !inFence;
          continue;
        }
        if (inFence) continue;

        const linkMatches = line.matchAll(
          /\[([^\]]+)\]\(((?:\.\/|chapters\/)[^)\s]+?\.md)\)/g
        );
        for (const match of linkMatches) {
          const label = match[1].trim();
          const target = match[2].trim();
          const canonical = target.startsWith("./") ? `chapters/${target.slice(2)}` : target;
          const expected = pathToTitle.get(canonical);
          if (!expected) {
            errors.push(
              `${lesson.path}: link target \`${target}\` does not match any lesson path in index.json at line ${i + 1}.`
            );
            continue;
          }
          if (label !== expected) {
            const recommendedTarget = `./${basename(canonical)}`;
            warnings.push(
              `${lesson.path}: link text should match sidebar title ([${expected}](${recommendedTarget})) at line ${i + 1}.`
            );
          }
          if (target.startsWith("chapters/")) {
            errors.push(
              `${lesson.path}: use relative links like \`./${basename(canonical)}\` instead of \`${target}\` at line ${i + 1}.`
            );
          }
        }

        // Disallow visible raw chapter paths (students shouldn't see file names).
        const stripped = line.replace(
          /\[[^\]]*\]\(((?:\.\/|chapters\/)[^)\s]+?\.md)\)/g,
          ""
        );
        const rawMatch = stripped.match(/(?:chapters\/|\.\/)[^\s)]+?\.md/);
        if (rawMatch) {
          warnings.push(
            `${lesson.path}: avoid showing raw chapter path \`${rawMatch[0]}\` at line ${i + 1} (use a title link).`
          );
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn("Warnings:\n" + warnings.map((warning) => `- ${warning}`).join("\n"));
}

console.log("Validation passed.");
