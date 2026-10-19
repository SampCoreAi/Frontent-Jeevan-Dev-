"use client";

import React from "react";
import {
  Paper,
  Typography,
  Divider,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";

const Detail = ({ label, value }) => (
  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
      {label}
    </Typography>
    <Typography
      sx={{
        mt: 0.15,
        fontSize: "12.5px",
        fontWeight: 700,
        color: "#07876a",
        whiteSpace: "nowrap",
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

const AppointmentTable = ({
  appointments = [],
  loading,
  onSelectAppointment,
}) => {
  const router = useRouter();
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const displayValue = (value) =>
    value !== null && value !== undefined && value !== ""
      ? value
      : "Not provided";

  const formatType = (value) => {
    if (!value) return "";

    const labels = {
      myself: "Myself",
      other: "Other",
      online: "Online",
      offline: "Offline",
    };

    const normalized = String(value).trim().toLowerCase();
    return (
      labels[normalized] ||
      normalized.charAt(0).toUpperCase() + normalized.slice(1)
    );
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "complete" || value === "completed") {
      return { bgcolor: "#e7f7ef", color: "#1b7f5f" };
    }
    if (value === "pending") {
      return { bgcolor: "#fff4e5", color: "#b96800" };
    }
    if (value === "cancel" || value === "cancelled") {
      return { bgcolor: "#fdecec", color: "#c33c3c" };
    }

    return { bgcolor: "#e8f0ff", color: "#2563eb" };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        border: "1px solid #b1b1b1",
        borderRadius: 1.5,
        bgcolor: "#fff",
      }}
    >
      <Typography sx={{ fontSize: "12.5px", fontWeight: 700 }}>
        Today Appointments
      </Typography>

      <Divider sx={{ my: 1.5 }} />

      {loading ? (
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={25} />
        </Box>
      ) : safeAppointments.length === 0 ? (
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: "12.5px", color: "#777" }}>
            No appointments today
          </Typography>
        </Box>
      ) : (
        <Box>
          {safeAppointments.slice(0, 5).map((appointment, index) => {
            const statusStyle = getStatusStyle(appointment?.status);

            return (
              <Box
                key={appointment?.appointment_id || index}
                onClick={() => onSelectAppointment?.(appointment)}
                sx={{
                  px: 0.5,
                  borderRadius: 1,
                  cursor: onSelectAppointment ? "pointer" : "default",
                  transition: "background-color 0.15s ease",
                  "&:hover": { bgcolor: "#f8faf9" },
                }}
              >
                <Box
                  sx={{
                    minHeight: 76,
                    py: 1.2,
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "minmax(0, 1fr) auto",
                      sm: "minmax(130px, 1fr) 52px 72px 65px 88px",
                    },
                    alignItems: "center",
                    gap: { xs: 1, sm: 1.25 },
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 38,
                        height: 38,
                        flexShrink: 0,
                        bgcolor: "#edf7f2",
                        color: "#07876a",
                        fontSize: "12.5px",
                        fontWeight: 700,
                      }}
                    >
                      {appointment?.patient_name?.trim()?.charAt(0)?.toUpperCase() || "?"}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "12.5px",
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {displayValue(appointment?.patient_name)}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.2,
                          fontSize: "12.5px",
                          color: "text.secondary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {displayValue(appointment?.reason_for_visit)}
                      </Typography>

                      <Box
                        sx={{
                          mt: 0.8,
                          display: { xs: "flex", sm: "none" },
                          justifyContent: "space-between",
                          maxWidth: 230,
                        }}
                      >
                        <Detail
                          label="Token"
                          value={displayValue(appointment?.token_number)}
                        />
                        <Detail
                          label="Booking"
                          value={formatType(appointment?.booking_type)}
                        />
                        <Detail
                          label="Mode"
                          value={formatType(appointment?.appointment_type)}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Detail
                      label="Token"
                      value={displayValue(appointment?.token_number)}
                    />
                  </Box>

                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Detail
                      label="Booking"
                      value={formatType(appointment?.booking_type)}
                    />
                  </Box>

                  <Box sx={{ display: { xs: "none", sm: "block" } }}>
                    <Detail
                      label="Mode"
                      value={formatType(appointment?.appointment_type)}
                    />
                  </Box>

                  <Box sx={{ flexShrink: 0, textAlign: "right" }}>
                    <Typography
                      sx={{
                        mb: 0.6,
                        fontSize: "12.5px",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayValue(appointment?.start_time)}
                    </Typography>

                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 58,
                        px: 1,
                        py: 0.3,
                        borderRadius: "20px",
                        bgcolor: statusStyle.bgcolor,
                        color: statusStyle.color,
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {displayValue(appointment?.status)}
                    </Box>
                  </Box>
                </Box>

                {index !== Math.min(safeAppointments.length, 5) - 1 && (
                  <Divider sx={{ borderColor: "#eeeeee" }} />
                )}
              </Box>
            );
          })}

          {safeAppointments.length > 5 && (
            <>
              <Divider sx={{ mt: 1 }} />
              <Box
                onClick={() => router.push("/doctor/pages/patient")}
                sx={{
                  mt: 0.5,
                  py: 0.9,
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#f1f8f6" },
                }}
              >
                <Typography
                  sx={{ fontSize: "12.5px", fontWeight: 600, color: "#07876a" }}
                >
                  +{safeAppointments.length - 5} More
                </Typography>
              </Box>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default AppointmentTable;