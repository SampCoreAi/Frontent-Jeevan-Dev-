"use client";

import * as React from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import Webcam from "react-webcam";

import GppGoodIcon from "@mui/icons-material/GppGood";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import OnboardingHeader from "./OnboardingHeader";

import doctorRegistrationApi from "../../components/services/doctorRegistrationApi";

/* =========================================================
   CONSTANTS
========================================================= */

const COLORS = {
  primary: "#1B6E4F",
  primaryHover: "#15593E",
  primaryLight: "#E8F5EE",

  border: "#E6EBE8",

  textPrimary: "#1F2A24",
  textSecondary: "#6B7A72",

  error: "#E0483C",
  errorLight: "#FFF5F4",

  white: "#FFFFFF",
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
];

const ALLOWED_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
];

/* =========================================================
   DOCUMENT CONFIG
========================================================= */

const documents = [
  {
    id: "registration",

    title: "Medical Registration",

    description:
      "Upload your valid registration certificate.",

    icon: (
      <DescriptionOutlinedIcon
        sx={{ fontSize: 26 }}
      />
    ),

    fieldName:
      "medicalRegistrationCertificate",

    required: true,
  },

  {
    id: "degree",

    title: "Medical Degree",

    description:
      "Upload your MBBS / MD / MS certificate.",

    icon: (
      <SchoolOutlinedIcon
        sx={{ fontSize: 26 }}
      />
    ),

    fieldName:
      "medicalDegreeCertificate",

    required: true,
  },

  {
    id: "government",

    title: "Government ID",

    description:
      "Upload Aadhaar / PAN / Passport / DL.",

    icon: (
      <BadgeOutlinedIcon
        sx={{ fontSize: 26 }}
      />
    ),

    fieldName:
      "governmentIdProof",

    required: true,
  },

  {
    id: "selfie",

    title: "Live Selfie",

    description:
      "Take a clear live photo using your camera.",

    icon: (
      <PhotoCameraOutlinedIcon
        sx={{ fontSize: 26 }}
      />
    ),

    fieldName: "selfie",

    required: true,

    cameraOnly: true,
  },
];

