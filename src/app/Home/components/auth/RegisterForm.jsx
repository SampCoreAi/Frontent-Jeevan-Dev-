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
import { Visibility, VisibilityOff, Person, Phone, Email, Lock } from "@mui/icons-material";
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
      showMessage("Password should be at least 6 characters long!", "warning");
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
      console.error("Registration failed:", error.response?.data || error.message);
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
      <TextField
        fullWidth
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: "#f1f3f5",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1e6658",
                borderWidth: "2px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
          },
          "& .MuiInputBase-input": {
            padding: "14px 14px",
            fontSize: "0.95rem",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person sx={{ color: "#1e6658", fontSize: "1.2rem" }} />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        fullWidth
        placeholder="Mobile Number"
        value={mobileNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "");
          if (value.length <= 10) setMobileNumber(value);
        }}
        inputProps={{ maxLength: 10 }}
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: "#f1f3f5",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1e6658",
                borderWidth: "2px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
          },
          "& .MuiInputBase-input": {
            padding: "14px 14px",
            fontSize: "0.95rem",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone sx={{ color: "#1e6658", fontSize: "1.2rem" }} />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        fullWidth
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: "#f1f3f5",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1e6658",
                borderWidth: "2px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
          },
          "& .MuiInputBase-input": {
            padding: "14px 14px",
            fontSize: "0.95rem",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email sx={{ color: "#1e6658", fontSize: "1.2rem" }} />
            </InputAdornment>
          ),
        }}
      />
      
      <TextField
        fullWidth
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            "&:hover": {
              backgroundColor: "#f1f3f5",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1e6658",
                borderWidth: "2px",
              },
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
          },
          "& .MuiInputBase-input": {
            padding: "14px 14px",
            fontSize: "0.95rem",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ color: "#1e6658", fontSize: "1.2rem" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{
                  color: "#1e6658",
                  "&:hover": {
                    backgroundColor: "rgba(30, 102, 88, 0.08)",
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        size="large"
        disabled={loading}
        onClick={handleRegister}
        sx={{
          borderRadius: "12px",
          py: 1.8,
          fontSize: "1.1rem",
          fontWeight: 600,
          textTransform: "none",
          backgroundColor: "#1e6658",
          color: "#ffffff",
          boxShadow: "0 4px 14px rgba(30, 102, 88, 0.35)",
          "&:hover": {
            backgroundColor: "#165244",
            boxShadow: "0 6px 20px rgba(30, 102, 88, 0.4)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          "&.Mui-disabled": {
            backgroundColor: "#8fb0a8",
            color: "#ffffff",
          },
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={24} sx={{ color: "#ffffff" }} />
            Registering...
          </Box>
        ) : (
          "Sign Up"
        )}
      </Button>
    </Box>
  );
}