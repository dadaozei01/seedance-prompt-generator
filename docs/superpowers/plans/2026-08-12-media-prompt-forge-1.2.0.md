# MediaPrompt Forge 1.2.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the existing plugin to MediaPrompt Forge 1.2.0 with six isolated, model-specific prompt skills and deterministic low-cost validation.

**Architecture:** Keep the existing plugin ID and three current skills, then add one self-contained skill each for Grok Image, Grok Video, and MiniMax H3. Each skill keeps routing and output contracts in a compact `SKILL.md`, while model rules, templates, and examples load from `references/` only when needed; no universal router or application UI is introduced.

**Tech Stack:** Codex plugin manifest JSON, Markdown Agent Skills, YAML skill UI metadata, dependency-free Node.js validator, PNG brand assets.

## Global Constraints

- Public display name is `MediaPrompt Forge`; Chinese subtitle is `多模态提示词工坊`.
- Plugin version is exactly `1.2.0`; internal plugin ID remains `seedance-prompt-generator`.
- The plugin contains exactly six independent skills and no universal router skill.
- Preserve existing Seedance, Nano Banana, and ChatGPT Images skill names, triggers, and material-binding behavior.
- Keep each `SKILL.md` compact; detailed rules, templates, and examples belong in on-demand references.
- Do not add UI, frontend, database, history, persistent configuration, MCP, or external-service dependencies.
- `【下次可复用短句】` is conditional and appears only for explicit reuse/template/style-continuation intent.
- Validation is local and deterministic; do not spend model quota on large repeated generation runs.
- Use bundled Node at `C:\Users\HWT\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`.

---

### Task 1: Brand and manifest contract

**Files:**
- Modify: `scripts/validate-plugin.mjs`
- Modify: `plugins/seedance-prompt-generator/.codex-plugin/plugin.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: current manifest schema and `readText`, `requireContains`, `requiredString` validator helpers.
- Produces: manifest version `1.2.0`, display name `MediaPrompt Forge`, six-model description/keywords/default prompts, and validator assertions used by the final regression gate.

- [ ] **Step 1: Add failing brand assertions**

In `scripts/validate-plugin.mjs`, replace the fixed `1.1.0` assertion and add:

```js
if (manifest.version !== "1.2.0") fail("manifest version must be 1.2.0");
if (manifest.interface?.displayName !== "MediaPrompt Forge") fail("manifest display name must be MediaPrompt Forge");
requireContains(manifestText, ["Grok Imagine Image 2.0", "Grok Imagine Video 1.5", "MiniMax H3"], "manifest");
```

Extend the README assertion list with `MediaPrompt Forge`, `Grok Imagine Image 2.0`, `Grok Imagine Video 1.5`, and `MiniMax H3`.

- [ ] **Step 2: Run validation and observe the intended failure**

Run:

```powershell
& 'C:\Users\HWT\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/validate-plugin.mjs
```

Expected: FAIL for version, display name, and missing new-model branding.

- [ ] **Step 3: Update manifest and README**

Set manifest values to:

```json
{
  "name": "seedance-prompt-generator",
  "version": "1.2.0",
  "description": "Generate model-specific prompts for image, video, editing, references, and native audiovisual creation.",
  "interface": {
    "displayName": "MediaPrompt Forge",
    "shortDescription": "为图片、视频与原生音画模型生成专属提示词。",
    "longDescription": "将创意整理为 Seedance、Nano Banana、ChatGPT Images、Grok Imagine 与 MiniMax H3 的模型专属提示词。"
  }
}
```

Preserve all existing author, repository, license, skills path, capabilities, URL, color, and asset fields. Add keywords `grok-imagine`, `minimax-h3`, `image-prompt`, `video-prompt`, and `multimodal`. Replace default prompts with one image, one video, and one H3 example. Rewrite the README title, capability table, examples, validation description, and version section for all six skills while preserving installation commands and privacy text.

- [ ] **Step 4: Run the targeted metadata checks**

Run:

```powershell
& 'C:\Users\HWT\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/validate-plugin.mjs
```

Expected: brand/version assertions disappear; validation may still fail only for new skills not yet added.

- [ ] **Step 5: Commit the metadata contract**

```powershell
git add scripts/validate-plugin.mjs plugins/seedance-prompt-generator/.codex-plugin/plugin.json README.md
git commit -m "feat: rebrand plugin as MediaPrompt Forge"
```

---

### Task 2: Grok Imagine Image 2.0 skill

**Files:**
- Modify: `scripts/validate-plugin.mjs`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-image-prompts/SKILL.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-image-prompts/agents/openai.yaml`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-image-prompts/references/grok-image-guide.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-image-prompts/references/templates.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-image-prompts/references/examples.md`

**Interfaces:**
- Consumes: user request, task mode, ordered reference images, explicit ratio/length, previous edit state, and requested language.
- Produces: natural-language Grok image prompt with precise edit deltas, reference roles, dynamic constraints, and conditional reuse output.

- [ ] **Step 1: Add failing Grok Image checks**

Add `generating-grok-image-prompts` to `expectedSkills`, then require these tokens in its `SKILL.md`:

```js
["Grok Imagine Image 2.0", "text-to-image", "image-edit", "multi-reference", "Only modify", "Keep everything else unchanged", "Do not change", "references/grok-image-guide.md", "references/templates.md", "references/examples.md"]
```

Also require `agents/openai.yaml` and all three references through the existing file/link checks.

- [ ] **Step 2: Run validation and observe the missing-skill failure**

Expected: FAIL with `missing skill: generating-grok-image-prompts`.

- [ ] **Step 3: Create the compact skill and references**

Write a `SKILL.md` under 90 lines with this contract:

```markdown
---
name: generating-grok-image-prompts
description: Use when the user explicitly asks for Grok Imagine Image 2.0, Grok Image, Grok 生图, Grok 图片提示词, Grok image generation, precise image editing, continued editing, or Grok multi-reference composition.
---

