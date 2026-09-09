"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";

const EventDialog = ({
  open,
  event,
  onClose,
  onSave,
  onDelete,
  departments = [],
  doctors = [],
}) => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    title: "",
    date: dayjs().format("YYYY-MM-DD"),
    time: "09:00 - 10:00",
    patient: "",
    doctor: "",
    department: "",
    location: "",
    notes: "",
    priority: "medium",
    duration: 60,
    reminder: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        date: event.date || dayjs().format("YYYY-MM-DD"),
        time: event.time || "09:00 - 10:00",
        patient: event.patient || "",
        doctor: event.doctor || "",
        department: event.department || "",
        location: event.location || "",
        notes: event.notes || "",
        priority: event.priority || "medium",
        duration: event.duration || 60,
        reminder: event.reminder !== false,
      });
    } else {
      setFormData({
        title: "",
        date: dayjs().format("YYYY-MM-DD"),
        time: "09:00 - 10:00",
        patient: "",
        doctor: "",
        department: "",
        location: "",
        notes: "",
        priority: "medium",
        duration: 60,
        reminder: true,
      });
    }
    setErrors({});
  }, [event]);

  const handleSubmit = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.patient.trim()) newErrors.patient = "Patient name is required";
    if (!formData.doctor.trim()) newErrors.doctor = "Doctor is required";
    if (!formData.department.trim())
      newErrors.department = "Department is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleDelete = () => {
    if (event && window.confirm("Are you sure you want to delete this appointment?")) {
      onDelete(event.id);
      onClose();
    }
  };

  const timeOptions = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i;
    return `${hour}:00 - ${hour + 1}:00`;
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 3 }}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <TextField
              fullWidth
              label="Patient Name"
              value={formData.patient}
              onChange={(e) =>
                setFormData({ ...formData, patient: e.target.value })
              }
              required
              error={!!errors.patient}
              helperText={errors.patient}
            />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>

          <Grid item>
            <FormControl fullWidth required error={!!errors.doctor}>
              <InputLabel>Doctor</InputLabel>
              <Select
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
                label="Doctor"
              >
                {doctors.map((doc) => (
                  <MenuItem key={doc} value={doc}>
                    {doc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl fullWidth required error={!!errors.department}>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                label="Department"
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Appointment Date"
                value={dayjs(formData.date)}
                onChange={(newValue) => {
                  if (!newValue) return;
                  setFormData({
                    ...formData,
                    date: newValue.format("YYYY-MM-DD"),
                  });
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item>
            <FormControl fullWidth>
              <InputLabel>Time Slot</InputLabel>
              <Select
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                label="Time Slot"
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        {event && (
          <Button onClick={handleDelete} color="error" variant="outlined">
            Delete
          </Button>
        )}

        <Box sx={{ flex: 1 }} />

        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.background.primary,
            "&:hover": {
              backgroundColor: theme.palette.hover.primary,
            },
          }}
        >
          {event ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDialog;
