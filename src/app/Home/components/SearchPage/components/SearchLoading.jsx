"use client";

export default function SearchLoading({ count = 3, styles }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        width: "100%",
      }}
      className="loading-grid"
    >
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          style={{
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            padding: "16px",
          minHeight: "356px",
          }}
        >
          {/* Top */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              alignItems: "flex-start",
            }}
          >
            {/* Image */}
            <div
              style={{
                ...styles.skeleton,
                width: "100px",
                height: "100px",
                flexShrink: 0,
                borderRadius: "8px",
              }}
            />

            {/* Doctor details */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  ...styles.skeleton,
                  width: "80%",
                  height: "22px",
                  marginBottom: "12px",
                }}
              />

              <div
                style={{
                  ...styles.skeleton,
                  width: "60%",
                  height: "16px",
                  marginBottom: "10px",
                }}
              />

              <div
                style={{
                  ...styles.skeleton,
                  width: "45%",
                  height: "16px",
                }}
              />
            </div>
          </div>

          {/* Middle */}
          <div
            style={{
              ...styles.skeleton,
              width: "90%",
              height: "16px",
              marginTop: "22px",
            }}
          />

          <div
            style={{
              ...styles.skeleton,
              width: "65%",
              height: "16px",
              marginTop: "10px",
            }}
          />
          <div
            style={{
              ...styles.skeleton,
              width: "65%",
              height: "16px",
              marginTop: "10px",
            }}
          />
          <div
            style={{
              ...styles.skeleton,
              width: "65%",
              height: "16px",
              marginTop: "10px",
            }}
          />

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "28px",
            }}
          >
            <div
              style={{
                ...styles.skeleton,
                flex: 1,
                height: "40px",
                borderRadius: "6px",
              }}
            />

            <div
              style={{
                ...styles.skeleton,
                flex: 1,
                height: "40px",
                borderRadius: "6px",
              }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        @media (max-width: 1199px) {
          .loading-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 899px) {
          .loading-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}