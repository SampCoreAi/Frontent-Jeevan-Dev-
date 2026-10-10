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
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


// ============================================================
// COMMON STYLE
// ============================================================

const rowSx = {
  minHeight: "46px",
  display: "flex",
  alignItems: {
    xs: "flex-start",
    sm: "center",
  },
  flexDirection: {
    xs: "column",
    sm: "row",
  },
  gap: {
    xs: "6px",
    sm: "10px",
  },
  px: {
    xs: "9px",
    sm: "12px",
  },
  py: "7px",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: "8px",
  bgcolor: "#f7f9f9",
  width: "100%",
  boxSizing: "border-box",
};

const iconSx = {
  width: "28px",
  height: "28px",
  minWidth: "28px",
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
  width: {
    xs: "100%",
    sm: "150px",
  },
  minWidth: {
    xs: 0,
    sm: "150px",
  },
  fontSize: {
    xs: "12px",
    sm: "12.5px",
  },
  lineHeight: 1.4,
  fontWeight: 650,
  color: "text.primary",
  flexShrink: 0,
};

const valueSx = {
  flex: 1,
  minWidth: 0,
  width: {
    xs: "100%",
    sm: "auto",
  },
  fontSize: {
    xs: "12px",
    sm: "12.5px",
  },
  lineHeight: 1.4,
  fontWeight: 500,
  color: "text.secondary",
  wordBreak: "break-word",
  overflowWrap: "anywhere",
};

const inputSx = {
  flex: 1,
  width: {
    xs: "100%",
    sm: "auto",
  },
  minWidth: 0,

  "& .MuiInputBase-root": {
    minHeight: "34px",
    width: "100%",
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

  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.light",
  },

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: {
            xs: "100%",
            sm: "auto",
          },
          minWidth: 0,
        }}
      >
        <Box sx={iconSx}>{icon}</Box>

        <Typography sx={labelSx}>{label}</Typography>
      </Box>

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
}) => {
  const [
    documentsModalOpen,
    setDocumentsModalOpen,
  ] = useState(false);
const [languageInput, setLanguageInput] = useState("");
  const languageValue = Array.isArray(profileData?.language)
    ? profileData.language.join(", ")
    : profileData?.language || "";

  // ============================================================
  // TIME
  // ============================================================

  // ============================================================
  // DOCUMENTS
  // ============================================================

  const documents = [
    {
      name: "Medical Registration Certificate",
      path: profileData?.medical_registration_certificate,
    },
    {
      name: "Medical Degree Certificate",
      path: profileData?.medical_degree_certificate,
    },
    {
      name: "Government ID Proof",
      path: profileData?.government_id_proof,
    },
    {
      name: "Selfie",
      path: profileData?.selfie,
    },
  ];

  const availableDocuments = documents.filter(
    (document) => document.path
  );

  return (
    <>
      {/* ======================================================
          MAIN RESPONSIVE GRID
      ====================================================== */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr",
            lg: "minmax(0, 1.08fr) minmax(300px, .92fr)",
          },

          gap: {
            xs: "10px",
            sm: "12px",
          },

          mt: "10px",

          width: "100%",
        }}
      >
        {/* ====================================================
            BASIC INFORMATION
        ==================================================== */}

        <Box
          sx={{
            p: {
              xs: "10px",
              sm: "12px",
            },

            border: "1px solid",
            borderColor: "divider",

            borderRadius: "10px",

            bgcolor: "background.paper",

            width: "100%",
            boxSizing: "border-box",
            minWidth: 0,
          }}
        >
          {/* HEADER */}

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
                fontSize: {
                  xs: "14px",
                  sm: "15px",
                },
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Basic Information
            </Typography>
          </Box>

          {/* ROWS */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              width: "100%",
            }}
          >
           {/* LANGUAGES */}
