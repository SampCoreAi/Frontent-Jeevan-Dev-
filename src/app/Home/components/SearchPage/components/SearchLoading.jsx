"use client";

export default function SearchLoading({ count = 6, styles }) {
  const skeletonStyle = {
    backgroundColor: "#E8EEEA",
    borderRadius: "6px",
    ...styles?.skeleton,
  };

  return (
    <div className="loading-grid">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="skeleton-card">
          {/* =========================
              TOP PROFILE SECTION
          ========================= */}
          <div className="top-section">
            {/* Avatar */}
            <div
              style={{
                ...skeletonStyle,
                width: "90px",
                height: "80px",
                borderRadius: "16px",
                flexShrink: 0,
              }}
            />

            {/* Doctor Info */}
            <div className="doctor-info">
              {/* Name */}
              <div
                style={{
                  ...skeletonStyle,
                  width: "110px",
                  height: "19px",
                }}
              />

              {/* Specialization */}
              <div
                style={{
                  ...skeletonStyle,
                  width: "85px",
                  height: "16px",
                  marginTop: "8px",
                }}
              />

              {/* Username + Hospital */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <div
                  style={{
                    ...skeletonStyle,
                    width: "75px",
                    height: "15px",
                  }}
                />

                <div
                  style={{
                    ...skeletonStyle,
                    width: "110px",
                    height: "15px",
                  }}
                />
              </div>
            </div>

            {/* Available Badge */}
            <div
              className="available-skeleton"
              style={{
                ...skeletonStyle,
                width: "100px",
                height: "35px",
                borderRadius: "20px",
              }}
            />
          </div>

          {/* Divider */}
          <div className="divider" />

          {/* =========================
              DETAILS 2 ROW × 3 COLUMN
          ========================= */}
          <div className="details-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="detail-box">
                {/* Label */}
                <div
                  style={{
                    ...skeletonStyle,
                    width:
                      i === 2 || i === 5
                        ? "80%"
                        : i === 1
                        ? "65%"
                        : "55%",
                    height: "12px",
                  }}
                />

                {/* Value */}
                <div
                  style={{
                    ...skeletonStyle,
                    width:
                      i === 1
                        ? "70%"
                        : i === 2
                        ? "60%"
                        : i === 5
                        ? "50%"
                        : "45%",
                    height: "17px",
                    marginTop: "8px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* =========================
              BUTTONS
          ========================= */}
          <div className="button-row">
            <div
              style={{
                ...skeletonStyle,
                flex: 1,
                height: "50px",
                borderRadius: "10px",
              }}
            />

            <div
              style={{
                ...skeletonStyle,
                flex: 1,
                height: "50px",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        .loading-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
        }

        .skeleton-card {
          width: 100%;
          padding: 18px;
          border: 1px solid #dfe7e1;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
          box-sizing: border-box;
          overflow: hidden;
        }

        .top-section {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          position: relative;
          min-height: 80px;
        }

        .doctor-info {
          flex: 1;
          min-width: 0;
          padding-top: 3px;
        }

        .available-skeleton {
          flex-shrink: 0;
        }

        .divider {
          height: 1px;
          background: #e2ebe4;
          margin: 16px 0 17px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .detail-box {
          height: 60px;
          padding: 11px;
          border-radius: 9px;
          border: 1px solid #e2e8e4;
          background: #f8faf9;
          box-sizing: border-box;
        }

        .button-row {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        /* Skeleton animation */
        :global(.skeleton-card > * div[style*="background-color"]) {
          position: relative;
          overflow: hidden;
        }

        :global(.skeleton-card > * div[style*="background-color"])::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.65),
            transparent
          );
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        /* =========================
           TABLET
        ========================= */
        @media (max-width: 1199px) {
          .loading-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        /* =========================
           MOBILE
        ========================= */
        @media (max-width: 899px) {
          .loading-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 520px) {
          .skeleton-card {
            padding: 14px;
          }

          .top-section {
            gap: 12px;
          }

          .available-skeleton {
            width: 75px !important;
          }

          .details-grid {
            gap: 8px;
          }

          .detail-box {
            padding: 9px;
          }
        }

        @media (max-width: 420px) {
          .details-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .button-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}