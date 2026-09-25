"use client";

import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dayMap = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

const EMPTY_FORM = {
  location: "",
  hospitalId: null,
  startTime: "",
  endTime: "",
  slotDuration: "",
  breakDuration: "",
  startDate: "",
  endDate: "",
  activeDays: [],
  note: "",
  address: null,
};

export default function ScheduleForm({
  onSave,
  formData,
  setFormData,
  editIndex,
  setEditIndex,
  hospitals = [],
  availability = [],
  loading = false,
}) {
  const muiTheme = useTheme();

  const PRIMARY_COLOR = muiTheme.palette.primary.main;
  const TEXT_COLOR = muiTheme.palette.text.primary;
  const SECONDARY_TEXT = muiTheme.palette.text.secondary;
  const PAPER_COLOR = muiTheme.palette.background.paper;
  const BACKGROUND_COLOR = muiTheme.palette.background.default;
  const DIVIDER_COLOR = muiTheme.palette.divider;
  const ERROR_COLOR = muiTheme.palette.error.main;

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const slotDurationRef = useRef(null);
  const breakDurationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // ============================================================
  // AVAILABLE DAYS
  // ============================================================

  const availableDays = Array.isArray(availability)
    ? availability
        .map((item) => dayMap[item?.day])
        .filter(Boolean)
    : [];

  // ============================================================
  // ACTIVE DAYS FROM AVAILABILITY
  // Redux-safe: function payload nahi bhejna
  // ============================================================

  useEffect(() => {
    if (!Array.isArray(availability) || availability.length === 0) {
      return;
    }

    const daysFromAvailability = availability
      .map((item) => dayMap[item?.day])
      .filter(Boolean);

    setFormData({
      ...formData,
      activeDays: daysFromAvailability,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability]);

  // ============================================================
  // DEFAULT HOSPITAL
  // Agar already selected nahi hai to first hospital select hoga
  // ============================================================

  useEffect(() => {
    if (!Array.isArray(hospitals) || hospitals.length === 0) {
      return;
    }

    // Existing/edit selection ko overwrite nahi karna
    if (formData?.location) {
      return;
    }

    const firstHospital = hospitals[0];

    if (!firstHospital?.hospitalName) {
      return;
    }

    const hospitalId =
      firstHospital?.hospitalId ??
      firstHospital?.id ??
      firstHospital?._id ??
      null;

    const hospitalAddress = {
      hospitalName: firstHospital?.hospitalName || "",
      landmark: firstHospital?.landmark || "",
      city: firstHospital?.city || "",
      state: firstHospital?.state || "",
    };

    setFormData({
      ...formData,
      location: firstHospital.hospitalName,
      hospitalId,
      address: hospitalAddress,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitals]);

  // ============================================================
  // CLEAR ERROR
  // ============================================================

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const updatedErrors = { ...prev };
      delete updatedErrors[field];

      return updatedErrors;
    });

    setSubmitError("");
  };

  // ============================================================
  // UPDATE FIELD
  // ============================================================

  const updateField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    clearError(field);
  };

  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus?.();
    }
  };

  // ============================================================
  // HOSPITAL CHANGE
  // ============================================================

  const handleLocationChange = (selectedHospitalName) => {
    const selectedHospital = hospitals.find(
      (hospital) => hospital?.hospitalName === selectedHospitalName
    );

    const hospitalAddress = selectedHospital
      ? {
          hospitalName: selectedHospital?.hospitalName || "",
          landmark: selectedHospital?.landmark || "",
          city: selectedHospital?.city || "",
          state: selectedHospital?.state || "",
        }
      : null;

    const hospitalId =
      selectedHospital?.hospitalId ??
      selectedHospital?.id ??
      selectedHospital?._id ??
      null;

    setFormData({
      ...formData,
      location: selectedHospitalName,
      hospitalId,
      address: hospitalAddress,
    });

    clearError("location");
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.location?.trim()) {
      newErrors.location = "Hospital is required.";
    }


    if (formData?.startTime && formData?.endTime) {
      const start = dayjs(formData.startTime, "h:mm A");
      const end = dayjs(formData.endTime, "h:mm A");

      if (!start.isValid()) {
        newErrors.startTime = "Invalid start time.";
      }

      if (!end.isValid()) {
        newErrors.endTime = "Invalid end time.";
      }

      if (
        start.isValid() &&
        end.isValid() &&
        !end.isAfter(start)
      ) {
        newErrors.endTime =
          "End time must be after start time.";
      }
    }

    if (
      formData?.slotDuration === "" ||
      formData?.slotDuration === null ||
      formData?.slotDuration === undefined
    ) {
      newErrors.slotDuration =
        "Slot duration is required.";
    } else {
      const slot = Number(formData.slotDuration);

      if (!Number.isFinite(slot) || slot <= 0) {
        newErrors.slotDuration =
          "Slot duration must be greater than 0.";
      } else if (!Number.isInteger(slot)) {
        newErrors.slotDuration =
          "Slot duration must be a whole number.";
      }
    }

    if (
      formData?.breakDuration !== "" &&
      formData?.breakDuration !== null &&
      formData?.breakDuration !== undefined
    ) {
      const breakDuration = Number(
        formData.breakDuration
      );

      if (
        !Number.isFinite(breakDuration) ||
        breakDuration < 0
      ) {
        newErrors.breakDuration =
          "Break duration cannot be negative.";
      } else if (!Number.isInteger(breakDuration)) {
        newErrors.breakDuration =
          "Break duration must be a whole number.";
      }
    }

    if (!formData?.startDate) {
      newErrors.startDate =
        "Start date is required.";
    }

    if (!formData?.endDate) {
      newErrors.endDate =
        "End date is required.";
    }

    const startDate = formData?.startDate
      ? dayjs(formData.startDate).startOf("day")
      : null;

    const endDate = formData?.endDate
      ? dayjs(formData.endDate).startOf("day")
      : null;

    const today = dayjs().startOf("day");

    if (startDate && !startDate.isValid()) {
      newErrors.startDate = "Invalid start date.";
    }

    if (endDate && !endDate.isValid()) {
      newErrors.endDate = "Invalid end date.";
    }

    if (
      editIndex === null &&
      startDate?.isValid() &&
      startDate.isBefore(today)
    ) {
      newErrors.startDate =
        "Start date cannot be in the past.";
    }

    if (
      startDate?.isValid() &&
      endDate?.isValid() &&
      endDate.isBefore(startDate)
    ) {
      newErrors.endDate =
        "End date cannot be before start date.";
    }

    if (
      !Array.isArray(formData?.activeDays) ||
      formData.activeDays.length === 0
    ) {
      newErrors.activeDays =
        "Select at least one active day.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async () => {
    setSubmitError("");

    const valid = validateForm();

    if (!valid) {
      setSubmitError(
        "Please correct the highlighted fields before saving."
      );
      return;
    }

    try {
      const payload = {
        ...formData,

        slotDuration: Number(
          formData.slotDuration
        ),

        breakDuration:
          formData.breakDuration === "" ||
          formData.breakDuration === null ||
          formData.breakDuration === undefined
            ? 0
            : Number(formData.breakDuration),
      };

      const success = await onSave(
        payload,
        editIndex
      );

      if (!success) {
        return;
      }

      setErrors({});
      setSubmitError("");
      setEditIndex(null);
      setFormData(EMPTY_FORM);
    } catch (error) {
      console.error(
        "Schedule save error:",
        error
      );

      setSubmitError(
        "Unable to save schedule. Please try again."
      );
    }
  };

  // ============================================================
  // FIELD STYLES
  // Sab fields same height
  // ============================================================

  const FIELD_HEIGHT = 48;

const commonTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 48,
    minHeight: 48,
    borderRadius: "7px",
    backgroundColor: PAPER_COLOR,
    display: "flex",
    alignItems: "center",

    "& fieldset": {
      borderColor: DIVIDER_COLOR,
      borderWidth: "1px",
    },

    "&:hover fieldset": {
      borderColor: PRIMARY_COLOR,
    },

    "&.Mui-focused fieldset": {
      borderColor: PRIMARY_COLOR,
      borderWidth: "1px",
    },

    "&.Mui-error fieldset": {
      borderColor: ERROR_COLOR,
    },
  },

  // Normal input text center
  "& .MuiInputBase-input": {
    height: "48px",
    boxSizing: "border-box",
    padding: "0 14px !important",
    display: "flex",
    alignItems: "center",
    fontSize: "12.5px",
    lineHeight: "48px",
    color: TEXT_COLOR,
  },

  // Date / Time picker main root
  "& .MuiPickersInputBase-root": {
    height: 48,
    minHeight: 48,
    display: "flex",
    alignItems: "center",
    borderRadius: "7px",
    backgroundColor: PAPER_COLOR,
  },

  // Date / Time actual text section
  "& .MuiPickersSectionList-root": {
    height: "48px",
    minHeight: "48px",
    boxSizing: "border-box",
    padding: "0 14px !important",
    display: "flex",
    alignItems: "center",
  },

  "& .MuiPickersInputBase-sectionsContainer": {
    height: "48px",
    display: "flex",
    alignItems: "center",
  },

  // Select / Hospital text center
  "& .MuiSelect-select": {
    height: "48px !important",
    minHeight: "48px !important",
    boxSizing: "border-box",
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
    display: "flex",
    alignItems: "center",
    fontSize: "12.5px",
  },

  // Icons center
  "& .MuiInputAdornment-root": {
    height: "48px",
    maxHeight: "48px",
    display: "flex",
    alignItems: "center",
  },

  // IMPORTANT: empty field ka label vertically center
  "& .MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
    top: "50%",
    transform: "translate(14px, -50%) scale(1)",
    transformOrigin: "top left",
  },

  // Filled/focused label normal MUI position
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    top: 0,
    transform: "translate(14px, -9px) scale(0.75)",
  },

  "& .MuiInputLabel-root": {
    fontSize: "12.5px",
    color: SECONDARY_TEXT,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: PRIMARY_COLOR,
  },

  "& .MuiFormHelperText-root": {
    marginLeft: "3px",
    mt: "3px",
    fontSize: "10.5px",
    lineHeight: 1.2,
  },
};

  const hospitalFieldSx = {
    ...commonTextFieldSx,
  };

  const normalFieldSx = {
    ...commonTextFieldSx,
  };

  const timeFieldSx = {
    ...commonTextFieldSx,

    "& .MuiIconButton-root": {
      color: PRIMARY_COLOR,
      p: 0.7,
    },

    "& .MuiSvgIcon-root": {
      fontSize: "19px",
    },
  };

  const dateFieldSx = {
    ...commonTextFieldSx,

    "& .MuiIconButton-root": {
      color: PRIMARY_COLOR,
      p: 0.7,
    },

    "& .MuiSvgIcon-root": {
      fontSize: "19px",
    },
  };

  // ============================================================
  // TIME PICKER POPUP
  // ============================================================

  const timePickerPopupSx = {
    "& .MuiPaper-root": {
      backgroundColor: PAPER_COLOR,
      borderRadius: "10px",
    },

    "& .MuiPickersToolbar-root": {
      backgroundColor: PAPER_COLOR,
      color: TEXT_COLOR,
    },

    "& .MuiPickersToolbarText-root": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersToolbarText-root.Mui-selected": {
      color: `${PRIMARY_COLOR} !important`,
    },

    "& .MuiTimePickerToolbar-hourMinuteLabel .MuiTypography-root":
      {
        color: TEXT_COLOR,
      },

    "& .MuiTimePickerToolbar-hourMinuteLabel .Mui-selected":
      {
        color: `${PRIMARY_COLOR} !important`,
      },

    "& .MuiTimePickerToolbar-ampmSelection .MuiTypography-root":
      {
        color: TEXT_COLOR,
      },

    "& .MuiTimePickerToolbar-ampmSelection .Mui-selected":
      {
        color: `${PRIMARY_COLOR} !important`,
      },

    "& .MuiMultiSectionDigitalClockSection-item": {
      color: TEXT_COLOR,
      fontSize: "12.5px",
    },

    "& .MuiMultiSectionDigitalClockSection-item.Mui-selected":
      {
        backgroundColor: `${PRIMARY_COLOR} !important`,
        color: "#fff !important",
      },

    "& .MuiMultiSectionDigitalClockSection-item[aria-selected='true']":
      {
        backgroundColor: `${PRIMARY_COLOR} !important`,
        color: "#fff !important",
      },

    "& .MuiMultiSectionDigitalClockSection-item:hover": {
      backgroundColor: `${PRIMARY_COLOR}12`,
    },

    "& .MuiPickersClock-root": {
      backgroundColor: PAPER_COLOR,
    },

    "& .MuiPickersClockNumber-root": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersClockNumber-root.Mui-selected":
      {
        backgroundColor: PRIMARY_COLOR,
        color: "#fff !important",
      },

    "& .MuiPickersClockPointer-root": {
      backgroundColor: PRIMARY_COLOR,
    },

    "& .MuiPickersClockPointer-thumb": {
      backgroundColor: PRIMARY_COLOR,
      borderColor: PRIMARY_COLOR,
    },

    "& .MuiPickersClockPointer-noPoint": {
      backgroundColor: PRIMARY_COLOR,
    },

    "& .MuiDialogActions-root button": {
      color: `${PRIMARY_COLOR} !important`,
    },

    "& .MuiPickersLayout-actionBar button": {
      color: `${PRIMARY_COLOR} !important`,
    },

    "& .MuiButton-root": {
      color: `${PRIMARY_COLOR} !important`,
      fontSize: "12px",
    },

    "& .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },
  };

  // ============================================================
  // DATE PICKER POPUP
  // ============================================================

  const datePickerPopupSx = {
    "& .MuiPaper-root": {
      backgroundColor: PAPER_COLOR,
      borderRadius: "10px",
    },

    "& .MuiPickersCalendarHeader-root": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersCalendarHeader-label": {
      color: TEXT_COLOR,
      fontWeight: 600,
      fontSize: "13px",
    },

    "& .MuiPickersCalendarHeader-switchViewButton":
      {
        color: PRIMARY_COLOR,
      },

    "& .MuiPickersArrowSwitcher-button": {
      color: PRIMARY_COLOR,
    },

    "& .MuiDayCalendar-weekDayLabel": {
      color: SECONDARY_TEXT,
      fontSize: "11px",
    },

    "& .MuiPickersDay-root": {
      color: TEXT_COLOR,
      fontSize: "12px",
    },

    "& .MuiPickersDay-root.Mui-selected": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: "#fff !important",
    },

    "& .MuiPickersDay-root.Mui-selected:hover": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: "#fff !important",
    },

    "& .MuiPickersDay-root.MuiPickersDay-today": {
      borderColor: PRIMARY_COLOR,
    },

    "& .MuiPickersLayout-actionBar button": {
      color: `${PRIMARY_COLOR} !important`,
      fontSize: "12px",
    },

    "& .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },

    "& .MuiPickersMonth-monthButton": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersMonth-monthButton.Mui-selected":
      {
        backgroundColor: `${PRIMARY_COLOR} !important`,
        color: "#fff !important",
      },

    "& .MuiPickersYear-yearButton": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersYear-yearButton.Mui-selected":
      {
        backgroundColor: `${PRIMARY_COLOR} !important`,
        color: "#fff !important",
      },
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: "100%",
          backgroundColor: PAPER_COLOR,
          border: `1px solid ${DIVIDER_COLOR}`,
          borderRadius: "10px",
          p: {
            xs: 1.5,
            sm: 2,
          },
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 1.6,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: TEXT_COLOR,
              }}
            >
              {editIndex !== null
                ? "Update Schedule"
                : "Create Schedule"}
            </Typography>

            <Typography
              sx={{
                fontSize: "11.5px",
                color: SECONDARY_TEXT,
                mt: 0.3,
              }}
            >
              Set hospital, consultation time and active
              days.
            </Typography>
          </Box>

         <Button
  onClick={handleSave}
  variant="contained"
  disabled={loading}
  startIcon={
    loading ? (
      <CircularProgress
        size={15}
        thickness={5}
        sx={{ color: "inherit" }}
      />
    ) : null
  }
  sx={{
    flexShrink: 0,
    height: 36,
    minWidth: {
      xs: 105,
      sm: 135,
    },
    px: {
      xs: 1.5,
      sm: 2.5,
    },
    borderRadius: "7px",
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    textTransform: "none",
    fontSize: "12px",
    fontWeight: 600,
    boxShadow: "none",

    "&:hover": {
      backgroundColor: PRIMARY_COLOR,
      boxShadow: "none",
      opacity: 0.92,
    },

    "&.Mui-disabled": {
      backgroundColor: PRIMARY_COLOR,
      color: "#fff",
      opacity: 0.7,
    },
  }}
