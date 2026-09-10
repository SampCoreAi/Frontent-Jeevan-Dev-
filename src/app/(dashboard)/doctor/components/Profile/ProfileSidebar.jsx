"use client";

import React, { useState, useRef, useEffect } from "react";
import {

  Typography,
  Rating,

  TextField,
  Box,
  useTheme,
  useMediaQuery,

  Switch,
  FormControlLabel,

  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import api from "../../services/api";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { InputAdornment } from "@mui/material";
const ProfileSidebar = ({
  profileData,
  isEditing,
  editingChip,
  onFieldChange,
  onChipClick,
  onChipSave,
  onRatingChange,
  onOnlineVisibilityChange,
  onAvatarChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const fileInputRef = useRef(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showFolder, setShowFolder] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setLocalUser(user);
    } catch {
      setLocalUser({});
    }
    setIsHydrated(true); // ✅ Mark as hydrated after reading localStorage
  }, []);

  // Display values — API data priority, localStorage fallback (only after hydration)
  const displayName = isHydrated
    ? (profileData.name ||
      localUser?.name ||
      localUser?.full_name ||
      "Doctor")
    : (profileData.name || "Doctor"); // ✅ Use only profileData during hydration

  const avatarInitial = (displayName && displayName !== 'Doctor') ? displayName.charAt(0).toUpperCase() : 'D';

  // ✅ FIXED: Removed `if (!isEditing) return;` — card ab hamesha flip hoga
  const handleAvatarFlip = () => {
    setShowFolder((prev) => !prev);
  };

  const handleCameraClick = (event) => {
    if (!isEditing) return;
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateAvatar = () => {
    handleMenuClose();
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    handleMenuClose();
    if (onAvatarChange) {
      onAvatarChange(null);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
    event.target.value = null;
  };
  useEffect(() => {
    const username = profileData.username?.replace(/^@/, "").trim();

    if (!isEditing || !username) {
      setUsernameAvailable(null);
      setUsernameMessage("");
      return;
    }

    // optional: very short usernames par API call mat karo
    if (username.length < 3) {
      setUsernameAvailable(false);
      setUsernameMessage("Username must be at least 3 characters");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setCheckingUsername(true);

        const response = await api.get("/api/doctors/check-username", {
          params: {
            username,
          },
        });

        setUsernameAvailable(response.data.available);
        setUsernameMessage(response.data.message);
      } catch (error) {
        console.error("Username check error:", error);

        setUsernameAvailable(null);
        setUsernameMessage(
          error.response?.data?.message || "Unable to check username"
        );
      } finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [profileData.username, isEditing]);
  return (
    <Box
      sx={{
        width: { xs: "100%", lg: 320 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: { xs: 2, sm: 3, md: 4 },
        borderRight: { xs: "none", lg: "1px solid #e0e0e0" },
        borderBottom: { xs: "1px solid #e0e0e0", lg: "none" },
        backgroundColor: "#fbfdfc",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Profile Card Flip */}
      <Box
        sx={{
          perspective: "1000px",
          position: "relative",
          mb: 3,
        }}
      >
        <Box
          onClick={handleAvatarFlip} // ✅ Always clickable now
          sx={{
            width: { xs: 150, sm: 180, md: 200 },
            height: { xs: 170, sm: 200, md: 230 },
            position: "relative",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: showFolder ? "rotateY(180deg)" : "rotateY(0deg)",
            cursor: "pointer", // ✅ Always pointer cursor
          }}
        >
          {/* Front — Image ya Initial Letter */}
          {profileData.avatarUrl ? (
            <img
              src={profileData.avatarUrl}
              alt="profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                border: "4px solid #14b8a6",
                borderRadius: "4px",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                border: "4px solid #14b8a6",
                borderRadius: 1,
                backfaceVisibility: "hidden",
                backgroundColor: "#14b8a6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                suppressHydrationWarning  // ← Add this line
                sx={{
                  fontSize: { xs: "4rem", sm: "5rem", md: "6rem" },
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {avatarInitial}
              </Typography>
            </Box>
          )}

          {/* Back */}
          <Box
            component="img"
            src={profileData.qrCode || null}
            sx={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              border: "4px solid #14b8a6",
              borderRadius: 1,
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              objectFit: "cover",
            }}
          />
        </Box>

        {/* Camera Icon — only in editing mode */}
        {isEditing && (
          <IconButton
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "#14b8a6",
              color: "white",
              "&:hover": { backgroundColor: "#0d9488" },
            }}
            onClick={(e) => {
              e.stopPropagation(); // ✅ Camera click card flip trigger nahi karega
              handleCameraClick(e);
            }}
            size="small"
          >
            <CameraAltIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Avatar Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleUpdateAvatar}>
          Update Profile Picture
        </MenuItem>

        {profileData.image && (
          <MenuItem onClick={handleRemoveAvatar} sx={{ color: "error.main" }}>
            Remove Profile Picture
          </MenuItem>
        )}
      </Menu>

      {/* Name */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          alignItems: "center",
          gap: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"

          fontSize={{ xs: "1rem", sm: "1.15rem" }}
        >
          Name:
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 14, sm: 16 },
            color: "#7e8180",
          }}
        >
          {displayName}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          gap: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"
          fontSize={{ xs: "1rem", sm: "1.15rem" }}
        >
          Username:
        </Typography>

        {isEditing ? (
          <TextField
            size="small"
            value={profileData.username?.replace(/^@/, "") || ""}
            onChange={(e) => {
              const value = e.target.value.replace(/^@/, "");

              onFieldChange("username", value);

              // old result immediately hata do
              setUsernameAvailable(null);
              setUsernameMessage("");
            }}
            error={usernameAvailable === false}
            helperText={
              checkingUsername
                ? "Checking username..."
                : usernameMessage
            }
FormHelperTextProps={{
  sx: {
    color: checkingUsername
      ? "#000 !important"
      : usernameAvailable === true
        ? "green !important"
        : usernameAvailable === false
          ? "red !important"
          : "#000 !important",
  },
}}
            InputProps={{

              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    "& .MuiTypography-root": {
                      color: "#000",
                    },
                  }}
                >
                  @
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: "#7e8180",
            }}
          >
            {profileData.username
              ? `@${profileData.username.replace(/^@/, "")}`
              : "Not provided"}
          </Typography>
        )}
      </Box>
      {/* Specialist Chip */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          gap: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"
          fontSize={{ xs: "1rem", sm: "1.15rem" }}
        >
          Specialist:
        </Typography>

        {isEditing ? (
          <TextField
            size="small"
            value={profileData.chipLabel || ""}
            onChange={(e) => onFieldChange("chipLabel", e.target.value)}
            placeholder="Enter specialization"
            onBlur={onChipSave}
          />
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: "#7e8180",
            }}
          >
            {profileData.chipLabel || "Not provided"}
          </Typography>
        )}
      </Box>
      {/* Qualification */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          gap: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"
          fontSize={{ xs: "1rem", sm: "1.15rem" }}
        >
          Qualification:
        </Typography>

        {isEditing ? (
          <TextField
            size="small"
            value={profileData.qualification || ""}
            onChange={(e) => onFieldChange("qualification", e.target.value)}
            placeholder="Enter qualification"
          />
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16 },
              color: "#7e8180",
            }}
          >
            {profileData.qualification || "Not provided"}
          </Typography>
        )}
      </Box>

      {/* Age */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          gap: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          color="#153933"
          fontSize={{ xs: "1rem", sm: "1.25rem" }}
        >
          Age:
        </Typography>

        {isEditing ? (
          <TextField
            value={profileData.age || ""}
            placeholder="Enter age"
            type="number"
            size="small"
            onChange={(e) => onFieldChange("age", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#153933",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1D9E75",
                  borderWidth: "2px",
                },
              },
            }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16, md: 18 },
              color: "#7e8180",
            }}
          >
            {profileData.age || "Not provided"}
          </Typography>
        )}
      </Box>
      {/* Gender */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          gap: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          color="#153933"

          fontSize={{ xs: "1rem", sm: "1.25rem" }}
        >
          Gender:
        </Typography>

        {isEditing ? (
          <TextField
            select
            value={profileData.gender || ""}
            size="small"
            onChange={(e) => onFieldChange("gender", e.target.value)}
            sx={{
              minWidth: 150,
              "& .MuiOutlinedInput-root": {
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#153933",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#1D9E75",
                  borderWidth: "2px",
                },
              },
            }}
          >
           <MenuItem value="">Select Gender</MenuItem>
<MenuItem value="MALE">Male</MenuItem>
<MenuItem value="FEMALE">Female</MenuItem>
<MenuItem value="OTHER">Other</MenuItem>
          </TextField>
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 16, md: 18 },
              color: "#7e8180",
            }}
          >
            {profileData.gender || "Not provided"}
          </Typography>
        )}
      </Box>
      {/* Rating */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          gap: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography fontWeight={600}>Rating:</Typography>

        <Rating
          value={profileData.rating || 0}
          precision={0.5}
          readOnly
          size={isMobile ? "small" : "medium"}
        />
      </Box>
      {/* Accept Emergency Patient */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          p: 1.5,
          width: "100%",
          mb: 1,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"
          fontSize={{ xs: "1rem", sm: "1.15rem" }}
        >
          Accept Emergency Patient:
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(profileData.accept_emergency_patients)}
              disabled={!isEditing}
              onChange={(e) =>
                onFieldChange(
                  "accept_emergency_patients",
                  e.target.checked
                )
              }
            />
          }
          label={
            profileData.accept_emergency_patients ? "Yes" : "No"
          }
          labelPlacement="start"
        />
      </Box>

    </Box>
  );
};

export default ProfileSidebar;