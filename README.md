# Seedance Prompt Generator for Codex

<p align="center">
  <img src="plugins/seedance-prompt-generator/assets/logo.png" alt="Seedance Prompt Generator" width="320">
</p>

一个可在 Windows 和 macOS 使用的 Codex 插件，把简短创意扩展为可直接复制到即梦 Seedance 2.0/2.5 的完整视频提示词。

## 功能

- 文生视频、图生视频、首尾帧
- 多图片、视频、音频综合参考
- 视频局部编辑、剧情改编与视频延长
- Seedance 2.5 的 30–180 秒超长视频
- 分秒时间轴、运镜、台词、音效和音乐卡点
- 多角色编号、素材用途绑定和一致性检查
- 自动输出负面约束与参数建议

## 安装要求

- 已安装并登录 Codex CLI 或 Codex App
- Git 仅在使用 `git clone` 下载时需要

## Windows 安装

在 PowerShell 中执行：

```powershell
git clone https://github.com/dadaozei01/seedance-prompt-generator.git
Set-Location seedance-prompt-generator
codex plugin marketplace add .
codex plugin add seedance-prompt-generator@seedance-community
```

## macOS 安装

在 Terminal 中执行：

```bash
git clone https://github.com/dadaozei01/seedance-prompt-generator.git
cd seedance-prompt-generator
codex plugin marketplace add .
codex plugin add seedance-prompt-generator@seedance-community
```

安装后请新建一个 Codex 任务，使 Skill 被重新加载。

## 使用

自动触发：

```text
生成视频提示词：一个古代女将军在雪夜迎战追兵。
```

明确调用：

```text
使用 $generating-seedance-prompts，生成一条15秒产品广告视频提示词。
```

默认输出：

1. 提示词成品
2. 负面约束
3. 素材绑定
4. 参数建议
5. 一致性检查
6. 下次可复用短句

## 版本

- `1.0.1`：新增插件品牌图标，并优化 Codex 插件列表与详情页展示。

## 更新

拉取或下载新版本后，重新运行：

```bash
codex plugin add seedance-prompt-generator@seedance-community
```

然后新建 Codex 任务。

## 隐私与费用

插件仅包含本地 Markdown/YAML/JSON 规则，不连接外部服务器，不包含 MCP 服务，不收集数据。安装和下载不消耗模型额度；生成提示词时按正常 Codex 任务计入使用量。

## License

MIT
