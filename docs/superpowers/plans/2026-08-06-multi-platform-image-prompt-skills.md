# Multi-Platform Image Prompt Skills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing Seedance Prompt Generator plugin with isolated Nano Banana and ChatGPT Images 2.0 prompt-generation skills while preserving Seedance behavior.

**Architecture:** Keep one plugin package and three independent skills. Each skill owns its platform-specific workflow and reference templates; plugin metadata and README advertise all three routes. A dependency-free Node validator enforces manifest validity, UTF-8 integrity, unique skill names, reference links, routing terms, and required output headings.

**Tech Stack:** Codex plugin manifest JSON, Markdown `SKILL.md` packages, YAML frontmatter, Node.js validation script, Git.

## Global Constraints

- Keep the repository and plugin directory name `seedance-prompt-generator`.
- Keep the existing `generating-seedance-prompts` skill name and Seedance trigger compatibility.
- Add exactly `generating-nano-banana-prompts` and `generating-chatgpt-image-prompts` as independent skills.
- Set plugin version to `1.1.0`.
- Save all text as valid UTF-8 and remove existing mojibake.
- Do not add API calls, runtime dependencies, a website, or image generation code.
- Do not invent unconfirmed platform parameters.
- Keep platform-specific rules isolated; multi-platform requests receive separate outputs.

---

### Task 1: Add the structural validator and repair the Seedance baseline

**Files:**
- Create: `scripts/validate-plugin.mjs`
- Modify: `plugins/seedance-prompt-generator/.codex-plugin/plugin.json`
- Modify: `plugins/seedance-prompt-generator/skills/generating-seedance-prompts/SKILL.md`
- Modify: `plugins/seedance-prompt-generator/skills/generating-seedance-prompts/references/seedance-guide.md`
- Modify: `plugins/seedance-prompt-generator/skills/generating-seedance-prompts/references/templates.md`
- Modify: `plugins/seedance-prompt-generator/skills/generating-seedance-prompts/agents/openai.yaml`

**Interfaces:**
- Consumes: Existing plugin file layout and Seedance 2.0/2.5 behavior.
- Produces: `node scripts/validate-plugin.mjs`, a zero-dependency validation command used by all later tasks.

- [ ] **Step 1: Write the failing validator**

Create `scripts/validate-plugin.mjs` with checks that:

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pluginRoot = path.join(root, "plugins", "seedance-prompt-generator");
const manifestPath = path.join(pluginRoot, ".codex-plugin", "plugin.json");
const skillsRoot = path.join(pluginRoot, "skills");
const expected = new Set([
  "generating-seedance-prompts",
  "generating-nano-banana-prompts",
  "generating-chatgpt-image-prompts",
]);
const requiredHeadings = [
  "【提示词成品】",
  "【负面约束】",
  "【参考图绑定】",
  "【参数建议】",
  "【风格锚点】",
  "【一致性检查】",
  "【下次可复用短句】",
];

const failures = [];
const read = (file) => fs.readFileSync(file, "utf8");
const manifest = JSON.parse(read(manifestPath));
if (manifest.version !== "1.1.0") failures.push("manifest version must be 1.1.0");

const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);
for (const name of expected) {
  if (!skillDirs.includes(name)) failures.push(`missing skill: ${name}`);
}

const seenNames = new Set();
for (const dir of skillDirs) {
  const skillFile = path.join(skillsRoot, dir, "SKILL.md");
  if (!fs.existsSync(skillFile)) continue;
  const body = read(skillFile);
  const match = body.match(/^---\r?\nname:\s*([^\r\n]+)[\s\S]*?\r?\n---/);
  if (!match) failures.push(`invalid frontmatter: ${dir}`);
  else if (seenNames.has(match[1])) failures.push(`duplicate skill name: ${match[1]}`);
  else seenNames.add(match[1]);

  for (const link of body.matchAll(/\]\((references\/[^)]+)\)/g)) {
    if (!fs.existsSync(path.join(skillsRoot, dir, link[1]))) {
      failures.push(`broken reference in ${dir}: ${link[1]}`);
    }
  }
  if (dir !== "generating-seedance-prompts") {
    for (const heading of requiredHeadings) {
      if (!body.includes(heading)) failures.push(`${dir} missing ${heading}`);
    }
  }
}

for (const file of fs.readdirSync(pluginRoot, { recursive: true })) {
  const absolute = path.join(pluginRoot, file);
  if (!fs.statSync(absolute).isFile() || !/\.(md|json|yaml)$/.test(file)) continue;
  const body = read(absolute);
  if (body.includes("�") || /鐢熸垚|鎻愮ず|瑙嗛/.test(body)) failures.push(`mojibake: ${file}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Plugin validation passed.");
```

- [ ] **Step 2: Run the validator and confirm the baseline fails**

Run: `node scripts/validate-plugin.mjs`

Expected: non-zero exit reporting manifest version, two missing skills, and mojibake in existing files.

- [ ] **Step 3: Repair the existing Seedance files and manifest encoding**

Rewrite the affected files as valid UTF-8 while preserving these Seedance contracts:

- Default version remains Seedance 2.5 unless the user asks for 2.0.
- Supported intents remain text-to-video, image-to-video, first/last frames, multimodal reference, editing, extension, and long video.
- Material references remain `@图片1`, `@视频1`, and `@音频1` with explicit responsibility and exclusions.
- Timeline segments remain continuous and non-overlapping.
- Output retains `【提示词成品】`, `【负面约束】`, `【素材绑定】`, `【参数建议】`, `【一致性检查】`, and `【下次可复用短句】`.

Update `plugin.json` to valid Chinese examples, version `1.1.0`, and metadata that mentions all three platforms without renaming the plugin directory.

- [ ] **Step 4: Run validation and inspect the expected remaining failures**

Run: `node scripts/validate-plugin.mjs`

Expected: failure only for the two missing image skills.

- [ ] **Step 5: Commit the baseline repair**

```powershell
git add scripts plugins/seedance-prompt-generator
git commit -m "fix: restore utf-8 plugin baseline"
```

---

### Task 2: Add the Nano Banana prompt skill

**Files:**
- Create: `plugins/seedance-prompt-generator/skills/generating-nano-banana-prompts/SKILL.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-nano-banana-prompts/references/nano-banana-guide.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-nano-banana-prompts/references/templates.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-nano-banana-prompts/agents/openai.yaml`

**Interfaces:**
- Consumes: User brief, optional ordered reference images, target task type.
- Produces: Gemini/Nano Banana-specific prompt package with the seven required output headings.

- [ ] **Step 1: Add Nano-specific validator assertions**

Extend `scripts/validate-plugin.mjs` so Nano `SKILL.md` must contain the routing terms `Nano Banana`, `Gemini 生图`, and `Nano Banana Pro`, and must link both reference files.

- [ ] **Step 2: Run validation and verify the Nano assertions fail**

Run: `node scripts/validate-plugin.mjs`

Expected: failure for the missing Nano skill and routing terms.

- [ ] **Step 3: Implement the Nano Banana skill package**

Write a focused `SKILL.md` that routes text generation, editing, multi-reference composition, face consistency, product/brand work, in-image text, and template requests. It must instruct the model to read `nano-banana-guide.md` and only the matching section of `templates.md`.

The guide must encode:

- Narrative scene descriptions instead of keyword piles.
- Subject/action/location/composition/camera/light/style/material/text/output ordering.
- Explicit per-image responsibility and exclusions.
- Invariant subject versus variant scene separation.
- Precise edit scope and preservation list.
- Face geometry, age, texture, natural asymmetry, and no automatic beautification.
- Semantic positive state plus concise negative constraints.
- Small-step conversational iteration.

Templates must include complete shells for text-to-image, precise editing, multi-reference input, face consistency, product/brand consistency, in-image text, and placeholder mode.

- [ ] **Step 4: Run validation and manually sample the route**

Run: `node scripts/validate-plugin.mjs`

Expected: only ChatGPT Images skill remains missing.

Manual sample: read the Nano skill as the active instruction and answer “给我一段 Nano Banana 的咖啡产品海报提示词”; verify the result is narrative, Gemini-specific, and contains all seven headings.

- [ ] **Step 5: Commit the Nano skill**

```powershell
git add scripts plugins/seedance-prompt-generator/skills/generating-nano-banana-prompts
git commit -m "feat: add Nano Banana prompt skill"
```

---

### Task 3: Add the ChatGPT Images 2.0 prompt skill

**Files:**
- Create: `plugins/seedance-prompt-generator/skills/generating-chatgpt-image-prompts/SKILL.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-chatgpt-image-prompts/references/chatgpt-images-guide.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-chatgpt-image-prompts/references/templates.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-chatgpt-image-prompts/agents/openai.yaml`

**Interfaces:**
- Consumes: User brief, optional ordered reference images, target task type.
- Produces: ChatGPT Images 2.0-specific prompt package with the seven required output headings.

- [ ] **Step 1: Add ChatGPT Images-specific validator assertions**

Extend `scripts/validate-plugin.mjs` so ChatGPT `SKILL.md` must contain `ChatGPT Images 2.0`, `Image 2`, `ChatGPT 生图`, the phrase `只修改`, and links to both reference files.

- [ ] **Step 2: Run validation and confirm it fails for the missing skill**

Run: `node scripts/validate-plugin.mjs`

Expected: failure for the missing ChatGPT Images skill and required routing/edit terms.

- [ ] **Step 3: Implement the ChatGPT Images skill package**

Write a focused `SKILL.md` and references that enforce:

- Clear, direct natural language; simple briefs become 1–3 complete sentences.
- Complex commercial tasks may use structured paragraphs.
- Purpose/subject/action/environment/composition/style/light/constraints/aspect ratio ordering.
- Precise edit syntax: change only the named area and keep everything else unchanged.
- A small ordered set of reference images with explicit responsibilities.
- Quoted short text plus font, size, color, placement, and no extra text.
- Small, single-variable follow-up edits.
- No JSON by default and no invented parameters.

Templates must cover text-to-image, precise editing, multi-reference input, product work, in-image text, transparent-background assets, infographics, and placeholder mode.

- [ ] **Step 4: Run validation and manually sample the route**

Run: `node scripts/validate-plugin.mjs`

Expected: `Plugin validation passed.`

Manual sample: read the ChatGPT Images skill as the active instruction and answer “生成一段 Image 2 的极简电商主图提示词”; verify the core prompt is compact, direct, platform-specific, and contains all seven headings.

- [ ] **Step 5: Commit the ChatGPT Images skill**

```powershell
git add scripts plugins/seedance-prompt-generator/skills/generating-chatgpt-image-prompts
git commit -m "feat: add ChatGPT Images prompt skill"
```

---

### Task 4: Document routing, verify compatibility, and publish

**Files:**
- Modify: `README.md`
- Modify: `scripts/validate-plugin.mjs`

**Interfaces:**
- Consumes: All three completed skills and plugin metadata.
- Produces: User-facing installation/usage documentation and final release validation.

- [ ] **Step 1: Add README assertions to the validator**

Require README to contain all three skill names, the phrases `Nano Banana`, `ChatGPT Images 2.0`, and `Seedance 2.5`, plus at least one example invocation for each platform.

- [ ] **Step 2: Run validation and verify README coverage fails**

Run: `node scripts/validate-plugin.mjs`

Expected: failure listing missing README coverage.

- [ ] **Step 3: Rewrite README for the multi-platform plugin**

Document:

- The one-plugin/three-skill architecture.
- Installation from `dadaozei01/seedance-prompt-generator`.
- Trigger phrases and examples for Seedance, Nano Banana, and ChatGPT Images 2.0.
- The seven-section image prompt output contract.
- Separate-output behavior when two image platforms are requested together.
- Compatibility statement that existing Seedance prompts continue to work.
- Version `1.1.0` release notes.

- [ ] **Step 4: Run full verification**

Run:

```powershell
node scripts/validate-plugin.mjs
git diff --check HEAD~3..HEAD
git status --short
```

Expected: validator passes; no whitespace errors; working tree contains only the planned README/validator changes before the final commit.

- [ ] **Step 5: Perform manual routing regression checks**

Check these six prompts against the skill descriptions and output contracts:

```text
生成一条15秒Seedance香水广告提示词。
给我一段Nano Banana的咖啡产品海报提示词。
生成一段Image 2的极简电商主图提示词。
用图1锁定人物、图2参考姿势，生成Nano Banana提示词。
只把原图沙发改成棕色真皮，Image 2。
分别给Nano Banana和Image 2各写一版。
```

Expected: correct isolated routing; no video timeline in image prompts; no Gemini-only strategy in ChatGPT output; dual-platform request yields two labeled outputs.

- [ ] **Step 6: Commit documentation and final validation**

```powershell
git add README.md scripts/validate-plugin.mjs
git commit -m "docs: document multi-platform prompt routing"
```

- [ ] **Step 7: Push the completed release**

Run: `git push origin main`

Expected: GitHub accepts all commits and `origin/main` points at the final local commit.

