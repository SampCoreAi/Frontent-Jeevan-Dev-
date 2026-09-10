// components/calendar/CalendarView.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
import CalendarHeader from './calendar/CalendarHeader';
import CalendarControls from './calendar/CalendarControls';
import StatsCards from "./calendar/StatsCards";
import DayView from './calendar/views/DayView';
import WeekView from './calendar/views/WeekView';
import MonthView from './calendar/views/MonthView';
import YearView from './calendar/views/YearView';
import ScheduleView from './calendar/views/ScheduleView';
import EventDialog from './calendar/EventDialog';
import { useCalendar } from './calendar/hooks/useCalendar';
import { useTheme } from "@mui/material/styles";
import { departments, doctors } from './calendar/constants';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Configure dayjs plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);



export default function CalendarView() {
  const theme = useTheme();
  const [events, setEvents] = useState([]);


  const [dashboardStats, setDashboardStats] =
    useState({
      total_appointment: 0,
      total_upcoming: 0,
      total_completed: 0,
      total_expired: 0,
    });

  useEffect(() => {
    fetchAppointments();
    fetchDashboardCards();
  }, []);

  // CalendarView.jsx

  const fetchDashboardCards = async () => {
    try {

      const token =
        localStorage.getItem("token");

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

      const result =
        await response.json();


      if (result.success) {

        setDashboardStats(result.data);

      }

    } catch (error) {

      console.log(
        "Error fetching dashboard cards",
        error
      );

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

console.log("result",result);

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

  const parsedDate = dayjs(item.slot_date).format("YYYY-MM-DD");

  return {
    id: item.id,

    date: parsedDate,

    start_time: item.start_time,
    end_time: item.end_time,

    doctor_name: item.doctorName,
    doctor_department: item.doctorDepartment,

    hospital_name: item.hospitalName,

    patientName: item.patientName,

    token_number: item.token_number,

    status: item.status,

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
        console.log("formattedEvents",formattedEvents);
      }

    } catch (error) {
      console.log("Error fetching appointments", error);
    }
  };
  const {
    view,
    setView,
    selectedDate,
    setSelectedDate,
    filteredEvents,
    openDialog,
    setOpenDialog,
    selectedEvent,
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
    stats,
    handlePrevious,
    handleNext,
    handleToday,
    handleAddEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleSaveEvent,
    handleExportData,
  } = useCalendar(events);

  const renderCurrentPeriod = () => {
    switch (view) {
      case "day":
        return selectedDate.format("dddd, MMMM D, YYYY");
      case "week":
        return `${selectedDate.startOf("week").format("MMM D")} - ${selectedDate.endOf("week").format("MMM D, YYYY")}`;
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
        return <DayView events={filteredEvents} onEditEvent={handleEditEvent} onDeleteEvent={handleDeleteEvent} />;
      case "week":
        return <WeekView selectedDate={selectedDate} events={filteredEvents} onEditEvent={handleEditEvent} />;
      case "month":
        return <MonthView selectedDate={selectedDate} events={filteredEvents} onDateClick={(date) => { setSelectedDate(date); setView("day"); }} />;
      case "year":
        return <YearView selectedDate={selectedDate} allEvents={filteredEvents} onMonthClick={(index) => { setSelectedDate(selectedDate.month(index)); setView("month"); }} />;

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
          maxWidth: 1180,
          mx: "auto",
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
            sx={{
              mt: 2,
              mb: 3,
              boxShadow: 2,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <CardContent
              sx={{
                py: 2,
                px: {
                  xs: 2,
                  sm: 3,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: {
                    xs: "flex-start",
                    sm: "center",
                  },
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 1.5,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{
                    color: "#1E6658",
                    fontSize: {
                      xs: "1rem",
                      sm: "1.15rem",
                      md: "1.25rem",
                    },
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                  }}
                >
                  {renderCurrentPeriod()}
                </Typography>

                <Chip
                  label={`${filteredEvents.length} appointments`}
                  size="small"
                  sx={{
                    color: "#1E6658",
                    fontWeight: 600,
                    borderRadius: 2,
                    alignSelf: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    maxWidth: "100%",

                    "& .MuiChip-label": {
                      px: 1.5,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>


          <Card
            sx={{
              width: "100%",
              maxWidth: 1150,
              mx: "auto",
              px: { xs: 1, sm: 2 },
              boxShadow: 3,
              mb: 3,
              border: "2px solid #1e6658",
            }}
          >
            <CardContent sx={{ p: 0.5 }}>
              {renderView()}
            </CardContent>
          </Card>

        </Box>
        {/* 
        <EventDialog
          open={openDialog}
          event={selectedEvent}
          onClose={() => setOpenDialog(false)}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          departments={departments}
          doctors={doctors}
        /> */}
      </Box>
    </LocalizationProvider>
  );
}