"use client";

import React from "react";
import {
  Box,
  Stack,
  Avatar,
  Typography,
  CircularProgress,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

import axios from "axios";

import {
  API_BASE_URL,
  API_ENDPOINTS,
} from "../../../../../config/api";

const PatientProfileSidebar = ({
  userProfile,
  formData,
  editable,
  handleChange,
}) => {
  const theme = useTheme();

  const [uploading, setUploading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);

  const open = Boolean(anchorEl);

  const localUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const handleCameraClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreviewImage(localPreview);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      setUploading(true);

      const res = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.UPLOAD_IMAGE}?folder=user-profile`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("UPLOAD RESPONSE:", res.data);

      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Image upload failed"
        );
      }
    } catch (err) {
      console.error(
        "Upload Error:",
        err.response?.data || err.message || err
      );

      setPreviewImage(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setPreviewImage(null);
    handleChange("doctor_image", "");
  };

  const displayName =
    localUser?.name ||
    formData?.name ||
    "Patient";

  const displayUsername = formData?.username
    ? `@${formData.username}`
    : `@${displayName.toLowerCase().replace(/\s+/g, "")}`;

  const displayEmail =
    formData?.email ||
    userProfile?.email ||
    localUser?.email ||
    "";

  const displayPhone =
    formData?.phone ||
    userProfile?.phone_number ||
    localUser?.phone_number ||
    "";

  const S3_URL =
    process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";

  const displayImage =
    previewImage ||
    (userProfile?.image?.url
      ? userProfile.image.url.startsWith("http")
        ? userProfile.image.url
        : `${S3_URL}/${userProfile.image.url}`
      : null) ||
    (userProfile?.doctor_image
      ? `${S3_URL}/${userProfile.doctor_image}`
      : null);

  const avatarInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : "P";

  const infoRow = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 1.3,
    py: 1,
    borderRadius: 1.5,
    backgroundColor: theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
  };

  return (
    <Stack
      alignItems="center"
      sx={{
        width: {
          xs: "100%",
          md: "26%",
        },

        minWidth: {
          md: 230,
        },

        maxWidth: {
          md: 290,
        },

        backgroundColor: theme.palette.background.paper,

        px: {
          xs: 2,
          md: 2.5,
        },

        py: 2.5,

        borderRadius: {
          xs: 0,
          md: "10px 0 0 10px",
        },
      }}
    >
      {/* PROFILE IMAGE */}

      <Box
        sx={{
          position: "relative",
        }}
      >
        <Avatar
          src={displayImage || undefined}
          variant="rounded"
          sx={{
            width: {
              xs: 120,
              md: 145,
            },

            height: {
              xs: 120,
              md: 160,
            },

            borderRadius: 2.5,

            border: `2px solid ${theme.palette.primary.main}`,

            fontSize: {
              xs: "34px",
              md: "42px",
            },

            backgroundColor: theme.palette.primary.main,

            color: theme.palette.primary.contrastText,

            fontWeight: 700,

            opacity: uploading ? 0.5 : 1,
          }}
        >
          {!displayImage && avatarInitial}
        </Avatar>

        {/* Upload Loader */}

        {uploading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              borderRadius: 2.5,

              backgroundColor: "rgba(255,255,255,0.4)",

              zIndex: 2,
            }}
          >
            <CircularProgress
              size={32}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
          </Box>
        )}

        <input
          type="file"
          id="upload-photo-input"
          hidden
          accept="image/*"
          onChange={handleUpload}
        />

        {/* CAMERA */}

        {editable && !uploading && (
          <IconButton
            aria-label="Change profile photo"
            onClick={handleCameraClick}
            size="small"
            sx={{
              position: "absolute",
              bottom: 6,
              right: 6,

              width: 30,
              height: 30,

              backgroundColor:
                theme.palette.background.paper,

              border: `1px solid ${theme.palette.divider}`,

              boxShadow:
                "0 2px 8px rgba(0,0,0,0.12)",

              "&:hover": {
                backgroundColor:
                  theme.palette.background.default,
              },
            }}
          >
            <CameraAltOutlinedIcon
              sx={{
                fontSize: 17,
                color: theme.palette.primary.main,
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* PHOTO MENU */}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 160,
            borderRadius: 1.5,
            boxShadow:
              "0 6px 20px rgba(0,0,0,0.10)",

            "& .MuiMenuItem-root": {
              fontSize: "12.5px",
              minHeight: 36,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();

            document
              .getElementById("upload-photo-input")
              ?.click();
          }}
        >
          Upload New Photo
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            handleRemovePhoto();
          }}
        >
          Remove Photo
        </MenuItem>
      </Menu>

     {/* NAME + USERNAME */}

<Stack
  spacing={0.8}
  sx={{
    width: "100%",
    mt: 1.5,
  }}
>
  {/* NAME */}
  <Box
    sx={{
      ...infoRow,
      backgroundColor: "#F8FAF9",
    }}
  >
    <Typography
      sx={{
        fontSize: "12px",
        fontWeight: 600,
        color: theme.palette.text.primary,
        minWidth: 72,
        flexShrink: 0,
      }}
    >
      Name 
    </Typography>

    <Typography
      sx={{
        fontSize: "12px",
        fontWeight: 500,
        color: theme.palette.text.secondary,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {displayName}
    </Typography>
  </Box>

  {/* USERNAME */}
  <Box
    sx={{
      ...infoRow,
      backgroundColor: "#F8FAF9",

      "&:focus-within": {
        borderColor: editable
          ? theme.palette.primary.main
          : theme.palette.divider,
      },
    }}
  >
    <Typography
      sx={{
        fontSize: "12px",
        fontWeight: 600,
        color: theme.palette.text.primary,
        minWidth: 72,
        flexShrink: 0,
      }}
    >
      Username 
    </Typography>

    {editable ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            fontSize: "12px",
            color: theme.palette.text.secondary,
          }}
        >
          @
        </Typography>

        <input
          type="text"
          value={formData.username || ""}
          onChange={(e) =>
            handleChange("username", e.target.value)
          }
          placeholder="username"
          style={{
            width: "100%",
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            padding: "0 0 0 2px",
            fontSize: "12px",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            fontFamily: "inherit",
          }}
        />
      </Box>
    ) : (
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 500,
          color: theme.palette.text.secondary,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {displayUsername}
      </Typography>
    )}
  </Box>
</Stack>
      <Divider
        sx={{
          width: "100%",
          my: 1.7,
          borderColor: theme.palette.divider,
        }}
      />

      {/* CONTACT INFORMATION */}

      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: theme.palette.text.secondary,
            fontWeight: 600,
            mb: 0.8,
          }}
        >
          Contact Information
        </Typography>

        <Stack spacing={0.8}>
          {/* EMAIL */}

          {displayEmail && (
            <Box sx={infoRow}>
              <EmailOutlinedIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              />

              <Typography
                title={displayEmail}
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,

                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayEmail}
              </Typography>
            </Box>
          )}

          {/* PHONE */}

          {displayPhone && (
            <Box sx={infoRow}>
              <PhoneOutlinedIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              />

              <Typography
                sx={{
                  fontSize: "12px",
                  color: theme.palette.text.secondary,
                }}
              >
                {displayPhone}
              </Typography>
            </Box>
          )}
          {/* PERSONAL DETAILS */}

<Divider
  sx={{
    width: "100%",
    my: 1.7,
    borderColor: theme.palette.divider,
  }}
/>

<Box sx={{ width: "100%" }}>
  <Typography
    sx={{
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      color: theme.palette.text.secondary,
      fontWeight: 600,
      mb: 0.8,
    }}
  >
    Personal Information
  </Typography>

  <Stack spacing={0.8}>
    {/* AGE */}
    <Box sx={infoRow}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          minWidth: 70,
        }}
      >
        Age
      </Typography>

      <input
        type="number"
        value={formData.age || ""}
        placeholder="Age"
        disabled={!editable}
        onChange={(e) => handleChange("age", e.target.value)}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "12px",
          color: theme.palette.text.secondary,
          fontFamily: "inherit",
        }}
      />
    </Box>

    {/* GENDER */}
    <Box sx={infoRow}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          minWidth: 70,
        }}
      >
        Gender
      </Typography>

      <select
        value={formData.gender || ""}
        disabled={!editable}
        onChange={(e) => handleChange("gender", e.target.value)}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "12px",
          color: theme.palette.text.secondary,
          fontFamily: "inherit",
          cursor: editable ? "pointer" : "default",
        }}
      >
        <option value="">Select</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>
    </Box>

    {/* LANGUAGE */}
    <Box sx={infoRow}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          minWidth: 70,
        }}
      >
        Language
      </Typography>

      <input
        type="text"
        value={formData.language || ""}
        placeholder="Language"
        disabled={!editable}
        onChange={(e) => handleChange("language", e.target.value)}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "12px",
          color: theme.palette.text.secondary,
          fontFamily: "inherit",
        }}
      />
    </Box>

    {/* WEIGHT */}
    <Box sx={infoRow}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          minWidth: 70,
        }}
      >
        Weight
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
        }}
      >
        <input
          type="number"
          value={formData.weight || ""}
          placeholder="Weight"
          disabled={!editable}
          onChange={(e) => handleChange("weight", e.target.value)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "12px",
            color: theme.palette.text.secondary,
            fontFamily: "inherit",
          }}
        />

        {formData.weight && (
          <Typography
            sx={{
              fontSize: "11px",
              color: theme.palette.text.secondary,
            }}
          >
            kg
          </Typography>
        )}
      </Box>
    </Box>

    {/* HEIGHT */}
    <Box sx={infoRow}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: theme.palette.text.primary,
          minWidth: 70,
        }}
      >
        Height
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
        }}
      >
        <input
          type="number"
          value={formData.height || ""}
          placeholder="Height"
          disabled={!editable}
          onChange={(e) => handleChange("height", e.target.value)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "12px",
            color: theme.palette.text.secondary,
            fontFamily: "inherit",
          }}
        />

        {formData.height && (
          <Typography
            sx={{
              fontSize: "11px",
              color: theme.palette.text.secondary,
            }}
          >
            cm
          </Typography>
        )}
      </Box>
    </Box>

    
  </Stack>
</Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PatientProfileSidebar;