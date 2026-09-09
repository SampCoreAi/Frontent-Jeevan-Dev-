"use client";

import * as React from "react";

/* ---------------- Base Style ---------------- */
const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  borderRadius: "9999px",
  border: "1px solid transparent",
  padding: "2px 10px",
  fontSize: "12px",
  fontWeight: 600,
  lineHeight: 1,
  transition: "all 0.2s ease",
  outline: "none",
  cursor: "default",
};

/* ---------------- Variants ---------------- */
const variantStyles = {
  default: {
    backgroundColor: "#3b82f6",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "#e5e7eb",
    color: "#111",
  },
  destructive: {
    backgroundColor: "#ef4444",
    color: "#fff",
  },
  outline: {
    backgroundColor: "transparent",
    border: "1px solid #d1d5db",
    color: "#111",
  },
};

/* ---------------- Hover Styles ---------------- */
const hoverStyles = {
  default: { backgroundColor: "#2563eb" },
  secondary: { backgroundColor: "#d1d5db" },
  destructive: { backgroundColor: "#dc2626" },
  outline: { backgroundColor: "#f3f4f6" },
};

/* ---------------- Badge Component ---------------- */
const Badge = React.forwardRef(function Badge(
  { variant = "default", style = {}, onMouseEnter, onMouseLeave, ...props },
  ref
) {
  const [hover, setHover] = React.useState(false);

  const combinedStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...(hover ? hoverStyles[variant] : {}),
    ...style,
  };

  return (
    <div
      ref={ref}
      style={combinedStyle}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export { Badge };