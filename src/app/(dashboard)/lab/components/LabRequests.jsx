"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LabAddTestDialog from "./LabAddTestDialog";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

const REQUEST_STATUSES = [
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
  "CANCELLED",
];

const STATUS_TRANSITIONS = {
  PENDING: ["APPROVED", "REJECTED", "CANCELLED"],
  REQUESTED: ["ACCEPTED", "REJECTED", "CANCELLED"],
  APPROVED: ["SAMPLE_SCHEDULED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["SAMPLE_SCHEDULED", "SAMPLE_COLLECTED", "CANCELLED"],
  SAMPLE_SCHEDULED: ["SAMPLE_COLLECTED", "CANCELLED"],
  SAMPLE_COLLECTED: ["PROCESSING", "RECOLLECTION_REQUIRED", "CANCELLED"],
  RECOLLECTION_REQUIRED: ["SAMPLE_SCHEDULED", "SAMPLE_COLLECTED", "CANCELLED"],
  PROCESSING: ["REPORT_READY", "REPORT_UPLOADED", "CANCELLED"],
  REPORT_READY: ["REPORT_UPLOADED", "COMPLETED"],
  REPORT_UPLOADED: ["REPORT_READY", "PROCESSING", "COMPLETED"],
};

const MAX_PDF_SIZE = 10 * 1024 * 1024;

const getReportRequestId = (report = {}) =>
  report.requestId ||
  report.testRequestId ||
  report.test_request_id ||
  report.request_id;

const formatDateTimeInputValue = (value) => {
  if (!value) return "";
  const normalized = String(value).replace(" ", "T");
  return normalized.slice(0, 16);
};

const formatDateInputValue = (value) => {
  if (!value) return "";
  return String(value).replace("T", " ").slice(0, 10);
};

const isCompleteDateTimeValue = (value) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(value || ""));

