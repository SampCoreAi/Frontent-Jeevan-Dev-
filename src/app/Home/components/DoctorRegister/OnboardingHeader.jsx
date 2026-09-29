"use client";

import * as React from "react";
import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const COLORS = {
  primary: "#1B6E4F",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  inputBorder: "#E1E7E3",
  dashedBorder: "#CBD8D1",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  error: "#E0483C",
  white: "#FFFFFF",
};

export default function OnboardingHeader() {
  return (
    <>
      {/* =========================
          HEADER
      ========================== */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{
          mb: { xs: 1.5, sm: 2 },
          width: "100%",
        }}
      >
        {/* LEFT SIDE */}
        <Stack
          direction="row"
          spacing={{ xs: 1.2, sm: 1.5 }}
          alignItems="center"
          sx={{
            width: { xs: "100%", sm: "auto" },
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: "9px",
              bgcolor: COLORS.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: COLORS.primary,
              flexShrink: 0,
            }}
          >
            <LocalHospitalIcon
              sx={{
                fontSize: { xs: 18, sm: 20 },
              }}
            />
          </Box>

          {/* Title */}
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                color: COLORS.primary,

                fontSize: {
                  xs: "0.95rem",
                  sm: "1.1rem",
                  md: "1.25rem",
                },

                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}
            >
              Doctor Verification &amp; Onboarding
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.25,
                color: COLORS.textSecondary,

                fontSize: {
                  sm: "0.7rem",
                  md: "0.76rem",
                },

                lineHeight: 1.4,

                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              Join our trusted network of healthcare professionals
            </Typography>
          </Box>
        </Stack>

        {/* RIGHT SIDE - REQUIRED FIELDS */}
        <Stack
          direction="row"
          spacing={0.7}
          alignItems="center"
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },

            ml: {
              sm: "auto !important",
            },

            flexShrink: 0,
          }}
        >
          <VerifiedUserOutlinedIcon
            sx={{
              color: COLORS.textSecondary,
              fontSize: {
                sm: 15,
                md: 17,
              },
            }}
          />

          <Typography
            variant="body2"
            sx={{
              color: COLORS.textSecondary,

              fontSize: {
                sm: "0.66rem",
                md: "0.72rem",
              },

              whiteSpace: "nowrap",
              lineHeight: 1.3,
            }}
          >
            All fields marked with{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.error,
                fontWeight: 700,
              }}
            >
              *
            </Box>{" "}
            are required
          </Typography>
        </Stack>
      </Stack>

      {/* =========================
          MOBILE SUBTITLE
      ========================== */}
      <Typography
        variant="body2"
        sx={{
          color: COLORS.textSecondary,
          fontSize: "0.68rem",
          lineHeight: 1.4,

          display: {
            xs: "block",
            sm: "none",
          },

          mb: 1,
        }}
      >
        Join our trusted network of healthcare professionals
      </Typography>

      {/* =========================
          MOBILE REQUIRED FIELDS
      ========================== */}
      <Stack
        direction="row"
        spacing={0.6}
        alignItems="center"
        sx={{
          display: {
            xs: "flex",
            sm: "none",
          },

          mb: 1.5,
        }}
      >
        <VerifiedUserOutlinedIcon
          sx={{
            color: COLORS.textSecondary,
            fontSize: 14,
          }}
        />

        <Typography
          variant="body2"
          sx={{
            color: COLORS.textSecondary,
            fontSize: "0.65rem",
            lineHeight: 1.3,
          }}
        >
          All fields marked with{" "}
          <Box
            component="span"
            sx={{
              color: COLORS.error,
              fontWeight: 700,
            }}
          >
            *
          </Box>{" "}
          are required
        </Typography>
      </Stack>

     
    </>
  );
}