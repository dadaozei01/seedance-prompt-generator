# Seedance Prompt Generator Plugin Icon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved Seedance artwork to the Codex plugin, release version 1.0.1, refresh the local installation, and publish the update to GitHub.

**Architecture:** Preserve the supplied 1024×1024 PNG as the detail logo and derive a centered 512×512 composer icon. Reference both through supported manifest fields, validate all paths and the existing Skill, then reinstall and publish the focused branch.

**Tech Stack:** PNG, macOS `sips`, JSON, Markdown, Codex validators, Git, GitHub CLI.

## Global Constraints

- Do not regenerate or redesign the supplied artwork.
- Publish version `1.0.1`.
- Do not modify the Skill content.
- Use `./assets/icon.png` for `composerIcon` and `./assets/logo.png` for `logo`.
- Do not add `logoDark`.

---

### Task 1: Create image assets

**Files:**
- Create: `plugins/seedance-prompt-generator/assets/logo.png`
- Create: `plugins/seedance-prompt-generator/assets/icon.png`

**Interfaces:**
- Consumes: `/Users/dadaozei/Downloads/ChatGPT Image 2026年8月4日 22_26_16.png`.
- Produces: square PNG assets used by the manifest.

- [ ] Copy the approved source to `logo.png`.
- [ ] Center-crop it to 768×768 and resize the result to 512×512 as `icon.png`.
- [ ] Run `sips -g pixelWidth -g pixelHeight -g format -g hasAlpha` on both files.
- [ ] Inspect `icon.png` and confirm no clapperboard, timeline, or speech bubble is clipped.

### Task 2: Update and validate plugin metadata

**Files:**
- Modify: `plugins/seedance-prompt-generator/.codex-plugin/plugin.json`

**Interfaces:**
- Consumes: the Task 1 asset paths.
- Produces: a valid version `1.0.1` manifest.

- [ ] Run this precondition and confirm it fails:

```bash
jq -e '.version == "1.0.1" and .interface.brandColor == "#5146E5" and .interface.composerIcon == "./assets/icon.png" and .interface.logo == "./assets/logo.png"' plugins/seedance-prompt-generator/.codex-plugin/plugin.json
```

- [ ] Set `version` to `1.0.1`; add `brandColor: #5146E5`, `composerIcon`, and `logo` inside `interface`.
- [ ] Repeat the `jq` assertion and require output `true`.
- [ ] Run:

```bash
python3 /Users/dadaozei/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/seedance-prompt-generator
```

- [ ] Commit the two assets and manifest as `feat: add Seedance plugin icon`.

### Task 3: Update documentation and verify unchanged Skill

**Files:**
- Modify: `README.md`
- Test: `plugins/seedance-prompt-generator/skills/generating-seedance-prompts/SKILL.md`

**Interfaces:**
- Consumes: `assets/logo.png` and version `1.0.1`.
- Produces: README preview and Skill validation evidence.

- [ ] Add a centered 320-pixel-wide logo preview below the README title.
- [ ] Add a `1.0.1` release note stating that plugin branding and Codex list/detail presentation were added.
- [ ] Run:

```bash
python3 /Users/dadaozei/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/seedance-prompt-generator/skills/generating-seedance-prompts
git diff --check
```

- [ ] Commit README as `docs: show Seedance plugin branding`.

### Task 4: Reinstall and publish

**Files:**
- Read: `.agents/plugins/marketplace.json`
- Review: all changes relative to `origin/main`

**Interfaces:**
- Consumes: validated commits on `agent/add-plugin-icon`.
- Produces: local version `1.0.1`, a pushed branch, and a draft PR to `main`.

- [ ] Confirm `seedance-community` is a configured local marketplace. If it points at the earlier extracted copy, update it through `codex plugin marketplace remove` and `codex plugin marketplace add`; do not edit `config.toml` manually.
- [ ] Run `codex plugin add seedance-prompt-generator@seedance-community --json` and require version `1.0.1`.
- [ ] Run `codex plugin list` and require `installed, enabled`; verify both cached PNG paths exist under version `1.0.1`.
- [ ] Install official GitHub CLI with `brew install gh` if `gh` is still missing.
- [ ] Run `gh auth status`; if login is missing, pause for the user to complete `gh auth login`.
- [ ] Review `git status -sb`, `git diff --stat origin/main...HEAD`, and `git log --oneline origin/main..HEAD`.
- [ ] Push `agent/add-plugin-icon` and open a draft PR titled `Add Seedance plugin icon` targeting `main`.
