
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Button,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

const DashboardCard = ({ refreshKey }) => {

  const [stats, setStats] = useState({
    totalAssistants: 0,
    yearAssistants: 0,
    monthAssistants: 0,
    weekAssistants: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
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

      if (res.data?.data) {
        const data = res.data.data;

        setStats({
          totalAssistants: data.totalAssistants ?? 0,
          yearAssistants: data.yearAssistants ?? 0,
          monthAssistants: data.monthAssistants ?? 0,
          weekAssistants: data.weekAssistants ?? 0,
        });
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      console.error("Stats Error:", err);

      if (err.code === "ECONNABORTED") {
        setError("Request timed out.");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
      } else if (err.response?.status === 403) {
        setError("You don't have permission.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch statistics."
        );
      }
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchStats();
}, [refreshKey]);


  const cards = [
    {
      title: "Total Assistants",
      value: stats.totalAssistants,
      subtitle: "All registered",
      icon: PeopleAltOutlinedIcon,
      color: "#07876A",
      iconBg: "#E7F5EF",
    },
    {
      title: "This Year",
      value: stats.yearAssistants,
      subtitle: "Year to date",
      icon: CalendarTodayOutlinedIcon,
      color: "#4778C7",
      iconBg: "#EAF1FF",
    },
    {
      title: "This Month",
      value: stats.monthAssistants,
      subtitle: "Current month",
      icon: DateRangeOutlinedIcon,
      color: "#C58338",
      iconBg: "#FFF2E5",
    },
    {
      title: "This Week",
      value: stats.weekAssistants,
      subtitle: "Current week",
      icon: EventAvailableOutlinedIcon,
      color: "#8660C2",
      iconBg: "#F1EAFE",
    },
  ];

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ borderRadius: 2 }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={fetchStats}
          >
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  
return (
  <Box sx={{ width: "100%" }}>
    <Grid container spacing={1.5}>
      {cards.map((item, index) => {
        const Icon = item.icon;

        return (
          <Grid
            key={index}
            size={{ xs: 12, sm: 6, lg: 3 }}
          >
            <Paper
  elevation={0}
  sx={{
    p: 1.5,
    minHeight: 90,
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    bgcolor: "background.paper",

    // Light green border
    border: "1px solid rgba(7, 135, 106, 0.13)",
    borderRadius: "10px",

    transition: "all 0.2s ease",

    "&:hover": {
      borderColor: item.color,
      boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
    },
  }}
>
              {/* ICON */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: "10px",
                  bgcolor: item.iconBg,
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ fontSize: 22 }} />
              </Box>

              {/* CONTENT */}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: "11.5px",
                    color: "text.secondary",
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </Typography>

                {loading ? (
                  <Skeleton width={55} height={30} />
                ) : (
                  <Typography
                    sx={{
                      fontSize: "23px",
                      fontWeight: 700,
                      lineHeight: 1.3,
                      color: "text.primary",
                    }}
                  >
                    {Number(item.value).toLocaleString()}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  </Box>
);

};

export default DashboardCard;
