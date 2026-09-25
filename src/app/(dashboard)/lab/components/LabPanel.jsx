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
import LabTechnicians from "./LabTechnicians";
import { createWalkInLabTestRequest } from "../services/labRequestApi";

const getRows = (response) => response.data?.data || [];
const getErrorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

export default function LabPanel({ section = "dashboard" }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [actionField, setActionField] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [requestUpdateFeedback, setRequestUpdateFeedback] = useState({ type: "", message: "" });
  const [tableFilters, setTableFilters] = useState({ search: "", status: "", date: "" });
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [requestPagination, setRequestPagination] = useState(null);
  const [reportPagination, setReportPagination] = useState(null);
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
      params: {
        search: tableFilters.search || undefined,
        status: tableFilters.status || undefined,
        date: tableFilters.date || undefined,
        page: tablePage,
        pageSize,
        pendingUpload: showDelayedOnly || undefined,
        delayedUpload: showDelayedOnly || undefined,
      },
    });
    setRequests(getRows(response));
    setRequestPagination(response.data?.pagination || null);
  };

  const loadReports = async () => {
    const response = await api.get("/api/lab-reports", {
      params: {
        search: tableFilters.search || undefined,
        date: tableFilters.date || undefined,
        page: tablePage,
        pageSize,
      },
    });
    setReports(getRows(response));
    setReportPagination(response.data?.pagination || null);
  };

  const loadTechnicians = async () => {
    const response = await api.get("/api/lab-technicians");
    setTechnicians(getRows(response));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile((current) => ({
      ...(current || {}),
      ...(updatedProfile || {}),
      weekly_hours: updatedProfile?.weekly_hours ?? updatedProfile?.weeklyHours ?? current?.weekly_hours ?? {},
      slot_duration_minutes: updatedProfile?.slot_duration_minutes ?? updatedProfile?.slotDurationMinutes ?? current?.slot_duration_minutes ?? 30,
    }));
  };

  const loadSection = async () => {
    try {
      setLoading(true);
      setError("");
      if (section === "connections") await Promise.all([loadProfile(), loadConnections()]);
      else if (section === "technicians") await Promise.all([loadProfile(), loadTechnicians()]);
      else if (section === "requests") await Promise.all([loadProfile(), loadRequests(), loadReports(), loadTechnicians()]);
      else if (section === "reports") await Promise.all([loadProfile(), loadReports()]);
      else await Promise.all([loadProfile(), loadConnections(), loadRequests(), loadReports()]);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load lab data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSection();
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status, showDelayedOnly, tablePage]);

  useEffect(() => {
    setTablePage(1);
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status, showDelayedOnly]);

  const isDelayedUploadPending = (request) => {
    const status = String(request?.status || "").toUpperCase();
    if (["REPORT_READY", "REPORT_UPLOADED", "COMPLETED"].includes(status)) return false;

    const rawDate = request?.expected_report_at || request?.expectedReportAt;
    if (!rawDate) return false;

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) return false;

    return parsedDate.getTime() <= Date.now();
  };

  const delayedUploadCount = useMemo(
    () => requests.filter(isDelayedUploadPending).length,
    [requests]
  );

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
      setActionField("status");
      await api.patch(`/api/labs/connections/${connectionId}/status`, { status });
      setConnections((items) => items.map((item) => item.connection_id === connectionId ? { ...item, status } : item));
      setNotice(`Connection ${status.toLowerCase()}.`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to update connection."));
    } finally {
      setActionId(null);
      setActionField(null);
    }
  };

  const updateRequest = async (requestId, status, expectedReportAt = null, note = null) => {
    try {
      setActionId(requestId);
      setActionField("status");
      setRequestUpdateFeedback({ type: "info", message: status === "REJECTED" || status === "CANCELLED" ? "Submitting rejection reason..." : "Updating report delivery time..." });
      await api.patch(`/api/lab-requests/${requestId}/status`, { status, expectedReportAt: expectedReportAt || null, note: note || null });
      await loadRequests();
      setRequestUpdateFeedback({ type: "success", message: status === "REJECTED" || status === "CANCELLED" ? "Reason submitted successfully." : "Report delivery time updated successfully." });
      setNotice("Test request status updated.");
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to update request.");
      setRequestUpdateFeedback({ type: "error", message: `Update failed: ${message}` });
      setError(message);
    } finally {
      setActionId(null);
      setActionField(null);
    }
  };

  const updateReportDate = async (requestId, expectedReportAt) => {
    try {
      setActionId(requestId);
      setActionField("reportDate");
      await api.patch(`/api/lab-requests/${requestId}/report-date`, { expectedReportAt });
      setRequests((items) => items.map((item) => (
        item.id === requestId ? { ...item, expected_report_at: expectedReportAt } : item
      )));
      setRequestUpdateFeedback({ type: "success", message: "Report delivery time updated successfully." });
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to update report delivery time.");
      setRequestUpdateFeedback({ type: "error", message: `Update failed: ${message}` });
      setError(message);
    } finally {
      setActionId(null);
      setActionField(null);
    }
  };

  const updateCollectionDetails = async (requestId, collectionDate, collectionInstructions) => {
    try {
      setActionId(requestId);
      setActionField("collection");
      const response = await api.patch(`/api/lab-requests/${requestId}/collection-details`, {
        collectionDate,
        collectionInstructions: collectionInstructions?.trim() || null,
      });
      const saved = response.data?.data || {};
      setRequests((items) => items.map((item) => (
        item.id === requestId
          ? {
              ...item,
              collection_slot: saved.collectionSlot || item.collection_slot,
              collection_instructions: saved.collectionInstructions || item.collection_instructions,
              collection_token: saved.collectionToken || item.collection_token,
            }
          : item
      )));
      setRequestUpdateFeedback({ type: "success", message: `Collection details saved. Token ${saved.collectionToken}, time ${saved.collectionSlot}.` });
      return true;
    } catch (requestError) {
      const message = getErrorMessage(requestError, "Unable to update collection details.");
      setRequestUpdateFeedback({ type: "error", message: `Update failed: ${message}` });
      setError(message);
      return false;
    } finally {
      setActionId(null);
      setActionField(null);
    }
  };

  const assignTechnician = async (requestId, technicianEmail) => {
    try {
      setActionId(requestId);
      setActionField("technician");
      await api.patch(`/api/lab-technicians/${requestId}/assign`, { technicianEmail });
      await loadRequests();
      setNotice("Technician assigned and task email sent.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to assign technician."));
    } finally {
      setActionId(null);
      setActionField(null);
    }
  };

  const createTechnician = async (payload) => {
    await api.post("/api/lab-technicians", payload);
    await loadTechnicians();
    setNotice("Technician added and login credentials sent by email.");
  };

  const createLabRequest = async ({ fullName, email, phoneNumber, referringDoctorName, referringDoctorPhone, tests, sampleType, priority, requestType }) => {
    try {
      if (!profile?.id) throw new Error("Lab profile is not loaded yet.");
      const created = await createWalkInLabTestRequest({
        labId: Number(profile.id),
        fullName,
        email,
        phoneNumber,
        referringDoctorName,
        referringDoctorPhone,
        tests,
        sampleType,
        priority,
        requestType,
      });
      await loadRequests();
      setNotice(`${requestType === "WALK_IN" ? "Walk-in" : "Independent"} test request created. Patient ID: ${created.patientId}.`);
      return {
        success: true,
        patientId: created.patientId,
        requestId: created.requestId,
        orderId: created.orderId,
        request: created.request,
      };
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create test request."));
      return { success: false, message: getErrorMessage(requestError, "Unable to create test request.") };
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
      return { success: true };
    } catch (requestError) {
      return {
        success: false,
        message: getErrorMessage(requestError, "Unable to upload report."),
      };
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
    <LabRequests
      reports={reports}
      requests={requests}
      loading={loading}
      filters={filterProps}
      page={tablePage}
      pageSize={pageSize}
      onPageChange={setTablePage}
      pagination={requestPagination}
      actionId={actionId}
      actionField={actionField}
      onStatusUpdate={updateRequest}
      onReportDateUpdate={updateReportDate}
      onCollectionDetailsUpdate={updateCollectionDetails}
      uploading={uploading}
      onUploadReport={uploadReport}
      onDeleteReport={deleteReport}
      updateFeedback={requestUpdateFeedback}
      pendingUploadCount={delayedUploadCount}
      showDelayedOnly={showDelayedOnly}
      onToggleDelayedUpload={() => setShowDelayedOnly((value) => !value)}
      technicians={technicians}
      onAssignTechnician={assignTechnician}
      onCreateRequest={createLabRequest}
    />
  ) : section === "reports" ? (
    <LabReports reports={reports} loading={loading} filters={filterProps} page={tablePage} pageSize={pageSize} onPageChange={setTablePage} pagination={reportPagination} />
  ) : section === "profile" ? (
    <LabProfile profile={profile} onProfileUpdate={handleProfileUpdate} />
  ) : section === "technicians" ? (
    <LabTechnicians technicians={technicians} loading={loading} onCreate={createTechnician} />
  ) : (
    <LabDashboard profile={profile} stats={stats} onNavigate={(path) => router.push(path)} />
  );

  return (
    <Box  sx={{ pt:12,px:3, backgroundColor:"white"  }}>
      {loading && section === "dashboard" ? <Box display="flex" justifyContent="center" py={8}><CircularProgress sx={{ color: "#0b5c8e" }} /></Box> : null}
      {!loading || section !== "dashboard" ? content : null}
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}><Alert severity="error" onClose={() => setError("")}>{error}</Alert></Snackbar>
      <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")}><Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert></Snackbar>
    </Box>
  );
}
