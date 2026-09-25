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
  InputAdornment,
} from "@mui/material";

import { useRouter } from "next/navigation";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import dayjs from "dayjs";

import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import TimeSlots from "./TimeSlots";

export default function AppointmentForm({
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
  allSchedules = [],
  currentSchedule,
  handleScheduleChange,
}) {
  const router = useRouter();

  const handleValidatedBooking = () => {
    const newErrors = {};

    const reason = formData?.reason?.trim();

    if (!reason) {
      newErrors.reason = "Reason for visit is required";
    } else if (reason.length < 3) {
      newErrors.reason = "Reason must be at least 3 characters";
    } else if (reason.length > 200) {
      newErrors.reason = "Reason cannot exceed 200 characters";
    }

    if (!currentSchedule) {
      newErrors.hospital = "Please select a hospital";
    }

    if (!selectedDate) {
      newErrors.date = "Please select an appointment date";
    }

    if (!selectedSlot) {
      newErrors.slot = "Please select an appointment time";
    }

    if (bookingFor === "other") {
      if (!formData?.name?.trim()) {
        newErrors.name = "Patient name is required";
      }

      if (!formData?.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.email.trim()
        )
      ) {
        newErrors.email = "Enter a valid email address";
      }

      const mobile = formData?.mobile?.trim();

      if (!mobile) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^[6-9]\d{9}$/.test(mobile)) {
        newErrors.mobile =
          "Enter a valid 10-digit mobile number";
      }

      if (!formData?.gender) {
        newErrors.gender = "Please select gender";
      }

      const age = Number(formData?.age);

      if (!formData?.age) {
        newErrors.age = "Age is required";
      } else if (
        Number.isNaN(age) ||
        age < 1 ||
        age > 120
      ) {
        newErrors.age =
          "Enter a valid age between 1 and 120";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      return;
    }

    setErrors({});
    handleBookAppointment();
  };

  const compactFieldSx = {
    ...fieldSx,

    "& .MuiInputLabel-root": {
      fontSize: "11.5px",
      backgroundColor: "background.paper",
      px: 0.4,
    },

    "& .MuiInputLabel-root.MuiInputLabel-shrink": {
      fontSize: "11.5px",
    },

    "& .MuiOutlinedInput-root": {
      minHeight: 48,
      borderRadius: 2,
      backgroundColor: "background.paper",

      "& fieldset": {
        borderColor: "divider",
      },

      "&:hover fieldset": {
        borderColor: "primary.light",
      },

      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: "1px",
      },
    },

    "& .MuiOutlinedInput-input": {
      fontSize: "11.5px",
      py: 1.35,
    },

    "& .MuiSelect-select": {
      fontSize: "11.5px",
    },

    "& .MuiFormHelperText-root": {
      ml: 0.5,
      mt: 0.4,
      fontSize: "9px",
      lineHeight: 1.2,
    },
  };

  const FormSkeleton = () => (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        px: 0.5,
        pt: 1.5,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
          },
          gap: 1.5,
        }}
      >
        <Skeleton
          variant="rounded"
          height={48}
          sx={{ borderRadius: 2 }}
        />

        <Skeleton
          variant="rounded"
          height={48}
          sx={{ borderRadius: 2 }}
        />
      </Box>

      <Skeleton
        variant="rounded"
        height={48}
        sx={{ borderRadius: 2 }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2,1fr)",
            sm: "repeat(4,1fr)",
          },
          gap: 1,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Skeleton
            key={item}
            variant="rounded"
            height={48}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    </Box>
  );

  const NoScheduleState = () => {
    const handleViewOtherDoctors = () => {
      router.push("/users/pages/doctor");
    };

    return (
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          px: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          py: {
            xs: 3,
            sm: 4,
          },
          backgroundColor: "background.paper",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -75,
            right: -75,
            width: {
              xs: 150,
              sm: 190,
            },
            height: {
              xs: 150,
              sm: 190,
            },
            borderRadius: "50%",
            backgroundColor:
              "rgba(7, 135, 106, 0.035)",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: -95,
            left: -95,
            width: {
              xs: 180,
              sm: 220,
            },
            height: {
              xs: 180,
              sm: 220,
            },
            borderRadius: "50%",
            backgroundColor:
              "rgba(7, 135, 106, 0.025)",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 470,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              width: {
                xs: 108,
                sm: 128,
              },
              height: {
                xs: 108,
                sm: 128,
              },
              mb: {
                xs: 2,
                sm: 2.5,
              },
              borderRadius: "50%",
              backgroundColor:
                "rgba(7, 135, 106, 0.055)",
              border:
                "1px dashed rgba(7, 135, 106, 0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: {
                  xs: 66,
                  sm: 74,
                },
                height: {
                  xs: 66,
                  sm: 74,
                },
                borderRadius: 2.5,
                backgroundColor:
                  "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow:
                  "0 8px 24px rgba(15,23,42,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EventBusyOutlinedIcon
                sx={{
                  fontSize: {
                    xs: 32,
                    sm: 38,
                  },
                  color: "primary.main",
                }}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                right: {
                  xs: 5,
                  sm: 8,
                },
                bottom: {
                  xs: 5,
                  sm: 7,
                },
                width: 36,
                height: 36,
                borderRadius: "50%",
                backgroundColor:
                  "background.paper",
                border: "2px solid",
                borderColor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 4px 10px rgba(15,23,42,0.05)",
              }}
            >
              <AccessTimeOutlinedIcon
                sx={{
                  fontSize: 19,
                  color: "primary.main",
                }}
              />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: {
                xs: "18px",
                sm: "21px",
              },
              lineHeight: 1.3,
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            No appointments available
          </Typography>

          <Typography
            sx={{
              mt: 1,
              maxWidth: 390,
              fontSize: {
                xs: "11.5px",
                sm: "12.5px",
              },
              lineHeight: 1.65,
              color: "text.secondary",
            }}
          >
            This doctor hasn't added an appointment
            schedule yet.
          </Typography>

          <Button
            type="button"
            variant="contained"
            onClick={handleViewOtherDoctors}
            startIcon={
              <Groups2OutlinedIcon
                sx={{
                  fontSize: "18px !important",
                }}
              />
            }
            endIcon={
              <ArrowForwardRoundedIcon
                sx={{
                  fontSize: "18px !important",
                }}
              />
            }
            sx={{
              mt: 2.5,
              width: {
                xs: "100%",
                sm: 280,
              },
              minHeight: 46,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 700,
              boxShadow:
                "0 5px 14px rgba(7,135,106,0.18)",

              "&:hover": {
                boxShadow:
                  "0 7px 18px rgba(7,135,106,0.22)",
              },
            }}
          >
            View Other Doctors
          </Button>

          <Box
            sx={{
              mt: 2,
              width: {
                xs: "100%",
                sm: "auto",
              },
              minWidth: {
                sm: 320,
              },
              maxWidth: 380,
              px: 2,
              py: 1.25,
              borderRadius: 2,
              backgroundColor:
                "rgba(7, 135, 106, 0.055)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <InfoOutlinedIcon
              sx={{
                flexShrink: 0,
                fontSize: 17,
                color: "primary.main",
              }}
            />

            <Typography
              sx={{
                fontSize: {
                  xs: "10.5px",
                  sm: "11.5px",
                },
                lineHeight: 1.5,
                fontWeight: 500,
                color: "primary.main",
              }}
            >
              You can also check back later for new
              slots.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const getHospitalLabel = (schedule) => {
    try {
      const raw =
        schedule?.hospitalName ||
        schedule?.hospital_name;

      if (!raw) return "Hospital";

      if (
        typeof raw === "string" &&
        raw.trim().startsWith("{")
      ) {
        const parsed = JSON.parse(raw);

        return (
          parsed?.hospitalName ||
          parsed?.name ||
          "Hospital"
        );
      }

      return raw;
    } catch (error) {
      console.log("Hospital parse error:", error);
      return "Hospital";
    }
  };

  const uniqueHospitals = Array.from(
    new Map(
      allSchedules.map((schedule) => [
        getHospitalLabel(schedule),
        schedule,
      ])
    ).values()
  );

  const hospitalSchedules = allSchedules.filter(
    (schedule) =>
      getHospitalLabel(schedule) ===
      getHospitalLabel(currentSchedule)
  );

  const today = dayjs().startOf("day");

  const minScheduleDate =
    hospitalSchedules.length > 0
      ? hospitalSchedules.reduce(
          (min, schedule) => {
            const startDate = dayjs(
              schedule?.availability?.startDate
            );

            if (!startDate.isValid()) {
              return min;
            }

            return startDate.isBefore(min)
              ? startDate
              : min;
          },
          dayjs(
            hospitalSchedules[0]?.availability
              ?.startDate
          )
        )
      : today;

  const finalMinDate =
    minScheduleDate?.isValid() &&
    minScheduleDate.isAfter(today)
      ? minScheduleDate
      : today;

  const isDateAvailable = (date) => {
    if (!date || !date.isValid()) {
      return false;
    }

    if (
      date
        .startOf("day")
        .isBefore(dayjs().startOf("day"))
    ) {
      return false;
    }

    const dateString =
      date.format("YYYY-MM-DD");

    const dayName = date.format("ddd");

    return hospitalSchedules.some((schedule) => {
      const availability =
        schedule?.availability;

      if (!availability) {
        return false;
      }

      const startDate = dayjs(
        availability.startDate
      ).format("YYYY-MM-DD");

      const endDate = dayjs(
        availability.endDate
      ).format("YYYY-MM-DD");

      const activeDays =
        availability.activeDays || [];

      return (
        dateString >= startDate &&
        dateString <= endDate &&
        activeDays.includes(dayName)
      );
    });
  };

  const AvailableDay = (props) => {
    const {
      day,
      outsideCurrentMonth,
      ...other
    } = props;

    const available =
      !outsideCurrentMonth &&
      isDateAvailable(day);

    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PickersDay
          {...other}
          day={day}
          outsideCurrentMonth={
            outsideCurrentMonth
          }
        />

        {available && (
          <Box
            sx={{
              position: "absolute",
              bottom: 2,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              pointerEvents: "none",
            }}
          />
        )}
      </Box>
    );
  };

  const handleBookingForChange = (type) => {
    setBookingFor(type);

    if (type === "self") {
      setErrors((prev) => ({
        ...prev,
        name: undefined,
        email: undefined,
        mobile: undefined,
        gender: undefined,
        age: undefined,
      }));
    }
  };

  const handleHospitalChange = (event) => {
    const hospital = event.target.value;

    const schedules = allSchedules.filter(
      (schedule) =>
        getHospitalLabel(schedule) === hospital
    );

    if (schedules.length > 0) {
      handleScheduleChange(schedules[0]);
    }

    setFormData((prev) => ({
      ...prev,
      hospital_name: hospital,
    }));

    setSelectedDate(null);
    setSelectedSlot(null);

    setErrors((prev) => ({
      ...prev,
      hospital: undefined,
      date: undefined,
      slot: undefined,
    }));
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedSlot(null);

    setErrors((prev) => ({
      ...prev,
      date: undefined,
      slot: undefined,
    }));
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 650,
        mx: "auto",
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "background.paper",
      }}
    >
      {initialLoading ? (
        <FormSkeleton />
      ) : allSchedules.length === 0 ? (
        <NoScheduleState />
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              flexShrink: 0,
              display: "grid",
              gridTemplateColumns:
                "repeat(2,1fr)",
              gap: 0.7,
              p: 0.6,
              mb: 1,
              borderRadius: 2,
              backgroundColor:
                "background.paper",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              type="button"
              onClick={() =>
                handleBookingForChange("self")
              }
              startIcon={
                <Person2OutlinedIcon
                  sx={{
                    fontSize:
                      "17px !important",
                  }}
                />
              }
              sx={{
                minHeight: 40,
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "11px",
                fontWeight:
                  bookingFor === "self"
                    ? 700
                    : 500,
                color:
                  bookingFor === "self"
                    ? "primary.main"
                    : "text.secondary",
                backgroundColor:
                  bookingFor === "self"
                    ? "secondary.light"
                    : "transparent",
                border: "1px solid",
                borderColor:
                  bookingFor === "self"
                    ? "primary.main"
                    : "transparent",

                "&:hover": {
                  backgroundColor:
                    bookingFor === "self"
                      ? "secondary.light"
                      : "background.default",
                },
              }}
            >
              For Myself
            </Button>

            <Button
              type="button"
              onClick={() =>
                handleBookingForChange("other")
              }
              startIcon={
                <GroupOutlinedIcon
                  sx={{
                    fontSize:
                      "17px !important",
                  }}
                />
              }
              sx={{
                minHeight: 40,
                borderRadius: 1.5,
                textTransform: "none",
                fontSize: "11px",
                fontWeight:
                  bookingFor === "other"
                    ? 700
                    : 500,
                color:
                  bookingFor === "other"
                    ? "primary.main"
                    : "text.secondary",
                backgroundColor:
                  bookingFor === "other"
                    ? "secondary.light"
                    : "transparent",
                border: "1px solid",
                borderColor:
                  bookingFor === "other"
                    ? "primary.main"
                    : "transparent",

                "&:hover": {
                  backgroundColor:
                    bookingFor === "other"
                      ? "secondary.light"
                      : "background.default",
                },
              }}
            >
              Someone Else
            </Button>
          </Paper>

          <Box
            id="appointment-scroll-area"
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              handleValidatedBooking();
            }}
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              px: 0.5,
              pt: 1.3,
              scrollbarWidth: "none",
              msOverflowStyle: "none",

              "&::-webkit-scrollbar": {
                display: "none",
                width: 0,
                height: 0,
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "minmax(0,1fr) minmax(0,1fr)",
                },
                gap: 1.2,
                pt: 0.5,
                alignItems: "start",
                overflow: "visible",

                "& > *": {
                  minWidth: 0,
                  width: "100%",
                },
              }}
            >
              <TextField
                select
                required
                fullWidth
                label="Hospital / Location"
                value={
                  currentSchedule
                    ? getHospitalLabel(
                        currentSchedule
                      )
                    : ""
                }
                onChange={handleHospitalChange}
                error={!!errors?.hospital}
                helperText={errors?.hospital}
                sx={{
                  ...compactFieldSx,

                  "& .MuiOutlinedInput-root": {
                    height: "52px !important",
                    minHeight: "52px !important",
                    maxHeight: "52px !important",
                    boxSizing: "border-box",
                    borderRadius: 2,
                    backgroundColor:
                      "background.paper",

                    "& fieldset": {
                      borderColor: "#b1b1b1",
                    },

                    "&:hover fieldset": {
                      borderColor: "#b1b1b1",
                    },

                    "&.Mui-focused fieldset": {
                      borderColor: "#b1b1b1",
                      borderWidth: "1px",
                    },
                  },

                  "& .MuiSelect-select": {
                    height: "52px !important",
                    minHeight: "52px !important",
                    maxHeight: "52px !important",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 0,
                    paddingBottom: 0,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalHospitalOutlinedIcon
                        sx={{
                          fontSize: 18,
                          color:
                            "text.secondary",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              >
                {uniqueHospitals.map(
                  (schedule) => {
                    const hospital =
                      getHospitalLabel(schedule);

                    return (
                      <MenuItem
                        key={hospital}
                        value={hospital}
                        sx={{
                          fontSize: "11px",
                        }}
                      >
                        {hospital}
                      </MenuItem>
                    );
                  }
                )}
              </TextField>

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
              >
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  shouldDisableDate={
                    shouldDisableDate
                  }
                  minDate={finalMinDate}
                  slots={{
                    day: AvailableDay,
                  }}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      error: !!errors?.date,
                      helperText: errors?.date,

                      sx: {
                        ...compactFieldSx,

                        "& .MuiOutlinedInput-root":
                          {
                            height:
                              "52px !important",
                            minHeight:
                              "52px !important",
                            maxHeight:
                              "52px !important",
                            boxSizing:
                              "border-box",
                            borderRadius: 2,
                            backgroundColor:
                              "background.paper",

                            "& fieldset": {
                              borderColor:
                                "#b1b1b1",
                            },

                            "&:hover fieldset":
                              {
                                borderColor:
                                  "#b1b1b1",
                              },

                            "&.Mui-focused fieldset":
                              {
                                borderColor:
                                  "#b1b1b1",
                                borderWidth:
                                  "1px",
                              },
                          },

                        "& .MuiOutlinedInput-input":
                          {
                            height:
                              "52px !important",
                            minHeight:
                              "52px !important",
                            boxSizing:
                              "border-box",
                            padding:
                              "0 14px !important",
                            display: "flex",
                            alignItems: "center",
                            fontSize: "11.5px",
                            fontWeight: 500,
                          },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            <TextField
              label="Reason for Visit"
              name="reason"
              required
              value={formData.reason || ""}
              onChange={(event) => {
                handleInputChange(event);

                if (
                  event.target.value.trim()
                ) {
                  setErrors((prev) => ({
                    ...prev,
                    reason: undefined,
                  }));
                }
              }}
              fullWidth
              error={!!errors?.reason}
              helperText={
                errors?.reason ||
                `${
                  formData.reason?.length || 0
                }/200`
              }
              placeholder="e.g. Fever, headache, consultation, follow-up..."
              inputProps={{
                maxLength: 200,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NotesOutlinedIcon
                      sx={{
                        fontSize: 17,
                        color:
                          "text.secondary",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                ...compactFieldSx,

                "& .MuiOutlinedInput-root": {
                  height: 48,
                  minHeight: 48,
                  borderRadius: 2,
                  backgroundColor:
                    "background.paper",

                  "& fieldset": {
                    borderColor: "#b1b1b1",
                  },

                  "&:hover fieldset": {
                    borderColor: "#b1b1b1",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#b1b1b1",
                    borderWidth: "1px",
                  },
                },

                "& .MuiFormHelperText-root":
                  {
                    textAlign: errors?.reason
                      ? "left"
                      : "right",
                    fontSize: "8.5px",
                  },
              }}
            />

            {bookingFor === "other" && (
              <Box
                sx={{
                  p: 1.3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor:
                    "background.default",
                }}
              >
                <Typography
                  sx={{
                    mb: 1.2,
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                >
                  Patient Information
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2,minmax(0,1fr))",
                    },
                    gap: 1.2,
                  }}
                >
                  <TextField
                    label="Full Name"
                    name="name"
                    required
                    value={
                      formData.name || ""
                    }
                    onChange={
                      handleInputChange
                    }
                    fullWidth
                    error={!!errors?.name}
                    helperText={errors?.name}
                    sx={compactFieldSx}
                  />

                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={
                      formData.email || ""
                    }
                    onChange={
                      handleInputChange
                    }
                    fullWidth
                    error={!!errors?.email}
                    helperText={errors?.email}
                    sx={compactFieldSx}
                  />

                  <TextField
                    label="Mobile Number"
                    name="mobile"
                    required
                    value={
                      formData.mobile || ""
                    }
                    onChange={
                      handleInputChange
                    }
                    fullWidth
                    error={!!errors?.mobile}
                    helperText={
                      errors?.mobile
                    }
                    sx={compactFieldSx}
                    inputProps={{
                      inputMode: "numeric",
                      maxLength: 10,
                    }}
                  />

                  <TextField
                    select
                    label="Gender"
                    name="gender"
                    required
                    value={
                      formData.gender || ""
                    }
                    onChange={
                      handleInputChange
                    }
                    fullWidth
                    error={!!errors?.gender}
                    helperText={
                      errors?.gender
                    }
                    sx={compactFieldSx}
                  >
                    <MenuItem
                      value="Male"
                      sx={{
                        fontSize: "11px",
                      }}
                    >
                      Male
                    </MenuItem>

                    <MenuItem
                      value="Female"
                      sx={{
                        fontSize: "11px",
                      }}
                    >
                      Female
                    </MenuItem>

                    <MenuItem
                      value="Other"
                      sx={{
                        fontSize: "11px",
                      }}
                    >
                      Other
                    </MenuItem>
                  </TextField>

                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    required
                    value={
                      formData.age || ""
                    }
                    onChange={
                      handleInputChange
                    }
                    fullWidth
                    error={!!errors?.age}
                    helperText={errors?.age}
                    sx={compactFieldSx}
                    inputProps={{
                      min: 1,
                      max: 120,
                    }}
                  />
                </Box>
              </Box>
            )}

            <Box
              sx={{
                pt: 0.2,
                pb: 0.5,
              }}
            >
              <TimeSlots
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                setSelectedSlot={
                  setSelectedSlot
                }
                filteredSlots={
                  filteredSlots
                }
                errors={errors}
                setErrors={setErrors}
              />
            </Box>
          </Box>

          <Box
            sx={{
              flexShrink: 0,
              px: 0.5,
              pt: 1,
              pb: 0.5,
              backgroundColor:
                "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              fullWidth
              type="button"
              variant="contained"
              disabled={bookingLoading}
              onClick={
                handleValidatedBooking
              }
              startIcon={
                !bookingLoading ? (
                  <EventAvailableOutlinedIcon
                    sx={{
                      fontSize:
                        "17px !important",
                    }}
                  />
                ) : null
              }
              sx={{
                minHeight: 44,
                borderRadius: 1.8,
                textTransform: "none",
                fontSize: "11.5px",
                fontWeight: 700,
                boxShadow:
                  "0 4px 12px rgba(7,135,106,0.15)",

                "&:hover": {
                  boxShadow:
                    "0 5px 14px rgba(7,135,106,0.20)",
                },
              }}
            >
              {bookingLoading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                "Book Appointment"
              )}
            </Button>

            <Typography
              sx={{
                mt: 0.45,
                textAlign: "center",
                fontSize: "8px",
                color: "text.secondary",
              }}
            >
              By booking, you agree to our
              terms and cancellation policy.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}