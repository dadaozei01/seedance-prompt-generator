# MediaPrompt Forge 1.2.0 设计规格

## 目标

将现有 `seedance-prompt-generator` 从三模型提示词插件升级为品牌名为 **MediaPrompt Forge｜多模态提示词工坊** 的六 Skill 插件。在保持既有 Seedance、Nano Banana、ChatGPT Images 行为兼容的前提下，新增 Grok Image、Grok Video 与 MiniMax H3 专属能力，使同一创作需求在不同模型下产生结构和内容都明显不同的专业提示词。

## 范围

本次只完善 Codex 插件中的六套模型专属 Skill，不建设可视化 Prompt Builder，不增加前端、数据库、历史记录、配置存储或 MCP 服务。

附件中有关模型模式、任务识别、素材角色、Prompt Strategy 与 Lint 的要求，将实现为 Skill 工作流、按需参考资料和本地验证脚本。与 UI 控件、持久化或数据迁移有关的要求不属于本次范围。

## 品牌与兼容

- 展示名称：`MediaPrompt Forge`
- 中文副名：`多模态提示词工坊`
- 版本：`1.2.0`
- 内部插件 ID：继续使用 `seedance-prompt-generator`
- 保留现有三个 Skill 名称、显式调用方式、中文触发词和素材引用规则
- 更新 manifest、README、关键词和默认示例；按用户最新要求保留原有 `icon.png` 与 `logo.png`
- 安装或升级后仍通过原插件 ID 识别，避免现有用户的升级路径中断

## 架构

插件采用六个完全独立的模型 Skill，不增加总路由 Skill：

| Skill | 模型与职责 |
|---|---|
| `generating-seedance-prompts` | Seedance 2.0/2.5；时间轴、动作阶段、素材用途、首尾帧、视频编辑和延长 |
| `generating-nano-banana-prompts` | Nano Banana / Gemini；文生图、精确编辑、多参考图、人物和商品一致性 |
| `generating-chatgpt-image-prompts` | ChatGPT Images 2.0；精准编辑、画内文字、商品图、透明素材和信息图 |
| `generating-grok-image-prompts` | Grok Imagine Image 2.0；自然语言视觉设计、局部编辑和清晰的参考图绑定 |
| `generating-grok-video-prompts` | Grok Imagine Video 1.5；连续动作、重量与惯性、镜头和环境反馈 |
| `generating-minimax-h3-prompts` | MiniMax H3；T2VA、I2VA、FL2VA、L2VA、Shot、Soundscape 与 Music |

每个 Skill 使用以下轻量结构：

```text
SKILL.md
agents/openai.yaml
references/model-guide.md
references/templates.md
references/examples.md
```

现有 Skill 的参考文件可以保留当前文件名；新 Skill 使用对应模型命名。`SKILL.md` 仅保留任务识别、核心工作流、输出契约、条件规则和参考入口。详细模型规则、模板和示例按需读取，避免一次调用加载无关模型内容。

## 任务识别与素材角色

每个 Skill 独立执行以下流程：

```text
用户需求
→ 确认当前模型
→ 判断任务模式
→ 识别素材角色
→ 读取当前模型所需参考
→ 根据时长和复杂度规划内容
→ 生成任务相关约束
→ 执行 Prompt Lint
→ 输出成品
```

支持的通用素材角色语义：

| 输入素材 | 内部角色 |
|---|---|
| 人物参考图 | `character` |
| 武器、商品或道具图 | `object` |
| 环境或场景图 | `environment` |
| 图生视频起始图 | `first_frame` |
| 尾帧参考图 | `last_frame` |
| 动作参考视频 | `motion_and_camera` |
| 音频素材 | `audio_reference` |

当用户已经说明各素材用途时，直接沿用；当角色可从内容和语句中可靠判断时自动绑定；存在真实歧义且会改变结果时才询问。动作参考视频只继承动作时序与镜头行为，不继承原人物、服装、武器或环境。

## 六套模型的行为差异

### Seedance 2.0/2.5

保留现有结构化时间线、`@图片1`、`@视频1`、`@音频1`、首尾帧、视频编辑、延长和 30–180 秒长视频能力。重点表达时间段、动作阶段、镜头、素材用途和连续性约束。

### Nano Banana / Gemini

保持现有 Nano Banana 专属策略。重点表达用途、主体、场景、构图、光线、文字、多参考图分工和需要保持不变的身份或商品特征。编辑任务按差异修改，不重写整张图。

### ChatGPT Images 2.0

保持现有 ChatGPT Images 生成与编辑策略。重点表达清晰的视觉目标、构图、材质、文字、透明背景或信息层级。编辑任务明确修改范围和保持项，并支持连续编辑。

### Grok Imagine Image 2.0

使用自然、简洁、面向视觉结果的语言，避免标签堆砌。生成任务强调对象关系、空间布局和明确文字；编辑任务明确 `Only modify`、`Keep everything else unchanged` 与 `Do not change`；多参考图必须逐一绑定用途。

### Grok Imagine Video 1.5

使用连续自然语言描述动作链，重点补足中间状态、身体重心、重量、惯性、镜头运动和环境反馈。图生视频不重复描述首帧已确定的信息；参考视频不被误当作第一帧；避免复制 Seedance 的密集时间码格式。

