"use client";

import React from "react";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import DocumentButton from "./DocumentButton";

const DocumentDialog = ({
  open,
  onClose,
  selectedDoctor,
  getFileUrl,
  onAssignDoctor,
  assigning = false,
}) => {
  const theme = useTheme();

  // =========================================
  // ASSIGN DOCTOR
  // =========================================

  const handleAssignDoctor = () => {
    if (!assigning && selectedDoctor) {
      onAssignDoctor?.(selectedDoctor);
    }
  };

  // =========================================
  // DISPLAY VALUE
  // =========================================

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };

  // =========================================
  // FORMAT TEXT
  // =========================================

  const formatText = (value) => {
    if (!value) return "-";

    return String(value)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "VERIFIED":
        return {
          color: theme.palette.success.main,
          bgcolor: `${theme.palette.success.main}12`,
        };

      case "SUBMITTED":
        return {
          color: theme.palette.info.main,
          bgcolor: `${theme.palette.info.main}12`,
        };

      case "DRAFT":
        return {
          color: theme.palette.warning.main,
          bgcolor: `${theme.palette.warning.main}12`,
        };

      case "REJECTED":
        return {
          color: theme.palette.error.main,
          bgcolor: `${theme.palette.error.main}12`,
        };

      default:
        return {
          color: theme.palette.text.secondary,
          bgcolor: theme.palette.action.hover,
        };
    }
  };

  // =========================================
  // HOSPITAL
  // =========================================

  const hospital = Array.isArray(
    selectedDoctor?.hospital_detail
  )
    ? selectedDoctor.hospital_detail[0]
    : selectedDoctor?.hospital_detail || null;

  const statusStyle = getStatusStyle(
    selectedDoctor?.onboarding_status
  );

  // =========================================
  // PROFILE IMAGE
  // Change profile_image if API field differs
  // =========================================

  const profileImage = selectedDoctor?.profile_image
    ? getFileUrl?.(selectedDoctor.profile_image)
    : null;

  // =========================================
  // SECTION TITLE
  // =========================================

  const SectionTitle = ({ icon: Icon, title }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.8,
        mb: 1.5,
      }}
    >
      <Icon
        sx={{
          fontSize: 18,
          color: "primary.main",
        }}
      />

      <Typography
        sx={{
          fontSize: "13px",
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  // =========================================
  // INFO ITEM
  // =========================================

  const InfoItem = ({
    label,
    value,
    fullWidth = false,
  }) => (
    <Box
      sx={{
        minWidth: 0,

        gridColumn: fullWidth
          ? {
              xs: "span 1",
              sm: "span 2",
            }
          : "auto",
      }}
    >
      <Typography
        sx={{
          mb: 0.35,
          fontSize: "10px",
          fontWeight: 600,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 500,
          color: "text.primary",
          wordBreak: "break-word",
        }}
      >
        {displayValue(value)}
      </Typography>
    </Box>
  );

  // =========================================
  // COMMON CARD STYLE
  // =========================================

  const cardStyle = {
    p: {
      xs: 1.7,
      sm: 2,
    },

    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    bgcolor: "background.paper",

    minWidth: 0,
  };

  return (
    <Dialog
      open={open}
      onClose={assigning ? undefined : onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          width: "100%",
          maxHeight: "90vh",

          borderRadius: 2.5,

          border: "1px solid",
          borderColor: "divider",

          bgcolor: "background.paper",

          boxShadow:
            "0 18px 50px rgba(15,23,42,0.12)",

          overflow: "hidden",
        },
      }}
    >
      {/* =====================================
          HEADER
      ====================================== */}

      <DialogTitle
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },

          py: 1.7,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",

          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,

              flexShrink: 0,

              borderRadius: 1.5,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              bgcolor: `${theme.palette.primary.main}10`,
              color: "primary.main",
            }}
          >
            <PersonOutlineRoundedIcon
              sx={{
                fontSize: 19,
              }}
            />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: "15px",
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Doctor Registration Details
            </Typography>

            <Typography
              noWrap
              sx={{
                mt: 0.1,
                fontSize: "11px",
                color: "text.secondary",
              }}
            >
              {selectedDoctor?.full_name ||
                "Doctor details"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          disabled={assigning}
          onClick={onClose}
          sx={{
            color: "text.secondary",

            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <CloseRoundedIcon
            sx={{
              fontSize: 20,
            }}
          />
        </IconButton>
      </DialogTitle>

      {/* =====================================
          CONTENT
      ====================================== */}

      <DialogContent
        sx={{
          p: {
            xs: 2,
            sm: 2.5,

          },
          mt:2,

          bgcolor: "white",
        }}
      >
        {selectedDoctor && (
          <Box
            sx={{
              display: "grid",

              // Mobile = 1 column
              // Desktop = 2 columns
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },

              gap: 2,
              alignItems: "stretch",
            }}
          >
            {/* =================================
                PERSONAL INFORMATION
            ================================== */}

            {/* =================================
    PERSONAL INFORMATION
================================== */}

<Box sx={cardStyle}>
  <SectionTitle
    icon={PersonOutlineRoundedIcon}
    title="Personal Information"
  />

  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: {
        xs: 2,
        sm: 3,
      },
      flexDirection: {
        xs: "column",
        sm: "row",
      },
    }}
  >
    {/* BIG PROFILE IMAGE */}
    <Box
      sx={{
        width: {
          xs: 140,
          sm: 160,
        },
        height: {
          xs: 140,
          sm: 160,
        },
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {profileImage ? (
        <Box
          component="img"
          src={profileImage}
          alt={selectedDoctor?.full_name || "Doctor"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <AccountCircleOutlinedIcon
          sx={{
            fontSize: {
              xs: 85,
              sm: 100,
            },
            color: "text.disabled",
          }}
        />
      )}
    </Box>

    {/* DETAILS */}
    <Box
      sx={{
        flex: 1,
        width: "100%",
        minWidth: 0,

        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          sm: "repeat(2, minmax(0, 1fr))",
        },
        gap: {
          xs: 2,
          sm: 2.5,
        },
      }}
    >
      <InfoItem
        label="Gender"
        value={formatText(selectedDoctor.gender)}
      />

      <InfoItem
        label="Age"
        value={selectedDoctor.age}
      />
      <InfoItem
        label="Name"
        value={selectedDoctor.full_name}
      />

      <InfoItem
        label="Email"
        value={selectedDoctor.email}
      />

      <InfoItem
        label="Register Id"
        value={selectedDoctor.id}
      />
      <InfoItem
        label="Mobile Number"
        value={selectedDoctor.mobile}
      />
    </Box>
  </Box>
</Box>

            {/* =================================
                MEDICAL INFORMATION
            ================================== */}

            <Box sx={cardStyle}>
              <SectionTitle
                icon={BadgeOutlinedIcon}
                title="Medical Information"
              />

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },

                  gap: {
                    xs: 1.5,
                    sm: 2,
                  },
                }}
              >
                <InfoItem
                  label="Medical Registration Number"
                  value={
                    selectedDoctor.medical_registration_number
                  }
                />

                <InfoItem
                  label="Medical Council"
                  value={selectedDoctor.medical_council}
                />

                <InfoItem
                  label="Qualification"
                  value={selectedDoctor.qualification}
                />

                <InfoItem
                  label="Specialization"
                  value={selectedDoctor.specialization}
                />

                <InfoItem
                  label="Registration Expiry"
                  value={formatDate(
                    selectedDoctor.registration_expiry_date
                  )}
                />

                {/* STATUS */}

                <Box>
                  <Typography
                    sx={{
                      mb: 0.5,

                      fontSize: "10px",
                      fontWeight: 600,

                      color: "text.secondary",

                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                    }}
                  >
                    Onboarding Status
                  </Typography>

                  <Chip
                    label={formatText(
                      selectedDoctor.onboarding_status
                    )}
                    size="small"
                    sx={{
                      height: 24,

                      borderRadius: 1,

                      fontSize: "10px",
                      fontWeight: 700,

                      color: statusStyle.color,
                      bgcolor: statusStyle.bgcolor,

                      "& .MuiChip-label": {
                        px: 1.2,
                      },
                    }}
                  />
                </Box>

                <InfoItem
                  label="Submitted / Created Date"
                  value={formatDate(
                    selectedDoctor.created_at
                  )}
                />
              </Box>
            </Box>

            {/* =================================
                HOSPITAL DETAILS
            ================================== */}

            <Box sx={cardStyle}>
              <SectionTitle
                icon={LocalHospitalOutlinedIcon}
                title="Hospital Details"
              />

              {hospital ? (
                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },

                    gap: {
                      xs: 1.5,
                      sm: 2,
                    },
                  }}
                >
                  <InfoItem
                    label="Hospital Name"
                    value={hospital.hospitalName}
                  />

                  <InfoItem
                    label="Building / Society"
                    value={hospital.buildingSociety}
                  />

                  <InfoItem
                    label="Flat / Plot No."
                    value={hospital.flatPlotNo}
                  />

                  <InfoItem
                    label="Street Name"
                    value={hospital.streetName}
                  />

                  <InfoItem
                    label="Area / Locality"
                    value={hospital.areaLocality}
                  />

                  <InfoItem
                    label="Landmark"
                    value={hospital.landmark}
                  />

                  <InfoItem
                    label="City"
                    value={hospital.city}
                  />

                  <InfoItem
                    label="District"
                    value={hospital.district}
                  />

                  <InfoItem
                    label="State"
                    value={hospital.state}
                  />

                  <InfoItem
                    label="PIN Code"
                    value={hospital.pinCode}
                  />
                </Box>
              ) : (
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "text.secondary",
                  }}
                >
                  Hospital information not available.
                </Typography>
              )}
            </Box>

            {/* =================================
                DOCUMENTS
            ================================== */}

            <Box sx={cardStyle}>
              <SectionTitle
                icon={DescriptionOutlinedIcon}
                title="Documents"
              />

              <Stack spacing={1}>
                <DocumentButton
                  title="Medical Registration Certificate"
                  path={
                    selectedDoctor.medical_registration_certificate
                  }
                  getFileUrl={getFileUrl}
                />

                <DocumentButton
                  title="Medical Degree Certificate"
                  path={
                    selectedDoctor.medical_degree_certificate
                  }
                  getFileUrl={getFileUrl}
                />

                <DocumentButton
                  title="Government ID Proof"
                  path={
                    selectedDoctor.government_id_proof
                  }
                  getFileUrl={getFileUrl}
                />

                <DocumentButton
                  title="Selfie"
                  path={selectedDoctor.selfie}
                  getFileUrl={getFileUrl}
                />
              </Stack>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* =====================================
          FOOTER
      ====================================== */}

      <DialogActions
        sx={{
          px: {
            xs: 2,
            sm: 2.5,
          },

          py: 1.5,

          borderTop: "1px solid",
          borderColor: "divider",

          bgcolor: "background.paper",

          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={assigning}
          sx={{
            height: 36,

            px: 2,

            color: "text.secondary",

            textTransform: "none",

            fontSize: "12px",
            fontWeight: 600,

            borderRadius: 1.5,
          }}
        >
          Close
        </Button>

        <Button
          variant="contained"
          disabled={assigning}
          onClick={handleAssignDoctor}
          startIcon={
            assigning ? (
              <CircularProgress
                size={15}
                color="inherit"
              />
            ) : (
              <PersonAddAltOutlinedIcon
                sx={{
                  fontSize: 17,
                }}
              />
            )
          }
          sx={{
            minWidth: 140,
            height: 36,

            px: 2,

            borderRadius: 1.5,

            textTransform: "none",

            fontSize: "12px",
            fontWeight: 600,

            boxShadow: "none",

            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {assigning
            ? "Assigning..."
            : "Assign Doctor"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentDialog;