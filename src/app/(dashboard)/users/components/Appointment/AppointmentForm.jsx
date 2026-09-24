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

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

import dayjs from "dayjs";

import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

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

  allSchedules = [],
  currentSchedule,
  handleScheduleChange,
}) => {
  // ============================================
  // FIELD STYLE
  // ============================================
const handleValidatedBooking = () => {
  const newErrors = {};

  // Reason validation
  const reason = formData?.reason?.trim();

  if (!reason) {
    newErrors.reason = "Reason for visit is required";
  } else if (reason.length < 3) {
    newErrors.reason = "Reason must be at least 3 characters";
  } else if (reason.length > 200) {
    newErrors.reason = "Reason cannot exceed 200 characters";
  }

  // Hospital validation
  if (!currentSchedule) {
    newErrors.hospital = "Please select a hospital";
  }

  // Date validation
  if (!selectedDate) {
    newErrors.date = "Please select an appointment date";
  }

  // Slot validation
  if (!selectedSlot) {
    newErrors.slot = "Please select an appointment time";
  }

  // Someone Else validation
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
      newErrors.mobile = "Enter a valid 10-digit mobile number";
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
      newErrors.age = "Enter a valid age between 1 and 120";
    }
  }

  // Stop API call
  if (Object.keys(newErrors).length > 0) {
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    return;
  }

  // Clear validation errors
  setErrors({});

  // API only after everything is valid
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

  // ============================================
  // SKELETON
  // ============================================

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
        {[1, 2, 3, 4, 5, 6, 7, 8].map(
          (item) => (
            <Skeleton
              key={item}
              variant="rounded"
              height={48}
              sx={{ borderRadius: 2 }}
            />
          )
        )}
      </Box>
    </Box>
  );

  // ============================================
  // HOSPITAL LABEL
  // ============================================

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
      console.log(
        "Hospital parse error:",
        error
      );

      return "Hospital";
    }
  };

  // ============================================
  // UNIQUE HOSPITALS
  // ============================================

  const uniqueHospitals = Array.from(
    new Map(
      allSchedules.map((schedule) => [
        getHospitalLabel(schedule),
        schedule,
      ])
    ).values()
  );

  // ============================================
  // CURRENT HOSPITAL SCHEDULES
  // ============================================

  const hospitalSchedules = allSchedules.filter(
    (schedule) =>
      getHospitalLabel(schedule) ===
      getHospitalLabel(currentSchedule)
  );

  // ============================================
  // MIN DATE
  // ============================================

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

  // ============================================
  // CHECK DATE AVAILABLE
  // Used for GREEN DOT in calendar
  // ============================================

  const isDateAvailable = (date) => {
    if (!date || !date.isValid()) {
      return false;
    }

    // Past date
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

    return hospitalSchedules.some(
      (schedule) => {
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
      }
    );
  };

  // ============================================
  // CUSTOM CALENDAR DAY
  // ============================================

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

        {/* GREEN AVAILABLE DOT */}

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

              backgroundColor:
                "primary.main",

              pointerEvents: "none",
            }}
          />
        )}
      </Box>
    );
  };

  // ============================================
  // BOOKING TYPE CHANGE
  // ============================================

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

  // ============================================
  // HOSPITAL CHANGE
  // ============================================

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

  // ============================================
  // DATE CHANGE
  // ============================================

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);

    setSelectedSlot(null);

    setErrors((prev) => ({
      ...prev,

      date: undefined,
      slot: undefined,
    }));
  };

  // ============================================
  // UI
  // ============================================

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

        backgroundColor:
          "background.paper",
      }}
    >
      {/* ============================================
          FIXED TOP
      ============================================ */}

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
        {/* MYSELF */}

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

        {/* SOMEONE ELSE */}

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

      {/* ============================================
          LOADING
      ============================================ */}

      {initialLoading ? (
        <FormSkeleton />
      ) : (
        <>
          {/* ========================================
              ONLY MIDDLE AREA SCROLL
          ======================================== */}

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

              // IMPORTANT:
              // label cut hone ka fix
              pt: 1.3,


              // Firefox
              scrollbarWidth: "none",

              // Old Edge
              msOverflowStyle: "none",

              // Chrome / Safari
              "&::-webkit-scrollbar": {
                display: "none",
                width: 0,
                height: 0,
              },
            }}
          >
            {/* ======================================
                HOSPITAL + DATE
            ====================================== */}

          <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
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
  {/* HOSPITAL */}
  {allSchedules.length > 0 && (
    <TextField
      select
      required
      fullWidth
      label="Hospital / Location"
      value={
        currentSchedule
          ? getHospitalLabel(currentSchedule)
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
          backgroundColor: "background.paper",

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

        "& .MuiInputAdornment-root": {
          height: "52px",
          display: "flex",
          alignItems: "center",
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocalHospitalOutlinedIcon
              sx={{
                fontSize: 18,
                color: "text.secondary",
              }}
            />
          </InputAdornment>
        ),
      }}
    >
      {uniqueHospitals.map((schedule) => {
        const hospital = getHospitalLabel(schedule);

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
      })}
    </TextField>
  )}

  {/* DATE */}
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label="Select Date"
      value={selectedDate}
      onChange={handleDateChange}
      shouldDisableDate={shouldDisableDate}
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

            "& .MuiOutlinedInput-root": {
              height: "52px !important",
              minHeight: "52px !important",
              maxHeight: "52px !important",
              boxSizing: "border-box",
              borderRadius: 2,
              backgroundColor: "background.paper",

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

            "& .MuiOutlinedInput-input": {
              height: "52px !important",
              minHeight: "52px !important",
              boxSizing: "border-box",
              padding: "0 14px !important",
              display: "flex",
              alignItems: "center",
              fontSize: "11.5px",
              fontWeight: 500,
              lineHeight: "normal",
            },

            "& .MuiInputAdornment-root": {
              height: "52px",
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            },

            "& .MuiIconButton-root": {
              width: 44,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },

            "& .MuiSvgIcon-root": {
              fontSize: 20,
            },

            "& .MuiInputLabel-root": {
              fontSize: "11.5px",
            },
          },
        },
      }}
    />
  </LocalizationProvider>
