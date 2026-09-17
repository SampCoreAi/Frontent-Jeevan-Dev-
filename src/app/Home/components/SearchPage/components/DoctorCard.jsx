"use client";

import CircularProgress from "@mui/material/CircularProgress";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
export default function DoctorCard({
  doctor,
  index,
  hoveredCard,
  setHoveredCard,
  bookingLoadingId,
  onBook,
  onViewDetails,
}) {
  const isHovered = hoveredCard === index;
  const isBooking = bookingLoadingId === doctor.id;

  return (
    <div
      className="doctor-card"
      style={{
        width: "100%",
        background: "#ffffff",
        border: "1px solid #e5ece9",
        borderRadius: "12px",
        padding: "15px",
        boxSizing: "border-box",
        transition: "all 0.22s ease",
        boxShadow: isHovered
          ? "0 8px 22px rgba(15, 118, 110, 0.12)"
          : "0 2px 8px rgba(15, 23, 42, 0.05)",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* ================= TOP ================= */}
      <div className="doctor-top">
        {/* IMAGE */}
        <div className="doctor-avatar">
          {doctor.photo ? (
            <img
              src={doctor.photo}
              alt={doctor.name || doctor.username || "Doctor"}
            />
          ) : (
            <span>
              {(doctor.name || doctor.username || "D")
                .replace("Dr.", "")
                .trim()
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        {/* MAIN INFORMATION */}
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
                <h3>
                  {doctor.name || doctor.username || "Doctor"}
                </h3>

                <VerifiedIcon
                  sx={{
                    fontSize: "17px",
                    color: "#0a9f7d",
                    flexShrink: 0,
                  }}
                />
              </div>

              <div className="specialization">
                {doctor.specialization || "Specialist"}
              </div>
            </div>

            {/* AVAILABLE */}
            <div className="available-badge">
              <span className="available-dot" />
              Available
            </div>
          </div>

          {/* USERNAME + TRUST + HOSPITAL */}
          <div className="doctor-meta-row">
            <div className="username-section">
              <span className="username">
                @{doctor.username || "doctor"}
              </span>

              {doctor.isVerified && (
                <span className="verified-profile">
                  <VerifiedUserOutlinedIcon
                    sx={{
                      fontSize: "15px",
                    }}
                  />
                  Verified Profile
                </span>
              )}
            </div>

            <span className="meta-divider" />

            <div className="hospital-section">
              <LocationOnOutlinedIcon
                sx={{
                  fontSize: "17px",
                  color: "#0f9f7f",
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

      {/* DIVIDER */}
      <div className="card-divider" />

      {/* ================= DETAILS ================= */}
      <div className="doctor-info-grid">
        <InfoBox
          label="Qualification"
          value={doctor.qualification || "N/A"}
        />

        <InfoBox
          label="Experience"
          value={
            doctor.experience !== undefined &&
              doctor.experience !== null
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

              <span className="reviews">
                ({doctor.totalFeedbacks ?? 0})
              </span>
            </div>
          }
        />

        <InfoBox
          label="Gender"
          value={formatGender(doctor.gender)}
        />

        <InfoBox
          label="Age"
          value={doctor.age || "N/A"}
        />

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
            <CircularProgress size={17} sx={{ color: "#fff" }} />
          ) : (
            "Book Appointment"
          )}
        </button>
<button
  className="details-button"
  onClick={() => onViewDetails(doctor.id)}
>
  View Details

  <ArrowForwardRoundedIcon
    sx={{
      fontSize: "17px",
      transition: "transform 0.2s ease",
    }}
  />
</button>
      </div>

      <style jsx>{`
        /* ===========================
           DESKTOP / LAPTOP
        ============================ */
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

  background: #edf7f2;
  border: 1px solid #dcebe4;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #14866d;
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
.details-button:hover {
  background: #f0fdf8;
}

.details-button:hover :global(svg) {
  transform: translateX(3px);
}
        .doctor-heading-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .doctor-heading {
          min-width: 0;
        }

        .doctor-heading h3 {
          margin: 0;

          color: #172033;

          font-size: 15px;
          line-height: 1.25;
          font-weight: 700;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .specialization {
          margin-top: 2px;

          color: #159272;

          font-size: 13px;
          line-height: 1.3;
          font-weight: 500;
        }

        /* AVAILABLE */

        .available-badge {
          display: flex;
          align-items: center;
          gap: 5px;

          padding: 5px 9px;

          border-radius: 20px;

          background: #ecfdf5;
          border: 1px solid #c9f2df;

          color: #078969;

          font-size: 11px;
          font-weight: 700;

          white-space: nowrap;
          flex-shrink: 0;
        }

        .available-dot {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #10b981;
        }

        /* ===========================
           USERNAME + HOSPITAL
        ============================ */

        .doctor-meta-row {
          margin-top: 3px;

          display: flex;
          align-items: center;
          gap: 9px;

          min-width: 0;

          font-size: 12px;
        }

        .username-section {
          display: flex;
          align-items: center;
          gap: 5px;

          min-width: 0;
          flex-shrink: 0;
        }

        .username {
          color: #475569;
          font-weight: 500;
        }

        .verified-profile {
          display: inline-flex;
          align-items: center;
          gap: 3px;

          color: #078969;

          font-size: 10px;
          font-weight: 600;

          white-space: nowrap;
        }

        .meta-divider {
          width: 1px;
          height: 14px;

          background: #dfe7e4;

          flex-shrink: 0;
        }

        .hospital-section {
          display: flex;
          align-items: center;
          gap: 3px;

          min-width: 0;
        }

        .hospital-name {
          color: #596575;

          font-size: 12px;
          font-weight: 500;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* DIVIDER */

        .card-divider {
          height: 1px;

          background: #edf1ef;

          margin: 13px 0;
        }

        /* ===========================
           INFO GRID
        ============================ */

        .doctor-info-grid {
          display: grid;

          grid-template-columns: repeat(3, minmax(0, 1fr));

          gap: 8px;
        }

        /* ===========================
           BUTTONS
        ============================ */

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

          background: #0a9f7d;
          color: white;
        }

        .book-button:hover {
          background: #07876a;
        }

        .book-button:disabled {
          background: #8ddbc7;
          cursor: not-allowed;
        }

        .details-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          background: white;

          border: 1px solid #0a9f7d;

          color: #07876a;
        }

        .details-button:hover {
          background: #f0fdf8;
        }

        /* ===========================
           TABLET
        ============================ */

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

          .doctor-meta-row {
            flex-wrap: wrap;
            gap: 5px 8px;
          }

          .meta-divider {
            display: none;
          }

          .hospital-section {
            flex-basis: 100%;
          }
        }

        /* ===========================
           MOBILE
        ============================ */

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

          .doctor-heading h3 {
            font-size: 15px;
          }

          .specialization {
            font-size: 12px;
          }

          .available-badge {
            padding: 4px 7px;

            font-size: 9px;
          }

          .doctor-meta-row {
            margin-top: 5px;
          }

          .username {
            font-size: 11px;
          }

          .verified-profile {
            font-size: 9px;
          }

          .hospital-name {
            font-size: 11px;
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

        /* ===========================
           SMALL MOBILE
        ============================ */

        @media (max-width: 390px) {
          .doctor-avatar {
            width: 56px;
            height: 56px;
            min-width: 56px;
          }

          .available-badge {
            padding: 4px 6px;
          }

          .doctor-card-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

function InfoBox({ label, value, highlight = false }) {
  return (
    <div className="info-box">
      <div className="info-label">{label}</div>

      <div
        className="info-value"
        style={{
          color: highlight ? "#078969" : "#172033",
        }}
      >
        {value}
      </div>

      <style jsx>{`
        .info-box {
          min-width: 0;

          padding: 8px 9px;

          background: #f8faf9;

          border: 1px solid #edf1ef;
          border-radius: 7px;
        }

        .info-label {
          margin-bottom: 3px;

          color: #7b8491;

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
          color: #f4b400;
        }

        :global(.reviews) {
          color: #7b8491;

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

function formatGender(gender) {
  if (!gender) return "N/A";

  const value = String(gender).toLowerCase();

  return value.charAt(0).toUpperCase() + value.slice(1);
}