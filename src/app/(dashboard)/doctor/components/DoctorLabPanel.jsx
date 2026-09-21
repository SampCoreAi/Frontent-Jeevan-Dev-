"use client";

import { useEffect, useMemo, useState } from "react";
import api from "../../../../utils/axiosInstance";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Pagination,
  Snackbar,
  Stack,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { DataTable, SectionTitle, TableFilters } from "../../lab/components/LabUi";
import LabReports from "../../lab/components/LabReports";

const getRows = (response) => response?.data?.data || [];
const getErrorMessage = (error, fallback) => error.response?.data?.message || error.message || fallback;

const getSearchResultRows = (response) => {
  const payload = response?.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.labs)) return payload.labs;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.rows)) return payload.rows;

  return [];
};

const normalizeLab = (lab = {}) => ({
  ...lab,
  id: lab.id || lab.lab_id || lab.labId,
  lab_name: lab.lab_name || lab.name || lab.labName || lab.lab || "-",
  lab_code: lab.lab_code || lab.code || lab.labCode || "-",
  phone_number: lab.phone_number || lab.phone || lab.contact_number || lab.mobile || "-",
  address: lab.address || lab.location || lab.city || lab.area || lab.address_line || "-",
});

export default function DoctorLabPanel({ section = "connections" }) {
  const [labs, setLabs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [tableFilters, setTableFilters] = useState({ search: "", status: "", date: "" });
  const [tablePage, setTablePage] = useState(1);
  const pageSize = 10;
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadLabs = async () => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setLabs([]);
      return;
    }

    try {
      const response = await api.get("/api/labs/search", {
        params: {
          q: trimmed,
          search: trimmed,
          name: trimmed,
          location: trimmed,
          address: trimmed,
          city: trimmed,
          code: trimmed,
        },
      });

      const rawLabs = getSearchResultRows(response).map(normalizeLab);
      const query = trimmed.toLowerCase();
      const filteredLabs = rawLabs.filter((lab) => {
        const haystack = [
          lab.lab_name,
          lab.lab_code,
          lab.address,
          lab.location,
          lab.phone_number,
          lab.email,
          lab.city,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(query);
      });

      setLabs(filteredLabs.length ? filteredLabs : rawLabs);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to search labs."));
    }
  };

  const loadConnections = async () => {
    try {
      const response = await api.get("/api/labs/doctor/connections");
      setConnections(getRows(response));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load your lab connections."));
    }
  };

  const loadRequests = async () => {
    try {
      const response = await api.get("/api/lab-requests/doctor", {
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
    const timeout = setTimeout(() => {
      if (section === "connections") loadLabs();
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText, section]);

  useEffect(() => {
    const loadBySection = async () => {
      try {
        setLoading(true);
        setError("");

        if (section === "connections") {
          await Promise.all([loadConnections()]);
        } else if (section === "requests") {
          await loadRequests();
        } else if (section === "reports") {
          await Promise.all([loadRequests(), loadReports()]);
        }
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Unable to load doctor lab data."));
      } finally {
        setLoading(false);
      }
    };

    loadBySection();
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status]);

  useEffect(() => {
    setTablePage(1);
  }, [section, tableFilters.date, tableFilters.search, tableFilters.status]);

  const handleFilter = (field) => (value) => {
    setTableFilters((current) => ({ ...current, [field]: value }));
  };

  const handleConnectLab = async (labId) => {
    try {
      setConnectingId(labId);
      setError("");
      await api.post("/api/labs/connect", { labId });
      setNotice("Lab connection request sent successfully.");
      setSearchText("");
      setLabs([]);
      await loadConnections();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to send lab connection request."));
    } finally {
      setConnectingId(null);
    }
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

  const visibleConnections = connections.slice((tablePage - 1) * pageSize, tablePage * pageSize);
  const visibleRequests = requests.slice((tablePage - 1) * pageSize, tablePage * pageSize);
  const reportRows = useMemo(() => {
    const uploadedRequestIds = new Set(
      reports.map((report) => Number(report.requestId || report.testRequestId || report.test_request_id))
    );
    const pendingRequests = requests
      .filter((request) => !uploadedRequestIds.has(Number(request.id)))
      .map((request) => {
        let requestedTests = request.requested_tests || "-";
        if (typeof requestedTests === "string") {
          try {
            const parsed = JSON.parse(requestedTests);
            if (Array.isArray(parsed)) requestedTests = parsed.join(", ");
          } catch {
            // Keep the original value when the API returns plain text.
          }
        }

        return {
          id: `request-${request.id}`,
          requestId: request.id,
          patientName: request.patient_name,
          labName: request.lab_name,
          testName: requestedTests,
          status: request.status || "PENDING",
          createdAt: request.created_at,
        };
      });

    return [...reports, ...pendingRequests];
  }, [reports, requests]);

  if (section === "connections") {
    return (
      <Box sx={{ mt: { xs: 7, md: 8 }, display: "grid", gap: 3 }}>
        <Box>
          <SectionTitle title="Lab Connections" description="Search labs and send a connection request." />
          <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
            <TextField
              size="small"
              label="Search by name, code, city or location"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              sx={{
                maxWidth: 420,
                '& .MuiInputLabel-root': {
                  color: '#1f3a4a',
                  fontWeight: 600,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#0b5c8e',
                },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#fff',
                  borderRadius: 1.5,
                  '& fieldset': {
                    borderColor: '#cfe0ea',
                  },
                  '&:hover fieldset': {
                    borderColor: '#8eb7d1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0b5c8e',
                  },
                },
              }}
            />
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} sx={{ color: "#0b5c8e" }} /></Box>
            ) : labs.length ? (
              <DataTable
                columns={["LAB", "CODE", "PHONE", "ADDRESS", "ACTION"]}
                loading={false}
                emptyMessage="No labs found."
                footer={null}
              >
                {labs.map((lab) => (
                  <TableRow key={lab.id} hover>
                    <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{lab.lab_name || "-"}</TableCell>
                    <TableCell sx={{ color: "#1f2937 !important" }}>{lab.lab_code || "-"}</TableCell>
                    <TableCell sx={{ color: "#1f2937 !important" }}>{lab.phone_number || "-"}</TableCell>
                    <TableCell sx={{ color: "#64748b !important" }}>{lab.address || lab.location || "-"}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={connectingId === lab.id}
                        onClick={() => handleConnectLab(lab.id)}
                      >
                        {connectingId === lab.id ? "Sending..." : "Connect"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </DataTable>
            ) : null}
          </Box>
        </Box>

        <Box>
          <SectionTitle title="My Connections" description="Track your lab connection requests and current status." />
          <DataTable
            columns={["LAB", "CODE", "STATUS", "REQUESTED", "APPROVED"]}
            loading={loading}
            emptyMessage="No lab connections found."
            footer={<Pagination count={Math.max(1, Math.ceil(connections.length / pageSize))} page={tablePage} onChange={(_, value) => setTablePage(value)} size="small" color="primary" />}
          >
            {visibleConnections.length ? visibleConnections.map((connection) => (
              <TableRow key={connection.connection_id} hover>
                <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{connection.lab_name || "-"}</TableCell>
                <TableCell sx={{ color: "#1f2937 !important" }}>{connection.lab_code || "-"}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={connection.status || "PENDING"}
                    color={connection.status === "APPROVED" ? "success" : connection.status === "REJECTED" ? "error" : "warning"}
                  />
                </TableCell>
                <TableCell sx={{ color: "#64748b !important" }}>{connection.requested_at ? new Date(connection.requested_at).toLocaleDateString() : "-"}</TableCell>
                <TableCell sx={{ color: "#64748b !important" }}>{connection.approved_at ? new Date(connection.approved_at).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
            )) : null}
          </DataTable>
        </Box>

        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError("")}>
          <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
        </Snackbar>
        <Snackbar open={Boolean(notice)} autoHideDuration={3500} onClose={() => setNotice("")}>
          <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>
        </Snackbar>
      </Box>
    );
  }

  if (section === "requests") {
    return (
      <Box sx={{ mt: { xs: 7, md: 8 }, display: "grid", gap: 3 }}>
        <SectionTitle title="Lab Requests" description="View your patient test requests and their status." />
        <TableFilters {...filterProps} statusOptions={["PENDING", "APPROVED", "REJECTED", "SAMPLE_COLLECTED", "PROCESSING", "REPORT_UPLOADED", "COMPLETED", "CANCELLED"]} />
        <DataTable
          columns={["PATIENT", "LAB", "TESTS", "PRIORITY", "STATUS", "CREATED"]}
          loading={loading}
          emptyMessage="No lab requests found."
          footer={<Pagination count={Math.max(1, Math.ceil(requests.length / pageSize))} page={tablePage} onChange={(_, value) => setTablePage(value)} size="small" color="primary" />}
        >
          {visibleRequests.length ? visibleRequests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{request.patient_name || request.patient_id || "-"}</TableCell>
              <TableCell sx={{ color: "#1f2937 !important" }}>{request.lab_name || "-"}</TableCell>
              <TableCell sx={{ color: "#1f2937 !important", maxWidth: 240, whiteSpace: "normal" }}>{Array.isArray(request.requested_tests) ? request.requested_tests.join(", ") : request.requested_tests || "-"}</TableCell>
              <TableCell><Chip size="small" label={request.priority || "NORMAL"} color={request.priority === "URGENT" ? "error" : "default"} /></TableCell>
              <TableCell><Chip size="small" label={request.status || "PENDING"} color={request.status === "COMPLETED" ? "success" : request.status === "REJECTED" ? "error" : "warning"} /></TableCell>
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

  if (section === "reports") {
    return (
      <Box sx={{ mt: { xs: 7, md: 8 } }}>
        <LabReports
          reports={reportRows}
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

  return null;
}
