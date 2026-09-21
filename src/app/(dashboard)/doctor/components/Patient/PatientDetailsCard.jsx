"use client";
import React from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";

const PatientDetailsCard = ({ patient }) => {
  const theme = useTheme();

  if (!patient) return null;

  const displayValue = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "Not provided";
  };

  const formatDate = (date) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatValue = (value, unit) => {
    return value !== null && value !== undefined && value !== ""
      ? `${value} ${unit}`
      : "Not provided";
  };

  const initials =
    patient?.full_name
      ?.trim()
      ?.split(/\s+/)
      ?.slice(0, 2)
      ?.map((name) => name[0])
      ?.join("")
      ?.toUpperCase() || "P";

  const details = [
    {
      label: "Patient ID",
      value: displayValue(patient.appointment_id),
    },
    {
      label: "Gender",
      value: displayValue(patient.gender),
    },
    {
      label: "Age",
      value: displayValue(patient.age),
    },
    {
      label: "Phone",
      value: displayValue(patient.phone_number),
    },
    {
      label: "Email",
      value: displayValue(patient.email),
    },
    {
      label: "Blood Group",
      value: displayValue(patient.blood_group),
    },
    {
      label: "Weight",
      value: formatValue(patient.weight, "kg"),
    },
    {
      label: "Height",
      value: formatValue(patient.height, "cm"),
    },
    {
      label: "Visit Type",
      value: displayValue(patient.mode),
    },
    {
      label: "Status",
      value: displayValue(patient.status),
    },
    {
      label: "Registration Date",
      value: formatDate(patient.registration_date),
    },
    {
      label: "Last Appointment",
      value: formatDate(patient.slot_date),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pr: 4,
        }}
      >
        <Avatar
          sx={{
            width: 44,
            height: 44,
            bgcolor: "#EDF7F2",
            color: theme.palette.primary.main,
            fontSize: "13px",
            fontWeight: 700,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.3,
            }}
          >
            Patient Details
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              fontSize: "12px",
              color: theme.palette.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayValue(patient.full_name)}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Grid container spacing={1}>
        {details.map((item) => (
          <Grid
            key={item.label}
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <Box
              sx={{
                height: "100%",
                minHeight: 58,
                px: 1.25,
                py: 1,
                borderRadius: 1.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: theme.palette.text.secondary,
                  lineHeight: 1.3,
                }}
              >
                {item.label}
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                  textTransform:
                    item.label === "Gender" ||
                    item.label === "Visit Type" ||
                    item.label === "Status"
                      ? "capitalize"
                      : "none",
                }}
              >
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          mt: 1.5,
          p: 1.25,
          bgcolor: "#EDF7F2",
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 600,
            color: theme.palette.text.secondary,
            mb: 0.4,
          }}
        >
          Reason for Visit
        </Typography>

        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: theme.palette.text.primary,
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}
        >
          {displayValue(patient.reason_for_visit)}
        </Typography>
      </Box>
    </Box>
  );
};

export default PatientDetailsCard;