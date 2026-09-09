import React from "react";
import { Grid } from "@mui/material";
import Appointment from "../../../doctor/components/CalendarView";
const page = () => {
  return (
    <Grid
      sx={{
        padding: { xs: 0, sm: 1 },
        marginTop: 7,
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: "white",
          borderRadius: 0.5,
          boxShadow: "0 4px 12px #0f7468",
          overflow: "hidden",
        
          display: "flex",
          height: "100%",
          padding: 1,
        }}
      >
        <Appointment />
      </Grid>
    </Grid>
  );
};

export default page;
