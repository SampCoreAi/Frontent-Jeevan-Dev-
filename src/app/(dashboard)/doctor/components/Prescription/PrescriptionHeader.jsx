import React from "react";
import {
  Box,
  Typography,
  Divider,
} from "@mui/material";

export default function PrescriptionHeader({ doctor = {} }) {
  // ============================================
  // HOSPITAL DATA
  // ============================================

  const hospital = doctor?.hospital_detail?.[0] || null;

  // ============================================
  // DOCTOR NAME
  // ============================================

  const doctorName = doctor?.name || "";

  const doctorTitle = doctorName
    ? doctorName.toLowerCase().startsWith("dr")
      ? doctorName
      : `Dr. ${doctorName}`
    : "Doctor";

  // ============================================
  // QUALIFICATION
  // Specialization removed
  // ============================================

  const qualificationText = doctor?.qualification || "";

  // ============================================
  // REGISTRATION NUMBER
  // ============================================

  const registrationNumber =
    doctor?.registration_number || "";

  // ============================================
  // HOSPITAL ADDRESS
  // ============================================

  const hospitalAddress = [
    hospital?.flatPlotNo,
    hospital?.buildingSociety,
    hospital?.streetName,
    hospital?.areaLocality,
    hospital?.landmark,
    hospital?.district,
    hospital?.city,
    hospital?.state,
    hospital?.pinCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      {/* =========================================
          HEADER
      ========================================== */}

      <Box
        sx={{
          display: "flex",

          flexDirection: {
            xs: "column",
            sm: "row",
          },

          justifyContent: "space-between",

          alignItems: {
            xs: "flex-start",
            sm: "center",
          },

          gap: {
            xs: 1.2,
            sm: 2,
          },

          pb: {
            xs: 1.2,
            sm: 1.5,
          },
        }}
      >
        {/* =========================================
            LEFT SIDE - DOCTOR DETAILS
        ========================================== */}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* DOCTOR NAME */}

          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
              },

              fontWeight: 700,

              color: "text.primary",

              lineHeight: 1.25,
            }}
          >
            {doctorTitle}
          </Typography>

          {/* QUALIFICATION */}

          {qualificationText && (
            <Typography
              sx={{
                mt: 0.25,

                fontSize: {
                  xs: "12px",
                  sm: "13px",
                },

                color: "text.secondary",

                lineHeight: 1.4,
              }}
            >
              {qualificationText}
            </Typography>
          )}

          {/* REGISTRATION NUMBER */}

          <Typography
            sx={{
              mt: 0.2,

              fontSize: {
                xs: "12px",
                sm: "13px",
              },

              color: "text.secondary",

              lineHeight: 1.4,
            }}
          >
            Registration Number: {registrationNumber || "—"}
          </Typography>
        </Box>

        {/* =========================================
            CENTER DIVIDER - DESKTOP
        ========================================== */}

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },

            borderColor: "divider",

            mx: 1,
          }}
        />

        {/* =========================================
            RIGHT SIDE - HOSPITAL
        ========================================== */}

        <Box
          sx={{
            flex: 1,

            minWidth: 0,

            width: {
              xs: "100%",
              sm: "auto",
            },

            textAlign: {
              xs: "left",
              sm: "right",
            },
          }}
        >
          {/* HOSPITAL NAME */}

          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
              },

              fontWeight: 700,

              color: "primary.main",

              lineHeight: 1.25,
            }}
          >
            {hospital?.hospitalName || "Hospital"}
          </Typography>

          {/* HOSPITAL ADDRESS */}

          {hospitalAddress && (
            <Typography
              sx={{
                mt: 0.4,

                ml: {
                  xs: 0,
                  sm: "auto",
                },

                maxWidth: {
                  xs: "100%",
                  sm: "380px",
                },

                fontSize: {
                  xs: "11px",
                  sm: "12px",
                },

                color: "text.secondary",

                lineHeight: 1.4,

                wordBreak: "break-word",
              }}
            >
              {hospitalAddress}
            </Typography>
          )}
        </Box>
      </Box>

      {/* =========================================
          BOTTOM GREEN LINE
      ========================================== */}

      <Box
        sx={{
          width: "100%",

          height: "1px",

          bgcolor: "primary.main",

          opacity: 0.55,

          mb: {
            xs: 1.4,
            sm: 1.7,
          },
        }}
      />
    </Box>
  );
}