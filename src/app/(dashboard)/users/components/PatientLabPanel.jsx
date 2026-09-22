"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Pagination,
  Snackbar,
  TableCell,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import api from "../../../../utils/axiosInstance";
import { DataTable, TableFilters } from "../../lab/components/LabUi";

const getRows = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) return payload;
  const rows =
    payload?.data || payload?.results || payload?.items || payload?.rows;
  return Array.isArray(rows) ? rows : [];
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const getRequestId = (item = {}) =>
  item.requestId ||
  item.testRequestId ||
  item.test_request_id ||
  item.request_id;

const getReportUrl = (report = {}) =>
  report.downloadUrl ||
  report.download_url ||
  report.fileUrl ||
  report.file_url ||
  report.url ||
  report.reportUrl ||
  report.report_url;

const getValue = (...values) => {
  const value = values.find(
    (item) => item !== undefined && item !== null && item !== "",
  );
  return value ?? "-";
};

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
};

const getTestNames = (value) => {
  if (Array.isArray(value)) {
    const names = value.filter(Boolean);
    return names.length ? names.join(", ") : "-";
  }
  if (typeof value !== "string" || !value.trim()) return "-";
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const names = parsed.filter(Boolean);
      return names.length ? names.join(", ") : "-";
    }
    return value;
  } catch {
    return value;
  }
};

const normalizeReport = (report = {}) => ({
  requestId: getRequestId(report),
  downloadUrl: getReportUrl(report),
  labName: getValue(report.labName, report.lab_name),
  doctorName: getValue(report.doctorName, report.doctor_name),
  testName: getTestNames(
    report.testName ||
      report.test_name ||
      report.requestedTests ||
      report.requested_tests,
  ),
  uploadedAt:
    report.uploadedAt ||
    report.uploaded_at ||
    report.createdAt ||
    report.created_at,
});

