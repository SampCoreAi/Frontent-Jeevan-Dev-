"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "@/utils/axiosInstance";

export default function ForgotPasswordDialog({ open, onClose, showMessage }) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleClose = () => {
  setForgotEmail("");
  onClose();
};

  const handleForgotPassword = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(forgotEmail)) {
    showMessage("Enter a valid email", "error");
    return;
}

    try {
      setForgotLoading(true);
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: forgotEmail,
      });
      showMessage(res.data.message, "success");
      onClose();
      setForgotEmail("");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to send reset link.",
        "error"
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    
    <Dialog
    open={open}
    onClose={forgotLoading ? undefined : handleClose}
 maxWidth="sm" fullWidth>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2, color: "black" }}>
          Enter your registered email address. We will send a password reset link.
        </DialogContentText>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          margin="normal"
          sx={{
            "& .MuiInputLabel-root": {
              color: "#0f7468",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#0f7468",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#0f7468",
              },
              "&:hover fieldset": {
                borderColor: "#0f7468",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#0f7468",
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleForgotPassword}
          disabled={forgotLoading}
          sx={{
            bgcolor: "#1E6658",
            minWidth: 120,
            "&:hover": {
              bgcolor: "#145246",
            },
          }}
        >
          {forgotLoading ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "Send Link"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}