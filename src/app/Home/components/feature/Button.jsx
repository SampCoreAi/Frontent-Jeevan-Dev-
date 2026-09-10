"use client";

import * as React from "react";

/* ---------------- Base Styles ---------------- */
const baseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  whiteSpace: "nowrap",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s ease",
  outline: "none",
};

/* ---------------- Variants ---------------- */
const variantStyles = {
  default: {
    backgroundColor: "#3b82f6",
    color: "#fff",
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
  secondary: {
    backgroundColor: "#e5e7eb",
    color: "#111",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#111",
  },
  link: {
    backgroundColor: "transparent",
    color: "#3b82f6",
    textDecoration: "underline",
  },
};

/* ---------------- Sizes ---------------- */
const sizeStyles = {
  default: {
    height: "40px",
    padding: "8px 16px",
  },
  sm: {
    height: "36px",
    padding: "6px 12px",
    fontSize: "13px",
  },
  lg: {
    height: "44px",
    padding: "10px 24px",
    fontSize: "15px",
  },
  icon: {
    height: "40px",
    width: "40px",
    padding: 0,
  },
};

/* ---------------- Hover Helper ---------------- */
const getHoverStyle = (variant) => {
  switch (variant) {
    case "default":
      return { backgroundColor: "#2563eb" };
    case "destructive":
      return { backgroundColor: "#dc2626" };
    case "outline":
      return { backgroundColor: "#f3f4f6" };
    case "secondary":
      return { backgroundColor: "#d1d5db" };
    case "ghost":
      return { backgroundColor: "#f3f4f6" };
    case "link":
      return {};
    default:
      return {};
  }
};

/* ---------------- Button Component ---------------- */
const Button = React.forwardRef(function Button(
  {
    variant = "default",
    size = "default",
    disabled = false,
    style = {},
    onMouseEnter,
    onMouseLeave,
    ...props
  },
  ref
) {
  const [hover, setHover] = React.useState(false);

  const combinedStyle = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(hover ? getHoverStyle(variant) : {}),
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? "none" : "auto",
    ...style,
  };

  return (
    <button
      ref={ref}
      style={combinedStyle}
      disabled={disabled}
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

Button.displayName = "Button";

export { Button };