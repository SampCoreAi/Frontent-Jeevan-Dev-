"use client";
import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";

const DashboardCard = () => {
  const theme = useTheme();
  const cardBg = theme.palette.background.third;
  const text = theme.palette.text.primary;

  const cards = [
    { icon: <PersonIcon />, title: "Upcoming Apointment", value: 1 },
    { icon: <CheckCircleIcon />, title: "Today Completed", value: 85 },
    { icon: <PendingIcon />, title: "Today Pending", value: 85 },
    { icon: <CancelIcon />, title: "Today Cancel", value: 85 },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((item, index) => (
        <Grid
          key={index}
          size={{ xs: 12, sm: 6, md: 3 }}  >
          <Paper
            sx={{
              p: 2,
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
            {/* Icon */}
            <Box
              sx={{
                fontSize: { xs: 40, sm: 50, md: 60 },
                color: text,
                display: "flex",
              }}
            >
              {item.icon}
            </Box>

            {/* Text */}
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

export default DashboardCard;