"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import axios from "../../../../utils/axiosInstance";
import { useRouter } from "next/navigation";

export default function LoginForm({ onForgotPassword, showMessage }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
    showMessage("API URL not configured", "error");
    return;
}
  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      return "All fields are required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  };

  const getErrorMessage = (error) => {
    if (!error.response) {
      return "Network error. Please check your internet connection.";
    }
    const status = error.response.status;
    if (status === 404) return "Service not found.";
    if (status === 500) return "Server error. Please try later.";
    if (status === 401) return error.response?.data?.message || "Invalid credentials";
    return (
      error.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  };


const handleLogin = async () => {
  if (loading) return;

  const error = validateForm();

  if (error) {
    showMessage(error, "error");
    return;
  }

  const emailValue = email.trim().toLowerCase();
  let timeout;

  try {
    setLoading(true);

    const controller = new AbortController();
    timeout = setTimeout(() => controller.abort(), 8000);

    const response = await axios.post(
      "/api/auth/login",
      {
        email: emailValue,
        password,
      },
      {
        signal: controller.signal,
      }
    );

    const resData = response.data.data || response.data;

    localStorage.setItem("token", resData.accessToken);
    localStorage.setItem("refreshToken", resData.refreshToken);
    localStorage.setItem("user", JSON.stringify(resData.user));

    showMessage("Login successful!", "success");

    setTimeout(() => {
      const role = resData.user.role_id;

      if (role === 1) router.push("/users/pages/doctor");
      else if (role === 2) router.push("/doctor/pages/dashboard");
      else if (role === 3) router.push("/doctor/pages/dashboard");
      else if (role === 4) router.push("/admin/pages/dashboard");
      else router.push("/Home/pages/Register");
    }, 1500);
  } catch (error) {
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      showMessage("Request timed out. Try again.", "error");
    } else {
      showMessage(getErrorMessage(error), "error");
    }
  } finally {
    clearTimeout(timeout);
    setLoading(false);
  }
};

  return (
    <>
      <TextField
        fullWidth
        placeholder="Email Address"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
       onKeyDown={(e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
}}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: "#1E6658", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            backgroundColor: "#f8f9fa",
            "&:hover": {
              backgroundColor: "#f1f3f4",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d0d7de",
              borderWidth: "1.5px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1E6658",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1E6658",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input": {
            py: 1.8,
            fontSize: "0.95rem",
          },
        }}
      />

      <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
        <OutlinedInput
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          onKeyPress={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon sx={{ color: "#1E6658", fontSize: 20 }} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{
                  color: "#666",
                  "&:hover": {
                    color: "#1E6658",
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          sx={{
            borderRadius: 2,
            backgroundColor: "#f8f9fa",
            "&:hover": {
              backgroundColor: "#f1f3f4",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d0d7de",
              borderWidth: "1.5px",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1E6658",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1E6658",
              borderWidth: "2px",
            },
            "& .MuiInputBase-input": {
              py: 1.8,
              fontSize: "0.95rem",
            },
          }}
        />
      </FormControl>

      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          width: "100%",
          mb: 3,
          mt: 0.5,
        }}
      >
        <Typography
          sx={{
            color: "#1E6658",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.9rem",
            "&:hover": {
              textDecoration: "underline",
              color: "#155a4d",
            },
            transition: "color 0.2s",
          }}
          onClick={onForgotPassword}
        >
          Forgot Password?
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleLogin}
        disabled={loading}
        sx={{
          backgroundColor: "#1E6658",
          "&:hover": {
            backgroundColor: "#155a4d",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(30, 102, 88, 0.4)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          color: "#fff",
          borderRadius: 2,
          py: 1.8,
          fontSize: "1rem",
          fontWeight: 600,
          textTransform: "none",
          minHeight: 52,
          transition: "all 0.3s ease",
          boxShadow: "0 4px 12px rgba(30, 102, 88, 0.3)",
        }}
      >
        {loading ? (
          <CircularProgress size={26} sx={{ color: "#fff" }} />
        ) : (
          "Log In"
        )}
      </Button>

      
    </>
  );
}