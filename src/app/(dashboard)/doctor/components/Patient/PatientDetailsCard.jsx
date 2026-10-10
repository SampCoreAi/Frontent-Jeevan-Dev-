"use client";

import React from "react";
import {
  Box,
  Dialog,
  Grid,
  IconButton,
  Typography,
  Zoom,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const displayValue = (value) =>
  value !== null && value !== undefined && value !== ""
    ? value
    : "Not provided";

const formatValue = (value, unit) =>
  displayValue(value) === "Not provided"
    ? "Not provided"
    : `${value} ${unit}`;

const formatDate = (value) => {
  if (!value) return "Not provided";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not provided"
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const formatTime = (value) => {
  if (!value) return "Not provided";

  const time = String(value);

  if (/am|pm/i.test(time)) return value;

  const [hours, minutes] = time.split(":");
  const hour = Number(hours);

  if (minutes === undefined || Number.isNaN(hour)) return value;

  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
};

function DetailBox({ label, value, highlighted = false }) {
  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 58,
        px: 1.5,
        py: 1.1,
        ...(highlighted && {
          borderRadius: "8px",
          bgcolor: (theme) => `${theme.palette.primary.main}08`,
          border: "1px solid",
          borderColor: (theme) => `${theme.palette.primary.main}25`,
        }),
      }}
    >
      <Typography
        sx={{
          fontSize: "10.5px",
          fontWeight: 500,
          color: "text.secondary",
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
          color: "text.primary",
          lineHeight: 1.4,
          wordBreak: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

export default function PatientDetailsCard({ patient }) {
  const theme = useTheme();
  const [imageOpen, setImageOpen] = React.useState(false);
  const [imageOrigin, setImageOrigin] = React.useState(null);

  if (!patient) return null;

  const fullName =
    patient.full_name || patient.patientName || "Unknown Patient";

  const imagePath = patient.image?.url;
  const imageUrl = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${imagePath}`
    : "";

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
      value: formatValue(patient.age, "years"),
    },
    {
      label: "Blood Group",
      value: displayValue(patient.blood_group),
    },
    {
      label: "Phone",
      value: displayValue(patient.phone_number || patient.phone),
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
      value: displayValue(patient.mode || patient.appointment_type),
    },
    {
      label: "Hospital",
      value: displayValue(patient.hospital_name),
    },
  ];

  const openImage = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setImageOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
    setImageOpen(true);
  };

  return (
    <Box sx={{ mt: 1, width: "100%", bgcolor: "background.paper" }}>
      <Grid container spacing={1.2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Box
                sx={{
                  height: 125,
                  width: "100%",
                  borderRadius: "8px",
                  overflow: "hidden",
                  bgcolor: "action.hover",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                {imageUrl ? (
                  <Box
                    component="button"
                    type="button"
                    onClick={openImage}
                    aria-label={`View photo of ${fullName}`}
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      p: 0,
                      border: 0,
                      bgcolor: "transparent",
                      cursor: "zoom-in",
                      "&:focus-visible": {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: -2,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={fullName}
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        objectFit: "cover",
                        transition: "transform 200ms ease",
                        "&:hover": {
                          transform: "scale(1.03)",
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.secondary",
                      fontSize: "12px",
                    }}
                  >
                    No image
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid size={12}>
              <DetailBox {...details[6]} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Grid container spacing={1}>
            {details.slice(0, 6).map((item) => (
              <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                <DetailBox {...item} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {details.slice(7).map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, md: 4 }}>
            <DetailBox {...item} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <DetailBox
            label="Reason for Visit"
            value={displayValue(patient.reason_for_visit)}
            highlighted
          />
        </Grid>
      </Grid>

     <Dialog
  open={imageOpen}
  onClose={() => setImageOpen(false)}
  maxWidth={false}
  aria-label={`Photo of ${fullName}`}
  slots={{ transition: Zoom }}
  transitionDuration={{ enter: 600, exit: 600 }}
  slotProps={{
    transition: {
      easing: {
        enter: "cubic-bezier(0.4, 0, 0.2, 1)",
        exit: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      style: {
        transformOrigin: imageOrigin
          ? `calc(50% + ${imageOrigin.x}px - 50vw) calc(50% + ${imageOrigin.y}px - 50vh)`
          : "center",
      },
    },
    backdrop: {
      sx: { bgcolor: "rgba(0, 0, 0, 0.75)" },
    },
    paper: {
      sx: {
        m: 2,
        width: "fit-content",
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "85vh",
        bgcolor: "transparent",
        backgroundImage: "none",
        boxShadow: "none",
        borderRadius: 2,
        position: "relative",
        overflow: "hidden",
      },
    },
  }}
>
  <IconButton
    onClick={() => setImageOpen(false)}
    aria-label="Close photo"
    size="small"
    sx={{
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1,
      bgcolor: "rgba(0, 0, 0, 0.6)",
      color: "#fff",
      "&:hover": {
        bgcolor: "rgba(0, 0, 0, 0.8)",
      },
    }}
  >
    <CloseIcon sx={{ fontSize: 20 }} />
  </IconButton>

  {imageUrl && (
    <Box
      component="img"
      src={imageUrl}
      alt={fullName}
      sx={{
        display: "block",
        maxWidth: "100%",
        maxHeight: "85vh",
        objectFit: "contain",
      }}
    />
  )}
</Dialog>
    </Box>
  );
}