# 生成 Grok Imagine Image 2.0 提示词

Use natural sentences, concrete object relationships, and minimal task-relevant constraints. Route `text-to-image`, `image-edit`, and `multi-reference` separately. Read the guide first, then only the relevant template; read examples only when the brief is ambiguous or asks for a reusable pattern.
```

The body must define: ordered image roles; minimum-delta editing; quoted exact text; compact/standard length; no tag pile; no invented settings; `Only modify`, `Keep everything else unchanged`, and `Do not change`; the six default image output sections; “只给提示词”; and conditional reuse triggers.

Write `grok-image-guide.md` with sections for generation, edit, continued edit, multi-reference, exact text, dynamic constraints, and lint. Write `templates.md` with complete copyable shells for character concept, app icon, banner, local edit, and character-plus-environment composition. Write `examples.md` with one finished generation example and one finished minimum-delta edit example.

Create `agents/openai.yaml`:

```yaml
interface:
  display_name: "Grok Image 提示词"
  short_description: "生成自然语言生图、精准编辑与多参考图提示词"
  default_prompt: "使用 $generating-grok-image-prompts 生成一份 Grok Imagine Image 2.0 提示词。"
policy:
  allow_implicit_invocation: true
```

- [ ] **Step 4: Run validation**

Expected: Grok Image checks pass; remaining failures concern later skills only.

- [ ] **Step 5: Commit the Grok Image skill**

```powershell
git add scripts/validate-plugin.mjs plugins/seedance-prompt-generator/skills/generating-grok-image-prompts
git commit -m "feat: add Grok Image prompt skill"
```

---

### Task 3: Grok Imagine Video 1.5 skill

**Files:**
- Modify: `scripts/validate-plugin.mjs`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-video-prompts/SKILL.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-video-prompts/agents/openai.yaml`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-video-prompts/references/grok-video-guide.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-video-prompts/references/templates.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-grok-video-prompts/references/examples.md`

**Interfaces:**
- Consumes: text/image/reference-video brief, duration, camera intent, ordered material roles, and continuity requirements.
- Produces: continuous action direction with intermediate states, weight/inertia, camera, environmental response, and no Seedance-style timestamp grid.

- [ ] **Step 1: Add failing Grok Video checks**

Add `generating-grok-video-prompts` to `expectedSkills` and require:

```js
["Grok Imagine Video 1.5", "text-to-video", "image-to-video", "reference-to-video", "weight", "inertia", "Camera", "environmental response", "references/grok-video-guide.md", "references/templates.md", "references/examples.md"]
```

Add an assertion that the skill states a reference video is not the first frame and prohibits dense Seedance timestamp blocks.

- [ ] **Step 2: Run validation and observe the missing-skill failure**

Expected: FAIL with `missing skill: generating-grok-video-prompts`.

- [ ] **Step 3: Create the compact skill and references**

The `SKILL.md` must route `text-to-video`, `image-to-video`, and `reference-to-video`; assign character/object/environment/motion-and-camera roles; preserve a supplied first frame rather than redescribing it; express anticipation, execution, follow-through, weight, inertia, Camera, and environmental response; scale action count to duration; and use the five default video output sections plus conditional reuse output.

Write `grok-video-guide.md` with task routing, action-chain physics, camera binding, fixed-camera behavior, I2V, reference-video exclusions, multi-reference conflicts, dynamic constraints, and lint. Write `templates.md` for idle motion, boss jump-and-smash, fixed camera, first-frame I2V, reference-to-video, and character-plus-environment. Write `examples.md` with a finished fixed-camera example and a finished heavy jump-and-impact example.

Create `agents/openai.yaml`:

```yaml
interface:
  display_name: "Grok Video 提示词"
  short_description: "生成连续动作、物理反馈与电影镜头视频提示词"
  default_prompt: "使用 $generating-grok-video-prompts 生成一份 Grok Imagine Video 1.5 提示词。"
