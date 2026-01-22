import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function readFirstH1(markdown) {
  const match = markdown.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : null;
}

function formatItemRef(item) {
  return `${item.unitId}/${item.itemId} (${item.path})`;
}

async function main() {
  const errors = [];
  const warnings = [];

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
    if (typeof item.title !== "string" || item.title.trim() === "") {
      errors.push(`${formatItemRef(item)}: missing a non-empty string \`title\`.`);
    }
    if (typeof item.path !== "string" || item.path.trim() === "") {
      errors.push(`${formatItemRef(item)}: missing a non-empty string \`path\`.`);
      continue;
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
