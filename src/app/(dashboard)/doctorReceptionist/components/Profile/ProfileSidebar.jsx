"use client";

import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Rating,
  Chip,
  TextField,
  Button,
} from "@mui/material";

const ProfileSidebar = ({
  profileImage,
  profileData,
  isEditing,
  editingChip,
  onImageUpload,
  onImageRemove,
  onChipEdit,
  onChipSave,
  onFieldChange,
}) => {
  const infoBoxBg = "#f5f5f5";
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
        position: "relative",
      }}
    >
      {/* Profile Image */}
      <Box sx={{ position: "relative", mb: { xs: 2, md: 3 } }}>
        <Avatar
          src={profileImage}
          alt="Doctor"
          variant="square"
          sx={{
            width: { xs: 150, sm: 180, md: 200 },
            height: { xs: 170, sm: 200, md: 230 },
            borderRadius: 2,
            border: "4px solid #14b8a6",
          }}
        />

        {/* Image Upload/Remove Buttons */}
        {isEditing && (
          <Box sx={{
            position: "absolute",
            bottom: 8,
            right: 8,
            display: "flex",
            gap: 1
          }}>
            <input
              type="file"
              id="upload-image"
              style={{ display: "none" }}
              accept="image/*"
              onChange={onImageUpload}
            />
            <Button
              variant="contained"
              component="span"
              onClick={() => document.getElementById("upload-image").click()}
              size="small"
              sx={{
                backgroundColor: "#14b8a6",
                "&:hover": { backgroundColor: "#0f7468" },
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.7rem",
                minWidth: "auto",
                padding: "4px 8px",
              }}
            >
              Upload
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={onImageRemove}
              sx={{
                backgroundColor: "#ff4444",
                "&:hover": { backgroundColor: "#cc0000" },
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.7rem",
                minWidth: "auto",
                padding: "4px 8px",
              }}
            >
              Remove
            </Button>
          </Box>
        )}
      </Box>

      {/* Name */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: infoBoxBg,
          borderRadius: 1,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"
          sx={{ minWidth: 90 }}
        >
          Full Name:
        </Typography>

        <Typography color="#7e8180">
          {profileData.name}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: infoBoxBg,
          borderRadius: 1,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"
          sx={{ minWidth: 90 }}
        >
          Specialist:
        </Typography>

        {isEditing ? (
          <TextField
   value={profileData.department}
onChange={(e) => onFieldChange("department", e.target.value)}
            size="small"
            fullWidth
            onBlur={onChipSave}
          />
        ) : (
          <Typography color="#7e8180">
            {profileData.chipLabel}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: infoBoxBg,
          borderRadius: 1,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography
          fontWeight={600}
          color="#153933"
          sx={{ minWidth: 90 }}
        >
          Qualification:
        </Typography>

       
        {isEditing ? (
  <TextField
    value={profileData.education}
    onChange={(e) => onFieldChange("education", e.target.value)}
    size="small"
    fullWidth
  />
) : (
  <Typography color="#7e8180">
    {profileData.education}
  </Typography>
)}
      </Box>



    </Box>
  );
};

export default ProfileSidebar;