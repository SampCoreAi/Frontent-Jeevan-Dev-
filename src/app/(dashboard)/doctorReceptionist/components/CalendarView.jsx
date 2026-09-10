"use client";
import { useState, useMemo } from "react";
import React from "react";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Avatar,
  AvatarGroup,
  Tooltip,
  Tabs,
  Tab,
  Badge,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TodayIcon from "@mui/icons-material/Today";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmergencyIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

// Enhanced sample events with more realistic data
const initialEvents = [
  {
    id: 1,
    day: "Fri",
    date: "2025-09-26",
    time: "09:00 - 10:00",
    title: "Quarterly Health Review",
    type: "upcoming",
    patient: "Rahul Verma",
    doctor: "Dr. Sharma",
    department: "General Medicine",
    status: "scheduled",
    priority: "high",
    duration: 60,
    location: "Room 101",
    notes: "Follow-up on previous treatment",
    reminder: true,
  },
  {
    id: 2,
    day: "Fri",
    date: "2025-09-26",
    time: "11:30 - 12:30",
    title: "Diabetes Management",
    type: "upcoming",
    patient: "Priya Singh",
    doctor: "Dr. Patel",
    department: "Endocrinology",
    status: "scheduled",
    priority: "medium",
    duration: 60,
    location: "Room 205",
    notes: "Insulin adjustment needed",
    reminder: true,
  },
  {
    id: 3,
    day: "Mon",
    date: "2025-09-29",
    time: "14:00 - 15:00",
    title: "Cardiac Consultation",
    type: "upcoming",
    patient: "Arjun Mehta",
    doctor: "Dr. Kumar",
    department: "Cardiology",
    status: "scheduled",
    priority: "high",
    duration: 60,
    location: "Cardio Lab",
    notes: "ECG and stress test required",
    reminder: true,
  },
  {
    id: 4,
    day: "Tue",
    date: "2025-09-23",
    time: "10:00 - 11:00",
    title: "Physical Therapy",
    type: "completed",
    patient: "Sneha Reddy",
    doctor: "Dr. Gupta",
    department: "Physiotherapy",
    status: "completed",
    priority: "low",
    duration: 60,
    location: "PT Room 3",
    notes: "Good progress shown",
    reminder: false,
  },
];

// Professional color scheme with better contrast
const colors = {
  primary: "#027a6f",
  primaryLight: "#4da69e",
  primaryDark: "#01574f",
  secondary: "#f8f9fa",
  accent: "#e8f5f3",
  textPrimary: "#1a1a1a",
  textSecondary: "#666666",
  success: "#2e7d32",
  warning: "#ed6c02",
  error: "#d32f2f",
  info: "#0288d1",
  background: "#ffffff",
  surface: "#fafafa",
  border: "#e0e0e0",
};

const eventTypeColors = {
  upcoming: colors.success,
  completed: colors.textSecondary,
  cancelled: colors.error,
  emergency: colors.warning,
  consultation: colors.info,
  surgery: colors.primary,
  diagnostic: "#7b1fa2",
  therapy: "#00796b",
};

const priorityColors = {
  high: colors.error,
  medium: colors.warning,
  low: colors.success,
};

const eventTypes = {
  upcoming: "Upcoming / Pending",
  completed: "Completed",
  cancelled: "Cancelled",
  emergency: "Emergency",
};

const departments = [
  "General Medicine",
  "Cardiology",
  "Orthopedics",
  "Endocrinology",
  "Dermatology",
  "Pediatrics",
  "Ophthalmology",
  "Dentistry",
  "Neurology",
  "Physiotherapy",
];

const doctors = [
  "Dr. Sharma",
  "Dr. Patel",
  "Dr. Kumar",
  "Dr. Gupta",
  "Dr. Reddy",
  "Dr. Singh",
];

