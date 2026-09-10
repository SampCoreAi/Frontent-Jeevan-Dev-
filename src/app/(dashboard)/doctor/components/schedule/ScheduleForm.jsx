"use client";

import React, { useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import dayjs from "dayjs";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTheme } from "@mui/material/styles";

import {
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  MenuItem,
} from "@mui/material";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRIMARY_COLOR = "#1E6658";
const TEXT_COLOR = "#000";
const BORDER_COLOR = "#777";
const WHITE = "#fff";

export default function ScheduleForm({
  onSave,
  formData,
  setFormData,
  editIndex,
  setEditIndex,
  hospitals,
    availability = [],
}) {
  const themes = useTheme();
  const theme = themes.palette;
  const dayMap = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};

const availableDays = availability
  .map((item) => dayMap[item.day])
  .filter(Boolean);

useEffect(() => {
  if (!availability || availability.length === 0) {
    return;
  }

  const daysFromAvailability = availability
    .map((item) => dayMap[item.day])
    .filter(Boolean);

  setFormData((prev) => ({
    ...prev,
    activeDays: daysFromAvailability,
  }));
}, [availability]);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const slotDurationRef = useRef(null);
  const breakDurationRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  const handleEnter = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef?.current?.focus();
    }
  };

  const handleLocationChange = (selectedHospitalName) => {
    const selectedHospital = hospitals.find(
      (hospital) => hospital.hospitalName === selectedHospitalName
    );

    const hospitalAddress = selectedHospital
      ? {
          hospitalName: selectedHospital.hospitalName,
          landmark: selectedHospital.landmark,
          city: selectedHospital.city,
          state: selectedHospital.state,
        }
      : null;

    setFormData({
      ...formData,
      location: selectedHospitalName,
      address: hospitalAddress,
    });
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

const handleSave = async () => {
  const success = await onSave(
    formData,
    editIndex
  );

  if (!success) {
    return;
  }

  setEditIndex(null);
  setFormData(EMPTY_FORM);
};

  // ============================================================
  // COMMON TEXT FIELD STYLE
  // ============================================================

  const commonTextFieldSx = {
    "& .MuiInputBase-input": {
      color: TEXT_COLOR,
    },

    "& .MuiInputLabel-root": {
      color: TEXT_COLOR,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: PRIMARY_COLOR,
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: BORDER_COLOR,
        borderWidth: "1px",
      },

      "&:hover fieldset": {
        borderColor: PRIMARY_COLOR,
      },

      "&.Mui-focused fieldset": {
        borderColor: PRIMARY_COLOR,
        borderWidth: "2px",
      },
    },

    // Remove browser autofill blue
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #fff inset",
      WebkitTextFillColor: TEXT_COLOR,
      caretColor: TEXT_COLOR,
    },
  };

  // ============================================================
  // TIME PICKER INPUT STYLE
  // ============================================================

  const timePickerInputSx = {
    ...commonTextFieldSx,

    // Clock icon
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },

    "& .MuiIconButton-root": {
      color: PRIMARY_COLOR,
    },

    "& .MuiIconButton-root:hover": {
      color: PRIMARY_COLOR,
      backgroundColor: "rgba(30, 102, 88, 0.08)",
    },

    // All icons
    "& .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },
  };

  // ============================================================
  // TIME PICKER POPUP STYLE
  // ============================================================

  const timePickerPopupSx = {
    // ----------------------------------------------------------
    // Paper
    // ----------------------------------------------------------

    "& .MuiPaper-root": {
      backgroundColor: WHITE,
    },

    // ----------------------------------------------------------
    // Toolbar
    // ----------------------------------------------------------

    "& .MuiPickersToolbar-root": {
      backgroundColor: WHITE,
      color: TEXT_COLOR,
    },

    "& .MuiPickersToolbarText-root": {
      color: TEXT_COLOR,
    },

    // SELECTED HOUR / MINUTE / AM-PM
    "& .MuiPickersToolbarText-root.Mui-selected": {
      color: `${PRIMARY_COLOR} !important`,
    },

    // Old picker toolbar selectors
    "& .MuiTimePickerToolbar-hourMinuteLabel .MuiTypography-root": {
      color: TEXT_COLOR,
    },

    "& .MuiTimePickerToolbar-hourMinuteLabel .Mui-selected": {
      color: `${PRIMARY_COLOR} !important`,
    },

    "& .MuiTimePickerToolbar-ampmSelection .MuiTypography-root": {
      color: TEXT_COLOR,
    },

    "& .MuiTimePickerToolbar-ampmSelection .Mui-selected": {
      color: `${PRIMARY_COLOR} !important`,
    },

    // ----------------------------------------------------------
    // DIGITAL CLOCK / TIME COLUMNS
    // ----------------------------------------------------------

    // Normal numbers
    "& .MuiMultiSectionDigitalClock-root": {
      color: TEXT_COLOR,
    },

    "& .MuiMultiSectionDigitalClockSection-root": {
      color: TEXT_COLOR,
    },

    "& .MuiMultiSectionDigitalClockSection-item": {
      color: TEXT_COLOR,
    },

    // Selected hour/minute/AM/PM
    "& .MuiMultiSectionDigitalClockSection-item.Mui-selected": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    "& .MuiMultiSectionDigitalClockSection-item[aria-selected='true']": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    // Hover
    "& .MuiMultiSectionDigitalClockSection-item:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
      color: TEXT_COLOR,
    },

    "& .MuiMultiSectionDigitalClockSection-item.Mui-selected:hover": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    // ----------------------------------------------------------
    // OLD CLOCK PICKER SUPPORT
    // ----------------------------------------------------------

    "& .MuiPickersClock-root": {
      backgroundColor: WHITE,
    },

    "& .MuiPickersClockNumber-root": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersClockNumber-root.Mui-selected": {
      backgroundColor: PRIMARY_COLOR,
      color: `${WHITE} !important`,
    },

    "& .MuiPickersClockNumber-root:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
    },

    // Clock pointer
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

    // ----------------------------------------------------------
    // BUTTONS
    // ----------------------------------------------------------

    "& .MuiDialogActions-root button": {
      color: `${PRIMARY_COLOR} !important`,
    },

    "& .MuiPickersLayout-actionBar button": {
      color: `${PRIMARY_COLOR} !important`,
    },

    "& .MuiButton-root": {
      color: PRIMARY_COLOR,
    },

    "& .MuiButton-root:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
      color: PRIMARY_COLOR,
    },

    // ----------------------------------------------------------
    // ICONS
    // ----------------------------------------------------------

    "& .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },

    "& .MuiIconButton-root": {
      color: PRIMARY_COLOR,
    },

    "& .MuiIconButton-root:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
      color: PRIMARY_COLOR,
    },

    // ----------------------------------------------------------
    // FOCUS
    // ----------------------------------------------------------

    "& .MuiButtonBase-root:focus": {
      outline: "none",
    },

    "& .MuiButtonBase-root.Mui-focusVisible": {
      outline: `2px solid ${PRIMARY_COLOR}`,
      outlineOffset: "-2px",
    },
  };

  // ============================================================
  // DATE PICKER POPUP STYLE
  // ============================================================

  const datePickerPopupSx = {
    "& .MuiPaper-root": {
      backgroundColor: WHITE,
    },

    // Calendar header
    "& .MuiPickersCalendarHeader-root": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersCalendarHeader-label": {
      color: TEXT_COLOR,
      fontWeight: 600,
    },

    // Month / year buttons
    "& .MuiPickersCalendarHeader-switchViewButton": {
      color: PRIMARY_COLOR,
    },

    "& .MuiPickersCalendarHeader-switchViewButton:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
    },

    // Previous / next arrows
    "& .MuiPickersArrowSwitcher-button": {
      color: PRIMARY_COLOR,
    },

    "& .MuiPickersArrowSwitcher-button:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
    },

    // Week days
    "& .MuiDayCalendar-weekDayLabel": {
      color: TEXT_COLOR,
    },

    // Normal days
    "& .MuiPickersDay-root": {
      color: TEXT_COLOR,
    },

    // Selected date
    "& .MuiPickersDay-root.Mui-selected": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    "& .MuiPickersDay-root.Mui-selected:hover": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    // Today
    "& .MuiPickersDay-root.MuiPickersDay-today": {
      borderColor: PRIMARY_COLOR,
    },

    // Today / Clear
    "& .MuiPickersLayout-actionBar button": {
      color: `${PRIMARY_COLOR} !important`,
    },

    // Calendar icons
    "& .MuiSvgIcon-root": {
      color: PRIMARY_COLOR,
    },

    // Focus
    "& .MuiButtonBase-root:focus": {
      outline: "none",
    },

    "& .MuiButtonBase-root.Mui-focusVisible": {
      outline: `2px solid ${PRIMARY_COLOR}`,
      outlineOffset: "-2px",
    },

    // Selected month/year in month/year view
    "& .MuiPickersMonth-monthButton.Mui-selected": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    "& .MuiPickersYear-yearButton.Mui-selected": {
      backgroundColor: `${PRIMARY_COLOR} !important`,
      color: `${WHITE} !important`,
    },

    // Month/year normal text
    "& .MuiPickersMonth-monthButton": {
      color: TEXT_COLOR,
    },

    "& .MuiPickersYear-yearButton": {
      color: TEXT_COLOR,
    },

    // Month/year hover
    "& .MuiPickersMonth-monthButton:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
    },

    "& .MuiPickersYear-yearButton:hover": {
      backgroundColor: "rgba(30, 102, 88, 0.08)",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid
        container
        spacing={2}
        sx={{
          boxShadow: `0 4px 12px ${PRIMARY_COLOR}`,
          p: 2,
          pt: 4,
          borderRadius: 1,
        }}
      >
        {/* ======================================================
            LOCATION
        ====================================================== */}

        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            select
            fullWidth
            label="Hospital Name"
            value={formData.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            InputLabelProps={{
              style: {
                color: TEXT_COLOR,
              },
            }}
            sx={commonTextFieldSx}
          >
            {hospitals.length === 0 && (
              <MenuItem disabled>
                No hospitals found
              </MenuItem>
            )}

            {hospitals.map((hospital, index) => (
              <MenuItem
                key={index}
                value={hospital.hospitalName}
              >
                {hospital.hospitalName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* ======================================================
            START TIME
        ====================================================== */}

        <Grid size={{ xs: 6, sm: 3 }}>
          <TimePicker
            ampm={true}
            label="Start Time"
            value={
              formData.startTime
                ? dayjs(formData.startTime, "h:mm A")
                : null
            }
            onChange={(newValue) =>
              setFormData({
                ...formData,
                startTime: newValue
                  ? newValue.format("h:mm A")
                  : "",
              })
            }
            slotProps={{
              textField: {
                fullWidth: true,
                inputRef: startTimeRef,
                onKeyDown: (e) =>
                  handleEnter(e, endTimeRef),
                sx: timePickerInputSx,
              },

              popper: {
                sx: timePickerPopupSx,
              },

              desktopPaper: {
                sx: timePickerPopupSx,
              },

              mobilePaper: {
                sx: timePickerPopupSx,
              },

              layout: {
                sx: timePickerPopupSx,
              },
            }}
          />
        </Grid>

        {/* ======================================================
            END TIME
        ====================================================== */}

        <Grid size={{ xs: 6, sm: 3 }}>
          <TimePicker
            ampm={true}
            label="End Time"
            value={
              formData.endTime
                ? dayjs(formData.endTime, "h:mm A")
                : null
            }
            onChange={(newValue) =>
              setFormData({
                ...formData,
                endTime: newValue
                  ? newValue.format("h:mm A")
                  : "",
              })
            }
            slotProps={{
              textField: {
                fullWidth: true,
                inputRef: endTimeRef,
                onKeyDown: (e) =>
                  handleEnter(e, slotDurationRef),
                sx: timePickerInputSx,
              },

              popper: {
                sx: timePickerPopupSx,
              },

              desktopPaper: {
                sx: timePickerPopupSx,
              },

              mobilePaper: {
                sx: timePickerPopupSx,
              },

              layout: {
                sx: timePickerPopupSx,
              },
            }}
          />
        </Grid>

        {/* ======================================================
            SLOT DURATION
        ====================================================== */}

        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            type="number"
            fullWidth
            label="Slot Duration (min)"
            value={formData.slotDuration}
            onChange={(e) =>
              setFormData({
                ...formData,
                slotDuration: e.target.value,
              })
            }
            InputLabelProps={{
              style: {
                color: TEXT_COLOR,
              },
            }}
            inputRef={slotDurationRef}
            onKeyDown={(e) =>
              handleEnter(e, breakDurationRef)
            }
            sx={commonTextFieldSx}
          />
        </Grid>

        {/* ======================================================
            BREAK DURATION
        ====================================================== */}

        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            type="number"
            fullWidth
            label="Break Duration (min)"
            value={formData.breakDuration}
            onChange={(e) =>
              setFormData({
                ...formData,
                breakDuration: e.target.value,
              })
            }
            InputLabelProps={{
              style: {
                color: TEXT_COLOR,
              },
            }}
            inputRef={breakDurationRef}
            onKeyDown={(e) =>
              handleEnter(e, startDateRef)
            }
            sx={commonTextFieldSx}
          />
        </Grid>

        {/* ======================================================
            START DATE
        ====================================================== */}

        <Grid size={{ xs: 6, sm: 3 }}>
          <DatePicker
            label="Start Date"
            format="DD-MM-YYYY"
            value={
              formData.startDate
                ? dayjs(formData.startDate)
                : null
            }
            onChange={(newValue) =>
              setFormData({
                ...formData,
                startDate: newValue
                  ? newValue.format("YYYY-MM-DD")
                  : "",
              })
            }
            slotProps={{
              textField: {
                fullWidth: true,
                inputRef: startDateRef,
                onKeyDown: (e) =>
                  handleEnter(e, endDateRef),
                sx: {
                  ...commonTextFieldSx,

                  "& .MuiInputAdornment-root .MuiSvgIcon-root":
                    {
                      color: PRIMARY_COLOR,
                    },

                  "& .MuiIconButton-root": {
                    color: PRIMARY_COLOR,
                  },

                  "& .MuiIconButton-root:hover": {
                    color: PRIMARY_COLOR,
                    backgroundColor:
                      "rgba(30, 102, 88, 0.08)",
                  },

                  "& .MuiSvgIcon-root": {
                    color: PRIMARY_COLOR,
                  },
                },
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

        {/* ======================================================
            END DATE
        ====================================================== */}

        <Grid size={{ xs: 6, sm: 3 }}>
          <DatePicker
            label="End Date"
            format="DD-MM-YYYY"
            value={
              formData.endDate
                ? dayjs(formData.endDate)
                : null
            }
            onChange={(newValue) =>
              setFormData({
                ...formData,
                endDate: newValue
                  ? newValue.format("YYYY-MM-DD")
                  : "",
              })
            }
            slotProps={{
              textField: {
                fullWidth: true,
                inputRef: endDateRef,
                sx: {
                  ...commonTextFieldSx,

                  "& .MuiInputAdornment-root .MuiSvgIcon-root":
                    {
                      color: PRIMARY_COLOR,
                    },

                  "& .MuiIconButton-root": {
                    color: PRIMARY_COLOR,
                  },

                  "& .MuiIconButton-root:hover": {
                    color: PRIMARY_COLOR,
                    backgroundColor:
                      "rgba(30, 102, 88, 0.08)",
                  },

                  "& .MuiSvgIcon-root": {
                    color: PRIMARY_COLOR,
                  },
                },
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

        {/* ======================================================
            OFFLINE PATIENT NUMBER
        ====================================================== */}

      

        {/* ======================================================
            ACTIVE DAYS
        ====================================================== */}

    <Grid size={12}>
  <Typography fontWeight={600}>
    Active Days
  </Typography>

  <Stack
    direction="row"
    gap={1}
    flexWrap="wrap"
    mt={1}
  >
    {daysOfWeek.map((day) => {
      const isSelected =
        formData.activeDays.includes(day);

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
            if (!isAvailable) return;

            setFormData({
              ...formData,
              activeDays: isSelected
                ? formData.activeDays.filter(
                    (d) => d !== day
                  )
                : [
                    ...formData.activeDays,
                    day,
                  ],
            });
          }}
          sx={{
            width: 100,

            color: isSelected
              ? WHITE
              : isAvailable
                ? PRIMARY_COLOR
                : "#aaa",

            bgcolor: isSelected
              ? PRIMARY_COLOR
              : isAvailable
                ? "transparent"
                : "#f5f5f5",

            borderColor: isAvailable
              ? PRIMARY_COLOR
              : "#ddd",

            "&:hover": {
              bgcolor: isSelected
                ? PRIMARY_COLOR
                : isAvailable
                  ? "rgba(30, 102, 88, 0.08)"
                  : "#f5f5f5",

              borderColor: isAvailable
                ? PRIMARY_COLOR
                : "#ddd",
            },

            "&.Mui-disabled": {
              color: "#aaa",
              borderColor: "#ddd",
              backgroundColor: "#f5f5f5",
            },

            textTransform: "none",
            minWidth: 36,
            px: 1.5,
          }}
        >
          {day}
        </Button>
      );
    })}
  </Stack>
</Grid>

        {/* ======================================================
            DIVIDER
        ====================================================== */}

        <Grid size={12}>
          <Divider />
        </Grid>

        {/* ======================================================
            SAVE BUTTON
        ====================================================== */}

        <Grid size={12}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: PRIMARY_COLOR,

              "&:hover": {
                backgroundColor: PRIMARY_COLOR,
              },

              "&:focus": {
                outline: "none",
              },

              "&.Mui-focusVisible": {
                outline: `2px solid ${PRIMARY_COLOR}`,
                outlineOffset: "2px",
              },

              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {editIndex !== null
              ? "Update Schedule"
              : "Save Schedule"}
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}