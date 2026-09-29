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
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    showMessage("API URL not configured", "error");
    return;
  }

const validateForm = () => {
  const emailValue = email.trim();

  if (!emailValue) {
    return "Email address is required";
  }

  if (!password.trim()) {
    return "Password is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(emailValue)) {
    return "Please enter a valid email address";
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
        else if (role === 7)
          router.replace(
            "/lab/pages/technician"
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
    transition: "all 0.2s ease",

    "&:hover": {
      boxShadow: "0 5px 15px rgba(7,135,106,0.18)",
    },

    "&:active": {
      transform: "scale(0.99)",
    },

    "&.Mui-disabled": {
      backgroundColor: "primary.main",
      color: "primary.contrastText",
      opacity: 0.75,
    },
  }}
>
  {loading ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <CircularProgress
        size={17}
        thickness={5}
        sx={{
          color: "inherit",
        }}
      />

      <Typography
        component="span"
        sx={{
          fontSize: "13px",
          fontWeight: 600,
          color: "inherit",
        }}
      >
        Logging in...
      </Typography>
    </Box>
  ) : (
    "Log In"
  )}
</Button>

{/* =========================================
    OR DIVIDER
========================================= */}

<Box
  sx={{
    my: 1.8,

    display: "flex",
    alignItems: "center",

    gap: 1.5,
  }}
>
  <Box
    sx={{
      flex: 1,
      height: "1px",
      bgcolor: "#E5EAE8",
    }}
  />

  <Typography
    sx={{
      fontSize: "11px",
      fontWeight: 500,

      color: "text.secondary",

      textTransform: "uppercase",

      letterSpacing: "0.04em",
    }}
  >
    or
  </Typography>

  <Box
    sx={{
      flex: 1,
      height: "1px",
      bgcolor: "#E5EAE8",
    }}
  />
</Box>


{/* =========================================
    GOOGLE LOGIN
========================================= */}

<Box
  component="button"
  type="button"
  onClick={() => {
    window.location.href =
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  }}
  disabled={loading}
  sx={{
    width: "100%",
    height: "44px",

    p: 0,

    border: "1px solid #D8E0DD",

    borderRadius: "8px",

    bgcolor: "#FFFFFF",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    gap: "9px",

    cursor: loading
      ? "not-allowed"
      : "pointer",

    fontFamily: "inherit",

    transition: "all 0.2s ease",

    "&:hover": {
      bgcolor: "#F8FBFA",

      borderColor: "#BFCFC9",

      boxShadow:
        "0 4px 12px rgba(23,32,51,0.05)",
    },

    "&:active": {
      transform: "scale(0.995)",
    },

    "&:disabled": {
      opacity: 0.6,
    },
  }}
>
  {/* GOOGLE ICON */}

  <Box
    component="svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    sx={{
      width: "18px",
      height: "18px",
      flexShrink: 0,
    }}
  >
    <path
      fill="#4285F4"
      d="M21.35 12.27c0-.64-.06-1.25-.16-1.84H12v3.48h5.25a4.49 4.49 0 0 1-1.95 2.94v2.26h3.16c1.85-1.7 2.89-4.21 2.89-6.84Z"
    />

    <path
      fill="#34A853"
      d="M12 21.8c2.64 0 4.86-.87 6.48-2.37l-3.16-2.26c-.88.59-2 .94-3.32.94-2.55 0-4.71-1.72-5.49-4.04H3.25v2.33A9.8 9.8 0 0 0 12 21.8Z"
    />

    <path
      fill="#FBBC05"
      d="M6.51 14.07A5.9 5.9 0 0 1 6.2 12c0-.72.12-1.42.31-2.07V7.6H3.25A9.8 9.8 0 0 0 2.2 12c0 1.58.38 3.08 1.05 4.4l3.26-2.33Z"
    />

    <path
      fill="#EA4335"
      d="M12 5.89c1.44 0 2.73.49 3.75 1.46l2.81-2.81A9.43 9.43 0 0 0 12 2.2a9.8 9.8 0 0 0-8.75 5.4l3.26 2.33C7.29 7.61 9.45 5.89 12 5.89Z"
    />
  </Box>

  <Typography
    component="span"
    sx={{
      fontSize: "12.5px",

      fontWeight: 600,

      lineHeight: 1,

      color: "#344054",
    }}
  >
    Continue with Google
  </Typography>
</Box>
      <Box
        sx={{
          mt: 2,
          mb: 2,
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
          onClick={() => {
            if (registerLoading) return;

            setRegisterLoading(true);
            router.push("/Home/pages/Register");
          }}
          disabled={registerLoading}
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
          {registerLoading ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <CircularProgress
                size={13}
                thickness={5}
                color="inherit"
              />
              Loading...
            </Box>
          ) : (
            "Register"
          )}
        </Button>
      </Box>
    </>
  );
}