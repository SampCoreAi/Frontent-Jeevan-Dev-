import React from "react";
import {
  Box,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

export default function PrescriptionHeader({ doctor }) {
  // ============================================
  // HOSPITAL DATA
  // ============================================

  const hospital = doctor?.hospital_detail?.[0];

  // ============================================
  // DOCTOR NAME
  // Dr. already hai to dobara add nahi hoga
  // ============================================

  const doctorTitle = doctor?.name
    ? doctor.name.toLowerCase().startsWith("dr")
      ? doctor.name
      : `Dr. ${doctor.name}`
    : "Doctor";

  // ============================================
  // QUALIFICATION + SPECIALIZATION
  // null values automatically remove
  // ============================================

  const qualificationText = [
    doctor?.qualification,
    doctor?.specialization,
  ]
    .filter(Boolean)
    .join(" • ");

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
      {/* =====================================================
          HEADER
      ====================================================== */}

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
            xs: 1.5,
            sm: 2,
          },

          pb: {
            xs: 1.4,
            sm: 1.7,
          },
        }}
      >
        {/* =================================================
            LEFT SIDE
            DOCTOR DETAILS
        ================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",

            gap: {
              xs: 1.2,
              sm: 1.4,
            },

            flex: 1,
            minWidth: 0,
          }}
        >
          {/* =========================
              DOCTOR ICON
          ========================== */}

          <Avatar
            sx={{
              width: {
                xs: 40,
                sm: 46,
              },

              height: {
                xs: 40,
                sm: 46,
              },

              bgcolor: "secondary.light",
              color: "primary.main",

              border: "1px solid",
              borderColor: "divider",

              flexShrink: 0,
            }}
          >
            <LocalHospitalOutlinedIcon
              sx={{
                fontSize: {
                  xs: 20,
                  sm: 23,
                },
              }}
            />
          </Avatar>

          {/* =========================
              DOCTOR INFORMATION
          ========================== */}

          <Box
            sx={{
              minWidth: 0,
            }}
          >
            {/* Doctor Name */}

            <Typography
              sx={{
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                },

                fontWeight: 700,

                color: "text.primary",

                lineHeight: 1.2,
              }}
            >
              {doctorTitle}
            </Typography>

            {/* Qualification + Specialization */}

            {qualificationText && (
              <Typography
                sx={{
                  mt: 0.25,

                  fontSize: {
                    xs: "10px",
                    sm: "11px",
                  },

                  color: "text.secondary",

                  lineHeight: 1.4,
                }}
              >
                {qualificationText}
              </Typography>
            )}

            {/* Registration Number */}

            {doctor?.registration_number && (
              <Typography
                sx={{
                  mt: 0.15,

                  fontSize: {
                    xs: "9px",
                    sm: "10px",
                  },

                  color: "text.disabled",

                  lineHeight: 1.4,
                }}
              >
                Reg. No: {doctor.registration_number}
              </Typography>
            )}
          </Box>
        </Box>

        {/* =================================================
            CENTER DIVIDER
            DESKTOP ONLY
        ================================================== */}

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

        {/* =================================================
            RIGHT SIDE
            HOSPITAL DETAILS
        ================================================== */}

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
          {/* =========================
              HOSPITAL NAME
          ========================== */}

          <Typography
            sx={{
              fontSize: {
                xs: "14px",
                sm: "16px",
              },

              fontWeight: 700,

              color: "primary.main",

              lineHeight: 1.2,
            }}
          >
            {hospital?.hospitalName || "Hospital"}
          </Typography>

          {/* =========================
              HOSPITAL ADDRESS
          ========================== */}

          {hospitalAddress && (
            <Typography
              sx={{
                mt: 0.45,

                ml: {
                  xs: 0,
                  sm: "auto",
                },

                maxWidth: {
                  xs: "100%",
                  sm: "330px",
                },

                fontSize: {
                  xs: "9px",
                  sm: "10px",
                },

                color: "text.secondary",

                lineHeight: 1.45,

                wordBreak: "break-word",
              }}
            >
              {hospitalAddress}
            </Typography>
          )}
        </Box>
      </Box>

      {/* =====================================================
          BOTTOM GREEN DIVIDER
      ====================================================== */}

      <Box
        sx={{
          width: "100%",

          height: "1px",

          bgcolor: "primary.main",

          opacity: 0.55,

          mb: {
            xs: 1.5,
            sm: 2,
          },
        }}
      />
    </Box>
  );
}