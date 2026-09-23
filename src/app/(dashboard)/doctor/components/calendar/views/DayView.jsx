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
  onAppointmentClick,
  onMoreClick,
}) => {
  const theme = useTheme();

  const primaryColor = theme.palette.primary.main;
  const paperColor = theme.palette.background.paper;
  const backgroundColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;
  const secondaryText = theme.palette.text.secondary;
  const dividerColor = theme.palette.divider;

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

  const getStatusStyles = (status) => {
    const value = String(status || "").toUpperCase();

    if (value === "COMPLETED") {
      return {
        bg: `${theme.palette.success.main}0D`,
        text: theme.palette.success.main,
        border: `${theme.palette.success.main}30`,
        hover: `${theme.palette.success.main}18`,
      };
    }

    if (value === "CANCELLED") {
      return {
        bg: `${theme.palette.error.main}0D`,
        text: theme.palette.error.main,
        border: `${theme.palette.error.main}30`,
        hover: `${theme.palette.error.main}18`,
      };
    }

    if (value === "IN_PROGRESS") {
      return {
        bg: `${primaryColor}0D`,
        text: primaryColor,
        border: `${primaryColor}30`,
        hover: `${primaryColor}18`,
      };
    }

    return {
      bg: `${theme.palette.warning.main}0D`,
      text: theme.palette.warning.main,
      border: `${theme.palette.warning.main}30`,
      hover: `${theme.palette.warning.main}18`,
    };
  };

  const getHourFromTime = (time) => {
    if (!time) return null;

    const value = String(time).trim();
    const [timePart, modifier] = value.split(" ");

    let hour = Number(timePart.split(":")[0]);

    if (Number.isNaN(hour)) return null;

    if (
      modifier?.toUpperCase() === "PM" &&
      hour !== 12
    ) {
      hour += 12;
    }

    if (
      modifier?.toUpperCase() === "AM" &&
      hour === 12
    ) {
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
        backgroundColor,
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

        const visibleEvents = slotEvents.slice(0, 8);

        const hiddenCount = Math.max(
          0,
          slotEvents.length - visibleEvents.length
        );

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

            {slotEvents.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.6,
                }}
              >
                {visibleEvents.map((event, index) => {
                  const colors = getStatusStyles(
                    event.status
                  );

                  return (
                    <Tooltip
                      key={event.id || index}
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
                              color: "white",
                              mb: 0.6,
                            }}
                          >
                            {event.patientName ||
                              "Unknown Patient"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "10.5px",
                              mb: 0.25,
                            }}
                          >
                            Reason:{" "}
                            {event.reason_for_visit ||
                              "N/A"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "10.5px",
                              mb: 0.25,
                            }}
                          >
                            Doctor:{" "}
                            {event.doctor_name ||
                              event.doctorName ||
                              "N/A"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "10.5px",
                              mb: 0.25,
                            }}
                          >
                            Status:{" "}
                            {event.status || "N/A"}
                          </Typography>

                          <Typography
                            sx={{
                              color: "white",
                              fontSize: "10.5px",
                            }}
                          >
                            Time:{" "}
                            {event.start_time || "N/A"} -{" "}
                            {event.end_time || "N/A"}
                          </Typography>
                        </Box>
                      }
                    >
                      <Box
                        onClick={() =>
                          onAppointmentClick?.(event)
                        }
                        sx={{
                          width: "100%",
                          minWidth: 0,
                          height: 34,
                          px: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 0.7,
                          borderRadius: "6px",
                          backgroundColor: colors.bg,
                          border: `1px solid ${colors.border}`,
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "0.15s ease",
                          "&:hover": {
                            backgroundColor: colors.hover,
                          },
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            minWidth: 0,
                            flex: 1,
                            fontSize: "10.5px",
                            fontWeight: 600,
                            color: textColor,
                          }}
                        >
                          {event.token_number && (
                            <Box
                              component="span"
                              sx={{
                                color: colors.text,
                                fontWeight: 700,
                              }}
                            >
                              #{event.token_number}
                              {" • "}
                            </Box>
                          )}

                          {event.patientName ||
                            "Unknown Patient"}
                        </Typography>

                        <Box
                          sx={{
                            flexShrink: 0,
                            px: 0.6,
                            py: 0.2,
                            borderRadius: "4px",
                            backgroundColor: `${colors.text}12`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "8px",
                              fontWeight: 700,
                              color: colors.text,
                              lineHeight: 1.3,
                              textTransform: "capitalize",
                            }}
                          >
                            {String(
                              event.status || "Pending"
                            )
                              .replaceAll("_", " ")
                              .toLowerCase()}
                          </Typography>
                        </Box>
                      </Box>
                    </Tooltip>
                  );
                })}

                {hiddenCount > 0 && (
                  <Box
                    onClick={() =>
                      onMoreClick?.(
                        slotEvents[0]?.date,
                        slotEvents
                      )
                    }
                    sx={{
                      width: "100%",
                      minHeight: 34,
                      px: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      cursor: "pointer",
                      backgroundColor: `${primaryColor}0D`,
                      border: `1px solid ${primaryColor}25`,
                      transition: "0.15s ease",
                      "&:hover": {
                        backgroundColor: `${primaryColor}18`,
                        borderColor: `${primaryColor}50`,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: primaryColor,
                      }}
                    >
                      +{hiddenCount} more
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
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