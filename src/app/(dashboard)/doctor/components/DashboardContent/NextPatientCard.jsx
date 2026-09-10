// components/DashboardContent/NextPatientCard.jsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  Typography,
  Divider,
  Avatar,
  Stack,
  Box,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";


const NextPatientCard = ({ patient, loading }) => {
 
const router = useRouter();


  if (loading) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: 1,
          border: "1px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress />
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: 1,
          border: "1px solid black",
          minHeight: 300,
        }}
      >
        <Typography>No patient found</Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: {
          xs: 1.5,
          sm: 2,
        },
        borderRadius: 1,
        border: "1px solid black",
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: {
            xs: "1rem",
            sm: "1.25rem",
          },
          fontWeight: 700,
        }}
      >
        Next Patient Details
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* TOP SECTION */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: {
              xs: 48,
              sm: 56,
            },
            height: {
              xs: 48,
              sm: 56,
            },
            bgcolor: "#439f8e",
            fontWeight: 700,
          }}
        >
          {patient.patient_name?.charAt(0) || "?"}
        </Avatar>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            fontWeight={600}
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
            }}
          >
            {patient.patient_name}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#1e6658",
              fontSize: {
                xs: "0.75rem",
                sm: "0.875rem",
              },
            }}
          >
            {patient.reason_for_visit}
          </Typography>
        </Box>
      </Stack>

      {/* DETAILS */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
          },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="body2">Patient ID</Typography>
          <Typography fontWeight={600}>
            {patient.patient_id}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2">Age</Typography>
          <Typography fontWeight={600}>
            {patient.age}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2">Sex</Typography>
          <Typography fontWeight={600}>
            {patient.gender}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2">Weight</Typography>
          <Typography fontWeight={600}>
            {patient.weight} kg
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2">Height</Typography>
          <Typography fontWeight={600}>
            {patient.height} cm
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2">Blood Group</Typography>
          <Typography fontWeight={600}>
            {patient.blood_group}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2">Language</Typography>
          <Typography fontWeight={600}>
            {patient.language}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">Phone Number</Typography>
          <Typography fontWeight={600}>
            {patient.phone_number}
          </Typography>
        </Box>

      </Box>

        <Divider sx={{ my: 3 }} />
    

     
      <Box
  sx={{
    mt: 4,
    display: "flex",
    justifyContent: "flex-end",
  }}
>
<Button
  variant="contained"
  fullWidth
  onClick={() =>
    router.push(
      `/doctor/pages/patient?appointment_id=${patient.appointment_id}&verify=true`
    )
  }
  sx={{
    bgcolor: "#439f8e",
    py: 1.2,
    "&:hover": {
      bgcolor: "#357d70",
    },
  }}
>
  View Patient
</Button>
</Box>
    </Card>
  );
};

export default NextPatientCard;