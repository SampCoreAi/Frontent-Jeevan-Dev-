"use client";

import * as React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import OnboardingHeader from "./OnboardingHeader";

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#15593E",
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
};

const Label = ({ children, required = false }) => (
  <Typography
    sx={{
      fontWeight: 600,
      color: COLORS.textPrimary,
      mb: 0.8,
      fontSize: "14px",
    }}
  >
    {children}

    {required && (
      <Box component="span" sx={{ color: COLORS.error }}>
        {" "}
        *
      </Box>
    )}
  </Typography>
);

export default function HospitalDetailsForm({
  data,
  onChange,
  onNext,
  onBack,
  loading = false,
}) {
  const handleChange = (field) => (e) => {
    onChange({
      [field]: e.target.value,
    });
  };

  const hospitalData = data?.hospitalDetail || {};

  const handleHospitalChange = (field) => (e) => {
    onChange({
      hospitalDetail: {
        ...hospitalData,
        [field]: e.target.value,
      },
    });
  };

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

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: {
              xs: "20px",
              sm: "23px",
            },
            fontWeight: 700,
            color: COLORS.textPrimary,
          }}
        >
          Hospital / Clinic Details
        </Typography>

        <Typography
          sx={{
            color: COLORS.textSecondary,
            fontSize: "13px",
            mt: 0.5,
          }}
        >
          Enter the hospital or clinic details where you currently practice.
        </Typography>
      </Box>

      <Grid
        container
        spacing={{
          xs: 2,
          sm: 2.5,
          md: 3,
        }}
      >
        {/* HOSPITAL NAME */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>Hospital / Clinic Name</Label>

          <TextField
            fullWidth
            placeholder="e.g. MG Hospital"
            value={hospitalData.hospitalName || ""}
            onChange={handleHospitalChange("hospitalName")}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalHospitalOutlinedIcon
                    fontSize="small"
                    sx={{ color: COLORS.textSecondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* FLAT / PLOT */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>Flat / Plot No.</Label>

          <TextField
            fullWidth
            placeholder="e.g. 12"
            value={hospitalData.flatPlotNo || ""}
            onChange={handleHospitalChange("flatPlotNo")}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeWorkOutlinedIcon
                    fontSize="small"
                    sx={{ color: COLORS.textSecondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* BUILDING */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>Building / Society</Label>

          <TextField
            fullWidth
            placeholder="e.g. ABC Tower"
            value={hospitalData.buildingSociety || ""}
            onChange={handleHospitalChange("buildingSociety")}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ApartmentOutlinedIcon
                    fontSize="small"
                    sx={{ color: COLORS.textSecondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* STREET */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>Street Name</Label>

          <TextField
            fullWidth
            placeholder="e.g. MG Road"
            value={hospitalData.streetName || ""}
            onChange={handleHospitalChange("streetName")}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon
                    fontSize="small"
                    sx={{ color: COLORS.textSecondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* AREA */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>Area / Locality</Label>

          <TextField
            fullWidth
            placeholder="e.g. Vijay Nagar"
            value={hospitalData.areaLocality || ""}
            onChange={handleHospitalChange("areaLocality")}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon
                    fontSize="small"
                    sx={{ color: COLORS.textSecondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* LANDMARK */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>Landmark</Label>

          <TextField
            fullWidth
            placeholder="e.g. Near Mall"
            value={hospitalData.landmark || ""}
            onChange={handleHospitalChange("landmark")}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDropOutlinedIcon
                    fontSize="small"
                    sx={{ color: COLORS.textSecondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* CITY */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>City</Label>

          <TextField
            fullWidth
            placeholder="e.g. Indore"
            value={hospitalData.city || ""}
            onChange={handleHospitalChange("city")}
            sx={inputSx}
          />
        </Grid>

        {/* DISTRICT */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>District</Label>

          <TextField
            fullWidth
            placeholder="e.g. Indore"
            value={hospitalData.district || ""}
            onChange={handleHospitalChange("district")}
            sx={inputSx}
          />
        </Grid>

        {/* STATE */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>State</Label>

          <TextField
            fullWidth
            placeholder="e.g. Madhya Pradesh"
            value={hospitalData.state || ""}
            onChange={handleHospitalChange("state")}
            sx={inputSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapOutlinedIcon
                    fontSize="small"
                    sx={{ color: COLORS.textSecondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* PIN CODE */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>PIN Code</Label>

          <TextField
            fullWidth
            placeholder="e.g. 452001"
            value={hospitalData.pinCode || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);

              onChange({
                hospitalDetail: {
                  ...hospitalData,
                  pinCode: value,
                },
              });
            }}
            sx={inputSx}
            inputProps={{
              maxLength: 6,
              inputMode: "numeric",
            }}
          />
        </Grid>
      </Grid>

      {/* BUTTONS */}

      <Box
        sx={{
          mt: {
            xs: 3,
            sm: 4,
          },
          pt: 2.5,
          borderTop: `1px solid ${COLORS.border}`,
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          disabled={loading}
          sx={{
            height: 48,
            px: 3,
            borderRadius: "10px",
            borderColor: COLORS.inputBorder,
            color: COLORS.textPrimary,
            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              borderColor: COLORS.primary,
              backgroundColor: "#F8FBF9",
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
              <CircularProgress size={18} color="inherit" />
            ) : (
              <ArrowForwardIcon />
            )
          }
          sx={{
            minWidth: "145px",
            height: 48,
            px: 3,
            borderRadius: "10px",
            backgroundColor: COLORS.primary,
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",

            "&:hover": {
              backgroundColor: COLORS.primaryHover,
              boxShadow: "0 4px 12px rgba(27, 110, 79, 0.18)",
            },
          }}
        >
          {loading ? "Saving..." : "Next"}
        </Button>
      </Box>
    </Paper>
  );
}