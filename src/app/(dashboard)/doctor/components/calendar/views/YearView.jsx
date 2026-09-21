"use client";
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import {
  CalendarToday,
  EventNote,
  Circle,
} from "@mui/icons-material";

const YearView = ({ selectedDate, allEvents, onMonthClick }) => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = dayjs(selectedDate).month(i);
      const currentMonth = dayjs().month(i);
      const isCurrentMonth = dayjs().month(i).isSame(dayjs(), "month");
      const monthEvents = allEvents.filter((event) =>
        dayjs(event.date).isSame(month, "month")
      );
      const completed = monthEvents.filter(
        (e) => e.status === "completed" || e.status === "done"
      ).length;
      const upcoming = monthEvents.filter(
        (e) => e.status === "scheduled" || e.status === "pending"
      ).length;
      const cancelled = monthEvents.filter(
        (e) => e.status === "cancelled"
      ).length;

      return {
        name: month.format("MMMM"),
        shortName: month.format("MMM"),
        events: monthEvents,
        isCurrentMonth,
        stats: {
          total: monthEvents.length,
          completed,
          upcoming,
          cancelled,
          completionRate:
            monthEvents.length > 0
              ? Math.round((completed / monthEvents.length) * 100)
              : 0,
        },
      };
    });
  }, [selectedDate, allEvents]);

  const getEventColor = (type) => {
    switch (type) {
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
        bgcolor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: "7px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: `${primaryColor}10`,
              border: `1px solid ${primaryColor}20`,
            }}
          >
            <CalendarToday
              sx={{
                color: primaryColor,
                fontSize: 16,
              }}
            />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1.2,
                color: theme.palette.text.primary,
              }}
            >
              Year Overview
            </Typography>
            <Typography
              sx={{
                mt: 0.2,
                fontSize: "10px",
                color: theme.palette.text.secondary,
              }}
            >
              {selectedDate.format("YYYY")} appointment summary
            </Typography>
          </Box>
        </Box>
        <Chip
          label={`${allEvents.length} total`}
          icon={<EventNote />}
          size="small"
          sx={{
            height: 24,
            borderRadius: "6px",
            bgcolor: `${primaryColor}0D`,
            color: primaryColor,
            border: `1px solid ${primaryColor}25`,
            "& .MuiChip-icon": {
              color: primaryColor,
              fontSize: 14,
              ml: 0.7,
            },
            "& .MuiChip-label": {
              px: 0.8,
              fontSize: "10px",
              fontWeight: 600,
            },
          }}
        />
      </Box>
      <Grid container spacing={1}>
        {months.map((month, index) => (
          <Grid
            key={month.name}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 3,
            }}
          >
            <Card
              elevation={0}
              onClick={() => onMonthClick(index)}
              sx={{
                height: "100%",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                borderRadius: "8px",
                border: `1px solid ${
                  month.isCurrentMonth
                    ? primaryColor
                    : theme.palette.divider
                }`,
                bgcolor: month.isCurrentMonth
                  ? `${primaryColor}05`
                  : theme.palette.background.paper,
                transition: "border-color 0.15s ease",
                "&:hover": {
                  borderColor: primaryColor,
                },
              }}
            >
              {month.isCurrentMonth && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    px: 0.8,
                    py: 0.3,
                    borderBottomLeftRadius: "6px",
                    bgcolor: primaryColor,
                    color: theme.palette.primary.contrastText,
                    fontSize: "8.5px",
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  Current
                </Box>
              )}
              <CardContent
                sx={{
                  p: "12px !important",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        lineHeight: 1.2,
                        color: month.isCurrentMonth
                          ? primaryColor
                          : theme.palette.text.primary,
                      }}
                    >
                      {month.shortName}
                    </Typography>
                    <Typography
                      sx={{
                        mt: 0.2,
                        fontSize: "9.5px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {month.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      minWidth: 25,
                      height: 23,
                      px: 0.7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      bgcolor:
                        month.events.length > 0
                          ? `${primaryColor}0D`
                          : theme.palette.background.default,
                      color:
                        month.events.length > 0
                          ? primaryColor
                          : theme.palette.text.secondary,
                      border: `1px solid ${
                        month.events.length > 0
                          ? `${primaryColor}20`
                          : theme.palette.divider
                      }`,
                      fontSize: "9.5px",
                      fontWeight: 600,
                    }}
                  >
                    {month.events.length}
                  </Box>
                </Box>
                <Divider sx={{ mb: 1 }} />
                {month.events.length > 0 ? (
                  <Box>
                    <Stack spacing={0.6}>
                      {month.events.slice(0, 2).map((event, idx) => (
                        <Box
                          key={event.id || idx}
                          sx={{
                            minWidth: 0,
                            px: 0.7,
                            py: 0.6,
                            borderRadius: "5px",
                            bgcolor: `${getEventColor(event.type)}08`,
                            borderLeft: `2px solid ${getEventColor(
                              event.type
                            )}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              minWidth: 0,
                            }}
                          >
                            <Circle
                              sx={{
                                fontSize: 5,
                                flexShrink: 0,
                                color: getEventColor(event.type),
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                minWidth: 0,
                                fontSize: "9.5px",
                                fontWeight: 600,
                                color: theme.palette.text.primary,
                              }}
                            >
                              {dayjs(event.date).format("DD MMM")} -{" "}
                              {event.title || event.name}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.4,
                              mt: 0.35,
                              minWidth: 0,
                            }}
                          >
                            <EventNote
                              sx={{
                                fontSize: 10,
                                flexShrink: 0,
                                color: theme.palette.text.secondary,
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                minWidth: 0,
                                fontSize: "9px",
                                color: theme.palette.text.secondary,
                              }}
                            >
                              Token:{" "}
                              {event.token_number || event.id || "#NA"}
                              {event.patientName
                                ? ` • ${event.patientName}`
                                : ""}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                    {month.events.length > 2 && (
                      <Typography
                        sx={{
                          mt: 0.7,
                          fontSize: "9px",
                          fontWeight: 600,
                          color: primaryColor,
                          textAlign: "center",
                        }}
                      >
                        +{month.events.length - 2} more appointments
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      minHeight: 65,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "5px",
                      bgcolor: theme.palette.background.default,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "9.5px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      No appointments
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          mt: 1.5,
          pt: 1.2,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {["completed", "cancelled", "emergency", "default"].map((type) => (
          <Box
            key={type}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Circle
              sx={{
                fontSize: 7,
                color: getEventColor(type),
              }}
            />
            <Typography
              sx={{
                fontSize: "9.5px",
                textTransform: "capitalize",
                color: theme.palette.text.secondary,
              }}
            >
              {type}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default YearView;