"use client";

import React from "react";
import dayjs from "dayjs";

export default function PrescriptionPdfView({
  doctor,
  patient,
  dateNow,
  diagnosis,
  medicines = [],
  remark,
  followUpDate,
  qrImage,
}) {
  // Medicine name compulsory.
  // Blank editor row PDF me nahi aayegi.
  const validMedicines = medicines.filter((row) => row?.name?.trim());

  const hospital =
    doctor?.hospital_detail?.[0] || doctor?.hospitalDetail?.[0] || {};

  const doctorName = doctor?.name
    ? doctor.name.toLowerCase().startsWith("dr")
      ? doctor.name
      : `Dr. ${doctor.name}`
    : "Doctor";

  const hospitalName =
    hospital?.hospitalName || hospital?.hospital_name || "Hospital";

  // Screen header jaisa full address
  const hospitalAddress = [
    hospital?.flatPlotNo,
    hospital?.buildingSociety,
    hospital?.streetName || hospital?.street_name,
    hospital?.areaLocality || hospital?.area_locality,
    hospital?.landmark,
    hospital?.district,
    hospital?.city,
    hospital?.state,
    hospital?.pinCode || hospital?.pin_code,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      style={{
        width: "794px",
        minHeight: "1123px",
        backgroundColor: "#ffffff",
        padding: "26px 30px",
        boxSizing: "border-box",
        color: "#172033",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          paddingBottom: "12px",
        }}
      >
        {/* LEFT - DOCTOR */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#172033",
              lineHeight: 1.25,
            }}
          >
            {doctorName}
          </div>

          {doctor?.qualification && (
            <div
              style={{
                marginTop: "2px",
                fontSize: "13px",
                color: "#596575",
                lineHeight: 1.4,
              }}
            >
              {doctor.qualification}
            </div>
          )}

          <div
            style={{
              marginTop: "2px",
              fontSize: "13px",
              color: "#596575",
              lineHeight: 1.4,
            }}
          >
            Registration Number: {doctor?.registration_number || "—"}
          </div>
        </div>

        {/* CENTER DIVIDER */}
        <div
          style={{
            width: "1px",
            alignSelf: "stretch",
            backgroundColor: "rgba(0,0,0,0.12)",
            margin: "0 8px",
          }}
        />

        {/* RIGHT - HOSPITAL */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#07876A",
              lineHeight: 1.25,
            }}
          >
            {hospitalName}
          </div>

          {hospitalAddress && (
            <div
              style={{
                marginTop: "4px",
                marginLeft: "auto",
                maxWidth: "380px",
                fontSize: "12px",
                color: "#596575",
                lineHeight: 1.4,
                wordBreak: "break-word",
              }}
            >
              {hospitalAddress}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM GREEN LINE */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "rgba(7, 135, 106, 0.55)",
        }}
      />

      {/* =====================================================
          PATIENT INFORMATION
      ===================================================== */}

      <div
        style={{
          marginTop: "10px",
          border: "1px solid #DFE7E4",
          borderRadius: "8px",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            backgroundColor: "#EDF7F2",
            height: "30px",
            padding: "0 10px 8px",
            display: "flex",
            alignItems: "center",
            color: "#07876A",
            fontWeight: 700,
            fontSize: "12px",
            lineHeight: "14px",
            boxSizing: "border-box",
          }}
        >
          Patient Information
        </div>

        {/* FIRST ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr 1.4fr",
            height: "36px",
            borderBottom: "1px solid #E5EAE8",
          }}
        >
          <PatientCell label="Patient Name" value={patient?.name} />
          <PatientCell label="Age" value={patient?.age} />
          <PatientCell label="Date/Time" value={dateNow} />
        </div>

        {/* SECOND ROW */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.25fr 0.75fr 1.4fr",
            height: "36px",
          }}
        >
          <PatientCell label="Gender" value={patient?.gender} />
          <PatientCell
            label="Weight"
            value={patient?.weight ? `${patient.weight} kg` : "—"}
          />
          <PatientCell
            label="Height"
            value={patient?.height ? `${patient.height} cm` : "—"}
          />
        </div>
      </div>

      {/* =====================================================
          DIAGNOSIS
      ===================================================== */}

      <div style={{ marginTop: "13px" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            marginBottom: "4px",
          }}
        >
          Diagnosis
        </div>

        <div
          style={{
            minHeight: "31px",
            border: "1px solid #E1E7E5",
            borderRadius: "7px",
            padding: "7px 10px",
            boxSizing: "border-box",
            fontSize: "11px",
            color: diagnosis ? "#172033" : "#8A949F",
          }}
        >
          {diagnosis || "No diagnosis added."}
        </div>
      </div>

      {/* =====================================================
          PRESCRIPTION
      ===================================================== */}

      {validMedicines.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          {/* RX TITLE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <div
              style={{
                color: "#5B2AA8",
                fontFamily: "Georgia, serif",
                fontSize: "25px",
                fontStyle: "italic",
                lineHeight: 1,
              }}
            >
              ℞
            </div>

            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.7px",
                color: "#6B7280",
              }}
            >
              PRESCRIPTION
            </div>
          </div>

          {/* MEDICINES */}
          {validMedicines.map((medicine, index) => {
            const medicineName = [medicine?.name, medicine?.dose, medicine?.unit]
              .filter(Boolean)
              .join(" ");

            const instruction = [
              medicine?.freq,
              medicine?.instr,
              medicine?.duration ? formatDuration(medicine.duration) : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={`pdf-med-${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "28px minmax(0, 1fr) minmax(250px, 42%)",
                  alignItems: "center",
                  gap: "8px",
                  minHeight: "44px",
                  borderBottom: "1px solid #E5E7EB",
                  padding: "7px 0",
                  boxSizing: "border-box",
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                }}
              >
                {/* NUMBER */}
                <div style={{ fontSize: "11px", color: "#6B7280" }}>
                  {index + 1}.
                </div>

                {/* MEDICINE */}
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#20242A",
                    lineHeight: 1.3,
                  }}
                >
                  {medicineName}
                </div>

                {/* INSTRUCTION */}
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "11px",
                    color: "#666666",
                    lineHeight: 1.35,
                  }}
                >
                  {instruction}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLEXIBLE SPACE */}
      <div style={{ minHeight: "60px" }} />

      {/* =====================================================
          REMARK + FOLLOW UP
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 220px",
          gap: "12px",
          marginTop: "12px",
        }}
      >
        <InfoBox title="REMARK" value={remark || "—"} />

        <InfoBox
          title="NEXT FOLLOW-UP"
          value={followUpDate ? dayjs(followUpDate).format("DD-MMM-YYYY") : "—"}
        />
      </div>

      {/* =====================================================
          QR + SIGNATURE
      ===================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "20px",
          minHeight: "105px",
        }}
      >
        {/* QR */}
        <div
          style={{
            width: "80px",
            height: "90px",
            border: "1px solid #DDE3E1",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR"
              style={{
                width: "70px",
                height: "70px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                fontSize: "9px",
                lineHeight: 1.4,
                color: "#9CA3AF",
              }}
            >
              QR Not
              <br />
              Available
            </div>
          )}
        </div>

        {/* SIGNATURE */}
        <div style={{ width: "230px", textAlign: "right" }}>
          <div
            style={{
              fontSize: "10px",
              color: "#6B7280",
              marginBottom: "28px",
            }}
          >
            Doctor&apos;s Signature
          </div>

          <div
            style={{
              borderTop: "1px solid #596575",
              paddingTop: "7px",
            }}
          >
            <div style={{ fontSize: "14px", fontWeight: 700 }}>
              {doctorName}
            </div>

            {doctor?.qualification && (
              <div
                style={{
                  marginTop: "2px",
                  fontSize: "10px",
                  color: "#596575",
                }}
              >
                {doctor.qualification}
              </div>
            )}

            {doctor?.specialization && (
              <div
                style={{
                  marginTop: "2px",
                  fontSize: "10px",
                  color: "#07876A",
                  fontWeight: 600,
                }}
              >
                {doctor.specialization}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM LINE
      ===================================================== */}

      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid #E1E5E4",
          paddingTop: "10px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "9px",
            color: "#596575",
            lineHeight: 1.5,
          }}
        >
          {doctor?.mobile && <>For Appointment: +91 {doctor.mobile}</>}

          {doctor?.mobile && hospitalAddress && "  |  "}

          {hospitalAddress}
        </div>

        <div
          style={{
            marginTop: "7px",
            fontSize: "8px",
            fontStyle: "italic",
            color: "#9CA3AF",
          }}
        >
          This prescription is digitally generated and is valid as prescribed by
          the doctor.
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PATIENT CELL
// ============================================================

function PatientCell({ label, value }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 10px 8px", // bottom padding = text ko upar lift karta hai
        fontSize: "11px",
        lineHeight: "14px",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <span style={{ color: "#657180", fontWeight: 600, whiteSpace: "pre" }}>
        {label}:{" "}
      </span>
      <span style={{ color: "#172033", fontWeight: 700 }}>
        {value || "—"}
      </span>
    </div>
  );
}

// ============================================================
// INFO BOX
// ============================================================

function InfoBox({ title, value }) {
  return (
    <div
      style={{
        minHeight: "72px",
        border: "1px solid #DDE6E3",
        borderRadius: "9px",
        padding: "11px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          color: "#087D68",
          fontSize: "10px",
          fontWeight: 700,
          marginBottom: "10px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "11px",
          color: "#596575",
          whiteSpace: "pre-wrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ============================================================
// DURATION
// 4 -> 4 days
// "4 days" -> 4 days
// ============================================================

function formatDuration(value) {
  if (!value) return "";

  const text = String(value).trim();

  if (/^\d+$/.test(text)) {
    return `${text} days`;
  }

  return text;
}