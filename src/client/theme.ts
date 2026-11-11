/**
 * dsh-power-xc design tokens — the plugin's own semantic layer, mapped
 * onto the DSH theme (`--dsw-alias-*`, `--dsw-*`, `--dsh-sidebar-*`) with
 * explicit fallbacks. Keeping one source of truth here means a future visual
 * pass touches one file instead of every component.
 *
 * `row` / `menu` mirror the native DSH sidebar footer row and the native
 * `Menu` primitive (same metrics, same tokens), so this plugin's additive
 * surface reads as part of the shell instead of a foreign control.
 */

/** Motion: duration tiers + one shared easing. */
export const motion = {
  /** hover / micro-interactions */
  fast: '120ms',
  /** menu appear / item hover states */
  menu: '170ms',
  /** modal in */
  modal: '200ms',
  /** full-screen overlay stage transitions */
  overlay: '280ms',
  /** success / check morphs */
  success: '380ms',
  /** shared easing (Linear/Arc-style float, not the default `ease`) */
  ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
} as const

/** Radius tiers: small controls 8, floating surfaces 12, large modals 16. */
export const radius = {
  control: 8,
  surface: 12,
  modal: 16,
} as const

/** Shadow tiers (single source, so every surface reads as one family). */
export const shadow = {
  /** small popovers / control hints */
  small: '0 6px 20px rgba(0, 0, 0, 0.22)',
  /** menus / toasts */
  surface: '0 10px 30px rgba(0, 0, 0, 0.28)',
  /** modals */
  modal: '0 18px 56px rgba(0, 0, 0, 0.36)',
} as const

/**
 * Sidebar footer row — byte-equivalent to the native rows that live directly
 * above it (ui-settings-account `AccountMenu` trigger / ui-settings-general
 * `SettingsRoot` trigger):
 *   height 42, inline padding = row-padding − paint-inset, a paint-inset
 *   border so the hover pill is inset like its siblings, radius-md (12),
 *   14px/22px label, `--dsw-alias-interactive-bg-hover` for hover / focus /
 *   expanded, 16px glyph (18px in the 36px collapsed rail).
 * The `--dsh-sidebar-*` variables are declared on the sidebar root and
 * inherited down to the footer; the fallbacks match that declaration.
 */
export const row = {
  height: 42,
  railSize: 36,
  gap: 'var(--dsh-sidebar-label-gap, 6px)',
  inlinePadding: 'calc(var(--dsh-sidebar-row-padding, 12px) - var(--dsh-sidebar-paint-inset, 3px))',
  paintInset: 'var(--dsh-sidebar-paint-inset, 3px)',
  radius: 'var(--dsw-radius-md, 12px)',
  /** glyph size: the native trigger is 16px wide, 18px on the rail */
  glyphWide: 16,
  glyphRail: 18,
} as const

/**
 * Floating menu — the native `Menu` primitive's surface and item metrics:
 * 4px padding on radius-lg (16), `--dsw-menu-surface-fill` + backdrop blur,
 * `--dsw-elevation-prominent` shadow, 34px items on radius-md, 13px/20px
 * labels, 14px `--dsw-alias-menu-icon` glyphs, danger = error primary with
 * `--dsw-alias-interactive-bg-hover-danger`.
 */
export const menu = {
  padding: 4,
  radius: 'var(--dsw-radius-lg, 16px)',
  background: 'var(--dsw-menu-surface-fill, var(--dsw-alias-bg-layer-2, #fcfdfe))',
  backdrop: 'var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%))',
  shadow: 'var(--dsw-elevation-prominent, 0 3px 8px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.05))',
  itemHeight: 34,
  itemPadding: '6px 8px',
  itemRadius: 'var(--dsw-radius-md, 12px)',
  itemGap: 6,
  iconSize: 14,
  fontSize: 13,
  lineHeight: '20px',
} as const

/** Full-screen lifecycle overlay veil: translucent + strong blur — the page is
 * "paused", not "gone" (avoids the crash / system-dead look of a near-black
 * veil). */
export const veil = {
  background: 'rgba(8, 10, 16, 0.68)',
  backdropFilter: 'blur(14px) saturate(0.85)',
} as const

/** Low-saturation danger surface for the irreversible-action affordance. */
export const danger = {
  /** subtle dark-red circular base behind the modal icon */
  iconBase: 'color-mix(in srgb, var(--dsw-alias-state-error-primary, #ff8592) 14%, var(--dsw-alias-bg-layer-2, rgba(24,28,38,0.98)))',
  /** border for the same icon base */
  iconBorder: 'color-mix(in srgb, var(--dsw-alias-state-error-primary, #ff8592) 38%, transparent)',
} as const