export default function LabRequests({
  reports = [],
  requests = [],
  loading = false,
  filters,
  page = 1,
  pageSize = 10,
  onPageChange,
  pagination,
  actionId,
  actionField,
  onStatusUpdate,
  onReportDateUpdate,
  onCollectionDetailsUpdate,
  uploading,
  onUploadReport,
  onDeleteReport,
  updateFeedback = { type: "", message: "" },
  pendingUploadCount = 0,
  showDelayedOnly = false,
  onToggleDelayedUpload,
  technicians = [],
  onAssignTechnician,
  onCreateRequest,
  requestOnlyPatient = false,
  onCreateReport,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [actionAnchor, setActionAnchor] = useState(null);
  const [uploadRequest, setUploadRequest] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [reasonDialog, setReasonDialog] = useState({
    open: false,
    request: null,
    status: null,
    note: "",
  });
  const [dateDrafts, setDateDrafts] = useState({});
  const [collectionDialog, setCollectionDialog] = useState({
    open: false,
    request: null,
    date: "",
    instructions: "",
  });
const HIDDEN_STATUSES = ["COMPLETED", "CANCELLED", "REJECTED"];

const safeRequests = Array.isArray(requests)
  ? requests.filter(
      (request) =>
        !HIDDEN_STATUSES.includes(
          String(request?.status || "").toUpperCase()
        )
    )
  : [];
  const safeReports = Array.isArray(reports) ? reports : [];
  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;

  const totalPages =
    pagination?.totalPages ||
    Math.max(1, Math.ceil(safeRequests.length / safePageSize));

  const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = Math.min(startIndex + safePageSize, safeRequests.length);

  const visible = pagination
    ? safeRequests
    : safeRequests.slice(startIndex, endIndex);

  const selectedReport = uploadRequest
    ? safeReports.find(
        (report) =>
          Number(getReportRequestId(report)) === Number(uploadRequest.id),
      )
    : null;

  const isCancelled = (request) =>
    String(request?.status || "").toUpperCase() === "CANCELLED";

  const canAssignTechnician = (request) => {
    if (!request) return false;
    return (
      ["APPROVED", "ACCEPTED"].includes(
        String(request.status || "").toUpperCase(),
      ) && !isCancelled(request)
    );
  };

  const getStatusStyle = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "COMPLETED":
        return {
          bgcolor: "#ECFDF3",
          color: "#15803D",
          borderColor: "#BBF7D0",
        };
      case "APPROVED":
        return {
          bgcolor: "#EFF6FF",
          color: "#1D4ED8",
          borderColor: "#BFDBFE",
        };
      case "PENDING":
        return {
          bgcolor: "#FFFBEB",
          color: "#B45309",
          borderColor: "#FDE68A",
        };
      case "PROCESSING":
        return {
          bgcolor: "#F0FDFA",
          color: "#0F766E",
          borderColor: "#99F6E4",
        };
      case "SAMPLE_COLLECTED":
        return {
          bgcolor: "#F5F3FF",
          color: "#6D28D9",
          borderColor: "#DDD6FE",
        };
      case "REPORT_UPLOADED":
        return {
          bgcolor: "#EFF6FF",
          color: "#0369A1",
          borderColor: "#BAE6FD",
        };
      case "REJECTED":
      case "CANCELLED":
        return {
          bgcolor: "#FEF2F2",
          color: "#DC2626",
          borderColor: "#FECACA",
        };
      default:
        return {
          bgcolor: "#F8FAFC",
          color: "#64748B",
          borderColor: "#E2E8F0",
        };
    }
  };

  const getPriorityStyle = (priority) => {
    if (String(priority).toUpperCase() === "URGENT") {
      return {
        bgcolor: "#FEF2F2",
        color: "#DC2626",
        borderColor: "#FECACA",
      };
    }

    return {
      bgcolor: "#F8FAFC",
      color: "#52646B",
      borderColor: "#E2E8F0",
    };
  };

  const openActions = (event, request) => {
    setActionAnchor(event.currentTarget);
    setUploadRequest(request);
  };

  const closeActions = () => {
    setActionAnchor(null);
  };

  const openCollectionDetails = () => {
    const request = uploadRequest;
    setCollectionDialog({
      open: true,
      request,
      date: formatDateInputValue(
        request?.collection_slot || request?.collectionSlot || "",
      ),
      instructions:
        request?.collection_instructions ||
        request?.collectionInstructions ||
        "",
    });
    closeActions();
  };

  const openUpload = () => {
    setUploadDialogOpen(true);
    closeActions();
  };

  const closeUploadDialog = () => {
    if (uploading) return;
    setUploadDialogOpen(false);
    setFile(null);
    setUploadError("");
  };

  const openDeleteConfirmation = () => {
    if (!selectedReport || !selectedReport.canDelete) return;
    closeActions();
    setDeleteError("");
    setDeleteDialogOpen(true);
  };

  const deleteReport = async () => {
    if (!selectedReport || !selectedReport.canDelete) return;

    try {
      await onDeleteReport(selectedReport.id);
      setDeleteDialogOpen(false);
      setUploadRequest(null);
    } catch (requestError) {
      setDeleteError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to delete report.",
      );
    }
  };

  const submitUpload = async (event) => {
    event.preventDefault();

    if (!file || !uploadRequest) return;

    if (file.size > MAX_PDF_SIZE) {
      setUploadError("PDF file must be 10 MB or smaller.");
      return;
    }

    const result = await onUploadReport(uploadRequest.id, file);
    if (result?.success === false) {
      setUploadError(result.message || "Unable to upload report.");
      return;
    }

    setFile(null);
    setUploadError("");
    setUploadRequest(null);
    setUploadDialogOpen(false);
  };

  const handleStatusChange = (request, nextStatus) => {
    if (["REJECTED", "CANCELLED"].includes(nextStatus)) {
      setReasonDialog({
        open: true,
        request,
        status: nextStatus,
        note: "",
      });
      return;
    }

    onStatusUpdate(
      request.id,
      nextStatus,
      request.expected_report_at || request.expectedReportAt || null,
      null,
    );
  };

  const submitReason = async () => {
    if (!reasonDialog.request || !reasonDialog.status) return;

    const note = reasonDialog.note.trim();

    await onStatusUpdate(
      reasonDialog.request.id,
      reasonDialog.status,
      reasonDialog.request.expected_report_at ||
        reasonDialog.request.expectedReportAt ||
        null,
      note || null,
    );

    setReasonDialog({
      open: false,
      request: null,
      status: null,
      note: "",
    });
  };
  const formatPrettyDate = (value) => {
    if (!value) return "-";

    const date = new Date(String(value).replace(" ", "T"));

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const shortCode = (value, max = 28) => {
    if (!value) return null;

    const text = String(value);

    if (text.length <= max) return text;

    return `${text.slice(0, max - 3)}...`;
  };

  const getPatientAgeGender = (request) => {
    const values = [];

    if (request.patient_age) {
      values.push(`${request.patient_age} yrs`);
    }

    if (request.patient_gender) {
      values.push(request.patient_gender);
    }

    return values.length ? values.join(" • ") : "Patient";
  };

  const getCreatorRole = (request) => {
    const roleId = Number(request.created_by_role_id);

    if (roleId === 2) return "Doctor";
    if (roleId === 1) return "Patient";
    if (roleId === 7) return "Technician";
    if (roleId === 4) return "Lab";
    if (roleId === 5) return "Admin";

    return request.created_by_name || "Unknown";
  };
const cellSx = {
  fontSize: "11px",
  color: "#334155",
  py: 1.25,
  px: 1,
  borderColor: "#EDF2F4",
  verticalAlign: "middle",
};
  return (
    <Box sx={{ width: "100%" }}>
      <SectionTitle
        title="Test Requests"
        description="Review patient test requests and update their processing status."
        action={
          <LabAddTestDialog
            onCreateRequest={onCreateRequest}
            requestOnlyPatient={requestOnlyPatient}
          />
        }
      />

    
     <Box sx={{ mb: 1.5, width: "100%" }}>
        <TableFilters
          {...filters}
          statusOptions={REQUEST_STATUSES}
          leftAction={
            <Button
  variant="outlined"
  size="small"
  disabled={pendingUploadCount === 0}
  onClick={onToggleDelayedUpload}
  sx={{
    height: 40,
    minWidth: { xs: "100%", md: 190 },
    px: 2,
    borderRadius: "8px",

    fontSize: "12px",
    fontWeight: 700,
    textTransform: "none",

    bgcolor: showDelayedOnly ? "#07876A" : "#EDF7F2",
    color: showDelayedOnly ? "#FFFFFF" : "#07876A",

    border: showDelayedOnly
      ? "1px solid #07876A"
      : "1px dashed #07876A",

    boxShadow: "none",

    // No hover effect
    "&:hover": {
      bgcolor: showDelayedOnly ? "#07876A" : "#EDF7F2",
      color: showDelayedOnly ? "#FFFFFF" : "#07876A",
      border: showDelayedOnly
        ? "1px solid #07876A"
        : "1px dashed #07876A",
      boxShadow: "none",
    },

    "&.Mui-disabled": {
      bgcolor: "#F8FAFC",
      color: "#A7B4C4",
      border: "1px dashed #CBD5E1",
    },
  }}
>
  {showDelayedOnly
    ? `Showing ${pendingUploadCount} Delayed`
    : `Delayed Reports (${pendingUploadCount})`}
</Button>
          }
          onReset={() => {
            filters?.onSearch?.("");
            filters?.onStatus?.("");
            filters?.onDate?.("");
            if (showDelayedOnly && onToggleDelayedUpload) {
              onToggleDelayedUpload();
            }
          }}
        />
      </Box>

     <DataTable
  columns={[
    "ORDER / REPORT",
    "PATIENT",
    "TEST & SAMPLE",
    "REQUESTED BY",
    "TECHNICIAN / REPORT DATE",
    "PRIORITY / STATUS",
    "ACTIONS",
  ]}
  loading={loading}
  emptyMessage="No test requests found."
  footer={
    safeRequests.length > 0 ? (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        gap={1}
        sx={{
          width: "100%",
          px: 0.5,
          py: 0.25,
        }}
      >
        <Typography
          sx={{
            fontSize: "11px",
            color: "#718087",
          }}
        >
          Showing{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: "#334155",
            }}
          >
            {startIndex + 1}-{endIndex}
          </Box>{" "}
          of{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              color: "#334155",
            }}
          >
            {pagination?.total || safeRequests.length}
          </Box>
        </Typography>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, value) => onPageChange?.(value)}
          size="small"
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={1}
          sx={{
            "& .MuiPaginationItem-root": {
              minWidth: 28,
              height: 28,
              borderRadius: "7px",
              fontSize: "11px",
              color: "#64748B",
            },

            "& .Mui-selected": {
              fontWeight: 700,
              bgcolor: "#E7F6F1 !important",
              color: "#07876A",
            },
          }}
        />
      </Stack>
    ) : null
  }
>
  {visible.map((request) => {
    const status = String(
      request?.status || "PENDING"
    ).toUpperCase();

    const priority = String(
      request?.priority || "NORMAL"
    ).toUpperCase();

    const statusStyle = getStatusStyle(status);

    const allowedStatuses = [
      status,
      ...(STATUS_TRANSITIONS[status] || []),
    ];

    const updating = actionId === request.id;

    const fieldUpdating = (field) =>
      actionId === request.id && actionField === field;

    const cancelled = isCancelled(request);

    // =========================
    // REPORT MATCH
    // =========================

    const requestReport = safeReports.find(
      (report) =>
        Number(getReportRequestId(report)) ===
        Number(request.id)
    );

    // =========================
    // DATA
    // =========================

    const tests = Array.isArray(request.requested_tests)
      ? request.requested_tests.join(", ")
      : request.requested_tests || "-";

    const reportDate =
      request.expected_report_at ||
      request.expectedReportAt;

    const technicianName =
      request.assigned_technician_name ||
      request.assignedTechnicianName;

    const technicianEmail =
      request.assigned_technician_email ||
      request.assignedTechnicianEmail ||
      "";

    const patientName =
      request.patient_name ||
      request.walk_in_patient_name ||
      request.patient_id ||
      "-";

    const requestedBy =
      request.created_by_name || "-";

    return (
      <TableRow
        key={request.id}
        sx={{
          transition: "background-color 0.18s ease",

          "&:hover": {
            bgcolor: "#F8FCFB",
          },

          "&:last-child td": {
            borderBottom: 0,
          },
        }}
      >
        {/* =====================================
            ORDER / REPORT
        ====================================== */}

        <TableCell
          sx={{
            ...cellSx,
            width: "15%",
            maxWidth: 165,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              title={
                request.order_id ||
                request.orderId ||
                `#${request.id}`
              }
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#172033",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {request.order_id ||
                request.orderId ||
                `#${request.id}`}
            </Typography>

            <Typography
              title={
                requestReport?.reportCode ||
                "Report not uploaded"
              }
              sx={{
                mt: 0.3,
                fontSize: "10px",
                color: requestReport?.reportCode
                  ? "#82909D"
                  : "#A3AFB8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {requestReport?.reportCode
                ? requestReport.reportCode
                : "Report pending"}
            </Typography>
          </Box>
        </TableCell>

        {/* =====================================
            PATIENT
        ====================================== */}

        <TableCell
          sx={{
            ...cellSx,
            width: "13%",
            maxWidth: 145,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              title={String(patientName)}
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#172033",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                
                cursor: "default",
              }}
            >
              {patientName}
            </Typography>

            <Typography
              sx={{
                mt: 0.25,
                fontSize: "10px",
                color: "#84919B",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getPatientAgeGender(request)}
            </Typography>
          </Box>
        </TableCell>

        {/* =====================================
            TEST & SAMPLE
        ====================================== */}

        <TableCell
          sx={{
            ...cellSx,
            width: "13%",
            maxWidth: 145,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              title={String(tests)}
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#172033",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "default",
              }}
            >
              {tests}
            </Typography>

            <Typography
              title={
                request.sample_type ||
                request.sampleType ||
                "No sample"
              }
              sx={{
                mt: 0.25,
                fontSize: "9.5px",
                fontWeight: 600,
                color: "#84919B",
                textTransform: "uppercase",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {request.sample_type ||
                request.sampleType ||
                "No sample"}
            </Typography>

            {request.collection_token ||
            request.collectionToken ? (
              <Typography
                title={`Token: ${
                  request.collection_token ||
                  request.collectionToken
                }`}
                sx={{
                  mt: 0.2,
                  fontSize: "9px",
                  color: "#07876A",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Token:{" "}
                {request.collection_token ||
                  request.collectionToken}
              </Typography>
            ) : null}
          </Box>
        </TableCell>

        {/* =====================================
            REQUESTED BY
        ====================================== */}

        <TableCell
          sx={{
            ...cellSx,
            width: "11%",
            maxWidth: 125,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              title={String(requestedBy)}
              sx={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#172033",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                cursor: "default",
              }}
            >
              {requestedBy}
            </Typography>

            <Typography
              title={getCreatorRole(request)}
              sx={{
                mt: 0.25,
                fontSize: "10px",
                color: "#84919B",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {getCreatorRole(request)}
            </Typography>
          </Box>
        </TableCell>

        {/* =====================================
            TECHNICIAN / REPORT DATE
        ====================================== */}

        <TableCell
          sx={{
            ...cellSx,
            width: "20%",
            maxWidth: 205,
          }}
        >
          <Stack spacing={0.65}>
            {/* TECHNICIAN */}

            {technicianName ? (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.6}
                sx={{
                  minWidth: 0,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "#16A36A",
                    flexShrink: 0,
                  }}
                />

                <Typography
                  title={technicianName}
                  sx={{
                    fontSize: "10.5px",
                    color: "#52646B",
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 150,
                  }}
                >
                  {technicianName}
                </Typography>
              </Stack>
            ) : (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.4}
              >
                <Select
                  size="small"
                  value={technicianEmail}
                  displayEmpty
                  disabled={
                    cancelled ||
                    actionId === request.id ||
                    !technicians.length ||
                    !canAssignTechnician(request)
                  }
                  onChange={(event) => {
                    if (event.target.value) {
                      onAssignTechnician?.(
                        request.id,
                        event.target.value
                      );
                    }
                  }}
                  sx={{
                    width: 155,
                    height: 28,
                    borderRadius: "6px",
                    bgcolor: "#FAFCFC",
                    fontSize: "10px",
                    color: "#64748B",

                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#DCE5E8",
                    },

                    "&:hover .MuiOutlinedInput-notchedOutline":
                      {
                        borderColor: "#B9CDCA",
                      },

                    "& .MuiSelect-select": {
                      py: 0.45,
                      px: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontSize: "10.5px" }}
                  >
                    {canAssignTechnician(request)
                      ? "Assign technician"
                      : technicians.length
                        ? "Not assigned"
                        : "Add technician first"}
                  </MenuItem>

                  {technicians.map((technician) => (
                    <MenuItem
                      key={technician.email}
                      value={technician.email}
                      title={technician.full_name}
                      sx={{
                        fontSize: "10.5px",
                        maxWidth: 250,
                      }}
                    >
                      {technician.full_name}
                    </MenuItem>
                  ))}
                </Select>

                {fieldUpdating("technician") && (
                  <CircularProgress
                    size={12}
                    thickness={5}
                    sx={{
                      color: "#07876A",
                    }}
                  />
                )}
              </Stack>
            )}

            {/* REPORT DATE */}

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.4}
            >
              <CalendarMonthOutlinedIcon
                sx={{
                  fontSize: 13,
                  color: "#84919B",
                  flexShrink: 0,
                }}
              />

              <TextField
                type="datetime-local"
                size="small"
                value={
                  dateDrafts[request.id] ??
                  formatDateTimeInputValue(reportDate)
                }
                onChange={(event) => {
                  const value = event.target.value;

                  setDateDrafts((prev) => ({
                    ...prev,
                    [request.id]: value,
                  }));
                }}
                onBlur={(event) => {
                  const value = event.target.value;

                  if (!isCompleteDateTimeValue(value)) {
                    return;
                  }

                  const currentValue =
                    formatDateTimeInputValue(reportDate);

                  if (value === currentValue) {
                    return;
                  }

                  onReportDateUpdate?.(
                    request.id,
                    value
                  );
                }}
                disabled={
                  cancelled ||
                  fieldUpdating("reportDate")
                }
                sx={{
                  width: 155,

                  "& .MuiInputBase-root": {
                    height: 28,
                    fontSize: "9.5px",
                    borderRadius: "6px",
                    bgcolor: "#FAFCFC",
                  },

                  "& .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#DCE5E8",
                    },

                  "&:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#B9CDCA",
                    },

                  "& .MuiInputBase-input": {
                    px: 0.75,
                    py: 0.4,
                  },
                }}
              />

              {fieldUpdating("reportDate") && (
                <CircularProgress
                  size={12}
                  thickness={5}
                  sx={{
                    color: "#07876A",
                    flexShrink: 0,
                  }}
                />
              )}
            </Stack>
          </Stack>
        </TableCell>

        {/* =====================================
            PRIORITY / STATUS
        ====================================== */}

        <TableCell
          sx={{
            ...cellSx,
            width: "15%",
            maxWidth: 145,
          }}
        >
          <Stack
            spacing={0.55}
            alignItems="flex-start"
          >
            <Chip
              size="small"
              label={priority}
              sx={{
                height: 21,
                borderRadius: "5px",

                bgcolor:
                  priority === "URGENT"
                    ? "#FFF1F2"
                    : "#EEF6FF",

                color:
                  priority === "URGENT"
                    ? "#DC2626"
                    : "#2563EB",

                fontSize: "9px",
                fontWeight: 800,

                border: `1px solid ${
                  priority === "URGENT"
                    ? "#FFE0E4"
                    : "#D7E8FF"
                }`,

                "& .MuiChip-label": {
                  px: 0.8,
                },
              }}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={0.3}
            >
              <Select
                size="small"
                value={status}
                onChange={(event) =>
                  handleStatusChange(
                    request,
                    event.target.value
                  )
                }
                disabled={updating || cancelled}
                sx={{
                  width: 125,
                  height: 27,
                  borderRadius: "6px",
                  bgcolor: statusStyle.bgcolor,
                  color: statusStyle.color,
                  fontSize: "9px",
                  fontWeight: 800,

                  "& .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor:
                        statusStyle.borderColor,
                    },

                  "& .MuiSvgIcon-root": {
                    fontSize: 15,
                    color: statusStyle.color,
                  },

                  "& .MuiSelect-select": {
                    py: 0.4,
                    px: 0.8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                {REQUEST_STATUSES.map((item) => (
                  <MenuItem
                    key={item}
                    value={item}
                    disabled={
                      !allowedStatuses.includes(item)
                    }
                    sx={{
                      fontSize: "10.5px",
                    }}
                  >
                    {item.replaceAll("_", " ")}
                  </MenuItem>
                ))}
              </Select>

              {fieldUpdating("status") && (
                <CircularProgress
                  size={12}
                  thickness={5}
                  sx={{
                    color: "#07876A",
                  }}
                />
              )}
            </Stack>
          </Stack>
        </TableCell>

        {/* =====================================
            ACTIONS
        ====================================== */}

        <TableCell
          align="center"
          sx={{
            ...cellSx,
            width: "6%",
            px: 0.5,
          }}
        >
          <IconButton
            size="small"
            disabled={cancelled}
            onClick={(event) =>
              openActions(event, request)
            }
            sx={{
              width: 29,
              height: 29,
              border: "1px solid #E1E8EA",
              borderRadius: "7px",
              color: "#64748B",
              bgcolor: "#FFFFFF",

              "&:hover": {
                bgcolor: "#F1F8F6",
                color: "#07876A",
                borderColor: "#C9E3DC",
              },
            }}
          >
            <MoreVertIcon
              sx={{
                fontSize: 17,
              }}
            />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  })}
</DataTable>

      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={closeActions}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 205,
            borderRadius: "7px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 8px 24px rgba(15,23,42,0.10)",
            "& .MuiMenuItem-root": {
              minHeight: 38,
              fontSize: "11.5px",
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            closeActions();
            onCreateReport?.(uploadRequest);
          }}
          disabled={!uploadRequest || isCancelled(uploadRequest)}
        >
          <DescriptionOutlinedIcon
            sx={{ mr: 1, fontSize: 17, color: "#0B5C8E" }}
          />
          Create report
        </MenuItem>

        <MenuItem
          onClick={openUpload}
          disabled={uploadRequest ? isCancelled(uploadRequest) : false}
        >
          <UploadFileIcon
            sx={{
              mr: 1,
              fontSize: 17,
              color: "#0B5C8E",
            }}
          />
          Upload Report
        </MenuItem>

        <MenuItem
          onClick={openCollectionDetails}
          disabled={uploadRequest ? isCancelled(uploadRequest) : false}
        >
          <CalendarMonthOutlinedIcon
            sx={{ mr: 1, fontSize: 17, color: "#0B5C8E" }}
          />
          Collection slot & instructions
        </MenuItem>

        {selectedReport?.downloadUrl ? (
          <MenuItem
            component="a"
            href={selectedReport.downloadUrl}
            target="_blank"
            rel="noreferrer"
            onClick={closeActions}
          >
            <VisibilityOutlinedIcon
              sx={{
                mr: 1,
                fontSize: 17,
                color: "#14734F",
              }}
            />
            View Uploaded PDF
          </MenuItem>
        ) : null}

        {selectedReport ? (
          <MenuItem
            onClick={openDeleteConfirmation}
            disabled={!selectedReport.canDelete}
            sx={{
              color: selectedReport.canDelete ? "#DC2626" : "#94A3B8",
            }}
          >
            <DeleteOutlineIcon
              sx={{
                mr: 1,
                fontSize: 17,
              }}
            />
            {selectedReport.canDelete
              ? "Delete uploaded PDF"
              : "Delete unavailable"}
          </MenuItem>
        ) : null}
      </Menu>

      <Dialog
        open={collectionDialog.open}
        onClose={() =>
          actionId !== collectionDialog.request?.id &&
          setCollectionDialog({
            open: false,
            request: null,
            date: "",
            instructions: "",
          })
        }
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle
          sx={{ fontSize: "16px", fontWeight: 700, color: "#123F66" }}
        >
          Collection details
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.5, pt: 1 }}>
          <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
            Select the collection date. The collection time and next token
            number are assigned automatically from the lab schedule.
          </Typography>
          <TextField
            required
            size="small"
            type="date"
            label="Collection date"
            value={collectionDialog.date}
            onChange={(event) =>
              setCollectionDialog((current) => ({
                ...current,
                date: event.target.value,
              }))
            }
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            required
            size="small"
            multiline
            minRows={3}
            label="Collection instructions"
            placeholder="Example: Call the patient 30 minutes before arrival. Keep the sample refrigerated."
            value={collectionDialog.instructions}
            onChange={(event) =>
              setCollectionDialog((current) => ({
                ...current,
                instructions: event.target.value,
              }))
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() =>
              setCollectionDialog({
                open: false,
                request: null,
                date: "",
                instructions: "",
              })
            }
            disabled={actionId === collectionDialog.request?.id}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={
              !collectionDialog.request ||
              !collectionDialog.date ||
              !collectionDialog.instructions.trim() ||
              actionId === collectionDialog.request.id
            }
            onClick={async () => {
              const saved = await onCollectionDetailsUpdate?.(
                collectionDialog.request.id,
                collectionDialog.date,
                collectionDialog.instructions,
              );
              if (saved !== false) {
                setCollectionDialog({
                  open: false,
                  request: null,
                  date: "",
                  instructions: "",
                });
              }
            }}
            sx={{ textTransform: "none" }}
          >
            {actionId === collectionDialog.request?.id
              ? "Saving..."
              : "Save details"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteError("");
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle
          sx={{ fontSize: "16px", fontWeight: 700, color: "#123F66" }}
        >
          Delete uploaded report?
        </DialogTitle>
        <DialogContent>
          {deleteError ? (
            <Alert severity="error" sx={{ mb: 1.5, fontSize: "12px" }}>
              {deleteError}
            </Alert>
          ) : null}
          <Typography
            sx={{ fontSize: "13px", color: "#52646B", lineHeight: 1.6 }}
          >
            This report will be removed from the request. You can upload a
            corrected PDF again while the request is not completed.
          </Typography>
          <Typography
            sx={{ mt: 1, fontSize: "12px", fontWeight: 700, color: "#334155" }}
          >
            {selectedReport?.originalFileName || "Uploaded report"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none", color: "#52646B" }}
          >
            Keep report
          </Button>
          <Button
            onClick={deleteReport}
            color="error"
            variant="contained"
            sx={{ textTransform: "none" }}
          >
            Delete report
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={uploadDialogOpen}
        onClose={closeUploadDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "10px",
          },
        }}
      >
        <Box component="form" onSubmit={submitUpload}>
          <DialogTitle
            sx={{
              px: 2.5,
              py: 1.75,
              borderBottom: "1px solid #EDF1F3",
            }}
          >
            <Typography
              sx={{
                color: "#123F66",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              Upload Report
            </Typography>

            <Typography
              sx={{
                fontSize: "10.5px",
                color: "#7A8C92",
                mt: 0.25,
              }}
            >
              Upload patient's laboratory report in PDF format.
            </Typography>
          </DialogTitle>

          <DialogContent
            sx={{
              display: "grid",
              gap: 1.5,
              px: 2.5,
              py: "20px !important",
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: "7px",
                bgcolor: "#F8FAFC",
                border: "1px solid #E8EDF0",
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "#84959B",
                  fontWeight: 600,
                }}
              >
                REQUEST
              </Typography>

              <Typography
                sx={{
                  fontSize: "12.5px",
                  color: "#334155",
                  fontWeight: 600,
                  mt: 0.3,
                }}
              >
                #{uploadRequest?.id} ·{" "}
                {uploadRequest?.patient_name || "Patient"}
              </Typography>
            </Box>

            {uploadError ? (
              <Alert
                severity="error"
                sx={{
                  fontSize: "11px",
                  borderRadius: "7px",
                }}
              >
                {uploadError}
              </Alert>
            ) : null}

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{
                minHeight: 46,
                justifyContent: "flex-start",
                borderRadius: "7px",
                borderStyle: "dashed",
                borderColor: "#B8CCD6",
                color: file ? "#14734F" : "#52646B",
                bgcolor: file ? "#F3FAF6" : "#FFFFFF",
                fontSize: "11.5px",
                textTransform: "none",
              }}
            >
              {file ? file.name : "Choose PDF file"}

              <input
                hidden
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const selectedFile = event.target.files?.[0] || null;

                  if (selectedFile && selectedFile.size > MAX_PDF_SIZE) {
                    setFile(null);
                    setUploadError("PDF file must be 10 MB or smaller.");
                  } else {
                    setFile(selectedFile);
                    setUploadError("");
                  }
                }}
              />
            </Button>

            <Typography
              sx={{
                fontSize: "10px",
                color: "#84959B",
              }}
            >
              PDF files only · Maximum file size 10 MB
            </Typography>
          </DialogContent>

          <DialogActions
            sx={{
              px: 2.5,
              py: 1.5,
              borderTop: "1px solid #EDF1F3",
            }}
          >
            <Button
              onClick={closeUploadDialog}
              disabled={uploading}
              sx={{
                fontSize: "11.5px",
                textTransform: "none",
                color: "#64748B",
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={uploading || !file}
              startIcon={
                uploading ? (
                  <CircularProgress size={13} color="inherit" />
                ) : (
                  <UploadFileIcon />
                )
              }
              sx={{
                minWidth: 125,
                height: 34,
                bgcolor: "#0B5C8E",
                borderRadius: "6px",
                fontSize: "11.5px",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#094F79",
                  boxShadow: "none",
                },
              }}
            >
              {uploading ? "Uploading..." : "Upload Report"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog
        open={reasonDialog.open}
        onClose={() => {
          if (actionId === reasonDialog.request?.id) return;

          setReasonDialog({
            open: false,
            request: null,
            status: null,
            note: "",
          });
        }}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 2.5,
            py: 1.75,
            borderBottom: "1px solid #EDF1F3",
          }}
        >
          <Typography
            sx={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#123F66",
            }}
          >
            {reasonDialog.status === "CANCELLED"
              ? "Cancel Request"
              : "Reject Request"}
          </Typography>

          <Typography
            sx={{
              fontSize: "10.5px",
              color: "#7A8C92",
              mt: 0.25,
            }}
          >
            Add a reason so the request history remains clear.
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            px: 2.5,
            py: "20px !important",
          }}
        >
          <TextField
            multiline
            minRows={3}
            fullWidth
            size="small"
            label="Reason / comment"
            value={reasonDialog.note}
            onChange={(event) =>
              setReasonDialog((current) => ({
                ...current,
                note: event.target.value,
              }))
            }
            placeholder="Example: Sample was not collected on time."
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "7px",
                fontSize: "12px",
              },
              "& .MuiInputLabel-root": {
                fontSize: "12px",
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.5,
            py: 1.5,
            borderTop: "1px solid #EDF1F3",
          }}
        >
          <Button
            disabled={actionId === reasonDialog.request?.id}
            onClick={() =>
              setReasonDialog({
                open: false,
                request: null,
                status: null,
                note: "",
              })
            }
            sx={{
              fontSize: "11.5px",
              textTransform: "none",
              color: "#64748B",
            }}
          >
            Close
          </Button>

          <Button
            variant="contained"
            color={reasonDialog.status === "CANCELLED" ? "error" : "warning"}
            onClick={submitReason}
            disabled={actionId === reasonDialog.request?.id}
            sx={{
              minWidth: 90,
              height: 34,
              borderRadius: "6px",
              fontSize: "11.5px",
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            {actionId === reasonDialog.request?.id
              ? "Submitting..."
              : reasonDialog.status === "CANCELLED"
                ? "Cancel Request"
                : "Reject Request"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
