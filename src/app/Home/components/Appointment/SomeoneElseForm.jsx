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

export default function SomeoneElseForm({ formik, onNext }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [gender, setGender] = useState("");

  const handleViewSlot = () => {
    if (!selectedDate) {
      setError("Please select a date first.");
      return;
    }
    setError("");
    setOpenModal(true);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setError("");
  };

  return (
    <Grid container spacing={3} sx={{ padding: 4, border: "1px solid #000", borderRadius: 1 }}>
      {/* Row 1 */}
      <Grid item xs={12} md={6}>
        <TextField fullWidth label="Name" InputLabelProps={{ style: { color: "black" } }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth label="Email" InputLabelProps={{ style: { color: "black" } }} />
      </Grid>

      {/* Row 2 */}
      <Grid item xs={12} md={4}>
        <TextField fullWidth label="Mobile Number" InputLabelProps={{ style: { color: "black" } }} />
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
          <option value="" disabled>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </TextField>
      </Grid>
      <Grid item xs={12} md={4}>
        <TextField fullWidth label="Age" InputLabelProps={{ style: { color: "black" } }} />
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
            style: { color: "#333", backgroundColor: "#f9f9f9", borderRadius: "4px" },
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
            width:"300px"

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
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
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
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Available Slots for {selectedDate}
          </Typography>
          <Box>
            {["10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM"].map((time) => (
              <Button key={time} sx={{ mr: 1, mb: 1 }}>{time}</Button>
            ))}
          </Box>
          <Button sx={{ mt: 2 }} onClick={() => setOpenModal(false)}>Close</Button>
        </Box>
      </Modal>
    </Grid>
  );
}
