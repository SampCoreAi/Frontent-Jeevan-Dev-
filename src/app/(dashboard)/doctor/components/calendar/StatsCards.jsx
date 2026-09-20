// StatsCards.jsx

"use client";

import React from "react";

import {
  Box,
  Card,
  Grid,
  Typography,
} from "@mui/material";

import { alpha, useTheme } from "@mui/material/styles";

import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import UpcomingOutlinedIcon from "@mui/icons-material/UpcomingOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";

const StatsCards = ({ stats }) => {
  const theme = useTheme();

  const cards = [
    {
      title: "Total Appointments",
      value: stats?.total_appointment || 0,
      icon: <EventNoteOutlinedIcon />,
    },
    {
      title: "Total Upcoming",
      value: stats?.total_upcoming || 0,
      icon: <UpcomingOutlinedIcon />,
    },
    {
      title: "Total Completed",
      value: stats?.total_completed || 0,
      icon: <CheckCircleOutlineRoundedIcon />,
    },
    {
      title: "Total Expired",
      value: stats?.total_expired || 0,
      icon: <EventBusyOutlinedIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        mb: "12px",
      }}
    >
      <Grid
        container
        spacing={{
          xs: 1,
          sm: 1.25,
          md: 1.5,
        }}
      >
        {cards.map((item) => (
          <Grid
            key={item.title}
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",
                minHeight: "82px",

                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",

                gap: "10px",

                px: {
                  xs: "12px",
                  sm: "14px",
                },

                py: "11px",

                bgcolor: "background.paper",

                border: "1px solid",
                borderColor: "divider",

                borderRadius: "10px",

                boxShadow: `0 2px 8px ${alpha(
                  theme.palette.text.primary,
                  0.035
                )}`,

                transition:
                  "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",

                "&:hover": {
                  borderColor: alpha(
                    theme.palette.primary.main,
                    0.3
                  ),

                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.08
                  )}`,

                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* LEFT CONTENT */}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    mb: "4px",

                    fontSize: "12.5px",
                    lineHeight: 1.3,

                    fontWeight: 550,

                    color: "text.secondary",

                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: {
                      xs: "19px",
                      sm: "20px",
                    },

                    lineHeight: 1.2,

                    fontWeight: 700,

                    color: "text.primary",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>

              {/* ICON */}

              <Box
                sx={{
                  width: "38px",
                  height: "38px",

                  flexShrink: 0,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: "9px",

                  bgcolor: "secondary.light",

                  color: "primary.main",

                  border: "1px solid",

                  borderColor: alpha(
                    theme.palette.primary.main,
                    0.08
                  ),

                  "& svg": {
                    fontSize: "19px",
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