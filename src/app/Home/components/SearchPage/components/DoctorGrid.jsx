"use client";

import DoctorCard from "./DoctorCard";

export default function DoctorGrid({
  doctors = [],
  hoveredCard,
  setHoveredCard,
  bookingLoadingId,
  detailsLoadingId,
  onBook,
  onViewDetails,
}) {
  return (
    <>
      <div className="doctor-grid">
        {doctors.map((doctor, index) => (
          <DoctorCard
            key={doctor.id || doctor.userId || index}
            doctor={doctor}
            index={index}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            bookingLoadingId={bookingLoadingId}
            detailsLoadingId={detailsLoadingId}
            onBook={onBook}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      <style jsx>{`
        .doctor-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          width: 100%;
          margin-top: 10px;
          box-sizing: border-box;
        }

        @media (max-width: 1200px) {
          .doctor-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 700px) {
          .doctor-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </>
  );
}