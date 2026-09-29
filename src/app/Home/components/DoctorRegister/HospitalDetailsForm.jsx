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

/* =========================================================
   COLORS
========================================================= */

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

/* =========================================================
   COMMON INPUT STYLE
========================================================= */

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: COLORS.white,
    minHeight: "48px",

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

    "&.Mui-error fieldset": {
      borderColor: COLORS.error,
    },
  },

  "& .MuiInputBase-input": {
    fontSize: "13px",
    color: COLORS.textPrimary,

    "&::placeholder": {
      color: COLORS.textSecondary,
      opacity: 0.72,
    },
  },

  "& .MuiFormHelperText-root": {
    marginLeft: "3px",
    marginTop: "5px",
    fontSize: "10.5px",
    lineHeight: 1.3,
    minHeight: "14px",
  },
};

/* =========================================================
   LABEL
========================================================= */

const Label = ({ children, required = false }) => (
  <Typography
    sx={{
      fontWeight: 600,
      color: COLORS.textPrimary,
      mb: 0.55,
      fontSize: "12.5px",
      lineHeight: 1.4,
    }}
  >
    {children}

    {required && (
      <Box
        component="span"
        sx={{
          color: COLORS.error,
          ml: 0.3,
        }}
      >
        *
      </Box>
    )}
  </Typography>
);

/* =========================================================
   COMPONENT
========================================================= */

