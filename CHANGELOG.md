# Changelog

All notable changes to this project will be documented in this file.

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