export default function CalendarDoctor() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [view, setView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState(initialEvents);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [showWeekends, setShowWeekends] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Enhanced filtering with more options
  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.doctor &&
          event.doctor.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDepartment =
        filterDepartment === "all" || event.department === filterDepartment;

      const matchesStatus =
        filterStatus === "all" || event.status === filterStatus;

      const matchesDoctor =
        filterDoctor === "all" || event.doctor === filterDoctor;

      return (
        matchesSearch && matchesDepartment && matchesStatus && matchesDoctor
      );
    });

    if (view === "day") {
      filtered = filtered.filter((event) =>
        dayjs(event.date).isSame(selectedDate, "day")
      );
    } else if (view === "week") {
      const startOfWeek = selectedDate.startOf("week");
      const endOfWeek = selectedDate.endOf("week");
      filtered = filtered.filter((event) => {
        const eventDate = dayjs(event.date);
        return (
          eventDate.isSameOrAfter(startOfWeek) &&
          eventDate.isSameOrBefore(endOfWeek)
        );
      });
    } else if (view === "month") {
      filtered = filtered.filter((event) =>
        dayjs(event.date).isSame(selectedDate, "month")
      );
    } else if (view === "year") {
      filtered = filtered.filter((event) =>
        dayjs(event.date).isSame(selectedDate, "year")
      );
    }

    return filtered;
  }, [
    events,
    view,
    selectedDate,
    searchTerm,
    filterDepartment,
    filterStatus,
    filterDoctor,
  ]);

  // Enhanced schedule view grouping
  const scheduleEvents = useMemo(() => {
    const grouped = {};
    filteredEvents.forEach((event) => {
      if (!grouped[event.time]) {
        grouped[event.time] = [];
      }
      grouped[event.time].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  // Enhanced months for Year View
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = dayjs(selectedDate).month(i);
      const monthEvents = events.filter((event) =>
        dayjs(event.date).isSame(month, "month")
      );

      return {
        name: month.format("MMMM"),
        shortName: month.format("MMM"),
        events: monthEvents,
        stats: {
          total: monthEvents.length,
          completed: monthEvents.filter((e) => e.status === "completed").length,
          upcoming: monthEvents.filter((e) => e.status === "scheduled").length,
        },
      };
    });
  }, [selectedDate, events]);

  // Enhanced Week Days with better structure
  const weekDays = useMemo(() => {
    const startOfWeek = selectedDate.startOf("week");
    return Array.from({ length: showWeekends ? 7 : 5 }, (_, i) => {
      const date = startOfWeek.add(i, "day");
      const dayEvents = filteredEvents.filter((event) =>
        dayjs(event.date).isSame(date, "day")
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
  }, [selectedDate, showWeekends, filteredEvents]);

  // Enhanced Time slots for day view
  const timeSlots = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const hour = 7 + i; // 7 AM to 8 PM
      return {
        label: `${hour}:00 - ${hour + 1}:00`,
        hour: hour,
        time: `${hour.toString().padStart(2, "0")}:00`,
      };
    });
  }, []);

  // Enhanced Statistics with progress
  const stats = useMemo(() => {
    const total = filteredEvents.length;
    const completed = filteredEvents.filter(
      (e) => e.status === "completed"
    ).length;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      upcoming: filteredEvents.filter((e) => e.status === "scheduled").length,
      completed,
      cancelled: filteredEvents.filter((e) => e.status === "cancelled").length,
      emergency: filteredEvents.filter((e) => e.priority === "high").length,
      highPriority: filteredEvents.filter((e) => e.priority === "high").length,
      completionRate,
      averagePatients: filteredEvents.length / (weekDays.length || 1),
    };
  }, [filteredEvents, weekDays]);

  // Enhanced Handlers
  const handlePrevious = () => {
    const unit =
      view === "day"
        ? "day"
        : view === "week"
        ? "week"
        : view === "month"
        ? "month"
        : "year";
    setSelectedDate(selectedDate.subtract(1, unit));
  };

  const handleNext = () => {
    const unit =
      view === "day"
        ? "day"
        : view === "week"
        ? "week"
        : view === "month"
        ? "month"
        : "year";
    setSelectedDate(selectedDate.add(1, unit));
  };

  const handleToday = () => setSelectedDate(dayjs());

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleSaveEvent = (eventData) => {
    if (selectedEvent) {
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? { ...event, ...eventData } : event
        )
      );
    } else {
      const newEvent = {
        id: Math.max(...events.map((e) => e.id), 0) + 1,
        ...eventData,
        type: "upcoming",
        status: "scheduled",
      };
      setEvents([...events, newEvent]);
    }
    setOpenDialog(false);
  };

  const handleExportData = () => {
    // Implementation for exporting calendar data
    console.log("Exporting calendar data...");
  };

  // Get event color based on type
  const getEventColor = (eventType) => {
    return eventTypeColors[eventType] || colors.primary;
  };

  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: { xs: 1, md: 1 },
          backgroundColor: colors.background,
          minHeight: "100vh",
          width: 1180,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              mb: 3,
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                color={colors.textPrimary}
              >
                Medical Calendar
              </Typography>
              <Typography variant="subtitle1" color={colors.textSecondary}>
                Manage appointments and patient schedules
              </Typography>
            </Box>

            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportData}
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                Export
              </Button>
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                sx={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                Share
              </Button>
              <Button
                variant="contained"
                onClick={handleAddEvent}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: colors.primary,
                  color: "white",
                  "&:hover": {
                    backgroundColor: colors.primaryDark,
                    transform: "translateY(-1px)",
                    boxShadow: 3,
                  },
                  px: 3,
                  py: 1,
                }}
              >
                New Appointment
              </Button>
            </Box>
          </Box>

          {/* Enhanced Calendar Controls */}
          <Card
            sx={{ mb: 3, boxShadow: 2, border: `1px solid ${colors.border}` }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handlePrevious}
                    sx={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      minWidth: "auto",
                      px: 1,
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </Button>

                  <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => {
                      if (newValue) setSelectedDate(dayjs(newValue));
                    }}
                    slots={{ openPickerIcon: CalendarTodayIcon }}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: { width: 150 },
                        InputProps: {
                          sx: { color: colors.primary, fontWeight: 500 },
                        },
                      },
                    }}
                  />

                  <Button
                    variant="outlined"
                    onClick={handleNext}
                    sx={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      minWidth: "auto",
                      px: 1,
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleToday}
                    startIcon={<TodayIcon />}
                    sx={{
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    Today
                  </Button>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Select
                    size="small"
                    value={view}
                    onChange={(e) => setView(e.target.value)}
                    sx={{
                      minWidth: 120,
                      "& .MuiSelect-select": {
                        color: colors.primary,
                        fontWeight: 500,
                      },
                    }}
                  >
                    <MenuItem value="day">Day View</MenuItem>
                    <MenuItem value="week">Week View</MenuItem>
                    <MenuItem value="month">Month View</MenuItem>
                    <MenuItem value="year">Year View</MenuItem>
                    <MenuItem value="schedule">Schedule</MenuItem>
                  </Select>

                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{
                      borderColor: colors.primary,
                      color: colors.primary,
                    }}
                  >
                    Filters
                  </Button>
                </Box>
              </Box>

              {/* Enhanced Filters Section */}
              {showFilters && (
                <Box
                  sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.border}` }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <SearchIcon
                              sx={{ mr: 1, color: colors.textSecondary }}
                            />
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Department</InputLabel>
                        <Select
                          value={filterDepartment}
                          onChange={(e) => setFilterDepartment(e.target.value)}
                          label="Department"
                        >
                          <MenuItem value="all">All Departments</MenuItem>
                          {departments.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                              {dept}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Doctor</InputLabel>
                        <Select
                          value={filterDoctor}
                          onChange={(e) => setFilterDoctor(e.target.value)}
                          label="Doctor"
                        >
                          <MenuItem value="all">All Doctors</MenuItem>
                          {doctors.map((doctor) => (
                            <MenuItem key={doctor} value={doctor}>
                              {doctor}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          label="Status"
                        >
                          <MenuItem value="all">All Status</MenuItem>
                          <MenuItem value="scheduled">Scheduled</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          <Grid container spacing={2} mb={3}>
            {[
              {
                label: "Total Appointments",
                value: stats.total,
                icon: <EventIcon sx={{ fontSize: 58 }} />, // Bigger icon
              },
              {
                label: "Completed",
                value: stats.completed,
                icon: <CheckCircleIcon sx={{ fontSize: 58 }} />,
              },
              {
                label: "Pending",
                value: stats.total - stats.completed,
                icon: <PendingActionsIcon sx={{ fontSize: 58 }} />,
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#e6f6ed",
                    color: "black",
                    height: 120,
                    width: 300,
                    borderRadius: 0.5,
                    boxShadow: 1,
                    border: "1px solid black",

                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {/* Icon on left */}
                    <Box sx={{ mr: 2 }}>{stat.icon}</Box>

                    {/* Label and Value stacked */}
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Current Period Display */}
          <Card sx={{ mb: 3, boxShadow: 2, backgroundColor: colors.accent }}>
            <CardContent sx={{ py: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  color={colors.primary}
                  fontWeight="bold"
                >
                  {view === "day" && selectedDate.format("dddd, MMMM D, YYYY")}
                  {view === "week" &&
                    `${selectedDate
                      .startOf("week")
                      .format("MMM D")} - ${selectedDate
                      .endOf("week")
                      .format("MMM D, YYYY")}`}
                  {view === "month" && selectedDate.format("MMMM YYYY")}
                  {view === "year" && selectedDate.format("YYYY")}
                  {view === "schedule" && "Schedule Overview"}
                </Typography>
                <Chip
                  label={`${filteredEvents.length} appointments`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Enhanced Calendar Views */}
          <Card
            sx={{ boxShadow: 3, mb: 3, border: `1px solid ${colors.border}` }}
          >
            <CardContent sx={{ p: 0.5 }}>
              {/* Day View */}
              {view === "day" && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    maxHeight: "80vh",
                    overflowY: "auto",
                    p: 2,
                    // Custom scrollbar
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "green",
                      borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {timeSlots.map((slot, index) => {
                    const slotEvents = filteredEvents.filter((event) => {
                      const eventHour = parseInt(event.time.split(":")[0], 10);
                      return eventHour === slot.hour;
                    });

                    return (
                      <Box
                        key={index}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 0.5,
                          p: 2,
                          minHeight: 340,
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "background.paper",
                          boxShadow: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color={colors.primary}
                          mb={1}
                        >
                          {slot.label}
                        </Typography>

                        {slotEvents.length > 0 ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            {slotEvents.map((event) => (
                              <Tooltip
                                key={event.id}
                                title={
                                  <Box>
                                    <Typography variant="subtitle2">
                                      {event.title}
                                    </Typography>
                                    <Typography variant="caption">
                                      Patient: {event.patient}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption">
                                      Doctor: {event.doctor}
                                    </Typography>
                                    <br />
                                    <Typography variant="caption">
                                      Location: {event.location}
                                    </Typography>
                                  </Box>
                                }
                              >
                                <Chip
                                  label={`${event.title} - ${event.patient}`}
                                  sx={{
                                    backgroundColor: getEventColor(event.type),
                                    color: "#fff",
                                    fontWeight: "bold",
                                    maxWidth: "100%",
                                    "&:hover": {
                                      opacity: 0.9,
                                    },
                                  }}
                                  onClick={() => handleEditEvent(event)}
                                  onDelete={() => handleDeleteEvent(event.id)}
                                  deleteIcon={<CloseIcon />}
                                />
                              </Tooltip>
                            ))}
                          </Box>
                        ) : (
                          <Typography
                            variant="body2"
                            color={colors.textSecondary}
                            sx={{ mt: 1 }}
                          >
                            No appointments scheduled
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* Week View */}
              {view === "week" && (
                <Box
                  display="flex"
                  gap={1}
                  sx={{
                    minHeight: 500,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                      height: 4,
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "green",
                      borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  {weekDays.map((day) => (
                    <Box
                      key={day.label}
                      sx={{
                        flex: 1,
                        minWidth: 300,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 2,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: day.isToday
                          ? colors.accent
                          : colors.background,
                        transition: "all 0.2s",
                        "&:hover": {
                          boxShadow: 2,
                        },
                      }}
                    >
                      {/* Header */}
                      <Box
                        textAlign="center"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                        sx={{
                          borderBottom: `2px solid ${colors.primary}`,
                          pb: 1,
                          minHeight: 40,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Typography
                            fontWeight="bold"
                            color={
                              day.isToday ? colors.primary : colors.textPrimary
                            }
                            variant="subtitle1"
                          >
                            {day.label}
                          </Typography>

                          <Typography
                            variant="body2"
                            color={
                              day.isToday
                                ? colors.primary
                                : colors.textSecondary
                            }
                          >
                            {day.date}
                          </Typography>
                        </Box>

                        <Badge
                          badgeContent={day.eventCount}
                          color="primary"
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: colors.primary,
                            },
                          }}
                        />
                      </Box>

                      {/* Events Container */}
                      <Box
                        flex={1}
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        sx={{
                          overflowY: "auto",
                          maxHeight: 400,
                          "&::-webkit-scrollbar": {
                            width: 4,
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: colors.primaryLight,
                            borderRadius: 2,
                          },
                        }}
                      >
                        {day.events.length > 0 ? (
                          day.events.map((event) => (
                            <Tooltip
                              key={event.id}
                              title={`${event.time} - ${event.doctor}`}
                            >
                              <Box
                                sx={{
                                  p: 1.5,
                                  borderRadius: 1,
                                  backgroundColor: getEventColor(event.type),
                                  color: "white",
                                  cursor: "pointer",
                                  transition: "all 0.2s",
                                  borderLeft: `4px solid ${
                                    priorityColors[event.priority] ||
                                    colors.primary
                                  }`,
                                  "&:hover": {
                                    opacity: 0.9,
                                    transform: "translateX(2px)",
                                  },
                                }}
                                onClick={() => handleEditEvent(event)}
                              >
                                <Typography
                                  variant="caption"
                                  fontWeight="bold"
                                  display="block"
                                >
                                  {event.time}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  display="block"
                                  noWrap
                                >
                                  {event.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{ opacity: 0.9 }}
                                  noWrap
                                >
                                  {event.patient}
                                </Typography>
                              </Box>
                            </Tooltip>
                          ))
                        ) : (
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{ height: "100%", minHeight: 100 }}
                          >
                            <Typography
                              variant="body2"
                              color={colors.textSecondary}
                              textAlign="center"
                            >
                              No appointments
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Month View */}
              {view === "month" && (
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" color={colors.primary}>
                      {selectedDate.format("MMMM YYYY")}
                    </Typography>
                    <Typography variant="body2" color={colors.textSecondary}>
                      {filteredEvents.length} appointments this month
                    </Typography>
                  </Box>

                  {/* Month grid */}
                  <Grid
                    container
                    spacing={0.5}
                    sx={{
                      overflowY: "auto",
                      maxHeight: 500,
                      p: 1,
                      "&::-webkit-scrollbar": {
                        width: 4,
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: colors.primaryLight,
                        borderRadius: 2,
                      },
                    }}
                  >
                    {Array.from(
                      { length: selectedDate.daysInMonth() },
                      (_, i) => {
                        const date = selectedDate.date(i + 1);
                        const dayEvents = events.filter((e) =>
                          dayjs(e.date).isSame(date, "day")
                        );
                        const isCurrentMonth =
                          date.month() === selectedDate.month();

                        return (
                          <Grid item xs={12 / 7} key={i}>
                            <Card
                              variant="outlined"
                              sx={{
                                p: 3,

                                minHeight: 150,
                                width: 280,
                              }}
                              onClick={() => {
                                setSelectedDate(date);
                                setView("day");
                              }}
                            >
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color={
                                  isCurrentMonth
                                    ? colors.primary
                                    : colors.textSecondary
                                }
                                sx={{ mb: 1 }}
                              >
                                {date.format("D")}
                              </Typography>
                              {dayEvents.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  <Chip
                                    label={dayEvents.length}
                                    size="small"
                                    sx={{
                                      backgroundColor: colors.primary,
                                      color: "white",
                                      fontSize: "0.6rem",
                                      height: 20,
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    display="block"
                                    sx={{ mt: 0.5 }}
                                    noWrap
                                  >
                                    {dayEvents[0]?.title}
                                  </Typography>
                                </Box>
                              )}
                            </Card>
                          </Grid>
                        );
                      }
                    )}
                  </Grid>
                </Box>
              )}

              {/* Year View */}
              {view === "year" && (
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography variant="h6" color={colors.primary}>
                      Year Overview - {selectedDate.format("YYYY")}
                    </Typography>
                    <Typography variant="body2" color={colors.textSecondary}>
                      {
                        events.filter((e) =>
                          dayjs(e.date).isSame(selectedDate, "year")
                        ).length
                      }{" "}
                      total appointments
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    {months.map((month, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={month.name}>
                        <Card
                          variant="outlined"
                          sx={{
                            transition: "all 0.2s",
                            cursor: "pointer",
                            "&:hover": {
                              boxShadow: 3,
                              transform: "translateY(-2px)",
                            },
                          }}
                          onClick={() => {
                            setSelectedDate(selectedDate.month(index));
                            setView("month");
                          }}
                        >
                          <CardContent>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              mb={2}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                color={colors.primary}
                              >
                                {month.shortName}
                              </Typography>
                              <Chip
                                label={`${month.events.length}`}
                                size="small"
                                sx={{
                                  backgroundColor:
                                    month.events.length > 0
                                      ? colors.primary
                                      : colors.textSecondary,
                                  color: "white",
                                }}
                              />
                            </Box>

                            {/* Month progress */}
                            <Box sx={{ mb: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={
                                  (month.stats.completed /
                                    Math.max(month.events.length, 1)) *
                                  100
                                }
                                sx={{
                                  height: 4,
                                  borderRadius: 2,
                                  backgroundColor: colors.border,
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: colors.success,
                                  },
                                }}
                              />
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                sx={{ mt: 0.5 }}
                              >
                                <Typography
                                  variant="caption"
                                  color={colors.textSecondary}
                                >
                                  {month.stats.completed} completed
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color={colors.textSecondary}
                                >
                                  {month.stats.upcoming} upcoming
                                </Typography>
                              </Box>
                            </Box>

                            {month.events.slice(0, 2).map((event) => (
                              <Box
                                key={event.id}
                                sx={{
                                  mt: 1,
                                  p: 1,
                                  backgroundColor: getEventColor(event.type),
                                  color: "white",
                                  borderRadius: 1,
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  display="block"
                                  fontWeight="bold"
                                >
                                  {dayjs(event.date).format("D")} -{" "}
                                  {event.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  display="block"
                                  sx={{ opacity: 0.9 }}
                                >
                                  {event.patient}
                                </Typography>
                              </Box>
                            ))}
                            {month.events.length > 2 && (
                              <Typography
                                variant="caption"
                                color={colors.primary}
                                sx={{ mt: 1, display: "block" }}
                              >
                                +{month.events.length - 2} more appointments
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Schedule View */}
              {view === "schedule" && (
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography variant="h6" color={colors.primary}>
                      Schedule Overview
                    </Typography>
                    <Typography variant="body2" color={colors.textSecondary}>
                      Organized by time slots
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {Object.entries(scheduleEvents).map(
                      ([time, timeEvents]) => (
                        <Grid item xs={12} key={time}>
                          <Card
                            variant="outlined"
                            sx={{
                              transition: "all 0.2s",
                              "&:hover": {
                                boxShadow: 2,
                              },
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box
                                display="flex"
                                alignItems="center"
                                gap={2}
                                mb={2}
                              >
                                <AccessTimeIcon
                                  sx={{ color: colors.primary }}
                                />
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  color={colors.primary}
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

                              <Grid container spacing={1}>
                                {timeEvents.map((event) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={event.id}
                                  >
                                    <Box
                                      sx={{
                                        p: 2,
                                        backgroundColor: getEventColor(
                                          event.type
                                        ),
                                        color: "white",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        borderLeft: `4px solid ${
                                          priorityColors[event.priority] ||
                                          colors.primary
                                        }`,
                                        "&:hover": {
                                          opacity: 0.9,
                                          transform: "translateY(-1px)",
                                        },
                                      }}
                                      onClick={() => handleEditEvent(event)}
                                    >
                                      <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                      >
                                        {event.title}
                                      </Typography>
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={0.5}
                                        sx={{ mt: 0.5 }}
                                      >
                                        <PersonIcon sx={{ fontSize: 12 }} />
                                        <Typography variant="caption">
                                          {event.patient}
                                        </Typography>
                                      </Box>
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={0.5}
                                        sx={{ mt: 0.5 }}
                                      >
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
                      )
                    )}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>

          
        </Box>

        {/* Enhanced Event Dialog */}
        <EventDialog
          open={openDialog}
          event={selectedEvent}
          onClose={() => setOpenDialog(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          departments={departments}
          doctors={doctors}
          colors={colors}
        />
      </Box>
    </LocalizationProvider>
  );
}

// Enhanced Event Dialog Component
function EventDialog({
  open,
  event,
  onClose,
  onSave,
  onDelete,
  departments,
  doctors,
  colors,
}) {
  const [formData, setFormData] = useState({
    title: "",
    date: dayjs().format("YYYY-MM-DD"),
    time: "09:00 - 10:00",
    patient: "",
    doctor: "",
    department: "",
    location: "",
    notes: "",
    priority: "medium",
    duration: 60,
    reminder: true,
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        date: event.date || dayjs().format("YYYY-MM-DD"),
        time: event.time || "09:00 - 10:00",
        patient: event.patient || "",
        doctor: event.doctor || "",
        department: event.department || "",
        location: event.location || "",
        notes: event.notes || "",
        priority: event.priority || "medium",
        duration: event.duration || 60,
        reminder: event.reminder !== false,
      });
    } else {
      setFormData({
        title: "",
        date: dayjs().format("YYYY-MM-DD"),
        time: "09:00 - 10:00",
        patient: "",
        doctor: "",
        department: "",
        location: "",
        notes: "",
        priority: "medium",
        duration: 60,
        reminder: true,
      });
    }
    setErrors({});
  }, [event]);

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.patient.trim())
      newErrors.patient = "Patient name is required";
    if (!formData.doctor.trim()) newErrors.doctor = "Doctor is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleDelete = () => {
    if (
      event &&
      window.confirm("Are you sure you want to delete this appointment?")
    ) {
      onDelete(event.id);
      onClose();
    }
  };

  const timeOptions = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i;
    return `${hour}:00 - ${hour + 1}:00`;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Grid container direction="column" spacing={2}>
          {/* Patient Name */}
          <Grid item>
            <TextField
              fullWidth
              label="Patient Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              InputLabelProps={{
                sx: { color: "black" },
              }}
            />
          </Grid>

          {/* Age */}
          <Grid item>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              required
              InputLabelProps={{
                sx: { color: "black" },
              }}
            />
          </Grid>

          {/* Gender */}
          <Grid item>
            <FormControl fullWidth required>
              <InputLabel sx={{ color: "black" }}>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Diagnosis */}
          <Grid item>
            <TextField
              fullWidth
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
              required
              InputLabelProps={{
                sx: { color: "black" },
              }}
            />
          </Grid>

          {/* Appointment Date */}
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Appointment Date"
                value={dayjs(formData.date)}
                onChange={(newValue) =>
                  setFormData({
                    ...formData,
                    date: newValue.format("YYYY-MM-DD"),
                  })
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    InputLabelProps: {
                      sx: { color: "black" },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: colors.primary,
            "&:hover": {
              backgroundColor: colors.primaryDark,
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
