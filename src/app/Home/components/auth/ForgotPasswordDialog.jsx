"use client";

import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import axios from "@/utils/axiosInstance";

const primary = "#07876A";

export default function ForgotPasswordDialog({
  open,
  onClose,
  showMessage,
}) {
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleClose = () => {
    if (forgotLoading) return;
    setForgotEmail("");
    onClose();
  };

  const handleForgotPassword = async () => {
    const email = forgotEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showMessage("Enter a valid email", "error");
      return;
    }

    try {
      setForgotLoading(true);

      const res = await axios.post(
        `${API_URL}/api/auth/forgot-password`,
        { email },
      );

      showMessage(res.data.message, "success");
      setForgotEmail("");
      onClose();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to send reset link.",
        "error",
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid #DDE9E5",
          boxShadow: "0 16px 45px rgba(23, 32, 51, 0.14)",
        },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
         <Box
  sx={{
    width: 42,
    height: 42,
    flexShrink: 0,
    display: "grid",
    placeItems: "center",
    borderRadius: 2,
    backgroundColor: "rgba(7, 135, 106, 0.09)",
  }}
>
  <LockResetOutlinedIcon
    sx={{
      fontSize: 26,
      width: 26,
      height: 26,
      display: "block",
      color: primary,
    }}
  />
</Box>

          <Box>
            <Typography sx={{ color: "#172033", fontSize: 18, fontWeight: 700 }}>
              Forgot password?
            </Typography>
            <Typography sx={{ color: "#74807B", fontSize: 13 }}>
              Reset your account password
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: "12px !important" }}>
        <Typography sx={{ mb: 2, color: "#526174", fontSize: 13 }}>
          Enter your registered email address. We’ll send you a password reset
          link.
        </Typography>

        <TextField
          fullWidth
          autoFocus
          size="small"
          label="Email address"
          type="email"
          value={forgotEmail}
          onChange={(event) => setForgotEmail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !forgotLoading) {
              handleForgotPassword();
            }
          }}
          placeholder="you@example.com"
          sx={{
            "& .MuiInputBase-root": {
              fontSize: 13,
              borderRadius: 1.5,
            },
            "& .MuiInputLabel-root": {
              fontSize: 13,
              color: "#74807B",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: primary,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CBD5E1",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: primary,
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: primary,
              },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: "#74807B", fontSize: 20 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={forgotLoading}
          sx={{
            minHeight: 40,
            px: 2,
            color: "#526174",
            fontSize: 13,
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleForgotPassword}
          disabled={forgotLoading}
          sx={{
            minWidth: 130,
            minHeight: 40,
            borderRadius: 1.5,
            backgroundColor: primary,
            fontSize: 13,
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#066F58",
              boxShadow: "none",
            },
          }}
        >
          {forgotLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={17} sx={{ color: "#fff" }} />
              Sending...
            </Box>
          ) : (
            "Send reset link"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}