### MiniMax H3

使用视听一体的电影分镜结构，按任务识别 T2VA、I2VA、FL2VA、L2VA 或多模态参考。提示词成品固定包含：

```text
integrated_multimodal_description

[Shot 1]
...

overall_soundscape:
...

non_diegetic_music:
...
```

Shot 1 不加 `00:00`；Shot 2 及以后使用递增时间。镜头数量由时长和任务决定，FL2VA 默认减少切镜。角色可听见的环境声、动作声和对白进入 `overall_soundscape`；角色听不见的 BGM 进入 `non_diegetic_music`；无对应内容时写 `N/A`。用户提供的对白保持原语言。

## 输出契约

图片模型默认输出：

1. 【提示词成品】
2. 【负面约束】
3. 【参考图绑定】
4. 【参数建议】
5. 【风格锚点】
6. 【一致性检查】

视频模型默认输出：

1. 【提示词成品】
2. 【负面约束】
3. 【素材绑定】
4. 【参数建议】
5. 【一致性检查】

用户明确要求“只给提示词”时，仅输出【提示词成品】。参数已由用户或平台 UI 明确给出时，不在 Prompt 正文中机械重复，但必须据此控制动作密度、镜头数量和内容复杂度。

【下次可复用短句】默认不输出。仅当用户明确说“保存成模板”“给我复用短句”“以后继续用这个风格”“做成可复用版本”或“下次沿用这套结构”等同义需求时追加。

## Prompt 长度与额度控制

- `compact`：删除重复约束、同义表达、重复主体描述和无关负面词
- `standard`：默认满足任务的完整版本
- `detailed`：用于需要时间线、多素材或精细视听控制的复杂任务

模型默认倾向：Nano Banana 与 ChatGPT Images 沿用现有策略；Grok Image 为 compact/standard；Seedance 为 detailed；Grok Video 与 MiniMax H3 为 standard。用户明确要求字数、精简或详细程度时，以用户要求为准。

控制额度的结构性措施：

- 不创建总路由 Skill
- 不在任一 `SKILL.md` 中复制其他模型规则
- 示例放入按需加载的 `references/examples.md`
- 只读取当前任务需要的参考文件
- 动态生成当前任务相关的负面约束，不填充固定长列表
- 普通任务不输出复用短句

## Prompt Lint

生成后进行轻量自检并直接修正，不向用户展示内部检查过程。

通用检查：模型和任务是否匹配、素材用途是否冲突、动作密度是否适合时长、约束是否重复、用户原文是否被无故翻译。

模型专项检查：

- Seedance：沿用现有时间轴、素材引用和连续性检查
- Grok Image：检查标签堆砌、编辑任务是否重写整图、参考图用途、重复比例和用户文字
- Grok Video：检查首帧重复描述、参考视频误绑定、中间动作缺失、用途冲突和 Seedance 式密集时间码
- MiniMax H3：检查三大固定字段、Shot 时间、切镜数量、FL2VA 连续性、`N/A`、对白语言及声音与音乐分栏

## 错误处理

- 未指定模型但明确点名平台能力时，由匹配的 Skill 触发
- 同时要求两个平台版本时，分别调用并标注两个模型专属结果，不生成混合版本
- 缺少非关键细节时合理补全，保持用户指定风格和主体
- 素材用途存在会改变结果的真实歧义时，提出一个最小澄清问题
- 不支持或无法确认的模型参数不伪造，改为平台中性描述或明确标为建议

## 测试策略

扩展无第三方依赖的 `scripts/validate-plugin.mjs`，用本地确定性检查和少量代表性 smoke cases 控制测试额度。

结构验证：

- manifest 为合法 JSON，版本为 `1.2.0`
- 六个 Skill 均存在且 frontmatter、`agents/openai.yaml`、引用路径有效
- 所有 Markdown、YAML、JSON 为有效 UTF-8 且无已知乱码
- README、manifest 和品牌资源使用新展示名称

行为契约验证：

- 同一“冰霜巨人跳起砸地”需求在 Seedance、Grok Video、H3 下分别体现时间线、连续物理动作、视听分镜结构
- Grok Image 覆盖文生图、局部编辑、连续编辑、多参考图和文字
- Grok Video 覆盖 T2V、I2V、Reference-to-Video、固定镜头、复杂动作和多参考素材
- H3 覆盖 T2VA、I2VA、FL2VA、L2VA、单/多 Shot、Soundscape、BGM、`N/A` 和对白
- 回归验证 Seedance、Nano Banana、ChatGPT Images 的原触发词、输出契约、素材绑定和显式调用方式
- 验证普通任务不输出【下次可复用短句】，明确复用需求时才输出

## 完成标准

1. 插件以 `MediaPrompt Forge` 展示，版本为 `1.2.0`，内部 ID 保持兼容。
2. 六个独立 Skill 均能通过明确触发词被发现和调用。
3. 同一需求在不同模型下表现为模型专属的结构、语言和行为，而非替换模型名称。
4. 新增 Grok Image、Grok Video、MiniMax H3 规则、模板、示例与元数据完整。
5. 现有三套 Skill 的核心行为和调用方式无回归。
6. 原有 `icon.png` 与 `logo.png` 保持不变。
7. 验证脚本全部通过，且测试不依赖外部服务或高额度批量生成。
