"use client";

import React from "react";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const infoBoxBg = "#f5f7f6";

function SidebarRow({ label, children }) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 44,
        p: 1.25,
        mb: 1.25,
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: infoBoxBg,
        borderRadius: 1.5,
      }}
    >
      <Typography
        sx={{
          minWidth: 90,
          fontSize: 13,
          fontWeight: 600,
          color: "#153933",
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function ProfileSidebar({
  profileImage,
  profileData,
  isEditing,
  onImageUpload,
  onImageRemove,
  onFieldChange,
}) {
  return (
    <Box
      sx={{
        width: { xs: "100%", lg: 320 },
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#fbfdfc",
        borderRight: { xs: "none", lg: "1px solid #e0e7e4" },
        borderBottom: { xs: "1px solid #e0e7e4", lg: "none" },
        fontSize: 13,
      }}
    >
      <Box sx={{ position: "relative", mb: 2 }}>
        <Avatar
          src={profileImage}
          alt="Profile"
          variant="rounded"
          sx={{
            width: { xs: 140, sm: 160 },
            height: { xs: 150, sm: 170 },
            border: "2px solid #14b8a6",
            bgcolor: "#eef8f5",
          }}
        />

        {isEditing && (
          <Box
            sx={{
              position: "absolute",
              right: 6,
              bottom: 6,
              display: "flex",
              gap: 0.75,
            }}
          >
            <Button
              component="label"
              size="small"
              variant="contained"
              sx={{
                minWidth: 0,
                px: 1,
                fontSize: 13,
                textTransform: "none",
                bgcolor: "#07876a",
              }}
            >
              Upload
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={onImageUpload}
              />
            </Button>

            <Button
              size="small"
              variant="contained"
              onClick={onImageRemove}
              sx={{
                minWidth: 0,
                px: 1,
                fontSize: 13,
                textTransform: "none",
                bgcolor: "#dc3545",
              }}
            >
              Remove
            </Button>
          </Box>
        )}
      </Box>

      <SidebarRow label="Full Name:">
        <Typography sx={{ fontSize: 13, color: "#64748b" }}>
          {profileData.name || "Not Provided"}
        </Typography>
      </SidebarRow>

      <SidebarRow label="Specialist:">
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={profileData.department || ""}
            onChange={(event) =>
              onFieldChange("department", event.target.value)
            }
            sx={{ "& .MuiInputBase-root": { fontSize: 13 } }}
          />
        ) : (
          <Typography sx={{ fontSize: 13, color: "#64748b" }}>
            {profileData.department || "Not Provided"}
          </Typography>
        )}
      </SidebarRow>

      <SidebarRow label="Qualification:">
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={profileData.education || ""}
            onChange={(event) =>
              onFieldChange("education", event.target.value)
            }
            sx={{ "& .MuiInputBase-root": { fontSize: 13 } }}
          />
        ) : (
          <Typography sx={{ fontSize: 13, color: "#64748b" }}>
            {profileData.education || "Not Provided"}
          </Typography>
        )}
      </SidebarRow>
    </Box>
  );
}