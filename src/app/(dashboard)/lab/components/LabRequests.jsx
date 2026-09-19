"use client";

import { useState } from "react";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Pagination, Select, TableCell, TableRow, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { DataTable, SectionTitle, TableFilters } from "./LabUi";

const REQUEST_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SAMPLE_COLLECTED", "PROCESSING", "REPORT_UPLOADED", "COMPLETED"];

export default function LabRequests({ requests, loading, filters, onFilter, page, pageSize, onPageChange, actionId, onStatusUpdate, uploading, onUploadReport }) {
  const [actionAnchor, setActionAnchor] = useState(null);
  const [uploadRequest, setUploadRequest] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const visible = requests.slice((page - 1) * pageSize, page * pageSize);
  const openActions = (event, request) => { setActionAnchor(event.currentTarget); setUploadRequest(request); };
  const closeActions = () => setActionAnchor(null);
  const openUpload = () => { setUploadDialogOpen(true); closeActions(); };
  const submitUpload = async (event) => {
    event.preventDefault();
    if (!file || !uploadRequest) return;
    await onUploadReport(uploadRequest.id, file);
    setFile(null);
    setUploadRequest(null);
    setUploadDialogOpen(false);
  };

  return (
    <>
      <SectionTitle title="Test Requests" description="Review patient test requests and update their processing status." />
      <TableFilters {...filters} statusOptions={REQUEST_STATUSES} />
      <DataTable columns={["PATIENT", "DOCTOR", "TESTS", "PRIORITY", "STATUS", "UPDATE", "ACTION"]} loading={loading} emptyMessage="No test requests found." footer={<Pagination count={Math.max(1, Math.ceil(requests.length / pageSize))} page={page} onChange={(_, value) => onPageChange(value)} size="small" color="primary" />}>
        {visible.length ? visible.map((request) => <TableRow key={request.id} hover>
          <TableCell sx={{ color: "#1f2937 !important", fontWeight: 600 }}>{request.patient_name || request.patient_id || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important" }}>{request.doctor_name || request.doctor_id || "-"}</TableCell>
          <TableCell sx={{ color: "#1f2937 !important", maxWidth: 260, whiteSpace: "normal" }}>{Array.isArray(request.requested_tests) ? request.requested_tests.join(", ") : request.requested_tests || "-"}</TableCell>
          <TableCell><Chip size="small" label={request.priority || "NORMAL"} color={request.priority === "URGENT" ? "error" : "default"} /></TableCell>
          <TableCell><Chip size="small" label={request.status || "-"} color={request.status === "COMPLETED" ? "success" : "info"} /></TableCell>
          <TableCell><Select size="small" value={request.status || "PENDING"} onChange={(event) => onStatusUpdate(request.id, event.target.value)} disabled={actionId === request.id} sx={{ minWidth: 170 }}><MenuItem value={request.status}>{request.status}</MenuItem>{REQUEST_STATUSES.filter((status) => status !== request.status).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}</Select></TableCell>
          <TableCell><IconButton size="small" onClick={(event) => openActions(event, request)}><MoreVertIcon fontSize="small" /></IconButton></TableCell>
        </TableRow>) : null}
      </DataTable>
      <Menu anchorEl={actionAnchor} open={Boolean(actionAnchor)} onClose={closeActions}><MenuItem onClick={openUpload}><UploadFileIcon fontSize="small" sx={{ mr: 1 }} />Upload Report</MenuItem></Menu>
      <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={submitUpload}>
          <DialogTitle sx={{ color: "#123d66", fontWeight: 700 }}>Upload Report</DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: "8px !important" }}>
            <Typography sx={{ color: "#64748b" }}>Request #{uploadRequest?.id} - {uploadRequest?.patient_name || "Patient"}</Typography>
            <Button component="label" variant="outlined" startIcon={<UploadFileIcon />} sx={{ justifyContent: "flex-start" }}>{file ? file.name : "Choose PDF file"}<input hidden type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} /></Button>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}><Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>Cancel</Button><Button type="submit" variant="contained" disabled={uploading || !file}>{uploading ? "Uploading..." : "Upload Report"}</Button></DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