policy:
  allow_implicit_invocation: true
```

- [ ] **Step 4: Run validation**

Expected: Grok Video checks pass; remaining failures concern MiniMax H3 or later regression rules.

- [ ] **Step 5: Commit the Grok Video skill**

```powershell
git add scripts/validate-plugin.mjs plugins/seedance-prompt-generator/skills/generating-grok-video-prompts
git commit -m "feat: add Grok Video prompt skill"
```

---

### Task 4: MiniMax H3 native audiovisual skill

**Files:**
- Modify: `scripts/validate-plugin.mjs`
- Create: `plugins/seedance-prompt-generator/skills/generating-minimax-h3-prompts/SKILL.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-minimax-h3-prompts/agents/openai.yaml`
- Create: `plugins/seedance-prompt-generator/skills/generating-minimax-h3-prompts/references/minimax-h3-guide.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-minimax-h3-prompts/references/templates.md`
- Create: `plugins/seedance-prompt-generator/skills/generating-minimax-h3-prompts/references/examples.md`

**Interfaces:**
- Consumes: T2VA/I2VA/FL2VA/L2VA/multimodal mode, duration, first/last frames, dialogue language, soundscape intent, and BGM intent.
- Produces: `integrated_multimodal_description`, ordered Shots, `overall_soundscape`, and `non_diegetic_music` with correct `N/A` behavior.

- [ ] **Step 1: Add failing H3 checks**

Add `generating-minimax-h3-prompts` to `expectedSkills` and require:

```js
["MiniMax H3", "T2VA", "I2VA", "FL2VA", "L2VA", "integrated_multimodal_description", "[Shot 1]", "overall_soundscape", "non_diegetic_music", "N/A", "references/minimax-h3-guide.md", "references/templates.md", "references/examples.md"]
```

Require explicit rules that Shot 1 has no `00:00`, Shot 2+ times increase, dialogue stays in the user language, and music is not written into soundscape.

- [ ] **Step 2: Run validation and observe the missing-skill failure**

Expected: FAIL with `missing skill: generating-minimax-h3-prompts`.

- [ ] **Step 3: Create the compact skill and references**

The `SKILL.md` must route all five modes, limit cuts by duration, prefer continuity for FL2VA, bind action and Camera per Shot, keep dialogue verbatim, separate diegetic sound from non-diegetic music, and enforce the H3 four-part prompt shell. Include the five default video output sections and conditional reuse output.

Write `minimax-h3-guide.md` with mode selection, Shot timing, action/camera integration, soundscape, BGM, dialogue, action-reference video exclusions, `N/A`, and lint. Write `templates.md` for 5-second single shot, 10-second two shots, I2VA, FL2VA, L2VA, motion reference, BGM, no BGM, and dialogue. Write `examples.md` with complete 5-second skill-action, two-shot audiovisual, and no-BGM examples.

Create `agents/openai.yaml`:

```yaml
interface:
  display_name: "MiniMax H3 提示词"
  short_description: "生成 Shot、镜头、环境声与音乐一体化提示词"
  default_prompt: "使用 $generating-minimax-h3-prompts 生成一份 MiniMax H3 原生音画提示词。"
policy:
  allow_implicit_invocation: true
