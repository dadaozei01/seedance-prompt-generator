# MiniMax H3 模板

## 5 秒单镜头

```text
integrated_multimodal_description: T2VA；[主体] 在[场景]完成[一个核心动作]。
[Shot 1]
action: [动作、表情、光线与结果]
Camera: [景别/视角] [与动作同步的镜头运动]
dialogue: N/A
overall_soundscape: [画内环境和动作声]
non_diegetic_music: N/A
```

## 10 秒双镜头

```text
integrated_multimodal_description: T2VA；[主体、场景、连续目标]。
[Shot 1]
action: [起始动作]
Camera: [对应镜头]
dialogue: [原文或 N/A]
[Shot 2 | 00:05-00:10]
action: [延续并完成的动作]
Camera: [对应镜头]
dialogue: [原文或 N/A]
overall_soundscape: [画内声]
non_diegetic_music: [BGM 或 N/A]
```

## I2VA

```text
integrated_multimodal_description: I2VA；@图片1 锁定[人物/服装/构图/场景]，仅生成[后续动作]；不改变[需保持项]。
[Shot 1]
action: [从首帧开始的连续动作]
Camera: [对应镜头]
dialogue: N/A
overall_soundscape: [画内声或 N/A]
non_diegetic_music: N/A
```

## FL2VA

```text
integrated_multimodal_description: FL2VA；@图片1 为首帧、@图片2 为尾帧；主体通过[连续动作]从[首帧状态]自然过渡到[尾帧状态]，不换人、不换景、不突跳。
[Shot 1]
action: [连续过渡过程]
Camera: [平滑服务过渡的镜头]
dialogue: N/A
overall_soundscape: [画内声或 N/A]
non_diegetic_music: N/A
```

## L2VA

```text
integrated_multimodal_description: L2VA；@视频1 仅作为前段结尾，继承[姿态/服装/光线/空间/声音]，从最后一帧继续[新动作]。
[Shot 1]
action: [自然续接的动作]
Camera: [对应镜头]
dialogue: N/A
overall_soundscape: [延续的画内声]
non_diegetic_music: N/A
```

## 运动参考

```text
integrated_multimodal_description: T2VA；@视频1 仅参考[动作节奏/镜头路径]，不参考人物、服装、场景、色彩、文字和风格；[本片主体与场景]。
```

## 有 BGM / 无 BGM / 有对白

```text
overall_soundscape: [脚步、风声、衣料摩擦等画内声]
non_diegetic_music: [画外音乐的风格、节奏和进入点]
dialogue: “用户提供的原文，保持原语言”
```

无 BGM 时固定为：`non_diegetic_music: N/A`；无对白时固定为：`dialogue: N/A`。
