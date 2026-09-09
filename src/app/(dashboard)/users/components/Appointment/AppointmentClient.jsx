"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "../../../../../utils/axiosInstance";
import {
  Grid,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import HeaderSection from "../../../../Home/components/Appointment/HeaderSection";
import { useSearchParams } from "next/navigation";
import LeftSide from "../../components/Appointment/LeftSide";
import AppointmentForm from "../../components/Appointment/AppointmentForm";


dayjs.extend(isBetween);

export default function AppointmentPage() {
  // State Management
  const [bookingFor, setBookingFor] = useState("self");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [userCity, setUserCity] = useState("");
  const [allSchedules, setAllSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const searchParams = useSearchParams();
  const doctorIdFromUrl = searchParams.get("id");
  const [schedule, setSchedule] = useState(null);


  const fetchSlots = async () => {
  if (!selectedDate || !schedule) return;

  try {
    const hospitalName = getHospitalLabel(schedule);

    const response = await api.get("/api/appointments/doctor-slots", {
      params: {
        doctorId: doctorIdFromUrl,
        hospitalName,
        date: selectedDate.format("YYYY-MM-DD"),
      },
    });

  setFilteredSlots(
  response.data.slots.map((slot) => ({
    slotId: slot.slotId,
    start: slot.startTime,
     tokenNumber: slot.tokenNumber,
    end: slot.endTime,
    status: slot.status,
    date: selectedDate.format("YYYY-MM-DD"),
  }))
);
  } catch (err) {
    console.log(err);
  }
};
 useEffect(() => {
  fetchSlots();
}, [selectedDate, schedule]);
  const toDate = (d) => dayjs(d).format("YYYY-MM-DD");
  const getHospitalLabel = (schedule) => {
    try {
      const raw = schedule?.hospitalName || schedule?.hospital_name;

      if (!raw) return "Hospital";

      if (typeof raw === "string" && raw.startsWith("{")) {
        const parsed = JSON.parse(raw);
        return parsed?.hospitalName || "Hospital";
      }

      return raw;
    } catch (e) {
      console.log("Hospital parse error:", e);
      return "Hospital";
    }
  };

  // Loading States
  const [initialLoading, setInitialLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    reason: "",
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Custom Theme Styles
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      transition: "all 0.2s ease-in-out",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#14b8a6" },
      "&.Mui-focused fieldset": {
        borderColor: "#0f766e",
        borderWidth: "2px",
        boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748b",
      fontWeight: 500,
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#0f766e" },
    "& .MuiInputBase-input": {
      fontSize: "0.95rem",
    },
  };

  // Get Auth Token and Doctor ID
  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    let userId = null;

    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id;
      } catch (err) {
        console.error("Failed to parse user", err);
      }
    }

    return {
      token,
      doctorId: doctorIdFromUrl,
      userId,
    };
  }, [doctorIdFromUrl]);

  const handleScheduleChange = (newSchedule) => {
    setSchedule(newSchedule);
    setSlots(newSchedule.slots || []);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  useEffect(() => {
    if (!selectedDate || allSchedules.length === 0) return;

    const current = toDate(selectedDate);

   const selectedHospital = getHospitalLabel(schedule);

const matchedSchedule = allSchedules.find((sch) => {

    if (getHospitalLabel(sch) !== selectedHospital)
        return false;

    const start = toDate(sch.availability.startDate);
    const end = toDate(sch.availability.endDate);

    const activeDays = sch.availability.activeDays || [];

    const dayName = dayjs(selectedDate).format("ddd");

    return (
        current >= start &&
        current <= end &&
        activeDays.includes(dayName)
    );
});

    if (matchedSchedule) {
      setSchedule(matchedSchedule);
      setSlots(matchedSchedule.slots || []);
    }
  }, [selectedDate, allSchedules]);
  // Fetch Initial Data
  useEffect(() => {
    const { token, doctorId } = getAuthConfig();

    const fetchUserProfile = async () => {
      try {
       const response = await api.get("/api/user/getProfile");
        const profile = response.data.data;
        setUserProfile(profile);

        // Extract city from user's address
        if (profile?.address) {
          let addressStr = "";
          if (Array.isArray(profile.address)) {
            addressStr = profile.address.join(" ");
          } else {
            addressStr = profile.address;
          }

      

          // Parse city from address string
          try {
            const cityInArrayMatch = addressStr.match(/"city"\s*:\s*"([^"]+)"/i);
            if (cityInArrayMatch) {
              const city = cityInArrayMatch[1].toLowerCase().trim();
              setUserCity(city);
            }
          } catch (error) {
            console.log("City extraction failed:", error);
          }
        }

        // Pre-fill form if booking for self
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            name: profile.full_name || "",
            email: profile.email || "",
            mobile: profile.phone_number || "",
            age: profile.age || "",
            gender: profile.gender || "",
          }));
        }
      } catch (error) {
        console.error("Profile API error:", error);
        setSnackbar({
          open: true,
          message: "Failed to load profile data",
          severity: "error",
        });
      }
    };
    const fetchAppointmentSlots = async () => {
      try {
      const response = await api.get(
  `/api/schedules/getSchedulePublicByDoctorId/${doctorId}`
);

        const scheduleData = response.data.data;
    
        if (scheduleData && scheduleData.length > 0) {
          setAllSchedules(scheduleData);
          setFilteredSchedules(scheduleData);
          setSchedule(scheduleData[0]);
          setSlots(scheduleData[0].slots || []);

          // Pre-fill hospital_name
          setFormData(prev => ({
            ...prev,
            hospital_name: getHospitalLabel(scheduleData[0]),
          }));
        }
      } catch (error) {
        console.error("Slot fetch error:", error);
      }
    };


    const init = async () => {
      setInitialLoading(true);
      await Promise.all([fetchUserProfile(), fetchAppointmentSlots()]);
      setInitialLoading(false);
    };

    init();
  }, [getAuthConfig]);




  // Handle Booking For Change
  useEffect(() => {

    if (bookingFor === "self" && userProfile) {
      setFormData((prev) => {
        const updated = {
          ...prev,
          name: userProfile.full_name || "",
          email: userProfile.email || "",
          mobile: userProfile.phone_number || "",
          age: userProfile.age || "",
          gender: userProfile.gender || "",
          reason: "",
        };

          return updated;
      });
    } else if (bookingFor === "other") {
      setFormData({
        name: "",
        email: "",
        mobile: "",
        age: "",
        gender: "",
        reason: "",
        hospital_name: formData.hospital_name || "",
      });
    }
  }, [bookingFor, userProfile]);

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Only validate personal info fields when booking for someone else
    if (bookingFor === "other") {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
      if (!formData.age) newErrors.age = "Age is required";
    }

    if (!selectedDate) newErrors.date = "Please select a date";
    if (!selectedSlot) newErrors.slot = "Please select a time slot";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Book Appointment Handler
  const handleBookAppointment = async () => {
    if (!validateForm()) return;

    setBookingLoading(true);
    const { token, doctorId, userId } = getAuthConfig();

    const payload = {
      appointment_date: selectedDate.format("YYYY-MM-DD"),
     start_time: dayjs(`2000-01-01 ${selectedSlot.start}`).format("hh:mm A"),
  end_time: dayjs(`2000-01-01 ${selectedSlot.end}`).format("hh:mm A"),
      reason_for_visit: formData.reason,
      booking_type: bookingFor === "self" ? "myself" : "someone_else",
      mode: "online",
        token_number: selectedSlot.tokenNumber,
      hospital_name: getHospitalLabel(schedule),
      ...(bookingFor === "other" && {
        patient: {
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          phone: formData.mobile,
          email: formData.email,
        },
      }),
    };

 

    try {
    const response = await api.post(
  `/api/appointments/create/${doctorId}`,
  payload
);

      setSnackbar({
        open: true,
        message:
          "Appointment booked successfully! Check your email for confirmation.",
        severity: "success",
      });

      // Reset form after successful booking
      setSelectedSlot(null);
      await fetchSlots();
      setFormData((prev) => ({ ...prev, reason: "" }));
    } catch (error) {
      console.error("Booking error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to book appointment. Please try again.";
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    } finally {
      setBookingLoading(false);
    }
  };

 const shouldDisableDate = (date) => {
  // Past dates disable
  if (date.startOf("day").isBefore(dayjs().startOf("day"))) {
    return true;
  }

  const current = toDate(date);

  const selectedHospital = getHospitalLabel(schedule);

  const hospitalSchedules = allSchedules.filter(
    s => getHospitalLabel(s) === selectedHospital
  );

  return !hospitalSchedules.some((sch) => {
    const start = toDate(sch.availability.startDate);
    const end = toDate(sch.availability.endDate);

    const dayName = dayjs(date).format("ddd");
    const activeDays = sch.availability?.activeDays || [];

    return (
      current >= start &&
      current <= end &&
      activeDays.includes(dayName)
    );
  });
};




  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        sx={{
         height: "calc(100vh - 60px)",
          p: { xs: 1, sm: 2, md: 1 },
          mt: 7.5,
          mb: 2,
          overflow: {
            xs: "visible",
            md: "hidden",
          },
        }}
      >
        <Paper
          sx={{
            width: "100%",
            height: {
              xs: "auto",
              md: "100%",
            },
          
            boxShadow: "0 4px 12px rgba(15,116,104,0.9)",
            overflow: "hidden",
          }}
        >
          <Grid
            container
            sx={{
              height: {
                xs: "auto",
                md: "100%",
              },
              p: { xs: 2, md: 3 },
              background: "#fff",
              borderRadius: 1,
              overflow: "hidden",
              boxShadow: "0px 15px 50px rgba(0, 137, 110, 0.89)",
            }}
          >
            {/* Left Side - Hero Section */}
            <Grid
              size={{ xs: 12, md: 5 }}
              sx={{
                position: {
                  xs: "static",
                  md: "sticky",
                },

                top: {
                  md: 90,
                },
                display: "flex",
                alignSelf: "stretch",
                height: {
                  xs: "auto",
                  md: "100%",
                },

                mb: {
                  xs: 3,
                  md: 0,
                },
              }}
            >
              <LeftSide
                bookingFor={bookingFor}
                setBookingFor={setBookingFor}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                userCity={userCity}
                hasMatchingSchedules={filteredSchedules.length > 0}
              />
            </Grid>

            {/* Right Side - Form */}
            <Grid
              size={{ xs: 12, md: 7 }}
              sx={{
                p: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                },
                maxHeight: {
                  xs: "none",
                  md: "calc(100vh - 150px)",
                },
                overflowY: {
                  xs: "visible",
                  md: "auto",
                },
              }}
            >
              <AppointmentForm
                bookingFor={bookingFor}
                setBookingFor={setBookingFor}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                filteredSlots={filteredSlots}
                initialLoading={initialLoading}
                bookingLoading={bookingLoading}
                userProfile={userProfile}
                handleInputChange={handleInputChange}
                handleBookAppointment={handleBookAppointment}
                shouldDisableDate={shouldDisableDate}
                fieldSx={fieldSx}
                allSchedules={allSchedules}
                currentSchedule={schedule}
                handleScheduleChange={handleScheduleChange}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%", borderRadius: 2 }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Grid>
    </LocalizationProvider>
  );
}
