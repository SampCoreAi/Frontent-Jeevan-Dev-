"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonIcon from "@mui/icons-material/Person";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const DashboardCard = ({
  filter,
  setFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dashboardData,
  loading,
}) => {
  const cardBg = "#e4eceb";
  const text = "black";

  const topCards = [
    {
      icon: <PersonIcon sx={{ fontSize: 55 }} />,
      title: "Patients",
      value: dashboardData.patients,
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 55 }} />,
      title: "Doctors",
      value: dashboardData.doctors,
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 55 }} />,
      title: "Assistants",
      value: dashboardData.assistants,
    },
    {
      icon: <TaskAltIcon sx={{ fontSize: 55 }} />,
      title: "Completed",
      value: dashboardData.completedAppointments,
    },
  ];
  const bottomCards = [
    {
      icon: <EventAvailableIcon sx={{ fontSize: 60 }} />,
      title: "Upcoming",
      value: dashboardData.upcomingAppointments,
    },
    {
      icon: <EventBusyIcon sx={{ fontSize: 60 }} />,
      title: "Cancel",
      value: dashboardData.pastAppointments,
    },
  ];
  const renderTopCard = (item, index) => (
    <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: 2,
          backgroundColor: cardBg,
          border: "1px solid #0f7468",
          transition: ".3s",
          height: "100%",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 12px rgba(0,0,0,.15)",
          },
        }}
      >
        <Box
          sx={{
            fontSize: { xs: 40, sm: 50, md: 30 },
            color: text,
            display: "flex",
          }}
        >
          {item.icon}
        </Box>

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
              fontSize: { xs: 22, sm: 26, md: 32 },
              fontWeight: 700,
            }}
          >
            {loading ? <CircularProgress size={22} /> : item.value}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );

  const renderBottomCard = (item, index) => (
    <Grid key={index} size={{ xs: 12, md: 6 }}>
      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: cardBg,
          border: "1px solid #0f7468",
          transition: ".3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 6px 12px rgba(0,0,0,.15)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
              <Typography
                sx={{
                  fontSize: { xs: 15, sm: 16, md: 18 },
                  fontWeight: 700,
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 22, sm: 26, md: 32 },
                  fontWeight: 700,
                }}
              >
                {item.value}
              </Typography>
            </Box>
          </Box>
          <FormControl
            size="small"
            sx={{
              minWidth: 120,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#1f8e6e",
                },
                "&:hover fieldset": {
                  borderColor: "#1f8e6e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1f8e6e",
                },
              },
            }}
          >
           
          </FormControl>
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box>
      {/* Dashboard Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Dashboard
        </Typography>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <Select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);

              if (e.target.value !== "custom") {
                setStartDate(null);
                setEndDate(null);
              }
            }}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
            <MenuItem value="custom">Custom Date</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Custom Date Picker */}
      {filter === "custom" && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <DatePicker
              label="From Date"
              value={startDate}
              onChange={(value) => setStartDate(value)}
            />

            <DatePicker
              label="To Date"
              value={endDate}
              onChange={(value) => setEndDate(value)}
            />
          </Box>
        </LocalizationProvider>
      )}

      {/* Top Cards */}
      <Grid container spacing={2} mb={2}>
        {topCards.map(renderTopCard)}
      </Grid>

      {/* Bottom Cards */}
      <Grid container spacing={2}>
        {bottomCards.map(renderBottomCard)}
      </Grid>
    </Box>
  );
};

export default DashboardCard;