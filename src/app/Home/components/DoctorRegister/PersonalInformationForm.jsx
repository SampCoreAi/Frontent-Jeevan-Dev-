"use client";

import * as React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutline";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import OnboardingHeader from "./OnboardingHeader";

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#15593E",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  inputBorder: "#DCE5E0",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  error: "#E0483C",
  white: "#FFFFFF",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: COLORS.white,
    minHeight: "52px",

    "& fieldset": {
      borderColor: COLORS.inputBorder,
    },

    "&:hover fieldset": {
      borderColor: COLORS.primary,
    },

    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary,
      borderWidth: "1.5px",
    },
  },

  "& .MuiInputBase-input": {
    fontSize: "14px",
  },

  "& .MuiFormHelperText-root": {
    marginLeft: "4px",
    marginTop: "6px",
    fontSize: "11px",
  },
};

export default function PersonalInfoForm({
  data,
  onChange,
  onNext,
  loading,
  errors = {},
}) {
  // Local validation errors
  const [validationErrors, setValidationErrors] = React.useState({});

  // Merge parent/API errors + local errors
  const allErrors = {
    ...errors,
    ...validationErrors,
  };

  // ==========================================
  // VALIDATION FUNCTIONS
  // ==========================================

  const validateFullName = (value) => {
    const name = value?.trim() || "";

    if (!name) {
      return "Full name is required";
    }

    if (name.length < 3) {
      return "Full name must be at least 3 characters";
    }

    if (name.length > 50) {
      return "Full name cannot exceed 50 characters";
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
      return "Only letters and spaces are allowed";
    }

    if (/\s{2,}/.test(name)) {
      return "Multiple spaces are not allowed";
    }

    return "";
  };

  const validateGender = (value) => {
    if (!value) {
      return "Please select your gender";
    }

    const allowedGenders = ["male", "female", "other"];

    if (!allowedGenders.includes(value)) {
      return "Please select a valid gender";
    }

    return "";
  };

 const validateDob = (value) => {
  if (!value) {
    return "Date of birth is required";
  }

  const dob = new Date(`${value}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(dob.getTime()) || dob > today) {
    return "Please enter a valid date of birth";
  }

  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthday =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() &&
      today.getDate() >= dob.getDate());

  if (!hasHadBirthday) age--;

  if (age < 18) return "You must be at least 18 years old";
  if (age > 100) return "Age cannot be greater than 100";

  return "";
};

const validateEmail = (value) => {
  const email = value?.trim().toLowerCase() || "";

  if (!email) {
    return "Email address is required";
  }

  if (email.includes(" ")) {
    return "Email cannot contain spaces";
  }

  if (email.length > 100) {
    return "Email address is too long";
  }

  // Only Gmail addresses allowed
  const gmailRegex =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@gmail\.com$/i;

  if (!gmailRegex.test(email)) {
    return "Please enter a valid Gmail address";
  }

  return "";
};

  const validateMobile = (value) => {
    const mobile = value || "";

    if (!mobile) {
      return "Mobile number is required";
    }

    if (!/^\d+$/.test(mobile)) {
      return "Mobile number can contain only digits";
    }

    if (mobile.length !== 10) {
      return "Mobile number must be exactly 10 digits";
    }

    if (!/^[6-9]/.test(mobile)) {
      return "Enter a valid Indian mobile number";
    }

    return "";
  };

  // ==========================================
  // VALIDATE SINGLE FIELD
  // ==========================================

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "fullName":
        error = validateFullName(value);
        break;

      case "gender":
        error = validateGender(value);
        break;

     case "dob":
  error = validateDob(value);
  break;

      case "email":
        error = validateEmail(value);
        break;

      case "mobile":
        error = validateMobile(value);
        break;

      default:
        break;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return !error;
  };

  // ==========================================
  // NORMAL CHANGE
  // ==========================================

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    onChange({
      [field]: value,
    });

    // If field already has error, validate while typing
    if (validationErrors[field] || errors[field]) {
      validateField(field, value);
    }
  };

  // ==========================================
  // BLUR VALIDATION
  // ==========================================

  const handleBlur = (field) => () => {
    validateField(field, data[field]);
  };
const validateForm = () => {
  const newErrors = {
    fullName: validateFullName(data.fullName),
    gender: validateGender(data.gender),
    dob: validateDob(data.dob),
    email: validateEmail(data.email),
    mobile: validateMobile(data.mobile),
  };

  Object.keys(newErrors).forEach((key) => {
    if (!newErrors[key]) {
      delete newErrors[key];
    }
  });

  setValidationErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};
const handleNext = () => {
  if (!validateForm()) {
    setTimeout(() => {
      document
        .getElementById("personal-info-form")
        ?.querySelector('[aria-invalid="true"]')
        ?.focus();
    }, 0);
    return;
  }

  onNext();
};

  return (
    <Paper
     id="personal-info-form"
      elevation={0}
      sx={{
        width: "100%",
        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        height: "525px",
        border: `1px solid ${COLORS.border}`,
        borderRadius: {
          xs: "14px",
          sm: "18px",
        },
        backgroundColor: COLORS.white,
        fontFamily:
          "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <OnboardingHeader />
 <Stack
        direction="row"
        spacing={{ xs: 1, sm: 1.2 }}
        alignItems="flex-start"
        sx={{
          p: {
            xs: 1.2,
            sm: 1.4,
          },

          borderRadius: "9px",
          bgcolor: COLORS.primaryLight,

          mb: {
            xs: 2,
            sm: 2.5,
          },
        }}
      >
        {/* Info Icon */}
        <Box
          sx={{
            width: {
              xs: 20,
              sm: 22,
            },

            height: {
              xs: 20,
              sm: 22,
            },

            flexShrink: 0,

            borderRadius: "50%",
            bgcolor: COLORS.primary,
            color: COLORS.white,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            mt: "1px",
          }}
        >
          <InfoOutlinedIcon
            sx={{
              fontSize: {
                xs: 12,
                sm: 13,
              },
            }}
          />
        </Box>

        {/* Info Content */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,

              fontSize: {
                xs: "0.72rem",
                sm: "0.76rem",
                md: "0.78rem",
              },

              lineHeight: 1.35,
            }}
          >
            Why do we collect this information?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mt: 0.2,

              color: COLORS.textSecondary,

              fontSize: {
                xs: "0.67rem",
                sm: "0.71rem",
                md: "0.73rem",
              },

              lineHeight: 1.45,
            }}
          >
            To verify your identity, communicate with you, and create your
            doctor account after approval.
          </Typography>
        </Box>
      </Stack>
      <Divider
        sx={{
          my: {
            xs: 2,
            sm: 2.5,
          },
          borderColor: COLORS.border,
        }}
      />

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.25,
          md: 2.5,
        }}
      >
        {/* =========================
            FULL NAME
        ========================== */}

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.6,
              fontSize: "12px",
              lineHeight: 1.4,
            }}
          >
            Full Name{" "}
            <Box component="span" sx={{ color: COLORS.error }}>
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            placeholder="Enter your full name"
            value={data.fullName || ""}
            onChange={(e) => {
              // Only letters and spaces
              let value = e.target.value;

              value = value
                .replace(/[^A-Za-z ]/g, "")
                .replace(/\s{2,}/g, " ")
                .slice(0, 50);

              onChange({
                fullName: value,
              });

              if (
                validationErrors.fullName ||
                errors.fullName
              ) {
                validateField("fullName", value);
              }
            }}
            onBlur={handleBlur("fullName")}
            error={Boolean(allErrors.fullName)}
            helperText={
              allErrors.fullName ||
              "As per your medical registration"
            }
            sx={inputSx}
            inputProps={{
              maxLength: 50,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlinedIcon
                    sx={{
                      fontSize: 17,
                      color: allErrors.fullName
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =========================
            GENDER
        ========================== */}

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.6,
              fontSize: "12px",
              lineHeight: 1.4,
            }}
          >
            Gender{" "}
            <Box component="span" sx={{ color: COLORS.error }}>
              *
            </Box>
          </Typography>

          <FormControl
            fullWidth
            error={Boolean(allErrors.gender)}
            sx={inputSx}
          >
            <Select
              displayEmpty
              value={data.gender || ""}
              onChange={(e) => {
                const value = e.target.value;

                onChange({
                  gender: value,
                });

                validateField("gender", value);
              }}
              onBlur={handleBlur("gender")}
              startAdornment={
                <InputAdornment position="start">
                  <Person2OutlinedIcon
                    sx={{
                      fontSize: 17,
                      color: allErrors.gender
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              }
              renderValue={(selected) =>
                selected ? (
                  selected
                    .replaceAll("_", " ")
                    .replace(/\b\w/g, (c) =>
                      c.toUpperCase()
                    )
                ) : (
                  <Box
                    sx={{
                      color: COLORS.textSecondary,
                      fontSize: "12.5px",
                    }}
                  >
                    Select gender
                  </Box>
                )
              }
            >
              <MenuItem
                value="male"
                sx={{ fontSize: "12.5px" }}
              >
                Male
              </MenuItem>

              <MenuItem
                value="female"
                sx={{ fontSize: "12.5px" }}
              >
                Female
              </MenuItem>

              <MenuItem
                value="other"
                sx={{ fontSize: "12.5px" }}
              >
                Other
              </MenuItem>
            </Select>

            {allErrors.gender && (
              <FormHelperText>
                {allErrors.gender}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

     <Grid size={{ xs: 12, sm: 6, md: 4 }}>
  <Typography
    sx={{
      fontWeight: 600,
      color: COLORS.textPrimary,
      mb: 0.6,
      fontSize: "12px",
      lineHeight: 1.4,
    }}
  >
    Date of Birth{" "}
    <Box component="span" sx={{ color: COLORS.error }}>
      *
    </Box>
  </Typography>

  <TextField
    fullWidth
    type="date"
    value={data.dob || ""}
    onChange={(e) => {
      const value = e.target.value;

      onChange({ dob: value });

      if (validationErrors.dob || errors.dob) {
        validateField("dob", value);
      }
    }}
    onBlur={handleBlur("dob")}
    error={Boolean(allErrors.dob)}
    helperText={allErrors.dob || "Enter your date of birth"}
    sx={inputSx}
    inputProps={{
      max: new Date().toISOString().split("T")[0],
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <CalendarTodayOutlinedIcon
            sx={{
              fontSize: 17,
              color: allErrors.dob
                ? COLORS.error
                : COLORS.textSecondary,
            }}
          />
        </InputAdornment>
      ),
    }}
  />
</Grid>

        {/* =========================
            EMAIL
        ========================== */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.6,
              fontSize: "12px",
              lineHeight: 1.4,
            }}
          >
            Email Address{" "}
            <Box component="span" sx={{ color: COLORS.error }}>
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email address"
            value={data.email || ""}
            onChange={(e) => {
              // Remove spaces
              const value = e.target.value
                .replace(/\s/g, "")
                .slice(0, 100);

              onChange({
                email: value,
              });

              if (
                validationErrors.email ||
                errors.email
              ) {
                validateField("email", value);
              }
            }}
            onBlur={handleBlur("email")}
            error={Boolean(allErrors.email)}
            helperText={
              allErrors.email ||
              "We'll use this email for important account updates"
            }
            sx={inputSx}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon
                    sx={{
                      fontSize: 17,
                      color: allErrors.email
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =========================
            MOBILE NUMBER
        ========================== */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              fontWeight: 600,
              color: COLORS.textPrimary,
              mb: 0.6,
              fontSize: "12px",
              lineHeight: 1.4,
            }}
          >
            Mobile Number{" "}
            <Box component="span" sx={{ color: COLORS.error }}>
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            type="tel"
            placeholder="Enter mobile number"
            value={data.mobile || ""}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 10);

              onChange({
                mobile: value,
              });

              if (
                validationErrors.mobile ||
                errors.mobile
              ) {
                validateField("mobile", value);
              }
            }}
            onBlur={handleBlur("mobile")}
            error={Boolean(allErrors.mobile)}
            helperText={
              allErrors.mobile ||
              "Enter your 10-digit mobile number"
            }
            sx={inputSx}
            inputProps={{
              maxLength: 10,
              inputMode: "numeric",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.7}
                  >
                    <PhoneOutlinedIcon
                      sx={{
                        fontSize: 17,
                        color: allErrors.mobile
                          ? COLORS.error
                          : COLORS.textSecondary,
                      }}
                    />

                    <Typography
                      sx={{
                        color: COLORS.textPrimary,
                        fontSize: "12.5px",
                        fontWeight: 500,
                      }}
                    >
                      +91
                    </Typography>
                  </Stack>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* =========================
          NEXT BUTTON
      ========================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",

          mt: {
            xs: 2.5,
            sm: 3,
          },

          pt: {
            xs: 1.8,
            sm: 2,
          },

        }}
      >
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress
                size={15}
                color="inherit"
              />
            ) : (
              <ArrowForwardIcon
                sx={{
                  fontSize: "17px !important",
                }}
              />
            )
          }
          sx={{
            minWidth: {
              xs: "110px",
              sm: "130px",
            },

            height: {
              xs: "40px",
              sm: "42px",
            },

            px: 2.5,
            borderRadius: "9px",
            backgroundColor: COLORS.primary,
            textTransform: "none",
            fontSize: "12.5px",
            fontWeight: 600,
            boxShadow: "none",

            "&:hover": {
              backgroundColor: COLORS.primaryHover,
              boxShadow:
                "0 4px 12px rgba(27, 110, 79, 0.18)",
            },

            "&.Mui-disabled": {
              backgroundColor: "#A8BDB3",
              color: "#FFFFFF",
            },
          }}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </Box>
    </Paper>
  );
}