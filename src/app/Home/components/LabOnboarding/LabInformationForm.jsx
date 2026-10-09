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

import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#172033",
  muted: "#74807B",
  border: "#DDE9E5",
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

    "&:hover fieldset": {
      borderColor: "#9CB7AF",
    },

    "&.Mui-focused fieldset": {
      borderColor: C.primary,
    },
  },

  "& input": {
    fontSize: "11.5px",
  },

  "& .MuiSelect-select": {
    fontSize: "11.5px",
  },

  "& .MuiFormHelperText-root": {
    fontSize: "9.5px",
  },
};

function Label({
  children,
  optional = false,
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
          sx={{
            color: C.error,
          }}
        >
          {" "}*
        </Box>
      )}
    </Typography>
  );
}

export default function LabInformationForm({
  data,
  onChange,
  onNext,
}) {
  const [errors, setErrors] =
    useState({});

  const setField = (field, value) => {
    onChange({
      [field]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const e = {};

    if (!data.labName?.trim()) {
      e.labName =
        "Lab name is required.";
    }

    if (!data.labType) {
      e.labType =
        "Lab type is required.";
    }

    if (!data.email?.trim()) {
      e.email =
        "Contact email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        data.email
      )
    ) {
      e.email =
        "Enter a valid email address.";
    }

    if (!data.phone?.trim()) {
      e.phone =
        "Phone number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(data.phone)
    ) {
      e.phone =
        "Enter a valid 10-digit phone number.";
    }

    if (!data.ownerName?.trim()) {
      e.ownerName =
        "Owner / authorized person name is required.";
    }

    if (!data.ownerEmail?.trim()) {
      e.ownerEmail =
        "Owner email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        data.ownerEmail
      )
    ) {
      e.ownerEmail =
        "Enter a valid email address.";
    }

    if (!data.ownerPhone?.trim()) {
      e.ownerPhone =
        "Owner phone number is required.";
    } else if (
      !/^[6-9]\d{9}$/.test(
        data.ownerPhone
      )
    ) {
      e.ownerPhone =
        "Enter a valid 10-digit phone number.";
    }

    if (!data.ownerAge) {
      e.ownerAge =
        "Age is required.";
    } else if (
      Number(data.ownerAge) < 18 ||
      Number(data.ownerAge) > 100
    ) {
      e.ownerAge =
        "Enter a valid age.";
    }

    if (!data.ownerGender) {
      e.ownerGender =
        "Gender is required.";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <Box>
      {/* HEADER */}

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <ScienceOutlinedIcon
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
            Lab Information
          </Typography>

          <Typography
            sx={{
              fontSize: "10.5px",
              color: C.muted,
            }}
          >
            Enter the basic information
            about your diagnostic laboratory.
          </Typography>
        </Box>
      </Stack>

      {/* LAB DETAILS */}

      <Typography
        sx={{
          mb: 1.5,
          fontSize: "12px",
          fontWeight: 700,
          color: C.text,
        }}
      >
        Laboratory Details
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Diagnostic Lab Name
          </Label>

          <TextField
            fullWidth
            placeholder="Enter lab name"
            value={data.labName || ""}
            onChange={(e) =>
              setField(
                "labName",
                e.target.value
              )
            }
            error={!!errors.labName}
            helperText={errors.labName}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>Lab Type</Label>

          <TextField
            select
            fullWidth
            value={data.labType || ""}
            onChange={(e) =>
              setField(
                "labType",
                e.target.value
              )
            }
            error={!!errors.labType}
            helperText={errors.labType}
            sx={fieldSx}
          >
            <MenuItem value="PATHOLOGY">
              Pathology Lab
            </MenuItem>

            <MenuItem value="DIAGNOSTIC">
              Diagnostic Centre
            </MenuItem>

            <MenuItem value="IMAGING">
              Imaging / Radiology Centre
            </MenuItem>

            <MenuItem value="MULTISPECIALITY">
              Multi-Speciality Diagnostic
              Centre
            </MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Lab Contact Email
          </Label>

          <TextField
            fullWidth
            type="email"
            placeholder="lab@example.com"
            value={data.email || ""}
            onChange={(e) =>
              setField(
                "email",
                e.target.value
              )
            }
            error={!!errors.email}
            helperText={errors.email}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Lab Contact Phone
          </Label>

          <TextField
            fullWidth
            placeholder="10-digit phone number"
            value={data.phone || ""}
            onChange={(e) =>
              setField(
                "phone",
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10)
              )
            }
            error={!!errors.phone}
            helperText={errors.phone}
            sx={fieldSx}
          />
        </Grid>
      </Grid>

      {/* OWNER */}

      <Typography
        sx={{
          mt: 3,
          mb: 1.5,
          fontSize: "12px",
          fontWeight: 700,
          color: C.text,
        }}
      >
        Owner / Authorized Person
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Full Name
          </Label>

          <TextField
            fullWidth
            placeholder="Enter full name"
            value={data.ownerName || ""}
            onChange={(e) =>
              setField(
                "ownerName",
                e.target.value
              )
            }
            error={!!errors.ownerName}
            helperText={errors.ownerName}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Email Address
          </Label>

          <TextField
            fullWidth
            type="email"
            placeholder="Enter email"
            value={data.ownerEmail || ""}
            onChange={(e) =>
              setField(
                "ownerEmail",
                e.target.value
              )
            }
            error={!!errors.ownerEmail}
            helperText={errors.ownerEmail}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Label>
            Phone Number
          </Label>

          <TextField
            fullWidth
            placeholder="10-digit phone number"
            value={data.ownerPhone || ""}
            onChange={(e) =>
              setField(
                "ownerPhone",
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10)
              )
            }
            error={!!errors.ownerPhone}
            helperText={errors.ownerPhone}
            sx={fieldSx}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 3 }}>
          <Label>Gender</Label>

          <TextField
            select
            fullWidth
            value={data.ownerGender || ""}
            onChange={(e) =>
              setField(
                "ownerGender",
                e.target.value
              )
            }
            error={!!errors.ownerGender}
            helperText={errors.ownerGender}
            sx={fieldSx}
          >
            <MenuItem value="MALE">
              Male
            </MenuItem>

            <MenuItem value="FEMALE">
              Female
            </MenuItem>

            <MenuItem value="OTHER">
              Other
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ mt: 3 }}
      >
        <Button
          variant="contained"
          onClick={handleNext}
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
            fontSize: "11.5px",
            fontWeight: 700,

            "&:hover": {
              bgcolor: C.hover,
              boxShadow: "none",
            },
          }}
        >
          Next: Lab Address
        </Button>
      </Stack>
    </Box>
  );
}