export default function HospitalDetailsForm({
  data,
  onChange,
  onNext,
  onBack,
  loading = false,
}) {
  const [errors, setErrors] = React.useState({});

  const hospitalData = data?.hospitalDetail || {};

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateHospitalName = (value) => {
    const name = String(value || "").trim();

    if (!name) {
      return "Hospital / clinic name is required.";
    }

    if (name.length < 2) {
      return "Name must be at least 2 characters.";
    }

    if (name.length > 100) {
      return "Name cannot exceed 100 characters.";
    }

    // Allows:
    // Apollo Hospital
    // Dr. ABC Clinic
    // Care & Cure Hospital
    // City Hospital-2
    if (!/^[A-Za-z0-9\s&.,'()/-]+$/.test(name)) {
      return "Enter a valid hospital / clinic name.";
    }

    if (!/[A-Za-z]/.test(name)) {
      return "Hospital name must contain letters.";
    }

    return "";
  };

  const validateFlatPlotNo = (value) => {
    const flat = String(value || "").trim();

    if (!flat) {
      return "Flat / plot number is required.";
    }

    if (flat.length > 20) {
      return "Flat / plot number is too long.";
    }

    // Examples:
    // 12
    // A-12
    // 12/B
    // B-203
    if (!/^[A-Za-z0-9\s/-]+$/.test(flat)) {
      return "Enter a valid flat / plot number.";
    }

    return "";
  };

  const validateBuilding = (value) => {
    const building = String(value || "").trim();

    if (!building) {
      return "Building / society is required.";
    }

    if (building.length < 2) {
      return "Enter a valid building / society name.";
    }

    if (building.length > 100) {
      return "Building / society name is too long.";
    }

    if (!/^[A-Za-z0-9\s&.,'()/-]+$/.test(building)) {
      return "Enter a valid building / society name.";
    }

    return "";
  };

  const validateStreet = (value) => {
    const street = String(value || "").trim();

    if (!street) {
      return "Street name is required.";
    }

    if (street.length < 2) {
      return "Street name must be at least 2 characters.";
    }

    if (street.length > 100) {
      return "Street name is too long.";
    }

    if (!/^[A-Za-z0-9\s&.,'()/-]+$/.test(street)) {
      return "Enter a valid street name.";
    }

    return "";
  };

  const validateArea = (value) => {
    const area = String(value || "").trim();

    if (!area) {
      return "Area / locality is required.";
    }

    if (area.length < 2) {
      return "Area / locality must be at least 2 characters.";
    }

    if (area.length > 100) {
      return "Area / locality is too long.";
    }

    if (!/^[A-Za-z0-9\s&.,'()/-]+$/.test(area)) {
      return "Enter a valid area / locality.";
    }

    return "";
  };

  const validateLandmark = (value) => {
    const landmark = String(value || "").trim();

    // Optional
    if (!landmark) {
      return "";
    }

    if (landmark.length > 100) {
      return "Landmark cannot exceed 100 characters.";
    }

    if (!/^[A-Za-z0-9\s&.,'()/-]+$/.test(landmark)) {
      return "Enter a valid landmark.";
    }

    return "";
  };

  const validateCity = (value) => {
    const city = String(value || "").trim();

    if (!city) {
      return "City is required.";
    }

    if (city.length < 2) {
      return "City name must be at least 2 characters.";
    }

    if (city.length > 50) {
      return "City name is too long.";
    }

    // Allows names like:
    // New Delhi
    // Navi Mumbai
    // Bengaluru
    if (!/^[A-Za-z\s.'-]+$/.test(city)) {
      return "City can contain letters only.";
    }

    return "";
  };

  const validateDistrict = (value) => {
    const district = String(value || "").trim();

    if (!district) {
      return "District is required.";
    }

    if (district.length < 2) {
      return "District name must be at least 2 characters.";
    }

    if (district.length > 50) {
      return "District name is too long.";
    }

    if (!/^[A-Za-z\s.'-]+$/.test(district)) {
      return "District can contain letters only.";
    }

    return "";
  };

  const validateState = (value) => {
    const state = String(value || "").trim();

    if (!state) {
      return "State is required.";
    }

    if (state.length < 2) {
      return "State name must be at least 2 characters.";
    }

    if (state.length > 50) {
      return "State name is too long.";
    }

    if (!/^[A-Za-z\s.'-]+$/.test(state)) {
      return "State can contain letters only.";
    }

    return "";
  };

  const validatePinCode = (value) => {
    const pinCode = String(value || "").trim();

    if (!pinCode) {
      return "PIN code is required.";
    }

    if (!/^\d+$/.test(pinCode)) {
      return "PIN code can contain digits only.";
    }

    if (pinCode.length !== 6) {
      return "PIN code must be exactly 6 digits.";
    }

    // Indian postal PIN does not start with 0
    if (!/^[1-9][0-9]{5}$/.test(pinCode)) {
      return "Enter a valid 6-digit Indian PIN code.";
    }

    return "";
  };

  /* =======================================================
     VALIDATE SINGLE FIELD
  ======================================================= */

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "hospitalName":
        error = validateHospitalName(value);
        break;

      case "flatPlotNo":
        error = validateFlatPlotNo(value);
        break;

      case "buildingSociety":
        error = validateBuilding(value);
        break;

      case "streetName":
        error = validateStreet(value);
        break;

      case "areaLocality":
        error = validateArea(value);
        break;

      case "landmark":
        error = validateLandmark(value);
        break;

      case "city":
        error = validateCity(value);
        break;

      case "district":
        error = validateDistrict(value);
        break;

      case "state":
        error = validateState(value);
        break;

      case "pinCode":
        error = validatePinCode(value);
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return !error;
  };

  /* =======================================================
     SANITIZE
  ======================================================= */

  const sanitizeValue = (field, value) => {
    switch (field) {
      case "hospitalName":
        return value
          .replace(/[^A-Za-z0-9\s&.,'()/-]/g, "")
          .replace(/\s{2,}/g, " ")
          .slice(0, 100);

      case "flatPlotNo":
        return value
          .replace(/[^A-Za-z0-9\s/-]/g, "")
          .replace(/\s{2,}/g, " ")
          .slice(0, 20);

      case "buildingSociety":
      case "streetName":
      case "areaLocality":
      case "landmark":
        return value
          .replace(/[^A-Za-z0-9\s&.,'()/-]/g, "")
          .replace(/\s{2,}/g, " ")
          .slice(0, 100);

      case "city":
      case "district":
      case "state":
        return value
          .replace(/[^A-Za-z\s.'-]/g, "")
          .replace(/\s{2,}/g, " ")
          .slice(0, 50);

      case "pinCode":
        return value
          .replace(/\D/g, "")
          .slice(0, 6);

      default:
        return value;
    }
  };

  /* =======================================================
     CHANGE
  ======================================================= */

  const handleHospitalChange = (field) => (event) => {
    let value = event.target.value;

    value = sanitizeValue(field, value);

    onChange({
      hospitalDetail: {
        ...hospitalData,
        [field]: value,
      },
    });

    // Validate live only after an error has appeared
    if (errors[field]) {
      validateField(field, value);
    }
  };

  /* =======================================================
     BLUR
  ======================================================= */

  const handleBlur = (field) => () => {
    validateField(
      field,
      hospitalData[field] || ""
    );
  };

  /* =======================================================
     COMPLETE FORM VALIDATION
  ======================================================= */

  const validateForm = () => {
    const newErrors = {
      hospitalName:
        validateHospitalName(hospitalData.hospitalName),

      flatPlotNo:
        validateFlatPlotNo(hospitalData.flatPlotNo),

      buildingSociety:
        validateBuilding(hospitalData.buildingSociety),

      streetName:
        validateStreet(hospitalData.streetName),

      areaLocality:
        validateArea(hospitalData.areaLocality),

      landmark:
        validateLandmark(hospitalData.landmark),

      city:
        validateCity(hospitalData.city),

      district:
        validateDistrict(hospitalData.district),

      state:
        validateState(hospitalData.state),

      pinCode:
        validatePinCode(hospitalData.pinCode),
    };

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
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    onNext();
  };

  /* =======================================================
     ICON COLOR
  ======================================================= */

  const iconColor = (field) =>
    errors[field]
      ? COLORS.error
      : COLORS.textSecondary;

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minHeight: "100%",

        p: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },

        border: `1px solid ${COLORS.border}`,

        borderRadius: {
          xs: "14px",
          sm: "18px",
        },

        backgroundColor: COLORS.white,
      }}
    >
      {/* HEADER */}

      <OnboardingHeader />

      <Divider
        sx={{
          my: {
            xs: 2,
            sm: 2.3,
          },

          borderColor: COLORS.border,
        }}
      />

      {/* =================================================
          FORM
      ================================================= */}

      <Grid
        container
        spacing={{
          xs: 1.8,
          sm: 2,
          md: 2.2,
        }}
      >
        {/* =================================================
            HOSPITAL NAME
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>
            Hospital / Clinic Name
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. Apollo Hospital"
            value={hospitalData.hospitalName || ""}
            onChange={handleHospitalChange(
              "hospitalName"
            )}
            onBlur={handleBlur("hospitalName")}
            error={Boolean(errors.hospitalName)}
            helperText={
              errors.hospitalName
             
            }
            sx={inputSx}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocalHospitalOutlinedIcon
                    fontSize="small"
                    sx={{
                      color:
                        iconColor("hospitalName"),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
            FLAT / PLOT
        ================================================= */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>
            Flat / Plot No.
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. A-12"
            value={hospitalData.flatPlotNo || ""}
            onChange={handleHospitalChange(
              "flatPlotNo"
            )}
            onBlur={handleBlur("flatPlotNo")}
            error={Boolean(errors.flatPlotNo)}
            helperText={
              errors.flatPlotNo
            }
            sx={inputSx}
            inputProps={{
              maxLength: 20,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeWorkOutlinedIcon
                    fontSize="small"
                    sx={{
                      color:
                        iconColor("flatPlotNo"),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
            BUILDING / SOCIETY
        ================================================= */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>
            Building / Society
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. ABC Tower"
            value={
              hospitalData.buildingSociety || ""
            }
            onChange={handleHospitalChange(
              "buildingSociety"
            )}
            onBlur={handleBlur(
              "buildingSociety"
            )}
            error={Boolean(
              errors.buildingSociety
            )}
            helperText={
              errors.buildingSociety 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ApartmentOutlinedIcon
                    fontSize="small"
                    sx={{
                      color:
                        iconColor(
                          "buildingSociety"
                        ),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
            STREET
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>
            Street Name
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. MG Road"
            value={hospitalData.streetName || ""}
            onChange={handleHospitalChange(
              "streetName"
            )}
            onBlur={handleBlur("streetName")}
            error={Boolean(errors.streetName)}
            helperText={
              errors.streetName 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon
                    fontSize="small"
                    sx={{
                      color:
                        iconColor("streetName"),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
            AREA / LOCALITY
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>
            Area / Locality
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. Vijay Nagar"
            value={
              hospitalData.areaLocality || ""
            }
            onChange={handleHospitalChange(
              "areaLocality"
            )}
            onBlur={handleBlur("areaLocality")}
            error={Boolean(
              errors.areaLocality
            )}
            helperText={
              errors.areaLocality 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnOutlinedIcon
                    fontSize="small"
                    sx={{
                      color:
                        iconColor("areaLocality"),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
            LANDMARK
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Landmark
            <Box
              component="span"
              sx={{
                ml: 0.7,
                color: COLORS.textSecondary,
                fontSize: "10px",
                fontWeight: 500,
              }}
            >
              (Optional)
            </Box>
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. Near City Mall"
            value={hospitalData.landmark || ""}
            onChange={handleHospitalChange(
              "landmark"
            )}
            onBlur={handleBlur("landmark")}
            error={Boolean(errors.landmark)}
            helperText={
              errors.landmark 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDropOutlinedIcon
                    fontSize="small"
                    sx={{
                      color:
                        iconColor("landmark"),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
            CITY
        ================================================= */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>
            City
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. Indore"
            value={hospitalData.city || ""}
            onChange={handleHospitalChange("city")}
            onBlur={handleBlur("city")}
            error={Boolean(errors.city)}
            helperText={
              errors.city 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 50,
            }}
          />
        </Grid>

        {/* =================================================
            DISTRICT
        ================================================= */}

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Label required>
            District
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. Indore"
            value={hospitalData.district || ""}
            onChange={handleHospitalChange(
              "district"
            )}
            onBlur={handleBlur("district")}
            error={Boolean(errors.district)}
            helperText={
              errors.district 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 50,
            }}
          />
        </Grid>

        {/* =================================================
            STATE
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>
            State
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. Madhya Pradesh"
            value={hospitalData.state || ""}
            onChange={handleHospitalChange(
              "state"
            )}
            onBlur={handleBlur("state")}
            error={Boolean(errors.state)}
            helperText={
              errors.state 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 50,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: iconColor("state"),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* =================================================
            PIN CODE
        ================================================= */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Label required>
            PIN Code
          </Label>

          <TextField
            fullWidth
            type="tel"
            placeholder="e.g. 452001"
            value={hospitalData.pinCode || ""}
            onChange={handleHospitalChange(
              "pinCode"
            )}
            onBlur={handleBlur("pinCode")}
            error={Boolean(errors.pinCode)}
            helperText={
              errors.pinCode 
            }
            sx={inputSx}
            inputProps={{
              maxLength: 6,
              inputMode: "numeric",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PinDropOutlinedIcon
                    fontSize="small"
                    sx={{
                      color:
                        iconColor("pinCode"),
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <Box
        sx={{
          mt: {
            xs: 2.5,
            sm: 3,
          },

          pt: 2,

          borderTop: `1px solid ${COLORS.border}`,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          gap: 2,
        }}
      >
        {/* BACK */}

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          disabled={loading}
          sx={{
            height: 42,
            px: 2.5,

            borderRadius: "9px",

            borderColor: COLORS.inputBorder,

            color: COLORS.textPrimary,

            textTransform: "none",

            fontSize: "12.5px",

            fontWeight: 600,

            "&:hover": {
              borderColor: COLORS.primary,
              color: COLORS.primary,
              backgroundColor:
                COLORS.primaryLight,
            },
          }}
        >
          Back
        </Button>

        {/* NEXT */}

        <Button
          variant="contained"

          // validation first
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
            minWidth: "130px",
            height: 42,

            px: 2.5,

            borderRadius: "9px",

            backgroundColor: COLORS.primary,

            textTransform: "none",

            fontSize: "12.5px",

            fontWeight: 600,

            boxShadow: "none",

            "&:hover": {
              backgroundColor:
                COLORS.primaryHover,

              boxShadow:
                "0 4px 12px rgba(27,110,79,0.18)",
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