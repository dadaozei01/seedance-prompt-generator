---
name: generating-minimax-h3-prompts
description: Use when users request MiniMax H3, Hailuo H3, 海螺 H3, 原生音画, T2VA, I2VA, FL2VA, L2VA, or multimodal-reference video prompts.
---

# 生成 MiniMax H3 提示词

将用户意图转换为可直接粘贴的 H3 原生音画提示词：每个 Shot 同时交代画面、动作、镜头、环境声和对白。

## 工作流程

1. 先判定模式，再读取 [指南](references/minimax-h3-guide.md)；需套用结构时读取 [模板](references/templates.md)，需校准质量时读取 [示例](references/examples.md)。
2. T2VA 用文字建立全部主体与场景；I2VA 锁定首帧主体/构图；FL2VA 同时锁定首尾状态并优先连续过渡；L2VA 仅续写最后一帧之后的内容；有多模态参考时逐项写“参考什么、不参考什么”。
3. 按用户时长限制切镜：短时长只保留一个核心动作；多 Shot 时 Shot 1 不写 `00:00`，Shot 2 起使用递增且不重叠的时间。每个 Shot 都把 action 与 Camera 写在一起。
4. 使用固定提示词壳：`integrated_multimodal_description`、`[Shot 1]`、`overall_soundscape`、`non_diegetic_music`。没有某类声音时填 `N/A`。
5. 对白保持用户语言和原文，不翻译、不改写；环境/物体/角色发出的声响写入 diegetic `overall_soundscape`，BGM 只写入 `non_diegetic_music`，不得混入 soundscape。

## 输出契约

默认依次交付：

1. `【提示词成品】`：完整 H3 提示词。
2. `【负面约束】`：仅列会导致跑偏的限制。
3. `【素材绑定】`：每份图、视频、音频的引用维度与排除维度；无素材写“无”。
4. `【参数建议】`：模式、时长、画幅及必要设置。
5. `【一致性检查】`：时序、主体、动作/镜头、声音和素材的简短核对。

仅当用户明确说“保存成模板”“给我复用短句”“以后继续用这个风格”“做成可复用版本”或“下次沿用这套结构”时，追加 `【下次可复用短句】`；其它情况不追加。

## 动态要求

- “只给提示词”：只输出 `【提示词成品】` 下的提示词，不输出其它段落。
- 支持 `compact` / `standard` / `detailed`（精简 / 标准 / 详细）：compact 保留模式、Shot、声音；standard 使用完整壳；detailed 补足每 Shot 的节奏、光线、动作因果和素材边界。
- 任何当前任务中出现的时长、画幅、人物、品牌、禁用项、参考素材或语言要求，优先写进成品和检查项。

## 提示词 Lint

交付前逐项确认：模式匹配；Shot 1 无时间；后续时间递增；每 Shot 有动作和 Camera；对白原文；soundscape 与 BGM 分离；空项为 `N/A`；FL2VA 无突跳；运动参考写明排除的人物、场景与风格。

## 常见错误

|错误|修正|
|---|---|
|把音乐写进环境声|BGM 只放 `non_diegetic_music`。|
|Shot 只写镜头或只写动作|同一 Shot 内把 action 与 Camera 成对绑定。|
|从 00:00 标注 Shot 1|Shot 1 不标时间，Shot 2+ 才递增标注。|
|首尾帧之间突然跳变|FL2VA 写连续的过渡动作、光线和空间关系。|

需要字段和可复制骨架时，使用 [模板](references/templates.md)；规则依据见 [指南](references/minimax-h3-guide.md)，完整样例见 [示例](references/examples.md)。
