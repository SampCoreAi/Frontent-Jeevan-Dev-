"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Box,
  Typography,
  FormControl,
  Select,
  Grid,
  MenuItem,
} from "@mui/material";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Example datasets
const datasets = {
  today: Array.from({ length: 24 }, () => Math.floor(Math.random() * 20) + 5), // hourly data
  week: [20, 25, 15, 30, 40, 35, 50], // daily data for a week
  month: [20, 40, 35, 50, 70, 65, 90, 15, 25, 45, 60, 55], // monthly data
  year: [150, 200, 180, 220, 300, 250, 320, 310, 280, 350, 400, 380], // yearly data
};

// Corresponding labels
const labels = {
  today: Array.from({ length: 24 }, (_, i) => `${i}h`), // 0h, 1h, ..., 23h
  week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  month: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
  year: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
};

export default function MessageStatsChart() {
  const [period, setPeriod] = useState("month"); 

  const data = {
    labels: labels[period],
    datasets: [
      {
        label: "Messages",
        data: datasets[period],
        fill: true,
        borderColor: "#00b0ff",
        backgroundColor: "rgba(0,176,255,0.1)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
     maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Booking", 
          font: { size: 14, weight: "bold" },
        },
      },
      x: {
        title: {
          display: true,
          text:
            period === "today"
              ? "Hour"
              : period === "week"
              ? "Day of Week"
              : "Month", 
          font: { size: 14, weight: "bold" },
        },
      },
    },
  };

  return (
    <Grid container spacing={2}>
     <Box
  sx={{
    width: "100%",
    px: { xs: 1, sm: 4 },
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    gap: 2,
  }}
>
        <Typography variant="h5"sx={{color:"#0f7468"}}>Patient Analytics</Typography>
        <FormControl size="small">
          <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Chart container */}
      <Box
  sx={{
    width: "100%",
    maxWidth: "100%",
    overflowX: "auto",
    mt: 2,
    p: { xs: 1, sm: 2 },
    boxShadow: 2,
    borderRadius: 2,
    border: "2px solid #0f7468",
  }}
>
 <Box
  sx={{
    height: {
      xs: 300,
      sm: 400,
    },
  }}
>
  <Line data={data} options={options} />
</Box>
</Box>
    </Grid>
  );
}
