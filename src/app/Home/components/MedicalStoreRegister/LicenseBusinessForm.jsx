
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

/* =========================================================
   COLORS
========================================================= */

const C = {
  primary: "#07876A",
  primaryHover: "#066F58",
  primaryLight: "#EAF7F3",

  text: "#172033",
  muted: "#74807B",

  border: "#DDE9E5",
  inputBorder: "#CBD5E1",

  error: "#E5484D",
  white: "#FFFFFF",
};

/* =========================================================
   INPUT STYLE
========================================================= */

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: "46px",
    borderRadius: "8px",
    backgroundColor: C.white,

    "& fieldset": {
      borderColor: C.inputBorder,
    },

    "&:hover fieldset": {
      borderColor: "#9CB7AF",
    },

    "&.Mui-focused fieldset": {
      borderColor: C.primary,
      borderWidth: "1px",
    },

    "&.Mui-error fieldset": {
      borderColor: C.error,
    },
  },

  "& .MuiInputBase-input": {
    fontSize: "12px",
    py: 1.2,
  },

  "& .MuiFormHelperText-root": {
    fontSize: "10px",
    ml: 0.5,
    mt: 0.5,
  },
};

/* =========================================================
   LABEL
========================================================= */

function FieldLabel({ children, optional = false }) {
  return (
    <Typography
      sx={{
        mb: 0.6,
        fontSize: "12px",
        fontWeight: 600,
        color: C.text,
      }}
    >
      {children}

      {optional ? (
        <Box
          component="span"
          sx={{
            color: C.muted,
            fontWeight: 400,
          }}
        >
          {" "}
          (Optional)
        </Box>
      ) : (
        <Box
          component="span"
          sx={{
            color: C.error,
          }}
        >
          {" "}
          *
        </Box>
      )}
    </Typography>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function LicenseBusinessForm({
  data = {},
  onChange,
  onBack,
  onNext,
  loading = false,
}) {
  const [errors, setErrors] = React.useState({});

  /* =======================================================
     CHANGE FIELD
  ======================================================= */

  const setField = (field, value) => {
    onChange?.({
      [field]: value,
    });

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validate = () => {
    const newErrors = {};

    const drugLicenseNumber =
      data.drugLicenseNumber?.trim() || "";

    const expiry =
      data.licenseExpiryDate || "";

    const pharmacistRegistrationNumber =
      data.pharmacistRegistrationNumber?.trim() || "";

    const gstin =
      data.gstin?.trim().toUpperCase() || "";

    /* ================= DRUG LICENSE ================= */

    if (!drugLicenseNumber) {
      newErrors.drugLicenseNumber =
        "Drug license number is required";
    } else if (drugLicenseNumber.length < 5) {
      newErrors.drugLicenseNumber =
        "Enter a valid drug license number";
    }

    /* ================= EXPIRY DATE ================= */

    if (!expiry) {
      newErrors.licenseExpiryDate =
        "License expiry date is required";
    } else {
      const selectedDate = new Date(expiry);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.licenseExpiryDate =
          "Drug license has expired";
      }
    }

    /* ================= PHARMACIST ================= */

    if (!pharmacistRegistrationNumber) {
      newErrors.pharmacistRegistrationNumber =
        "Pharmacist registration number is required";
    } else if (pharmacistRegistrationNumber.length < 4) {
      newErrors.pharmacistRegistrationNumber =
        "Enter a valid pharmacist registration number";
    }

    /* ================= GSTIN OPTIONAL ================= */

    if (gstin) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

      if (!gstRegex.test(gstin)) {
        newErrors.gstin =
          "Enter a valid 15-character GSTIN";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!validate()) {
      return;
    }

    onNext?.();
  };

  /* =======================================================
     ICON
  ======================================================= */

  const icon = (Icon) => (
    <InputAdornment position="start">
      <Icon
        sx={{
          fontSize: 17,
          color: C.muted,
        }}
      />
    </InputAdornment>
  );

  /* =======================================================
     COMPLETION
  ======================================================= */

  const licenseComplete =
    Boolean(data.drugLicenseNumber) &&
    Boolean(data.licenseExpiryDate);

  const pharmacistComplete =
    Boolean(data.pharmacistRegistrationNumber);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <Box>
      {/* ===================================================
          MAIN CARD
      =================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          bgcolor: C.white,
        }}
      >
        {/* ================= HEADER ================= */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <Box
            sx={{
              width: 38,
              height: 38,

              borderRadius: "9px",

              bgcolor: C.primaryLight,
              color: C.primary,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              flexShrink: 0,
            }}
          >
            <BadgeOutlinedIcon
              sx={{
                fontSize: 21,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 750,
                color: C.text,
                lineHeight: 1.3,
              }}
            >
              License & Business Details
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: "10.5px",
                color: C.muted,
                lineHeight: 1.4,
              }}
            >
              Enter the legal license details of your pharmacy.
            </Typography>
          </Box>
        </Stack>

        <Divider
          sx={{
            my: 2,
            borderColor: C.border,
          }}
        />

        {/* ===================================================
            DRUG LICENSE INFORMATION
        =================================================== */}

        <Box>
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{
              mb: 1.7,
            }}
          >
            <DescriptionOutlinedIcon
              sx={{
                fontSize: 18,
                color: C.primary,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                Drug License Information
              </Typography>

              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "10px",
                  color: C.muted,
                }}
              >
                Enter the details exactly as printed on your
                drug license.
              </Typography>
            </Box>

            {licenseComplete && (
              <CheckCircleRoundedIcon
                sx={{
                  ml: "auto !important",
                  fontSize: 17,
                  color: C.primary,
                }}
              />
            )}
          </Stack>

          <Grid
            container
            spacing={{
              xs: 2,
              md: 2.2,
            }}
          >
            {/* LICENSE NUMBER */}

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel>
                Drug License Number
              </FieldLabel>

              <TextField
                fullWidth
                placeholder="Enter drug license number"
                value={
                  data.drugLicenseNumber || ""
                }
                onChange={(e) => {
                  const value =
                    e.target.value
                      .toUpperCase()
                      .slice(0, 40);

                  setField(
                    "drugLicenseNumber",
                    value
                  );
                }}
                error={Boolean(
                  errors.drugLicenseNumber
                )}
                helperText={
                  errors.drugLicenseNumber ||
                  "As printed on your drug license"
                }
                sx={inputSx}
                InputProps={{
                  startAdornment: icon(
                    BadgeOutlinedIcon
                  ),
                }}
              />
            </Grid>

            {/* LICENSE EXPIRY */}

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel>
                License Expiry Date
              </FieldLabel>

              <TextField
                fullWidth
                type="date"
                value={
                  data.licenseExpiryDate || ""
                }
                onChange={(e) =>
                  setField(
                    "licenseExpiryDate",
                    e.target.value
                  )
                }
                error={Boolean(
                  errors.licenseExpiryDate
                )}
                helperText={
                  errors.licenseExpiryDate ||
                  "Expiry date mentioned on license"
                }
                sx={inputSx}
                inputProps={{
                  min: new Date()
                    .toISOString()
                    .split("T")[0],
                }}
                InputProps={{
                  startAdornment: icon(
                    CalendarMonthOutlinedIcon
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* ===================================================
            PHARMACIST INFORMATION
        =================================================== */}

        <Divider
          sx={{
            my: 2.5,
            borderColor: C.border,
          }}
        />

        <Box>
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{
              mb: 1.7,
            }}
          >
            <LocalPharmacyOutlinedIcon
              sx={{
                fontSize: 18,
                color: C.primary,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                Pharmacist Information
              </Typography>

              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "10px",
                  color: C.muted,
                }}
              >
                Enter the registered pharmacist details.
              </Typography>
            </Box>

            {pharmacistComplete && (
              <CheckCircleRoundedIcon
                sx={{
                  ml: "auto !important",
                  fontSize: 17,
                  color: C.primary,
                }}
              />
            )}
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel>
                Pharmacist Registration Number
              </FieldLabel>

              <TextField
                fullWidth
                placeholder="Enter registration number"
                value={
                  data.pharmacistRegistrationNumber ||
                  ""
                }
                onChange={(e) => {
                  const value =
                    e.target.value
                      .replace(/\s/g, "")
                      .toUpperCase()
                      .slice(0, 40);

                  setField(
                    "pharmacistRegistrationNumber",
                    value
                  );
                }}
                error={Boolean(
                  errors.pharmacistRegistrationNumber
                )}
                helperText={
                  errors.pharmacistRegistrationNumber ||
                  "As printed on the pharmacist registration certificate"
                }
                sx={inputSx}
                InputProps={{
                  startAdornment: icon(
                    LocalPharmacyOutlinedIcon
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* ===================================================
            BUSINESS INFORMATION
        =================================================== */}

        <Divider
          sx={{
            my: 2.5,
            borderColor: C.border,
          }}
        />

        <Box>
          <Stack
            direction="row"
            spacing={0.8}
            alignItems="center"
            sx={{
              mb: 1.7,
            }}
          >
            <BusinessOutlinedIcon
              sx={{
                fontSize: 18,
                color: C.primary,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                Business Information
              </Typography>

              <Typography
                sx={{
                  mt: 0.15,
                  fontSize: "10px",
                  color: C.muted,
                }}
              >
                Tax information for your pharmacy.
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={2}>
            {/* GSTIN */}

            <Grid size={{ xs: 12, md: 6 }}>
              <FieldLabel optional>
                GSTIN
              </FieldLabel>

              <TextField
                fullWidth
                placeholder="e.g. 23ABCDE1234F1Z5"
                value={data.gstin || ""}
                onChange={(e) => {
                  const value =
                    e.target.value
                      .replace(/\s/g, "")
                      .toUpperCase()
                      .slice(0, 15);

                  setField("gstin", value);
                }}
                error={Boolean(errors.gstin)}
                helperText={
                  errors.gstin ||
                  "15-character GST Identification Number"
                }
                sx={inputSx}
                inputProps={{
                  maxLength: 15,
                }}
                InputProps={{
                  startAdornment: icon(
                    BusinessOutlinedIcon
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* ===================================================
            INFO BOX
        =================================================== */}

        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{
            mt: 2.5,
            p: 1.4,

            bgcolor: "#F4FAF7",

            border:
              "1px solid rgba(7,135,106,0.12)",

            borderRadius: "9px",
          }}
        >
          <InfoOutlinedIcon
            sx={{
              mt: "1px",
              fontSize: 17,
              color: C.primary,
              flexShrink: 0,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: C.text,
              }}
            >
              Keep your license details accurate
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: "10px",
                lineHeight: 1.5,
                color: C.muted,
              }}
            >
              Your drug license and pharmacist registration
              details will be verified before your medical
              store is approved on Jeevan Dev.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* ===================================================
          ACTIONS
      =================================================== */}

      <Paper
        elevation={0}
        sx={{
          mt: 2,

          px: {
            xs: 2,
            md: 2.5,
          },

          py: 1.4,

          border: `1px solid ${C.border}`,
          borderRadius: "11px",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          gap: 2,
        }}
      >
        {/* BACK */}

        <Button
          onClick={onBack}
          startIcon={
            <ArrowBackRoundedIcon
              sx={{
                fontSize: "17px !important",
              }}
            />
          }
          sx={{
            height: 40,

            px: 2,

            border: `1px solid ${C.border}`,
            borderRadius: "8px",

            color: C.text,

            textTransform: "none",

            fontSize: "11.5px",
            fontWeight: 600,

            "&:hover": {
              bgcolor: "#F8FAF9",
              borderColor: "#C8D8D2",
            },
          }}
        >
          Back
        </Button>

        {/* NEXT */}

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={loading}
          endIcon={
            loading ? (
              <CircularProgress
                size={14}
                color="inherit"
              />
            ) : (
              <ArrowForwardRoundedIcon
                sx={{
                  fontSize: "17px !important",
                }}
              />
            )
          }
          sx={{
            minWidth: {
              xs: 130,
              sm: 200,
            },

            height: 40,

            px: 2.5,

            borderRadius: "8px",

            bgcolor: C.primary,
            color: "#fff",

            boxShadow: "none",

            textTransform: "none",

            fontSize: "11.5px",
            fontWeight: 700,

            "&:hover": {
              bgcolor: C.primaryHover,
              boxShadow:
                "0 4px 12px rgba(7,135,106,0.16)",
            },

            "&.Mui-disabled": {
              bgcolor: "#A9BDB6",
              color: "#fff",
            },
          }}
        >
          {loading
            ? "Saving..."
            : "Next: Store Operations"}
        </Button>
      </Paper>
    </Box>
  );
}
