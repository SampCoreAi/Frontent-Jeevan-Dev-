"use client";
import React from "react";
import { Grid, Divider } from "@mui/material";
import FeedbackCard from "./feedbackCard";
import FeedbackList from "../../../doctor/components/feedback/FeedBackCard";


const FeedbackContent = () => {
  return (
    <Grid
      sx={{
        flex: 1,
        display: "flex",
        mt: 4,
        width: { xs: 320, sm: "100%" },
        flexDirection: "column",
        p: { xs: 1, sm: 3 }
      }}
    >
      <Grid
        container
        spacing={2}
        mb={2}
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          boxShadow: "0 4px 12px #0f7468",
          overflow: "hidden",
          display: "flex",
          p: 2,
          pt: 5,
        }}
      >
        <FeedbackCard />
        <Divider
          sx={{ my: 1, backgroundColor: "#0f7468", width: "100%", height: 3 }}
        />
      
      
        <FeedbackList />
        <Divider
          sx={{ my: 1, backgroundColor: "#0f7468", width: "100%", height: 3 }}
        />
      
      </Grid>
    </Grid>
  );
};

export default FeedbackContent;
