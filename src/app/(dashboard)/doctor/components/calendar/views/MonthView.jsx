"use client";
import React from "react";
import { Box, Typography, Chip, Card, Paper, Badge, Divider, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { EventNote, CalendarToday, Circle, Person, Numbers } from "@mui/icons-material";

const MonthView = ({ selectedDate, events, onDateClick }) => {
  const theme = useTheme();
  
  // Custom color
  const primaryColor = "#1e6658";

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return theme.palette.success.main;
      case "pending":
        return theme.palette.warning.main;
      case "cancelled":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
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
        mb={3}
        flexWrap="wrap"
        gap={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarToday sx={{ color: primaryColor, fontSize: 28 }} />
          <Typography variant="h5" fontWeight="600" sx={{ color: primaryColor }}>
            {selectedDate.format("MMMM YYYY")}
          </Typography>
        </Box>

        <Chip
          label={`${events.length} appointments`}
          icon={<EventNote fontSize="small" />}
          sx={{ 
            color: primaryColor,
            borderColor: primaryColor,
            fontWeight: 500,
            '& .MuiChip-icon': {
              color: primaryColor
            }
          }}
          variant="outlined"
        />
      </Box>

      {/* Day Headers */}
      <Grid container spacing={1} sx={{ mb: 1, px: 0.5 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Grid key={day} size={{ xs: 12 / 7 }}>
            <Typography
              variant="caption"
              align="center"
              display="block"
              fontWeight="600"
              sx={{ 
                color: primaryColor,
                fontSize: "0.7rem", 
                textTransform: "uppercase",
                opacity: 0.7
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Grid
        container
        spacing={1}
        sx={{
          overflowY: "auto",
          maxHeight: 520,
          p: 0.5,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": {
            bgcolor: theme.palette.grey[100],
            borderRadius: 3,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: primaryColor,
            borderRadius: 3,
            opacity: 0.5,
            "&:hover": {
              backgroundColor: primaryColor,
              opacity: 1,
            },
          },
        }}
      >
        {Array.from({ length: selectedDate.daysInMonth() }, (_, i) => {
          const date = selectedDate.date(i + 1);
          const dayEvents = events.filter((e) =>
            dayjs(e.date).isSame(date, "day")
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
                aspectRatio: "1",
                minHeight: 80,
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  bgcolor: isToday ? `${primaryColor}15` : "background.paper",
                  borderColor: isToday ? primaryColor : theme.palette.divider,
                  borderWidth: isToday ? 2 : 1,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                    borderColor: primaryColor,
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
                onClick={() => onDateClick(date)}
              >
                {/* Date Badge */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Badge
                    color="primary"
                    variant="dot"
                    invisible={!isToday}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={isToday ? "700" : "500"}
                      sx={{
                        color: isToday ? primaryColor : "text.primary",
                        fontSize: "0.85rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {date.format("D")}
                    </Typography>
                  </Badge>
                  
                  {dayEvents.length > 0 && (
                    <Chip
                      label={dayEvents.length}
                      size="small"
                      sx={{
                        minWidth: 20,
                        height: 20,
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        bgcolor: getEventColor(dayEvents[0]?.type),
                        color: "#fff",
                        "& .MuiChip-label": {
                          px: 0.5,
                        },
                      }}
                    />
                  )}
                </Box>

                {/* Events Display with Token Number and User Name */}
                {dayEvents.length > 0 ? (
                  <Box sx={{ mt: "auto", pt: 0.5 }}>
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          mb: 0.25,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.25,
                          p: 0.25,
                          borderRadius: 0.5,
                          bgcolor: `${primaryColor}08`,
                          borderLeft: `2px solid ${getEventColor(event.type)}`,
                          pl: 0.5,
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Numbers sx={{ 
                            fontSize: 10, 
                            color: primaryColor,
                            opacity: 0.7
                          }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.55rem",
                              fontWeight: 600,
                              color: primaryColor,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            Token: {event.tokenNumber || event.id || `#${idx + 1}`}
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Person sx={{ 
                            fontSize: 10, 
                            color: primaryColor,
                            opacity: 0.7
                          }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: "0.55rem",
                              fontWeight: 500,
                              color: "text.primary",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {event.userName || event.name || event.title || "Unknown User"}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    
                    {dayEvents.length > 2 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.55rem",
                          color: primaryColor,
                          fontWeight: 500,
                          display: "block",
                          textAlign: "center",
                          mt: 0.25,
                        }}
                      >
                        +{dayEvents.length - 2} more appointments
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flex={1}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{
                        fontSize: "0.55rem",
                        opacity: 0.5,
                      }}
                    >
                      No events
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Legend */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={2}
        pt={2}
        borderTop={`1px solid ${theme.palette.divider}`}
        flexWrap="wrap"
      >
        {["completed", "cancelled", "emergency", "default"].map((type) => (
          <Box key={type} display="flex" alignItems="center" gap={0.5}>
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
                color: "black",
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

export default MonthView;