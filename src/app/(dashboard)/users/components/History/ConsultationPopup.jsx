"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import { useState } from "react"
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Prescription from "../../../doctor/components/prescription"

export default function ConsultationPopup({
  open,
  handleClose,
  selectedConsultation,
  handleGeneratePdf,
  generatingPdf,
  pdfRef,
  handleCancelAppointment,
}) {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return {
          bg: "#dff5e8",
          color: "#1b5e20",
        };

      case "upcoming":
        return {
          bg: "#e3f2fd",
          color: "#1565c0",
        };

      default:
        return {
          bg: "#fff4de",
          color: "#b26a00",
        };
    }
  };

  const statusStyle = getStatusStyle(selectedConsultation?.status);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "2",
          overflow: "hidden",
          width: "95%",
          maxWidth: "1400px",
          background: "#fff",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          color: "#fff",
          px: 3,
          py: 2.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom:"2px solid black"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 22 }} />

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "22px",
              color:"black"
            }}
          >
            Consultation Details
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          sx={{
            color: "black",

            "&:hover": {
              background: "rgba(255,255,255,0.12)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          background: "#f8fbfa",
          p: 3,
          mt: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "stretch",
            height: "70vh",
          }}
        >
          {/* Left Side */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
            }}
          >
            {selectedConsultation && (
              <Box ref={pdfRef}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid #d7e7e2",
                    background: "#fff",
                  }}
                >
                  {/* Top Section */}
                  <Box
                    sx={{
                      background: "#eef7f5",
                      px: 3,
                      py: 2.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {/* Left */}
                    <Box>
                      <Typography
                        sx={{
                          color: "#1e6658",
                          fontSize: "13px",
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        Token Number
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          icon={<CheckCircleIcon sx={{ color: "#fff !important" }} />}
                          label={selectedConsultation.token}
                          sx={{
                            background: "#1e6658",
                            color: "#fff",
                            fontWeight: 700,
                            borderRadius: "10px",
                          }}
                        />


                      </Box>
                    </Box>

                    {/* Right */}
                    <Chip
                      label={selectedConsultation.status}
                      sx={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 700,
                        borderRadius: "10px",
                        px: 1,
                      }}
                    />
                  </Box>

                  {/* Details */}
                  <Box sx={{ p: 3 }}>
                    {/* Grid */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                        },
                        gap: 3,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#6b7280",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Doctor Name
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#111827",
                            fontSize: "15px",
                          }}
                        >
                          {selectedConsultation.doctor}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#6b7280",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Department
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#111827",
                            fontSize: "15px",
                          }}
                        >
                          {selectedConsultation.department}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          gridColumn: {
                            xs: "auto",
                            sm: "1 / -1",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#6b7280",
                            fontWeight: 600,
                            mb: 0.5,
                          }}
                        >
                          Reason For Visit
                        </Typography>

                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#111827",
                            fontSize: "15px",
                            lineHeight: 1.6,
                          }}
                        >
                          {selectedConsultation.title}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider
                      sx={{
                        my: 3,
                        borderColor: "#e5e7eb",
                      }}
                    />

                    {/* Bottom Info */}
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                        },
                        gap: 3,
                      }}
                    >
                      {/* Date */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                        }}
                      >
                        <CalendarTodayOutlinedIcon
                          sx={{
                            color: "#1e6658",
                            fontSize: 20,
                            mt: "2px",
                          }}
                        />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#6b7280",
                            }}
                          >
                            Date
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#111827",
                              fontSize: "14px",
                            }}
                          >
                            {selectedConsultation.date}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Time */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                        }}
                      >
                        <AccessTimeOutlinedIcon
                          sx={{
                            color: "#1e6658",
                            fontSize: 20,
                            mt: "2px",
                          }}
                        />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#6b7280",
                            }}
                          >
                            Time
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#111827",
                              fontSize: "14px",
                            }}
                          >
                            {selectedConsultation.time}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Address */}
                      <Box
                        sx={{
                          gridColumn: {
                            xs: "auto",
                            sm: "1 / -1",
                          },
                          display: "flex",
                          gap: 1.5,
                        }}
                      >
                        <LocationOnOutlinedIcon
                          sx={{
                            color: "#1e6658",
                            fontSize: 20,
                            mt: "2px",
                          }}
                        />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#6b7280",
                            }}
                          >
                            Address
                          </Typography>

                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#111827",
                              fontSize: "14px",
                              lineHeight: 1.6,
                            }}
                          >
                            {selectedConsultation.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              bgcolor: "#fff",
              borderRadius: "20px",
              border: "1px solid #d7e7e2",
              overflowY: "auto",
              p: 2,
            }}
          >
         <Prescription
  consultation={selectedConsultation}
  appointmentId={selectedConsultation?.id}
/>
          </Box>
        </Box>
      </DialogContent>



    </Dialog>
  );
}