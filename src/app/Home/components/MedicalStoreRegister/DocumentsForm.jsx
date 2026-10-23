
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

function UploadCard({
  document,
  file,
  uploadedDocument,
  uploading,
  onFileChange,
  error,
}) {
  const inputId = React.useId();
  const fileName =
    typeof file === "string"
      ? file.split(/[\\/]/).pop()
      : file?.name ||
        (typeof uploadedDocument === "string"
          ? uploadedDocument.split(/[\\/]/).pop()
          : uploadedDocument
            ? "Uploaded"
            : "");

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
        {fileName ? "Change File" : "Choose File"}

        <input
          id={inputId}
          hidden
          type="file"
          disabled={uploading}
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) onFileChange(document.field, selectedFile);
            event.target.value = "";
          }}
        />
      </Button>

      {fileName && (
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <Typography
            title={fileName}
            sx={{
              width: "100%",
              fontSize: "10px",
              color: C.text,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fileName}
            {typeof File !== "undefined" && file instanceof File
              ? ` · ${formatFileSize(file.size)}`
              : ""}
          </Typography>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
          >
            <Typography sx={{ fontSize: "9px", color: uploading ? C.muted : C.primary }}>
              {uploading ? "Uploading..." : "Uploaded successfully"}
            </Typography>
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
  onUploadDocument,
  uploadedDocuments = {},
  loading = false,
}) {
  const [errors, setErrors] = React.useState({});
  const [localFiles, setLocalFiles] = React.useState({});
  const [uploadingFiles, setUploadingFiles] = React.useState({});

  const setField = (field, value) => {
    onChange?.({ [field]: value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = async (field, file) => {
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

    if (typeof onUploadDocument !== "function") {
      setErrors((prev) => ({
        ...prev,
        [field]: "Document upload is not available. Please try again.",
      }));
      return;
    }

    setUploadingFiles((previous) => ({ ...previous, [field]: true }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    try {
      await onUploadDocument(field, file);
      setLocalFiles((previous) => ({ ...previous, [field]: file }));
    } catch (error) {
      setErrors((previous) => ({
        ...previous,
        [field]: error.message || "Unable to upload this document.",
      }));
    } finally {
      setUploadingFiles((previous) => ({ ...previous, [field]: false }));
    }
  };

  const requiredDocuments = PHARMACY_DOCUMENTS.map((document) => ({
    ...document,
    required: isPharmacyDocumentRequired(document.field, data),
  }));

  const validate = () => {
    const nextErrors = {};

    requiredDocuments.forEach(({ field, required }) => {
      if (
        required &&
        !(localFiles[field] || data[field] || uploadedDocuments[field])
      ) {
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

  const handleNext = async () => {
    if (loading || !validate()) return;
    await onNext?.();
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
                  uploadedDocument={uploadedDocuments[document.field]}
                  uploading={Boolean(uploadingFiles[document.field])}
                  error={errors[document.field]}
                  onFileChange={handleFileChange}
                />
              </Grid>
            ))}
          </Grid>
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
