"use client";

import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Skeleton,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TimeSlots from "./TimeSlots";

const AppointmentForm = ({
  bookingFor,
  setBookingFor,
  formData,
  setFormData,
  errors,
  setErrors,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
  filteredSlots,
  initialLoading,
  bookingLoading,
  userProfile,
  handleInputChange,
  handleBookAppointment,
  shouldDisableDate,
  fieldSx,
  allSchedules,
  currentSchedule,
  handleScheduleChange,
}) => {
  // Skeleton Loading Component

  const FormSkeleton = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={56}
            sx={{ borderRadius: "12px" }}
          />
        ))}
      </Box>
      <Skeleton
        variant="rectangular"
        height={100}
        sx={{ borderRadius: "12px" }}
      />
    </Box>
  );

  const getHospitalLabel = (schedule) => {
    try {
      const raw = schedule?.hospitalName || schedule?.hospital_name;

      if (!raw) return "Hospital";

      // agar JSON string hai
      if (typeof raw === "string" && raw.startsWith("{")) {
        const parsed = JSON.parse(raw);
        return parsed?.hospitalName || "Hospital";
      }

      // agar simple string hai
      return raw;
    } catch (e) {
      console.log("Hospital parse error:", e);
      return "Hospital";
    }
  };
  const uniqueHospitals = Array.from(
    new Map(
      allSchedules.map((s) => [getHospitalLabel(s), s])
    ).values()
  );

  const hospitalSchedules = allSchedules.filter(
    s => getHospitalLabel(s) === getHospitalLabel(currentSchedule)
  );

 const today = dayjs().startOf("day");

const minScheduleDate = hospitalSchedules.length
  ? hospitalSchedules.reduce(
      (min, s) =>
        dayjs(s.availability.startDate).isBefore(min)
          ? dayjs(s.availability.startDate)
          : min,
      dayjs(hospitalSchedules[0].availability.startDate)
    )
  : today;

// Final minimum date
const finalMinDate = minScheduleDate.isAfter(today)
  ? minScheduleDate
  : today;
  return (
    <Box
      sx={{
        maxWidth: {
          xs: "100%",
          md: 600,
        },

        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          fontWeight: 700,
          color: "#0f172a",
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        Book Appointment
      </Typography>
      <Typography
        variant="body1"
        sx={{ mb: 4, color: "#64748b", fontSize: "1rem" }}
      >
        Fill in the details below to schedule your visit
      </Typography>

      {/* Booking Type Toggle */}
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          position: "relative",
          backgroundColor: "#f8fafc",
          borderRadius: 2,
          p: 0.5,
          mb: 4,
          border: "1px solid #e2e8f0",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 4,
            left: bookingFor === "self" ? 4 : "50%",
            width: "calc(50% - 4px)",
            height: "calc(100% - 8px)",
            backgroundColor: "#fff",
            borderRadius: 1.5,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "2px solid #14b8a6",
          }}
        />
        <Button
          onClick={() => setBookingFor("self")}
          sx={{
            flex: 1,
            zIndex: 1,
            py: 1.5,
            color: bookingFor === "self" ? "#0f766e" : "#64748b",
            fontWeight: bookingFor === "self" ? 600 : 500,
            textTransform: "none",
            fontSize: "0.95rem",
          }}
          startIcon={<Person2OutlinedIcon />}
        >
          For Myself
        </Button>
        <Button
          onClick={() => setBookingFor("other")}
          sx={{
            flex: 1,
            zIndex: 1,
            py: 1.5,
            color: bookingFor === "other" ? "#0f766e" : "#64748b",
            fontWeight: bookingFor === "other" ? 600 : 500,
            textTransform: "none",
            fontSize: "0.95rem",
          }}
          startIcon={<GroupOutlinedIcon />}
        >
          Someone Else
        </Button>
      </Paper>

      {initialLoading ? (
        <FormSkeleton />
      ) : (
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >

          {/* Hospital Selection Dropdown */}
          {allSchedules && allSchedules.length > 0 && (
            <TextField
              select
              required
              label="Select Hospital / Location"
              value={getHospitalLabel(currentSchedule) || ""}
              onChange={(e) => {
                const hospital = e.target.value;

                const schedules = allSchedules.filter(
                  s => getHospitalLabel(s) === hospital
                );

                handleScheduleChange(schedules[0]);

                setFormData(prev => ({
                  ...prev,
                  hospital_name: hospital,
                }));
              }}
              fullWidth
              sx={fieldSx}
            >

              {uniqueHospitals.map((sch) => (
                <MenuItem
                  key={getHospitalLabel(sch)}
                  value={getHospitalLabel(sch)}
                >
                  {getHospitalLabel(sch)}
                </MenuItem>
              ))}
            </TextField>
          )}

          {bookingFor === "other" && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 2.5,
              }}
            >
              <TextField
                label="Full Name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                sx={fieldSx}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Email Address"
                name="email"
                required
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                sx={fieldSx}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Mobile Number"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleInputChange}
                fullWidth
                sx={fieldSx}
                error={!!errors.mobile}
                helperText={errors.mobile}
              />
           <TextField
  select
  label="Gender"
  name="gender"
  required
  value={formData.gender}
  onChange={handleInputChange}
  fullWidth
  sx={fieldSx}
>
  <MenuItem value="Male">Male</MenuItem>
  <MenuItem value="Female">Female</MenuItem>
  <MenuItem value="Other">Other</MenuItem>
</TextField>
              <TextField
                label="Age"
                name="age"
                type="number"
                required
                value={formData.age}
                onChange={handleInputChange}
                fullWidth
                sx={fieldSx}
                error={!!errors.age}
                helperText={errors.age}
                inputProps={{ min: 0, max: 120 }}
              />
            </Box>
          )}

          {/* Date Selection - Always show */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={
                <>
                  Select Date{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "error.main",
                      fontWeight: 700,
                    }}
                  >
                    *
                  </Box>
                </>
              }
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);

                if (errors.date) {
                  setErrors((prev) => ({
                    ...prev,
                    date: undefined,
                  }));
                }
              }}
              shouldDisableDate={shouldDisableDate}
              minDate={finalMinDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: fieldSx,
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
            />
          </LocalizationProvider>

          {/* Reason for Visit */}
          <TextField
            label="Reason for Visit"
            name="reason"
            required
            value={formData.reason}
            onChange={handleInputChange}
            multiline
            rows={3}
            fullWidth
            sx={fieldSx}
            placeholder="Briefly describe your symptoms or reason for consultation..."
          />

          {/* Time Slots Section */}
          <TimeSlots
            required
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            filteredSlots={filteredSlots}
            errors={errors}
            setErrors={setErrors}
          />

          {/* Submit Button */}
          <Box sx={{ pt: 2 }}>
            <Button
              fullWidth
              size="large"

              variant="contained"
              onClick={handleBookAppointment}
              disabled={bookingLoading}
              sx={{
                py: 1.8,
                borderRadius: "12px",
                backgroundColor: "#0d9488",
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 14px rgba(13, 148, 136, 0.3)",
                "&:hover": {
                  backgroundColor: "#0f766e",
                  boxShadow: "0 6px 20px rgba(13, 148, 136, 0.4)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&:disabled": {
                  backgroundColor: "#cbd5e1",
                  color: "#fff",
                },
                transition: "all 0.2s ease",
              }}
            >
              {bookingLoading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Book Appointment"
              )}
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 2,
                color: "#64748b",
              }}
            >
              By booking, you agree to our terms and cancellation
              policy
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AppointmentForm;