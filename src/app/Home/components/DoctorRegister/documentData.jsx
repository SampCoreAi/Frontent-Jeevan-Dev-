"use client";

import * as React from "react";

import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import Webcam from "react-webcam";

import GppGoodIcon from "@mui/icons-material/GppGood";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import OnboardingHeader from "./OnboardingHeader";

import doctorRegistrationApi from "../../components/services/doctorRegistrationApi";

const COLORS = {
  primary: "#1B6E4F",
  primaryLight: "#E8F5EE",
  border: "#E6EBE8",
  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",
};

const documents = [
  {
    id: "registration",

    title: "Medical Registration Certificate",

    description:
      "Upload your valid medical registration certificate.",

    icon: (
      <DescriptionOutlinedIcon fontSize="large" />
    ),

    fieldName:
      "medicalRegistrationCertificate",

    required: true,
  },

  {
    id: "degree",

    title: "Medical Degree Certificate",

    description:
      "Upload your MBBS / MD / MS degree certificate.",

    icon: (
      <SchoolOutlinedIcon fontSize="large" />
    ),

    fieldName:
      "medicalDegreeCertificate",

    required: true,
  },

  {
    id: "government",

    title: "Government ID Proof",

    description:
      "Upload Aadhaar / PAN / Passport / Driving License.",

    icon: (
      <BadgeOutlinedIcon fontSize="large" />
    ),

    fieldName:
      "governmentIdProof",

    required: true,
  },

  {
    id: "selfie",

    title: "Selfie",

    description:
      "Take a live selfie using your device camera.",

    icon: (
      <PhotoCameraOutlinedIcon fontSize="large" />
    ),

    fieldName: "selfie",

    required: true,

    cameraOnly: true,
  },
];

