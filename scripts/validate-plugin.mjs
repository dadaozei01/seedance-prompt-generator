import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pluginRoot = path.join(root, "plugins", "seedance-prompt-generator");
const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
const skillsRoot = path.join(pluginRoot, "skills");
const expectedSkills = new Set([
  "generating-seedance-prompts",
  "generating-nano-banana-prompts",
  "generating-chatgpt-image-prompts",
]);
const imageHeadings = ["\u3010\u63d0\u793a\u8bcd\u6210\u54c1\u3011", "\u3010\u8d1f\u9762\u7ea6\u675f\u3011", "\u3010\u53c2\u8003\u56fe\u7ed1\u5b9a\u3011", "\u3010\u53c2\u6570\u5efa\u8bae\u3011", "\u3010\u98ce\u683c\u951a\u70b9\u3011", "\u3010\u4e00\u81f4\u6027\u68c0\u67e5\u3011", "\u3010\u4e0b\u6b21\u53ef\u590d\u7528\u77ed\u53e5\u3011"];
const seedanceHeadings = ["\u3010\u63d0\u793a\u8bcd\u6210\u54c1\u3011", "\u3010\u8d1f\u9762\u7ea6\u675f\u3011", "\u3010\u7d20\u6750\u7ed1\u5b9a\u3011", "\u3010\u53c2\u6570\u5efa\u8bae\u3011", "\u3010\u4e00\u81f4\u6027\u68c0\u67e5\u3011", "\u3010\u4e0b\u6b21\u53ef\u590d\u7528\u77ed\u53e5\u3011"];
const seedanceTerms = ["\u5373\u68a6", "\u751f\u6210\u89c6\u9891\u63d0\u793a\u8bcd", "\u5199\u89c6\u9891\u63d0\u793a\u8bcd", "\u6309\u8fd9\u79cd\u98ce\u683c\u751f\u6210\u89c6\u9891", "\u56fe\u751f\u89c6\u9891", "\u89c6\u9891\u5ef6\u957f", "\u0053\u0065\u0065\u0064\u0061\u006e\u0063\u0065\u0020\u0032\u002e\u0030\u002f\u0032\u002e\u0035", "\u0053\u0065\u0065\u0064\u0061\u006e\u0063\u0065\u0020\u0032\u002e\u0035", "\u0040\u56fe\u7247\u0031", "\u0040\u89c6\u9891\u0031", "\u0040\u97f3\u9891\u0031", "\u0033\u0030\u2013\u0031\u0038\u0030\u0020\u79d2"];
const imageSkillRequirements = {
  "generating-nano-banana-prompts": {
    terms: ["Nano Banana", "Nano Banana Pro", "Gemini 生图", "Gemini 图片提示词", "【Nano Banana 版】"],
    references: ["references/nano-banana-guide.md", "references/templates.md"],
  },
  "generating-chatgpt-image-prompts": {
    terms: ["ChatGPT Images 2.0", "ChatGPT Image 2", "Images 2.0", "Image 2", "ChatGPT 生图", "OpenAI 图片提示词", "只修改", "ChatGPT Images 2.0 版"],
    references: ["references/chatgpt-images-guide.md", "references/templates.md"],
  },
};
const knownMojibake = /(?:锟|鐢熸垚|鎻愮ず|瑙嗛|Ã.|Â.|â..)/;
const failures = [];
const decoder = new TextDecoder("utf-8", { fatal: true });

function fail(message) {
  failures.push(message);
}

function readText(file) {
  try {
    const text = decoder.decode(fs.readFileSync(file));
    if (text.includes("\uFFFD") || knownMojibake.test(text)) fail(`mojibake: ${path.relative(root, file)}`);
    return text;
  } catch (error) {
    fail(`invalid UTF-8: ${path.relative(root, file)}`);
    return "";
  }
}

function requiredString(object, key, label) {
  if (typeof object[key] !== "string" || !object[key].trim()) fail(`${label} must be a non-empty string`);
}

function requireContains(text, values, label) {
  for (const value of values) {
    if (!text.includes(value)) fail(`${label} missing ${value}`);
  }
}

function parseFrontmatter(text, dir) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    fail(`invalid frontmatter: ${dir}`);
    return {};
  }
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([a-z_]+):\s*(.+)$/);
    if (!field) {
      fail(`invalid frontmatter field: ${dir}`);
      continue;
    }
    const [, key, rawValue] = field;
    if (!["name", "description"].includes(key) || Object.hasOwn(fields, key) || /[\[\]{}]/.test(rawValue)) {
      fail(`invalid frontmatter field: ${dir}`);
      continue;
    }
    fields[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2").trim();
  }
  return fields;
}

const manifestText = readText(manifestPath);
let manifest = {};
try {
  manifest = JSON.parse(manifestText);
} catch {
  fail("manifest must be valid JSON");
}

