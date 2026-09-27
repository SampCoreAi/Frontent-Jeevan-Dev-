"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  CircularProgress,
  Snackbar,
} from "@mui/material";

import api from "../../../../utils/axiosInstance";
import LabDashboard from "../../lab/components/LabDashboard";
import MedicalProfile from "./MedicalProfile";
import MedicalConnections from "./MedicalConnections";
import MedicalRequests from "./MedicalRequests";
import MedicalReports from "./MedicalReports";

const getRows = (response) => response?.data?.data || [];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

export default function MedicalPanel({ section = "dashboard" }) {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionId, setActionId] = useState(null);

  const [tableFilters, setTableFilters] = useState({
    search: "",
    status: "",
    date: "",
  });

  const [tablePage, setTablePage] = useState(1);

  const pageSize = 10;

  const loadProfile = async () => {
    const response = await api.get("/api/medical-stores/profile");

    let loggedInUser = {};

    try {
      loggedInUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );
    } catch {
      loggedInUser = {};
    }

    setProfile({
      ...(response?.data?.data || {}),
      full_name:
        loggedInUser.full_name ||
        loggedInUser.name ||
        "Medical User",
      email: loggedInUser.email || "",
    });
  };

  const loadConnections = async () => {
    const response = await api.get(
      "/api/medical-stores/connections",
      {
        params: {
          search: tableFilters.search || undefined,
          status: tableFilters.status || undefined,
          date: tableFilters.date || undefined,
        },
      }
    );

    setConnections(getRows(response));
  };

  const loadRequests = async () => {
    const response = await api.get(
      "/api/medical-requests/medical-store",
      {
        params: {
          search: tableFilters.search || undefined,
          status: tableFilters.status || undefined,
          date: tableFilters.date || undefined,
        },
      }
    );

    setRequests(getRows(response));
  };

  const loadReports = async () => {
    const response = await api.get(
      "/api/medical-requests/medical-store",
      {
        params: {
          search: tableFilters.search || undefined,
          status: tableFilters.status || "COMPLETED",
          date: tableFilters.date || undefined,
        },
      }
    );

    setReports(getRows(response));
  };

  const loadSection = async () => {
    try {
      setLoading(true);
      setError("");

      if (section === "connections") {
        await Promise.all([
          loadProfile(),
          loadConnections(),
        ]);
      } else if (section === "requests") {
        await Promise.all([
          loadProfile(),
          loadRequests(),
          loadReports(),
        ]);
      } else if (section === "reports") {
        await Promise.all([
          loadProfile(),
          loadReports(),
        ]);
      } else if (section === "profile") {
        await loadProfile();
      } else {
        await Promise.all([
          loadProfile(),
          loadConnections(),
          loadRequests(),
          loadReports(),
        ]);
      }
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to load medical dashboard data."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, [
    section,
    tableFilters.date,
    tableFilters.search,
    tableFilters.status,
  ]);

  useEffect(() => {
    setTablePage(1);
  }, [
    section,
    tableFilters.date,
    tableFilters.search,
    tableFilters.status,
  ]);

  const stats = useMemo(
    () => ({
      connections: connections.length,
      requests: requests.length,
      pending: requests.filter(
        (request) =>
          String(request.status || "").toUpperCase() ===
          "PENDING"
      ).length,
      reports: reports.length,
    }),
    [connections, requests, reports]
  );

  const handleFilter = (field) => (value) => {
    setTableFilters((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleResetFilters = () => {
    setTableFilters({
      search: "",
      status: "",
      date: "",
    });

    setTablePage(1);
  };

  const updateConnection = async (
    connectionId,
    status
  ) => {
    try {
      setActionId(connectionId);

      await api.patch(
        `/api/medical-stores/connections/${connectionId}/status`,
        { status }
      );

      setConnections((items) =>
        items.map((item) =>
          (item.connection_id || item.id) === connectionId
            ? { ...item, status }
            : item
        )
      );

      setNotice(
        `Connection ${status.toLowerCase()}.`
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to update connection."
        )
      );
    } finally {
      setActionId(null);
    }
  };

  const updateRequest = async (
    requestId,
    status,
    note = null,
    details = {}
  ) => {
    try {
      setActionId(requestId);

      const response = await api.patch(
        `/api/medical-requests/${requestId}/status`,
        {
          status,
          note,
          totalAmount: details.totalAmount,
          batchNumber: details.batchNumber,
          expiryDate: details.expiryDate,
          unitPrice: details.unitPrice,
          gstRate: details.gstRate,
          amount: details.amount,
        }
      );

      const updatedRequest =
        response?.data?.data || {};

      setRequests((items) =>
        items.map((item) => {
          if (item.id !== requestId) {
            return item;
          }

          return {
            ...item,
            ...updatedRequest,
            status,
            note,

            medicine_name:
              item.medicine_name ??
              updatedRequest.medicine_name,

            quantity:
              item.quantity ??
              updatedRequest.quantity,

            medicine_items:
              item.medicine_items ??
              updatedRequest.medicine_items,

            total_amount:
              details.totalAmount ??
              item.total_amount ??
              updatedRequest.total_amount,

            batch_number:
              details.batchNumber ||
              item.batch_number ||
              updatedRequest.batch_number,

            expiry_date:
              details.expiryDate ||
              item.expiry_date ||
              updatedRequest.expiry_date,

            unit_price:
              details.unitPrice ??
              item.unit_price ??
              updatedRequest.unit_price,

            gst_rate:
              details.gstRate ??
              item.gst_rate ??
              updatedRequest.gst_rate,

            amount:
              details.amount ??
              item.amount ??
              updatedRequest.amount,

            invoice_number:
              updatedRequest.invoice_number ||
              item.invoice_number,
          };
        })
      );

      setNotice(
        "Medical request status updated."
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          "Unable to update medical request."
        )
      );
    } finally {
      setActionId(null);
    }
  };

  const filterProps = {
    search: tableFilters.search,
    status: tableFilters.status,
    date: tableFilters.date,
    onSearch: handleFilter("search"),
    onStatus: handleFilter("status"),
    onDate: handleFilter("date"),
    onReset: handleResetFilters,
  };

  const renderContent = () => {
    switch (section) {
      case "connections":
        return (
          <MedicalConnections
            connections={connections}
            loading={loading}
            filters={filterProps}
            page={tablePage}
            pageSize={pageSize}
            onPageChange={setTablePage}
            actionId={actionId}
            onStatusUpdate={updateConnection}
          />
        );

      case "requests":
        return (
          <MedicalRequests
            requests={requests}
            reports={reports}
            loading={loading}
            filters={filterProps}
            page={tablePage}
            pageSize={pageSize}
            onPageChange={setTablePage}
            actionId={actionId}
            onStatusUpdate={updateRequest}
          />
        );

      case "reports":
        return (
          <MedicalReports
            reports={reports}
            loading={loading}
            filters={filterProps}
            page={tablePage}
            pageSize={pageSize}
            onPageChange={setTablePage}
          />
        );

      case "profile":
        return (
          <MedicalProfile profile={profile} />
        );

      default:
        return (
          <LabDashboard
            profile={profile}
            stats={stats}
            variant="medical"
            onNavigate={(path) =>
              router.push(path)
            }
          />
        );
    }
  };

  const dashboardLoading =
    loading && section === "dashboard";

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "calc(100vh - 64px)",
        mt: {
          xs: 7,
          md: 8,
        },
        bgcolor: "#F8FAF9",
      }}
    >
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          px: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
            lg: 3,
          },
          py: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
          },
        }}
      >
        {dashboardLoading ? (
          <Box
            sx={{
              minHeight: "65vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: 54,
                height: 54,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
              }}
            >
              <CircularProgress
                size={25}
                thickness={4}
                sx={{
                  color: "#07876A",
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              minWidth: 0,
            }}
          >
            {renderContent()}
          </Box>
        )}
      </Box>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          mt: {
            xs: 7,
            md: 8,
          },
        }}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{
            width: "100%",
            minWidth: {
              xs: "auto",
              sm: 320,
            },
            bgcolor: "#FFFFFF",
            color: "#172033",
            border: "1px solid #FECACA",
            borderRadius: "8px",
            fontSize: "12.5px",
            fontWeight: 500,
            alignItems: "center",

            "& .MuiAlert-icon": {
              color: "#DC2626",
            },
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3500}
        onClose={() => setNotice("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          mt: {
            xs: 7,
            md: 8,
          },
        }}
      >
        <Alert
          severity="success"
          onClose={() => setNotice("")}
          sx={{
            width: "100%",
            minWidth: {
              xs: "auto",
              sm: 320,
            },
            bgcolor: "#FFFFFF",
            color: "#172033",
            border: "1px solid #A7F3D0",
            borderRadius: "8px",
            fontSize: "12.5px",
            fontWeight: 500,
            alignItems: "center",

            "& .MuiAlert-icon": {
              color: "#07876A",
            },
          }}
        >
          {notice}
        </Alert>
      </Snackbar>
    </Box>
  );
}