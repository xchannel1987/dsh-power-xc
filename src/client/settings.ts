/**
 * Shared settings plumbing for the client half.
 *
 * DSH >= 0.1.7 exposes a Host plugin's configuration to the browser through the
 * `configForms` service, keyed by the plugin entry id (the bundle's npm package
 * name). The scope it returns is a `ConfigFormController`:
 *
 *   getSnapshot() -> { status, value, base, user, revision, writable }
 *   set(key, value) -> Promise<boolean> | boolean | void
 *   subscribe(listener) -> disposer
 *
 * Everything here is defensive: an older/leaner Host without the service simply
 * yields `undefined` and callers fall back to their defaults.
 */

/** Plugin entry id in the profile = this package's name. */
export const PLUGIN_ID = 'dsh-power-xc'

/** Loose view of one namespace's form controller. */
export type SettingsScope = {
  getSnapshot?: () => unknown
  set?: (key: string, value: unknown) => unknown
  subscribe?: (listener: () => void) => (() => void) | undefined
}

/** Loose view of the `configForms` service. */
type SettingsForms = {
  get?: (ns: string) => unknown
  describe?: () => { getSnapshot?: () => unknown } | undefined
}

/** What this module needs from the client context (optional lookup only). */
export type SettingsClient = { get?: (name: string) => unknown } | undefined

/**
 * Settings snapshots are descriptors (`{ value, status, base, revision, … }`);
 * older hosts hand the plain value. Unwrap to the value object.
 */
export function unwrapSettingsSnapshot(raw: unknown): unknown {
  if (raw !== null && typeof raw === 'object') {
    const record = raw as Record<string, unknown>
    if ('value' in record && ('status' in record || 'base' in record || 'revision' in record)) {
      return record.value
    }
  }
  return raw
}

/** Read a scope's current values as a plain record (empty when unreadable). */
export function readSettings(scope: SettingsScope | undefined): Record<string, unknown> {
  try {
    const value = unwrapSettingsSnapshot(scope?.getSnapshot?.())
    if (value !== null && typeof value === 'object') return value as Record<string, unknown>
  } catch { /* unreadable snapshot */ }
  return {}
}

/**
 * Pick this plugin's namespace from the served-namespace directory. Entry ids
 * are the package name in practice; the fallbacks cover prefixed ids that some
 * bundles get when a profile mounts the same package twice.
 */
export function resolveSettingsNamespace(forms: SettingsForms | undefined): string {
  try {
    const snapshot = forms?.describe?.()?.getSnapshot?.() as
      | { view?: { namespaces?: Array<{ ns?: unknown }> } }
      | undefined
    const served = (snapshot?.view?.namespaces ?? [])
      .map((entry) => entry.ns)
      .filter((ns): ns is string => typeof ns === 'string')
    if (served.includes(PLUGIN_ID)) return PLUGIN_ID
    const match = served.find((ns) => ns.startsWith(`${PLUGIN_ID}#`) || ns.endsWith(`/${PLUGIN_ID}`))
    if (match !== undefined) return match
  } catch { /* directory unavailable → default id */ }
  return PLUGIN_ID
}

/** Open this plugin's settings scope, or `undefined` when the service is absent. */
export function openSettingsScope(ctx: SettingsClient): SettingsScope | undefined {
  try {
    const forms = ctx?.get?.('configForms') as SettingsForms | undefined
    if (forms === undefined || forms === null) return undefined
    const scope = forms.get?.(resolveSettingsNamespace(forms)) as SettingsScope | undefined
    if (scope === undefined || scope === null || typeof scope.getSnapshot !== 'function') return undefined
    return scope
  } catch {
    return undefined
  }
}
