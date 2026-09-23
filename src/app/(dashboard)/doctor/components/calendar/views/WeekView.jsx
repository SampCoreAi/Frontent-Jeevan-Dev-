"use client";
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Badge,
  Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { AccessTime } from "@mui/icons-material";

const WeekView = ({
  selectedDate,
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

  const weekDays = useMemo(() => {
    const startOfWeek = selectedDate.startOf("week");

    return Array.from({ length: 7 }, (_, i) => {
      const date = startOfWeek.add(i, "day");

      const dayEvents = events.filter(
        (event) =>
          dayjs(event.date).format("YYYY-MM-DD") ===
          date.format("YYYY-MM-DD")
      );

      return {
        label: date.format("ddd"),
        date: date.date(),
        fullDate: date.format("YYYY-MM-DD"),
        dayjs: date,
        isToday: date.isSame(dayjs(), "day"),
        events: dayEvents,
        eventCount: dayEvents.length,
      };
    });
  }, [selectedDate, events]);

  const getStatusConfig = (status) => {
    const configs = {
      PENDING: {
        bg: `${theme.palette.warning.main}12`,
        label: "Pending",
        color: theme.palette.warning.main,
      },
      CONFIRMED: {
        bg: `${theme.palette.success.main}12`,
        label: "Confirmed",
        color: theme.palette.success.main,
      },
      IN_PROGRESS: {
        bg: `${primaryColor}12`,
        label: "In Progress",
        color: primaryColor,
      },
      CANCELLED: {
        bg: `${theme.palette.error.main}12`,
        label: "Cancelled",
        color: theme.palette.error.main,
      },
      COMPLETED: {
        bg: `${theme.palette.success.main}12`,
        label: "Completed",
        color: theme.palette.success.main,
      },
    };

    return (
      configs[String(status || "").toUpperCase()] ||
      configs.PENDING
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        overflowY: "hidden",
        px: { xs: 0.5, sm: 1 },
        py: 1,
        backgroundColor,
        "&::-webkit-scrollbar": {
          height: 4,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: `${primaryColor}60`,
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      {weekDays.map((day) => {
        const visibleEvents = day.events.slice(0, 8);
        const hiddenCount = Math.max(
          0,
          day.events.length - visibleEvents.length
        );

        return (
          <Paper
            key={day.fullDate}
            elevation={0}
            sx={{
              minWidth: {
                xs: 210,
                sm: 220,
                md: 225,
              },
              width: {
                xs: 210,
                sm: 220,
                md: 225,
              },
              flex: "0 0 auto",
              borderRadius: "8px",
              minHeight: "450px",
              height: "auto",
              backgroundColor: day.isToday
                ? `${primaryColor}05`
                : paperColor,
              border: `1px solid ${
                day.isToday
                  ? primaryColor
                  : dividerColor
              }`,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 1,
                py: 0.8,
                borderBottom: `1px solid ${dividerColor}`,
                backgroundColor: day.isToday
                  ? `${primaryColor}08`
                  : paperColor,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.7,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: day.isToday
                        ? primaryColor
                        : textColor,
                    }}
                  >
                    {day.label}
                  </Typography>

                  <Box
                    sx={{
                      width: 23,
                      height: 23,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: day.isToday
                        ? primaryColor
                        : backgroundColor,
                      color: day.isToday
                        ? theme.palette.primary.contrastText
                        : secondaryText,
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {day.date}
                  </Box>
                </Box>

                <Badge
                  badgeContent={day.eventCount}
                  showZero
                  sx={{
                    mr: 1,
                    "& .MuiBadge-badge": {
                      position: "relative",
                      transform: "none",
                      minWidth: 20,
                      height: 19,
                      px: 0.5,
                      borderRadius: "5px",
                      backgroundColor:
                        day.eventCount > 0
                          ? `${primaryColor}12`
                          : backgroundColor,
                      color:
                        day.eventCount > 0
                          ? primaryColor
                          : secondaryText,
                      border: `1px solid ${
                        day.eventCount > 0
                          ? `${primaryColor}25`
                          : dividerColor
                      }`,
                      fontSize: "9px",
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                p: 0.7,
                minHeight: 400,
              }}
            >
              {day.events.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                  }}
                >
                  {visibleEvents.map((event, index) => {
                    const statusInfo =
                      getStatusConfig(event.status);

                    return (
                      <Paper
                        key={event.id || index}
                        elevation={0}
                        onClick={() =>
                          onAppointmentClick?.(event)
                        }
                        sx={{
                          position: "relative",
                          width: "100%",
                          minWidth: 0,
                          px: 0.9,
                          py: 0.7,
                          borderRadius: "6px",
                          backgroundColor: paperColor,
                          border: `1px solid ${dividerColor}`,
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "0.15s ease",
                          "&:hover": {
                            borderColor:
                              statusInfo.color,
                            backgroundColor: `${statusInfo.color}05`,
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "3px",
                            backgroundColor:
                              statusInfo.color,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            gap: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: 0,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.4,
                            }}
                          >
                            <AccessTime
                              sx={{
                                fontSize: 12,
                                color: statusInfo.color,
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              noWrap
                              sx={{
                                fontSize: "9.5px",
                                fontWeight: 700,
                                color: statusInfo.color,
                              }}
                            >
                              {event.start_time ||
                                "N/A"}{" "}
                              -{" "}
                              {event.end_time ||
                                "N/A"}
                            </Typography>
                          </Box>

                          {event.token_number && (
                            <Typography
                              sx={{
                                flexShrink: 0,
                                fontSize: "8.5px",
                                fontWeight: 700,
                                color: secondaryText,
                              }}
                            >
                              #{event.token_number}
                            </Typography>
                          )}
                        </Box>

                        <Box
                          sx={{
                            mt: 0.55,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                              "space-between",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            noWrap
                            sx={{
                              minWidth: 0,
                              flex: 1,
                              fontSize: "10px",
                              fontWeight: 600,
                              color: textColor,
                            }}
                          >
                            {event.patientName ||
                              "Unknown Patient"}
                          </Typography>

                          <Box
                            sx={{
                              flexShrink: 0,
                              px: 0.6,
                              py: 0.2,
                              borderRadius: "4px",
                              backgroundColor:
                                statusInfo.bg,
                              color: statusInfo.color,
                              fontSize: "8px",
                              fontWeight: 700,
                            }}
                          >
                            {statusInfo.label}
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })}

                  {hiddenCount > 0 && (
                    <Box
                      onClick={() =>
                        onMoreClick?.(
                          day.dayjs,
                          day.events
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
                    minHeight: 380,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10px",
                      color: secondaryText,
                    }}
                  >
                    No appointments
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default WeekView;