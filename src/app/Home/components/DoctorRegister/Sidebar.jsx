"use client";

import * as React from "react";

import {
  Box,
  Paper,
  Stack,
  Typography,
  Tooltip,
} from "@mui/material";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#15593E",
  primaryLight: "#EAF6F0",
  primarySoft: "#F5FAF7",

  border: "#E4EAE7",
  line: "#D9E2DD",

  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  textMuted: "#8C9992",

  inactiveCircle: "#F0F3F1",
  white: "#FFFFFF",
};

const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Basic details about you",
    icon: PersonOutlineIcon,
  },
  {
    id: 2,
    title: "Professional Details",
    description: "Your medical background",
    icon: SchoolOutlinedIcon,
  },
  {
    id: 3,
    title: "Hospital Details",
    description: "Hospital or clinic information",
    icon: LocalHospitalOutlinedIcon,
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

export default function OnboardingSidebar({
  activeStep = 1,
  registrationId: registrationIdProp,
  onStepChange,
}) {
  const [storedRegistrationId, setStoredRegistrationId] =
    React.useState(null);

  React.useEffect(() => {
    const id = localStorage.getItem("doctorRegistrationId");

    if (id) {
      setStoredRegistrationId(id);
    }
  }, []);

  /*
   * Parent se registrationId aaye to usko priority do.
   * Otherwise localStorage wala use hoga.
   */
  const registrationId =
    registrationIdProp || storedRegistrationId;

  const canNavigate = Boolean(registrationId);

  const completedSteps = Math.max(activeStep - 1, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          sm: 2,
          md: 2.2,
        },
        borderRadius: "16px",

        bgcolor: COLORS.white,

        fontFamily:
          "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",

        boxShadow:
          "0 6px 24px rgba(31, 42, 36, 0.035)",
      }}
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <Box
        sx={{
          mb: 2,
          px: 0.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 750,
                color: COLORS.textPrimary,
                letterSpacing: "-0.01em",
              }}
            >
              Onboarding Steps
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: "11px",
                color: COLORS.textSecondary,
              }}
            >
              Complete your doctor profile
            </Typography>
          </Box>

          <Box
            sx={{
              px: 1,
              py: 0.45,
              borderRadius: "7px",
              bgcolor: COLORS.primaryLight,
              color: COLORS.primary,
              fontSize: "10.5px",
              fontWeight: 750,
              whiteSpace: "nowrap",
            }}
          >
            {activeStep} / {steps.length}
          </Box>
        </Stack>

        {/* PROGRESS BAR */}

        <Box
          sx={{
            mt: 1.6,
            width: "100%",
            height: 4,
            bgcolor: "#EDF1EF",
            borderRadius: "100px",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: `${(activeStep / steps.length) * 100}%`,
              height: "100%",
              bgcolor: COLORS.primary,
              borderRadius: "100px",
              transition: "width 0.3s ease",
            }}
          />
        </Box>
      </Box>

      {/* =========================================
          STEPS
      ========================================= */}

      <Box
        sx={{
          position: "relative",
        }}
      >
        {steps.map((step, index) => {
          const Icon = step.icon;

          const isActive = step.id === activeStep;
          const isCompleted = step.id < activeStep;
          const isLast = index === steps.length - 1;

          return (
            <Box
              key={step.id}
              sx={{
                position: "relative",
                pb: isLast ? 0 : 1,
              }}
            >
              {/* CONNECTOR LINE */}

              {!isLast && (
                <Box
                  sx={{
                    position: "absolute",

                    left: "19px",
                    top: "43px",
                    bottom: "-4px",

                    width: "1px",

                    borderLeft: "1px dashed",

                    borderColor: isCompleted
                      ? "rgba(27,110,79,0.45)"
                      : COLORS.line,

                    zIndex: 0,
                  }}
                />
              )}

              <Tooltip
                title={
                  !canNavigate
                    ? "Complete Personal Information first"
                    : ""
                }
                placement="right"
                arrow
              >
                <Box>
                  <Paper
                    elevation={0}
                    onClick={() => {
                      if (
                        canNavigate &&
                        onStepChange &&
                        !isActive
                      ) {
                        onStepChange(step.id);
                      }
                    }}
                    sx={{
                      position: "relative",
                      zIndex: 1,

                      display: "flex",
                      alignItems: "center",

                      gap: 1.15,

                      minHeight: 58,

                      px: 1.1,
                      py: 1,

                      border: "1px solid",

                      borderColor: isActive
                        ? "rgba(27,110,79,0.35)"
                        : "transparent",

                      bgcolor: isActive
                        ? COLORS.primaryLight
                        : "transparent",

                      borderRadius: "10px",

                      cursor: canNavigate
                        ? "pointer"
                        : "default",

                      transition:
                        "background-color 0.18s ease, border-color 0.18s ease, transform 0.18s ease",

                      "&:hover": canNavigate
                        ? {
                            bgcolor: isActive
                              ? COLORS.primaryLight
                              : COLORS.primarySoft,

                            borderColor: isActive
                              ? "rgba(27,110,79,0.35)"
                              : COLORS.border,
                          }
                        : {},
                    }}
                  >
                    {/* STEP NUMBER */}

                    <Box
                      sx={{
                        flexShrink: 0,

                        width: 38,
                        height: 38,

                        borderRadius: "10px",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        bgcolor:
                          isActive || isCompleted
                            ? COLORS.primary
                            : COLORS.inactiveCircle,

                        color:
                          isActive || isCompleted
                            ? COLORS.white
                            : COLORS.textSecondary,

                        border: isActive
                          ? "1px solid rgba(255,255,255,0.25)"
                          : "1px solid transparent",

                        transition: "all 0.2s ease",
                      }}
                    >
                      {isCompleted ? (
                        <CheckRoundedIcon
                          sx={{
                            fontSize: 19,
                          }}
                        />
                      ) : (
                        <Typography
                          component="span"
                          sx={{
                            fontSize: "12px",
                            fontWeight: 800,
                            color: "inherit",
                          }}
                        >
                          {String(step.id).padStart(2, "0")}
                        </Typography>
                      )}
                    </Box>

                    {/* STEP CONTENT */}

                    <Box
                      sx={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.7}
                      >
                        <Icon
                          sx={{
                            fontSize: 16,

                            color: isActive
                              ? COLORS.primary
                              : isCompleted
                              ? COLORS.primary
                              : COLORS.textSecondary,
                          }}
                        />

                        <Typography
                          sx={{
                            minWidth: 0,

                            fontSize: "12.5px",

                            fontWeight: isActive
                              ? 750
                              : 650,

                            color: isActive
                              ? COLORS.primary
                              : COLORS.textPrimary,

                            lineHeight: 1.3,

                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {step.title}
                        </Typography>
                      </Stack>

                      <Typography
                        sx={{
                          mt: 0.35,

                          fontSize: "10.5px",

                          lineHeight: 1.35,

                          color: COLORS.textSecondary,

                          display: {
                            xs: "none",
                            sm: "block",
                          },

                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {step.description}
                      </Typography>
                    </Box>

                    {/* ACTIVE DOT */}

                    {isActive && (
                      <Box
                        sx={{
                          width: 6,
                          height: 6,

                          borderRadius: "50%",

                          bgcolor: COLORS.primary,

                          flexShrink: 0,

                          boxShadow:
                            "0 0 0 4px rgba(27,110,79,0.09)",
                        }}
                      />
                    )}
                  </Paper>
                </Box>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {/* =========================================
          SECURITY
      ========================================= */}

      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        sx={{
          mt: 2.2,

          px: 1.3,
          py: 1.25,

          borderRadius: "10px",

          bgcolor: "#F7FAF8",

          border: `1px solid ${COLORS.border}`,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,

            flexShrink: 0,

            borderRadius: "8px",

            bgcolor: COLORS.primaryLight,

            color: COLORS.primary,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LockOutlinedIcon
            sx={{
              fontSize: 15,
            }}
          />
        </Box>

        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontSize: "11.5px",

              fontWeight: 700,

              color: COLORS.textPrimary,

              lineHeight: 1.35,
            }}
          >
            Your information is secure
          </Typography>

          <Typography
            sx={{
              mt: 0.25,

              fontSize: "9.8px",

              lineHeight: 1.45,

              color: COLORS.textSecondary,
            }}
          >
            Your details are securely stored and used only for
            verification.
          </Typography>
        </Box>
      </Stack>

    </Paper>
  );
}