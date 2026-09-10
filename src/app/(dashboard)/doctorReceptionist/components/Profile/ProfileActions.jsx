"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const ToggleBox = ({ label, description, checked, onChange }) => (
  <Box
    sx={{
      mt: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: 2,
      backgroundColor: "#f5f5f5",
      borderRadius: 2,
    }}
  >
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#153933" }}>
      {label}
      {description && (
        <Typography
          component="span"
          sx={{
            fontSize: 10,
            fontWeight: 400,
            color: "#666",
            display: "block",
            mt: 0.5,
          }}
        >
          {description}
        </Typography>
      )}
    </Typography>

    <Stack direction="row" alignItems="center" spacing={1}>
      {checked ? (
        <VisibilityIcon sx={{ color: "#14b8a6" }} fontSize="small" />
      ) : (
        <VisibilityOffIcon sx={{ color: "#999" }} fontSize="small" />
      )}
      <FormControlLabel
        control={
          <Switch checked={checked} onChange={onChange} color="success" />
        }
        label=""
        sx={{ m: 0 }}
      />
    </Stack>
  </Box>
);

const ProfileActions = ({ onlineVisibility, hideDetails, onToggleVisibility, onToggleHideDetails }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <ToggleBox
        label="Online Visibility"
        description="Show your online status to patients"
        checked={onlineVisibility}
        onChange={onToggleVisibility}
      />
      <ToggleBox
        label="Hide Details"
        description="Hide personal information from public view"
        checked={hideDetails}
        onChange={onToggleHideDetails}
      />
    </Box>
  );
};

export default ProfileActions;