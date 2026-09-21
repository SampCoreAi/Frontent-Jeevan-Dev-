"use client";
import React from "react";
import { Box, Typography, Chip, Card, Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { EventNote, CalendarToday, Person, Numbers } from "@mui/icons-material";

const MonthView = ({ selectedDate, events = [], onDateClick }) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const paperColor = theme.palette.background.paper;
  const backgroundColor = theme.palette.background.default;
  const textColor = theme.palette.text.primary;
  const secondaryText = theme.palette.text.secondary;
  const dividerColor = theme.palette.divider;

  const getEventColor = (type) => {
    switch (String(type || "").toLowerCase()) {
      case "completed":
        return theme.palette.success.main;
      case "cancelled":
        return theme.palette.error.main;
      case "emergency":
        return theme.palette.warning.main;
      default:
        return primaryColor;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 1.5 },
        borderRadius: "8px",
        backgroundColor,
        border: `1px solid ${dividerColor}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.7,
          }}
        >
          <CalendarToday
            sx={{
              color: primaryColor,
              fontSize: 17,
            }}
          />
          <Typography
            sx={{
              color: textColor,
              fontSize: { xs: "12.5px", sm: "13.5px" },
              fontWeight: 600,
            }}
          >
            {selectedDate.format("MMMM YYYY")}
          </Typography>
        </Box>
        <Chip
          label={`${events.length} ${
            events.length === 1 ? "appointment" : "appointments"
          }`}
          icon={<EventNote />}
          size="small"
          sx={{
            height: 24,
            borderRadius: "6px",
            backgroundColor: `${primaryColor}0D`,
            color: primaryColor,
            border: `1px solid ${primaryColor}25`,
            "& .MuiChip-icon": {
              color: primaryColor,
              fontSize: 14,
              ml: 0.7,
            },
            "& .MuiChip-label": {
              px: 0.8,
              fontSize: "10.5px",
              fontWeight: 600,
            },
          }}
        />
      </Box>
      <Grid
        container
        spacing={0.7}
        sx={{
          mb: 0.7,
          px: 0.2,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Grid key={day} size={{ xs: 12 / 7 }}>
            <Typography
              align="center"
              sx={{
                display: "block",
                color: secondaryText,
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        spacing={0.7}
        sx={{
          maxHeight: 520,
          overflowY: "auto",
          p: 0.2,
          "&::-webkit-scrollbar": {
            width: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: `${primaryColor}60`,
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
        {Array.from({ length: selectedDate.daysInMonth() }, (_, i) => {
          const date = selectedDate.date(i + 1);
          const dayEvents = events.filter((event) =>
            dayjs(event.date).isSame(date, "day")
          );
          const isToday = dayjs().isSame(date, "day");

          return (
            <Grid
              key={i}
              size={{
                xs: 12 / 7,
                sm: 12 / 7,
                md: 12 / 7,
                lg: 12 / 7,
              }}
              sx={{
                minHeight: { xs: 75, sm: 90, md: 105 },
              }}
            >
              <Card
                elevation={0}
                onClick={() => onDateClick(date)}
                sx={{
                  height: "100%",
                  minWidth: 0,
                  p: { xs: 0.5, sm: 0.7 },
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "7px",
                  cursor: "pointer",
                  backgroundColor: isToday
                    ? `${primaryColor}08`
                    : paperColor,
                  border: `1px solid ${
                    isToday ? primaryColor : dividerColor
                  }`,
                  transition: "border-color 0.15s ease",
                  "&:hover": {
                    borderColor: primaryColor,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: isToday
                        ? primaryColor
                        : "transparent",
                      color: isToday
                        ? theme.palette.primary.contrastText
                        : textColor,
                      fontSize: "10.5px",
                      fontWeight: isToday ? 600 : 500,
                      flexShrink: 0,
                    }}
                  >
                    {date.format("D")}
                  </Box>
                  {dayEvents.length > 0 && (
                    <Chip
                      label={dayEvents.length}
                      size="small"
                      sx={{
                        minWidth: 20,
                        height: 19,
                        borderRadius: "5px",
                        backgroundColor: `${primaryColor}0D`,
                        color: primaryColor,
                        border: `1px solid ${primaryColor}20`,
                        "& .MuiChip-label": {
                          px: 0.6,
                          fontSize: "9px",
                          fontWeight: 600,
                        },
                      }}
                    />
                  )}
                </Box>
                {dayEvents.length > 0 ? (
                  <Box
                    sx={{
                      mt: "auto",
                      pt: 0.6,
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.4,
                      minWidth: 0,
                    }}
                  >
                    {dayEvents.slice(0, 2).map((event, idx) => {
                      const eventColor = getEventColor(event.type);
                      return (
                        <Box
                          key={event.id || idx}
                          sx={{
                            minWidth: 0,
                            px: 0.5,
                            py: 0.4,
                            borderRadius: "4px",
                            backgroundColor: `${eventColor}08`,
                            borderLeft: `2px solid ${eventColor}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.35,
                              minWidth: 0,
                            }}
                          >
                            <Numbers
                              sx={{
                                fontSize: 10,
                                color: eventColor,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                minWidth: 0,
                                fontSize: "9px",
                                fontWeight: 600,
                                color: eventColor,
                              }}
                            >
                              {event.tokenNumber ||
                                event.token_number ||
                                event.id ||
                                `#${idx + 1}`}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.35,
                              minWidth: 0,
                              mt: 0.2,
                            }}
                          >
                            <Person
                              sx={{
                                fontSize: 10,
                                color: secondaryText,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                minWidth: 0,
                                fontSize: "9px",
                                fontWeight: 500,
                                color: textColor,
                              }}
                            >
                              {event.patientName ||
                                event.userName ||
                                event.name ||
                                event.title ||
                                "Unknown User"}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <Typography
                        sx={{
                          fontSize: "9px",
                          color: primaryColor,
                          fontWeight: 600,
                          textAlign: "center",
                          mt: 0.2,
                        }}
                      >
                        +{dayEvents.length - 2} more
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "9px",
                        color: secondaryText,
                        opacity: 0.6,
                      }}
                    >
                      No appointments
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default MonthView;