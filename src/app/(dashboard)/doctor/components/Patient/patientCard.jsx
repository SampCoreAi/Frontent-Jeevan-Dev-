"use client";

import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";

const PatientCard = ({ dashboardData, selectedMode }) => {
  const theme = useTheme();

  const cardBg = theme.palette.background.third;
  const text = theme.palette.text.primary;
const isOnline = selectedMode === "online";

const cards = [
  {
    icon: <PersonIcon />,
    title: isOnline ? "Online Patients" : "Offline Patients",
    value: isOnline
      ? dashboardData?.online_patient || 0
      : dashboardData?.offline_patient || 0,
  },
  {
    icon: <PendingIcon />,
    title: isOnline ? "Online Pending" : "Offline Pending",
    
    value: isOnline
    ? dashboardData?.online_pending || 0
    : dashboardData?.offline_pending || 0,
  },
  {
    icon: <CheckCircleIcon />,
    title: isOnline ? "Online Completed" : "Offline Completed",
    value: isOnline
    ? dashboardData?.online_complete || 0
    : dashboardData?.offline_complete || 0,
  },
  {
    icon: <CancelIcon />,
    title: "Total Patients",
    value: dashboardData?.total_patient || 0,
  },
];

  return (
    <Grid container spacing={2}>
      {cards.map((item, index) => (
        <Grid
          key={index}
          size={{ xs: 12, sm: 6, lg: 3 }}
        >
          <Paper
            sx={{
              p: { xs: 1, sm: 2 },
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 2,
              backgroundColor: cardBg,
              border: "1px solid #0f7468",
              transition: "0.3s",
              height: "100%",

              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                fontSize: { xs: 40, sm: 50, md: 60 },
                color: text,
                display: "flex",
              }}
            >
              {item.icon}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: { xs: 14, sm: 16, md: 18 },
                  fontWeight: 700,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 20, sm: 22, md: 26 },
                  fontWeight: 600,
                }}
              >
                {item.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PatientCard;