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

      const fenceLines = fenceOpeningsWithoutLanguage(markdown);
      for (const lineNumber of fenceLines) {
        warnings.push(`${formatItemRef(item)}: code fence missing language tag at line ${lineNumber}.`);
      }

      const expectedHeadings = ["前提", "この章でできるようになること", "演習", "ふりかえり", "次の章"];
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
