"use client";

import React from "react";
import { Box, Divider, TextField, Typography } from "@mui/material";

const displayDate = (value) => {
  if (!value) return "Not Provided";

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN");
};

function InfoRow({ label, children }) {
  return (
    <Box
      sx={{
        minHeight: 48,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        px: 1.5,
        py: 1,
        bgcolor: "#f5f7f6",
        borderRadius: 1.5,
      }}
    >
      <Typography
        component="span"
        sx={{ fontSize: 13, fontWeight: 600, color: "#153933" }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

const valueStyle = {
  fontSize: 13,
  color: "#64748b",
};

export default function ProfileDetails({
  profileData,
  errors = {},
  isEditing,
  onFieldChange,
}) {
  return (
    <Box sx={{ flex: 1, p: { xs: 1, sm: 2, md: 1 }, fontSize: 13 }}>
      <Box sx={{ p: 1.5, bgcolor: "#f5f7f6", borderRadius: 1.5 }}>
        <Typography
          sx={{ mb: 1, fontSize: 13, fontWeight: 600, color: "#153933" }}
        >
          Short Bio
        </Typography>

        {isEditing ? (
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            value={profileData.bio || ""}
            onChange={(event) => onFieldChange("bio", event.target.value)}
            sx={{ "& .MuiInputBase-root": { fontSize: 13 } }}
          />
        ) : (
          <Typography sx={valueStyle}>
            {profileData.bio || "Not Provided"}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mt: 2,
        }}
      >
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <InfoRow label="Language:">
            {isEditing ? (
              <TextField
                size="small"
                value={profileData.language || ""}
                onChange={(event) =>
                  onFieldChange("language", event.target.value)
                }
                placeholder="Hindi, English"
                sx={{
                  flex: 1,
                  minWidth: 120,
                  "& .MuiInputBase-root": { fontSize: 13 },
                }}
              />
            ) : (
              <Typography sx={valueStyle}>
                {profileData.language || "Not Provided"}
              </Typography>
            )}
          </InfoRow>

          <InfoRow label="Gender:">
            {isEditing ? (
              <TextField
                select
                native
                size="small"
                value={profileData.gender || ""}
                onChange={(event) =>
                  onFieldChange("gender", event.target.value)
                }
                sx={{
                  minWidth: 120,
                  "& .MuiInputBase-root": { fontSize: 13 },
                }}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </TextField>
            ) : (
              <Typography sx={valueStyle}>
                {profileData.gender || "Not Provided"}
              </Typography>
            )}
          </InfoRow>

          <InfoRow label="Experience:">
            {isEditing ? (
              <TextField
                type="number"
                size="small"
                value={profileData.experience ?? ""}
                onChange={(event) =>
                  onFieldChange("experience", event.target.value)
                }
                error={Boolean(errors.experience)}
                helperText={errors.experience || ""}
                inputProps={{ min: 0 }}
                sx={{
                  width: 130,
                  "& .MuiInputBase-root, & .MuiFormHelperText-root": {
                    fontSize: 13,
                  },
                }}
              />
            ) : (
              <Typography sx={valueStyle}>
                {profileData.experience ?? 0}
              </Typography>
            )}
          </InfoRow>
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", md: "block" },
            borderColor: "#14b8a6",
          }}
        />

        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
          <InfoRow label="Email:">
            <Typography sx={valueStyle}>
              {profileData.email || "Not Provided"}
            </Typography>
          </InfoRow>

          <InfoRow label="Date of Birth:">
            {isEditing ? (
              <TextField
                type="date"
                size="small"
                value={profileData.dob || ""}
                onChange={(event) => onFieldChange("dob", event.target.value)}
                error={Boolean(errors.dob)}
                helperText={errors.dob || ""}
                inputProps={{
                  max: new Date().toISOString().slice(0, 10),
                }}
                sx={{
                  "& .MuiInputBase-root, & .MuiFormHelperText-root": {
                    fontSize: 13,
                  },
                }}
              />
            ) : (
              <Typography sx={valueStyle}>
                {displayDate(profileData.dob)}
              </Typography>
            )}
          </InfoRow>

          <InfoRow label="Phone Number:">
            <Typography sx={valueStyle}>
              {profileData.phone || "Not Provided"}
            </Typography>
          </InfoRow>
        </Box>
      </Box>
    </Box>
  );
}