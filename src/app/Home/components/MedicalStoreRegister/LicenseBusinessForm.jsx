"use client";

import * as React from "react";

import {
  Alert,
  Box,
  Button,
  Checkbox,
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
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

const C = {
  primary: "#07876A",
  primaryHover: "#066F58",
  primaryLight: "#EAF7F3",
  text: "#263445",
  muted: "#74807B",
  border: "#E3E8EC",
  inputBorder: "#D9DDE3",
  error: "#E5484D",
  white: "#FFFFFF",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 39,
    borderRadius: "7px",
    backgroundColor: C.white,
    fontSize: "12px",

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
    py: 1,
    px: 1.4,
  },

  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    fontSize: 17,
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
        <Box component="span" sx={{ color: C.error }}>
          {" "}*
        </Box>
      )}
    </Typography>
  );
}

export default function LicenseBusinessForm({
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

  const validate = () => {
    const newErrors = {};

    const drugLicenseNumber =
      data.drugLicenseNumber?.trim() || "";

    const expiry = data.licenseExpiryDate || "";

    const gstin =
      data.gstin?.trim().toUpperCase() || "";

    if (!drugLicenseNumber) {
      newErrors.drugLicenseNumber =
        "Drug license number is required";
    } else if (drugLicenseNumber.length < 5) {
      newErrors.drugLicenseNumber =
        "Enter a valid drug license number";
    }

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

    if (data.collectPayments && !gstin) {
      newErrors.gstin =
        "GSTIN is required when the platform collects payments";
    } else if (gstin) {
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

  const handleNext = () => {
    if (loading || !validate()) return;
    onNext?.();
  };

  const icon = (Icon) => (
    <InputAdornment position="start">
      <Icon sx={{ fontSize: 16, color: C.muted }} />
    </InputAdornment>
  );

  const licenseComplete =
    Boolean(data.drugLicenseNumber) &&
    Boolean(data.licenseExpiryDate);

  const renderTextField = ({
    field,
    label,
    placeholder,
    helperText,
    Icon,
    optional = false,
    type = "text",
    maxLength,
    numeric = false,
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

          if (numeric) value = value.replace(/\D/g, "");
          if (field === "gstin" || field === "drugLicenseNumber") {
            value = value.toUpperCase();
          }
          if (maxLength) value = value.slice(0, maxLength);

          setField(field, value);
        }}
        error={Boolean(errors[field])}
        helperText={errors[field] || helperText || ""}
        sx={inputSx}
        slotProps={{
          htmlInput: {
            ...(maxLength ? { maxLength } : {}),
            ...(numeric ? { inputMode: "numeric" } : {}),
            ...(type === "date"
              ? { min: new Date().toISOString().split("T")[0] }
              : {}),
          },
          input: {
            ...(Icon ? { startAdornment: icon(Icon) } : {}),
          },
        }}
      />
    </Grid>
  );

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      {/* MAIN FORM CARD */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          border: `1px solid ${C.border}`,
          borderRadius: "12px",
          bgcolor: C.white,
        }}
      >
    {/* HEADER + TOP RIGHT BUTTONS */}
<Stack
  direction="row"
  alignItems="center"
  justifyContent="space-between"
  flexWrap="wrap"
  gap={1.5}
  sx={{ mb: 2 }}
>
  <Stack
    direction="row"
    alignItems="center"
    spacing={1.2}
  >
    <BadgeOutlinedIcon
      sx={{ color: C.text, fontSize: 22 }}
    />

    <Typography
      sx={{
        fontSize: { xs: "16px", sm: "19px" },
        fontWeight: 750,
        color: C.text,
        lineHeight: 1.4,
      }}
    >
      B. Authorised Signatory / Owner
    </Typography>
  </Stack>

  {/* TOP RIGHT ACTIONS */}
  <Stack direction="row" spacing={1}>
    <Button
      onClick={onBack}
      startIcon={<ArrowBackRoundedIcon />}
      sx={{
        minHeight: 36,
        px: 1.8,
        border: `1px solid ${C.border}`,
        borderRadius: "7px",
        color: C.text,
        textTransform: "none",
        fontSize: "12px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        "&:hover": {
          bgcolor: "#F8FAF9",
        },
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
          <CircularProgress size={14} color="inherit" />
        ) : (
          <ArrowForwardRoundedIcon />
        )
      }
      sx={{
        minHeight: 36,
        px: 1.8,
        borderRadius: "7px",
        bgcolor: C.primary,
        color: "#FFFFFF",
        boxShadow: "none",
        textTransform: "none",
        fontSize: "12px",
        fontWeight: 700,
        whiteSpace: "nowrap",
        "&:hover": {
          bgcolor: C.primaryHover,
        },
        "&.Mui-disabled": {
          bgcolor: "#A9BDB6",
          color: "#FFFFFF",
        },
      }}
    >
      {loading ? "Saving..." : "Next"}
    </Button>
  </Stack>
</Stack>

        {/* INFORMATION BOX */}
        <Alert
          severity="warning"
          icon={false}
          sx={{
            mb: 2.2,
            py: 0.5,
            px: 1.8,
            bgcolor: "#FFFBEB",
            color: "#92501D",
            border: "1px solid #FDE68A",
            borderRadius: "9px",
            "& .MuiAlert-message": {
              p: 0,
              fontSize: "12px",
              lineHeight: 1.7,
            },
          }}
        >
          <Box component="span" sx={{ fontWeight: 700 }}>
            Data Minimisation Note:
          </Box>{" "}
          As per DPDP Act guidelines, do not enter unnecessary
          personal details. Only the information required for
          business verification should be provided.
        </Alert>

        {/* LICENSE DETAILS */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mb: 1.6 }}
        >
          <DescriptionOutlinedIcon
            sx={{ color: C.primary, fontSize: 18 }}
          />

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: C.text,
            }}
          >
            Drug License Information
          </Typography>

          {licenseComplete && (
            <CheckCircleRoundedIcon
              sx={{ ml: "auto !important", color: C.primary, fontSize: 17 }}
            />
          )}
        </Stack>

        <Grid container spacing={{ xs: 1.7, md: 2 }}>
          {renderTextField({
            field: "drugLicenseNumber",
            label: "Drug License Number",
            placeholder: "Enter drug license number",
            helperText: "As printed on your drug license",
            Icon: BadgeOutlinedIcon,
            maxLength: 40,
          })}

          {renderTextField({
            field: "licenseExpiryDate",
            label: "License Expiry Date",
            placeholder: "",
            helperText: "Expiry date mentioned on license",
            Icon: CalendarMonthOutlinedIcon,
            type: "date",
          })}
        </Grid>

        <Divider sx={{ my: 2.2, borderColor: C.border }} />

        {/* BUSINESS DETAILS */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mb: 1.6 }}
        >
          <BusinessOutlinedIcon
            sx={{ color: C.primary, fontSize: 18 }}
          />

          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: C.text,
            }}
          >
            Business Information
          </Typography>
        </Stack>

        <Box
          sx={{
            mb: 1,
            p: 1,
            border: `1px solid ${C.border}`,
            borderRadius: "9px",
            bgcolor: "#F8FAFC",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Checkbox
              size="small"
              checked={Boolean(data.gstinApplicable || data.collectPayments)}
              disabled={Boolean(data.collectPayments)}
              onChange={(event) =>
                setField("gstinApplicable", event.target.checked)
              }
              inputProps={{ "aria-label": "GSTIN applies to this business" }}
              sx={{ color: C.primary, "&.Mui-checked": { color: C.primary } }}
            />
            <Typography sx={{ fontSize: "11px", color: C.text }}>
              GSTIN applies to this business or is needed for this workflow
              {data.collectPayments ? " (required for payment collection)" : ""}
            </Typography>
          </Stack>
        </Box>

        {(data.gstinApplicable || data.collectPayments) && (
          <Grid container spacing={{ xs: 1.7, md: 2 }}>
            {renderTextField({
              field: "gstin",
              label: "GSTIN",
              placeholder: "e.g. 23ABCDE1234F1Z5",
              helperText: "Enter only if applicable to this business",
              Icon: BusinessOutlinedIcon,
              optional: !data.collectPayments,
              maxLength: 15,
            })}
          </Grid>
        )}

        {/* NOTE */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          sx={{
            mt: 2.2,
            p: 1.4,
            bgcolor: "#F4FAF7",
            border: "1px solid rgba(7,135,106,0.12)",
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
                lineHeight: 1.6,
                color: C.muted,
              }}
            >
              Your drug license and pharmacist registration
              details will be verified before your medical store
              is approved on Jeevan Dev.
            </Typography>
          </Box>
        </Stack>

        {Object.values(errors).some(Boolean) && (
          <Typography
            sx={{
              mt: 1.5,
              fontSize: "11px",
              color: C.error,
            }}
          >
            Please correct the highlighted fields before continuing.
          </Typography>
        )}
      </Paper>

 
    </Box>
  );
}