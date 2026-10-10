"use client";

import * as React from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#172033",
  muted: "#74807B",
  border: "#DDE9E5",
  error: "#E5484D",
  white: "#FFFFFF",
};

/* =========================================================
   UPLOAD BOX
========================================================= */

function UploadBox({
  label,
  description,
  field,
  value,
  onChange,
  required = false,
  error,
}) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 5 MB
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    onChange({
      [field]: file,
    });
  };

  return (
    <Box>
      {/* LABEL */}

      <Typography
        sx={{
          mb: 0.6,
          fontSize: "12px",
          fontWeight: 600,
          color: C.text,
        }}
      >
        {label}

        {required ? (
          <Box
            component="span"
            sx={{
              color: C.error,
            }}
          >
            {" "}
            *
          </Box>
        ) : (
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
        )}
      </Typography>

      {/* UPLOAD AREA */}

      <Box
        component="label"
        sx={{
          minHeight: 125,
          px: 2,
          py: 2,
          border: `1px dashed ${
            error ? C.error : value ? C.primary : "#AABDB6"
          }`,
          borderRadius: "10px",
          bgcolor: value ? "#F8FCFA" : C.white,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "0.2s",

          "&:hover": {
            borderColor: C.primary,
            bgcolor: "#F8FCFA",
          },
        }}
      >
        <input
          hidden
          type="file"
          accept=".pdf,image/png,image/jpeg"
          onChange={handleFile}
        />

        {value ? (
          /* FILE SELECTED */

          <Stack
            alignItems="center"
            spacing={0.6}
            sx={{
              width: "100%",
            }}
          >
            <CheckCircleRoundedIcon
              sx={{
                fontSize: 28,
                color: C.primary,
              }}
            />

            <Typography
              sx={{
                fontSize: "11.5px",
                fontWeight: 700,
                color: C.text,
                maxWidth: "90%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {value?.name || "Document uploaded"}
            </Typography>

            <Typography
              sx={{
                fontSize: "10px",
                color: C.primary,
                fontWeight: 600,
              }}
            >
              Click to replace
            </Typography>
          </Stack>
        ) : (
          /* EMPTY */

          <Stack alignItems="center" spacing={0.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                border: `1px solid ${C.border}`,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloudUploadOutlinedIcon
                sx={{
                  fontSize: 20,
                  color: C.primary,
                }}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "11.5px",
                color: C.text,
                textAlign: "center",
              }}
            >
              <Box
                component="span"
                sx={{
                  color: C.primary,
                  fontWeight: 700,
                }}
              >
                Click to upload
              </Box>{" "}
              or drag and drop
            </Typography>

            <Typography
              sx={{
                fontSize: "10px",
                color: C.muted,
                textAlign: "center",
              }}
            >
              {description}
            </Typography>

            <Typography
              sx={{
                fontSize: "9.5px",
                color: C.muted,
              }}
            >
              PDF, JPG or PNG • Max 5MB
            </Typography>
          </Stack>
        )}
      </Box>

      {error && (
        <Typography
          sx={{
            mt: 0.5,
            ml: 0.5,
            fontSize: "10px",
            color: C.error,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}

/* =========================================================
   DOCUMENTS FORM
========================================================= */

export default function DocumentsForm({
  data,
  onChange,
  onBack,
  onNext,
  loading,
}) {
  const [errors, setErrors] = React.useState({});

  const handleChange = (value) => {
    onChange(value);

    const field = Object.keys(value)[0];

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validate = () => {
    const nextErrors = {};

    if (!data.drugLicenseDocument) {
      nextErrors.drugLicenseDocument =
        "Drug License document is required";
    }

    if (!data.pharmacistCertificate) {
      nextErrors.pharmacistCertificate =
        "Pharmacist Registration Certificate is required";
    }

    if (!data.governmentIdProof) {
      nextErrors.governmentIdProof =
        "Government ID / Business Proof is required";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    onNext();
  };

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
        {/* HEADER */}

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <DescriptionOutlinedIcon
            sx={{
              color: C.primary,
              fontSize: 22,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 750,
                color: C.text,
              }}
            >
              Documents
            </Typography>

            <Typography
              sx={{
                mt: 0.1,
                fontSize: "10.5px",
                color: C.muted,
              }}
            >
              Upload the required documents for verification.
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.6 }} />

        {/* DOCUMENTS */}

        <Grid container spacing={2}>
          {/* DRUG LICENSE */}

          <Grid size={{ xs: 12, md: 6 }}>
            <UploadBox
              label="Drug License"
              description="Upload a clear copy of your drug license"
              field="drugLicenseDocument"
              value={data.drugLicenseDocument}
              onChange={handleChange}
              required
              error={errors.drugLicenseDocument}
            />
          </Grid>

          {/* PHARMACIST CERTIFICATE */}

          <Grid size={{ xs: 12, md: 6 }}>
            <UploadBox
              label="Pharmacist Registration Certificate"
              description="Upload pharmacist registration certificate"
              field="pharmacistCertificate"
              value={data.pharmacistCertificate}
              onChange={handleChange}
              required
              error={errors.pharmacistCertificate}
            />
          </Grid>

          {/* GOVERNMENT / BUSINESS PROOF */}

          <Grid size={{ xs: 12, md: 6 }}>
            <UploadBox
              label="Government ID / Business Proof"
              description="Aadhaar, PAN or valid business proof"
              field="governmentIdProof"
              value={data.governmentIdProof}
              onChange={handleChange}
              required
              error={errors.governmentIdProof}
            />
          </Grid>

          {/* GST CERTIFICATE */}

          <Grid size={{ xs: 12, md: 6 }}>
            <UploadBox
              label="GST Certificate"
              description="Upload GST registration certificate if applicable"
              field="gstCertificate"
              value={data.gstCertificate}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ACTIONS */}

      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
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
            minWidth: 170,
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
          Review Details
        </Button>
      </Box>
    </Box>
  );
}