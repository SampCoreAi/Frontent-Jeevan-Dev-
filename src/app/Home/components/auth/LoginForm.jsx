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

export default function LoginForm({
  onForgotPassword,
  showMessage,
}) {
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

  // =========================
  // VALIDATION
  // =========================

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      return "All fields are required";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return null;
  };

  // =========================
  // ERROR MESSAGE
  // =========================

  const getErrorMessage = (error) => {
    if (!error.response) {
      return "Network error. Please check your internet connection.";
    }

    const status = error.response.status;

    if (status === 404) {
      return "Service not found.";
    }

    if (status === 500) {
      return "Server error. Please try later.";
    }

    if (status === 401) {
      return (
        error.response?.data?.message ||
        "Invalid credentials"
      );
    }

    return (
      error.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  };

  // =========================
  // LOGIN
  // =========================

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

      timeout = setTimeout(() => {
        controller.abort();
      }, 8000);

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

      const resData =
        response.data.data || response.data;

      localStorage.setItem(
        "token",
        resData.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        resData.refreshToken
      );

      localStorage.setItem(
        "user",
        JSON.stringify(resData.user)
      );

      showMessage(
        "Login successful!",
        "success"
      );
setTimeout(() => {
  const role = Number(resData?.user?.role_id);

  if (role === 1) router.replace("/users/pages/doctor");
  else if (role === 2) router.replace("/doctor/pages/dashboard");
  else if (role === 3) router.replace("/doctor/pages/dashboard");
  else if (role === 5) router.replace("/admin/pages/dashboard");
  else if (role === 4) router.replace("/lab/pages/dashboard");
  else {
    console.error("Invalid role_id:", resData?.user?.role_id);
    showMessage("Invalid user role", "error");
  }
}, 1500);
    } catch (error) {
      if (
        error.name === "AbortError" ||
        error.code === "ERR_CANCELED"
      ) {
        showMessage(
          "Request timed out. Try again.",
          "error"
        );
      } else {
        showMessage(
          getErrorMessage(error),
          "error"
        );
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <>
      {/* =========================
          EMAIL
      ========================= */}

      <TextField
        fullWidth
        placeholder="Email Address"
        variant="outlined"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleLogin();
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon
                sx={{
                  color: "primary.main",
                  fontSize: 20,
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2.5,

          "& .MuiOutlinedInput-root": {
            borderRadius: 2,

            backgroundColor:
              "background.default",

            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor:
                "secondary.light",
            },

            "&.Mui-focused": {
              backgroundColor:
                "background.paper",
            },

            "& .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "divider",
                borderWidth: "1.5px",
              },

            "&:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor:
                  "primary.main",
              },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor:
                  "primary.main",

                borderWidth: "2px",
              },
          },

          "& .MuiInputBase-input": {
            py: 1.8,

            fontSize: "0.95rem",

            color: "text.primary",

            "&::placeholder": {
              color: "text.secondary",
              opacity: 1,
            },
          },
        }}
      />

      {/* =========================
          PASSWORD
      ========================= */}

      <FormControl
        fullWidth
        variant="outlined"
        sx={{
          mb: 1,
        }}
      >
        <OutlinedInput
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          placeholder="Password"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon
                sx={{
                  color: "primary.main",
                  fontSize: 20,
                }}
              />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                edge="end"
                sx={{
                  color: "text.secondary",

                  "&:hover": {
                    color: "primary.main",

                    backgroundColor:
                      "secondary.light",
                  },
                }}
              >
                {showPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          }
          sx={{
            borderRadius: 2,

            backgroundColor:
              "background.default",

            transition: "all 0.2s ease",

            "&:hover": {
              backgroundColor:
                "secondary.light",
            },

            "&.Mui-focused": {
              backgroundColor:
                "background.paper",
            },

            "& .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "divider",
                borderWidth: "1.5px",
              },

            "&:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor:
                  "primary.main",
              },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor:
                  "primary.main",

                borderWidth: "2px",
              },

            "& .MuiInputBase-input": {
              py: 1.8,

              fontSize: "0.95rem",

              color: "text.primary",

              "&::placeholder": {
                color: "text.secondary",
                opacity: 1,
              },
            },
          }}
        />
      </FormControl>

      {/* =========================
          FORGOT PASSWORD
      ========================= */}

      <Box
        sx={{
          display: "flex",

          justifyContent: "flex-end",

          alignItems: "center",

          width: "100%",

          mb: 3,
          mt: 0.5,
        }}
      >
        <Typography
          onClick={onForgotPassword}
          sx={{
            color: "primary.main",

            cursor: "pointer",

            fontWeight: 600,

            fontSize: "0.9rem",

            transition:
              "all 0.2s ease",

            "&:hover": {
              textDecoration:
                "underline",

              color: "primary.dark",
            },
          }}
        >
          Forgot Password?
        </Typography>
      </Box>

      {/* =========================
          LOGIN BUTTON
      ========================= */}

      <Button
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        onClick={handleLogin}
        disabled={loading}
        sx={{
          borderRadius: 2,

          py: 1.8,

          fontSize: "1rem",

          fontWeight: 600,

          minHeight: 52,

          transition:
            "all 0.3s ease",

          "&:hover": {
            transform:
              "translateY(-2px)",

            boxShadow:
              "0 6px 20px rgba(7, 135, 106, 0.25)",
          },

          "&:active": {
            transform:
              "translateY(0)",
          },
        }}
      >
        {loading ? (
          <CircularProgress
            size={26}
            sx={{
              color:
                "primary.contrastText",
            }}
          />
        ) : (
          "Log In"
        )}
      </Button>
    </>
  );
}