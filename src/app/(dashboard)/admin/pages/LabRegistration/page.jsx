"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Typography,
} from "@mui/material";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import axios from "axios";

import RegistrationTable from "../../components/lab/registeration/RegistrationTable";
import LabRegistrationDetailsDialog from "../../components/lab/registeration/LabRegistrationDetailsDialog";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export default function Registration() {
  const [registrations, setRegistrations] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchRegistrations = useCallback(
    async (signal) => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        const params = { page: page + 1, limit: rowsPerPage };

        if (debouncedSearch) params.search = debouncedSearch;
        if (status) params.status = status;

        const response = await axios.get(
          `${API_BASE_URL}/api/lab-registration/getAllLabRegistrations`,
          {
            params,
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
            signal,
          }
        );

        const result = response.data;

        if (!result?.success) {
          throw new Error(
            result?.message || "Unable to fetch lab registrations."
          );
        }

        setRegistrations(Array.isArray(result.data) ? result.data : []);
        setTotal(Number(result.pagination?.total) || 0);
        return true;
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          return false;
        }

        setRegistrations([]);
        setTotal(0);
        showMessage(
          error.response?.data?.message ||
            error.message ||
            "Unable to load lab registrations.",
          "error"
        );
        return false;
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [page, rowsPerPage, debouncedSearch, status]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchRegistrations(controller.signal);

    return () => controller.abort();
  }, [fetchRegistrations]);

  const handleRefresh = async () => {
    const refreshed = await fetchRegistrations();

    if (refreshed) {
      showMessage("Lab registrations refreshed.");
    }
  };

  const openLabDetails = (lab) => {
    setSelectedLabId(lab?.id || null);
  };

  return (
    <Box
      sx={{
        pt: 9,
        px: { xs: 1.5, sm: 2.5 },
        borderRadius: 2,
        bgcolor: "white",
      }}
    >
      <Box
        sx={{
          mb: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Lab Registration
          </Typography>

          <Typography sx={{ mt: 0.4, fontSize: 12, color: "text.secondary" }}>
            Manage and review lab registration applications
          </Typography>
        </Box>

        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshRoundedIcon sx={{ fontSize: 17 }} />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            height: 36,
            px: 1.8,
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Refresh
        </Button>
      </Box>

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
        onViewDocuments={openLabDetails}
      />

      <LabRegistrationDetailsDialog
  open={Boolean(selectedLabId)}
  labId={selectedLabId}
  onClose={() => setSelectedLabId(null)}
  onActionSuccess={fetchRegistrations}
/>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((current) => ({ ...current, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((current) => ({ ...current, open: false }))
          }
          sx={{ fontSize: 12, borderRadius: 1.5 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}