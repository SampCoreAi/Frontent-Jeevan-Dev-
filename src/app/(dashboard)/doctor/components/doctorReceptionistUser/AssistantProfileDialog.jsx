"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

export default function AssistantProfileDialog({
  open,
  onClose,
  assistant,
}) {
  const [imageOpen, setImageOpen] = useState(false);

  if (!assistant) return null;

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name = "") => {
    if (!name) return "A";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // =====================================================
  // VALUE
  // =====================================================

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "-"
    ) {
      return "Not available";
    }

    return value;
  };

  const experienceValue =
    assistant.experience &&
    assistant.experience !== "-"
      ? `${assistant.experience} ${
          Number(assistant.experience) === 1 ? "Year" : "Years"
        }`
      : "Not available";

  // =====================================================
  // GENDER ICON
  // =====================================================

  const getGenderIcon = (gender) => {
    const value = gender?.toLowerCase();

    if (value === "male") {
      return <MaleIcon />;
    }

    if (value === "female") {
      return <FemaleIcon />;
    }

    return <PersonOutlineIcon />;
  };

  // =====================================================
  // INFO ITEM
  // =====================================================

  const InfoItem = ({ icon, label, value, fullWidth = false }) => (
    <Box
      sx={{
        minWidth: 0,
        gridColumn: fullWidth ? "1 / -1" : "auto",

        display: "flex",
        alignItems: fullWidth ? "flex-start" : "center",

        gap: 1,

        px: 1.2,
        py: 1,

        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,

        bgcolor: "background.paper",

        transition: "0.2s ease",

        "&:hover": {
          borderColor: "primary.light",
          bgcolor: "background.default",
        },
      }}
    >
      {/* ICON */}

      <Box
        sx={{
          width: 28,
          height: 28,
          minWidth: 28,

          borderRadius: 1,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          bgcolor: "secondary.light",
          color: "primary.main",

          "& svg": {
            fontSize: 16,
          },
        }}
      >
        {icon}
      </Box>

      {/* TEXT */}

      <Box
        sx={{
          minWidth: 0,
          flex: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "text.secondary",
            lineHeight: 1.2,
            mb: 0.25,
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          title={displayValue(value)}
          sx={{
            color: "text.primary",
            fontWeight: 600,
            lineHeight: 1.35,

            ...(fullWidth
              ? {
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                }
              : {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }),
          }}
        >
          {displayValue(value)}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* =================================================
          PROFILE DIALOG
      ================================================= */}

      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",

            m: {
              xs: 1.5,
              sm: 2,
            },

            width: {
              xs: "calc(100% - 24px)",
              sm: "100%",
            },
          },
        }}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            px: 2,
            py: 1.2,

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",

            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Assistant Profile
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Personal & professional information
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close assistant profile"
            sx={{
              border: "1px solid",
              borderColor: "divider",

              "&:hover": {
                bgcolor: "secondary.light",
                color: "primary.main",
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>

        {/* =================================================
            CONTENT
        ================================================= */}

        <DialogContent
          sx={{
            p: "0 !important",
          }}
        >
          {/* =================================================
              PROFILE TOP
          ================================================= */}

          <Box
            sx={{
              px: 2,
              py: 1.5,

              display: "flex",
              alignItems: "center",
              gap: 1.5,

              bgcolor: "background.default",
            }}
          >
            {/* CLICKABLE IMAGE */}

            <Tooltip title="View image">
              <Box
                onClick={() => setImageOpen(true)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  flexShrink: 0,

                  "&:hover .zoom-icon": {
                    opacity: 1,
                  },

                  "&:hover .profile-avatar": {
                    opacity: 0.85,
                  },
                }}
              >
                <Avatar
                  className="profile-avatar"
                  src={assistant.image || undefined}
                  alt={assistant.name || "Assistant"}
                  sx={{
                    width: 58,
                    height: 58,

                    bgcolor: "primary.main",
                    color: "primary.contrastText",

                    fontSize: "15px",
                    fontWeight: 700,

                    border: "2px solid",
                    borderColor: "background.paper",

                    transition: "0.2s ease",

                    boxShadow:
                      "0 2px 8px rgba(15, 23, 42, 0.10)",
                  }}
                >
                  {!assistant.image &&
                    getInitials(assistant.name)}
                </Avatar>

                <Box
                  className="zoom-icon"
                  sx={{
                    position: "absolute",

                    inset: 0,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    borderRadius: "50%",

                    bgcolor: "rgba(0,0,0,0.25)",

                    opacity: 0,
                    transition: "0.2s ease",

                    color: "#fff",
                  }}
                >
                  <ZoomInIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
            </Tooltip>

            {/* NAME */}

            <Box
              sx={{
                minWidth: 0,
                flex: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",

                  mb: 0.5,
                }}
              >
                {displayValue(assistant.name)}
              </Typography>

              {assistant.department &&
              assistant.department !== "-" ? (
                <Chip
                  label={assistant.department}
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{
                    height: 22,

                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Assistant
                </Typography>
              )}
            </Box>
          </Box>

          <Divider />

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <Box
            sx={{
              p: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 1,
              }}
            >
              Personal Information
            </Typography>

            {/* HORIZONTAL GRID */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },

                gap: 1,
              }}
            >
              <InfoItem
                icon={<PersonOutlineIcon />}
                label="Name"
                value={assistant.name}
              />

              <InfoItem
                icon={<EmailOutlinedIcon />}
                label="Email"
                value={assistant.email}
              />

              <InfoItem
                icon={<PhoneOutlinedIcon />}
                label="Mobile"
                value={assistant.mobile}
              />

              <InfoItem
                icon={getGenderIcon(assistant.gender)}
                label="Gender"
                value={assistant.gender}
              />

              <InfoItem
                icon={<CakeOutlinedIcon />}
                label="Age"
                value={assistant.age}
              />

              <InfoItem
                icon={<WorkOutlineIcon />}
                label="Experience"
                value={experienceValue}
              />
            </Box>
          </Box>

          <Divider />

          {/* =================================================
              PROFESSIONAL INFORMATION
          ================================================= */}

          <Box
            sx={{
              p: 1.5,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 1,
              }}
            >
              Professional Information
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },

                gap: 1,
              }}
            >
              <InfoItem
                icon={<SchoolOutlinedIcon />}
                label="Education"
                value={assistant.education}
              />

              <InfoItem
                icon={<InfoOutlinedIcon />}
                label="Bio"
                value={assistant.bio}
              />
            </Box>
          </Box>
        </DialogContent>

        {/* =================================================
            FOOTER
        ================================================= */}

        <Box
          sx={{
            px: 2,
            py: 1.2,

            display: "flex",
            justifyContent: "flex-end",

            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              minWidth: 75,
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>

      {/* =================================================
          LARGE IMAGE PREVIEW
      ================================================= */}

      <Dialog
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          {/* CLOSE */}

          <IconButton
            onClick={() => setImageOpen(false)}
            aria-label="Close image preview"
            sx={{
              position: "absolute",
              top: 5,
              right: 5,

              zIndex: 2,

              bgcolor: "background.paper",
              color: "text.primary",

              boxShadow:
                "0 2px 8px rgba(0,0,0,0.15)",

              "&:hover": {
                bgcolor: "background.default",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* IMAGE */}

          {assistant.image ? (
            <Box
              component="img"
              src={assistant.image}
              alt={assistant.name || "Assistant"}
              sx={{
                maxWidth: "100%",
                maxHeight: "75vh",

                objectFit: "contain",

                borderRadius: 2,

                bgcolor: "background.paper",

                boxShadow:
                  "0 10px 35px rgba(0,0,0,0.20)",
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: {
                  xs: 180,
                  sm: 250,
                },

                height: {
                  xs: 180,
                  sm: 250,
                },

                bgcolor: "primary.main",

                fontSize: {
                  xs: "45px",
                  sm: "60px",
                },

                fontWeight: 700,
              }}
            >
              {getInitials(assistant.name)}
            </Avatar>
          )}
        </Box>
      </Dialog>
    </>
  );
}