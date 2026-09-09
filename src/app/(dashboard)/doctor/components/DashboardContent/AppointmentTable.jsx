// components/DashboardContent/AppointmentTable.jsx
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

const AppointmentTable = ({ appointments = [], loading }) => {
 

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        border: "1px solid #191919",
        borderRadius: 2,
        background: "#fff",
        width: "100%",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
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
              Today Appointment
            </Typography>
      
            <Divider sx={{ my: 2 }} />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : appointments?.length === 0 ? (
        <Typography
          sx={{
            textAlign: "center",
            color: "#777",
            py: 4,
          }}
        >
          No appointments today
        </Typography>
      ) : (
       <Box
  
>
          {appointments.slice(0, 5).map((appointment, index) => (
            <Box key={appointment.appointment_id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  py: 2,
                }}
              >
                {/* LEFT SIDE */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: { xs: 42, sm: 50 },
                      height: { xs: 42, sm: 50 },
                      bgcolor: "#dff7f1",
                      color: "#0f7468",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {appointment.patient_name?.charAt(0) || "?"}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    {/* USER NAME */}
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: {
                          xs: "0.9rem",
                          sm: "1rem",
                        },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {appointment.patient_name}
                    </Typography>

                    {/* REASON FOR VISIT */}
                    <Typography
                      sx={{
                        color: "#1e6658",
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.85rem",
                        },
                        mt: 0.3,
                      }}
                    >
                      {appointment.reason_for_visit}
                    </Typography>
                  </Box>
                </Box>

                {/* RIGHT SIDE */}
                <Box
                  sx={{
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {/* START TIME */}
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: {
                        xs: "0.75rem",
                        sm: "0.9rem",
                      },
                      mb: 0.8,
                    }}
                  >
                    {appointment.start_time}
                  </Typography>

                  {/* STATUS */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: "20px",
                      fontSize: {
                        xs: "0.65rem",
                        sm: "0.75rem",
                      },
                      fontWeight: 600,
                      bgcolor:
                        appointment.status === "Complete"
                          ? "#e7f7ef"
                          : appointment.status === "Pending"
                          ? "#fff4e5"
                          : "#e8f0ff",
                      color:
                        appointment.status === "Complete"
                          ? "#1b7f5f"
                          : appointment.status === "Pending"
                          ? "#d97706"
                          : "#2563eb",
                    }}
                  >
                    {appointment.status}
                  </Box>
                </Box>
              </Box>

              {index !== Math.min(appointments.length, 5) - 1&& (
                <Divider sx={{ borderColor: "#f1f1f1" }} />
              )}

              
            </Box>
          ))}

          {appointments.length > 5 && (
  <>
    <Divider sx={{ my: 2 }} />
    <Typography
      sx={{
        textAlign: "center",
        color: "#1e6658",
        fontWeight: 600,
        cursor: "default",
      }}
    >
      +{appointments.length - 5} More
    </Typography>
  </>
)}
        </Box>
      )}

     
    </Paper>
  );
};

export default AppointmentTable;