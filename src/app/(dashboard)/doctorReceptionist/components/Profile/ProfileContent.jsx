"use client";

import React from "react";
import { Box, Typography, Divider } from "@mui/material";

const ProfileContent = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        mt: 7,
        padding: { xs: 1, sm: 2, md: 1 }
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: "0 4px 12px #0f7468",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          height: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ProfileContent;