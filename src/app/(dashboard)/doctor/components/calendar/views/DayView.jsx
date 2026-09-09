"use client";
import React, { useMemo } from "react";
import { Box, Typography, Tooltip, Chip, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DayView = ({ events, onEditEvent, onDeleteEvent }) => {
  const theme = useTheme();

  const timeSlots = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const hour = 7 + i;
      return {
        label: `${hour}:00 - ${hour + 1}:00`,
        hour: hour,
        time: `${hour.toString().padStart(2, "0")}:00`,
      };
    });
  }, []);

  // 👉 Custom Colors
  const getEventStyles = (type) => {
    return {
      bg: "#E4ECEB",
      text: "#1E6658",
    };
  };
  const getHourFromTime = (time) => {
  if (!time) return null;

  const [timePart, modifier] = time.trim().split(" ");
  let [hour] = timePart.split(":").map(Number);

  if (modifier === "PM" && hour !== 12) {
    hour += 12;
  }

  if (modifier === "AM" && hour === 12) {
    hour = 0;
  }

  return hour;
};

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        maxHeight: "80vh",
        overflowY: "auto",
        p: 2,
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#1E6658",
          borderRadius: 4,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: theme.palette.grey[200],
        },
      }}
    >
{timeSlots.map((slot) => {
  const slotEvents = events.filter((event) => {
    const eventHour = getHourFromTime(event.start_time);
    return eventHour === slot.hour;
  });

  return (
    <Box
      key={slot.hour}
      sx={{
        border: "1px solid",
        borderColor: "#E4ECEB",
        borderRadius: 2,
        p: 2,
        minHeight: 340,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          color: "#1E6658",
          mb: 1,
        }}
      >
        {slot.label}
      </Typography>

      {slotEvents.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {slotEvents.map((event) => {
            const colors = getEventStyles(event.type);

            return (
              <Tooltip
                key={event.id}
                title={
                  <Box>
                    <Typography variant="subtitle2">
                      {event.reason_for_visit || "Appointment"}
                    </Typography>

                    <Typography variant="caption">
                      Patient: {event.patientName || "N/A"}
                    </Typography>

                    <br />

                    <Typography variant="caption">
                      Doctor: {event.doctor_name || "N/A"}
                    </Typography>

                    <br />

                    <Typography variant="caption">
                      Status: {event.status || "N/A"}
                    </Typography>

                    <br />

                    <Typography variant="caption">
                      Time: {event.start_time || "N/A"} -{" "}
                      {event.end_time || "N/A"}
                    </Typography>
                  </Box>
                }
              >
                <Chip
                  label={`${event.reason_for_visit || "Appointment"} - ${
                    event.status || ""
                  }`}
                  sx={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    fontWeight: 600,
                    border: "1px solid #C9DBD7",
                    maxWidth: "100%",
                    "&:hover": {
                      backgroundColor: "#d8e5e3",
                    },
                  }}
                  onClick={() => onEditEvent(event)}
                />
              </Tooltip>
            );
          })}
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "#7A8A87",
          }}
        >
          No appointments scheduled
        </Typography>
      )}
    </Box>
  );
})}
    </Box>
  );
};

export default DayView;