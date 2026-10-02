"use client";

import React, { useRef, useState } from "react";

import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const C = {
  primary: "#07876A",
  hover: "#066F58",
  text: "#172033",
  muted: "#74807B",
  border: "#DDE9E5",
  error: "#E5484D",
};

const MAX_SIZE =
  5 * 1024 * 1024;

function UploadBox({
  title,
  description,
  file,
  onChange,
  optional = false,
  error,
}) {
  const inputRef = useRef(null);

  const selectFile = (e) => {
    const selected =
      e.target.files?.[0];

    if (!selected) return;

    onChange(selected);
  };

  return (
    <Box>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ mb: 0.7 }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 650,
            color: C.text,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "10px",
            color: optional
              ? C.muted
              : C.error,
          }}
        >
          {optional
            ? "(Optional)"
            : "*"}
        </Typography>
      </Stack>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={selectFile}
      />

      <Paper
        elevation={0}
        onClick={() =>
          inputRef.current?.click()
        }
        sx={{
          minHeight: 115,

          p: 2,

          cursor: "pointer",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",

          textAlign: "center",

          border: error
            ? `1px dashed ${C.error}`
            : file
              ? `1px solid ${C.primary}`
              : `1px dashed ${C.border}`,

          borderRadius: "9px",

          bgcolor: file
            ? "#F4FAF7"
            : "#FAFCFB",
        }}
      >
        {file ? (
          <>
            <CheckCircleOutlineRoundedIcon
              sx={{
                fontSize: 25,
                color: C.primary,
              }}
            />

            <Typography
              sx={{
                mt: 0.5,
                maxWidth: "100%",

                fontSize: "10.5px",
                fontWeight: 650,

                color: C.text,

                overflow: "hidden",
                textOverflow:
                  "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {file.name}
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: "9px",
                color: C.primary,
              }}
            >
              Click to replace
            </Typography>
          </>
        ) : (
          <>
            <CloudUploadOutlinedIcon
              sx={{
                fontSize: 25,
                color: C.primary,
              }}
            />

            <Typography
              sx={{
                mt: 0.5,
                fontSize: "10.5px",
                fontWeight: 650,
                color: C.text,
              }}
            >
              Click to upload
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: "9px",
                color: C.muted,
              }}
            >
              {description}
            </Typography>
          </>
        )}
      </Paper>

      {error && (
        <Typography
          sx={{
            mt: 0.5,
            fontSize: "9.5px",
            color: C.error,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default function LabDocumentsForm({
  data,
  onChange,
  onBack,
  onNext,
}) {
  const [errors, setErrors] =
    useState({});

  const setFile = (key, file) => {
    if (
      file &&
      file.size > MAX_SIZE
    ) {
      setErrors((prev) => ({
        ...prev,
        [key]:
          "File size must be less than 5 MB.",
      }));

      return;
    }

    onChange({
      [key]: file,
    });

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const validate = () => {
    const e = {};

    if (
      !data.labRegistrationDocument
    ) {
      e.labRegistrationDocument =
        "Lab registration document is required.";
    }

    if (!data.governmentIdProof) {
      e.governmentIdProof =
        "Government ID proof is required.";
    }

    if (!data.businessProof) {
      e.businessProof =
        "Business / establishment proof is required.";
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
        <CloudUploadOutlinedIcon
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
            Lab Documents
          </Typography>

          <Typography
            sx={{
              fontSize: "10.5px",
              color: C.muted,
            }}
          >
            Upload clear and valid
            laboratory documents.
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <UploadBox
            title="Lab Registration / License Certificate"
            description="PDF, JPG or PNG • Max 5 MB"
            file={
              data.labRegistrationDocument
            }
            onChange={(file) =>
              setFile(
                "labRegistrationDocument",
                file
              )
            }
            error={
              errors.labRegistrationDocument
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <UploadBox
            title="Owner / Authorized Person Government ID"
            description="PDF, JPG or PNG • Max 5 MB"
            file={
              data.governmentIdProof
            }
            onChange={(file) =>
              setFile(
                "governmentIdProof",
                file
              )
            }
            error={
              errors.governmentIdProof
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <UploadBox
            title="Business / Establishment Proof"
            description="PDF, JPG or PNG • Max 5 MB"
            file={data.businessProof}
            onChange={(file) =>
              setFile(
                "businessProof",
                file
              )
            }
            error={
              errors.businessProof
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <UploadBox
            title="GST Certificate"
            optional
            description="Required only if applicable"
            file={
              data.gstCertificate
            }
            onChange={(file) =>
              setFile(
                "gstCertificate",
                file
              )
            }
          />
        </Grid>
      </Grid>

      <Typography
        sx={{
          mt: 1.5,
          fontSize: "9.5px",
          color: C.muted,
        }}
      >
        Make sure the uploaded documents
        are readable and match the
        information entered in your
        registration.
      </Typography>

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
            borderColor: C.border,
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
          Next: Verification
        </Button>
      </Stack>
    </Box>
  );
}