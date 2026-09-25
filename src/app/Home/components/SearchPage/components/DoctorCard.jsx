"use client";

import CircularProgress from "@mui/material/CircularProgress";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useTheme } from "@mui/material/styles";

export default function DoctorCard({
  doctor,
  index,
  hoveredCard,
  setHoveredCard,
  bookingLoadingId,
  detailsLoadingId,
  onBook,
  onViewDetails,
}) {
  const theme = useTheme();

  const isHovered = hoveredCard === index;
  const isBooking = bookingLoadingId === doctor.id;
  const isViewingDetails = detailsLoadingId === doctor.id;
  return (
    <div
      className="doctor-card"
      style={{
        // =========================
        // GLOBAL THEME VARIABLES
        // =========================
        "--primary": theme.palette.primary.main,
        "--primary-light": theme.palette.primary.light,
        "--primary-dark": theme.palette.primary.dark,
        "--primary-contrast": theme.palette.primary.contrastText,

        "--secondary": theme.palette.secondary.main,
        "--secondary-light": theme.palette.secondary.light,
        "--secondary-dark": theme.palette.secondary.dark,

        "--success": theme.palette.success.main,
        "--success-light": theme.palette.success.light,
        "--success-dark": theme.palette.success.dark,

        "--warning": theme.palette.warning.main,

        "--background-default": theme.palette.background.default,
        "--background-paper": theme.palette.background.paper,

        "--text-primary": theme.palette.text.primary,
        "--text-secondary": theme.palette.text.secondary,
        "--text-disabled": theme.palette.text.disabled,

        "--divider": theme.palette.divider,

        // =========================
        // CARD
        // =========================
        width: "100%",
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        padding: "15px",
        boxSizing: "border-box",
        transition: "all 0.22s ease",

        boxShadow: isHovered
          ? `0 8px 22px ${theme.palette.primary.main}1F`
          : "0 2px 8px rgba(15, 23, 42, 0.05)",

        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* ================= TOP ================= */}

      <div className="doctor-top">
        {/* IMAGE */}

        <div
          style={{
            width: "74px",
            height: "74px",
            borderRadius: "10px",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "#e4eceb",
            border: "1px solid #dbdbdb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {doctor.photo ? (
            <img
              src={doctor.photo}
              alt={doctor.fullName || "Doctor"}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          ) : null}

          <div
            style={{
              width: "100%",
              height: "100%",
              display: doctor.photo ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "25px",
              fontWeight: "700",
              color: "#1e6658",
              textTransform: "uppercase",
            }}
          >
            {doctor.fullName?.charAt(0) || "D"}
          </div>
        </div>
        {/* ================= MAIN INFORMATION ================= */}

        <div className="doctor-main-info">
          <div className="doctor-heading-row">
            <div className="doctor-heading">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  minWidth: 0,
                }}
              >
                <h3>{doctor.fullName}</h3>

                <VerifiedIcon
                  sx={{
                    fontSize: "17px",
                    color: "primary.main",
                    flexShrink: 0,
                  }}
                />
              </div>

              <div className="specialization-row">
                <div className="specialization">
                  {doctor.specialization || "Specialist"}
                </div>

                <span className="specialization-divider">•</span>

                <span className="username">@{doctor.username || "doctor"}</span>

                <div
                  className={`mobile-available-badge ${
                    doctor.isCurrentlyAvailable
                      ? "is-available"
                      : "is-unavailable"
                  }`}
                >
                  <span className="available-dot" />
                  {doctor.isCurrentlyAvailable ? "Available" : "Unavailable"}
                </div>
              </div>
            </div>

            {/* AVAILABLE */}

            <div
              className={`available-badge ${
                doctor.isCurrentlyAvailable ? "is-available" : "is-unavailable"
              }`}
            >
              <span className="available-dot" />
              {doctor.isCurrentlyAvailable ? "Available" : "Unavailable"}
            </div>
          </div>

          {/* ================= USERNAME + TRUST + HOSPITAL ================= */}

          <div className="doctor-meta-row">
            <div className="hospital-section">
              <LocationOnOutlinedIcon
                sx={{
                  fontSize: "17px",
                  color: "primary.main",
                  flexShrink: 0,
                }}
              />

              <span className="hospital-name">
                {doctor.hospitalName || "Hospital not available"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DIVIDER ================= */}

      <div className="card-divider" />

      {/* ================= DETAILS ================= */}

      <div className="doctor-info-grid">
        <InfoBox label="Qualification" value={doctor.qualification || "N/A"} />

        <InfoBox
          label="Experience"
          value={
            doctor.experience !== undefined && doctor.experience !== null
              ? `${doctor.experience} Years`
              : "N/A"
          }
        />

        <InfoBox
          label="Rating"
          value={
            <div className="rating-value">
              <span className="star">★</span>

              <span>{doctor.rating || doctor.avgRating || "0.0"}/5</span>

              <span className="reviews">({doctor.totalFeedbacks ?? 0})</span>
            </div>
          }
        />

        <InfoBox label="Gender" value={formatGender(doctor.gender)} />

        <InfoBox label="Age" value={doctor.age || "N/A"} />

        <InfoBox
          label="Consultation Fee"
          value={
            doctor.consultationFee !== undefined &&
            doctor.consultationFee !== null
              ? `₹${doctor.consultationFee}`
              : "N/A"
          }
          highlight
        />
      </div>

      {/* ================= BUTTONS ================= */}

      <div className="doctor-card-actions">
        <button
          className="book-button"
          onClick={() => onBook(doctor.id)}
          disabled={isBooking}
        >
          {isBooking ? (
            <CircularProgress
              size={17}
              sx={{
                color: "primary.contrastText",
              }}
            />
          ) : (
            "Book Appointment"
          )}
        </button>

        <button
          className="details-button"
          onClick={() => onViewDetails(doctor.id)}
          disabled={isViewingDetails}
        >
          {isViewingDetails ? (
            <CircularProgress
              size={17}
              sx={{
                color: "primary.main",
              }}
            />
          ) : (
            <>
              View Details
              <ArrowForwardRoundedIcon
                sx={{
                  fontSize: "17px",
                  transition: "transform 0.2s ease",
                }}
              />
            </>
          )}
        </button>
      </div>

      {/* =====================================================
          STYLES
      ====================================================== */}

      <style jsx>{`
        .doctor-top {
          display: flex;
          align-items: stretch;
          gap: 12px;
          min-width: 0;
        }

        .doctor-avatar {
          width: 62px;
          min-width: 72px;
          height: auto;
          min-height: 62px;
          border-radius: 14px;
          overflow: hidden;
          background: var(--secondary-light);
          border: 1px solid var(--divider);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--secondary-dark);
          font-size: 23px;
          font-weight: 700;
        }

        .doctor-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .doctor-main-info {
          flex: 1;
          min-width: 0;
        }

        .doctor-heading-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .doctor-heading {
          min-width: 0;
          flex: 1;
        }

        .doctor-heading h3 {
          margin: 0;
          color: var(--text-primary);
          font-size: 15px;
          line-height: 1.25;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .specialization-row {
          display: flex;
          align-items: center;
          gap: 7px;
          min-width: 0;
          margin-top: 3px;
        }

        .specialization {
          margin: 0;
          color: var(--secondary);
          font-size: 13px;
          line-height: 1.3;
          font-weight: 500;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .specialization-divider {
          color: var(--divider);
          font-size: 12px;
          flex-shrink: 0;
        }

        .username {
          color: var(--text-secondary);
          font-size: 10px;
          line-height: 1.3;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .available-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 9px;
          border-radius: 20px;
          background: var(--success-light);
          border: 1px solid var(--primary-light);
          color: var(--success-dark);
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .available-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          flex-shrink: 0;
        }

        .available-badge.is-unavailable,
        .mobile-available-badge.is-unavailable {
          background: #fef2f2;
          border-color: #fecaca;
          color: #dc2626;
        }

        .available-badge.is-unavailable .available-dot,
        .mobile-available-badge.is-unavailable .available-dot {
          background: #dc2626;
        }

        .mobile-available-badge {
          display: none;
        }

        .doctor-meta-row {
          margin-top: 6px;
          display: flex;
          align-items: center;
          min-width: 0;
          width: 100%;
          font-size: 12px;
        }

        .hospital-section {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
          width: 100%;
        }

        .hospital-name {
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .verified-profile {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: var(--success-dark);
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
        }

        .card-divider {
          height: 1px;
          background: var(--divider);
          margin: 13px 0;
        }

        .doctor-info-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .doctor-card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 13px;
        }

        .book-button,
        .details-button {
          height: 40px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .book-button {
          border: none;
          background: var(--primary);
          color: var(--primary-contrast);
        }

        .book-button:hover:not(:disabled) {
          background: var(--primary-dark);
        }

        .book-button:disabled {
          background: var(--primary-light);
          color: var(--primary-contrast);
          cursor: not-allowed;
        }

        .details-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--background-paper);
          border: 1px solid var(--primary);
          color: var(--primary-dark);
        }

        .details-button:hover:not(:disabled) {
          background: var(--secondary-light);
        }

        .details-button:hover:not(:disabled) :global(svg) {
          transform: translateX(3px);
        }

        .details-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .details-button:disabled:hover {
          background: var(--background-paper);
        }

        @media (max-width: 900px) {
          .doctor-card {
            padding: 14px !important;
          }

          .doctor-avatar {
            width: 68px;
            height: 68px;
            min-width: 68px;
          }

          .doctor-heading h3 {
            font-size: 16px;
          }

          .hospital-section {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .doctor-card {
            padding: 13px !important;
            border-radius: 11px !important;
          }

          .doctor-top {
            gap: 10px;
          }

          .doctor-avatar {
            width: 62px;
            height: 62px;
            min-width: 62px;
            border-radius: 12px;
            font-size: 20px;
          }

          .doctor-heading {
            flex: 1;
            min-width: 0;
          }

          .doctor-heading h3 {
            font-size: 15px;
          }

          .doctor-heading-row > .available-badge {
            display: none;
          }

          .specialization-row {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 3px;
            min-width: 0;
          }

          .specialization {
            margin: 0;
            font-size: 12px;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .specialization-divider {
            font-size: 11px;
          }

          .username {
            font-size: 11px;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobile-available-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 3px 7px;
            border-radius: 20px;
            background: var(--success-light);
            border: 1px solid var(--primary-light);
            color: var(--success-dark);
            font-size: 9px;
            font-weight: 700;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .mobile-available-badge .available-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--success);
          }

          .mobile-available-badge.is-unavailable .available-dot {
            background: #dc2626;
          }

          .doctor-meta-row {
            margin-top: 5px;
          }

          .hospital-name {
            font-size: 11px;
          }

          .verified-profile {
            font-size: 9px;
          }

          .card-divider {
            margin: 11px 0;
          }

          .doctor-info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
          }

          .doctor-card-actions {
            gap: 7px;
            margin-top: 11px;
          }

          .book-button,
          .details-button {
            height: 39px;
            font-size: 12px;
          }
        }

        @media (max-width: 390px) {
          .doctor-avatar {
            width: 56px;
            height: 56px;
            min-width: 56px;
          }

          .specialization-row {
            gap: 5px;
          }

          .specialization {
            font-size: 11.5px;
          }

          .username {
            font-size: 10.5px;
          }

          .mobile-available-badge {
            padding: 3px 5px;
            font-size: 8.5px;
          }

          .doctor-card-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ label, value, highlight = false }) {
  const theme = useTheme();

  return (
    <div className="info-box" style={{}}>
      <div className="info-label">{label}</div>

      <div
        className="info-value"
        style={{
          color: highlight
            ? theme.palette.primary.dark
            : theme.palette.text.primary,
        }}
      >
        {value}
      </div>

      <style jsx>{`
        .info-box {
          min-width: 0;

          padding: 8px 9px;

          background: var(--info-background);

          border: 1px solid var(--info-divider);

          border-radius: 7px;
        }

        .info-label {
          margin-bottom: 3px;

          color: var(--info-text-secondary);

          font-size: 10px;
          line-height: 1.2;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .info-value {
          font-size: 12.5px;
          line-height: 1.25;

          font-weight: 700;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        :global(.rating-value) {
          display: flex;
          align-items: center;

          gap: 3px;

          white-space: nowrap;
        }

        :global(.star) {
          color: var(--info-warning);
        }

        :global(.reviews) {
          color: var(--info-text-secondary);

          font-size: 10px;
          font-weight: 500;
        }

        @media (max-width: 600px) {
          .info-box {
            padding: 7px 8px;
          }

          .info-label {
            font-size: 9.5px;
          }

          .info-value {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   FORMAT GENDER
========================================================= */

function formatGender(gender) {
  if (!gender) return "N/A";

  const value = String(gender).toLowerCase();

  return value.charAt(0).toUpperCase() + value.slice(1);
}
