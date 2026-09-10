"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

const handleSubmit = async () => {
  if (loading) return;

  try {
    setLoading(true);

    await axios.post(`${API_URL}/api/auth/reset-password`, {
      token,
      password,
    });

    alert("Password reset successfully.");
  } catch (error) {
    alert(
      error.response?.data?.message || "Failed to reset password."
    );
  } finally {
    setLoading(false);
  }
};

return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: "#f5f7f9",
      p: 2,
    }}
  >
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        maxWidth: 420,
        p: 4,
        borderRadius: 2,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(30,102,88,0.15)",
      }}
    >
      <Avatar
        src="/img/icon.png"
        sx={{
          width: 80,
          height: 80,
          mx: "auto",
          mb: 2,
        }}
      />

      <Typography
        variant="h4"
        fontWeight={700}
        color="#1E6658"
        gutterBottom
      >
        Reset Password
      </Typography>

      <Typography
        variant="body2"
        color="black"
        sx={{ mb: 3 }}
      >
        Enter your new password below.
      </Typography>

      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1E6658",
            },
            "&:hover fieldset": {
              borderColor: "#1E6658",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1E6658",
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#1E6658",
          },
        }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{
          bgcolor: "#1E6658",
          py: 1.5,
          borderRadius: 1,
          fontWeight: 600,
          "&:hover": {
            bgcolor: "#175346",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: "#fff" }} />
        ) : (
          "Reset Password"
        )}
      </Button>
    </Paper>
  </Box>
);
}