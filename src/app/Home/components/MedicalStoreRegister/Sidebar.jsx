
"use client";

import * as React from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
  LinearProgress,
} from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

const COLORS = {
  primary: "#07876A",
  primaryDark: "#066F58",
  primaryLight: "#EAF7F3",
  primarySoft: "#F5FAF8",
  border: "#E1E9E6",
  line: "#DCE5E2",
  text: "#172033",
  muted: "#74807B",
  white: "#FFFFFF",
  inactive: "#F2F5F4",
};

const steps = [
  {
    id: 1,
    title: "Store Information",
    description: "Store identity and location",
    icon: StorefrontOutlinedIcon,
  },
  {
    id: 2,
    title: "License & Business",
    description: "License and legal details",
    icon: BadgeOutlinedIcon,
  },
  {
    id: 3,
    title: "Address Details",
    description: "Registered business address",
    icon: SettingsOutlinedIcon,
  },
  {
    id: 4,
    title: "Documents",
    description: "Upload required documents",
    icon: DescriptionOutlinedIcon,
  },
  {
    id: 5,
    title: "Verification",
    description: "Review and submit details",
    icon: VerifiedUserOutlinedIcon,
  },
];

export default function Sidebar({
  activeStep = 1,
  onStepChange,
}) {
  const progress = (activeStep / steps.length) * 100;

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: { xs: 1.5, sm: 2, md: 2.2 },
        border: `1px solid ${COLORS.border}`,
        borderRadius: { xs: "14px", md: "16px" },
        bgcolor: COLORS.white,
        boxShadow: "0 8px 28px rgba(23,32,51,0.055)",
      }}
    >
      {/* HEADER */}

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.3}
        sx={{ mb: { xs: 1.5, md: 2.2 } }}
      >
        <Box
          sx={{
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            bgcolor: COLORS.primaryLight,
            color: COLORS.primary,
            flexShrink: 0,
          }}
        >
          <StorefrontOutlinedIcon sx={{ fontSize: 23 }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 800,
              color: COLORS.text,
              lineHeight: 1.4,
            }}
          >
            Pharmacy Registration
          </Typography>

          <Typography
            sx={{
              mt: 0.3,
              fontSize: "10.5px",
              color: COLORS.muted,
            }}
          >
            Complete your store profile
          </Typography>
        </Box>
      </Stack>

      {/* PROGRESS */}

      <Box
        sx={{
          p: { xs: 1.2, md: 1.5 },
          mb: { xs: 1.2, md: 2 },
          bgcolor: COLORS.primarySoft,
          borderRadius: "11px",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: COLORS.text,
            }}
          >
            Registration progress
          </Typography>

          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 800,
              color: COLORS.primary,
            }}
          >
            {activeStep} of {steps.length}
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: "20px",
            bgcolor: "#E0EAE6",
            "& .MuiLinearProgress-bar": {
              borderRadius: "20px",
              bgcolor: COLORS.primary,
              transition: "transform .3s ease",
            },
          }}
        />

     
      </Box>

      {/* STEP LIST */}

      <Box
        sx={{
          display: { xs: "flex", md: "block" },
          gap: { xs: 0.75, md: 0 },
          overflowX: { xs: "auto", md: "visible" },
          pb: { xs: 0.5, md: 0 },
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#D7E5DF",
            borderRadius: 4,
          },
        }}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = step.id === activeStep;
          const completed = step.id < activeStep;

          return (
            <Box
              key={step.id}
              sx={{
                position: "relative",
                flex: { xs: "0 0 auto", md: "initial" },
                minWidth: { xs: 148, md: "auto" },
                pb: {
                  xs: 0,
                  md: index === steps.length - 1 ? 0 : 1,
                },
              }}
            >
              {/* CONNECTOR */}

              {index !== steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    display: { xs: "none", md: "block" },
                    left: 22,
                    top: 48,
                    bottom: 0,
                    width: "2px",
                    bgcolor: completed
                      ? COLORS.primary
                      : COLORS.line,
                    opacity: completed ? 0.65 : 1,
                  }}
                />
              )}

              {/* STEP ITEM */}

              <Box
                component="button"
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => onStepChange?.(step.id)}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 0.8, md: 1.2 },
                  width: "100%",
                  minHeight: { xs: 56, md: 64 },
                  p: { xs: 0.8, md: 1.1 },
                  textAlign: "left",
                  border: "1px solid",
                  borderColor: active
                    ? "#B7E3D5"
                    : "transparent",
                  borderRadius: "12px",
                  bgcolor: active
                    ? COLORS.primaryLight
                    : "transparent",
                  cursor: "pointer",
                  font: "inherit",
                  transition: "all .2s ease",

                  "&:hover": {
                    bgcolor: active
                      ? COLORS.primaryLight
                      : COLORS.primarySoft,
                    borderColor: active
                      ? "#B7E3D5"
                      : COLORS.border,
                  },

                  "&:focus-visible": {
                    outline: `2px solid ${COLORS.primary}`,
                    outlineOffset: 2,
                  },
                }}
              >
                {/* STEP ICON */}

                <Box
                  sx={{
                    width: { xs: 34, md: 44 },
                    height: { xs: 34, md: 44 },
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: { xs: "10px", md: "12px" },
                    bgcolor:
                      active || completed
                        ? COLORS.primary
                        : COLORS.inactive,
                    color:
                      active || completed
                        ? COLORS.white
                        : COLORS.muted,
                    boxShadow: active
                      ? "0 4px 10px rgba(7,135,106,.18)"
                      : "none",
                    transition: "all .2s ease",
                  }}
                >
                  {completed ? (
                    <CheckRoundedIcon sx={{ fontSize: 22 }} />
                  ) : (
                    <Icon sx={{ fontSize: 21 }} />
                  )}
                </Box>

                {/* STEP CONTENT */}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "10.5px", md: "12px" },
                      fontWeight: active ? 800 : 650,
                      color: active
                        ? COLORS.primaryDark
                        : COLORS.text,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    sx={{
                      display: { xs: "none", md: "block" },
                      mt: 0.4,
                      fontSize: "10px",
                      lineHeight: 1.4,
                      color: COLORS.muted,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>

                {/* ACTIVE INDICATOR */}

                {active && (
                  <ArrowForwardIosRoundedIcon
                    sx={{
                      fontSize: 13,
                      color: COLORS.primary,
                      mr: 0.3,
                    }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* SECURITY CARD */}

      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          mt: 2.2,
          p: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.2,
          bgcolor: "#F8FAF9",
          border: `1px solid ${COLORS.border}`,
          borderRadius: "12px",
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "10px",
            bgcolor: COLORS.primaryLight,
            color: COLORS.primary,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 750,
              color: COLORS.text,
            }}
          >
            Your information is secure
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: "10px",
              lineHeight: 1.6,
              color: COLORS.muted,
            }}
          >
          Used for registration
            and verification.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
