"use client";

export default function EmptyState({
  icon,
  title,
  description,
  subDescription,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
  styles,
  titleColor = "#1e6658",
}) {
  return (
    <div style={styles.emptyBox}>
      {icon && (
        <div
          style={{
            fontSize: "42px",
            marginBottom: "12px",
          }}
        >
          {icon}
        </div>
      )}

      <h2
        style={{
          color: titleColor,
          marginBottom: "10px",
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          style={{
            color: "#666",
            marginBottom: subDescription ? "8px" : "20px",
          }}
        >
          {description}
        </p>
      )}

      {subDescription && (
        <p
          style={{
            color: "#888",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          {subDescription}
        </p>
      )}

      {(primaryText || secondaryText) && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {primaryText && (
            <button style={styles.btnPrimary} onClick={onPrimary}>
              {primaryText}
            </button>
          )}

          {secondaryText && (
            <button style={styles.btnOutline} onClick={onSecondary}>
              {secondaryText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
