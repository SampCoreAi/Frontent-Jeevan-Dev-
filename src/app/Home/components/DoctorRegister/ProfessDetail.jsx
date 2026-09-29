"use client";

import * as React from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";

import LightbulbIcon from "@mui/icons-material/Lightbulb";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import OnboardingHeader from "./OnboardingHeader";

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#15593E",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  inputBorder: "#DCE5E0",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
  error: "#E53935",
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

  "& .MuiSelect-select": {
    fontSize: "14px",
  },

  "& .MuiFormHelperText-root": {
    marginLeft: "4px",
    marginTop: "5px",
    fontSize: "11px",
    lineHeight: 1.35,
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      mt: 0.5,
      borderRadius: "10px",
      border: `1px solid ${COLORS.border}`,
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      maxHeight: 320,

      "& .MuiMenuItem-root": {
        minHeight: "40px",
        fontSize: "14px",
        fontWeight: 400,
        color: "#1F2A24",
      },

      // Placeholder / disabled option
      "& .MuiMenuItem-root.Mui-disabled": {
        color: "#1F2A24 !important",
        opacity: "1 !important",
        backgroundColor: "#F7F9F8",
      },

      "& .MuiMenuItem-root:hover": {
        backgroundColor: "#F4F7F5",
        color: "#1F2A24",
      },

      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: "#F0F5F2",
        color: "#1F2A24",
      },

      "& .MuiMenuItem-root.Mui-selected:hover": {
        backgroundColor: "#E8F0EC",
        color: "#1F2A24",
      },
    },
  },
};

/* =========================================================
   OPTIONS
========================================================= */

const medicalCouncils = [
  "National Medical Commission",
  "Madhya Pradesh Medical Council",
  "Delhi Medical Council",
  "Maharashtra Medical Council",
  "Karnataka Medical Council",
  "Tamil Nadu Medical Council",
];

const qualifications = ["MBBS", "MD", "MS", "DM", "MCh", "DNB", "BAMS", "BHMS"];

const specializations = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
];

/* =========================================================
   COMPONENT
========================================================= */

