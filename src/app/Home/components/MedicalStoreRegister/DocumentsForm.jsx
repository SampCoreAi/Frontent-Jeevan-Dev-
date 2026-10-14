
"use client";

import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  isPharmacyDocumentRequired,
  PHARMACY_DOCUMENTS,
} from "./registrationRequirements";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#263445",
  muted: "#74807B",
  border: "#E3E8EC",
  inputBorder: "#D9DDE3",
  white: "#FFFFFF",
  error: "#E5484D",
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 36,
    borderRadius: "7px",
    backgroundColor: C.white,
    fontSize: "12px",
    "& fieldset": { borderColor: C.inputBorder },
    "&:hover fieldset": { borderColor: "#9CB7AF" },
    "&.Mui-focused fieldset": {
      borderColor: C.primary,
      borderWidth: "1px",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "12px",
    py: 0.9,
    px: 1.3,
  },
};

function FieldLabel({ children }) {
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
    </Typography>
  );
}

function formatFileSize(size) {
  return size < 1024 * 1024
    ? `${(size / 1024).toFixed(0)} KB`
    : `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function UploadCard({ document, file, onFileChange, onRemove, error }) {
  const inputId = React.useId();

  return (
    <Box
      sx={{
        minHeight: 100,
        height: "100%",
        p: 1.2,
        border: `1px dashed ${error ? C.error : "#CDD5DC"}`,
        borderRadius: "11px",
        bgcolor: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.7,
        textAlign: "center",
        "&:hover": {
          borderColor: C.primary,
          bgcolor: "#F4FAF7",
        },
      }}
    >
      <Typography
        sx={{
          minHeight: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11.5px",
          fontWeight: 700,
          lineHeight: 1.4,
          color: C.text,
        }}
      >
        {document.label}
        <Box
          component="span"
          sx={{
            ml: 0.5,
            color: document.required ? C.error : C.muted,
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          {document.required ? "Required" : "Optional"}
        </Box>
      </Typography>

      <Typography sx={{ fontSize: "10px", color: C.muted }}>
        PDF, JPG or PNG up to 5MB
      </Typography>

      <Button
        component="label"
        htmlFor={inputId}
        size="small"
        variant="outlined"
        startIcon={<CloudUploadOutlinedIcon />}
        sx={{
          minHeight: 28,
          px: 1,
          borderRadius: "6px",
          borderColor: "#D6E1DC",
          color: C.primary,
          bgcolor: "#FFFFFF",
          textTransform: "none",
          fontSize: "10px",
          "& .MuiButton-startIcon": { mr: 0.5 },
          "&:hover": {
            borderColor: C.primary,
            bgcolor: "#F0F9F5",
          },
        }}
      >
        {file?.name ? "Change File" : "Choose File"}

        <input
          id={inputId}
          hidden
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) onFileChange(document.field, selectedFile);
            event.target.value = "";
          }}
        />
      </Button>

      {file?.name && (
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <Typography
            title={file.name}
            sx={{
              width: "100%",
              fontSize: "10px",
              color: C.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.name} · {formatFileSize(file.size)}
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
          >
            <Typography sx={{ fontSize: "9px", color: C.muted }}>
              Selected; verification pending
            </Typography>
            <Button
              size="small"
              onClick={() => onRemove(document.field)}
              aria-label={`Remove ${document.label}`}
              startIcon={<DeleteOutlineRoundedIcon />}
              sx={{
                minWidth: 0,
                p: 0.2,
                color: C.error,
                textTransform: "none",
                fontSize: "9px",
                "& .MuiButton-startIcon": { mr: 0.25 },
              }}
            >
              Remove
            </Button>
          </Stack>
        </Box>
      )}

      {error && (
        <Typography sx={{ fontSize: "10px", color: C.error }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default function TaxBankUploadsForm({
  data = {},
  onChange,
  onBack,
  onNext,
  loading = false,
}) {
  const [errors, setErrors] = React.useState({});
  const [localFiles, setLocalFiles] = React.useState({});

  const setField = (field, value) => {
    onChange?.({ [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (field, file) => {
    const duplicate = Object.entries({
      ...data,
      ...localFiles,
    }).find(
      ([otherField, existingFile]) =>
        otherField !== field &&
        existingFile instanceof File &&
        existingFile.name === file.name &&
        existingFile.size === file.size &&
        existingFile.lastModified === file.lastModified,
    );

    if (duplicate) {
      setErrors((prev) => ({
        ...prev,
        [field]: "This file is already selected for another document",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [field]: "File size must be 5MB or less",
      }));
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [field]: "Upload a PDF, JPG, or PNG file",
      }));
      return;
    }

    setLocalFiles((prev) => ({ ...prev, [field]: file }));
    setField(field, file);
  };

  const handleRemoveFile = (field) => {
    setLocalFiles((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
    setField(field, null);
  };

  const requiredDocuments = PHARMACY_DOCUMENTS.map((document) => ({
    ...document,
    required: isPharmacyDocumentRequired(document.field, data),
  }));

  const validate = () => {
    const nextErrors = {};

    requiredDocuments.forEach(({ field, required }) => {
      if (required && !(localFiles[field] || data[field])) {
        nextErrors[field] = "Required";
      }
    });

    if (
      data.collectPayments &&
      !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(
        String(data.gstin || "").trim().toUpperCase(),
      )
    ) {
      nextErrors.gstin =
        "Enter a valid GSTIN before enabling platform payment collection";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (loading || !validate()) return;
    onNext?.();
  };

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
        {/* HEADER: TITLE LEFT, BUTTONS RIGHT */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccountBalanceOutlinedIcon
              sx={{ fontSize: 21, color: C.text }}
            />

            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "19px" },
                fontWeight: 750,
                color: C.text,
              }}
            >
              F. Tax, Bank & G. Uploads
            </Typography>
          </Stack>

          <Stack
            direction="row"
            justifyContent={{ xs: "flex-end", sm: "flex-end" }}
            alignItems="center"
            spacing={1}
          >
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBackRoundedIcon />}
              sx={{
                minHeight: 34,
                px: 1.8,
                borderColor: C.border,
                borderRadius: "7px",
                color: C.text,
                textTransform: "none",
                fontSize: "11.5px",
                fontWeight: 600,
                whiteSpace: "nowrap",
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
                minHeight: 34,
                px: 1.8,
                borderRadius: "7px",
                bgcolor: C.primary,
                boxShadow: "none",
                textTransform: "none",
                fontSize: "11.5px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: C.hover,
                  boxShadow: "none",
                },
              }}
            >
              {loading ? "Saving..." : "Next"}
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 2, borderColor: C.border }} />

        {/* PAYMENT COLLECTION */}
        <Box
          sx={{
            mb: 2,
            px: 1.2,
            py: 1,
            border: "1px solid #CFE2FF",
            borderRadius: "11px",
            bgcolor: "#EFF6FF",
          }}
        >
          <Stack direction="row" alignItems="flex-start" spacing={0.8}>
            <Checkbox
              size="small"
              checked={Boolean(data.collectPayments)}
              onChange={(e) => setField("collectPayments", e.target.checked)}
              sx={{
                p: 0.4,
                color: "#9AA8B8",
                "&.Mui-checked": { color: C.primary },
              }}
            />

            <Box sx={{ pt: 0.3 }}>
              <Typography sx={{ fontSize: "11.5px", fontWeight: 700, color: C.text }}>
                Will the platform collect payments on your behalf?
              </Typography>
              <Typography sx={{ mt: 0.3, fontSize: "10px", color: C.muted, lineHeight: 1.5 }}>
                Select this only if the platform payment or settlement workflow is enabled.
                Applicable tax and settlement details will be required by that workflow.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* REGISTRATION NUMBERS */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Checkbox
                size="small"
                checked={Boolean(data.shopEstablishmentApplicable)}
                onChange={(event) =>
                  setField("shopEstablishmentApplicable", event.target.checked)
                }
                inputProps={{
                  "aria-label": "Shop and Establishment registration applies",
                }}
                sx={{ color: C.primary, "&.Mui-checked": { color: C.primary } }}
              />
              <Typography sx={{ fontSize: "11px", color: C.text }}>
                Shop & Establishment registration applies to this store
              </Typography>
            </Stack>
            {data.shopEstablishmentApplicable && (
              <>
                <FieldLabel>
                  Shop & Establishment No. (Required if applicable)
                </FieldLabel>
                <TextField
                  fullWidth
                  placeholder="Enter registration number"
                  value={data.shopEstablishmentNumber || ""}
                  onChange={(e) =>
                    setField("shopEstablishmentNumber", e.target.value)
                  }
                  error={Boolean(errors.shopEstablishmentNumber)}
                  helperText={errors.shopEstablishmentNumber || ""}
                  sx={inputSx}
                />
              </>
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FieldLabel>Udyam Registration No. (Optional)</FieldLabel>
            <TextField
              fullWidth
              placeholder="Enter Udyam registration number"
              value={data.udyamRegistrationNumber || ""}
              onChange={(e) =>
                setField("udyamRegistrationNumber", e.target.value.toUpperCase())
              }
              sx={inputSx}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 1 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Checkbox
              size="small"
              checked={Boolean(data.retentionFeeRequired)}
              onChange={(event) =>
                setField("retentionFeeRequired", event.target.checked)
              }
              inputProps={{
                "aria-label": "Drug retention fee receipt is required",
              }}
              sx={{ color: C.primary, "&.Mui-checked": { color: C.primary } }}
            />
            <Typography sx={{ fontSize: "11px", color: C.text }}>
              A drug retention fee receipt is required for this application
            </Typography>
          </Stack>
          {data.employmentType && data.employmentType !== "Owner" && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Checkbox
                size="small"
                checked={Boolean(data.appointmentLetterRequired)}
                onChange={(event) =>
                  setField("appointmentLetterRequired", event.target.checked)
                }
                inputProps={{
                  "aria-label":
                    "Pharmacist appointment letter is required for this arrangement",
                }}
                sx={{ color: C.primary, "&.Mui-checked": { color: C.primary } }}
              />
              <Typography sx={{ fontSize: "11px", color: C.text }}>
                Pharmacist appointment letter is required for this arrangement
              </Typography>
            </Stack>
          )}
        </Box>

        {/* DOCUMENT UPLOADS */}
        <Box sx={{ mt: 3 }}>
          <Typography sx={{ mb: 1.2, fontSize: "13px", fontWeight: 750, color: C.text }}>
            Business Documents
          </Typography>

          <Divider sx={{ mb: 1.5, borderColor: C.border }} />

          <Grid container spacing={1.5}>
            {requiredDocuments.map((document) => (
              <Grid key={document.field} size={{ xs: 12, sm: 6, md: 4 }}>
                <UploadCard
                  document={document}
                  file={localFiles[document.field] || data[document.field]}
                  error={errors[document.field]}
                  onFileChange={handleFileChange}
                  onRemove={handleRemoveFile}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* COLD CHAIN */}
        <Box
          sx={{
            mt: 2,
            px: 1.2,
            py: 1,
            border: `1px solid ${C.border}`,
            borderRadius: "11px",
            bgcolor: "#F8FAFC",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <Checkbox
              size="small"
              checked={Boolean(data.coldChainMedicines)}
              onChange={(e) => setField("coldChainMedicines", e.target.checked)}
              sx={{
                p: 0.4,
                color: "#9AA8B8",
                "&.Mui-checked": { color: C.primary },
              }}
            />

            <Typography sx={{ fontSize: "11.5px", fontWeight: 700, color: C.text }}>
              Does the store handle cold-chain medicines?
            </Typography>
          </Stack>
        </Box>

        {Object.values(errors).some(Boolean) && (
          <Typography sx={{ mt: 1.5, fontSize: "11px", color: C.error }}>
            Please upload all required documents and correct the highlighted fields.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