export default function PatientLabPanel() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tableFilters, setTableFilters] = useState({
    search: "",
    status: "",
    date: "",
  });
  const [tablePage, setTablePage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const search = tableFilters.search.trim();

        const [requestsResponse, reportsResponse] = await Promise.all([
          api.get("/api/lab-requests/patient", {
            params: {
              search: search || undefined,
              status: tableFilters.status || undefined,
              date: tableFilters.date || undefined,
            },
          }),
          api.get("/api/lab-reports", {
            params: {
              search: search || undefined,
              date: tableFilters.date || undefined,
            },
          }),
        ]);

        if (!active) return;

        setRequests(getRows(requestsResponse));
        setReports(getRows(reportsResponse).map(normalizeReport));
      } catch (err) {
        if (!active) return;
        setRequests([]);
        setReports([]);
        setError(getErrorMessage(err, "Unable to load lab data."));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [tableFilters.date, tableFilters.search, tableFilters.status]);

  useEffect(() => {
    setTablePage(1);
  }, [tableFilters.date, tableFilters.search, tableFilters.status]);

  const handleFilter = (field) => (value) => {
    setTableFilters((current) => ({
      ...current,
      [field]: value ?? "",
    }));
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
    [tableFilters],
  );

  const rows = useMemo(() => {
    const reportMap = new Map(
      reports
        .filter(
          (report) =>
            report.requestId !== undefined && report.requestId !== null,
        )
        .map((report) => [String(report.requestId), report]),
    );

    return requests.map((request) => {
      const requestId = request.id ?? getRequestId(request);
      const report =
        requestId !== undefined && requestId !== null
          ? reportMap.get(String(requestId))
          : undefined;

      return {
        ...request,
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
  }, [reports, requests]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));

  const visibleRows = useMemo(() => {
    const start = (tablePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, tablePage]);

  useEffect(() => {
    if (tablePage > pageCount) {
      setTablePage(pageCount);
    }
  }, [pageCount, tablePage]);

  const cellSx = {
    fontSize: "12.5px",
    color: theme.palette.text.primary,
    verticalAlign: "middle",
    py: 1.2,
    px: { xs: 1, sm: 1.5 },
  };

  const secondaryCellSx = {
    ...cellSx,
    color: theme.palette.text.secondary,
  };

  const getRequestNote = (request = {}) =>
    request.latest_status_note ||
    request.latestStatusNote ||
    request.status_note ||
    request.note ||
    request.reason ||
    request.statusReason ||
    "";

  const getStatusColor = (status) => {
    if (status === "COMPLETED") return "success";
    if (status === "REJECTED" || status === "CANCELLED") return "error";
    if (status === "PENDING") return "warning";
    return "info";
  };

  return (
    <Box
      sx={{
        mt: { xs: 7, md: 8 },
        width: "100%",
        height: "100%",
        minWidth: 0,
        px: 4,
        backgroundColor: "white",
     display: "grid",
alignContent: "start",
gap: { xs: 2, md: 3 },
      }}
    >
      <TableFilters
        {...filterProps}
        statusOptions={[
          "PENDING",
          "APPROVED",
          "REJECTED",
          "SAMPLE_COLLECTED",
          "PROCESSING",
          "REPORT_UPLOADED",
          "COMPLETED",
          "CANCELLED",
        ]}
      />

      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          overflowX: "auto",
          borderRadius: 2,
          "& th": {
            fontSize: "12.5px",
            whiteSpace: "nowrap",
          },
          "& td": {
            fontSize: "12.5px",
          },
          "& .MuiChip-label": {
            fontSize: "12.5px",
          },
          "& .MuiButton-root": {
            fontSize: "12.5px",
          },
        }}
      >
        <DataTable
          columns={[
            "SNO",
            "LAB",
            "ADDRESS",
            "DOCTOR",
            "TESTS",
            "PRIORITY",
            "REPORT BY",
            "STATUS",
            "REASON",
            "REPORT",
            "UPLOADED",
          ]}
          loading={loading}
          emptyMessage="No lab requests or reports found."
          footer={
            rows.length > 0 ? (
              <Pagination
                count={pageCount}
                page={tablePage}
                onChange={(_, value) => setTablePage(value)}
                size={isMobile ? "small" : "medium"}
                color="primary"
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 1}
              />
            ) : null
          }
        >
          {visibleRows.map((request, index) => {
            const status = request.status || "PENDING";
            const isRejected = status === "REJECTED" || status === "CANCELLED";

            return (
              <TableRow key={request.id || `${request.labName}-${index}`} hover>
                <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                  {(tablePage - 1) * pageSize + index + 1}
                </TableCell>

                <TableCell
                  sx={{
                    ...cellSx,
                    fontWeight: 600,
                    minWidth: 130,
                  }}
                >
                  {request.labName}
                </TableCell>

                <TableCell
                  sx={{
                    ...secondaryCellSx,
                    minWidth: 180,
                    maxWidth: 230,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {getValue(request.lab_address, request.labAddress)}
                </TableCell>

                <TableCell
                  sx={{
                    ...cellSx,
                    minWidth: 130,
                  }}
                >
                  {request.doctorName}
                </TableCell>

                <TableCell
                  sx={{
                    ...cellSx,
                    minWidth: 160,
                    maxWidth: 230,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {request.testName}
                </TableCell>

                <TableCell sx={cellSx}>
                  <Chip
                    size="small"
                    label={request.priority || "NORMAL"}
                    color={request.priority === "URGENT" ? "error" : "default"}
                    sx={{
                      height: 24,
                      fontSize: "12.5px",
                    }}
                  />
                </TableCell>

                <TableCell
                  sx={{
                    ...secondaryCellSx,
                    minWidth: 150,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatDateTime(
                    request.expected_report_at || request.expectedReportAt,
                  )}
                </TableCell>

                <TableCell sx={cellSx}>
                  <Chip
                    size="small"
                    label={status}
                    color={getStatusColor(status)}
                    sx={{
                      height: 24,
                      fontSize: "12.5px",
                    }}
                  />
                </TableCell>

                <TableCell
                  sx={{
                    ...secondaryCellSx,
                    minWidth: 150,
                    maxWidth: 220,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {isRejected
                    ? getRequestNote(request) || "No reason provided."
                    : "-"}
                </TableCell>

                <TableCell sx={cellSx}>
                  {request.report?.downloadUrl ? (
                    <Button
                      size="small"
                      href={request.report.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      variant="text"
                      sx={{
                        minWidth: "auto",
                        p: 0,
                        fontSize: "12.5px",
                        fontWeight: 600,
                        textTransform: "none",
                        color: theme.palette.primary.main,
                      }}
                    >
                      View
                    </Button>
                  ) : (
                    <Box
                      component="span"
                      sx={{
                        fontSize: "12.5px",
                        color: theme.palette.text.secondary,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Not uploaded
                    </Box>
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    ...secondaryCellSx,
                    minWidth: 100,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatDate(request.report?.uploadedAt)}
                </TableCell>
              </TableRow>
            );
          })}
        </DataTable>
      </Box>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ fontSize: "12.5px" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}