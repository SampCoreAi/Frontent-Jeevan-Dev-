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

const AppointmentTable = ({
  appointments = [],
  loading,
  onSelectAppointment,
}) => {
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const displayValue = (value) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : "Not provided";
  };

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "complete" || value === "completed") {
      return {
        bgcolor: "#e7f7ef",
        color: "#1b7f5f",
      };
    }

    if (value === "pending") {
      return {
        bgcolor: "#fff4e5",
        color: "#b96800",
      };
    }

    if (value === "cancel" || value === "cancelled") {
      return {
        bgcolor: "#fdecec",
        color: "#c33c3c",
      };
    }

    return {
      bgcolor: "#e8f0ff",
      color: "#2563eb",
    };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        // height: "100%",
        border: "1px solid #b1b1b1",
        borderRadius: 1.5,
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
          <Typography
            sx={{
              fontSize: "12.5px",
              color: "#777",
            }}
          >
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
                  cursor: onSelectAppointment ? "pointer" : "default",
                  px: 0.5,
                  borderRadius: 1,
                  transition: "background-color 0.15s ease",
                  "&:hover": {
                    bgcolor: "#f8faf9",
                  },
                }}
              >
                <Box
                  sx={{
                    minHeight: 65,
                    py: 1.2,
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "minmax(0, 1fr) auto",
                      sm: "minmax(0, 1fr) 75px 90px",
                    },
                    alignItems: "center",
                    gap: { xs: 1, sm: 1.5 },
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
                      {appointment?.patient_name
                        ?.trim()
                        ?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          display: { xs: "block", sm: "none" },
                          mb: 0.2,
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "#07876a",
                        }}
                      >
                        Token {displayValue(appointment?.token_number)}
                      </Typography>
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
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: { xs: "none", sm: "flex" },
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        color: "text.secondary",
                      }}
                    >
                      Token
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.15,
                        fontSize: "12.5px",
                        fontWeight: 700,
                        color: "#07876a",
                      }}
                    >
                      {displayValue(appointment?.token_number)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flexShrink: 0,
                      textAlign: "right",
                    }}
                  >
                    <Typography
                      sx={{
                        mb: 0.6,
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "text.primary",
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
                        fontSize: "12.5px",
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
              <Typography
                sx={{
                  pt: 1.3,
                  textAlign: "center",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: "#07876a",
                }}
              >
                +{safeAppointments.length - 5} More
              </Typography>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default AppointmentTable;