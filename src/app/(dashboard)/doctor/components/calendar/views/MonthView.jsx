"use client";
import React from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import {
  EventNote,
  CalendarToday,
} from "@mui/icons-material";

const MonthView = ({
  selectedDate,
  events = [],
  onDateClick,
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

  const getEventColor = (type, status) => {
    const value = String(
      type || status || ""
    ).toLowerCase();

    switch (value) {
      case "completed":
        return theme.palette.success.main;
      case "cancelled":
        return theme.palette.error.main;
      case "emergency":
        return theme.palette.warning.main;
      case "in_progress":
      case "scheduled":
        return primaryColor;
      default:
        return primaryColor;
    }
  };

  const firstDay = selectedDate
    .startOf("month")
    .day();

  const daysInMonth =
    selectedDate.daysInMonth();

  const calendarCells = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    ),
  ];

  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: {
          xs: 0.8,
          sm: 1.5,
        },
        borderRadius: "8px",
        backgroundColor,
        border: `1px solid ${dividerColor}`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.8,
          mb: 1.2,
          px: {
            xs: 0.2,
            sm: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          <CalendarToday
            sx={{
              color: primaryColor,
              fontSize: {
                xs: 15,
                sm: 17,
              },
            }}
          />

          <Typography
            sx={{
              color: textColor,
              fontSize: {
                xs: "12px",
                sm: "13.5px",
              },
              fontWeight: 700,
            }}
          >
            {selectedDate.format(
              "MMMM YYYY"
            )}
          </Typography>
        </Box>

        <Chip
          label={`${events.length} ${
            events.length === 1
              ? "appointment"
              : "appointments"
          }`}
          icon={<EventNote />}
          size="small"
          sx={{
            height: {
              xs: 22,
              sm: 24,
            },
            borderRadius: "6px",
            backgroundColor: `${primaryColor}0D`,
            color: primaryColor,
            border: `1px solid ${primaryColor}25`,
            "& .MuiChip-icon": {
              color: primaryColor,
              fontSize: {
                xs: 12,
                sm: 14,
              },
              ml: 0.6,
            },
            "& .MuiChip-label": {
              px: 0.7,
              fontSize: {
                xs: "9px",
                sm: "10.5px",
              },
              fontWeight: 600,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          overflowX: {
            xs: "auto",
            sm: "hidden",
          },
          overflowY: "hidden",
          pb: {
            xs: 0.5,
            sm: 0,
          },
          "&::-webkit-scrollbar": {
            height: 4,
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
        <Box
          sx={{
            minWidth: {
              xs: 600,
              sm: "100%",
            },
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7, minmax(0, 1fr))",
              gap: {
                xs: 0.45,
                sm: 0.7,
              },
              mb: 0.6,
              px: 0.15,
            }}
          >
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <Box
                key={day}
                sx={{
                  py: 0.4,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: secondaryText,
                    fontSize: {
                      xs: "9px",
                      sm: "10px",
                    },
                    fontWeight: 700,
                    textTransform:
                      "uppercase",
                  }}
                >
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7, minmax(0, 1fr))",
              gap: {
                xs: 0.45,
                sm: 0.7,
              },
              maxHeight: {
                xs: 480,
                sm: 520,
              },
              overflowY: "auto",
              p: 0.15,
              "&::-webkit-scrollbar": {
                width: 4,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: `${primaryColor}50`,
                borderRadius: "10px",
              },
            }}
          >
            {calendarCells.map(
              (dayNumber, index) => {
                if (!dayNumber) {
                  return (
                    <Box
                      key={`empty-${index}`}
                      sx={{
                        minHeight: {
                          xs: 80,
                          sm: 90,
                          md: 105,
                        },
                      }}
                    />
                  );
                }

                const date =
                  selectedDate.date(
                    dayNumber
                  );

                const dayEvents =
                  events.filter(
                    (event) =>
                      dayjs(
                        event.date
                      ).isSame(
                        date,
                        "day"
                      )
                  );

                const isToday =
                  dayjs().isSame(
                    date,
                    "day"
                  );

                const visibleEvents =
                  dayEvents.slice(0, 2);

                const hiddenCount =
                  Math.max(
                    0,
                    dayEvents.length -
                      visibleEvents.length
                  );

                return (
                  <Card
                    key={dayNumber}
                    elevation={0}
                    onClick={() =>
                      onDateClick?.(date)
                    }
                    sx={{
                      minWidth: 0,
                      minHeight: {
                        xs: 80,
                        sm: 90,
                        md: 105,
                      },
                      p: {
                        xs: 0.45,
                        sm: 0.7,
                      },
                      display: "flex",
                      flexDirection:
                        "column",
                      borderRadius: {
                        xs: "6px",
                        sm: "7px",
                      },
                      cursor: "pointer",
                      backgroundColor:
                        isToday
                          ? `${primaryColor}08`
                          : paperColor,
                      border: `1px solid ${
                        isToday
                          ? primaryColor
                          : dividerColor
                      }`,
                      transition:
                        "border-color 0.15s ease, background-color 0.15s ease",
                      "&:hover": {
                        borderColor:
                          primaryColor,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        gap: 0.3,
                      }}
                    >
                      <Box
                        sx={{
                          width: {
                            xs: 21,
                            sm: 24,
                          },
                          height: {
                            xs: 21,
                            sm: 24,
                          },
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          borderRadius:
                            "50%",
                          backgroundColor:
                            isToday
                              ? primaryColor
                              : "transparent",
                          color: isToday
                            ? theme.palette
                                .primary
                                .contrastText
                            : textColor,
                          fontSize: {
                            xs: "9.5px",
                            sm: "10.5px",
                          },
                          fontWeight:
                            isToday
                              ? 700
                              : 600,
                          flexShrink: 0,
                        }}
                      >
                        {dayNumber}
                      </Box>

                      {dayEvents.length >
                        0 && (
                        <Box
                          sx={{
                            minWidth: 18,
                            height: 18,
                            px: 0.4,
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            borderRadius:
                              "5px",
                            backgroundColor: `${primaryColor}0D`,
                            border: `1px solid ${primaryColor}20`,
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize:
                                "8px",
                              fontWeight:
                                700,
                              color:
                                primaryColor,
                              lineHeight: 1,
                            }}
                          >
                            {
                              dayEvents.length
                            }
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {dayEvents.length >
                    0 ? (
                      <Box
                        sx={{
                          mt: "auto",
                          pt: 0.5,
                          display: "flex",
                          flexDirection:
                            "column",
                          gap: 0.35,
                          minWidth: 0,
                        }}
                      >
                        {visibleEvents.map(
                          (
                            event,
                            idx
                          ) => {
                            const eventColor =
                              getEventColor(
                                event.type,
                                event.status
                              );

                            return (
                              <Box
                                key={
                                  event.id ||
                                  idx
                                }
                                onClick={(
                                  e
                                ) => {
                                  e.stopPropagation();
                                  onAppointmentClick?.(
                                    event
                                  );
                                }}
                                sx={{
                                  minWidth: 0,
                                  width:
                                    "100%",
                                  px: {
                                    xs: 0.4,
                                    sm: 0.6,
                                  },
                                  py: {
                                    xs: 0.3,
                                    sm: 0.35,
                                  },
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  borderRadius:
                                    "3px",
                                  backgroundColor: `${eventColor}12`,
                                  borderLeft: `3px solid ${eventColor}`,
                                  overflow:
                                    "hidden",
                                  cursor:
                                    "pointer",
                                  "&:hover": {
                                    backgroundColor: `${eventColor}22`,
                                  },
                                }}
                              >
                                <Typography
                                  noWrap
                                  sx={{
                                    minWidth:
                                      0,
                                    width:
                                      "100%",
                                    fontSize: {
                                      xs: "8.5px",
                                      sm: "10px",
                                    },
                                    fontWeight:
                                      600,
                                    color:
                                      textColor,
                                    lineHeight:
                                      1.3,
                                    overflow:
                                      "hidden",
                                    textOverflow:
                                      "ellipsis",
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      fontWeight:
                                        700,
                                      color:
                                        eventColor,
                                    }}
                                  >
                                    {event.tokenNumber ||
                                      event.token_number ||
                                      event.id ||
                                      idx +
                                        1}
                                  </Box>

                                  <Box
                                    component="span"
                                    sx={{
                                      mx: 0.4,
                                      color:
                                        secondaryText,
                                    }}
                                  >
                                    •
                                  </Box>

                                  {event.patientName ||
                                    event.userName ||
                                    event.name ||
                                    event.title ||
                                    "Unknown"}
                                </Typography>
                              </Box>
                            );
                          }
                        )}

                        {hiddenCount >
                          0 && (
                          <Box
                            onClick={(
                              e
                            ) => {
                              e.stopPropagation();

                              onMoreClick?.(
                                date,
                                dayEvents
                              );
                            }}
                            sx={{
                              width:
                                "100%",
                              px: 0.4,
                              py: 0.3,
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              borderRadius:
                                "3px",
                              backgroundColor: `${primaryColor}12`,
                              border: `1px solid ${primaryColor}20`,
                              cursor:
                                "pointer",
                              "&:hover": {
                                backgroundColor: `${primaryColor}20`,
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "8.5px",
                                  sm: "10px",
                                },
                                fontWeight:
                                  700,
                                color:
                                  primaryColor,
                                lineHeight:
                                  1.3,
                              }}
                            >
                              +
                              {
                                hiddenCount
                              }{" "}
                              more
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          flex: 1,
                          display: {
                            xs: "none",
                            sm: "flex",
                          },
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize:
                              "9px",
                            color:
                              secondaryText,
                            opacity: 0.6,
                          }}
                        >
                          No appointments
                        </Typography>
                      </Box>
                    )}
                  </Card>
                );
              }
            )}
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          mt: 0.7,
          textAlign: "center",
          fontSize: "8.5px",
          color: secondaryText,
        }}
      >
        Swipe left or right to view full calendar
      </Typography>
    </Paper>
  );
};

export default MonthView;