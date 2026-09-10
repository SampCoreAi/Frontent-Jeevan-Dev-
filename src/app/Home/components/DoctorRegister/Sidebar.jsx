"use client";

import * as React from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const COLORS = {
  primary: "#1B6E4F",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  dashedLine: "#D7E0DB",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  inactiveCircle: "#EEF2F0",
};

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details about you",
    icon: <PersonOutlineIcon fontSize="small" />,
  },
  {
    id: 2,
    title: "Professional Details",
    description: "Your medical background",
    icon: <SchoolOutlinedIcon fontSize="small" />,
  },
  {
    id: 3,
    title: "Hospital Details",
    description: "Your hospital or clinic information",
    icon: <LocalHospitalOutlinedIcon fontSize="small" />,
  },
  {
    id: 4,
    title: "Documents",
    description: "Upload required documents",
    icon: <DescriptionOutlinedIcon fontSize="small" />,
  },
  {
    id: 5,
    title: "Verification",
    description: "Review and submit",
    icon: <VerifiedUserOutlinedIcon fontSize="small" />,
  },
];

export default function OnboardingSidebar({
  activeStep = 1,
  onStepChange,
}) {
  const [registrationId, setRegistrationId] = React.useState(null);

  React.useEffect(() => {
    const id = localStorage.getItem("doctorRegistrationId");

    if (id) {
      setRegistrationId(id);
    }
  }, []);

  // Registration ID mil gaya to sidebar clickable
  const canNavigate = Boolean(registrationId);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid",
        borderColor: COLORS.border,
        borderRadius: 3,
        height: "100%",
        fontFamily:
          "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <Typography
        sx={{
          mb: 2.5,
          fontSize: 15,
          fontWeight: 600,
          color: COLORS.textPrimary,
        }}
      >
        Onboarding Steps
      </Typography>

      <Box sx={{ position: "relative" }}>
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isCompleted = step.id < activeStep;
          const isLast = index === steps.length - 1;

          return (
            <Box
              key={step.id}
              sx={{
                position: "relative",
                pb: isLast ? 0 : 2,
              }}
            >
              {!isLast && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 15,
                    top: 32,
                    bottom: -8,
                    width: "1px",
                    borderLeft: "1px dashed",
                    borderColor:
                      isCompleted && canNavigate
                        ? COLORS.primary
                        : COLORS.dashedLine,
                  }}
                />
              )}

              <Paper
                elevation={0}
                onClick={() => {
                  if (canNavigate && onStepChange) {
                    onStepChange(step.id);
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.25,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: isActive
                    ? COLORS.primary
                    : COLORS.border,
                  bgcolor: isActive
                    ? COLORS.primaryLight
                    : "transparent",
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  cursor: canNavigate
                    ? "pointer"
                    : "default",

                  "&:hover": canNavigate
                    ? {
                        borderColor: COLORS.primary,
                        bgcolor: "#F6FBF8",
                      }
                    : {},
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    bgcolor:
                      isActive || isCompleted
                        ? COLORS.primary
                        : COLORS.inactiveCircle,
                    color:
                      isActive || isCompleted
                        ? "#fff"
                        : COLORS.textSecondary,
                    zIndex: 1,
                  }}
                >
                  {step.id}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      color: isActive
                        ? COLORS.primary
                        : COLORS.textSecondary,
                      mt: "2px",
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: COLORS.textPrimary,
                        lineHeight: 1.3,
                      }}
                    >
                      {step.title}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: COLORS.textSecondary,
                        display: {
                          xs: "none",
                          sm: "block",
                        },
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          );
        })}
      </Box>

      <Stack
        direction="row"
        spacing={1.25}
        alignItems="flex-start"
        sx={{
          mt: 3,
          p: 1.5,
          borderRadius: 2,
          bgcolor: COLORS.primaryLight,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: COLORS.primary,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 15 }} />
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            Your information is safe with us
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: COLORS.textSecondary,
            }}
          >
            We use industry-standard encryption to protect your data.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}