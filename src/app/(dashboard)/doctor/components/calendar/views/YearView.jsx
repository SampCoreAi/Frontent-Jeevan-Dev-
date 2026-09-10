"use client";
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Paper,
  Divider,
  Tooltip,
  Avatar,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import {
  CalendarToday,
  EventNote,
  CheckCircle,
  Schedule,
  Cancel,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Circle,
} from "@mui/icons-material";

const YearView = ({ selectedDate, allEvents, onMonthClick }) => {
  const theme = useTheme();
  const primaryColor = "#1e6658";

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = dayjs(selectedDate).month(i);
      const currentMonth = dayjs().month(i);
      const isCurrentMonth = dayjs().month(i).isSame(dayjs(), "month");

      const monthEvents = allEvents.filter((event) =>
        dayjs(event.date).isSame(month, "month")
      );

      const completed = monthEvents.filter((e) => e.status === "completed" || e.status === "done").length;
      const upcoming = monthEvents.filter((e) => e.status === "scheduled" || e.status === "pending").length;
      const cancelled = monthEvents.filter((e) => e.status === "cancelled").length;

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
          completionRate: monthEvents.length > 0 
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

  const getTrendIcon = (rate) => {
    if (rate > 70) return <TrendingUp sx={{ fontSize: 16, color: theme.palette.success.main }} />;
    if (rate > 40) return <TrendingFlat sx={{ fontSize: 16, color: theme.palette.warning.main }} />;
    return <TrendingDown sx={{ fontSize: 16, color: theme.palette.error.main }} />;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.default",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Enhanced Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <CalendarToday sx={{ color: primaryColor, fontSize: 32 }} />
          <Box>
            <Typography variant="h5" fontWeight="700" sx={{ color: primaryColor }}>
              Year Overview
            </Typography>
          
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Chip
            label={`${allEvents.length} total`}
            icon={<EventNote fontSize="small" />}
            sx={{
              color: primaryColor,
              borderColor: primaryColor,
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: primaryColor,
              },
            }}
            variant="outlined"
          />
        
        </Box>
      </Box>

      

      {/* Months Grid */}
      <Grid container spacing={2}>
        {months.map((month, index) => (
          <Grid key={month.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
                overflow: "visible",
                borderRadius: 2,
                borderColor: month.isCurrentMonth ? primaryColor : theme.palette.divider,
                borderWidth: month.isCurrentMonth ? 2 : 1,
                bgcolor: month.isCurrentMonth ? `${primaryColor}05` : "background.paper",
                "&:hover": {
                  boxShadow: theme.shadows[8],
                  transform: "translateY(-4px)",
                  borderColor: primaryColor,
                },
              }}
              onClick={() => onMonthClick(index)}
            >
              {month.isCurrentMonth && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    bgcolor: primaryColor,
                    color: "#fff",
                    px: 1.5,
                    py: 0.25,
                    borderRadius: 20,
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    boxShadow: theme.shadows[2],
                  }}
                >
                  Current
                </Box>
              )}

              <CardContent sx={{ p: 2.5 }}>
                {/* Month Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={2}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{ 
                        color: month.isCurrentMonth ? primaryColor : "#000000",
                        fontSize: "1.1rem",
                      }}
                    >
                      {month.shortName}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#000000", fontSize: "0.6rem", opacity: 0.7 }}
                    >
                      {month.name}
                    </Typography>
                  </Box>

                  <Chip
                    label={month.events.length}
                    size="small"
                    sx={{
                      bgcolor: month.events.length > 0 ? primaryColor : theme.palette.grey[300],
                      color: "#fff",
                      fontWeight: 600,
                      minWidth: 28,
                      "& .MuiChip-label": {
                        px: 1,
                      },
                    }}
                  />
                </Box>

            

                <Divider sx={{ my: 1.5 }} />

                {/* Events Preview */}
                {month.events.length > 0 ? (
                  <Box>
                    <Stack spacing={1}>
                      {month.events.slice(0, 2).map((event, idx) => (
                        <Box
                          key={event.id || idx}
                          sx={{
                            p: 1,
                            bgcolor: `${getEventColor(event.type)}10`,
                            borderLeft: `3px solid ${getEventColor(event.type)}`,
                            borderRadius: 1,
                            transition: "all 0.2s",
                            "&:hover": {
                              bgcolor: `${getEventColor(event.type)}20`,
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            fontWeight="600"
                            sx={{ 
                              color: "#000000",
                              fontSize: "0.65rem",
                              display: "block",
                              mb: 0.25,
                              opacity: 0.9,
                            }}
                          >
                            <Circle sx={{ 
                              fontSize: 6, 
                              color: getEventColor(event.type),
                              verticalAlign: "middle",
                              mr: 0.5,
                            }} />
                            {dayjs(event.date).format("DD MMM")} - {event.title || event.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              color: "#000000",
                              fontSize: "0.55rem",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              opacity: 0.7,
                            }}
                          >
                            <EventNote sx={{ fontSize: 10 }} />
                            Token: {event.token_number || event.id || "#NA"}
                            {` • ${event.patientName}`}
                          
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {month.events.length > 2 && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: primaryColor,
                          fontWeight: 600,
                          display: "block",
                          textAlign: "center",
                          mt: 1,
                          fontSize: "0.6rem",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        +{month.events.length - 2} more appointments
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      py: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#000000", fontSize: "0.6rem", opacity: 0.4 }}>
                      No events this month
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Legend */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={3}
        mt={3}
        pt={2}
        borderTop={`1px solid ${theme.palette.divider}`}
        flexWrap="wrap"
      >
        {["completed", "cancelled", "emergency", "default"].map((type) => (
          <Box key={type} display="flex" alignItems="center" gap={0.75}>
            <Circle
              sx={{
                fontSize: 10,
                color: getEventColor(type),
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6rem",
                textTransform: "capitalize",
                color: "#000000",
                fontWeight: 500,
                opacity: 0.7,
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