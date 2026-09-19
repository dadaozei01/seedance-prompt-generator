# H3 可选表达示例

自编示例。先决定普通创意描述还是官方结构化重写；不要为了套格式改变创意。完整模式语法见[指南及官方来源](minimax-h3-guide.md)。

## 自然语言创意

十秒单镜头，人物从屋檐阴影中走进雨里，雨滴逐渐打湿肩头，镜头平稳跟随两步后停下；只听雨声与脚步声，无对白、无音乐。

## 官方基础格式示例（T2VA，无对白音乐）

```text
integrated_multimodal_description: [Shot 1] A ten-second single shot follows a figure leaving the shelter of an awning and stepping into the rain. The camera tracks for two steps, then holds as raindrops darken the shoulders of the coat. No dialogue.

overall_soundscape: Rain strikes the pavement; footsteps splash through shallow water.

non_diegetic_music: N/A
```

## L2VA 的创意方向

以给定图片作为结尾：从杯子尚未放到桌面的状态开始，手将杯子缓缓放下，镜头在最后一刻收束到参考图的杯子位置、手部姿态和构图。不是从这张图片之后继续。

## Ref2VA

需要官方完整参考格式时，读取官方 ref-en.txt：明确素材角色、保留/迁移关系、实际音画过程及声音。使用其六字段和引用标记；不拿 T2VA 三字段或 Seedance 的 @素材语法冒充该格式。用户本轮创意决定内容量，不机械凑字数。
