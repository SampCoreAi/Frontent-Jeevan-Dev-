import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";

export default function AddDoctorDialog({ open, onClose, onAddDoctor }) {
  const [doctorForm, setDoctorForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",

  });
  const [loading, setLoading] = useState(false);

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fff",

      "& fieldset": {
        borderColor: "#1E6658",
        borderWidth: "1px",
      },

      "&:hover fieldset": {
        borderColor: "#1E6658",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1E6658",
        borderWidth: "2px",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#1E6658",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#1E6658",
    },
  };

  const handleInputChange = (e) => {
    setDoctorForm({
      ...doctorForm,
      [e.target.name]: e.target.value,
    });
  };
const handleSubmit = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const payload = {
      full_name: doctorForm.fullName,
      email: doctorForm.email,
      phone_number: doctorForm.phoneNumber,
      role_id: 2,
    };

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/assistant-register`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (onAddDoctor) {
      onAddDoctor(res.data);
    }

    setDoctorForm({
      fullName: "",
      email: "",
      phoneNumber: "",
    });

    onClose();
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message || "Doctor registration failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 2,
          bgcolor: "#fff",
        }}
      >
        <Box
          sx={{
            px: 4,
            py: 3,
            bgcolor: "#F8FAFC",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Add Doctor
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            p: 3,
            border: "1px solid #E5E7EB",
            borderRadius: 3,
            bgcolor: "#FAFAFA",
          }}
        >

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Doctor Name"
                name="fullName"
                sx={textFieldStyle}
                value={doctorForm.fullName}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={doctorForm.email}
                onChange={handleInputChange}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                sx={textFieldStyle}
                value={doctorForm.phoneNumber}
                onChange={handleInputChange}
              />
            </Grid>




          </Grid>
        </Box>
        <Box
          sx={{
      pt: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
          }}
        >
          <Button
  variant="outlined"
  onClick={onClose}
  sx={{
    borderRadius: 2,
    borderColor: "#1e6658",
    textTransform: "none",
    color: "#1e6658",
    px: 3,
  }}
>
  Cancel
</Button>
     <LoadingButton
  variant="contained"
  onClick={handleSubmit}
  loading={loading}
  loadingPosition="start"
  disabled={loading}
  sx={{
    borderRadius: 2,
    textTransform: "none",
    px: 3,
    backgroundColor: "#1e6658",
    "&:hover": {
      backgroundColor: "#145347",
    },
  }}
>
  Save Doctor
</LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}