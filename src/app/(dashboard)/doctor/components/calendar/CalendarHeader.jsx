"use client";
import React, { useState, useEffect } from "react";


import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { formatTimeForDisplay } from "../../utils/index";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import { useTheme } from "@mui/material/styles";

const CalendarHeader = ({
  onExport,
  onAdd,
  onAppointmentCreated,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
const [slots, setSlots] = useState([]);
const [slotsLoading, setSlotsLoading] = useState(false);

  const inputStyles = {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1e6658",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#14503e",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1e6658",
    },
  };

  const labelStyles = {
    sx: {
      color: "#1e6658",
      "&.Mui-focused": { color: "#1e6658" },
      "&.MuiInputLabel-shrink": { color: "#1e6658" },
    },
  };
  const [hospitals, setHospitals] = useState([]);

  const [form, setForm] = useState({
    patientName: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    reason: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    hospital: "",
     slotId: "",
  });
const getSlots = async () => {
  if (!form.hospital || !form.appointmentDate) return;

  try {
    setSlotsLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API_URL}/api/appointments/doctor-slots`,
      {
        params: {
          hospitalName: form.hospital,
          date: form.appointmentDate,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Slots:", res.data);

    if (res.data.success) {
      setSlots(res.data.slots || []);
    } else {
      setSlots([]);
    }
  } catch (error) {
    console.log("Slot API Error:", error);
    setSlots([]);
  } finally {
    setSlotsLoading(false);
  }
};
useEffect(() => {
  if (form.hospital && form.appointmentDate) {
    getSlots();
  }
}, [form.hospital, form.appointmentDate]);
  useEffect(() => {
    getHospitals();
  }, []);
  useEffect(() => {
    if (hospitals.length > 0 && !form.hospital) {
      setForm((prev) => ({
        ...prev,
        hospital: hospitals[0].hospitalName,
      }));
    }
  }, [hospitals]);
  const handleSubmit = async () => {
    try {

      const token = localStorage.getItem("token");

      const payload = {
        appointment_date: form.appointmentDate,
        hospital_name: form.hospital,
        mode: "offline",
        
        booking_type: "someone_else",
        reason_for_visit: form.reason,
        patient: {
          name: form.patientName,
          email: form.email,
          age: Number(form.age),
          gender: form.gender,
          phone: form.phone,
        },
      };

     const res = await axios.post(
  `${API_URL}/api/appointments/bookAppointmentByAssistant`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
if (res.data.success) {

  onAppointmentCreated?.();

  setOpen(false);

  setForm({
    patientName: "",
    email: "",
    age: "",
    gender: "",
    phone: "",
    reason: "",
    appointmentDate: new Date().toISOString().split("T")[0],
    hospital:
      hospitals.length > 0
        ? hospitals[0].hospitalName
        : "",
          slotId: "",
  });
}

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const roleId = user?.role_id;
  const getHospitals = async () => {
    try {
      const token = localStorage.getItem("token");

  const res = await axios.get(
  `${API_URL}/api/schedules/getHospitalsName`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

     if (res.data.success) {
  const hospitalList = res.data.data;

  setHospitals(hospitalList);

  setForm((prev) => ({
    ...prev,
    hospital:
      hospitalList.length > 0
        ? hospitalList[0].hospitalName
        : "",
  }));
}
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box
      sx={{
        width: "100%",

        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

        gap: {
          xs: 1,
          sm: 2,
        },

        p: {
          xs: 1.2,
          sm: 2,
        },

        borderRadius: {
          xs: "16px",
          sm: "20px",
        },

        background:
          theme.palette.mode === "dark"
            ? "#1E1E1E"
            : "#ffffff",

        border: "1px solid #e5e7eb",

        boxShadow: "0 4px 14px rgba(0,0,0,0.05)",

        minHeight: {
          xs: "72px",
          sm: "88px",
        },

        overflow: "hidden",
      }}
    >
      {/* LEFT SIDE */}
      <Stack
        direction="row"
        spacing={{
          xs: 1,
          sm: 1.5,
        }}
        alignItems="center"
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* ICON */}
        <Box
          sx={{
            width: {
              xs: 42,
              sm: 52,
            },

            height: {
              xs: 42,
              sm: 52,
            },

            borderRadius: {
              xs: "12px",
              sm: "16px",
            },

            background:
              "linear-gradient(135deg, #e8f3f1 0%, #d7ebe7 100%)",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            flexShrink: 0,
          }}
        >
          <CalendarMonthRoundedIcon
            sx={{
              color: "#1E6658",

              fontSize: {
                xs: 22,
                sm: 30,
              },
            }}
          />
        </Box>

        {/* TITLE */}
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,

              color: theme.palette.text.primary,

              fontSize: {
                xs: "1rem",
                sm: "1.6rem",
              },

              lineHeight: 1.2,

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Medical Calendar
          </Typography>

          {/* Small subtitle */}
          <Typography
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },

              fontSize: "0.85rem",

              color: "#6b7280",

              mt: 0.3,
            }}
          >
            Manage appointments & schedules
          </Typography>
        </Box>
      </Stack>

      {/* RIGHT BUTTONS */}
      <Stack
        direction="row"
        spacing={{
          xs: 1,
          sm: 1.5,
        }}
        alignItems="center"
        flexShrink={0}
      >
        {/* EXPORT BUTTON */}
        <Button
          variant="outlined"
          onClick={onExport}
          sx={{
            minWidth: {
              xs: 46,
              sm: 130,
            },

            width: {
              xs: 46,
              sm: "auto",
            },

            height: {
              xs: 46,
              sm: 52,
            },

            borderRadius: {
              xs: "12px",
              sm: "14px",
            },

            borderColor: "#1E6658",

            color: "#1E6658",

            fontWeight: 700,

            textTransform: "none",

            px: {
              xs: 0,
              sm: 2.5,
            },

            "& .MuiButton-startIcon": {
              margin: 0,
            },

            "&:hover": {
              borderColor: "#1E6658",
              backgroundColor: "#edf7f5",
            },
          }}
        >
          <DownloadIcon
            sx={{
              fontSize: {
                xs: 20,
                sm: 22,
              },
            }}
          />

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },

              ml: 1,
            }}
          >
            Export
          </Box>
        </Button>

        {roleId === 3 && (
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              minWidth: {
                xs: 50,
                sm: 185,
              },
              width: {
                xs: 50,
                sm: "auto",
              },
              height: {
                xs: 46,
                sm: 55,
              },
              borderRadius: {
                xs: "12px",
                sm: "14px",
              },
              backgroundColor: "#1E6658",
              fontWeight: 700,
              textTransform: "none",
              px: {
                xs: 0,
                sm: 3,
              },
              boxShadow: "0 6px 16px rgba(30,102,88,0.22)",
              "& .MuiButton-startIcon": {
                margin: 0,
              },
              "&:hover": {
                backgroundColor: "#174d43",
              },
              transition: "0.2s ease",
            }}
          >
            <AddIcon
              sx={{
                fontSize: {
                  xs: 22,
                  sm: 24,
                },
              }}
            />

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                ml: 1,
              }}
            >
              New Appointment
            </Box>
          </Button>
        )}
      <Dialog
  open={open}
  onClose={() => setOpen(false)}
  fullWidth
  maxWidth="md"
  PaperProps={{
    sx: {
      width: "900px",
      maxWidth: "95vw",
      borderRadius: 3,
      overflow: "hidden",
    },
  }}
>
  <DialogTitle
    sx={{
      fontWeight: 700,
      color: "#1e6658",
      pb: 1,
    }}
  >
    New Appointment
  </DialogTitle>

  <DialogContent
    sx={{
      overflowY: "hidden", // vertical scroll nahi
      py: 2,
    }}
  >
    <Grid container spacing={2} mt={0.5}>

      {/* Hospital */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Hospital"
          select
          name="hospital"
          value={form.hospital}
          onChange={handleChange}
          InputLabelProps={labelStyles}
          InputProps={{ sx: inputStyles }}
        >
          {hospitals.map((item) => (
            <MenuItem
              key={item.hospitalName}
              value={item.hospitalName}
            >
              {item.hospitalName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Appointment Date */}
     <Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    size="small"
    type="date"
    label="Appointment Date"
    name="appointmentDate"
    value={form.appointmentDate}
    onChange={handleChange}
    InputLabelProps={{ shrink: true }}
  />
</Grid>
<Grid size={{ xs: 12, sm: 6 }}>
  <TextField
    fullWidth
    size="small"
    select
    label="Select Slot"
    name="slotId"
    value={form.slotId}
    onChange={handleChange}
    disabled={slotsLoading}
    InputLabelProps={labelStyles}
    InputProps={{
      sx: inputStyles,
    }}
    SelectProps={{
      MenuProps: {
        PaperProps: {
          sx: {
            maxHeight: 300,
            mt: 0.5,
          },
        },
      },
    }}
  >
    {slotsLoading && (
      <MenuItem disabled>
        Loading slots...
      </MenuItem>
    )}

    {!slotsLoading && slots.length === 0 && (
      <MenuItem disabled>
        No slots available
      </MenuItem>
    )}

    {slots.map((slot) => (
      <MenuItem
        key={slot.slotId}
        value={slot.slotId}
        disabled={slot.status !== "ACTIVE"}
      >
        Token {slot.tokenNumber} -{" "}
        {formatTimeForDisplay(slot.startTime)} to{" "}
        {formatTimeForDisplay(slot.endTime)}
      </MenuItem>
    ))}
  </TextField>
</Grid>
      {/* Reason */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Reason for Visit"
          name="reason"
          value={form.reason}
          onChange={handleChange}
          InputLabelProps={labelStyles}
          InputProps={{ sx: inputStyles }}
        />
      </Grid>

      {/* Patient Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Patient Name"
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          InputLabelProps={labelStyles}
          InputProps={{ sx: inputStyles }}
        />
      </Grid>

      {/* Email */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          InputLabelProps={labelStyles}
          InputProps={{ sx: inputStyles }}
        />
      </Grid>

      {/* Phone */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          InputLabelProps={labelStyles}
          InputProps={{ sx: inputStyles }}
        />
      </Grid>

      {/* Age */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Age"
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          InputLabelProps={labelStyles}
          InputProps={{ sx: inputStyles }}
        />
      </Grid>

      {/* Gender */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          size="small"
          select
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={handleChange}
          InputLabelProps={labelStyles}
          InputProps={{ sx: inputStyles }}
        >
         <MenuItem value="Male">Male</MenuItem>
<MenuItem value="Female">Female</MenuItem>
<MenuItem value="Other">Other</MenuItem>
        </TextField>
      </Grid>

    </Grid>
  </DialogContent>

  <DialogActions sx={{ px: 3, pb: 2 }}>
    <Button
      onClick={() => setOpen(false)}
      sx={{ color: "#1e6658" }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSubmit}
      sx={{
        backgroundColor: "#1e6658",
        "&:hover": {
          backgroundColor: "#174d43",
        },
      }}
    >
      Book Appointment
    </Button>
  </DialogActions>
</Dialog>
      </Stack>
    </Box>
  );
};

export default CalendarHeader;