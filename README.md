# MediaPrompt Forge

<p align="center">
  <img src="plugins/seedance-prompt-generator/assets/logo.png" alt="MediaPrompt Forge" width="320">
</p>

**多模态提示词工坊**是面向创作工作的 Codex 插件。它用六个互相隔离的 Skill，为不同图片、视频和原生音画模型生成真正不同的专属提示词，而不是把同一段文字替换模型名称。

现有 Seedance 用法、中文触发词、`@图片1` 素材绑定、时间轴和输出格式保持兼容。内部插件 ID 继续使用 `seedance-prompt-generator`，便于原安装直接升级。

## 六个独立 Skill

| 平台 | Skill | 适用任务 |
|---|---|---|
| Seedance 2.0/2.5 | `generating-seedance-prompts` | 文生视频、图生视频、首尾帧、视频编辑、延长、30–180 秒长视频 |
| Nano Banana / Gemini | `generating-nano-banana-prompts` | 生图、精准编辑、多参考图、人物与商品一致性、画内文字 |
| ChatGPT Images 2.0 | `generating-chatgpt-image-prompts` | 生图、局部编辑、多参考图、透明素材、商品图、信息图 |
| Grok Imagine Image 2.0 | `generating-grok-image-prompts` | 自然语言生图、最小差异编辑、连续编辑、多参考图 |
| Grok Imagine Video 1.5 | `generating-grok-video-prompts` | 连续动作、图生视频、参考视频、重量与惯性、电影镜头 |
| MiniMax H3 | `generating-minimax-h3-prompts` | T2VA、I2VA、FL2VA、L2VA、Shot、环境声与音乐 |

每次只加载当前模型的 `SKILL.md`，详细规则、模板和示例按需从该 Skill 的 `references/` 读取。插件不设置总路由 Skill，减少无关上下文和额度消耗。

## 安装

Windows PowerShell：

```powershell
git clone https://github.com/dadaozei01/seedance-prompt-generator.git
Set-Location seedance-prompt-generator
codex plugin marketplace add .
codex plugin add seedance-prompt-generator@seedance-community
```

macOS / Linux：

```bash
git clone https://github.com/dadaozei01/seedance-prompt-generator.git
cd seedance-prompt-generator
codex plugin marketplace add .
codex plugin add seedance-prompt-generator@seedance-community
```

安装或更新后，请新建一个 Codex 任务以加载新版 Skill。

## 使用示例

```text
生成一条 15 秒的 Seedance 2.5 香水广告视频提示词。
为 Nano Banana 生成三张参考图合成的商品海报提示词。
为 ChatGPT Images 2.0 生成只调整包装颜色的精准编辑提示词。
为 Grok Imagine Image 2.0 生成带准确标题文字的游戏 Banner。
为 Grok Imagine Video 1.5 生成巨人跳起砸地的连续重型动作。
为 MiniMax H3 生成一条含环境声、无 BGM 的五秒单镜头技能视频。
```

也可以明确调用：

```text
使用 $generating-seedance-prompts 生成视频提示词。
使用 $generating-nano-banana-prompts 生成 Gemini 图片提示词。
使用 $generating-chatgpt-image-prompts 生成 ChatGPT Images 2.0 图片提示词。
使用 $generating-grok-image-prompts 生成 Grok Image 提示词。
使用 $generating-grok-video-prompts 生成 Grok Video 提示词。
使用 $generating-minimax-h3-prompts 生成 MiniMax H3 原生音画提示词。
```

## 输出与额度控制

图片 Skill 默认输出提示词成品、动态负面约束、参考图绑定、参数建议、风格锚点和一致性检查；视频 Skill 默认输出提示词成品、动态负面约束、素材绑定、参数建议和一致性检查。

- 用户说“只给提示词”时，只输出最终成品。
- 用户要求精简时，真正删除重复约束、同义表达和无关负面词。
- `【下次可复用短句】` 默认不输出；只有用户说“保存成模板”“给我复用短句”“以后继续用这个风格”等明确复用需求时才追加。
- 六个 Skill 的模型规则不会混用；同时指定两个平台时分别输出两份专属版本。

## 验证

仓库提供无第三方依赖的验证器：

```bash
node scripts/validate-plugin.mjs
```

它检查 manifest、版本、UTF-8、六个 Skill、frontmatter、引用路径、触发词、模型专属输出契约、条件复用规则、品牌元数据和回归兼容项。验证完全在本地执行，不调用外部生成服务。

## 版本

- `1.2.0`：品牌升级为 MediaPrompt Forge；新增 Grok Imagine Image 2.0、Grok Imagine Video 1.5 和 MiniMax H3；加入按需加载、动态约束与条件复用输出。
- `1.1.0`：新增 Nano Banana 与 ChatGPT Images 2.0 独立 Skill；保留 Seedance 2.0/2.5 完整能力。
- `1.0.1`：新增插件品牌图标并优化插件展示。

## 隐私与费用

插件只包含本地 Markdown、YAML、JSON 与图片资源，不连接外部服务器，不包含 MCP 服务，不收集数据。生成提示词时按正常 Codex 任务计入使用量。

## License

MIT
