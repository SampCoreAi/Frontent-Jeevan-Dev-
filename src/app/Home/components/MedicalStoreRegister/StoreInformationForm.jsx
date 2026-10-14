
"use client";

import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 46,
    borderRadius: "8px",
    backgroundColor: "#FFFFFF",
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
  },
  "& .MuiInputBase-input": {
    fontSize: "12px",
    py: 1.2,
  },
  "& .MuiFormHelperText-root": {
    fontSize: "10px",
    mx: 0.5,
  },
};

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

export default function StoreInformationForm({
  data = {},
  onChange,
  onNext,
  loading = false,
}) {
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);

  const setField = (field, value) => {
    onChange({ [field]: value });

    setErrors((prev) => ({
      ...prev,
      [field]: "",
      api: "",
      otpMessage: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!String(data.licensedTradeName || "").trim()) {
      nextErrors.licensedTradeName =
        "Licensed Trade Name is required";
    }

    if (!String(data.legalEntityName || "").trim()) {
      nextErrors.legalEntityName =
        "Legal Entity Name is required";
    }

    if (!String(data.entityType || "").trim()) {
      nextErrors.entityType = "Entity Type is required";
    }

    if (!String(data.storeEmail || "").trim()) {
      nextErrors.storeEmail = "Store Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        data.storeEmail.trim()
      )
    ) {
      nextErrors.storeEmail = "Enter a valid email address";
    }

    if (!String(data.storePhone || "").trim()) {
      nextErrors.storePhone = "Store Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(data.storePhone)) {
      nextErrors.storePhone =
        "Enter a valid 10-digit mobile number";
    }

    [
      ["signatoryFullName", "Signatory full name is required"],
      ["signatoryDesignation", "Signatory designation is required"],
      ["signatoryEmail", "Signatory email is required"],
      ["signatoryPhone", "Signatory phone is required"],
    ].forEach(([field, message]) => {
      if (!String(data[field] || "").trim()) {
        nextErrors[field] = message;
      }
    });

    if (
      data.signatoryEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.signatoryEmail.trim())
    ) {
      nextErrors.signatoryEmail = "Enter a valid email address";
    }

    if (
      data.signatoryPhone &&
      !/^[6-9]\d{9}$/.test(data.signatoryPhone)
    ) {
      nextErrors.signatoryPhone =
        "Enter a valid 10-digit mobile number";
    }

    ["entityPan", "personalPan"].forEach((field) => {
      if (
        data[field] &&
        !/^[A-Z]{5}\d{4}[A-Z]$/.test(data[field].toUpperCase())
      ) {
        nextErrors[field] = "Enter a valid PAN number";
      }
    });

    if (!String(data.shopUnit || "").trim()) {
      nextErrors.shopUnit =
        "Shop/Unit No. & Building is required";
    }

    if (!String(data.street || "").trim()) {
      nextErrors.street = "Street is required";
    }

    if (!String(data.cityDistrict || "").trim()) {
      nextErrors.cityDistrict = "City/District is required";
    }

    if (!String(data.state || "").trim()) {
      nextErrors.state = "State is required";
    }

    if (!String(data.pinCode || "").trim()) {
      nextErrors.pinCode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(data.pinCode)) {
      nextErrors.pinCode = "Enter a valid 6-digit PIN Code";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = async () => {
    if (submitting || loading || !validate()) return;

    setSubmitting(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const baseURL = (
        process.env.NEXT_PUBLIC_API_URL || ""
      ).replace(/\/+$/, "");

      if (!baseURL) {
        throw new Error(
          "Please configure NEXT_PUBLIC_API_URL in .env.local"
        );
      }

      const payload = {
        licensedTradeName: data.licensedTradeName.trim(),
        legalEntityName: data.legalEntityName.trim(),
        entityType: data.entityType,
        storeEmail: data.storeEmail.trim(),
        storePhone: data.storePhone,
        premisesDetails: {
          shopUnit: data.shopUnit.trim(),
          street: data.street.trim(),
          area: (data.area || "").trim(),
          cityDistrict: data.cityDistrict.trim(),
          state: data.state.trim(),
          pinCode: data.pinCode,
        },
        signatoryDetails: {
          fullName: (data.signatoryFullName || "").trim(),
          designation: (data.signatoryDesignation || "").trim(),
          email: (data.signatoryEmail || "").trim(),
          phone: data.signatoryPhone || "",
          entityPan:
            data.entityType !== "Proprietorship" && data.entityPan
              ? data.entityPan.trim().toUpperCase()
              : null,
          personalPan:
            data.entityType === "Proprietorship" && data.personalPan
              ? data.personalPan.trim().toUpperCase()
              : null,
        },
      };

      const response = await fetch(
        `${baseURL}/api/pharmacy-registration/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            `Registration failed (${response.status})`
        );
      }

      if (result?.success === false) {
        throw new Error(result.message || "Registration could not be created.");
      }

      if (typeof onNext === "function") {
        onNext(result);
      } else {
        throw new Error("Next step navigation is not connected.");
      }
    } catch (error) {
      console.error("Pharmacy registration error:", error);

      setErrors((prev) => ({
        ...prev,
        api: error.message || "Registration failed",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const icon = (Icon) => (
    <InputAdornment position="start">
      <Icon sx={{ fontSize: 17, color: C.muted }} />
    </InputAdornment>
  );

  const renderTextField = ({
    field,
    label,
    placeholder = "",
    optional = false,
    type = "text",
    adornment = null,
    maxLength,
    numeric = false,
    helperText = "",
  }) => (
    <Grid size={{ xs: 12, md: 6 }}>
      <Label optional={optional}>{label}</Label>

      <TextField
        fullWidth
        type={type}
        placeholder={placeholder}
        value={data[field] || ""}
        onChange={(e) => {
          let value = e.target.value;

          if (numeric) value = value.replace(/\D/g, "");
          if (field === "entityPan" || field === "personalPan") {
            value = value.toUpperCase();
          }
          if (maxLength) value = value.slice(0, maxLength);

          setField(field, value);
        }}
        error={Boolean(errors[field])}
        helperText={errors[field] || helperText}
        sx={inputSx}
        slotProps={{
          htmlInput: {
            ...(maxLength ? { maxLength } : {}),
            ...(numeric ? { inputMode: "numeric" } : {}),
          },
          input: adornment
            ? { startAdornment: icon(adornment) }
            : {},
        }}
      />
    </Grid>
  );

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2.25, md: 3 },
          border: `1px solid ${C.border}`,
          borderRadius: { xs: "10px", sm: "14px" },
          bgcolor: C.white,
          boxShadow: "0 8px 28px rgba(23, 32, 51, 0.06)",
        }}
      >
        {/* HEADING + NEXT BUTTON */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 3,
            py: 1,
            mb: 1.5,
            bgcolor: C.white,
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <StorefrontOutlinedIcon
              sx={{ color: C.primary, fontSize: 22 }}
            />

            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "15px" },
                fontWeight: 750,
                color: C.text,
              }}
            >
              A. Pharmacy Identity & C. Premises
            </Typography>
          </Stack>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading || submitting}
            endIcon={
              loading || submitting ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <ArrowForwardIcon sx={{ fontSize: "16px !important" }} />
              )
            }
            sx={{
              alignSelf: { xs: "stretch", sm: "center" },
              flexShrink: 0,
              minWidth: 105,
              height: 38,
              px: 2,
              bgcolor: "#07876A",
              borderRadius: "8px",
              boxShadow: "none",
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#066F58",
                boxShadow: "none",
              },
            }}
          >
            {submitting ? "Saving..." : "Next Step"}
          </Button>
        </Stack>

        {/* MANDATORY NOTE */}
        <Alert
          severity="info"
          icon={false}
          sx={{
            mt: 2,
            mb: 2,
            py: 0.2,
            bgcolor: "#EFF6FF",
            color: "#315A9B",
            border: "1px solid #DBEAFE",
            borderRadius: "8px",
            fontSize: "12px",
          }}
        >
          <strong>Mandatory:</strong> Ensure the names and
          addresses perfectly match your Form 20/21 Drug Licence.
        </Alert>

        {/* STORE DETAILS */}
        <Grid container spacing={2}>
          {renderTextField({
            field: "licensedTradeName",
            label: "Licensed Trade Name",
            placeholder: "As per Drug Licence",
          })}

          {renderTextField({
            field: "legalEntityName",
            label: "Legal Entity Name",
            placeholder: "As per PAN/COI",
          })}

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>Entity Type</Label>

            <FormControl fullWidth error={Boolean(errors.entityType)}>
              <Select
                value={data.entityType || ""}
                displayEmpty
                onChange={(e) => {
                  const entityType = e.target.value;
                  onChange({
                    entityType,
                    personalPan:
                      entityType === "Proprietorship"
                        ? data.personalPan
                        : "",
                    entityPan:
                      entityType === "Proprietorship"
                        ? ""
                        : data.entityPan,
                  });
                  setErrors((previous) => ({
                    ...previous,
                    entityType: "",
                    personalPan: "",
                    entityPan: "",
                  }));
                }}
                sx={{
                  height: 46,
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                  fontSize: "12px",
                  "& fieldset": { borderColor: C.input },
                  "&:hover fieldset": { borderColor: "#9CB7AF" },
                  "&.Mui-focused fieldset": {
                    borderColor: C.primary,
                  },
                }}
                renderValue={(value) =>
                  value || (
                    <Box sx={{ color: C.muted }}>
                      Select entity type
                    </Box>
                  )
                }
              >
                <MenuItem value="Proprietorship">Proprietorship</MenuItem>
                <MenuItem value="Partnership">Partnership</MenuItem>
                <MenuItem value="LLP">LLP</MenuItem>
                <MenuItem value="Private Limited">Private Limited</MenuItem>
                <MenuItem value="Public Limited">Public Limited</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>

              {errors.entityType && (
                <Typography
                  sx={{
                    color: C.error,
                    fontSize: "10px",
                    mt: 0.5,
                    ml: 1,
                  }}
                >
                  {errors.entityType}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>Store Email</Label>

            <TextField
              fullWidth
              type="email"
              placeholder="Enter store email"
              value={data.storeEmail || ""}
              onChange={(e) =>
                setField("storeEmail", e.target.value.replace(/\s/g, ""))
              }
              error={Boolean(errors.storeEmail)}
              helperText={errors.storeEmail || ""}
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: icon(MailOutlineIcon),

                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Label>Store Phone</Label>

            <TextField
              fullWidth
              placeholder="10-digit mobile number"
              value={data.storePhone || ""}
              onChange={(e) =>
                setField(
                  "storePhone",
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              error={Boolean(errors.storePhone)}
              helperText={errors.storePhone || ""}
              sx={inputSx}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  maxLength: 10,
                },
                input: {
                  startAdornment: icon(PhoneOutlinedIcon),

                },
              }}
            />
          </Grid>
        </Grid>

        {errors.otpMessage && (
          <Typography sx={{ mt: 1, color: C.muted, fontSize: "11px" }}>
            {errors.otpMessage}
          </Typography>
        )}

        {/* AUTHORIZED SIGNATORY */}
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 750,
              color: C.text,
              mb: 1,
            }}
          >
            Authorized Signatory Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {renderTextField({
              field: "signatoryFullName",
              label: "Full Name",
              placeholder: "As per identity documents",
            })}
            {renderTextField({
              field: "signatoryDesignation",
              label: "Designation",
              placeholder: "e.g. Owner, Director",
            })}
            {renderTextField({
              field: "signatoryEmail",
              label: "Email",
              placeholder: "Enter signatory email",
              type: "email",
            })}
            {renderTextField({
              field: "signatoryPhone",
              label: "Phone",
              placeholder: "10-digit mobile number",
              numeric: true,
              maxLength: 10,
            })}
            {data.entityType === "Proprietorship" &&
              renderTextField({
                field: "personalPan",
                label: "Personal PAN",
                placeholder: "ABCDE1234F",
                type: "password",
                helperText: "Optional; provide only if required for verification",
                optional: true,
                maxLength: 10,
              })}
            {data.entityType &&
              data.entityType !== "Proprietorship" &&
              renderTextField({
                field: "entityPan",
                label: "Entity PAN",
                placeholder: "ABCDE1234F",
                type: "password",
                helperText: "Optional; provide only if required for verification",
                optional: true,
                maxLength: 10,
              })}
          </Grid>
        </Box>

        {/* PREMISES DETAILS */}
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 750,
              color: C.text,
              mb: 1,
            }}
          >
            Premises Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {renderTextField({
              field: "shopUnit",
              label: "Shop/Unit No. & Building",
              placeholder: "Enter building details",
              adornment: BusinessOutlinedIcon,
            })}

            {renderTextField({
              field: "street",
              label: "Street",
              placeholder: "Enter street",
            })}

            {renderTextField({
              field: "area",
              label: "Area",
              placeholder: "Enter area",
              optional: true,
            })}

            {renderTextField({
              field: "cityDistrict",
              label: "City/District",
              placeholder: "Enter city or district",
            })}

            {renderTextField({
              field: "state",
              label: "State",
              placeholder: "Enter state",
            })}

            {renderTextField({
              field: "pinCode",
              label: "PIN Code",
              placeholder: "6-digit PIN code",
              numeric: true,
              maxLength: 6,
            })}

            {renderTextField({
              field: "landmark",
              label: "Landmark",
              placeholder: "Enter nearby landmark",
              optional: true,
            })}
          </Grid>
        </Box>

        {errors.api && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.api}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
