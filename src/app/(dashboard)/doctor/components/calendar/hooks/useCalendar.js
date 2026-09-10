// components/calendar/hooks/useCalendar.js
import { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';

export const useCalendar = (initialEvents) => {
  const [view, setView] = useState("week");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [events, setEvents] = useState(initialEvents);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [showWeekends, setShowWeekends] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Update events when initialEvents changes
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      console.log("Updating events in hook:", initialEvents);
      setEvents(initialEvents);
    }
  }, [initialEvents]);

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

      return matchesSearch && matchesDepartment && matchesStatus && matchesDoctor;
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
      averagePatients: filteredEvents.length / 7, // Approximate
    };
  }, [filteredEvents]);

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
    console.log("Exporting calendar data...");
  };

  return {
    view,
    setView,
    selectedDate,
    setSelectedDate,
    events,
    filteredEvents,
    openDialog,
    setOpenDialog,
    selectedEvent,
    setSelectedEvent,
    searchTerm,
    setSearchTerm,
    filterDepartment,
    setFilterDepartment,
    filterStatus,
    setFilterStatus,
    filterDoctor,
    setFilterDoctor,
    showWeekends,
    setShowWeekends,
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
  };
};