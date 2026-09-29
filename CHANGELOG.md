# Changelog

All notable changes to this project will be documented in this file.

## [0.1.6] - 2026-10-01

### Fixed
- **适配 DSH 0.2.0-rc.1（`@deepseek-ai/dsh-client-runtime` 已删除）**：
  - `src/client/index.ts` 的 `ClientContext` 类型来源从 `@deepseek-ai/dsh-client-runtime/client` 改为
    `@deepseek-ai/cordis` 的 `Context`（0.2.0 的等价类型，与官方 client 插件一致），否则下次
    `src → lib` 重建 typecheck 会因找不到该包而失败。
  - 清理 `package.json`：移除 `dsh-client-runtime` 的 `client.inject` / `peerDependencies` /
    `devDependencies` 条目，并补 `@deepseek-ai/cordis` 到 `devDependencies` 供独立 typecheck 解析。
  - `engines.dsh` 提升为 `>=0.2.0-rc.1`（DSH 兼容性说明同步更新）。

## [0.1.5] - 2026-09-24

### Chore
- **工程化规范化（无运行时改动，构建产物内容不变）**：
  - CI（`.github/workflows/ci.yml`）此前只校验 `lib/` 文件存在，现补齐 `pnpm run build` 与
    `pnpm run typecheck`（对齐同族的 `dsh-mobile-xc`）以及 `pnpm test`（vitest，13/13 通过），
    确保 `src/` 改坏了会在 CI 就被拦下。

## [0.1.4] - 2026-09-08

### Added
- Declare `engines.dsh` (`>=0.1.0-rc.6`) in package.json so dsh-market shows the
  host-version requirement and can filter by it. No functional change.

## [0.1.0] - 2025-01-20

### Added
- Initial release
- Sidebar power button with Restart/Shutdown menu
- Windows-style shutdown overlay animation
- Self-contained restart & shutdown engine
- No dependency on other plugins
- Bilingual support (English/Chinese)
- MIT licensed
