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
  "APPROVED",
  "REJECTED",
  "SAMPLE_COLLECTED",
  "PROCESSING",
  "REPORT_UPLOADED",
  "COMPLETED",
  "CANCELLED",
];

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

export default function LabRequests({
  reports = [],
  requests = [],
  loading = false,
  filters,
  page = 1,
  pageSize = 10,
  onPageChange,
  actionId,
  onStatusUpdate,
  uploading,
  onUploadReport,
  onDeleteReport,
  updateFeedback = { type: "", message: "" },
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [actionAnchor, setActionAnchor] = useState(null);
  const [uploadRequest, setUploadRequest] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reasonDialog, setReasonDialog] = useState({
    open: false,
    request: null,
    status: null,
    note: "",
  });

  const safeRequests = Array.isArray(requests) ? requests : [];
  const safeReports = Array.isArray(reports) ? reports : [];
  const safePageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;

  const totalPages = Math.max(
    1,
    Math.ceil(safeRequests.length / safePageSize)
  );

  const currentPage = Math.min(
    Math.max(Number(page) || 1, 1),
    totalPages
  );

  const startIndex = (currentPage - 1) * safePageSize;
  const endIndex = Math.min(
    startIndex + safePageSize,
    safeRequests.length
  );

  const visible = safeRequests.slice(startIndex, endIndex);

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

  const deleteReport = async () => {
    if (!selectedReport || !selectedReport.canDelete) return;
    if (!window.confirm("Delete this uploaded report?")) return;

    await onDeleteReport(selectedReport.id);
    closeActions();
  };

  const submitUpload = async (event) => {
    event.preventDefault();

    if (!file || !uploadRequest) return;

    if (file.size > MAX_PDF_SIZE) {
      setUploadError("PDF file must be 10 MB or smaller.");
      return;
    }

    await onUploadReport(uploadRequest.id, file);

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

      <Box sx={{ mt: 1.5, mb: 1.5 }}>
        <TableFilters
          {...filters}
          statusOptions={REQUEST_STATUSES}
        />
      </Box>

      <DataTable
        columns={[
          "SNO",
          "PATIENT",
          "DOCTOR",
          "TESTS",
          "PRIORITY",
          "REPORT BY",
          "STATUS",
          "REASON",
          "UPDATE",
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
                page={currentPage}
                onChange={(_, value) => onPageChange?.(value)}
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
          const priorityStyle = getPriorityStyle(priority);
          const updating = actionId === request.id;
          const cancelled = isCancelled(request);

          const reason =
            request.latest_status_note ||
            request.latestStatusNote ||
            request.status_note ||
            request.note;

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
                    bgcolor: priorityStyle.bgcolor,
                    color: priorityStyle.color,
                    borderColor: priorityStyle.borderColor,
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
      value={formatDateTimeInputValue(
        request.expected_report_at ||
          request.expectedReportAt
      )}
      onChange={(event) =>
        onStatusUpdate(
          request.id,
          request.status || "PENDING",
          event.target.value || null
        )
      }
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
                <Chip
                  size="small"
                  label={status.replaceAll("_", " ")}
                  variant="outlined"
                  sx={{
                    height: 23,
                    bgcolor: statusStyle.bgcolor,
                    color: statusStyle.color,
                    borderColor: statusStyle.borderColor,
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

              <TableCell
                sx={{
                  ...cellSx,
                  minWidth: 175,
                }}
              >
                <Select
                  size="small"
                  value={request.status || "PENDING"}
                  onChange={(event) =>
                    handleStatusChange(
                      request,
                      event.target.value
                    )
                  }
                  disabled={updating || cancelled}
                  sx={{
                    width: 165,
                    height: 34,
                    borderRadius: "6px",
                    bgcolor: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: 600,
                    "& .MuiSelect-select": {
                      py: 0.8,
                    },
                  }}
                >
                  {REQUEST_STATUSES.map((item) => (
                    <MenuItem
                      key={item}
                      value={item}
                      sx={{
                        fontSize: "12px",
                      }}
                    >
                      {item.replaceAll("_", " ")}
                    </MenuItem>
                  ))}
                </Select>
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
            onClick={deleteReport}
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