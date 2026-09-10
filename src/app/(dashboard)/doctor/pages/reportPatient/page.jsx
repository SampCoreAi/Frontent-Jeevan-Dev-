import React from "react";
import ReportPatient from "../../components/ReportPatient";
import { Grid } from "@mui/material";
const page = () => {
  return (
    <Grid
      sx={{
        padding: { xs: 0, sm: 3 },
        marginTop: 4,
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
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
        }}
      >
        <ReportPatient />
      </Grid>
    </Grid>
  );
};

export default page;
