"use client";
import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@mui/material";

import HeaderSection from "../../components/Appointment/HeaderSection";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function AppointmentPage() {
  const [bookingFor, setBookingFor] = useState("self");
  const [selectedDate, setSelectedDate] = useState(null);

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "#ffffff",
      "& fieldset": { borderColor: "#cbd5e1" },
      "&:hover fieldset": { borderColor: "#14b8a6" },
      "&.Mui-focused fieldset": {
        borderColor: "#0f766e",
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": { color: "#64748b" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0f766e" },
  };

  return (
    <Box>
      <Navbar />

      <Paper sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
        <HeaderSection bookingFor={bookingFor} setBookingFor={setBookingFor} />

        {/* Center Wrapper */}
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          {/* Card */}
          <Box
            sx={{
              width: { xs: "95%", sm: "85%", md: "50%" },
              py: 4,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
              backgroundColor: "#ffffff",
            }}
          >
            {/* Inner Box */}
            <Box
              sx={{
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                display: "flex",
                flexDirection: "column",
                gap: 3,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              {/* Toggle */}
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#f6faf9",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 6,
                    left: bookingFor === "self" ? "6px" : "50%",
                    width: "48%",
                    height: "75%",
                    backgroundColor: "#fff",
                    border: "1px solid #309a8a",
                    borderRadius: 1,
                    transition: "all 0.3s ease",
                  }}
                />

                <Box
                  onClick={() => setBookingFor("self")}
                  sx={{
                    zIndex: 1,
                    px: { xs: 2, sm: 4 },
                    py: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: bookingFor === "self" ? 600 : 400,
                    color: "#309a8a",
                  }}
                >
                  <Person2OutlinedIcon fontSize="small" />
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    For Myself
                  </Box>
                  <Box
                    component="span"
                    sx={{ display: { xs: "inline", sm: "none" } }}
                  >
                    Self
                  </Box>
                </Box>

                <Box
                  onClick={() => setBookingFor("other")}
                  sx={{
                    zIndex: 1,
                    px: { xs: 2, sm: 4 },
                    py: 1,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: { xs: "14px", sm: "16px" },
                    fontWeight: bookingFor === "other" ? 600 : 400,
                    color: "#309a8a",
                  }}
                >
                  <GroupOutlinedIcon fontSize="small" />
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                  >
                    For Someone Else
                  </Box>
                  <Box
                    component="span"
                    sx={{ display: { xs: "inline", sm: "none" } }}
                  >
                    Someone
                  </Box>
                </Box>
              </Box>

              {/* FORM GRID */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                  },
                  gap: 2,
                }}
              >
                <TextField label="Name" fullWidth sx={fieldSx} />
                <TextField label="Email" fullWidth sx={fieldSx} />
                <TextField label="Mobile" fullWidth sx={fieldSx} />
                <TextField label="Age" type="number" fullWidth sx={fieldSx} />

                <TextField select label="Gender" fullWidth sx={fieldSx}>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>

                <Box sx={{ maxWidth: 400, mx: "auto", ...fieldSx }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Select Date"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth sx={fieldSx} />
                      )}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Reason */}
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <TextField
                    label="Reason for Visit"
                    multiline
                    rows={3}
                    fullWidth
                    sx={fieldSx}
                  />
                </Box>

                {/* Available Time Slots */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    gridColumn: "1 / -1",
                  }}
                >
                  <Typography sx={{ fontWeight: 500 }}>
                    Available Time Slots
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)",
                      },
                      gap: 2,
                    }}
                  >
                    {[
                      "09:00 AM",
                      "10:00 AM",
                      "10:30 AM",
                      "11:00 AM",
                      "11:30 AM",
                      "12:00 PM",
                      "12:30 PM",
                    ].map((time) => (
                      <Button
                        key={time}
                        fullWidth
                        sx={{
                          border: "1px solid #e2e5e5",
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 1,
                        }}
                      >
                        {time}
                      </Button>
                    ))}
                  </Box>
                </Box>

                {/* Button */}
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{
                      backgroundColor: "#f5fafa",
                      width: "180px",
                      ":hover": {
                        backgroundColor: "#028275",
                        color: "#ffffff",
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Footer />
    </Box>
  );
}
