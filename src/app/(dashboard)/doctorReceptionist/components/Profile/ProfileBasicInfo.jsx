"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const ProfileBasicInfo = ({ profileData, isEditing, onFieldChange, onLicenseUpload }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {/* Language */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          padding: 1.5,
          gap: 1.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          color="#153933"
          fontSize={{ xs: "1rem", sm: "1.25rem" }}
        >
          Language:
        </Typography>
        {isEditing ? (
          <TextField
            value={profileData.language}
            onChange={(e) => onFieldChange('language', e.target.value)}
            variant="outlined"
            size="small"
          />
        ) : (
          <Typography
            component="span"
            sx={{
              fontSize: { xs: 14, sm: 16, md: 18 },
              lineHeight: 1.2,
              color: "#7e8180"
            }}
          >
            {profileData.language}
          </Typography>
        )}
      </Box>

      {/* Experience */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          backgroundColor: "#f5f5f5",
          borderRadius: 1,
          padding: 1.5,
          gap: 1.5,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          color="#153933"
          fontSize={{ xs: "1rem", sm: "1.25rem" }}
        >
          Experience:
        </Typography>
        {isEditing ? (
          <TextField
            value={profileData.experience}
            onChange={(e) => onFieldChange('experience', e.target.value)}
            variant="outlined"
            size="small"
          />
        ) : (
          <Typography
            component="span"
            sx={{
              fontSize: { xs: 14, sm: 16, md: 18 },
              lineHeight: 1.2,
              color: "#7e8180"
            }}
          >
            {profileData.experience}
          </Typography>
        )}
      </Box>

     
    </Box>
  );
};

export default ProfileBasicInfo;