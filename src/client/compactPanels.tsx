/**
 * Compact sidebar panel strip (opt-in, `compactPanelRows` config, default off).
 *
 * The sidebar's global-panel rows (插件 / 自动化任务 / … plus the 更多 launcher)
 * are native `dsh-client-ui-sidebar` rows — this module never re-renders them.
 * Two pieces do the work:
 *
 *  1. A root attribute (`html[data-dsh-power-compact-panels]`) switches on a
 *     CSS override that lays the rows out as ONE horizontal strip of 32px
 *     icon-only pills (native hover fill stays as-is — the rows keep their own
 *     `--dsw-alias-interactive-bg-hover` rule).
 *  2. `PanelRowTooltip` is a thin hover layer: the native row tooltip is
 *     `disabled: wide` (it only exists on the collapsed rail), so the labels
 *     need a replacement in wide mode. The bubble mirrors the DSH `Tooltip`
 *     bubble metric-for-metric (same tokens, padding, radius, font, gap and
 *     fade) so the hover hint still reads as native.
 *
 * The flag is read from the Host plugin's settings namespace through the shared
 * `configForms` helper (see ./settings.ts) and re-read on every settings
 * change, so toggling it on the settings card takes effect without a reload.
 * When the settings service is unavailable the plugin's own `/health` payload
 * (which reports the effective Host config) is used as a fallback.
 */
import { useEffect, useState, useSyncExternalStore } from 'react'
import { openSettingsScope, readSettings, type SettingsClient } from './settings.ts'

/** Root attribute that turns the CSS override on. */
const ATTR = 'data-dsh-power-compact-panels'
/** Hover delay before the label bubble appears (same as the native rows). */
const TIP_DELAY_MS = 500
/** Anchor-to-bubble gap (the native Tooltip default). */
const TIP_GAP = 8
/** Rough bubble width used to decide whether it must flip to the left side. */
const TIP_ESTIMATED_WIDTH = 200

const ROW_SELECTOR = 'button[class*="_panelRow"]'
const LIST_SELECTOR = 'nav[class*="_panelList"]'
const TITLE_SELECTOR = '[class*="_panelTitle"]'

let enabled = false
const listeners = new Set<() => void>()

/** Whether the compact strip is currently active. */
export function isCompactPanelsEnabled(): boolean {
  return enabled
}

/** Subscribe to switch changes; returns an unsubscribe. */
export function onCompactPanelsChange(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

function setEnabled(next: boolean): void {
  if (next === enabled) return
  enabled = next
  if (typeof document !== 'undefined') {
    if (next) document.documentElement.setAttribute(ATTR, '')
    else document.documentElement.removeAttribute(ATTR)
  }
  for (const listener of listeners) {
    try { listener() } catch { /* one bad subscriber must not break the rest */ }
  }
}

/**
 * Start following the `compactPanelRows` config. Returns a disposer that
 * unsubscribes and restores the default (off) layout.
 */
export function installCompactPanels(ctx: SettingsClient): () => void {
  let disposeScope: (() => void) | undefined
  let settingsAuthoritative = false
  let disposed = false
  const timers: number[] = []

  /** Attach to the settings scope. Returns false while the service is absent. */
  const attach = (): boolean => {
    const scope = openSettingsScope(ctx)
    if (scope === undefined) return false
    const read = (): void => {
      const values = readSettings(scope)
      if (Object.keys(values).length === 0) return
      settingsAuthoritative = true
      setEnabled(values.compactPanelRows === true)
    }
    read()
    const off = scope.subscribe?.(read)
    disposeScope = () => { try { off?.() } catch { /* ignore */ } }
    return true
  }

  if (!attach() && typeof window !== 'undefined') {
    // The settings plugin may not have published its service yet during boot.
    for (const delay of [800, 2400]) {
      timers.push(window.setTimeout(() => {
        if (!disposed && !settingsAuthoritative) attach()
      }, delay))
    }
  }

  // Fallback: the Host's own health payload reports the effective config (covers
  // hosts whose client half has no settings service, e.g. profile-YAML-only use).
  void fetch('/api/dsh-power-xc/health', { cache: 'no-store' })
    .then(async (response) => (response.ok
      ? await response.json() as { compactPanelRows?: unknown }
      : null))
    .then((body) => {
      if (settingsAuthoritative || body === null) return
      if (typeof body.compactPanelRows === 'boolean') setEnabled(body.compactPanelRows)
    })
    .catch(() => { /* offline: keep the default (off) */ })

  return () => {
    disposed = true
    for (const timer of timers) window.clearTimeout(timer)
    disposeScope?.()
    setEnabled(false)
  }
}

/** One pending label bubble. */
type Tip = { label: string; left: number; top: number; flip: boolean }

/** Resolve the compact panel row under an event target, if any. */
function rowOf(target: EventTarget | null): HTMLElement | null {
  if (target === null || typeof (target as Element).closest !== 'function') return null
  const row = (target as Element).closest(ROW_SELECTOR) as HTMLElement | null
  if (row === null) return null
  if (row.closest(LIST_SELECTOR) === null) return null
  // Rail mode renders no label span and keeps its own native tooltip.
  if (row.querySelector(TITLE_SELECTOR) === null) return null
  return row
}

/**
 * Hover layer for the compact strip: shows the row's label in a DSH-styled
 * bubble after the native 500ms delay (immediately on keyboard focus).
 */
export function PanelRowTooltip(): JSX.Element | null {
  const active = useSyncExternalStore(onCompactPanelsChange, isCompactPanelsEnabled)
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => {
    if (!active) {
      setTip(null)
      return
    }
    let timer = 0
    let current: HTMLElement | null = null

    const hide = (): void => {
      current = null
      if (timer !== 0) { window.clearTimeout(timer); timer = 0 }
      setTip((previous) => (previous === null ? previous : null))
    }

    const show = (row: HTMLElement): void => {
      const label = (row.getAttribute('aria-label') ?? row.querySelector(TITLE_SELECTOR)?.textContent ?? '').trim()
      if (label === '') return
      const rect = row.getBoundingClientRect()
      const flip = rect.right + TIP_GAP + TIP_ESTIMATED_WIDTH > window.innerWidth
      setTip({
        label,
        left: flip ? rect.left - TIP_GAP : rect.right + TIP_GAP,
        top: rect.top + rect.height / 2,
        flip,
      })
    }

    const enter = (row: HTMLElement): void => {
      if (current === row) return
      if (timer !== 0) window.clearTimeout(timer)
      current = row
      timer = window.setTimeout(() => {
        timer = 0
        if (current === row) show(row)
      }, TIP_DELAY_MS)
    }

    const onOver = (event: Event): void => {
      const row = rowOf(event.target)
      if (row !== null) enter(row)
    }
    const onOut = (event: Event): void => {
      const row = rowOf(event.target)
      if (row === null || current !== row) return
      const next = (event as PointerEvent).relatedTarget
      if (next instanceof Node && row.contains(next)) return
      hide()
    }
    const onFocusIn = (event: Event): void => {
      const row = rowOf(event.target)
      if (row === null) return
      hide()
      current = row
      show(row)
    }
    const onFocusOut = (): void => hide()
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') hide()
    }

    document.addEventListener('pointerover', onOver, true)
    document.addEventListener('pointerout', onOut, true)
    document.addEventListener('focusin', onFocusIn, true)
    document.addEventListener('focusout', onFocusOut, true)
    document.addEventListener('click', hide, true)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      if (timer !== 0) window.clearTimeout(timer)
      document.removeEventListener('pointerover', onOver, true)
      document.removeEventListener('pointerout', onOut, true)
      document.removeEventListener('focusin', onFocusIn, true)
      document.removeEventListener('focusout', onFocusOut, true)
      document.removeEventListener('click', hide, true)
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [active])

  if (!active || tip === null) return null
  return (
    <div
      className="dsh-power-tip"
      role="tooltip"
      style={{
        left: tip.left,
        top: tip.top,
        transform: tip.flip ? 'translate(-100%, -50%)' : 'translateY(-50%)',
      }}
    >
      {tip.label}
    </div>
  )
}

