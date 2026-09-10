"use client";
import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Button,
  Grid,
} from "@mui/material";

const PatientDetailsCard = ({ patient }) => {
  const initials =
    patient?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "P";

  const formatDate = (date) => {
    if (!date) return "-";
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
          <Typography>{patient.full_name}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2, height: 3, backgroundColor: "#07716a" }} />

      <Grid
        container
        spacing={2}
      >
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Patient ID</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.appointment_id}</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Sex</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.gender}</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Phone</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.phone_number}</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Reg. Date</b>
            <br />
            <b style={{ color: "#000000" }}>{formatDate(patient.created_at)}</b>
          </Typography>

        </Grid>

        {/* Column 2 */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>

          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Weight</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.weight} kg</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Email</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.email}</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Last Appointment</b>
            <br />
            <b style={{ color: "#000000" }}>{formatDate(patient.slot_date)}</b>
          </Typography>
          <Typography>
            <b style={{ color: "#666666" }}>Visit Type</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.appointment_type}</b>
          </Typography>

        </Grid>

        {/* Column 3 */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Age</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.age}</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Height</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.height} cm</b>
          </Typography>
          <Typography mb={3}>
            <b style={{ color: "#666666" }}>Blood Group</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.blood_group}</b>
          </Typography>

          <Typography>
            <b style={{ color: "#666666" }}>Status</b>
            <br />
            <b style={{ color: "#000000" }}>{patient.status}</b>
          </Typography>
        </Grid>
      </Grid>
      <Typography sx={{ backgroundColor: "#e4eceb", px: 2, py: 2, borderRadius: 5 }}>
        <b style={{ color: "#666666" }}>Note:</b>{" "}
        <b>{patient.reason_for_visit || "-"}</b>
      </Typography>
    </Box>
  );
};

export default PatientDetailsCard;
