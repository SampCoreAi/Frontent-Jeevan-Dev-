"use client";
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ Grid v2
import { useTheme } from "@mui/material/styles";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ScheduleView = ({ events, onEditEvent }) => {
  const theme = useTheme();

  const scheduleEvents = useMemo(() => {
    const grouped = {};
    events.forEach((event) => {
      if (!grouped[event.time]) {
        grouped[event.time] = [];
      }
      grouped[event.time].push(event);
    });
    return grouped;
  }, [events]);

  // ✅ event color from theme
  const getEventColor = (type) => {
    switch (type) {
      case "completed":
        return theme.palette.success.main;
      case "cancelled":
        return theme.palette.error.main;
      case "emergency":
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // ✅ priority color from theme
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" color="primary.main">
          Schedule Overview
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Organized by time slots
        </Typography>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={2}>
        {Object.entries(scheduleEvents).map(([time, timeEvents]) => (
          <Grid key={time} size={{ xs: 12 }}>
            <Card
              variant="outlined"
              sx={{
                transition: "all 0.2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <CardContent sx={{ p: 2 }}>
                {/* Time Header */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <AccessTimeIcon color="primary" />

                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {time}
                  </Typography>

                  <Chip
                    label={`${timeEvents.length} appointment${
                      timeEvents.length > 1 ? "s" : ""
                    }`}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {/* Events Grid */}
                <Grid container spacing={1}>
                  {timeEvents.map((event) => (
                    <Grid
                      key={event.id}
                      size={{ xs: 12, sm: 6, md: 4 }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: getEventColor(event.type),
                          color: "#fff",
                          borderRadius: 1,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          borderLeft: `4px solid ${getPriorityColor(
                            event.priority
                          )}`,
                          "&:hover": {
                            opacity: 0.9,
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={() => onEditEvent(event)}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          {event.title}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                          <PersonIcon sx={{ fontSize: 12 }} />
                          <Typography variant="caption">
                            {event.patient}
                          </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                          <LocationOnIcon sx={{ fontSize: 12 }} />
                          <Typography variant="caption">
                            {event.doctor} • {event.location}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ScheduleView;