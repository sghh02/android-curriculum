import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function readFirstH1(markdown) {
  const match = markdown.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

function firstNonEmptyLine(markdown) {
  for (const line of markdown.split(/\r?\n/)) {
    if (line.trim() !== "") return line;
  }
  return null;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function isNonNegativeNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isKebabCaseId(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasH2(markdown, headingText) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(headingText)}\\s*$`, "m");
  return pattern.test(markdown);
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

function fenceOpeningsWithoutLanguage(markdown) {
  const lines = markdown.split(/\r?\n/);
  const issues = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("```")) continue;
    if (!inFence) {
      const lang = line.slice(3).trim();
      if (lang === "") issues.push(i + 1);
      inFence = true;
    } else {
      inFence = false;
    }
  }
  return issues;
}

function hasUnclosedFence(markdown) {
  const lines = markdown.split(/\r?\n/);
  let inFence = false;
  for (const line of lines) {
    if (!line.startsWith("```")) continue;
    inFence = !inFence;
  }
  return inFence;
}

function countTopLevelH1OutsideFences(markdown) {
  const lines = markdown.split(/\r?\n/);
  let inFence = false;
  let count = 0;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (/^#\s+/.test(line)) count += 1;
  }
  return count;
}

function formatItemRef(item) {
  return `${item.unitId}/${item.itemId} (${item.path})`;
}

