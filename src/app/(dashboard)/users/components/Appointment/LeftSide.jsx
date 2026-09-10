"use client";

import React from "react";
import { Box, Typography, Fade, Chip } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import HeaderSection from "../../../../Home/components/Appointment/HeaderSection";
import dayjs from "dayjs";
const LeftSide = ({ bookingFor, setBookingFor, selectedDate, selectedSlot, userCity, hasMatchingSchedules }) => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",

        height: {
          xs: "auto",
          md: "100%",
        },

        minHeight: {
          xs: 280,
          md: "100%",
        },

        flex: 1,

        display: "flex",
        flexDirection: "column",
        justifyContent: {
          xs: "flex-start",
          md: "center",
        },

        p: {
          xs: 3,
          md: 4,
        },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(20, 184, 166, 0.1)",
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <HeaderSection
          bookingFor={bookingFor}
          setBookingFor={setBookingFor}
        />


        {/* Booking Summary Card */}
        {(selectedDate || selectedSlot) && (
          <Fade in={true}>
            <Box
              sx={{
                mt: 4,
                p: 3,
                backgroundColor: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 2,
                border: "1px solid rgba(20, 184, 166, 0.2)",
              }}
            >
              <Typography
                variant="subtitle2"
                color="#0f766e"
                fontWeight={600}
                gutterBottom
              >
                Appointment Summary
              </Typography>
              {selectedDate && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <CalendarTodayIcon
                    sx={{ fontSize: 16, color: "#14b8a6" }}
                  />
                  <Typography variant="body2" color="#475569">
                    {selectedDate.format("dddd, MMMM D, YYYY")}
                  </Typography>
                </Box>
              )}
              {selectedSlot && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon
                    sx={{ fontSize: 16, color: "#14b8a6" }}
                  />

                  <Typography variant="body2" color="#475569">
                    {(() => {
                      const startTime = dayjs(`2000-01-01 ${selectedSlot.start}`);

                      const beforeTime = startTime.subtract(10, "minute");
                      const afterTime = startTime.add(10, "minute");

                      return `${beforeTime.format("hh:mm A")} → ${afterTime.format(
                        "hh:mm A"
                      )}`;
                    })()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default LeftSide;