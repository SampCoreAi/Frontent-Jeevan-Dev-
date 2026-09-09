"use client";

import React from "react";

import { Grid, Paper, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";

const DashboardCard = ({ stats = {} }) => {
 const theme = useTheme();
  const cardBg = theme.palette.background.third;
  const text = theme.palette.text.primary;


 const cards = [
    {
      icon: <PersonIcon />,
      title: "Today Appointment",
      value: stats.today_appointments ?? 0,
    },
    {
      icon: <CheckCircleIcon />,
      title: "Today Completed",
      value: stats.today_completed ?? 0,
    },
    {
      icon: <PendingIcon />,
      title: "Today Pending",
      value: stats.today_pending ?? 0,
    },
    {
      icon: <CancelIcon />,
      title: "Today Cancel",
      value: stats.today_cancelled ?? 0,
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((item, index) => (
      <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              borderRadius: 2,
              backgroundColor: cardBg,
              border: "1px solid #0f7468",
              height: "100%",
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
              <Typography fontWeight={700}>
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 26,
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

export default DashboardCard;