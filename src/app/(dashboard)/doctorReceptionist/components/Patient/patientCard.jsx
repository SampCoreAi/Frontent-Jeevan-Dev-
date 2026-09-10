import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import StarPurple500OutlinedIcon from "@mui/icons-material/StarPurple500Outlined";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";

const PatientCard = () => {
  const feedbackStats = [
    {
      title: "Average Rating",
      value: "4.4",
      icon: <ThumbsUpDownIcon sx={{ fontSize: { xs: 50, sm: 60, md: 70 } }} />,
      extraIcon: (
        <StarPurple500OutlinedIcon
          sx={{ fontSize: 20, ml: 1, color: "#ff9800" }}
        />
      ),
    },
    {
      title: "Total Patients",
      value: "100",
      icon: <GradingOutlinedIcon sx={{ fontSize: { xs: 50, sm: 60, md: 70 } }} />,
    },
    {
      title: "Total Happy",
      value: "65",
      icon: (
        <ThumbUpAltOutlinedIcon sx={{ fontSize: { xs: 50, sm: 60, md: 70 } }} />
      ),
    },
    {
      title: "Negative",
      value: "20",
      icon: (
        <ThumbDownOffAltOutlinedIcon
          sx={{ fontSize: { xs: 50, sm: 60, md: 70 } }}
        />
      ),
    },
  ];

  return (
    <Grid container spacing={2}>
      {feedbackStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={6} lg={3} key={index}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              backgroundColor: "#e6f6ed",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap", // wrap content on smaller screens
              color: "#0f7468",
              border: "1px solid #0f7468",
              height: "100%", // ensure equal height if needed
            }}
          >
            {stat.icon}
            <Grid sx={{ ml: 2, flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: 16, sm: 18, md: 20 },
                  fontWeight: 700,
                  mb: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {stat.title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: { xs: 18, sm: 20, md: 24 },
                }}
              >
                {stat.value}
                {stat.extraIcon}
              </Typography>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PatientCard;
