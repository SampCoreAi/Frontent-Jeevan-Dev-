"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Paper, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import TodayIcon from "@mui/icons-material/Today";

const DashboardCard = () => {
  const theme = useTheme();
  const cardBg = theme.palette.background.third;
  const text = theme.palette.text.primary;

  const [stats, setStats] = useState({
    totalAssistants: 0,
    yearAssistants: 0,
    weekAssistants: 0,
    monthAssistants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/assistant/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, 
        }
      );
      if (res.data && res.data.data) {
        setStats({
          totalAssistants: res.data.data.totalAssistants || 0,
          yearAssistants: res.data.data.yearAssistants || 0,
          weekAssistants: res.data.data.weekAssistants || 0,
          monthAssistants: res.data.data.monthAssistants || 0,
        });
      } else {
        setError("Invalid response format from server.");
      }
    } catch (error) {
      console.error("Stats Error:", error);
      if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (error.response) {
        if (error.response.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem("token");
        } else if (error.response.status === 403) {
          setError("You don't have permission to view this data.");
        } else {
          setError(
            error.response.data?.message || 
            "Failed to fetch statistics. Please try again."
          );
        }
      } else if (error.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { icon: <PersonIcon />, title: "Total Assistant", value: stats.totalAssistants },
    { icon: <CalendarMonthIcon />, title: "Year Assistant", value: stats.yearAssistants },
    { icon: <DateRangeIcon />, title: "Month Assistant", value: stats.monthAssistants },
    { icon: <TodayIcon />, title: "Week Assistant", value: stats.weekAssistants },
  ];

  if (loading) {
    return (
      <Box sx={{ width: "100%", p: 2, textAlign: "center" }}>
        <Typography>Loading statistics...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", p: 2, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        {cards.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderRadius: 2,
                backgroundColor: cardBg,
                border: "1px solid #0f7468",
              }}
            >
              <Box
                sx={{
                  fontSize: { xs: 35, sm: 45, md: 55 },
                  color: text,
                  display: "flex",
                }}
              >
                {item.icon}
              </Box>

              <Box>
                <Typography fontWeight={700}>{item.title}</Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 20, sm: 24, md: 28 },
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardCard;