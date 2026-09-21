"use client";
import React, { useMemo } from "react";
import { Box, Typography, Tooltip, Badge, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { AccessTime, Person, LocationOn } from "@mui/icons-material";

const WeekView = ({ selectedDate, events = [], onEditEvent }) => {
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
        isWeekend: date.day() === 0 || date.day() === 6,
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
      CANCELLED: {
        bg: `${theme.palette.error.main}12`,
        label: "Cancelled",
        color: theme.palette.error.main,
      },
      COMPLETED: {
        bg: `${theme.palette.info.main}12`,
        label: "Completed",
        color: theme.palette.info.main,
      },
    };
    return configs[String(status || "").toUpperCase()] || configs.PENDING;
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.2,
        overflowX: "auto",
        overflowY: "hidden",
        px: { xs: 0.5, sm: 1 },
        py: 1,
        backgroundColor,
        "&::-webkit-scrollbar": {
          height: 4,
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
      {weekDays.map((day) => (
        <Paper
          key={day.fullDate}
          elevation={0}
          sx={{
            minWidth: { xs: 235, sm: 245, md: 250 },
            width: { xs: 235, sm: 245, md: 250 },
            flex: "0 0 auto",
            borderRadius: "8px",
            backgroundColor: day.isToday ? `${primaryColor}05` : paperColor,
            border: `1px solid ${day.isToday ? primaryColor : dividerColor}`,
            overflow: "hidden",
            transition: "border-color 0.15s ease",
            "&:hover": {
              borderColor: `${primaryColor}80`,
            },
          }}
        >
          <Box
            sx={{
              px: 1.2,
              py: 1,
              borderBottom: `1px solid ${dividerColor}`,
              backgroundColor: day.isToday ? `${primaryColor}0A` : paperColor,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: day.isToday ? primaryColor : textColor,
                  }}
                >
                  {day.label}
                </Typography>
                <Box
                  sx={{
                    width: 25,
                    height: 25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: day.isToday ? primaryColor : backgroundColor,
                    color: day.isToday
                      ? theme.palette.primary.contrastText
                      : secondaryText,
                    fontSize: "10.5px",
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
                    minWidth: 21,
                    height: 20,
                    px: 0.6,
                    borderRadius: "6px",
                    backgroundColor:
                      day.eventCount > 0
                        ? `${primaryColor}12`
                        : backgroundColor,
                    color:
                      day.eventCount > 0 ? primaryColor : secondaryText,
                    border: `1px solid ${
                      day.eventCount > 0
                        ? `${primaryColor}30`
                        : dividerColor
                    }`,
                    fontSize: "9.5px",
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              p: 1,
              minHeight: 170,
              maxHeight: 390,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: 3,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `${primaryColor}50`,
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "transparent",
              },
            }}
          >
            {day.events.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.8,
                }}
              >
                {day.events.map((event) => {
                  const statusInfo = getStatusConfig(event.status);
                  const tokenDisplay = event.token_number
                    ? `#${event.token_number}`
                    : "";
                  return (
                    <Tooltip
                      key={event.id}
                      arrow
                      placement="right"
                      title={
                        <Box sx={{ p: 0.5, minWidth: 190 }}>
                          <Typography
                            sx={{
                              fontSize: "11.5px",
                              fontWeight: 600,
                              color:"white",
                              mb: 0.7,
                            }}
                            >
                            {event.reason_for_visit || "Appointment"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "10.5px",
                              color:"white",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 0.35,
                            }}
                          >
                            <AccessTime sx={{ fontSize: 13 }} />
                            {event.start_time || "N/A"} -{" "}
                            {event.end_time || "N/A"}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "10.5px",
                              display: "flex",
                              color:"white",
                              alignItems: "center",
                              gap: 0.5,
                              mb: 0.35,
                            }}
                          >
                            <Person sx={{ fontSize: 13 }} />
                            {event.patientName || "N/A"}
                          </Typography>
                          {event.doctor_name && (
                            <Typography
                            sx={{
                              fontSize: "10.5px",
                              mb: 0.35,
                              color:"white",
                            }}
                            >
                              Doctor: {event.doctor_name}
                            </Typography>
                          )}
                          {event.hospital_name && (
                            <Typography
                              sx={{
                                fontSize: "10.5px",
                                display: "flex",
                          color:"white",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 0.35,
                        }}
                        >
                              <LocationOn sx={{ fontSize: 13 }} />
                              {event.hospital_name}
                            </Typography>
                          )}
                          {event.patient_phone && (
                            <Typography
                              sx={{
                                fontSize: "10.5px",
                                mb: 0.35,
                              color:"white",
                              }}
                            >
                              Phone: {event.patient_phone}
                            </Typography>
                          )}
                          {event.age && (
                            <Typography sx={{ fontSize: "10.5px" }}>
                              Age: {event.age}
                            </Typography>
                          )}
                          {event.cancel_reason && (
                            <Typography
                              sx={{
                                fontSize: "10.5px",
                                color: theme.palette.error.light,
                                mt: 0.5,
                              }}
                            >
                              Cancel reason: {event.cancel_reason}
                            </Typography>
                          )}
                        </Box>
                      }
                    >
                      <Paper
                        elevation={0}
                        onClick={() => onEditEvent?.(event)}
                        sx={{
                          position: "relative",
                          p: 1,
                          borderRadius: "7px",
                          backgroundColor: paperColor,
                          border: `1px solid ${dividerColor}`,
                          cursor: "pointer",
                          overflow: "hidden",
                          transition: "border-color 0.15s ease",
                          "&:hover": {
                            borderColor: primaryColor,
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: "3px",
                            backgroundColor: statusInfo.color,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 0.6,
                            mb: 0.7,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.4,
                              minWidth: 0,
                            }}
                          >
                            <AccessTime
                              sx={{
                                fontSize: 13,
                                color: primaryColor,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                fontSize: "10px",
                                fontWeight: 600,
                                color: primaryColor,
                              }}
                            >
                              {event.start_time || "N/A"} -{" "}
                              {event.end_time || "N/A"}
                            </Typography>
                          </Box>
                          {tokenDisplay && (
                            <Box
                              sx={{
                                px: 0.6,
                                py: 0.2,
                                borderRadius: "4px",
                                flexShrink: 0,
                                backgroundColor: `${primaryColor}0D`,
                                color: primaryColor,
                                fontSize: "9px",
                                fontWeight: 600,
                              }}
                            >
                              {tokenDisplay}
                            </Box>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 0.7,
                            py: 0.25,
                            mb: 0.7,
                            borderRadius: "4px",
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.color,
                            fontSize: "9px",
                            fontWeight: 600,
                          }}
                        >
                          {statusInfo.label}
                        </Box>
                       
                        <Typography
                          noWrap
                          sx={{
                            fontSize: "10px",
                            color: secondaryText,
                            mb: 0.7,
                          }}
                        >
                          Reason: {event.reason_for_visit || "Not provided"}
                        </Typography>
                        {event.patientName && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              minWidth: 0,
                              mb: 0.4,
                            }}
                          >
                            <Person
                              sx={{
                                fontSize: 13,
                                color: secondaryText,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                fontSize: "10.5px",
                                fontWeight: 500,
                                color: textColor,
                              }}
                            >
                              {event.patientName}
                              {event.age ? ` • ${event.age}y` : ""}
                              {event.gender ? ` • ${event.gender}` : ""}
                            </Typography>
                          </Box>
                        )}
                        {event.cancel_reason && (
                          <Typography
                            noWrap
                            sx={{
                              mt: 0.5,
                              fontSize: "9.5px",
                              color: theme.palette.error.main,
                            }}
                          >
                            Cancelled: {event.cancel_reason}
                          </Typography>
                        )}
                      </Paper>
                    </Tooltip>
                  );
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  minHeight: 145,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor,
                  }}
                >
                  <Typography sx={{ fontSize: "14px" }}>📅</Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: "10.5px",
                    fontWeight: 500,
                    color: secondaryText,
                  }}
                >
                  No appointments
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default WeekView;