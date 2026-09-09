import React, { useMemo } from "react";
import { Box, Typography, Tooltip, Badge, Paper, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { AccessTime, Person, LocationOn, MedicalServices } from "@mui/icons-material";

const WeekView = ({ selectedDate, events, onEditEvent }) => {
  const theme = useTheme();
  console.log("selectedDate", selectedDate.format("YYYY-MM-DD"));
  console.log(events);
  const weekDays = useMemo(() => {
    const startOfWeek = selectedDate.startOf("week");

    return Array.from({ length: 7 }, (_, i) => {
      const date = startOfWeek.add(i, "day");

      const dayEvents = events.filter((event) => {
        return dayjs(event.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD");
      });

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
        bg: "#FFF8E1",
        label: "Pending",
        color: "#F57F17",
        icon: "⏳"
      },
      CONFIRMED: {
        bg: "#E8F5E9",
        label: "Confirmed",
        color: "#2E7D32",
        icon: "✅"
      },
      CANCELLED: {
        bg: "#FFEBEE",
        label: "Cancelled",
        color: "#C62828",
        icon: "❌"
      },
      COMPLETED: {
        bg: "#E3F2FD",
        label: "Completed",
        color: "#0D47A1",
        icon: "✔️"
      },
    };
    return configs[status?.toUpperCase()] || configs.PENDING;
  };

  return (
    <Box
      display="flex"
      gap={2}
      sx={{
        minHeight: 550,
        overflowX: "auto",
        overflowY: "hidden",
        px: 2,
        pb: 2,
        pt: 1,
        "&::-webkit-scrollbar": {
          height: 6,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#1E6658",
          borderRadius: 10,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        },
      }}
    >
      {weekDays.map((day) => (
        <Paper
          key={day.label}
          elevation={0}
          sx={{
            minWidth: {
              xs: 280,
              sm: 300,
              md: 320,
            },
            maxWidth: 340,
            flex: "0 0 auto",
            borderRadius: 3,
            bgcolor: day.isToday ? "#F8FBF9" : "#FFFFFF",
            border: day.isToday ? "2px solid #1E6658" : "1px solid #707070",
            transition: "all 0.2s ease",
            overflow: "hidden",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(30, 102, 88, 0.08)",
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              pb: 1.5,
              borderBottom: "1px solid #E8EDF2",
              bgcolor: day.isToday ? "#F0F7F5" : "transparent",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <Typography
                  fontWeight="700"
                  variant="subtitle1"
                  sx={{
                    color: day.isToday ? "#1E6658" : "#37474F",
                    fontSize: {
                      xs: "0.9rem",
                      sm: "1rem",
                    },
                    letterSpacing: "0.3px",
                  }}
                >
                  {day.label}
                </Typography>
                <Box
                  sx={{
                    bgcolor: day.isToday ? "#1E6658" : "#E8EDF2",
                    color: day.isToday ? "#FFFFFF" : "#607D8B",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                  }}
                >
                  {day.date}
                </Box>
              </Box>

              <Badge
                badgeContent={day.eventCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#1E6658",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                  },
                }}
              />
            </Box>
          </Box>

          {/* Events List */}
          <Box
            sx={{
              p: 1.5,
              maxHeight: 420,
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: 4,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#1E6658",
                borderRadius: 4,
              },
            }}
          >
            {day.events.length > 0 ? (
              <Box display="flex" flexDirection="column" gap={1.5}>
                {day.events.map((event) => {
                  const statusInfo = getStatusConfig(event.status);
                  const tokenDisplay = event.token_number ? `#${event.token_number}` : "";
                  const department = event.doctor_department || "General";

                  return (
                    <Tooltip
                      key={event.id}
                      title={
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body2" fontWeight={600} gutterBottom>
                            {event.reason_for_visit || "No reason provided"}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                            <AccessTime sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                            {event.start_time} – {event.end_time}
                          </Typography>
                          <Typography variant="caption" display="block">
                            <Person sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                            {event.doctor_name || "Doctor"}
                          </Typography>
                          {event.hospital_name && (
                            <Typography variant="caption" display="block">
                              <LocationOn sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }} />
                              {event.hospital_name}
                            </Typography>
                          )}
                          {event.cancel_reason && (
                            <Typography variant="caption" display="block" color="error" sx={{ mt: 0.5 }}>
                              {statusInfo.icon} {event.cancel_reason}
                            </Typography>
                          )}
                          {event.patientName  && (
                            <Typography variant="caption" display="block">
                              👤 Patient: {event.patientName }
                            </Typography>
                          )}
                          {event.patient_phone && (
                            <Typography variant="caption" display="block">
                              📞 {event.patient_phone}
                            </Typography>
                          )}
                          {event.age && (
                            <Typography variant="caption" display="block">
                              🎂 Age: {event.age}
                            </Typography>
                          )}
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Paper
                        onClick={() => onEditEvent(event)}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: statusInfo.status === "CANCELLED" ? "#FAFAFA" : "#FFFFFF",
                          border: "1px solid #E8EDF2",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          opacity: statusInfo.status === "CANCELLED" ? 0.7 : 1,
                          position: "relative",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(30, 102, 88, 0.12)",
                            borderColor: "#1E6658",
                          },
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: 3,
                            bgcolor: statusInfo.color,
                            borderRadius: "2px 0 0 2px",
                          },
                        }}
                      >
                        {/* Header: Time + Token + Status */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                          gap={1}
                        >
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTime sx={{ fontSize: 14, color: "#1E6658" }} />
                            <Typography
                              sx={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                color: "#1E6658",
                              }}
                            >
                              {event.start_time} – {event.end_time}
                            </Typography>
                          </Box>

                          {tokenDisplay && (
                            <Typography
                              sx={{
                                fontSize: "0.65rem",
                                fontWeight: 700,
                                color: "#1E6658",
                                bgcolor: "#E0F2F1",
                                px: 1,
                                py: 0.25,
                                borderRadius: 1.5,
                              }}
                            >
                              {tokenDisplay}
                            </Typography>
                          )}

                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.35,
                              borderRadius: 10,
                              bgcolor: statusInfo.bg,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography sx={{ fontSize: "0.65rem" }}>
                              {statusInfo.icon}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                color: statusInfo.color,
                                textTransform: "capitalize",
                              }}
                            >
                              {statusInfo.label}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Title - Main Reason for Visit */}
                       {/* Appointment Title */}
<Typography
  sx={{
    fontSize: "0.9rem",
    fontWeight: 700,
    color: "#263238",
    lineHeight: 1.3,
    mb: 0.5,
  }}
>
  Appointment
</Typography>

{/* Reason For Visit */}
<Typography
  sx={{
    fontSize: "0.75rem",
    color: "#607D8B",
    mb: 1,
  }}
>
  🩺 Reason: {event.reason_for_visit || "No reason provided"}
</Typography>

                        {/* Patient Name and Age - Clean display */}
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                          mb={0.5}
                        >
                          {event.patientName  && (
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                color: "#455A64",
                                fontWeight: 500,
                              }}
                            >
                              👤 {event.patientName}
                            </Typography>
                          )}
                          {event.age && (
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                color: "#78909C",
                              }}
                            >
                              🎂 {event.age}y
                            </Typography>
                          )}
                          {event.gender && (
                            <Typography
                              sx={{
                                fontSize: "0.75rem",
                                color: "#78909C",
                              }}
                            >
                              {event.gender === "MALE" ? "♂" : event.gender === "FEMALE" ? "♀" : event.gender}
                            </Typography>
                          )}
                        </Box>

                        {/* Contact Info - Compact */}
                        {event.patient_phone && (
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              color: "#90A4AE",
                              mb: 0.5,
                            }}
                          >
                            📞 {event.patient_phone}
                          </Typography>
                        )}

                        {/* Cancel Reason */}
                        {event.cancel_reason && (
                          <Typography
                            sx={{
                              fontSize: "0.65rem",
                              color: "#C62828",
                              fontStyle: "italic",
                              mt: 0.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                            noWrap
                          >
                            {statusInfo.icon} {event.cancel_reason}
                          </Typography>
                        )}
                      </Paper>
                    </Tooltip>
                  );
                })}
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                  height: "100%",
                  minHeight: 150,
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#F5F7F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "1.5rem" }}>📅</Typography>
                </Box>
                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{
                    color: "#90A4AE",
                    fontSize: {
                      xs: "0.8rem",
                      sm: "0.85rem",
                    },
                    fontWeight: 500,
                  }}
                >
                  No appointments
                </Typography>
                <Typography
                  variant="caption"
                  textAlign="center"
                  sx={{
                    color: "#B0BEC5",
                    fontSize: "0.7rem",
                  }}
                >
                  Click to add new appointment
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