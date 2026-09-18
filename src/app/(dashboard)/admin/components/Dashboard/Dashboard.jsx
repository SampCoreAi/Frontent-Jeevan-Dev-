"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid } from "@mui/material";
import axios from "axios";

import CardPage from "../Dashboard/Card";
import SummaryCard from "../Dashboard/SummaryCard";
import DashboardTables from "../Dashboard/DashboardTables";

const Page = () => {
  const router = useRouter();

  // =========================
  // STATES
  // =========================
  const [roleId, setRoleId] = useState(null);

  const [filter, setFilter] = useState("today");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    patients: 0,
    doctors: 0,
    assistants: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
    pastAppointments: 0,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // =========================
  // CHECK ADMIN AUTH
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      router.push("/Home/pages/Register");
      return;
    }

    if (!user) {
      router.push("/Home/pages/Register");
      return;
    }

    try {
      const parsedUser = JSON.parse(user);

      if (parsedUser.role_id !== 4) {
        router.push("/Home/pages/Register");
        return;
      }

      setRoleId(parsedUser.role_id);
    } catch (error) {
      console.error("Invalid user data:", error);
      router.push("/Home/pages/Register");
    }
  }, [router]);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    // Custom filter ke case me dono dates required hain
    if (filter === "custom" && (!startDate || !endDate)) {
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        let url = `${API_URL}/api/dashboard/admin/cardNumber`;

        // =========================
        // CUSTOM DATE FILTER
        // =========================
        if (filter === "custom") {
          const formattedStartDate = startDate.format("YYYY-MM-DD");
          const formattedEndDate = endDate.format("YYYY-MM-DD");

          url += `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
        } else {
          // =========================
          // TODAY / WEEK / MONTH ETC.
          // =========================
          url += `?filter=${filter}`;
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.data?.data) {
          setDashboardData(res.data.data);
        }
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [filter, startDate, endDate, API_URL]);

  // =========================
  // UI
  // =========================
  return (
    <Box
      sx={{
        flexGrow: 1,
        mt: 9,

        px: {
          xs: 1,
          sm: 2,
          md: 2,
        },

        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",

          // Global theme background
          backgroundColor: "background.paper",

          borderRadius: 2,

          p: {
            xs: 1,
            sm: 2,
          },

          // FIXED:
          // theme.palette.border.third removed
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",

          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* =========================
            DASHBOARD COUNT CARDS
        ========================= */}
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

        {/* =========================
            SUMMARY
        ========================= */}
        <Grid size={12}>
          <SummaryCard />
        </Grid>

        {/* =========================
            TABLES
        ========================= */}
        <Grid
          size={12}
          sx={{
            minWidth: 0,
            overflowX: "auto",
          }}
        >
          <DashboardTables />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Page;