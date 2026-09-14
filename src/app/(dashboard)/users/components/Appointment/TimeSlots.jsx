"use client";

import React from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
  Tooltip,
  Button,
} from "@mui/material";
import dayjs from "dayjs";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { formatTime } from "../../../../../config/timeFormatter";
const TimeSlots = ({
  selectedDate,
  selectedSlot,
  setSelectedSlot,
  filteredSlots,
  errors,
  setErrors,
}) => {
  return (
    <Box>
    <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 2,
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Typography fontWeight={600} color="#0f172a">
      Available Time Slots
    </Typography>

    <Box
      component="span"
      sx={{
        color: "error.main",
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      *
    </Box>

    {selectedDate && (
      <Chip
        size="small"
        label={selectedDate.format("MMM D")}
        sx={{
          backgroundColor: "#f0fdfa",
          color: "#0f766e",
          fontWeight: 600,
        }}
      />
    )}
  </Box>

  <Typography
    variant="caption"
    sx={{
      color: "#64748b",
      fontStyle: "italic",
    }}
  >
    Hover token to see time
  </Typography>
</Box>

      {errors.slot && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {errors.slot}
        </Alert>
      )}

      {filteredSlots.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2,1fr)",
              sm: "repeat(3,1fr)",
              lg: "repeat(4,1fr)",
            },
            gap: 1.5,
          }}
        >
          {filteredSlots.map((slot, index) => {
 
            const isSelected =
              selectedSlot?.start === slot.start &&
              selectedSlot?.date === slot.date;
            const isDisabled = slot.status?.toUpperCase() !== "ACTIVE";

    const getTooltipMessage = () => {
  if (slot.status?.toUpperCase() === "DELETED") {
    return "Slot unavailable";
  }

  if (slot.status?.toUpperCase() !== "ACTIVE") {
    return "Already booked";
  }

              const startTime = dayjs(`2000-01-01 ${slot.start}`);

              const beforeTime = startTime.subtract(10, "minute");
              const afterTime = startTime.add(10, "minute");

              return `${beforeTime.format("hh:mm A")} → ${afterTime.format(
                "hh:mm A"
              )}`;
            };

            return (
              <Tooltip
                key={index}
                title={getTooltipMessage()}
                arrow
              >
                <span>
                  <Button
                    onClick={() =>
                      !isDisabled && setSelectedSlot(slot)
                    }
                    disabled={isDisabled}
                    variant={
                      isSelected ? "contained" : "outlined"
                    }
                    sx={{
                      textTransform: "none",
                      fontSize: "0.875rem",
                      borderRadius: "10px",
                      py: 1.5,
                      borderColor: isSelected
                        ? "#0d9488"
                        : isDisabled
                          ? "#e2e8f0"
                          : "#cbd5e1",
                      backgroundColor: isSelected
                        ? "#0d9488"
                        : isDisabled
                          ? "#f1f5f9"
                          : "#fff",
                      color: isSelected
                        ? "#fff"
                        : isDisabled
                          ? "#94a3b8"
                          : "#334155",
                      fontWeight: isSelected ? 600 : 500,
                      "&:hover": {
                        backgroundColor: isSelected
                          ? "#0f766e"
                          : "#f0fdfa",
                        borderColor: isSelected
                          ? "#0f766e"
                          : "#14b8a6",
                        transform: isDisabled
                          ? "none"
                          : "translateY(-1px)",
                      },
                      transition: "all 0.2s ease",
                      cursor: isDisabled
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                   Token {slot.tokenNumber}
                  </Button>
                </span>
              </Tooltip>
            );
          })}
        </Box>
      ) : selectedDate ? (
        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            backgroundColor: "#f0f9ff",
            color: "#0369a1",
          }}
        >
          No slots available for this date. Please select
          another date.
        </Alert>
      ) : (
        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            backgroundColor: "#f0fdf4",
            color: "#15803d",
          }}
          icon={<CalendarTodayIcon />}
        >
          Please select a date to view available slots
        </Alert>
      )}
    </Box>
  );
};

export default TimeSlots;