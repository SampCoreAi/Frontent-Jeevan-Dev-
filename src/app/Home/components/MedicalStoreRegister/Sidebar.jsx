"use client";

import * as React from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const COLORS = {
  primary: "#07876A",
  primaryLight: "#EAF7F3",
  primarySoft: "#F5FAF8",
  border: "#E1E9E6",
  line: "#D8E2DE",
  text: "#172033",
  muted: "#74807B",
  white: "#FFFFFF",
  inactive: "#F0F3F2",
};

const steps = [
  {
    id: 1,
    title: "Store Information",
    description: "Store & location details",
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
    description: "Adress Form",
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
    description: "Review and submit",
    icon: VerifiedUserOutlinedIcon,
  },
];

export default function Sidebar({
  activeStep = 1,
  onStepChange,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: 2,
        borderRadius: "16px",
        border: `1px solid ${COLORS.border}`,
        bgcolor: COLORS.white,
      }}
    >
      <Box sx={{ mb: 2, px: 0.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 750,
                color: COLORS.text,
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
              Complete your medical store profile
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1,
              py: 0.45,
              borderRadius: "7px",
              bgcolor: COLORS.primaryLight,
              color: COLORS.primary,
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {activeStep} / {steps.length}
          </Box>
        </Stack>

        <Box
          sx={{
            mt: 1.5,
            width: "100%",
            height: 4,
            bgcolor: "#EDF2F0",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${(activeStep / steps.length) * 100}%`,
              height: "100%",
              bgcolor: COLORS.primary,
              transition: "width .3s ease",
            }}
          />
        </Box>
      </Box>

      <Box>
        {steps.map((step, index) => {
          const Icon = step.icon;
          const active = step.id === activeStep;
          const completed = step.id < activeStep;

          return (
            <Box
              key={step.id}
              sx={{
                position: "relative",
                pb: index === steps.length - 1 ? 0 : 0.7,
              }}
            >
              {index !== steps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 19,
                    top: 43,
                    bottom: -3,
                    borderLeft: "1px dashed",
                    borderColor: completed
                      ? "rgba(7,135,106,.4)"
                      : COLORS.line,
                  }}
                />
              )}

              <Box
                onClick={() => onStepChange?.(step.id)}
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.1,
                  minHeight: 58,
                  px: 1,
                  py: 0.9,
                  borderRadius: "10px",
                  border: "1px solid",
                  borderColor: active
                    ? "rgba(7,135,106,.25)"
                    : "transparent",
                  bgcolor: active
                    ? COLORS.primaryLight
                    : "transparent",
                  cursor: "pointer",

                  "&:hover": {
                    bgcolor: active
                      ? COLORS.primaryLight
                      : COLORS.primarySoft,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    bgcolor:
                      active || completed
                        ? COLORS.primary
                        : COLORS.inactive,

                    color:
                      active || completed
                        ? "#fff"
                        : COLORS.muted,
                  }}
                >
                  {completed ? (
                    <CheckRoundedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 800,
                      }}
                    >
                      {String(step.id).padStart(2, "0")}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.6}
                  >
                    <Icon
                      sx={{
                        fontSize: 15,
                        color: active
                          ? COLORS.primary
                          : COLORS.muted,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: active ? 750 : 650,
                        color: active
                          ? COLORS.primary
                          : COLORS.text,
                      }}
                    >
                      {step.title}
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 0.25,
                      fontSize: "10px",
                      color: COLORS.muted,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          mt: 2,
          p: 1.2,
          bgcolor: "#F7FAF9",
          border: `1px solid ${COLORS.border}`,
          borderRadius: "10px",
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "8px",
            bgcolor: COLORS.primaryLight,
            color: COLORS.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 15 }} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: COLORS.text,
            }}
          >
            Your information is secure
          </Typography>

          <Typography
            sx={{
              mt: 0.2,
              fontSize: "9.5px",
              lineHeight: 1.4,
              color: COLORS.muted,
            }}
          >
            Store details are securely stored and used for verification.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}