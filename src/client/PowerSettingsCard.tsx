/**
 * Settings card for 设置 → 插件 → dsh-power-xc.
 *
 * DSH's Plugins page only shows a configuration section for bundles that
 * contribute one into `plugins.bundle.config` (keyed by npm package name) —
 * a Host schema alone does not render anything there. This card is that
 * contribution, modelled on dsh-session-xc's card: a titled section of switch
 * rows at the page's native spacing, reading and writing the Host settings
 * namespace through `configForms` (see ./settings.ts).
 *
 * Field notes:
 *  - `compactPanelRows` is live-settable: the client layout follows it at once.
 *  - `enableModelTool` is applied by the Host plugin when it loads, so the hint
 *    says a DSH restart is required (the switch still persists the value).
 */
import { useEffect, useRef, useState } from 'react'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-slots'
import { NS } from './index.ts'
import { zh } from './locales.ts'
import { openSettingsScope, readSettings, type SettingsClient, type SettingsScope } from './settings.ts'

export type PowerSettingsCardProps = PropsLocale<typeof NS>

/** Client context captured at apply time so the card can open its scope lazily. */
let boundCtx: SettingsClient

/** Remember the client context for the card (called once from apply()). */
export function bindSettingsContext(ctx: SettingsClient): void {
  boundCtx = ctx
}

/** Persist one field, rolling the optimistic value back when the write fails. */
function writeField(scope: SettingsScope, key: string, value: unknown, rollback: () => void): void {
  try {
    const result = scope.set?.(key, value) as Promise<unknown> | undefined
    if (result !== undefined && result !== null && typeof (result as { then?: unknown }).then === 'function') {
      void (result as Promise<unknown>).then(
        (accepted) => { if (accepted === false) rollback() },
        () => rollback(),
      )
    }
  } catch {
    rollback()
  }
}

export function PowerSettingsCard(props: PowerSettingsCardProps): JSX.Element | null {
  // The slot supplies `t` when the registration carries a locale; fall back to
  // the Chinese dictionary so the card can never crash on a bare render.
  const t = (key: keyof typeof zh): string => {
    try {
      const value = props?.t?.(key)
      if (typeof value === 'string' && value !== '') return value
    } catch { /* ignore */ }
    return zh[key]
  }
  const scope = openSettingsScope(boundCtx)
  const [values, setValues] = useState<Record<string, unknown>>(() => readSettings(scope))
  const [attempt, setAttempt] = useState(0)
  const dirty = useRef(false)

  // The settings service can still be publishing when the page first paints.
  useEffect(() => {
    if (scope !== undefined) return
    const timer = window.setTimeout(() => setAttempt((value) => value + 1), 600)
    return () => window.clearTimeout(timer)
  }, [scope, attempt])

  useEffect(() => {
    if (scope === undefined) return
    const sync = (): void => {
      if (dirty.current) return
      setValues(readSettings(scope))
    }
    sync()
    const off = scope.subscribe?.(sync)
    return () => { try { off?.() } catch { /* ignore */ } }
  }, [scope])

  if (scope === undefined) return null

  const rows = [
    { key: 'compactPanelRows', label: t('settingsCompactLabel'), hint: t('settingsCompactHint') },
    { key: 'enableModelTool', label: t('settingsModelToolLabel'), hint: t('settingsModelToolHint') },
  ]

  const toggle = (key: string, on: boolean): void => {
    dirty.current = true
    setValues((previous) => ({ ...previous, [key]: on }))
    writeField(scope, key, on, () => setValues(readSettings(scope)))
  }

  return (
    <div className="dsh-power-cfg">
      <h4 className="dsh-power-cfg-title">{t('settingsTitle')}</h4>
      <p className="dsh-power-cfg-desc">{t('settingsDesc')}</p>
      <div className="dsh-power-cfg-body">
        {rows.map((row) => {
          const on = values[row.key] === true
          return (
            <label className="dsh-power-cfg-row" key={row.key}>
              <span className="dsh-power-cfg-text">
                <span className="dsh-power-cfg-label">{row.label}</span>
                <span className="dsh-power-cfg-hint">{row.hint}</span>
              </span>
              <span className="dsh-power-switch" data-on={on ? 'true' : 'false'}>
                <input
                  type="checkbox"
                  checked={on}
                  aria-label={row.label}
                  onChange={(event) => toggle(row.key, event.target.checked)}
                />
                <span className="dsh-power-switch-thumb" />
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Plugin-owned CSS for the settings card: the Plugins page's own field rhythm
 * (12px rows, hairline separators, label + hint stack) and a DSH-tokened
 * switch, so the card reads like the shipped plugin pages.
 */
export const powerSettingsCss = `
.dsh-power-cfg {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh-power-cfg-title {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--dsw-alias-label-primary);
}
.dsh-power-cfg-desc {
  margin: 0 0 2px;
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-power-cfg-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.dsh-power-cfg-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--dsw-alias-border-l2);
  cursor: pointer;
}
.dsh-power-cfg-row:first-child {
  border-top: none;
}
.dsh-power-cfg-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.dsh-power-cfg-label {
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-primary);
}
.dsh-power-cfg-hint {
  font-size: 12px;
  line-height: 18px;
  color: var(--dsw-alias-label-tertiary);
}
.dsh-power-switch {
  position: relative;
  flex: none;
  width: 40px;
  height: 24px;
  border-radius: 999px;
  background: var(--dsw-alias-border-l2);
  transition: background-color 160ms var(--ds-ease-in-out, ease);
}
.dsh-power-switch[data-on='true'] {
  background: var(--dsw-alias-button-info-fill, var(--dsw-alias-state-business-primary));
}
.dsh-power-switch input {
  position: absolute;
  inset: 0;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.dsh-power-switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  transition: transform 160ms var(--ds-ease-in-out, ease);
  pointer-events: none;
}
.dsh-power-switch[data-on='true'] .dsh-power-switch-thumb {
  transform: translateX(16px);
}
.dsh-power-switch:focus-within {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}
`