</Box>

            {/* ======================================
                REASON
            ====================================== */}

            <TextField
              label="Reason for Visit"

              name="reason"

              required

              value={
                formData.reason || ""
              }

             onChange={(e) => {
  handleInputChange(e);

  if (e.target.value.trim()) {
    setErrors((prev) => ({
      ...prev,
      reason: undefined,
    }));
  }
}}

              fullWidth

              error={
                !!errors?.reason
              }

              helperText={
                errors?.reason ||
                `${
                  formData.reason?.length ||
                  0
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
    backgroundColor: "background.paper",

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

  "& .MuiFormHelperText-root": {
    textAlign: errors?.reason ? "left" : "right",
    fontSize: "8.5px",
  },
}}
            />

            {/* ======================================
                SOMEONE ELSE INFO
            ====================================== */}

            {bookingFor === "other" && (
              <Box
                sx={{
                  p: 1.3,

                  borderRadius: 2,

                  border: "1px solid",

                  borderColor:
                    "divider",

                  backgroundColor:
                    "background.default",
                }}
              >
                <Typography
                  sx={{
                    mb: 1.2,

                    fontSize: "11px",

                    fontWeight: 700,

                    color:
                      "text.primary",
                  }}
                >
                  Patient Information
                </Typography>

                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns:
                      {
                        xs: "1fr",

                        sm: "repeat(2,minmax(0,1fr))",
                      },

                    gap: 1.2,
                  }}
                >
                  {/* NAME */}

                  <TextField
                    label="Full Name"

                    name="name"

                    required

                    value={
                      formData.name ||
                      ""
                    }

                    onChange={
                      handleInputChange
                    }

                    fullWidth

                    error={
                      !!errors?.name
                    }

                    helperText={
                      errors?.name
                    }

                    sx={
                      compactFieldSx
                    }
                  />

                  {/* EMAIL */}

                  <TextField
                    label="Email Address"

                    name="email"

                    type="email"

                    required

                    value={
                      formData.email ||
                      ""
                    }

                    onChange={
                      handleInputChange
                    }

                    fullWidth

                    error={
                      !!errors?.email
                    }

                    helperText={
                      errors?.email
                    }

                    sx={
                      compactFieldSx
                    }
                  />

                  {/* MOBILE */}

                  <TextField
                    label="Mobile Number"

                    name="mobile"

                    required

                    value={
                      formData.mobile ||
                      ""
                    }

                    onChange={
                      handleInputChange
                    }

                    fullWidth

                    error={
                      !!errors?.mobile
                    }

                    helperText={
                      errors?.mobile
                    }

                    sx={
                      compactFieldSx
                    }

                    inputProps={{
                      inputMode:
                        "numeric",

                      maxLength: 10,
                    }}
                  />

                  {/* GENDER */}

                  <TextField
                    select

                    label="Gender"

                    name="gender"

                    required

                    value={
                      formData.gender ||
                      ""
                    }

                    onChange={
                      handleInputChange
                    }

                    fullWidth

                    error={
                      !!errors?.gender
                    }

                    helperText={
                      errors?.gender
                    }

                    sx={
                      compactFieldSx
                    }
                  >
                    <MenuItem
                      value="Male"
                      sx={{
                        fontSize:
                          "11px",
                      }}
                    >
                      Male
                    </MenuItem>

                    <MenuItem
                      value="Female"
                      sx={{
                        fontSize:
                          "11px",
                      }}
                    >
                      Female
                    </MenuItem>

                    <MenuItem
                      value="Other"
                      sx={{
                        fontSize:
                          "11px",
                      }}
                    >
                      Other
                    </MenuItem>
                  </TextField>

                  {/* AGE */}

                  <TextField
                    label="Age"

                    name="age"

                    type="number"

                    required

                    value={
                      formData.age ||
                      ""
                    }

                    onChange={
                      handleInputChange
                    }

                    fullWidth

                    error={
                      !!errors?.age
                    }

                    helperText={
                      errors?.age
                    }

                    sx={
                      compactFieldSx
                    }

                    inputProps={{
                      min: 1,
                      max: 120,
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* ======================================
                TIME SLOTS
            ====================================== */}

            <Box
              sx={{
                pt: 0.2,
                pb: 0.5,
              }}
            >
              <TimeSlots
                selectedDate={
                  selectedDate
                }

                selectedSlot={
                  selectedSlot
                }

                setSelectedSlot={
                  setSelectedSlot
                }

                filteredSlots={
                  filteredSlots
                }

                errors={errors}

                setErrors={
                  setErrors
                }
              />
            </Box>
          </Box>

          {/* ========================================
              FIXED BOTTOM BUTTON
          ======================================== */}

          <Box
            sx={{
              flexShrink: 0,

              px: 0.5,

              pt: 1,
              pb: 0.5,

              backgroundColor:
                "background.paper",

              borderTop:
                "1px solid",

              borderColor:
                "divider",
            }}
          >
            <Button
              fullWidth

              type="button"

              variant="contained"

              disabled={
                bookingLoading
              }

              onClick={handleValidatedBooking}

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

                textTransform:
                  "none",

                fontSize:
                  "11.5px",

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

                textAlign:
                  "center",

                fontSize: "8px",

                color:
                  "text.secondary",
              }}
            >
              By booking, you agree to our terms and cancellation policy.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AppointmentForm;