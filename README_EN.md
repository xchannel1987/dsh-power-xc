# dsh-power-xc

[![npm version](https://img.shields.io/npm/v/dsh-power-xc.svg)](https://www.npmjs.com/package/dsh-power-xc)
[![license](https://img.shields.io/npm/l/dsh-power-xc.svg)](https://github.com/xchannel1987/dsh-power-xc/blob/main/LICENSE)
[![downloads](https://img.shields.io/npm/dm/dsh-power-xc.svg)](https://www.npmjs.com/package/dsh-power-xc)
[![DSH](https://img.shields.io/badge/DeepSeek-Harness-blue)](https://github.com/deepseek-ai/DeepSeek-Harness)

[中文](README.md) | [English](README_EN.md)

**DSH Power Management Plugin** — Elegant restart and shutdown functionality for DeepSeek Harness via Web UI.

## ✨ Core Features

### 🔘 Sidebar Power Button
- **Integrated Location**: Positioned in sidebar footer, alongside Settings button
- **Theme-Aware**: Automatically adapts to current theme
- **One-Click Access**: No command line needed

### 🔄 Restart Functionality
- **Smooth Transition**: Windows-style full-screen transition animation
- **Auto Reconnect**: Page auto-refreshes after restart completes
- **Session Preservation**: Graceful session flush handling
- **Self-Contained Engine**: Built-in restart engine with no external dependencies

### ⏻ Shutdown Functionality
- **Confirmation Dialog**: Guards against accidental shutdowns
- **Progress Display**: Full-screen progress overlay
- **Safe Exit**: Ensures all resources are properly released

### 🛠️ Restart Engine Design
- **Self-Contained**: No PowerShell, no taskkill needed
- **Detached Process**: Spawns a separate .cjs helper process
- **Port Waiting**: Waits for old process to exit and port to free
- **Command Preservation**: Maintains original execPath/execArgv/argv/cwd

### 📣 Command Support
- **Model Tool**: `restart_harness` tool callable in conversations
- **Slash Commands**: `/restart` and `/shutdown` commands
- **Compatibility**: Auto-skips commands already registered by other plugins

### 🌐 Internationalization
- **Bilingual Support**: Follows profile's `locale.preference`
- **Localized Notifications**: Restart/shutdown status messages

### 🧹 Auto Cleanup
- **Log Cleanup**: Automatically removes restart-helper logs older than 7 days
- **Resource Management**: Prevents log file accumulation

## 📦 Installation

```bash
# Using DSH CLI
dsh plugin --profile web add dsh-power-xc

# Or using npm
npm install dsh-power-xc
```

Restart DSH after installation. A power button will appear in the sidebar footer.

## 🎮 Usage

### Method 1: Web UI
1. Click the power button in sidebar footer
2. Select "Restart" or "Shutdown"
3. Confirm the action

### Method 2: Slash Commands
- Type `/restart` to restart DSH
- Type `/shutdown` to close DSH

### Method 3: Model Tool
Request the model to restart DSH in conversation; it will invoke the `restart_harness` tool.

## ⚙️ How It Works

```
User clicks restart
    ↓
Show transition animation
    ↓
Spawn detached helper process
    ↓
Wait for old process to exit
    ↓
Port freed
    ↓
Relaunch with original command line
    ↓
Page auto-reconnects
```

## 🔒 Security Design

- **Detached Process**: Helper runs independently of main process
- **Timeout Protection**: 30-second timeout mechanism
- **Health Monitoring**: Health check endpoint
- **Graceful Exit**: Session flush won't block restart

## 📄 License

[MIT](LICENSE)

## 🔗 Links

- [GitHub](https://github.com/xchannel1987/dsh-power-xc)
- [npm](https://www.npmjs.com/package/dsh-power-xc)
- [Issues](https://github.com/xchannel1987/dsh-power-xc/issues)
