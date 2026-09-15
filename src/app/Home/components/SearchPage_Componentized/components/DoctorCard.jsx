"use client";

import CircularProgress from "@mui/material/CircularProgress";

export default function DoctorCard({
  doctor,
  index,
  hoveredCard,
  setHoveredCard,
  bookingLoadingId,
  onBook,
  onViewDetails,
  styles,
}) {
  const isHovered = hoveredCard === index;
  const isBooking = bookingLoadingId === doctor.id;

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? "scale(1.02)" : "scale(1)",
        boxShadow: isHovered
          ? "0 4px 20px rgba(0,0,0,0.1)"
          : "0 2px 8px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <img
          src={doctor.photo}
          alt={doctor.name}
          style={styles.avatar}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/img/IconDoctor.png";
          }}
        />

        <div>
          <h3
            style={{
              color: "#028275",
              margin: "0 0 8px 0",
            }}
          >
            {doctor.name}
          </h3>

          <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
            {doctor.speciality || "Speciality Not Available"}
          </p>

          <p
            style={{
              margin: 0,
              color: "#028275",
              fontSize: "14px",
            }}
          >
            {doctor.hospital || "Hospital Not Available"}
          </p>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e0e0e0",
          margin: "16px 0",
        }}
      />

      <div style={{ marginBottom: "16px" }}>
        <p style={{ margin: "4px 0" }}>
          <strong>Education:</strong>{" "}
          {doctor.education || "Not Available"}
        </p>

        <p style={{ margin: "4px 0" }}>
          <strong>Experience:</strong> {doctor.experience} + Years
        </p>

        <p style={{ margin: "4px 0" }}>
          <strong>Fee:</strong> ₹
          {doctor.fee ? doctor.fee.toFixed(0) : "0"}
        </p>

        <p style={{ margin: "4px 0" }}>
          <strong>Rating:</strong> ⭐ {doctor.rating}/5 (
          {doctor.totalFeedbacks} Review
          {doctor.totalFeedbacks !== 1 ? "s" : ""})
        </p>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e0e0e0",
          margin: "16px 0",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <button
          style={{
            ...styles.btnPrimary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: isBooking ? 0.8 : 1,
          }}
          disabled={isBooking}
          onClick={() => onBook(doctor.id)}
        >
          {isBooking ? (
            <>
              <CircularProgress size={16} sx={{ color: "#fff" }} />
              Loading...
            </>
          ) : (
            "Book Appointment"
          )}
        </button>

        <button
          style={styles.btnOutline}
          onClick={() => onViewDetails(doctor.id)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
