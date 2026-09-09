// StatsCards.jsx

"use client";

import React from "react";

import {
  Grid,
  Card,
  Typography,
  Box,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";

const StatsCards = ({ stats }) => {

  const cards = [
    {
      title: "Total Appointment",
      value:
        stats?.total_appointment || 0,

      icon: <PersonIcon />,
    },

    {
      title: "Total Upcoming",
      value:
        stats?.total_upcoming || 0,

      icon: <CheckCircleIcon />,
    },

    {
      title: "Total Completed",
      value:
        stats?.total_completed || 0,

      icon: <PendingIcon />,
    },

    {
      title: "Total Expired",
      value:
        stats?.total_expired || 0,

      icon: <CancelIcon />,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>

        {cards.map((item, index) => (

          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >

            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",

                p: 2,
                borderRadius: 3,
                boxShadow: 1,
                border:
                  "1px solid #1e6658",

                transition: "0.3s",

                backgroundColor: "#fff",

                minHeight: 110,

                "&:hover": {
                  transform:
                    "translateY(-5px)",

                  boxShadow: 4,
                },
              }}
            >

              <Box>

                <Typography
                  sx={{
                    color: "#1e6658",
                    fontWeight: 600,

                    fontSize: {
                      xs: 14,
                      sm: 15,
                    },
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#1e6658",
                    fontWeight: 700,

                    fontSize: {
                      xs: 24,
                      sm: 28,
                    },

                    mt: 0.5,
                  }}
                >
                  {item.value}
                </Typography>

              </Box>

              <Box
                sx={{
                  backgroundColor:
                    "#e8f5f2",

                  borderRadius: 2,

                  p: 1.5,

                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "center",

                  color: "#1e6658",

                  "& svg": {
                    fontSize: {
                      xs: 28,
                      sm: 34,
                    },
                  },
                }}
              >
                {item.icon}
              </Box>

            </Card>

          </Grid>

        ))}

      </Grid>
    </Box>
  );
};

export default StatsCards;