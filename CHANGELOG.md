# Changelog

All notable changes to this project will be documented in this file.

## [0.1.10] - 2026-11-11

### Added
- **插件设置卡片（设置 → 插件 → dsh-power-xc）**：之前只有 Host schema，插件页看不到任何设置项。
  现在客户端向 `plugins.bundle.config`（keyed，key = npm 包名）注册一张设置卡片，形态对齐
  dsh-session-xc 的「会话增强」卡片：标题 + 说明 + 开关行（标签 / 说明 / 开关三段，12px 行距、
  border-l2 分隔线），开关为 DSH token 驱动的 40×24 胶囊。
  - 字段：`compactPanelRows`（紧凑全局面板行，即时生效）与 `enableModelTool`（模型重启工具，
    注明需重启 DSH 生效）。
  - 读写走 `configForms.get('dsh-power-xc')` 命名空间（乐观更新 + 失败回滚 + 订阅同步），
    与紧凑面板功能共用 `src/client/settings.ts` 里的作用域解析/快照解包逻辑。
  - 卡片文案进了 zh/en 词典，跟随界面语言。

## [0.1.9] - 2026-11-11

### Added
- **紧凑全局面板条（配置项 `compactPanelRows`，默认关闭）**：开启后侧栏的「插件 / 自动化任务 / 更多」
  等全局面板行排成一行图标，文字改成 hover 提示。
  - 实现方式：不改原生 React 树，只注入一段由 `html[data-dsh-power-compact-panels]` 控制的 CSS
    （行变 32px 方形图标按钮、标题隐藏、图标 18px、沿用原生 `--dsw-alias-interactive-bg-hover`
    悬停底色），收起态（56px 轨道）不受影响（选择器要求行内仍有 `panelTitle`，只有宽态才渲染）。
  - hover 文字：原生行的 Tooltip 是 `disabled: wide`（仅收起态存在），因此本插件补一层气泡，
    尺寸/圆角/内边距/字号/底色与延迟（500ms）逐项对齐 DSH `Tooltip`（`--dsw-alias-tooltip-bg`、
    `--dsw-radius-sm`、13px/20px、3px 7px），位置随行自动切换左右侧。
  - 配置读取：客户端经 `configForms.get('dsh-power-xc')` 读取并订阅设置快照（设置页改完即时生效；
    服务尚未发布时按 0.8s / 2.4s 重试），拿不到设置服务时回退到本插件 `/health` 上报的有效配置；
    `/health` 新增 `compactPanelRows` 字段。

## [0.1.7] - 2026-11-11

### Changed
- **侧边抽屉（侧边栏底部）的按钮与菜单视觉对齐原生 DSH**：对接上面的「用户登录账户 / 设置」两行，
  不再是一枚自制小按钮。
  - 触发器几何改为原生侧边栏行：42px 高、`--dsh-sidebar-row-padding - --dsh-sidebar-paint-inset` 内边距 +
    paint-inset 边框（悬停/展开底色与相邻原生行左右严格对齐）、`--dsw-radius-md` 圆角、14px/22px 文字、
    16px 图标；收起态为 36px 轨道、18px 图标、圆角矩形（原为圆形）。文字溢出改为省略号。
  - 悬停 / 键盘焦点 / 展开态改由 CSS 类驱动（`--dsw-alias-interactive-bg-hover` + 原生 focus ring）；
    原实现用内联 JS 改背景，内联 `background` 会盖住类规则，已移除。禁用态透明度对齐原生 0.4。
  - 菜单换成原生 `Menu` 表面：`--dsw-menu-surface-fill` + 背景模糊、`--dsw-elevation-prominent` 阴影、
    4px 内边距 + 16px 圆角；菜单项 34px 行高、13px/20px 字号、14px `--dsw-alias-menu-icon` 图标，
    危险项用原生 danger 调色板（默认 error 色 + danger 悬停底色），说明文字右对齐为 11px caption 槽。
  - 去掉每个菜单项上重复的悬停气泡（原生菜单没有），触发器仍保留原生 Tooltip。

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
