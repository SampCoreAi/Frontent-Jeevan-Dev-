"use client";

import * as React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import SignpostOutlinedIcon from "@mui/icons-material/SignpostOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/* =========================================================
   COLORS
========================================================= */

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#172033",
  muted: "#74807B",
  border: "#DDE9E5",
  input: "#CBD5E1",
  error: "#E5484D",
  white: "#FFFFFF",
};

/* =========================================================
   INPUT STYLE
========================================================= */

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 46,
    borderRadius: "8px",
    backgroundColor: "#fff",

    "& fieldset": {
      borderColor: C.input,
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
    mx: 0.5,
    mt: 0.5,
  },
};

/* =========================================================
   LABEL
========================================================= */

function Label({ children, optional = false }) {
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

export default function StoreAddressForm({
  data = {},
  onChange,
  onBack,
  onNext,
  loading = false,
}) {
  const [errors, setErrors] = React.useState({});

  /* =======================================================
     UPDATE FIELD
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
    const nextErrors = {};

    /* STORE NAME */

    if (!String(data.storeName || "").trim()) {
      nextErrors.storeName =
        "Medical Store / Pharmacy Name is required";
    }

    /* SHOP NUMBER */

    if (!String(data.shopUnitNumber || "").trim()) {
      nextErrors.shopUnitNumber =
        "Shop / Unit Number is required";
    }

    /* BUILDING */

    if (!String(data.buildingName || "").trim()) {
      nextErrors.buildingName =
        "Building / Complex Name is required";
    }

    /* STREET */

    if (!String(data.streetAddress || "").trim()) {
      nextErrors.streetAddress =
        "Street / Road Name is required";
    }

    /* AREA */

    if (!String(data.areaLocality || "").trim()) {
      nextErrors.areaLocality =
        "Area / Locality is required";
    }

    /* PIN CODE */

    if (!String(data.pinCode || "").trim()) {
      nextErrors.pinCode = "PIN Code is required";
    } else if (!/^[1-9]\d{5}$/.test(data.pinCode)) {
      nextErrors.pinCode =
        "Enter a valid 6-digit PIN Code";
    }

    /* CITY */

    if (!String(data.city || "").trim()) {
      nextErrors.city =
        "City / Town is required";
    }

    /* STATE */

    if (!String(data.state || "").trim()) {
      nextErrors.state =
        "State is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  /* =======================================================
     NEXT
  ======================================================= */

  const handleNext = () => {
    if (!validate()) return;

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
     UI
  ======================================================= */

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            md: 2.5,
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

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              bgcolor: "#EAF7F3",
              color: C.primary,

              flexShrink: 0,
            }}
          >
            <LocationOnOutlinedIcon
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
              Medical Store Address
            </Typography>

            <Typography
              sx={{
                mt: 0.15,
                fontSize: "10.5px",
                color: C.muted,
                lineHeight: 1.4,
              }}
            >
              Enter the complete physical address of your
              medical store or pharmacy.
            </Typography>
          </Box>
        </Stack>

        <Divider
          sx={{
            my: 1.8,
            borderColor: C.border,
          }}
        />

        {/* ================= FORM ================= */}

        <Grid container spacing={2}>
          {/* ========================================
              MEDICAL STORE NAME
          ======================================== */}

          <Grid size={{ xs: 12 }}>
            <Label>
              Medical Store / Pharmacy Name
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. City Care Medical & Pharmacy"
              value={data.storeName || ""}
              onChange={(e) =>
                setField(
                  "storeName",
                  e.target.value
                )
              }
              error={Boolean(errors.storeName)}
              helperText={
                errors.storeName ||
                "Enter the registered or displayed name of your pharmacy"
              }
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  StorefrontOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              SHOP / UNIT NUMBER
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Shop / Unit Number
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. Shop No. 12"
              value={data.shopUnitNumber || ""}
              onChange={(e) =>
                setField(
                  "shopUnitNumber",
                  e.target.value
                )
              }
              error={Boolean(
                errors.shopUnitNumber
              )}
              helperText={
                errors.shopUnitNumber
              }
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  BusinessOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              BUILDING / COMPLEX NAME
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Building / Complex Name
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. City Center Complex"
              value={data.buildingName || ""}
              onChange={(e) =>
                setField(
                  "buildingName",
                  e.target.value
                )
              }
              error={Boolean(
                errors.buildingName
              )}
              helperText={
                errors.buildingName
              }
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  BusinessOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              STREET / ROAD
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Street / Road Name
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. MG Road"
              value={data.streetAddress || ""}
              onChange={(e) =>
                setField(
                  "streetAddress",
                  e.target.value
                )
              }
              error={Boolean(
                errors.streetAddress
              )}
              helperText={
                errors.streetAddress
              }
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  SignpostOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              AREA / LOCALITY
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              Area / Locality
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. Vijay Nagar"
              value={data.areaLocality || ""}
              onChange={(e) =>
                setField(
                  "areaLocality",
                  e.target.value
                )
              }
              error={Boolean(
                errors.areaLocality
              )}
              helperText={
                errors.areaLocality
              }
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  LocationOnOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              LANDMARK
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label optional>
              Landmark
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. Opposite Civil Hospital"
              value={data.landmark || ""}
              onChange={(e) =>
                setField(
                  "landmark",
                  e.target.value
                )
              }
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  LocationOnOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              PIN CODE
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              PIN Code
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. 452010"
              value={data.pinCode || ""}
              onChange={(e) =>
                setField(
                  "pinCode",
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              error={Boolean(errors.pinCode)}
              helperText={errors.pinCode}
              sx={inputSx}
              inputProps={{
                inputMode: "numeric",
                maxLength: 6,
              }}
              InputProps={{
                startAdornment: icon(
                  LocationOnOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              CITY
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              City / Town
            </Label>

            <TextField
              fullWidth
              placeholder="e.g. Indore"
              value={data.city || ""}
              onChange={(e) =>
                setField(
                  "city",
                  e.target.value
                )
              }
              error={Boolean(errors.city)}
              helperText={errors.city}
              sx={inputSx}
              InputProps={{
                startAdornment: icon(
                  LocationOnOutlinedIcon
                ),
              }}
            />
          </Grid>

          {/* ========================================
              STATE
          ======================================== */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>
              State
            </Label>

            <FormControl
              fullWidth
              error={Boolean(errors.state)}
            >
              <Select
                displayEmpty
                value={data.state || ""}
                onChange={(e) =>
                  setField(
                    "state",
                    e.target.value
                  )
                }
                startAdornment={icon(
                  MapOutlinedIcon
                )}
                sx={{
                  height: 46,
                  borderRadius: "8px",
                  fontSize: "12px",
                  bgcolor: "#fff",

                  "& fieldset": {
                    borderColor: C.input,
                  },

                  "&:hover fieldset": {
                    borderColor: "#9CB7AF",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: C.primary,
                    borderWidth: "1px",
                  },
                }}
                renderValue={(value) =>
                  value || (
                    <Box
                      sx={{
                        color: C.muted,
                      }}
                    >
                      Select state...
                    </Box>
                  )
                }
              >
                <MenuItem value="Madhya Pradesh">
                  Madhya Pradesh
                </MenuItem>

                <MenuItem value="Maharashtra">
                  Maharashtra
                </MenuItem>

                <MenuItem value="Karnataka">
                  Karnataka
                </MenuItem>

                <MenuItem value="Delhi">
                  Delhi
                </MenuItem>

                <MenuItem value="Uttar Pradesh">
                  Uttar Pradesh
                </MenuItem>

                <MenuItem value="Rajasthan">
                  Rajasthan
                </MenuItem>

                <MenuItem value="Gujarat">
                  Gujarat
                </MenuItem>

                <MenuItem value="Haryana">
                  Haryana
                </MenuItem>

                <MenuItem value="Punjab">
                  Punjab
                </MenuItem>

                <MenuItem value="Bihar">
                  Bihar
                </MenuItem>
              </Select>

              {errors.state && (
                <Typography
                  sx={{
                    mt: 0.5,
                    ml: 1,
                    fontSize: "10px",
                    color: C.error,
                  }}
                >
                  {errors.state}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <Box
        sx={{
          mt: 2,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          gap: 2,
        }}
      >
        {/* BACK */}

        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={
            <ArrowBackIcon
              sx={{
                fontSize: "16px !important",
              }}
            />
          }
          sx={{
            height: 42,
            px: 2.5,

            borderColor: C.border,
            color: C.text,

            borderRadius: "8px",

            textTransform: "none",

            fontSize: "11.5px",
            fontWeight: 600,

            "&:hover": {
              borderColor: C.primary,
              bgcolor: "#F8FCFA",
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
              <ArrowForwardIcon
                sx={{
                  fontSize: "16px !important",
                }}
              />
            )
          }
          sx={{
            minWidth: {
              xs: 170,
              sm: 220,
            },

            height: 42,
            px: 2.5,

            bgcolor: C.primary,

            borderRadius: "8px",

            boxShadow: "none",

            textTransform: "none",

            fontSize: "11.5px",
            fontWeight: 700,

            "&:hover": {
              bgcolor: C.hover,
              boxShadow: "none",
            },

            "&.Mui-disabled": {
              bgcolor: "#A9BDB6",
              color: "#fff",
            },
          }}
        >
          {loading
            ? "Saving..."
            : "Next: License & Business"}
        </Button>
      </Box>
    </Box>
  );
}