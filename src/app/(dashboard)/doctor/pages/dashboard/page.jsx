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

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

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

const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/Home/pages/Login");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (user.role_id === 2 && user.role_id === 3   ) {
        router.replace("/Home/pages/Login");
        return;
      }
    } catch {
      localStorage.clear();
      router.replace("/Home/pages/Register");
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchDashboardData = async () => {
      try {
        const [appointmentsRes, statsRes, graphRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/today-appointments`,
            { headers }
          ),

          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/today-stats`,
            { headers }
          ),

          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/appointment-graph`,
            { headers }
          ),
        ]);

       const fetchedAppointments = appointmentsRes.data.appointments || [];

setAppointments(fetchedAppointments);

if (fetchedAppointments.length > 0) {
  setSelectedPatient(fetchedAppointments[0]);
}

        if (statsRes.data.success) {
          setTodayStats(statsRes.data.data);
        }

        if (graphRes.data.success) {
          setGraphData(graphRes.data.data);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <Box
      sx={{
        mt: 9,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: (theme) =>
            `0 4px 12px ${theme.palette.border.third}`,
        }}
      >
        <Grid size={12}>
          <DashboardCard stats={todayStats} />
        </Grid>

        <Grid size={12}>
          <OnOffCard graphData={graphData} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
        <AppointmentCard
  appointments={appointments}
  loading={loadingAppointments}
  onSelectAppointment={(appointment) => {
    setSelectedPatient(appointment);
  }}
/>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
         <NextPatientCard
  patient={selectedPatient}
  loading={loadingAppointments}
/>
        </Grid>
      </Grid>
    </Box>
  );
}