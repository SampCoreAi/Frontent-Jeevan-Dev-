"use client";

import React from "react";
import { Typography, TextField, Box } from "@mui/material";

const ProfileBio = ({ profileData, isEditing, onFieldChange }) => {
  return (
    
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
        marginBottom={1}
        fontSize={{ xs: "1.1rem", sm: "1.25rem" }}
      >
        Short Bio : 
      </Typography>

      {isEditing ? (
        <TextField
          value={profileData.bio}
          placeholder={!profileData.bio ? "Write a short bio..." : ""}
          onChange={(e) => onFieldChange("bio", e.target.value)}
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          sx={{
            mb: 1,
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#153933",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#1D9E75",
                borderWidth: "2px",
              },
              "& textarea::placeholder": {
                color: "#999",
                opacity: 1,
              },
            },
          }}
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
          {profileData.bio || "No bio provided"}
        </Typography>
      )}
      
       </Box>


  );
};

export default ProfileBio;
