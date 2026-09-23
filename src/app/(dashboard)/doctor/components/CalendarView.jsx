"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarControls from "./calendar/CalendarControls";
import StatsCards from "./calendar/StatsCards";
import DayView from "./calendar/views/DayView";
import WeekView from "./calendar/views/WeekView";
import MonthView from "./calendar/views/MonthView";
import YearView from "./calendar/views/YearView";
import { useCalendar } from "./calendar/hooks/useCalendar";
import { useTheme } from "@mui/material/styles";
import { departments, doctors } from "./calendar/constants";
import PatientDetailsCard from "../components/Patient/PatientDetailsCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

export default function CalendarView() {
  const theme = useTheme();
  const [events, setEvents] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreAppointments, setMoreAppointments] = useState([]);
  const [moreDate, setMoreDate] = useState(null);

  const [dashboardStats, setDashboardStats] = useState({
    total_appointment: 0,
    total_upcoming: 0,
    total_completed: 0,
    total_expired: 0,
  });

  useEffect(() => {
    fetchAppointments();
    fetchDashboardCards();
  }, []);

  const fetchDashboardCards = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/appointments/dashboard-cards`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setDashboardStats(result.data);
      }
    } catch (error) {
      console.log("Error fetching dashboard cards", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/appointments/getAllappoinment/my`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        const formattedEvents = result.data.map((item) => {
          let mappedStatus = "pending";

          if (item.status === "COMPLETED") {
            mappedStatus = "completed";
          } else if (item.status === "IN_PROGRESS") {
            mappedStatus = "scheduled";
          } else if (item.status === "PENDING") {
            mappedStatus = "pending";
          } else if (item.status === "CANCELLED") {
            mappedStatus = "cancelled";
          }

          return {
            id: item.id,
            date: dayjs(item.slot_date).format("YYYY-MM-DD"),
            start_time: item.start_time,
            end_time: item.end_time,
            doctor_name: item.doctorName,
            doctor_department: item.doctorDepartment,
            hospital_name: item.hospitalName,
            patientName: item.patientName,
            token_number: item.token_number,
            status: item.status,
            type: mappedStatus,
            code: item.code,
            reason_for_visit: item.reason_for_visit,
            cancel_reason: item.cancel_reason,
            appointment_type: item.appointment_type,
            patient_phone: item.patientPhone,
            patient_email: item.patientEmail,
            age: item.age,
            gender: item.gender,
          };
        });

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.log("Error fetching appointments", error);
    }
  };

  const fetchPatientDetails = async (appointmentId) => {
    try {
      setPatientLoading(true);
      setSelectedPatient(null);
      setDetailsOpen(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/user/getPatientDetails/${appointmentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setSelectedPatient(result.data);
      } else {
        setDetailsOpen(false);
      }
    } catch (error) {
      console.log("Error fetching patient details", error);
      setDetailsOpen(false);
    } finally {
      setPatientLoading(false);
    }
  };

  const handleAppointmentClick = (appointment) => {
    if (!appointment?.id) return;

    setMoreOpen(false);
    fetchPatientDetails(appointment.id);
  };

  const handleMoreClick = (date, appointments) => {
    setMoreDate(date);
    setMoreAppointments(appointments);
    setMoreOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedPatient(null);
  };

  const {
    view,
    setView,
    selectedDate,
    setSelectedDate,
    filteredEvents,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    filterDoctor,
    setFilterDoctor,
    filterStatus,
    setFilterStatus,
    showFilters,
    setShowFilters,
    handlePrevious,
    handleNext,
    handleToday,
    handleAddEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleExportData,
  } = useCalendar(events);

  const renderCurrentPeriod = () => {
    switch (view) {
      case "day":
        return selectedDate.format("dddd, MMMM D, YYYY");
      case "week":
        return `${selectedDate
          .startOf("week")
          .format("MMM D")} - ${selectedDate
          .endOf("week")
          .format("MMM D, YYYY")}`;
      case "month":
        return selectedDate.format("MMMM YYYY");
      case "year":
        return selectedDate.format("YYYY");
      case "schedule":
        return "Schedule Overview";
      default:
        return "";
    }
  };

  const renderView = () => {
    switch (view) {
      case "day":
  return (
    <DayView
      events={filteredEvents}
      onAppointmentClick={handleAppointmentClick}
      onMoreClick={handleMoreClick}
      onDeleteEvent={handleDeleteEvent}
    />
  );

     case "week":
  return (
    <WeekView
      selectedDate={selectedDate}
      events={filteredEvents}
      onAppointmentClick={handleAppointmentClick}
      onMoreClick={handleMoreClick}
    />
  );
      case "month":
        return (
          <MonthView
            selectedDate={selectedDate}
            events={filteredEvents}
            onDateClick={(date) => {
              setSelectedDate(date);
              setView("day");
            }}
            onAppointmentClick={handleAppointmentClick}
            onMoreClick={handleMoreClick}
          />
        );

     case "year":
  return (
    <YearView
      selectedDate={selectedDate}
      allEvents={filteredEvents}
      onMonthClick={(index) => {
        setSelectedDate(selectedDate.month(index));
        setView("month");
      }}
    />
  );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          padding: { xs: 1, md: 1 },
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <CalendarHeader
            onExport={handleExportData}
            onAdd={handleAddEvent}
            events={events}
            onAppointmentCreated={fetchAppointments}
          />

          <CalendarControls
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleToday={handleToday}
            view={view}
            setView={setView}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterDepartment={filterDepartment}
            setFilterDepartment={setFilterDepartment}
            filterDoctor={filterDoctor}
            setFilterDoctor={setFilterDoctor}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            departments={departments}
            doctors={doctors}
          />

          <StatsCards stats={dashboardStats} />

          <Card
            elevation={0}
            sx={{
              mt: 1.5,
              mb: 2,
              borderRadius: "8px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardContent
              sx={{
                px: { xs: 1.5, sm: 2 },
                py: "12px !important",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: "12.5px", sm: "13.5px" },
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {renderCurrentPeriod()}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: "10.5px",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Appointment schedule
                  </Typography>
                </Box>

                <Chip
                  label={`${filteredEvents.length} ${
                    filteredEvents.length === 1
                      ? "appointment"
                      : "appointments"
                  }`}
                  size="small"
                  sx={{
                    height: 24,
                    borderRadius: "6px",
                    color: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}10`,
                    border: `1px solid ${theme.palette.primary.main}25`,
                    "& .MuiChip-label": {
                      px: 1.1,
                      fontSize: "10.5px",
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              width: "100%",
              mx: "auto",
              mb: 2,
              borderRadius: "10px",
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 0.5,
                  sm: 1,
                },
                "&:last-child": {
                  pb: {
                    xs: 0.5,
                    sm: 1,
                  },
                },
              }}
            >
              {renderView()}
            </CardContent>
          </Card>
        </Box>
<Dialog
  open={moreOpen}
  onClose={() => setMoreOpen(false)}
  fullWidth
  PaperProps={{
    sx: {
      width: "100%",
      maxWidth: "420px",
      borderRadius: "10px",
    },
  }}
>
          <DialogTitle
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                }}
              >
                Appointments
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  fontSize: "11px",
                  color: theme.palette.text.secondary,
                }}
              >
                {moreDate
                  ? dayjs(moreDate).format("DD MMM YYYY")
                  : ""}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => setMoreOpen(false)}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              p: 1.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.7,
              }}
            >
              {moreAppointments.map((appointment, index) => (
                <Box
                  key={appointment.id || index}
                  onClick={() =>
                    handleAppointmentClick(appointment)
                  }
                  sx={{
                    px: 1.25,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    borderRadius: "6px",
                    border: `1px solid ${theme.palette.divider}`,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.action.hover,
                    },
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {appointment.token_number ||
                        appointment.id ||
                        index + 1}
                      {" • "}
                      {appointment.patientName ||
                        "Unknown User"}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,
                        fontSize: "10.5px",
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {appointment.start_time || "Time not available"}
                    </Typography>
                  </Box>

                  <Chip
                    label={appointment.status || "PENDING"}
                    size="small"
                    sx={{
                      height: 21,
                      fontSize: "9px",
                      flexShrink: 0,
                    }}
                  />
                </Box>
              ))}
            </Box>
          </DialogContent>
        </Dialog>

        <Dialog
          open={detailsOpen}
          onClose={handleCloseDetails}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: "10px",
            },
          }}
        >
          <DialogTitle
            sx={{
              px: 1.5,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={handleCloseDetails}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} />
              </IconButton>

              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Patient Details
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={handleCloseDetails}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              p: { xs: 1.5, sm: 2 },
            }}
          >
            {patientLoading ? (
              <Box
                sx={{
                  minHeight: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={26} />
              </Box>
            ) : selectedPatient ? (
              <PatientDetailsCard
                patient={selectedPatient}
              />
            ) : null}
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}