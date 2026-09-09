"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  Button,
} from "@mui/material";
const ProfileDetails = ({ profileData, isEditing, onFieldChange }) => {

  return (
    <Box sx={{ flex: 1, padding: { xs: 2, sm: 3, md: 1 }  }}>
      <Box sx={{backgroundColor:"#f5f5f5" , px:2}}>

      <Typography
        variant="h6"
        fontWeight={600}
        color="#153933"
        marginBottom={1}
        fontSize={{ xs: "1.1rem", sm: "1.25rem" }}
        >
        Short Bio
      </Typography>

      {isEditing ? (
        <TextField
        value={profileData.bio}
        onChange={(e) => onFieldChange('bio', e.target.value)}
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        sx={{ mb: 1 }}
        />
      ) : (
        <Typography
        sx={{
          fontSize: { xs: 14, sm: 16, md: 18 },
          lineHeight: 1.4,
        }}
        color="#7e8180ff"
        marginBottom={1}
        >
          {profileData.bio || "Not Provided"}
        </Typography>
      )}

        </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mt: 2,
        }}
      >
        {/* Left Column - Basic Info */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Language */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, backgroundColor: "#f5f5f5", borderRadius: 1, padding: 1.5, gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600} color="#153933" fontSize={{ xs: "1rem", sm: "1.25rem" }}>
              Language:
            </Typography>
            {isEditing ? (
              <TextField value={profileData.language} onChange={(e) => onFieldChange('language', e.target.value)} variant="outlined" size="small" />
            ) : (
              <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, lineHeight: 1.2, color: "#7e8180" }}>
                {profileData.language}
              </Typography>
            )}
          </Box>
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
    Gender:
  </Typography>

  {isEditing ? (
    <TextField
      select
      value={profileData.gender || ""}
      onChange={(e) => onFieldChange("gender", e.target.value)}
      variant="outlined"
      size="small"
      sx={{
        width: { xs: "120px", sm: "140px" },
        "& .MuiInputBase-input": {
          fontSize: { xs: 13, sm: 14 },
          padding: "7px 10px",
        },
      }}
      SelectProps={{
        native: true,
      }}
    >
      <option value="">Select</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </TextField>
  ) : (
    <Typography
      component="span"
      sx={{
        fontSize: { xs: 14, sm: 16, md: 18 },
        lineHeight: 1.2,
        color: "#7e8180",
      }}
    >
      {profileData.gender}
    </Typography>
  )}
</Box>

          {/* Experience */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, backgroundColor: "#f5f5f5", borderRadius: 1, padding: 1.5, gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600} color="#153933" fontSize={{ xs: "1rem", sm: "1.25rem" }}>
              Experience:
            </Typography>
            {isEditing ? (
              <TextField value={profileData.experience} onChange={(e) => onFieldChange('experience', e.target.value)} variant="outlined" size="small" />
            ) : (
              <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, lineHeight: 1.2, color: "#7e8180" }}>
                {profileData.experience}
              </Typography>
            )}
          </Box>

        
        </Box>

        <Divider orientation="vertical" flexItem sx={{ backgroundColor: "#14b8a6", width: 2 }} />

        {/* Right Column - Contact Info */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Email */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, backgroundColor: "#f5f5f5", borderRadius: 1, padding: 1.5, gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600} color="#153933" fontSize={{ xs: "1rem", sm: "1.25rem" }}>
              Email:
            </Typography>
            <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, lineHeight: 1.2, color: "#7e8180" }}>
              {profileData.email || "Not Provided"}
            </Typography>
          </Box>

          {/* Phone Number */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, backgroundColor: "#f5f5f5", borderRadius: 1, padding: 1.5, gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600} color="#153933" fontSize={{ xs: "1rem", sm: "1.25rem" }}>
              Age:
            </Typography>
            <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, lineHeight: 1.2, color: "#7e8180" }}>
              {isEditing ? (
    <TextField
        value={profileData.age}
        onChange={(e) => onFieldChange("age", e.target.value)}
        size="small"
    />
) : (
    <Typography>
        {profileData.age || "Not Provided"}
    </Typography>
)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, backgroundColor: "#f5f5f5", borderRadius: 1, padding: 1.5, gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600} color="#153933" fontSize={{ xs: "1rem", sm: "1.25rem" }}>
              Phone Number:
            </Typography>
            <Typography component="span" sx={{ fontSize: { xs: 14, sm: 16, md: 18 }, lineHeight: 1.2, color: "#7e8180" }}>
              {profileData.phone || "Not Provided"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileDetails;