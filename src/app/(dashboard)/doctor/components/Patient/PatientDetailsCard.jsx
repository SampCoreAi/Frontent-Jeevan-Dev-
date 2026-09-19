
"use client";

import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";

const PatientDetailsCard = ({ patient }) => {
  // Show "Not provided" when value is null, undefined, or empty
  const displayValue = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "Not provided";
  };

  const initials =
    patient?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "P";

  const formatDate = (date) => {
    if (!date) return "Not provided";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!patient) return null;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        wordBreak: "break-word",
        border: "2px solid black",
        mx: "auto",
        borderRadius: 0.5,
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          sx={{
            bgcolor: "#00796B",
            width: 48,
            height: 48,
            fontWeight: "bold",
            mr: 2,
          }}
        >
          {initials}
        </Avatar>

        <Box>
          <Typography variant="h6" fontWeight="bold">
            Patient Details
          </Typography>

          <Typography>
            {displayValue(patient.full_name)}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          mb: 2,
          height: 3,
          backgroundColor: "#07716a",
        }}
      />

      <Grid container spacing={2}>

        {/* Column 1 */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Patient ID</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.appointment_id)}
            </b>
          </Typography>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Sex</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.gender)}
            </b>
          </Typography>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Phone</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.phone_number)}
            </b>
          </Typography>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Reg. Date</b>
            <br />
            <b style={{ color: "#000000" }}>
              {formatDate(patient.registration_date)}
            </b>
          </Typography>
        </Grid>

        {/* Column 2 */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Weight</b>
            <br />
            <b style={{ color: "#000000" }}>
              {patient.weight !== null &&
              patient.weight !== undefined &&
              patient.weight !== ""
                ? `${patient.weight} kg`
                : "Not provided"}
            </b>
          </Typography>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Email</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.email)}
            </b>
          </Typography>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Last Appointment</b>
            <br />
            <b style={{ color: "#000000" }}>
              {formatDate(patient.slot_date)}
            </b>
          </Typography>

          <Typography>
            <b style={{ color: "#666666" }}>Visit Type</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.mode)}
            </b>
          </Typography>
        </Grid>

        {/* Column 3 */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Age</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.age)}
            </b>
          </Typography>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Height</b>
            <br />
            <b style={{ color: "#000000" }}>
              {patient.height !== null &&
              patient.height !== undefined &&
              patient.height !== ""
                ? `${patient.height} cm`
                : "Not provided"}
            </b>
          </Typography>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Blood Group</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.blood_group)}
            </b>
          </Typography>

          <Typography>
            <b style={{ color: "#666666" }}>Status</b>
            <br />
            <b style={{ color: "#000000" }}>
              {displayValue(patient.status)}
            </b>
          </Typography>
        </Grid>
      </Grid>

      {/* Reason for Visit */}
      <Typography
        sx={{
          backgroundColor: "#e4eceb",
          px: 2,
          py: 2,
          borderRadius: 5,
          mt: 2,
        }}
      >
        <b style={{ color: "#666666" }}>Note:</b>{" "}
        <b>
          {displayValue(patient.reason_for_visit)}
        </b>
      </Typography>
    </Box>
  );
};

export default PatientDetailsCard;
