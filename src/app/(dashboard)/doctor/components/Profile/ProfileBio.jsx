"use client";

import React from "react";

import {
  Box,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const ProfileBio = ({
  profileData,
  isEditing,
  onFieldChange,
}) => {
  return (
    <Box
      sx={{
        width: "100%",

        minHeight: "46px",

        display: "flex",
        alignItems: isEditing
          ? "flex-start"
          : "center",

        gap: "10px",

        px: "12px",
        py: "8px",

        bgcolor: "#f7f9f9",

        border: "1px solid",
        borderColor: "divider",

        borderRadius: "8px",
      }}
    >
      <Box
        sx={{
          width: "28px",
          height: "28px",

          flexShrink: 0,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "7px",

          bgcolor: "secondary.light",
          color: "primary.main",
        }}
      >
        <PersonOutlineIcon
          sx={{
            fontSize: "16px",
          }}
        />
      </Box>

      <Typography
        sx={{
          width: "105px",
          minWidth: "105px",

          mt: isEditing
            ? "7px"
            : 0,

          fontSize: "12.5px",
          fontWeight: 650,

          color: "text.primary",
        }}
      >
        Short Bio
      </Typography>

      {isEditing ? (
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          size="small"
          value={
            profileData?.bio || ""
          }
          placeholder="Write a short bio..."
          onChange={(event) =>
            onFieldChange?.(
              "bio",
              event.target.value
            )
          }
          sx={{
            flex: 1,

            "& .MuiInputBase-root": {
              fontSize: "12.5px",

              borderRadius: "7px",

              bgcolor:
                "background.paper",
            },

            "& .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "divider",
              },

            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              {
                borderColor:
                  "primary.light",
              },

            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor:
                  "primary.main",

                borderWidth: "1px",
              },
          }}
        />
      ) : (
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,

            fontSize: "12.5px",
            lineHeight: 1.45,

            color: profileData?.bio
              ? "text.secondary"
              : "text.disabled",
          }}
        >
          {profileData?.bio ||
            "No bio provided"}
        </Typography>
      )}
    </Box>
  );
};

export default ProfileBio;