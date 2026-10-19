import React from "react";
import { Grid } from "@mui/material";
import Appointment from "../../../doctor/components/CalendarView";
const page = () => {
  return (
    <Grid
      sx={{
        marginTop: 8,
      }}
    >
      <Grid
        container
        sx={{
          backgroundColor: "white",
          borderRadius: 0.5,
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
