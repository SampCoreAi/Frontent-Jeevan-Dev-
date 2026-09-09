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
  Stack,
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
};

const medicalCouncils = [
  "National Medical Commission",
  "Madhya Pradesh Medical Council",
  "Delhi Medical Council",
  "Maharashtra Medical Council",
  "Karnataka Medical Council",
  "Tamil Nadu Medical Council",
];

const qualifications = [
  "MBBS",
  "MD",
  "MS",
  "DM",
  "MCh",
  "DNB",
  "BAMS",
  "BHMS",
];

const specializations = [
  "General Physician",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
];

export default function ProfessionalDetailsForm({
  data,
  onChange,
  onNext,
  onBack,
  loading = false,
  doctorRegistrationId,
}) {
  const handleChange = (event) => {
    onChange({
      [event.target.name]: event.target.value,
    });
  };
const isFormValid =
  Boolean(data.medicalRegistrationNumber?.trim()) &&
  Boolean(data.medicalCouncil?.trim()) &&
  Boolean(data.qualification?.trim()) &&
  Boolean(data.specialization?.trim());
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
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
      {/* Header */}

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

      {/* Registration ID info */}

      {doctorRegistrationId && (
        <Box
          sx={{
            mb: 3,
            px: 2,
            py: 1.5,
            borderRadius: "10px",
            bgcolor: COLORS.primaryLight,
            border: `1px solid ${COLORS.border}`,
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: COLORS.textSecondary,
            }}
          >
            Registration ID
          </Typography>

          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: COLORS.primary,
            }}
          >
            #{doctorRegistrationId}
          </Typography>
        </Box>
      )}

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.5,
          md: 3,
        }}
      >
        {/* Medical Registration Number */}

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
              sx={{ color: COLORS.error }}
            >
              *
            </Box>
          </Typography>

          <TextField
            fullWidth
            name="medicalRegistrationNumber"
            value={data.medicalRegistrationNumber || ""}
            onChange={handleChange}
            placeholder="Enter your registration number"
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: COLORS.textSecondary,
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Typography
            sx={{
              mt: 0.7,
              fontSize: "11px",
              color: COLORS.textSecondary,
            }}
          >
            Enter your valid medical registration number
          </Typography>
        </Grid>

        {/* Medical Council */}

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
              sx={{ color: COLORS.error }}
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
            sx={inputSx}
            SelectProps={{
              displayEmpty: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalanceOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: COLORS.textSecondary,
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
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: "11px",
              color: COLORS.textSecondary,
            }}
          >
            Select your state or national medical council
          </Typography>
        </Grid>

        {/* Qualification */}

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
              sx={{ color: COLORS.error }}
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
            sx={inputSx}
            SelectProps={{
              displayEmpty: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SchoolOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: COLORS.textSecondary,
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
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: "11px",
              color: COLORS.textSecondary,
            }}
          >
            Choose your highest medical qualification
          </Typography>
        </Grid>

        {/* Specialization */}

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
              sx={{ color: COLORS.error }}
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
            sx={inputSx}
            SelectProps={{
              displayEmpty: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MedicalServicesOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: COLORS.textSecondary,
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
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: "11px",
              color: COLORS.textSecondary,
            }}
          >
            Choose your area of specialization
          </Typography>
        </Grid>

        {/* Expiry Date */}

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
            sx={inputSx}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Typography
            sx={{
              mt: 0.7,
              fontSize: "11px",
              color: COLORS.textSecondary,
            }}
          >
            Select expiry date if applicable
          </Typography>
        </Grid>

        {/* Tip */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{
              minHeight: 120,
              p: 2,
              borderRadius: "12px",
              bgcolor: COLORS.primaryLight,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: COLORS.primary,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <LightbulbIcon sx={{ fontSize: 18 }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                }}
              >
                Keep your details accurate
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  lineHeight: 1.6,
                  color: COLORS.textSecondary,
                  mt: 0.5,
                }}
              >
                Make sure these details match your official
                medical registration documents.
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Bottom Buttons */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 4,
          pt: 2.5,
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <Button
          variant="outlined"
          onClick={onBack}
        disabled={loading || !isFormValid}
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

        <Button
          variant="contained"
          onClick={onNext}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
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
              boxShadow:
                "0 4px 12px rgba(27,110,79,0.18)",
            },
          }}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </Box>
    </Paper>
  );
}