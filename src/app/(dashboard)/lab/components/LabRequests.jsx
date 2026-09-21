"use client";

import { useState } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Pagination, Select, TableCell, TableRow, TextField, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

const REQUEST_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SAMPLE_COLLECTED", "PROCESSING", "REPORT_UPLOADED", "COMPLETED", "CANCELLED"];
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const getReportRequestId = (report = {}) => report.requestId || report.testRequestId || report.test_request_id || report.request_id;
const formatReportDateTime = (value) => value ? new Date(value).toLocaleString() : "-";
const formatDateTimeInputValue = (value) => {
  if (!value) return "";
  const normalized = String(value).replace(" ", "T");
  return normalized.slice(0, 16);
};

export default function LabRequests({ reports = [], requests, loading, filters, onFilter, page, pageSize, onPageChange, actionId, onStatusUpdate, uploading, onUploadReport, onDeleteReport, updateFeedback = { type: "", message: "" } }) {
  const [actionAnchor, setActionAnchor] = useState(null);
  const [uploadRequest, setUploadRequest] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [reasonDialog, setReasonDialog] = useState({ open: false, request: null, status: null, note: "" });

  const visible = requests.slice((page - 1) * pageSize, page * pageSize);
  const openActions = (event, request) => { setActionAnchor(event.currentTarget); setUploadRequest(request); };
  const closeActions = () => setActionAnchor(null);
  const openUpload = () => { setUploadDialogOpen(true); closeActions(); };
  const selectedReport = uploadRequest ? reports.find((report) => Number(getReportRequestId(report)) === Number(uploadRequest.id)) : null;
  const isCancelled = (request) => String(request?.status || "").toUpperCase() === "CANCELLED";
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
      setReasonDialog({ open: true, request, status: nextStatus, note: "" });
      return;
    }
    onStatusUpdate(request.id, nextStatus, request.expected_report_at || request.expectedReportAt || null, null);
  };

  const submitReason = async () => {
    if (!reasonDialog.request || !reasonDialog.status) return;
    const note = reasonDialog.note.trim();
    await onStatusUpdate(
      reasonDialog.request.id,
      reasonDialog.status,
      reasonDialog.request.expected_report_at || reasonDialog.request.expectedReportAt || null,
      note || null
    );
    setReasonDialog({ open: false, request: null, status: null, note: "" });
  };

  return (
    <>
      <SectionTitle title="Test Requests" description="Review patient test requests and update their processing status." />
      {updateFeedback?.message ? (
        <Alert severity={updateFeedback.type || "info"} sx={{ mb: 1.5, fontWeight: 600, borderRadius: 2 }}>
          {updateFeedback.message}
        </Alert>
      ) : null}
      <TableFilters {...filters} statusOptions={REQUEST_STATUSES} />
      <DataTable columns={["SNO", "PATIENT", "DOCTOR", "TESTS", "PRIORITY", "REPORT BY", "STATUS", "REASON", "UPDATE", "ACTION"]} loading={loading} emptyMessage="No test requests found." footer={<Pagination count={Math.max(1, Math.ceil(requests.length / pageSize))} page={page} onChange={(_, value) => onPageChange(value)} size="small" color="primary" />}>
        {visible.length ? visible.map((request, index) => <TableRow key={request.id} hover>
          <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{(page - 1) * pageSize + index + 1}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{request.patient_name || request.patient_id || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{request.doctor_name || request.doctor_id || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important", maxWidth: 260, whiteSpace: "normal" }}>{Array.isArray(request.requested_tests) ? request.requested_tests.join(", ") : request.requested_tests || "-"}</TableCell>
          <TableCell><Chip size="small" label={request.priority || "NORMAL"} color={request.priority === "URGENT" ? "error" : "default"} /></TableCell>
          <TableCell sx={{ minWidth: 190 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <TextField
                size="small"
                type="datetime-local"
                value={formatDateTimeInputValue(request.expected_report_at || request.expectedReportAt)}
                onChange={(event) => onStatusUpdate(request.id, request.status || "PENDING", event.target.value || null)}
                disabled={actionId === request.id || isCancelled(request)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180, maxWidth: 180, "& .MuiInputBase-input": { fontSize: "12px", py: 1 } }}
              />
              {actionId === request.id ? <CircularProgress size={16} thickness={5} sx={{ color: "#0b5c8e" }} /> : null}
            </Box>
          </TableCell>
          <TableCell><Chip size="small" label={request.status || "-"} color={request.status === "COMPLETED" ? "success" : request.status === "CANCELLED" ? "error" : request.status === "REJECTED" ? "error" : "info"} /></TableCell>
          <TableCell sx={{ color: "#64748b !important", maxWidth: 220, whiteSpace: "normal" }}>
            {(request.status === "REJECTED" || request.status === "CANCELLED") ? (request.latest_status_note || request.latestStatusNote || request.status_note || request.note || "No reason provided.") : "-"}
          </TableCell>
          <TableCell><Select size="small" value={request.status || "PENDING"} onChange={(event) => handleStatusChange(request, event.target.value)} disabled={actionId === request.id || isCancelled(request)} sx={{ minWidth: 170 }}><MenuItem value={request.status}>{request.status}</MenuItem>{REQUEST_STATUSES.filter((status) => status !== request.status).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}</Select></TableCell>
          <TableCell><IconButton size="small" onClick={(event) => openActions(event, request)} disabled={isCancelled(request)}><MoreVertIcon fontSize="small" /></IconButton></TableCell>
        </TableRow>) : null}
      </DataTable>
      <Menu anchorEl={actionAnchor} open={Boolean(actionAnchor)} onClose={closeActions}>
        <MenuItem onClick={openUpload} disabled={uploadRequest ? isCancelled(uploadRequest) : false}><UploadFileIcon fontSize="small" sx={{ mr: 1 }} />Upload Report</MenuItem>
        {selectedReport?.downloadUrl ? (
          <MenuItem component="a" href={selectedReport.downloadUrl} target="_blank" rel="noreferrer" onClick={closeActions}>
            <VisibilityOutlinedIcon fontSize="small" sx={{ mr: 1 }} />View Uploaded PDF
          </MenuItem>
        ) : null}
        {selectedReport ? (
          <MenuItem onClick={deleteReport} disabled={!selectedReport.canDelete}>
            <DeleteOutlineIcon fontSize="small" sx={{ mr: 1 }} />
            {selectedReport.canDelete ? "Delete PDF (within 15 min)" : "Delete unavailable after 15 min"}
          </MenuItem>
        ) : null}
      </Menu>
      <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={submitUpload}>
          <DialogTitle sx={{ color: "#123d66", fontWeight: 700 }}>Upload Report</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            <Typography sx={{ color: "#64748b" }}>Request #{uploadRequest?.id} - {uploadRequest?.patient_name || "Patient"}</Typography>
            {uploadError ? <Alert severity="error">{uploadError}</Alert> : null}
            <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} sx={{ justifyContent: "flex-start" }}>{file ? file.name : "Choose PDF file"}<input hidden type="file" accept="application/pdf,.pdf" onChange={(event) => {
              const selectedFile = event.target.files?.[0] || null;
              if (selectedFile && selectedFile.size > MAX_PDF_SIZE) {
                setFile(null);
                setUploadError("PDF file must be 10 MB or smaller.");
              } else {
                setFile(selectedFile);
                setUploadError("");
              }
            }} /></Button>
            <Typography variant="caption" color="text.secondary">PDF only, maximum size 10 MB.</Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>Cancel</Button><Button type="submit" variant="contained" disabled={uploading || !file}>{uploading ? "Uploading..." : "Upload Report"}</Button></DialogActions>
        </Box>
      </Dialog>

      <Dialog open={reasonDialog.open} onClose={() => !actionId && setReasonDialog({ open: false, request: null, status: null, note: "" })} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontSize: 18, fontWeight: 700, pb: 1.5 }}>{reasonDialog.status === "CANCELLED" ? "Cancel request" : "Reject request"}</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 1.25, pt: 1.5, px: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Please add a reason for {reasonDialog.status === "CANCELLED" ? "cancelling" : "rejecting"} this lab request.
          </Typography>
          <TextField
            multiline
            minRows={2}
            size="small"
            label="Reason / comment"
            value={reasonDialog.note}
            onChange={(event) => setReasonDialog((current) => ({ ...current, note: event.target.value }))}
            placeholder="Example: Sample was not collected on time."
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 1.5, pt: 1 }}>
          <Button onClick={() => setReasonDialog({ open: false, request: null, status: null, note: "" })} disabled={actionId === reasonDialog.request?.id} sx={{ textTransform: "none" }}>Close</Button>
          <Button
            variant="contained"
            color={reasonDialog.status === "CANCELLED" ? "error" : "warning"}
            onClick={submitReason}
            disabled={actionId === reasonDialog.request?.id}
            sx={{ textTransform: "none" }}
          >
            {actionId === reasonDialog.request?.id ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
