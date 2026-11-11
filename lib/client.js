window.__ModuleLoader__.load({
	id: "dsh-power-xc",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/ShutdownConfirm.tsx
		/**
		* Shared modal confirm dialog for the irreversible shutdown action. Used both
		* by the power-button menu (RestartButton) and by the `/shutdown` command path
		* (client/index.ts listens for the SHUTDOWN_CONFIRM_PENDING signal and shows
		* this same dialog before POSTing /api/dsh-power-xc/shutdown).
		*/
		/** Fully self-contained: styled with DSH design tokens, own focus trap and Esc handling. */
		function ShutdownConfirm({ title, body, confirmLabel, cancelLabel, onConfirm, onCancel }) {
			const cancelRef = (0, react.useRef)(null);
			const confirmRef = (0, react.useRef)(null);
			const onKey = (e) => {
				if (e.key === "Escape") {
					onCancel();
					return;
				}
				if (e.key !== "Tab") return;
				const focusables = [cancelRef.current, confirmRef.current].filter((el) => el !== null);
				if (focusables.length === 0) return;
				const active = document.activeElement;
				const idx = focusables.indexOf(active);
				if (e.shiftKey) {
					if (idx <= 0) {
						e.preventDefault();
						focusables[focusables.length - 1]?.focus();
					}
				} else if (idx >= focusables.length - 1 || idx === -1) {
					e.preventDefault();
					focusables[0]?.focus();
				}
			};
			(0, react.useEffect)(() => {
				cancelRef.current?.focus();
				document.addEventListener("keydown", onKey);
				return () => document.removeEventListener("keydown", onKey);
			}, []);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": title,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget) onCancel();
				},
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 1600,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "var(--dsw-alias-bg-mask-2, rgba(0,0,0,0.4))",
					backdropFilter: "blur(2px)",
					WebkitBackdropFilter: "blur(2px)",
					fontFamily: "var(--dsw-font-family, ui-sans-serif, system-ui, sans-serif)"
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: {
						width: "min(360px, calc(100vw - 32px))",
						boxSizing: "border-box",
						padding: "20px 22px 18px",
						borderRadius: 14,
						background: "var(--dsw-alias-bg-layer-2, rgba(24,28,38,0.98))",
						border: "1px solid var(--dsw-alias-border-l3, rgba(196,211,232,0.31))",
						boxShadow: "0 16px 48px rgba(0,0,0,0.45)",
						color: "var(--dsw-alias-label-primary, #f2f6fc)"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 15,
								fontWeight: 650,
								lineHeight: 1.4,
								marginBottom: 8
							},
							children: title
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 13,
								lineHeight: 1.6,
								color: "var(--dsw-alias-label-secondary, rgba(242,246,252,0.7))",
								marginBottom: 18
							},
							children: body
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								justifyContent: "flex-end",
								gap: 10
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								ref: cancelRef,
								type: "button",
								onClick: onCancel,
								style: {
									padding: "7px 16px",
									borderRadius: 8,
									border: "1px solid var(--dsw-alias-border-l3, rgba(196,211,232,0.31))",
									background: "transparent",
									color: "var(--dsw-alias-label-primary, #f2f6fc)",
									font: "inherit",
									fontSize: 13,
									cursor: "pointer"
								},
								children: cancelLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								ref: confirmRef,
								type: "button",
								onClick: onConfirm,
								style: {
									padding: "7px 16px",
									borderRadius: 8,
									border: "1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 55%, transparent)",
									background: "color-mix(in srgb, var(--dsw-alias-state-error-primary) 16%, var(--dsw-alias-bg-layer-2, rgba(24,28,38,0.98)))",
									color: "var(--dsw-alias-state-error-primary, #ff8592)",
									font: "inherit",
									fontSize: 13,
									fontWeight: 600,
									cursor: "pointer"
								},
								children: confirmLabel
							})]
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/theme.ts
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
		const motion = {
			/** hover / micro-interactions */
			fast: "120ms",
			/** menu appear / item hover states */
			menu: "170ms",
			/** modal in */
			modal: "200ms",
			/** full-screen overlay stage transitions */
			overlay: "280ms",
			/** success / check morphs */
			success: "380ms",
			/** shared easing (Linear/Arc-style float, not the default `ease`) */
			ease: "cubic-bezier(0.2, 0.8, 0.2, 1)"
		};
		/** Radius tiers: small controls 8, floating surfaces 12, large modals 16. */
		const radius = {
			control: 8,
			surface: 12,
			modal: 16
		};
		/** Shadow tiers (single source, so every surface reads as one family). */
		const shadow = {
			/** small popovers / control hints */
			small: "0 6px 20px rgba(0, 0, 0, 0.22)",
			/** menus / toasts */
			surface: "0 10px 30px rgba(0, 0, 0, 0.28)",
			/** modals */
			modal: "0 18px 56px rgba(0, 0, 0, 0.36)"
		};
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
		const row = {
			height: 42,
			railSize: 36,
			gap: "var(--dsh-sidebar-label-gap, 6px)",
			inlinePadding: "calc(var(--dsh-sidebar-row-padding, 12px) - var(--dsh-sidebar-paint-inset, 3px))",
			paintInset: "var(--dsh-sidebar-paint-inset, 3px)",
			radius: "var(--dsw-radius-md, 12px)",
			/** glyph size: the native trigger is 16px wide, 18px on the rail */
			glyphWide: 16,
			glyphRail: 18
		};
		/**
		* Floating menu — the native `Menu` primitive's surface and item metrics:
		* 4px padding on radius-lg (16), `--dsw-menu-surface-fill` + backdrop blur,
		* `--dsw-elevation-prominent` shadow, 34px items on radius-md, 13px/20px
		* labels, 14px `--dsw-alias-menu-icon` glyphs, danger = error primary with
		* `--dsw-alias-interactive-bg-hover-danger`.
		*/
		const menu = {
			padding: 4,
			radius: "var(--dsw-radius-lg, 16px)",
			background: "var(--dsw-menu-surface-fill, var(--dsw-alias-bg-layer-2, #fcfdfe))",
			backdrop: "var(--dsw-menu-backdrop-filter, blur(40px) saturate(150%))",
			shadow: "var(--dsw-elevation-prominent, 0 3px 8px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.05))",
			itemHeight: 34,
			itemPadding: "6px 8px",
			itemRadius: "var(--dsw-radius-md, 12px)",
			itemGap: 6,
			iconSize: 14,
			fontSize: 13,
			lineHeight: "20px"
		};
		/** Full-screen lifecycle overlay veil: translucent + strong blur — the page is
		* "paused", not "gone" (avoids the crash / system-dead look of a near-black
		* veil). */
		const veil = {
			background: "rgba(8, 10, 16, 0.68)",
			backdropFilter: "blur(14px) saturate(0.85)"
		};
		//#endregion
		//#region src/client/RestartButton.tsx
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
		/** Comfortable menu width (native menus clamp between 144px and 360px). */
		const MENU_W = 212;
		/** Gap between the trigger and the menu — the native anchored-menu gap. */
		const MENU_GAP = 6;
		function RestartButton(props) {
			const { t } = props;
			const [open, setOpen] = (0, react.useState)(false);
			const [openViaKeyboard, setOpenViaKeyboard] = (0, react.useState)(false);
			const [confirming, setConfirming] = (0, react.useState)(false);
			const btnRef = (0, react.useRef)(null);
			const menuRef = (0, react.useRef)(null);
			const phase = (0, react.useSyncExternalStore)(onRestartChange, getRestartPhase);
			const busy = phase !== "idle" && phase !== "error";
			const glyphSize = props.wide ? row.glyphWide : row.glyphRail;
			(0, react.useEffect)(() => {
				if (!open) return;
				if (openViaKeyboard) (menuRef.current?.querySelector("[role=\"menuitem\"]"))?.focus();
				const onDown = (e) => {
					const t = e.target;
					if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
					setOpen(false);
					btnRef.current?.focus();
				};
				const onKey = (e) => {
					if (e.key === "Escape") {
						setOpen(false);
						btnRef.current?.focus();
						return;
					}
					if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
					e.preventDefault();
					const items = [...menuRef.current?.querySelectorAll("[role=\"menuitem\"]") ?? []];
					const idx = items.indexOf(document.activeElement);
					const delta = e.key === "ArrowDown" ? 1 : -1;
					if (items.length === 0) return;
					items[(idx + delta + items.length) % items.length]?.focus();
				};
				document.addEventListener("mousedown", onDown);
				document.addEventListener("keydown", onKey);
				return () => {
					document.removeEventListener("mousedown", onDown);
					document.removeEventListener("keydown", onKey);
				};
			}, [open, openViaKeyboard]);
			const pick = (action) => {
				setOpen(false);
				if (action === "shutdown") {
					setConfirming(true);
					return;
				}
				beginPower("restart");
			};
			const anchor = () => {
				const r = btnRef.current?.getBoundingClientRect();
				if (!r) return { display: "none" };
				const m = menuRef.current?.getBoundingClientRect();
				const menuW = Math.min(MENU_W, Math.max(0, window.innerWidth - 16));
				const menuH = m?.height ?? 84;
				return {
					position: "fixed",
					left: Math.max(8, r.right - menuW),
					top: Math.max(8, r.top - MENU_GAP - menuH),
					width: menuW
				};
			};
			const menuVars = { ["--dsw-elevation-stroke-color"]: "var(--dsw-alias-border-l1, rgba(0, 0, 0, 0.04))" };
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
					label: busy ? t("powerBusy") : t("powerTitle"),
					delayMs: 500,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						ref: btnRef,
						type: "button",
						className: "dsh-power-button",
						onClick: () => {
							if (!busy) {
								setOpenViaKeyboard(false);
								setOpen((o) => !o);
							}
						},
						onKeyDown: (e) => {
							if (busy) return;
							if (e.key === "ArrowDown" || e.key === "ArrowUp") {
								e.preventDefault();
								setOpenViaKeyboard(true);
								setOpen(true);
							}
						},
						"aria-haspopup": "menu",
						"aria-expanded": open,
						"aria-label": busy ? t("powerBusy") : t("powerTitle"),
						disabled: busy,
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: props.wide ? void 0 : "center",
							gap: props.wide ? row.gap : 0,
							width: props.wide ? "100%" : row.railSize,
							minWidth: 0,
							height: props.wide ? row.height : row.railSize,
							margin: props.wide ? "0 0 4px" : "8px 0 10px",
							boxSizing: "border-box",
							padding: props.wide ? `0 ${row.inlinePadding}` : 0,
							border: "none",
							borderInline: props.wide ? `${row.paintInset} solid transparent` : void 0,
							borderRadius: row.radius,
							color: "var(--dsw-alias-label-primary)",
							font: "inherit",
							fontSize: 14,
							lineHeight: "22px",
							flex: "none",
							cursor: busy ? "default" : "pointer",
							opacity: busy ? .4 : 1,
							textAlign: "left",
							overflow: "hidden",
							userSelect: "none"
						},
						children: [busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
							width: glyphSize,
							height: glyphSize,
							viewBox: "0 0 24 24",
							fill: "none",
							"aria-hidden": "true",
							style: {
								flex: "0 0 auto",
								animation: "dsh-power-btn-spin 0.9s linear infinite"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
								cx: "12",
								cy: "12",
								r: "8",
								stroke: "currentColor",
								strokeWidth: "2.6",
								strokeLinecap: "round",
								strokeDasharray: "34 16"
							})
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
							width: glyphSize,
							height: glyphSize,
							viewBox: "0 0 24 24",
							fill: "none",
							"aria-hidden": "true",
							style: { flex: "0 0 auto" },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M12 3v8",
								stroke: "currentColor",
								strokeWidth: "2.4",
								strokeLinecap: "round"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M7.5 5.6a8 8 0 1 0 9 0",
								stroke: "currentColor",
								strokeWidth: "2.4",
								strokeLinecap: "round"
							})]
						}), props.wide && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dsh-power-label",
							children: t("power")
						})]
					})
				}),
				open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: menuRef,
					role: "menu",
					"aria-label": t("power"),
					className: "dsh-power-menu",
					"data-menu-material": "",
					style: {
						...anchor(),
						...menuVars,
						zIndex: 1500,
						boxSizing: "border-box",
						padding: menu.padding,
						borderRadius: menu.radius,
						background: menu.background,
						backdropFilter: menu.backdrop,
						WebkitBackdropFilter: menu.backdrop,
						border: 0,
						boxShadow: menu.shadow,
						fontFamily: "inherit",
						fontSize: menu.fontSize,
						lineHeight: menu.lineHeight,
						color: "var(--dsw-alias-label-primary)",
						animation: `dsh-power-menu-in ${motion.menu} ${motion.ease}`
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MenuItem, {
							label: t("refresh"),
							onClick: () => {
								setOpen(false);
								window.location.reload();
							},
							glyph: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
								width: menu.iconSize,
								height: menu.iconSize,
								viewBox: "0 0 24 24",
								fill: "none",
								"aria-hidden": "true",
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M21 3v5h-5",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
										d: "M8 16H3v5",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MenuItem, {
							label: t("restart"),
							onClick: () => pick("restart"),
							glyph: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
								width: menu.iconSize,
								height: menu.iconSize,
								viewBox: "0 0 24 24",
								fill: "none",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 12a8 8 0 1 1-2.34-5.66",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M20 3v4h-4",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})]
							})
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MenuItem, {
							label: t("shutdown"),
							hint: t("shutdownStops"),
							danger: true,
							onClick: () => pick("shutdown"),
							glyph: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
								width: menu.iconSize,
								height: menu.iconSize,
								viewBox: "0 0 24 24",
								fill: "none",
								"aria-hidden": "true",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M12 3v8",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M7.5 5.6a8 8 0 1 0 9 0",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round"
								})]
							})
						})
					]
				}) : null,
				confirming ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShutdownConfirm, {
					title: t("shutdownConfirmTitle"),
					body: t("shutdownConfirmBody"),
					confirmLabel: t("confirmShutdown"),
					cancelLabel: t("cancel"),
					onConfirm: () => {
						setConfirming(false);
						beginPower("shutdown");
					},
					onCancel: () => setConfirming(false)
				}) : null
			] });
		}
		/** One native-menu item: 14px glyph, ellipsised label, optional right-aligned
		*  caption (the native shortcut slot), and the native danger palette. */
		function MenuItem({ label, hint, danger, onClick, glyph }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "menuitem",
				className: "dsh-power-menu-item",
				"data-danger": danger === true ? "true" : void 0,
				onClick,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-power-menu-icon",
						"aria-hidden": "true",
						children: glyph
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-power-menu-label",
						children: label
					}),
					hint !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: "dsh-power-menu-hint",
						children: hint
					})
				]
			});
		}
		/**
		* Plugin-owned CSS: trigger + menu states and keyframes, injected once per
		* document by the plugin entry (`apply()`). State rules live here rather than
		* in inline handlers so hover/focus/expanded behave exactly like native rows
		* under the same media/theme conditions.
		*/
		const powerCss = `
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
`;
		//#endregion
		//#region src/client/settings.ts
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
		const PLUGIN_ID = "dsh-power-xc";
		/**
		* Settings snapshots are descriptors (`{ value, status, base, revision, … }`);
		* older hosts hand the plain value. Unwrap to the value object.
		*/
		function unwrapSettingsSnapshot(raw) {
			if (raw !== null && typeof raw === "object") {
				const record = raw;
				if ("value" in record && ("status" in record || "base" in record || "revision" in record)) return record.value;
			}
			return raw;
		}
		/** Read a scope's current values as a plain record (empty when unreadable). */
		function readSettings(scope) {
			try {
				const value = unwrapSettingsSnapshot(scope?.getSnapshot?.());
				if (value !== null && typeof value === "object") return value;
			} catch {}
			return {};
		}
		/**
		* Pick this plugin's namespace from the served-namespace directory. Entry ids
		* are the package name in practice; the fallbacks cover prefixed ids that some
		* bundles get when a profile mounts the same package twice.
		*/
		function resolveSettingsNamespace(forms) {
			try {
				const served = ((forms?.describe?.()?.getSnapshot?.())?.view?.namespaces ?? []).map((entry) => entry.ns).filter((ns) => typeof ns === "string");
				if (served.includes("dsh-power-xc")) return PLUGIN_ID;
				const match = served.find((ns) => ns.startsWith(`dsh-power-xc#`) || ns.endsWith(`/dsh-power-xc`));
				if (match !== void 0) return match;
			} catch {}
			return PLUGIN_ID;
		}
		/** Open this plugin's settings scope, or `undefined` when the service is absent. */
		function openSettingsScope(ctx) {
			try {
				const forms = ctx?.get?.("configForms");
				if (forms === void 0 || forms === null) return void 0;
				const scope = forms.get?.(resolveSettingsNamespace(forms));
				if (scope === void 0 || scope === null || typeof scope.getSnapshot !== "function") return void 0;
				return scope;
			} catch {
				return;
			}
		}
		//#endregion
		//#region src/client/compactPanels.tsx
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
		/** Root attribute that turns the CSS override on. */
		const ATTR = "data-dsh-power-compact-panels";
		/** Hover delay before the label bubble appears (same as the native rows). */
		const TIP_DELAY_MS = 500;
		/** Anchor-to-bubble gap (the native Tooltip default). */
		const TIP_GAP = 8;
		/** Rough bubble width used to decide whether it must flip to the left side. */
		const TIP_ESTIMATED_WIDTH = 200;
		const ROW_SELECTOR = "button[class*=\"_panelRow\"]";
		const LIST_SELECTOR = "nav[class*=\"_panelList\"]";
		const TITLE_SELECTOR = "[class*=\"_panelTitle\"]";
		let enabled = false;
		const listeners$1 = /* @__PURE__ */ new Set();
		/** Whether the compact strip is currently active. */
		function isCompactPanelsEnabled() {
			return enabled;
		}
		/** Subscribe to switch changes; returns an unsubscribe. */
		function onCompactPanelsChange(listener) {
			listeners$1.add(listener);
			return () => {
				listeners$1.delete(listener);
			};
		}
		function setEnabled(next) {
			if (next === enabled) return;
			enabled = next;
			if (typeof document !== "undefined") {
				if (next) document.documentElement.setAttribute(ATTR, "");
				else document.documentElement.removeAttribute(ATTR);
			}
			for (const listener of listeners$1) try {
				listener();
			} catch {}
		}
		/**
		* Start following the `compactPanelRows` config. Returns a disposer that
		* unsubscribes and restores the default (off) layout.
		*/
		function installCompactPanels(ctx) {
			let disposeScope;
			let settingsAuthoritative = false;
			let disposed = false;
			const timers = [];
			/** Attach to the settings scope. Returns false while the service is absent. */
			const attach = () => {
				const scope = openSettingsScope(ctx);
				if (scope === void 0) return false;
				const read = () => {
					const values = readSettings(scope);
					if (Object.keys(values).length === 0) return;
					settingsAuthoritative = true;
					setEnabled(values.compactPanelRows === true);
				};
				read();
				const off = scope.subscribe?.(read);
				disposeScope = () => {
					try {
						off?.();
					} catch {}
				};
				return true;
			};
			if (!attach() && typeof window !== "undefined") for (const delay of [800, 2400]) timers.push(window.setTimeout(() => {
				if (!disposed && !settingsAuthoritative) attach();
			}, delay));
			fetch("/api/dsh-power-xc/health", { cache: "no-store" }).then(async (response) => response.ok ? await response.json() : null).then((body) => {
				if (settingsAuthoritative || body === null) return;
				if (typeof body.compactPanelRows === "boolean") setEnabled(body.compactPanelRows);
			}).catch(() => {});
			return () => {
				disposed = true;
				for (const timer of timers) window.clearTimeout(timer);
				disposeScope?.();
				setEnabled(false);
			};
		}
		/** Resolve the compact panel row under an event target, if any. */
		function rowOf(target) {
			if (target === null || typeof target.closest !== "function") return null;
			const row = target.closest(ROW_SELECTOR);
			if (row === null) return null;
			if (row.closest(LIST_SELECTOR) === null) return null;
			if (row.querySelector(TITLE_SELECTOR) === null) return null;
			return row;
		}
		/**
		* Hover layer for the compact strip: shows the row's label in a DSH-styled
		* bubble after the native 500ms delay (immediately on keyboard focus).
		*/
		function PanelRowTooltip() {
			const active = (0, react.useSyncExternalStore)(onCompactPanelsChange, isCompactPanelsEnabled);
			const [tip, setTip] = (0, react.useState)(null);
			(0, react.useEffect)(() => {
				if (!active) {
					setTip(null);
					return;
				}
				let timer = 0;
				let current = null;
				const hide = () => {
					current = null;
					if (timer !== 0) {
						window.clearTimeout(timer);
						timer = 0;
					}
					setTip((previous) => previous === null ? previous : null);
				};
				const show = (row) => {
					const label = (row.getAttribute("aria-label") ?? row.querySelector(TITLE_SELECTOR)?.textContent ?? "").trim();
					if (label === "") return;
					const rect = row.getBoundingClientRect();
					const flip = rect.right + TIP_GAP + TIP_ESTIMATED_WIDTH > window.innerWidth;
					setTip({
						label,
						left: flip ? rect.left - TIP_GAP : rect.right + TIP_GAP,
						top: rect.top + rect.height / 2,
						flip
					});
				};
				const enter = (row) => {
					if (current === row) return;
					if (timer !== 0) window.clearTimeout(timer);
					current = row;
					timer = window.setTimeout(() => {
						timer = 0;
						if (current === row) show(row);
					}, TIP_DELAY_MS);
				};
				const onOver = (event) => {
					const row = rowOf(event.target);
					if (row !== null) enter(row);
				};
				const onOut = (event) => {
					const row = rowOf(event.target);
					if (row === null || current !== row) return;
					const next = event.relatedTarget;
					if (next instanceof Node && row.contains(next)) return;
					hide();
				};
				const onFocusIn = (event) => {
					const row = rowOf(event.target);
					if (row === null) return;
					hide();
					current = row;
					show(row);
				};
				const onFocusOut = () => hide();
				const onKeyDown = (event) => {
					if (event.key === "Escape") hide();
				};
				document.addEventListener("pointerover", onOver, true);
				document.addEventListener("pointerout", onOut, true);
				document.addEventListener("focusin", onFocusIn, true);
				document.addEventListener("focusout", onFocusOut, true);
				document.addEventListener("click", hide, true);
				document.addEventListener("keydown", onKeyDown, true);
				window.addEventListener("scroll", hide, true);
				window.addEventListener("resize", hide);
				return () => {
					if (timer !== 0) window.clearTimeout(timer);
					document.removeEventListener("pointerover", onOver, true);
					document.removeEventListener("pointerout", onOut, true);
					document.removeEventListener("focusin", onFocusIn, true);
					document.removeEventListener("focusout", onFocusOut, true);
					document.removeEventListener("click", hide, true);
					document.removeEventListener("keydown", onKeyDown, true);
					window.removeEventListener("scroll", hide, true);
					window.removeEventListener("resize", hide);
				};
			}, [active]);
			if (!active || tip === null) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dsh-power-tip",
				role: "tooltip",
				style: {
					left: tip.left,
					top: tip.top,
					transform: tip.flip ? "translate(-100%, -50%)" : "translateY(-50%)"
				},
				children: tip.label
			});
		}
		/**
		* Plugin-owned CSS for the compact strip + its label bubble. The layout is
		* scoped to rows that still render a `panelTitle` span, which the native
		* sidebar only does in wide mode — the 56px rail keeps its own geometry.
		*/
		const compactPanelsCss = `
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
`;
		//#endregion
		//#region src/client/locales.ts
		/**
		* Locale dictionaries for dsh-power-xc (zh / en).
		* Registered under the `power.button` namespace; components receive `t`
		* through the slot's declared `locale:` and follow the DSH UI language.
		*/
		const zh = {
			power: "电源",
			powerTitle: "电源（重启 / 关机）",
			powerBusy: "正在重启 / 关机中…",
			restart: "重启",
			restartHint: "重新启动 DeepSeek Harness",
			shutdown: "关机",
			shutdownHint: "停止 DeepSeek Harness，之后需手动启动",
			shutdownStops: "停止 Harness",
			refresh: "刷新",
			refreshHint: "刷新当前页面",
			shutdownConfirmTitle: "关闭 DeepSeek Harness？",
			shutdownConfirmBody: "关机后 DeepSeek Harness 将停止运行，需要你手动重新启动。",
			confirmShutdown: "关机",
			cancel: "取消",
			restartDialog: "重启 DeepSeek Harness",
			restartClosing: "正在关闭 DeepSeek Harness…",
			restarting: "正在重启…",
			restartPreparing: "正在准备重启…",
			recovering: "正在恢复…",
			restartProblem: "重启出现问题",
			restartSaving: "正在结束进程，即将断开连接",
			restartWaiting: "等待旧进程退出，新实例即将启动",
			restartReady: "新实例已就绪，正在刷新页面",
			shutdownDialog: "关机 DeepSeek Harness",
			shutdownClosing: "正在关机 DeepSeek Harness…",
			shutdownWaiting: "正在关机…",
			shutdownProblem: "关机出现问题",
			shutdownSaving: "正在结束进程，即将断开连接",
			shutdownWaitingSub: "等待进程退出",
			off: "已关机",
			offHint: "可以关闭此页面了；需要时请手动重新启动 DSH",
			opFailed: "操作失败",
			opFailedHttp: "操作失败 (HTTP {0})",
			restartNoEffect: "重启未生效，请重试",
			restartTimeout: "重启超时，请手动刷新",
			shutdownNoEffect: "未检测到 DSH 进程关闭，请手动确认",
			retry: "重试",
			close: "关闭",
			restartedToast: "已重启",
			restartedToastSub: "DeepSeek Harness 已重启完成",
			settingsTitle: "电源",
			settingsDesc: "侧边栏电源按钮与菜单的界面选项。",
			settingsCompactLabel: "紧凑全局面板行",
			settingsCompactHint: "侧边栏的「插件 / 自动化任务 / 更多」收成一行图标，文字改为 hover 提示；收起态不受影响，改完即时生效。",
			settingsModelToolLabel: "模型重启工具",
			settingsModelToolHint: "允许模型调用 restart_harness 主动重启；关闭后重启只保留 GUI 按钮与 /restart。改动需重启 DSH 生效。"
		};
		const en = {
			power: "Power",
			powerTitle: "Power (restart / shutdown)",
			powerBusy: "Restarting / shutting down…",
			restart: "Restart",
			restartHint: "Restart DeepSeek Harness",
			shutdown: "Shutdown",
			shutdownHint: "Stop DeepSeek Harness; start it manually when needed",
			shutdownStops: "Stops Harness",
			refresh: "Refresh",
			refreshHint: "Refresh the current page",
			shutdownConfirmTitle: "Shut down DeepSeek Harness?",
			shutdownConfirmBody: "After shutdown the process stops and you must start it manually.",
			confirmShutdown: "Shut down",
			cancel: "Cancel",
			restartDialog: "Restart DeepSeek Harness",
			restartClosing: "Shutting down DeepSeek Harness…",
			restarting: "Restarting…",
			restartPreparing: "Preparing to restart…",
			recovering: "Recovering…",
			restartProblem: "Restart problem",
			restartSaving: "Ending processes, connection will drop",
			restartWaiting: "Waiting for the old process to exit; a new instance is starting",
			restartReady: "New instance ready, refreshing page",
			shutdownDialog: "Shut down DeepSeek Harness",
			shutdownClosing: "Shutting down DeepSeek Harness…",
			shutdownWaiting: "Shutting down…",
			shutdownProblem: "Shutdown problem",
			shutdownSaving: "Ending processes, connection will drop",
			shutdownWaitingSub: "Waiting for the process to exit",
			off: "Shut down",
			offHint: "You can close this page now; start DSH manually when needed",
			opFailed: "Operation failed",
			opFailedHttp: "Operation failed (HTTP {0})",
			restartNoEffect: "Restart did not take effect, please retry",
			restartTimeout: "Restart timed out, please refresh manually",
			shutdownNoEffect: "Could not confirm DSH shut down; please check manually",
			retry: "Retry",
			close: "Close",
			restartedToast: "Restarted",
			restartedToastSub: "DeepSeek Harness restarted successfully",
			settingsTitle: "Power",
			settingsDesc: "Interface options for the sidebar power button and its menu.",
			settingsCompactLabel: "Compact panel row",
			settingsCompactHint: "Collapse the sidebar's plugin / schedules / more rows into a single row of icons with hover labels; the collapsed rail is untouched. Applies immediately.",
			settingsModelToolLabel: "Model restart tool",
			settingsModelToolHint: "Let the model call restart_harness to restart DSH; off keeps restart on the GUI button and /restart only. Takes effect after a DSH restart."
		};
		//#endregion
		//#region src/client/PowerSettingsCard.tsx
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
		/** Client context captured at apply time so the card can open its scope lazily. */
		let boundCtx;
		/** Remember the client context for the card (called once from apply()). */
		function bindSettingsContext(ctx) {
			boundCtx = ctx;
		}
		/** Persist one field, rolling the optimistic value back when the write fails. */
		function writeField(scope, key, value, rollback) {
			try {
				const result = scope.set?.(key, value);
				if (result !== void 0 && result !== null && typeof result.then === "function") result.then((accepted) => {
					if (accepted === false) rollback();
				}, () => rollback());
			} catch {
				rollback();
			}
		}
		function PowerSettingsCard(props) {
			const t = (key) => {
				try {
					const value = props?.t?.(key);
					if (typeof value === "string" && value !== "") return value;
				} catch {}
				return zh[key];
			};
			const scope = openSettingsScope(boundCtx);
			const [values, setValues] = (0, react.useState)(() => readSettings(scope));
			const [attempt, setAttempt] = (0, react.useState)(0);
			const dirty = (0, react.useRef)(false);
			(0, react.useEffect)(() => {
				if (scope !== void 0) return;
				const timer = window.setTimeout(() => setAttempt((value) => value + 1), 600);
				return () => window.clearTimeout(timer);
			}, [scope, attempt]);
			(0, react.useEffect)(() => {
				if (scope === void 0) return;
				const sync = () => {
					if (dirty.current) return;
					setValues(readSettings(scope));
				};
				sync();
				const off = scope.subscribe?.(sync);
				return () => {
					try {
						off?.();
					} catch {}
				};
			}, [scope]);
			if (scope === void 0) return null;
			const rows = [{
				key: "compactPanelRows",
				label: t("settingsCompactLabel"),
				hint: t("settingsCompactHint")
			}, {
				key: "enableModelTool",
				label: t("settingsModelToolLabel"),
				hint: t("settingsModelToolHint")
			}];
			const toggle = (key, on) => {
				dirty.current = true;
				setValues((previous) => ({
					...previous,
					[key]: on
				}));
				writeField(scope, key, on, () => setValues(readSettings(scope)));
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dsh-power-cfg",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
						className: "dsh-power-cfg-title",
						children: t("settingsTitle")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: "dsh-power-cfg-desc",
						children: t("settingsDesc")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: "dsh-power-cfg-body",
						children: rows.map((row) => {
							const on = values[row.key] === true;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: "dsh-power-cfg-row",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dsh-power-cfg-text",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-power-cfg-label",
										children: row.label
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: "dsh-power-cfg-hint",
										children: row.hint
									})]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: "dsh-power-switch",
									"data-on": on ? "true" : "false",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: on,
										"aria-label": row.label,
										onChange: (event) => toggle(row.key, event.target.checked)
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: "dsh-power-switch-thumb" })]
								})]
							}, row.key);
						})
					})
				]
			});
		}
		/**
		* Plugin-owned CSS for the settings card: the Plugins page's own field rhythm
		* (12px rows, hairline separators, label + hint stack) and a DSH-tokened
		* switch, so the card reads like the shipped plugin pages.
		*/
		const powerSettingsCss = `
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
`;
		//#endregion
		//#region src/client/RestartNotice.tsx
		/** How long the toast stays visible before fading out. */
		const TOAST_MS = 4500;
		/** Health endpoint the toast consults once at mount. */
		const HEALTH = "/api/dsh-power-xc/health";
		/** ACK endpoint that clears the in-memory restart confirmation. */
		const ACK = "/api/dsh-power-xc/notice-shown";
		/** Static styles. All colors reference the ui-theme design tokens on `body`,
		* so light/dark and any future palette changes are picked up automatically.
		* React.CSSProperties accepts `var(--x)` strings for color-ish properties. */
		const WRAP = {
			position: "fixed",
			bottom: 32,
			left: "50%",
			transform: "translateX(-50%)",
			zIndex: 1800,
			display: "flex",
			alignItems: "center",
			gap: 12,
			maxWidth: "min(360px, calc(100vw - 32px))",
			padding: "10px 14px 10px 12px",
			borderRadius: radius.surface,
			background: "var(--dsw-alias-toast-bg, #1c2433)",
			border: "1px solid var(--dsw-alias-border-l3, rgba(0,0,0,0.12))",
			boxShadow: shadow.surface,
			color: "var(--dsw-alias-label-primary, #eef2f9)",
			fontFamily: "var(--dsw-font-family, ui-sans-serif, system-ui, sans-serif)",
			fontSize: 13,
			userSelect: "none",
			animation: `dsh-restart-toast-in ${motion.success} ${motion.ease} forwards`
		};
		const BADGE = {
			width: 26,
			height: 26,
			borderRadius: "50%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			flexShrink: 0,
			background: "var(--dsw-alias-state-business-tertiary, rgba(65, 118, 230, 0.16))",
			border: "1px solid var(--dsw-alias-state-business-primary, rgba(65, 118, 230, 0.4))"
		};
		const BODY = {
			display: "flex",
			flexDirection: "column",
			gap: 2
		};
		const CAPTION$1 = {
			fontWeight: 600,
			fontSize: 14,
			letterSpacing: .2,
			lineHeight: 1.3
		};
		const SUB$1 = {
			color: "var(--dsw-alias-label-secondary, rgba(238,242,249,0.6))",
			fontSize: 12,
			lineHeight: 1.4
		};
		const CLOSE = {
			alignSelf: "flex-start",
			border: "none",
			background: "transparent",
			color: "var(--dsw-alias-label-caption, rgba(238,242,249,0.45))",
			fontSize: 14,
			lineHeight: 1,
			padding: "2px 4px",
			cursor: "pointer",
			borderRadius: 6,
			transition: "color 0.15s ease, background 0.15s ease"
		};
		/** Fade the toast out in place (no movement), then unmount. */
		const OUT = { animation: "dsh-restart-toast-out 0.25s ease forwards" };
		/** A self-contained toast: queries /health once, renders while visible,
		* ACKs when dismissed. No module-level state — the component owns its whole
		* lifecycle, so hot reload and re-mounts behave predictably. */
		function RestartNotice(props) {
			const { t } = props;
			const [visible, setVisible] = (0, react.useState)(false);
			const [leaving, setLeaving] = (0, react.useState)(false);
			const acked = (0, react.useRef)(false);
			const timerRef = (0, react.useRef)(void 0);
			const ack = () => {
				if (acked.current) return;
				acked.current = true;
				fetch(ACK, {
					method: "POST",
					keepalive: true
				}).catch(() => {});
			};
			const dismiss = () => {
				if (timerRef.current !== void 0) clearTimeout(timerRef.current);
				ack();
				setLeaving(true);
				setTimeout(() => setVisible(false), 280);
			};
			(0, react.useEffect)(() => {
				let cancelled = false;
				(async () => {
					let restarted = false;
					try {
						const r = await fetch(HEALTH, { cache: "no-store" });
						if (r.ok) restarted = (await r.json().catch(() => ({}))).restarted === true;
					} catch {}
					if (cancelled || !restarted) return;
					setVisible(true);
					timerRef.current = setTimeout(dismiss, TOAST_MS);
				})();
				return () => {
					cancelled = true;
					if (timerRef.current !== void 0) clearTimeout(timerRef.current);
					ack();
				};
			}, []);
			if (!visible) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				role: "status",
				"aria-live": "polite",
				style: leaving ? {
					...WRAP,
					...OUT
				} : WRAP,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: `
        @keyframes dsh-restart-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes dsh-restart-toast-out {
          /* translateX(-50%) must persist: the wrapper's static style has no
             transform, so centering lives entirely in these keyframes — dropping
             it here would make the toast jump right by half its width. */
          from { opacity: 1; transform: translateX(-50%); }
          to   { opacity: 0; transform: translateX(-50%); }
        }
        @keyframes dsh-restart-check {
          from { stroke-dashoffset: 24; }
          to   { stroke-dashoffset: 0; }
        }
      ` }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: BADGE,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
							width: "15",
							height: "15",
							viewBox: "0 0 16 16",
							fill: "none",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
								d: "M3.5 8.5 L6.5 11.5 L12.5 4.5",
								stroke: "var(--dsw-alias-state-business-primary, #4176e6)",
								strokeWidth: "2.2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeDasharray: "24",
								strokeDashoffset: "24",
								style: { animation: "dsh-restart-check 0.4s ease 0.15s forwards" }
							})
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						style: BODY,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: CAPTION$1,
							children: t("restartedToast")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: SUB$1,
							children: t("restartedToastSub")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": t("close"),
						style: CLOSE,
						onClick: dismiss,
						onMouseEnter: (e) => {
							e.currentTarget.style.color = "var(--dsw-alias-label-primary, #eef2f9)";
							e.currentTarget.style.background = "var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,0.08))";
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.color = "var(--dsw-alias-label-caption, rgba(238,242,249,0.45))";
							e.currentTarget.style.background = "transparent";
						},
						children: "✕"
					})
				]
			});
		}
		//#endregion
		//#region src/client/RestartOverlay.tsx
		const RING_R = 52;
		const RING_C = 2 * Math.PI * RING_R;
		/** Ring canvas size (120-128 px — lighter than the old 148). */
		const RING_SIZE = 128;
		const RING_CENTER = RING_SIZE / 2;
		const VEIL = {
			position: "fixed",
			inset: 0,
			zIndex: 2e3,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: 28,
			background: veil.background,
			backdropFilter: veil.backdropFilter,
			WebkitBackdropFilter: veil.backdropFilter,
			color: "var(--dsw-alias-label-primary, #eef2f9)",
			fontFamily: "var(--dsw-font-family, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", \"Microsoft YaHei\", sans-serif)",
			userSelect: "none"
		};
		const RING_WRAP = {
			position: "relative",
			width: RING_SIZE,
			height: RING_SIZE
		};
		/** Every ring layer (track, progress, sweep) pins to the RING_SIZE box. */
		const RING_LAYER = {
			position: "absolute",
			top: 0,
			left: 0
		};
		const POWER_BTN = {
			position: "absolute",
			inset: 0,
			borderRadius: "50%",
			border: "1px solid var(--dsw-alias-border-inverted, rgba(255,255,255,0.14))",
			background: "var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,0.04))",
			cursor: "default",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			transition: "background 0.2s ease, border-color 0.2s ease"
		};
		const CAPTION = {
			fontSize: 17,
			fontWeight: 500,
			letterSpacing: .3,
			color: "var(--dsw-alias-label-primary, #eef2f9)",
			textAlign: "center",
			minHeight: 26
		};
		const SUB = {
			fontSize: 13,
			color: "var(--dsw-alias-label-secondary, rgba(238,242,249,0.55))",
			textAlign: "center",
			maxWidth: 360,
			lineHeight: 1.6
		};
		const ACTION_ROW = {
			display: "flex",
			gap: 12
		};
		function ActionButton({ label, danger, onClick, disabled }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				onClick,
				disabled,
				style: {
					padding: "9px 26px",
					borderRadius: 8,
					border: danger ? "1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 50%, transparent)" : "1px solid var(--dsw-alias-border-l3, rgba(255,255,255,0.18))",
					background: danger ? "color-mix(in srgb, var(--dsw-alias-state-error-primary) 14%, var(--dsw-alias-bg-overlay, transparent))" : "var(--dsw-alias-button-floating-hover, rgba(255,255,255,0.06))",
					color: danger ? "var(--dsw-alias-state-error-primary, #ff8592)" : "var(--dsw-alias-label-primary, #eef2f9)",
					fontSize: 14,
					fontWeight: 600,
					cursor: disabled ? "default" : "pointer",
					opacity: disabled ? .5 : 1,
					transition: "background 0.2s ease"
				},
				children: label
			});
		}
		function PowerGlyph({ size = 40 }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 24 24",
				fill: "none",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M12 3v8",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M7.5 5.6a8 8 0 1 0 9 0",
					stroke: "currentColor",
					strokeWidth: "2.2",
					strokeLinecap: "round"
				})]
			});
		}
		function RestartOverlay(props) {
			const { t } = props;
			const phase = (0, react.useSyncExternalStore)(onRestartChange, getRestartPhase);
			const action = (0, react.useSyncExternalStore)(onRestartChange, getPowerAction);
			const error = (0, react.useSyncExternalStore)(onRestartChange, getRestartError);
			const dialogRef = (0, react.useRef)(null);
			(0, react.useEffect)(() => {
				if (phase === "idle") return;
				const retry = dialogRef.current?.querySelector("button");
				(phase === "error" && retry ? retry : dialogRef.current)?.focus();
			}, [phase]);
			if (phase === "idle" || phase === "preparing") return null;
			const busy = phase === "shutting" || phase === "waiting" || phase === "recovering";
			const shuttingDown = action === "shutdown";
			const progress = {
				shutting: .22,
				waiting: .58,
				recovering: 1,
				off: 1,
				error: .9
			}[phase] ?? 0;
			const ringDash = RING_C * (1 - progress);
			const ringStyle = {
				transform: "rotate(-90deg)",
				transformOrigin: "center"
			};
			if (busy) ringStyle.animation = "dsh-restart-sweep 1.8s linear infinite";
			const captions = shuttingDown ? {
				shutting: t("shutdownClosing"),
				waiting: t("shutdownWaiting"),
				recovering: t("recovering"),
				off: t("off"),
				error: t("shutdownProblem")
			} : {
				shutting: t("restartClosing"),
				waiting: t("restarting"),
				recovering: t("recovering"),
				error: t("restartProblem")
			};
			const subs = shuttingDown ? {
				shutting: t("shutdownSaving"),
				waiting: t("shutdownWaitingSub"),
				recovering: t("recovering"),
				off: t("offHint"),
				error: error ?? t("opFailed")
			} : {
				shutting: t("restartSaving"),
				waiting: t("restartWaiting"),
				recovering: t("restartReady"),
				error: error ?? t("opFailed")
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				ref: dialogRef,
				tabIndex: -1,
				style: VEIL,
				className: "dsh-restart-overlay-veil",
				role: "dialog",
				"aria-modal": "true",
				"aria-label": shuttingDown ? t("shutdownDialog") : t("restartDialog"),
				"aria-busy": busy,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: `
        @keyframes dsh-restart-sweep {
          0%   { transform: rotate(-90deg); }
          100% { transform: rotate(270deg); }
        }
        @keyframes dsh-restart-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dsh-restart-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dsh-restart-overlay-veil,
          .dsh-restart-overlay-veil * {
            animation: none !important;
            transition: none !important;
          }
        }
      ` }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: RING_WRAP,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
								width: RING_SIZE,
								height: RING_SIZE,
								style: {
									...RING_LAYER,
									transform: "rotate(-90deg)",
									transformOrigin: "center"
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
									cx: RING_CENTER,
									cy: RING_CENTER,
									r: RING_R,
									fill: "none",
									stroke: "var(--dsw-alias-border-l3, rgba(255,255,255,0.08))",
									strokeWidth: "5"
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
									cx: RING_CENTER,
									cy: RING_CENTER,
									r: RING_R,
									fill: "none",
									stroke: phase === "error" ? "var(--dsw-alias-state-error-primary, #ff8592)" : "var(--dsw-alias-state-business-primary, #4f8cff)",
									strokeWidth: "5",
									strokeLinecap: "round",
									strokeDasharray: RING_C,
									strokeDashoffset: ringDash,
									style: { transition: "stroke-dashoffset 1.1s cubic-bezier(0.4, 0, 0.2, 1)" }
								})]
							}),
							busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: RING_SIZE,
								height: RING_SIZE,
								style: {
									...RING_LAYER,
									...ringStyle
								},
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("circle", {
									cx: RING_CENTER,
									cy: RING_CENTER,
									r: RING_R,
									fill: "none",
									stroke: "color-mix(in srgb, var(--dsw-alias-state-business-primary, #4f8cff) 50%, transparent)",
									strokeWidth: "5",
									strokeLinecap: "round",
									strokeDasharray: `${RING_C * .18} ${RING_C * .82}`
								})
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								style: POWER_BTN,
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									style: {
										color: phase === "error" ? "var(--dsw-alias-state-error-primary, #ff8592)" : "var(--dsw-alias-label-primary, #eef2f9)",
										animation: busy ? "dsh-restart-pulse 2s ease-in-out infinite" : void 0
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PowerGlyph, {})
								})
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...CAPTION,
							animation: "dsh-restart-fade 0.35s ease"
						},
						"aria-live": "polite",
						children: captions[phase]
					}, phase),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							...SUB,
							animation: "dsh-restart-fade 0.35s ease 0.08s both"
						},
						children: subs[phase]
					}, `sub-${phase}`),
					phase === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							...ACTION_ROW,
							animation: "dsh-restart-fade 0.35s ease 0.15s both"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ActionButton, {
							label: t("retry"),
							onClick: () => beginPower(action)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ActionButton, {
							label: t("close"),
							onClick: dismissPower
						})]
					}) : null
				]
			});
		}
		//#endregion
		//#region src/client/RestartPreparing.tsx
		/**
		* Corner "preparing to restart" hint — shown in the brief window between
		* clicking Restart and the connection actually dropping. The page stays fully
		* usable (no full-screen veil): the restart POST is still in flight and the
		* old process is only preparing to exit. Once `beginPower` advances the flow
		* to `shutting`, this hint disappears and the full-screen overlay takes over.
		*/
		/** Corner hint visible only during the 'preparing' phase of a restart. */
		function RestartPreparing() {
			const phase = (0, react.useSyncExternalStore)(onRestartChange, getRestartPhase);
			const action = (0, react.useSyncExternalStore)(onRestartChange, getPowerAction);
			if (phase !== "preparing" || action !== "restart") return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				role: "status",
				"aria-live": "polite",
				style: {
					position: "fixed",
					bottom: 32,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 1700,
					display: "flex",
					alignItems: "center",
					gap: 10,
					padding: "10px 16px",
					borderRadius: 12,
					background: "var(--dsw-alias-toast-bg, rgba(24,28,38,0.95))",
					border: "1px solid var(--dsw-alias-border-l3, rgba(196,211,232,0.25))",
					boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
					color: "var(--dsw-alias-label-primary, #eef2f9)",
					fontFamily: "var(--dsw-font-family, ui-sans-serif, system-ui, sans-serif)",
					fontSize: 13,
					userSelect: "none",
					animation: "dsh-restart-toast-in 0.25s cubic-bezier(0.21, 1.02, 0.45, 1)"
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: `
        @keyframes dsh-restart-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes dsh-restart-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      ` }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						style: {
							width: 14,
							height: 14,
							borderRadius: "50%",
							border: "2px solid var(--dsw-alias-state-business-tertiary, rgba(65,118,230,0.3))",
							borderTopColor: "var(--dsw-alias-state-business-primary, #4176e6)",
							animation: "dsh-restart-spin 0.9s linear infinite",
							flexShrink: 0
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: tl("restartPreparing") })
				]
			});
		}
		//#endregion
		//#region src/client/ShutdownConfirmDialog.tsx
		/**
		* /shutdown command → GUI confirm dialog.
		*
		* The host `/shutdown` handler never shuts down directly: it signals
		* `SHUTDOWN_CONFIRM_PENDING` through the command/executed event, and this
		* dialog (rendered in shell.overlay) shows the SAME confirmation UI as the
		* power button. Confirm → beginPower('shutdown') POSTs the real shutdown;
		* cancel just dismisses.
		*/
		/** Dialog rendered in shell.overlay while the /shutdown confirm is pending. */
		function ShutdownConfirmDialog() {
			if (!(0, react.useSyncExternalStore)(onShutdownConfirmChange, isShutdownConfirmVisible)) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ShutdownConfirm, {
				title: tl("shutdownConfirmTitle"),
				body: tl("shutdownConfirmBody"),
				confirmLabel: tl("confirmShutdown"),
				cancelLabel: tl("cancel"),
				onConfirm: () => {
					cancelShutdownConfirm();
					beginPower("shutdown");
				},
				onCancel: cancelShutdownConfirm
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** Required services. */
		const inject = ["slots", "locale"];
		/** Locale namespace for this plugin's UI strings. */
		const NS = "power.button";
		let phase = "idle";
		let action = "restart";
		let errorMsg = null;
		const listeners = /* @__PURE__ */ new Set();
		/** Locale service captured at apply time; used to translate module-scope
		* (non-component) error strings according to the DSH UI language. */
		let localeSvc;
		/** Translate a key in the current UI language (module scope; components use props.t). */
		function tl(key) {
			return (localeSvc?.snapshot.active === "en" ? en : zh)[key];
		}
		function emit() {
			for (const fn of listeners) fn();
		}
		function getRestartPhase() {
			return phase;
		}
		function getPowerAction() {
			return action;
		}
		function getRestartError() {
			return errorMsg;
		}
		/** Surface an error, unless the flow has already moved past the point of no return. */
		function fail(msg) {
			if (phase === "error" || phase === "recovering") return;
			phase = "error";
			errorMsg = msg;
			emit();
		}
		/** Monotonic operation id: each beginPower() bumps it; stale timers from a
		* previous operation check it and stop. Prevents an old health poll from
		* overwriting a newer flow's phase (e.g. error → waiting on retry). */
		let operationId = 0;
		/** Kick a restart or shutdown. Opens the overlay and drives the flow.
		* Restart goes through a brief `preparing` stage first (a small corner hint,
		* no full-screen veil) so the user is not slammed by a modal in the first
		* hundreds of milliseconds — the POST is still in flight and the page is
		* alive; the full-screen overlay only appears once the connection is about to
		* actually drop. */
		function beginPower(next) {
			const myOperation = ++operationId;
			const active = () => myOperation === operationId;
			action = next;
			errorMsg = null;
			const endpoint = next === "shutdown" ? "/api/dsh-power-xc/shutdown" : "/api/dsh-power-xc/restart";
			if (next === "restart") {
				phase = "preparing";
				emit();
				setTimeout(() => {
					if (!active() || phase !== "preparing") return;
					phase = "shutting";
					emit();
				}, 800);
			} else {
				phase = "shutting";
				emit();
			}
			if (next === "shutdown") {
				fetch(endpoint, {
					method: "POST",
					keepalive: true
				}).then(async (r) => {
					const j = await r.json().catch(() => ({}));
					if (!active()) return;
					if (!r.ok || j?.ok === false) fail(j?.error ?? tl("opFailedHttp").replace("{0}", String(r.status)));
				}).catch(() => {});
				const SHUTDOWN_POLL_MS = 500;
				const MAX_ATTEMPTS = 4e4 / SHUTDOWN_POLL_MS;
				let attempts = 0;
				let downStreak = 0;
				const timer = setInterval(async () => {
					if (!active()) {
						clearInterval(timer);
						return;
					}
					attempts += 1;
					if (attempts >= MAX_ATTEMPTS) {
						clearInterval(timer);
						phase = "error";
						errorMsg = tl("shutdownNoEffect");
						emit();
						return;
					}
					let up = false;
					try {
						up = (await fetch("/api/dsh-power-xc/health", { cache: "no-store" })).ok;
					} catch {
						up = false;
					}
					if (!up) {
						downStreak += 1;
						if (downStreak >= 3) {
							clearInterval(timer);
							phase = "off";
							emit();
						}
					} else downStreak = 0;
				}, SHUTDOWN_POLL_MS);
				return;
			}
			setTimeout(() => {
				if (!active()) return;
				if (phase === "shutting") {
					phase = "waiting";
					emit();
				}
			}, 600);
			(async () => {
				let baseline = null;
				try {
					const r = await fetch("/api/dsh-power-xc/health", { cache: "no-store" });
					if (r.ok) {
						const j = await r.json().catch(() => ({}));
						if (typeof j.instanceId === "string") baseline = j.instanceId;
					}
				} catch {}
				if (!active()) return;
				fetch("/api/dsh-power-xc/restart", {
					method: "POST",
					keepalive: true
				}).then(async (r) => {
					const j = await r.json().catch(() => ({}));
					if (!active()) return;
					if (!r.ok || j?.ok === false) fail(j?.error ?? tl("opFailedHttp").replace("{0}", String(r.status)));
				}).catch(() => {});
				let seenDown = false;
				let upTicks = 0;
				let attempts = 0;
				const POLL_MS = 1e3;
				const MAX_ATTEMPTS = 90;
				const poll = async () => {
					if (!active()) return;
					attempts += 1;
					if (attempts > MAX_ATTEMPTS) {
						phase = "error";
						errorMsg = tl("restartTimeout");
						emit();
						return;
					}
					let up = false;
					let instanceChanged = false;
					try {
						const r = await fetch("/api/dsh-power-xc/health", { cache: "no-store" });
						up = r.ok;
						if (r.ok) {
							const j = await r.json().catch(() => ({}));
							instanceChanged = baseline !== null && typeof j.instanceId === "string" && j.instanceId !== baseline;
						}
					} catch {
						up = false;
					}
					if (!active()) return;
					if (!up) {
						seenDown = true;
						upTicks = 0;
						if (phase !== "waiting") {
							phase = "waiting";
							emit();
						}
					} else {
						if (baseline !== null ? instanceChanged : seenDown && up) {
							phase = "recovering";
							emit();
							setTimeout(() => {
								if (active()) window.location.reload();
							}, 1300);
							return;
						}
						upTicks += 1;
						if (upTicks >= 20) {
							phase = "error";
							errorMsg = tl("restartNoEffect");
							emit();
							return;
						}
					}
					setTimeout(poll, POLL_MS);
				};
				poll();
			})();
		}
		/** Dismiss the error overlay without reloading: cancels any in-flight flow
		* and returns to idle. The restart may have killed the old process without
		* a new one up — reloading here would bounce to a dead page, so just close
		* the dialog and let the user act (refresh manually if they wish). */
		function dismissPower() {
			operationId += 1;
			phase = "idle";
			errorMsg = null;
			emit();
		}
		/** Subscribe to power-flow changes; returns an unsubscribe. */
		function onRestartChange(fn) {
			listeners.add(fn);
			return () => {
				listeners.delete(fn);
			};
		}
		const confirmListeners = /* @__PURE__ */ new Set();
		let confirmVisible = false;
		function emitConfirm() {
			for (const fn of confirmListeners) fn();
		}
		/** Show the shutdown confirm dialog (from the /shutdown command path). */
		function requestShutdownConfirm() {
			confirmVisible = true;
			emitConfirm();
		}
		/** Dismiss the dialog without acting. */
		function cancelShutdownConfirm() {
			confirmVisible = false;
			emitConfirm();
		}
		/** Whether the /shutdown confirm dialog is currently shown. */
		function isShutdownConfirmVisible() {
			return confirmVisible;
		}
		/** Subscribe to dialog visibility changes. */
		function onShutdownConfirmChange(fn) {
			confirmListeners.add(fn);
			return () => {
				confirmListeners.delete(fn);
			};
		}
		/** Sentinel the host `/shutdown` handler returns to request the GUI dialog. */
		const SHUTDOWN_CONFIRM_PENDING = "SHUTDOWN_CONFIRM_PENDING";
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "dsh-power-xc: dictionaries");
			localeSvc = ctx.locale;
			document.getElementById("dsh-power-button-style")?.remove();
			const STYLE_ID = "dsh-power-xc-style";
			let styleEl = document.getElementById(STYLE_ID);
			if (styleEl === null) {
				styleEl = document.createElement("style");
				styleEl.id = STYLE_ID;
				document.head.appendChild(styleEl);
			}
			styleEl.textContent = [
				"[class$=\"_footerActions\"]:has(.dsh-power-button) { flex-wrap: wrap; }",
				"[class$=\"_settingsArea\"] { order: 1; }",
				"[class$=\"_footerActions\"] { order: 2; }",
				powerCss,
				compactPanelsCss,
				powerSettingsCss
			].join("\n");
			bindSettingsContext(ctx);
			ctx.slots.inject("plugins.bundle.config", () => ctx.slots.register({
				name: "plugins.bundle.config",
				key: PLUGIN_ID,
				order: 20,
				locale: NS
			}, PowerSettingsCard));
			ctx.effect(() => installCompactPanels(ctx), "dsh-power-xc: compact panel strip");
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "dsh-power-xc",
				order: -20,
				locale: NS,
				label: () => tl("power")
			}, RestartButton));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-restart-overlay",
				locale: NS
			}, RestartOverlay));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-restart-preparing",
				locale: NS
			}, RestartPreparing));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-power-panel-tooltip"
			}, PanelRowTooltip));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-restart-notice",
				locale: NS
			}, RestartNotice));
			ctx.effect(() => ctx.on?.("command/executed", (...args) => {
				if ((typeof args[1] === "string" ? args[1] : "") !== "shutdown") return;
				const result = args[2];
				if ((typeof result?.text === "string" ? result.text : "") === SHUTDOWN_CONFIRM_PENDING) requestShutdownConfirm();
			}) ?? (() => {}), "dsh-power-xc: shutdown command confirm");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-restart-shutdown-confirm",
				locale: NS
			}, ShutdownConfirmDialog));
		}
		//#endregion
		exports.NS = NS;
		exports.apply = apply;
		exports.beginPower = beginPower;
		exports.cancelShutdownConfirm = cancelShutdownConfirm;
		exports.dismissPower = dismissPower;
		exports.getPowerAction = getPowerAction;
		exports.getRestartError = getRestartError;
		exports.getRestartPhase = getRestartPhase;
		exports.inject = inject;
		exports.isShutdownConfirmVisible = isShutdownConfirmVisible;
		exports.onRestartChange = onRestartChange;
		exports.onShutdownConfirmChange = onShutdownConfirmChange;
		exports.requestShutdownConfirm = requestShutdownConfirm;
		exports.tl = tl;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map