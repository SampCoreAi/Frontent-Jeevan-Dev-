"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import WorkingHoursModal from "./WorkingHoursModal";

// ============================================================
// COMMON STYLE
// ============================================================

const rowSx = {
  minHeight: "46px",

  display: "flex",
  alignItems: "center",

  gap: "10px",

  px: "12px",
  py: "7px",

  border: "1px solid",
  borderColor: "divider",

  borderRadius: "8px",

  bgcolor: "#f7f9f9",
};

const iconSx = {
  width: "28px",
  height: "28px",

  flexShrink: 0,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  borderRadius: "7px",

  bgcolor: "secondary.light",
  color: "primary.main",

  "& svg": {
    fontSize: "16px",
  },
};

const labelSx = {
  width: "150px",
  minWidth: "150px",

  fontSize: "12.5px",
  fontWeight: 650,

  color: "text.primary",
};

const valueSx = {
  flex: 1,
  minWidth: 0,

  fontSize: "12.5px",
  lineHeight: 1.4,

  fontWeight: 500,

  color: "text.secondary",

  wordBreak: "break-word",
};

const inputSx = {
  flex: 1,

  "& .MuiInputBase-root": {
    minHeight: "34px",

    fontSize: "12.5px",

    borderRadius: "7px",

    bgcolor: "background.paper",
  },

  "& .MuiInputBase-input": {
    py: "7px",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider",
  },

  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
    {
      borderColor: "primary.light",
    },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
    {
      borderColor: "primary.main",
      borderWidth: "1px",
    },
};

// ============================================================
// DETAIL ROW
// ============================================================

const DetailRow = ({
  icon,
  label,
  value,
  isEditing,
  editable = false,
  type = "text",
  placeholder,
  onChange,
}) => {
  return (
    <Box sx={rowSx}>
      <Box sx={iconSx}>
        {icon}
      </Box>

      <Typography sx={labelSx}>
        {label}
      </Typography>

      {isEditing && editable ? (
        <TextField
          fullWidth
          size="small"
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={onChange}
          sx={inputSx}
        />
      ) : (
        <Typography sx={valueSx}>
          {value !== null &&
          value !== undefined &&
          value !== ""
            ? value
            : "Not provided"}
        </Typography>
      )}
    </Box>
  );
};

// ============================================================
// MAIN
// ============================================================

const ProfileDetails = ({
  profileData,
  isEditing,
  onFieldChange,
  onWorkingHoursChange,
}) => {
  const [
    documentsModalOpen,
    setDocumentsModalOpen,
  ] = useState(false);

  const [
    workingHoursModalOpen,
    setWorkingHoursModalOpen,
  ] = useState(false);

  const languageValue =
    Array.isArray(
      profileData?.language
    )
      ? profileData.language.join(
          ", "
        )
      : profileData?.language || "";

  // ============================================================
  // TIME
  // ============================================================

  const formatDisplayTime = (
    time
  ) => {
    if (!time) return "";

    const [hour, minute] =
      time.split(":").map(Number);

    const ampm =
      hour >= 12 ? "PM" : "AM";

    const displayHour =
      hour % 12 || 12;

    return `${displayHour}:${String(
      minute
    ).padStart(2, "0")} ${ampm}`;
  };

  const days = [
    ["monday", "Mon"],
    ["tuesday", "Tue"],
    ["wednesday", "Wed"],
    ["thursday", "Thu"],
    ["friday", "Fri"],
    ["saturday", "Sat"],
    ["sunday", "Sun"],
  ];

  // ============================================================
  // DOCUMENTS
  // ============================================================

  const documents = [
    {
      name:
        "Medical Registration Certificate",

      path:
        profileData?.medical_registration_certificate,
    },

    {
      name:
        "Medical Degree Certificate",

      path:
        profileData?.medical_degree_certificate,
    },

    {
      name:
        "Government ID Proof",

      path:
        profileData?.government_id_proof,
    },

    {
      name: "Selfie",

      path: profileData?.selfie,
    },
  ];

  const availableDocuments =
    documents.filter(
      (document) =>
        document.path
    );

  return (
    <>
      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            lg: "minmax(0, 1.08fr) minmax(330px, .92fr)",
          },

          gap: "12px",

          mt: "10px",
        }}
      >
        {/* ====================================================
            BASIC INFORMATION
        ==================================================== */}

        <Box
          sx={{
            p: "12px",

            border: "1px solid",
            borderColor: "divider",

            borderRadius: "10px",

            bgcolor:
              "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              gap: "8px",

              mb: "10px",
            }}
          >
            <Box sx={iconSx}>
              <PersonOutlineIcon />
            </Box>

            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,

                color:
                  "text.primary",
              }}
            >
              Basic Information
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              gap: "6px",
            }}
          >
            {/* LANGUAGE */}

            <Box sx={rowSx}>
              <Box sx={iconSx}>
                <LanguageOutlinedIcon />
              </Box>

              <Typography
                sx={labelSx}
              >
                Language
              </Typography>

              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  value={
                    languageValue
                  }
                  placeholder="Hindi, English"
                  onChange={(
                    event
                  ) =>
                    onFieldChange?.(
                      "language",

                      event.target.value
                        .split(",")
                        .map((item) =>
                          item.trim()
                        )
                        .filter(Boolean)
                    )
                  }
                  sx={inputSx}
                />
              ) : (
                <Typography
                  sx={valueSx}
                >
                  {languageValue ||
                    "Not provided"}
                </Typography>
              )}
            </Box>

            <DetailRow
              icon={
                <EmailOutlinedIcon />
              }
              label="Email"
              value={
                profileData?.email
              }
            />

            <DetailRow
              icon={
                <PhoneOutlinedIcon />
              }
              label="Phone Number"
              value={
                profileData?.mobile
              }
            />

            <DetailRow
              icon={
                <WorkHistoryOutlinedIcon />
              }
              label="Experience"
              value={
                profileData?.experience
              }
              isEditing={isEditing}
              editable
              type="number"
              placeholder="Years"
              onChange={(event) =>
                onFieldChange?.(
                  "experience",
                  event.target.value
                )
              }
            />

            <DetailRow
              icon={
                <PaymentsOutlinedIcon />
              }
              label="Consultation Fee"
              value={
                profileData?.consultation_fee
              }
              isEditing={isEditing}
              editable
              type="number"
              placeholder="Fee"
              onChange={(event) =>
                onFieldChange?.(
                  "consultation_fee",
                  event.target.value
                )
              }
            />

            <DetailRow
              icon={
                <BadgeOutlinedIcon />
              }
              label="Medical License / Reg. No."
              value={
                profileData?.medical_registration_number
              }
              isEditing={isEditing}
              editable
              placeholder="License number"
              onChange={(event) =>
                onFieldChange?.(
                  "medicalLicense",
                  event.target.value
                )
              }
            />

            <DetailRow
              icon={
                <ConfirmationNumberOutlinedIcon />
              }
              label="Registration Number"
              value={
                profileData?.registration_number
              }
              isEditing={isEditing}
              editable
              placeholder="Registration number"
              onChange={(event) =>
                onFieldChange?.(
                  "registration_number",
                  event.target.value
                )
              }
            />
          </Box>
        </Box>

        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",

            gap: "10px",
          }}
        >
          {/* WORKING HOURS */}

          <Box
            sx={{
              p: "12px",

              border: "1px solid",
              borderColor: "divider",

              borderRadius: "10px",

              bgcolor:
                "background.paper",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",

                mb: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  gap: "8px",
                }}
              >
                <Box sx={iconSx}>
                  <AccessTimeOutlinedIcon />
                </Box>

                <Typography
                  sx={{
                    fontSize:
                      "15px",

                    fontWeight:
                      700,

                    color:
                      "text.primary",
                  }}
                >
                  Working Hours
                </Typography>
              </Box>

              {/* Edit Hours sirf edit mode me */}

              {isEditing && (
                <Typography
                  component="button"
                  onClick={() =>
                    setWorkingHoursModalOpen(
                      true
                    )
                  }
                  sx={{
                    border: 0,
                    background: "none",

                    cursor:
                      "pointer",

                    fontSize:
                      "12.5px",

                    fontWeight:
                      600,

                    color:
                      "primary.main",
                  }}
                >
                  Change
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0,1fr))",
                },

                gap: "6px",
              }}
            >
              {days.map(
                ([key, label]) => {
                  const day =
                    profileData
                      ?.workingHours?.[
                      key
                    ] || {};

                  const closed =
                    !day.start ||
                    !day.end;

                  return (
                    <Box
                      key={key}
                      sx={{
                        minHeight:
                          "42px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "space-between",

                        gap: "8px",

                        px: "10px",

                        border:
                          "1px solid",

                        borderColor:
                          "divider",

                        borderRadius:
                          "7px",

                        bgcolor:
                          "background.default",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize:
                            "12.5px",

                          fontWeight:
                            650,

                          color:
                            "text.primary",
                        }}
                      >
                        {label}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize:
                            "12.5px",

                          color:
                            closed
                              ? "text.disabled"
                              : "text.secondary",

                          textAlign:
                            "right",
                        }}
                      >
                        {closed
                          ? "Closed"
                          : `${formatDisplayTime(
                              day.start
                            )} - ${formatDisplayTime(
                              day.end
                            )}`}
                      </Typography>
                    </Box>
                  );
                }
              )}
            </Box>
          </Box>

          {/* DOCUMENT */}

          <Box
            onClick={() =>
              setDocumentsModalOpen(
                true
              )
            }
            sx={{
              p: "12px",

              border: "1px solid",
              borderColor: "divider",

              borderRadius: "10px",

              bgcolor:
                "background.paper",

              cursor: "pointer",

              "&:hover": {
                borderColor:
                  "primary.light",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",

                gap: "8px",

                mb: "10px",
              }}
            >
              <Box sx={iconSx}>
                <DescriptionOutlinedIcon />
              </Box>

              <Typography
                sx={{
                  fontSize: "15px",

                  fontWeight: 700,

                  color:
                    "text.primary",
                }}
              >
                Documents
              </Typography>
            </Box>

            <Box
              sx={{
                minHeight: "48px",

                display: "flex",
                alignItems: "center",

                gap: "9px",

                px: "10px",

                bgcolor:
                  "background.default",

                border: "1px solid",
                borderColor: "divider",

                borderRadius: "8px",
              }}
            >
              <Box sx={iconSx}>
                <DescriptionOutlinedIcon />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize:
                      "12.5px",

                    fontWeight:
                      600,

                    color:
                      "text.primary",
                  }}
                >
                  {
                    availableDocuments.length
                  }{" "}
                  documents available
                </Typography>
              </Box>

              <ArrowForwardIosIcon
                sx={{
                  fontSize: "13px",

                  color:
                    "text.secondary",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* WORKING HOURS */}

      <WorkingHoursModal
        open={
          workingHoursModalOpen
        }
        onClose={() =>
          setWorkingHoursModalOpen(
            false
          )
        }
        workingHours={
          profileData?.workingHours
        }
        onWorkingHoursChange={
          onWorkingHoursChange
        }
      />

      {/* DOCUMENT DIALOG */}

      <Dialog
        open={documentsModalOpen}
        onClose={() =>
          setDocumentsModalOpen(
            false
          )
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",

            fontSize: "15px",
            fontWeight: 700,

            borderBottom:
              "1px solid",

            borderColor:
              "divider",
          }}
        >
          Documents

          <IconButton
            size="small"
            onClick={() =>
              setDocumentsModalOpen(
                false
              )
            }
          >
            <CloseIcon
              sx={{
                fontSize: "18px",
              }}
            />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            p: "14px !important",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",

              gap: "7px",
            }}
          >
            {availableDocuments.length ? (
              availableDocuments.map(
                (document) => (
                  <Box
                    key={
                      document.name
                    }
                    sx={{
                      minHeight:
                        "46px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "space-between",

                      gap: "10px",

                      px: "10px",

                      border:
                        "1px solid",

                      borderColor:
                        "divider",

                      borderRadius:
                        "7px",

                      bgcolor:
                        "background.default",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize:
                          "12.5px",

                        fontWeight:
                          600,

                        color:
                          "text.primary",
                      }}
                    >
                      {
                        document.name
                      }
                    </Typography>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        const base =
                          process.env
                            .NEXT_PUBLIC_S3_BUCKET_URL ||
                          "";

                        const url =
                          document.path.startsWith(
                            "http"
                          )
                            ? document.path
                            : `${base.replace(
                                /\/$/,
                                ""
                              )}/${document.path.replace(
                                /^\//,
                                ""
                              )}`;

                        window.open(
                          url,
                          "_blank"
                        );
                      }}
                      sx={{
                        fontSize:
                          "12.5px",

                        textTransform:
                          "none",
                      }}
                    >
                      View
                    </Button>
                  </Box>
                )
              )
            ) : (
              <Typography
                sx={{
                  textAlign:
                    "center",

                  py: "20px",

                  fontSize:
                    "12.5px",

                  color:
                    "text.secondary",
                }}
              >
                No documents
                available
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDetails;