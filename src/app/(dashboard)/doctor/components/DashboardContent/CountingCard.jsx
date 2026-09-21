"use client";

import React from "react";
import { Grid, Paper, Typography, Box } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useTheme } from "@mui/material/styles";

const DashboardCard = ({ stats = {} }) => {
  const theme = useTheme();

  const cards = [
    {
      icon: PersonOutlineIcon,
      title: "Today Appointment",
      value: stats?.today_appointments ?? 0,
    },
    {
      icon: CheckCircleOutlineIcon,
      title: "Today Completed",
      value: stats?.today_completed ?? 0,
    },
    {
      icon: PendingOutlinedIcon,
      title: "Today Pending",
      value: stats?.today_pending ?? 0,
    },
    {
      icon: CancelOutlinedIcon,
      title: "Today Cancelled",
      value: stats?.today_cancelled ?? 0,
    },
  ];

  return (
    <Grid container spacing={1.5}>
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.5, sm: 1.75 },
                minHeight: 82,
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                borderRadius: 1.5,
                bgcolor: "background.paper",
                border: "1px solid #b1b1b1",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#07876a",
                  boxShadow: `0 3px 10px ${theme.palette.divider}`,
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1.2,
                  bgcolor: "#edf7f2",
                  color: "primary.dark",
                }}
              >
                <Icon sx={{ fontSize: 21 }} />
              </Box>
              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: 500,
                    color: "text.secondary",
                    lineHeight: 1.3,
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
                    color: "text.primary",
                  }}
                >
                  {Number(item.value) || 0}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DashboardCard;