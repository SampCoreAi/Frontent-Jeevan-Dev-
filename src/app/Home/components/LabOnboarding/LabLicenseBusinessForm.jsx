"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
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

const sx = {
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

  "& input": {
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

export default function LabLicenseBusinessForm({
  data,
  onChange,
  onBack,
  onNext,
}) {
  const [errors, setErrors] =
    useState({});

  const setField = (key, value) => {
    onChange({ [key]: value });

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = () => {
    const e = {};

    if (
      !data.labRegistrationNumber?.trim()
    ) {
      e.labRegistrationNumber =
        "Lab registration / license number is required.";
    }

    if (!data.licenseExpiryDate) {
      e.licenseExpiryDate =
        "License expiry date is required.";
    } else {
      const expiry = new Date(
        data.licenseExpiryDate
      );

      const today = new Date();

      today.setHours(0, 0, 0, 0);

      if (expiry < today) {
        e.licenseExpiryDate =
          "License has expired.";
      }
    }

    if (
      data.gstin &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        data.gstin.toUpperCase()
      )
    ) {
      e.gstin =
        "Enter a valid GSTIN.";
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
        <DescriptionOutlinedIcon
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
            License & Business Details
          </Typography>

          <Typography
            sx={{
              fontSize: "10.5px",
              color: C.muted,
            }}
          >
            Enter your laboratory
            registration and business
            information.
          </Typography>
        </Box>
      </Stack>

      <Typography
        sx={{
          mb: 1.5,
          fontSize: "12px",
          fontWeight: 700,
          color: C.text,
        }}
      >
        Lab Registration
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Lab Registration / License Number
          </Label>

          <TextField
            fullWidth
            placeholder="Enter registration number"
            value={
              data.labRegistrationNumber ||
              ""
            }
            onChange={(e) =>
              setField(
                "labRegistrationNumber",
                e.target.value.toUpperCase()
              )
            }
            error={
              !!errors.labRegistrationNumber
            }
            helperText={
              errors.labRegistrationNumber
            }
            sx={sx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            License Expiry Date
          </Label>

          <TextField
            fullWidth
            type="date"
            value={
              data.licenseExpiryDate ||
              ""
            }
            onChange={(e) =>
              setField(
                "licenseExpiryDate",
                e.target.value
              )
            }
            error={
              !!errors.licenseExpiryDate
            }
            helperText={
              errors.licenseExpiryDate
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={sx}
          />
        </Grid>
      </Grid>

      <Typography
        sx={{
          mt: 3,
          mb: 1.5,
          fontSize: "12px",
          fontWeight: 700,
          color: C.text,
        }}
      >
        Business Information
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label optional>
            GSTIN
          </Label>

          <TextField
            fullWidth
            placeholder="e.g. 23ABCDE1234F1Z5"
            value={data.gstin || ""}
            onChange={(e) =>
              setField(
                "gstin",
                e.target.value
                  .toUpperCase()
                  .slice(0, 15)
              )
            }
            error={!!errors.gstin}
            helperText={errors.gstin}
            sx={sx}
          />
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
            bgcolor: C.primary,
            borderRadius: "8px",
            boxShadow: "none",
            textTransform: "none",
            fontSize: "11px",
            fontWeight: 700,

            "&:hover": {
              bgcolor: C.hover,
            },
          }}
        >
          Next: Services
        </Button>
      </Stack>
    </Box>
  );
}