async function main() {
  const errors = [];
  const warnings = [];

  const allowedDifficulties = new Set(["beginner", "intermediate", "advanced"]);
  const allowedTypes = new Set(["guide", "lesson", "hands-on", "project", "reference"]);

  let index;
  try {
    const raw = await fs.readFile("index.json", "utf8");
    index = JSON.parse(raw);
  } catch (error) {
    console.error("ERROR: Failed to read/parse index.json");
    console.error(String(error));
    process.exitCode = 1;
    return;
  }

  if (!index || typeof index !== "object" || Array.isArray(index)) {
    console.error("ERROR: index.json must be a JSON object.");
    process.exitCode = 1;
    return;
  }

  const chapters = index.chapters;
  if (!Array.isArray(chapters)) {
    console.error("ERROR: index.json must contain a top-level `chapters` array.");
    process.exitCode = 1;
    return;
  }

  const items = [];
  for (const chapter of chapters) {
    const unitId = chapter?.id ?? "(missing-unit-id)";
    if (!isNonEmptyString(chapter?.id)) {
      errors.push(`Unit ${unitId}: missing a non-empty string \`id\`.`);
    } else if (!isKebabCaseId(chapter.id)) {
      errors.push(`Unit ${unitId}: unit id must be kebab-case (got \`${chapter.id}\`).`);
    }
    if (!isNonEmptyString(chapter?.title)) {
      errors.push(`Unit ${unitId}: missing a non-empty string \`title\`.`);
    }

    const chapterItems = chapter?.items;
    if (!Array.isArray(chapterItems)) {
      errors.push(`Unit ${unitId}: missing or invalid \`items\` array.`);
      continue;
    }
    for (const item of chapterItems) {
      items.push({
        unitId,
        itemId: item?.id,
        title: item?.title,
        path: item?.path,
        estimatedMinutes: item?.estimatedMinutes,
        practiceMinutes: item?.practiceMinutes,
        hasAssignment: item?.hasAssignment,
        difficulty: item?.difficulty,
        type: item?.type,
        tags: item?.tags,
        prerequisites: item?.prerequisites,
      });
    }
  }

  const idToItems = new Map();
  const pathToItems = new Map();

  for (const item of items) {
    if (typeof item.itemId !== "string" || item.itemId.trim() === "") {
      errors.push(`${item.unitId}: item is missing a non-empty string \`id\`.`);
      continue;
    }
    if (!isKebabCaseId(item.itemId)) {
      errors.push(`${formatItemRef(item)}: lesson id must be kebab-case (got \`${item.itemId}\`).`);
    }
    if (typeof item.title !== "string" || item.title.trim() === "") {
      errors.push(`${formatItemRef(item)}: missing a non-empty string \`title\`.`);
    }
    if (typeof item.path !== "string" || item.path.trim() === "") {
      errors.push(`${formatItemRef(item)}: missing a non-empty string \`path\`.`);
      continue;
    }
    if (!isPositiveNumber(item.estimatedMinutes)) {
      errors.push(
        `${formatItemRef(item)}: missing or invalid \`estimatedMinutes\` (expected number > 0).`
      );
    }
    if (typeof item.hasAssignment !== "boolean") {
      errors.push(
        `${formatItemRef(item)}: missing or invalid \`hasAssignment\` (expected boolean).`
      );
    }
    if (!isNonNegativeNumber(item.practiceMinutes)) {
      errors.push(
        `${formatItemRef(item)}: missing or invalid \`practiceMinutes\` (expected number >= 0).`
      );
    }
    if (!isNonEmptyString(item.type) || !allowedTypes.has(item.type)) {
      errors.push(
        `${formatItemRef(item)}: missing or invalid \`type\` (expected one of: ${[
          ...allowedTypes,
        ].join(", ")}).`
      );
    }
    if (!isNonEmptyString(item.difficulty) || !allowedDifficulties.has(item.difficulty)) {
      errors.push(
        `${formatItemRef(item)}: missing or invalid \`difficulty\` (expected one of: ${[
          ...allowedDifficulties,
        ].join(", ")}).`
      );
    }
    if (!Array.isArray(item.tags) || item.tags.length === 0 || !item.tags.every(isNonEmptyString)) {
      errors.push(`${formatItemRef(item)}: missing or invalid \`tags\` (expected non-empty string[]).`);
    } else {
      const normalized = item.tags.map((t) => t.trim());
      const unique = new Set(normalized);
      if (unique.size !== normalized.length) {
        errors.push(`${formatItemRef(item)}: \`tags\` contains duplicates.`);
      }
    }

    if (!Array.isArray(item.prerequisites) || !item.prerequisites.every(isNonEmptyString)) {
      errors.push(
        `${formatItemRef(item)}: missing or invalid \`prerequisites\` (expected string[]).`
      );
    } else {
      const normalized = item.prerequisites.map((x) => x.trim());
      const unique = new Set(normalized);
      if (unique.size !== normalized.length) {
        errors.push(`${formatItemRef(item)}: \`prerequisites\` contains duplicates.`);
      }
    }

    idToItems.set(item.itemId, (idToItems.get(item.itemId) ?? []).concat(item));
    pathToItems.set(item.path, (pathToItems.get(item.path) ?? []).concat(item));
  }

  const pathToTitle = new Map();
  for (const item of items) {
    if (typeof item.path === "string" && typeof item.title === "string") {
      pathToTitle.set(item.path, item.title);
    }
  }

  for (const [itemId, group] of idToItems.entries()) {
    if (group.length > 1) {
      errors.push(
        `Duplicate lesson id \`${itemId}\`: ${group.map(formatItemRef).join(", ")}`
      );
    }
  }

  for (const [lessonPath, group] of pathToItems.entries()) {
    if (group.length > 1) {
      errors.push(
        `Lesson path \`${lessonPath}\` is referenced by multiple items: ${group
          .map((x) => `${x.unitId}/${x.itemId}`)
          .join(", ")}`
      );
    }
  }

  const allItemIds = new Set(items.map((i) => i.itemId).filter(Boolean));
  for (const item of items) {
    if (!Array.isArray(item.prerequisites)) continue;
    for (const prereqId of item.prerequisites) {
      if (prereqId === item.itemId) {
        errors.push(`${formatItemRef(item)}: \`prerequisites\` must not contain itself.`);
        continue;
      }
      if (!allItemIds.has(prereqId)) {
        errors.push(`${formatItemRef(item)}: \`prerequisites\` references unknown id \`${prereqId}\`.`);
      }
    }
  }

  // Prerequisites ordering and cycles.
  const itemIdToOrder = new Map(items.map((item, index) => [item.itemId, index]));
  for (const item of items) {
    if (!Array.isArray(item.prerequisites)) continue;
    for (const prereqId of item.prerequisites) {
      const prereqOrder = itemIdToOrder.get(prereqId);
      const itemOrder = itemIdToOrder.get(item.itemId);
      if (prereqOrder == null || itemOrder == null) continue;
      if (prereqOrder > itemOrder) {
        warnings.push(
          `${formatItemRef(item)}: prerequisite \`${prereqId}\` appears after this lesson in index.json.`
        );
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  const stack = [];

  function dfs(itemId) {
    if (visited.has(itemId)) return;
    if (visiting.has(itemId)) {
      const start = stack.indexOf(itemId);
      const cycle = stack.slice(start).concat(itemId);
      errors.push(`Prerequisite cycle detected: ${cycle.join(" -> ")}`);
      return;
    }
    visiting.add(itemId);
    stack.push(itemId);

    const item = items.find((x) => x.itemId === itemId);
    if (item && Array.isArray(item.prerequisites)) {
      for (const prereqId of item.prerequisites) dfs(prereqId);
    }

    stack.pop();
    visiting.delete(itemId);
    visited.add(itemId);
  }

  for (const itemId of allItemIds) dfs(itemId);

  for (const item of items) {
    if (typeof item.path !== "string" || item.path.trim() === "") continue;

    if (path.isAbsolute(item.path) || item.path.includes("..")) {
      errors.push(`${formatItemRef(item)}: invalid relative path \`${item.path}\`.`);
      continue;
    }

    if (!item.path.startsWith("chapters/") || !item.path.endsWith(".md")) {
      warnings.push(
        `${formatItemRef(item)}: expected path under \`chapters/\` with \`.md\` extension.`
      );
    }

    try {
      const markdown = await fs.readFile(item.path, "utf8");
      const h1 = readFirstH1(markdown);
      if (!h1) {
        errors.push(`${formatItemRef(item)}: missing a top-level H1 (# ...) in Markdown.`);
        continue;
      }
      if (typeof item.title === "string" && item.title.trim() !== "" && h1 !== item.title) {
        errors.push(
          `${formatItemRef(item)}: title mismatch (index: "${item.title}" vs H1: "${h1}").`
        );
      }

      const firstLine = firstNonEmptyLine(markdown);
      if (!firstLine?.startsWith("# ")) {
        warnings.push(`${formatItemRef(item)}: expected the first non-empty line to be a top-level H1.`);
      }

      const h1Count = countTopLevelH1OutsideFences(markdown);
      if (h1Count !== 1) {
        warnings.push(`${formatItemRef(item)}: expected exactly one top-level H1 in Markdown.`);
      }

      const fenceLines = fenceOpeningsWithoutLanguage(markdown);
      for (const lineNumber of fenceLines) {
        warnings.push(`${formatItemRef(item)}: code fence missing language tag at line ${lineNumber}.`);
      }

      if (hasUnclosedFence(markdown)) {
        warnings.push(`${formatItemRef(item)}: code fence is not closed (unmatched \`\`\`).`);
      }

      // Ensure assignment/completion section exists, and branch naming follows the curriculum rule.
      if (typeof item.hasAssignment === "boolean") {
        if (item.hasAssignment) {
          const section = extractH2Section(markdown, "課題提出");
          if (!section) {
            errors.push(`${formatItemRef(item)}: missing required section \`## 課題提出\`.`);
          } else {
            const expectedBranch = `feature/${path.basename(item.path, ".md")}`;
            if (!section.includes(expectedBranch)) {
              errors.push(
                `${formatItemRef(item)}: \`## 課題提出\` must include branch name \`${expectedBranch}\`.`
              );
            }
          }
        } else {
          const section = extractH2Section(markdown, "完了記録");
          if (!section) {
            errors.push(`${formatItemRef(item)}: missing required section \`## 完了記録\`.`);
          }
        }
      }

      // Ensure internal chapter links use the sidebar title as link text.
      {
        const lines = markdown.split(/\r?\n/);
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
                `${formatItemRef(item)}: link target \`${target}\` does not match any lesson path in index.json (expected a \`./NN-*.md\` chapter link) at line ${i + 1}.`
              );
              continue;
            }
            if (label !== expected) {
              const recommendedTarget = `./${path.basename(canonical)}`;
              warnings.push(
                `${formatItemRef(item)}: link text should match sidebar title ([${expected}](${recommendedTarget})) at line ${i + 1}.`
              );
            }
            if (target.startsWith("chapters/")) {
              errors.push(
                `${formatItemRef(item)}: use relative links like \`./${path.basename(canonical)}\` instead of \`${target}\` at line ${i + 1}.`
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
              `${formatItemRef(item)}: avoid showing raw chapter path \`${rawMatch[0]}\` at line ${i + 1} (use a title link).`
            );
          }
        }
      }

      const expectedHeadings = [
        "前提",
        "この章でできるようになること",
        "AIに聞いてみよう",
        "演習",
        "ふりかえり",
        "次の章",
      ];
      for (const heading of expectedHeadings) {
        if (!hasH2(markdown, heading)) {
          warnings.push(`${formatItemRef(item)}: missing heading \`## ${heading}\`.`);
        }
      }
    } catch {
      errors.push(`${formatItemRef(item)}: referenced file not found.`);
    }
  }

  // Warn about unreferenced Markdown files in chapters/.
  try {
    const entries = await fs.readdir("chapters", { withFileTypes: true });
    const chapterFiles = entries
      .filter((e) => e.isFile() && e.name.endsWith(".md"))
      .map((e) => `chapters/${e.name}`)
      .sort();

    const referenced = new Set(items.map((i) => i.path).filter(Boolean));
    const extra = chapterFiles.filter((p) => !referenced.has(p));
    if (extra.length) warnings.push(`Unreferenced chapter files: ${extra.join(", ")}`);
  } catch {
    // Ignore if chapters/ doesn't exist (other checks will surface it).
  }

  const heading = (label, count) => `${label}: ${count}`;
  console.log(heading("Lessons", items.length));
  console.log(heading("Errors", errors.length));
  console.log(heading("Warnings", warnings.length));

  if (errors.length) {
    console.log("\nErrors:");
    for (const e of errors) console.log(`- ${e}`);
  }
  if (warnings.length) {
    console.log("\nWarnings:");
    for (const w of warnings) console.log(`- ${w}`);
  }

  if (errors.length) process.exitCode = 1;
}

await main();