/**
 * Plugin-owned CSS for the compact strip + its label bubble. The layout is
 * scoped to rows that still render a `panelTitle` span, which the native
 * sidebar only does in wide mode — the 56px rail keeps its own geometry.
 */
export const compactPanelsCss = `
/* --- compact panel strip (opt-in via html[data-dsh-power-compact-panels]) -- */
html[${ATTR}] nav[class*="_panelList"]:has([class*="_panelTitle"]) {
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding-inline: var(--dsh-sidebar-paint-inset, 3px);
}
html[${ATTR}] nav[class*="_panelList"]:has([class*="_panelTitle"]) > * {
  flex: none;
}
html[${ATTR}] nav[class*="_panelList"]:has([class*="_panelTitle"]) [class*="_moreAnchor"] {
  flex-direction: row;
}
html[${ATTR}] nav[class*="_panelList"]:has([class*="_panelTitle"]) [class*="_panelRow"] {
  width: 32px;
  height: 32px;
  min-height: 32px;
  margin: 0;
  padding: 0;
  gap: 0;
  justify-content: center;
  border-inline: 0;
  background-clip: border-box;
}
html[${ATTR}] nav[class*="_panelList"]:has([class*="_panelTitle"]) [class*="_panelTitle"] {
  display: none;
}
html[${ATTR}] nav[class*="_panelList"]:has([class*="_panelTitle"]) [class*="_panelGlyph"] svg {
  width: 18px;
  height: 18px;
}

/* --- label bubble: the native Tooltip bubble, token for token ------------- */
.dsh-power-tip {
  position: fixed;
  z-index: 1100;
  display: inline-flex;
  align-items: safe center;
  gap: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: min(50vw, calc(100vw - 24px));
  max-height: calc(100vh - 24px);
  overflow: auto;
  padding: 3px 7px;
  border-radius: var(--dsw-radius-sm, 8px);
  background: var(--dsw-alias-tooltip-bg, rgba(28, 30, 36, 0.96));
  color: var(--dsw-static-neutral-bluish-00, #ffffff);
  font-size: 13px;
  line-height: 20px;
  white-space: pre-line;
  overflow-wrap: break-word;
  pointer-events: none;
  animation: dsh-power-tip-in 0.15s var(--ds-ease-in-out, ease);
}
@keyframes dsh-power-tip-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-power-tip { animation: none; }
}
`
