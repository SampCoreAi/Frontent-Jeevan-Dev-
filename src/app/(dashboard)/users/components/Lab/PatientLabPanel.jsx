"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";

import api from "../../../../../utils/axiosInstance";
import PatientLabFilters from "./PatientLabFilters";
import PatientLabTable from "./PatientLabTable";

const getRows = (res) => {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  const rows = data?.data || data?.results || data?.items || data?.rows;
  return Array.isArray(rows) ? rows : [];
};

const getValue = (...values) =>
  values.find((v) => v !== undefined && v !== null && v !== "") ?? "-";

const getRequestId = (v = {}) =>
  v.requestId || v.testRequestId || v.test_request_id || v.request_id;

const getReportUrl = (v = {}) =>
  v.downloadUrl ||
  v.download_url ||
  v.fileUrl ||
  v.file_url ||
  v.url ||
  v.reportUrl ||
  v.report_url;

const getRequestNote = (v = {}) =>
  v.latest_status_note ||
  v.latestStatusNote ||
  v.status_note ||
  v.note ||
  v.reason ||
  v.statusReason ||
  "";

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(
    typeof value === "string" ? value.replace(" ", "T") : value,
  );

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

const getTestNames = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ") || "-";
  if (typeof value !== "string" || !value.trim()) return "-";

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter(Boolean).join(", ") || "-"
      : value;
  } catch {
    return value;
  }
};

const normalizeReport = (r = {}) => ({
  ...r,
  requestId: getRequestId(r),
  reportCode: r.reportCode || r.report_code || r.reportId || null,
  reportId: r.reportId || r.report_code || r.id || null,
  downloadUrl: getReportUrl(r),
  labName: getValue(r.labName, r.lab_name),
  doctorName: getValue(r.doctorName, r.doctor_name),
  testName: getTestNames(
    r.testName || r.test_name || r.requestedTests || r.requested_tests,
  ),
  fileName:
    r.originalFileName ||
    r.original_file_name ||
    r.fileName ||
    r.file_name ||
    null,
  uploadedAt: r.uploadedAt || r.uploaded_at || r.createdAt || r.created_at,
  reviewStatus: r.reviewStatus || r.review_status || "AWAITING_REVIEW",
  doctorComment: r.doctorComment || r.doctor_comment || "",
});

const STATUS_LABEL = {
  PENDING: "Requested",
  APPROVED: "Accepted",
  SAMPLE_COLLECTED: "Sample Collected",
  PROCESSING: "Testing",
  REPORT_UPLOADED: "Report Ready",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const getUserStatus = (status) =>
  STATUS_LABEL[status] || status || "Requested";

function DetailItem({ label, value }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "145px 1fr" },
        gap: { xs: 0.3, sm: 1.5 },
        py: 1,
      }}
    >
      <Typography sx={{ fontSize: 12.5, color: "text.secondary", fontWeight: 500 }}>
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: 12.5,
          color: "text.primary",
          fontWeight: 500,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}

function InfoCard({ title, children }) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2,
        bgcolor: "background.paper",
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>

      <Divider sx={{ mb: 0.5 }} />
      {children}
    </Box>
  );
}

