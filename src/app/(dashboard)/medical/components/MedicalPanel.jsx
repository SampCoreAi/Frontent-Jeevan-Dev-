"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../utils/axiosInstance";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import LabDashboard from "../../lab/components/LabDashboard";
import MedicalProfile from "./MedicalProfile";
import MedicalConnections from "./MedicalConnections";
import MedicalRequests from "./MedicalRequests";
import MedicalReports from "./MedicalReports";

const getRows = (response) => response?.data?.data || [];
const getErrorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

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
  const [tableFilters, setTableFilters] = useState({ search: "", status: "", date: "" });
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;

  const loadProfile = async () => {
    const response = await api.get("/api/medical-stores/profile");
    let loggedInUser = {};
    try {
      loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      loggedInUser = {};
    }
    setProfile({
      ...(response?.data?.data || {}),
      full_name: loggedInUser.full_name || loggedInUser.name || "Medical User",
      email: loggedInUser.email || "",
    });
  };

  const loadConnections = async () => {
    const response = await api.get("/api/medical-stores/connections", {
      params: {
        search: tableFilters.search || undefined,
        status: tableFilters.status || undefined,
        date: tableFilters.date || undefined,
      },
    });
    setConnections(getRows(response));
  };

  const loadRequests = async () => {
    const response = await api.get("/api/medical-requests/medical-store", {
      params: {
        search: tableFilters.search || undefined,
        status: tableFilters.status || undefined,
        date: tableFilters.date || undefined,
      },
    });
    setRequests(getRows(response));
  };

  const loadReports = async () => {
    const response = await api.get("/api/medical-reports", {
      params: {
        search: tableFilters.search || undefined,
        date: tableFilters.date || undefined,
      },
    });
    setReports(getRows(response));
  };

  const loadSection = async () => {
    try {
      setLoading(true);
      setError("");
      if (section === "connections") await Promise.all([loadProfile(), loadConnections()]);
      else if (section === "requests") await Promise.all([loadProfile(), loadRequests(), loadReports()]);
      else if (section === "reports") await Promise.all([loadProfile(), loadReports()]);
      else if (section === "profile") await loadProfile();
      else await loadProfile();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load medical dashboard data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status]);

  useEffect(() => {
    setTablePage(1);
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status]);

  const stats = useMemo(
    () => ({
      connections: connections.length,
      requests: requests.length,
      pending: requests.filter((request) => String(request.status || "").toUpperCase() === "PENDING").length,
      reports: reports.length,
    }),
    [connections, requests, reports]
  );

  const handleFilter = (field) => (value) => {
    setTableFilters((current) => ({ ...current, [field]: value }));
  };

  const updateConnection = async (connectionId, status) => {
    try {
      setActionId(connectionId);
      await api.patch(`/api/medical-stores/connections/${connectionId}/status`, { status });
      setConnections((items) => items.map((item) => (
        (item.connection_id || item.id) === connectionId ? { ...item, status } : item
      )));
      setNotice(`Connection ${status.toLowerCase()}.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update connection."));
    } finally {
      setActionId(null);
    }
  };

  const updateRequest = async (requestId, status, note = null, details = {}) => {
    try {
      setActionId(requestId);
      const response = await api.patch(`/api/medical-requests/${requestId}/status`, {
        status,
        note,
        totalAmount: details.totalAmount,
        batchNumber: details.batchNumber,
        expiryDate: details.expiryDate,
        unitPrice: details.unitPrice,
        gstRate: details.gstRate,
        amount: details.amount,
        medicines: details.invoiceItems,
      });
      const updatedRequest = response?.data?.data || {};
      setRequests((items) => items.map((item) => item.id === requestId ? {
        ...item,
        ...updatedRequest,
        status,
        note,
        total_amount: details.totalAmount ?? item.total_amount,
        batch_number: details.batchNumber || item.batch_number,
        expiry_date: details.expiryDate || item.expiry_date,
        unit_price: details.unitPrice ?? item.unit_price,
        gst_rate: details.gstRate ?? item.gst_rate,
        amount: details.amount ?? item.amount,
        invoice_number: updatedRequest.invoice_number || item.invoice_number,
      } : item));
      setNotice("Medical request status updated.");
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to update medical request.");
      setError(message);
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
  };

  const content = section === "connections" ? (
    <MedicalConnections connections={connections} loading={loading} filters={filterProps} page={tablePage} pageSize={pageSize} onPageChange={setTablePage} actionId={actionId} onStatusUpdate={updateConnection} />
  ) : section === "requests" ? (
    <MedicalRequests requests={requests} reports={reports} loading={loading} filters={filterProps} page={tablePage} pageSize={pageSize} onPageChange={setTablePage} actionId={actionId} onStatusUpdate={updateRequest} />
  ) : section === "reports" ? (
    <MedicalReports reports={reports} loading={loading} filters={filterProps} page={tablePage} pageSize={pageSize} onPageChange={setTablePage} />
  ) : section === "profile" ? (
    <MedicalProfile profile={profile} />
  ) : (
    <LabDashboard profile={profile} stats={stats} variant="medical" onNavigate={(path) => router.push(path)} />
  );

  return (
    <Box className="lab-workspace" sx={{ mt: { xs: 7, md: 8 } }}>
      {loading && section === "dashboard" ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress sx={{ color: "#0b5c8e" }} />
        </Box>
      ) : null}
      {!loading || section !== "dashboard" ? content : null}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")}>
        <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>
      </Snackbar>
    </Box>
  );
}
