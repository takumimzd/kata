/* @ds-bundle: {"format":3,"namespace":"KataDesignSystem_f071df","components":[{"name":"BarList","sourcePath":"components/charts/BarList.jsx"},{"name":"Sparkline","sourcePath":"components/charts/Sparkline.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"ChipGroup","sourcePath":"components/core/Chip.jsx"},{"name":"Fab","sourcePath":"components/core/Fab.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"PageTitle","sourcePath":"components/core/PageTitle.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"SectionTitle","sourcePath":"components/core/SectionTitle.jsx"},{"name":"Text","sourcePath":"components/core/Text.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Stepper","sourcePath":"components/forms/Stepper.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"}],"sourceHashes":{"components/charts/BarList.jsx":"471dabaa69d4","components/charts/Sparkline.jsx":"fe1b59a3b307","components/core/Badge.jsx":"c972cc64d376","components/core/Button.jsx":"76c93130dab3","components/core/Card.jsx":"65c399b1fb44","components/core/Chip.jsx":"3cd62be5e5f0","components/core/Fab.jsx":"0ffa17cd6ee3","components/core/Icon.jsx":"b9929a30ca48","components/core/IconButton.jsx":"7f6c7c6392c7","components/core/PageTitle.jsx":"d92ad5b99290","components/core/ProgressBar.jsx":"714b3dd29a44","components/core/SectionTitle.jsx":"7e24e176e43e","components/core/Text.jsx":"cecf87f18504","components/feedback/Modal.jsx":"f77eb32bce6e","components/feedback/Toast.jsx":"81e9649938d6","components/forms/Field.jsx":"1b25dc0e4623","components/forms/Input.jsx":"ff570fcfceb2","components/forms/Select.jsx":"632927fee2f7","components/forms/Stepper.jsx":"2ecd99f68812","components/forms/Switch.jsx":"b0746ad1b2c5","components/forms/Textarea.jsx":"04af4f066962","ui_kits/tracker/app.jsx":"5ffa61af9897","ui_kits/tracker/data.js":"1c5c09924529","ui_kits/tracker/screens.jsx":"75441307b8bd"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KataDesignSystem_f071df = window.KataDesignSystem_f071df || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/charts/BarList.jsx
try { (() => {
// ============================================================
//  kata — BarList (横棒ランキング)
//  ラベル + 横バー + 値。品目ごとの回数などに。
// ============================================================

/** 横棒のランキングリスト。max を 100% とみなす。 */
function BarList({
  data,
  unit,
  color = 'var(--accent)',
  max,
  className
}) {
  const top = max ?? Math.max(...data.map(d => d.value), 1);
  const cls = ['k-barlist', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls
  }, data.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.label,
    className: "k-barlist-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k-barlist-name"
  }, d.label), /*#__PURE__*/React.createElement("span", {
    className: "k-barlist-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "k-barlist-fill",
    style: {
      width: `${Math.round(d.value / top * 100)}%`,
      background: color
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "k-barlist-count"
  }, d.value, unit && /*#__PURE__*/React.createElement("small", null, unit)))));
}
Object.assign(__ds_scope, { BarList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/BarList.jsx", error: String((e && e.message) || e) }); }

// components/charts/Sparkline.jsx
try { (() => {
// ============================================================
//  kata — Sparkline (ミニ折れ線)
//  data: number[]。カード内のトレンド表示などに。
// ============================================================

function smoothPath(pts) {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** ミニ折れ線。末尾に点を打つ。 */
function Sparkline({
  data,
  color = 'var(--accent)',
  width = 120,
  height = 40
}) {
  if (!data || data.length < 2) return null;
  let min = Math.min(...data);
  let max = Math.max(...data);
  const range = max - min || 1;
  min -= range * 0.15;
  max += range * 0.15;
  const pts = data.map((v, i) => ({
    x: i / (data.length - 1) * width,
    y: height - (v - min) / (max - min) * height
  }));
  const path = smoothPath(pts);
  const last = pts[pts.length - 1];
  return /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: path,
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: last.x,
    cy: last.y,
    r: "3",
    fill: color
  }));
}
Object.assign(__ds_scope, { Sparkline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/charts/Sparkline.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Badge (状態ラベル)
// ============================================================

const VARIANT = {
  neutral: 'k-badge--neutral',
  accent: 'k-badge--accent',
  danger: 'k-badge--danger',
  warn: 'k-badge--warn'
};

/** 状態を示す小さなラベル。 */
function Badge({
  variant = 'neutral',
  className,
  children,
  ...rest
}) {
  const cls = ['k-badge', VARIANT[variant], className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Button
//  variant でスタイルを切り替える。アイコンは children に渡す。
// ============================================================

const VARIANT = {
  primary: 'k-btn--primary',
  secondary: 'k-btn--secondary',
  text: 'k-btn--text',
  danger: 'k-btn--danger',
  mini: 'k-btn--mini'
};

/** 主要アクション用ボタン。variant で見た目を出し分ける。 */
function Button({
  variant = 'primary',
  block = false,
  className,
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['k-btn', VARIANT[variant], block && 'k-btn--block', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Card (サーフェス容器)
//  padding は s / m / l のトークンで切り替える。
// ============================================================

const PADDING = {
  s: 'k-card--s',
  m: 'k-card--m',
  l: 'k-card--l'
};

/** 面 (surface) のコンテナ。罫線 + 微小シャドウ + 角丸。 */
function Card({
  padding = 'm',
  className,
  children,
  ...rest
}) {
  const cls = ['k-card', PADDING[padding], className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Chip / ChipGroup (角丸の小ボタン・タグ)
// ============================================================

/** 角丸ピル型の小ボタン。active で選択状態。 */
function Chip({
  active,
  className,
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['k-chip', active && 'k-chip--active', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    className: cls
  }, rest), children);
}

/** チップを折り返して並べる行。 */
function ChipGroup({
  className,
  children,
  ...rest
}) {
  const cls = ['k-chip-group', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Chip, ChipGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Fab.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Fab (フローティングアクションボタン)
//  既定で画面右下に固定。fixed={false} でインライン配置。
// ============================================================

/** 画面右下に浮かぶ主要アクション。円形・アクセント塗り。 */
function Fab({
  label,
  fixed = true,
  className,
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['k-fab', fixed && 'k-fab--fixed', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    "aria-label": label,
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Fab });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Fab.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
// ============================================================
//  kata — Icon (line icons)
//  24x24 / currentColor / stroke ベースに正規化したラインアイコン。
//  fill ベースの要素 (pin, more, list の点) は個別に fill 指定。
// ============================================================

const PATHS = {
  home: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 11l8-6 8 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 10v9h12v-9"
  })),
  plus: /*#__PURE__*/React.createElement("path", {
    d: "M12 6v12M6 12h12"
  }),
  minus: /*#__PURE__*/React.createElement("path", {
    d: "M6 12h12"
  }),
  check: /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5 9-11"
  }),
  close: /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  }),
  chevron: /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }),
  back: /*#__PURE__*/React.createElement("path", {
    d: "M15 5l-7 7 7 7"
  }),
  search: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.5 16.5L21 21"
  })),
  trash: /*#__PURE__*/React.createElement("path", {
    d: "M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"
  }),
  edit: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 20h4l10-10-4-4L4 16v4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.5 6.5l4 4"
  })),
  copy: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "8",
    width: "12",
    height: "12",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 16V4h12"
  })),
  calendar: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "5",
    width: "16",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 9h16M8 3v4M16 3v4"
  })),
  history: /*#__PURE__*/React.createElement("path", {
    d: "M5 7h14M5 12h14M5 17h9"
  }),
  chart: /*#__PURE__*/React.createElement("path", {
    d: "M5 19V10M12 19V5M19 19v-6"
  }),
  dumbbell: /*#__PURE__*/React.createElement("path", {
    d: "M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"
  }),
  glass: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10l-1.2 8.5a4 4 0 01-7.6 0L7 4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 17v3M9 20h6"
  })),
  flame: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3c1 3-2 4-2 7a3 3 0 006 0c0-1-.3-2-1-3 .3 2-1 3-1 3 .5-3-2-4-2-7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 13a3.5 3.5 0 107 0c0-2-1.5-3.5-3.5-6-2 2.5-3.5 4-3.5 6z"
  })),
  scale: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 6l3 4"
  })),
  question: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.6 9.4a2.4 2.4 0 1 1 3.4 2.2c-.9.5-1.2 1-1.2 1.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16.9h.01"
  })),
  link: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.5 19.5"
  })),
  pen: /*#__PURE__*/React.createElement("path", {
    d: "M14 4l6 6M3 21l3.5-.5L20 7a2 2 0 0 0-3-3L3.5 17.5 3 21z"
  }),
  note: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "4",
    width: "14",
    height: "16",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 9h6M9 13h6M9 17h3"
  })),
  pill: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 8.5l7 7"
  })),
  bottle: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9 3h6v3l1 2.5V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8.5L9 6V3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11h8"
  })),
  sun: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
  })),
  moon: /*#__PURE__*/React.createElement("path", {
    d: "M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z"
  }),
  monitor: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4",
    width: "18",
    height: "13",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 21h8M12 17v4"
  })),
  settings: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  })),
  book: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
  })),
  folder: /*#__PURE__*/React.createElement("path", {
    d: "M3 7a2 2 0 0 1 2-2h4l2 2.5h6a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }),
  pin: /*#__PURE__*/React.createElement("path", {
    d: "M15.2 3.1l5.6 5.6-2.2.6-3.6 3.6.4 4.1-2.3 2.3-3.6-3.6-4.6 4.6-.7-.7 4.6-4.6-3.6-3.6 2.3-2.3 4.1.4 3.6-3.6z",
    fill: "currentColor",
    stroke: "none"
  }),
  more: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "5",
    r: "1.7",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.7",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "19",
    r: "1.7",
    fill: "currentColor",
    stroke: "none"
  })),
  list: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "6",
    r: "1.5",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "12",
    r: "1.5",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "5",
    cy: "18",
    r: "1.5",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 6h9M10 12h9M10 18h9"
  })),
  todo: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "16",
    height: "16",
    rx: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 12.2l2.8 2.8L16 9"
  })),
  indent: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 5h16M10 10h10M10 14h10M4 19h16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 9l3 3-3 3z",
    fill: "currentColor",
    stroke: "none"
  })),
  outdent: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 5h16M10 10h10M10 14h10M4 19h16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 9l-3 3 3 3z",
    fill: "currentColor",
    stroke: "none"
  })),
  undo: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M9 8L5 12l4 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 12h9a5 5 0 0 1 0 10h-3"
  })),
  redo: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M15 8l4 4-4 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 12h-9a5 5 0 0 0 0 10h3"
  }))
};

/** 利用できるアイコン名 */
const ICON_NAMES = Object.keys(PATHS);

/**
 * ラインアイコン。`name` で図柄を選ぶ。色は currentColor に追従。
 */
function Icon({
  name,
  size = 22,
  stroke = 1.8,
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    style: style,
    "aria-hidden": "true"
  }, PATHS[name]);
}
Object.assign(__ds_scope, { ICON_NAMES, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — IconButton
//  正方/円形のアイコンボタン。a11y のため label (aria-label) 必須。
// ============================================================

const SHAPE = {
  square: 'k-iconbtn--square',
  round: 'k-iconbtn--round'
};
const SIZE = {
  sm: 'k-iconbtn--sm',
  md: 'k-iconbtn--md',
  lg: 'k-iconbtn--lg'
};
const VARIANT = {
  default: '',
  accent: 'k-iconbtn--accent',
  danger: 'k-iconbtn--danger'
};

/** アイコンのみのボタン。label (aria-label) を必須にしている。 */
function IconButton({
  label,
  shape = 'square',
  size = 'md',
  variant = 'default',
  className,
  type = 'button',
  children,
  ...rest
}) {
  const cls = ['k-iconbtn', SHAPE[shape], SIZE[size], VARIANT[variant], className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    "aria-label": label,
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/PageTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — PageTitle (ページ見出し h1)
// ============================================================

/** ページの主見出し。既定で h1。 */
function PageTitle({
  as: Tag = 'h1',
  className,
  children,
  ...rest
}) {
  const cls = ['k-page-title', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { PageTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/PageTitle.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
// ============================================================
//  kata — ProgressBar (進捗バー)
//  トラック + フィル。value/max から割合を出す。
// ============================================================

const TONE = {
  accent: 'k-progress-fill--accent',
  progress: 'k-progress-fill--progress',
  over: 'k-progress-fill--over'
};

/** 進捗バー。value/max で割合、tone で配色。 */
function ProgressBar({
  value,
  max = 1,
  tone = 'accent',
  height = 6,
  className
}) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const cls = ['k-progress-track', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: {
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: ['k-progress-fill', TONE[tone]].join(' '),
    style: {
      width: `${ratio * 100}%`
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionTitle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — SectionTitle (ラベル + ヘアライン罫)
// ============================================================

/** セクション見出し。ラベル + 横罫 + 任意の meta / action。 */
function SectionTitle({
  children,
  meta,
  action,
  className,
  ...rest
}) {
  const cls = ['k-section-title', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("h3", null, children), /*#__PURE__*/React.createElement("span", {
    className: "k-rule"
  }), meta && /*#__PURE__*/React.createElement("span", {
    className: "k-meta"
  }, meta), action);
}
Object.assign(__ds_scope, { SectionTitle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionTitle.jsx", error: String((e && e.message) || e) }); }

// components/core/Text.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Text (本文系テキスト)
//  ページ見出しは PageTitle、セクション見出しは SectionTitle を使う。
// ============================================================

const VARIANT = {
  body: 'k-text-body',
  bodyStrong: 'k-text-bodyStrong',
  sub: 'k-text-sub',
  caption: 'k-text-caption',
  label: 'k-text-label',
  num: 'k-text-num'
};

/** 本文系テキスト。variant で種類を出し分ける。as で要素を変更。 */
function Text({
  variant = 'body',
  as: Tag = 'span',
  className,
  children,
  ...rest
}) {
  const cls = [VARIANT[variant], className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Text });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Text.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
const {
  useEffect
} = React;
// ============================================================
//  kata — Modal (ボトムシート)
//  モバイルは下部シート、880px 以上では中央ダイアログ。
//  Escape / 背景クリックで閉じる。
// ============================================================

/** タイトル付きのボトムシート/ダイアログ。 */
function Modal({
  title,
  onClose,
  children
}) {
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "k-modal-overlay",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-modal-sheet",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k-modal-head"
  }, /*#__PURE__*/React.createElement("h3", null, title), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    label: "\u9589\u3058\u308B",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "close",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "k-modal-body"
  }, children)));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Toast (一時通知)
//  画面上部中央に表示する短いメッセージ。表示制御は呼び出し側。
// ============================================================

/** 短い一時通知。既定で check アイコン付き。 */
function Toast({
  icon = 'check',
  children,
  className,
  ...rest
}) {
  const cls = ['k-toast', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    className: cls
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  }), children);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
// ============================================================
//  kata — Field (ラベル + コントロール + ヒント/エラー)
// ============================================================

/** 入力欄のラッパー。ラベル + 子コントロール + hint/error。 */
function Field({
  label,
  icon,
  hint,
  error,
  htmlFor,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "k-field"
  }, /*#__PURE__*/React.createElement("label", {
    className: "k-field-label",
    htmlFor: htmlFor
  }, icon, label), children, error ? /*#__PURE__*/React.createElement("span", {
    className: "k-field-error"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "k-field-hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Input (フィールド見た目のテキスト入力)
// ============================================================

/** 単一行テキスト入力。Field と組み合わせて使う。 */
function Input({
  className,
  type = 'text',
  ...rest
}) {
  const cls = ['k-input', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    className: cls
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Select (装飾したネイティブ select)
//  ネイティブ矢印を消し、独自 chevron を重ねる。
// ============================================================

/** ネイティブ select を装飾。options か children を渡す。 */
function Select({
  options,
  className,
  children,
  ...rest
}) {
  const cls = ['k-select', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "k-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    className: cls
  }, rest), options ? options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)) : children), /*#__PURE__*/React.createElement("span", {
    className: "k-select-chev"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron",
    size: 18
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Stepper.jsx
try { (() => {
// ============================================================
//  kata — Stepper (数値の +/- 調整)
// ============================================================

/** ± ボタンで数値を増減する入力。制御コンポーネント。 */
function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  suffix = '',
  decimals = 0
}) {
  const dec = () => onChange(Math.max(min, +(value - step).toFixed(2)));
  const inc = () => onChange(Math.min(max ?? Infinity, +(value + step).toFixed(2)));
  const disp = decimals > 0 ? Number(value).toFixed(decimals) : value;
  return /*#__PURE__*/React.createElement("div", {
    className: "k-stepper"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: dec,
    "aria-label": "\u6E1B\u3089\u3059"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    className: "k-stepper-val"
  }, disp, suffix), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: inc,
    "aria-label": "\u5897\u3084\u3059"
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 16
  })));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
// ============================================================
//  kata — Switch (オン/オフ トグル)
// ============================================================

/** オン/オフのトグルスイッチ。制御コンポーネント。 */
function Switch({
  on,
  onChange,
  label,
  disabled
}) {
  const cls = ['k-switch', on && 'k-switch--on'].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    "aria-label": label,
    disabled: disabled,
    className: cls,
    onClick: () => onChange && onChange(!on)
  }, /*#__PURE__*/React.createElement("span", {
    className: "k-knob"
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ============================================================
//  kata — Textarea (複数行テキスト入力)
// ============================================================

/** 複数行テキスト入力。縦リサイズ可。 */
function Textarea({
  className,
  rows = 4,
  ...rest
}) {
  const cls = ['k-textarea', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    className: cls
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tracker/app.jsx
try { (() => {
// ============================================================
//  kata UI kit — 記録 (tracker) app shell
//  タブ切替・テーマ・モーダル・トーストを束ねる。
// ============================================================
const KDS_APP = window.KataDesignSystem_f071df;
const {
  Icon: KIcon,
  Fab: KFab,
  Toast: KToast
} = KDS_APP;
function TabBar({
  tab,
  onTab
}) {
  const tabs = [['today', 'home', '今日'], ['stats', 'chart', '統計'], ['settings', 'settings', '設定']];
  return /*#__PURE__*/React.createElement("div", {
    className: "tabbar"
  }, tabs.map(([k, ic, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: 'tab' + (tab === k ? ' on' : ''),
    onClick: () => onTab(k)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: ic,
    size: 22,
    stroke: tab === k ? 2.1 : 1.8
  }), /*#__PURE__*/React.createElement("span", null, l))));
}
function App() {
  const [tab, setTab] = React.useState('today');
  const [theme, setTheme] = React.useState('light');
  const [habits, setHabits] = React.useState(window.TrackerData.habits);
  const [modal, setModal] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const resolvedTheme = theme === 'system' ? 'light' : theme;
  const toggleHabit = id => {
    setHabits(hs => hs.map(h => h.id === id ? {
      ...h,
      done: !h.done
    } : h));
  };
  const fireToast = (msg, icon) => {
    setToast({
      msg,
      icon
    });
    window.clearTimeout(fireToast._t);
    fireToast._t = window.setTimeout(() => setToast(null), 2200);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "phone",
    "data-theme": resolvedTheme === 'dark' ? 'sumi' : ''
  }, /*#__PURE__*/React.createElement(window.StatusBar, null), /*#__PURE__*/React.createElement("div", {
    className: "app-scroll",
    key: tab
  }, tab === 'today' && /*#__PURE__*/React.createElement(window.TodayScreen, {
    data: window.TrackerData,
    habits: habits,
    onToggleHabit: toggleHabit
  }), tab === 'stats' && /*#__PURE__*/React.createElement(window.StatsScreen, {
    data: window.TrackerData
  }), tab === 'settings' && /*#__PURE__*/React.createElement(window.SettingsScreen, {
    theme: theme,
    onTheme: setTheme
  })), tab !== 'settings' && /*#__PURE__*/React.createElement("div", {
    className: "fab-wrap"
  }, /*#__PURE__*/React.createElement(KFab, {
    label: "\u8A18\u9332\u3092\u8FFD\u52A0",
    fixed: false,
    onClick: () => setModal(true)
  }, /*#__PURE__*/React.createElement(KIcon, {
    name: "plus",
    size: 26,
    stroke: 2.2
  }))), /*#__PURE__*/React.createElement(TabBar, {
    tab: tab,
    onTab: setTab
  }), modal && /*#__PURE__*/React.createElement(window.AddRecordModal, {
    onClose: () => setModal(false),
    onSaved: () => {
      setModal(false);
      fireToast('記録を保存しました', 'check');
    }
  }), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 56,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      zIndex: 80
    }
  }, /*#__PURE__*/React.createElement(KToast, {
    icon: toast.icon
  }, toast.msg)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tracker/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/tracker/data.js
try { (() => {
// ============================================================
//  kata UI kit — 記録 (personal tracker) mock data
//  ※ デモ用の固定データ。実データではない。
// ============================================================
window.TrackerData = {
  todayLabel: '6月29日 (日)',
  rings: [{
    key: 'water',
    icon: 'glass',
    label: '水分',
    value: 1.6,
    max: 2,
    unit: 'L',
    tone: 'accent',
    spark: null
  }, {
    key: 'weight',
    icon: 'scale',
    label: '体重',
    value: 62.4,
    max: 62.4,
    unit: 'kg',
    tone: 'progress',
    spark: [64, 63.6, 63.8, 63.1, 62.9, 63, 62.5, 62.4]
  }, {
    key: 'cal',
    icon: 'flame',
    label: 'カロリー',
    value: 2240,
    max: 2000,
    unit: 'kcal',
    tone: 'over',
    spark: null
  }],
  habits: [{
    id: 'h1',
    icon: 'pill',
    label: 'サプリを飲む',
    done: true
  }, {
    id: 'h2',
    icon: 'book',
    label: '読書 30 分',
    done: true
  }, {
    id: 'h3',
    icon: 'glass',
    label: '水を 2L',
    done: false
  }, {
    id: 'h4',
    icon: 'pen',
    label: '日記をつける',
    done: false
  }],
  streak: 12,
  workouts: [{
    id: 'w1',
    name: 'ベンチプレス',
    detail: '60kg × 8 × 3',
    part: '胸'
  }, {
    id: 'w2',
    name: 'ラットプルダウン',
    detail: '50kg × 10 × 3',
    part: '背中'
  }, {
    id: 'w3',
    name: 'スクワット',
    detail: '70kg × 8 × 4',
    part: '脚'
  }],
  parts: [{
    label: '胸',
    value: 8
  }, {
    label: '背中',
    value: 6
  }, {
    label: '脚',
    value: 5
  }, {
    label: '肩',
    value: 3
  }, {
    label: '腕',
    value: 2
  }],
  weightTrend: [64, 63.6, 63.8, 63.1, 62.9, 63, 62.5, 62.4, 62.6, 62.3, 62.4],
  weekDots: [{
    d: '月',
    done: true
  }, {
    d: '火',
    done: true
  }, {
    d: '水',
    done: false
  }, {
    d: '木',
    done: true
  }, {
    d: '金',
    done: true
  }, {
    d: '土',
    done: true
  }, {
    d: '日',
    done: false
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tracker/data.js", error: String((e && e.message) || e) }); }

// ui_kits/tracker/screens.jsx
try { (() => {
// ============================================================
//  kata UI kit — 記録 (tracker) screens
//  DS のコンポーネントを組み合わせた画面群。window へ公開。
// ============================================================
const KDS = window.KataDesignSystem_f071df;
const {
  Icon,
  Card,
  Text,
  ProgressBar,
  Sparkline,
  BarList,
  Button,
  IconButton,
  Fab,
  Badge,
  Chip,
  ChipGroup,
  SectionTitle,
  Switch,
  Field,
  Input,
  Textarea,
  Select,
  Stepper,
  Modal,
  Toast
} = KDS;
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    className: "statusbar"
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    className: "dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4
    }
  }, "\u25AE")));
}
function StatCard({
  s
}) {
  const display = s.key === 'cal' ? Math.round(s.value) : s.value;
  return /*#__PURE__*/React.createElement(Card, {
    padding: "s",
    className: "stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "top"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.icon,
    size: 17
  }), s.key === 'cal' && /*#__PURE__*/React.createElement(Badge, {
    variant: "danger"
  }, "+12%"), s.key === 'water' && /*#__PURE__*/React.createElement(Badge, {
    variant: "accent"
  }, "80%")), /*#__PURE__*/React.createElement("div", {
    className: "val"
  }, /*#__PURE__*/React.createElement("b", null, display), /*#__PURE__*/React.createElement("small", null, s.unit)), s.spark ? /*#__PURE__*/React.createElement(Sparkline, {
    data: s.spark,
    width: 88,
    height: 26,
    color: "var(--accent)"
  }) : /*#__PURE__*/React.createElement(ProgressBar, {
    value: s.value,
    max: s.max,
    tone: s.tone
  }), /*#__PURE__*/React.createElement(Text, {
    variant: "caption",
    as: "div",
    style: {
      marginTop: 6
    }
  }, s.label));
}
function HabitRow({
  h,
  onToggle
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: 'habit' + (h.done ? ' on' : ''),
    onClick: () => onToggle(h.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: h.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, h.label), /*#__PURE__*/React.createElement("span", {
    className: "chk"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    stroke: 2.4
  })));
}
function TodayScreen({
  data,
  habits,
  onToggleHabit
}) {
  const doneCount = habits.filter(h => h.done).length;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "app-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Text, {
    as: "h1",
    className: "",
    style: {
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: '0.02em',
      color: 'var(--text)'
    }
  }, "\u4ECA\u65E5"), /*#__PURE__*/React.createElement("div", {
    className: "date"
  }, data.todayLabel)), /*#__PURE__*/React.createElement(IconButton, {
    label: "\u691C\u7D22"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "streak-banner"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 26,
    stroke: 2
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "big"
  }, data.streak, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      marginLeft: 3
    }
  }, "\u65E5\u9023\u7D9A"))), /*#__PURE__*/React.createElement("div", {
    className: "txt",
    style: {
      marginLeft: 'auto',
      textAlign: 'right'
    }
  }, "\u4ECA\u9031\u3082\u3044\u3044\u8ABF\u5B50\u3002", /*#__PURE__*/React.createElement("br", null), "\u3053\u306E\u307E\u307E\u7D9A\u3051\u3088\u3046\u3002")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18
    }
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    meta: data.todayLabel.slice(0, 5)
  }, "\u30B5\u30DE\u30EA\u30FC"), /*#__PURE__*/React.createElement("div", {
    className: "stat-grid",
    style: {
      marginTop: 12
    }
  }, data.rings.map(s => /*#__PURE__*/React.createElement(StatCard, {
    key: s.key,
    s: s
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    meta: doneCount + '/' + habits.length
  }, "\u4ECA\u65E5\u306E\u7FD2\u6163"), /*#__PURE__*/React.createElement("div", {
    className: "habit-list"
  }, habits.map(h => /*#__PURE__*/React.createElement(HabitRow, {
    key: h.id,
    h: h,
    onToggle: onToggleHabit
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement(SectionTitle, {
    action: /*#__PURE__*/React.createElement(IconButton, {
      label: "\u3059\u3079\u3066\u8868\u793A",
      size: "sm"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron",
      size: 18
    }))
  }, "\u30C8\u30EC\u30FC\u30CB\u30F3\u30B0"), /*#__PURE__*/React.createElement("div", {
    className: "wo-list"
  }, data.workouts.map(w => /*#__PURE__*/React.createElement("div", {
    className: "wo",
    key: w.id
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic",
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-sm)',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--accent-soft)',
      color: 'var(--accent)',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dumbbell",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, w.name), /*#__PURE__*/React.createElement("div", {
    className: "detail"
  }, w.detail)), /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, w.part)))));
}
function StatsScreen({
  data
}) {
  const [tab, setTab] = React.useState('week');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "app-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Text, {
    as: "h1",
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: 'var(--text)'
    }
  }, "\u7D71\u8A08"), /*#__PURE__*/React.createElement("div", {
    className: "date"
  }, "\u904E\u53BB 30 \u65E5\u9593")), /*#__PURE__*/React.createElement(IconButton, {
    label: "\u30AB\u30EC\u30F3\u30C0\u30FC"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    className: "seg",
    style: {
      marginBottom: 18
    }
  }, [['week', '週'], ['month', '月'], ['year', '年']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: tab === k ? 'on' : '',
    onClick: () => setTab(k)
  }, l))), /*#__PURE__*/React.createElement(Card, {
    padding: "m"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "label"
  }, "\u4F53\u91CD\u306E\u63A8\u79FB"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Text, {
    variant: "num",
    style: {
      fontSize: 22,
      fontWeight: 700
    }
  }, "62.4"), /*#__PURE__*/React.createElement(Text, {
    variant: "caption"
  }, " kg"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Sparkline, {
    data: data.weightTrend,
    width: 320,
    height: 70
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "accent"
  }, "\u22121.6kg / 30\u65E5"), /*#__PURE__*/React.createElement(Badge, {
    variant: "neutral"
  }, "\u76EE\u6A19 60.0kg"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "m"
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "label",
    as: "div",
    style: {
      marginBottom: 14
    }
  }, "\u90E8\u4F4D\u5225\u30C8\u30EC\u30FC\u30CB\u30F3\u30B0\u56DE\u6570"), /*#__PURE__*/React.createElement(BarList, {
    unit: "\u56DE",
    data: data.parts
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16
    }
  }), /*#__PURE__*/React.createElement(Card, {
    padding: "m"
  }, /*#__PURE__*/React.createElement(Text, {
    variant: "label",
    as: "div"
  }, "\u4ECA\u9031\u306E\u9054\u6210"), /*#__PURE__*/React.createElement("div", {
    className: "weekdots"
  }, data.weekDots.map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'wd' + (w.done ? ' on' : '')
  }, /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement(Icon, {
    name: w.done ? 'check' : 'close',
    size: 14,
    stroke: 2.4
  })), /*#__PURE__*/React.createElement("span", null, w.d))))));
}
function SettingsScreen({
  theme,
  onTheme
}) {
  const [notif, setNotif] = React.useState(true);
  const [weekend, setWeekend] = React.useState(false);
  const [sync, setSync] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "app-head"
  }, /*#__PURE__*/React.createElement(Text, {
    as: "h1",
    style: {
      fontSize: 24,
      fontWeight: 700,
      color: 'var(--text)'
    }
  }, "\u8A2D\u5B9A")), /*#__PURE__*/React.createElement(SectionTitle, null, "\u5916\u89B3"), /*#__PURE__*/React.createElement(Card, {
    padding: "m",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, [['light', 'sun', '霧'], ['dark', 'moon', '墨'], ['system', 'monitor', '自動']].map(([k, ic, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: theme === k ? 'on' : '',
    onClick: () => onTheme(k)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 15
  }), l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "\u901A\u77E5"), /*#__PURE__*/React.createElement(Card, {
    padding: "m",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "set-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flame",
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "\u30EA\u30DE\u30A4\u30F3\u30C0\u30FC")), /*#__PURE__*/React.createElement(Switch, {
    on: notif,
    onChange: setNotif,
    label: "\u30EA\u30DE\u30A4\u30F3\u30C0\u30FC"
  })), /*#__PURE__*/React.createElement("div", {
    className: "set-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar",
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "\u9031\u672B\u3082\u901A\u77E5")), /*#__PURE__*/React.createElement(Switch, {
    on: weekend,
    onChange: setWeekend,
    label: "\u9031\u672B\u3082\u901A\u77E5"
  })), /*#__PURE__*/React.createElement("div", {
    className: "set-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lt"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ic"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history",
    size: 17
  })), /*#__PURE__*/React.createElement("span", {
    className: "name"
  }, "\u81EA\u52D5\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7")), /*#__PURE__*/React.createElement(Switch, {
    on: sync,
    onChange: setSync,
    label: "\u81EA\u52D5\u30D0\u30C3\u30AF\u30A2\u30C3\u30D7"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20
    }
  }), /*#__PURE__*/React.createElement(SectionTitle, null, "\u76EE\u6A19"), /*#__PURE__*/React.createElement(Card, {
    padding: "m",
    style: {
      marginTop: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "1 \u65E5\u306E\u6C34\u5206\u76EE\u6A19"
  }, /*#__PURE__*/React.createElement(Select, {
    options: [{
      value: '1.5',
      label: '1.5 L'
    }, {
      value: '2',
      label: '2.0 L'
    }, {
      value: '2.5',
      label: '2.5 L'
    }],
    defaultValue: "2"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u76EE\u6A19\u4F53\u91CD (kg)"
  }, /*#__PURE__*/React.createElement(Input, {
    type: "number",
    defaultValue: "60.0"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    block: true
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 17
  }), "\u30C7\u30FC\u30BF\u3092\u66F8\u304D\u51FA\u3059"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 10
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    block: true
  }, "\u30A2\u30AB\u30A6\u30F3\u30C8\u3092\u524A\u9664"));
}
function AddRecordModal({
  onClose,
  onSaved
}) {
  const [kind, setKind] = React.useState('workout');
  const [weight, setWeight] = React.useState(60);
  const [reps, setReps] = React.useState(8);
  return /*#__PURE__*/React.createElement(Modal, {
    title: "\u8A18\u9332\u3092\u8FFD\u52A0",
    onClose: onClose
  }, /*#__PURE__*/React.createElement(ChipGroup, {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    active: kind === 'workout',
    onClick: () => setKind('workout')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "dumbbell",
    size: 14
  }), "\u30C8\u30EC\u30FC\u30CB\u30F3\u30B0"), /*#__PURE__*/React.createElement(Chip, {
    active: kind === 'water',
    onClick: () => setKind('water')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "glass",
    size: 14
  }), "\u6C34\u5206"), /*#__PURE__*/React.createElement(Chip, {
    active: kind === 'weight',
    onClick: () => setKind('weight')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "scale",
    size: 14
  }), "\u4F53\u91CD")), kind === 'workout' && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u7A2E\u76EE"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u30D9\u30F3\u30C1\u30D7\u30EC\u30B9"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "\u91CD\u91CF (kg)"
  }, /*#__PURE__*/React.createElement(Stepper, {
    value: weight,
    onChange: setWeight,
    step: 2.5,
    decimals: 1
  })), /*#__PURE__*/React.createElement(Field, {
    label: "\u56DE\u6570"
  }, /*#__PURE__*/React.createElement(Stepper, {
    value: reps,
    onChange: setReps,
    step: 1
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "\u30E1\u30E2"
  }, /*#__PURE__*/React.createElement(Textarea, {
    placeholder: "\u4ECA\u65E5\u306E\u8ABF\u5B50\u306F\u2026",
    rows: 2
  }))), kind === 'water' && /*#__PURE__*/React.createElement(Field, {
    label: "\u91CF (mL)"
  }, /*#__PURE__*/React.createElement(Stepper, {
    value: weight * 10,
    onChange: v => setWeight(v / 10),
    step: 50,
    suffix: " mL"
  })), kind === 'weight' && /*#__PURE__*/React.createElement(Field, {
    label: "\u4F53\u91CD (kg)",
    hint: "\u6BCE\u671D\u540C\u3058\u6642\u9593\u306B\u6E2C\u308B\u3068\u6B63\u78BA\u3067\u3059"
  }, /*#__PURE__*/React.createElement(Stepper, {
    value: weight,
    onChange: setWeight,
    step: 0.1,
    decimals: 1,
    suffix: " kg"
  })), /*#__PURE__*/React.createElement(Button, {
    block: true,
    style: {
      marginTop: 20
    },
    onClick: onSaved
  }, "\u4FDD\u5B58\u3059\u308B"));
}
Object.assign(window, {
  StatusBar,
  TodayScreen,
  StatsScreen,
  SettingsScreen,
  AddRecordModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/tracker/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BarList = __ds_scope.BarList;

__ds_ns.Sparkline = __ds_scope.Sparkline;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.ChipGroup = __ds_scope.ChipGroup;

__ds_ns.Fab = __ds_scope.Fab;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.PageTitle = __ds_scope.PageTitle;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SectionTitle = __ds_scope.SectionTitle;

__ds_ns.Text = __ds_scope.Text;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

})();