export default function PatientLabPanel() {
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    date: "",
  });

  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const search = filters.search.trim();

        const [requestRes, reportRes] = await Promise.all([
          api.get("/api/lab-requests/patient", {
            params: {
              search: search || undefined,
              status: filters.status || undefined,
              date: filters.date || undefined,
            },
          }),
          api.get("/api/lab-reports", {
            params: {
              search: search || undefined,
              date: filters.date || undefined,
            },
          }),
        ]);

        if (!active) return;

        setRequests(getRows(requestRes));
        setReports(getRows(reportRes).map(normalizeReport));
      } catch (err) {
        if (!active) return;

        setRequests([]);
        setReports([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load lab data.",
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const rows = useMemo(() => {
    const map = new Map();

    reports.forEach((report) => {
      if (report.requestId == null) return;

      const key = String(report.requestId);
      map.set(key, [...(map.get(key) || []), report]);
    });

    return requests.map((request) => {
      const id = request.id ?? getRequestId(request);
      const requestReports = id != null ? map.get(String(id)) || [] : [];
      const report = requestReports[0];

      return {
        ...request,
        reports: requestReports,
        report,
        labName: getValue(report?.labName, request.lab_name, request.labName),
        doctorName: getValue(
          report?.doctorName,
          request.doctor_name,
          request.doctorName,
        ),
        testName: getValue(
          report?.testName,
          getTestNames(request.requested_tests || request.requestedTests),
        ),
      };
    });
  }, [requests, reports]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const updateFilter = (name) => (value) =>
    setFilters((prev) => ({ ...prev, [name]: value ?? "" }));

  const openMenu = (event, row) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const closeMenu = () => setAnchorEl(null);

  const openDetails = () => {
    setSelectedRow(menuRow);
    closeMenu();
  };

  const closeDetails = () => setSelectedRow(null);

  return (
    <Box
     sx={{
  mt: { xs: 7, md: 8 },
  width: "100%",
  minWidth: 0,
  minHeight: "90vh",
  px: { xs: 1.5, sm: 2, md: 4 },
  pt: { xs: 1.5, sm: 2, md: 4 },
  bgcolor: "#fff",
  display: "grid",
  gridAutoRows: "max-content",
  alignContent: "start",
  gap: { xs: 2, md: 2.5 },
}}
    >
      <PatientLabFilters
        search={filters.search}
        status={filters.status}
        date={filters.date}
        onSearch={updateFilter("search")}
        onStatus={updateFilter("status")}
        onDate={updateFilter("date")}
      />

      <PatientLabTable
        rows={rows}
        visibleRows={visibleRows}
        loading={loading}
        tablePage={page}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onMenuOpen={openMenu}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        PaperProps={{
          sx: {
            minWidth: 155,
            borderRadius: 2,
            border: "1px solid #E2E8F0",
            boxShadow: "0 8px 24px rgba(15,23,42,.08)",
          },
        }}
      >
        <MenuItem onClick={openDetails} sx={{ gap: 1, fontSize: 12.5 }}>
          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          View Details
        </MenuItem>

        {menuRow?.report?.downloadUrl && (
          <MenuItem
            component="a"
            href={menuRow.report.downloadUrl}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
            sx={{ gap: 1, fontSize: 12.5 }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
            View Report
          </MenuItem>
        )}
      </Menu>

      <Dialog
        open={Boolean(selectedRow)}
        onClose={closeDetails}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            border: "1px solid #E2E8F0",
            boxShadow: "0 18px 50px rgba(15,23,42,.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 2.5,
            py: 1.7,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
              Lab Test Details
            </Typography>

            <Typography sx={{ fontSize: 12.5, color: "text.secondary" }}>
              Complete test and report information
            </Typography>
          </Box>

          <IconButton size="small" onClick={closeDetails}>
            <CloseIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          {selectedRow && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              <InfoCard title="Test Information">
                <DetailItem label="Test" value={selectedRow.testName} />
                <DetailItem
                  label="Status"
                  value={getUserStatus(selectedRow.status)}
                />
                <DetailItem
                  label="Expected Result"
                  value={formatDateTime(
                    selectedRow.expected_report_at ||
                      selectedRow.expectedReportAt,
                  )}
                />
                <DetailItem
                  label="Requested On"
                  value={formatDateTime(
                    selectedRow.created_at || selectedRow.createdAt,
                  )}
                />
                <DetailItem
                  label="Remarks"
                  value={getRequestNote(selectedRow)}
                />
              </InfoCard>

              <InfoCard title="Lab Information">
                <DetailItem label="Lab" value={selectedRow.labName} />
                <DetailItem
                  label="Lab Code"
                  value={getValue(selectedRow.lab_code, selectedRow.labCode)}
                />
                <DetailItem
                  label="Address"
                  value={getValue(
                    selectedRow.lab_address,
                    selectedRow.labAddress,
                  )}
                />
                <DetailItem
                  label="Phone"
                  value={getValue(selectedRow.lab_phone, selectedRow.labPhone)}
                />
              </InfoCard>

              <InfoCard title="Doctor Information">
                <DetailItem label="Doctor" value={selectedRow.doctorName} />
                <DetailItem
                  label="Doctor Note"
                  value={getValue(
                    selectedRow.doctor_note,
                    selectedRow.doctorNote,
                  )}
                />
                <DetailItem label="Priority" value={selectedRow.priority} />
              </InfoCard>

              <InfoCard title="Report Information">
                {selectedRow.reports?.length ? (
                  <Stack spacing={1.5}>
                    {selectedRow.reports.map((report, index) => (
                      <Box
                        key={report.id || index}
                        sx={{
                          pb:
                            index < selectedRow.reports.length - 1 ? 1.5 : 0,
                          borderBottom:
                            index < selectedRow.reports.length - 1
                              ? "1px solid"
                              : "none",
                          borderColor: "divider",
                        }}
                      >
                        <DetailItem
                          label="Report Code"
                          value={report.reportCode}
                        />
                        <DetailItem label="File" value={report.fileName} />
                        <DetailItem
                          label="Uploaded"
                          value={formatDateTime(report.uploadedAt)}
                        />

                        {report.downloadUrl && (
                          <Button
                            href={report.downloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            size="small"
                            variant="outlined"
                            startIcon={
                              <DescriptionOutlinedIcon sx={{ fontSize: 17 }} />
                            }
                            sx={{ mt: 1, fontSize: 12.5, textTransform: "none" }}
                          >
                            View Report
                          </Button>
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    sx={{
                      py: 5,
                      textAlign: "center",
                      fontSize: 12.5,
                      color: "text.secondary",
                    }}
                  >
                    Report not available yet
                  </Typography>
                )}
              </InfoCard>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            onClick={closeDetails}
            variant="outlined"
            size="small"
            sx={{ fontSize: 12.5, textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={5000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}