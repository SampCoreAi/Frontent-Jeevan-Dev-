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

export default function RegisterForm({
  showMessage,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

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

      "&:hover .MuiOutlinedInput-notchedOutline":
        {
          borderColor: "primary.main",
        },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
        {
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

    "& .MuiFormHelperText-root": {
      mx: 0.5,
      mt: 0.5,
    },
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const fullName =
      formData.fullName.trim();

    const email =
      formData.email.trim().toLowerCase();

    const mobileNumber =
      formData.mobileNumber.trim();

    const password = formData.password;

    if (!fullName) {
      newErrors.fullName =
        "Full name is required";
    } else if (fullName.length < 2) {
      newErrors.fullName =
        "Name must be at least 2 characters";
    } else if (fullName.length > 60) {
      newErrors.fullName =
        "Name cannot exceed 60 characters";
    } else if (
      !/^[\p{L}\s.'-]+$/u.test(fullName)
    ) {
      newErrors.fullName =
        "Please enter a valid full name";
    }

    if (!mobileNumber) {
      newErrors.mobileNumber =
        "Mobile number is required";
    } else if (
      !/^[0-9]{10}$/.test(mobileNumber)
    ) {
      newErrors.mobileNumber =
        "Enter a valid 10-digit mobile number";
    }

    if (!email) {
      newErrors.email =
        "Email address is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    } else if (email.length > 254) {
      newErrors.email =
        "Email address is too long";
    }

    if (!password) {
      newErrors.password =
        "Password is required";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    } else if (password.length > 128) {
      newErrors.password =
        "Password is too long";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Add at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Add at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password =
        "Add at least one number";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleRegister = async (e) => {
    e?.preventDefault();

    if (loading) return;

    if (!validateForm()) {
      showMessage(
        "Please check the highlighted fields.",
        "error"
      );
      return;
    }

    const fullName =
      formData.fullName
        .trim()
        .replace(/\s+/g, " ");

    const email =
      formData.email
        .trim()
        .toLowerCase();

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          full_name: fullName,
          email,
          phone_number:
            formData.mobileNumber,
          password: formData.password,
          role_id: 1,
        }
      );

      const successMessage =
        response?.data?.message ||
        "Registration successful! A verification link has been sent to your email.";

      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
      });

      setErrors({});

      if (onSuccess) {
        onSuccess(successMessage);
      } else {
        showMessage(
          successMessage,
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data ||
          error.message
      );

      const status =
        error.response?.status;

      let errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";

      if (!error.response) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      } else if (status === 409) {
        errorMessage =
          error.response?.data?.message ||
          "An account with this email or mobile number already exists.";
      } else if (status === 429) {
        errorMessage =
          "Too many registration attempts. Please try again later.";
      } else if (status >= 500) {
        errorMessage =
          "Server error. Please try again after some time.";
      }

      showMessage(
        errorMessage,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      noValidate
      sx={{
        width: "100%",
      }}
    >
      <TextField
        fullWidth
        placeholder="Full Name"
        value={formData.fullName}
        onChange={(e) =>
          handleChange(
            "fullName",
            e.target.value
          )
        }
        error={Boolean(errors.fullName)}
        helperText={errors.fullName}
        disabled={loading}
        autoComplete="name"
        inputProps={{
          maxLength: 60,
          "aria-label": "Full Name",
        }}
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

      <TextField
        fullWidth
        placeholder="Mobile Number"
        value={formData.mobileNumber}
        onChange={(e) => {
          const value =
            e.target.value
              .replace(/\D/g, "")
              .slice(0, 10);

          handleChange(
            "mobileNumber",
            value
          );
        }}
        error={Boolean(
          errors.mobileNumber
        )}
        helperText={
          errors.mobileNumber
        }
        disabled={loading}
        autoComplete="tel"
        inputProps={{
          maxLength: 10,
          inputMode: "numeric",
          pattern: "[0-9]*",
          "aria-label": "Mobile Number",
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

      <TextField
        fullWidth
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) =>
          handleChange(
            "email",
            e.target.value
          )
        }
        error={Boolean(errors.email)}
        helperText={errors.email}
        disabled={loading}
        autoComplete="email"
        inputProps={{
          maxLength: 254,
          "aria-label": "Email Address",
        }}
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

      <TextField
        fullWidth
        type={
          showPassword
            ? "text"
            : "password"
        }
        placeholder="Password"
        value={formData.password}
        onChange={(e) =>
          handleChange(
            "password",
            e.target.value
          )
        }
        error={Boolean(
          errors.password
        )}
        helperText={errors.password}
        disabled={loading}
        autoComplete="new-password"
        inputProps={{
          maxLength: 128,
          "aria-label": "Password",
        }}
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
                type="button"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                edge="end"
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                sx={{
                  color:
                    "text.secondary",

                  "&:hover": {
                    color:
                      "primary.main",
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
          ),
        }}
      />

      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
        sx={{
          borderRadius: "8px",
          py: 1.8,

          fontSize: "1.1rem",
          fontWeight: 600,

          textTransform: "none",

          backgroundColor:
            "primary.main",

          color:
            "primary.contrastText",

          boxShadow: "none",

          "&:hover": {
            backgroundColor:
              "primary.dark",
            boxShadow: "none",
          },

          "&.Mui-disabled": {
            backgroundColor:
              "primary.light",

            color:
              "primary.contrastText",
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
              size={22}
              sx={{
                color:
                  "primary.contrastText",
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