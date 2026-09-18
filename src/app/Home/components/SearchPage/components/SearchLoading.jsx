"use client";

import { useTheme } from "@mui/material/styles";

export default function SearchLoading({ count = 6 }) {
  const theme = useTheme();

  const skeletonStyle = {
    backgroundColor: theme.palette.divider,
    borderRadius: "5px",
  };

  return (
    <div className="loading-grid">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="skeleton-card"
          style={{
            "--divider": theme.palette.divider,
            "--paper": theme.palette.background.paper,
            "--background": theme.palette.background.default,
            "--primary-light": theme.palette.primary.light,
          }}
        >
          {/* =========================================
              TOP SECTION
          ========================================= */}
          <div className="top-section">

            {/* Avatar */}
            <div
              className="skeleton skeleton-avatar"
              style={skeletonStyle}
            />

            {/* Doctor Main Info */}
            <div className="doctor-info">

              {/* Heading Row */}
              <div className="heading-row">
                <div className="heading-content">

                  {/* Doctor Name */}
                  <div
                    className="skeleton"
                    style={{
                      ...skeletonStyle,
                      width: "115px",
                      height: "18px",
                    }}
                  />

                  {/* Specialization */}
                  <div
                    className="skeleton"
                    style={{
                      ...skeletonStyle,
                      width: "80px",
                      height: "13px",
                      marginTop: "5px",
                    }}
                  />
                </div>

                {/* Available Badge */}
                <div
                  className="skeleton available-skeleton"
                  style={{
                    ...skeletonStyle,
                    width: "75px",
                    height: "26px",
                    borderRadius: "20px",
                  }}
                />
              </div>

              {/* Username + Hospital */}
              <div className="meta-row">

                {/* Username */}
                <div
                  className="skeleton"
                  style={{
                    ...skeletonStyle,
                    width: "65px",
                    height: "12px",
                  }}
                />

                {/* Small divider */}
                <div className="meta-divider" />

                {/* Hospital */}
                <div
                  className="skeleton"
                  style={{
                    ...skeletonStyle,
                    width: "105px",
                    maxWidth: "40%",
                    height: "12px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* =========================================
              DIVIDER
          ========================================= */}
          <div className="card-divider" />

          {/* =========================================
              INFO GRID - 2 ROW × 3 COLUMN
          ========================================= */}
          <div className="details-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="detail-box">

                {/* Label */}
                <div
                  className="skeleton"
                  style={{
                    ...skeletonStyle,
                    width:
                      i === 0
                        ? "65%"
                        : i === 1
                        ? "55%"
                        : i === 2
                        ? "45%"
                        : i === 3
                        ? "45%"
                        : i === 4
                        ? "35%"
                        : "70%",
                    height: "10px",
                  }}
                />

                {/* Value */}
                <div
                  className="skeleton"
                  style={{
                    ...skeletonStyle,
                    width:
                      i === 0
                        ? "50%"
                        : i === 1
                        ? "65%"
                        : i === 2
                        ? "55%"
                        : i === 3
                        ? "45%"
                        : i === 4
                        ? "35%"
                        : "50%",
                    height: "13px",
                    marginTop: "5px",
                  }}
                />
              </div>
            ))}
          </div>

          {/* =========================================
              BUTTONS
          ========================================= */}
          <div className="button-row">
            <div
              className="skeleton button-skeleton"
              style={skeletonStyle}
            />

            <div
              className="skeleton button-skeleton"
              style={skeletonStyle}
            />
          </div>
        </div>
      ))}

      <style jsx>{`
        /* =========================================
           GRID
        ========================================= */

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
        }

        /* =========================================
           CARD
        ========================================= */

        .skeleton-card {
          width: 100%;

          padding: 15px;

          border: 1px solid var(--divider);
          border-radius: 12px;

          background: var(--paper);

          box-shadow:
            0 2px 8px rgba(15, 23, 42, 0.05);

          box-sizing: border-box;

          overflow: hidden;
        }

        /* =========================================
           TOP
        ========================================= */

        .top-section {
          display: flex;
          align-items: stretch;

          gap: 12px;

          min-width: 0;
        }

        /* Avatar exactly close to DoctorCard */

        .skeleton-avatar {
          width: 72px;
          min-width: 72px;

          height: 62px;
          min-height: 62px;

          border-radius: 14px !important;

          flex-shrink: 0;
        }

        /* =========================================
           DOCTOR INFO
        ========================================= */

        .doctor-info {
          flex: 1;
          min-width: 0;
        }

        .heading-row {
          display: flex;

          align-items: flex-start;
          justify-content: space-between;

          gap: 8px;

          min-width: 0;
        }

        .heading-content {
          flex: 1;
          min-width: 0;
        }

        /* =========================================
           AVAILABLE
        ========================================= */

        .available-skeleton {
          flex-shrink: 0;
        }

        /* =========================================
           USERNAME + HOSPITAL
        ========================================= */

        .meta-row {
          margin-top: 7px;

          display: flex;
          align-items: center;

          gap: 9px;

          min-width: 0;
        }

        .meta-divider {
          width: 1px;
          height: 14px;

          background: var(--divider);

          flex-shrink: 0;
        }

        /* =========================================
           DIVIDER
        ========================================= */

        .card-divider {
          height: 1px;

          background: var(--divider);

          margin: 13px 0;
        }

        /* =========================================
           INFO GRID
        ========================================= */

        .details-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 8px;
        }

        .detail-box {
          min-width: 0;

          padding: 8px 9px;

          min-height: 48px;

          border: 1px solid var(--divider);

          border-radius: 7px;

          background: var(--background);

          box-sizing: border-box;
        }

        /* =========================================
           BUTTONS
        ========================================= */

        .button-row {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 9px;

          margin-top: 13px;
        }

        .button-skeleton {
          width: 100%;

          height: 40px;

          border-radius: 8px !important;
        }

        /* =========================================
           SHIMMER
        ========================================= */

        .skeleton {
          position: relative;

          overflow: hidden;
        }

        .skeleton::after {
          content: "";

          position: absolute;

          top: 0;
          left: 0;

          width: 100%;
          height: 100%;

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

        /* =========================================
           TABLET
        ========================================= */

        @media (max-width: 1199px) {
          .loading-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .skeleton-card {
            padding: 14px;
          }

          .skeleton-avatar {
            width: 68px;
            height: 68px;
            min-width: 68px;
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 899px) {
          .loading-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .skeleton-card {
            padding: 13px;

            border-radius: 11px;
          }

          .top-section {
            gap: 10px;
          }

          .skeleton-avatar {
            width: 62px;
            height: 62px;

            min-width: 62px;
            min-height: 62px;

            border-radius: 12px !important;
          }

          /*
           * Actual DoctorCard mobile par
           * Available specialization ke paas aata hai.
           */

          .available-skeleton {
            width: 60px !important;
            height: 20px !important;
          }

          .meta-row {
            margin-top: 5px;

            gap: 6px;
          }

          .meta-divider {
            display: none;
          }

          .card-divider {
            margin: 11px 0;
          }

          /*
           * Actual DoctorCard mobile:
           * 3 columns -> 2 columns
           */

          .details-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));

            gap: 7px;
          }

          .detail-box {
            padding: 7px 8px;

            min-height: 46px;
          }

          .button-row {
            gap: 7px;

            margin-top: 11px;
          }

          .button-skeleton {
            height: 39px;
          }
        }

        /* =========================================
           SMALL MOBILE
        ========================================= */

        @media (max-width: 390px) {
          .skeleton-avatar {
            width: 56px;
            height: 56px;

            min-width: 56px;
            min-height: 56px;
          }

          .button-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}