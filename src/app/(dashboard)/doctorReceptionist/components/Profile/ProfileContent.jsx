"use client";

import React from "react";
import { Box } from "@mui/material";

const ProfileContent = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        mt: { xs: 2, sm: 3, md: 4 },
        mb: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ProfileContent;