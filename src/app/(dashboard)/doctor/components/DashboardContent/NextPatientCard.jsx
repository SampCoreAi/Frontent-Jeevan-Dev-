"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Typography,
  Divider,
  Avatar,
  Stack,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

const NextPatientCard = ({ patient, loading }) => {
  const router = useRouter();

  const displayValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }

    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "Not provided";
    }

    return value;
  };

  const handleViewPatient = () => {
    if (!patient?.appointment_id) return;

    router.push(
      `/doctor/pages/patient?appointment_id=${encodeURIComponent(
        patient.appointment_id
      )}&verify=true`
    );
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 1.5,
          border: "1px solid #c6c6c6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 5,
        }}
      >
        <CircularProgress size={25} />
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 1.5,
          border: "1px solid #b1b1b1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 5,
        }}
      >
        <Typography
          sx={{
            fontSize: "12.5px",
            color: "text.secondary",
          }}
        >
          No patient found
        </Typography>
      </Card>
    );
  }

  const details = [
    {
      label: "Patient ID",
      value: patient?.patient_id,
    },
    {
      label: "Age",
      value: patient?.age,
    },
    {
      label: "Sex",
      value: patient?.gender,
    },
    {
      label: "Weight",
      value:
        patient?.weight !== null &&
        patient?.weight !== undefined &&
        patient?.weight !== ""
          ? `${patient.weight} kg`
          : null,
    },
    {
      label: "Height",
      value:
        patient?.height !== null &&
        patient?.height !== undefined &&
        patient?.height !== ""
          ? `${patient.height} cm`
          : null,
    },
    {
      label: "Blood Group",
      value: patient?.blood_group,
    },
    {
      label: "Language",
      value: patient?.language,
    },
    {
      label: "Phone Number",
      value: patient?.phone_number,
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        borderRadius: 1.5,
        border: "1px solid #c6c6c6",
        bgcolor: "#fff",
      }}
    >
      <Typography
        sx={{
          fontSize: "12.5px",
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        Patient Details
      </Typography>
      <Divider sx={{ my: 1.5 }} />
      <Stack
        direction="row"
        spacing={1.3}
        alignItems="center"
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#edf7f2",
            color: "#07876a",
            fontSize: "12.5px",
            fontWeight: 700,
          }}
        >
          {patient?.patient_name
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || "?"}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "12.5px",
              fontWeight: 700,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayValue(patient?.patient_name)}
          </Typography>
          <Typography
            sx={{
              mt: 0.2,
              fontSize: "12.5px",
              color: "#07876a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayValue(patient?.reason_for_visit)}
          </Typography>
        </Box>
      </Stack>
      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          columnGap: 2,
          rowGap: 1.4,
        }}
      >
        {details.map((item) => (
          <Box
            key={item.label}
            sx={{
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: "12.5px",
                color: "text.secondary",
                lineHeight: 1.3,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: "12.5px",
                fontWeight: 600,
                color: "text.primary",
                lineHeight: 1.3,
                overflowWrap: "anywhere",
              }}
            >
              {displayValue(item.value)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider sx={{ my: 1.8 }} />
      <Button
        variant="contained"
        fullWidth
        disabled={!patient?.appointment_id}
        onClick={handleViewPatient}
        sx={{
          minHeight: 34,
          py: 0.7,
          bgcolor: "#07876a",
          fontSize: "12.5px",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#066f58",
            boxShadow: "none",
          },
        }}
      >
        View Patient
      </Button>
    </Card>
  );
};

export default NextPatientCard;