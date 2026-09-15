"use client";

import DoctorCard from "./DoctorCard";

export default function DoctorGrid({
  doctors,
  hoveredCard,
  setHoveredCard,
  bookingLoadingId,
  onBook,
  onViewDetails,
  styles,
}) {
  return (
    <div
      style={{
        ...styles.grid,
        marginTop: "10px",
      }}
    >
      {doctors.map((doctor, index) => (
        <DoctorCard
          key={doctor.id || index}
          doctor={doctor}
          index={index}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          bookingLoadingId={bookingLoadingId}
          onBook={onBook}
          onViewDetails={onViewDetails}
          styles={styles}
        />
      ))}
    </div>
  );
}
