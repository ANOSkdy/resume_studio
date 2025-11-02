#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const IGNORED_DIRS = new Set(["node_modules", ".next", "dist", "build", ".vercel"]);
const TARGET_EXT = new Set([".ts", ".tsx"]);

const targets = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
    } else if (TARGET_EXT.has(path.extname(entry))) {
      targets.push(fullPath);
    }
  }
}

walk(ROOT);

const pattern = /<Text[^>]*>[\s\S]*?<\w+/m;
const bad = [];

for (const file of targets) {
  const source = fs.readFileSync(file, "utf8");
  if (pattern.test(source)) {
    bad.push({ file, message: "Nested element under <Text>" });
  }
}

if (bad.length > 0) {
  console.error("❌ Suspicious <Text> usage:");
  for (const { file, message } of bad) {
    console.error(`- ${message}: ${path.relative(ROOT, file)}`);
  }
  process.exit(1);
}

console.log("✅ No suspicious <Text> usage found.");
