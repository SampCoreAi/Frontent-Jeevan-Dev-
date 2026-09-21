"use client";
import React from "react";
import { Box, Grid, Paper, Typography, useTheme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import GroupsIcon from "@mui/icons-material/Groups";

const PatientCard = ({ dashboardData, selectedMode }) => {
  const theme = useTheme();
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
      icon: <GroupsIcon />,
      title: "Total Patients",
      value: dashboardData?.total_patient || 0,
    },
  ];

  return (
    <Grid container spacing={1.5}>
      {cards.map((item) => (
        <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              minHeight: 82,
              height: "100%",
              p: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: theme.palette.background.paper,
              border: "1px solid #D8DEDC",
              borderRadius: 2,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                boxShadow: theme.shadows[1],
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                minWidth: 44,
                borderRadius: 1.5,
                bgcolor: "#EDF7F2",
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& svg": {
                  fontSize: 22,
                },
              }}
            >
              {item.icon}
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: theme.palette.text.secondary,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: "18px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  color: theme.palette.text.primary,
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