/* =========================================================
   COMPONENT
========================================================= */

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

  const [uploading, setUploading] =
    React.useState({});

  const [fileErrors, setFileErrors] =
    React.useState({});

  const [snackbar, setSnackbar] =
    React.useState({
      open: false,
      message: "",
      severity: "success",
    });

  /* =======================================================
     SNACKBAR
  ======================================================= */

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /* =======================================================
     DOCUMENT STATUS
  ======================================================= */

  const allDocumentsUploaded =
    Boolean(
      data?.medicalRegistrationCertificate
    ) &&
    Boolean(
      data?.medicalDegreeCertificate
    ) &&
    Boolean(data?.governmentIdProof) &&
    Boolean(data?.selfie);

  /* =======================================================
     FILE VALIDATION
  ======================================================= */

  const validateFile = (file) => {
    if (!file) {
      return "Please select a file.";
    }

    /* -------------------------------
       Empty file
    -------------------------------- */

    if (file.size <= 0) {
      return "The selected file is empty.";
    }

    /* -------------------------------
       5MB validation
    -------------------------------- */

    if (file.size > MAX_FILE_SIZE) {
      return "File size must not exceed 5MB.";
    }

    /* -------------------------------
       Extension
    -------------------------------- */

    const extension =
      file.name
        ?.split(".")
        .pop()
        ?.toLowerCase() || "";

    if (
      !ALLOWED_EXTENSIONS.includes(extension)
    ) {
      return "Only PDF, JPG, JPEG and PNG files are allowed.";
    }

    /* -------------------------------
       MIME type
    -------------------------------- */

    if (
      file.type &&
      !ALLOWED_FILE_TYPES.includes(file.type)
    ) {
      return "Invalid file format. Upload PDF, JPG, JPEG or PNG.";
    }

    return "";
  };

  /* =======================================================
     SET / CLEAR DOCUMENT ERROR
  ======================================================= */

  const setDocumentError = (
    id,
    message
  ) => {
    setFileErrors((prev) => ({
      ...prev,
      [id]: message,
    }));
  };

  const clearDocumentError = (id) => {
    setFileErrors((prev) => {
      const next = {
        ...prev,
      };

      delete next[id];

      return next;
    });
  };

  /* =======================================================
     UPLOAD DOCUMENT
  ======================================================= */

  const handleUpload = async (
    id,
    file
  ) => {
    if (!file) {
      return false;
    }

    /* -------------------------------
       Frontend validation FIRST
    -------------------------------- */

    const validationError =
      validateFile(file);

    if (validationError) {
      setDocumentError(
        id,
        validationError
      );

      showSnackbar(
        validationError,
        "error"
      );

      return false;
    }

    clearDocumentError(id);

    /* -------------------------------
       Registration ID
    -------------------------------- */

    const currentRegistrationId =
      registrationId ||
      localStorage.getItem(
        "doctorRegistrationId"
      );

    if (!currentRegistrationId) {
      const message =
        "Registration ID not found. Please try again.";

      setDocumentError(
        id,
        message
      );

      showSnackbar(
        message,
        "error"
      );

      return false;
    }

    /* -------------------------------
       Document config
    -------------------------------- */

    const document = documents.find(
      (item) => item.id === id
    );

    if (!document) {
      showSnackbar(
        "Invalid document type.",
        "error"
      );

      return false;
    }

    const fieldName =
      document.fieldName;

    try {
      setUploading((prev) => ({
        ...prev,
        [id]: true,
      }));

      /* -----------------------------
         API CALL
      ----------------------------- */

      const response =
        await doctorRegistrationApi.uploadDocument(
          currentRegistrationId,
          file,
          fieldName
        );

      /* -----------------------------
         Extract uploaded path
      ----------------------------- */

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

      /* -----------------------------
         Parent state
      ----------------------------- */

      if (uploadedPath) {
        onChange({
          [fieldName]:
            uploadedPath,
        });
      } else {
        /*
          Ideally backend should return
          the uploaded file path/key.

          Keeping filename fallback
          because your existing code
          already uses this behaviour.
        */

        onChange({
          [fieldName]:
            file.name,
        });
      }

      clearDocumentError(id);

      showSnackbar(
        `${document.title} uploaded successfully.`,
        "success"
      );

      return true;
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        "Failed to upload the document. Please try again.";

      setDocumentError(
        id,
        message
      );

      showSnackbar(
        message,
        "error"
      );

      return false;
    } finally {
      setUploading((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  /* =======================================================
     FILE INPUT
  ======================================================= */

  const handleFileSelect = (
    doc,
    event
  ) => {
    const file =
      event.target.files?.[0];

    /*
      Reset immediately so same file
      can be selected again.
    */

    event.target.value = "";

    if (!file) {
      return;
    }

    const error =
      validateFile(file);

    if (error) {
      setDocumentError(
        doc.id,
        error
      );

      showSnackbar(
        error,
        "error"
      );

      return;
    }

    clearDocumentError(doc.id);

    handleUpload(
      doc.id,
      file
    );
  };

  /* =======================================================
     NEXT VALIDATION
  ======================================================= */

  const handleNext = () => {
    const missingDocuments =
      documents.filter(
        (doc) =>
          doc.required &&
          !data?.[doc.fieldName]
      );

    if (missingDocuments.length > 0) {
      const newErrors = {};

      missingDocuments.forEach(
        (doc) => {
          newErrors[doc.id] =
            `${doc.title} is required.`;
        }
      );

      setFileErrors((prev) => ({
        ...prev,
        ...newErrors,
      }));

      showSnackbar(
        "Please upload all required documents.",
        "error"
      );

      return;
    }

    onNext();
  };

  /* =======================================================
     CAMERA CAPTURE
  ======================================================= */

  const handleCaptureSelfie =
    async () => {
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
        const blob = await fetch(
          imageSrc
        ).then((response) =>
          response.blob()
        );

        const file = new File(
          [blob],
          `selfie-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        /*
          Selfie also passes through
          the SAME 5MB validation.
        */

        const error =
          validateFile(file);

        if (error) {
          setDocumentError(
            "selfie",
            error
          );

          showSnackbar(
            error,
            "error"
          );

          return;
        }

        const uploaded =
          await handleUpload(
            "selfie",
            file
          );

        if (uploaded) {
          setOpenCamera(false);
        }
      } catch (error) {
        console.error(
          "SELFIE ERROR:",
          error
        );

        showSnackbar(
          "Selfie upload failed. Please try again.",
          "error"
        );
      }
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          minHeight: "100%",

          p: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },

          border:
            `1px solid ${COLORS.border}`,

          borderRadius: {
            xs: "14px",
            sm: "18px",
          },

          bgcolor: COLORS.white,
        }}
      >
        {/* ===============================================
            HEADER
        =============================================== */}

        <OnboardingHeader />

        {/* ===============================================
            SMALL INFO ROW
        =============================================== */}

        <Box
          sx={{
            mt: 2,
            mb: 2.2,

            display: "flex",

            alignItems: {
              xs: "flex-start",
              sm: "center",
            },

            justifyContent:
              "space-between",

            flexDirection: {
              xs: "column",
              sm: "row",
            },

            gap: 1,

            px: 1.5,
            py: 1.1,

            bgcolor: "#F8FAF9",

            border:
              `1px solid ${COLORS.border}`,

            borderRadius: "10px",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color:
                  COLORS.textPrimary,
              }}
            >
              Verification documents
            </Typography>

            <Typography
              sx={{
                mt: 0.15,
                fontSize: "10.5px",
                color:
                  COLORS.textSecondary,
              }}
            >
              Upload clear and valid
              documents for verification.
            </Typography>
          </Box>

          <Typography
            sx={{
              flexShrink: 0,

              fontSize: "10.5px",
              fontWeight: 600,

              color:
                COLORS.textSecondary,
            }}
          >
            PDF, JPG, PNG • Max 5MB
          </Typography>
        </Box>

        {/* ===============================================
            DOCUMENT CARDS
        =============================================== */}

        <Grid
          container
          spacing={{
            xs: 1.5,
            sm: 1.8,
          }}
        >
          {documents.map((doc) => {
            const uploadedFile =
              data?.[doc.fieldName];

            const isUploaded =
              Boolean(uploadedFile);

            const isUploading =
              Boolean(
                uploading[doc.id]
              );

            const error =
              fileErrors[doc.id];

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
                    position:
                      "relative",

                    height: "100%",

                    minHeight: "250px",

                    p: 2,

                    display: "flex",

                    flexDirection:
                      "column",

                    border: "1px solid",

                    borderColor:
                      error
                        ? COLORS.error
                        : isUploaded
                        ? COLORS.primary
                        : COLORS.border,

                    borderRadius:
                      "12px",

                    bgcolor:
                      error
                        ? COLORS.errorLight
                        : isUploaded
                        ? "#FBFEFC"
                        : COLORS.white,

                    transition:
                      "border-color .2s ease, box-shadow .2s ease",

                    "&:hover": {
                      boxShadow:
                        "0 5px 18px rgba(31,42,36,0.06)",
                    },
                  }}
                >
                  {/* STATUS */}

                  <Chip
                    size="small"
                    label={
                      error
                        ? "Error"
                        : isUploaded
                        ? "Uploaded"
                        : "Required"
                    }
                    sx={{
                      position:
                        "absolute",

                      top: 12,
                      right: 12,

                      height: 23,

                      fontSize:
                        "10px",

                      fontWeight: 700,

                      bgcolor:
                        error
                          ? "#FDECEA"
                          : isUploaded
                          ? COLORS.primaryLight
                          : "#F3F5F4",

                      color:
                        error
                          ? COLORS.error
                          : isUploaded
                          ? COLORS.primary
                          : COLORS.textSecondary,
                    }}
                  />

                  {/* ICON */}

                  <Box
                    sx={{
                      width: 50,
                      height: 50,

                      borderRadius:
                        "12px",

                      bgcolor:
                        error
                          ? "#FDECEA"
                          : COLORS.primaryLight,

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      color:
                        error
                          ? COLORS.error
                          : COLORS.primary,

                      mb: 1.6,
                    }}
                  >
                    {doc.icon}
                  </Box>

                  {/* TITLE */}

                  <Typography
                    sx={{
                      pr: 7,

                      fontSize:
                        "13px",

                      lineHeight:
                        1.35,

                      fontWeight:
                        700,

                      color:
                        COLORS.textPrimary,
                    }}
                  >
                    {doc.title}
                  </Typography>

                  {/* DESCRIPTION */}

                  <Typography
                    sx={{
                      mt: 0.6,

                      fontSize:
                        "10.5px",

                      lineHeight:
                        1.45,

                      color:
                        COLORS.textSecondary,

                      minHeight:
                        "31px",
                    }}
                  >
                    {doc.description}
                  </Typography>

                  {/* =====================================
                      ERROR
                  ===================================== */}

                  {error && (
                    <Stack
                      direction="row"
                      spacing={0.7}
                      alignItems="flex-start"
                      sx={{
                        mt: 1.2,

                        px: 1,
                        py: 0.8,

                        borderRadius:
                          "7px",

                        bgcolor:
                          "#FDECEA",
                      }}
                    >
                      <ErrorOutlineRoundedIcon
                        sx={{
                          mt: "1px",

                          fontSize:
                            15,

                          flexShrink:
                            0,

                          color:
                            COLORS.error,
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize:
                            "10px",

                          lineHeight:
                            1.35,

                          fontWeight:
                            600,

                          color:
                            COLORS.error,
                        }}
                      >
                        {error}
                      </Typography>
                    </Stack>
                  )}

                  <Box
                    sx={{
                      flexGrow: 1,
                    }}
                  />

                  {/* =====================================
                      UPLOADED
                  ===================================== */}

                  {isUploaded ? (
                    <Box
                      sx={{
                        mt: 1.5,

                        px: 1.2,
                        py: 1,

                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap: 0.8,

                        border:
                          `1px solid ${COLORS.primary}`,

                        borderRadius:
                          "8px",

                        bgcolor:
                          COLORS.primaryLight,
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{
                          fontSize:
                            17,

                          color:
                            COLORS.primary,

                          flexShrink:
                            0,
                        }}
                      />

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize:
                              "10.5px",

                            fontWeight:
                              700,

                            color:
                              COLORS.primary,
                          }}
                        >
                          Uploaded successfully
                        </Typography>

                        <Typography
                          noWrap
                          title={
                            fileName
                          }
                          sx={{
                            maxWidth:
                              "150px",

                            mt: 0.1,

                            fontSize:
                              "9.5px",

                            color:
                              COLORS.textSecondary,
                          }}
                        >
                          {fileName}
                        </Typography>
                      </Box>
                    </Box>
                  ) : doc.cameraOnly ? (
                    /* ===================================
                       SELFIE
                    =================================== */

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={
                        isUploading ? (
                          <CircularProgress
                            size={
                              15
                            }
                          />
                        ) : (
                          <PhotoCameraOutlinedIcon
                            sx={{
                              fontSize:
                                "17px !important",
                            }}
                          />
                        )
                      }
                      disabled={
                        isUploading
                      }
                      onClick={() => {
                        clearDocumentError(
                          doc.id
                        );

                        setOpenCamera(
                          true
                        );
                      }}
                      sx={{
                        mt: 1.5,

                        height: 39,

                        borderRadius:
                          "8px",

                        borderStyle:
                          "dashed",

                        borderColor:
                          error
                            ? COLORS.error
                            : COLORS.primary,

                        color:
                          error
                            ? COLORS.error
                            : COLORS.primary,

                        textTransform:
                          "none",

                        fontSize:
                          "11px",

                        fontWeight:
                          700,

                        "&:hover": {
                          borderStyle:
                            "dashed",

                          bgcolor:
                            COLORS.primaryLight,
                        },
                      }}
                    >
                      {isUploading
                        ? "Uploading..."
                        : "Take Selfie"}
                    </Button>
                  ) : (
                    /* ===================================
                       FILE UPLOAD
                    =================================== */

                    <Button
                      component="label"
                      fullWidth
                      variant="outlined"
                      disabled={
                        isUploading
                      }
                      startIcon={
                        isUploading ? (
                          <CircularProgress
                            size={
                              15
                            }
                          />
                        ) : (
                          <CloudUploadOutlinedIcon
                            sx={{
                              fontSize:
                                "17px !important",
                            }}
                          />
                        )
                      }
                      sx={{
                        mt: 1.5,

                        height: 39,

                        borderRadius:
                          "8px",

                        borderStyle:
                          "dashed",

                        borderColor:
                          error
                            ? COLORS.error
                            : COLORS.primary,

                        color:
                          error
                            ? COLORS.error
                            : COLORS.primary,

                        textTransform:
                          "none",

                        fontSize:
                          "11px",

                        fontWeight:
                          700,

                        "&:hover": {
                          borderStyle:
                            "dashed",

                          bgcolor:
                            COLORS.primaryLight,
                        },
                      }}
                    >
                      {isUploading
                        ? "Uploading..."
                        : "Choose File"}

                      <input
                        hidden
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                        onChange={(
                          event
                        ) =>
                          handleFileSelect(
                            doc,
                            event
                          )
                        }
                      />
                    </Button>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        

        {/* ===============================================
            ACTION BUTTONS
        =============================================== */}

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{
            mt: 2,

            pt: 2,

            borderTop:
              `1px solid ${COLORS.border}`,
          }}
        >
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={
              <ArrowBackRoundedIcon />
            }
            disabled={Object.values(
              uploading
            ).some(Boolean)}
            sx={{
              height: 41,

              px: 2.5,

              borderRadius:
                "9px",

              borderColor:
                COLORS.border,

              color:
                COLORS.textPrimary,

              textTransform:
                "none",

              fontSize:
                "12px",

              fontWeight:
                600,

              "&:hover": {
                borderColor:
                  COLORS.primary,

                bgcolor:
                  COLORS.primaryLight,
              },
            }}
          >
            Back
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={
              <ArrowForwardRoundedIcon />
            }

            /*
              Don't disable because docs
              are missing.

              Let user click Next so exact
              validation errors can appear.
            */
            disabled={Object.values(
              uploading
            ).some(Boolean)}
            sx={{
              minWidth:
                "125px",

              height: 41,

              px: 2.5,

              borderRadius:
                "9px",

              bgcolor:
                COLORS.primary,

              textTransform:
                "none",

              fontSize:
                "12px",

              fontWeight:
                700,

              boxShadow:
                "none",

              "&:hover": {
                bgcolor:
                  COLORS.primaryHover,

                boxShadow:
                  "0 4px 12px rgba(27,110,79,0.16)",
              },

              "&.Mui-disabled": {
                bgcolor:
                  "#A8BDB3",

                color:
                  COLORS.white,
              },
            }}
          >
            Next
          </Button>
        </Stack>
      </Paper>

      {/* =================================================
          CAMERA MODAL
      ================================================= */}

      {openCamera && (
        <Box
          sx={{
            position: "fixed",

            inset: 0,

            zIndex: 9999,

            bgcolor:
              "rgba(10,15,12,0.82)",

            backdropFilter:
              "blur(4px)",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            p: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              position:
                "relative",

              width: "100%",

              maxWidth:
                "460px",

              p: 2,

              borderRadius:
                "16px",

              bgcolor:
                COLORS.white,
            }}
          >
            {/* CLOSE */}

            <Button
              onClick={() =>
                setOpenCamera(false)
              }
              sx={{
                position:
                  "absolute",

                right: 8,
                top: 8,

                zIndex: 2,

                minWidth: 34,
                width: 34,
                height: 34,

                borderRadius:
                  "50%",

                color:
                  COLORS.textPrimary,

                bgcolor:
                  "rgba(255,255,255,.9)",
              }}
            >
              <CloseRoundedIcon
                sx={{
                  fontSize: 18,
                }}
              />
            </Button>

            {/* TITLE */}

            <Typography
              sx={{
                mb: 0.4,

                fontSize:
                  "15px",

                fontWeight:
                  700,

                color:
                  COLORS.textPrimary,
              }}
            >
              Take a live selfie
            </Typography>

            <Typography
              sx={{
                mb: 1.5,

                fontSize:
                  "11px",

                color:
                  COLORS.textSecondary,
              }}
            >
              Keep your face clearly visible and look directly at the camera.
            </Typography>

            {/* CAMERA */}

            <Box
              sx={{
                overflow:
                  "hidden",

                borderRadius:
                  "12px",

                bgcolor:
                  "#111",
              }}
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.9}
                videoConstraints={{
                  facingMode:
                    "user",
                }}
                style={{
                  display:
                    "block",

                  width:
                    "100%",
                }}
              />
            </Box>

            {/* CAMERA ACTIONS */}

            <Stack
              direction="row"
              spacing={1.2}
              sx={{
                mt: 1.5,
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
                disabled={
                  uploading.selfie
                }
                sx={{
                  height: 42,

                  borderRadius:
                    "9px",

                  borderColor:
                    COLORS.border,

                  color:
                    COLORS.textPrimary,

                  textTransform:
                    "none",

                  fontSize:
                    "12px",

                  fontWeight:
                    600,
                }}
              >
                Cancel
              </Button>

              <Button
                fullWidth
                variant="contained"
                onClick={
                  handleCaptureSelfie
                }
                disabled={
                  uploading.selfie
                }
                startIcon={
                  uploading.selfie ? (
                    <CircularProgress
                      size={15}
                      color="inherit"
                    />
                  ) : (
                    <PhotoCameraOutlinedIcon />
                  )
                }
                sx={{
                  height: 42,

                  borderRadius:
                    "9px",

                  bgcolor:
                    COLORS.primary,

                  boxShadow:
                    "none",

                  textTransform:
                    "none",

                  fontSize:
                    "12px",

                  fontWeight:
                    700,

                  "&:hover": {
                    bgcolor:
                      COLORS.primaryHover,
                  },
                }}
              >
                {uploading.selfie
                  ? "Uploading..."
                  : "Capture & Upload"}
              </Button>
            </Stack>
          </Paper>
        </Box>
      )}

      {/* =================================================
          SNACKBAR
      ================================================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={
          handleCloseSnackbar
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={
            handleCloseSnackbar
          }
          severity={
            snackbar.severity
          }
          variant="filled"
          sx={{
            width: "100%",

            minWidth: {
              xs: "280px",
              sm: "380px",
            },

            borderRadius:
              "9px",

            fontSize:
              "12px",

            fontWeight:
              600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}