export default function ProfessionalDetailsForm({
  data,
  onChange,
  onNext,
  onBack,
  loading = false,
  doctorRegistrationId,
}) {
  const [errors, setErrors] = React.useState({});

  /* =======================================================
     HELPERS
  ======================================================= */

  const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =======================================================
     MEDICAL REGISTRATION NUMBER VALIDATION
  ======================================================= */

  const validateRegistrationNumber = (value) => {
    const registrationNumber = String(value || "").trim();

    if (!registrationNumber) {
      return "Medical registration number is required.";
    }

    if (registrationNumber.length < 4) {
      return "Registration number must be at least 4 characters.";
    }

    if (registrationNumber.length > 30) {
      return "Registration number cannot exceed 30 characters.";
    }

    /*
      Allows:
      ABC12345
      MP/12345/2025
      MP-12345
      MCI/MP/123456
    */
    if (!/^[A-Za-z0-9/-]+$/.test(registrationNumber)) {
      return "Only letters, numbers, / and - are allowed.";
    }

    // Must contain at least one number
    if (!/\d/.test(registrationNumber)) {
      return "Registration number must contain a number.";
    }

    // Prevent only special characters
    if (!/[A-Za-z0-9]/.test(registrationNumber)) {
      return "Please enter a valid registration number.";
    }

    return "";
  };

  /* =======================================================
     MEDICAL COUNCIL VALIDATION
  ======================================================= */

  const validateMedicalCouncil = (value) => {
    if (!value) {
      return "Medical council is required.";
    }

    if (!medicalCouncils.includes(value)) {
      return "Please select a valid medical council.";
    }

    return "";
  };

  /* =======================================================
     QUALIFICATION VALIDATION
  ======================================================= */

  const validateQualification = (value) => {
    if (!value) {
      return "Qualification is required.";
    }

    if (!qualifications.includes(value)) {
      return "Please select a valid medical qualification.";
    }

    return "";
  };

  /* =======================================================
     SPECIALIZATION VALIDATION
  ======================================================= */

  const validateSpecialization = (value) => {
    if (!value) {
      return "Specialization is required.";
    }

    if (!specializations.includes(value)) {
      return "Please select a valid specialization.";
    }

    return "";
  };

  /* =======================================================
     EXPIRY DATE VALIDATION
  ======================================================= */

  const validateExpiryDate = (value) => {
    // Optional field
    if (!value) {
      return "";
    }

    const selectedDate = new Date(`${value}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      return "Please enter a valid expiry date.";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Medical registration has already expired.";
    }

    return "";
  };

  /* =======================================================
     SINGLE FIELD VALIDATION
  ======================================================= */

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "medicalRegistrationNumber":
        error = validateRegistrationNumber(value);
        break;

      case "medicalCouncil":
        error = validateMedicalCouncil(value);
        break;

      case "qualification":
        error = validateQualification(value);
        break;

      case "specialization":
        error = validateSpecialization(value);
        break;

      case "registrationExpiryDate":
        error = validateExpiryDate(value);
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  };

  /* =======================================================
     CHANGE HANDLER
  ======================================================= */

  const handleChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;

    /*
      Registration number:
      - uppercase
      - no spaces
      - only letters/numbers/-/
      - max 30
    */
    if (name === "medicalRegistrationNumber") {
      value = value
        .toUpperCase()
        .replace(/\s/g, "")
        .replace(/[^A-Z0-9/-]/g, "")
        .slice(0, 30);
    }

    onChange({
      [name]: value,
    });

    /*
      Once error is visible,
      validate while user fixes it.
    */
    if (errors[name]) {
      validateField(name, value);
    }
  };

  /* =======================================================
     BLUR HANDLER
  ======================================================= */

  const handleBlur = (event) => {
    const { name, value } = event.target;

    validateField(name, value);
  };

  /* =======================================================
     COMPLETE FORM VALIDATION
  ======================================================= */

  const validateForm = () => {
    const newErrors = {
      medicalRegistrationNumber: validateRegistrationNumber(
        data.medicalRegistrationNumber,
      ),

      medicalCouncil: validateMedicalCouncil(data.medicalCouncil),

      qualification: validateQualification(data.qualification),

      specialization: validateSpecialization(data.specialization),

      registrationExpiryDate: validateExpiryDate(data.registrationExpiryDate),
    };

    // Remove empty error values
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    const valid = validateForm();

    if (!valid) {
      return;
    }

    onNext();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minHeight: "100%",

        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        border: `1px solid ${COLORS.border}`,

        borderRadius: {
          xs: "14px",
          sm: "18px",
        },

        backgroundColor: COLORS.white,
      }}
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <OnboardingHeader />

      <Divider
        sx={{
          my: {
            xs: 2.5,
            sm: 3,
          },

          borderColor: COLORS.border,
        }}
      />

      {/* ===================================================
          FORM
      =================================================== */}

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.5,
          md: 3,
        }}
      >
        {/* =================================================
            MEDICAL REGISTRATION NUMBER
        ================================================= */}
        {/* =================================================
    MEDICAL REGISTRATION NUMBER
================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              mb: 0.8,
              fontWeight: 600,
              fontSize: "14px",
              color: COLORS.textPrimary,
            }}
          >
            Medical Registration Number{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.error,
              }}
            >
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            name="medicalRegistrationNumber"
            value={data.medicalRegistrationNumber || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g. MP/12345/2025"
            error={Boolean(errors.medicalRegistrationNumber)}
            helperText={
              errors.medicalRegistrationNumber ||
              "Enter exactly as shown on your medical registration"
            }
            sx={{
              ...inputSx,

              "& .MuiInputBase-input::placeholder": {
                color: "#1F2A24",
                opacity: 0.65,
              },
            }}
            inputProps={{
              maxLength: 30,
              autoComplete: "off",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: errors.medicalRegistrationNumber
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
    MEDICAL COUNCIL
================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              mb: 0.8,
              fontWeight: 600,
              fontSize: "14px",
              color: COLORS.textPrimary,
            }}
          >
            Medical Council{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.error,
              }}
            >
              *
            </Box>
          </Typography>

          <TextField
            select
            fullWidth
            name="medicalCouncil"
            value={data.medicalCouncil || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.medicalCouncil)}
            helperText={
              errors.medicalCouncil ||
              "Select the council where you are registered"
            }
            sx={{
              ...inputSx,

              // Selected text black
              "& .MuiSelect-select": {
                color: "#1F2A24",
                fontSize: "14px",
              },
            }}
            SelectProps={{
              displayEmpty: true,
              MenuProps: selectMenuProps,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: errors.medicalCouncil
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="" disabled>
              Select your medical council
            </MenuItem>

            {medicalCouncils.map((item) => (
              <MenuItem
                key={item}
                value={item}
                sx={{
                  color: "#1F2A24",
                }}
              >
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* =================================================
    QUALIFICATION
================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              mb: 0.8,
              fontWeight: 600,
              fontSize: "14px",
              color: COLORS.textPrimary,
            }}
          >
            Qualification{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.error,
              }}
            >
              *
            </Box>
          </Typography>

          <TextField
            select
            fullWidth
            name="qualification"
            value={data.qualification || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.qualification)}
            helperText={
              errors.qualification ||
              "Select your highest medical qualification"
            }
            sx={{
              ...inputSx,

              "& .MuiSelect-select": {
                color: "#1F2A24",
                fontSize: "14px",
              },
            }}
            SelectProps={{
              displayEmpty: true,
              MenuProps: selectMenuProps,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: errors.qualification
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="" disabled>
              Select your highest qualification
            </MenuItem>

            {qualifications.map((item) => (
              <MenuItem
                key={item}
                value={item}
                sx={{
                  color: "#1F2A24",
                }}
              >
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* =================================================
    SPECIALIZATION
================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              mb: 0.8,
              fontWeight: 600,
              fontSize: "14px",
              color: COLORS.textPrimary,
            }}
          >
            Specialization{" "}
            <Box
              component="span"
              sx={{
                color: COLORS.error,
              }}
            >
              *
            </Box>
          </Typography>

          <TextField
            select
            fullWidth
            name="specialization"
            value={data.specialization || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.specialization)}
            helperText={
              errors.specialization ||
              "Select your primary medical specialization"
            }
            sx={{
              ...inputSx,

              "& .MuiSelect-select": {
                color: "#1F2A24",
                fontSize: "14px",
              },
            }}
            SelectProps={{
              displayEmpty: true,
              MenuProps: selectMenuProps,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MedicalServicesOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: errors.specialization
                        ? COLORS.error
                        : COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="" disabled>
              Select your specialization
            </MenuItem>

            {specializations.map((item) => (
              <MenuItem
                key={item}
                value={item}
                sx={{
                  color: "#1F2A24",
                }}
              >
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* =================================================
            REGISTRATION EXPIRY DATE
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              mb: 0.8,
              fontWeight: 600,
              fontSize: "14px",
              color: COLORS.textPrimary,
            }}
          >
            Registration Expiry Date
          </Typography>

          <TextField
            fullWidth
            type="date"
            name="registrationExpiryDate"
            value={data.registrationExpiryDate || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.registrationExpiryDate)}
            helperText={
              errors.registrationExpiryDate ||
              "Leave blank if your registration has no expiry date"
            }
            inputProps={{
              min: getToday(),
            }}
            sx={inputSx}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* =================================================
            INFORMATION BOX
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
       

              display: "flex",
              alignItems: "center",

              px: 2,
              py: 1.5,
mt:3,
              borderRadius: "10px",

              border: `1px solid ${COLORS.border}`,

              backgroundColor: "#F8FBF9",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.2,
              }}
            >
              <LightbulbIcon
                sx={{
                  fontSize: 19,
                  color: COLORS.primary,
                  mt: "2px",
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: COLORS.textPrimary,
                    mb: 0.3,
                  }}
                >
                  Registration details
                </Typography>

                <Typography
                  sx={{
                    fontSize: "11.5px",
                    lineHeight: 1.5,
                    color: COLORS.textSecondary,
                  }}
                >
                  Enter details exactly as registered.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* ===================================================
          BUTTONS
      =================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          mt: 4,
          pt: 2,

          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        {/* BACK */}

        <Button
          variant="outlined"
          onClick={onBack}
          // Back should NOT depend on form validity
          disabled={loading}
          startIcon={<ArrowBackIcon />}
          sx={{
            height: 46,
            minWidth: 120,

            borderRadius: "10px",

            borderColor: COLORS.border,

            color: COLORS.textPrimary,

            textTransform: "none",

            fontWeight: 600,

            "&:hover": {
              borderColor: COLORS.primary,
              color: COLORS.primary,
              bgcolor: COLORS.primaryLight,
            },
          }}
        >
          Back
        </Button>

        {/* NEXT */}

        <Button
          variant="contained"
          // Important:
          // validate first, API call after validation
          onClick={handleNext}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <ArrowForwardIcon />
            )
          }
          sx={{
            height: 46,
            minWidth: 140,

            borderRadius: "10px",

            bgcolor: COLORS.primary,

            textTransform: "none",

            fontWeight: 600,

            boxShadow: "none",

            "&:hover": {
              bgcolor: COLORS.primaryHover,

              boxShadow: "0 4px 12px rgba(27,110,79,0.18)",
            },

            "&.Mui-disabled": {
              bgcolor: "#A8BDB3",
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
