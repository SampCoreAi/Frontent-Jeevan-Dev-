import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Divider,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import api from "../../../../utils/axiosInstance";
export default function MySelfForm({ formik, onNext }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [gender, setGender] = useState("");
  const [slots, setSlots] = useState([]);

  const getDayFromDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const handleViewSlot = async () => {
    if (!selectedDate) {
      setError("Please select a date first.");
      return;
    }

    const day = getDayFromDate(selectedDate);
    const doctorId = localStorage.getItem("doctorId");

   const res = await api.get(
  `/api/schedules/doctor/${doctorId}`
);

const data = res.data;

    const schedules = data.data || [];

    // 🔍 filter schedules by day & date range
    const matchedSchedules = schedules.filter((s) => {
      const isDayMatch = s.active_days.includes(day);

      const selected = new Date(selectedDate);
      const start = s.start_date ? new Date(s.start_date) : null;
      const end = s.end_date ? new Date(s.end_date) : null;

      const isDateMatch =
        (!start || selected >= start) && (!end || selected <= end);

      return isDayMatch && isDateMatch;
    });

    // 🧩 merge all slots
    const allSlots = matchedSchedules.flatMap((s) => s.slots || []);

    setSlots(allSlots);
    setOpenModal(true);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setError("");
  };

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: 4, border: "1px solid #000", borderRadius: 1 }}
    >
      {/* Row 1 */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Name"
          InputLabelProps={{ style: { color: "black" } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Email"
          InputLabelProps={{ style: { color: "black" } }}
        />
      </Grid>

      {/* Row 2 */}
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Mobile Number"
          InputLabelProps={{ style: { color: "black" } }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          select
          fullWidth
          size="small"
          variant="outlined"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          SelectProps={{
            native: true,
            style: {
              backgroundColor: "#f9f9f9",
              padding: "8px 12px",
              borderRadius: "8px",
            },
          }}
          InputLabelProps={{ style: { color: "black" } }}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Age"
          InputLabelProps={{ style: { color: "black" } }}
        />
      </Grid>

      {/* Row 3 */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Date"
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          InputLabelProps={{ shrink: true, style: { color: "#333" } }}
          InputProps={{
            style: {
              color: "#333",
              backgroundColor: "#f9f9f9",
              borderRadius: "4px",
            },
          }}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Reason for Visit / Symptoms"
          rows={4}
          variant="outlined"
          sx={{
            width: "300px",
          }}
          InputLabelProps={{ style: { color: "black" } }}
        />
      </Grid>

      {/* Divider */}
      <Grid item xs={12}>
        <Divider sx={{ backgroundColor: "#14b8a6", my: 2 }} />
      </Grid>

      {/* Buttons below divider */}
      <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
        <Button variant="outlined" color="secondary" onClick={handleViewSlot}>
          View Slot
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={onNext}>
          Book Appointment
        </Button>
      </Grid>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 670 },
            bgcolor: "white",
            borderRadius: 0.5,
            boxShadow: 24,
            p: 3,
          }}
        >
          {/* Header */}
          <Typography variant="h6" fontWeight={600} mb={1}>
            Available Slots
          </Typography>
          <Typography variant="body2" color="black" mb={2}>
            {selectedDate}
          </Typography>

          {/* Slots */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {slots.length === 0 ? (
              <Typography color="text.secondary">
                No slots available for this date
              </Typography>
            ) : (
              slots.map((slot, i) => (
                <Button
                  key={i}
                  variant="outlined"
                  sx={{
                    minWidth: 110,
                    borderRadius: 0.5,
                    textTransform: "none",
                  }}
                  onClick={() => {
                    formik.setFieldValue(
                      "time",
                      `${slot.start_time} - ${slot.end_time}`
                    );
                    setOpenModal(false);
                  }}
                >
                  {slot.start_time} – {slot.end_time}
                </Button>
              ))
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: "right", mt: 3 }}>
            <Button onClick={() => setOpenModal(false)} color="secondary">
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
}
