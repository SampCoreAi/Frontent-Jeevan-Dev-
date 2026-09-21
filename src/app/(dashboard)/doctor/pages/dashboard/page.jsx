"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid } from "@mui/material";
import axios from "axios";

import DashboardCard from "../../components/DashboardContent/CountingCard";
import AppointmentCard from "../../components/DashboardContent/AppointmentTable";
import NextPatientCard from "../../components/DashboardContent/NextPatientCard";
import OnOffCard from "../../../doctor/components/DashboardContent/onOffCard";

export default function Page() {
  const router = useRouter();

  // ==========================================
  // STATES
  // ==========================================

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [graphData, setGraphData] = useState({
    online_graph: [],
    offline_graph: [],
    online_total: 0,
    offline_total: 0,
  });

  const [todayStats, setTodayStats] = useState({
    today_appointments: 0,
    today_completed: 0,
    today_pending: 0,
    today_cancelled: 0,
  });

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ==========================================
    // TOKEN CHECK
    // ==========================================

    if (!token) {
      router.replace("/Home/pages/Login");
      return;
    }

    // ==========================================
    // USER / ROLE CHECK
    // ==========================================

    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        router.replace("/Home/pages/Login");
        return;
      }

      const user = JSON.parse(userData);

      // Doctor role_id = 2
      // Only doctor can access doctor dashboard
      if (user.role_id !== 2) {
        router.replace("/Home/pages/Login");
        return;
      }
    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      router.replace("/Home/pages/Login");
      return;
    }

    // ==========================================
    // HEADERS
    // ==========================================

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // ==========================================
    // API CALLS
    // ==========================================

    const fetchDashboardData = async () => {
      try {
        setLoadingAppointments(true);

        const [appointmentsRes, statsRes, graphRes] =
          await Promise.all([
            // ----------------------------------
            // TODAY APPOINTMENTS
            // ----------------------------------

            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/today-appointments`,
              {
                headers,
              }
            ),

            // ----------------------------------
            // TODAY STATS
            // ----------------------------------

            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/today-stats`,
              {
                headers,
              }
            ),

            // ----------------------------------
            // APPOINTMENT GRAPH
            // ----------------------------------

            axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/appointment-graph`,
              {
                headers,
              }
            ),
          ]);

        // ======================================
        // APPOINTMENTS
        // ======================================

        const fetchedAppointments =
          appointmentsRes?.data?.appointments || [];

        setAppointments(fetchedAppointments);

        // First appointment selected by default
        if (fetchedAppointments.length > 0) {
          setSelectedPatient(fetchedAppointments[0]);
        } else {
          setSelectedPatient(null);
        }

        // ======================================
        // TODAY STATS
        // ======================================

        if (statsRes?.data?.success) {
          setTodayStats(
            statsRes?.data?.data || {
              today_appointments: 0,
              today_completed: 0,
              today_pending: 0,
              today_cancelled: 0,
            }
          );
        }

        // ======================================
        // GRAPH DATA
        // ======================================

        if (graphRes?.data?.success) {
          setGraphData(
            graphRes?.data?.data || {
              online_graph: [],
              offline_graph: [],
              online_total: 0,
              offline_total: 0,
            }
          );
        }
      } catch (error) {
        console.error(
          "Dashboard Error:",
          error?.response?.data || error
        );
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <Box
      sx={{
        mt: 8,

       
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          px: {
            xs: 1,
            sm: 3,
          },
          pt:3,

          bgcolor: "background.paper",

          borderRadius: 2,

          // FIX:
          // theme.palette.border.third was undefined
          boxShadow: (theme) =>
            `0 4px 12px ${theme.palette.divider}`,
        }}
      >
        {/* =====================================
            DASHBOARD COUNT CARDS
        ====================================== */}

        <Grid size={12}>
          <DashboardCard stats={todayStats} />
        </Grid>

        {/* =====================================
            APPOINTMENT GRAPH
        ====================================== */}

        <Grid size={12}>
          <OnOffCard graphData={graphData} />
        </Grid>

        {/* =====================================
            APPOINTMENT TABLE
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <AppointmentCard
            appointments={appointments}
            loading={loadingAppointments}
            onSelectAppointment={(appointment) => {
              setSelectedPatient(appointment);
            }}
          />
        </Grid>

        {/* =====================================
            NEXT PATIENT
        ====================================== */}

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <NextPatientCard
            patient={selectedPatient}
            loading={loadingAppointments}
          />
        </Grid>
      </Grid>
    </Box>
  );
}