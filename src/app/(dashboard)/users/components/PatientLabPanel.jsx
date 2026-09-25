"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Snackbar,
  Stack,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloseIcon from "@mui/icons-material/Close";

import api from "../../../../utils/axiosInstance";
import { DataTable, TableFilters } from "../../lab/components/LabUi";

const getRows = (response) => {
  const payload = response?.data;

  if (Array.isArray(payload)) return payload;

  const rows =
    payload?.data ||
    payload?.results ||
    payload?.items ||
    payload?.rows;

  return Array.isArray(rows) ? rows : [];
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

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
    (item) =>
      item !== undefined &&
      item !== null &&
      item !== ""
  );

  return value ?? "-";
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const normalizedValue =
    typeof value === "string"
      ? value.replace(" ", "T")
      : value;

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDate = (value) => {
  if (!value) return "-";

  const normalizedValue =
    typeof value === "string"
      ? value.replace(" ", "T")
      : value;

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getTestNames = (value) => {
  if (Array.isArray(value)) {
    const names = value.filter(Boolean);
    return names.length ? names.join(", ") : "-";
  }

  if (typeof value !== "string" || !value.trim()) {
    return "-";
  }

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
  ...report,

  id: report.id,

  requestId: getRequestId(report),

  reportCode:
    report.reportCode ||
    report.report_code ||
    report.reportId ||
    null,

  reportId:
    report.reportId ||
    report.report_code ||
    report.id ||
    null,

  downloadUrl: getReportUrl(report),

  labName: getValue(
    report.labName,
    report.lab_name
  ),

  doctorName: getValue(
    report.doctorName,
    report.doctor_name
  ),

  testName: getTestNames(
    report.testName ||
      report.test_name ||
      report.requestedTests ||
      report.requested_tests
  ),

  fileName:
    report.originalFileName ||
    report.original_file_name ||
    report.fileName ||
    report.file_name ||
    null,

  uploadedAt:
    report.uploadedAt ||
    report.uploaded_at ||
    report.createdAt ||
    report.created_at,
  reviewStatus: report.reviewStatus || report.review_status || "AWAITING_REVIEW",
  doctorComment: report.doctorComment || report.doctor_comment || "",
});

const getUserStatus = (status) => {
  const statusMap = {
    PENDING: "Requested",
    APPROVED: "Accepted",
    SAMPLE_COLLECTED: "Sample Collected",
    PROCESSING: "Testing",
    REPORT_UPLOADED: "Report Ready",
    COMPLETED: "Completed",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
  };

  return statusMap[status] || status || "Requested";
};

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
    case "REPORT_UPLOADED":
      return "success";

    case "REJECTED":
    case "CANCELLED":
      return "error";

    case "PENDING":
      return "warning";

    case "APPROVED":
    case "SAMPLE_COLLECTED":
    case "PROCESSING":
      return "info";

    default:
      return "default";
  }
};

const getRequestNote = (request = {}) =>
  request.latest_status_note ||
  request.latestStatusNote ||
  request.status_note ||
  request.note ||
  request.reason ||
  request.statusReason ||
  "";

function DetailItem({ label, value }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "145px 1fr",
        },
        gap: { xs: 0.3, sm: 1.5 },
        py: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "12.5px",
          color: "text.secondary",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          fontSize: "12.5px",
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

