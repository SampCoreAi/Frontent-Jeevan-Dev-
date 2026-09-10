"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid } from "@mui/material";

import DashboardCard from "../../../doctor/components/DashboardContent/CountingCard";
import OnOffCard from "../../../doctor/components/DashboardContent/onOffCard";
import AppointmentCard from "../../../doctor/components/DashboardContent/AppointmentTable";
import FeedbackCard from "../../../doctor/components/DashboardContent/feedbackCard";
import RequestCard from "../../../doctor/components/DashboardContent/requestCard";
import NextPatientCard from "../../../doctor/components/DashboardContent/NextPatientCard";

const DashboardContent = () => {
 

  return (
    <Box
      sx={{
        flexGrow: 1,
        mt: 9,
        px: { xs: 1, sm: 2 },
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: 1,
          p: 2,
          boxShadow: (theme) => `0 4px 12px ${theme.palette.border.third}`,
        }}
      >
        <Grid size={12}>
          <DashboardCard />
        </Grid>

        <Grid size={12}>
          <OnOffCard />
        </Grid>

        {/* ✅ Fixed */}
        <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>
          <Grid size={{ xs: 20, md: 6 }}>
            <AppointmentCard />
          </Grid>

          <Grid size={{ xs: 20, md: 6 }}>
            <NextPatientCard />
          </Grid>
          {/* <Grid size={{ xs: 20, md: 6 }}>
            <RequestCard />
          </Grid> */}
          {/* <Grid size={{ xs: 20, md: 6 }}>
          <FeedbackCard />
        </Grid> */}
        </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardContent;
{/* <Grid size={{ xs: 20, md: 6 }}>
            <RequestCard />
          </Grid> */}