```

- [ ] **Step 4: Run validation**

Expected: all three new-skill structural checks pass.

- [ ] **Step 5: Commit the MiniMax H3 skill**

```powershell
git add scripts/validate-plugin.mjs plugins/seedance-prompt-generator/skills/generating-minimax-h3-prompts
git commit -m "feat: add MiniMax H3 prompt skill"
```

---

### Task 5: Existing-skill quota and conditional-output regression

**Files:**
- Modify: `scripts/validate-plugin.mjs`
- Modify: `plugins/seedance-prompt-generator/skills/generating-seedance-prompts/SKILL.md`
- Modify: `plugins/seedance-prompt-generator/skills/generating-nano-banana-prompts/SKILL.md`
- Modify: `plugins/seedance-prompt-generator/skills/generating-chatgpt-image-prompts/SKILL.md`

**Interfaces:**
- Consumes: current three skill workflows and their existing output sections.
- Produces: unchanged core routing with conditional reuse output, prompt complexity control, and no fixed negative-prompt bloat.

- [ ] **Step 1: Add failing conditional-output assertions**

For all six `SKILL.md` files, validate that the default ordered heading arrays exclude `【下次可复用短句】`, while the body contains all five trigger phrases:

```js
const reuseTriggers = ["保存成模板", "给我复用短句", "以后继续用这个风格", "做成可复用版本", "下次沿用这套结构"];
```

Require the terms `compact`, `standard`, `detailed`, “只给提示词”, “动态”, and “当前任务” in each skill, allowing Chinese equivalents for the three complexity levels only where the English enum is still shown once.

- [ ] **Step 2: Run validation and observe failures in the existing skills**

Expected: FAIL because the existing skills make the reusable sentence unconditional and do not all expose complexity control.

- [ ] **Step 3: Patch only the affected contracts**

In each existing `SKILL.md`:

- Remove `【下次可复用短句】` from the default numbered output list.
- Add one conditional-output paragraph containing the five explicit reuse triggers.
- Add compact/standard/detailed behavior without copying other models' rules.
- State that negative constraints are generated dynamically for the current task.
- Preserve all current model triggers, reference links, material syntax, and specialized workflow text.

- [ ] **Step 4: Run full validation**

Expected: PASS for all existing-skill routing and new conditional-output assertions.

- [ ] **Step 5: Commit the regression-safe contract update**

```powershell
git add scripts/validate-plugin.mjs plugins/seedance-prompt-generator/skills/generating-seedance-prompts/SKILL.md plugins/seedance-prompt-generator/skills/generating-nano-banana-prompts/SKILL.md plugins/seedance-prompt-generator/skills/generating-chatgpt-image-prompts/SKILL.md
git commit -m "feat: make reusable prompt output conditional"
```

---

### Task 6: Preserve brand assets and polish six-skill documentation

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: approved brand name, the user override to preserve current icon/logo files, and the six-skill capability list.
- Produces: final user-facing documentation while keeping manifest asset paths and both binary assets unchanged.

- [ ] **Step 1: Verify the original images remain unchanged**

Compare both worktree assets with the source checkout using SHA-256. Expected: matching hashes for `icon.png` and `logo.png`.

- [ ] **Step 2: Reconcile README with the six skills**

Ensure the README uses `MediaPrompt Forge`, lists exactly six skills, documents conditional reusable output, explains on-demand references/low quota behavior, and retains installation/update/privacy instructions.

- [ ] **Step 3: Commit documentation polish**

```powershell
git add README.md
git commit -m "docs: document MediaPrompt Forge workflows"
```

---

### Task 7: Final deterministic regression gate

**Files:**
- Modify: `scripts/validate-plugin.mjs`

**Interfaces:**
- Consumes: final manifest, six skill trees, UI metadata, references, examples, README, and brand asset paths.
- Produces: one dependency-free validation command whose exit code is the release gate.

- [ ] **Step 1: Add cross-model differentiation checks**

Build a `modelContracts` object that verifies:

```js
{
  "generating-seedance-prompts": ["时间段", "@图片1", "@视频1"],
  "generating-grok-video-prompts": ["weight", "inertia", "environmental response"],
  "generating-minimax-h3-prompts": ["integrated_multimodal_description", "overall_soundscape", "non_diegetic_music"],
  "generating-grok-image-prompts": ["Only modify", "Keep everything else unchanged", "multi-reference"]
}
```

Require each new `examples.md` to contain at least two `【提示词成品】` markers and the model-specific contract tokens above. Confirm exactly six skill directories exist, not merely that six expected names are present.

- [ ] **Step 2: Run the release validator**

```powershell
& 'C:\Users\HWT\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/validate-plugin.mjs
```

Expected: `Plugin validation passed.` and exit code 0.

- [ ] **Step 3: Run repository hygiene checks**

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; only intentional uncommitted files, if any, are shown.

- [ ] **Step 4: Perform a manual six-case smoke review without external generation**

Read the corresponding template/example for each case and verify it can be completed without loading another model skill:

1. Seedance 2.5: five-second first-frame attack.
2. Nano Banana: three-reference product poster.
3. ChatGPT Images 2.0: minimum-delta local edit.
4. Grok Image: exact-text banner plus one edit continuation.
5. Grok Video: heavy jump, fixed camera, environmental impact.
6. MiniMax H3: FL2VA with soundscape and `non_diegetic_music: N/A`.

Expected: every case has one unambiguous route, correct material roles, model-specific structure, dynamic constraints, and no default reusable sentence.

- [ ] **Step 5: Commit the release gate**

```powershell
git add scripts/validate-plugin.mjs plugins/seedance-prompt-generator/skills README.md
git commit -m "test: validate MediaPrompt Forge 1.2.0"
```

- [ ] **Step 6: Record final evidence**

Capture the final commit hash, clean/intentional Git status, validator output, six skill names, modified/new file list, compatibility statement, and one real example each for Grok Image, Grok Video, and MiniMax H3 in the handoff report.
