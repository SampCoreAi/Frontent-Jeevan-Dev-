"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../../utils/axiosInstance";
import {
  Alert,
  Box,
  Button,
  Chip,
  Pagination,
  Snackbar,
  TableCell,
  TableRow,
} from "@mui/material";
import { DataTable, SectionTitle, TableFilters } from "../../lab/components/LabUi";

const getRows = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  return payload?.data || payload?.results || payload?.items || payload?.rows || [];
};
const getErrorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;
const getRequestId = (item = {}) => item.requestId || item.testRequestId || item.test_request_id || item.request_id;
const getReportUrl = (report = {}) => report.downloadUrl || report.download_url || report.fileUrl || report.file_url || report.url || report.reportUrl || report.report_url;
const getValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") || "-";
const formatReportDateTime = (value) => value ? new Date(value).toLocaleString() : "-";
const getTestNames = (value) => {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value !== "string") return "-";
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join(", ") : value;
  } catch {
    return value;
  }
};

const normalizeReport = (report = {}) => ({
  ...report,
  requestId: getRequestId(report),
  downloadUrl: getReportUrl(report),
  fileName: getValue(report.originalFileName, report.original_file_name, report.fileName, report.file_name),
  labName: getValue(report.labName, report.lab_name),
  doctorName: getValue(report.doctorName, report.doctor_name),
  testName: getTestNames(report.testName || report.test_name || report.requestedTests || report.requested_tests),
  uploadedAt: report.uploadedAt || report.uploaded_at || report.createdAt || report.created_at,
});

export default function PatientLabPanel({ section = "requests" }) {
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tableFilters, setTableFilters] = useState({ search: "", status: "", date: "" });
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;

  const loadRequests = async () => {
    try {
      const response = await api.get("/api/lab-requests/patient", {
        params: {
          search: tableFilters.search || undefined,
          status: tableFilters.status || undefined,
          date: tableFilters.date || undefined,
        },
      });
      setRequests(getRows(response));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load lab requests."));
    }
  };

  const loadReports = async () => {
    try {
      const response = await api.get("/api/lab-reports", {
        params: {
          search: tableFilters.search || undefined,
          date: tableFilters.date || undefined,
        },
      });
      setReports(getRows(response).map(normalizeReport));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load lab reports."));
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([loadRequests(), loadReports()]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status]);

  useEffect(() => {
    setTablePage(1);
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status]);

  const handleFilter = (field) => (value) => {
    setTableFilters((current) => ({ ...current, [field]: value }));
  };

  const filterProps = useMemo(
    () => ({
      search: tableFilters.search,
      status: tableFilters.status,
      date: tableFilters.date,
      onSearch: handleFilter("search"),
      onStatus: handleFilter("status"),
      onDate: handleFilter("date"),
    }),
    [tableFilters]
  );

  const getRequestNote = (request = {}) => request.latest_status_note || request.latestStatusNote || request.status_note || request.note || request.reason || request.statusReason || "";
  const rows = useMemo(() => requests.map((request) => {
    const report = reports.find((item) => Number(item.requestId) === Number(request.id));

    return {
      ...request,
      report,
      labName: getValue(report?.labName, request.lab_name, request.labName),
      doctorName: getValue(report?.doctorName, request.doctor_name, request.doctorName),
      testName: getValue(report?.testName, getTestNames(request.requested_tests)),
    };
  }), [reports, requests]);
  const visibleRows = rows.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  return (
    <Box sx={{ mt: { xs: 7, md: 8 }, display: "grid", gap: 3 }}>
      <SectionTitle title="Lab Reports" description="Track your lab requests, lab details, status, and uploaded reports in one place." />
      <TableFilters {...filterProps} statusOptions={["PENDING", "APPROVED", "REJECTED", "SAMPLE_COLLECTED", "PROCESSING", "REPORT_UPLOADED", "COMPLETED", "CANCELLED"]} />
      <DataTable
        columns={["SNO", "LAB", "ADDRESS", "DOCTOR", "TESTS", "PRIORITY", "REPORT BY", "STATUS", "REASON", "REPORT", "UPLOADED"]}
        loading={loading}
        emptyMessage="No lab requests or reports found."
        footer={<Pagination count={Math.max(1, Math.ceil(rows.length / pageSize))} page={tablePage} onChange={(_, value) => setTablePage(value)} size="small" color="primary" />}
      >
        {visibleRows.length ? visibleRows.map((request, index) => (
          <TableRow key={request.id} hover>
            <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{(tablePage - 1) * pageSize + index + 1}</TableCell>
            <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{request.labName}</TableCell>
            <TableCell sx={{ color: "#64748b !important", maxWidth: 220, whiteSpace: "normal" }}>{getValue(request.lab_address, request.labAddress)}</TableCell>
            <TableCell sx={{ color: "#1f2937 !important" }}>{request.doctorName}</TableCell>
            <TableCell sx={{ color: "#1f2937 !important", maxWidth: 220, whiteSpace: "normal" }}>{request.testName}</TableCell>
            <TableCell><Chip size="small" label={request.priority || "NORMAL"} color={request.priority === "URGENT" ? "error" : "default"} /></TableCell>
            <TableCell sx={{ color: "#64748b !important", whiteSpace: "nowrap" }}>{formatReportDateTime(request.expected_report_at || request.expectedReportAt)}</TableCell>
            <TableCell><Chip size="small" label={request.status || "PENDING"} color={request.status === "COMPLETED" ? "success" : request.status === "REJECTED" || request.status === "CANCELLED" ? "error" : "info"} /></TableCell>
            <TableCell sx={{ color: "#64748b !important", maxWidth: 220, whiteSpace: "normal" }}>
              {(request.status === "REJECTED" || request.status === "CANCELLED") ? (getRequestNote(request) || "No reason provided.") : "-"}
            </TableCell>
            <TableCell>
              {request.report?.downloadUrl ? (
                <Button size="small" href={request.report.downloadUrl} target="_blank" rel="noreferrer" sx={{ textTransform: "none" }}>View</Button>
              ) : "Not uploaded"}
            </TableCell>
            <TableCell sx={{ color: "#64748b !important" }}>{request.report?.uploadedAt ? new Date(request.report.uploadedAt).toLocaleDateString() : "-"}</TableCell>
          </TableRow>
        )) : null}
      </DataTable>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
