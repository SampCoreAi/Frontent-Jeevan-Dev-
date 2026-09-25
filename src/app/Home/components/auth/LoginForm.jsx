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
        const role = Number(
          resData?.user?.role_id
        );

        if (role === 1)
          router.replace(
            "/users/pages/doctor"
          );
        else if (role === 2)
          router.replace(
            "/doctor/pages/dashboard"
          );
        else if (role === 3)
          router.replace(
            "/doctor/pages/dashboard"
          );
        else if (role === 4)
          router.replace(
            "/lab/pages/dashboard"
          );
        else if (role === 5)
          router.replace(
            "/admin/pages/dashboard"
          );
        else if (role === 6)
          router.replace(
            "/medical/pages/dashboard"
          );
        else {
          console.error(
            "Invalid role_id:",
            resData?.user?.role_id
          );

          showMessage(
            "Invalid user role",
            "error"
          );
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

  const inputStyle = {
    borderRadius: 1.5,
    backgroundColor: "background.default",
    transition: "all 0.2s ease",

    "&:hover": {
      backgroundColor: "background.default",
    },

    "&.Mui-focused": {
      backgroundColor: "background.paper",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "divider",
      borderWidth: "1px",
    },

    "&:hover .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "primary.main",
      },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline":
      {
        borderColor: "primary.main",
        borderWidth: "1.5px",
      },

    "& .MuiInputBase-input": {
      py: 1.35,
      fontSize: "13px",
      color: "text.primary",

      "&::placeholder": {
        color: "text.secondary",
        opacity: 1,
      },
    },
  };

  return (
    <>
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
                  fontSize: 18,
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 1.8,

          "& .MuiOutlinedInput-root":
            inputStyle,
        }}
      />

      <FormControl
        fullWidth
        variant="outlined"
        sx={{
          mb: 0.8,
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
                  fontSize: 18,
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
                size="small"
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
                  <VisibilityOff
                    sx={{
                      fontSize: 19,
                    }}
                  />
                ) : (
                  <Visibility
                    sx={{
                      fontSize: 19,
                    }}
                  />
                )}
              </IconButton>
            </InputAdornment>
          }
          sx={inputStyle}
        />
      </FormControl>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          mb: 2.3,
          mt: 0.3,
        }}
      >
        <Typography
          onClick={onForgotPassword}
          sx={{
            color: "primary.main",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "12.5px",
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

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleLogin}
        disabled={loading}
        sx={{
          borderRadius: 1.5,
          py: 1.25,
          minHeight: 42,
          fontSize: "13px",
          fontWeight: 600,
          textTransform: "none",
          boxShadow: "none",
          transition:
            "all 0.2s ease",

          "&:hover": {
            boxShadow:
              "0 5px 15px rgba(7,135,106,0.18)",
          },

          "&:active": {
            transform: "scale(0.99)",
          },
        }}
      >
        {loading ? (
          <CircularProgress
            size={20}
            sx={{
              color:
                "primary.contrastText",
            }}
          />
        ) : (
          "Log In"
        )}
      </Button>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: "12.5px",
            color: "text.secondary",
          }}
        >
          Don&apos;t have an account?
        </Typography>

        <Button
          type="button"
          variant="text"
          onClick={() =>
            router.push(
              "/Home/pages/Register"
            )
          }
          sx={{
            minWidth: "auto",
            p: 0,
            fontSize: "12.5px",
            fontWeight: 700,
            color: "primary.main",
            textTransform: "none",

            "&:hover": {
              backgroundColor:
                "transparent",
              color: "primary.dark",
              textDecoration:
                "underline",
            },
          }}
        >
          Register
        </Button>
      </Box>
    </>
  );
}