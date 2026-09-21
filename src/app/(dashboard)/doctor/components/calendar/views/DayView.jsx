"use client";

import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Tooltip,
  Chip,
  useTheme,
} from "@mui/material";

const DayView = ({
  events = [],
  onEditEvent,
  onDeleteEvent,
}) => {
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;
  const paperColor = theme.palette.background.paper;
  const backgroundColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;
  const secondaryText = theme.palette.text.secondary;
  const dividerColor = theme.palette.divider;

  // ============================
  // TIME SLOTS
  // ============================

  const timeSlots = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const hour = 7 + i;

      return {
        label: `${hour}:00 - ${hour + 1}:00`,
        hour,
        time: `${hour.toString().padStart(2, "0")}:00`,
      };
    });
  }, []);

  // ============================
  // EVENT COLORS
  // ============================

  const getEventStyles = () => {
    return {
      bg: `${primaryColor}0D`,
      text: primaryColor,
      border: `${primaryColor}30`,
      hover: `${primaryColor}18`,
    };
  };

  // ============================
  // GET HOUR FROM TIME
  // Supports:
  // 09:30
  // 09:30:00
  // 09:30 AM
  // 02:30 PM
  // ============================

  const getHourFromTime = (time) => {
    if (!time) return null;

    const value = String(time).trim();
    const [timePart, modifier] = value.split(" ");

    let hour = Number(timePart.split(":")[0]);

    if (Number.isNaN(hour)) return null;

    if (modifier?.toUpperCase() === "PM" && hour !== 12) {
      hour += 12;
    }

    if (modifier?.toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }

    return hour;
  };

  // ============================
  // UI
  // ============================

  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },

        gap: {
          xs: 1,
          sm: 1.2,
        },

        maxHeight: "75vh",
        overflowY: "auto",

        p: {
          xs: 1,
          sm: 1.2,
        },

        backgroundColor: backgroundColor,

        // Scrollbar
        "&::-webkit-scrollbar": {
          width: "4px",
        },

        "&::-webkit-scrollbar-thumb": {
          backgroundColor: `${primaryColor}70`,
          borderRadius: "10px",
        },

        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: primaryColor,
        },

        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      {timeSlots.map((slot) => {
        const slotEvents = events.filter((event) => {
          const eventHour = getHourFromTime(
            event?.start_time
          );

          return eventHour === slot.hour;
        });

        return (
          <Box
            key={slot.hour}
            sx={{
              minWidth: 0,
              minHeight: 150,

              display: "flex",
              flexDirection: "column",

              p: 1.2,

              border: `1px solid ${dividerColor}`,
              borderRadius: "8px",

              backgroundColor: paperColor,

              transition: "border-color 0.15s ease",

              "&:hover": {
                borderColor: `${primaryColor}60`,
              },
            }}
          >
            {/* ============================
                TIME HEADER
            ============================ */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,

                pb: 0.8,
                mb: 0.8,

                borderBottom: `1px solid ${dividerColor}`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: primaryColor,
                  lineHeight: 1.3,
                }}
              >
                {slot.label}
              </Typography>

              {slotEvents.length > 0 && (
                <Box
                  sx={{
                    minWidth: 20,
                    height: 20,

                    px: 0.6,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: "5px",

                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,

                    fontSize: "9.5px",
                    fontWeight: 600,
                  }}
                >
                  {slotEvents.length}
                </Box>
              )}
            </Box>

            {/* ============================
                APPOINTMENTS
            ============================ */}

            {slotEvents.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.7,
                }}
              >
                {slotEvents.map((event) => {
                  const colors = getEventStyles(
                    event?.type
                  );

                  return (
                    <Tooltip
                      key={event.id}
                      arrow
                      placement="top"
                      title={
                        <Box
                          sx={{
                            p: 0.5,
                            minWidth: 180,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "11.5px",
                              fontWeight: 600,
                              color:"white",
                              mb: 0.6,
                            }}
                            >
                            {event.reason_for_visit ||
                              "Appointment"}
                          </Typography>

                          <Typography
                            sx={{
                              color:"white",
                              fontSize: "10.5px",
                              mb: 0.25,
                            }}
                            >
                            Patient:{" "}
                            {event.patientName || "N/A"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "10.5px",
                              mb: 0.25,
                              color:"white",
                            }}
                            >
                            Doctor:{" "}
                            {event.doctor_name || "N/A"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "10.5px",
                              color:"white",
                              mb: 0.25,
                            }}
                            >
                            Status: {event.status || "N/A"}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: "10.5px",
                              color:"white",
                            }}
                          >
                            Time:{" "}
                            {event.start_time || "N/A"} -{" "}
                            {event.end_time || "N/A"}
                          </Typography>
                        </Box>
                      }
                    >
                      <Chip
                        clickable
                        onClick={() =>
                          onEditEvent?.(event)
                        }
                        label={`${
                          event.reason_for_visit ||
                          "Appointment"
                        }${
                          event.status
                            ? ` • ${event.status}`
                            : ""
                        }`}
                        sx={{
                          width: "100%",
                          maxWidth: "100%",
                          height: 30,

                          justifyContent: "flex-start",

                          borderRadius: "6px",

                          backgroundColor: colors.bg,
                          color: colors.text,

                          border: `1px solid ${colors.border}`,

                          "& .MuiChip-label": {
                            width: "100%",
                            px: 1,

                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",

                            textAlign: "left",

                            fontSize: "10.5px",
                            fontWeight: 500,
                          },

                          "&:hover": {
                            backgroundColor: colors.hover,
                          },
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            ) : (
              /* ============================
                  EMPTY SLOT
              ============================ */

              <Box
                sx={{
                  flex: 1,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  minHeight: 80,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "10.5px",
                    color: secondaryText,
                    textAlign: "center",
                  }}
                >
                  No appointments
                </Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default DayView;