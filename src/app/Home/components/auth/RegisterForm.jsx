"use client";

import { useState } from "react";

import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  Visibility,
  VisibilityOff,
  Person,
  Phone,
  Email,
  Lock,
  CheckCircleRounded,
  RadioButtonUncheckedRounded,
} from "@mui/icons-material";

import axios from "../../../../utils/axiosInstance";

export default function RegisterForm({
  showMessage,
  onSuccess,
}) {
  // =========================================================
  // STATE
  // =========================================================

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });
const router = useRouter();
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL;

  // =========================================================
  // PASSWORD RULES
  // =========================================================

  const passwordRules = [
    {
      label: "At least 8 characters",
      valid: formData.password.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(formData.password),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(formData.password),
    },
    {
      label: "One special character",
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(
        formData.password
      ),
    },
  ];

  // =========================================================
  // INPUT STYLE
  // =========================================================

  const inputSx = {
    mb: 2,

    "& .MuiOutlinedInput-root": {
      minHeight: 46,
      borderRadius: "9px",

      backgroundColor: "background.default",

      transition: "all 0.2s ease",

      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "divider",
        borderWidth: "1px",
      },

      "&:hover": {
        backgroundColor: "background.paper",
      },

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },

      "&.Mui-focused": {
        backgroundColor: "background.paper",

        boxShadow:
          "0 0 0 3px rgba(7, 135, 106, 0.06)",
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline":
        {
          borderColor: "primary.main",
          borderWidth: "1.5px",
        },

      "&.Mui-error .MuiOutlinedInput-notchedOutline":
        {
          borderColor: "error.main",
        },
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

    "& .MuiFormHelperText-root": {
      mx: 0.3,
      mt: 0.5,

      fontSize: "11px",
      lineHeight: 1.3,
    },
  };

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Remove current error while correcting input
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    const newErrors = {};

    const fullName = formData.fullName
      .trim()
      .replace(/\s+/g, " ");

    const mobileNumber =
      formData.mobileNumber.trim();

    const email = formData.email
      .trim()
      .toLowerCase();

    const password = formData.password;

    // ==========================
    // FULL NAME
    // ==========================

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

    // ==========================
    // MOBILE
    // ==========================

    if (!mobileNumber) {
      newErrors.mobileNumber =
        "Mobile number is required";
    } else if (
      !/^[0-9]{10}$/.test(mobileNumber)
    ) {
      newErrors.mobileNumber =
        "Enter a valid 10-digit mobile number";
    }

    // ==========================
    // EMAIL
    // ==========================

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
    } else if (!email.endsWith("@gmail.com")) {
      newErrors.email =
        "Only Gmail addresses are allowed";
    } else if (email.length > 254) {
      newErrors.email =
        "Email address is too long";
    }

    // ==========================
    // PASSWORD
    // ==========================

    if (!password) {
      newErrors.password =
        "Password is required";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    } else if (password.length > 128) {
      newErrors.password =
        "Password cannot exceed 128 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Add at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Add at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password =
        "Add at least one number";
    } else if (
      !/[!@#$%^&*(),.?":{}|<>]/.test(
        password
      )
    ) {
      newErrors.password =
        "Add at least one special character";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (event) => {
    event?.preventDefault();

    if (loading) return;

    // Validate first
    if (!validateForm()) {
      showMessage?.(
        "Please check the highlighted fields.",
        "error"
      );

      return;
    }

    // API ENV validation
    if (!API_URL) {
      showMessage?.(
        "API URL is not configured.",
        "error"
      );

      return;
    }

    const fullName = formData.fullName
      .trim()
      .replace(/\s+/g, " ");

    const email = formData.email
      .trim()
      .toLowerCase();

    const mobileNumber =
      formData.mobileNumber.trim();

    try {
      // ==========================
      // START LOADING
      // ==========================

      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          full_name: fullName,
          email,

          phone_number: mobileNumber,

          password: formData.password,

          role_id: 1,
        }
      );

      const successMessage =
        response?.data?.message ||
        "Registration successful! A verification link has been sent to your email.";

      // ==========================
      // CLEAR FORM
      // ==========================

      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        password: "",
      });

      setErrors({});

      // ==========================
      // SUCCESS
      // ==========================

      if (onSuccess) {
        onSuccess(successMessage);
      } else {
        showMessage?.(
          successMessage,
          "success"
        );
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error?.response?.data ||
          error?.message
      );

      const status =
        error?.response?.status;

      let errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed. Please try again.";

      // ==========================
      // NETWORK ERROR
      // ==========================

      if (!error.response) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      // ==========================
      // VALIDATION ERROR
      // ==========================

      else if (status === 400) {
        errorMessage =
          error?.response?.data?.message ||
          "Please check your registration details.";
      }

      // ==========================
      // ALREADY EXISTS
      // ==========================

      else if (status === 409) {
        errorMessage =
          error?.response?.data?.message ||
          "An account with this email or mobile number already exists.";
      }

      // ==========================
      // TOO MANY REQUESTS
      // ==========================

      else if (status === 429) {
        errorMessage =
          "Too many registration attempts. Please try again later.";
      }

      // ==========================
      // SERVER ERROR
      // ==========================

      else if (status >= 500) {
        errorMessage =
          "Server error. Please try again after some time.";
      }

      showMessage?.(
        errorMessage,
        "error"
      );
    } finally {
      // ==========================
      // STOP LOADING
      // ==========================

      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
      noValidate
      sx={{
        width: "100%",
      }}
    >
      {/* =====================================================
          FULL NAME
      ===================================================== */}

      <TextField
        fullWidth
        placeholder="Full Name"
        value={formData.fullName}
        disabled={loading}
        autoComplete="name"
        error={Boolean(errors.fullName)}
        helperText={errors.fullName}
        onChange={(event) =>
          handleChange(
            "fullName",
            event.target.value
          )
        }
        inputProps={{
          maxLength: 60,
          "aria-label": "Full Name",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person
                sx={{
                  color: "primary.main",
                  fontSize: 18,
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={inputSx}
      />

      {/* =====================================================
          MOBILE
      ===================================================== */}

      <TextField
        fullWidth
        placeholder="Mobile Number"
        value={formData.mobileNumber}
        disabled={loading}
        autoComplete="tel"
        error={Boolean(
          errors.mobileNumber
        )}
        helperText={
          errors.mobileNumber
        }
        onChange={(event) => {
          // Numbers only + max 10 digits
          const value =
            event.target.value
              .replace(/\D/g, "")
              .slice(0, 10);

          handleChange(
            "mobileNumber",
            value
          );
        }}
        inputProps={{
          maxLength: 10,
          inputMode: "numeric",
          pattern: "[0-9]*",
          "aria-label": "Mobile Number",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Phone
                sx={{
                  color: "primary.main",
                  fontSize: 18,
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={inputSx}
      />

      {/* =====================================================
          EMAIL
      ===================================================== */}

      <TextField
        fullWidth
        type="email"
        placeholder="Email Address"
        value={formData.email}
        disabled={loading}
        autoComplete="email"
        error={Boolean(errors.email)}
        helperText={errors.email}
        onChange={(event) =>
          handleChange(
            "email",
            event.target.value
          )
        }
        inputProps={{
          maxLength: 254,
          "aria-label": "Email Address",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email
                sx={{
                  color: "primary.main",
                  fontSize: 18,
                }}
              />
            </InputAdornment>
          ),
        }}
        sx={inputSx}
      />

      {/* =====================================================
          PASSWORD
      ===================================================== */}

      <TextField
        fullWidth
        type={
          showPassword
            ? "text"
            : "password"
        }
        placeholder="Password"
        value={formData.password}
        disabled={loading}
        autoComplete="new-password"
        error={Boolean(errors.password)}
        helperText={errors.password}
        onChange={(event) =>
          handleChange(
            "password",
            event.target.value
          )
        }
        inputProps={{
          maxLength: 128,
          "aria-label": "Password",
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock
                sx={{
                  color: "primary.main",
                  fontSize: 18,
                }}
              />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                edge="end"
                size="small"
                disabled={loading}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                onMouseDown={(event) =>
                  event.preventDefault()
                }
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
                    sx={{ fontSize: 19 }}
                  />
                ) : (
                  <Visibility
                    sx={{ fontSize: 19 }}
                  />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          ...inputSx,
          mb: errors.password ? 1 : 1.4,
        }}
      />

      {/* =====================================================
          LIVE PASSWORD VALIDATION
      ===================================================== */}

      <Box
        sx={{
          mb: 2.4,
          p: 1.4,

          borderRadius: "9px",

          border:
            "1px solid rgba(7,135,106,0.12)",

          backgroundColor:
            "rgba(7,135,106,0.035)",
        }}
      >
        <Typography
          sx={{
            mb: 1,

            color: "text.primary",

            fontSize: "11.5px",
            fontWeight: 600,
          }}
        >
          Password must contain
        </Typography>

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },

            columnGap: 1.5,
            rowGap: 0.8,
          }}
        >
          {passwordRules.map(
            (rule) => {
              const RuleIcon =
                rule.valid
                  ? CheckCircleRounded
                  : RadioButtonUncheckedRounded;

              return (
                <Box
                  key={rule.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.65,
                  }}
                >
                  <RuleIcon
                    sx={{
                      flexShrink: 0,

                      fontSize: 14,

                      color: rule.valid
                        ? "primary.main"
                        : "text.disabled",

                      transition:
                        "all 0.2s ease",
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: "10.5px",

                      lineHeight: 1.25,

                      color: rule.valid
                        ? "primary.main"
                        : "text.secondary",

                      fontWeight:
                        rule.valid
                          ? 600
                          : 400,

                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    {rule.label}
                  </Typography>
                </Box>
              );
            }
          )}
        </Box>
      </Box>

      {/* =====================================================
          REGISTER BUTTON
      ===================================================== */}

      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{
          minHeight: 44,

          borderRadius: "9px",

          fontSize: "13px",
          fontWeight: 600,

          textTransform: "none",

          backgroundColor:
            "primary.main",

          color:
            "primary.contrastText",

          boxShadow:
            "0 6px 18px rgba(7,135,106,0.16)",

          transition:
            "all 0.2s ease",

          "&:hover": {
            backgroundColor:
              "primary.dark",

            boxShadow:
              "0 8px 22px rgba(7,135,106,0.22)",
          },

          "&:active": {
            transform: "scale(0.995)",
          },

          "&.Mui-disabled": {
            backgroundColor:
              "primary.main",

            color:
              "primary.contrastText",

            opacity: 0.7,
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
                color: "inherit",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Creating account...
            </Typography>
          </Box>
        ) : (
          "Create Account"
        )}
      </Button>
      <Box
  sx={{
    mt: 1,
    mb: 1,
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
    Already have an account?
  </Typography>

  <Button
    type="button"
    variant="text"
    disabled={loading || loginLoading}
    onClick={() => {
      if (loading || loginLoading) return;

      setLoginLoading(true);
      router.push("/Home/pages/Login");
    }}
    sx={{
      minWidth: "auto",
      p: 0,
      fontSize: "12.5px",
      fontWeight: 700,
      color: "primary.main",
      textTransform: "none",

      "&:hover": {
        backgroundColor: "transparent",
        color: "primary.dark",
        textDecoration: "underline",
      },
    }}
  >
    {loginLoading ? (
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
      "Log In"
    )}
  </Button>
</Box>
    </Box>
  );
}