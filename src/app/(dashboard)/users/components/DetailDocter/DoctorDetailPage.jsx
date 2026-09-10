"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";

import DoctorProfileDetail from "../DetailDocter/DoctorProfileDetail";
import FeedbackSection from "../DetailDocter/FeedbackSection";
import { API_BASE_URL, API_ENDPOINTS } from "../../../../../config/api";

export default function DoctorDetailPage({ doctorId }) {
  const [doctorData, setDoctorData] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_BASE_URL}${API_ENDPOINTS.DOCTOR_PROFILE(doctorId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (res.data?.success && res.data?.data) {
          // IMPORTANT:
          // API already returns flat doctor data
          setDoctorData(res.data.data);
        }
      } catch (error) {
        console.error("Doctor profile error:", error);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  if (!doctorData) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box
        sx={{
          mt: 7.5,
          minHeight: "100vh",
          background: "white",
          p: { xs: 2, md: 1 },
        }}
      >
        <DoctorProfileDetail
          data={doctorData}
          doctorId={doctorId}
        />

        <FeedbackSection doctorId={doctorId} />
      </Box>
    </Box>
  );
}