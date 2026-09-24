"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Menu,
  MenuItem,
  Snackbar,
  useTheme,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import DoctorAssistantFilters from "../../components/Assistant/DoctorAssistantFilters";
import DoctorAssistantTable from "../../components/Assistant/DoctorAssistantTable";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const DoctorAssistant = () => {
  const theme = useTheme();

  // =========================================
  // STATES
  // =========================================
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [assistants, setAssistants] = useState([]);

  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [assistantsLoading, setAssistantsLoading] = useState(false);

  const [assistantSearch, setAssistantSearch] = useState("");

  // Action menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAssistant, setSelectedAssistant] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // =========================================
  // HELPERS
  // =========================================
  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const getDoctorId = (doctor) =>
    doctor?.userId ?? doctor?.user_id ?? doctor?.id ?? null;

  const getDoctorName = (doctor) =>
    doctor?.full_name ||
    doctor?.fullName ||
    doctor?.name ||
    doctor?.username ||
    doctor?.email ||
    (getDoctorId(doctor)
      ? `Doctor #${getDoctorId(doctor)}`
      : "Unknown Doctor");

  const getDoctorEmail = (doctor) => doctor?.email || "-";

  const getDoctorMobile = (doctor) =>
    doctor?.mobile || doctor?.phone_number || doctor?.phone || "-";

  const formatStatus = (status) => {
    if (!status) return "Active";
    return String(status)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusStyle = (status) => {
    const value = String(status || "ACTIVE").toUpperCase();

    switch (value) {
      case "ACTIVE":
        return {
          color: theme.palette.success.main,
          bgcolor: `${theme.palette.success.main}12`,
        };
      case "INACTIVE":
        return {
          color: theme.palette.text.secondary,
          bgcolor: theme.palette.action.hover,
        };
      case "PENDING":
        return {
          color: theme.palette.warning.main,
          bgcolor: `${theme.palette.warning.main}12`,
        };
      case "REJECTED":
      case "BLOCKED":
        return {
          color: theme.palette.error.main,
          bgcolor: `${theme.palette.error.main}12`,
        };
      default:
        return {
          color: theme.palette.primary.main,
          bgcolor: `${theme.palette.primary.main}12`,
        };
    }
  };

  // =========================================
  // GET DOCTORS
  // =========================================
  const getDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const response = await axios.get(
        `${API_URL}/api/doctors/getDoctors`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const result = response?.data;

      let doctorList = [];
      if (Array.isArray(result?.data)) doctorList = result.data;
      else if (Array.isArray(result)) doctorList = result;

      setDoctors(doctorList);
    } catch (error) {
      console.error("Get Doctors Error:", error?.response?.data || error);
      setDoctors([]);
      showMessage(
        error?.response?.data?.message || "Unable to load doctors.",
        "error"
      );
    } finally {
      setDoctorsLoading(false);
    }
  };

  // =========================================
  // GET ASSISTANTS
  // =========================================
  const getDoctorAssistants = async (doctor) => {
    if (!doctor) return;

    const doctorId = getDoctorId(doctor);
    if (!doctorId) {
      showMessage("Doctor ID is not available.", "error");
      return;
    }

    try {
      setAssistantsLoading(true);
      setAssistants([]);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/assistant/getAllAssistantProfiles/${doctorId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const result = response?.data;
      const assistantList = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
        ? result
        : [];

      setAssistants(assistantList);
    } catch (error) {
      console.error("Get Assistants Error:", error?.response?.data || error);
      setAssistants([]);
      showMessage(
        error?.response?.data?.message || "Unable to load assistants.",
        "error"
      );
    } finally {
      setAssistantsLoading(false);
    }
  };

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {
    getDoctors();
  }, []);

  // =========================================
  // DOCTOR SELECT
  // =========================================
  const handleDoctorSelect = (_, doctor) => {
    setSelectedDoctor(doctor);
    setAssistants([]);
    setAssistantSearch("");

    if (doctor) getDoctorAssistants(doctor);
  };

  // =========================================
  // REFRESH
  // =========================================
  const handleRefresh = () => {
    if (!selectedDoctor) return;
    getDoctorAssistants(selectedDoctor);
  };

  // =========================================
  // ACTION MENU
  // =========================================
  const handleMenuOpen = (event, assistant) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedAssistant(assistant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssistant(null);
  };

  const handleViewAssistant = () => {
    if (!selectedAssistant) return;
    console.log("Selected Assistant:", selectedAssistant);
    handleMenuClose();
  };

  // =========================================
  // FILTER ASSISTANTS
  // =========================================
  const filteredAssistants = useMemo(() => {
    const query = assistantSearch.trim().toLowerCase();
    if (!query) return assistants;

    return assistants.filter((assistant) => {
      const name =
        assistant?.full_name || assistant?.fullName || "";
      const email = assistant?.email || "";
      const mobile =
        assistant?.mobile ||
        assistant?.phone_number ||
        assistant?.phone ||
        "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        String(mobile).toLowerCase().includes(query)
      );
    });
  }, [assistants, assistantSearch]);

  // =========================================
  // UI
  // =========================================
  return (
    <Box
      sx={{
        pt: 12,
        px: { xs: 1.5, sm: 2.5 },
        bgcolor: "white",
        height:"99vh"
      }}
    >
      {/* TOP SECTION */}
      <DoctorAssistantFilters
        doctors={doctors}
        doctorsLoading={doctorsLoading}
        selectedDoctor={selectedDoctor}
        onDoctorSelect={handleDoctorSelect}
        getDoctorId={getDoctorId}
        getDoctorName={getDoctorName}
        getDoctorEmail={getDoctorEmail}
        getDoctorMobile={getDoctorMobile}
        assistantsCount={assistants.length}
        assistantSearch={assistantSearch}
        onAssistantSearchChange={setAssistantSearch}
        assistantsLoading={assistantsLoading}
        onRefresh={handleRefresh}
      />

      {/* TABLE SECTION */}
      <DoctorAssistantTable
        selectedDoctor={selectedDoctor}
        filteredAssistants={filteredAssistants}
        assistantsLoading={assistantsLoading}
        onMenuOpen={handleMenuOpen}
        getDoctorName={getDoctorName}
        formatStatus={formatStatus}
        getStatusStyle={getStatusStyle}
      />

      {/* ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 165,
            mt: 0.5,
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
          },
        }}
      >
        <MenuItem
          onClick={handleViewAssistant}
          sx={{
            gap: 1,
            py: 1,
            fontSize: "12px",
            color: "text.primary",
          }}
        >
          <VisibilityOutlinedIcon
            sx={{ fontSize: 17, color: "primary.main" }}
          />
          View Details
        </MenuItem>
      </Menu>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({ ...prev, open: false }))
          }
          sx={{ borderRadius: 1.5, fontSize: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorAssistant;