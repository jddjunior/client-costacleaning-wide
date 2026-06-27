/* @ds-bundle: {"format":3,"namespace":"BranchAvenueDesignSystem_044fdd","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Icon","sourcePath":"components/display/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/display/Icon.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Field","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"b9e12f44e1b8","components/core/Button.jsx":"2608b3f0737a","components/core/Card.jsx":"e540ca217b23","components/core/IconButton.jsx":"634d4d8665a3","components/display/Avatar.jsx":"d1005d1891d2","components/display/Icon.jsx":"6b8dc3b153a3","components/forms/Input.jsx":"bb7269f3754f","components/forms/Switch.jsx":"12271fb6c359","ui_kits/initial-os/App.jsx":"c2dc4205b757","ui_kits/initial-os/ApprovalsScreen.jsx":"de2865a86fa6","ui_kits/initial-os/Chrome.jsx":"dcd9911e44d2","ui_kits/initial-os/DataScreens.jsx":"24bba40429a8","ui_kits/initial-os/OverviewScreen.jsx":"7bf5e9134105","ui_kits/initial-os/data.js":"5c811321c1d7","ui_kits/initial-os/shared.jsx":"29b592a7f023"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BranchAvenueDesignSystem_044fdd = window.BranchAvenueDesignSystem_044fdd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Branch Avenue — Badge
 * Compact status/label token. Tone maps to the semantic status colors.
 */

function tones(tone) {
  const map = {
    neutral: {
      bg: 'var(--gray-100)',
      fg: 'var(--gray-700)',
      bd: 'var(--gray-200)'
    },
    brand: {
      bg: 'var(--brand-subtle)',
      fg: 'var(--brand-text)',
      bd: 'var(--brand-border)'
    },
    positive: {
      bg: 'var(--positive-bg)',
      fg: 'var(--positive)',
      bd: 'var(--positive-border)'
    },
    negative: {
      bg: 'var(--negative-bg)',
      fg: 'var(--negative)',
      bd: 'var(--negative-border)'
    },
    warning: {
      bg: 'var(--warning-bg)',
      fg: 'var(--warning)',
      bd: 'var(--warning-border)'
    },
    info: {
      bg: 'var(--info-bg)',
      fg: 'var(--info)',
      bd: 'var(--info-border)'
    },
    ai: {
      bg: 'var(--ai-bg)',
      fg: 'var(--ai)',
      bd: 'var(--ai-border)'
    }
  };
  return map[tone] || map.neutral;
}
function Badge({
  children,
  tone = 'neutral',
  size = 'md',
  dot = false,
  solid = false,
  style = {},
  ...rest
}) {
  const t = tones(tone);
  const pad = size === 'sm' ? '0 6px' : '0 8px';
  const h = size === 'sm' ? 18 : 22;
  const fs = size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)';
  const solidStyle = solid ? {
    background: t.fg,
    color: '#fff',
    border: '1px solid transparent'
  } : {
    background: t.bg,
    color: t.fg,
    border: `1px solid ${t.bd}`
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: h,
      padding: pad,
      borderRadius: 'var(--radius-full)',
      fontFamily: 'var(--font-sans)',
      fontSize: fs,
      fontWeight: 'var(--weight-medium)',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      letterSpacing: '0.005em',
      ...solidStyle,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: solid ? '#fff' : t.fg,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Branch Avenue — Button
 * Self-contained: all styling via design tokens (CSS custom properties),
 * interaction states tracked in local state so no global CSS is needed.
 */

const SIZES = {
  sm: {
    height: 'var(--control-height-sm)',
    padding: '0 10px',
    font: 'var(--text-sm)',
    gap: '6px',
    icon: 14
  },
  md: {
    height: 'var(--control-height-md)',
    padding: '0 14px',
    font: 'var(--text-base)',
    gap: '7px',
    icon: 16
  },
  lg: {
    height: 'var(--control-height-lg)',
    padding: '0 18px',
    font: 'var(--text-md)',
    gap: '8px',
    icon: 18
  }
};
function palette(variant, state) {
  const hovered = state === 'hover';
  switch (variant) {
    case 'primary':
      return {
        background: hovered ? 'var(--brand-hover)' : 'var(--brand)',
        color: 'var(--on-brand)',
        border: '1px solid transparent',
        shadow: 'var(--shadow-xs)'
      };
    case 'danger':
      return {
        background: hovered ? 'var(--red-700)' : 'var(--red-600)',
        color: '#fff',
        border: '1px solid transparent',
        shadow: 'var(--shadow-xs)'
      };
    case 'secondary':
      return {
        background: hovered ? 'var(--bg-subtle)' : 'var(--bg-surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-strong)',
        shadow: 'var(--shadow-xs)'
      };
    case 'ghost':
      return {
        background: hovered ? 'var(--bg-subtle)' : 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid transparent',
        shadow: 'none'
      };
    case 'subtle':
      return {
        background: hovered ? 'var(--green-100)' : 'var(--brand-subtle)',
        color: 'var(--brand-text)',
        border: '1px solid transparent',
        shadow: 'none'
      };
    default:
      return palette('primary', state);
  }
}
function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const sz = SIZES[size] || SIZES.md;
  const isDisabled = disabled || loading;
  const pal = palette(variant, hover && !isDisabled ? 'hover' : 'rest');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: isDisabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: sz.gap,
      height: sz.height,
      padding: sz.padding,
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'var(--font-sans)',
      fontSize: sz.font,
      fontWeight: 'var(--weight-medium)',
      lineHeight: 1,
      letterSpacing: 'var(--tracking-tight)',
      whiteSpace: 'nowrap',
      borderRadius: 'var(--radius-md)',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      opacity: isDisabled ? 0.5 : 1,
      transition: 'background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
      transform: active && !isDisabled ? 'translateY(0.5px) scale(0.99)' : 'none',
      boxShadow: focus ? variant === 'danger' ? 'var(--focus-ring-danger)' : 'var(--focus-ring)' : pal.shadow,
      background: pal.background,
      color: pal.color,
      border: pal.border,
      outline: 'none',
      ...style
    }
  }, rest), loading && /*#__PURE__*/React.createElement(Spinner, {
    size: sz.icon
  }), !loading && iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: sz.icon,
      height: sz.icon
    }
  }, iconLeft), children, !loading && iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: sz.icon,
      height: sz.icon
    }
  }, iconRight));
}
function Spinner({
  size = 16
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      display: 'inline-block',
      opacity: 0.85,
      animation: 'ba-spin 0.7s linear infinite'
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes ba-spin{to{transform:rotate(360deg)}}'));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Branch Avenue — Card
 * The primary surface container. Border-defined by default; `raised` adds the
 * subtle wash + top highlight + soft shadow from the effects layer.
 */

function Card({
  children,
  raised = false,
  gradientBorder = false,
  padding = 'var(--space-8)',
  interactive = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    transition: 'box-shadow var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)'
  };
  let skin;
  if (gradientBorder) {
    skin = {
      background: 'linear-gradient(var(--bg-surface), var(--bg-surface)) padding-box, var(--hairline-brand) border-box',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-sm)'
    };
  } else if (raised) {
    skin = {
      backgroundColor: 'var(--bg-surface)',
      backgroundImage: 'var(--wash-raised)',
      border: '1px solid var(--border)',
      boxShadow: hover && interactive ? 'var(--highlight-top), var(--shadow-md)' : 'var(--highlight-top), var(--shadow-sm)'
    };
  } else {
    skin = {
      background: 'var(--bg-surface)',
      border: `1px solid ${hover && interactive ? 'var(--border-strong)' : 'var(--border)'}`,
      boxShadow: hover && interactive ? 'var(--shadow-sm)' : 'none'
    };
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...skin,
      cursor: interactive ? 'pointer' : 'default',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}

/** Optional header row for a Card: title + optional action slot. */
function CardHeader({
  title,
  subtitle,
  action,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-6)',
      marginBottom: 'var(--space-6)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-semibold)',
      color: 'var(--text-primary)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-tertiary)',
      marginTop: 2
    }
  }, subtitle)), action && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action));
}
Object.assign(__ds_scope, { Card, CardHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Branch Avenue — IconButton
 * Square, icon-only control for toolbars and table rows.
 */

const SIZES = {
  sm: {
    box: 28,
    icon: 15
  },
  md: {
    box: 34,
    icon: 17
  },
  lg: {
    box: 40,
    icon: 19
  }
};
function palette(variant, hover) {
  switch (variant) {
    case 'solid':
      return {
        background: hover ? 'var(--brand-hover)' : 'var(--brand)',
        color: 'var(--on-brand)',
        border: '1px solid transparent'
      };
    case 'outline':
      return {
        background: hover ? 'var(--bg-subtle)' : 'var(--bg-surface)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-strong)'
      };
    case 'ghost':
    default:
      return {
        background: hover ? 'var(--bg-subtle)' : 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid transparent'
      };
  }
}
function IconButton({
  children,
  'aria-label': ariaLabel,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  active = false,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const sz = SIZES[size] || SIZES.md;
  const pal = palette(variant, (hover || active) && !disabled);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sz.box,
      height: sz.box,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      background: active ? 'var(--bg-subtle)' : pal.background,
      color: active ? 'var(--text-primary)' : pal.color,
      border: pal.border,
      outline: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: sz.icon,
      height: sz.icon,
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, children));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Branch Avenue — Avatar
 * Tenant/user identity token. Initials by default; image when provided.
 * Square-rounded for tenants (orgs), circle for people.
 */

const SIZES = {
  xs: 20,
  sm: 24,
  md: 32,
  lg: 40
};

// Deterministic tint from a string so each tenant keeps a stable color.
const TINTS = [{
  bg: 'var(--green-100)',
  fg: 'var(--green-800)'
}, {
  bg: 'var(--blue-100)',
  fg: 'var(--blue-700)'
}, {
  bg: 'var(--amber-100)',
  fg: 'var(--amber-700)'
}, {
  bg: 'var(--violet-100)',
  fg: 'var(--violet-700)'
}, {
  bg: 'var(--gray-200)',
  fg: 'var(--gray-700)'
}];
function tintFor(seed = '') {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) >>> 0;
  return TINTS[h % TINTS.length];
}
function Avatar({
  name = '',
  src = null,
  size = 'md',
  shape = 'circle',
  style = {},
  ...rest
}) {
  const px = SIZES[size] || SIZES.md;
  const tint = tintFor(name);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  const radius = shape === 'square' ? 'var(--radius-md)' : 'var(--radius-full)';
  return /*#__PURE__*/React.createElement("span", _extends({
    title: name,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: px,
      height: px,
      flexShrink: 0,
      borderRadius: radius,
      overflow: 'hidden',
      background: src ? 'var(--bg-muted)' : tint.bg,
      color: tint.fg,
      fontFamily: 'var(--font-sans)',
      fontSize: Math.round(px * 0.4),
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: '-0.01em',
      boxShadow: 'inset 0 0 0 1px rgba(14,17,22,0.06)',
      userSelect: 'none',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials || '?');
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Icon.jsx
try { (() => {
/*
 * Branch Avenue - Icon
 * The brand icon set is Lucide (lucide.dev): 24px grid, 2px stroke,
 * round caps and joins. Each glyph is stored as inner-SVG markup so the
 * set ships with zero network dependency. In production, prefer
 * lucide-react and import icons by name.
 */

const ICONS = {
  'gauge': '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  'layout-dashboard': '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'flask-conical': '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
  'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'settings': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevrons-up-down': '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
  'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  'trending-up': '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  'trending-down': '<path d="M16 17h6v-6"/><path d="m22 17-8.5-8.5-5 5L2 7"/>',
  'dollar-sign': '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'ellipsis': '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  'filter': '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'pause': '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  'circle-dot': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  'route': '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  'panels-top-left': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>',
  'log-out': '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  'command': '<path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/>'
};
const Icon = ({
  name,
  size = 18,
  strokeWidth = 2,
  color = 'currentColor',
  style = {}
}) => {
  const inner = ICONS[name];
  if (!inner) return null;
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: 'block',
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  });
};
const ICON_NAMES = Object.keys(ICONS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Icon.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Branch Avenue — Input
 * Text field with optional leading/trailing adornments. Border-defined,
 * brand focus ring.
 */

const SIZES = {
  sm: {
    h: 'var(--control-height-sm)',
    px: 9,
    fs: 'var(--text-sm)'
  },
  md: {
    h: 'var(--control-height-md)',
    px: 11,
    fs: 'var(--text-base)'
  },
  lg: {
    h: 'var(--control-height-lg)',
    px: 13,
    fs: 'var(--text-md)'
  }
};
function Input({
  value,
  defaultValue,
  placeholder,
  type = 'text',
  size = 'md',
  iconLeft = null,
  trailing = null,
  invalid = false,
  disabled = false,
  mono = false,
  onChange,
  onKeyDown,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const sz = SIZES[size] || SIZES.md;
  const borderColor = invalid ? 'var(--negative)' : focus ? 'var(--brand)' : 'var(--border-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: sz.h,
      padding: `0 ${sz.px}px`,
      background: disabled ? 'var(--bg-subtle)' : 'var(--bg-surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? invalid ? 'var(--focus-ring-danger)' : 'var(--focus-ring)' : 'var(--shadow-xs)',
      transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
      cursor: disabled ? 'not-allowed' : 'text',
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: 16,
      height: 16,
      color: 'var(--text-tertiary)',
      flexShrink: 0
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    type: type,
    disabled: disabled,
    onChange: onChange,
    onKeyDown: onKeyDown,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: sz.fs,
      fontWeight: 'var(--weight-regular)',
      color: 'var(--text-primary)',
      padding: 0
    }
  }, rest)), trailing && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      color: 'var(--text-tertiary)'
    }
  }, trailing));
}

/** Labeled field wrapper: label + optional hint/error below the control. */
function Field({
  label,
  hint,
  error,
  required,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-primary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--negative)',
      marginLeft: 3
    }
  }, "*")), children, (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--negative)' : 'var(--text-tertiary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input, Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Branch Avenue — Switch
 * Binary toggle. Pine when on, neutral track when off.
 */

function Switch({
  checked = false,
  disabled = false,
  size = 'md',
  onChange,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const dims = size === 'sm' ? {
    w: 32,
    h: 18,
    knob: 14
  } : {
    w: 38,
    h: 22,
    knob: 18
  };
  const offset = dims.w - dims.knob - 4;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange && onChange(!checked),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      position: 'relative',
      width: dims.w,
      height: dims.h,
      flexShrink: 0,
      padding: 0,
      border: 'none',
      borderRadius: 'var(--radius-full)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: checked ? 'var(--brand)' : 'var(--gray-300)',
      backgroundImage: checked ? 'var(--grad-brand-sheen)' : 'none',
      boxShadow: focus ? 'var(--focus-ring)' : 'inset 0 1px 2px rgba(14,17,22,0.12)',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--duration-base) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
      outline: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      left: 2,
      width: dims.knob,
      height: dims.knob,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 2px rgba(14,17,22,0.3)',
      transform: checked ? `translateX(${offset}px)` : 'translateX(0)',
      transition: 'transform var(--duration-base) var(--ease-spring)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/initial-os/App.jsx
try { (() => {
/* Branch Avenue — Initial OS · App shell */

const {
  Sidebar,
  Topbar
} = window.OSChrome;
const TITLES = {
  overview: 'Command center',
  approvals: 'Approvals',
  experiments: 'Experiments',
  tenants: 'Tenants',
  spend: 'AI spend',
  team: 'Team & roles',
  settings: 'Settings'
};
function Placeholder({
  title
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520,
      marginTop: 40,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-subtle)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(window.BADS.Icon, {
    name: "panels-top-left",
    size: 22,
    color: "var(--text-tertiary)"
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      marginTop: 6
    }
  }, "This surface is part of the Initial OS kit. The Command center, Approvals, Experiments, and Tenants screens are fully built out \u2014 explore those."));
}
function App() {
  const [screen, setScreen] = React.useState('overview');
  const [vertical, setVertical] = React.useState('all');
  let body;
  if (screen === 'overview') body = /*#__PURE__*/React.createElement(window.OSOverview, {
    vertical: vertical,
    setScreen: setScreen
  });else if (screen === 'approvals') body = /*#__PURE__*/React.createElement(window.OSApprovals, {
    vertical: vertical
  });else if (screen === 'experiments') body = /*#__PURE__*/React.createElement(window.OSExperiments, {
    vertical: vertical
  });else if (screen === 'tenants') body = /*#__PURE__*/React.createElement(window.OSTenants, {
    vertical: vertical
  });else body = /*#__PURE__*/React.createElement(Placeholder, {
    title: TITLES[screen]
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-app)'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    screen: screen,
    setScreen: setScreen
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      backgroundImage: 'var(--wash-app)'
    }
  }, /*#__PURE__*/React.createElement(Topbar, {
    title: TITLES[screen],
    vertical: vertical,
    setVertical: setVertical
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: '24px 28px'
    }
  }, body)));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/initial-os/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/initial-os/ApprovalsScreen.jsx
