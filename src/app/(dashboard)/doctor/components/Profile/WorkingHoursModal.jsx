"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";

import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
const WorkingHoursModal = ({
  open,
  onClose,
  workingHours,
  onWorkingHoursChange,
}) => {
  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];
const parseTime = (timeStr) => {
  if (!timeStr) return null;
  
  const [hours, minutes] = timeStr.split(":").map(Number);
  const result = dayjs().set('hour', hours).set('minute', minutes).set('second', 0);
  
  return result;
};
const formatTime = (dateObj) => {
  if (!dateObj) return "";
  return dateObj.format("HH:mm"); // backend ke liye 24-hour
};
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm">
        <DialogTitle>Working Hours</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {days.map((day) => {
              const dayData = workingHours?.[day.key] || { start: "", end: "" };
              const isClosed = !dayData.start || !dayData.end;


              return (
                <Box
                  key={day.key}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Typography sx={{ minWidth: 80 }}>
                    {day.label}
                  </Typography>

                  {/* Start Time */}
                {/* Start Time */}
<TimePicker
  value={parseTime(dayData.start)}
  onChange={(value) =>
    onWorkingHoursChange(day.key, "start", formatTime(value))
  }
  slotProps={{ textField: { size: "small" } }}
/>

{/* End Time */}
<TimePicker
  value={parseTime(dayData.end)}
  onChange={(value) =>
    onWorkingHoursChange(day.key, "end", formatTime(value))
  }
  slotProps={{ textField: { size: "small" } }}
/>
                  
                  <Typography ml="auto">
                    {isClosed ? "Closed" : "Open"}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default WorkingHoursModal;