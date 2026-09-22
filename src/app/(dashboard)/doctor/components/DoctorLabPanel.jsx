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

const normalizeMedicalStore = (store = {}) => ({
  ...store,
  id: store.id || store.store_id || store.medical_store_id || store.medicalStoreId,
  name: store.name || store.store_name || store.medical_store_name || store.medicalStoreName || "-",
  code: store.code || store.store_code || store.medical_store_code || store.medicalStoreCode || "-",
  phone: store.phone || store.phone_number || store.contact_number || store.mobile || "-",
  address: store.address || store.location || store.city || store.area || store.address_line || "-",
  city: store.city || store.location || store.area || "-",
});

export default function DoctorLabPanel({ section = "connections" }) {
  const [labs, setLabs] = useState([]);
  const [connections, setConnections] = useState([]);
  const [medicalStores, setMedicalStores] = useState([]);
  const [medicalConnections, setMedicalConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);
  const [connectingMedicalId, setConnectingMedicalId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [medicalSearchText, setMedicalSearchText] = useState("");
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

  const loadMedicalStores = async () => {
    const trimmed = medicalSearchText.trim();
    if (!trimmed) {
      setMedicalStores([]);
      return;
    }

    try {
      const response = await api.get("/api/medical-stores/search", {
        params: {
          q: trimmed,
          search: trimmed,
          name: trimmed,
          city: trimmed,
          address: trimmed,
          location: trimmed,
          code: trimmed,
        },
      });

      const rows = getRows(response);
      setMedicalStores(rows.length ? rows.map(normalizeMedicalStore) : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load medical stores."));
      setMedicalStores([]);
    }
  };

  const loadMedicalConnections = async () => {
    try {
      const response = await api.get("/api/medical-stores/doctor/connections");
      const rows = getRows(response);
      setMedicalConnections(rows);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load your medical connections."));
      setMedicalConnections([]);
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
    const timeout = setTimeout(() => {
      if (section === "connections") loadMedicalStores();
    }, 300);
    return () => clearTimeout(timeout);
  }, [medicalSearchText, section]);

  useEffect(() => {
    const loadBySection = async () => {
      try {
        setLoading(true);
        setError("");

        if (section === "connections") {
          await Promise.all([loadConnections(), loadMedicalConnections()]);
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

  const handleConnectMedicalStore = async (storeId) => {
    try {
      setConnectingMedicalId(storeId);
      setError("");

      const response = await api.post("/api/medical-stores/connect", { storeId });

      if (response?.status === 200 || response?.status === 201) {
        setNotice("Medical connection request sent successfully.");
        setMedicalSearchText("");
        setMedicalStores([]);
        await loadMedicalConnections();
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to send medical connection request."));
    } finally {
      setConnectingMedicalId(null);
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

  const getRequestNote = (request = {}) => request.latest_status_note || request.latestStatusNote || request.status_note || request.note || request.reason || request.statusReason || "";
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
    const connectionCardSx = {
      border: "1px solid #dfeaf3",
      borderRadius: 2,
      background: "#fff",
      p: 1.75,
      boxShadow: "0 1px 0 rgba(15, 23, 42, 0.02)",
    };

    const compactButtonSx = {
      minHeight: 30,
      px: 1.25,
      fontSize: "0.72rem",
      fontWeight: 700,
      textTransform: "none",
      boxShadow: "none",
      '&:hover': { boxShadow: 'none' },
    };

    const compactCellSx = {
      fontSize: "12.5px",
      color: "#1f2937",
      py: 1.2,
    };

    return (
      <Box sx={{ mt: { xs: 7, md: 8 }, display: "grid", gap: 2.25 }}>
        <Box sx={connectionCardSx}>
          <SectionTitle title="Lab Connections" description="Search labs and send a connection request." />
          <Box sx={{ mt: 1.5, display: "grid", gap: 1.5 }}>
            <TextField
              size="small"
              label="Search by name, code, city or location"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              sx={{
                maxWidth: 420,
                '& .MuiInputLabel-root': { color: '#1f3a4a', fontWeight: 600, fontSize: '0.78rem' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0b5c8e' },
                '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: 1.5, fontSize: '0.8rem', '& fieldset': { borderColor: '#cfe0ea' }, '&:hover fieldset': { borderColor: '#8eb7d1' }, '&.Mui-focused fieldset': { borderColor: '#0b5c8e' } },
              }}
            />
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}><CircularProgress size={26} sx={{ color: "#0b5c8e" }} /></Box>
            ) : labs.length ? (
              <DataTable
                columns={["LAB", "CODE", "PHONE", "ADDRESS", "ACTION"]}
                loading={false}
                emptyMessage="No labs found."
                footer={null}
              >
                {labs.map((lab) => (
                  <TableRow key={lab.id} hover>
                    <TableCell sx={{ ...compactCellSx, fontWeight: 600 }}>{lab.lab_name || "-"}</TableCell>
                    <TableCell sx={compactCellSx}>{lab.lab_code || "-"}</TableCell>
                    <TableCell sx={compactCellSx}>{lab.phone_number || "-"}</TableCell>
                    <TableCell sx={{ ...compactCellSx, color: "#64748b" }}>{lab.address || lab.location || "-"}</TableCell>
                    <TableCell sx={compactCellSx}>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={connectingId === lab.id}
                        onClick={() => handleConnectLab(lab.id)}
                        sx={compactButtonSx}
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

        <Box sx={connectionCardSx}>
          <SectionTitle title="My Connections" description="Track your lab connection requests and current status." />
          <Box sx={{ mt: 1 }}>
            <DataTable
              columns={["LAB", "CODE", "STATUS", "REQUESTED", "APPROVED"]}
              loading={loading}
              emptyMessage="No lab connections found."
              footer={<Pagination count={Math.max(1, Math.ceil(connections.length / pageSize))} page={tablePage} onChange={(_, value) => setTablePage(value)} size="small" color="primary" />}
            >
              {visibleConnections.length ? visibleConnections.map((connection) => (
                <TableRow key={connection.connection_id} hover>
                  <TableCell sx={{ ...compactCellSx, fontWeight: 600 }}>{connection.lab_name || "-"}</TableCell>
                  <TableCell sx={compactCellSx}>{connection.lab_code || "-"}</TableCell>
                  <TableCell sx={compactCellSx}>
                    <Chip
                      size="small"
                      label={connection.status || "PENDING"}
                      color={connection.status === "APPROVED" ? "success" : connection.status === "REJECTED" ? "error" : "warning"}
                      sx={{ fontSize: '11.5px', height: 24, '& .MuiChip-label': { px: 1 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...compactCellSx, color: "#64748b" }}>{connection.requested_at ? new Date(connection.requested_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell sx={{ ...compactCellSx, color: "#64748b" }}>{connection.approved_at ? new Date(connection.approved_at).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              )) : null}
            </DataTable>
          </Box>
        </Box>

        <Box sx={connectionCardSx}>
          <SectionTitle title="Medical Connections" description="Search medical stores and connect with your preferred pharmacy partners." />
          <Box sx={{ mt: 1.5, display: "grid", gap: 1.5 }}>
            <TextField
              size="small"
              label="Search by name, code, city or location"
              value={medicalSearchText}
              onChange={(event) => setMedicalSearchText(event.target.value)}
              sx={{
                maxWidth: 420,
                '& .MuiInputLabel-root': { color: '#1f3a4a', fontWeight: 600, fontSize: '0.78rem' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#0b5c8e' },
                '& .MuiOutlinedInput-root': { backgroundColor: '#fff', borderRadius: 1.5, fontSize: '0.8rem', '& fieldset': { borderColor: '#cfe0ea' }, '&:hover fieldset': { borderColor: '#8eb7d1' }, '&.Mui-focused fieldset': { borderColor: '#0b5c8e' } },
              }}
            />

            {medicalStores.length ? (
              <DataTable columns={["STORE", "CODE", "PHONE", "ADDRESS", "ACTION"]} loading={false} emptyMessage="No medical stores found." footer={null}>
                {medicalStores.map((store) => (
                  <TableRow key={store.id} hover>
                    <TableCell sx={{ ...compactCellSx, fontWeight: 600 }}>{store.name || "-"}</TableCell>
                    <TableCell sx={compactCellSx}>{store.code || "-"}</TableCell>
                    <TableCell sx={compactCellSx}>{store.phone || "-"}</TableCell>
                    <TableCell sx={{ ...compactCellSx, color: "#64748b" }}>{store.address || store.city || "-"}</TableCell>
                    <TableCell sx={compactCellSx}>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={connectingMedicalId === store.id}
                        onClick={() => handleConnectMedicalStore(store.id)}
                        sx={compactButtonSx}
                      >
                        {connectingMedicalId === store.id ? "Sending..." : "Connect"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </DataTable>
            ) : null}
          </Box>
        </Box>

        <Box sx={connectionCardSx}>
          <SectionTitle title="My Medical Connections" description="Track your connected medical stores and request status." />
          <Box sx={{ mt: 1 }}>
            <DataTable
              columns={["STORE", "CODE", "STATUS", "REQUESTED", "APPROVED"]}
              loading={loading}
              emptyMessage="No medical connections found."
              footer={null}
            >
              {medicalConnections.length ? medicalConnections.map((connection) => (
                <TableRow key={connection.id || connection.store_name} hover>
                  <TableCell sx={{ ...compactCellSx, fontWeight: 600 }}>{connection.store_name || "-"}</TableCell>
                  <TableCell sx={compactCellSx}>{connection.store_code || "-"}</TableCell>
                  <TableCell sx={compactCellSx}>
                    <Chip
                      size="small"
                      label={connection.status || "PENDING"}
                      color={connection.status === "APPROVED" ? "success" : connection.status === "REJECTED" ? "error" : "warning"}
                      sx={{ fontSize: '11.5px', height: 24, '& .MuiChip-label': { px: 1 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ ...compactCellSx, color: "#64748b" }}>{connection.requested_at ? new Date(connection.requested_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell sx={{ ...compactCellSx, color: "#64748b" }}>{connection.approved_at ? new Date(connection.approved_at).toLocaleDateString() : "-"}</TableCell>
                </TableRow>
              )) : null}
            </DataTable>
          </Box>
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
          columns={["PATIENT", "LAB", "TESTS", "PRIORITY", "STATUS", "REASON", "CREATED"]}
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
              <TableCell><Chip size="small" label={request.status || "PENDING"} color={request.status === "COMPLETED" ? "success" : request.status === "REJECTED" || request.status === "CANCELLED" ? "error" : "warning"} /></TableCell>
              <TableCell sx={{ color: "#64748b !important", maxWidth: 220, whiteSpace: "normal" }}>
                {request.status === "REJECTED" || request.status === "CANCELLED" ? (getRequestNote(request) || "No reason provided.") : "-"}
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
