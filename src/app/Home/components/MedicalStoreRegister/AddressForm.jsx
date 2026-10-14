"use client";

import * as React from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
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

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LocalPharmacyOutlinedIcon from "@mui/icons-material/LocalPharmacyOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#263445",
  muted: "#74808A",
  border: "#E3E8EC",
  input: "#D9DDE3",
  error: "#E5484D",
  white: "#FFFFFF",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 36,
    borderRadius: "7px",
    bgcolor: C.white,
    fontSize: "12px",

    "& fieldset": {
      borderColor: C.input,
    },

    "&:hover fieldset": {
      borderColor: "#A8BDB6",
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
    py: 0.9,
    px: 1.2,
  },

  "& .MuiSelect-select": {
    py: "8px !important",
    fontSize: "12px",
  },

  "& .MuiFormHelperText-root": {
    fontSize: "10px",
    lineHeight: 1.4,
    mx: 0,
    mt: 0.4,
  },
};

function FieldLabel({ children, optional = false }) {
  return (
    <Typography
      sx={{
        mb: 0.55,
        fontSize: "12px",
        fontWeight: 600,
        color: C.text,
      }}
    >
      {children}

      {optional ? (
        <Box
          component="span"
          sx={{ color: C.muted, fontWeight: 400 }}
        >
          {" "}(Optional)
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

export default function DrugLicencePharmacistForm({
  data = {},
  onChange,
  onBack,
  onNext,
  loading = false,
}) {
  const [errors, setErrors] = React.useState({});

  const setField = (field, value) => {
    onChange?.({ [field]: value });

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

  };

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const validate = () => {
    const nextErrors = {};

    const requiredFields = [
      ["issuingAuthority", "Issuing State / Authority is required"],
      ["form20Number", "Form 20 Number is required"],
      ["form20GrantDate", "Form 20 Date of Grant is required"],
      ["retentionDueDate", "Retention Due Date is required"],
      ["pharmacistFullName", "Pharmacist Full Name is required"],
      ["registrationNumber", "Registration Number is required"],
      ["statePharmacyCouncil", "State Pharmacy Council is required"],
      ["registrationValidityDate", "Registration Validity Date is required"],
      ["employmentType", "Employment Type is required"],
      ["pharmacistPhone", "Pharmacist Phone is required"],
    ];

    requiredFields.forEach(([field, message]) => {
      if (!String(data[field] || "").trim()) {
        nextErrors[field] = message;
      }
    });

    if (
      data.retentionDueDate &&
      data.retentionDueDate <= todayString
    ) {
      nextErrors.retentionDueDate =
        "Retention due date must be a future date";
    }

    if (
      data.registrationValidityDate &&
      data.registrationValidityDate < todayString
    ) {
      nextErrors.registrationValidityDate =
        "Registration validity date cannot be in the past";
    }

    if (
      data.form20GrantDate &&
      data.form20GrantDate > todayString
    ) {
      nextErrors.form20GrantDate =
        "Grant date cannot be in the future";
    }

    if (
      data.pharmacistPhone &&
      !/^[6-9]\d{9}$/.test(data.pharmacistPhone)
    ) {
      nextErrors.pharmacistPhone =
        "Enter a valid 10-digit mobile number";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (loading || !validate()) return;
    onNext?.();
  };

  const icon = (Icon) => (
    <InputAdornment position="start">
      <Icon sx={{ fontSize: 16, color: C.muted }} />
    </InputAdornment>
  );

  const renderField = ({
    field,
    label,
    placeholder = "",
    helperText = "",
    type = "text",
    Icon,
    maxLength,
    numeric = false,
    optional = false,
    min,
  }) => (
    <Grid size={{ xs: 12, sm: 6 }}>
      <FieldLabel optional={optional}>{label}</FieldLabel>

      <TextField
        fullWidth
        type={type}
        placeholder={placeholder}
        value={data[field] || ""}
        onChange={(e) => {
          let value = e.target.value;

          if (numeric) {
            value = value.replace(/\D/g, "");
          }

          if (maxLength) {
            value = value.slice(0, maxLength);
          }

          setField(field, value);
        }}
        error={Boolean(errors[field])}
        helperText={errors[field] || helperText || ""}
        sx={inputSx}
        slotProps={{
          htmlInput: {
            ...(maxLength ? { maxLength } : {}),
            ...(numeric ? { inputMode: "numeric" } : {}),
            ...(min ? { min } : {}),
          },
          input: Icon
            ? { startAdornment: icon(Icon) }
            : {},
        }}
      />
    </Grid>
  );

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          bgcolor: C.white,
        }}
      >
        {/* HEADER + ACTION BUTTONS */}

        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <DescriptionOutlinedIcon
              sx={{ color: C.text, fontSize: 21 }}
            />

            <Typography
              sx={{
                fontSize: { xs: "15px", sm: "18px" },
                fontWeight: 750,
                color: C.text,
              }}
            >
              D. Drug Licence & E. Pharmacist
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: { xs: "100%", sm: "auto" },
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={loading}
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                height: 35,
                px: 1.5,
                borderColor: C.border,
                color: C.text,
                borderRadius: "7px",
                textTransform: "none",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={13} color="inherit" />
                ) : (
                  <ArrowForwardRoundedIcon />
                )
              }
              sx={{
                height: 35,
                px: 1.5,
                bgcolor: C.primary,
                borderRadius: "7px",
                boxShadow: "none",
                textTransform: "none",
                fontSize: "11px",
                fontWeight: 700,
                "&:hover": { bgcolor: C.hover, boxShadow: "none" },
              }}
            >
              {loading ? "Saving..." : "Next"}
            </Button>
          </Stack>
        </Box>

        {/* DRUG LICENCE DETAILS */}

        <Grid container spacing={{ xs: 1.7, md: 2 }}>
          {renderField({
            field: "issuingAuthority",
            label: "Issuing State / Authority",
            placeholder: "e.g., MP FDA",
          })}

          {renderField({
            field: "form20Number",
            label: "Form 20 Number",
            placeholder: "Enter Form 20 number",
            maxLength: 50,
          })}

          {renderField({
            field: "form20GrantDate",
            label: "Form 20 Date of Grant",
            type: "date",
            max: todayString,
          })}

          {renderField({
            field: "retentionDueDate",
            label: "Retention Due Date",
            type: "date",
            min: todayString,
            helperText: "Must be a future date",
          })}
        </Grid>

        {/* SCHEDULE C / C1 CHECKBOX */}

        <Box
          sx={{
            mt: 2.5,
            p: 1.3,
            border: `1px solid ${C.border}`,
            borderRadius: "9px",
            bgcolor: "#F8FAFC",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <Checkbox
              checked={Boolean(data.dispenseScheduleC1)}
              onChange={(e) =>
                setField("dispenseScheduleC1", e.target.checked)
              }
              size="small"
              sx={{
                p: 0.5,
                color: "#AEB8C2",
                "&.Mui-checked": { color: C.primary },
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                Do you dispense Schedule C/C1 drugs?
              </Typography>

              <Typography
                sx={{
                  mt: 0.25,
                  fontSize: "10px",
                  color: C.muted,
                }}
              >
                Antibiotics, Insulins, Vaccines etc. Requires Form 21.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* REGISTERED PHARMACIST */}

        <Box sx={{ mt: 2.5 }}>
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 750,
              color: C.text,
              mb: 1,
            }}
          >
            Registered Pharmacist Details
          </Typography>

          <Divider sx={{ mb: 1.8, borderColor: C.border }} />

          <Grid container spacing={{ xs: 1.7, md: 2 }}>
            {renderField({
              field: "pharmacistFullName",
              label: "Pharmacist Full Name",
              placeholder: "As per Licence Endorsement",
              Icon: LocalPharmacyOutlinedIcon,
              maxLength: 100,
            })}

            {renderField({
              field: "registrationNumber",
              label: "Registration Number",
              placeholder: "Enter registration number",
              maxLength: 50,
            })}

            {renderField({
              field: "statePharmacyCouncil",
              label: "State Pharmacy Council",
              placeholder: "Enter state pharmacy council",
              maxLength: 100,
            })}

            {renderField({
              field: "registrationValidityDate",
              label: "Registration Validity Date",
              type: "date",
              Icon: CalendarMonthOutlinedIcon,
              min: todayString,
            })}

            <Grid size={{ xs: 12, sm: 6 }}>
              <FieldLabel>Employment Type</FieldLabel>

              <FormControl fullWidth>
                <Select
                  value={data.employmentType || "Full-time Employee"}
                  onChange={(e) => {
                    const employmentType = e.target.value;
                    onChange?.({
                      employmentType,
                      ...(employmentType === "Owner"
                        ? { appointmentLetterRequired: false }
                        : {}),
                    });
                    setErrors((previous) => ({
                      ...previous,
                      employmentType: "",
                    }));
                  }}
                  sx={inputSx}
                >
                  <MenuItem value="Full-time Employee">
                    Full-time Employee
                  </MenuItem>
                  <MenuItem value="Part-time Employee">
                    Part-time Employee
                  </MenuItem>
                  <MenuItem value="Owner">
                    Owner
                  </MenuItem>
                  <MenuItem value="Consultant">
                    Consultant
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {renderField({
              field: "hprDigiPharmedId",
              label: "HPR / DigiPharmed ID",
              placeholder: "Enter ID",
              optional: true,
              maxLength: 60,
            })}

            <Grid size={{ xs: 12 }}>
              <FieldLabel>Pharmacist Phone (For Consent OTP)</FieldLabel>

              <TextField
                fullWidth
                placeholder="Enter 10-digit mobile number"
                value={data.pharmacistPhone || ""}
                onChange={(e) =>
                  setField(
                    "pharmacistPhone",
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                error={Boolean(errors.pharmacistPhone)}
                helperText={
                  errors.pharmacistPhone ||
                  "Required to confirm pharmacist presence and prevent certificate lending."
                }
                sx={inputSx}
                slotProps={{
                  htmlInput: {
                    inputMode: "numeric",
                    maxLength: 10,
                  },
                  input: { startAdornment: icon(PhoneOutlinedIcon) },
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}