"use client";
import React from "react";
import dayjs from "dayjs";

/**
 * Prescription PDF view (A4 @ 96dpi = 794 x 1123)
 * - Screen wale design jaisa look
 * - "Diagnosis: ..." ek line me
 * - Medicines: naam left, "freq · instr · duration" right (form / Add Medicine hata diya)
 * - Koi fixed height / ellipsis / overflow hidden nahi -> download me text upar-niche nahi hota
 */

const C = {
  ink: "#172033",
  muted: "#596575",
  label: "#657180",
  faint: "#8A949F",
  line: "#E5E7EB",
  border: "#D6DCDA",
  brand: "#07876A",
  brandTint: "#EDF7F2",
  rx: "#5B2AA8",
};

const FONT = "Inter, Arial, Helvetica, sans-serif";

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
  const validMedicines = medicines.filter((row) => row?.name?.trim());

  const hospital =
    doctor?.hospital_detail?.[0] || doctor?.hospitalDetail?.[0] || {};
  const availability = doctor?.availability?.[0] || {};

  const doctorName = doctor?.name
    ? doctor.name.toLowerCase().startsWith("dr")
      ? doctor.name
      : `Dr. ${doctor.name}`
    : "Doctor";

  const hospitalName =
    hospital?.hospitalName || hospital?.hospital_name || "Hospital";

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
        minHeight: "1120px",
        backgroundColor: "#ffffff",
        padding: "30px 36px 26px",
        boxSizing: "border-box",
        color: C.ink,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ───────── Header ───────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "16px",
          paddingBottom: "14px",
          borderBottom: `1px solid ${C.muted}`,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.5 }}>
            {doctorName}
          </div>
          {doctor?.qualification && (
            <div style={{ fontSize: "13px", color: C.muted, lineHeight: 1.5 }}>
              {doctor.qualification}
            </div>
          )}
          <div style={{ fontSize: "13px", color: C.muted, lineHeight: 1.5 }}>
            Registration Number: {doctor?.registration_number || "—"}
          </div>
        </div>

        <div style={{ width: "1px", backgroundColor: "rgba(0,0,0,0.14)" }} />

        <div style={{ flex: 1, minWidth: 0, textAlign: "right" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: C.brand,
              lineHeight: 1.5,
            }}
          >
            {hospitalName}
          </div>
          {hospitalAddress && (
            <div
              style={{
                marginLeft: "auto",
                maxWidth: "360px",
                fontSize: "12px",
                color: C.muted,
                lineHeight: 1.55,
                wordBreak: "break-word",
              }}
            >
              {hospitalAddress}
            </div>
          )}
        </div>
      </div>

      {/* ───────── Patient information ───────── */}
      <div
        style={{
          marginTop: "14px",
          border: `1px solid ${C.border}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: C.brandTint,
            padding: "8px 12px",
            color: C.brand,
            fontWeight: 700,
            fontSize: "13px",
            lineHeight: 1.5,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          Patient Information
        </div>

        <InfoRow bordered>
          <InfoCell label="Patient Name" value={patient?.name} />
          <InfoCell label="Age" value={patient?.age} />
          <InfoCell label="Date/Time" value={dateNow} />
        </InfoRow>

        <InfoRow>
          <InfoCell label="Gender" value={patient?.gender} />
          <InfoCell
            label="Weight"
            value={patient?.weight ? `${patient.weight} kg` : null}
          />
          <InfoCell
            label="Height"
            value={patient?.height ? `${patient.height} cm` : null}
          />
        </InfoRow>
      </div>

      {/* ───────── Diagnosis (ek line: label + jo doctor ne likha) ───────── */}
      <div
        style={{
          marginTop: "16px",
          fontSize: "14px",
          lineHeight: 1.6,
          wordBreak: "break-word",
        }}
      >
        <span style={{ fontWeight: 700 }}>Diagnosis :- </span>
        <span style={{ color: diagnosis ? C.ink : C.faint }}>
          {diagnosis || "No diagnosis added."}
        </span>
      </div>

      {/* ───────── Prescription ───────── */}
      {validMedicines.length > 0 && (
        <div style={{ marginTop: "18px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <span
              style={{
                color: C.rx,
                fontFamily: "Georgia, serif",
                fontSize: "28px",
                fontStyle: "italic",
                lineHeight: 1.15,
              }}
            >
              ℞
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.6px",
                color: C.faint,
                lineHeight: 1.8,
              }}
            >
              PRESCRIPTION
            </span>
          </div>

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
                  gridTemplateColumns: "30px minmax(0,1fr) minmax(0,46%)",
                  columnGap: "8px",
                  alignItems: "center",
                  padding: "11px 0",
                  borderBottom: `1px solid ${C.line}`,
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                }}
              >
                <div style={{ fontSize: "13px", color: C.faint, lineHeight: 1.5 }}>
                  {index + 1}.
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  {medicineName}
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: "13px",
                    color: C.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {instruction || "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* spacer: neeche ka part hamesha page ke bottom me rahe */}
      <div style={{ flex: 1, minHeight: "40px" }} />

      {/* ───────── Remark + Next follow-up ───────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 220px",
          gap: "16px",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <div>
          <FieldLabel>Remark</FieldLabel>
          <FieldBox muted={!remark}>{remark || "Not provided"}</FieldBox>
        </div>
        <div>
          <FieldLabel>Next Follow-up</FieldLabel>
          <FieldBox muted={!followUpDate}>
            {followUpDate
              ? dayjs(followUpDate).format("DD-MMM-YYYY")
              : "Not provided"}
          </FieldBox>
        </div>
      </div>

      <div
        style={{
          height: "1px",
          backgroundColor: C.line,
          marginTop: "20px",
        }}
      />

      {/* ───────── QR + Signature ───────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "16px",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "88px",
              height: "88px",
              flexShrink: 0,
              padding: "5px",
              border: `1px solid ${C.border}`,
              borderRadius: "6px",
              boxSizing: "border-box",
            }}
          >
            {qrImage ? (
              <img
                src={qrImage}
                alt="Doctor QR"
                crossOrigin="anonymous"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  paddingTop: "28px",
                  fontSize: "10px",
                  lineHeight: 1.5,
                  textAlign: "center",
                  color: C.faint,
                }}
              >
                QR Not Available
              </div>
            )}
          </div>

          {qrImage && (
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.5 }}>
                Connect with Doctor
              </div>
              <div style={{ fontSize: "11px", color: C.muted, lineHeight: 1.5 }}>
                Scan QR code
              </div>
            </div>
          )}
        </div>

        <div style={{ width: "240px", textAlign: "right" }}>
         
          <div style={{ height: "36px" }} />
          <div style={{ borderTop: `1px solid ${C.muted}`, paddingTop: "8px" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.5 }}>
              {doctorName}
            </div>
            {doctor?.specialization && (
              <div
                style={{
                  fontSize: "12px",
                  color: C.brand,
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {doctor.specialization}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Footer ───────── */}
      <div
        style={{
          marginTop: "16px",
          paddingTop: "10px",
          borderTop: `1px solid ${C.line}`,
          textAlign: "center",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <div style={{ fontSize: "10px", color: C.muted, lineHeight: 1.6 }}>
          {doctor?.mobile && (
            <>
              For Appointment: <b style={{ color: C.ink }}>+91 {doctor.mobile}</b>
            </>
          )}
          {doctor?.mobile && hospitalAddress && "  |  "}
          {hospitalAddress}
        </div>

        {availability?.startTime && availability?.endTime && (
          <div style={{ fontSize: "10px", color: C.muted, lineHeight: 1.6 }}>
            Timings: {availability.startTime} - {availability.endTime}
            {availability?.day ? ` | ${availability.day}` : ""}
          </div>
        )}

        <div
          style={{
            marginTop: "4px",
            fontSize: "9px",
            fontStyle: "italic",
            color: C.faint,
            lineHeight: 1.6,
          }}
        >
          This prescription is digitally generated and is valid as prescribed by
          the doctor.
        </div>
      </div>
    </div>
  );
}

/* ───────── Small building blocks ───────── */

function InfoRow({ children, bordered = false }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.25fr 0.75fr 1.4fr",
        borderBottom: bordered ? `1px solid ${C.line}` : "none",
      }}
    >
      {children}
    </div>
  );
}

// label + value ek hi block me, padding se height -> clip nahi hota
function InfoCell({ label, value }) {
  return (
    <div
      style={{
        padding: "9px 12px",
        fontSize: "13px",
        lineHeight: 1.5,
        minWidth: 0,
        wordBreak: "break-word",
      }}
    >
      <span style={{ color: C.label, fontWeight: 600 }}>{label}: </span>
      <span style={{ color: C.ink, fontWeight: 700 }}>{value || "—"}</span>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div
      style={{
        marginBottom: "6px",
        fontSize: "12px",
        fontWeight: 600,
        color: C.label,
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}

function FieldBox({ children, muted = false }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        minHeight: "42px",
        boxSizing: "border-box",
        border: `1px solid ${C.border}`,
        borderRadius: "6px",
        fontSize: "13px",
        lineHeight: 1.5,
        color: muted ? C.faint : C.ink,
        wordBreak: "break-word",
      }}
    >
      {children}
    </div>
  );
}

function formatDuration(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d+$/.test(text)) return `${text} days`;
  return text;
}