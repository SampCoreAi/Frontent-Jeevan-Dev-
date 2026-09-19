"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../../utils/axiosInstance";
import {
  Alert,
  Box,
  Chip,
  Pagination,
  Snackbar,
  TableCell,
  TableRow,
} from "@mui/material";
import { DataTable, SectionTitle, TableFilters } from "../../lab/components/LabUi";
import LabReports from "../../lab/components/LabReports";

const getRows = (response) => response?.data?.data || [];
const getErrorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

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

        if (section === "requests") {
          await loadRequests();
        } else if (section === "reports") {
          await loadReports();
        }
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

  const visibleRequests = requests.slice((tablePage - 1) * pageSize, tablePage * pageSize);
  const visibleReports = reports.slice((tablePage - 1) * pageSize, tablePage * pageSize);

  if (section === "requests") {
    return (
      <Box sx={{ mt: { xs: 7, md: 8 }, display: "grid", gap: 3 }}>
        <SectionTitle title="Lab Requests" description="Track all lab test requests assigned to you." />
        <TableFilters {...filterProps} statusOptions={["PENDING", "APPROVED", "REJECTED", "SAMPLE_COLLECTED", "PROCESSING", "REPORT_UPLOADED", "COMPLETED"]} />
        <DataTable
          columns={["DOCTOR", "LAB", "TESTS", "PRIORITY", "STATUS", "CREATED"]}
          loading={loading}
          emptyMessage="No lab requests found."
          footer={<Pagination count={Math.max(1, Math.ceil(requests.length / pageSize))} page={tablePage} onChange={(_, value) => setTablePage(value)} size="small" color="primary" />}
        >
          {visibleRequests.length ? visibleRequests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{request.doctor_name || request.doctor_id || "-"}</TableCell>
              <TableCell sx={{ color: "#1f2937 !important" }}>{request.lab_name || "-"}</TableCell>
              <TableCell sx={{ color: "#1f2937 !important", maxWidth: 260, whiteSpace: "normal" }}>{Array.isArray(request.requested_tests) ? request.requested_tests.join(", ") : request.requested_tests || "-"}</TableCell>
              <TableCell>
                <Chip size="small" label={request.priority || "NORMAL"} color={request.priority === "URGENT" ? "error" : "default"} />
              </TableCell>
              <TableCell>
                <Chip size="small" label={request.status || "PENDING"} color={request.status === "COMPLETED" ? "success" : request.status === "REJECTED" ? "error" : "warning"} />
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

  return (
    <Box sx={{ mt: { xs: 7, md: 8 } }}>
      <LabReports
        reports={reports}
        loading={loading}
        filters={filterProps}
        page={tablePage}
        pageSize={pageSize}
        onPageChange={setTablePage}
      />
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
