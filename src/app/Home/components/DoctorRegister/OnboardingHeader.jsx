"use client";

import * as React from "react";

import {
  Box,
  Stack,
  Typography,
} from "@mui/material";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const COLORS = {
  primary: "#1B6E4F",
  primaryLight: "#EAF6F0",
  primarySoft: "#F7FBF9",
  border: "#E4EAE7",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  error: "#E0483C",
};

export default function OnboardingHeader() {
  return (
    <Box sx={{ width: "100%" }}>
    

      {/* INFO BAR */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          px: {
            xs: 1,
            sm: 1.3,
          },

          py: {
            xs: 0.8,
            sm: 0.9,
          },

          mb: 1.75,

          borderRadius: "9px",

          bgcolor: COLORS.primarySoft,

          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Box
          sx={{
            width: 26,
            height: 26,
            flexShrink: 0,

            borderRadius: "7px",

            bgcolor: COLORS.primaryLight,
            color: COLORS.primary,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <InfoOutlinedIcon
            sx={{
              fontSize: 15,
            }}
          />
        </Box>

        <Typography
          sx={{
            minWidth: 0,

            color: COLORS.textSecondary,

            fontSize: {
              xs: "10px",
              sm: "11.5px",
            },

            lineHeight: 1.45,
          }}
        >
          <Box
            component="span"
            sx={{
              color: COLORS.textPrimary,
              fontWeight: 700,
            }}
          >
            Why we need this:
          </Box>{" "}
          Your details help us verify your professional identity and create
          your doctor account after approval.
        </Typography>
      </Stack>
    </Box>
  );
}