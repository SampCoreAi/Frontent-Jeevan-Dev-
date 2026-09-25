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
  APPROVED: ["SAMPLE_COLLECTED", "REJECTED", "CANCELLED"],
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
    slot: "",
    instructions: "",
    token: "",
  });

  const safeRequests = Array.isArray(requests) ? requests : [];
  const safeReports = Array.isArray(reports) ? reports : [];
  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;

  const totalPages = pagination?.totalPages || Math.max(1, Math.ceil(safeRequests.length / safePageSize));

  const currentPage = Math.min(
    Math.max(Number(page) || 1, 1),
    totalPages
  );

  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = Math.min(
    startIndex + safePageSize,
    safeRequests.length
  );

  const visible = pagination ? safeRequests : safeRequests.slice(startIndex, endIndex);

  const selectedReport = uploadRequest
    ? safeReports.find(
        (report) =>
          Number(getReportRequestId(report)) ===
          Number(uploadRequest.id)
      )
    : null;

  const isCancelled = (request) =>
    String(request?.status || "").toUpperCase() === "CANCELLED";

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
      slot: formatDateTimeInputValue(request?.collection_slot || request?.collectionSlot || ""),
      instructions: request?.collection_instructions || request?.collectionInstructions || "",
      token: request?.collection_token || request?.collectionToken || "",
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
          "Unable to delete report."
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
      request.expected_report_at ||
        request.expectedReportAt ||
        null,
      null
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
      note || null
    );

    setReasonDialog({
      open: false,
      request: null,
      status: null,
      note: "",
    });
  };

  const cellSx = {
    fontSize: "12.5px",
    color: "#334155",
    py: 1.25,
    borderColor: "#EDF1F3",
    whiteSpace: "nowrap",
  };

  return (
    <Box sx={{ width: "100%" }}>
      <SectionTitle
        title="Test Requests"
        description="Review patient test requests and update their processing status."
      />

      {updateFeedback?.message ? (
        <Alert
          severity={updateFeedback.type || "info"}
          sx={{
            mt: 1.5,
            mb: 1.5,
            borderRadius: "7px",
            fontSize: "12px",
            fontWeight: 600,
            alignItems: "center",
          }}
        >
          {updateFeedback.message}
        </Alert>
      ) : null}

      <Box sx={{ mt: 1.5, mb: 1.5, width: "100%" }}>
        <TableFilters
          {...filters}
          statusOptions={REQUEST_STATUSES}
          leftAction={
            <Button
              variant={showDelayedOnly ? "contained" : "outlined"}
              size="small"
              disabled={pendingUploadCount === 0}
              onClick={onToggleDelayedUpload}
              sx={{
                height: 40,
                minWidth: { xs: "100%", md: 190 },
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",
                bgcolor: showDelayedOnly ? "#0B5C8E" : "#FFFFFF",
                color: showDelayedOnly ? "#FFFFFF" : "#0B5C8E",
                borderColor: "#B8D1E2",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: showDelayedOnly ? "#094F79" : "#F4F9FC",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  bgcolor: "#F8FAFC",
                  color: "#A7B4C4",
                  borderColor: "#E2E8F0",
                },
              }}
            >
              {showDelayedOnly
                ? `Showing ${pendingUploadCount} delayed`
                : `Pending uploads (${pendingUploadCount})`}
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
          "SNO",
          "ORDER ID",
          "SAMPLE",
          "TECHNICIAN",
          "PATIENT",
          "DOCTOR",
          "TESTS",
          "PRIORITY",
          "REPORT BY",
          "STATUS",
          "REASON",
          "ACTION",
        ]}
        loading={loading}
        emptyMessage="No test requests found."
        footer={
          safeRequests.length > 0 ? (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems="center"
              gap={1.5}
              sx={{
                width: "100%",
                px: { xs: 0.5, sm: 1 },
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "11.5px",
                  color: "#718087",
                }}
              >
                Showing{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "#334155" }}
                >
                  {startIndex + 1}-{endIndex}
                </Box>{" "}
                of{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: "#334155" }}
                >
                  {safeRequests.length}
                </Box>
              </Typography>

              <Pagination
                count={totalPages}
                page={Math.min(currentPage, totalPages) - 1}
                onChange={(_, value) => onPageChange?.(value + 1)}
                size="small"
                color="primary"
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    minWidth: 30,
                    height: 30,
                    borderRadius: "6px",
                    fontSize: "11.5px",
                  },
                  "& .Mui-selected": {
                    fontWeight: 700,
                  },
                }}
              />
            </Stack>
          ) : null
        }
      >
        {visible.map((request, index) => {
          const status = String(
            request?.status || "PENDING"
          ).toUpperCase();

          const priority = String(
            request?.priority || "NORMAL"
          ).toUpperCase();

          const statusStyle = getStatusStyle(status);
          const allowedStatuses = [status, ...(STATUS_TRANSITIONS[status] || [])];
          const priorityStyle = getPriorityStyle(priority);
          const updating = actionId === request.id;
          const cancelled = isCancelled(request);

          const reason =
            request.latest_status_note ||
            request.latestStatusNote ||
            request.status_note ||
            request.note;
          const currentDateTimeValue = formatDateTimeInputValue(
            request.expected_report_at || request.expectedReportAt || ""
          );
          const draftDateTimeValue = dateDrafts[request.id] ?? currentDateTimeValue;

          return (
            <TableRow
              key={request.id}
              sx={{
                transition: "background-color 0.15s ease",
                "&:hover": {
                  bgcolor: "#F8FBFC",
                },
                "&:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              <TableCell
                sx={{
                  ...cellSx,
                  fontWeight: 700,
                  color: "#64748B",
                }}
              >
                {startIndex + index + 1}
              </TableCell>

              <TableCell sx={{ ...cellSx, fontWeight: 700, color: "#0B5C8E" }}>
                {request.order_id || request.orderId || "-"}
              </TableCell>

              <TableCell sx={{ ...cellSx, fontWeight: 600 }}>
                <Typography sx={{ fontSize: "12.5px", fontWeight: 600 }}>
                  {request.sample_type || request.sampleType || "-"}
                </Typography>
                {request.collection_slot || request.collectionSlot ? (
                  <Typography variant="caption" display="block" color="text.secondary">
                    Collection: {new Date(request.collection_slot || request.collectionSlot).toLocaleString()}
                  </Typography>
                ) : null}
                {request.collection_token || request.collectionToken ? (
                  <Typography variant="caption" display="block" color="text.secondary">
                    Token: {request.collection_token || request.collectionToken}
                  </Typography>
                ) : null}
              </TableCell>

              <TableCell sx={{ ...cellSx, minWidth: 190 }}>
                <Select
                  size="small"
                  value={request.assigned_technician_email || ""}
                  displayEmpty
                  disabled={cancelled || actionId === request.id || !technicians.length}
                  onChange={(event) => {
                    if (event.target.value) onAssignTechnician?.(request.id, event.target.value);
                  }}
                  sx={{ minWidth: 175, height: 32, fontSize: "11px" }}
                >
                  <MenuItem value="" sx={{ fontSize: "11px" }}>
                    {technicians.length ? "Assign technician" : "Add technician first"}
                  </MenuItem>
                  {technicians.map((technician) => (
                    <MenuItem key={technician.email} value={technician.email} sx={{ fontSize: "11px" }}>
                      {technician.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  minWidth: 150,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#24363D",
                  }}
                >
                  {request.patient_name ||
                    request.patient_id ||
                    "-"}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  minWidth: 145,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    fontWeight: 600,
                    color: "#52646B",
                  }}
                >
                  {request.doctor_name ||
                    request.doctor_id ||
                    "-"}
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  minWidth: 190,
                  maxWidth: 260,
                  whiteSpace: "normal",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#52646B",
                    lineHeight: 1.45,
                  }}
                >
                  {Array.isArray(request.requested_tests)
                    ? request.requested_tests.join(", ")
                    : request.requested_tests || "-"}
                </Typography>
              </TableCell>

              <TableCell sx={cellSx}>
                <Chip
                  size="small"
                  label={priority}
                  variant="outlined"
                  sx={{
                    height: 23,
                    bgcolor: "transparent",
                    color: priorityStyle.color,
                    border: 0,
                    fontSize: "9.5px",
                    fontWeight: 700,
                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </TableCell>

             <TableCell
  sx={{
    ...cellSx,
    minWidth: 190,
  }}
>
  <Stack
    direction="row"
    alignItems="center"
    spacing={0.7}
  >
    <TextField
      size="small"
      type="datetime-local"
      value={draftDateTimeValue}
      onChange={(event) => {
        const nextValue = event.target.value || "";
        setDateDrafts((current) => ({
          ...current,
          [request.id]: nextValue,
        }));
      }}
      onBlur={() => {
        const nextValue = dateDrafts[request.id] ?? currentDateTimeValue;
        if (!isCompleteDateTimeValue(nextValue)) return;

        if (nextValue === currentDateTimeValue) return;

        onReportDateUpdate?.(request.id, nextValue);
      }}
      disabled={updating || cancelled}
      InputLabelProps={{ shrink: true }}
      sx={{
        width: 175,
        "& .MuiOutlinedInput-root": {
          height: 34,
          borderRadius: "6px",
          bgcolor: cancelled ? "#F8FAFC" : "#FFFFFF",
        },
        "& .MuiInputBase-input": {
          fontSize: "11px",
          px: 1,
          py: 0,
        },
        '& input[type="datetime-local"]::-webkit-calendar-picker-indicator': {
          opacity: 1,
          cursor: "pointer",
          filter:
            "invert(31%) sepia(37%) saturate(1329%) hue-rotate(158deg) brightness(85%) contrast(95%)",
        },
      }}
    />

    {updating && (
      <CircularProgress
        size={15}
        thickness={5}
        sx={{ color: "#0B5C8E" }}
      />
    )}
  </Stack>
</TableCell>

              <TableCell sx={cellSx}>
                <Select
                  size="small"
                  value={status}
                  onChange={(event) => handleStatusChange(request, event.target.value)}
                  disabled={updating || cancelled}
                  sx={{
                    minWidth: 155,
                    height: 32,
                    borderRadius: "6px",
                    bgcolor: "transparent",
                    color: statusStyle.color,
                    fontSize: "11px",
                    fontWeight: 700,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: 0,
                    },
                    "& .MuiSvgIcon-root": { color: statusStyle.color },
                    "& .MuiSelect-select": { py: 0.8 },
                  }}
                >
                  {REQUEST_STATUSES.map((item) => (
                    <MenuItem key={item} value={item} disabled={!allowedStatuses.includes(item)} sx={{ fontSize: "12px" }}>
                      {item.replaceAll("_", " ")}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>

              <TableCell
                sx={{
                  ...cellSx,
                  minWidth: 150,
                  maxWidth: 220,
                  whiteSpace: "normal",
                }}
              >
                {["REJECTED", "CANCELLED"].includes(status) ? (
                  <Typography
                    title={reason || "No reason provided."}
                    sx={{
                      fontSize: "11px",
                      color: "#64748B",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {reason || "No reason provided."}
                  </Typography>
                ) : (
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#CBD5E1",
                    }}
                  >
                    —
                  </Typography>
                )}
              </TableCell>

              <TableCell sx={cellSx}>
                <IconButton
                  size="small"
                  disabled={cancelled}
                  onClick={(event) =>
                    openActions(event, request)
                  }
                  sx={{
                    width: 30,
                    height: 30,
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    color: "#64748B",
                    "&:hover": {
                      bgcolor: "#F1F7F9",
                      color: "#0B5C8E",
                      borderColor: "#BDD7E5",
                    },
                  }}
                >
                  <MoreVertIcon sx={{ fontSize: 18 }} />
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
          onClick={openUpload}
          disabled={
            uploadRequest ? isCancelled(uploadRequest) : false
          }
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

        <MenuItem onClick={openCollectionDetails} disabled={uploadRequest ? isCancelled(uploadRequest) : false}>
          <CalendarMonthOutlinedIcon sx={{ mr: 1, fontSize: 17, color: "#0B5C8E" }} />
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
              color: selectedReport.canDelete
                ? "#DC2626"
                : "#94A3B8",
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
        onClose={() => actionId !== collectionDialog.request?.id && setCollectionDialog({ open: false, request: null, slot: "", instructions: "", token: "" })}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle sx={{ fontSize: "16px", fontWeight: 700, color: "#123F66" }}>
          Collection details
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.5, pt: 1 }}>
          <Typography sx={{ fontSize: "12px", color: "#64748B" }}>
            Set the appointment window and instructions the assigned technician should follow.
          </Typography>
          <TextField
            size="small"
            type="datetime-local"
            label="Collection slot"
            value={collectionDialog.slot}
            onChange={(event) => setCollectionDialog((current) => ({ ...current, slot: event.target.value }))}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            size="small"
            label="Collection token"
            placeholder="Example: 12 or A-12"
            value={collectionDialog.token}
            onChange={(event) => setCollectionDialog((current) => ({ ...current, token: event.target.value }))}
            helperText="Assigned by the lab for the collection sequence."
            fullWidth
          />
          <TextField
            size="small"
            multiline
            minRows={3}
            label="Collection instructions"
            placeholder="Example: Call the patient 30 minutes before arrival. Keep the sample refrigerated."
            value={collectionDialog.instructions}
            onChange={(event) => setCollectionDialog((current) => ({ ...current, instructions: event.target.value }))}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button onClick={() => setCollectionDialog({ open: false, request: null, slot: "", instructions: "", token: "" })} disabled={actionId === collectionDialog.request?.id} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!collectionDialog.request || actionId === collectionDialog.request.id}
            onClick={async () => {
              const saved = await onCollectionDetailsUpdate?.(
                collectionDialog.request.id,
                collectionDialog.slot,
                collectionDialog.instructions,
                collectionDialog.token,
              );
              if (saved !== false) {
                setCollectionDialog({ open: false, request: null, slot: "", instructions: "", token: "" });
              }
            }}
            sx={{ textTransform: "none" }}
          >
            {actionId === collectionDialog.request?.id ? "Saving..." : "Save details"}
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
        <DialogTitle sx={{ fontSize: "16px", fontWeight: 700, color: "#123F66" }}>
          Delete uploaded report?
        </DialogTitle>
        <DialogContent>
          {deleteError ? (
            <Alert severity="error" sx={{ mb: 1.5, fontSize: "12px" }}>
              {deleteError}
            </Alert>
          ) : null}
          <Typography sx={{ fontSize: "13px", color: "#52646B", lineHeight: 1.6 }}>
            This report will be removed from the request. You can upload a corrected PDF again while the request is not completed.
          </Typography>
          <Typography sx={{ mt: 1, fontSize: "12px", fontWeight: 700, color: "#334155" }}>
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
                  const selectedFile =
                    event.target.files?.[0] || null;

                  if (
                    selectedFile &&
                    selectedFile.size > MAX_PDF_SIZE
                  ) {
                    setFile(null);
                    setUploadError(
                      "PDF file must be 10 MB or smaller."
                    );
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
                  <CircularProgress
                    size={13}
                    color="inherit"
                  />
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
            disabled={
              actionId === reasonDialog.request?.id
            }
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
            color={
              reasonDialog.status === "CANCELLED"
                ? "error"
                : "warning"
            }
            onClick={submitReason}
            disabled={
              actionId === reasonDialog.request?.id
            }
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