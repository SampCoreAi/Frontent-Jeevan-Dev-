
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";

import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import RefreshIcon from "@mui/icons-material/Refresh";

import api from "../../../../../utils/axiosInstance";

const TrackAppointment = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState([]);
  const [error, setError] = useState("");

  // ==========================================
  // GET TODAY DATE
  // ==========================================
  const getTodayDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    try {
      const date = new Date(`${dateString}T00:00:00`);

      return date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";

    try {
      const [hours, minutes] = timeString
        .split(":")
        .map(Number);

      const date = new Date();

      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);

      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  // ==========================================
  // STATUS COLOR
  // ==========================================
  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return {
          backgroundColor: "#ecfdf5",
          color: "#047857",
        };

      case "COMPLETED":
        return {
          backgroundColor: "#eff6ff",
          color: "#2563eb",
        };

      case "CANCELLED":
      case "CANCELED":
        return {
          backgroundColor: "#fef2f2",
          color: "#dc2626",
        };

      case "PENDING":
      default:
        return {
          backgroundColor: "#fff7ed",
          color: "#c2410c",
        };
    }
  };

  // ==========================================
  // TRACK APPOINTMENT
  // ==========================================
  const handleTrackAppointment = async () => {
    setLoading(true);
    setError("");
    setTrackingData([]);

    try {
      const response = await api.get(
        "/api/appointments/track-appointment"
      );

      console.log(
        "Track Appointment API Response:",
        response.data
      );

      const data = response.data?.data;

      // ==========================================
      // VALIDATE API RESPONSE
      // ==========================================
      if (!Array.isArray(data)) {
        setError(
          response.data?.message ||
            "Unable to track your appointment."
        );
        return;
      }

      // ==========================================
      // GET TODAY DATE
      // ==========================================
      const today = getTodayDate();

      console.log("Today's Date:", today);
      console.log(
        "Appointment Dates:",
        data.map((item) => item.slot_date)
      );

      // ==========================================
      // FILTER TODAY'S APPOINTMENTS
      // ==========================================
      const todaysAppointments = data.filter(
        (appointment) =>
          appointment?.slot_date === today
      );

    

      // ==========================================
      // NO APPOINTMENT TODAY
      // ==========================================
      if (todaysAppointments.length === 0) {
        setError(
          "You don't have any appointment scheduled for today."
        );
        return;
      }

      // ==========================================
      // SORT BY START TIME
      // ==========================================
      const sortedAppointments = [
        ...todaysAppointments,
      ].sort((a, b) => {
        return String(a.start_time || "").localeCompare(
          String(b.start_time || "")
        );
      });

      setTrackingData(sortedAppointments);
    } catch (error) {
      console.error(
        "Track appointment error:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to track your appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WHEN DIALOG OPENS
  // ==========================================
  useEffect(() => {
    if (open) {
      handleTrackAppointment();
    } else {
      setTrackingData([]);
      setError("");
    }
  }, [open]);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* ======================================
            HEADER
        ====================================== */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2.5,
            textAlign: "center",
            background:
              "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
          }}
        >
          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              backgroundColor: "#ccfbf1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1.5,
            }}
          >
            <TrackChangesIcon
              sx={{
                fontSize: 32,
                color: "#0d9488",
              }}
            />
          </Box>

          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ color: "#111827" }}
          >
            Track Appointment
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mt: 0.5,
            }}
          >
            Today's appointment status
          </Typography>
        </Box>

        <Box sx={{ px: 3, pb: 3 }}>
          {/* ======================================
              LOADING
          ====================================== */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
              }}
            >
              <CircularProgress
                size={38}
                thickness={4}
                sx={{
                  color: "#0d9488",
                  mb: 2,
                }}
              />

              <Typography
                sx={{
                  color: "#334155",
                  fontWeight: 500,
                }}
              >
                Checking your appointment...
              </Typography>
            </Box>
          )}

          {/* ======================================
              ERROR
          ====================================== */}
          {!loading && error && (
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                px: 2,
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 32 }}>
                  📅
                </Typography>
              </Box>

              <Typography
                fontWeight={800}
                sx={{
                  color: "#111827",
                  fontSize: 18,
                }}
              >
                No Appointment Today
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  mt: 1,
                  lineHeight: 1.6,
                }}
              >
                {error}
              </Typography>

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleTrackAppointment}
                sx={{
                  mt: 3,
                  borderColor: "#0d9488",
                  color: "#0d9488",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Try Again
              </Button>
            </Box>
          )}

          {/* ======================================
              APPOINTMENTS
          ====================================== */}
          {!loading &&
            !error &&
            trackingData.length > 0 && (
              <Box sx={{ pt: 2 }}>
                {/* Appointment Count */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    {trackingData.length}{" "}
                    {trackingData.length === 1
                      ? "Appointment"
                      : "Appointments"}{" "}
                    Today
                  </Typography>

                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleTrackAppointment}
                    sx={{
                      color: "#0d9488",
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    Refresh
                  </Button>
                </Box>

                {/* ==================================
                    APPOINTMENT CARDS
                ================================== */}
                {trackingData.map(
                  (appointment, index) => {
                    const statusStyles =
                      getStatusStyles(
                        appointment?.status
                      );

                    return (
                      <Box
                        key={
                          appointment?.appointment_id ??
                          index
                        }
                        sx={{
                          mb:
                            index ===
                            trackingData.length - 1
                              ? 0
                              : 2.5,
                          border: "1px solid #e2e8f0",
                          borderRadius: 3,
                          overflow: "hidden",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        {/* ==============================
                            CARD HEADER
                        ============================== */}
                        <Box
                          sx={{
                            px: 2,
                            py: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#64748b",
                              fontWeight: 600,
                            }}
                          >
                            Appointment #
                            {appointment.appointment_id}
                          </Typography>

                          <Chip
                            label={
                              appointment.status ||
                              "PENDING"
                            }
                            size="small"
                            sx={{
                              backgroundColor:
                                statusStyles.backgroundColor,
                              color:
                                statusStyles.color,
                              fontWeight: 800,
                              fontSize: 11,
                              borderRadius: 2,
                            }}
                          />
                        </Box>

                        {/* ==============================
                            HOSPITAL
                        ============================== */}
                        <Box sx={{ p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 1.5,
                              mb: 2,
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor:
                                "#f0fdfa",
                            }}
                          >
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                backgroundColor:
                                  "#ccfbf1",
                                display: "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "center",
                              }}
                            >
                              <LocalHospitalIcon
                                sx={{
                                  color:
                                    "#0d9488",
                                  fontSize: 22,
                                }}
                              />
                            </Box>

                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: "#64748b",
                                  fontWeight: 600,
                                }}
                              >
                                HOSPITAL
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 15,
                                  color: "#111827",
                                  fontWeight: 800,
                                  mt: 0.3,
                                }}
                              >
                                {appointment.hospital_name ||
                                  "Hospital not available"}
                              </Typography>
                            </Box>
                          </Box>

                          {/* ==========================
                              DATE & TIME
                          ========================== */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems:
                                "center",
                              gap: 1.5,
                              mb: 2,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{
                                color: "#0d9488",
                                fontSize: 21,
                              }}
                            />

                            <Box>
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  color: "#64748b",
                                }}
                              >
                                Appointment
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "#111827",
                                  fontWeight: 700,
                                  mt: 0.2,
                                }}
                              >
                                {formatDate(
                                  appointment.slot_date
                                )}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 13,
                                  color: "#475569",
                                  mt: 0.2,
                                }}
                              >
                                {formatTime(
                                  appointment.start_time
                                )}{" "}
                                -{" "}
                                {formatTime(
                                  appointment.end_time
                                )}
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          {/* ==========================
                              TOKEN SECTION
                          ========================== */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns:
                                "1fr 1fr",
                              gap: 1.5,
                            }}
                          >
                            {/* Currently Serving */}
                            <Box
                              sx={{
                                p: 1.8,
                                borderRadius: 2.5,
                                backgroundColor:
                                  "#f8fafc",
                                textAlign: "center",
                              }}
                            >
                              <PeopleAltIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#64748b",
                                  mb: 0.5,
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: "#64748b",
                                  fontWeight: 600,
                                }}
                              >
                                CURRENTLY SERVING
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 28,
                                  fontWeight: 900,
                                  color: "#111827",
                                  mt: 0.3,
                                }}
                              >
                                {appointment.currently_serving ??
                                  0}
                              </Typography>
                            </Box>

                            {/* Your Token */}
                            <Box
                              sx={{
                                p: 1.8,
                                borderRadius: 2.5,
                                backgroundColor:
                                  "#f0fdfa",
                                border:
                                  "2px solid #0d9488",
                                textAlign: "center",
                              }}
                            >
                              <ConfirmationNumberIcon
                                sx={{
                                  fontSize: 20,
                                  color: "#0d9488",
                                  mb: 0.5,
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: "#64748b",
                                  fontWeight: 600,
                                }}
                              >
                                YOUR TOKEN
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 28,
                                  fontWeight: 900,
                                  color: "#0d9488",
                                  mt: 0.3,
                                }}
                              >
                                {appointment.my_token ??
                                  "N/A"}
                              </Typography>
                            </Box>
                          </Box>

                          {/* ==========================
                              WAITING INFO
                          ========================== */}
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns:
                                "1fr 1fr",
                              gap: 1.5,
                              mt: 1.5,
                            }}
                          >
                            {/* Waiting Tokens */}
                            <Box
                              sx={{
                                p: 1.8,
                                borderRadius: 2.5,
                                backgroundColor:
                                  "#f8fafc",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: "#64748b",
                                  fontWeight: 600,
                                }}
                              >
                                PEOPLE WAITING
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 21,
                                  fontWeight: 800,
                                  color: "#111827",
                                  mt: 0.5,
                                }}
                              >
                                {appointment.waiting_tokens ??
                                  0}
                              </Typography>
                            </Box>

                            {/* Waiting Time */}
                            <Box
                              sx={{
                                p: 1.8,
                                borderRadius: 2.5,
                                backgroundColor:
                                  "#f8fafc",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 11,
                                  color: "#64748b",
                                  fontWeight: 600,
                                }}
                              >
                                APPROX. WAITING
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 21,
                                  fontWeight: 800,
                                  color: "#0d9488",
                                  mt: 0.5,
                                }}
                              >
                                {appointment.approx_waiting_time ||
                                  "N/A"}
                              </Typography>

                              {appointment.approx_waiting_minutes !==
                                undefined &&
                                appointment.approx_waiting_minutes !==
                                  null && (
                                  <Typography
                                    sx={{
                                      fontSize: 10,
                                      color: "#64748b",
                                      mt: 0.3,
                                    }}
                                  >
                                    Approx.{" "}
                                    {
                                      appointment.approx_waiting_minutes
                                    }{" "}
                                    minutes
                                  </Typography>
                                )}
                            </Box>
                          </Box>

                          {/* ==========================
                              QUEUE STATUS
                          ========================== */}
                          <Box
                            sx={{
                              mt: 1.5,
                              p: 1.8,
                              borderRadius: 2.5,
                              backgroundColor:
                                "#f0fdfa",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#64748b",
                                fontWeight: 600,
                              }}
                            >
                              QUEUE STATUS
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#0d9488",
                                fontWeight: 800,
                                mt: 0.5,
                              }}
                            >
                              Your Token{" "}
                              {appointment.my_token ??
                                "N/A"}{" "}
                              •{" "}
                              {
                                appointment.waiting_tokens ??
                                  0
                              }{" "}
                              waiting
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  }
                )}
              </Box>
            )}

          {/* ======================================
              CLOSE BUTTON
          ====================================== */}
          {!loading && (
            <Button
              fullWidth
              onClick={onClose}
              sx={{
                mt: 2.5,
                py: 1.2,
                textTransform: "none",
                color: "#64748b",
                fontWeight: 700,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              Close
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TrackAppointment;
