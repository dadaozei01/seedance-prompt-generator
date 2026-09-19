# MediaPrompt Forge

<p align="center">
  <img src="plugins/seedance-prompt-generator/assets/logo.png" alt="MediaPrompt Forge" width="320">
</p>

参考官方表达建议，自由创作图片、视频与原生音画提示词。内部插件 ID 保持 `seedance-prompt-generator`。

## 工作原则

- 用户意图决定创意、结构、语言和详略；简单成品可以很短，复杂设计充分展开。
- 官方建议作为工具，模板作为起点；不强制分栏、单变量修改、一图一职责或统一写实物理。
- 默认直接给可复制成品，必要素材关系与约束写入正文。补充说明按需提供，检查通常内部完成。
- 已核实的接口限制与可选表达建议分开；需要参数时核验当前型号和入口，不擅自换平台或升级模型。
- 用户要求实际生成媒体时，这些技能辅助可用工具完成任务，不把生图或视频任务缩减成只写提示词。

## 六个独立技能

| 平台 | Skill | 重点 |
|---|---|---|
| Seedance / 即梦（含 Seedance 2.5） | `generating-seedance-prompts` | 动作、镜头、素材关系与叙事；模式按入口核验 |
| Nano Banana / Gemini | `generating-nano-banana-prompts` | 场景表达、图像编辑、多维度参考与风格融合 |
| ChatGPT / OpenAI（含 ChatGPT Images 2.0） | `generating-chatgpt-image-prompts` | 创作与编辑、文字、构图、身份与产品保留 |
| Grok Imagine Image 2.0 | `generating-grok-image-prompts` | 自然语言生成与多项编辑 |
| Grok Imagine Video 1.5 | `generating-grok-video-prompts` | 按输入模式适配动作、镜头与节奏 |
| MiniMax H3 | `generating-minimax-h3-prompts` | 音画关系、正确模式语义、可选官方重写格式 |

平台由用户或已有上下文确定；通用“视频提示词”不再自动路由到 Seedance。只加载当前需要的技能和参考小节。

## 官方资料

各技能指南附来源、适用范围与核验日期（本版：2026-09-19）。

- [OpenAI Image prompting](https://developers.openai.com/api/docs/guides/image-prompting)
- [Google Nano Banana image generation](https://ai.google.dev/gemini-api/docs/image-generation)
- [xAI 图片生成](https://docs.x.ai/developers/model-capabilities/images/generation)、[图片编辑](https://docs.x.ai/developers/model-capabilities/images/editing)、[视频生成](https://docs.x.ai/developers/model-capabilities/video/generation)
- [字节 Seedance 2.5 官方示例](https://seed.bytedance.com/en/seedance2_5)
- [MiniMax 官方 H3 提示词技能](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/SKILL.md)

示例不等于接口规范；官方网页中的社区文章也不自动成为官方模型规范。无法核实的旧参数不作为承诺保留。

## 安装

```bash
git clone https://github.com/dadaozei01/seedance-prompt-generator.git
cd seedance-prompt-generator
codex plugin marketplace add .
codex plugin add seedance-prompt-generator@seedance-community
```

本地开发版可在对应源目录安装；以上远端命令取得的是 GitHub 已发布内容。本地修改不会自动发布到 GitHub。安装或更新后，新建任务加载新版技能。

## 使用示例

```text
为 ChatGPT 写一张极简超现实海报的提示词。
为 Nano Banana 同时参考图1的色彩与材质、图2的构图，重新设计场景。
为 Grok Image 同时改衣服、背景和光线，保留人物身份。
为 Seedance 设计8秒非线性梦境蒙太奇。
为 Grok Video 写5秒固定镜头的微表情变化。
为 MiniMax H3 按官方格式写10秒无对白、无配乐的雨中场景。
```

也可使用 `$generating-seedance-prompts` 等技能名明确调用。支持“只给提示词”、自定格式、多个方案及 compact / standard / detailed 详略偏好；这些偏好不规定固定字数。

## 验证

```bash
node scripts/validate-plugin.mjs
```

验证插件清单、版本格式、六个技能、frontmatter、UTF-8、元数据及本地引用完整性；不再用固定栏目和指定措辞判断质量。行为测试另行检查需求遵循、平台事实、创意完整与冗余，不以正文长度作为能力指标。未生成实际媒体时，不宣称出图或成片效果已验证。

## 版本

- `1.3.0`：官方来源与适配判断分离，取消强制输出外壳，放开多项编辑与多维度参考；修正 H3 L2VA 语义及 Grok 参考生成模式。
- `1.2.0`：升级为 MediaPrompt Forge，新增 Grok 图片、视频与 MiniMax H3。
- `1.1.0`：新增 Nano Banana 与 ChatGPT Images 技能。
- `1.0.1`：增加品牌图标。

## 隐私与费用

插件是本地说明、参考资料与图片资源，不包含外部服务、遥测或模型调用程序。宿主为核实资料可能浏览官方页面；实际生成媒体使用宿主工具和相应授权。提示词工作按正常宿主使用量计费。

## License

MIT
