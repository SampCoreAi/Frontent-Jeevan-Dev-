"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { RefreshOutlined } from "@mui/icons-material";
import axios from "axios";

import RegistrationStats from "../../components/Registration/RegistrationStats";
import RegistrationTable from "../../components/Registration/RegistrationTable";
import DocumentDialog from "../../components/Registration/DocumentDialog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_S3_BUCKET_URL =
  process.env.NEXT_PUBLIC_S3_BUCKET_URL;

export default function Registration() {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    total_registered: 0,
    total_submitted: 0,
    total_draft: 0,
    total_verified: 0,
    total_rejected: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [documentDialog, setDocumentDialog] = useState(false);

  // =========================
  // GET ALL REGISTRATIONS
  // =========================
const handleAssignDoctor = async (doctor) => {
  try {
    const token = localStorage.getItem("token");

    if (!doctor) {
      return;
    }

    const payload = {
      full_name: doctor.full_name,
      email: doctor.email,
      phone_number: doctor.mobile,
      role_id: 2,
      registration_id: doctor.id,
    };

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/assistant-register`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (result.success) {
      console.log("Doctor assigned successfully:", result);

      // Dialog close
      closeDocuments();

      // Optional success message
      setError("");

      alert(
        result.message ||
          "Doctor assigned successfully. Credentials sent to email."
      );
    } else {
      setError(
        result.message || "Unable to assign doctor."
      );
    }
  } catch (error) {
    console.error(
      "Assign Doctor API Error:",
      error.response?.data || error
    );

    setError(
      error.response?.data?.message ||
        "Something went wrong while assigning doctor."
    );
  }
};
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/doctor-registration/getAllDoctorRegistrations`
      );

      const result = response.data;

      if (result.success) {
        setRegistrations(result.data || []);
      } else {
        setError(result.message || "Unable to fetch registrations.");
      }
    } catch (error) {
      console.error("Registration API Error:", error);

      setError(
        error.response?.data?.message ||
          "Something went wrong while loading registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // GET REGISTRATION STATS
  // =========================

const fetchStats = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${API_BASE_URL}/api/doctor-registration/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = response.data;

    if (result.success) {
      setStats({
        total_registered: result.data?.total_registered || 0,
        total_submitted: result.data?.total_submitted || 0,
        total_draft: result.data?.total_draft || 0,
        total_verified: result.data?.total_verified || 0,
        total_rejected: result.data?.total_rejected || 0,
      });
    }
  } catch (error) {
    console.error(
      "Registration Stats API Error:",
      error.response?.data || error
    );
  }
};
  const fetchAllData = async () => {
    await Promise.all([
      fetchRegistrations(),
      fetchStats(),
    ]);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // STATUS COLORS
  // =========================

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";

    case "DRAFT":
      return "warning";

    case "PENDING":
      return "info";

    case "REJECTED":
      return "error";

    default:
      return "default";
  }
};
  const getOnboardingColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "DRAFT":
        return "warning";
      case "PENDING":
        return "info";
      default:
        return "default";
    }
  };

  // =========================
  // DOCUMENTS
  // =========================

  const openDocuments = (doctor) => {
    setSelectedDoctor(doctor);
    setDocumentDialog(true);
  };

  const closeDocuments = () => {
    setDocumentDialog(false);
    setSelectedDoctor(null);
  };

  const getFileUrl = (path) => {
    if (!path) return "#";

    return `${NEXT_PUBLIC_S3_BUCKET_URL}/${path}`;
  };

  return (
    <Box
      p={4}
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px #0f7468",
        mt: 8.5,
        mx: 1,
        borderRadius: 1,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "1.4rem",
                sm: "1.7rem",
                md: "2rem",
              },
              fontWeight: 700,
              color: "#173f38",
            }}
          >
            Doctor Registration
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              mt: 0.5,
              fontSize: "0.9rem",
            }}
          >
            Manage and review doctor registration applications
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshOutlined />}
          onClick={fetchAllData}
          disabled={loading}
          sx={{
            borderColor: "#1e6658",
            color: "#1e6658",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#155347",
              backgroundColor: "#f0fdf9",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* STATS */}
      <RegistrationStats stats={stats} />

    

      {/* TABLE */}
     <RegistrationTable
  registrations={registrations}
  loading={loading}
  getStatusColor={getStatusColor}
  onViewDocuments={openDocuments}
  onAssignDoctor={handleAssignDoctor}
/>

      {/* DOCUMENT DIALOG */}
    <DocumentDialog
  open={documentDialog}
  onClose={closeDocuments}
  selectedDoctor={selectedDoctor}
  getFileUrl={getFileUrl}
  onAssignDoctor={handleAssignDoctor}
/>
    </Box>
  );
}