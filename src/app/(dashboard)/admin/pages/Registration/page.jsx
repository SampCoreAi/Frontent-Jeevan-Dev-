"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Snackbar,
  Typography,
} from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import axios from "axios";

import RegistrationStats from "../../components/Registration/RegistrationStats";
import RegistrationTable from "../../components/Registration/RegistrationTable";
import DocumentDialog from "../../components/Registration/DocumentDialog";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const S3_BUCKET_URL =
  process.env.NEXT_PUBLIC_S3_BUCKET_URL?.replace(
    /\/$/,
    ""
  );

export default function Registration() {
  // =========================
  // DATA
  // =========================

  const [registrations, setRegistrations] =
    useState([]);

  const [stats, setStats] = useState({
    total_registered: 0,
    total_submitted: 0,
    total_draft: 0,
    total_verified: 0,
    total_rejected: 0,
  });

  // =========================
  // PAGINATION
  // =========================

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [total, setTotal] = useState(0);

  // =========================
  // SEARCH / FILTER / SORT
  // =========================

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [status, setStatus] = useState("");

  const [sortModel, setSortModel] = useState([
    {
      field: "created_at",
      sort: "desc",
    },
  ]);

  // =========================
  // UI STATES
  // =========================

  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] =
    useState(false);

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [documentDialog, setDocumentDialog] =
    useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // =========================
  // MESSAGE
  // =========================

  const showMessage = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // =========================
  // SEARCH DEBOUNCE
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // GET REGISTRATIONS
  // =========================

  const fetchRegistrations = useCallback(
    async (signal) => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token");

        const sort = sortModel?.[0];

        const params = {
          page: page + 1,
          limit: rowsPerPage,
        };

        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        if (status) {
          params.status = status;
        }

        if (sort?.field && sort?.sort) {
          params.sortBy = sort.field;
          params.sortOrder = sort.sort;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/doctor-registration/getAllDoctorRegistrations`,
          {
            params,

            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : undefined,

            signal,
          }
        );

        const result = response.data;

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to fetch registrations."
          );
        }

        setRegistrations(
          Array.isArray(result?.data)
            ? result.data
            : []
        );

        setTotal(Number(result?.total) || 0);
      } catch (error) {
        if (
          error?.name === "CanceledError" ||
          error?.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(
          "Registration API Error:",
          error
        );

        setRegistrations([]);

        showMessage(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load registrations.",
          "error"
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [
      page,
      rowsPerPage,
      debouncedSearch,
      status,
      sortModel,
    ]
  );

  // =========================
  // GET STATS
  // =========================

  const fetchStats = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API_BASE_URL}/api/doctor-registration/stats`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        }
      );

      const result = response.data;

      if (result?.success) {
        setStats({
          total_registered:
            Number(
              result.data?.total_registered
            ) || 0,

          total_submitted:
            Number(
              result.data?.total_submitted
            ) || 0,

          total_draft:
            Number(result.data?.total_draft) ||
            0,

          total_verified:
            Number(
              result.data?.total_verified
            ) || 0,

          total_rejected:
            Number(
              result.data?.total_rejected
            ) || 0,
        });
      }
    } catch (error) {
      console.error(
        "Registration Stats API Error:",
        error?.response?.data || error
      );
    }
  }, []);

  // =========================
  // FETCH LIST
  // =========================

  useEffect(() => {
    const controller = new AbortController();

    fetchRegistrations(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchRegistrations]);

  // Stats don't need to reload on every page
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    await Promise.all([
      fetchRegistrations(),
      fetchStats(),
    ]);

    showMessage(
      "Registration data refreshed.",
      "success"
    );
  };

  // =========================
  // DOCUMENTS
  // =========================

  const openDocuments = (doctor) => {
    setSelectedDoctor(doctor);
    setDocumentDialog(true);
  };

  const closeDocuments = () => {
    if (assigning) return;

    setDocumentDialog(false);
    setSelectedDoctor(null);
  };

  // =========================
  // FILE URL
  // =========================

  const getFileUrl = (path) => {
    if (!path) return "#";

    if (
      path.startsWith("http://") ||
      path.startsWith("https://")
    ) {
      return path;
    }

    const cleanPath = path.replace(/^\//, "");

    return `${S3_BUCKET_URL}/${cleanPath}`;
  };

  // =========================
  // ASSIGN DOCTOR
  // =========================

  const handleAssignDoctor = async (doctor) => {
    if (!doctor || assigning) return;

    try {
      setAssigning(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        showMessage(
          "Authentication token not found.",
          "error"
        );
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
            "Content-Type":
              "application/json",
          },
        }
      );

      const result = response.data;

      if (!result?.success) {
        throw new Error(
          result?.message ||
            "Unable to assign doctor."
        );
      }

      setDocumentDialog(false);
      setSelectedDoctor(null);

      showMessage(
        result?.message ||
          "Doctor assigned successfully.",
        "success"
      );

      // Refresh current data
      await Promise.all([
        fetchRegistrations(),
        fetchStats(),
      ]);
    } catch (error) {
      console.error(
        "Assign Doctor API Error:",
        error?.response?.data || error
      );

      showMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong while assigning doctor.",
        "error"
      );
    } finally {
      setAssigning(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <Box
      sx={{
       pt: 9,

  px: {
    xs: 1.5,
    sm: 2.5,
  },

        borderRadius: 2,

        bgcolor: "white",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          mb: 2.5,

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

          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "18px",
                sm: "20px",
              },

              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Doctor Registration
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              fontSize: "12px",
              color: "text.secondary",
            }}
          >
            Manage and review doctor registration
            applications
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={
            <RefreshRoundedIcon
              sx={{ fontSize: 17 }}
            />
          }
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            height: 36,
            px: 1.8,

            borderRadius: 1.5,

            textTransform: "none",
            fontSize: "12px",
            fontWeight: 600,

            borderColor: "divider",
            color: "text.primary",

            "&:hover": {
              borderColor: "primary.main",
              color: "primary.main",
              bgcolor: "action.hover",
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

        page={page}
        setPage={setPage}

        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}

        total={total}

        search={search}
        setSearch={setSearch}

        status={status}
        setStatus={setStatus}

        sortModel={sortModel}
        setSortModel={setSortModel}

        onViewDocuments={openDocuments}
      />

      {/* DOCUMENT DIALOG */}
      <DocumentDialog
        open={documentDialog}
        onClose={closeDocuments}
        selectedDoctor={selectedDoctor}
        getFileUrl={getFileUrl}
        onAssignDoctor={handleAssignDoctor}
        assigning={assigning}
      />

      {/* MESSAGE */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
          sx={{
            fontSize: "12px",
            borderRadius: 1.5,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}