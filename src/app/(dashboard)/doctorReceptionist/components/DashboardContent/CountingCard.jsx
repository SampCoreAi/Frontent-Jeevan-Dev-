import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "@mui/material/styles";

const DashboardCard = () => {
  const theme = useTheme();
  const card = theme.palette.background.card;
  const text = theme.palette.text.primary;
  const cards = [
    {
      icon: <PersonIcon sx={{ fontSize: 70 }} />,
      title: "Today Appointment",
      value: 85,
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 70 }} />,
      title: "Today Completed",
      value: 85,
    },
    {
      icon: <PendingIcon sx={{ fontSize: 70 }} />,
      title: "Today Pending",
      value: 85,
    },
    {
      icon: <CancelIcon sx={{ fontSize: 70 }} />,
      title: "Today Cancel",
      value: 85,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ width: "100%" }}>
      {cards.map((item, index) => (
        <Grid
          item
          key={index}
          xs={12}
          sm={6}
          md={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 0.5,
              backgroundColor: card,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              border: "1px solid #0f7468",
              gap: 2,
              width: { xs: "90%", sm: 240, md: 270 },
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Grid sx={{ color: text }}>{item.icon}</Grid>
            <Grid>
              <Typography
                sx={{ fontSize: 20, fontWeight: 700, mt: 1, width: 150 }}
              >
                {item.title}
              </Typography>
              <Typography variant="h5">{item.value}</Typography>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCard;
