#!/usr/bin/env node
/**
 * probe-sidebar-foot.mjs — 读取运行中 DSH sidebar foot 的真实布局。
 *
 * 用途：为“把电源按钮移到设置按钮下方”的实现提供运行时机（类名/DOM 顺序/
 * computed style），也用于改动后的回归验证。
 *
 * 用法：node scripts/probe-sidebar-foot.mjs
 *   DSH_PROBE_URL   默认 http://127.0.0.1:3080/
 *   DSH_PROBE_CHROME 浏览器可执行文件（默认自动探测 Edge/Chrome）
 */
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const URL = process.env.DSH_PROBE_URL ?? 'http://127.0.0.1:3080/'

function findBrowser() {
  const candidates = [
    process.env.DSH_PROBE_CHROME,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean)
  for (const c of candidates) if (existsSync(c)) return c
  throw new Error('未找到 Chromium 系浏览器，设置 DSH_PROBE_CHROME')
}

async function waitFor(port, timeoutMs) {
  const start = Date.now()
  for (;;) {
    try {
      const res = await fetch('http://127.0.0.1:' + port + '/json/version')
      if (res.ok) return await res.json()
    } catch { /* not up yet */ }
    if (Date.now() - start > timeoutMs) throw new Error('browser 启动超时')
    await new Promise((r) => setTimeout(r, 200))
  }
}

async function main() {
  const browser = findBrowser()
  const port = 9000 + Math.floor(Math.random() * 900)
  const userData = mkdtempSync(join(tmpdir(), 'dsh-xc-sidefoot-'))
  const child = spawn(browser, [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu',
    '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + port, '--user-data-dir=' + userData, 'about:blank',
  ], { stdio: 'ignore' })

  let ws = null
  try {
    await waitFor(port, 15000)
    const pages = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json()
    const page = pages.find((t) => t.type === 'page')
    if (!page) throw new Error('无 page target')
    ws = new WebSocket(page.webSocketDebuggerUrl)
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = () => reject(new Error('WS 失败')) })

    let msgId = 0
    const pending = new Map()
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data)
      if (msg.id !== undefined) { const p = pending.get(msg.id); if (p) { pending.delete(msg.id); p(msg) } }
    }
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++msgId
      pending.set(id, (msg) => (msg.error ? reject(new Error(method + ': ' + JSON.stringify(msg.error))) : resolve(msg.result)))
      ws.send(JSON.stringify({ id, method, params }))
    })
    const evaluate = async (expression) => {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
      if (res.exceptionDetails) throw new Error('evaluate 抛错: ' + (res.exceptionDetails.exception?.description ?? res.exceptionDetails.text))
      return res.result?.value
    }
    const waitForDom = async (expression, timeoutMs = 30000) => {
      const start = Date.now()
      for (;;) {
        if (await evaluate(expression)) return true
        if (Date.now() - start > timeoutMs) return false
        await new Promise((r) => setTimeout(r, 250))
      }
    }

    await send('Runtime.enable')
    await send('Page.enable')
    await send('Page.navigate', { url: URL })
    await new Promise((r) => setTimeout(r, 15000))
    const diag = await evaluate(`(() => {
      return {
        ready: document.readyState,
        title: document.title,
        bodyLen: (document.body ? document.body.innerText.length : -1),
        bodyHead: (document.body ? document.body.innerText.slice(0, 300) : 'NO BODY'),
        shellOverlay: !!document.querySelector('[data-shell-overlay]'),
        powerBtn: !!document.querySelector('.dsh-power-button'),
        roots: [...document.querySelectorAll('#root, [data-shell-overlay], body > div')].length,
      }
    })()`)
    console.log('DIAGNOSE ' + JSON.stringify(diag, null, 2))

    const chain = await evaluate(`(() => {
      const out = []
      let el = document.querySelector('.dsh-power-button')
      if (!el) return out
      for (let i = 0; i < 8 && el; i++) {
        const cs = getComputedStyle(el)
        const r = el.getBoundingClientRect()
        out.push({ i, tag: el.tagName, cls: String(el.className).slice(0, 110), display: cs.display, flexDirection: cs.flexDirection, order: cs.order, rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] })
        el = el.parentElement
      }
      return out
    })()`)
    const byCls = await evaluate(`(() => {
      const res = {}
      for (const pat of ['footArea', 'footerActions', 'settingsArea']) {
        res[pat] = [...document.querySelectorAll('[class*="' + pat + '"]')].map((n) => { const r = n.getBoundingClientRect(); return { cls: String(n.className).slice(0, 100), rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] } })
      }
      return res
    })()`)
    const settingsTrigger = await evaluate(`(() => {
      const t = [...document.querySelectorAll('button')].find((b) => /settings/i.test(b.getAttribute('aria-label') || '') || (b.textContent || '\u0020').includes('&#35774;') || (b.textContent || '').trim() === '\u8bbe\u7f6e')
      if (!t) return null
      const r = t.getBoundingClientRect()
      return { cls: String(t.className).slice(0, 110), text: (t.textContent || '').trim().slice(0, 30), rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)] }
    })()`)
    const dump = { chain, byCls, settingsTrigger, powerPresent: chain.length > 0 }
    // ---- verify: inject the same order CSS the plugin injects, then assert ---
    await evaluate(`(() => {
      const s = document.createElement('style')
      s.id = 'probe-order-css'
      s.textContent = '[class$="_settingsArea"] { order: 1; } [class$="_footerActions"] { order: 2; }'
      document.head.appendChild(s)
      return true
    })()`)
    await new Promise((r) => setTimeout(r, 120))
    const orderCheck = await evaluate(`(() => {
      const fa = document.querySelector('[class$="_footerActions"]')
      const sa = document.querySelector('[class$="_settingsArea"]')
      if (!fa || !sa) return { ok: false, why: 'missing blocks' }
      const facs = getComputedStyle(fa)
      const sacs = getComputedStyle(sa)
      const fr = fa.getBoundingClientRect()
      const sr = sa.getBoundingClientRect()
      const btn = document.querySelector('.dsh-power-button')
      const br = btn ? btn.getBoundingClientRect() : null
      const inside = fr.y >= 0 // visible? (sidebar may be collapsed/off-screen)
      return {
        ok: facs.order === '2' && sacs.order === '1',
        footerActsOrder: facs.order,
        settingsOrder: sacs.order,
        footerY: Math.round(fr.y), settingsY: Math.round(sr.y), settingsAboveFooter: sr.y < fr.y,
        btnY: br ? Math.round(br.y) : null,
        btnBelowSettings: br ? br.y > sr.y : false,
      }
    })()`)
    console.log('ORDER_CHECK ' + JSON.stringify(orderCheck, null, 2))
    console.log(JSON.stringify(dump, null, 2))
  } finally {
    try { ws?.close() } catch { /* ignore */ }
    child.kill()
  }
}

main().catch((error) => {
  console.error('[probe] 失败:', error.message)
  process.exit(1)
})