>
  {loading
    ? editIndex !== null
      ? "Updating..."
      : "Saving..."
    : editIndex !== null
      ? "Update Schedule"
      : "Save Schedule"}
</Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* ERROR */}

        {submitError && (
          <Alert
            severity="error"
            sx={{
              mb: 1.5,
              py: 0.2,
              borderRadius: "7px",
              fontSize: "11.5px",

              "& .MuiAlert-message": {
                py: 0.5,
              },
            }}
          >
            {submitError}
          </Alert>
        )}

        {/* FORM */}

        <Grid container spacing={1.5}>
          {/* HOSPITAL */}

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Hospital Name"
              value={formData?.location || ""}
              onChange={(e) =>
                handleLocationChange(e.target.value)
              }
              error={Boolean(errors.location)}
              helperText={errors.location}
              sx={hospitalFieldSx}
            >
              {hospitals.length === 0 ? (
                <MenuItem
                  disabled
                  sx={{ fontSize: "12.5px" }}
                >
                  No hospitals found
                </MenuItem>
              ) : (
                hospitals.map((hospital, index) => (
                  <MenuItem
                    key={
                      hospital?.id ??
                      hospital?._id ??
                      hospital?.hospitalId ??
                      index
                    }
                    value={
                      hospital?.hospitalName || ""
                    }
                    sx={{ fontSize: "12.5px" }}
                  >
                    {hospital?.hospitalName}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

      

          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <TextField
              type="number"
              fullWidth
              size="small"
              label="Slot Duration (min)"
              value={formData?.slotDuration ?? ""}
              onChange={(e) => {
                const value = e.target.value;

                if (
                  value === "" ||
                  (/^\d+$/.test(value) &&
                    Number(value) >= 0)
                ) {
                  updateField(
                    "slotDuration",
                    value
                  );
                }
              }}
              error={Boolean(
                errors.slotDuration
              )}
              helperText={errors.slotDuration}
              inputRef={slotDurationRef}
              onKeyDown={(e) =>
                handleEnter(
                  e,
                  breakDurationRef
                )
              }
              inputProps={{
                min: 1,
                step: 1,
              }}
              sx={normalFieldSx}
            />
          </Grid>

          {/* BREAK DURATION */}

          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
          <TextField
  type="number"
  fullWidth
  size="small"
  label="Break Duration (min)"
  value={formData?.breakDuration ?? ""}
  onChange={(e) => {
    const value = e.target.value;

    if (
      value === "" ||
      (/^\d+$/.test(value) && Number(value) >= 0)
    ) {
      updateField("breakDuration", value);
    }
  }}
  error={Boolean(errors.breakDuration)}
  helperText={errors.breakDuration}
  inputRef={breakDurationRef}
  onKeyDown={(e) =>
    handleEnter(e, startDateRef)
  }
  inputProps={{
    min: 0,
    step: 1,
  }}
  sx={normalFieldSx}
/>
          </Grid>

          {/* START DATE */}

          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <DatePicker
              label="Start Date"
              format="DD-MM-YYYY"
              value={
                formData?.startDate
                  ? dayjs(formData.startDate)
                  : null
              }
              minDate={
                editIndex === null
                  ? dayjs().startOf("day")
                  : undefined
              }
              onChange={(newValue) => {
                updateField(
                  "startDate",
                  newValue?.isValid()
                    ? newValue.format(
                        "YYYY-MM-DD"
                      )
                    : ""
                );

                clearError("endDate");
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  inputRef: startDateRef,
                  error: Boolean(errors.startDate),
                  helperText: errors.startDate,
                  onKeyDown: (e) =>
                    handleEnter(e, endDateRef),
                  sx: dateFieldSx,
                },

                popper: {
                  sx: datePickerPopupSx,
                },

                desktopPaper: {
                  sx: datePickerPopupSx,
                },

                mobilePaper: {
                  sx: datePickerPopupSx,
                },

                layout: {
                  sx: datePickerPopupSx,
                },
              }}
            />
          </Grid>

          {/* END DATE */}

          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <DatePicker
              label="End Date"
              format="DD-MM-YYYY"
              value={
                formData?.endDate
                  ? dayjs(formData.endDate)
                  : null
              }
              minDate={
                formData?.startDate
                  ? dayjs(formData.startDate)
                  : dayjs().startOf("day")
              }
              onChange={(newValue) => {
                updateField(
                  "endDate",
                  newValue?.isValid()
                    ? newValue.format(
                        "YYYY-MM-DD"
                      )
                    : ""
                );
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  inputRef: endDateRef,
                  error: Boolean(errors.endDate),
                  helperText: errors.endDate,
                  sx: dateFieldSx,
                },

                popper: {
                  sx: datePickerPopupSx,
                },

                desktopPaper: {
                  sx: datePickerPopupSx,
                },

                mobilePaper: {
                  sx: datePickerPopupSx,
                },

                layout: {
                  sx: datePickerPopupSx,
                },
              }}
            />
          </Grid>

          {/* ACTIVE DAYS */}

          <Grid size={12}>
            <Box
              sx={{
                mt: 0.4,
                p: 1.5,
                borderRadius: "8px",
                backgroundColor:
                  BACKGROUND_COLOR,

                border: `1px solid ${
                  errors.activeDays
                    ? ERROR_COLOR
                    : DIVIDER_COLOR
                }`,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12.5px",
                  fontWeight: 600,
                  color: errors.activeDays
                    ? ERROR_COLOR
                    : TEXT_COLOR,
                }}
              >
                Active Days
              </Typography>

              <Typography
                sx={{
                  fontSize: "10.5px",
                  color: SECONDARY_TEXT,
                  mt: 0.2,
                }}
              >
               Slots will be created only for selected days. To add more days, update Working Hours in your Profile.
              </Typography>

              <Stack
                direction="row"
                gap={0.8}
                flexWrap="wrap"
                mt={1.2}
              >
                {daysOfWeek.map((day) => {
                  const currentDays =
                    Array.isArray(
                      formData?.activeDays
                    )
                      ? formData.activeDays
                      : [];

                  const isSelected =
                    currentDays.includes(day);

                  const isAvailable =
                    availableDays.includes(day);

                  return (
                    <Button
                      key={day}
                      disabled={!isAvailable}
                      variant={
                        isSelected
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => {
                        if (!isAvailable) {
                          return;
                        }

                        const updatedDays =
                          isSelected
                            ? currentDays.filter(
                                (
                                  selectedDay
                                ) =>
                                  selectedDay !==
                                  day
                              )
                            : [
                                ...currentDays,
                                day,
                              ];

                        updateField(
                          "activeDays",
                          updatedDays
                        );
                      }}
                      sx={{
                        minWidth: 55,
                        height: 30,
                        px: 1.3,
                        borderRadius: "6px",

                        textTransform: "none",
                        fontSize: "11.5px",
                        fontWeight: 500,

                        color: isSelected
                          ? "#fff"
                          : PRIMARY_COLOR,

                        borderColor:
                          PRIMARY_COLOR,

                        backgroundColor:
                          isSelected
                            ? PRIMARY_COLOR
                            : "transparent",

                        boxShadow: "none",

                        "&:hover": {
                          backgroundColor:
                            isSelected
                              ? PRIMARY_COLOR
                              : `${PRIMARY_COLOR}0D`,

                          borderColor:
                            PRIMARY_COLOR,

                          boxShadow: "none",
                        },

                        "&.Mui-disabled": {
                          color:
                            muiTheme.palette.text
                              .disabled,

                          borderColor:
                            DIVIDER_COLOR,

                          backgroundColor:
                            muiTheme.palette.action
                              .disabledBackground,
                        },
                      }}
                    >
                      {day}
                    </Button>
                  );
                })}
              </Stack>

              {errors.activeDays && (
                <Typography
                  sx={{
                    color: ERROR_COLOR,
                    fontSize: "10.5px",
                    mt: 0.8,
                  }}
                >
                  {errors.activeDays}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
}