export default function PatientLabPanel() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

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

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuRow, setMenuRow] = useState(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const search =
          tableFilters.search.trim();

        const [
          requestsResponse,
          reportsResponse,
        ] = await Promise.all([
          api.get("/api/lab-requests/patient", {
            params: {
              search: search || undefined,
              status:
                tableFilters.status ||
                undefined,
              date:
                tableFilters.date ||
                undefined,
            },
          }),

          api.get("/api/lab-reports", {
            params: {
              search: search || undefined,
              date:
                tableFilters.date ||
                undefined,
            },
          }),
        ]);

        if (!active) return;

        setRequests(
          getRows(requestsResponse)
        );

        setReports(
          getRows(reportsResponse).map(
            normalizeReport
          )
        );
      } catch (err) {
        if (!active) return;

        setRequests([]);
        setReports([]);

        setError(
          getErrorMessage(
            err,
            "Unable to load lab data."
          )
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [
    tableFilters.date,
    tableFilters.search,
    tableFilters.status,
  ]);

  useEffect(() => {
    setTablePage(1);
  }, [
    tableFilters.date,
    tableFilters.search,
    tableFilters.status,
  ]);

  const handleFilter =
    (field) => (value) => {
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
    [tableFilters]
  );

  const rows = useMemo(() => {
    const reportsByRequest = new Map();

    reports.forEach((report) => {
      if (
        report.requestId === undefined ||
        report.requestId === null
      ) {
        return;
      }

      const key = String(report.requestId);

      const current =
        reportsByRequest.get(key) || [];

      current.push(report);

      reportsByRequest.set(
        key,
        current
      );
    });

    return requests.map((request) => {
      const requestId =
        request.id ??
        getRequestId(request);

      const requestReports =
        requestId !== undefined &&
        requestId !== null
          ? reportsByRequest.get(
              String(requestId)
            ) || []
          : [];

      const latestReport =
        requestReports[0];

      return {
        ...request,

        reports: requestReports,

        report: latestReport,

        labName: getValue(
          latestReport?.labName,
          request.lab_name,
          request.labName
        ),

        doctorName: getValue(
          latestReport?.doctorName,
          request.doctor_name,
          request.doctorName
        ),

        testName: getValue(
          latestReport?.testName,
          getTestNames(
            request.requested_tests ||
              request.requestedTests
          )
        ),
      };
    });
  }, [reports, requests]);

  const pageCount = Math.max(
    1,
    Math.ceil(rows.length / pageSize)
  );

  const visibleRows = useMemo(() => {
    const start =
      (tablePage - 1) * pageSize;

    return rows.slice(
      start,
      start + pageSize
    );
  }, [rows, tablePage]);

  useEffect(() => {
    if (tablePage > pageCount) {
      setTablePage(pageCount);
    }
  }, [pageCount, tablePage]);

  const handleMenuOpen = (
    event,
    row
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setSelectedRow(menuRow);
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedRow(null);
  };

  const cellSx = {
    fontSize: "12.5px",
    color: theme.palette.text.primary,
    verticalAlign: "middle",
    py: 1.2,
    px: {
      xs: 1,
      sm: 1.5,
    },
  };

  const secondaryCellSx = {
    ...cellSx,
    color: theme.palette.text.secondary,
  };

  return (
    <Box
      sx={{
        mt: {
          xs: 7,
          md: 8,
        },

        width: "100%",
        minWidth: 0,

        px: {
          xs: 1.5,
          sm: 2,
          md: 4,
        },

        backgroundColor: "white",

        display: "grid",
        alignContent: "start",

        gap: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <TableFilters
        {...filterProps}
        statusOptions={[
          "PENDING",
          "REQUESTED",
          "APPROVED",
          "ACCEPTED",
          "REJECTED",
          "SAMPLE_SCHEDULED",
          "SAMPLE_COLLECTED",
          "RECOLLECTION_REQUIRED",
          "PROCESSING",
          "REPORT_READY",
          "REPORT_UPLOADED",
          "COMPLETED",
          "REJECTED",
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
            "ORDER ID",
            "SAMPLE",
            "LAB",
            "ADDRESS",
            "DOCTOR",
            "TESTS",
            "PRIORITY",
            "REPORT REVIEW",
            "DOCTOR INTERPRETATION / NEXT STEPS",
            "REPORT BY",
            "COLLECTION DATE & TIME",
            "TOKEN",
            "TEST",
            "LAB",
            "STATUS",
            "EXPECTED RESULT",
            "REMARKS",
            "REPORT",
            "",
          ]}
          loading={loading}
          emptyMessage="No lab tests found."
          footer={
            rows.length > 0 ? (
              <Pagination
                count={pageCount}
                page={tablePage}
                onChange={(_, value) =>
                  setTablePage(value)
                }
                size={
                  isMobile
                    ? "small"
                    : "medium"
                }
                color="primary"
                siblingCount={
                  isMobile ? 0 : 1
                }
                boundaryCount={1}
              />
            ) : null
          }
        >
          {visibleRows.map(
            (request, index) => {
              const status =
                request.status ||
                "PENDING";

              const remark =
                getRequestNote(request);

                <TableCell sx={{ ...cellSx, fontWeight: 700, color: "#0B5C8E" }}>
                  {request.order_id || request.orderId || "-"}
                </TableCell>

                <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                  {request.sample_type || request.sampleType || "-"}
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
                    sx={{
                      height: 24,
                      fontSize: "12.5px",
                      bgcolor: "transparent",
                      border: 0,
                      color: request.priority === "URGENT" ? "#DC2626" : "#64748B",
              const report =
                request.report;

              return (
                <TableRow
                  key={
                    request.id ||
                    `${request.labName}-${index}`
                  }
                  hover
                >
                  <TableCell
                    sx={{
                      ...cellSx,
                      minWidth: 150,
                      maxWidth: 230,
                      fontWeight: 600,
                    }}
                  >
                    {request.testName}
                  </TableCell>

                <TableCell sx={cellSx}>
                  {request.report ? (
                    <Chip
                      size="small"
                      label={String(request.report.reviewStatus || "AWAITING_REVIEW").replaceAll("_", " ")}
                      color={request.report.reviewStatus === "REVIEWED" ? "success" : "warning"}
                      sx={{ height: 24, fontSize: "12px", fontWeight: 700, bgcolor: "transparent", border: 0, color: request.report.reviewStatus === "REVIEWED" ? "#15803D" : "#B45309" }}
                    />
                  ) : (
                    "-"
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    ...secondaryCellSx,
                    minWidth: 190,
                    maxWidth: 280,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {request.report?.doctorComment || "Doctor interpretation is not available yet."}
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

                <TableCell
                  sx={{
                    ...secondaryCellSx,
                    minWidth: 160,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatDateTime(
                    request.collection_slot || request.collectionSlot,
                  )}
                </TableCell>

                <TableCell sx={{ ...cellSx, minWidth: 80 }}>
                  <Chip
                    size="small"
                    label={request.collection_token || request.collectionToken || "Not assigned"}
                    sx={{ height: 24, fontSize: "12.5px", fontWeight: 700, bgcolor: "transparent", border: 0, color: request.collection_token || request.collectionToken ? "#0B5C8E" : "#64748B" }}
                  />
                </TableCell>

                <TableCell sx={cellSx}>
                  <Chip
                    size="small"
                    label={status}
                    sx={{
                      height: 24,
                      fontSize: "12.5px",
                      bgcolor: "transparent",
                      border: 0,
                      color: status === "COMPLETED" ? "#15803D" : status === "REJECTED" || status === "CANCELLED" ? "#DC2626" : status === "PENDING" ? "#B45309" : "#0B5C8E",
                  <TableCell
                    sx={{
                      ...cellSx,
                      minWidth: 130,
                    }}
                  >
                    {request.labName}
                  </TableCell>

                  <TableCell
                    sx={{
                      ...cellSx,
                      minWidth: 145,
                    }}
                  >
                    <Chip
                      size="small"
                      label={getUserStatus(
                        status
                      )}
                      color={getStatusColor(
                        status
                      )}
                      sx={{
                        height: 24,
                        fontSize: "12.5px",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      ...secondaryCellSx,
                      minWidth: 165,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDateTime(
                      request.expected_report_at ||
                        request.expectedReportAt
                    )}
                  </TableCell>

                  <TableCell
                    sx={{
                      ...secondaryCellSx,
                      minWidth: 150,
                      maxWidth: 220,
                    }}
                  >
                    <Typography
                      title={remark || ""}
                      sx={{
                        fontSize: "12.5px",
                        color:
                          "text.secondary",
                        maxWidth: 190,
                        overflow: "hidden",
                        textOverflow:
                          "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {remark || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      ...cellSx,
                      minWidth: 110,
                    }}
                  >
                    {report?.downloadUrl ? (
                      <Button
                        size="small"
                        variant="text"
                        href={
                          report.downloadUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        startIcon={
                          <DescriptionOutlinedIcon
                            sx={{
                              fontSize: 17,
                            }}
                          />
                        }
                        sx={{
                          p: 0,
                          minWidth: "auto",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          textTransform: "none",
                          whiteSpace: "nowrap",
                        }}
                      >
                        View Report
                      </Button>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: "12.5px",
                          color:
                            "text.secondary",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        Not Ready
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      ...cellSx,
                      width: 50,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={(event) =>
                        handleMenuOpen(
                          event,
                          request
                        )
                      }
                      sx={{
                        width: 30,
                        height: 30,
                      }}
                    >
                      <MoreVertIcon
                        sx={{
                          fontSize: 19,
                        }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </DataTable>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            minWidth: 155,
            borderRadius: 2,
            border:
              "1px solid #E2E8F0",
            boxShadow:
              "0 8px 24px rgba(15,23,42,0.08)",
          },
        }}
      >
        <MenuItem
          onClick={handleViewDetails}
          sx={{
            gap: 1,
            fontSize: "12.5px",
            py: 1,
          }}
        >
          <VisibilityOutlinedIcon
            sx={{
              fontSize: 18,
            }}
          />

          View Details
        </MenuItem>

        {menuRow?.report?.downloadUrl && (
          <MenuItem
            component="a"
            href={
              menuRow.report.downloadUrl
            }
            target="_blank"
            rel="noreferrer"
            onClick={handleMenuClose}
            sx={{
              gap: 1,
              fontSize: "12.5px",
              py: 1,
            }}
          >
            <DescriptionOutlinedIcon
              sx={{
                fontSize: 18,
              }}
            />

            View Report
          </MenuItem>
        )}
      </Menu>

    <Dialog
  open={detailsOpen}
  onClose={handleCloseDetails}
  fullWidth
  maxWidth="md"
  PaperProps={{
    sx: {
      borderRadius: 2.5,
      border: "1px solid #E2E8F0",
      boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
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
      <Typography
        sx={{
          fontSize: "15px",
          fontWeight: 700,
          color: "text.primary",
        }}
      >
        Lab Test Details
      </Typography>

      <Typography
        sx={{
          mt: 0.2,
          fontSize: "12.5px",
          color: "text.secondary",
        }}
      >
        Complete test and report information
      </Typography>
    </Box>

    <IconButton size="small" onClick={handleCloseDetails}>
      <CloseIcon sx={{ fontSize: 19 }} />
    </IconButton>
  </DialogTitle>

  <DialogContent
    sx={{
      p: 2.5,
    }}
  >
    {selectedRow && (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: 2,
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            Test Information
          </Typography>

          <Divider sx={{ mb: 0.5 }} />

          <DetailItem
            label="Test"
            value={selectedRow.testName}
          />

          <DetailItem
            label="Status"
            value={getUserStatus(selectedRow.status)}
          />

          <DetailItem
            label="Expected Result"
            value={formatDateTime(
              selectedRow.expected_report_at ||
                selectedRow.expectedReportAt
            )}
          />

          <DetailItem
            label="Requested On"
            value={formatDateTime(
              selectedRow.created_at ||
                selectedRow.createdAt
            )}
          />

          <DetailItem
            label="Remarks"
            value={getRequestNote(selectedRow) || "-"}
          />
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            Lab Information
          </Typography>

          <Divider sx={{ mb: 0.5 }} />

          <DetailItem
            label="Lab"
            value={selectedRow.labName}
          />

          <DetailItem
            label="Lab Code"
            value={getValue(
              selectedRow.lab_code,
              selectedRow.labCode
            )}
          />

          <DetailItem
            label="Address"
            value={getValue(
              selectedRow.lab_address,
              selectedRow.labAddress
            )}
          />

          <DetailItem
            label="Phone"
            value={getValue(
              selectedRow.lab_phone,
              selectedRow.labPhone
            )}
          />
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            Doctor Information
          </Typography>

          <Divider sx={{ mb: 0.5 }} />

          <DetailItem
            label="Doctor"
            value={selectedRow.doctorName}
          />

          <DetailItem
            label="Doctor Note"
            value={getValue(
              selectedRow.doctor_note,
              selectedRow.doctorNote
            )}
          />

          <DetailItem
            label="Priority"
            value={getValue(selectedRow.priority)}
          />
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            Report Information
          </Typography>

          <Divider sx={{ mb: 0.5 }} />

          {selectedRow.reports?.length > 0 ? (
            <Stack spacing={1.5}>
              {selectedRow.reports.map((report, index) => (
                <Box
                  key={report.id}
                  sx={{
                    pb:
                      index !== selectedRow.reports.length - 1
                        ? 1.5
                        : 0,
                    borderBottom:
                      index !== selectedRow.reports.length - 1
                        ? "1px solid"
                        : "none",
                    borderColor: "divider",
                  }}
                >
                  <DetailItem
                    label="Report Code"
                    value={report.reportCode || "-"}
                  />

                  <DetailItem
                    label="File"
                    value={report.fileName || "-"}
                  />

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
                        <DescriptionOutlinedIcon
                          sx={{ fontSize: 17 }}
                        />
                      }
                      sx={{
                        mt: 1,
                        fontSize: "12.5px",
                        textTransform: "none",
                      }}
                    >
                      View Report
                    </Button>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <Box
              sx={{
                minHeight: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "12.5px",
                  color: "text.secondary",
                }}
              >
                Report not available yet
              </Typography>
            </Box>
          )}
        </Box>
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
      onClick={handleCloseDetails}
      variant="outlined"
      size="small"
      sx={{
        fontSize: "12.5px",
        textTransform: "none",
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() =>
          setError("")
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
          sx={{
            fontSize: "12.5px",
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}