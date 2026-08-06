# Multi-Platform Prompt Generator for Codex

<p align="center">
  <img src="plugins/seedance-prompt-generator/assets/logo.png" alt="Multi-Platform Prompt Generator" width="320">
</p>

一个面向创作工作的 Codex 插件，在同一个插件中提供三套相互隔离的提示词生成能力：

- Seedance 2.0/2.5 视频提示词
- Nano Banana / Gemini 图片提示词
- ChatGPT Images 2.0 图片提示词

现有 Seedance 用法、中文触发词、`@图片1` 素材绑定、时间轴和输出格式保持兼容。

## 三个独立 Skill

| 平台 | Skill | 适用任务 |
|---|---|---|
| Seedance | `generating-seedance-prompts` | 文生视频、图生视频、首尾帧、视频编辑、延长、30–180 秒长视频 |
| Nano Banana | `generating-nano-banana-prompts` | Gemini 文生图、精确编辑、多参考图、人脸与商品一致性、画内文字 |
| ChatGPT Images 2.0 | `generating-chatgpt-image-prompts` | ChatGPT 文生图、局部编辑、多参考图、透明素材、商品图、信息图 |

三套规则不会混用。用户同时指定两个图片平台时，插件分别输出并标注两份平台专属版本。

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

Seedance：

```text
生成一条15秒的 Seedance 2.5 香水广告视频提示词。
```

Nano Banana：

```text
给我一段 Nano Banana 的咖啡产品海报提示词。
```

ChatGPT Images 2.0：

```text
生成一段 ChatGPT Images 2.0 的极简电商主图提示词。
```

也可以明确调用：

```text
使用 $generating-seedance-prompts 生成视频提示词。
使用 $generating-nano-banana-prompts 生成 Gemini 图片提示词。
使用 $generating-chatgpt-image-prompts 生成 ChatGPT Images 2.0 图片提示词。
```

## 图片提示词输出

Nano Banana 与 ChatGPT Images 2.0 默认输出：

1. 提示词成品
2. 负面约束
3. 参考图绑定
4. 参数建议
5. 风格锚点
6. 一致性检查
7. 下次可复用短句

用户明确说“只给提示词”时，仅返回提示词成品。

## 验证

仓库提供无第三方依赖的验证器：

```bash
node scripts/validate-plugin.mjs
```

它检查插件 manifest、UTF-8、Skill frontmatter、引用路径、平台路由词、固定输出契约、Seedance 兼容项和 UI 元数据。

## 版本

- `1.1.0`：新增 Nano Banana 与 ChatGPT Images 2.0 独立 Skill；保留 Seedance 2.0/2.5 完整能力；增加结构和兼容性验证。
- `1.0.1`：新增插件品牌图标并优化插件展示。

## 隐私与费用

插件只包含本地 Markdown、YAML 和 JSON 规则，不连接外部服务器，不包含 MCP 服务，不收集数据。生成提示词时按正常 Codex 任务计入使用量。

## License

MIT
