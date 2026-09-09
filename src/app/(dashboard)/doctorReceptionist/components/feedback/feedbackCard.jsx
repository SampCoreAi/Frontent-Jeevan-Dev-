import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import StarPurple500OutlinedIcon from "@mui/icons-material/StarPurple500Outlined";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";

const feedbackCard = () => {
  const feedbackStats = [
    {
      title: "Average Rating",
      value: "4.4",
      icon: <ThumbsUpDownIcon sx={{ fontSize: 70 }} />,
      extraIcon: <StarPurple500OutlinedIcon sx={{ fontSize: 20, ml: 1 }} />,
    },
    {
      title: "Total Feedback",
      value: "100",
      icon: <GradingOutlinedIcon sx={{ fontSize: 70 }} />,
    },
    {
      title: "Positive",
      value: "65",
      icon: <ThumbUpAltOutlinedIcon sx={{ fontSize: 70 }} />,
    },
    {
      title: "Negative",
      value: "20",
      icon: <ThumbDownOffAltOutlinedIcon sx={{ fontSize: 70 }} />,
    },
  ];

  return (
    <Grid container spacing={2}>
      {feedbackStats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: "#e6f6ed",
              display: "flex",
              alignItems: "center",
              color: "#0f7468",
              border: "1px solid #0f7468",
            }}
          >
            {stat.icon}
            <Grid sx={{ ml: 2, width: 160 }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 1 }}>
                {stat.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{ display: "flex", alignItems: "center" }}
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

export default feedbackCard;
