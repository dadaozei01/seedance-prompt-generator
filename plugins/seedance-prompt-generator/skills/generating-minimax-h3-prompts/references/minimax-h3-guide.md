# MiniMax H3 表达与格式参考

核验日期：2026-09-19。

## 官方来源

- [MiniMax 官方 H3 技能](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/SKILL.md)
- [基础模式格式](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/base-en.txt)
- [Ref2VA 完整参考格式](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/ref-en.txt)

官方技能是结构化重写工作流，并不证明所有产品入口都只能接受这一种写法。本插件采用其有依据的模式语义与可选格式；不继承统一字数目标或强制细节密度。

## 模式语义（事实）

T2VA 从文字建立音画；I2VA 固定首帧；FL2VA 连接首尾帧；L2VA 收束到指定尾帧，绝非从尾帧向后续写。Ref2VA 可表达素材参考、源视频编辑或续写等关系。模式名称不等于当前账号的能力保证。

## 选用官方重写格式时

基础格式使用 integrated_multimodal_description、overall_soundscape、non_diegetic_music；Ref2VA 用 subject_definitions、summary、retention_analysis、detailed_description 加两个声音字段。格式是提示词正文，不再包一层五栏报告。

正文按官方格式使用英文，原始对白、歌词、画中文字保留原语言。首镜头无切镜时间，后续镜头以递增切点标注；帧对齐时间与切镜时间不同。对白与画内音乐放主描述，环境与动作声放 soundscape，画外配乐单独写。本地模板覆盖无对白的基础 T2VA，可离线使用；完整帧对齐、跨镜对白及 Ref2VA 标记按上方对应官方指南核对。资料不可访问时说明仅核验了本地覆盖范围，不冒称完整格式已验证。

## 本插件的适配判断

普通创意提示可以使用用户语言与自然段；用户明确要官方重写格式或下游依赖时才启用相应格式。复杂参考任务可按需要采用结构，字段不能限制想象与叙事。

不要为了字段填充添加对白或音乐。用户要求创作台词时可创作，用户给定原文时保留原文。一次可以综合多个创意变化，一份素材可以提供多个参考维度。没有声音的任务可直接说明无声；选用格式时按对应字段规则表示空项。