<Box sx={rowSx}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: {
        xs: "100%",
        sm: "auto",
      },
    }}
  >
    <Box sx={iconSx}>
      <LanguageOutlinedIcon />
    </Box>

    <Typography sx={labelSx}>
      Languages
    </Typography>
  </Box>

  {isEditing ? (
    <Box
      sx={{
        flex: 1,
        width: {
          xs: "100%",
          sm: "auto",
        },
        minWidth: 0,

        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "5px",

        minHeight: "36px",
        px: "8px",
        py: "4px",

        border: "1px solid",
        borderColor: "divider",
        borderRadius: "7px",
        bgcolor: "background.paper",

        "&:focus-within": {
          borderColor: "primary.main",
        },
      }}
    >
      {/* EXISTING LANGUAGES */}
      {(Array.isArray(profileData?.language)
        ? profileData.language
        : []
      ).map((language) => (
        <Box
          key={language}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",

            px: "7px",
            py: "3px",

            bgcolor: "#EEF8F5",
            border: "1px solid #D5EDE6",
            borderRadius: "6px",

            fontSize: "11.5px",
            fontWeight: 600,
            color: "#172033",
          }}
        >
          {language}

          <CloseIcon
            onClick={() => {
              const updatedLanguages =
                profileData.language.filter(
                  (item) => item !== language
                );

              onFieldChange?.(
                "language",
                updatedLanguages
              );
            }}
            sx={{
              fontSize: "13px",
              cursor: "pointer",
              color: "#74807B",

              "&:hover": {
                color: "#07876A",
              },
            }}
          />
        </Box>
      ))}

      {/* INPUT */}
      <Box
        component="input"
        value={languageInput}
        placeholder={
          profileData?.language?.length
            ? "Add language..."
            : "Hindi, English..."
        }
        onChange={(event) => {
          const value = event.target.value;

          // comma detected
          if (value.includes(",")) {
            const newLanguage = value
              .replace(",", "")
              .trim();

            if (newLanguage) {
              const currentLanguages =
                Array.isArray(profileData?.language)
                  ? profileData.language
                  : [];

              const alreadyExists =
                currentLanguages.some(
                  (item) =>
                    item.toLowerCase() ===
                    newLanguage.toLowerCase()
                );

              if (!alreadyExists) {
                onFieldChange?.("language", [
                  ...currentLanguages,
                  newLanguage,
                ]);
              }
            }

            setLanguageInput("");
            return;
          }

          setLanguageInput(value);
        }}
        onKeyDown={(event) => {
          // ENTER se bhi add
          if (event.key === "Enter") {
            event.preventDefault();

            const newLanguage =
              languageInput.trim();

            if (!newLanguage) return;

            const currentLanguages =
              Array.isArray(profileData?.language)
                ? profileData.language
                : [];

            const alreadyExists =
              currentLanguages.some(
                (item) =>
                  item.toLowerCase() ===
                  newLanguage.toLowerCase()
              );

            if (!alreadyExists) {
              onFieldChange?.("language", [
                ...currentLanguages,
                newLanguage,
              ]);
            }

            setLanguageInput("");
          }
        }}
        sx={{
          flex: 1,
          minWidth: "100px",

          border: "none",
          outline: "none",
          bgcolor: "transparent",

          fontFamily: "inherit",
          fontSize: "12.5px",
          color: "text.primary",

          py: "4px",

          "&::placeholder": {
            color: "#94A3B8",
            opacity: 1,
          },
        }}
      />
    </Box>
  ) : (
    <Box
      sx={{
        ...valueSx,
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
      }}
    >
      {Array.isArray(profileData?.language) &&
      profileData.language.length ? (
        profileData.language.map((language) => (
          <Box
            key={language}
            sx={{
              px: "7px",
              py: "3px",

              bgcolor: "#F1F7F5",
              border: "1px solid #DDE9E5",
              borderRadius: "6px",

              fontSize: "11.5px",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            {language}
          </Box>
        ))
      ) : (
        "Not provided"
      )}
    </Box>
  )}
</Box>

            {/* EMAIL */}

            <DetailRow
              icon={<EmailOutlinedIcon />}
              label="Email"
              value={profileData?.email}
            />

            {/* PHONE */}

            <DetailRow
              icon={<PhoneOutlinedIcon />}
              label="Phone Number"
              value={profileData?.mobile}
            />

          

            {/* CONSULTATION FEE */}

            {/* MEDICAL LICENSE */}

            <DetailRow
              icon={<BadgeOutlinedIcon />}
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
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* ==================================================
              DOCUMENTS
          ================================================== */}

          <Box
            onClick={() =>
              setDocumentsModalOpen(true)
            }
            sx={{
              p: {
                xs: "10px",
                sm: "12px",
              },

              border: "1px solid",
              borderColor: "divider",

              borderRadius: "10px",

              bgcolor: "background.paper",

              cursor: "pointer",

              width: "100%",
              boxSizing: "border-box",
              minWidth: 0,

              "&:hover": {
                borderColor: "primary.light",
              },
            }}
          >
            {/* HEADER */}

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
                  fontSize: {
                    xs: "14px",
                    sm: "15px",
                  },
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Documents
              </Typography>
            </Box>

            {/* DOCUMENT COUNT */}

            <Box
              sx={{
                minHeight: "48px",

                display: "flex",
                alignItems: "center",

                gap: "9px",

                px: {
                  xs: "8px",
                  sm: "10px",
                },

                py: "7px",

                bgcolor: "background.default",

                border: "1px solid",
                borderColor: "divider",

                borderRadius: "8px",

                width: "100%",
                boxSizing: "border-box",
                minWidth: 0,
              }}
            >
              <Box sx={iconSx}>
                <DescriptionOutlinedIcon />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "12px",
                      sm: "12.5px",
                    },

                    fontWeight: 600,

                    color: "text.primary",

                    wordBreak: "break-word",
                  }}
                >
                  {availableDocuments.length}{" "}
                  documents available
                </Typography>
              </Box>

              <ArrowForwardIosIcon
                sx={{
                  fontSize: "13px",
                  color: "text.secondary",
                  flexShrink: 0,
                }}
              />
            </Box>
          </Box>

            {/* EXPERIENCE */}

            <DetailRow
              icon={<WorkHistoryOutlinedIcon />}
              label="Experience"
              value={profileData?.experience}
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
              icon={<PaymentsOutlinedIcon />}
              label="Consultation Fee"
              value={profileData?.consultation_fee}
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

        </Box>
      </Box>

      {/* ======================================================
          DOCUMENT DIALOG
      ====================================================== */}

      <Dialog
        open={documentsModalOpen}
        onClose={() =>
          setDocumentsModalOpen(false)
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: {
              xs: "8px",
              sm: "10px",
            },

            width: {
              xs: "calc(100% - 20px)",
              sm: "100%",
            },

            m: {
              xs: "10px",
              sm: "32px",
            },

            maxHeight: {
              xs: "calc(100vh - 20px)",
              sm: "calc(100vh - 64px)",
            },
          },
        }}
      >
        {/* DIALOG TITLE */}

        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            gap: "10px",

            fontSize: {
              xs: "14px",
              sm: "15px",
            },

            fontWeight: 700,

            borderBottom: "1px solid",
            borderColor: "divider",

            px: {
              xs: "12px",
              sm: "16px",
            },

            py: {
              xs: "10px",
              sm: "12px",
            },
          }}
        >
          Documents

          <IconButton
            size="small"
            onClick={() =>
              setDocumentsModalOpen(false)
            }
          >
            <CloseIcon
              sx={{
                fontSize: "18px",
              }}
            />
          </IconButton>
        </DialogTitle>

        {/* DIALOG CONTENT */}

        <DialogContent
          sx={{
            p: {
              xs: "10px !important",
              sm: "14px !important",
            },

            overflowX: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "7px",
              width: "100%",
            }}
          >
            {availableDocuments.length ? (
              availableDocuments.map((document) => (
                <Box
                  key={document.name}
                  sx={{
                    minHeight: "46px",

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

                    gap: "8px",

                    px: "10px",
                    py: "8px",

                    border: "1px solid",
                    borderColor: "divider",

                    borderRadius: "7px",

                    bgcolor: "background.default",

                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "12px",
                        sm: "12.5px",
                      },

                      fontWeight: 600,

                      color: "text.primary",

                      wordBreak: "break-word",

                      width: {
                        xs: "100%",
                        sm: "auto",
                      },

                      flex: 1,
                    }}
                  >
                    {document.name}
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
                      fontSize: "12.5px",
                      textTransform: "none",
                      minWidth: {
                        xs: "100%",
                        sm: "64px",
                      },
                      flexShrink: 0,
                    }}
                  >
                    View
                  </Button>
                </Box>
              ))
            ) : (
              <Typography
                sx={{
                  textAlign: "center",
                  py: "20px",
                  fontSize: "12.5px",
                  color: "text.secondary",
                }}
              >
                No documents available
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDetails;