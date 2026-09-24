"use client";

import React from "react";
import dayjs from "dayjs";

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
  compact = false,
}) {
  const validMedicines = medicines.filter((row) => row?.name?.trim());

  const hospital =
    doctor?.hospital_detail?.[0] ||
    doctor?.hospitalDetail?.[0] ||
    {};

  const availability = doctor?.availability?.[0] || {};

  const doctorName = doctor?.name
    ? doctor.name.toLowerCase().startsWith("dr")
      ? doctor.name
      : `Dr. ${doctor.name}`
    : "Doctor";

  const hospitalName =
    hospital?.hospitalName ||
    hospital?.hospital_name ||
    "Hospital";

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
        width: compact ? "100%" : "794px",
        maxWidth: compact ? "100%" : "794px",
        minHeight: compact ? "auto" : "1120px",
        backgroundColor: "#ffffff",
        padding: compact ? "16px 18px" : "30px 36px 26px",
        boxSizing: "border-box",
        color: C.ink,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: compact ? "10px" : "16px",
          paddingBottom: compact ? "10px" : "14px",
          borderBottom: `1px solid ${C.muted}`,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: compact ? "12.5px" : "16px",
              fontWeight: 700,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {doctorName}
          </div>

          {doctor?.qualification && (
            <div
              style={{
                fontSize: compact ? "10.5px" : "13px",
                color: C.muted,
                lineHeight: 1.45,
              }}
            >
              {doctor.qualification}
            </div>
          )}

          <div
            style={{
              fontSize: compact ? "10.5px" : "13px",
              color: C.muted,
              lineHeight: 1.45,
              wordBreak: "break-word",
            }}
          >
            Registration Number:{" "}
            {doctor?.registration_number || "—"}
          </div>
        </div>

        <div
          style={{
            width: "1px",
            backgroundColor: "rgba(0,0,0,0.14)",
            flexShrink: 0,
          }}
        />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontSize: compact ? "12.5px" : "16px",
              fontWeight: 700,
              color: C.brand,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {hospitalName}
          </div>

          {hospitalAddress && (
            <div
              style={{
                marginLeft: "auto",
                maxWidth: compact ? "260px" : "360px",
                fontSize: compact ? "10px" : "12px",
                color: C.muted,
                lineHeight: 1.45,
                wordBreak: "break-word",
              }}
            >
              {hospitalAddress}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: compact ? "10px" : "14px",
          border: `1px solid ${C.border}`,
          borderRadius: "7px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            backgroundColor: C.brandTint,
            padding: compact ? "6px 9px" : "8px 12px",
            color: C.brand,
            fontWeight: 700,
            fontSize: compact ? "11px" : "13px",
            lineHeight: 1.4,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          Patient Information
        </div>

        <InfoRow bordered compact={compact}>
          <InfoCell
            compact={compact}
            label="Patient Name"
            value={patient?.name}
          />

          <InfoCell
            compact={compact}
            label="Age"
            value={patient?.age}
          />

          <InfoCell
            compact={compact}
            label="Date/Time"
            value={dateNow}
          />
        </InfoRow>

        <InfoRow compact={compact}>
          <InfoCell
            compact={compact}
            label="Gender"
            value={patient?.gender}
          />

          <InfoCell
            compact={compact}
            label="Weight"
            value={
              patient?.weight
                ? `${patient.weight} kg`
                : null
            }
          />

          <InfoCell
            compact={compact}
            label="Height"
            value={
              patient?.height
                ? `${patient.height} cm`
                : null
            }
          />
        </InfoRow>
      </div>

      <div
        style={{
          marginTop: compact ? "11px" : "16px",
          fontSize: compact ? "11px" : "14px",
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        <span
          style={{
            fontWeight: 700,
          }}
        >
          Diagnosis :-{" "}
        </span>

        <span
          style={{
            color: diagnosis ? C.ink : C.faint,
          }}
        >
          {diagnosis || "No diagnosis added."}
        </span>
      </div>

      {validMedicines.length > 0 && (
        <div
          style={{
            marginTop: compact ? "12px" : "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: compact ? "5px" : "8px",
            }}
          >
            <span
              style={{
                color: C.rx,
                fontFamily: "Georgia, serif",
                fontSize: compact ? "22px" : "28px",
                fontStyle: "italic",
                lineHeight: 1.1,
              }}
            >
              ℞
            </span>

            <span
              style={{
                fontSize: compact ? "10px" : "12px",
                fontWeight: 700,
                letterSpacing: compact ? "0.3px" : "0.6px",
                color: C.faint,
                lineHeight: 1.7,
              }}
            >
              PRESCRIPTION
            </span>
          </div>

          {validMedicines.map((medicine, index) => {
            const medicineName = [
              medicine?.name,
              medicine?.dose,
              medicine?.unit,
            ]
              .filter(Boolean)
              .join(" ");

            const instruction = [
              medicine?.freq,
              medicine?.instr,
              medicine?.duration
                ? formatDuration(medicine.duration)
                : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return (
              <div
                key={`pdf-med-${index}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: compact
                    ? "20px minmax(0,1fr) minmax(110px,40%)"
                    : "30px minmax(0,1fr) minmax(0,46%)",
                  columnGap: compact ? "6px" : "8px",
                  alignItems: "center",
                  padding: compact
                    ? "7px 0"
                    : "11px 0",
                  borderBottom: `1px solid ${C.line}`,
                  breakInside: "avoid",
                  pageBreakInside: "avoid",
                }}
              >
                <div
                  style={{
                    fontSize: compact ? "10px" : "13px",
                    color: C.faint,
                    lineHeight: 1.4,
                  }}
                >
                  {index + 1}.
                </div>

                <div
                  style={{
                    fontSize: compact ? "11px" : "15px",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                    minWidth: 0,
                  }}
                >
                  {medicineName}
                </div>

                <div
                  style={{
                    textAlign: "right",
                    fontSize: compact ? "10px" : "13px",
                    color: C.muted,
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                    minWidth: 0,
                  }}
                >
                  {instruction || "—"}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          flex: compact ? "none" : 1,
          minHeight: compact ? "16px" : "40px",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: compact
            ? "minmax(0,1fr) minmax(120px,32%)"
            : "minmax(0,1fr) 220px",
          gap: compact ? "10px" : "16px",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <div>
          <FieldLabel compact={compact}>
            Remark
          </FieldLabel>

          <FieldBox
            compact={compact}
            muted={!remark}
          >
            {remark || "Not provided"}
          </FieldBox>
        </div>

        <div>
          <FieldLabel compact={compact}>
            Next Follow-up
          </FieldLabel>

          <FieldBox
            compact={compact}
            muted={!followUpDate}
          >
            {followUpDate
              ? dayjs(followUpDate).format(
                  "DD-MMM-YYYY"
                )
              : "Not provided"}
          </FieldBox>
        </div>
      </div>

      <div
        style={{
          height: "1px",
          backgroundColor: C.line,
          marginTop: compact ? "14px" : "20px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "12px",
          marginTop: compact ? "12px" : "16px",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: compact ? "8px" : "12px",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: compact ? "64px" : "88px",
              height: compact ? "64px" : "88px",
              flexShrink: 0,
              padding: compact ? "4px" : "5px",
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
                  paddingTop: compact
                    ? "20px"
                    : "28px",
                  fontSize: compact
                    ? "8px"
                    : "10px",
                  lineHeight: 1.4,
                  textAlign: "center",
                  color: C.faint,
                }}
              >
                QR Not Available
              </div>
            )}
          </div>

          {qrImage && (
            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: compact
                    ? "10.5px"
                    : "13px",
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}
              >
                Connect with Doctor
              </div>

              <div
                style={{
                  fontSize: compact
                    ? "9px"
                    : "11px",
                  color: C.muted,
                  lineHeight: 1.4,
                }}
              >
                Scan QR code
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            width: compact ? "180px" : "240px",
            maxWidth: "45%",
            textAlign: "right",
            minWidth: 0,
          }}
        >
          <div
            style={{
              height: compact ? "24px" : "36px",
            }}
          />

          <div
            style={{
              borderTop: `1px solid ${C.muted}`,
              paddingTop: compact
                ? "6px"
                : "8px",
            }}
          >
            <div
              style={{
                fontSize: compact
                  ? "11px"
                  : "14px",
                fontWeight: 700,
                lineHeight: 1.4,
                wordBreak: "break-word",
              }}
            >
              {doctorName}
            </div>

            {doctor?.specialization && (
              <div
                style={{
                  fontSize: compact
                    ? "9.5px"
                    : "12px",
                  color: C.brand,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                }}
              >
                {doctor.specialization}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: compact ? "12px" : "16px",
          paddingTop: compact ? "8px" : "10px",
          borderTop: `1px solid ${C.line}`,
          textAlign: "center",
          breakInside: "avoid",
          pageBreakInside: "avoid",
        }}
      >
        <div
          style={{
            fontSize: compact ? "8.5px" : "10px",
            color: C.muted,
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}
        >
          {doctor?.mobile && (
            <>
              For Appointment:{" "}
              <b
                style={{
                  color: C.ink,
                }}
              >
                +91 {doctor.mobile}
              </b>
            </>
          )}

          {doctor?.mobile &&
            hospitalAddress &&
            " | "}

          {hospitalAddress}
        </div>

        {availability?.startTime &&
          availability?.endTime && (
            <div
              style={{
                fontSize: compact
                  ? "8.5px"
                  : "10px",
                color: C.muted,
                lineHeight: 1.5,
              }}
            >
              Timings: {availability.startTime} -{" "}
              {availability.endTime}

              {availability?.day
                ? ` | ${availability.day}`
                : ""}
            </div>
          )}

        <div
          style={{
            marginTop: "4px",
            fontSize: compact ? "8px" : "9px",
            fontStyle: "italic",
            color: C.faint,
            lineHeight: 1.5,
          }}
        >
          This prescription is digitally generated and
          is valid as prescribed by the doctor.
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  children,
  bordered = false,
  compact = false,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact
          ? "minmax(0,1.25fr) minmax(65px,0.65fr) minmax(0,1.3fr)"
          : "1.25fr 0.75fr 1.4fr",
        borderBottom: bordered
          ? `1px solid ${C.line}`
          : "none",
      }}
    >
      {children}
    </div>
  );
}

function InfoCell({
  label,
  value,
  compact = false,
}) {
  return (
    <div
      style={{
        padding: compact
          ? "7px 8px"
          : "9px 12px",
        fontSize: compact
          ? "10px"
          : "13px",
        lineHeight: 1.4,
        minWidth: 0,
        wordBreak: "break-word",
      }}
    >
      <span
        style={{
          color: C.label,
          fontWeight: 600,
        }}
      >
        {label}:{" "}
      </span>

      <span
        style={{
          color: C.ink,
          fontWeight: 700,
        }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function FieldLabel({
  children,
  compact = false,
}) {
  return (
    <div
      style={{
        marginBottom: compact
          ? "4px"
          : "6px",
        fontSize: compact
          ? "9.5px"
          : "12px",
        fontWeight: 600,
        color: C.label,
        lineHeight: 1.4,
      }}
    >
      {children}
    </div>
  );
}

function FieldBox({
  children,
  muted = false,
  compact = false,
}) {
  return (
    <div
      style={{
        padding: compact
          ? "7px 9px"
          : "10px 12px",
        minHeight: compact
          ? "34px"
          : "42px",
        boxSizing: "border-box",
        border: `1px solid ${C.border}`,
        borderRadius: "6px",
        fontSize: compact
          ? "10px"
          : "13px",
        lineHeight: 1.4,
        color: muted
          ? C.faint
          : C.ink,
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

  if (/^\d+$/.test(text)) {
    return `${text} days`;
  }

  return text;
}