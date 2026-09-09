"use client";

import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const ProfileActions = ({ isEditing, onUpdateClick, onSaveClick }) => {
  return (
    <>
      <Divider
        sx={{
          marginY: 3,
          borderColor: "#12a292",
          height: { xs: 2, sm: 4 },
        }}
      />

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 1, sm: 2 },
          marginTop: 1,
        }}
      >
        <Box
          sx={{
            border: "1px solid black",
            width: { xs: 100, sm: 120 },
            textAlign: "center",
            borderRadius: 1,
            py: { xs: 0.5, sm: 1 },
            px: { xs: 1, sm: 2 },
            backgroundColor: "#e6f6ed",
            cursor: "pointer",
          }}
          onClick={isEditing ? onSaveClick : onUpdateClick}
        >
          <Typography fontSize={{ xs: "0.75rem", sm: "0.875rem" }}>
            {isEditing ? "Save" : "Update"}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ProfileActions;