try { (() => {
/* Branch Avenue — Initial OS · Approvals (the core human-in-the-loop flow) */

const {
  Icon: ApIcon,
  Badge: ApBadge,
  Button: ApButton,
  Avatar: ApAvatar
} = window.BADS;
function ProposalCard({
  p,
  decision,
  onDecide
}) {
  const meta = window.vMeta(p.vertical);
  const decided = decision != null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ba-raised",
    style: {
      padding: 0,
      overflow: 'hidden',
      opacity: decided ? 0.62 : 1,
      transition: 'opacity var(--duration-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '14px 16px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      flexShrink: 0,
      background: 'var(--ai-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(ApIcon, {
    name: "sparkles",
    size: 18,
    color: "var(--ai)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--ai)'
    }
  }, p.agent), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 3,
      height: 3,
      borderRadius: '50%',
      background: 'var(--gray-300)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 12,
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: meta.color
    }
  }), meta.label), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, p.urgency === 'urgent' && /*#__PURE__*/React.createElement(ApBadge, {
    tone: "negative",
    size: "sm",
    dot: true
  }, "Urgent"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-mono)'
    }
  }, p.time))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em'
    }
  }, p.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 5,
      lineHeight: 1.5,
      maxWidth: 620
    }
  }, p.detail))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 22,
      padding: '12px 16px',
      marginTop: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Meta, {
    label: "Scope",
    value: p.scope,
    mono: true
  }), /*#__PURE__*/React.createElement(Meta, {
    label: "Projected impact",
    value: p.impact,
    accent: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)',
      marginBottom: 5
    }
  }, "Confidence"), /*#__PURE__*/React.createElement(window.OSShared.ConfBar, {
    value: p.confidence,
    tone: p.confidence >= 90 ? 'var(--positive)' : p.confidence >= 75 ? 'var(--brand)' : 'var(--warning)'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '12px 16px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--gray-25)'
    }
  }, decided ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      fontSize: 13,
      fontWeight: 600,
      color: decision === 'approved' ? 'var(--positive)' : 'var(--negative)'
    }
  }, /*#__PURE__*/React.createElement(ApIcon, {
    name: decision === 'approved' ? 'circle-check' : 'x',
    size: 16,
    color: decision === 'approved' ? 'var(--positive)' : 'var(--negative)'
  }), decision === 'approved' ? 'Approved — rollout queued' : 'Rejected', /*#__PURE__*/React.createElement("button", {
    onClick: () => onDecide(p.id, null),
    style: {
      marginLeft: 6,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: 12,
      color: 'var(--text-tertiary)',
      textDecoration: 'underline'
    }
  }, "Undo")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ApButton, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement(ApIcon, {
      name: "check",
      size: 15,
      color: "#fff"
    }),
    onClick: () => onDecide(p.id, 'approved')
  }, "Approve"), /*#__PURE__*/React.createElement(ApButton, {
    variant: "secondary",
    size: "sm",
    onClick: () => onDecide(p.id, 'rejected')
  }, "Reject"), /*#__PURE__*/React.createElement(ApButton, {
    variant: "ghost",
    size: "sm"
  }, "View details"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-tertiary)'
    }
  }, p.id))));
}
function Meta({
  label,
  value,
  mono,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)',
      marginBottom: 5
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      color: accent ? 'var(--positive)' : 'var(--text-primary)'
    }
  }, value));
}
function ApprovalsScreen({
  vertical
}) {
  const [decisions, setDecisions] = React.useState({});
  const onDecide = (id, d) => setDecisions(s => ({
    ...s,
    [id]: d
  }));
  const all = window.OS_DATA.approvals.filter(p => vertical === 'all' || p.vertical === vertical);
  const pending = all.filter(p => decisions[p.id] == null).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement(window.OSShared.SectionHead, {
    sub: "Human-in-the-loop",
    title: "Approval queue",
    action: /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(ApBadge, {
      tone: pending ? 'warning' : 'positive',
      dot: true
    }, pending ? `${pending} pending` : 'All clear'), /*#__PURE__*/React.createElement(ApButton, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(ApIcon, {
        name: "filter",
        size: 14
      })
    }, "Filter"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: '11px 14px',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--ai-bg)',
      border: '1px solid var(--ai-border)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(ApIcon, {
    name: "shield-check",
    size: 17,
    color: "var(--ai)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--violet-700)'
    }
  }, "Agents can ", /*#__PURE__*/React.createElement("strong", null, "propose"), " cross-tenant changes, but never apply them. Every rollout waits for an operator decision here.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, all.map(p => /*#__PURE__*/React.createElement(ProposalCard, {
    key: p.id,
    p: p,
    decision: decisions[p.id],
    onDecide: onDecide
  }))));
}
window.OSApprovals = ApprovalsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/initial-os/ApprovalsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/initial-os/Chrome.jsx
try { (() => {
/* Branch Avenue — Initial OS · Chrome (Sidebar + Topbar)
   Consumes bundled DS components from window (exported in index.html). */

const {
  Icon,
  Avatar,
  Badge,
  Input,
  Button
} = window.BADS;
const NAV = [{
  id: 'overview',
  label: 'Command center',
  icon: 'gauge'
}, {
  id: 'approvals',
  label: 'Approvals',
  icon: 'circle-check',
  badge: '9'
}, {
  id: 'experiments',
  label: 'Experiments',
  icon: 'flask-conical'
}, {
  id: 'tenants',
  label: 'Tenants',
  icon: 'building-2'
}, {
  id: 'spend',
  label: 'AI spend',
  icon: 'dollar-sign'
}];
const NAV2 = [{
  id: 'team',
  label: 'Team & roles',
  icon: 'users'
}, {
  id: 'settings',
  label: 'Settings',
  icon: 'settings'
}];
function Wordmark() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 10px',
      height: 'var(--topbar-height)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-md)',
      flexShrink: 0,
      background: 'var(--grad-brand)',
      backgroundImage: 'var(--grad-brand-sheen), var(--grad-brand)',
      boxShadow: 'var(--highlight-top), var(--shadow-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "route",
    size: 16,
    color: "#fff",
    strokeWidth: 2.25
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)',
      letterSpacing: '-0.02em'
    }
  }, "Branch Avenue"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-mono)'
    }
  }, "Initial OS")));
}
function NavItem({
  item,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      height: 34,
      padding: '0 10px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      textAlign: 'left',
      background: active ? 'var(--bg-surface)' : hover ? 'var(--gray-100)' : 'transparent',
      boxShadow: active ? 'var(--shadow-xs), inset 0 0 0 1px var(--border)' : 'none',
      color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: active ? 600 : 500,
      transition: 'background var(--duration-fast) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: item.icon,
    size: 17,
    color: active ? 'var(--brand)' : 'var(--text-tertiary)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, item.label), item.badge && /*#__PURE__*/React.createElement(Badge, {
    tone: active ? 'warning' : 'neutral',
    size: "sm"
  }, item.badge));
}
function Sidebar({
  screen,
  setScreen
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      height: '100%',
      borderRight: '1px solid var(--border)',
      background: 'var(--gray-50)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, null), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: '0 0 8px'
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '0 8px'
    }
  }, NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    item: n,
    active: screen === n.id,
    onClick: () => setScreen(n.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      padding: '16px 18px 6px'
    }
  }, "Platform"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      padding: '0 8px'
    }
  }, NAV2.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    item: n,
    active: screen === n.id,
    onClick: () => setScreen(n.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 10,
      margin: 8,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: window.OS_DATA.user.name,
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, window.OS_DATA.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)'
    }
  }, window.OS_DATA.user.role)), /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 15,
    color: "var(--text-tertiary)"
  }))));
}
function VerticalFilter({
  value,
  onChange
}) {
  const [open, setOpen] = React.useState(false);
  const current = window.OS_DATA.verticals.find(v => v.id === value);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 34,
      padding: '0 10px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-strong)',
      background: 'var(--bg-surface)',
      boxShadow: 'var(--shadow-xs)',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: current.color
    }
  }), current.label, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 15,
    color: "var(--text-tertiary)"
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 40,
      left: 0,
      zIndex: 200,
      minWidth: 180,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      padding: 5
    }
  }, window.OS_DATA.verticals.map(v => /*#__PURE__*/React.createElement("button", {
    key: v.id,
    onClick: () => {
      onChange(v.id);
      setOpen(false);
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      width: '100%',
      height: 32,
      padding: '0 9px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-sm)',
      textAlign: 'left',
      background: v.id === value ? 'var(--bg-subtle)' : 'transparent',
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: v.color
    }
  }), v.label, v.id === value && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    color: "var(--brand)"
  }))))));
}
function Topbar({
  title,
  vertical,
  setVertical,
  children
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--topbar-height)',
      flexShrink: 0,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'saturate(180%) blur(8px)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '0 20px'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 240
    }
  }, /*#__PURE__*/React.createElement(Input, {
    size: "md",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    }),
    placeholder: "Search tenants, experiments\u2026"
  })), /*#__PURE__*/React.createElement(VerticalFilter, {
    value: vertical,
    onChange: setVertical
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Notifications",
    style: {
      position: 'relative',
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-strong)',
      background: 'var(--bg-surface)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-xs)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 17,
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 7,
      right: 8,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--negative)',
      border: '1.5px solid var(--bg-surface)'
    }
  })), children);
}
window.OSChrome = {
  Sidebar,
  Topbar
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/initial-os/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/initial-os/DataScreens.jsx
try { (() => {
/* Branch Avenue — Initial OS · Experiments + Tenants (table views) */

const {
  Icon: DtIcon,
  Badge: DtBadge,
  Button: DtButton,
  Avatar: DtAvatar
} = window.BADS;
const EXP_STATUS = {
  winning: {
    tone: 'positive',
    label: 'Winning'
  },
  running: {
    tone: 'info',
    label: 'Running'
  },
  losing: {
    tone: 'negative',
    label: 'Losing'
  }
};
const HEALTH = {
  healthy: {
    tone: 'positive',
    label: 'Healthy'
  },
  warning: {
    tone: 'warning',
    label: 'Watch'
  },
  critical: {
    tone: 'negative',
    label: 'Critical'
  }
};
function TableShell({
  cols,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ba-raised",
    style: {
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: cols,
      gap: 16,
      padding: '10px 18px',
      background: 'var(--gray-25)',
      borderBottom: '1px solid var(--border)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)'
    }
  }, children[0]), /*#__PURE__*/React.createElement("div", null, children[1]));
}
function Row({
  cols,
  children,
  last
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'grid',
      gridTemplateColumns: cols,
      gap: 16,
      padding: '13px 18px',
      alignItems: 'center',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)',
      background: hover ? 'var(--gray-25)' : 'transparent',
      transition: 'background var(--duration-fast) var(--ease-out)'
    }
  }, children);
}
function ExperimentsScreen({
  vertical
}) {
  const rows = window.OS_DATA.experiments.filter(e => vertical === 'all' || e.vertical === vertical);
  const cols = '1.6fr 1.2fr 0.9fr 1.3fr 0.9fr 40px';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980
    }
  }, /*#__PURE__*/React.createElement(window.OSShared.SectionHead, {
    sub: "CRO engine",
    title: "Live experiments",
    action: /*#__PURE__*/React.createElement(DtButton, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(DtIcon, {
        name: "plus",
        size: 15,
        color: "#fff"
      })
    }, "New experiment")
  }), /*#__PURE__*/React.createElement(TableShell, {
    cols: cols
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, "Experiment"), /*#__PURE__*/React.createElement("div", null, "Tenant"), /*#__PURE__*/React.createElement("div", null, "Status"), /*#__PURE__*/React.createElement("div", null, "Lift / confidence"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, "Traffic"), /*#__PURE__*/React.createElement("div", null)), /*#__PURE__*/React.createElement(React.Fragment, null, rows.map((e, i) => {
    const st = EXP_STATUS[e.status];
    const meta = window.vMeta(e.vertical);
    const liftPos = e.lift.startsWith('+');
    return /*#__PURE__*/React.createElement(Row, {
      key: e.id,
      cols: cols,
      last: i === rows.length - 1
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: meta.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text-primary)'
      }
    }, e.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)',
        marginTop: 2,
        marginLeft: 15
      }
    }, e.id, " \xB7 ", e.variants)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-secondary)'
      }
    }, e.tenant), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DtBadge, {
      tone: st.tone,
      dot: true
    }, st.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        fontWeight: 600,
        color: liftPos ? 'var(--positive)' : 'var(--negative)',
        width: 52
      }
    }, e.lift), /*#__PURE__*/React.createElement(window.OSShared.ConfBar, {
      value: e.conf,
      tone: e.conf >= 90 ? 'var(--positive)' : 'var(--brand)'
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--text-secondary)'
      }
    }, e.traffic.toLocaleString()), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(DtIcon, {
      name: "ellipsis",
      size: 17,
      color: "var(--text-tertiary)"
    })));
  }))));
}
function TenantsScreen({
  vertical
}) {
  const rows = window.OS_DATA.tenants.filter(t => vertical === 'all' || t.vertical === vertical);
  const cols = '1.8fr 1fr 0.7fr 1fr 1.2fr 40px';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980
    }
  }, /*#__PURE__*/React.createElement(window.OSShared.SectionHead, {
    sub: "Multi-tenant",
    title: "Tenants",
    action: /*#__PURE__*/React.createElement(DtButton, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(DtIcon, {
        name: "plus",
        size: 15,
        color: "#fff"
      })
    }, "Add tenant")
  }), /*#__PURE__*/React.createElement(TableShell, {
    cols: cols
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, "Organization"), /*#__PURE__*/React.createElement("div", null, "Plan"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right'
    }
  }, "Sites"), /*#__PURE__*/React.createElement("div", null, "Health"), /*#__PURE__*/React.createElement("div", null, "Token budget"), /*#__PURE__*/React.createElement("div", null)), /*#__PURE__*/React.createElement(React.Fragment, null, rows.map((t, i) => {
    const h = HEALTH[t.health];
    const meta = window.vMeta(t.vertical);
    return /*#__PURE__*/React.createElement(Row, {
      key: t.id,
      cols: cols,
      last: i === rows.length - 1
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11
      }
    }, /*#__PURE__*/React.createElement(DtAvatar, {
      name: t.name,
      shape: "square",
      size: "md"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: 'var(--text-primary)'
      }
    }, t.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        color: 'var(--text-tertiary)',
        marginTop: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: meta.color
      }
    }), meta.label, " \xB7 ", t.spend))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DtBadge, {
      tone: "neutral",
      size: "sm"
    }, t.plan)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        color: 'var(--text-primary)'
      }
    }, t.sites), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DtBadge, {
      tone: h.tone,
      dot: true
    }, h.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 6,
        borderRadius: 999,
        background: 'var(--bg-muted)',
        overflow: 'hidden',
        maxWidth: 90
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${t.tokens}%`,
        height: '100%',
        borderRadius: 999,
        background: t.tokens >= 90 ? 'var(--negative)' : t.tokens >= 70 ? 'var(--warning)' : 'var(--brand)'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-secondary)'
      }
    }, t.tokens, "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(DtIcon, {
      name: "ellipsis",
      size: 17,
      color: "var(--text-tertiary)"
    })));
  }))));
}
window.OSExperiments = ExperimentsScreen;
window.OSTenants = TenantsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/initial-os/DataScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/initial-os/OverviewScreen.jsx
try { (() => {
/* Branch Avenue — Initial OS · Command center (Overview) */

const {
  Icon: OvIcon,
  Badge: OvBadge,
  Button: OvButton
} = window.BADS;
function OverviewScreen({
  vertical,
  setScreen
}) {
  const d = window.OS_DATA;
  const S = window.OSShared;
  const acts = d.activity;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 20
    }
  }, d.stats.map(s => /*#__PURE__*/React.createElement(S.StatTile, {
    key: s.id,
    stat: s
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ba-raised",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginBottom: 4
    }
  }, "Last 14 days"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em'
    }
  }, "AI spend across tenants")), /*#__PURE__*/React.createElement(OvButton, {
    variant: "ghost",
    size: "sm",
    iconRight: /*#__PURE__*/React.createElement(OvIcon, {
      name: "arrow-up-right",
      size: 14
    }),
    onClick: () => setScreen('spend')
  }, "Details")), /*#__PURE__*/React.createElement(S.Sparkline, {
    series: d.spendSeries,
    height: 84
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(SpendStat, {
    label: "Today",
    value: "$1,284"
  }), /*#__PURE__*/React.createElement(SpendStat, {
    label: "14-day avg",
    value: "$1,041"
  }), /*#__PURE__*/React.createElement(SpendStat, {
    label: "Budget used",
    value: "61%",
    tone: "var(--brand)"
  }), /*#__PURE__*/React.createElement(SpendStat, {
    label: "Tokens / day",
    value: "2.14M"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ba-raised",
    style: {
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginBottom: 14
    }
  }, "Recent activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, acts.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      marginTop: 6,
      flexShrink: 0,
      background: a.tone === 'ai' ? 'var(--ai)' : a.tone === 'positive' ? 'var(--positive)' : a.tone === 'warning' ? 'var(--warning)' : 'var(--gray-400)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      lineHeight: 1.45
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: 600
    }
  }, a.who), " ", a.what, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: 500
    }
  }, a.target), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-mono)',
      fontSize: 11
    }
  }, " \xB7 ", a.time))))))), /*#__PURE__*/React.createElement("div", {
    className: "ba-gradient-border",
    style: {
      marginTop: 16,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 'var(--radius-md)',
      flexShrink: 0,
      background: 'var(--ai-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(OvIcon, {
    name: "sparkles",
    size: 20,
    color: "var(--ai)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, "9 agent proposals are waiting on you"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--text-secondary)',
      marginTop: 2
    }
  }, "3 urgent \xB7 oldest 2h ago \xB7 across Avenue OS, Transport, and Agency")), /*#__PURE__*/React.createElement(OvButton, {
    variant: "primary",
    iconRight: /*#__PURE__*/React.createElement(OvIcon, {
      name: "chevron-right",
      size: 16,
      color: "#fff"
    }),
    onClick: () => setScreen('approvals')
  }, "Review queue"))));
}
function SpendStat({
  label,
  value,
  tone
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)',
      marginBottom: 3
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      fontFamily: 'var(--font-mono)',
      color: tone || 'var(--text-primary)'
    }
  }, value));
}
window.OSOverview = OverviewScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/initial-os/OverviewScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/initial-os/data.js
try { (() => {
/* Branch Avenue — Initial OS · mock data
   Plain globals (no modules) so Babel screen files can read them. */

window.OS_DATA = {
  user: {
    name: 'Avery Cole',
    role: 'Platform Operator',
    initials: 'AC'
  },
  verticals: [{
    id: 'all',
    label: 'All products',
    color: 'var(--gray-500)'
  }, {
    id: 'os',
    label: 'Avenue OS',
    color: 'var(--cat-os)'
  }, {
    id: 'transport',
    label: 'Transport',
    color: 'var(--cat-transport)'
  }, {
    id: 'agency',
    label: 'Agency',
    color: 'var(--cat-agency)'
  }],
  // Top-line metrics for the command center
  stats: [{
    id: 'tenants',
    label: 'Active tenants',
    value: '148',
    delta: '+6',
    dir: 'up',
    tone: 'neutral',
    sub: 'this week'
  }, {
    id: 'spend',
    label: 'AI spend · today',
    value: '$1,284',
    delta: '+4.2%',
    dir: 'up',
    tone: 'neutral',
    sub: 'vs. yesterday'
  }, {
    id: 'exp',
    label: 'Experiments live',
    value: '37',
    delta: '5 ending',
    dir: 'flat',
    tone: 'info',
    sub: 'across 22 tenants'
  }, {
    id: 'queue',
    label: 'Awaiting approval',
    value: '9',
    delta: '3 urgent',
    dir: 'up',
    tone: 'warning',
    sub: 'oldest 2h ago'
  }],
  // AI proposals needing a human decision (the core console flow)
  approvals: [{
    id: 'prp_8841',
    vertical: 'os',
    urgency: 'urgent',
    title: 'Roll VDP CTA win to 12 dealer sites',
    agent: 'CRO Agent',
    detail: 'Variant B ("Check availability") lifted lead conversion +8.4% at Lone Star Auto with 99% confidence. Propose applying across the dealer group.',
    scope: 'Group · Lone Star Auto (12 sites)',
    impact: '+8.4% leads',
    confidence: 99,
    tenant: 'Lone Star Auto Group',
    time: '2h ago'
  }, {
    id: 'prp_8839',
    vertical: 'agency',
    urgency: 'normal',
    title: 'Publish 6 AI-drafted location pages',
    agent: 'Content Agent',
    detail: 'Generated 6 city landing pages for Cobalt Roofing from the approved template. SEO score 92avg. Awaiting publish approval.',
    scope: 'Tenant · Cobalt Roofing',
    impact: 'Est. +320 sessions/mo',
    confidence: 87,
    tenant: 'Cobalt Roofing',
    time: '40m ago'
  }, {
    id: 'prp_8836',
    vertical: 'transport',
    urgency: 'urgent',
    title: 'Raise surge multiplier on TX→CA lane',
    agent: 'Pricing Agent',
    detail: 'Demand on Dallas→LA exceeds carrier supply by 2.3×. Propose temporary 1.35× surge for 48h to clear the backlog.',
    scope: 'Lane · DAL → LAX',
    impact: 'Clear 41 jobs',
    confidence: 81,
    tenant: 'Transport marketplace',
    time: '18m ago'
  }, {
    id: 'prp_8833',
    vertical: 'os',
    urgency: 'normal',
    title: 'Pause low-performing inventory feed',
    agent: 'Ops Agent',
    detail: 'Bay Area Motors feed has 14% malformed VINs over 24h. Propose pausing sync and alerting the dealer.',
    scope: 'Tenant · Bay Area Motors',
    impact: 'Prevent bad listings',
    confidence: 94,
    tenant: 'Bay Area Motors',
    time: '1h ago'
  }, {
    id: 'prp_8830',
    vertical: 'agency',
    urgency: 'normal',
    title: 'Increase token budget for Q3 push',
    agent: 'Budget Agent',
    detail: 'Northwind Dental is at 96% of its monthly token allowance with 9 days left. Propose a one-time +500k top-up.',
    scope: 'Tenant · Northwind Dental',
    impact: '+500k tokens',
    confidence: 72,
    tenant: 'Northwind Dental',
    time: '3h ago'
  }],
  // Running experiments
  experiments: [{
    id: 'exp_204',
    name: 'VDP CTA copy',
    tenant: 'Lone Star Auto',
    vertical: 'os',
    status: 'winning',
    lift: '+8.4%',
    conf: 99,
    traffic: 12400,
    variants: 'B of 2'
  }, {
    id: 'exp_198',
    name: 'Quote form length',
    tenant: 'Transport mktpl',
    vertical: 'transport',
    status: 'running',
    lift: '+1.2%',
    conf: 64,
    traffic: 8900,
    variants: 'C of 3'
  }, {
    id: 'exp_191',
    name: 'Hero headline',
    tenant: 'Cobalt Roofing',
    vertical: 'agency',
    status: 'running',
    lift: '+0.4%',
    conf: 41,
    traffic: 3200,
    variants: 'B of 2'
  }, {
    id: 'exp_187',
    name: 'Pricing table order',
    tenant: 'Northwind Dental',
    vertical: 'agency',
    status: 'losing',
    lift: '-2.1%',
    conf: 88,
    traffic: 5600,
    variants: 'B of 2'
  }, {
    id: 'exp_182',
    name: 'Carrier match radius',
    tenant: 'Transport mktpl',
    vertical: 'transport',
    status: 'winning',
    lift: '+5.7%',
    conf: 96,
    traffic: 14200,
    variants: 'B of 2'
  }, {
    id: 'exp_177',
    name: 'Finance CTA placement',
    tenant: 'Bay Area Motors',
    vertical: 'os',
    status: 'running',
    lift: '+2.9%',
    conf: 78,
    traffic: 6100,
    variants: 'B of 2'
  }],
  // Tenant tree (org → group → site)
  tenants: [{
    id: 'org_ls',
    name: 'Lone Star Auto Group',
    vertical: 'os',
    plan: 'Enterprise',
    sites: 12,
    health: 'healthy',
    spend: '$412/day',
    tokens: 71
  }, {
    id: 'org_ba',
    name: 'Bay Area Motors',
    vertical: 'os',
    plan: 'Growth',
    sites: 4,
    health: 'warning',
    spend: '$96/day',
    tokens: 58
  }, {
    id: 'org_tx',
    name: 'Transport Marketplace',
    vertical: 'transport',
    plan: 'Platform',
    sites: 1,
    health: 'healthy',
    spend: '$534/day',
    tokens: 83
  }, {
    id: 'org_cb',
    name: 'Cobalt Roofing',
    vertical: 'agency',
    plan: 'Agency',
    sites: 6,
    health: 'healthy',
    spend: '$118/day',
    tokens: 44
  }, {
    id: 'org_nw',
    name: 'Northwind Dental',
    vertical: 'agency',
    plan: 'Agency',
    sites: 3,
    health: 'critical',
    spend: '$74/day',
    tokens: 96
  }, {
    id: 'org_pk',
    name: 'Peak Performance Auto',
    vertical: 'os',
    plan: 'Growth',
    sites: 5,
    health: 'healthy',
    spend: '$88/day',
    tokens: 39
  }],
  // 14-day AI spend sparkline (relative heights 0..1)
  spendSeries: [0.42, 0.48, 0.51, 0.46, 0.55, 0.6, 0.58, 0.64, 0.62, 0.71, 0.68, 0.74, 0.79, 0.83],
  activity: [{
    who: 'CRO Agent',
    what: 'proposed a win rollout',
    target: 'Lone Star Auto',
    time: '2h',
    tone: 'ai'
  }, {
    who: 'Avery Cole',
    what: 'approved budget top-up',
    target: 'Cobalt Roofing',
    time: '3h',
    tone: 'positive'
  }, {
    who: 'Ops Agent',
    what: 'flagged a feed anomaly',
    target: 'Bay Area Motors',
    time: '4h',
    tone: 'warning'
  }, {
    who: 'Pricing Agent',
    what: 'ended experiment exp_204',
    target: 'Transport',
    time: '6h',
    tone: 'neutral'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/initial-os/data.js", error: String((e && e.message) || e) }); }

// ui_kits/initial-os/shared.jsx
try { (() => {
/* Branch Avenue — Initial OS · shared screen helpers */

const {
  Icon: OSIcon,
  Badge: OSBadge,
  Card: OSCard
} = window.BADS;

// vertical → color + label
window.vMeta = id => window.OS_DATA.verticals.find(v => v.id === id) || window.OS_DATA.verticals[0];

// Section heading
function SectionHead({
  title,
  sub,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginBottom: 14,
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-tertiary)',
      marginBottom: 4
    }
  }, sub), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--text-primary)',
      letterSpacing: '-0.01em'
    }
  }, title)), action);
}

// KPI tile
function StatTile({
  stat
}) {
  const dirColor = stat.tone === 'warning' ? 'var(--warning)' : stat.tone === 'info' ? 'var(--info)' : 'var(--text-tertiary)';
  return /*#__PURE__*/React.createElement("div", {
    className: "ba-raised",
    style: {
      padding: 16,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      fontWeight: 500
    }
  }, stat.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28,
      fontWeight: 600,
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '-0.01em'
    }
  }, stat.value), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 12,
      fontWeight: 600,
      color: dirColor
    }
  }, stat.dir === 'up' && /*#__PURE__*/React.createElement(OSIcon, {
    name: "trending-up",
    size: 14,
    color: dirColor
  }), stat.dir === 'flat' && /*#__PURE__*/React.createElement(OSIcon, {
    name: "circle-dot",
    size: 12,
    color: dirColor
  }), stat.delta)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)',
      marginTop: 4
    }
  }, stat.sub));
}

// Tiny vertical-bar sparkline
function Sparkline({
  series,
  color = 'var(--brand)',
  height = 56
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 4,
      height
    }
  }, series.map((v, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      height: `${Math.max(8, v * 100)}%`,
      borderRadius: 3,
      background: i === series.length - 1 ? color : 'var(--green-200)',
      transition: 'height var(--duration-slow) var(--ease-out)'
    }
  })));
}

// Confidence meter
function ConfBar({
  value,
  tone = 'var(--brand)'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 6,
      borderRadius: 999,
      background: 'var(--bg-muted)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${value}%`,
      height: '100%',
      background: tone,
      borderRadius: 999
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-secondary)',
      fontWeight: 500
    }
  }, value, "%"));
}
window.OSShared = {
  SectionHead,
  StatTile,
  Sparkline,
  ConfBar
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/initial-os/shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Switch = __ds_scope.Switch;

})();