export default function DocumentsForm({
  data,
  registrationId,
  onChange,
  onNext,
  onBack,
}) {
  const webcamRef = React.useRef(null);

  const [openCamera, setOpenCamera] =
    React.useState(false);
const [snackbar, setSnackbar] = React.useState({
  open: false,
  message: "",
  severity: "success",
});

const showSnackbar = (message, severity = "success") => {
  setSnackbar({
    open: true,
    message,
    severity,
  });
};

const handleCloseSnackbar = (_, reason) => {
  if (reason === "clickaway") return;

  setSnackbar((prev) => ({
    ...prev,
    open: false,
  }));
};
  const [uploading, setUploading] =
    React.useState({});

  // ==========================================
  // CHECK ALL DOCUMENTS
  // ==========================================
  const allDocumentsUploaded =
    Boolean(
      data?.medicalRegistrationCertificate
    ) &&
    Boolean(
      data?.medicalDegreeCertificate
    ) &&
    Boolean(data?.governmentIdProof) &&
    Boolean(data?.selfie);

  // ==========================================
  // UPLOAD DOCUMENT
  // ==========================================
  const handleUpload = async (
    id,
    file
  ) => {
    if (!file) return;

    const currentRegistrationId =
      registrationId ||
      localStorage.getItem(
        "doctorRegistrationId"
      );
if (!currentRegistrationId) {
  showSnackbar(
    "Registration ID not found. Please try again.",
    "error"
  );
  return;
}
    const document = documents.find(
      (item) => item.id === id
    );

    if (!document) {
      return;
    }

    const fieldName =
      document.fieldName;

    try {
      setUploading((prev) => ({
        ...prev,
        [id]: true,
      }));

    

      const response =
        await doctorRegistrationApi.uploadDocument(
          currentRegistrationId,
          file,
          fieldName
        );

      /*
       * Backend response se path
       * nikalne ki koshish.
       */
      const uploadedPath =
        response?.data?.data?.[
          fieldName
        ] ||
        response?.data?.data?.filePath ||
        response?.data?.data?.path ||
        response?.data?.data?.url ||
        response?.data?.filePath ||
        response?.data?.path ||
        response?.data?.url;

      if (uploadedPath) {
        /*
         * Parent doctorData update
         */
        onChange({
          [fieldName]:
            uploadedPath,
        });
      } else {
        /*
         * Agar API sirf success return
         * kar rahi hai aur path nahi de rahi
         *
         * to parent ko filename de rahe hain.
         *
         * Better option:
         * Upload ke baad DB GET API call
         * karna.
         */
        onChange({
          [fieldName]:
            file.name,
        });
      }

    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

    showSnackbar(
  error?.response?.data?.message ||
    "Failed to upload the document. Please try again.",
  "error"
);
    } finally {
      setUploading((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 3,
          md: 4,
        },

        border: "1px solid",

        borderColor:
          COLORS.border,

        borderRadius: 3,
      }}
    >
      {/* HEADER */}
      <OnboardingHeader />

      {/* =====================================
          DOCUMENT CARDS
      ====================================== */}
      <Grid
        container
        spacing={3}
      >
        {documents.map((doc) => {
          /*
           * IMPORTANT
           *
           * DB se aane wali value
           * doctorData se le rahe hain.
           */
          const uploadedFile =
            data?.[doc.fieldName];

          const isUploaded =
            Boolean(uploadedFile);

          const isUploading =
            Boolean(
              uploading[doc.id]
            );

          /*
           * Example:
           *
           * doctor-registration/
           * 059e33d8-xxxx.jpeg
           *
           * UI mein sirf:
           *
           * 059e33d8-xxxx.jpeg
           */
          const fileName =
            typeof uploadedFile ===
            "string"
              ? uploadedFile
                  .split("/")
                  .pop()
              : uploadedFile?.name ||
                "Document uploaded";

          return (
            <Grid
              key={doc.id}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,

                  border: "1px solid",

                  borderColor:
                    isUploaded
                      ? COLORS.primary
                      : COLORS.border,

                  borderRadius: 3,

                  position:
                    "relative",

                  height: "100%",

                  bgcolor:
                    isUploaded
                      ? "#FBFEFC"
                      : "#FFFFFF",
                }}
              >
                {/* STATUS CHIP */}
                <Chip
                  label={
                    isUploaded
                      ? "Uploaded"
                      : "Required"
                  }
                  size="small"
                  sx={{
                    position:
                      "absolute",

                    right: 16,

                    top: 16,

                    bgcolor:
                      COLORS.primaryLight,

                    color:
                      COLORS.primary,

                    fontWeight: 600,
                  }}
                />

                {/* ICON */}
                <Box
                  sx={{
                    width: 72,

                    height: 72,

                    borderRadius:
                      "50%",

                    bgcolor:
                      COLORS.primaryLight,

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    color:
                      COLORS.primary,

                    mx: "auto",
                  }}
                >
                  {doc.icon}
                </Box>

                {/* TITLE */}
                <Typography
                  align="center"
                  sx={{
                    mt: 2,
                    fontWeight: 700,
                  }}
                >
                  {doc.title}
                </Typography>

                {/* DESCRIPTION */}
                <Typography
                  align="center"
                  variant="body2"
                  sx={{
                    color:
                      COLORS.textSecondary,

                    mt: 1,

                    minHeight: 42,
                  }}
                >
                  {doc.description}
                </Typography>

                {/* =================================
                    ALREADY UPLOADED
                ================================== */}
                {isUploaded ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      mt: 3,

                      p: 2,

                      borderColor:
                        COLORS.primary,

                      bgcolor:
                        COLORS.primaryLight,
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          color:
                            COLORS.primary,
                        }}
                      />

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          fontSize={13}
                          fontWeight={700}
                          color={
                            COLORS.primary
                          }
                        >
                          Uploaded Successfully
                        </Typography>

                      </Box>
                    </Box>
                  </Paper>
                ) : doc.cameraOnly ? (
                  /* =================================
                     SELFIE BUTTON
                  ================================== */
                  <Button
                    fullWidth
                    startIcon={
                      <PhotoCameraOutlinedIcon />
                    }
                    variant="outlined"
                    disabled={
                      isUploading
                    }
                    onClick={() =>
                      setOpenCamera(
                        true
                      )
                    }
                    sx={{
                      mt: 3,

                      py: 1.2,

                      borderStyle:
                        "dashed",

                      borderColor:
                        COLORS.primary,

                      color:
                        COLORS.primary,

                      textTransform:
                        "none",
                    }}
                  >
                    {isUploading
                      ? "Uploading..."
                      : "Take Selfie"}
                  </Button>
                ) : (
                  /* =================================
                     UPLOAD BUTTON
                  ================================== */
                  <Button
                    component="label"
                    fullWidth
                    disabled={
                      isUploading
                    }
                    startIcon={
                      <CloudUploadOutlinedIcon />
                    }
                    variant="outlined"
                    sx={{
                      mt: 3,

                      py: 1.2,

                      borderStyle:
                        "dashed",

                      borderColor:
                        COLORS.primary,

                      color:
                        COLORS.primary,

                      textTransform:
                        "none",
                    }}
                  >
                    {isUploading
                      ? "Uploading..."
                      : "Upload File"}

                    <input
                      hidden
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(
                        event
                      ) => {
                        const file =
                          event.target
                            .files?.[0];

                        if (file) {
                          handleUpload(
                            doc.id,
                            file
                          );
                        }

                        /*
                         * Same file dobara
                         * select kar sakte ho.
                         */
                        event.target.value =
                          "";
                      }}
                    />
                  </Button>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* =====================================
          SECURITY NOTICE
      ====================================== */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        sx={{
          p: 2,

          borderRadius: 2,

          bgcolor:
            COLORS.primaryLight,

          mt: 3,
        }}
      >
        <Box
          sx={{
            width: 26,

            height: 26,

            flexShrink: 0,

            borderRadius:
              "50%",

            bgcolor:
              COLORS.primary,

            color: "#fff",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",
          }}
        >
          <GppGoodIcon
            sx={{
              fontSize: 15,
            }}
          />
        </Box>

        <Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,

              color:
                COLORS.textPrimary,
            }}
          >
            Supported formats:
            PDF, JPG, PNG •
            Maximum file size:
            5MB per file
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color:
                COLORS.textSecondary,
            }}
          >
            Please ensure all
            documents are clear,
            valid and up-to-date.
          </Typography>
        </Box>
      </Stack>

      {/* =====================================
          ACTION BUTTONS
      ====================================== */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        sx={{ mt: 3 }}
      >
        <Button
          variant="outlined"
          onClick={onBack}
          sx={{
            textTransform:
              "none",
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          disabled={
            !allDocumentsUploaded
          }
          onClick={onNext}
          sx={{
            textTransform:
              "none",
          }}
        >
          Next
        </Button>
      </Stack>

      {/* =====================================
          CAMERA MODAL
      ====================================== */}
      {openCamera && (
        <Box
          sx={{
            position: "fixed",

            inset: 0,

            bgcolor:
              "rgba(0,0,0,0.8)",

            zIndex: 9999,

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            p: 2,
          }}
        >
          <Paper
            sx={{
              p: 2,

              borderRadius: 3,

              maxWidth: 500,

              width: "100%",
            }}
          >
            {/* CAMERA */}
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode:
                  "user",
              }}
              style={{
                width: "100%",

                borderRadius: 12,
              }}
            />

            {/* CAMERA BUTTONS */}
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 2,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  setOpenCamera(
                    false
                  )
                }
              >
                Cancel
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={async () => {
                  const imageSrc =
                    webcamRef.current?.getScreenshot();
if (!imageSrc) {
  showSnackbar(
    "Unable to capture the photo. Please try again.",
    "error"
  );
  return;
}
                  try {
                    const blob =
                      await fetch(
                        imageSrc
                      ).then(
                        (res) =>
                          res.blob()
                      );

                    const file =
                      new File(
                        [blob],
                        "selfie.jpg",
                        {
                          type: "image/jpeg",
                        }
                      );

                    await handleUpload(
                      "selfie",
                      file
                    );

                    setOpenCamera(
                      false
                    );
                } catch (error) {
  console.error(
    "SELFIE ERROR:",
    error
  );

  alert(
    "Selfie upload failed."
  );
}
                }}
              >
                Capture & Upload
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}
      <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{
    vertical: "top",
    horizontal: "center",
  }}
>
  <Alert
    onClose={handleCloseSnackbar}
    severity={snackbar.severity}
    variant="filled"
    sx={{
      width: "100%",
      minWidth: {
        xs: "280px",
        sm: "380px",
      },
      borderRadius: 2,
      fontWeight: 600,
    }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
    </Paper>
  );
}