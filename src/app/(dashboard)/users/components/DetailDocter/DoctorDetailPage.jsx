"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import DoctorProfileDetail from "../DetailDocter/DoctorProfileDetail";
import FeedbackSection from "../DetailDocter/FeedbackSection";

import {
  API_BASE_URL,
  API_ENDPOINTS,
} from "../../../../../config/api";

export default function DoctorDetailPage({ doctorId }) {
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.DOCTOR_PROFILE(doctorId)}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        if (res.data?.success && res.data?.data) {
          setDoctorData(res.data.data);
        } else {
          setError("Doctor information not found.");
        }
      } catch (error) {
        console.error("Doctor profile error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load doctor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <CircularProgress size={30} />

        <Typography variant="body2">
          Loading doctor profile...
        </Typography>
      </Box>
    );
  }

  if (error || !doctorData) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="error">
          {error || "Doctor not found."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 7.5,
        minHeight: "100vh",
        bgcolor: "white",

        px: {
          xs: 1,
          sm: 1.5,
          md: 2,
        },

        py: {
          xs: 1.5,
          md: 2,
        },
      }}
    >
      <DoctorProfileDetail
        data={doctorData}
        doctorId={doctorId}
      />

      <FeedbackSection doctorId={doctorId} />
    </Box>
  );
}