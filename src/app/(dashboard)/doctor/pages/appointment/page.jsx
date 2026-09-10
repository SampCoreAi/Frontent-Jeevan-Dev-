"use client";
import React from "react";
import { Box, Grid } from "@mui/material";
import CalendarView from "../../components/CalendarView";
const page = () => {
  return (
   <Box
  sx={{
    width: "100%",
    minHeight: "100vh",
    mt: { xs: 6, sm: 7.5 },
    p: { xs: 1, sm: 2, md: 1 },
    bgcolor: "#f5f7f9",
    overflowX: "hidden",
  }}
>
  <Box
    sx={{
      width: "100%",
      backgroundColor: "white",
      borderRadius: 0.5,
      boxShadow: "0 4px 12px #0f7468",
      overflowX: "auto",
      padding: { xs: 1, sm: 2 },
      boxSizing: "border-box",
    }}
  >
    <CalendarView />
  </Box>
</Box>
  );
};

export default page;
