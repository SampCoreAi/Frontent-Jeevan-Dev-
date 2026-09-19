"use client";

import { useState } from "react";

import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Person,
  Phone,
  Email,
  Lock,
} from "@mui/icons-material";

import axios from "../../../../utils/axiosInstance";

export default function RegisterForm({ showMessage }) {
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const sanitize = (str) => str.replace(/[<>]/g, "");

  // =========================
  // COMMON INPUT STYLE
  // =========================
  const inputSx = {
    mb: 2.5,

    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "background.default",

      "&:hover": {
        backgroundColor: "secondary.light",
      },

      "&.Mui-focused": {
        backgroundColor: "background.paper",
      },

      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "divider",
      },

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
        borderWidth: "2px",
      },
    },

    "& .MuiInputBase-input": {
      padding: "14px 14px",
      fontSize: "0.95rem",
      color: "text.primary",

      "&::placeholder": {
        color: "text.secondary",
        opacity: 1,
      },
    },
  };

  // =========================
  // REGISTER
  // =========================
  const handleRegister = async () => {
    const nameValue = sanitize(fullName);
    const emailValue = sanitize(email).trim().toLowerCase();

    if (!fullName || !mobileNumber || !email || !password) {
      showMessage("Please fill in all fields!", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address!", "error");
      return;
    }

    const mobileRegex = /^[0-9]{10}$/;

    if (!mobileRegex.test(mobileNumber.replace(/\D/g, ""))) {
      showMessage("Please enter a valid mobile number!", "error");
      return;
    }

    if (password.length < 6) {
      showMessage(
        "Password should be at least 6 characters long!",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/auth/register`, {
        full_name: nameValue,
        email: emailValue,
        phone_number: mobileNumber,
        password,
        role_id: 1,
      });

      showMessage(
        "Registration successful! A verification email with a link has been sent to your email address",
        "success"
      );

      setFullName("");
      setMobileNumber("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed! Please try again.";

      showMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* =========================
          FULL NAME
      ========================= */}
      <TextField
        fullWidth
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        sx={inputSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person
                sx={{
                  color: "primary.main",
                  fontSize: "1.2rem",
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      {/* =========================
          MOBILE NUMBER
      ========================= */}
      <TextField
        fullWidth
        placeholder="Mobile Number"
        value={mobileNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");

          if (value.length <= 10) {
            setMobileNumber(value);
          }
        }}
        inputProps={{
          maxLength: 10,
        }}
        sx={inputSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone
                sx={{
                  color: "primary.main",
                  fontSize: "1.2rem",
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      {/* =========================
          EMAIL
      ========================= */}
      <TextField
        fullWidth
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={inputSx}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email
                sx={{
                  color: "primary.main",
                  fontSize: "1.2rem",
                }}
              />
            </InputAdornment>
          ),
        }}
      />

      {/* =========================
          PASSWORD
      ========================= */}
      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          ...inputSx,
          mb: 4,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock
                sx={{
                  color: "primary.main",
                  fontSize: "1.2rem",
                }}
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{
                  color: "text.secondary",

                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "secondary.light",
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* =========================
          SIGN UP BUTTON
      ========================= */}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
        onClick={handleRegister}
        sx={{
          borderRadius: "8px",
          py: 1.8,
          fontSize: "1.1rem",
          fontWeight: 600,
          textTransform: "none",

          // Tumhare theme ka primary
          backgroundColor: "primary.main",
          color: "primary.contrastText",

          boxShadow: "none",

          "&:hover": {
            backgroundColor: "primary.dark",
            boxShadow: "none",
          },

          "&.Mui-disabled": {
            backgroundColor: "primary.light",
            color: "primary.contrastText",
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CircularProgress
              size={24}
              sx={{
                color: "primary.contrastText",
              }}
            />

            Registering...
          </Box>
        ) : (
          "Sign Up"
        )}
      </Button>
    </Box>
  );
}