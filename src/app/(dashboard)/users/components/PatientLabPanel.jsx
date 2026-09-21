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

const getRows = (response) => response?.data?.data || [];
const getErrorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;
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
      setReports(getRows(response));
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

  const rows = useMemo(() => requests.map((request) => ({
    ...request,
    report: reports.find((item) => Number(item.requestId || item.testRequestId || item.test_request_id) === Number(request.id)),
  })), [reports, requests]);
  const visibleRows = rows.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  return (
    <Box sx={{ mt: { xs: 7, md: 8 }, display: "grid", gap: 3 }}>
      <SectionTitle title="Lab Reports" description="Track your lab requests, lab details, status, and uploaded reports in one place." />
      <TableFilters {...filterProps} statusOptions={["PENDING", "APPROVED", "REJECTED", "SAMPLE_COLLECTED", "PROCESSING", "REPORT_UPLOADED", "COMPLETED", "CANCELLED"]} />
      <DataTable
        columns={["LAB", "ADDRESS", "TESTS", "PRIORITY", "STATUS", "REPORT", "DATE"]}
        loading={loading}
        emptyMessage="No lab requests or reports found."
        footer={<Pagination count={Math.max(1, Math.ceil(rows.length / pageSize))} page={tablePage} onChange={(_, value) => setTablePage(value)} size="small" color="primary" />}
      >
        {visibleRows.length ? visibleRows.map((request) => (
          <TableRow key={request.id} hover>
            <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{request.lab_name || "-"}</TableCell>
            <TableCell sx={{ color: "#64748b !important", maxWidth: 240, whiteSpace: "normal" }}>{request.lab_address || "-"}</TableCell>
            <TableCell sx={{ color: "#1f2937 !important", maxWidth: 220, whiteSpace: "normal" }}>{getTestNames(request.requested_tests)}</TableCell>
            <TableCell><Chip size="small" label={request.priority || "NORMAL"} color={request.priority === "URGENT" ? "error" : "default"} /></TableCell>
            <TableCell><Chip size="small" label={request.status || "PENDING"} color={request.status === "COMPLETED" ? "success" : request.status === "REJECTED" ? "error" : "warning"} /></TableCell>
            <TableCell>
              {request.report?.downloadUrl ? (
                <Button size="small" href={request.report.downloadUrl} target="_blank" rel="noreferrer" sx={{ textTransform: "none" }}>View / Download</Button>
              ) : "Not uploaded"}
            </TableCell>
            <TableCell sx={{ color: "#64748b !important" }}>{request.created_at ? new Date(request.created_at).toLocaleDateString() : "-"}</TableCell>
          </TableRow>
        )) : null}
      </DataTable>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
