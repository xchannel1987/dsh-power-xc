# dsh-power-xc

[![npm version](https://img.shields.io/npm/v/dsh-power-xc.svg)](https://www.npmjs.com/package/dsh-power-xc)
[![license](https://img.shields.io/npm/l/dsh-power-xc.svg)](https://github.com/xchannel1987/dsh-power-xc/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/dsh-power-xc.svg)](https://www.npmjs.com/package/dsh-power-xc)
[![DSH](https://img.shields.io/badge/DeepSeek-Harness-blue)](https://github.com/deepseek-ai/DeepSeek-Harness)

[中文](README.md) | [English](README_EN.md)

**DSH 电源管理插件** —— 为 DeepSeek Harness 提供优雅的重启和关机功能，支持 Web UI 一键操作。

## ✨ 核心特性

### 🔘 侧边栏电源按钮
- **集成位置**：位于侧边栏底部，与设置按钮并列
- **主题感知**：自动适配当前主题风格
- **一键访问**：无需命令行，点击即可操作

### 🔄 重启功能
- **平滑过渡**：Windows 风格全屏过渡动画
- **自动重连**：重启完成后页面自动刷新
- **会话保持**：优雅处理会话刷新，避免数据丢失
- **独立引擎**：内置重启引擎，无外部依赖

### ⏻ 关机功能
- **确认对话框**：防止误操作，默认焦点在取消按钮
- **进度展示**：全屏显示关机进度
- **安全退出**：确保所有资源正确释放

### 🛠️ 重启引擎设计
- **自包含**：无需 PowerShell、无需 taskkill
- **独立进程**：派生分离的 .cjs helper 进程
- **端口等待**：等待旧进程退出并释放端口
- **命令保留**：保持原 execPath/execArgv/argv/cwd

### 📣 命令支持
- **模型工具**：`restart_harness` 工具，可在对话中调用
- **斜杠命令**：`/restart` 和 `/shutdown` 命令
- **兼容性**：自动跳过已被其他插件注册的命令

### 🌐 国际化
- **中英文支持**：跟随 profile 的 `locale.preference`
- **本地化通知**：重启/关机状态提示

### 🧹 自动清理
- **日志清理**：自动清理 7 天前的 restart-helper 日志
- **资源管理**：避免日志文件堆积

## 📦 安装

```bash
# 使用 DSH CLI
dsh plugin --profile web add dsh-power-xc

# 或使用 npm
npm install dsh-power-xc
```

安装后重启 DSH，侧边栏底部将出现电源按钮。

## 🎮 使用方式

### 方式一：Web UI
1. 点击侧边栏底部的电源按钮
2. 选择「重启」或「关机」
3. 确认操作

### 方式二：斜杠命令
- 输入 `/restart` 重启 DSH
- 输入 `/shutdown` 关闭 DSH

### 方式三：模型工具
在对话中请求模型重启 DSH，模型会调用 `restart_harness` 工具。

## ⚙️ 工作原理

```
用户点击重启
    ↓
显示过渡动画
    ↓
启动独立 helper 进程
    ↓
等待旧进程退出
    ↓
释放端口
    ↓
以原命令行重新拉起
    ↓
页面自动重连
```

## 🔒 安全设计

- **分离进程**：helper 独立于主进程运行
- **超时保护**：30 秒超时机制
- **状态监控**：健康检查端点
- **优雅退出**：会话刷新不会阻塞重启

## 📄 许可证

[MIT](LICENSE)

## 🔗 链接

- [GitHub](https://github.com/xchannel1987/dsh-power-xc)
- [npm](https://www.npmjs.com/package/dsh-power-xc)
- [问题反馈](https://github.com/xchannel1987/dsh-power-xc/issues)
