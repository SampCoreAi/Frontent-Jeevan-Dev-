"use client";

export default function SearchLoading({ count = 3, styles }) {
  return (
    <div>
      {[...Array(count)].map((_, index) => (
        <div key={index} style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                ...styles.skeleton,
                width: "100px",
                height: "100px",
              }}
            />

            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...styles.skeleton,
                  width: "60%",
                  height: "24px",
                  marginBottom: "8px",
                }}
              />

              <div
                style={{
                  ...styles.skeleton,
                  width: "40%",
                  height: "16px",
                  marginBottom: "8px",
                }}
              />

              <div
                style={{
                  ...styles.skeleton,
                  width: "50%",
                  height: "16px",
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
