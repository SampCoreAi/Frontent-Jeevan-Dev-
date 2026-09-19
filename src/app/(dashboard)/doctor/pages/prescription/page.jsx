"use client";

import React from "react";
import { Grid } from "@mui/material";
import Prescription from "../../components/Prescription/Prescription";

const Page = () => {
  return (
    <Grid
      sx={{
        padding: {
          xs: 0,
          sm: 1,
        },

        marginTop: {
          xs: 8,
          sm: 7.5,
        },

        width: "100%",
        maxWidth: "100%",
        minWidth: 0,

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          backgroundColor: "white",

          borderRadius: {
            xs: 0,
            sm: 0.5,
          },

          boxShadow: {
            xs: "none",
            sm: "0 4px 12px #0f7468",
          },

          width: "100%",
          maxWidth: "100%",
          minWidth: 0,

          boxSizing: "border-box",

          overflowX: "hidden",

          display: "flex",

          height: "100%",

          justifyContent: "center",
          alignItems: "center",

          padding: {
            xs: 0,
            sm: 2,
          },
        }}
      >
        <Prescription />
      </Grid>
    </Grid>
  );
};

export default Page;