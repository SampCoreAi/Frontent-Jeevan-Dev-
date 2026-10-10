"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#172033",
  muted: "#74807B",
  input: "#CBD5E1",
  error: "#E5484D",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 44,
    borderRadius: "8px",

    "& fieldset": {
      borderColor: C.input,
    },

    "&.Mui-focused fieldset": {
      borderColor: C.primary,
    },
  },

  "& input, & .MuiSelect-select": {
    fontSize: "11.5px",
  },

  "& .MuiFormHelperText-root": {
    fontSize: "9.5px",
  },
};

function Label({
  children,
  optional,
}) {
  return (
    <Typography
      sx={{
        mb: 0.6,
        fontSize: "11px",
        fontWeight: 650,
        color: C.text,
      }}
    >
      {children}

      {optional ? (
        <Box
          component="span"
          sx={{
            ml: 0.5,
            color: C.muted,
            fontWeight: 400,
          }}
        >
          (Optional)
        </Box>
      ) : (
        <Box
          component="span"
          sx={{ color: C.error }}
        >
          {" "}*
        </Box>
      )}
    </Typography>
  );
}

const states = [
  "Madhya Pradesh",
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Uttar Pradesh",
  "Rajasthan",
  "Gujarat",
  "Haryana",
  "Punjab",
  "Bihar",
  "West Bengal",
  "Tamil Nadu",
  "Telangana",
  "Andhra Pradesh",
  "Kerala",
  "Odisha",
  "Jharkhand",
  "Chhattisgarh",
  "Uttarakhand",
  "Assam",
];

export default function LabAddressForm({
  data,
  onChange,
  onBack,
  onNext,
}) {
  const [errors, setErrors] =
    useState({});

  const setField = (key, value) => {
    onChange({
      [key]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = () => {
    const e = {};

    if (!data.shopUnitNumber?.trim()) {
      e.shopUnitNumber =
        "Shop / unit number is required.";
    }

    if (!data.buildingName?.trim()) {
      e.buildingName =
        "Building / complex name is required.";
    }

    if (!data.streetAddress?.trim()) {
      e.streetAddress =
        "Street / road name is required.";
    }

    if (!data.areaLocality?.trim()) {
      e.areaLocality =
        "Area / locality is required.";
    }

    if (!data.pinCode?.trim()) {
      e.pinCode =
        "PIN code is required.";
    } else if (
      !/^\d{6}$/.test(data.pinCode)
    ) {
      e.pinCode =
        "Enter a valid 6-digit PIN code.";
    }

    if (!data.city?.trim()) {
      e.city =
        "City / town is required.";
    }

    if (!data.state) {
      e.state =
        "State is required.";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <LocationOnOutlinedIcon
          sx={{
            color: C.primary,
            fontSize: 23,
          }}
        />

        <Box>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 750,
              color: C.text,
            }}
          >
            Lab Address
          </Typography>

          <Typography
            sx={{
              fontSize: "10.5px",
              color: C.muted,
            }}
          >
            Enter the physical location of
            your diagnostic laboratory.
          </Typography>
        </Box>
      </Stack>

      {/* LAB NAME READ ONLY */}

      <Box sx={{ mb: 2 }}>
        <Label>
          Diagnostic Lab Name
        </Label>

        <TextField
          fullWidth
          disabled
          value={data.labName || ""}
          sx={{
            ...fieldSx,

            "& .MuiInputBase-input.Mui-disabled":
              {
                WebkitTextFillColor:
                  C.text,
              },
          }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Shop / Unit Number
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. Shop 12"
            value={
              data.shopUnitNumber || ""
            }
            onChange={(e) =>
              setField(
                "shopUnitNumber",
                e.target.value
              )
            }
            error={
              !!errors.shopUnitNumber
            }
            helperText={
              errors.shopUnitNumber
            }
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Building / Complex Name
          </Label>

          <TextField
            fullWidth
            placeholder="Building name"
            value={
              data.buildingName || ""
            }
            onChange={(e) =>
              setField(
                "buildingName",
                e.target.value
              )
            }
            error={
              !!errors.buildingName
            }
            helperText={
              errors.buildingName
            }
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Street / Road Name
          </Label>

          <TextField
            fullWidth
            placeholder="Street / road"
            value={
              data.streetAddress || ""
            }
            onChange={(e) =>
              setField(
                "streetAddress",
                e.target.value
              )
            }
            error={
              !!errors.streetAddress
            }
            helperText={
              errors.streetAddress
            }
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Area / Locality
          </Label>

          <TextField
            fullWidth
            placeholder="Area / locality"
            value={
              data.areaLocality || ""
            }
            onChange={(e) =>
              setField(
                "areaLocality",
                e.target.value
              )
            }
            error={
              !!errors.areaLocality
            }
            helperText={
              errors.areaLocality
            }
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Label optional>
            Landmark
          </Label>

          <TextField
            fullWidth
            placeholder="Nearby landmark"
            value={data.landmark || ""}
            onChange={(e) =>
              setField(
                "landmark",
                e.target.value
              )
            }
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Label>PIN Code</Label>

          <TextField
            fullWidth
            value={data.pinCode || ""}
            onChange={(e) =>
              setField(
                "pinCode",
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            error={!!errors.pinCode}
            helperText={errors.pinCode}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Label>
            City / Town
          </Label>

          <TextField
            fullWidth
            value={data.city || ""}
            onChange={(e) =>
              setField(
                "city",
                e.target.value
              )
            }
            error={!!errors.city}
            helperText={errors.city}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Label>State</Label>

          <TextField
            select
            fullWidth
            value={data.state || ""}
            onChange={(e) =>
              setField(
                "state",
                e.target.value
              )
            }
            error={!!errors.state}
            helperText={errors.state}
            sx={fieldSx}
          >
            {states.map((state) => (
              <MenuItem
                key={state}
                value={state}
              >
                {state}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mt: 3 }}
      >
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={
            <ArrowBackRoundedIcon />
          }
          sx={{
            height: 42,
            borderColor: C.input,
            color: C.text,
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "11px",
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={next}
          endIcon={
            <ArrowForwardRoundedIcon />
          }
          sx={{
            height: 42,
            px: 2.5,
            bgcolor: C.primary,
            borderRadius: "8px",
            boxShadow: "none",
            textTransform: "none",
            fontSize: "11px",
            fontWeight: 700,

            "&:hover": {
              bgcolor: C.hover,
              boxShadow: "none",
            },
          }}
        >
          Next: License
        </Button>
      </Stack>
    </Box>
  );
}