if (manifest.name !== "seedance-prompt-generator") fail("manifest name must match plugin directory");
if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(manifest.version ?? "")) fail("manifest version must be strict semver");
if (manifest.version !== "1.1.0") fail("manifest version must be 1.1.0");
for (const key of ["description", "homepage", "repository", "license", "skills"]) requiredString(manifest, key, `manifest ${key}`);
for (const key of ["homepage", "repository"]) if (typeof manifest[key] === "string" && !/^https:\/\//.test(manifest[key])) fail(`manifest ${key} must use HTTPS`);
if (manifest.skills !== "./skills/") fail("manifest skills path must be ./skills/");
if (!Array.isArray(manifest.keywords) || manifest.keywords.length === 0 || !manifest.keywords.every((value) => typeof value === "string")) fail("manifest keywords must be a non-empty string array");
if (!manifest.author || typeof manifest.author !== "object") fail("manifest author must be an object");
else {
  requiredString(manifest.author, "name", "manifest author.name");
  requiredString(manifest.author, "url", "manifest author.url");
}
if (!manifest.interface || typeof manifest.interface !== "object") fail("manifest interface must be an object");
else {
  for (const key of ["displayName", "shortDescription", "longDescription", "developerName", "category", "websiteURL", "brandColor", "composerIcon", "logo"]) requiredString(manifest.interface, key, `manifest interface.${key}`);
  if (!Array.isArray(manifest.interface.defaultPrompt) || manifest.interface.defaultPrompt.length < 1 || manifest.interface.defaultPrompt.length > 3 || !manifest.interface.defaultPrompt.every((value) => typeof value === "string" && value.trim())) fail("manifest interface.defaultPrompt must contain 1-3 non-empty strings");
  for (const key of ["composerIcon", "logo"]) {
    const resource = manifest.interface[key];
    if (typeof resource === "string" && (!resource.startsWith("./") || !fs.existsSync(path.join(pluginRoot, resource)))) fail(`manifest interface.${key} must reference an existing plugin resource`);
  }
}

const skillDirs = fs.existsSync(skillsRoot)
  ? fs.readdirSync(skillsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  : [];
for (const name of expectedSkills) if (!skillDirs.includes(name)) fail(`missing skill: ${name}`);

const seenNames = new Set();
for (const dir of skillDirs) {
  const skillRoot = path.join(skillsRoot, dir);
  const skillFile = path.join(skillRoot, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    fail(`missing SKILL.md: ${dir}`);
    continue;
  }
  const body = readText(skillFile);
  const frontmatter = parseFrontmatter(body, dir);
  const expectedName = dir;
  if (frontmatter.name !== expectedName) fail(`skill name must match directory: ${dir}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.name ?? "")) fail(`invalid skill name: ${dir}`);
  if (!frontmatter.description?.startsWith("Use when")) fail(`skill description must start with Use when: ${dir}`);
  if (seenNames.has(frontmatter.name)) fail(`duplicate skill name: ${frontmatter.name}`);
  else if (frontmatter.name) seenNames.add(frontmatter.name);

  for (const link of body.matchAll(/\]\((references\/[^)]+)\)/g)) {
    if (!fs.existsSync(path.join(skillRoot, link[1]))) fail(`broken reference in ${dir}: ${link[1]}`);
  }

  if (dir === "generating-seedance-prompts") {
    requireContains(body, seedanceTerms, dir);
    requireContains(body, seedanceHeadings, dir);
  } else if (expectedSkills.has(dir)) {
    requireContains(body, imageHeadings, dir);
    const requirements = imageSkillRequirements[dir];
    requireContains(body, requirements.terms, dir);
    for (const reference of requirements.references) {
      if (!body.includes(`](${reference})`)) fail(`${dir} must link ${reference}`);
    }
  }

  const agentFile = path.join(skillRoot, "agents", "openai.yaml");
  if (!fs.existsSync(agentFile)) fail(`missing agents/openai.yaml: ${dir}`);
  else {
    const agentBody = readText(agentFile);
    requireContains(agentBody, ["display_name:", "short_description:", "default_prompt:", `$${dir}`], `${dir} openai.yaml`);
  }
}

for (const file of fs.readdirSync(pluginRoot, { recursive: true })) {
  const absolute = path.join(pluginRoot, file);
  if (!fs.statSync(absolute).isFile() || !/\.(md|json|yaml)$/.test(file)) continue;
  readText(absolute);
}

const readme = readText(path.join(root, "README.md"));
requireContains(readme, [
  "generating-seedance-prompts",
  "generating-nano-banana-prompts",
  "generating-chatgpt-image-prompts",
  "Seedance 2.5",
  "Nano Banana",
  "ChatGPT Images 2.0",
], "README");

if (failures.length) {
  console.error([...new Set(failures)].join("\n"));
  process.exit(1);
}
console.log("Plugin validation passed.");
