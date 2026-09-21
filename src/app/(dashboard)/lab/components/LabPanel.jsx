"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../utils/axiosInstance";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import LabDashboard from "./LabDashboard";
import LabProfile from "./LabProfile";
import LabConnections from "./LabConnections";
import LabRequests from "./LabRequests";
import LabReports from "./LabReports";

const getRows = (response) => response.data?.data || [];
const getErrorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

export default function LabPanel({ section = "dashboard" }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [requestUpdateFeedback, setRequestUpdateFeedback] = useState({ type: "", message: "" });
  const [tableFilters, setTableFilters] = useState({ search: "", status: "", date: "" });
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;

  const loadProfile = async () => {
    const response = await api.get("/api/labs/getLabProfile");
    let loggedInUser = {};
    try {
      loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      loggedInUser = {};
    }
    setProfile({
      ...(response.data?.data || {}),
      full_name: loggedInUser.full_name,
      email: loggedInUser.email,
    });
  };

  const loadConnections = async () => {
    const response = await api.get("/api/labs/connections", {
      params: { search: tableFilters.search || undefined, status: tableFilters.status || undefined, date: tableFilters.date || undefined },
    });
    setConnections(getRows(response));
  };

  const loadRequests = async () => {
    const response = await api.get("/api/lab-requests/lab", {
      params: { search: tableFilters.search || undefined, status: tableFilters.status || undefined, date: tableFilters.date || undefined },
    });
    setRequests(getRows(response));
  };

  const loadReports = async () => {
    const response = await api.get("/api/lab-reports", {
      params: { search: tableFilters.search || undefined, date: tableFilters.date || undefined },
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
      else await loadProfile();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load lab data."));
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

  const stats = useMemo(() => ({
    connections: connections.length,
    requests: requests.length,
    pending: requests.filter((request) => request.status === "PENDING").length,
    reports: reports.length,
  }), [connections, requests, reports]);

  const handleFilter = (field) => (value) => {
    setTableFilters((current) => ({ ...current, [field]: value }));
  };

  const updateConnection = async (connectionId, status) => {
    try {
      setActionId(connectionId);
      await api.patch(`/api/labs/connections/${connectionId}/status`, { status });
      setConnections((items) => items.map((item) => item.connection_id === connectionId ? { ...item, status } : item));
      setNotice(`Connection ${status.toLowerCase()}.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update connection."));
    } finally {
      setActionId(null);
    }
  };

  const updateRequest = async (requestId, status, expectedReportAt = null, note = null) => {
    try {
      setActionId(requestId);
      setRequestUpdateFeedback({ type: "info", message: status === "REJECTED" || status === "CANCELLED" ? "Submitting rejection reason..." : "Updating report delivery time..." });
      await api.patch(`/api/lab-requests/${requestId}/status`, { status, expectedReportAt: expectedReportAt || null, note: note || null });
      setRequests((items) => items.map((item) => item.id === requestId ? { ...item, status, expected_report_at: expectedReportAt || item.expected_report_at } : item));
      setRequestUpdateFeedback({ type: "success", message: status === "REJECTED" || status === "CANCELLED" ? "Reason submitted successfully." : "Report delivery time updated successfully." });
      setNotice("Test request status updated.");
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to update request.");
      setRequestUpdateFeedback({ type: "error", message: `Update failed: ${message}` });
      setError(message);
    } finally {
      setActionId(null);
    }
  };

  const uploadReport = async (requestId, file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("testRequestId", requestId);
      await api.post("/api/lab-reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setNotice("Report uploaded successfully.");
      await Promise.all([loadRequests(), loadReports()]);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to upload report."));
      throw requestError;
    } finally {
      setUploading(false);
    }
  };

  const deleteReport = async (reportId) => {
    try {
      setActionId(reportId);
      await api.delete(`/api/lab-reports/${reportId}`);
      setNotice("Report deleted successfully.");
      await loadReports();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to delete report."));
      throw requestError;
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
    <LabConnections connections={connections} loading={loading} filters={filterProps} page={tablePage} pageSize={pageSize} onPageChange={setTablePage} actionId={actionId} onStatusUpdate={updateConnection} />
  ) : section === "requests" ? (
    <LabRequests reports={reports} requests={requests} loading={loading} filters={filterProps} page={tablePage} pageSize={pageSize} onPageChange={setTablePage} actionId={actionId} onStatusUpdate={updateRequest} uploading={uploading} onUploadReport={uploadReport} onDeleteReport={deleteReport} updateFeedback={requestUpdateFeedback} />
  ) : section === "reports" ? (
    <LabReports reports={reports} loading={loading} filters={filterProps} page={tablePage} pageSize={pageSize} onPageChange={setTablePage} />
  ) : section === "profile" ? (
    <LabProfile profile={profile} />
  ) : (
    <LabDashboard profile={profile} stats={stats} onNavigate={(path) => router.push(path)} />
  );

  return (
    <Box className="lab-workspace" sx={{ mt: { xs: 7, md: 8 } }}>
      {loading && section === "dashboard" ? <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: "#0b5c8e" }} /></Box> : null}
      {!loading || section !== "dashboard" ? content : null}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}><Alert severity="error" onClose={() => setError("")}>{error}</Alert></Snackbar>
      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")}><Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert></Snackbar>
    </Box>
  );
}
