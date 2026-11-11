/**
 * Sidebar footer power button + upward menu (刷新 / 重启 / 关机).
 *
 * Visual layer: the trigger is modelled on the native sidebar footer rows that
 * sit directly above it (ui-settings-account `AccountMenu` / ui-settings-general
 * `SettingsRoot` trigger) — 42px row, paint-inset border + row padding,
 * `--dsw-radius-md` pill, 14px/22px label, hover/focus/expanded fills from
 * `--dsw-alias-interactive-bg-hover` with the native focus ring, 16px glyph
 * (18px on the 36px rail). The menu is modelled on the native `Menu` primitive
 * (surface, shadow, 34px items, 13px/20px labels, menu icon colour, danger
 * palette). State styling lives in `powerCss` (injected once by the plugin),
 * geometry lives inline because it differs between the wide row and the rail.
 * Everything is driven by DSH theme tokens, so light/dark follow automatically.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import { beginPower, getRestartPhase, onRestartChange, NS } from './index.ts'
import { ShutdownConfirm } from './ShutdownConfirm.tsx'
import { menu, motion, row } from './theme.ts'

export type RestartButtonProps = { wide: boolean } & PropsLocale<typeof NS>

/** Comfortable menu width (native menus clamp between 144px and 360px). */
const MENU_W = 212
/** Gap between the trigger and the menu — the native anchored-menu gap. */
const MENU_GAP = 6

export function RestartButton(props: RestartButtonProps): JSX.Element {
  const { t } = props
  const [open, setOpen] = useState(false)
  // Whether the menu was opened via keyboard (ArrowDown/ArrowUp on the trigger).
  // WAI-ARIA menu-button moves focus into the menu only on KEYBOARD open; a
  // mouse click must not steal focus.
  const [openViaKeyboard, setOpenViaKeyboard] = useState(false)
  // Shutdown is irreversible (the process exits and must be started manually),
  // so it always passes through a confirm dialog before beginPower('shutdown').
  const [confirming, setConfirming] = useState(false)
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  // A lifecycle flow is in flight → the power button must not re-trigger.
  // Subscribed reactively so the button flips to disabled the moment a flow
  // starts (and back once it settles).
  const phase = useSyncExternalStore(onRestartChange, getRestartPhase)
  const busy = phase !== 'idle' && phase !== 'error'
  const glyphSize = props.wide ? row.glyphWide : row.glyphRail

  // Close on outside click or Escape; move focus into the menu on open and
  // back to the trigger on close (WAI-ARIA menu-button pattern). Focus moves
  // into the menu only when opened by keyboard — a mouse click leaves focus on
  // the trigger.
  useEffect(() => {
    if (!open) return
    if (openViaKeyboard) {
      const firstItem = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      firstItem?.focus()
    }
    const onDown = (e: MouseEvent): void => {
      const t = e.target as Node
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
      btnRef.current?.focus()
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setOpen(false)
        btnRef.current?.focus()
        return
      }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      e.preventDefault()
      const items = [...(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])]
      const idx = items.indexOf(document.activeElement as HTMLButtonElement)
      const delta = e.key === 'ArrowDown' ? 1 : -1
      if (items.length === 0) return
      const next = items[(idx + delta + items.length) % items.length]
      next?.focus()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, openViaKeyboard])

  const pick = (action: 'restart' | 'shutdown'): void => {
    setOpen(false)
    if (action === 'shutdown') {
      // Irreversible — require explicit confirmation in a dialog.
      setConfirming(true)
      return
    }
    beginPower('restart')
  }

  // Anchor the menu above the button, right-aligned to its right edge.
  // No hardcoded menu height: measure the rendered menu via menuRef and offset
  // by its ACTUAL height, so it never overlaps the button regardless of item
  // count, wrapping, or font scaling. Width is responsive: at least 8px gutter
  // on narrow viewports, capped at the menu's comfortable width.
  const anchor = (): React.CSSProperties => {
    const r = btnRef.current?.getBoundingClientRect()
    if (!r) return { display: 'none' }
    const m = menuRef.current?.getBoundingClientRect()
    const menuW = Math.min(MENU_W, Math.max(0, window.innerWidth - 16))
    const menuH = m?.height ?? 84
    return {
      position: 'fixed',
      left: Math.max(8, r.right - menuW),
      top: Math.max(8, r.top - MENU_GAP - menuH),
      width: menuW,
    }
  }

  // Native `Menu` surface tuning: the hairline stroke of the prominent
  // elevation uses the menu border token, exactly like the native list.
  const menuVars: React.CSSProperties & Record<string, string> = {
    ['--dsw-elevation-stroke-color']: 'var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.04))',
  }

  return (
    <>
      {/* Sidebar-footer power trigger. Hover tooltip is the DSH-native bubble
          (same Tooltip as the adjacent settings / account triggers), always
          available in both rail and wide mode, and it follows the flow state
          when busy. The aria-label carries the same text (icon-only rail
          convention, mirroring native buttons whose tooltip text doubles as
          the accessible name). */}
      <Tooltip
        label={busy ? t('powerBusy') : t('powerTitle')}
        delayMs={500}
      >
      <button
        ref={btnRef}
        type="button"
        className="dsh-power-button"
        onClick={() => { if (!busy) { setOpenViaKeyboard(false); setOpen(o => !o) } }}
        onKeyDown={(e) => {
          if (busy) return
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            setOpenViaKeyboard(true)
            setOpen(true)
          }
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={busy ? t('powerBusy') : t('powerTitle')}
        disabled={busy}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: props.wide ? undefined : 'center',
          gap: props.wide ? row.gap : 0,
          width: props.wide ? '100%' : row.railSize,
          minWidth: 0,
          height: props.wide ? row.height : row.railSize,
          margin: props.wide ? '0 0 4px' : '8px 0 10px',
          boxSizing: 'border-box',
          // Native row geometry: the paint-inset border keeps the hover pill
          // inset from the sidebar edge exactly like the account/settings rows,
          // and the padding lands the glyph on the same 12px text line.
          padding: props.wide ? `0 ${row.inlinePadding}` : 0,
          border: 'none',
          borderInline: props.wide ? `${row.paintInset} solid transparent` : undefined,
          borderRadius: row.radius,
          color: 'var(--dsw-alias-label-primary)',
          font: 'inherit',
          fontSize: 14,
          lineHeight: '22px',
          flex: 'none',
          cursor: busy ? 'default' : 'pointer',
          opacity: busy ? 0.4 : 1,
          textAlign: 'left',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* power glyph — 16px like the settings gear (18px on the rail);
            spinner while a flow runs */}
        {busy ? (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flex: '0 0 auto', animation: 'dsh-power-btn-spin 0.9s linear infinite' }}>
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="34 16" />
          </svg>
        ) : (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flex: '0 0 auto' }}>
            <path d="M12 3v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M7.5 5.6a8 8 0 1 0 9 0" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )}
        {props.wide && <span className="dsh-power-label">{t('power')}</span>}
      </button>
      </Tooltip>

      {open ? (
        <div
          ref={menuRef}
          role="menu"
          aria-label={t('power')}
          className="dsh-power-menu"
          data-menu-material=""
          style={{
            ...anchor(),
            ...menuVars,
            zIndex: 1500,
            boxSizing: 'border-box',
            padding: menu.padding,
            borderRadius: menu.radius,
            background: menu.background,
            backdropFilter: menu.backdrop,
            WebkitBackdropFilter: menu.backdrop,
            border: 0,
            boxShadow: menu.shadow,
            fontFamily: 'inherit',
            fontSize: menu.fontSize,
            lineHeight: menu.lineHeight,
            color: 'var(--dsw-alias-label-primary)',
            animation: `dsh-power-menu-in ${motion.menu} ${motion.ease}`,
          }}
        >
          <MenuItem
            label={t('refresh')}
            onClick={() => {
              setOpen(false)
              // Mirror mobile-xc's drawer refresh: a plain page reload.
              window.location.reload()
            }}
            glyph={
              <svg width={menu.iconSize} height={menu.iconSize} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 16H3v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <MenuItem
            label={t('restart')}
            onClick={() => pick('restart')}
            glyph={
              <svg width={menu.iconSize} height={menu.iconSize} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 12a8 8 0 1 1-2.34-5.66" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M20 3v4h-4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <MenuItem
            label={t('shutdown')}
            hint={t('shutdownStops')}
            danger
            onClick={() => pick('shutdown')}
            glyph={
              <svg width={menu.iconSize} height={menu.iconSize} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3v8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M7.5 5.6a8 8 0 1 0 9 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
      ) : null}

      {/* Shutdown confirm dialog: irreversible action, explicit second step. */}
      {confirming ? (
        <ShutdownConfirm
          title={t('shutdownConfirmTitle')}
          body={t('shutdownConfirmBody')}
          confirmLabel={t('confirmShutdown')}
          cancelLabel={t('cancel')}
          onConfirm={() => {
            setConfirming(false)
            beginPower('shutdown')
          }}
          onCancel={() => setConfirming(false)}
        />
      ) : null}
    </>
  )
}

/** One native-menu item: 14px glyph, ellipsised label, optional right-aligned
 *  caption (the native shortcut slot), and the native danger palette. */
function MenuItem({ label, hint, danger, onClick, glyph }: {
  label: string
  /** Small secondary semantics (e.g. "停止 Harness"), 11px caption on the right. */
  hint?: string
  /** Shutdown item: error tint + danger hover fill, like a native danger item. */
  danger?: boolean
  onClick: () => void
  glyph: JSX.Element
}): JSX.Element {
  return (
    <button
      type="button"
      role="menuitem"
      className="dsh-power-menu-item"
      data-danger={danger === true ? 'true' : undefined}
      onClick={onClick}
    >
      <span className="dsh-power-menu-icon" aria-hidden="true">{glyph}</span>
      <span className="dsh-power-menu-label">{label}</span>
      {hint !== undefined && <span className="dsh-power-menu-hint">{hint}</span>}
    </button>
  )
}

/**
 * Plugin-owned CSS: trigger + menu states and keyframes, injected once per
 * document by the plugin entry (`apply()`). State rules live here rather than
 * in inline handlers so hover/focus/expanded behave exactly like native rows
 * under the same media/theme conditions.
 */
export const powerCss = `
/* --- footer power button: native sidebar row states ---------------------- */
.dsh-power-button {
  /* transparent at rest, clipped to the padding box so the hover / expanded
     pill stays inset behind the paint-inset border, like native rows */
  background-color: transparent;
  background-clip: padding-box;
  transition: background-color var(--ds-transition-duration-fast, 100ms) var(--ds-ease-in-out, cubic-bezier(0.4, 0, 0.2, 1));
}
@media (hover: hover) {
  .dsh-power-button:hover:not(:disabled) {
    background-color: var(--dsw-alias-interactive-bg-hover);
  }
}
.dsh-power-button[aria-expanded='true'] {
  background-color: var(--dsw-alias-interactive-bg-hover);
}
.dsh-power-button:focus-visible {
  background-color: var(--dsw-alias-interactive-bg-hover);
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: -2px;
}
.dsh-power-label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* --- menu: native Menu primitive surface + items ------------------------- */
.dsh-power-menu-item {
  display: flex;
  align-items: center;
  gap: ${menu.itemGap}px;
  width: 100%;
  min-height: ${menu.itemHeight}px;
  padding: ${menu.itemPadding};
  box-sizing: border-box;
  border: none;
  border-radius: ${menu.itemRadius};
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: ${menu.fontSize}px;
  line-height: ${menu.lineHeight};
  text-align: left;
  cursor: pointer;
}
@media (hover: hover) {
  .dsh-power-menu-item:hover:not(:disabled) {
    background-color: var(--dsw-alias-interactive-bg-hover);
  }
  .dsh-power-menu-item[data-danger='true']:hover:not(:disabled) {
    background-color: var(--dsw-alias-interactive-bg-hover-danger);
  }
}
.dsh-power-menu-item:focus-visible {
  background-color: var(--dsw-alias-interactive-bg-hover);
  outline: none;
}
.dsh-power-menu-item[data-danger='true']:focus-visible {
  background-color: var(--dsw-alias-interactive-bg-hover-danger);
}
.dsh-power-menu-item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.dsh-power-menu-icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: ${menu.iconSize}px;
  height: ${menu.iconSize}px;
  color: var(--dsw-alias-menu-icon, var(--dsw-alias-label-secondary));
}
.dsh-power-menu-icon svg {
  width: ${menu.iconSize}px;
  height: ${menu.iconSize}px;
}
.dsh-power-menu-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dsh-power-menu-hint {
  flex: none;
  margin-inline-start: auto;
  color: var(--dsw-alias-label-caption, var(--dsw-alias-label-secondary));
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
}
.dsh-power-menu-item[data-danger='true'] {
  color: var(--dsw-alias-state-error-primary);
}
.dsh-power-menu-item[data-danger='true'] .dsh-power-menu-icon {
  color: inherit;
}

@keyframes dsh-power-menu-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes dsh-power-btn-spin {
  to { transform: rotate(360deg); }
}
`
