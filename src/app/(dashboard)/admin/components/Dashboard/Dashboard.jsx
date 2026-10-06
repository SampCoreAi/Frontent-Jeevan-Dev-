"use client";

import React, { useEffect, useState } from "react";
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
  doctorAssistants: 0,
  labs: 0,
  labAssistants: 0,
  medicalStores: 0,
});

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // =========================
  // CHECK ADMIN AUTH
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.replace("/Home/pages/Login");
      return;
    }

    try {
      const parsedUser = JSON.parse(user);

      if (Number(parsedUser.role_id) !== 5) {
        router.replace("/Home/pages/Login");
        return;
      }

      setRoleId(5);
    } catch (error) {
      console.error("Invalid user data:", error);
      router.replace("/Home/pages/Login");
    }
  }, [router]);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    // Auth check complete hone ka wait
    if (roleId !== 5) return;

    // Custom filter me both dates required
    if (filter === "custom" && (!startDate || !endDate)) {
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/Home/pages/Login");
          return;
        }

        let url = `${API_URL}/api/dashboard/admin/cardNumber`;

        // =========================
        // CUSTOM DATE
        // =========================
        if (filter === "custom") {
          const formattedStartDate =
            startDate.format("YYYY-MM-DD");

          const formattedEndDate =
            endDate.format("YYYY-MM-DD");

          url +=
            `?startDate=${formattedStartDate}` +
            `&endDate=${formattedEndDate}`;
        } else {
          // =========================
          // TODAY / WEEK / MONTH / YEAR
          // =========================
          url += `?filter=${filter}`;
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res?.data?.data) {
          setDashboardData((prev) => ({
            ...prev,
            ...res.data.data,
          }));
        }
      } catch (error) {
        console.error(
          "Dashboard fetch error:",
          error?.response?.data || error.message
        );

        // Unauthorized
        if (error?.response?.status === 401) {
          router.replace("/Home/pages/Login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [
    roleId,
    filter,
    startDate,
    endDate,
    API_URL,
    router,
  ]);

  // =========================
  // WAIT FOR AUTH CHECK
  // =========================
  if (roleId !== 5) {
    return null;
  }

  // =========================
  // UI
  // =========================
  return (
    <Box
      sx={{
        flexGrow: 1,

        // navbar spacing
        mt: 8,

        width: "100%",
        minWidth: 0,

   

        pb: 2,

        boxSizing: "border-box",

        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minWidth: 0,

          bgcolor: "background.paper",

          border: "1px solid",
          borderColor: "divider",


          p: {
            xs: 1.25,
            sm: 1.5,
            md: 2,
          },

          boxSizing: "border-box",

          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 3px 12px rgba(0,0,0,0.16)"
              : "0 2px 8px rgba(15,23,42,0.04)",
        }}
      >
        <Grid
          container
          spacing={2}
        >
          {/* =========================
              DASHBOARD CARDS
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
          {/* <Grid size={12}>
            <SummaryCard />
          </Grid> */}

          {/* =========================
              RECENT REGISTRATIONS
              Doctor
              Patient
              Lab
              Medical Store
          ========================= */}
          <Grid
            size={12}
            sx={{
              minWidth: 0,
            }}
          >
            <DashboardTables />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Page;