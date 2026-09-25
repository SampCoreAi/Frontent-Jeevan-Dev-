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
  const [uploadError, setUploadError] = React.useState("");
  const [errors, setErrors] = React.useState({});

  const open = Boolean(anchorEl);

  const localUser = React.useMemo(() => {
    if (typeof window === "undefined") return {};

    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const validateField = (field, value) => {
    const stringValue = String(value ?? "").trim();

    switch (field) {
      case "username":
        if (!stringValue) {
          return "Username is required";
        }

        if (stringValue.length < 3) {
          return "Minimum 3 characters required";
        }

        if (stringValue.length > 30) {
          return "Maximum 30 characters allowed";
        }

        if (!/^[A-Za-z0-9_]+$/.test(stringValue)) {
          return "Only letters, numbers and underscore allowed";
        }

        return "";

      case "age":
        if (!stringValue) {
          return "";
        }

        if (!/^\d+$/.test(stringValue)) {
          return "Enter a valid age";
        }

        if (
          Number(stringValue) < 1 ||
          Number(stringValue) > 120
        ) {
          return "Age must be between 1 and 120";
        }

        return "";

      case "language":
        if (!stringValue) {
          return "";
        }

        if (stringValue.length > 100) {
          return "Maximum 100 characters allowed";
        }

        if (!/^[A-Za-z,\s]+$/.test(stringValue)) {
          return "Only letters, spaces and commas allowed";
        }

        return "";

      case "weight":
        if (!stringValue) {
          return "";
        }

        if (!/^\d+(\.\d{1,2})?$/.test(stringValue)) {
          return "Enter a valid weight";
        }

        if (
          Number(stringValue) < 1 ||
          Number(stringValue) > 500
        ) {
          return "Weight must be between 1 and 500 kg";
        }

        return "";

      case "height":
        if (!stringValue) {
          return "";
        }

        if (!/^\d+(\.\d{1,2})?$/.test(stringValue)) {
          return "Enter a valid height";
        }

        if (
          Number(stringValue) < 30 ||
          Number(stringValue) > 300
        ) {
          return "Height must be between 30 and 300 cm";
        }

        return "";

      default:
        return "";
    }
  };

  const updateField = (field, value) => {
    let nextValue = value;

    if (field === "username") {
      nextValue = value
        .replace(/[^A-Za-z0-9_]/g, "")
        .slice(0, 30);
    }

    if (field === "age") {
      nextValue = value
        .replace(/\D/g, "")
        .slice(0, 3);
    }

    if (field === "language") {
      nextValue = value
        .replace(/[^A-Za-z,\s]/g, "")
        .replace(/\s{2,}/g, " ")
        .slice(0, 100);
    }

    if (field === "weight" || field === "height") {
      nextValue = value
        .replace(/[^\d.]/g, "")
        .replace(/(\..*)\./g, "$1")
        .slice(0, 6);
    }

    const error = validateField(field, nextValue);

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    handleChange(field, nextValue);
  };

  const handleBlur = (field) => {
    const value = formData?.[field] ?? "";

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const preventInvalidNumberKeys = (event) => {
    if (
      ["e", "E", "+", "-"].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  const handleCameraClick = (event) => {
    setUploadError("");
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "Only JPG, PNG or WEBP images are allowed."
      );
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setUploadError(
        "Image size cannot exceed 5 MB."
      );
      event.target.value = "";
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreviewImage(localPreview);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const token = localStorage.getItem("token");

    if (!token) {
      URL.revokeObjectURL(localPreview);
      setPreviewImage(null);
      setUploadError(
        "Authentication token not found."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.UPLOAD_IMAGE}?folder=user-profile`,
        uploadFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Image upload failed"
        );
      }
    } catch (error) {
      URL.revokeObjectURL(localPreview);

      setPreviewImage(null);

      setUploadError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to upload image."
      );

      console.error(
        "Upload Error:",
        error?.response?.data ||
          error?.message ||
          error
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  React.useEffect(() => {
    return () => {
      if (
        previewImage &&
        previewImage.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleRemovePhoto = () => {
    if (
      previewImage &&
      previewImage.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewImage);
    }

    setPreviewImage(null);
    setUploadError("");
    handleClose();
  };

  const displayName =
    localUser?.name ||
    formData?.name ||
    userProfile?.full_name ||
    "Patient";

  const displayUsername = formData?.username
    ? `@${formData.username}`
    : `@${displayName
        .toLowerCase()
        .replace(/\s+/g, "")}`;

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
        : `${S3_URL}${userProfile.image.url}`
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
    minHeight: 40,
    borderRadius: 1.5,
    backgroundColor:
      theme.palette.background.default,
    border: `1px solid ${theme.palette.divider}`,
    boxSizing: "border-box",
  };

  const editableRow = (field) => ({
    ...infoRow,

    borderColor: errors[field]
      ? theme.palette.error.main
      : theme.palette.divider,

    "&:focus-within": {
      borderColor: errors[field]
        ? theme.palette.error.main
        : editable
          ? theme.palette.primary.main
          : theme.palette.divider,

      boxShadow:
        editable && !errors[field]
          ? `0 0 0 2px ${theme.palette.primary.main}12`
          : "none",
    },
  });

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: theme.palette.text.primary,
    minWidth: 70,
    flexShrink: 0,
  };

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "12px",
    color: theme.palette.text.secondary,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const ErrorText = ({ field }) => {
    if (!editable || !errors[field]) {
      return null;
    }

    return (
      <Typography
        sx={{
          mt: 0.4,
          ml: 1,
          fontSize: "10.5px",
          color: theme.palette.error.main,
          lineHeight: 1.3,
        }}
      >
        {errors[field]}
      </Typography>
    );
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
        backgroundColor:
          theme.palette.background.paper,
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
            backgroundColor:
              theme.palette.primary.main,
            color:
              theme.palette.primary.contrastText,
            fontWeight: 700,
            opacity: uploading ? 0.5 : 1,
          }}
        >
          {!displayImage && avatarInitial}
        </Avatar>

        {uploading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2.5,
              backgroundColor:
                "rgba(255,255,255,0.45)",
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
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
        />

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
              .getElementById(
                "upload-photo-input"
              )
              ?.click();
          }}
        >
          Upload New Photo
        </MenuItem>

        {displayImage && (
          <MenuItem
            onClick={handleRemovePhoto}
            sx={{
              color: theme.palette.error.main,
            }}
          >
            Remove Preview
          </MenuItem>
        )}
      </Menu>

      {uploadError && (
        <Typography
          sx={{
            width: "100%",
            mt: 0.8,
            textAlign: "center",
            fontSize: "10.5px",
            color: theme.palette.error.main,
          }}
        >
          {uploadError}
        </Typography>
      )}

      <Stack
        spacing={0.8}
        sx={{
          width: "100%",
          mt: 1.5,
        }}
      >
        <Box sx={infoRow}>
          <Typography
            sx={{
              ...labelStyle,
              minWidth: 72,
            }}
          >
            Name
          </Typography>

          <Typography
            title={displayName}
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

        <Box sx={editableRow("username")}>
          <Typography
            sx={{
              ...labelStyle,
              minWidth: 72,
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
                  color:
                    theme.palette.text.secondary,
                }}
              >
                @
              </Typography>

              <input
                type="text"
                value={formData?.username || ""}
                maxLength={30}
                autoComplete="username"
                onChange={(e) =>
                  updateField(
                    "username",
                    e.target.value
                  )
                }
                onBlur={() =>
                  handleBlur("username")
                }
                placeholder="username"
                style={{
                  ...inputStyle,
                  padding: "0 0 0 2px",
                  fontWeight: 500,
                }}
              />
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color:
                  theme.palette.text.secondary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayUsername}
            </Typography>
          )}
        </Box>

        <ErrorText field="username" />
      </Stack>

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
          Contact Information
        </Typography>

        <Stack spacing={0.8}>
          {displayEmail && (
            <Box sx={infoRow}>
              <EmailOutlinedIcon
                sx={{
                  color:
                    theme.palette.primary.main,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              />

              <Typography
                title={displayEmail}
                sx={{
                  fontSize: "12px",
                  color:
                    theme.palette.text.secondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayEmail}
              </Typography>
            </Box>
          )}

          {displayPhone && (
            <Box sx={infoRow}>
              <PhoneOutlinedIcon
                sx={{
                  color:
                    theme.palette.primary.main,
                  fontSize: 16,
                  flexShrink: 0,
                }}
              />

              <Typography
                title={displayPhone}
                sx={{
                  fontSize: "12px",
                  color:
                    theme.palette.text.secondary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayPhone}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

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
          <Box>
            <Box sx={editableRow("age")}>
              <Typography sx={labelStyle}>
                Age
              </Typography>

              <input
                type="number"
                value={formData?.age ?? ""}
                placeholder="Age"
                disabled={!editable}
                min={1}
                max={120}
                inputMode="numeric"
                onKeyDown={
                  preventInvalidNumberKeys
                }
                onChange={(e) =>
                  updateField(
                    "age",
                    e.target.value
                  )
                }
                onBlur={() =>
                  handleBlur("age")
                }
                style={inputStyle}
              />
            </Box>

            <ErrorText field="age" />
          </Box>

          <Box sx={infoRow}>
            <Typography sx={labelStyle}>
              Gender
            </Typography>

            <select
              value={formData?.gender || ""}
              disabled={!editable}
              onChange={(e) =>
                handleChange(
                  "gender",
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                cursor: editable
                  ? "pointer"
                  : "default",
              }}
            >
              <option value="">
                Select
              </option>
              <option value="MALE">
                Male
              </option>
              <option value="FEMALE">
                Female
              </option>
              <option value="OTHER">
                Other
              </option>
            </select>
          </Box>

          <Box>
            <Box sx={editableRow("language")}>
              <Typography sx={labelStyle}>
                Language
              </Typography>

              <input
                type="text"
                value={
                  formData?.language || ""
                }
                placeholder="Hindi, English"
                disabled={!editable}
                maxLength={100}
                onChange={(e) =>
                  updateField(
                    "language",
                    e.target.value
                  )
                }
                onBlur={() =>
                  handleBlur("language")
                }
                style={inputStyle}
              />
            </Box>

            <ErrorText field="language" />
          </Box>

          <Box>
            <Box sx={editableRow("weight")}>
              <Typography sx={labelStyle}>
                Weight
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <input
                  type="number"
                  value={
                    formData?.weight ?? ""
                  }
                  placeholder="Weight"
                  disabled={!editable}
                  min={1}
                  max={500}
                  step="0.1"
                  inputMode="decimal"
                  onKeyDown={
                    preventInvalidNumberKeys
                  }
                  onChange={(e) =>
                    updateField(
                      "weight",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur("weight")
                  }
                  style={inputStyle}
                />

                {formData?.weight !== "" &&
                  formData?.weight != null && (
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color:
                          theme.palette.text
                            .secondary,
                        flexShrink: 0,
                      }}
                    >
                      kg
                    </Typography>
                  )}
              </Box>
            </Box>

            <ErrorText field="weight" />
          </Box>

          <Box>
            <Box sx={editableRow("height")}>
              <Typography sx={labelStyle}>
                Height
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <input
                  type="number"
                  value={
                    formData?.height ?? ""
                  }
                  placeholder="Height"
                  disabled={!editable}
                  min={30}
                  max={300}
                  step="0.1"
                  inputMode="decimal"
                  onKeyDown={
                    preventInvalidNumberKeys
                  }
                  onChange={(e) =>
                    updateField(
                      "height",
                      e.target.value
                    )
                  }
                  onBlur={() =>
                    handleBlur("height")
                  }
                  style={inputStyle}
                />

                {formData?.height !== "" &&
                  formData?.height != null && (
                    <Typography
                      sx={{
                        fontSize: "11px",
                        color:
                          theme.palette.text
                            .secondary,
                        flexShrink: 0,
                      }}
                    >
                      cm
                    </Typography>
                  )}
              </Box>
            </Box>

            <ErrorText field="height" />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default PatientProfileSidebar;