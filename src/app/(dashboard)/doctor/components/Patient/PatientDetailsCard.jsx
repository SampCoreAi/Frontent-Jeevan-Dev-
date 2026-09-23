"use client";
import React from "react";
import {
  Avatar,
  Box,
  Chip,
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

  const formatTime = (time) => {
    if (!time) return "Not provided";

    if (
      String(time).toLowerCase().includes("am") ||
      String(time).toLowerCase().includes("pm")
    ) {
      return time;
    }

    const parts = String(time).split(":");

    if (parts.length < 2) return time;

    let hour = Number(parts[0]);
    const minute = parts[1];

    if (Number.isNaN(hour)) return time;

    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${period}`;
  };

  const formatValue = (value, unit) => {
    return value !== null && value !== undefined && value !== ""
      ? `${value} ${unit}`
      : "Not provided";
  };

  const fullName =
    patient.full_name ||
    patient.patientName ||
    "Unknown Patient";

  const initials =
    fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase() || "P";

  const status = String(
    patient.status || "Not provided"
  ).toUpperCase();

  const getStatusColor = () => {
    if (status === "COMPLETED") return "success";
    if (status === "CANCELLED") return "error";
    if (status === "IN_PROGRESS") return "warning";
    return "default";
  };

  const details = [
    {
      label: "Appointment ID",
      value: displayValue(patient.appointment_id),
    },
    {
      label: "Gender",
      value: displayValue(patient.gender),
    },
    {
      label: "Age",
      value:
        patient.age !== null &&
        patient.age !== undefined &&
        patient.age !== ""
          ? `${patient.age} years`
          : "Not provided",
    },
    {
      label: "Blood Group",
      value: displayValue(patient.blood_group),
    },
    {
      label: "Phone",
      value: displayValue(
        patient.phone_number || patient.phone
      ),
    },
    {
      label: "Email",
      value: displayValue(patient.email),
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
      label: "Registration Date",
      value: formatDate(patient.registration_date),
    },
    {
      label: "Appointment Date",
      value: formatDate(patient.slot_date),
    },
    {
      label: "Start Time",
      value: formatTime(patient.start_time),
    },
    {
      label: "Status",
      value: displayValue(patient.status),
    },
    {
      label: "Visit Type",
      value: displayValue(
        patient.mode || patient.appointment_type
      ),
    },
    {
      label: "Hospital",
      value: displayValue(patient.hospital_name),
    },
  ];

  const DetailBox = ({ label, value }) => (
    <Box
      sx={{
        height: "100%",
        minHeight: 58,
        px: 1.5,
        py: 1.1,
        borderRadius: "8px",
        bgcolor: theme.palette.action.hover,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography
        sx={{
          fontSize: "10.5px",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          lineHeight: 1.3,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.45,
          fontSize: "13px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          lineHeight: 1.4,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );

return (
  <Box
    sx={{
      mt: 1,
      width: "100%",
      bgcolor: theme.palette.background.paper,
    }}
  >
    <Grid container spacing={1.2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                height: "125px",
                px: 2,
                py: 1.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: "8px",
                bgcolor: `${theme.palette.primary.main}08`,
                border: `1px solid ${theme.palette.primary.main}25`,
              }}
            >
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DetailBox
              label={details[6].label}
              value={details[6].value}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={1}>
          {details.slice(0, 6).map((item) => (
            <Grid
              key={item.label}
              size={{ xs: 12, sm: 6 }}
            >
              <DetailBox
                label={item.label}
                value={item.value}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {details.slice(7).map((item) => (
        <Grid
          key={item.label}
          size={{ xs: 12, sm: 6, md: 4 }}
        >
          <DetailBox
            label={item.label}
            value={item.value}
          />
        </Grid>
      ))}

      <Grid size={{ xs: 12, md: 8 }}>
        <Box
          sx={{
            height: "100%",
            minHeight: 58,
            px: 1.5,
            py: 1.1,
            borderRadius: "8px",
            bgcolor: `${theme.palette.primary.main}08`,
            border: `1px solid ${theme.palette.primary.main}25`,
          }}
        >
          <Typography
            sx={{
              fontSize: "10.5px",
              fontWeight: 500,
              color: theme.palette.text.secondary,
            }}
          >
            Reason for Visit
          </Typography>

          <Typography
            sx={{
              mt: 0.45,
              fontSize: "13px",
              fontWeight: 600,
              color: theme.palette.text.primary,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {displayValue(patient.reason_for_visit)}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Box>
);
};

export default PatientDetailsCard;