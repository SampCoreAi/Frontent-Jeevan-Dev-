"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid } from "@mui/material";
import axios from "axios";
import CardPage from "../Dashboard/Card";
import SummaryCard from "../Dashboard/SummaryCard"
import DashboardTables from "../Dashboard/DashboardTables"

const Page = () => {
  const [roleId, setRoleId] = useState(null);
  const router = useRouter();
  const [filter, setFilter] = useState("today");
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const [dashboardData, setDashboardData] = useState({
  patients: 0,
  doctors: 0,
  assistants: 0,
  completedAppointments: 0,
  upcomingAppointments: 0,
  pastAppointments: 0,
});

const [loading, setLoading] = useState(false);


useEffect(() => {
  if (filter === "custom" && (!startDate || !endDate)) return;

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

   let url = `${API_URL}/api/dashboard/admin/cardNumber`;
      if (filter === "custom") {
        url += `?startDate=${startDate.format(
          "YYYY-MM-DD"
        )}&endDate=${endDate.format("YYYY-MM-DD")}`;
      } else {
        url += `?filter=${filter}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, [filter, startDate, endDate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.push("/Home/pages/Register");
      return;
    }

    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role_id !== 5) {
        router.push("/Home/pages/Register");
      }
      setRoleId(parsedUser.role_id);
    }
  }, [router]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        mt: 9,
        px: { xs: 1, sm: 2 },
        width: "100%",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: 1,
          p: 2,
          boxShadow: (theme) => `0 4px 12px ${theme.palette.border.third}`,
        }}
      >
        <Grid size={12}>
       <CardPage
  filter={filter}
  setFilter={setFilter}
  startDate={startDate}
  setStartDate={setStartDate}
  endDate={endDate}
  setEndDate={setEndDate}
  dashboardData={dashboardData}
  loading={loading}
/>
        </Grid>
        <Grid size={12}>
          <SummaryCard />
        </Grid>
        <Grid size={12}>
          <DashboardTables />
        </Grid>

      </Grid>
    </Box>
  );
};

export default Page;